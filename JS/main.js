// Main Application Module
const App = (() => {
    // DOM Elements
    const DOM = {
        productsSection: document.getElementById('products-section'),
        authSection: document.getElementById('auth-section'),
        cartSection: document.getElementById('cart-section'),
        homeLink: document.getElementById('home-link'),
        productsLink: document.getElementById('products-link'),
        cartBtn: document.getElementById('cart-btn'),
        authButtons: document.getElementById('auth-buttons'),
        userInfo: document.getElementById('user-info'),
        userEmail: document.getElementById('user-email'),
        loginBtn: document.getElementById('login-btn'),
        signupBtn: document.getElementById('signup-btn'),
        logoutBtn: document.getElementById('logout-btn'),
        continueShopping: document.getElementById('continue-shopping')
    };

    // Initialize the application
    const init = () => {
        // Initialize Firebase
        initializeFirebase();
        
        // Initialize modules
        Auth.init();
        Products.init();
        Cart.init();
        
        // Set up event listeners
        setupEventListeners();
        
        // Check auth state
        checkAuthState();
        
        // Show products by default
        showSection(DOM.productsSection);
    };

    // Initialize Firebase
    const initializeFirebase = () => {
        try {
            // Firebase initialization is done in firebase.js
            console.log("Firebase initialized successfully");
            
            // Check if sample data needs to be added
            addSampleDataIfNeeded();
        } catch (error) {
            console.error("Firebase initialization error:", error);
            showErrorNotification("Failed to initialize Firebase services");
        }
    };

    // Add sample data if Firestore is empty
    const addSampleDataIfNeeded = async () => {
        const productsRef = firebase.firestore().collection('products');
        const snapshot = await productsRef.limit(1).get();
        
        if (snapshot.empty) {
            console.log("Adding sample products to Firestore");
            const batch = firebase.firestore().batch();
            
            sampleProducts.forEach(product => {
                const docRef = productsRef.doc();
                batch.set(docRef, {
                    ...product,
                    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                    updatedAt: firebase.firestore.FieldValue.serverTimestamp()
                });
            });
            
            await batch.commit();
            console.log("Sample products added successfully");
        }
    };

    // Sample product data
    const sampleProducts = [
        {
            name: "Premium Wireless Headphones",
            description: "Industry-leading noise cancellation with 30-hour battery life.",
            price: 299.99,
            originalPrice: 349.99,
            image: "https://cdn.pixabay.com/photo/2018/09/17/14/27/headphones-3683983_1280.jpg",
            category: "electronics",
            featured: true,
            stock: 15,
            rating: 4.8,
            discount: 15
        },
        {
            name: "Smart Fitness Watch",
            description: "Track your workouts, heart rate, and sleep patterns.",
            price: 199.99,
            image: "https://cdn.pixabay.com/photo/2015/06/25/17/21/smart-watch-821557_1280.jpg",
            category: "electronics",
            stock: 8,
            rating: 4.5
        },
        {
            name: "Organic Cotton T-Shirt",
            description: "100% organic cotton, available in multiple colors.",
            price: 29.99,
            originalPrice: 39.99,
            image: "https://cdn.pixabay.com/photo/2016/11/23/06/57/isolated-t-shirt-1852114_1280.png",
            category: "clothing",
            stock: 42,
            rating: 4.2,
            discount: 25
        },
        {
            name: "Stainless Steel Water Bottle",
            description: "Keeps drinks cold for 24 hours or hot for 12 hours.",
            price: 24.99,
            image: "https://cdn.pixabay.com/photo/2017/03/22/17/39/kitchen-2165756_1280.jpg",
            category: "home",
            stock: 0,
            rating: 4.7
        }
    ];

    // Set up event listeners
    const setupEventListeners = () => {
        // Navigation
        DOM.homeLink.addEventListener('click', (e) => {
            e.preventDefault();
            showSection(DOM.productsSection);
        });
        
        DOM.productsLink.addEventListener('click', (e) => {
            e.preventDefault();
            showSection(DOM.productsSection);
        });
        
        DOM.cartBtn.addEventListener('click', (e) => {
            e.preventDefault();
            showSection(DOM.cartSection);
            Cart.updateCartDisplay();
        });
        
        DOM.continueShopping.addEventListener('click', (e) => {
            e.preventDefault();
            showSection(DOM.productsSection);
        });
        
        // Auth state changes
        firebase.auth().onAuthStateChanged(user => {
            if (user) {
                // User is signed in
                DOM.authButtons.classList.add('d-none');
                DOM.userInfo.classList.remove('d-none');
                DOM.userEmail.textContent = user.email;
            } else {
                // User is signed out
                DOM.authButtons.classList.remove('d-none');
                DOM.userInfo.classList.add('d-none');
                DOM.userEmail.textContent = '';
            }
        });
    };

    // Check authentication state
    const checkAuthState = () => {
        firebase.auth().onAuthStateChanged(user => {
            if (user) {
                console.log("User is signed in:", user.email);
            } else {
                console.log("User is signed out");
            }
        });
    };

    // Show specified section
    const showSection = (section) => {
        // Hide all sections first
        DOM.productsSection.classList.add('d-none');
        DOM.authSection.classList.add('d-none');
        DOM.cartSection.classList.add('d-none');
        
        // Show the requested section
        section.classList.remove('d-none');
        
        // Special cases
        if (section === DOM.productsSection) {
            Products.loadProducts();
        }
        
        if (section === DOM.cartSection) {
            Cart.updateCartDisplay();
        }
    };

    // Show error notification
    const showErrorNotification = (message) => {
        const notification = document.createElement('div');
        notification.className = 'alert alert-danger position-fixed top-0 end-0 m-3';
        notification.style.zIndex = '9999';
        notification.style.minWidth = '300px';
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            notification.classList.add('animate__animated', 'animate__fadeOut');
            setTimeout(() => notification.remove(), 500);
        }, 5000);
    };

    // Public API
    return {
        init,
        showSection,
        showErrorNotification
    };
})();

// Initialize the application when DOM is fully loaded
document.addEventListener('DOMContentLoaded', App.init);

// Make App available globally for debugging
window.App = App;