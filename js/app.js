// Mobile navigation toggle
document.addEventListener('DOMContentLoaded', () => {
  const navToggle = document.querySelector('.nav__toggle');
  const navMenu = document.querySelector('.nav__menu');
  const nav = document.querySelector('.nav');
  
  if (navToggle && navMenu) {
    // Toggle mobile menu
    navToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      navToggle.classList.toggle('active');
      navMenu.classList.toggle('active');
      nav.classList.toggle('menu-open');
      document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!nav.contains(e.target) && navMenu.classList.contains('active')) {
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
        nav.classList.remove('menu-open');
        document.body.style.overflow = '';
      }
    });
    
    // Mobile dropdown toggles
    const dropdownItems = document.querySelectorAll('.nav__item--dropdown');
    
    dropdownItems.forEach(item => {
      const link = item.querySelector('.nav__link');
      
      link.addEventListener('click', (e) => {
        if (window.innerWidth <= 1024) {
          e.preventDefault();
          item.classList.toggle('active');
        }
      });
    });
    
    // Mobile submenu toggles
    const submenuItems = document.querySelectorAll('.nav__dropdown-item--has-submenu');
    
    submenuItems.forEach(item => {
      const link = item.querySelector('.nav__dropdown-link');
      
      link.addEventListener('click', (e) => {
        if (window.innerWidth <= 1024) {
          e.preventDefault();
          item.classList.toggle('active');
        }
      });
    });
  }
  
  // Hide nav on scroll down, show on scroll up
  let lastScroll = 0;
  
  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll <= 0) {
      nav.classList.remove('nav--hidden');
      return;
    }
    
    if (currentScroll > lastScroll && currentScroll > 100) {
      // Scrolling down
      nav.classList.add('nav--hidden');
    } else {
      // Scrolling up
      nav.classList.remove('nav--hidden');
    }
    
    lastScroll = currentScroll;
  });
});

// Automatische Netlify afbeeldingsoptimalisatie voor alle statische <img> tags
// Alleen actief op Netlify, niet lokaal
(function () {
  const onNetlify = window.location.hostname.endsWith('.netlify.app')
    || window.location.hostname === 'polderhart.be'
    || window.location.hostname === 'www.polderhart.be';
  if (!onNetlify) return;

  function optimizeImg(img) {
    const src = img.getAttribute('src');
    if (!src) return;
    // Sla over: al geoptimaliseerd, externe URLs, SVG, data URIs, logo
    if (src.startsWith('/.netlify/images') || src.startsWith('http') || src.startsWith('data:') || src.endsWith('.svg')) return;
    // Sla kleine iconen over (logo, waarden-iconen e.d.)
    if (img.classList.contains('nav__logo-img') || img.classList.contains('value-card__icon')) return;
    const path = src.startsWith('/') ? src : '/' + src;
    img.src = '/.netlify/images?url=' + encodeURIComponent(path) + '&w=1600&q=80';
  }

  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('img').forEach(optimizeImg);
    // Ook dynamisch geladen afbeeldingen opvangen
    const observer = new MutationObserver(function (mutations) {
      mutations.forEach(function (m) {
        m.addedNodes.forEach(function (node) {
          if (node.nodeType === 1) {
            if (node.tagName === 'IMG') optimizeImg(node);
            node.querySelectorAll && node.querySelectorAll('img').forEach(optimizeImg);
          }
        });
      });
    });
    observer.observe(document.body, { childList: true, subtree: true });
  });
})();
