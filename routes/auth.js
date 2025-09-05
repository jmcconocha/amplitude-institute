const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const { getDatabase } = require('../database/adapter');
const emailService = require('../services/email');
const { optionalAuth } = require('../middleware/auth');

// Registration endpoint
router.post('/register', [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 8 }).matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/),
  body('first_name').trim().isLength({ min: 1, max: 50 }),
  body('last_name').trim().isLength({ min: 1, max: 50 }),
  body('organization').optional().trim().isLength({ max: 100 }),
  body('registration_reason').optional().trim().isLength({ max: 500 })
], async (req, res) => {
  try {
    // Validate input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { email, password, first_name, last_name, organization, registration_reason } = req.body;
    const db = getDatabase();

    // Check if user already exists
    db.get('SELECT email FROM users WHERE email = ?', [email], async (err, existingUser) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({
          success: false,
          message: 'Database error'
        });
      }

      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'User with this email already exists'
        });
      }

      try {
        // Hash password
        const passwordHash = await bcrypt.hash(password, 12);

        // Insert new user
        db.run(`
          INSERT INTO users (email, password_hash, first_name, last_name, organization, registration_reason, status)
          VALUES (?, ?, ?, ?, ?, ?, 'pending')
        `, [email, passwordHash, first_name, last_name, organization, registration_reason], function(err) {
          if (err) {
            console.error('Error creating user:', err);
            return res.status(500).json({
              success: false,
              message: 'Error creating user account'
            });
          }

          const userId = this.lastID;

          // Create registration request record
          db.run(`
            INSERT INTO registration_requests (user_id, status)
            VALUES (?, 'pending')
          `, [userId], async (err) => {
            if (err) {
              console.error('Error creating registration request:', err);
            }

            // Send email notification to admin
            try {
              await emailService.sendRegistrationNotification({
                email, first_name, last_name, organization, registration_reason
              });
            } catch (emailError) {
              console.error('Email notification failed:', emailError);
              // Don't fail registration if email fails
            }

            res.status(201).json({
              success: true,
              message: 'Registration successful! Your account is pending approval. You will receive an email notification once approved.'
            });
          });
        });
      } catch (hashError) {
        console.error('Password hashing error:', hashError);
        res.status(500).json({
          success: false,
          message: 'Error processing registration'
        });
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Login endpoint
router.post('/login', [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty()
], (req, res) => {
  try {
    // Validate input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email or password format'
      });
    }

    const { email, password } = req.body;
    const db = getDatabase();

    // Find user
    db.get(
      'SELECT id, email, password_hash, first_name, last_name, role, status FROM users WHERE email = ?',
      [email],
      async (err, user) => {
        if (err) {
          console.error('Database error:', err);
          return res.status(500).json({
            success: false,
            message: 'Database error'
          });
        }

        if (!user) {
          return res.status(401).json({
            success: false,
            message: 'Invalid email or password'
          });
        }

        // Check if user is approved
        if (user.status !== 'approved') {
          return res.status(403).json({
            success: false,
            message: 'Account is pending approval or has been blocked'
          });
        }

        try {
          // Verify password
          const isValidPassword = await bcrypt.compare(password, user.password_hash);
          
          if (!isValidPassword) {
            return res.status(401).json({
              success: false,
              message: 'Invalid email or password'
            });
          }

          // Generate JWT token
          const token = jwt.sign(
            { 
              userId: user.id,
              email: user.email,
              role: user.role
            },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
          );

          // Set secure cookie
          res.cookie('auth_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
          });

          // Update last login
          db.run(
            'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?',
            [user.id]
          );

          res.json({
            success: true,
            message: 'Login successful',
            user: {
              id: user.id,
              email: user.email,
              first_name: user.first_name,
              last_name: user.last_name,
              role: user.role
            }
          });
        } catch (bcryptError) {
          console.error('Password comparison error:', bcryptError);
          res.status(500).json({
            success: false,
            message: 'Authentication error'
          });
        }
      }
    );
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Logout endpoint
router.post('/logout', (req, res) => {
  res.clearCookie('auth_token');
  res.json({
    success: true,
    message: 'Logged out successfully'
  });
});

// Check authentication status
router.get('/me', optionalAuth, (req, res) => {
  if (req.user) {
    res.json({
      success: true,
      authenticated: true,
      user: {
        id: req.user.id,
        email: req.user.email,
        first_name: req.user.first_name,
        last_name: req.user.last_name,
        role: req.user.role
      }
    });
  } else {
    res.json({
      success: true,
      authenticated: false,
      user: null
    });
  }
});

module.exports = router;