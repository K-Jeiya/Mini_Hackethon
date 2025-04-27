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