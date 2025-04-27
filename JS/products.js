// Product Management Module
const Products = (() => {
    // DOM Elements
    const productsContainer = document.getElementById('products-container');
    const loader = document.getElementById('loader');
    const searchInput = document.getElementById('search-input');
    const categoryFilter = document.getElementById('category-filter');
    const sortOptions = document.getElementById('sort-options');
    
    // Current products data
    let products = [];
    let filteredProducts = [];
    
    // Animation settings
    const animationSettings = {
        staggerDelay: 0.1,
        cardAnimation: {
            duration: 0.6,
            ease: "power3.out"
        }
    };
    
    // Initialize products module
    const init = () => {
        loadProducts();
        setupEventListeners();
    };
    
    // Set up event listeners
    const setupEventListeners = () => {
        searchInput.addEventListener('input', debounce(loadProducts, 300));
        categoryFilter.addEventListener('change', loadProducts);
        sortOptions.addEventListener('change', loadProducts);
    };
    
    // Debounce function for search
    const debounce = (func, delay) => {
        let timeout;
        return function() {
            const context = this;
            const args = arguments;
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(context, args), delay);
        };
    };
    
    // Load products from Firestore
    const loadProducts = async () => {
        showLoader();
        
        try {
            const snapshot = await firebase.firestore().collection('products').get();
            products = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            
            filterAndSortProducts();
            renderProducts();
        } catch (error) {
            console.error("Error loading products:", error);
            showError();
        } finally {
            hideLoader();
        }
    };
    
    // Filter and sort products based on user selection
    const filterAndSortProducts = () => {
        // Filter by search query
        const searchQuery = searchInput.value.trim().toLowerCase();
        filteredProducts = products.filter(product => 
            !searchQuery || 
            product.name.toLowerCase().includes(searchQuery) || 
            product.description.toLowerCase().includes(searchQuery)
        );
        
        // Filter by category
        const category = categoryFilter.value;
        if (category) {
            filteredProducts = filteredProducts.filter(
                product => product.category === category
            );
        }
        
        // Sort products
        const sort = sortOptions.value;
        switch(sort) {
            case 'price-asc':
                filteredProducts.sort((a, b) => a.price - b.price);
                break;
            case 'price-desc':
                filteredProducts.sort((a, b) => b.price - a.price);
                break;
            case 'name-asc':
                filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
                break;
            default:
                // Default sort (by featured or newest)
                filteredProducts.sort((a, b) => 
                    (b.featured || 0) - (a.featured || 0) || 
                    (b.createdAt || 0) - (a.createdAt || 0)
                );
        }
    };
    
    // Render products to the DOM
    const renderProducts = () => {
        productsContainer.innerHTML = '';
        
        if (filteredProducts.length === 0) {
            productsContainer.innerHTML = `
                <div class="col-12 text-center py-5">
                    <div class="empty-state">
                        <i class="bi bi-search display-4 text-muted mb-3"></i>
                        <h3 class="mb-2">No products found</h3>
                        <p class="text-muted">Try adjusting your search or filter criteria</p>
                        <button class="btn btn-outline-primary mt-3" id="reset-filters">
                            Reset Filters
                        </button>
                    </div>
                </div>
            `;
            
            document.getElementById('reset-filters').addEventListener('click', () => {
                searchInput.value = '';
                categoryFilter.value = '';
                sortOptions.value = 'default';
                loadProducts();
            });
            
            return;
        }
        
        // Animate products in with staggered delay
        filteredProducts.forEach((product, index) => {
            const productCard = createProductCard(product);
            productsContainer.appendChild(productCard);
            
            // Initial state for animation
            gsap.from(productCard, {
                opacity: 0,
                y: 30,
                duration: animationSettings.cardAnimation.duration,
                ease: animationSettings.cardAnimation.ease,
                delay: index * animationSettings.staggerDelay
            });
        });
    };
    
    // Create product card HTML element
    const createProductCard = (product) => {
        const productCard = document.createElement('div');
        productCard.className = 'col-md-4 col-sm-6 mb-4 product-card-wrapper';
        productCard.innerHTML = `
            <div class="card product-card h-100">
                <div class="product-image-container">
                    <img src="${product.image}" class="card-img-top" alt="${product.name}" 
                        onerror="this.src='https://via.placeholder.com/300?text=Product+Image'">
                    ${product.featured ? '<span class="featured-badge">Featured</span>' : ''}
                    ${product.discount ? `<span class="discount-badge">-${product.discount}%</span>` : ''}
                </div>
                <div class="card-body d-flex flex-column">
                    <div class="d-flex justify-content-between align-items-start mb-2">
                        <h5 class="card-title mb-0">${product.name}</h5>
                        <div class="rating">
                            ${createRatingStars(product.rating || 0)}
                        </div>
                    </div>
                    <p class="card-text text-muted small mb-3">${product.description.substring(0, 80)}${product.description.length > 80 ? '...' : ''}</p>
                    
                    <div class="mt-auto">
                        <div class="d-flex justify-content-between align-items-center mb-3">
                            <div>
                                <span class="price h5">$${product.price.toFixed(2)}</span>
                                ${product.originalPrice ? 
                                    `<span class="original-price text-muted text-decoration-line-through ms-2">
                                        $${product.originalPrice.toFixed(2)}
                                    </span>` : ''
                                }
                            </div>
                            <span class="stock-status ${product.stock > 0 ? 'in-stock' : 'out-of-stock'}">
                                ${product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                            </span>
                        </div>
                        
                        <div class="d-flex gap-2">
                            <button class="btn btn-outline-primary flex-grow-1 view-product" 
                                data-product-id="${product.id}">
                                <i class="bi bi-eye"></i> Details
                            </button>
                            <button class="btn btn-primary flex-grow-1 add-to-cart" 
                                data-product-id="${product.id}"
                                ${product.stock > 0 ? '' : 'disabled'}>
                                <i class="bi bi-cart-plus"></i> Add
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Add event listeners
        productCard.querySelector('.view-product').addEventListener('click', () => {
            viewProductDetails(product);
        });
        
        if (product.stock > 0) {
            productCard.querySelector('.add-to-cart').addEventListener('click', () => {
                addToCart(product);
                animateAddToCart(productCard);
            });
        }
        
        return productCard;
    };
    
    // Create rating stars HTML
    const createRatingStars = (rating) => {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
        
        let stars = '';
        
        // Full stars
        stars += '<i class="bi bi-star-fill text-warning"></i>'.repeat(fullStars);
        
        // Half star
        if (hasHalfStar) {
            stars += '<i class="bi bi-star-half text-warning"></i>';
        }
        
        // Empty stars
        stars += '<i class="bi bi-star text-warning"></i>'.repeat(emptyStars);
        
        return stars;
    };
    
    // View product details
    const viewProductDetails = (product) => {
        // This would open a modal or navigate to product page
        console.log("Viewing product:", product);
        // You can implement modal opening here
    };
    
    // Animate add to cart action
    const animateAddToCart = (productCard) => {
        const cartBtn = document.getElementById('cart-btn');
        const clone = productCard.querySelector('.card').cloneNode(true);
        
        clone.style.position = 'fixed';
        clone.style.width = productCard.querySelector('.card').offsetWidth + 'px';
        clone.style.height = productCard.querySelector('.card').offsetHeight + 'px';
        clone.style.top = productCard.getBoundingClientRect().top + 'px';
        clone.style.left = productCard.getBoundingClientRect().left + 'px';
        clone.style.zIndex = '1000';
        clone.style.pointerEvents = 'none';
        clone.style.transformOrigin = 'center center';
        
        document.body.appendChild(clone);
        
        const cartBtnRect = cartBtn.getBoundingClientRect();
        const targetX = cartBtnRect.left + cartBtnRect.width / 2;
        const targetY = cartBtnRect.top + cartBtnRect.height / 2;
        
        gsap.to(clone, {
            x: targetX - productCard.getBoundingClientRect().left - clone.offsetWidth / 2,
            y: targetY - productCard.getBoundingClientRect().top - clone.offsetHeight / 2,
            scale: 0.2,
            opacity: 0.8,
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
    };
    
    // Show loader
    const showLoader = () => {
        loader.classList.remove('d-none');
        productsContainer.classList.add('d-none');
    };
    
    // Hide loader
    const hideLoader = () => {
        loader.classList.add('d-none');
        productsContainer.classList.remove('d-none');
    };
    
    // Show error state
    const showError = () => {
        productsContainer.innerHTML = `
            <div class="col-12 text-center py-5">
                <div class="error-state">
                    <i class="bi bi-exclamation-triangle-fill display-4 text-danger mb-3"></i>
                    <h3 class="mb-2">Error Loading Products</h3>
                    <p class="text-muted">Please try again later</p>
                    <button class="btn btn-outline-primary mt-3" id="retry-loading">
                        <i class="bi bi-arrow-repeat"></i> Retry
                    </button>
                </div>
            </div>
        `;
        
        document.getElementById('retry-loading').addEventListener('click', loadProducts);
    };
    
    // Public API
    return {
        init,
        getProductById: (id) => products.find(p => p.id === id)
    };
})();

// Initialize products module when DOM is loaded
document.addEventListener('DOMContentLoaded', Products.init);