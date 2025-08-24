# The Amplitude Institute - Website

A professional website for The Amplitude Institute, a tech innovation think tank focused on advancing software-hardware innovation through collaborative R&D and strategic IP development.

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
├── index.html          # Main HTML structure
├── styles.css          # CSS with blue gradients and responsive design
├── script.js           # JavaScript for smooth scrolling and interactions
├── Dockerfile          # Docker container configuration
├── docker-compose.yml  # Docker Compose for easy deployment
├── nginx.conf          # Nginx configuration for optimal performance
├── .dockerignore       # Docker build optimization
└── README.md           # This file
```

## 🎨 Features

- **Responsive Design**: Mobile-first approach with breakpoints for all devices
- **Modern UI**: Blue gradient themes with smooth animations
- **Performance Optimized**: Nginx with gzip compression and caching
- **Smooth Scrolling**: JavaScript-powered navigation with active link tracking
- **Interactive Elements**: Hover effects, mobile navigation, and notification system
- **SEO Friendly**: Proper meta tags and semantic HTML structure

## 🛠️ Development

### Local Development (without Docker)
1. Open `index.html` in a web browser
2. Use a local server like Python's `http.server` for testing:
   ```bash
   python3 -m http.server 8000
   ```

### Making Changes
1. Edit the HTML, CSS, or JavaScript files
2. Rebuild the Docker container:
   ```bash
   docker-compose down
   docker-compose build --no-cache
   docker-compose up -d
   ```

## 📊 Technical Specifications

- **Web Server**: Nginx (Alpine Linux)
- **Container Runtime**: Docker
- **Performance**: Gzip compression, static asset caching
- **Security**: Security headers, hidden server tokens
- **Monitoring**: Health checks and logging

## 🔧 Configuration

### Environment Variables
- `NGINX_HOST`: Server hostname (default: localhost)
- `NGINX_PORT`: Server port (default: 80)

### Custom Configuration
- Modify `nginx.conf` for server-specific settings
- Update `docker-compose.yml` for different port mappings
- Edit CSS variables in `styles.css` for theme customization

## 🚀 Deployment Options

### 🌟 Render.com Deployment (Free Tier - Recommended)

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
4. Render will automatically detect the `render.yaml` file
5. Click "Apply" to deploy

#### Step 3: Access Your Site
- Your site will be available at: `https://amplitude-institute.onrender.com`
- Deployment takes 2-5 minutes
- Free tier sleeps after 15 minutes of inactivity

#### Render Features
- ✅ **Free HTTPS/SSL certificate**
- ✅ **Automatic deployments** on GitHub push
- ✅ **Custom domain support** (paid plans)
- ✅ **Zero configuration** - works with render.yaml
- ✅ **Integrated with GitHub**

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

For more information about The Amplitude Institute or this website, please contact us at info@amplitudeinstitute.org.

---

*Built with ❤️ using modern web technologies and containerized for reliable deployment.*