const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const authMiddleware = require('./middleware/auth');
const { initDatabase } = require('./database/adapter');

const app = express();
const PORT = process.env.PORT || 3000;

// Trust proxy for Render deployment
app.set('trust proxy', 1);

// Initialize database
initDatabase();

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://cdnjs.cloudflare.com", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com", "https://cdnjs.cloudflare.com"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'"]
    }
  }
}));

app.use(cors({
  origin: process.env.NODE_ENV === 'production' ? [
    'https://www.amplitudeinstitute.com',
    'https://amplitudeinstitute.com',
    'https://amplitude-institute1.onrender.com'
  ] : 'http://localhost:3000',
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use(limiter);

// Stricter rate limiting for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // limit each IP to 20 auth requests per windowMs
  message: 'Too many authentication attempts, please try again later.'
});

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// API routes
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/admin', authMiddleware.requireAuth, authMiddleware.requireAdmin, adminRoutes);

// Public routes (no authentication required)
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});
app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'register.html'));
});

// Protected admin routes (must come before static middleware)
app.get('/admin*', authMiddleware.requireAuth, authMiddleware.requireAdmin, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

// Static assets (CSS, JS, images) - no authentication required  
// CRITICAL: Exclude index.html to prevent auth bypass
app.use(express.static(path.join(__dirname, 'public'), {
  setHeaders: (res, path) => {
    // Set proper MIME types for static assets
    if (path.endsWith('.css')) {
      res.setHeader('Content-Type', 'text/css');
    }
    if (path.endsWith('.js')) {
      res.setHeader('Content-Type', 'application/javascript');
    }
  },
  // Exclude HTML files from static serving to force auth middleware
  index: false,
  // Additional filter to prevent any HTML file from being served directly
  redirect: false
}));

// Protected fallback for HTML pages only
app.use((req, res, next) => {
  // Only apply auth middleware to HTML requests, not static assets
  if (req.path.endsWith('.css') || req.path.endsWith('.js') || req.path.endsWith('.png') || req.path.endsWith('.jpg') || req.path.endsWith('.ico')) {
    return next();
  }
  return authMiddleware.requireAuth(req, res, next);
});

// Fallback for protected routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Server error:', error);
  res.status(500).json({ 
    success: false, 
    message: 'Internal server error' 
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    success: false, 
    message: 'Route not found' 
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📧 Admin email: ${process.env.ADMIN_EMAIL}`);
  console.log(`🔐 Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;