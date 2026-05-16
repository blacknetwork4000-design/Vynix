// Lenis Smooth Scrolling Setup
const lenis = new Lenis({
    duration: 2.0, // Slow, cinematic scroll
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    direction: 'vertical',
    gestureDirection: 'vertical',
    smooth: true,
    mouseMultiplier: 0.8,
    smoothTouch: false,
});

function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// GSAP Setup
gsap.registerPlugin(ScrollTrigger);

// Navbar Scroll Effect (Aeruk-style blur transition)
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Custom Cursor Logic
const cursorDot = document.querySelector('.cursor-dot');
const cursorGlow = document.querySelector('.cursor-glow');

if (window.innerWidth > 1024) {
    // Smooth Cursor Tracking
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let dotX = mouseX;
    let dotY = mouseY;
    let glowX = mouseX;
    let glowY = mouseY;

    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    const animateCursor = () => {
        // Easing for dot
        dotX += (mouseX - dotX) * 0.2;
        dotY += (mouseY - dotY) * 0.2;
        
        // Slower easing for the glow (creates a drag effect)
        glowX += (mouseX - glowX) * 0.1;
        glowY += (mouseY - glowY) * 0.1;

        if (cursorDot && cursorGlow) {
            cursorDot.style.left = `${dotX}px`;
            cursorDot.style.top = `${dotY}px`;
            cursorGlow.style.left = `${glowX}px`;
            cursorGlow.style.top = `${glowY}px`;
        }

        requestAnimationFrame(animateCursor);
    };
    animateCursor();

    // Hover States for Cursor Expansion & Cyan Glow
    const interactables = document.querySelectorAll('a, button, input, textarea, select, .magnetic, .project-slide, .service-row, .price-option, .service-card');
    interactables.forEach(el => {
        el.addEventListener('mouseenter', () => {
            document.body.classList.add('cursor-hover');
        });
        el.addEventListener('mouseleave', () => {
            document.body.classList.remove('cursor-hover');
        });
    });
}

// 1. Initial Loader & Hero Reveal
window.addEventListener('load', () => {
    const tl = gsap.timeline();

    tl.to(".loader-progress", {
        width: "100%",
        duration: 1.5,
        ease: "power2.inOut"
    })
    .to(".loader-text", {
        opacity: 0,
        filter: "blur(10px)",
        duration: 1
    }, "-=0.5")
    .to(".loader-wrapper", {
        opacity: 0,
        duration: 1,
        ease: "power2.inOut",
        onComplete: () => {
            document.querySelector('.loader-wrapper').style.display = 'none';
            document.body.classList.remove('loading');
        }
    })
    .from(".giant-heading .line", {
        y: "100%",
        duration: 1.5,
        stagger: 0.15,
        ease: "power4.out"
    }, "-=0.5")
    .from(".hero-desc", {
        opacity: 0,
        y: 30,
        duration: 1.5,
        ease: "power3.out"
    }, "-=1")
    .from(".hero-3d-logo, .cinematic-3d-space", {
        opacity: 0,
        scale: 0.9,
        duration: 2,
        ease: "power2.out"
    }, "-=1.5")
    .from(".navbar, .social-bar", {
        opacity: 0,
        duration: 1.5,
        ease: "power2.out"
    }, "-=1.5");
});

// 2. CINEMATIC PORTFOLIO SYSTEM (SWITCHING ENGINE)
document.addEventListener('DOMContentLoaded', () => {
    const portfolioSection = document.querySelector('.vynix-portfolio');
    if (!portfolioSection) return;

    const cards = document.querySelectorAll('.v-project-card');
    const prevBtn = document.querySelector('.f-arrow-btn:first-child');
    const nextBtn = document.querySelector('.f-arrow-btn:last-child');
    const currentIdxEl = document.querySelector('.f-project-count .current');
    const viewAllBtn = document.querySelector('.f-view-all');
    
    let currentIndex = 2; // Start with Voice Agents in the center (Project 03)
    const total = cards.length;

    const updatePortfolio = () => {
        cards.forEach((card, i) => {
            card.classList.remove('active-center', 'inactive-left', 'inactive-right', 'inactive-far-left', 'inactive-far-right');
            
            const diff = i - currentIndex;
            
            if (diff === 0) {
                card.classList.add('active-center');
            } else if (diff === -1) {
                card.classList.add('inactive-left');
            } else if (diff === 1) {
                card.classList.add('inactive-right');
            } else if (diff === -2) {
                card.classList.add('inactive-far-left');
            } else if (diff === 2) {
                card.classList.add('inactive-far-right');
            } else {
                // For diffs > 2 or < -2, keep them hidden but positioned
                if (diff < 0) card.classList.add('inactive-far-left');
                if (diff > 0) card.classList.add('inactive-far-right');
            }
        });

        // Update Counter
        if (currentIdxEl) {
            currentIdxEl.innerText = (currentIndex + 1).toString().padStart(2, '0');
        }
    };

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            currentIndex = (currentIndex > 0) ? currentIndex - 1 : 0;
            updatePortfolio();
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            currentIndex = (currentIndex < total - 1) ? currentIndex + 1 : total - 1;
            updatePortfolio();
        });
    }

    if (viewAllBtn) {
        viewAllBtn.addEventListener('click', () => {
            const aboutSection = document.getElementById('about');
            if (aboutSection) {
                aboutSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }

    // Tactile Interaction: Drag & Swipe
    let startX = 0;
    let isDragging = false;
    const track = document.querySelector('.project-display-track');

    if (track) {
        const startDrag = (e) => {
            isDragging = true;
            startX = e.type.includes('mouse') ? e.pageX : e.touches[0].pageX;
        };

        const endDrag = (e) => {
            if (!isDragging) return;
            isDragging = false;
            const endX = e.type.includes('mouse') ? e.pageX : e.changedTouches[0].pageX;
            const diff = startX - endX;

            if (Math.abs(diff) > 50) { // Threshold for switch
                if (diff > 0) {
                    currentIndex = (currentIndex < total - 1) ? currentIndex + 1 : total - 1;
                } else {
                    currentIndex = (currentIndex > 0) ? currentIndex - 1 : 0;
                }
                updatePortfolio();
            }
        };

        track.addEventListener('mousedown', startDrag);
        track.addEventListener('touchstart', startDrag);
        window.addEventListener('mouseup', endDrag);
        window.addEventListener('touchend', endDrag);
    }

    // Initialize
    updatePortfolio();
});

// 4. Slow Fade Reveals (Editorial Flow)
const fadeElements = gsap.utils.toArray('.about-grid, .service-row, .split-text, .price-option, .contact-info, .contact-form-minimal');
fadeElements.forEach(el => {
    gsap.from(el, {
        scrollTrigger: {
            trigger: el,
            start: "top 85%",
        },
        y: 60,
        opacity: 0,
        duration: 1.5,
        ease: "power3.out"
    });
});

// 5. Magnetic Physics for Luxury Buttons & Links
const magnetics = document.querySelectorAll('.magnetic');
magnetics.forEach(el => {
    el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        const x = (e.clientX - rect.left) - rect.width / 2;
        const y = (e.clientY - rect.top) - rect.height / 2;
        
        gsap.to(el, {
            x: x * 0.2,
            y: y * 0.2,
            duration: 1,
            ease: "power3.out"
        });
    });
    
    el.addEventListener('mouseleave', () => {
        gsap.to(el, {
            x: 0,
            y: 0,
            duration: 1,
            ease: "elastic.out(1, 0.3)"
        });
    });
});






// Scroll to Top Logic (Lenis Compatible)
const scrollToTopBtn = document.querySelector('#scrollToTop');
if (scrollToTopBtn) {
    scrollToTopBtn.addEventListener('click', () => {
        lenis.scrollTo(0, {
            duration: 2.5,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
        });
    });
}
