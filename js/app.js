// Mobile navigation toggle
document.addEventListener('DOMContentLoaded', () => {
  const navToggle = document.querySelector('.nav__toggle');
  const navMenu = document.querySelector('.nav__menu');
  const nav = document.querySelector('.nav');
  
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      navToggle.classList.toggle('active');
      navMenu.classList.toggle('active');
      nav.classList.toggle('menu-open');
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!nav.contains(e.target)) {
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
        nav.classList.remove('menu-open');
      }
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
