import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.2/firebase-app.js";
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.0.2/firebase-storage.js";
import { getDatabase, ref, remove, push, get, update, onValue, child, set } from "https://www.gstatic.com/firebasejs/9.0.2/firebase-database.js";
import { getAuth, onAuthStateChanged, sendPasswordResetEmail, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/9.0.2/firebase-auth.js";
const firebaseConfig = {
  apiKey: "AIzaSyCi_hufIZTzsYtdPGQtvtmKmAkkrydmn_A",
authDomain: "abbah-83a7b.firebaseapp.com",
databaseURL: "https://abbah-83a7b-default-rtdb.firebaseio.com",
projectId: "abbah-83a7b",
storageBucket: "abbah-83a7b.appspot.com",
messagingSenderId: "379729759051",
appId: "1:379729759051:web:e75528d61b02d1e4f536ce",
measurementId: "G-H41J2WMR6S"
};

  const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth(app);
const storage = getStorage(app);
const loginForm = document.getElementById('loginForm');


let authToken; // Declare authToken in the global scope
// Your login form event listener
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const loginBtn = document.getElementById('loginBtn');
  
    try {
      // Show spinner in the login button
      loginBtn.innerHTML = '<i class="fa fa-spinner fa-spin"></i> Logging in...';
  
      // Firebase Authentication Sign-in
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
  
      // Generate a token with a 1-minute validity
      authToken = Math.random().toString(36).substring(2);
      const currentTime = new Date();
      const tokenExpiryTime = new Date(currentTime.getTime() + 24 * 60 * 60 * 1000); // Token valid for 24 hours
  
      // Store token and expiry time in local storage
      localStorage.setItem('authToken', authToken);
      localStorage.setItem('tokenExpiryTime', tokenExpiryTime.toString());
  
      console.log('Generated Token:', authToken);
  
      // Redirect after successful sign-in
      const storedLogoutPage = localStorage.getItem('logoutPage');
      window.location.href = storedLogoutPage || 'index.html'; // Redirect to stored page or 'index.html'
    } catch (error) {
      // Handle login errors, e.g., incorrect credentials
      console.error("Login error", error);
  
      // Reset the login button text
      loginBtn.innerHTML = 'Login';
  
      // Display error message to the user
      const errorContainer = document.createElement('p');
      errorContainer.classList.add('error-message');
      errorContainer.textContent = 'Incorrect email or password, try again...';
      // Append the error message to the form
      loginForm.appendChild(errorContainer);
  
      // Remove the error message after 5 seconds
      setTimeout(() => {
        errorContainer.style.display = 'none';
      }, 5000); // 5000 milliseconds = 5 seconds
    }
  });
  

// Event listener for the "Forgot Password" link
document.getElementById('forgotPasswordLink').addEventListener('click', function(event) {
    event.preventDefault();
    
    // Get the email entered by the user
    const email = document.getElementById('email').value;
    
    // Use Firebase sendPasswordResetEmail method with auth object
    sendPasswordResetEmail(auth, email)
      .then(() => {
        // Password reset email sent successfully
        alert(' A password reset email has been sent. Please check your inbox.');
      })
      .catch((error) => {
        // Password reset email failed to send
        const errorMessage = error.message;
        alert('Password reset email failed to send. ' + errorMessage);
      });
    });

    // Get the terms link and the modal
const termsLink = document.getElementById("termsLink");
const termsModal = document.getElementById("termsModal");

// When the user clicks the terms link, show the modal
termsLink.addEventListener("click", function(event) {
  event.preventDefault();
  termsModal.style.display = "block";
});

// When the user clicks the close button or outside the modal, hide the modal
const closeBtn = document.querySelector(".close");
window.addEventListener("click", function(event) {
  if (event.target === termsModal) {
    termsModal.style.display = "none";
  }
});

closeBtn.addEventListener("click", function() {
  termsModal.style.display = "none";
});
