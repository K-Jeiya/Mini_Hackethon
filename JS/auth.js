// Authentication Module
const Auth = (() => {
    // DOM Elements
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    const loginEmail = document.getElementById('login-email');
    const loginPassword = document.getElementById('login-password');
    const loginSubmit = document.getElementById('login-submit');
    const loginError = document.getElementById('login-error');
    const signupEmail = document.getElementById('signup-email');
    const signupPassword = document.getElementById('signup-password');
    const signupConfirm = document.getElementById('signup-confirm');
    const signupSubmit = document.getElementById('signup-submit');
    const signupError = document.getElementById('signup-error');
    const logoutBtn = document.getElementById('logout-btn');
    const authButtons = document.getElementById('auth-buttons');
    const userInfo = document.getElementById('user-info');
    const userEmail = document.getElementById('user-email');
  
    // Initialize auth module
    const init = () => {
      setupEventListeners();
      checkAuthState();
    };
  
    // Set up event listeners
    const setupEventListeners = () => {
      // Login form submission
      loginSubmit.addEventListener('click', (e) => {
        e.preventDefault();
        handleLogin();
      });
  
      // Signup form submission
      signupSubmit.addEventListener('click', (e) => {
        e.preventDefault();
        handleSignup();
      });
  
      // Logout button
      logoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        handleLogout();
      });
  
      // Switch between login/signup forms
      document.getElementById('switch-to-signup').addEventListener('click', (e) => {
        e.preventDefault();
        loginForm.classList.add('d-none');
        signupForm.classList.remove('d-none');
      });
  
      document.getElementById('switch-to-login').addEventListener('click', (e) => {
        e.preventDefault();
        signupForm.classList.add('d-none');
        loginForm.classList.remove('d-none');
      });
    };
  
    // Handle login
    const handleLogin = () => {
      const email = loginEmail.value.trim();
      const password = loginPassword.value.trim();
  
      if (!email || !password) {
        showError(loginError, 'Please fill in all fields');
        return;
      }
  
      // Show loading state
      loginSubmit.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Logging in...';
      loginSubmit.disabled = true;
  
      firebase.auth().signInWithEmailAndPassword(email, password)
        .then(() => {
          // Success - handled by auth state listener
        })
        .catch(error => {
          showError(loginError, getAuthErrorMessage(error));
        })
        .finally(() => {
          loginSubmit.innerHTML = 'Login';
          loginSubmit.disabled = false;
        });
    };
  
    // Handle signup
    const handleSignup = () => {
      const email = signupEmail.value.trim();
      const password = signupPassword.value.trim();
      const confirm = signupConfirm.value.trim();
  
      // Validation
      if (!email || !password || !confirm) {
        showError(signupError, 'Please fill in all fields');
        return;
      }
  
      if (password !== confirm) {
        showError(signupError, 'Passwords do not match');
        return;
      }
  
      if (password.length < 6) {
        showError(signupError, 'Password must be at least 6 characters');
        return;
      }
  
      // Show loading state
      signupSubmit.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Creating account...';
      signupSubmit.disabled = true;
  
      firebase.auth().createUserWithEmailAndPassword(email, password)
        .then(() => {
          // Success - handled by auth state listener
        })
        .catch(error => {
          showError(signupError, getAuthErrorMessage(error));
        })
        .finally(() => {
          signupSubmit.innerHTML = 'Sign Up';
          signupSubmit.disabled = false;
        });
    };
  
    // Handle logout
    const handleLogout = () => {
      firebase.auth().signOut()
        .then(() => {
          console.log('User signed out');
        })
        .catch(error => {
          console.error('Sign out error:', error);
        });
    };
  
    // Check auth state
    const checkAuthState = () => {
      firebase.auth().onAuthStateChanged(user => {
        if (user) {
          // User is signed in
          authButtons.classList.add('d-none');
          userInfo.classList.remove('d-none');
          userEmail.textContent = user.email;
          
          // Hide auth forms if visible
          document.getElementById('auth-section').classList.add('d-none');
          
          // Show products section
          document.getElementById('products-section').classList.remove('d-none');
        } else {
          // User is signed out
          authButtons.classList.remove('d-none');
          userInfo.classList.add('d-none');
          userEmail.textContent = '';
        }
      });
    };
  
    // Show error message
    const showError = (element, message) => {
      element.textContent = message;
      element.classList.remove('d-none');
      element.classList.add('animate__animated', 'animate__headShake');
      
      setTimeout(() => {
        element.classList.remove('animate__animated', 'animate__headShake');
      }, 1000);
    };
  
    // Get friendly auth error messages
    const getAuthErrorMessage = (error) => {
      switch (error.code) {
        case 'auth/invalid-email':
          return 'Invalid email address';
        case 'auth/user-disabled':
          return 'Account disabled';
        case 'auth/user-not-found':
          return 'Account not found';
        case 'auth/wrong-password':
          return 'Incorrect password';
        case 'auth/email-already-in-use':
          return 'Email already in use';
        case 'auth/weak-password':
          return 'Password is too weak';
        default:
          return 'Authentication error. Please try again.';
      }
    };
  
    // Public API
    return {
      init
    };
  })();
  
  // Initialize when DOM is loaded
  document.addEventListener('DOMContentLoaded', Auth.init);