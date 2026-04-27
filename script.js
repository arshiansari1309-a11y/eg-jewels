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

  document.querySelectorAll('.animate-on-scroll').forEach(el => {
    observer.observe(el);
  });

  // Inject Global Toast HTML if not present
  if (!document.getElementById('toast')) {
    const toastDiv = document.createElement('div');
    toastDiv.className = 'toast';
    toastDiv.id = 'toast';
    toastDiv.innerHTML = '<i class="fa-solid fa-check-circle"></i> Item added to cart!';
    document.body.appendChild(toastDiv);
  }

  // Global Cart Logic
  function updateCartBadge() {
    let cart = [];
    try {
      cart = JSON.parse(localStorage.getItem('everglowCart')) || [];
      if (!Array.isArray(cart)) cart = [];
    } catch (e) {
      cart = [];
    }
    const badge = document.getElementById('cartBadge');
    if (badge) {
      const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
      badge.textContent = totalItems;
    }
  }
  
  // Initial call on every page load
  updateCartBadge();
  window.updateCartBadge = updateCartBadge;

  // Global Add to Cart function
  window.addToCart = function(productId, btnElement) {
    // If btnElement is provided, look up the closest .card, otherwise try by data-id
    const productCard = btnElement ? btnElement.closest('.card') : document.querySelector(`.card[data-id="${productId}"]`);
    if (!productCard) return;

    const name = productCard.getAttribute('data-name');
    const price = parseFloat(productCard.getAttribute('data-price'));
    const img = productCard.getAttribute('data-img');

    let cart = [];
    try {
      cart = JSON.parse(localStorage.getItem('everglowCart')) || [];
      if (!Array.isArray(cart)) cart = [];
    } catch (e) {
      cart = [];
    }
    
    // Check if item exists
    const existingItem = cart.find(item => item.id == productId);
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({ id: productId, name, price, img, quantity: 1 });
    }

    localStorage.setItem('everglowCart', JSON.stringify(cart));
    updateCartBadge();
    showToast();
  };

  // Show Toast
  window.showToast = function(message = 'Item added to cart!') {
    const toast = document.getElementById('toast');
    if (toast) {
      toast.innerHTML = `<i class="fa-solid fa-check-circle"></i> ${message}`;
      toast.classList.add('show');
      setTimeout(() => {
        toast.classList.remove('show');
      }, 3000);
    }
  };

  // Global Checkout Function
  window.checkout = function() {
    let cart = JSON.parse(localStorage.getItem('everglowCart')) || [];
    if (cart.length === 0) {
      alert("Your cart is empty!");
      return;
    }
    // Show payment modal instead of completing immediately
    const modal = document.getElementById('paymentModal');
    if (modal) {
      modal.classList.add('active');
    } else {
      alert("Payment gateway is currently unavailable.");
    }
  };

  window.closePaymentModal = function() {
    const modal = document.getElementById('paymentModal');
    if (modal) {
      modal.classList.remove('active');
    }
  };

  window.copyUpiId = function() {
    const upiText = document.getElementById('upiIdText');
    if(upiText) {
      navigator.clipboard.writeText(upiText.textContent).then(() => {
        showToast("UPI ID copied to clipboard!");
      }).catch(err => {
        console.error('Failed to copy: ', err);
        alert("Failed to copy UPI ID");
      });
    }
  };

  window.confirmPayment = function() {
    // Complete the checkout process
    localStorage.removeItem('everglowCart');
    updateCartBadge();
    closePaymentModal();
    alert("Thank you for your payment! Your order has been placed successfully.");
    window.location.href = "shop.html"; // Redirect to shop
  };

  // Shop Page Category Filters
  const filterBtns = document.querySelectorAll('.filter-btn');
  const productCards = document.querySelectorAll('.product-grid .card');

  if (filterBtns.length > 0 && productCards.length > 0) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        // Remove active class from all
        filterBtns.forEach(b => b.classList.remove('active'));
        // Add to clicked
        btn.classList.add('active');

        const category = btn.textContent.trim().toLowerCase();

        productCards.forEach(card => {
          const cardCategory = card.getAttribute('data-category');
          if (!cardCategory) return; // skip if no category defined

          if (category === 'all') {
            card.style.display = 'block';
            setTimeout(() => card.style.opacity = '1', 50);
          } else {
            if (cardCategory.toLowerCase() === category) {
              card.style.display = 'block';
              setTimeout(() => card.style.opacity = '1', 50);
            } else {
              card.style.opacity = '0';
              setTimeout(() => card.style.display = 'none', 400); // match transition duration
            }
          }
        });
      });
    });
  }
});
