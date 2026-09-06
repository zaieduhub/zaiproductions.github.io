// ============================================
// ZAI Productions — Premium JavaScript
// ============================================

document.addEventListener('DOMContentLoaded', () => {

    // === Custom Cursor ===
    const cursor = document.getElementById('cursor');
    const trail = document.getElementById('cursorTrail');
    let cx = 0, cy = 0, tx = 0, ty = 0;

    document.addEventListener('mousemove', e => { tx = e.clientX; ty = e.clientY; });

    function animateCursor() {
        cx += (tx - cx) * 0.15;
        cy += (ty - cy) * 0.15;
        if (cursor) { cursor.style.left = cx + 'px'; cursor.style.top = cy + 'px'; }
        if (trail) { trail.style.left = tx + 'px'; trail.style.top = ty + 'px'; }
        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    document.querySelectorAll('a, button, .svc-card, .why-card, .test-card, .cm-card, .pill, .af-item, .float-service').forEach(el => {
        el.addEventListener('mouseenter', () => cursor?.classList.add('active'));
        el.addEventListener('mouseleave', () => cursor?.classList.remove('active'));
    });

    // === Loader ===
    const loader = document.getElementById('loader');
    setTimeout(() => loader?.classList.add('hidden'), 2500);

    // === Hero Animations ===
    setTimeout(() => {
        document.querySelectorAll('.hmt-word').forEach((w, i) => {
            setTimeout(() => w.classList.add('visible'), i * 120);
        });
    }, 800);

    setTimeout(() => {
        document.querySelectorAll('.float-service').forEach((c, i) => {
            setTimeout(() => c.classList.add('visible'), i * 150 + 1200);
        });
    }, 100);

    // === Navbar Scroll ===
    const navbar = document.getElementById('navbar');
    const btt = document.getElementById('btt');

    window.addEventListener('scroll', () => {
        const y = window.scrollY;
        navbar?.classList.toggle('scrolled', y > 50);
        btt?.classList.toggle('visible', y > 500);
        updateActiveNav();
    });

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

    // === Smooth Scroll ===
    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', e => {
            e.preventDefault();
            const t = document.querySelector(a.getAttribute('href'));
            if (t) t.scrollIntoView({ behavior: 'smooth' });
        });
    });

    // === WhatsApp Form Integration ===
    const form = document.getElementById('contactForm');
    const submitBtn = document.getElementById('submitBtn');

    form?.addEventListener('submit', e => {
        e.preventDefault();

        const name = document.getElementById('cName').value.trim();
        const phone = document.getElementById('cPhone').value.trim();
        const email = document.getElementById('cEmail').value.trim();
        const service = document.getElementById('cService').value;
        const message = document.getElementById('cMessage').value.trim();

        const waMessage = `🔹 *New Inquiry — ZAI Productions*

👤 *Name:* ${name}
📞 *Phone:* ${phone || 'Not provided'}
📧 *Email:* ${email}
💼 *Service:* ${service}

📝 *Project Details:*
${message}

---
Sent from ZAI Productions Website`;

        const encodedMsg = encodeURIComponent(waMessage);
        const waURL = `https://wa.me/94750761016?text=${encodedMsg}`;

        submitBtn.innerHTML = '<span>Sending...</span>';
        submitBtn.style.background = 'linear-gradient(135deg, #25d366, #128c7e)';

        setTimeout(() => {
            window.open(waURL, '_blank');
            submitBtn.innerHTML = '<i class="fas fa-check"></i><span>Sent via WhatsApp!</span>';
            submitBtn.style.background = 'linear-gradient(135deg, #25d366, #00e5d0)';

            setTimeout(() => {
                submitBtn.innerHTML = '<i class="fab fa-whatsapp"></i><span>Send via WhatsApp</span>';
                submitBtn.style.background = '';
                form.reset();
            }, 3000);
        }, 800);
    });

    // === Magnetic Buttons ===
    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('mousemove', e => {
            const r = btn.getBoundingClientRect();
            const x = e.clientX - r.left - r.width / 2;
            const y = e.clientY - r.top - r.height / 2;
            btn.style.transform = `translate(${x * 0.12}px, ${y * 0.12}px)`;
        });
        btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
    });

    // === Tilt on Cards ===
    document.querySelectorAll('.svc-card, .test-card, .why-card').forEach(card => {
        card.addEventListener('mousemove', e => {
            const r = card.getBoundingClientRect();
            const x = (e.clientX - r.left - r.width / 2) / 20;
            const y = (e.clientY - r.top - r.height / 2) / 20;
            card.style.transform = `perspective(800px) rotateY(${x}deg) rotateX(${-y}deg) translateY(-8px)`;
        });
        card.addEventListener('mouseleave', () => { card.style.transform = ''; });
    });

    // === Parallax Background ===
    window.addEventListener('scroll', () => {
        const y = window.scrollY;
        document.querySelectorAll('.bg-orb').forEach((orb, i) => {
            const speed = (i + 1) * 0.02;
            orb.style.transform = `translateY(${y * speed}px)`;
        });
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
            p.style.cssText = `
                position:absolute;width:${size}px;height:${size}px;
                background:${color};border-radius:50%;
                left:${x}%;top:${y}%;opacity:0;
                animation:particleFade ${duration}s ease-in-out ${delay}s infinite;
            `;
            particlesContainer.appendChild(p);
        }
        const style = document.createElement('style');
        style.textContent = `
            @keyframes particleFade {
                0%, 100% { opacity: 0; transform: translateY(0) scale(1); }
                50% { opacity: .6; transform: translateY(-20px) scale(1.5); }
            }
        `;
        document.head.appendChild(style);
    }

    // === Floating Service Card Hover ===
    document.querySelectorAll('.float-service').forEach(card => {
        card.addEventListener('mousemove', e => {
            const r = card.getBoundingClientRect();
            const x = (e.clientX - r.left - r.width / 2) / 10;
            const y = (e.clientY - r.top - r.height / 2) / 10;
            card.style.transform = `perspective(600px) rotateY(${x}deg) rotateX(${-y}deg) scale(1.08)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'scale(1)';
        });
    });
});
