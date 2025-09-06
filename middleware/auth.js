const jwt = require('jsonwebtoken');
const { getDatabase, dbType } = require('../database/adapter');

// Middleware to check if user is authenticated
async function requireAuth(req, res, next) {
  const token = req.cookies.auth_token;
  
  if (!token) {
    // Redirect to login page for HTML requests
    if (req.accepts('html')) {
      const redirectTo = encodeURIComponent(req.originalUrl);
      return res.redirect(`/login?redirect=${redirectTo}`);
    }
    // Return JSON for API requests
    return res.status(401).json({ 
      success: false, 
      message: 'Access denied. No token provided.' 
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const db = getDatabase();
    
    if (dbType === 'postgresql') {
      // PostgreSQL version
      try {
        const client = await db.connect();
        const result = await client.query(
          'SELECT id, email, role, status, first_name, last_name FROM users WHERE id = $1 AND status = $2',
          [decoded.userId, 'approved']
        );
        const user = result.rows[0];
        
        if (!user) {
          res.clearCookie('auth_token');
          client.release();
          if (req.accepts('html')) {
            const redirectTo = encodeURIComponent(req.originalUrl);
            return res.redirect(`/login?redirect=${redirectTo}`);
          }
          return res.status(401).json({ 
            success: false, 
            message: 'Invalid token or user not approved' 
          });
        }
        
        // Update last accessed time
        await client.query(
          'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = $1',
          [user.id]
        );
        
        client.release();
        req.user = user;
        next();
      } catch (err) {
        console.error('Database error in auth middleware:', err);
        return res.status(500).json({ 
          success: false, 
          message: 'Database error' 
        });
      }
    } else {
      // SQLite version
      db.get(
        'SELECT id, email, role, status, first_name, last_name FROM users WHERE id = ? AND status = ?',
        [decoded.userId, 'approved'],
        (err, user) => {
          if (err) {
            console.error('Database error in auth middleware:', err);
            return res.status(500).json({ 
              success: false, 
              message: 'Database error' 
            });
          }
          
          if (!user) {
            // Clear invalid cookie
            res.clearCookie('auth_token');
            if (req.accepts('html')) {
              const redirectTo = encodeURIComponent(req.originalUrl);
              return res.redirect(`/login?redirect=${redirectTo}`);
            }
            return res.status(401).json({ 
              success: false, 
              message: 'Invalid token or user not approved' 
            });
          }
          
          // Update last accessed time
          db.run(
            'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?',
            [user.id]
          );
          
          // Add user to request object
          req.user = user;
          next();
        }
      );
    }
  } catch (error) {
    console.error('JWT verification error:', error);
    res.clearCookie('auth_token');
    
    if (req.accepts('html')) {
      const redirectTo = encodeURIComponent(req.originalUrl);
      return res.redirect(`/login?redirect=${redirectTo}`);
    }
    return res.status(401).json({ 
      success: false, 
      message: 'Invalid token' 
    });
  }
}

// Middleware to check if user is admin
function requireAdmin(req, res, next) {
  console.log('requireAdmin middleware - user:', req.user ? `${req.user.email} (role: ${req.user.role})` : 'none');
  
  if (!req.user || req.user.role !== 'admin') {
    console.log('Admin access denied - redirecting to home');
    if (req.accepts('html')) {
      return res.redirect('/?error=admin_required');
    }
    return res.status(403).json({ 
      success: false, 
      message: 'Access denied. Admin privileges required.' 
    });
  }
  console.log('Admin access granted');
  next();
}

// Middleware to optionally check auth (doesn't redirect if not authenticated)
async function optionalAuth(req, res, next) {
  const token = req.cookies.auth_token;
  
  if (!token) {
    req.user = null;
    return next();
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const db = getDatabase();
    
    if (dbType === 'postgresql') {
      // PostgreSQL version
      try {
        const client = await db.connect();
        const result = await client.query(
          'SELECT id, email, role, status, first_name, last_name FROM users WHERE id = $1 AND status = $2',
          [decoded.userId, 'approved']
        );
        const user = result.rows[0];
        if (!user) {
          res.clearCookie('auth_token');
          req.user = null;
        } else {
          req.user = user;
        }
        client.release();
        next();
      } catch (err) {
        res.clearCookie('auth_token');
        req.user = null;
        next();
      }
    } else {
      // SQLite version
      db.get(
        'SELECT id, email, role, status, first_name, last_name FROM users WHERE id = ? AND status = ?',
        [decoded.userId, 'approved'],
        (err, user) => {
          if (err || !user) {
            res.clearCookie('auth_token');
            req.user = null;
          } else {
            req.user = user;
          }
          next();
        }
      );
    }
  } catch (error) {
    res.clearCookie('auth_token');
    req.user = null;
    next();
  }
}

module.exports = {
  requireAuth,
  requireAdmin,
  optionalAuth
};