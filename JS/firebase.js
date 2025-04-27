// Firebase Configuration and Initialization
const firebaseConfig = {
    apiKey: "AIzaSyB-FZ7zlX-3knxMY5HqxpOlsDyQdBwVjFA",
    authDomain: "hackethon-24e95.firebaseapp.com",
    projectId: "hackethon-24e95",
    storageBucket: "hackethon-24e95.firebasestorage.app",
    messagingSenderId: "293215506564",
    appId: "1:293215506564:web:5b462488b5fe6afa83b2d1"
  };
  
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  
  // Initialize Firebase services
  const auth = firebase.auth();
  const db = firebase.firestore();
  
  // Enable offline persistence (optional but recommended)
  db.enablePersistence()
    .catch((err) => {
      console.log("Firebase persistence error:", err);
    });
  
  // Make available globally for debugging
  window.firebase = firebase;