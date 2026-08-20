/* ==========================================================================
   IMAROC - JAVASCRIPT
   Interactions, Animations & Formulaire AJAX
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================
    // 1. Navigation Sticky & Active Link Highlight
    // ==========================================
    const header = document.querySelector('.main-header');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');
    
    const handleScroll = () => {
        // Sticky header
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Active link on scroll
        let currentSection = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120; // offset for sticky header
            const sectionHeight = section.offsetHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    };
    
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Trigger on load
    
    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                // Close mobile menu if open
                navMenu.classList.remove('active');
                mobileToggle.classList.remove('active');
                
                const targetOffset = targetSection.offsetTop - 80;
                window.scrollTo({
                    top: targetOffset,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ==========================================
    // 2. Menu Mobile
    // ==========================================
    const mobileToggle = document.getElementById('mobileToggle');
    const navMenu = document.getElementById('navMenu');
    
    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', () => {
            mobileToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!mobileToggle.contains(e.target) && !navMenu.contains(e.target)) {
                mobileToggle.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    }

    // ==========================================
    // 3. Animation des Compteurs (Statistiques)
    // ==========================================
    const statNumbers = document.querySelectorAll('.stat-number');
    
    if (statNumbers.length > 0) {
        let animated = false;
        
        const animateStats = () => {
            statNumbers.forEach(stat => {
                const target = parseInt(stat.getAttribute('data-target'), 10);
                const duration = 2000; // 2 seconds
                const stepTime = Math.abs(Math.floor(duration / target));
                let current = 0;
                
                const timer = setInterval(() => {
                    current += 1;
                    stat.textContent = current;
                    if (current >= target) {
                        stat.textContent = target + (stat.getAttribute('data-target') === '10' ? '+' : ''); // suffix '+' for 10+
                        clearInterval(timer);
                    }
                }, stepTime);
            });
        };
        
        // Intersection Observer for Stats Section
        const statsSection = document.querySelector('.stats-section');
        if (statsSection && 'IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting && !animated) {
                        animateStats();
                        animated = true;
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.3 });
            
            observer.observe(statsSection);
        } else {
            // Fallback if IntersectionObserver not supported
            setTimeout(animateStats, 1000);
        }
    }

    // ==========================================
    // 4. Validation Formulaire & Soumission AJAX
    // ==========================================
    const contactForm = document.getElementById('contactForm');
    const formFeedback = document.getElementById('formFeedback');
    const submitBtn = document.getElementById('submitBtn');
    
    if (contactForm) {
        // Live feedback styles as user types
        const inputs = contactForm.querySelectorAll('input[required], select[required], textarea[required]');
        
        inputs.forEach(input => {
            input.addEventListener('blur', () => {
                validateField(input);
            });
            input.addEventListener('input', () => {
                if (input.classList.contains('invalid')) {
                    validateField(input);
                }
            });
        });
        
        const validateField = (input) => {
            let isValid = true;
            
            if (input.type === 'email') {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                isValid = emailRegex.test(input.value.trim());
            } else if (input.type === 'tel') {
                // Moroccan phone numbers standard regex (mobile or fixed)
                const phoneRegex = /^(?:\+212|0)([5-7])\d{8}$/;
                isValid = phoneRegex.test(input.value.trim().replace(/\s/g, ''));
            } else {
                isValid = input.value.trim() !== '';
            }
            
            if (isValid) {
                input.classList.remove('invalid');
                input.classList.add('valid');
                return true;
            } else {
                input.classList.remove('valid');
                input.classList.add('invalid');
                return false;
            }
        };
        
        // Form submission via AJAX
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validate all fields before sending
            let formIsValid = true;
            inputs.forEach(input => {
                if (!validateField(input)) {
                    formIsValid = false;
                }
            });
            
            if (!formIsValid) {
                showFeedback("Veuillez remplir correctement tous les champs obligatoires (*).", "error");
                return;
            }
            // Enter loading state
            submitBtn.classList.add('loading');
            submitBtn.disabled = true;
            formFeedback.style.display = 'none';

            // Configuration Web3Forms (Remplacez par votre clé gratuite de web3forms.com)
            const WEB3FORMS_KEY = "26609a69-1bc4-467c-8532-bc7015a09efc"; 
            
            if (WEB3FORMS_KEY === "YOUR_ACCESS_KEY_HERE") {
                // Mode Démo si la clé n'est pas encore collée
                setTimeout(() => {
                    showFeedback("Mode Démo : Votre message a été simulé avec succès ! (Pour recevoir les e-mails réels sur ettayfikhawla@gmail.com, collez votre clé d'accès Web3Forms dans script.js)", "success");
                    contactForm.reset();
                    inputs.forEach(input => input.classList.remove('valid', 'invalid'));
                    submitBtn.classList.remove('loading');
                    submitBtn.disabled = false;
                }, 1000);
                return;
            }

            const formData = new FormData(this);
            formData.append("access_key", WEB3FORMS_KEY);
            formData.append("from_name", formData.get("name"));
            formData.append("subject", "[Devis Site Web] - " + formData.get("subject"));

            fetch("https://api.web3forms.com/submit", {
                method: "POST",
                body: formData
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erreur réseau.');
                }
                return response.json();
            })
            .then(data => {
                if (data.success) {
                    showFeedback("Merci ! Votre message a été envoyé avec succès. Notre équipe vous recontactera sous 24h.", "success");
                    contactForm.reset();
                    inputs.forEach(input => {
                        input.classList.remove('valid', 'invalid');
                    });
                } else {
                    showFeedback(data.message || "Une erreur s'est produite lors de l'envoi.", "error");
                }
            })
            .catch(error => {
                console.error('Error:', error);
                showFeedback("Une erreur s'est produite lors de l'envoi. Veuillez réessayer ou nous contacter par e-mail.", "error");
            })
            .finally(() => {
                // Exit loading state
                submitBtn.classList.remove('loading');
                submitBtn.disabled = false;
            });
        });
        
        const showFeedback = (message, type) => {
            formFeedback.textContent = message;
            formFeedback.className = `form-feedback ${type}`;
            formFeedback.style.display = 'block';
            
            // Auto scroll to feedback message
            formFeedback.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        };
    }
});
