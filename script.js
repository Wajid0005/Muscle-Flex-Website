// script.js - MUSCLE FLEX (MK Fitness) Interactivity

document.addEventListener('DOMContentLoaded', () => {

    // 1. Initial Page Load Animation
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease-in';
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);

    // 2. Scroll Navbar Effect
    const header = document.querySelector('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // 3. Mobile Menu Toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    if (hamburger) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            document.body.classList.toggle('no-scroll');
            hamburger.innerHTML = navLinks.classList.contains('active') ? '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
        });

        // Close menu when a link is clicked
        const navItems = navLinks.querySelectorAll('a');
        navItems.forEach(item => {
            item.addEventListener('click', () => {
                navLinks.classList.remove('active');
                document.body.classList.remove('no-scroll');
                hamburger.innerHTML = '<i class="fas fa-bars"></i>';
            });
        });
    }

    // 4. Scroll triggered fade-in animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.fade-in-section').forEach((section) => {
        observer.observe(section);
    });

    // 5. BMI Calculator Logic (Home Page)
    const bmiForm = document.getElementById('bmi-form');
    if (bmiForm) {
        bmiForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const heightCm = parseFloat(document.getElementById('bmi-height').value);
            const weightKg = parseFloat(document.getElementById('bmi-weight').value);
            const resultBox = document.getElementById('bmi-result');

            if (heightCm > 0 && weightKg > 0) {
                const heightM = heightCm / 100;
                const bmi = (weightKg / (heightM * heightM)).toFixed(1);

                let category = '';
                let tip = '';

                if (bmi < 18.5) {
                    category = 'Underweight';
                    tip = 'Focus on caloric surplus and strength training.';
                } else if (bmi >= 18.5 && bmi <= 24.9) {
                    category = 'Normal';
                    tip = 'Maintain your balanced routine and healthy diet.';
                } else if (bmi >= 25 && bmi <= 29.9) {
                    category = 'Overweight';
                    tip = 'Incorporate daily cardio and a slight caloric deficit.';
                } else {
                    category = 'Obese';
                    tip = 'Consult with our trainers for a guided transformation plan.';
                }

                resultBox.innerHTML = `
                    <div style="background: rgba(85,0,255,0.1); border-left: 4px solid var(--accent-purple); padding: 15px; border-radius: 4px; margin-top: 15px;">
                        <span style="font-size: 24px; font-weight: 800; color: var(--text-white); display: block;">${bmi}</span>
                        <strong style="color: var(--accent-purple);">${category}</strong>
                        <p style="margin: 5px 0 0; font-size: 14px;">${tip}</p>
                    </div>
                `;
            }
        });
    }

    // 6. Contact Form Validation (Contact Page)
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = contactForm.querySelector('button[type="submit"]');
            const originalText = btn.innerHTML;

            btn.innerHTML = 'SENDING...';
            btn.style.opacity = '0.7';

            // Simulate network request
            setTimeout(() => {
                contactForm.innerHTML = `
                    <div class="success-message" style="text-align: center; padding: 40px; background: rgba(85,0,255,0.1); border: 1px solid var(--accent-purple); border-radius: 4px;">
                        <i class="fas fa-check-circle" style="font-size: 48px; color: var(--accent-purple); margin-bottom: 20px;"></i>
                        <h3 class="text-white">MESSAGE RECEIVED</h3>
                        <p>Thank you for reaching out. A coach will contact you shortly.</p>
                    </div>
                `;
            }, 1000);
        });
    }

    // 7. Lightbox for Gallery Images (Mobile & Desktop)
    const galleryContainer = document.querySelector('.gallery-grid') || document.querySelector('[style*="grid-template-columns: repeat(auto-fill"]');
    if (galleryContainer) {
        // Create lightbox elements
        const lightbox = document.createElement('div');
        lightbox.id = 'lightbox';
        lightbox.style.cssText = 'position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.95); z-index: 2000; display: none; align-items: center; justify-content: center; opacity: 0; transition: opacity 0.3s; flex-direction: column;';

        const lbImage = document.createElement('img');
        lbImage.style.cssText = 'max-width: 90vw; max-height: 80vh; border: 2px solid var(--accent-purple); box-shadow: 0 0 30px rgba(85,0,255,0.2); object-fit: contain;';

        const lbClose = document.createElement('div');
        lbClose.innerHTML = '<i class="fas fa-times"></i>';
        lbClose.style.cssText = 'position: absolute; top: 20px; right: 20px; font-size: 30px; color: white; cursor: pointer; padding: 10px; background: rgba(0,0,0,0.5); border-radius: 50%;';

        const controls = document.createElement('div');
        controls.style.cssText = 'display: flex; gap: 40px; margin-top: 20px;';
        controls.innerHTML = `
            <button id="lb-prev" style="background: none; border: none; color: white; font-size: 30px; cursor: pointer;"><i class="fas fa-chevron-left"></i></button>
            <button id="lb-next" style="background: none; border: none; color: white; font-size: 30px; cursor: pointer;"><i class="fas fa-chevron-right"></i></button>
        `;

        lightbox.appendChild(lbClose);
        lightbox.appendChild(lbImage);
        lightbox.appendChild(controls);
        document.body.appendChild(lightbox);

        const images = Array.from(galleryContainer.querySelectorAll('img'));
        let currentIndex = 0;

        // Open Lightbox
        images.forEach((img, index) => {
            img.style.cursor = 'pointer';
            img.addEventListener('click', () => {
                currentIndex = index;
                lbImage.src = images[currentIndex].src;
                lightbox.style.display = 'flex';
                document.body.style.overflow = 'hidden';
                setTimeout(() => lightbox.style.opacity = '1', 10);
            });
        });

        const showImage = (index) => {
            if (index < 0) currentIndex = images.length - 1;
            else if (index >= images.length) currentIndex = 0;
            else currentIndex = index;

            lbImage.style.opacity = '0';
            setTimeout(() => {
                lbImage.src = images[currentIndex].src;
                lbImage.style.opacity = '1';
                lbImage.style.transition = 'opacity 0.2s';
            }, 200);
        };

        // Controls
        lightbox.querySelector('#lb-prev').addEventListener('click', (e) => { e.stopPropagation(); showImage(currentIndex - 1); });
        lightbox.querySelector('#lb-next').addEventListener('click', (e) => { e.stopPropagation(); showImage(currentIndex + 1); });

        // Touch Swipe Support
        let touchstartX = 0;
        let touchendX = 0;
        lightbox.addEventListener('touchstart', e => { touchstartX = e.changedTouches[0].screenX; });
        lightbox.addEventListener('touchend', e => {
            touchendX = e.changedTouches[0].screenX;
            if (touchendX < touchstartX - 50) showImage(currentIndex + 1); // Swipe left
            if (touchendX > touchstartX + 50) showImage(currentIndex - 1); // Swipe right
        });

        // Close
        const closeLightbox = () => {
            lightbox.style.opacity = '0';
            setTimeout(() => {
                lightbox.style.display = 'none';
                document.body.style.overflow = '';
            }, 300);
        };
        lbClose.addEventListener('click', closeLightbox);
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });
    }
});
