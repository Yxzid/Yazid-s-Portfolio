/* ============================================================
   NAVBAR — scroll effect + active link
   ============================================================ */
const navbar = document.getElementById('navbar');
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
    // Sticky style
    navbar.classList.toggle('scrolled', window.scrollY > 60);

    // Active link highlight
    let current = '';
    sections.forEach(section => {
        if (window.scrollY >= section.offsetTop - 120) {
            current = section.getAttribute('id');
        }
    });
    navLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
    });
}, { passive: true });

/* ============================================================
   MOBILE MENU
   ============================================================ */
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
const mobileClose = document.getElementById('mobileClose');

function openMobile() {
    mobileMenu.classList.add('open');
    document.body.style.overflow = 'hidden';
}

function closeMobile() {
    mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
}

hamburger.addEventListener('click', openMobile);
mobileClose.addEventListener('click', closeMobile);

/* ============================================================
   TYPEWRITER — rotating role titles
   ============================================================ */
const roles = [
    'Graduate Sales Engineer',
    'Associate Solutions Engineer',
    'Graduate Product Manager',
    'Graduate Project Manager',
    'Associate Engineer',
    'Technical Problem Solver',
    'Graduate Sales Engineer',   // repeat to weight it
];

let roleIndex = 0;
let charIndex = 0;
let deleting = false;
const dynamicEl = document.getElementById('roleDynamic');

function typeRole() {
    const current = roles[roleIndex];

    if (deleting) {
        dynamicEl.textContent = current.substring(0, charIndex - 1);
        charIndex--;
    } else {
        dynamicEl.textContent = current.substring(0, charIndex + 1);
        charIndex++;
    }

    let delay = deleting ? 45 : 75;

    if (!deleting && charIndex === current.length) {
        delay = 2200;
        deleting = true;
    } else if (deleting && charIndex === 0) {
        deleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        delay = 350;
    }

    setTimeout(typeRole, delay);
}

typeRole();

/* ============================================================
   SCROLL REVEAL — fade in on scroll
   ============================================================ */
const revealTargets = [
    '.timeline-item',
    '.project-card',
    '.skill-category',
    '.edu-card',
    '.stat',
    '.contact-item',
    '.contact-form',
    '.section-header',
];

document.querySelectorAll(revealTargets.join(',')).forEach(el => {
    el.classList.add('reveal');
});

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

// Stagger children within grid containers
document.querySelectorAll('.projects-grid, .skills-grid, .about-stats, .edu-list, .contact-info').forEach(grid => {
    grid.querySelectorAll('.reveal').forEach((child, i) => {
        child.style.transitionDelay = `${i * 90}ms`;
    });
});

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ============================================================
   CONTACT FORM — mailto fallback
   ============================================================ */
const contactForm = document.getElementById('contactForm');
const formNote = document.getElementById('formNote');

contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name    = document.getElementById('name').value.trim();
    const email   = document.getElementById('email').value.trim();
    const subject = document.getElementById('subject').value.trim();
    const message = document.getElementById('message').value.trim();

    if (!name || !email || !subject || !message) {
        formNote.style.color = '#f87171';
        formNote.textContent = 'Please fill in all fields.';
        return;
    }

    const submitBtn = contactForm.querySelector('button[type="submit"]');
    submitBtn.textContent = 'Sending…';
    submitBtn.disabled = true;
    formNote.textContent = '';

    try {
        const response = await fetch('https://formspree.io/f/xpwzgvjk', {
            method: 'POST',
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, subject, message })
        });

        if (response.ok) {
            formNote.style.color = 'var(--accent)';
            formNote.textContent = 'Message sent! I\'ll be in touch soon.';
            contactForm.reset();
        } else {
            throw new Error('Failed');
        }
    } catch {
        formNote.style.color = '#f87171';
        formNote.textContent = 'Something went wrong. Please email me directly at yazidaliaskar@gmail.com';
    } finally {
        submitBtn.textContent = 'Send Message';
        submitBtn.disabled = false;
    }
});

/* ============================================================
   SMOOTH SCROLL — for anchor links in case browser needs help
   ============================================================ */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
        const target = document.querySelector(anchor.getAttribute('href'));
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

/* ============================================================
   PHOTO — handle missing image gracefully
   ============================================================ */
const profilePhoto = document.getElementById('profilePhoto');
const photoInitials = document.getElementById('photoInitials');

if (profilePhoto) {
    profilePhoto.addEventListener('error', () => {
        profilePhoto.style.display = 'none';
        photoInitials.style.display = 'flex';
    });
}
