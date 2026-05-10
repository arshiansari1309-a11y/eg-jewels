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
  // === GLOBAL INJECTIONS ===
  
  // Inject WhatsApp Floating Button
  if (!document.getElementById('whatsapp-float')) {
    const waLink = document.createElement('a');
    waLink.id = 'whatsapp-float';
    waLink.className = 'whatsapp-float';
    waLink.href = 'https://wa.me/1234567890?text=Hi%20EG%20Jewels!%20I%20need%20styling%20help.';
    waLink.target = '_blank';
    waLink.innerHTML = '<i class="fa-brands fa-whatsapp"></i>';
    document.body.appendChild(waLink);
  }

  // Inject Product Modal HTML if not present
  if (!document.getElementById('productModalOverlay')) {
    const modalHTML = `
      <div class="product-modal-overlay" id="productModalOverlay" onclick="closeProductModal(event)">
        <div class="product-modal" onclick="event.stopPropagation()">
          <span class="pm-close" onclick="closeProductModal()">&times;</span>
          <div class="pm-img">
            <img src="" id="pmImg" alt="Product Image">
          </div>
          <div class="pm-details">
            <h3 id="pmTitle">Product Title</h3>
            <div class="pm-price" id="pmPrice">₹0</div>
            <p class="pm-desc" id="pmDesc">Elegant piece crafted with precision. Perfect for any occasion.</p>
            <ul class="pm-specs">
              <li><strong>Material:</strong> Premium Anti-Tarnish Alloy</li>
              <li><strong>Plating:</strong> 18K Gold</li>
              <li><strong>Skin Safety:</strong> Hypoallergenic</li>
              <li><strong>Styling Tips:</strong> Best paired with minimalist evening wear.</li>
            </ul>
            <div class="pm-actions">
              <button class="btn" id="pmAddToCart" onclick="">Add to Cart</button>
            </div>
          </div>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);
  }

  // === WISHLIST LOGIC ===
  window.toggleWishlist = function(productId, btnElement, event) {
    if(event) event.stopPropagation(); // prevent opening modal
    const productCard = btnElement.closest('.card');
    if (!productCard) return;

    const name = productCard.getAttribute('data-name');
    const price = parseFloat(productCard.getAttribute('data-price'));
    const img = productCard.getAttribute('data-img');

    let wishlist = JSON.parse(localStorage.getItem('egWishlist')) || [];
    const index = wishlist.findIndex(item => item.id == productId);

    if (index > -1) {
      wishlist.splice(index, 1);
      btnElement.classList.remove('active');
      btnElement.innerHTML = '<i class="fa-regular fa-heart"></i>';
      showToast('Removed from Wishlist');
    } else {
      wishlist.push({ id: productId, name, price, img });
      btnElement.classList.add('active');
      btnElement.innerHTML = '<i class="fa-solid fa-heart"></i>';
      showToast('Added to Wishlist ❤️');
    }
    localStorage.setItem('egWishlist', JSON.stringify(wishlist));
    
    // If on wishlist page, re-render
    if (window.renderWishlist) window.renderWishlist();
  };

  // Init Wishlist Hearts
  function initWishlistUI() {
    let wishlist = JSON.parse(localStorage.getItem('egWishlist')) || [];
    document.querySelectorAll('.wishlist-btn').forEach(btn => {
      const id = btn.getAttribute('data-id');
      if (wishlist.find(i => i.id == id)) {
        btn.classList.add('active');
        btn.innerHTML = '<i class="fa-solid fa-heart"></i>';
      }
    });
  }
  initWishlistUI();

  // === MODAL LOGIC ===
  window.openProductModal = function(productId) {
    const card = document.querySelector(`.card[data-id="${productId}"]`);
    if (!card) return;
    
    const name = card.getAttribute('data-name');
    const price = card.getAttribute('data-price');
    const img = card.getAttribute('data-img');
    
    document.getElementById('pmTitle').textContent = name;
    document.getElementById('pmPrice').textContent = `₹${price}`;
    document.getElementById('pmImg').src = img;
    
    const addToCartBtn = document.getElementById('pmAddToCart');
    addToCartBtn.setAttribute('onclick', `addToCart(${productId}); showToast('Added to Cart'); closeProductModal();`);
    
    document.getElementById('productModalOverlay').classList.add('active');
  };

  window.closeProductModal = function(event) {
    if(event && event.target.id !== 'productModalOverlay') return;
    document.getElementById('productModalOverlay').classList.remove('active');
  };

});
