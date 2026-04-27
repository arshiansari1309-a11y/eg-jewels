// script.js
document.addEventListener('DOMContentLoaded', () => {
  // Change header background on scroll
  const header = document.getElementById('header');
  if (header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    });
  }

  // Global Animation Logic using Intersection Observer
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // We will add the class 'animate-on-scroll' to elements we want to animate globally
  document.querySelectorAll('.animate-on-scroll').forEach(el => {
    observer.observe(el);
  });

  // Global Cart Logic to update badge everywhere
  function updateCartBadge() {
    const cart = JSON.parse(localStorage.getItem('everglowCart')) || [];
    const badge = document.getElementById('cartBadge');
    if (badge) {
      const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
      badge.textContent = totalItems;
    }
  }
  
  // Initial call on every page load
  updateCartBadge();

  // Export globally so other inline scripts (like Add to Cart) can trigger it
  window.updateCartBadge = updateCartBadge;
});
