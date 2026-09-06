// ============================================
// ZAI Productions — Clean JavaScript
// ============================================

document.addEventListener('DOMContentLoaded', () => {

    // === Loader ===
    setTimeout(() => document.getElementById('loader')?.classList.add('hidden'), 2500);

    // === Hero Animations ===
    setTimeout(() => {
        document.querySelectorAll('.hmt-word').forEach((w, i) => setTimeout(() => w.classList.add('visible'), i * 120));
    }, 800);

    setTimeout(() => {
        document.querySelectorAll('.float-service').forEach((c, i) => setTimeout(() => c.classList.add('visible'), i * 150 + 1200));
    }, 100);

    // === Navbar Scroll ===
    const navbar = document.getElementById('navbar');
    const btt = document.getElementById('btt');

    window.addEventListener('scroll', () => {
        const y = window.scrollY;
        navbar?.classList.toggle('scrolled', y > 50);
        btt?.classList.toggle('visible', y > 500);
        updateActiveNav();
    }, { passive: true });

    // Wheel event for float
    window.addEventListener('wheel', e => {
        e.preventDefault();
        scrollVelocity += e.deltaY * 0.3;
    }, { passive: false });

    // Touch for mobile
    let lastTouch = 0;
    window.addEventListener('touchstart', e => { lastTouch = e.touches[0].clientY; }, { passive: true });
    window.addEventListener('touchmove', e => {
        const delta = lastTouch - e.touches[0].clientY;
        scrollVelocity += delta * 0.5;
        lastTouch = e.touches[0].clientY;
    }, { passive: true });

    function updateActiveNav() {
        const sections = document.querySelectorAll('section[id]');
        const links = document.querySelectorAll('.nav-link');
        const pos = window.scrollY + 150;
        sections.forEach(s => {
            if (pos >= s.offsetTop && pos < s.offsetTop + s.offsetHeight) {
                links.forEach(l => l.classList.toggle('active', l.getAttribute('href') === `#${s.id}`));
            }
        });
    }

    // === Smooth Scroll ===
    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', e => {
            e.preventDefault();
            const href = a.getAttribute('href');
            if (href === '#') return;
            const target = document.querySelector(href);
            if (target) {
                const navHeight = navbar?.offsetHeight || 80;
                const targetPos = target.getBoundingClientRect().top + window.scrollY - navHeight;
                window.scrollTo({ top: targetPos, behavior: 'smooth' });
            }
        });
    });

    // === Subtle Float Scroll ===
    let scrollTarget = window.scrollY;
    let scrollCurrent = window.scrollY;
    let scrollVelocity = 0;
    const scrollEase = 0.12;
    const scrollFriction = 0.92;
    let isScrolling = false;

    function smoothScroll() {
        scrollTarget += scrollVelocity;
        scrollVelocity *= scrollFriction;
        scrollTarget = Math.max(0, scrollTarget);
        scrollCurrent += (scrollTarget - scrollCurrent) * scrollEase;
        window.scrollTo(0, Math.round(scrollCurrent));
        requestAnimationFrame(smoothScroll);
    }
    smoothScroll();

    // === Hamburger ===
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

    // === Scroll Reveal ===
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

    // === Counter Animation ===
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

    // === WhatsApp Form ===
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

    // === Hero Particles ===
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
});
