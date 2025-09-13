# The Amplitude Institute - Website

A professional website for The Amplitude Institute, a tech innovation think tank focused on advancing software-hardware innovation through collaborative R&D and strategic IP development.

## 🔐 Authentication System

The website now includes a complete authentication system that restricts access to authenticated users only:

### Features
- **Protected Access**: All main site content requires authentication
- **Registration System**: Users can register and wait for admin approval
- **Admin Approval Workflow**: All registrations are reviewed by administrators
- **Email Notifications**: Automatic emails for registration, approval, and denial
- **Admin Panel**: Complete user management interface
- **JWT Authentication**: Secure token-based authentication with HTTP-only cookies

### User Roles
- **Admin**: Can approve/deny registrations, manage all users, access admin panel
- **Approved User**: Can access the full website content
- **Pending User**: Registered but waiting for approval (no site access)
- **Blocked User**: Access denied by administrator

### Admin Access
- **Default Admin**: `jmcconocha@abydosone.ltd`
- **Default Password**: `TempAdmin123!` (change immediately after first login)
- **Admin Panel**: Available at `/admin` after login

## 🚀 Quick Start with Docker

### Prerequisites
- Docker and Docker Compose installed on your system
- Port 80 available on your host machine

### Build and Run

1. **Clone or navigate to the project directory:**
   ```bash
   cd TheAmplitudeInstitute
   ```

2. **Build and start the container:**
   ```bash
   docker-compose up -d
   ```

3. **Visit the website:**
   Open your browser and go to `http://localhost`

### Docker Commands

- **Build the image:**
  ```bash
  docker build -t amplitude-institute .
  ```

- **Run the container:**
  ```bash
  docker run -d -p 80:80 --name amplitude-web amplitude-institute
  ```

- **View logs:**
  ```bash
  docker-compose logs -f
  ```

- **Stop the container:**
  ```bash
  docker-compose down
  ```

- **Rebuild after changes:**
  ```bash
  docker-compose down
  docker-compose build --no-cache
  docker-compose up -d
  ```

## 🏗️ Project Structure

```
TheAmplitudeInstitute/
├── server.js                    # Express.js server with authentication
├── package.json                 # Node.js dependencies and scripts
├── .env.example                 # Environment variables template
├── public/                      # Static web files
│   ├── index.html              # Main website
│   ├── login.html              # Login page
│   ├── register.html           # Registration page
│   ├── admin.html              # Admin panel
│   ├── partnerships.html       # Partnerships page
│   ├── research-community.html # Research community page
│   ├── styles.css              # CSS with blue gradients and responsive design
│   └── script.js               # JavaScript for smooth scrolling and interactions
├── routes/                      # API route handlers
│   ├── auth.js                 # Authentication routes (login, register, logout)
│   └── admin.js                # Admin routes (user management)
├── middleware/                  # Express middleware
│   └── auth.js                 # Authentication middleware
├── services/                    # Business logic services
│   └── email.js                # Email notification service
├── database/                    # Database setup and management
│   ├── init.js                 # Database initialization
│   └── users.db                # SQLite database (created automatically)
├── Dockerfile                   # Docker container configuration
├── docker-compose.yml          # Docker Compose for easy deployment
├── nginx.conf                  # Nginx configuration for optimal performance
├── .dockerignore               # Docker build optimization
└── README.md                   # This file
```

## 🎨 Features

### Website Features
- **Responsive Design**: Mobile-first approach with breakpoints for all devices
- **Modern UI**: Blue gradient themes with smooth animations
- **Performance Optimized**: Nginx with gzip compression and caching
- **Smooth Scrolling**: JavaScript-powered navigation with active link tracking
- **Interactive Elements**: Hover effects, mobile navigation, and notification system
- **SEO Friendly**: Proper meta tags and semantic HTML structure

### Authentication Features
- **Secure Authentication**: JWT tokens with HTTP-only cookies
- **User Registration**: Self-service registration with admin approval
- **Admin Panel**: Complete user management dashboard
- **Email Notifications**: SMTP integration for registration and approval workflows
- **Role-based Access**: Admin and user roles with different permissions
- **Session Management**: Secure login/logout with session persistence
- **Password Security**: Bcrypt hashing and password complexity requirements
- **Rate Limiting**: Protection against brute force attacks
- **Consistent Navigation**: Authentication-aware menu across all pages

## 🛠️ Development

### Local Development Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Initialize the database:**
   ```bash
   node -e "require('./database/init').initDatabase()"
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   # or for production:
   npm start
   ```

5. **Access the application:**
   - Website: `http://localhost:3000`
   - Admin login: `jmcconocha@abydosone.ltd` / `TempAdmin123!`

### Environment Configuration

Required environment variables (see `.env.example`):
- `JWT_SECRET`: Secret key for JWT token signing
- `SMTP_*`: Email server configuration for notifications
- `ADMIN_EMAIL`: Administrator email address
- `DATABASE_PATH`: Path to SQLite database file

### Making Changes
1. Edit source files in `public/`, `routes/`, `middleware/`, etc.
2. Server automatically restarts with `npm run dev` (nodemon)
3. For Docker deployment:
   ```bash
   docker-compose down
   docker-compose build --no-cache
   docker-compose up -d
   ```

## 📊 Technical Specifications

### Backend Stack
- **Runtime**: Node.js 18+ with Express.js
- **Database**: SQLite (development) / PostgreSQL (production)
- **Authentication**: JWT tokens with HTTP-only cookies
- **Security**: Helmet.js, CORS, rate limiting, bcrypt hashing
- **Email**: Nodemailer with SMTP support
- **Validation**: Express-validator with custom rules

### Frontend Stack  
- **UI Framework**: Vanilla JavaScript with responsive design
- **CSS**: Modern CSS with gradients, flexbox, and grid
- **Icons**: Font Awesome 6.0
- **Fonts**: Google Fonts (Inter)
- **Notifications**: Custom toast notification system

### Deployment Options
- **Development**: SQLite database, local SMTP testing
- **Production**: PostgreSQL database, cloud SMTP services
- **Docker**: Multi-stage builds with Nginx proxy
- **Render**: Auto-deployment with PostgreSQL database

## 🔧 Configuration

### Environment Variables
- `NGINX_HOST`: Server hostname (default: localhost)
- `NGINX_PORT`: Server port (default: 80)

### Custom Configuration
- Modify `nginx.conf` for server-specific settings
- Update `docker-compose.yml` for different port mappings
- Edit CSS variables in `styles.css` for theme customization

## 🚀 Deployment Options

### 🌟 Render.com Deployment (Free Tier - Now Supported!)

The authentication system is now fully compatible with Render's free tier using PostgreSQL:

The easiest way to deploy this website is using Render's free tier:

#### Step 1: Create GitHub Repository
```bash
# Initialize git and commit all files
git add .
git commit -m "Initial commit"

# Create repository on GitHub and push
git remote add origin https://github.com/YOUR_USERNAME/amplitude-institute.git
git branch -M main
git push -u origin main
```

#### Step 2: Deploy on Render
1. Go to [render.com](https://render.com) and sign up with GitHub
2. Click "New +" → "Blueprint"
3. Connect your GitHub repository
4. Render will automatically detect the `render.yaml` file and create:
   - **Node.js Web Service**: Runs the Express.js authentication server
   - **PostgreSQL Database**: Free tier database for user data persistence
5. Click "Apply" to deploy

The blueprint automatically configures:
- JWT secret generation
- PostgreSQL database connection
- Admin user creation
- All necessary environment variables

#### Step 3: Access Your Site
- Your site will be available at: `https://amplitude-institute.onrender.com`
- Deployment takes 2-5 minutes
- Free tier sleeps after 15 minutes of inactivity
- **Admin Login**: Use `jmcconocha@abydosone.ltd` / `TempAdmin123!`

#### Step 4: Configure Email (Optional)
Email notifications require SMTP configuration. Add these environment variables in Render:

```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

**Email Service Options:**
- **Gmail**: Free, use app-specific password
- **SendGrid**: 100 emails/day free
- **Mailgun**: 10,000 emails/month free
- **Skip**: System works without email (no notifications)

#### Render Features
- ✅ **Free HTTPS/SSL certificate**
- ✅ **Automatic deployments** on GitHub push  
- ✅ **PostgreSQL database** (1GB free, persistent storage)
- ✅ **Node.js service** (750 hours/month free)
- ✅ **Zero configuration** - works with render.yaml
- ✅ **Environment variables** auto-configured
- ✅ **Custom domain support** (paid plans)

#### Managing Your Deployment
- **Render Dashboard**: [https://dashboard.render.com](https://dashboard.render.com)
- Monitor deployments, view logs, and manage settings
- Configure custom domains, environment variables, and scaling

#### Troubleshooting
If you get "disks are not supported for free tier services" error:
- This has been fixed in the render.yaml file
- Try deploying again, or use "Web Service" instead of "Blueprint"

### Alternative: Static Site Deployment
If Docker doesn't work on free tier, you can deploy as static files:

1. **Netlify Drop**: Drag and drop `index.html`, `styles.css`, `script.js`
2. **Vercel**: Connect GitHub repo, auto-deploy static files
3. **GitHub Pages**: Enable in repository settings

### Production Deployment Options

1. **Direct Docker:**
   ```bash
   docker run -d -p 80:80 --name amplitude-institute amplitude-institute
   ```

2. **Docker Compose:**
   ```bash
   docker-compose -f docker-compose.yml up -d
   ```

3. **Cloud Platforms:**
   - **Render**: $7/month for always-on
   - **DigitalOcean App Platform**: $5/month
   - **Railway**: $5/month usage-based
   - **Fly.io**: Free tier with limitations

## 📈 Performance Features

- **Nginx Optimizations**: Sendfile, gzip compression, static asset caching
- **CSS Optimizations**: CSS variables, efficient selectors, minimal reflows
- **JavaScript Optimizations**: Debounced scroll events, Intersection Observer API
- **Image Optimization**: Lazy loading support (future enhancement)

## 🔒 Security Features

- Security headers (XSS protection, content type options)
- Hidden nginx version
- Content Security Policy
- Input sanitization in JavaScript

## 🎯 About The Amplitude Institute

The Amplitude Institute is a collaborative R&D organization designed to bridge the gap between academic research and commercial product development. We convene software engineers with hardware fluency to explore frontier technologies, generate patentable innovations, and influence the future of computing.

### Core Activities
- **Innovation Pods**: Small, agile teams working on thematic challenges
- **Patent Pipeline**: Strategic IP generation and management
- **Tech Sprints & Labs**: Time-boxed R&D cycles for rapid prototyping
- **Knowledge Publishing**: Technical papers, blog series, and conference talks
- **Advisory & Consulting**: Strategic insights for partners and sponsors

### Focus Areas
- Embedded AI systems for constrained environments
- Secure boot and firmware integrity in edge devices
- Developer tooling for hardware-software co-design
- Energy-efficient compute architectures
- Human-centered debugging and observability frameworks

## 📞 Contact

For more information about The Amplitude Institute or this website, please contact us at jmcconocga@abydosone.ltd.

---

*Built with ❤️ using modern web technologies and containerized for reliable deployment.*