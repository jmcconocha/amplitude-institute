const express = require('express');
const bcrypt = require('bcryptjs');
const { getDatabase, dbType } = require('../database/adapter');

const router = express.Router();

// Get current user profile
router.get('/', async (req, res) => {
  try {
    const db = getDatabase();
    const userId = req.user.id;
    
    if (dbType === 'postgresql') {
      const client = await db.connect();
      const result = await client.query(
        'SELECT id, email, first_name, last_name, organization, registration_reason, created_at FROM users WHERE id = $1',
        [userId]
      );
      client.release();
      
      if (!result.rows[0]) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }
      
      res.json({
        success: true,
        user: result.rows[0]
      });
    } else {
      // SQLite version
      db.get(
        'SELECT id, email, first_name, last_name, organization, registration_reason, created_at FROM users WHERE id = ?',
        [userId],
        (err, user) => {
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
          
          res.json({
            success: true,
            user: user
          });
        }
      );
    }
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch profile'
    });
  }
});

// Update user profile (excluding email)
router.put('/', async (req, res) => {
  try {
    const { first_name, last_name, organization, registration_reason } = req.body;
    const userId = req.user.id;
    
    // Validation
    if (!first_name || !last_name) {
      return res.status(400).json({
        success: false,
        message: 'First name and last name are required'
      });
    }
    
    if (first_name.length < 2 || last_name.length < 2) {
      return res.status(400).json({
        success: false,
        message: 'First name and last name must be at least 2 characters'
      });
    }
    
    const db = getDatabase();
    
    if (dbType === 'postgresql') {
      const client = await db.connect();
      const result = await client.query(
        `UPDATE users 
         SET first_name = $1, last_name = $2, organization = $3, registration_reason = $4, updated_at = CURRENT_TIMESTAMP
         WHERE id = $5
         RETURNING id, email, first_name, last_name, organization, registration_reason`,
        [first_name, last_name, organization || null, registration_reason || null, userId]
      );
      client.release();
      
      if (!result.rows[0]) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }
      
      res.json({
        success: true,
        message: 'Profile updated successfully',
        user: result.rows[0]
      });
    } else {
      // SQLite version
      db.run(
        `UPDATE users 
         SET first_name = ?, last_name = ?, organization = ?, registration_reason = ?, updated_at = CURRENT_TIMESTAMP
         WHERE id = ?`,
        [first_name, last_name, organization || null, registration_reason || null, userId],
        function(err) {
          if (err) {
            console.error('Database error:', err);
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
          
          // Fetch updated user data
          db.get(
            'SELECT id, email, first_name, last_name, organization, registration_reason FROM users WHERE id = ?',
            [userId],
            (err, user) => {
              if (err) {
                console.error('Database error fetching updated user:', err);
                return res.status(500).json({
                  success: false,
                  message: 'Profile updated but failed to fetch updated data'
                });
              }
              
              res.json({
                success: true,
                message: 'Profile updated successfully',
                user: user
              });
            }
          );
        }
      );
    }
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update profile'
    });
  }
});

// Change password
router.put('/password', async (req, res) => {
  try {
    const { current_password, new_password, confirm_password } = req.body;
    const userId = req.user.id;
    
    // Validation
    if (!current_password || !new_password || !confirm_password) {
      return res.status(400).json({
        success: false,
        message: 'All password fields are required'
      });
    }
    
    if (new_password !== confirm_password) {
      return res.status(400).json({
        success: false,
        message: 'New password and confirmation do not match'
      });
    }
    
    if (new_password.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 8 characters long'
      });
    }
    
    // Password strength validation
    const hasUppercase = /[A-Z]/.test(new_password);
    const hasLowercase = /[a-z]/.test(new_password);
    const hasNumbers = /\d/.test(new_password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(new_password);
    
    if (!hasUppercase || !hasLowercase || !hasNumbers || !hasSpecialChar) {
      return res.status(400).json({
        success: false,
        message: 'Password must contain at least one uppercase letter, lowercase letter, number, and special character'
      });
    }
    
    const db = getDatabase();
    
    if (dbType === 'postgresql') {
      const client = await db.connect();
      
      // Get current password hash
      const userResult = await client.query(
        'SELECT password FROM users WHERE id = $1',
        [userId]
      );
      
      if (!userResult.rows[0]) {
        client.release();
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }
      
      // Verify current password
      const isCurrentPasswordValid = await bcrypt.compare(current_password, userResult.rows[0].password);
      if (!isCurrentPasswordValid) {
        client.release();
        return res.status(400).json({
          success: false,
          message: 'Current password is incorrect'
        });
      }
      
      // Hash new password and update
      const hashedNewPassword = await bcrypt.hash(new_password, 12);
      await client.query(
        'UPDATE users SET password = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
        [hashedNewPassword, userId]
      );
      
      client.release();
      
      res.json({
        success: true,
        message: 'Password updated successfully'
      });
    } else {
      // SQLite version
      db.get(
        'SELECT password FROM users WHERE id = ?',
        [userId],
        async (err, user) => {
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
          
          // Verify current password
          const isCurrentPasswordValid = await bcrypt.compare(current_password, user.password);
          if (!isCurrentPasswordValid) {
            return res.status(400).json({
              success: false,
              message: 'Current password is incorrect'
            });
          }
          
          // Hash new password and update
          const hashedNewPassword = await bcrypt.hash(new_password, 12);
          db.run(
            'UPDATE users SET password = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
            [hashedNewPassword, userId],
            function(err) {
              if (err) {
                console.error('Database error updating password:', err);
                return res.status(500).json({
                  success: false,
                  message: 'Failed to update password'
                });
              }
              
              res.json({
                success: true,
                message: 'Password updated successfully'
              });
            }
          );
        }
      );
    }
  } catch (error) {
    console.error('Password change error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to change password'
    });
  }
});

module.exports = router;