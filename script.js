// Global configuration
const CONFIG = {
    siteName: 'My Static Website',
    version: '1.0.0',
    theme: 'light'
};

// Utility Functions
const Utils = {
    /**
     * Log messages with timestamp
     */
    log: function(message, type = 'info') {
        const timestamp = new Date().toLocaleTimeString();
        console.log(`[${timestamp}] ${type.toUpperCase()}: ${message}`);
    },

    /**
     * Format date to readable string
     */
    formatDate: function(date) {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(date).toLocaleDateString('en-US', options);
    },

    /**
     * Check if element is in viewport
     */
    isInViewport: function(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    },

    /**
     * Debounce function for performance
     */
    debounce: function(func, delay) {
        let timeoutId;
        return function(...args) {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => func.apply(this, args), delay);
        };
    },

    /**
     * Throttle function for performance
     */
    throttle: function(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
};

// DOM Ready
document.addEventListener('DOMContentLoaded', function() {
    Utils.log('DOM Content Loaded');
    
    // Initialize all modules
    Navigation.init();
    Animations.init();
    FormHandler.init();
    ThemeManager.init();
    Analytics.trackPageView();
});

// Navigation Module
const Navigation = {
    init: function() {
        this.setupMobileMenu();
        this.setupSmoothScroll();
        this.setupActiveLinks();
    },

    setupMobileMenu: function() {
        const menuBtn = document.querySelector('.menu-btn');
        const navMenu = document.querySelector('nav ul');
        
        if (menuBtn) {
            menuBtn.addEventListener('click', function() {
                navMenu.classList.toggle('active');
                this.classList.toggle('active');
            });
        }

        // Close menu when link is clicked
        const navLinks = document.querySelectorAll('nav a');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                if (menuBtn) {
                    menuBtn.classList.remove('active');
                }
                if (navMenu) {
                    navMenu.classList.remove('active');
                }
            });
        });
    },

    setupSmoothScroll: function() {
        const links = document.querySelectorAll('a[href^="#"]');
        links.forEach(link => {
            link.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                if (href !== '#') {
                    e.preventDefault();
                    const target = document.querySelector(href);
                    if (target) {
                        target.scrollIntoView({ behavior: 'smooth' });
                    }
                }
            });
        });
    },

    setupActiveLinks: function() {
        const currentLocation = location.pathname;
        const navLinks = document.querySelectorAll('nav a');
        
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href === currentLocation || (currentLocation === '/' && href === 'index.html')) {
                link.classList.add('active');
            }
        });
    }
};

// Animations Module
const Animations = {
    init: function() {
        this.setupScrollAnimations();
        this.setupFadeInElements();
    },

    setupScrollAnimations: function() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        document.querySelectorAll('.card, .feature-card, section').forEach(el => {
            observer.observe(el);
        });
    },

    setupFadeInElements: function() {
        const style = document.createElement('style');
        style.textContent = `
            @keyframes fadeIn {
                from {
                    opacity: 0;
                    transform: translateY(20px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }

            .fade-in {
                animation: fadeIn 0.6s ease-out forwards;
            }
        `;
        document.head.appendChild(style);
    }
};

// Form Handler Module
const FormHandler = {
    init: function() {
        const forms = document.querySelectorAll('form');
        forms.forEach(form => {
            form.addEventListener('submit', (e) => this.handleSubmit(e));
        });
    },

    handleSubmit: function(e) {
        e.preventDefault();
        const form = e.target;
        
        // Validate form
        if (!this.validateForm(form)) {
            Utils.log('Form validation failed', 'warning');
            return;
        }

        // Get form data
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        
        Utils.log('Form submitted: ' + JSON.stringify(data), 'info');
        
        // Show success message
        this.showSuccessMessage(form);
        
        // Reset form
        form.reset();
    },

    validateForm: function(form) {
        const requiredFields = form.querySelectorAll('[required]');
        let isValid = true;

        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                field.classList.add('error');
                isValid = false;
            } else {
                field.classList.remove('error');
            }

            // Email validation
            if (field.type === 'email') {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(field.value)) {
                    field.classList.add('error');
                    isValid = false;
                }
            }
        });

        return isValid;
    },

    showSuccessMessage: function(form) {
        const successMsg = form.querySelector('.success-message');
        if (successMsg) {
            successMsg.style.display = 'block';
            setTimeout(() => {
                successMsg.style.display = 'none';
            }, 5000);
        }
    }
};

// Theme Manager Module
const ThemeManager = {
    init: function() {
        this.setupThemeToggle();
        this.loadSavedTheme();
    },

    setupThemeToggle: function() {
        const themeToggle = document.querySelector('.theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => this.toggleTheme());
        }
    },

    toggleTheme: function() {
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        Utils.log('Theme changed to: ' + newTheme, 'info');
    },

    loadSavedTheme: function() {
        const savedTheme = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-theme', savedTheme);
    }
};

// Analytics Module
const Analytics = {
    trackPageView: function() {
        const pageInfo = {
            url: window.location.href,
            title: document.title,
            referrer: document.referrer,
            timestamp: new Date().toISOString()
        };
        
        Utils.log('Page view tracked: ' + document.title, 'info');
        console.log('Analytics:', pageInfo);
    },

    trackEvent: function(eventName, eventData = {}) {
        const event = {
            name: eventName,
            data: eventData,
            timestamp: new Date().toISOString()
        };
        
        Utils.log('Event tracked: ' + eventName, 'info');
        console.log('Event:', event);
    }
};

// Performance Optimization
window.addEventListener('load', function() {
    const performanceData = {
        domInteractive: performance.timing.domInteractive - performance.timing.navigationStart,
        loadComplete: performance.timing.loadEventEnd - performance.timing.navigationStart
    };
    
    Utils.log('Page loaded in ' + performanceData.loadComplete + 'ms', 'info');
    console.log('Performance:', performanceData);
});

// Error Handling
window.addEventListener('error', function(event) {
    Utils.log('Error: ' + event.message, 'error');
});

// Unhandled Promise Rejection
window.addEventListener('unhandledrejection', function(event) {
    Utils.log('Unhandled rejection: ' + event.reason, 'error');
});

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        Utils,
        Navigation,
        Animations,
        FormHandler,
        ThemeManager,
        Analytics,
        CONFIG
    };
}
