// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    
    // Navigation Elements
    const navbar = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Mobile Navigation Toggle
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
    
    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }
    });
    
    // Navbar Scroll Effect
    function handleNavbarScroll() {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }
    
    // Active Navigation Link
    function updateActiveNavLink() {
        const scrollPosition = window.scrollY;
        const sections = document.querySelectorAll('section[id]');
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                // Remove active class from all nav links
                navLinks.forEach(link => link.classList.remove('active'));
                // Add active class to current nav link
                if (navLink) {
                    navLink.classList.add('active');
                }
            }
        });
    }
    
    // Smooth Scrolling for Navigation Links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // If it's a link to another page or external link, let it navigate normally
            if (href.includes('.html') || href.startsWith('http') || href.startsWith('mailto:')) {
                return; // Don't prevent default behavior
            }
            
            // Only handle same-page anchor links
            if (href.startsWith('#')) {
                e.preventDefault();
                const targetSection = document.querySelector(href);
                
                if (targetSection) {
                    const offsetTop = targetSection.offsetTop - 80;
                    
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
    
    // Hero Scroll Button
    const heroScrollBtn = document.querySelector('.hero-scroll a');
    if (heroScrollBtn) {
        heroScrollBtn.addEventListener('click', function(e) {
            e.preventDefault();
            const targetSection = document.querySelector('#about');
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    }
    
    // Scroll Event Listeners
    window.addEventListener('scroll', function() {
        handleNavbarScroll();
        updateActiveNavLink();
        handleScrollAnimations();
    });
    
    // Intersection Observer for Scroll Animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Observe elements for animations
    const animatedElements = document.querySelectorAll('.about-card, .activity-card, .focus-item, .contact-card');
    animatedElements.forEach(element => {
        observer.observe(element);
    });
    
    // Add CSS for scroll animations
    const style = document.createElement('style');
    style.textContent = `
        .about-card,
        .activity-card,
        .focus-item,
        .contact-card {
            opacity: 0;
            transform: translateY(30px);
            transition: all 0.6s ease;
        }
        
        .animate-in {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(style);
    
    // Scroll Animations
    function handleScrollAnimations() {
        const scrolled = window.pageYOffset;
        const parallax = document.querySelector('.hero');
        const speed = 0.5;
        
        if (parallax) {
            const yPos = -(scrolled * speed);
            parallax.style.transform = `translateY(${yPos}px)`;
        }
    }
    
    // Form Handling (for future use)
    function handleFormSubmissions() {
        const forms = document.querySelectorAll('form');
        forms.forEach(form => {
            form.addEventListener('submit', function(e) {
                e.preventDefault();
                // Add form submission logic here
                showNotification('Thank you for your interest! We\'ll be in touch soon.', 'success');
            });
        });
    }
    
    // Notification System
    function showNotification(message, type = 'info') {
        // Remove existing notifications
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }
        
        // Create notification
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-message">${message}</span>
                <button class="notification-close">&times;</button>
            </div>
        `;
        
        // Add notification styles
        const notificationStyle = `
            .notification {
                position: fixed;
                top: 100px;
                right: 20px;
                z-index: 2000;
                max-width: 400px;
                padding: 1rem;
                border-radius: 0.5rem;
                box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1);
                transform: translateX(100%);
                transition: transform 0.3s ease;
            }
            
            .notification.show {
                transform: translateX(0);
            }
            
            .notification-success {
                background: #10b981;
                color: white;
            }
            
            .notification-error {
                background: #ef4444;
                color: white;
            }
            
            .notification-info {
                background: #3b82f6;
                color: white;
            }
            
            .notification-content {
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            
            .notification-close {
                background: none;
                border: none;
                color: white;
                font-size: 1.5rem;
                cursor: pointer;
                padding: 0;
                margin-left: 1rem;
            }
        `;
        
        // Add styles if not already added
        if (!document.querySelector('#notification-styles')) {
            const styleElement = document.createElement('style');
            styleElement.id = 'notification-styles';
            styleElement.textContent = notificationStyle;
            document.head.appendChild(styleElement);
        }
        
        // Add to document
        document.body.appendChild(notification);
        
        // Show notification
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        // Auto hide after 5 seconds
        setTimeout(() => {
            hideNotification(notification);
        }, 5000);
        
        // Close button functionality
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => {
            hideNotification(notification);
        });
    }
    
    function hideNotification(notification) {
        notification.classList.remove('show');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }
    
    // Contact Button Handlers
    const contactButtons = document.querySelectorAll('.contact-btn');
    contactButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') {
                e.preventDefault();
                const buttonText = this.textContent;
                let message = '';
                
                switch(buttonText) {
                    case 'Join Research Community':
                        message = 'Thank you for your interest in joining our research community! We\'ll contact you with opportunities to contribute to our innovation pods.';
                        break;
                    case 'Explore Partnerships':
                        message = 'Thank you for your interest in partnering with us! Our team will reach out to discuss collaboration opportunities.';
                        break;
                    default:
                        message = 'Thank you for your interest! We\'ll be in touch soon.';
                }
                
                showNotification(message, 'success');
            }
        });
    });
    
    // Initialize form handling
    handleFormSubmissions();
    
    // Initial setup
    handleNavbarScroll();
    updateActiveNavLink();
    
    // Keyboard Navigation
    document.addEventListener('keydown', function(e) {
        // ESC key closes mobile menu
        if (e.key === 'Escape') {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }
    });
    
    // Debounce scroll events for better performance
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    
    // Apply debouncing to scroll handlers
    const debouncedScrollHandler = debounce(function() {
        handleNavbarScroll();
        updateActiveNavLink();
        handleScrollAnimations();
    }, 10);
    
    window.removeEventListener('scroll', function() {
        handleNavbarScroll();
        updateActiveNavLink();
        handleScrollAnimations();
    });
    
    window.addEventListener('scroll', debouncedScrollHandler);
    
    // Add loading animation removal
    window.addEventListener('load', function() {
        document.body.classList.add('loaded');
        
        // Trigger animations for elements already in view
        const elementsInView = document.querySelectorAll('.about-card, .activity-card, .focus-item, .contact-card');
        elementsInView.forEach(element => {
            const rect = element.getBoundingClientRect();
            const isInView = rect.top < window.innerHeight && rect.bottom > 0;
            if (isInView) {
                element.classList.add('animate-in');
            }
        });
    });
    
    // Preload images and optimize performance
    function preloadImages() {
        const images = document.querySelectorAll('img[data-src]');
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    }
    
    preloadImages();
    
    // Check authentication and show/hide admin menu
    async function checkAuthAndUpdateUI() {
        try {
            const response = await fetch('/api/auth/me', {
                method: 'GET',
                credentials: 'include'
            });
            
            const data = await response.json();
            
            if (data.success && data.authenticated) {
                // User is authenticated - show logout button
                const logoutBtn = document.getElementById('logout-btn');
                if (logoutBtn) {
                    logoutBtn.style.display = 'block';
                }
                
                // Show/hide admin menu based on role
                const adminLink = document.querySelector('a[href="/admin"]');
                if (adminLink) {
                    const adminListItem = adminLink.parentElement;
                    if (data.user && data.user.role === 'admin') {
                        adminListItem.style.display = 'block';
                    } else {
                        adminListItem.style.display = 'none';
                    }
                }
            } else {
                // User is not authenticated - hide both logout and admin
                const logoutBtn = document.getElementById('logout-btn');
                if (logoutBtn) {
                    logoutBtn.style.display = 'none';
                }
                
                const adminLink = document.querySelector('a[href="/admin"]');
                if (adminLink) {
                    const adminListItem = adminLink.parentElement;
                    adminListItem.style.display = 'none';
                }
            }
        } catch (error) {
            console.error('Auth check error:', error);
            // On error, hide admin menu and logout button for safety
            const logoutBtn = document.getElementById('logout-btn');
            if (logoutBtn) {
                logoutBtn.style.display = 'none';
            }
            
            const adminLink = document.querySelector('a[href="/admin"]');
            if (adminLink) {
                const adminListItem = adminLink.parentElement;
                adminListItem.style.display = 'none';
            }
        }
    }
    
    // Call auth check on page load
    checkAuthAndUpdateUI();

    // Logout functionality
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', async function(e) {
            e.preventDefault();
            
            try {
                const response = await fetch('/api/auth/logout', {
                    method: 'POST',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                
                const result = await response.json();
                
                if (result.success) {
                    showNotification('Logged out successfully', 'success');
                    // Redirect to login page after a short delay
                    setTimeout(() => {
                        window.location.href = '/login';
                    }, 1000);
                } else {
                    showNotification('Logout failed: ' + result.message, 'error');
                }
            } catch (error) {
                console.error('Logout error:', error);
                showNotification('Network error during logout', 'error');
            }
        });
    }
});

// Performance monitoring (for development)
if (typeof window.performance !== 'undefined') {
    window.addEventListener('load', function() {
        setTimeout(() => {
            const perfData = window.performance.timing;
            const loadTime = perfData.loadEventEnd - perfData.navigationStart;
            console.log(`Page load time: ${loadTime}ms`);
        }, 0);
    });
}