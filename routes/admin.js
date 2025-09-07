const express = require('express');
const router = express.Router();
const { getDatabase, dbType } = require('../database/adapter');
const { requireAuth, requireAdmin } = require('../middleware/auth');
const emailService = require('../services/email');

// All admin routes require authentication and admin role
router.use(requireAuth);
router.use(requireAdmin);

// Get all users with pagination
router.get('/users', async (req, res) => {
  try {
    const db = getDatabase();
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;
    const status = req.query.status || '';
    const search = req.query.search || '';

    let whereClause = 'WHERE 1=1';
    let queryParams = [];

    if (dbType === 'postgresql') {
      // PostgreSQL version
      let paramIndex = 1;
      
      if (status) {
        whereClause += ` AND status = $${paramIndex++}`;
        queryParams.push(status);
      }

      if (search) {
        whereClause += ` AND (first_name ILIKE $${paramIndex++} OR last_name ILIKE $${paramIndex++} OR email ILIKE $${paramIndex++} OR organization ILIKE $${paramIndex++})`;
        const searchTerm = `%${search}%`;
        queryParams.push(searchTerm, searchTerm, searchTerm, searchTerm);
      }

      const client = await db.connect();
      
      try {
        // Get total count
        const countResult = await client.query(`SELECT COUNT(*) as count FROM users ${whereClause}`, queryParams);
        const totalCount = parseInt(countResult.rows[0].count);

        // Get users with pagination
        const selectQuery = `
          SELECT 
            id, email, first_name, last_name, organization, role, status,
            registration_reason, created_at, approved_at, last_login,
            (SELECT first_name || ' ' || last_name FROM users u2 WHERE u2.id = users.approved_by) as approved_by_name
          FROM users 
          ${whereClause}
          ORDER BY created_at DESC 
          LIMIT $${paramIndex++} OFFSET $${paramIndex++}
        `;
        
        const usersResult = await client.query(selectQuery, [...queryParams, limit, offset]);
        
        res.json({
          success: true,
          data: {
            users: usersResult.rows,
            pagination: {
              page,
              limit,
              total: totalCount,
              pages: Math.ceil(totalCount / limit)
            }
          }
        });
      } finally {
        client.release();
      }
    } else {
      // SQLite version
      if (status) {
        whereClause += ' AND status = ?';
        queryParams.push(status);
      }

      if (search) {
        whereClause += ' AND (first_name LIKE ? OR last_name LIKE ? OR email LIKE ? OR organization LIKE ?)';
        const searchTerm = `%${search}%`;
        queryParams.push(searchTerm, searchTerm, searchTerm, searchTerm);
      }

      // Get total count
      db.get(`SELECT COUNT(*) as count FROM users ${whereClause}`, queryParams, (err, countResult) => {
        if (err) {
          console.error('Error counting users:', err);
          return res.status(500).json({
            success: false,
            message: 'Database error'
          });
        }

        // Get users with pagination
        const selectQuery = `
          SELECT 
            id, email, first_name, last_name, organization, role, status,
            registration_reason, created_at, approved_at, last_login,
            (SELECT first_name || ' ' || last_name FROM users u2 WHERE u2.id = users.approved_by) as approved_by_name
          FROM users 
          ${whereClause}
          ORDER BY created_at DESC 
          LIMIT ? OFFSET ?
        `;

        db.all(selectQuery, [...queryParams, limit, offset], (err, users) => {
          if (err) {
            console.error('Error fetching users:', err);
            return res.status(500).json({
              success: false,
              message: 'Database error'
            });
          }

          res.json({
            success: true,
            data: {
              users,
              pagination: {
                page,
                limit,
                total: countResult.count,
                pages: Math.ceil(countResult.count / limit)
              }
            }
          });
        });
      });
    }
  } catch (error) {
    console.error('Error in /users route:', error);
    res.status(500).json({
      success: false,
      message: 'Database error'
    });
  }
});

// Get pending registration requests
router.get('/registration-requests', async (req, res) => {
  const db = getDatabase();
  
  const query = `
    SELECT 
      u.id, u.email, u.first_name, u.last_name, u.organization, 
      u.registration_reason, u.created_at,
      rr.status as request_status, rr.admin_notes, rr.created_at as request_date
    FROM users u
    LEFT JOIN registration_requests rr ON u.id = rr.user_id
    WHERE u.status = 'pending'
    ORDER BY u.created_at DESC
  `;

  if (dbType === 'postgresql') {
    const client = await db.connect();
    
    try {
      const result = await client.query(query);
      
      res.json({
        success: true,
        data: result.rows
      });
    } catch (err) {
      console.error('Error fetching registration requests:', err);
      res.status(500).json({
        success: false,
        message: 'Database error'
      });
    } finally {
      client.release();
    }
  } else {
    // SQLite version
    db.all(query, [], (err, requests) => {
      if (err) {
        console.error('Error fetching registration requests:', err);
        return res.status(500).json({
          success: false,
          message: 'Database error'
        });
      }

      res.json({
        success: true,
        data: requests
      });
    });
  }
});

// Approve user registration
router.post('/users/:id/approve', async (req, res) => {
  const userId = parseInt(req.params.id);
  const { notes } = req.body;
  const db = getDatabase();

  if (dbType === 'postgresql') {
    const client = await db.connect();
    
    try {
      // Get user details first
      const userResult = await client.query('SELECT * FROM users WHERE id = $1', [userId]);
      const user = userResult.rows[0];
      
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      if (user.status !== 'pending') {
        return res.status(400).json({
          success: false,
          message: 'User is not pending approval'
        });
      }

      // Update user status
      await client.query(`
        UPDATE users 
        SET status = 'approved', approved_at = CURRENT_TIMESTAMP, approved_by = $1
        WHERE id = $2
      `, [req.user.id, userId]);

      // Update registration request
      await client.query(`
        UPDATE registration_requests 
        SET status = 'approved', processed_at = CURRENT_TIMESTAMP, 
            processed_by = $1, admin_notes = $2
        WHERE user_id = $3
      `, [req.user.id, notes, userId]);

      // Send approval email
      try {
        await emailService.sendApprovalNotification(
          user.email, 
          `${user.first_name} ${user.last_name}`
        );
      } catch (emailError) {
        console.error('Failed to send approval email:', emailError);
      }

      res.json({
        success: true,
        message: 'User approved successfully'
      });
    } catch (err) {
      console.error('Error approving user:', err);
      res.status(500).json({
        success: false,
        message: 'Database error'
      });
    } finally {
      client.release();
    }
  } else {
    // SQLite version
    db.get('SELECT * FROM users WHERE id = ?', [userId], async (err, user) => {
      if (err) {
        console.error('Error finding user:', err);
        return res.status(500).json({
          success: false,
          message: 'Database error'
        });
      }

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      if (user.status !== 'pending') {
        return res.status(400).json({
          success: false,
          message: 'User is not pending approval'
        });
      }

      // Update user status
      db.run(`
        UPDATE users 
        SET status = 'approved', approved_at = CURRENT_TIMESTAMP, approved_by = ?
        WHERE id = ?
      `, [req.user.id, userId], function(err) {
        if (err) {
          console.error('Error approving user:', err);
          return res.status(500).json({
            success: false,
            message: 'Error approving user'
          });
        }

        // Update registration request
        db.run(`
          UPDATE registration_requests 
          SET status = 'approved', processed_at = CURRENT_TIMESTAMP, 
              processed_by = ?, admin_notes = ?
          WHERE user_id = ?
        `, [req.user.id, notes, userId], async (err) => {
          if (err) {
            console.error('Error updating registration request:', err);
          }

          // Send approval email
          try {
            await emailService.sendApprovalNotification(
              user.email, 
              `${user.first_name} ${user.last_name}`
            );
          } catch (emailError) {
            console.error('Failed to send approval email:', emailError);
          }

          res.json({
            success: true,
            message: 'User approved successfully'
          });
        });
      });
    });
  }
});

// Deny user registration
router.post('/users/:id/deny', async (req, res) => {
  const userId = parseInt(req.params.id);
  const { reason, notes } = req.body;
  const db = getDatabase();

  if (dbType === 'postgresql') {
    const client = await db.connect();
    
    try {
      // Get user details first
      const userResult = await client.query('SELECT * FROM users WHERE id = $1', [userId]);
      const user = userResult.rows[0];
      
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      if (user.status !== 'pending') {
        return res.status(400).json({
          success: false,
          message: 'User is not pending approval'
        });
      }

      // Update user status
      await client.query(`
        UPDATE users 
        SET status = 'blocked'
        WHERE id = $1
      `, [userId]);

      // Update registration request
      await client.query(`
        UPDATE registration_requests 
        SET status = 'denied', processed_at = CURRENT_TIMESTAMP, 
            processed_by = $1, admin_notes = $2
        WHERE user_id = $3
      `, [req.user.id, notes, userId]);

      // Send denial email
      try {
        await emailService.sendDenialNotification(
          user.email, 
          `${user.first_name} ${user.last_name}`,
          reason
        );
      } catch (emailError) {
        console.error('Failed to send denial email:', emailError);
      }

      res.json({
        success: true,
        message: 'User registration denied'
      });
    } catch (err) {
      console.error('Error denying user:', err);
      res.status(500).json({
        success: false,
        message: 'Database error'
      });
    } finally {
      client.release();
    }
  } else {
    // SQLite version
    db.get('SELECT * FROM users WHERE id = ?', [userId], async (err, user) => {
      if (err) {
        console.error('Error finding user:', err);
        return res.status(500).json({
          success: false,
          message: 'Database error'
        });
      }

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      if (user.status !== 'pending') {
        return res.status(400).json({
          success: false,
          message: 'User is not pending approval'
        });
      }

      // Update user status
      db.run(`
        UPDATE users 
        SET status = 'blocked'
        WHERE id = ?
      `, [userId], function(err) {
        if (err) {
          console.error('Error denying user:', err);
          return res.status(500).json({
            success: false,
            message: 'Error denying user'
          });
        }

        // Update registration request
        db.run(`
          UPDATE registration_requests 
          SET status = 'denied', processed_at = CURRENT_TIMESTAMP, 
              processed_by = ?, admin_notes = ?
          WHERE user_id = ?
        `, [req.user.id, notes, userId], async (err) => {
          if (err) {
            console.error('Error updating registration request:', err);
          }

          // Send denial email
          try {
            await emailService.sendDenialNotification(
              user.email, 
              `${user.first_name} ${user.last_name}`,
              reason
            );
          } catch (emailError) {
            console.error('Failed to send denial email:', emailError);
          }

          res.json({
            success: true,
            message: 'User registration denied'
          });
        });
      });
    });
  }
});

// Block/Unblock user
router.post('/users/:id/block', async (req, res) => {
  const userId = parseInt(req.params.id);
  const { block } = req.body; // true to block, false to unblock
  const db = getDatabase();

  const newStatus = block ? 'blocked' : 'approved';
  
  if (dbType === 'postgresql') {
    const client = await db.connect();
    
    try {
      const result = await client.query(`
        UPDATE users 
        SET status = $1
        WHERE id = $2 AND id != $3
      `, [newStatus, userId, req.user.id]);

      if (result.rowCount === 0) {
        return res.status(404).json({
          success: false,
          message: 'User not found or cannot modify own account'
        });
      }

      res.json({
        success: true,
        message: `User ${block ? 'blocked' : 'unblocked'} successfully`
      });
    } catch (err) {
      console.error('Error updating user status:', err);
      res.status(500).json({
        success: false,
        message: 'Database error'
      });
    } finally {
      client.release();
    }
  } else {
    // SQLite version
    db.run(`
      UPDATE users 
      SET status = ?
      WHERE id = ? AND id != ?
    `, [newStatus, userId, req.user.id], function(err) {
      if (err) {
        console.error('Error updating user status:', err);
        return res.status(500).json({
          success: false,
          message: 'Database error'
        });
      }

      if (this.changes === 0) {
        return res.status(404).json({
          success: false,
          message: 'User not found or cannot modify own account'
        });
      }

      res.json({
        success: true,
        message: `User ${block ? 'blocked' : 'unblocked'} successfully`
      });
    });
  }
});

// Get dashboard statistics
router.get('/stats', async (req, res) => {
  try {
    const db = getDatabase();
    
    if (dbType === 'postgresql') {
      const queries = [
        'SELECT COUNT(*) as total FROM users',
        'SELECT COUNT(*) as pending FROM users WHERE status = $1',
        'SELECT COUNT(*) as approved FROM users WHERE status = $1',
        'SELECT COUNT(*) as blocked FROM users WHERE status = $1',
        'SELECT COUNT(*) as admins FROM users WHERE role = $1',
        'SELECT COUNT(*) as today FROM users WHERE DATE(created_at) = CURRENT_DATE'
      ];

      const client = await db.connect();
      
      try {
        const results = await Promise.all([
          client.query(queries[0]),
          client.query(queries[1], ['pending']),
          client.query(queries[2], ['approved']),
          client.query(queries[3], ['blocked']),
          client.query(queries[4], ['admin']),
          client.query(queries[5])
        ]);

        res.json({
          success: true,
          data: {
            totalUsers: parseInt(results[0].rows[0].total),
            pendingUsers: parseInt(results[1].rows[0].pending),
            approvedUsers: parseInt(results[2].rows[0].approved),
            blockedUsers: parseInt(results[3].rows[0].blocked),
            adminUsers: parseInt(results[4].rows[0].admins),
            todayRegistrations: parseInt(results[5].rows[0].today)
          }
        });
      } finally {
        client.release();
      }
    } else {
      // SQLite version
      const queries = [
        'SELECT COUNT(*) as total FROM users',
        'SELECT COUNT(*) as pending FROM users WHERE status = "pending"',
        'SELECT COUNT(*) as approved FROM users WHERE status = "approved"',
        'SELECT COUNT(*) as blocked FROM users WHERE status = "blocked"',
        'SELECT COUNT(*) as admins FROM users WHERE role = "admin"',
        'SELECT COUNT(*) as today FROM users WHERE date(created_at) = date("now")'
      ];

      Promise.all(queries.map(query => 
        new Promise((resolve, reject) => {
          db.get(query, [], (err, result) => {
            if (err) reject(err);
            else resolve(Object.values(result)[0]);
          });
        })
      )).then(results => {
        res.json({
          success: true,
          data: {
            totalUsers: results[0],
            pendingUsers: results[1],
            approvedUsers: results[2],
            blockedUsers: results[3],
            adminUsers: results[4],
            todayRegistrations: results[5]
          }
        });
      }).catch(error => {
        console.error('Error fetching stats:', error);
        res.status(500).json({
          success: false,
          message: 'Database error'
        });
      });
    }
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({
      success: false,
      message: 'Database error'
    });
  }
});

// Delete user permanently
router.delete('/users/:id', async (req, res) => {
  const userId = parseInt(req.params.id);
  const db = getDatabase();

  if (dbType === 'postgresql') {
    const client = await db.connect();
    
    try {
      // Check if user exists and is not an admin
      const userResult = await client.query('SELECT role FROM users WHERE id = $1', [userId]);
      const user = userResult.rows[0];
      
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      if (user.role === 'admin') {
        return res.status(400).json({
          success: false,
          message: 'Cannot delete admin users'
        });
      }

      if (userId === req.user.id) {
        return res.status(400).json({
          success: false,
          message: 'Cannot delete your own account'
        });
      }

      // Delete user (cascading will handle registration_requests and sessions)
      const deleteResult = await client.query('DELETE FROM users WHERE id = $1', [userId]);

      if (deleteResult.rowCount === 0) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      res.json({
        success: true,
        message: 'User deleted successfully'
      });
    } catch (err) {
      console.error('Error deleting user:', err);
      res.status(500).json({
        success: false,
        message: 'Database error'
      });
    } finally {
      client.release();
    }
  } else {
    // SQLite version
    db.get('SELECT role FROM users WHERE id = ?', [userId], (err, user) => {
      if (err) {
        console.error('Error finding user:', err);
        return res.status(500).json({
          success: false,
          message: 'Database error'
        });
      }

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      if (user.role === 'admin') {
        return res.status(400).json({
          success: false,
          message: 'Cannot delete admin users'
        });
      }

      if (userId === req.user.id) {
        return res.status(400).json({
          success: false,
          message: 'Cannot delete your own account'
        });
      }

      // Delete user
      db.run('DELETE FROM users WHERE id = ?', [userId], function(err) {
        if (err) {
          console.error('Error deleting user:', err);
          return res.status(500).json({
            success: false,
            message: 'Database error'
          });
        }

        if (this.changes === 0) {
          return res.status(404).json({
            success: false,
            message: 'User not found'
          });
        }

        res.json({
          success: true,
          message: 'User deleted successfully'
        });
      });
    });
  }
});

// Grant admin privileges
router.post('/users/:id/grant-admin', async (req, res) => {
  const userId = parseInt(req.params.id);
  const db = getDatabase();

  if (dbType === 'postgresql') {
    // PostgreSQL version
    const client = await db.connect();

    try {
      // Check if user exists
      const userResult = await client.query('SELECT id, email, first_name, last_name, role FROM users WHERE id = $1', [userId]);
      
      if (userResult.rows.length === 0) {
        client.release();
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      const user = userResult.rows[0];
      
      if (user.role === 'admin') {
        client.release();
        return res.status(400).json({
          success: false,
          message: 'User is already an admin'
        });
      }

      // Update user role to admin
      await client.query('UPDATE users SET role = $1 WHERE id = $2', ['admin', userId]);
      client.release();

      console.log(`👑 Admin privileges granted to user: ${user.email} by admin: ${req.user.email}`);

      res.json({
        success: true,
        message: `Admin privileges granted to ${user.first_name} ${user.last_name}`
      });
    } catch (err) {
      client.release();
      console.error('Database error granting admin:', err);
      res.status(500).json({
        success: false,
        message: 'Database error'
      });
    }
  } else {
    // SQLite version
    db.get('SELECT id, email, first_name, last_name, role FROM users WHERE id = ?', [userId], (err, user) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({
          success: false,
          message: 'Database error'
        });
      }

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      if (user.role === 'admin') {
        return res.status(400).json({
          success: false,
          message: 'User is already an admin'
        });
      }

      // Update user role to admin
      db.run('UPDATE users SET role = ? WHERE id = ?', ['admin', userId], function(err) {
        if (err) {
          console.error('Error granting admin privileges:', err);
          return res.status(500).json({
            success: false,
            message: 'Error granting admin privileges'
          });
        }

        console.log(`👑 Admin privileges granted to user: ${user.email} by admin: ${req.user.email}`);

        res.json({
          success: true,
          message: `Admin privileges granted to ${user.first_name} ${user.last_name}`
        });
      });
    });
  }
});

// Revoke admin privileges
router.post('/users/:id/revoke-admin', async (req, res) => {
  const userId = parseInt(req.params.id);
  const db = getDatabase();

  // Prevent revoking admin from the primary admin account (assuming it's ID 1)
  if (userId === 1) {
    return res.status(403).json({
      success: false,
      message: 'Cannot revoke admin privileges from the primary admin account'
    });
  }

  // Prevent admins from revoking their own privileges
  if (userId === req.user.id) {
    return res.status(403).json({
      success: false,
      message: 'You cannot revoke your own admin privileges'
    });
  }

  if (dbType === 'postgresql') {
    // PostgreSQL version
    const client = await db.connect();

    try {
      // Check if user exists
      const userResult = await client.query('SELECT id, email, first_name, last_name, role FROM users WHERE id = $1', [userId]);
      
      if (userResult.rows.length === 0) {
        client.release();
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      const user = userResult.rows[0];
      
      if (user.role !== 'admin') {
        client.release();
        return res.status(400).json({
          success: false,
          message: 'User is not an admin'
        });
      }

      // Update user role to user
      await client.query('UPDATE users SET role = $1 WHERE id = $2', ['user', userId]);
      client.release();

      console.log(`🔻 Admin privileges revoked from user: ${user.email} by admin: ${req.user.email}`);

      res.json({
        success: true,
        message: `Admin privileges revoked from ${user.first_name} ${user.last_name}`
      });
    } catch (err) {
      client.release();
      console.error('Database error revoking admin:', err);
      res.status(500).json({
        success: false,
        message: 'Database error'
      });
    }
  } else {
    // SQLite version
    db.get('SELECT id, email, first_name, last_name, role FROM users WHERE id = ?', [userId], (err, user) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({
          success: false,
          message: 'Database error'
        });
      }

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      if (user.role !== 'admin') {
        return res.status(400).json({
          success: false,
          message: 'User is not an admin'
        });
      }

      // Update user role to user
      db.run('UPDATE users SET role = ? WHERE id = ?', ['user', userId], function(err) {
        if (err) {
          console.error('Error revoking admin privileges:', err);
          return res.status(500).json({
            success: false,
            message: 'Error revoking admin privileges'
          });
        }

        console.log(`🔻 Admin privileges revoked from user: ${user.email} by admin: ${req.user.email}`);

        res.json({
          success: true,
          message: `Admin privileges revoked from ${user.first_name} ${user.last_name}`
        });
      });
    });
  }
});

module.exports = router;