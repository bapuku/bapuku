// Enhanced AGA MEDIA Website - Interactive Features
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initializeNavigation();
    initializeContactForm();
    initializeScrollEffects();
    initializeAnimations();
    loadReports();
});

// Navigation and mobile menu
function initializeNavigation() {
    // Mobile menu toggle
    const menuButton = document.getElementById('menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (menuButton && mobileMenu) {
        menuButton.addEventListener('click', function() {
            mobileMenu.classList.toggle('hidden');
        });
    }

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                // Close mobile menu if open
                if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
                    mobileMenu.classList.add('hidden');
                }
            }
        });
    });
}

// Enhanced contact form with validation
function initializeContactForm() {
    const contactForm = document.getElementById('contact-form');
    if (!contactForm) {
        return;
    }

    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Validate form
        if (!validateForm(contactForm)) {
            return;
        }
        
        const submitButton = contactForm.querySelector('button[type="submit"]');
        const originalText = submitButton.innerHTML;
        
        // Show loading state
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Envoi en cours...';
        submitButton.disabled = true;
        
        try {
            const formData = new FormData(contactForm);
            const data = {
                firstName: formData.get('firstName'),
                lastName: formData.get('lastName'),
                email: formData.get('email'),
                subject: formData.get('subject'),
                message: formData.get('message')
            };
            
            const response = await fetch('/.netlify/functions/contactForm', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });
            
            if (response.ok) {
                showNotification('Message envoyé avec succès! Nous vous répondrons bientôt.', 'success');
                contactForm.reset();
                clearFormErrors(contactForm);
            } else {
                throw new Error('Erreur lors de l\'envoi');
            }
        } catch (error) {
            console.error('Error:', error);
            showNotification('Erreur lors de l\'envoi. Veuillez réessayer.', 'error');
        } finally {
            // Reset button
            submitButton.innerHTML = originalText;
            submitButton.disabled = false;
        }
    });
}

// Form validation
function validateForm(form) {
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;
    
    // Clear previous errors
    clearFormErrors(form);
    
    requiredFields.forEach(field => {
        const value = field.value.trim();
        
        if (!value) {
            showFieldError(field, 'Ce champ est requis');
            isValid = false;
        } else if (field.type === 'email' && !isValidEmail(value)) {
            showFieldError(field, 'Veuillez entrer une adresse email valide');
            isValid = false;
        }
    });
    
    return isValid;
}

function showFieldError(field, message) {
    field.classList.add('border-red-500');
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message text-red-500 text-sm mt-1';
    errorDiv.textContent = message;
    field.parentElement.appendChild(errorDiv);
}

function clearFormErrors(form) {
    // Remove error styling
    form.querySelectorAll('input, textarea, select').forEach(field => {
        field.classList.remove('border-red-500');
    });
    
    // Remove error messages
    form.querySelectorAll('.error-message').forEach(error => {
        error.remove();
    });
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Scroll effects
function initializeScrollEffects() {
    const navbar = document.querySelector('nav');
    
    if (navbar) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 50) {
                navbar.classList.add('bg-white', 'shadow-lg');
                navbar.classList.remove('bg-transparent');
                // Change text color for better contrast
                navbar.querySelectorAll('a').forEach(link => {
                    if (!link.classList.contains('bg-yellow-400')) {
                        link.classList.add('text-gray-800');
                        link.classList.remove('text-white');
                    }
                });
            } else {
                navbar.classList.remove('bg-white', 'shadow-lg');
                navbar.classList.add('bg-transparent');
                // Revert text color
                navbar.querySelectorAll('a').forEach(link => {
                    if (!link.classList.contains('bg-yellow-400')) {
                        link.classList.remove('text-gray-800');
                        link.classList.add('text-white');
                    }
                });
            }
        });
    }
}

// Animations and visual effects
function initializeAnimations() {
    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-fadeIn');
            }
        });
    }, observerOptions);

    // Observe sections for scroll animations
    document.querySelectorAll('section').forEach(section => {
        observer.observe(section);
    });

    // Add hover effects to cards
    document.querySelectorAll('.service-card, .report-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
}

// Load reports from GitHub
async function loadReports() {
    try {
        const response = await fetch('/.netlify/functions/publishReports', {
            method: 'POST'
        });
        
        if (response.ok) {
            const result = await response.json();
            if (result.reports && result.reports.length > 0) {
                displayReports(result.reports);
            }
        }
    } catch (error) {
        console.error('Error loading reports:', error);
        // Silently fail - reports section will show default content
    }
}

// Display reports in the reports section
function displayReports(reports) {
    const container = document.getElementById('reports-container');
    if (!container || !reports.length) {
        return;
    }

    // Keep the first 3 cards as they are (they're manually designed)
    // Add additional reports if any
    const additionalReports = reports.slice(3); // Skip first 3 if they exist
    
    if (additionalReports.length > 0) {
        const additionalHTML = additionalReports.map(report => `
            <div class="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 report-card">
                <div class="mb-4">
                    <img src="https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=400&h=200&fit=crop" 
                         alt="${report.name}" class="w-full h-48 object-cover rounded-lg">
                </div>
                <span class="bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full">Rapport</span>
                <h3 class="text-xl font-semibold mt-4 mb-3">${report.name.replace('.pdf', '')}</h3>
                <p class="text-gray-600 mb-4">Rapport publié le ${new Date(report.lastModified).toLocaleDateString('fr-FR')}</p>
                <div class="flex justify-between items-center">
                    <span class="text-sm text-gray-500">${formatFileSize(report.size)}</span>
                    <a href="${report.downloadUrl}" target="_blank" 
                       class="text-blue-600 hover:text-blue-800 font-semibold flex items-center">
                        Télécharger <i class="fas fa-download ml-2"></i>
                    </a>
                </div>
            </div>
        `).join('');
        
        container.innerHTML += additionalHTML;
    }
}

// Format file size
function formatFileSize(bytes) {
    if (!bytes) {
        return '0 Bytes';
    }
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Enhanced notification system
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 p-4 rounded-lg text-white z-50 transform transition-all duration-300 translate-x-full shadow-lg`;
    
    // Set colors based on type
    switch(type) {
        case 'success':
            notification.classList.add('bg-green-500');
            break;
        case 'error':
            notification.classList.add('bg-red-500');
            break;
        default:
            notification.classList.add('bg-blue-500');
    }
    
    notification.innerHTML = `
        <div class="flex items-center space-x-2">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
            <span>${message}</span>
            <button onclick="this.parentElement.parentElement.remove()" class="ml-4 text-white hover:text-gray-200">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.classList.remove('translate-x-full');
    }, 100);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.classList.add('translate-x-full');
            setTimeout(() => {
                if (notification.parentElement) {
                    notification.remove();
                }
            }, 300);
        }
    }, 5000);
}

// Sync social media (admin function)
async function syncSocialMedia() {
    try {
        const response = await fetch('/.netlify/functions/syncSocial', {
            method: 'POST'
        });
        
        const result = await response.json();
        
        if (response.ok) {
            showNotification('Synchronisation réussie!', 'success');
            console.log('Social sync result:', result);
        } else {
            showNotification('Erreur de synchronisation', 'error');
        }
    } catch (error) {
        console.error('Error syncing social media:', error);
        showNotification('Erreur de connexion', 'error');
    }
}

// Analytics tracking (if Google Analytics is added)
function trackEvent(category, action, label) {
    if (typeof gtag !== 'undefined') {
        gtag('event', action, {
            'event_category': category,
            'event_label': label
        });
    }
}

// Track social media clicks
document.addEventListener('click', function(e) {
    const link = e.target.closest('a[href*="twitter.com"], a[href*="facebook.com"], a[href*="instagram.com"], a[href*="linkedin.com"]');
    if (link) {
        const platform = link.href.includes('twitter') ? 'Twitter' : 
                         link.href.includes('facebook') ? 'Facebook' :
                         link.href.includes('instagram') ? 'Instagram' : 'LinkedIn';
        trackEvent('Social Media', 'click', platform);
    }
});

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
    }
    
    .animate-fadeIn {
        animation: fadeIn 0.6s ease-out forwards;
    }
    
    .transition-all {
        transition: all 0.3s ease;
    }
    
    .service-card, .report-card {
        transition: transform 0.3s ease, box-shadow 0.3s ease;
    }
    
    .gradient-text {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
    }
`;
document.head.appendChild(style);
