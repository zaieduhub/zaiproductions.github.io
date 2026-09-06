// ============================================
// ZAI Productions — Floating Smooth Scroll
// ============================================

document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // FLOATING SMOOTH SCROLL ENGINE
    // ==========================================
    const scrollState = {
        target: 0,
        current: 0,
        ease: 0.09,         // Balanced float (smooth but responsive)
        momentum: 0,
        maxMomentum: 55,
        friction: 0.94,     // Moderate deceleration
        isScrolling: false,
        raf: null
    };

    // Create smooth scroll container
    const scrollContainer = document.createElement('div');
    scrollContainer.id = 'smooth-wrapper';
    scrollContainer.style.cssText = 'position:fixed;top:0;left:0;width:100%;will-change:transform;transition:none;';

    const contentWrapper = document.createElement('div');
    contentWrapper.id = 'smooth-content';
    contentWrapper.style.cssText = 'width:100%;';

    // Wrap body content
    const body = document.body;
    const bodyChildren = Array.from(body.children).filter(child =>
        !child.classList.contains('loader') &&
        !child.classList.contains('cursor') &&
        !child.classList.contains('cursor-trail') &&
        !child.classList.contains('cursor-ring') &&
        !child.classList.contains('noise-overlay') &&
        !child.classList.contains('bg-animated') &&
        child.id !== 'smooth-wrapper'
    );

    bodyChildren.forEach(child => contentWrapper.appendChild(child));
    scrollContainer.appendChild(contentWrapper);
    body.appendChild(scrollContainer);

    // Calculate scroll height
    function getScrollHeight() {
        return contentWrapper.scrollHeight - window.innerHeight;
    }

    // Override window scroll
    Object.defineProperty(window, '_smoothScroll', {
        value: true,
        writable: false
    });

    // Wheel event for smooth scroll
    let wheelTimeout;
    window.addEventListener('wheel', (e) => {
        e.preventDefault();

        // Add momentum based on wheel delta
        const delta = e.deltaY || e.detail;
        scrollState.momentum += delta * 0.9;  // Balanced force
        scrollState.momentum = Math.max(-scrollState.maxMomentum, Math.min(scrollState.maxMomentum, scrollState.momentum));

        // Clear existing timeout
        clearTimeout(wheelTimeout);
        scrollState.isScrolling = true;

        wheelTimeout = setTimeout(() => {
            scrollState.isScrolling = false;
        }, 150);
    }, { passive: false });

    // Touch events for mobile
    let touchStartY = 0;
    let touchLastY = 0;

    window.addEventListener('touchstart', (e) => {
        touchStartY = e.touches[0].clientY;
        touchLastY = touchStartY;
    }, { passive: true });

    window.addEventListener('touchmove', (e) => {
        e.preventDefault();
        const touchY = e.touches[0].clientY;
        const delta = touchLastY - touchY;
        scrollState.momentum += delta * 1.2;  // Balanced mobile
        scrollState.momentum = Math.max(-scrollState.maxMomentum, Math.min(scrollState.maxMomentum, scrollState.momentum));
        touchLastY = touchY;
    }, { passive: false });

    // Keyboard scroll
    window.addEventListener('keydown', (e) => {
        const keyMap = {
            'ArrowDown': 80,
            'ArrowUp': -80,
            'PageDown': window.innerHeight * 0.8,
            'PageUp': -window.innerHeight * 0.8,
            ' ': e.shiftKey ? -window.innerHeight * 0.8 : window.innerHeight * 0.8,
            'Home': -scrollState.current,
            'End': getScrollHeight() - scrollState.current
        };
        if (keyMap[e.key] !== undefined) {
            e.preventDefault();
            scrollState.momentum += keyMap[e.key];
        }
    });

    // Animation loop
    function animateScroll() {
        // Apply momentum to target
        scrollState.target += scrollState.momentum;
        scrollState.momentum *= scrollState.friction;

        // Clamp target
        scrollState.target = Math.max(0, Math.min(getScrollHeight(), scrollState.target));

        // Smooth interpolation (floating effect)
        const diff = scrollState.target - scrollState.current;
        scrollState.current += diff * scrollState.ease;

        // Apply transform
        scrollContainer.style.transform = `translate3d(0, ${-scrollState.current}px, 0)`;

        // Update scroll position for compatibility
        window.scrollTo(0, scrollState.current);

        // Update navbar and back to top
        const navbar = document.getElementById('navbar');
        const btt = document.getElementById('btt');
        navbar?.classList.toggle('scrolled', scrollState.current > 50);
        btt?.classList.toggle('visible', scrollState.current > 500);

        // Update active nav
        updateActiveNav();

        scrollState.raf = requestAnimationFrame(animateScroll);
    }

    // Start animation
    animateScroll();

    // ==========================================
    // NAV & ACTIVE STATE
    // ==========================================
    function updateActiveNav() {
        const sections = document.querySelectorAll('section[id]');
        const links = document.querySelectorAll('.nav-link');
        const pos = scrollState.current + 150;
        sections.forEach(s => {
            if (pos >= s.offsetTop && pos < s.offsetTop + s.offsetHeight) {
                links.forEach(l => l.classList.toggle('active', l.getAttribute('href') === `#${s.id}`));
            }
        });
    }

    // ==========================================
    // SMOOTH SCROLL TO SECTION
    // ==========================================
    function scrollToSection(targetY, duration = 1800) {
        const startY = scrollState.current;
        const distance = targetY - startY;
        const startTime = performance.now();

        function easeOutExpo(t) {
            return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
        }

        function step(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = easeOutExpo(progress);
            scrollState.target = startY + distance * eased;
            scrollState.current = startY + distance * eased;
            if (progress < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
    }

    // Nav link clicks
    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', e => {
            e.preventDefault();
            const href = a.getAttribute('href');
            if (href === '#') return;
            const target = document.querySelector(href);
            if (target) {
                const navbar = document.getElementById('navbar');
                const navHeight = navbar?.offsetHeight || 80;
                const targetPos = target.offsetTop - navHeight;
                scrollToSection(targetPos, 1800);
            }
        });
    });

    // Back to top
    document.getElementById('btt')?.addEventListener('click', e => {
        e.preventDefault();
        scrollToSection(0, 2000);
    });

    // ==========================================
    // CUSTOM CURSOR
    // ==========================================
    const cursor = document.getElementById('cursor');
    const trail = document.getElementById('cursorTrail');
    const ring = document.getElementById('cursorRing');
    let cx = 0, cy = 0, tx = 0, ty = 0, rx = 0, ry = 0;

    document.addEventListener('mousemove', e => { tx = e.clientX; ty = e.clientY; });

    function animateCursor() {
        cx += (tx - cx) * 0.18;
        cy += (ty - cy) * 0.18;
        rx += (tx - rx) * 0.06;
        ry += (ty - ry) * 0.06;
        if (cursor) { cursor.style.left = cx + 'px'; cursor.style.top = cy + 'px'; }
        if (trail) { trail.style.left = tx + 'px'; trail.style.top = ty + 'px'; }
        if (ring) { ring.style.left = rx + 'px'; ring.style.top = ry + 'px'; }
        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    document.querySelectorAll('a, button, .svc-card, .why-card, .test-card, .cm-card, .pill, .af-item, .float-service, .prs-link, .skill-tag, .prs-item, .pnc-badge').forEach(el => {
        el.addEventListener('mouseenter', () => { cursor?.classList.add('active'); ring?.classList.add('visible'); });
        el.addEventListener('mouseleave', () => { cursor?.classList.remove('active'); ring?.classList.remove('visible'); });
    });

    // ==========================================
    // LOADER
    // ==========================================
    setTimeout(() => document.getElementById('loader')?.classList.add('hidden'), 2500);

    // ==========================================
    // HERO ANIMATIONS
    // ==========================================
    setTimeout(() => {
        document.querySelectorAll('.hmt-word').forEach((w, i) => setTimeout(() => w.classList.add('visible'), i * 120));
    }, 800);

    setTimeout(() => {
        document.querySelectorAll('.float-service').forEach((c, i) => setTimeout(() => c.classList.add('visible'), i * 150 + 1200));
    }, 100);

    // ==========================================
    // HAMBURGER
    // ==========================================
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobileMenu');
    document.querySelectorAll('.mobile-link').forEach(link => {
        link.addEventListener('click', () => {
            hamburger?.classList.remove('active');
            mobileMenu?.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
    hamburger?.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        mobileMenu?.classList.toggle('active');
        document.body.style.overflow = mobileMenu?.classList.contains('active') ? 'hidden' : '';
    });

    // ==========================================
    // SCROLL REVEAL
    // ==========================================
    const revealEls = document.querySelectorAll('[data-anim="reveal"]');
    const revealObs = new IntersectionObserver((entries) => {
        entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
                setTimeout(() => entry.target.classList.add('visible'), i * 100);
                revealObs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(el => revealObs.observe(el));

    // ==========================================
    // COUNTER ANIMATION
    // ==========================================
    const counters = document.querySelectorAll('[data-count]');
    const counterObs = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const target = parseInt(el.getAttribute('data-count'));
                const dur = 2000;
                const step = target / (dur / 16);
                let cur = 0;
                const update = () => {
                    cur += step;
                    if (cur < target) { el.textContent = Math.floor(cur); requestAnimationFrame(update); }
                    else { el.textContent = target; }
                };
                update();
                counterObs.unobserve(el);
            }
        });
    }, { threshold: 0.5 });
    counters.forEach(c => counterObs.observe(c));

    // ==========================================
    // WHATSAPP FORM
    // ==========================================
    const form = document.getElementById('contactForm');
    const submitBtn = document.getElementById('submitBtn');

    form?.addEventListener('submit', e => {
        e.preventDefault();
        const name = document.getElementById('cName').value.trim();
        const phone = document.getElementById('cPhone').value.trim();
        const email = document.getElementById('cEmail').value.trim();
        const service = document.getElementById('cService').value;
        const message = document.getElementById('cMessage').value.trim();

        const waMessage = `🔹 *New Inquiry — ZAI Productions*\n\n👤 *Name:* ${name}\n📞 *Phone:* ${phone || 'Not provided'}\n📧 *Email:* ${email}\n💼 *Service:* ${service}\n\n📝 *Project Details:*\n${message}\n\n---\nSent from ZAI Productions Website`;

        submitBtn.innerHTML = '<span>Sending...</span>';
        submitBtn.style.background = 'linear-gradient(135deg, #25d366, #128c7e)';

        setTimeout(() => {
            window.open(`https://wa.me/94750761016?text=${encodeURIComponent(waMessage)}`, '_blank');
            submitBtn.innerHTML = '<i class="fas fa-check"></i><span>Sent via WhatsApp!</span>';
            submitBtn.style.background = 'linear-gradient(135deg, #25d366, #00e5d0)';
            setTimeout(() => {
                submitBtn.innerHTML = '<i class="fab fa-whatsapp"></i><span>Send via WhatsApp</span>';
                submitBtn.style.background = '';
                form.reset();
            }, 3000);
        }, 800);
    });

    // ==========================================
    // MAGNETIC BUTTONS
    // ==========================================
    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('mousemove', e => {
            const r = btn.getBoundingClientRect();
            const x = e.clientX - r.left - r.width / 2;
            const y = e.clientY - r.top - r.height / 2;
            btn.style.transform = `translate(${x * 0.12}px, ${y * 0.12}px)`;
        });
        btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
    });

    // ==========================================
    // 3D TILT ON CARDS
    // ==========================================
    document.querySelectorAll('.svc-card, .test-card, .why-card, .prs-item').forEach(card => {
        card.addEventListener('mousemove', e => {
            const r = card.getBoundingClientRect();
            const x = (e.clientX - r.left - r.width / 2) / 20;
            const y = (e.clientY - r.top - r.height / 2) / 20;
            card.style.transform = `perspective(800px) rotateY(${x}deg) rotateX(${-y}deg) translateY(-8px)`;
        });
        card.addEventListener('mouseleave', () => { card.style.transform = ''; });
    });

    // ==========================================
    // PROFILE CARD 3D TILT
    // ==========================================
    const profileCard3d = document.querySelector('.profile-card-3d');
    if (profileCard3d) {
        profileCard3d.addEventListener('mousemove', e => {
            const r = profileCard3d.getBoundingClientRect();
            const x = (e.clientX - r.left - r.width / 2) / 40;
            const y = (e.clientY - r.top - r.height / 2) / 40;
            const card = profileCard3d.querySelector('.profile-card');
            if (card) card.style.transform = `rotateY(${x}deg) rotateX(${-y}deg)`;
        });
        profileCard3d.addEventListener('mouseleave', () => {
            const card = profileCard3d.querySelector('.profile-card');
            if (card) card.style.transform = '';
        });
    }

    // ==========================================
    // PARALLAX ELEMENTS
    // ==========================================
    const parallaxElements = document.querySelectorAll('.bg-orb, .hero-rings, .pbg-orb');
    function updateParallax() {
        parallaxElements.forEach((el, i) => {
            const speed = (i + 1) * 0.03;
            el.style.transform = `translateY(${scrollState.current * speed}px)`;
        });
        requestAnimationFrame(updateParallax);
    }
    updateParallax();

    // ==========================================
    // HERO PARTICLES
    // ==========================================
    const particlesContainer = document.getElementById('heroParticles');
    if (particlesContainer) {
        for (let i = 0; i < 30; i++) {
            const p = document.createElement('div');
            const size = Math.random() * 4 + 1;
            const x = Math.random() * 100;
            const y = Math.random() * 100;
            const delay = Math.random() * 5;
            const duration = Math.random() * 3 + 3;
            const colors = ['var(--purple)', 'var(--cyan)', 'var(--pink)', 'var(--yellow)'];
            const color = colors[Math.floor(Math.random() * colors.length)];
            p.style.cssText = `position:absolute;width:${size}px;height:${size}px;background:${color};border-radius:50%;left:${x}%;top:${y}%;opacity:0;animation:particleFade ${duration}s ease-in-out ${delay}s infinite;`;
            particlesContainer.appendChild(p);
        }
        const style = document.createElement('style');
        style.textContent = `@keyframes particleFade{0%,100%{opacity:0;transform:translateY(0) scale(1)}50%{opacity:.6;transform:translateY(-20px) scale(1.5)}}`;
        document.head.appendChild(style);
    }

    // ==========================================
    // FLOAT SERVICE HOVER
    // ==========================================
    document.querySelectorAll('.float-service').forEach(card => {
        card.addEventListener('mousemove', e => {
            const r = card.getBoundingClientRect();
            const x = (e.clientX - r.left - r.width / 2) / 10;
            const y = (e.clientY - r.top - r.height / 2) / 10;
            card.style.transform = `perspective(600px) rotateY(${x}deg) rotateX(${-y}deg) scale(1.08)`;
        });
        card.addEventListener('mouseleave', () => { card.style.transform = 'scale(1)'; });
    });

    // ==========================================
    // RESIZE HANDLER
    // ==========================================
    window.addEventListener('resize', () => {
        scrollState.target = Math.min(scrollState.target, getScrollHeight());
        scrollState.current = Math.min(scrollState.current, getScrollHeight());
    });
});
