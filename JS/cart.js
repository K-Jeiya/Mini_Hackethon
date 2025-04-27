// Shopping Cart Module
const Cart = (() => {
    // DOM Elements
    const cartItems = document.getElementById('cart-items');
    const cartCount = document.getElementById('cart-count');
    const cartSubtotal = document.getElementById('cart-subtotal');
    const cartShipping = document.getElementById('cart-shipping');
    const cartTotal = document.getElementById('cart-total');
    const checkoutBtn = document.getElementById('checkout-btn');
    const emptyCart = document.getElementById('empty-cart');
    const cartItemsContainer = document.getElementById('cart-items-container');

    // Cart data
    let cart = [];
    const shippingCost = 5.99;

    // Initialize cart module
    const init = () => {
        loadCart();
        setupEventListeners();
        updateCartUI();
    };

    // Set up event listeners
    const setupEventListeners = () => {
        checkoutBtn.addEventListener('click', handleCheckout);
    };

    // wishlist.js - Complete Wishlist Module with UI
const Wishlist = (() => {
    // DOM Elements
    const wishlistBtn = document.getElementById('wishlist-btn');
    const wishlistCount = document.getElementById('wishlist-count');
    const wishlistSection = document.createElement('div');
    let wishlistItems = [];
    
    // Initialize wishlist module
    const init = () => {
        loadWishlist();
        setupEventListeners();
        createWishlistSection();
        updateWishlistUI();
    };
    
    // Create wishlist section
    const createWishlistSection = () => {
        wishlistSection.id = 'wishlist-section';
        wishlistSection.className = 'd-none';
        wishlistSection.innerHTML = `
            <div class="container py-4">
                <div class="d-flex justify-content-between align-items-center mb-4">
                    <h2>Your Wishlist</h2>
                    <button class="btn btn-outline-secondary" id="close-wishlist">
                        <i class="bi bi-arrow-left"></i> Continue Shopping
                    </button>
                </div>
                <div class="row" id="wishlist-items-container"></div>
            </div>
        `;
        document.querySelector('.container').after(wishlistSection);
    };
    
    // Load wishlist from localStorage
    const loadWishlist = () => {
        const savedWishlist = localStorage.getItem('shopeasy-wishlist');
        if (savedWishlist) {
            try {
                wishlistItems = JSON.parse(savedWishlist);
            } catch (e) {
                console.error('Error parsing wishlist:', e);
                wishlistItems = [];
            }
        }
    };
    
    // Save wishlist to localStorage
    const saveWishlist = () => {
        localStorage.setItem('shopeasy-wishlist', JSON.stringify(wishlistItems));
    };
    
    // Set up event listeners
    const setupEventListeners = () => {
        wishlistBtn.addEventListener('click', showWishlist);
        
        document.addEventListener('click', function(e) {
            if (e.target.closest('#close-wishlist')) {
                hideWishlist();
            }
        });
    };
    
    // Toggle item in wishlist
    const toggleWishlistItem = (productId) => {
        const product = Products.getProductById(productId);
        if (!product) return;
        
        const existingIndex = wishlistItems.findIndex(item => item.id === productId);
        
        if (existingIndex !== -1) {
            // Remove from wishlist
            wishlistItems.splice(existingIndex, 1);
        } else {
            // Add to wishlist
            wishlistItems.push({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                description: product.description
            });
        }
        
        saveWishlist();
        updateWishlistUI();
        updateWishlistPage();
        animateWishlistButton(productId);
    };
    
    // Show wishlist section
    const showWishlist = () => {
        document.getElementById('products-section').classList.add('d-none');
        document.getElementById('cart-section').classList.add('d-none');
        document.getElementById('auth-section').classList.add('d-none');
        wishlistSection.classList.remove('d-none');
        updateWishlistPage();
    };
    
    // Hide wishlist section
    const hideWishlist = () => {
        wishlistSection.classList.add('d-none');
        document.getElementById('products-section').classList.remove('d-none');
    };
    
    // Update wishlist page
    const updateWishlistPage = () => {
        const container = document.getElementById('wishlist-items-container');
        if (!container) return;
        
        container.innerHTML = '';
        
        if (wishlistItems.length === 0) {
            container.innerHTML = `
                <div class="col-12 text-center py-5">
                    <i class="bi bi-heart text-muted" style="font-size: 3rem;"></i>
                    <h4 class="mt-3">Your wishlist is empty</h4>
                    <p class="text-muted">You haven't added any products to your wishlist yet.</p>
                </div>
            `;
            return;
        }
        
        wishlistItems.forEach(item => {
            const productCard = document.createElement('div');
            productCard.className = 'col-md-4 col-sm-6 mb-4';
            productCard.innerHTML = `
                <div class="card product-card h-100">
                    <div class="position-relative">
                        <img src="${item.image}" class="card-img-top" alt="${item.name}" 
                            style="height: 200px; object-fit: cover;">
                        <button class="btn btn-sm btn-danger position-absolute top-0 end-0 m-2 wishlist-btn active" 
                            data-product-id="${item.id}">
                            <i class="fas fa-heart"></i>
                        </button>
                    </div>
                    <div class="card-body d-flex flex-column">
                        <h5 class="card-title">${item.name}</h5>
                        <p class="card-text text-success">$${item.price.toFixed(2)}</p>
                        <div class="mt-auto d-flex gap-2">
                            <button class="btn btn-outline-primary flex-grow-1 view-details" 
                                data-product-id="${item.id}">
                                <i class="bi bi-eye"></i> Details
                            </button>
                            <button class="btn btn-primary flex-grow-1 add-to-cart" 
                                data-product-id="${item.id}">
                                <i class="bi bi-cart-plus"></i> Add to Cart
                            </button>
                        </div>
                    </div>
                </div>
            `;
            container.appendChild(productCard);
        });
    };
    
    // Update wishlist UI
    const updateWishlistUI = () => {
        wishlistCount.textContent = wishlistItems.length;
        wishlistCount.classList.toggle('d-none', wishlistItems.length === 0);
        
        // Update all wishlist buttons
        document.querySelectorAll('.wishlist-btn').forEach(btn => {
            const productId = btn.dataset.productId;
            if (productId) {
                const isInWishlist = wishlistItems.some(item => item.id === productId);
                const icon = btn.querySelector('i');
                
                if (isInWishlist) {
                    icon.classList.replace('far', 'fas');
                    btn.classList.add('active');
                } else {
                    icon.classList.replace('fas', 'far');
                    btn.classList.remove('active');
                }
            }
        });
    };
    
    // Animate wishlist button
    const animateWishlistButton = (productId) => {
        const btn = document.querySelector(`.wishlist-btn[data-product-id="${productId}"]`);
        if (btn) {
            gsap.to(btn, {
                scale: 1.3,
                duration: 0.2,
                yoyo: true,
                repeat: 1,
                ease: "power2.out"
            });
        }
    };
    
    // Public API
    return {
        init,
        toggleWishlistItem,
        getWishlistItems: () => wishlistItems
    };
})();

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', Wishlist.init);

// Add item to cart with animation
const addToCart = (product, quantity = 1) => {
    const existingItem = cart.find(item => item.id === product.id);

    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: quantity
        });
    }

    saveCart();
    updateCartUI();
    showAddToCartSuccess(product, quantity);
    animateAddToCart(product);
};

// Show success notification
const showAddToCartSuccess = (product, quantity) => {
    const notification = document.createElement('div');
    notification.className = 'alert alert-success position-fixed bottom-0 end-0 m-3 animate__animated animate__fadeInUp';
    notification.style.zIndex = '9999';
    notification.style.minWidth = '300px';
    notification.innerHTML = `
        <div class="d-flex align-items-center">
            <i class="bi bi-check-circle-fill me-2"></i>
            <div>
                Added ${quantity} ${quantity > 1 ? 'items' : 'item'} of <strong>${product.name}</strong> to cart
            </div>
        </div>
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.classList.add('animate__fadeOut');
        setTimeout(() => notification.remove(), 500);
    }, 3000);
};

// Animate add to cart action
const animateAddToCart = (product) => {
    const cartBtn = document.getElementById('cart-btn');
    const productCard = document.querySelector(`[data-product-id="${product.id}"]`)?.closest('.product-card');
    
    if (productCard) {
        const clone = productCard.cloneNode(true);
        clone.style.position = 'fixed';
        clone.style.width = productCard.offsetWidth + 'px';
        clone.style.height = productCard.offsetHeight + 'px';
        clone.style.top = productCard.getBoundingClientRect().top + 'px';
        clone.style.left = productCard.getBoundingClientRect().left + 'px';
        clone.style.zIndex = '1000';
        clone.style.pointerEvents = 'none';
        clone.style.transformOrigin = 'center center';
        clone.style.opacity = '0.8';
        
        document.body.appendChild(clone);
        
        const cartBtnRect = cartBtn.getBoundingClientRect();
        const targetX = cartBtnRect.left + cartBtnRect.width / 2;
        const targetY = cartBtnRect.top + cartBtnRect.height / 2;
        
        gsap.to(clone, {
            x: targetX - productCard.getBoundingClientRect().left - clone.offsetWidth / 2,
            y: targetY - productCard.getBoundingClientRect().top - clone.offsetHeight / 2,
            scale: 0.2,
            opacity: 0,
            duration: 0.8,
            ease: "power2.in",
            onComplete: () => {
                clone.remove();
                // Pulse cart button
                gsap.to(cartBtn, {
                    scale: 1.1,
                    duration: 0.2,
                    yoyo: true,
                    repeat: 1
                });
            }
        });
    }
};

    // Load cart from localStorage
    const loadCart = () => {
        const savedCart = localStorage.getItem('shopeasy-cart');
        if (savedCart) {
            try {
                cart = JSON.parse(savedCart);
            } catch (e) {
                console.error('Error parsing cart:', e);
                cart = [];
            }
        }
    };

    // Save cart to localStorage
    const saveCart = () => {
        localStorage.setItem('shopeasy-cart', JSON.stringify(cart));
    };



    // Remove item from cart
    const removeFromCart = (productId) => {
        cart = cart.filter(item => item.id !== productId);
        saveCart();
        updateCartUI();
        animateCartUpdate();
    };

    // Update item quantity in cart
    const updateItemQuantity = (productId, newQuantity) => {
        const itemIndex = cart.findIndex(item => item.id === productId);

        if (itemIndex !== -1) {
            if (newQuantity <= 0) {
                removeFromCart(productId);
            } else {
                cart[itemIndex].quantity = newQuantity;
                saveCart();
                updateCartUI();
                animateCartUpdate();
            }
        }
    };

    // Handle checkout process
    const handleCheckout = () => {
        if (cart.length === 0) return;

        if (!firebase.auth().currentUser) {
            App.showErrorNotification('Please login to checkout');
            App.showSection(document.getElementById('auth-section'));
            return;
        }

        // In a real app, this would process payment
        showCheckoutModal();
    };

    // Show checkout modal
    const showCheckoutModal = () => {
        // Calculate order summary
        const subtotal = calculateSubtotal();
        const total = subtotal + shippingCost;

        // Create modal HTML
        const modalHTML = `
            <div class="modal fade" id="checkoutModal" tabindex="-1" aria-hidden="true">
                <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">Order Summary</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <div class="order-summary">
                                ${cart.map(item => `
                                    <div class="d-flex justify-content-between mb-2">
                                        <span>${item.name} × ${item.quantity}</span>
                                        <span>$${(item.price * item.quantity).toFixed(2)}</span>
                                    </div>
                                `).join('')}
                                <hr>
                                <div class="d-flex justify-content-between mb-2">
                                    <span>Subtotal:</span>
                                    <span>$${subtotal.toFixed(2)}</span>
                                </div>
                                <div class="d-flex justify-content-between mb-2">
                                    <span>Shipping:</span>
                                    <span>$${shippingCost.toFixed(2)}</span>
                                </div>
                                <div class="d-flex justify-content-between fw-bold fs-5">
                                    <span>Total:</span>
                                    <span>$${total.toFixed(2)}</span>
                                </div>
                            </div>
                            
                            <form id="checkoutForm" class="mt-4">
                                <div class="mb-3">
                                    <label for="cardNumber" class="form-label">Card Number</label>
                                    <input type="text" class="form-control" id="cardNumber" placeholder="4242 4242 4242 4242" required>
                                </div>
                                <div class="row g-3 mb-3">
                                    <div class="col-md-6">
                                        <label for="expiryDate" class="form-label">Expiry Date</label>
                                        <input type="text" class="form-control" id="expiryDate" placeholder="MM/YY" required>
                                    </div>
                                    <div class="col-md-6">
                                        <label for="cvv" class="form-label">CVV</label>
                                        <input type="text" class="form-control" id="cvv" placeholder="123" required>
                                    </div>
                                </div>
                            </form>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button type="submit" form="checkoutForm" class="btn btn-primary">Place Order</button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Add modal to DOM
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        const modal = new bootstrap.Modal(document.getElementById('checkoutModal'));

        // Handle form submission
        document.getElementById('checkoutForm').addEventListener('submit', (e) => {
            e.preventDefault();
            processPayment();
        });

        // Show modal
        modal.show();

        // Clean up when modal is closed
        document.getElementById('checkoutModal').addEventListener('hidden.bs.modal', () => {
            document.getElementById('checkoutModal').remove();
        });
    };

    // Process payment (mock)
    const processPayment = () => {
        // Show loading state
        const submitBtn = document.querySelector('#checkoutForm [type="submit"]');
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Processing...';

        // Simulate API call
        setTimeout(() => {
            // For demo purposes, we'll just show a success message
            document.getElementById('checkoutModal').remove();
            
            // Show success notification
            const successHTML = `
                <div class="alert alert-success alert-dismissible fade show position-fixed top-0 start-50 translate-middle-x mt-3" role="alert" style="z-index: 9999;">
                    <i class="bi bi-check-circle-fill me-2"></i>
                    <strong>Order placed successfully!</strong> Thank you for your purchase.
                    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                </div>
            `;
            
            document.body.insertAdjacentHTML('beforeend', successHTML);
            
            // Clear cart
            cart = [];
            saveCart();
            updateCartUI();
            
            // Auto-remove alert after 5 seconds
            setTimeout(() => {
                const alert = document.querySelector('.alert-success');
                if (alert) {
                    const bsAlert = new bootstrap.Alert(alert);
                    bsAlert.close();
                }
            }, 5000);
        }, 2000);
    };

    // Calculate cart subtotal
    const calculateSubtotal = () => {
        return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    };

    // Update cart UI elements
    const updateCartUI = () => {
        // Update cart count badge
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        cartCount.textContent = totalItems;
        cartCount.classList.toggle('d-none', totalItems === 0);
    };

    // Update cart display in cart section
    const updateCartDisplay = () => {
        if (cart.length === 0) {
            emptyCart.classList.remove('d-none');
            cartItemsContainer.classList.add('d-none');
            return;
        }

        emptyCart.classList.add('d-none');
        cartItemsContainer.classList.remove('d-none');

        // Calculate totals
        const subtotal = calculateSubtotal();
        const total = subtotal + shippingCost;

        // Update totals in UI
        cartSubtotal.textContent = `$${subtotal.toFixed(2)}`;
        cartShipping.textContent = `$${shippingCost.toFixed(2)}`;
        cartTotal.textContent = `$${total.toFixed(2)}`;

        // Render cart items
        cartItems.innerHTML = '';
        cart.forEach(item => {
            const itemRow = document.createElement('tr');
            itemRow.className = 'cart-item';
            itemRow.innerHTML = `
                <td>
                    <div class="d-flex align-items-center">
                        <img src="${item.image}" alt="${item.name}" class="img-thumbnail me-3" style="width: 60px; height: 60px; object-fit: cover;">
                        <div>
                            <h6 class="mb-0">${item.name}</h6>
                            <small class="text-muted">$${item.price.toFixed(2)}</small>
                        </div>
                    </div>
                </td>
                <td>$${item.price.toFixed(2)}</td>
                <td>
                    <div class="input-group input-group-sm" style="width: 120px;">
                        <button class="btn btn-outline-secondary quantity-decrease" data-product-id="${item.id}">
                            <i class="bi bi-dash"></i>
                        </button>
                        <input type="number" class="form-control text-center quantity-input" 
                            value="${item.quantity}" min="1" max="10" 
                            data-product-id="${item.id}">
                        <button class="btn btn-outline-secondary quantity-increase" data-product-id="${item.id}">
                            <i class="bi bi-plus"></i>
                        </button>
                    </div>
                </td>
                <td>$${(item.price * item.quantity).toFixed(2)}</td>
                <td>
                    <button class="btn btn-sm btn-outline-danger remove-from-cart" data-product-id="${item.id}">
                        <i class="bi bi-trash"></i>
                    </button>
                </td>
            `;

            cartItems.appendChild(itemRow);

            // Add event listeners
            itemRow.querySelector('.quantity-decrease').addEventListener('click', () => {
                updateItemQuantity(item.id, item.quantity - 1);
            });

            itemRow.querySelector('.quantity-increase').addEventListener('click', () => {
                updateItemQuantity(item.id, item.quantity + 1);
            });

            itemRow.querySelector('.quantity-input').addEventListener('change', (e) => {
                const newQuantity = parseInt(e.target.value);
                if (!isNaN(newQuantity)) {
                    updateItemQuantity(item.id, newQuantity);
                }
            });

            itemRow.querySelector('.remove-from-cart').addEventListener('click', () => {
                removeFromCart(item.id);
            });
        });
    };



    // Animate cart update
    const animateCartUpdate = () => {
        gsap.from(cartItems, {
            duration: 0.3,
            opacity: 0.5,
            y: 10,
            ease: "power2.out"
        });
    };

    // Public API
    return {
        init,
        addToCart,
        removeFromCart,
        updateItemQuantity,
        updateCartDisplay,
        updateCartUI
    };
})();

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', Cart.init);