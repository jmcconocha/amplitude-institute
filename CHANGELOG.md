# Changelog

All notable changes to The Amplitude Institute website will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.0] - 2025-09-05

### Added - Complete Authentication System

#### 🔐 Authentication & Security
- **JWT Authentication**: Secure token-based authentication with HTTP-only cookies
- **User Registration**: Self-service registration with admin approval workflow
- **Admin Panel**: Complete user management dashboard at `/admin`
- **Role-based Access Control**: Admin and user roles with different permissions
- **Session Management**: Secure login/logout with session persistence
- **Password Security**: Bcrypt hashing with complexity requirements (8+ chars, mixed case, numbers, symbols)
- **Rate Limiting**: Protection against brute force attacks (5 auth attempts per 15 minutes)
- **Input Validation**: Express-validator with comprehensive validation rules

#### 📧 Email Notification System
- **Registration Notifications**: Admin receives email when users register
- **Approval Notifications**: Users receive email when registration is approved
- **Denial Notifications**: Users receive email when registration is denied
- **SMTP Integration**: Nodemailer with support for Gmail, SendGrid, Mailgun
- **HTML Email Templates**: Professional email formatting with branding

#### 👤 User Management
- **Admin Dashboard**: Statistics, user lists, and management controls
- **User Approval Workflow**: Admin can approve, deny, block, or unblock users
- **User Status Tracking**: Pending, approved, blocked user states
- **Registration Reasons**: Optional field for users to explain their interest
- **Admin Notes**: Administrators can add notes when processing registrations

#### 🗄️ Database System
- **Dual Database Support**: SQLite for development, PostgreSQL for production
- **Automatic Database Setup**: Tables and admin user created on first run
- **Data Persistence**: User accounts, registration requests, and session data
- **Migration Support**: Seamless switching between database types
- **Referential Integrity**: Foreign key relationships and constraints

#### 🎨 User Interface
- **Login Page**: Clean, responsive login form with validation
- **Registration Page**: Comprehensive registration with real-time validation
- **Admin Panel**: Modern dashboard with user statistics and management
- **Responsive Design**: Mobile-first approach works on all devices
- **Toast Notifications**: Real-time feedback for user actions
- **Loading States**: Visual feedback during form submissions

#### 🛡️ Security Features
- **Helmet.js Integration**: Security headers (XSS, CSRF, content type protection)
- **CORS Protection**: Configurable cross-origin resource sharing
- **Environment Variables**: Secure configuration management
- **SQL Injection Protection**: Parameterized queries and ORM-style operations
- **Session Security**: Secure, HttpOnly cookies with expiration

#### 🚀 Deployment & Infrastructure
- **Render.com Support**: Full compatibility with Render's free tier
- **PostgreSQL Integration**: Free Render PostgreSQL database (1GB, persistent)
- **Auto-deployment**: GitHub integration with automatic deployments
- **Environment Configuration**: Automatic environment variable setup
- **Zero-Configuration**: Works out-of-the-box with render.yaml blueprint

### Changed - Site Architecture

#### 🔄 Architecture Transformation
- **Static to Dynamic**: Converted from static HTML site to Express.js application
- **Protected Content**: All main site content now requires authentication
- **Public Pages**: Login, register, and admin pages accessible without auth
- **Route Protection**: Middleware-based authentication for all protected routes

#### 📁 File Structure Reorganization
- Added `routes/` directory for API endpoints (auth, admin)
- Added `middleware/` directory for authentication middleware
- Added `services/` directory for business logic (email service)
- Added `database/` directory for database setup and management
- Moved static files to `public/` directory
- Added comprehensive `package.json` with all dependencies

#### 🔧 Configuration Updates
- Updated `render.yaml` for Node.js deployment with PostgreSQL
- Enhanced `.env.example` with all required environment variables
- Added database adapter for SQLite/PostgreSQL compatibility
- Updated Docker configuration for development environment

### Security

#### 🔒 Security Enhancements
- All passwords hashed with bcrypt (cost factor 12)
- JWT secrets auto-generated in production
- Rate limiting on all endpoints (stricter for auth)
- Input sanitization and validation on all forms
- Protection against common web vulnerabilities (XSS, CSRF, etc.)

### Technical Details

#### Dependencies Added
- `express` - Web application framework
- `bcryptjs` - Password hashing
- `jsonwebtoken` - JWT token management  
- `nodemailer` - Email sending
- `sqlite3` / `pg` - Database drivers
- `helmet` - Security headers
- `express-rate-limit` - Rate limiting
- `express-validator` - Input validation
- `cors` - Cross-origin resource sharing
- `cookie-parser` - Cookie parsing
- `dotenv` - Environment variable management

#### API Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User authentication
- `POST /api/auth/logout` - Session termination
- `GET /api/auth/me` - Current user info
- `GET /api/admin/users` - List all users (admin only)
- `GET /api/admin/stats` - User statistics (admin only)
- `POST /api/admin/users/:id/approve` - Approve registration (admin only)
- `POST /api/admin/users/:id/deny` - Deny registration (admin only)
- `POST /api/admin/users/:id/block` - Block/unblock user (admin only)
- `DELETE /api/admin/users/:id` - Delete user (admin only)

### Admin Access
- **Default Admin Email**: `jmcconocha@abydosone.ltd`
- **Default Password**: `TempAdmin123!` (should be changed immediately)
- **Admin Panel**: Available at `/admin` after authentication

## [1.0.0] - Previous Version

### Initial Website Features
- Static HTML website with modern responsive design
- Information about The Amplitude Institute
- Partnership and research community pages  
- Blue gradient theme with smooth animations
- Docker deployment configuration
- Render.com deployment support

---

## Migration Notes

### From v1.0.0 to v2.0.0
This is a major architectural change that transforms the static website into a full-stack application with authentication:

1. **Database Required**: Set up PostgreSQL (production) or use SQLite (development)
2. **Environment Variables**: Copy `.env.example` to `.env` and configure
3. **SMTP Configuration**: Set up email service for notifications (optional)
4. **Admin Account**: Default admin created automatically on first run
5. **User Registration**: All users must register and be approved by admin

### Backward Compatibility
- ❌ **Breaking Change**: Site content now requires authentication
- ✅ **Visual Compatibility**: Same design and branding maintained
- ✅ **Content Preserved**: All original content accessible after login
- ✅ **URLs Maintained**: Same page structure and navigation

### Deployment Changes
- **Render**: Now uses Node.js service + PostgreSQL database (was static)
- **Docker**: Updated for Express.js application (still supported)
- **Environment**: Requires environment variable configuration