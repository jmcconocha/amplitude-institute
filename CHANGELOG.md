# Changelog

All notable changes to The Amplitude Institute website will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.2.0] - 2025-09-13

### Added - Marketing Website Transformation

#### 🎯 Pre-Launch Marketing Implementation
- **Waitlist-Focused Strategy**: Complete transformation to pre-launch waitlist building for Q1 2026
- **"Coming Soon" Components**: Replaced all placeholder content with professional "Coming Soon" sections
- **Lead Generation System**: Comprehensive waitlist signup with form validation and user notifications
- **Responsive Design**: Mobile-first waitlist and marketing components with modern UI

#### 📋 New Marketing Components
- **Hero Metrics Display**: Visual metrics cards showing "5 Days to Working Prototype", "75% Target Success Rate", "2-4 Weeks to Patent Filing"
- **4-Step Process Timeline**: Apply & Match → Prepare → 5-Day Sprint → Deliver with detailed descriptions
- **Dual Pricing Strategy**: Engineer pricing ($397) and Company pricing ($15,000) with value comparisons
- **Success Stories Preview**: "Coming Soon - Q1 2026" section with launch messaging and target metrics
- **Comprehensive Waitlist Form**: Name, email, user type selection, and optional innovation concept input
- **Early Access Benefits**: 5 key benefits for waitlist members including priority booking and founding member discount

#### 🎨 Enhanced User Experience
- **Interactive Form Validation**: Real-time email validation and required field checking
- **Loading States**: Visual feedback during form submission with button state changes
- **Toast Notifications**: Success and error messaging system with animations
- **Waitlist Counter**: Dynamic counter showing current waitlist numbers (starting at 1,247+)
- **Mobile Optimization**: Responsive design for all new components across all device sizes

#### Files Modified
- **index.html**: Complete marketing content transformation based on Notion implementation guides
- **styles.css**: Added 200+ lines of CSS for new marketing components with responsive design
- **script.js**: Added waitlist form functionality, validation, and notification system

#### Technical Implementation Details
- **CSS Grid Layouts**: Hero metrics, process timeline, pricing grid, and preview metrics
- **Backdrop Filters**: Modern glass-morphism effects on form components
- **CSS Animations**: Smooth transitions, hover effects, and notification animations
- **Form State Management**: JavaScript handling of form submission, validation, and user feedback
- **Progressive Enhancement**: Features work with or without JavaScript enabled
- **Performance Optimized**: Efficient CSS selectors and minimal JavaScript impact

#### Content Strategy Alignment
- **Target Audiences**: Clear messaging for both Engineers (92% have unused ideas) and Companies (traditional R&D costs $250K+)
- **Value Propositions**: Focus on speed (5 days vs 18+ months), cost savings, and IP protection
- **Launch Messaging**: Consistent Q1 2026 launch date throughout all components
- **Professional Tone**: Balanced professional authority with accessible innovation messaging

## [2.1.2] - 2025-09-13

### Removed - Local Development Environment

#### 🧹 Development Environment Cleanup
- **Local Dependencies**: Removed `node_modules/` and `package-lock.json` for clean repository
- **Development Database**: Removed local SQLite database file (`database.sqlite`)
- **Local Configuration**: Removed `.env` file with local environment variables
- **Debug Files**: Cleaned up local logs, debug files, and temporary files
- **Production Safety**: Verified production deployment on Render remains completely unaffected

#### Files Removed
- `node_modules/` - Development dependencies (can be reinstalled with `npm install`)
- `package-lock.json` - Lock file (regenerated on `npm install`)
- `database.sqlite` - Local development database
- `logs/` - Local log directory
- `.env` - Local environment configuration
- `console-logs.json`, `network-requests.json`, `debug_admin.py` - Debug files

#### Documentation Updated
- **README.md**: Added warning about removed local environment with reinstallation instructions
- **Development Section**: Clear guidance for developers who need local setup
- **Production Focus**: Emphasized that production deployment on Render is unaffected

#### Technical Details
- Local cleanup has zero impact on production Render deployment
- Production uses separate PostgreSQL database and environment variables
- Repository is now cleaner for collaboration and deployment
- Developers can still set up local environment by following updated README instructions

## [2.1.1] - 2025-01-13

### Fixed - Navigation Menu Consistency

#### 🧭 Authentication-Aware Navigation
- **Menu Consistency**: Fixed Research Community and Partnership pages to show proper logged-in navigation menu
- **Profile/Admin Access**: Added Profile and Admin links to all pages for authenticated users
- **Logout Functionality**: Added logout button to all pages when user is logged in
- **JavaScript Integration**: Enabled authentication checking on all pages via existing `checkAuthAndUpdateUI()` function

#### Files Modified
- `public/research-community.html` - Updated navigation structure to match dashboard
- `public/partnerships.html` - Updated navigation structure to match dashboard

#### Technical Details
- Both pages now include Profile, Admin (for admins), and Logout options in navigation
- Menu automatically shows/hides authentication options based on login status
- Consistent with existing `script.js` authentication handling
- No backend changes required - leveraged existing authentication system

## [2.1.0] - 2025-09-09

### Changed - Marketing Content Realism
- **Patent Timeline Claims**: Updated unrealistic "30 days to patent" claims to realistic "6-18 months to patent application"
- **Development Cycle Timelines**: Changed "30-day cycles" to "6-month development cycles" based on actual product development research
- **IP Generation Language**: Replaced "generating patents" with "developing patentable concepts" for accuracy
- **Sprint Outcomes**: Updated claims from "1+ patents per sprint" to "1+ patentable concepts per sprint (with patent applications filed within 6-18 months)"
- **Mission Timelines**: Restructured mission phases from daily/weekly to monthly phases for realistic execution
- **Vision Statement**: Modified from "weeks not months" to "months not years" for breakthrough innovations

### Improved - Business Plan Alignment
- **Concept Document**: Updated core business plan to reflect realistic 6-12 month development cycles
- **Innovation Pod Cycles**: Changed from unspecified quick cycles to "6-12 month development cycles"
- **IP Pipeline**: Updated to "draft patent applications over 6-18 months" instead of immediate patent generation

### Fixed - Credibility Issues
- **Research-Based Timelines**: All timeline claims now based on actual USPTO patent processing times (Track One: 6-12 months, Standard: 1-3 years)
- **Product Development Reality**: Aligned with industry-standard software (3-12 months) and hardware (1-2+ years) development cycles
- **Consistent Messaging**: Ensured all marketing pages present consistent, realistic expectations

### Files Modified
- `index.html` - Main marketing page timeline updates
- `research-community.html` - Sprint and program timeline corrections  
- `partnerships.html` - Partnership value proposition timeline adjustments
- `public/` directory files - Synchronized public content with realistic timelines
- `public/index.html` - Removed fabricated statistics and unrealistic success rate claims
- `public/dashboard.html` - Fixed patent generation claims and clarified metrics as targets
- Business plan concept note - Strategic timeline alignment

### Specific Marketing Corrections
- **Fabricated Statistics Removed**: Eliminated unsourced claims like "92% of engineers", "$2.5 trillion lost", "75% success rate"
- **Language Moderation**: Changed "elite engineers" to "experienced engineers", removed hyperbolic language
- **Patent Claims Fixed**: Replaced "2-3 patents per sprint" with "patentable concepts development"
- **Timeline Reality**: Changed "48-hour sprints turn concepts into protected IP" to development-focused language
- **Metrics Honesty**: Relabeled "Success Metrics" as "Target Metrics" to indicate goals rather than achievements

### Critical Timeline Corrections (Phase 2)
- **"Immediate Patent Filing"**: Replaced with "Patent application development over 6-18 months with legal guidance"
- **"48 hours vs. 18 months" Comparisons**: Changed to "6-month development cycles vs. 18+ months traditional"
- **"Provisional Patents" Claims**: Updated to "IP Development" and "invention disclosure documentation"
- **Grandiose Comparisons**: Removed "Y Combinator of Deep Tech Innovation / Bell Labs for the Gig Economy" language
- **Weekend Patent Claims**: Eliminated suggestions that patents can be created in weekend sprints
- **30-day Cycle References**: Fixed remaining instances throughout all content

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