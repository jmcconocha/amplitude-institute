const jwt = require('jsonwebtoken');
const { getDatabase } = require('../database/init');

// Middleware to check if user is authenticated
function requireAuth(req, res, next) {
  const token = req.cookies.auth_token;
  
  if (!token) {
    // Redirect to login page for HTML requests
    if (req.accepts('html')) {
      return res.redirect('/login');
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
    
    // Check if user still exists and is approved
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
            return res.redirect('/login');
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
  } catch (error) {
    console.error('JWT verification error:', error);
    res.clearCookie('auth_token');
    
    if (req.accepts('html')) {
      return res.redirect('/login');
    }
    return res.status(401).json({ 
      success: false, 
      message: 'Invalid token' 
    });
  }
}

// Middleware to check if user is admin
function requireAdmin(req, res, next) {
  if (!req.user || req.user.role !== 'admin') {
    if (req.accepts('html')) {
      return res.status(403).send(`
        <!DOCTYPE html>
        <html>
        <head><title>Access Denied</title></head>
        <body>
          <h1>Access Denied</h1>
          <p>You do not have permission to access this resource.</p>
          <a href="/">Return to Home</a>
        </body>
        </html>
      `);
    }
    return res.status(403).json({ 
      success: false, 
      message: 'Access denied. Admin privileges required.' 
    });
  }
  next();
}

// Middleware to optionally check auth (doesn't redirect if not authenticated)
function optionalAuth(req, res, next) {
  const token = req.cookies.auth_token;
  
  if (!token) {
    req.user = null;
    return next();
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const db = getDatabase();
    
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