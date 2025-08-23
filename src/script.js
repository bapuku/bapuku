// AGA MEDIA Website JavaScript

// Smooth scrolling for navigation links
document.addEventListener('DOMContentLoaded', function() {
    // Smooth scroll for navigation links
    const navLinks = document.querySelectorAll('a[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Contact form handler
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactForm);
    }

    // Load reports dynamically
    loadReports();
});

// Handle contact form submission
async function handleContactForm(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = {
        name: formData.get('name'),
        email: formData.get('email'),
        message: formData.get('message')
    };

    try {
        const response = await fetch('/.netlify/functions/contactForm', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();
        
        if (response.ok) {
            showNotification('Message envoyé avec succès!', 'success');
            e.target.reset();
        } else {
            showNotification(result.error || 'Erreur lors de l\'envoi', 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        showNotification('Erreur de connexion', 'error');
    }
}

// Load reports from GitHub
async function loadReports() {
    try {
        const response = await fetch('/.netlify/functions/publishReports', {
            method: 'POST'
        });
        
        const result = await response.json();
        
        if (response.ok && result.reports) {
            displayReports(result.reports);
        }
    } catch (error) {
        console.error('Error loading reports:', error);
    }
}

// Display reports in the reports section
function displayReports(reports) {
    const container = document.getElementById('reports-container');
    if (!container || !reports.length) return;

    container.innerHTML = reports.map(report => `
        <div class="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <h3 class="text-xl font-semibold mb-3">${report.name.replace('.pdf', '')}</h3>
            <p class="text-gray-600 mb-4">Rapport publié le ${new Date(report.lastModified).toLocaleDateString('fr-FR')}</p>
            <div class="flex justify-between items-center">
                <span class="text-sm text-gray-500">${formatFileSize(report.size)}</span>
                <a href="${report.downloadUrl}" target="_blank" 
                   class="text-blue-600 hover:text-blue-800 font-semibold">
                    Télécharger →
                </a>
            </div>
        </div>
    `).join('');
}

// Format file size
function formatFileSize(bytes) {
    if (!bytes) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Show notification
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 ${
        type === 'success' ? 'bg-green-500' : 
        type === 'error' ? 'bg-red-500' : 'bg-blue-500'
    } text-white`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
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

// Header scroll effect
window.addEventListener('scroll', function() {
    const header = document.querySelector('header');
    if (window.scrollY > 100) {
        header.classList.add('bg-opacity-95', 'backdrop-blur-sm');
    } else {
        header.classList.remove('bg-opacity-95', 'backdrop-blur-sm');
    }
});
