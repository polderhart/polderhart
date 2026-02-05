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
