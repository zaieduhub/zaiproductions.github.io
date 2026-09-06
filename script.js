// ============================================
// ZAI Productions — Ultra Premium JavaScript
// ============================================

document.addEventListener('DOMContentLoaded', () => {

    // === Custom Cursor ===
    const cursor = document.getElementById('cursor');
    const trail = document.getElementById('cursorTrail');
    let cx = 0, cy = 0, tx = 0, ty = 0;

    document.addEventListener('mousemove', e => {
        tx = e.clientX;
        ty = e.clientY;
    });

    function animateCursor() {
        cx += (tx - cx) * 0.15;
        cy += (ty - cy) * 0.15;
        if (cursor) { cursor.style.left = cx + 'px'; cursor.style.top = cy + 'px'; }
        if (trail) { trail.style.left = tx + 'px'; trail.style.top = ty + 'px'; }
        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // Cursor hover effects
    document.querySelectorAll('a, button, .svc-card, .why-card, .test-card, .cm-card, .pill, .af-item').forEach(el => {
        el.addEventListener('mouseenter', () => cursor?.classList.add('active'));
        el.addEventListener('mouseleave', () => cursor?.classList.remove('active'));
    });

    // === Loader ===
    const loader = document.getElementById('loader');
    setTimeout(() => loader?.classList.add('hidden'), 2500);

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

    // === Hero Word Reveal ===
    const lineWords = document.querySelectorAll('.line-word');
    setTimeout(() => {
        lineWords.forEach((w, i) => setTimeout(() => w.classList.add('visible'), i * 120 + 600));
    }, 100);

    // Hero elements reveal
    setTimeout(() => {
        document.querySelector('.hero-badge')?.classList.add('visible');
        document.querySelector('.hero-desc')?.classList.add('visible');
        document.querySelector('.hero-actions')?.classList.add('visible');
        document.querySelector('.hero-metrics')?.classList.add('visible');
    }, 500);

    // Orbit cards reveal
    setTimeout(() => {
        document.querySelectorAll('.orbit-card').forEach((c, i) => {
            setTimeout(() => c.classList.add('visible'), i * 200 + 1000);
        });
    }, 100);

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

    // === Ring Progress ===
    document.querySelectorAll('.ring-fill').forEach(ring => {
        const progress = parseInt(ring.getAttribute('data-progress'));
        const circumference = 2 * Math.PI * 45;
        const offset = circumference - (progress / 100) * circumference;
        ring.style.strokeDasharray = circumference;
        ring.style.strokeDashoffset = circumference;

        const ringObs = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    ring.style.transition = 'stroke-dashoffset 2s cubic-bezier(.22,1,.36,1)';
                    ring.style.strokeDashoffset = offset;
                    ringObs.unobserve(ring);
                }
            });
        }, { threshold: 0.5 });
        ringObs.observe(ring);
    });

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

        // Build WhatsApp message with all form data
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

        // Animate button
        submitBtn.innerHTML = '<span>Sending...</span>';
        submitBtn.style.background = 'linear-gradient(135deg, #25d366, #128c7e)';

        setTimeout(() => {
            // Open WhatsApp
            window.open(waURL, '_blank');

            // Also open email as backup
            const emailSubject = encodeURIComponent(`New Inquiry — ${service} — ${name}`);
            const emailBody = encodeURIComponent(
                `Name: ${name}\nPhone: ${phone}\nEmail: ${email}\nService: ${service}\n\nDetails:\n${message}`
            );
            // Uncomment below to also send email:
            // window.open(`mailto:zai2007.official@icloud.com?subject=${emailSubject}&body=${emailBody}`, '_blank');

            // Show success
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

    // === Smooth Reveal for Badge ===
    const heroBadge = document.querySelector('.hero-badge');
    if (heroBadge) {
        heroBadge.style.opacity = '0';
        heroBadge.style.transform = 'translateY(20px)';
        setTimeout(() => {
            heroBadge.style.transition = 'all 1s cubic-bezier(.22,1,.36,1)';
            heroBadge.style.opacity = '1';
            heroBadge.style.transform = 'translateY(0)';
        }, 2500);
    }

    // === Number Counter Glow Effect ===
    document.querySelectorAll('.metric-value span[data-count]').forEach(el => {
        const target = parseInt(el.getAttribute('data-count'));
        const numObs = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    let cur = 0;
                    const step = target / 60;
                    const anim = () => {
                        cur += step;
                        if (cur < target) { el.textContent = Math.floor(cur); requestAnimationFrame(anim); }
                        else { el.textContent = target; }
                    };
                    anim();
                    numObs.unobserve(el);
                }
            });
        }, { threshold: 0.5 });
        numObs.observe(el);
    });

    // === Ripple Effect on Service WhatsApp Buttons ===
    document.querySelectorAll('.svc-btn').forEach(btn => {
        btn.addEventListener('click', e => {
            const ripple = document.createElement('span');
            ripple.style.cssText = `
                position:absolute;width:100%;height:100%;border-radius:50%;
                background:rgba(255,255,255,.3);transform:scale(0);
                animation:ripple .6s ease-out;pointer-events:none;
            `;
            btn.style.position = 'relative';
            btn.style.overflow = 'hidden';
            btn.appendChild(ripple);
            setTimeout(() => ripple.remove(), 600);
        });
    });

    // Add ripple keyframes
    const style = document.createElement('style');
    style.textContent = `@keyframes ripple{to{transform:scale(4);opacity:0}}`;
    document.head.appendChild(style);

    // === Typing Effect on Hero Description (Optional) ===
    const heroDesc = document.querySelector('.hero-desc');
    if (heroDesc) {
        const text = heroDesc.innerHTML;
        heroDesc.innerHTML = '';
        heroDesc.style.opacity = '1';
        heroDesc.style.transform = 'none';
        setTimeout(() => {
            heroDesc.innerHTML = text;
            heroDesc.classList.add('visible');
        }, 1500);
    }
});
