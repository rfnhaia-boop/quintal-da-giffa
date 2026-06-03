// ============================================
// QUINTAL DA GIFFA — Interactive Scripts
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  // ---- Navbar scroll effect ----
  const navbar = document.getElementById('navbar');
  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const currentScroll = window.scrollY;

    if (currentScroll > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    lastScroll = currentScroll;
  }, { passive: true });

  // ---- Mobile menu ----
  const mobileToggle = document.getElementById('mobile-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileClose = document.getElementById('mobile-menu-close');

  if (mobileToggle) {
    mobileToggle.addEventListener('click', () => {
      mobileMenu.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  }

  if (mobileClose) {
    mobileClose.addEventListener('click', () => {
      closeMobile();
    });
  }

  // ---- Scroll reveal animations ----
  const revealElements = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // ---- Highlight today's hours ----
  const today = new Date().getDay(); // 0=Sunday, 1=Monday, ...
  const hoursList = document.getElementById('hours-list');
  if (hoursList) {
    const items = hoursList.querySelectorAll('.hours-item');
    items.forEach(item => {
      const dayNum = parseInt(item.getAttribute('data-day'));
      if (dayNum === today) {
        item.classList.add('today');
        // Insert a beautiful premium indicator badge
        const daySpan = item.querySelector('.hours-day');
        if (daySpan) {
          const badge = document.createElement('span');
          badge.className = 'today-hours-badge';
          badge.textContent = dayNum === 1 ? 'Fechado' : 'Hoje';
          badge.style.fontSize = '0.7rem';
          badge.style.background = dayNum === 1 ? 'rgba(239, 68, 68, 0.15)' : 'var(--green-primary)';
          badge.style.color = dayNum === 1 ? '#ff4d4d' : 'var(--dark-bg)';
          badge.style.padding = '2px 8px';
          badge.style.borderRadius = '50px';
          badge.style.marginLeft = '10px';
          badge.style.fontWeight = '700';
          badge.style.textTransform = 'uppercase';
          badge.style.letterSpacing = '0.5px';
          badge.style.display = 'inline-block';
          badge.style.verticalAlign = 'middle';
          daySpan.appendChild(badge);
        }
      }
      if (dayNum === 1) { // Monday closed
        item.classList.add('closed');
      }
    });
  }

  // ---- Copy Address to Clipboard ----
  const btnCopy = document.getElementById('btn-copy-address');
  if (btnCopy) {
    btnCopy.addEventListener('click', () => {
      const addressText = btnCopy.getAttribute('data-address');
      navigator.clipboard.writeText(addressText).then(() => {
        const spanText = btnCopy.querySelector('span');
        const originalText = spanText.textContent;
        
        spanText.textContent = 'Endereço Copiado!';
        btnCopy.style.borderColor = 'var(--green-primary)';
        btnCopy.style.color = 'var(--green-primary)';
        
        setTimeout(() => {
          spanText.textContent = originalText;
          btnCopy.style.borderColor = '';
          btnCopy.style.color = '';
        }, 2000);
      }).catch(err => {
        console.error('Falha ao copiar endereço: ', err);
      });
    });
  }

  // ---- Smooth scroll for anchor links ----
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href === '#') return;

      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        const offset = navbar.offsetHeight + 20;
        const targetPosition = target.getBoundingClientRect().top + window.scrollY - offset;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // ---- Floating WhatsApp visibility ----
  const whatsappFloat = document.getElementById('whatsapp-float');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      whatsappFloat.style.opacity = '1';
      whatsappFloat.style.pointerEvents = 'auto';
    } else {
      whatsappFloat.style.opacity = '0';
      whatsappFloat.style.pointerEvents = 'none';
    }
  }, { passive: true });

  // Initial state
  if (window.scrollY <= 400) {
    whatsappFloat.style.opacity = '0';
    whatsappFloat.style.pointerEvents = 'none';
  }
  whatsappFloat.style.transition = 'opacity 0.4s ease';

  // ---- Parallax effect on hero image ----
  const heroBg = document.querySelector('.hero-bg img');
  if (heroBg && window.innerWidth > 768) {
    window.addEventListener('scroll', () => {
      const scrolled = window.scrollY;
      if (scrolled < window.innerHeight) {
        heroBg.style.transform = `translateY(${scrolled * 0.3}px) scale(1.1)`;
      }
    }, { passive: true });
    heroBg.style.transform = 'scale(1.1)';
  }

  // ---- Stagger animation for cards ----
  const cardSets = document.querySelectorAll('.dishes-grid, .beers-showcase, .reviews-grid');
  
  cardSets.forEach(grid => {
    const cards = grid.children;
    const cardObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          Array.from(cards).forEach((card, index) => {
            card.style.animationDelay = `${index * 0.1}s`;
          });
          cardObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    cardObserver.observe(grid);
  });

  // ---- Counter animation for hero stats ----
  const statNumbers = document.querySelectorAll('.hero-stat-number');
  let statsAnimated = false;

  function animateCounters() {
    if (statsAnimated) return;
    statsAnimated = true;

    statNumbers.forEach(stat => {
      const text = stat.textContent;
      const hasPlus = text.includes('+');
      const num = parseInt(text.replace(/[^0-9]/g, ''));
      
      if (isNaN(num) || num > 3000) {
        // For year numbers like 2015, just show them
        return;
      }

      let current = 0;
      const duration = 2000;
      const increment = num / (duration / 16);
      const suffix = hasPlus ? '+' : '';

      stat.textContent = '0' + suffix;

      function updateCounter() {
        current += increment;
        if (current >= num) {
          stat.textContent = num + suffix;
          return;
        }
        stat.textContent = Math.floor(current) + suffix;
        requestAnimationFrame(updateCounter);
      }

      requestAnimationFrame(updateCounter);
    });
  }

  const heroStats = document.querySelector('.hero-stats');
  if (heroStats) {
    const statsObserver = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        animateCounters();
        statsObserver.unobserve(heroStats);
      }
    }, { threshold: 0.5 });

    statsObserver.observe(heroStats);
  }
});

// ---- Global function for mobile menu close ----
function closeMobile() {
  const mobileMenu = document.getElementById('mobile-menu');
  if (mobileMenu) {
    mobileMenu.classList.remove('active');
    document.body.style.overflow = '';
  }
}
