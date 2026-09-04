import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.2/firebase-app.js";
import { getDatabase, ref,remove, push,get, onValue,child,set } from "https://www.gstatic.com/firebasejs/9.0.2/firebase-database.js";
import { getAuth, onAuthStateChanged,sendPasswordResetEmail , signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/9.0.2/firebase-auth.js";
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
const auth = getAuth(app); // Initialize Firebase Authentication


    
// Ensure that authToken is defined in the global scope
let authToken;
let tokenExpiryTime;

// Function to generate a token valid for 24 hours
function generateToken() {
authToken = Math.random().toString(36).substring(2);
const currentTime = new Date();
const tokenExpiryTime = new Date(currentTime.getTime() + 24 * 60 * 60 * 1000); // Token valid for 24 hours

// Store token and expiry time in local storage
localStorage.setItem('authToken', authToken);
localStorage.setItem('tokenExpiryTime', tokenExpiryTime.toString());
}


// Function to retrieve token and its expiry time from local storage
function retrieveTokenFromLocalStorage() {
authToken = localStorage.getItem('authToken');
const storedExpiryTime = localStorage.getItem('tokenExpiryTime');
if (authToken && storedExpiryTime) {
  tokenExpiryTime = new Date(storedExpiryTime);
}
}

// Function to check if the token is still valid
function isTokenValid() {
const currentTime = new Date();
return tokenExpiryTime > currentTime;
}

window.addEventListener('load', function() {
  retrieveTokenFromLocalStorage(); // Retrieve token from local storage
  // Check if token is valid, if not, redirect to the login page
  if (!isTokenValid()) {
    window.location.href = 'login.html'; // Replace 'login.html' with the URL of your login page
  }
});


// Rest of your code...


// Disable right-click when the popup is displayed
document.addEventListener('contextmenu', function(event) {
if (document.getElementById('loginpopup').style.display === 'block') {
  event.preventDefault();
}
document.addEventListener('keydown', function(event) {
if (event.keyCode === 123) {
  event.preventDefault();
}
});

});
const allowedEmails = ['biboofficial256@gmail.com']; // Add the allowed email addresses here

// Show a loader inside the submit button when it's clicked
document.getElementById('loginForm').addEventListener('submit', function(event) {
event.preventDefault(); // Prevent default form submission

// Show loader inside the submit button
const submitBtn = document.getElementById('submitBtn');
submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting';

// Get user credentials from the form
const email = document.getElementById('email').value;
const password = document.getElementById('password').value;

// Update the login success block to generate a new token and store it
signInWithEmailAndPassword(auth, email, password)
.then((userCredential) => {
  // Check if the user's email is allowed
  if (allowedEmails.includes(email)) {
    // Login successful, hide the login overlay and popup
    document.getElementById('loginoverlay').style.display = 'none';
    document.getElementById('loginpopup').style.display = 'none';
    generateToken(); // Generate a new token on successful login
    } else {
      // Login not allowed, show an error message
      const errorContainer = document.getElementById('errorContainer');
      errorContainer.textContent = 'Access denied. You are not authorized.';
      errorContainer.style.display = 'block'; // Show the message
      // Log out the user since they are not authorized
      signOut(auth)
        .then(() => {
          // Reset the submit button text after a short delay (e.g., 2 seconds)
          setTimeout(function() {
            submitBtn.innerHTML = 'Submit';
          }, 2000);
        })
        .catch((error) => {
          console.error('Error signing out:', error);
        });
    }
  })
  .catch((error) => {
    // Login failed, display error message
    const errorMessage = error.message;
    const errorContainer = document.getElementById('errorContainer');
    errorContainer.textContent = errorMessage;
    errorContainer.style.display = 'block'; // Show the message

    // Reset the submit button text after a short delay (e.g., 2 seconds)
    setTimeout(function() {
      submitBtn.innerHTML = 'Submit';
    }, 2000);
  });
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
    showMessage(' A password reset email has been sent. Please check your inbox.');
  })
  .catch((error) => {
    // Password reset email failed to send
    const errorMessage = error.message;
    alert('Password reset email failed to send. ' + errorMessage);
  });
});
// Function to display a message with optional retry button and success flag
function displayMessage(title, message, isSuccess = false) {
// Clear existing messages
const existingMessages = document.querySelectorAll('.retry-message');
existingMessages.forEach(function (message) {
  message.remove();
});

// Create a div element for the message
const messageDiv = document.createElement('div');
messageDiv.classList.add('retry-message'); // Add the class for styling

// Set background color to green for success message
if (isSuccess) {
  messageDiv.style.backgroundColor = '#4caf50';
}

// Create close button element
const closeButton = document.createElement('button');
closeButton.classList.add('close-btn');
closeButton.innerHTML = '<i class="fa fa-times"></i>';
closeButton.addEventListener('click', function () {
  messageDiv.remove();
});

// Create title element
const titleElement = document.createElement('h2');
titleElement.textContent = title;

// Create message element
const messageElement = document.createElement('p');
messageElement.textContent = message;

// Append title, message, and close button to the message div
messageDiv.appendChild(titleElement);
messageDiv.appendChild(messageElement);
//messageDiv.appendChild(closeButton);

// Append the message div to the document body
document.body.appendChild(messageDiv);

// Automatically remove the message after 5 seconds (5000 milliseconds)
setTimeout(function () {
  messageDiv.remove();
}, 1500);
}
// Function to display user information
function displayUserInformation(user) {
// Set the h2 element text to the user's display name
const profileName = document.querySelector('.profile_info h2');
profileName.textContent = user.displayName;

// Set the profile image source to the user's profile photo URL
const profileImage = document.querySelector('.profile_pic img');
profileImage.src = user.photoURL;

// Set the profile image in the dropdown menu
const dropdownProfileImage = document.querySelector('.user-profile img');
dropdownProfileImage.src = user.photoURL;

// Display success message
displayMessage('', `Welcome, ${user.displayName}.`, true); // Pass true for success message

// Reload the page content or perform any necessary actions for an authenticated user
}

// Function to handle sign-in success
function handleSignInSuccess(user) {
// Display user information
displayUserInformation(user);
}

// Function to handle sign-in error
function handleSignInError(error) {
console.error('Error signing in:', error);
// Display access denied message
displayMessage('Access Denied. Please sign in with a valid email.');
}

// Function to sign in with Google
function signInWithGoogle() {
var provider = new GoogleAuthProvider();
signInWithPopup(auth, provider)
  .then(function (result) {
    const user = result.user;
    handleSignInSuccess(user);
  })
  .catch(function (error) {
    handleSignInError(error);
  });
}

// Display the email sign-in popup on page load
window.addEventListener('load', function() {
auth.onAuthStateChanged(function(user) {
  if (user) {
    // User is signed in
    displayUserInformation(user);
  } else {
    // User is not signed in, display the sign-in popup
    signInWithGoogle();
  }
});
});

// Function to retry the sign-in process
function retryCallback() {
signInWithGoogle();
}






displayMessage('Signing in...', 'Please wait...', false); // Pass false for error message

// Add event listener to all links within the website
document.addEventListener('click', function(event) {
  const target = event.target;

  // Check if the clicked element is a link within the website
  if (target.tagName === 'A' && target.href.startsWith(window.location.origin)) {
    // Store the clicked link's URL in local storage
    localStorage.setItem('clickedLink', target.href);
  }
});

// Get the "Log Out" button element
const logoutButton = document.getElementById("logoutButton");
const overlay = document.getElementById("overlay");

// Add event listener to the "Log Out" button
logoutButton.addEventListener("click", function(event) {
  event.preventDefault();

  // Store the current page URL in local storage
  localStorage.setItem('logoutPage', window.location.href);

  // Store the clicked link's URL in local storage
  const clickedLink = localStorage.getItem('clickedLink');
  if (clickedLink) {
    localStorage.setItem('logoutPage', clickedLink);
  }

  // Display overlay with spinner and text
  displayOverlay();

  // Simulate logout delay (you can replace this with your actual logout logic)
  setTimeout(() => {
    // Perform logout
    logOut();

    // Hide overlay after logout is complete
    hideOverlay();
  }, 2000);
});

function displayOverlay() {
  // Create spinner element
  const spinner = document.createElement('div');
  spinner.id = 'loadingSpinner';
  overlay.appendChild(spinner);

  // Create "Logging Out" text element
  const loggingOutText = document.createElement('div');
  loggingOutText.id = 'loggingOutText';
  loggingOutText.textContent = 'Logging Out...';
  overlay.appendChild(loggingOutText);

  // Display overlay
  overlay.style.display = 'flex';
}

function hideOverlay() {
  // Remove spinner and text elements from overlay
  const spinner = document.getElementById('loadingSpinner');
  const loggingOutText = document.getElementById('loggingOutText');
  overlay.removeChild(spinner);
  overlay.removeChild(loggingOutText);

  // Hide overlay
  overlay.style.display = 'none';
}


// Function to log out
function logOut() {
  auth.signOut()
    .then(function() {
      // Clear the login token and other stored values
      localStorage.removeItem('authToken');
      localStorage.removeItem('tokenExpiryTime');
      localStorage.removeItem('clickedLink');

      // Redirect to the stored page URL (either clicked link or current page)
      const logoutPage = localStorage.getItem('logoutPage') || 'login.html';
      window.location.href = logoutPage;
    })
    .catch(function(error) {
      console.error('Error signing out:', error);
    });
}
// ---------------- Toggle Buttons ----------------
const toggleMedicineBtn = document.getElementById('toggleMedicineBtn');
const toggleHistoryBtn = document.getElementById('toggleHistoryBtn');
const historyContainer = document.getElementById('inventoryHistory');

toggleMedicineBtn.addEventListener('click', () => {
  patientsContainer.style.display = 'block';
  historyContainer.style.display = 'none';
});

toggleHistoryBtn.addEventListener('click', async () => {
  // Ask for password before showing history
  const REQUIRED_PASSWORD = 'sanyu44'; // set your password here
  const userPassword = prompt('Enter password to view inventory history:');

  if (userPassword !== REQUIRED_PASSWORD) {
    alert('❌ Incorrect password.');
    return;
  }

  // Password correct — show history
  patientsContainer.style.display = 'none';
  historyContainer.style.display = 'block';
  await loadInventoryHistory();
});


function formatFirebaseTimestamp(ts) {
  // Replace the last part with proper colons for time
  // Example: 2025-10-25T13-33-31-886Z -> 2025-10-25T13:33:31.886Z
  const iso = ts.replace(/T(\d{2})-(\d{2})-(\d{2})-(\d+)/, 'T$1:$2:$3.$4');
  return new Date(iso).toLocaleString();
}


// ---------- Add filter section above cards ----------
const filterHTML = `
  <div id="filterSection" style="
      display:flex; flex-wrap:wrap; gap:10px; justify-content:flex-start;
      margin-bottom:20px; padding:15px; background:#fff;
      border-radius:8px; box-shadow:0 4px 8px rgba(0,0,0,0.1); align-items:center;
  ">
    <label for="startDate">Start Date:</label>
    <input type="date" id="startDate" style="padding:5px; border-radius:4px; border:1px solid #ccc;" />
    <label for="endDate">End Date:</label>
    <input type="date" id="endDate" style="padding:5px; border-radius:4px; border:1px solid #ccc;" />
    <button id="filterPeriodBtn" style="
        padding:5px 10px; border:none; border-radius:5px; background:#007bff; color:#fff; cursor:pointer;
        transition: background 0.3s;
      " 
      onmouseover="this.style.background='#0056b3'" 
      onmouseout="this.style.background='#007bff'">
      Apply Filter
    </button>
  </div>
`;
historyContainer.insertAdjacentHTML('beforebegin', filterHTML);

// ---------- Filter button ----------
document.getElementById('filterPeriodBtn').addEventListener('click', () => {
  const startDate = document.getElementById('startDate').value;
  const endDate = document.getElementById('endDate').value;
  loadInventoryHistory(startDate, endDate);
});

// ---------- Load Inventory History ----------
async function loadInventoryHistory(startDate, endDate) {
  historyContainer.innerHTML = 'Loading...';
  try {
    const dbSnapshot = await get(ref(database, 'InventoryHistory'));
    const medSnapshot = await get(ref(database, 'medicine'));

    if (!dbSnapshot.exists()) {
      historyContainer.innerHTML = '<p>No inventory history available.</p>';
      return;
    }

    const historyData = dbSnapshot.val();
    const medicineData = medSnapshot.exists() ? medSnapshot.val() : {};

    // ---------- Compute totals ----------
    let totalStock = 0, totalRevenue = 0, estimatedIncome = 0;
    const medicineSales = {};

    Object.keys(medicineData).forEach(medName => {
      const stock = Number(medicineData[medName]?.parents) || 0;
      totalStock += stock;
      const keahPrice = medicineData[medName]?.insurancePrices?.keah || 0;
      estimatedIncome += stock * keahPrice;
    });

    Object.keys(historyData).forEach(medName => {
      const medHistory = historyData[medName];
      let soldQty = 0;
      const keahPrice = medicineData[medName]?.insurancePrices?.keah || 0;

      Object.keys(medHistory).forEach(ts => {
        const sales = medHistory[ts].sales || {};
        Object.values(sales).forEach(sale => {
          const saleDate = new Date(sale.date);
          let include = true;
          if (startDate) include = include && (saleDate >= new Date(startDate));
          if (endDate) include = include && (saleDate <= new Date(endDate + 'T23:59:59'));
          if (include) soldQty += Number(sale.quantity) || 0;
        });
      });

      medicineSales[medName] = soldQty;
      totalRevenue += soldQty * keahPrice;
    });

    // ---------- Top Selling ----------
    const topSelling = Object.keys(medicineSales)
      .sort((a,b) => medicineSales[b]-medicineSales[a])
      .slice(0,3);

    // ---------- Display Summary Cards ----------
    let cardsHTML = `
      <div style="display:flex; gap:20px; margin-bottom:20px; flex-wrap:wrap;">
        <div style="flex:1; min-width:200px; padding:15px; background:#f0f8ff; border-radius:8px; box-shadow:0 4px 6px rgba(0,0,0,0.1); text-align:center;">
          <div style="font-size:30px;">📦</div>
          <h3>Total Stock</h3>
          <p style="font-size:20px; font-weight:bold;">${totalStock}</p>
        </div>
        <div style="flex:1; min-width:200px; padding:15px; background:#f9f9f9; border-radius:8px; box-shadow:0 4px 6px rgba(0,0,0,0.1); text-align:center;">
          <div style="font-size:30px;">💰</div>
          <h3>Total Revenue Dispensed</h3>
          <p style="font-size:20px; font-weight:bold;">UG.SHS ${totalRevenue.toLocaleString()}</p>
        </div>
        <div style="flex:1; min-width:200px; padding:15px; background:#fff8dc; border-radius:8px; box-shadow:0 4px 6px rgba(0,0,0,0.1); text-align:center;">
          <div style="font-size:30px;">📈</div>
          <h3>Estimated Income</h3>
          <p style="font-size:20px; font-weight:bold;">UG.SHS ${estimatedIncome.toLocaleString()}</p>
        </div>
        <div style="flex:1; min-width:200px; padding:15px; background:#e6f7ff; border-radius:8px; box-shadow:0 4px 6px rgba(0,0,0,0.1); text-align:center;">
          <div style="font-size:30px;">🏆</div>
          <h3>Top Selling</h3>
          <ul style="list-style:none; padding:0; margin:0;">`;
    topSelling.forEach(med => {
      cardsHTML += `<li style="margin:5px 0; font-weight:bold;">${med} - ${medicineSales[med]} sold</li>`;
    });
    cardsHTML += `</ul></div></div>`;

    historyContainer.innerHTML = cardsHTML;

    // ---------- Render Table ----------
    let tableHTML = `
      <table border="1" cellpadding="5" cellspacing="0" style="width:100%; border-collapse:collapse;">
        <thead style="background:#f2f2f2;">
          <tr>
            <th>Medicine Name</th>
            <th>Number of History Entries</th>
            <th>Quantity Sold</th>
            <th>Highly Selling Rate</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>`;

    const sortedMeds = Object.keys(medicineSales).sort((a,b) => medicineSales[b]-medicineSales[a]);

    sortedMeds.forEach(medName => {
      const medHistory = historyData[medName];
      if (!medHistory) return;
      const filteredSnapshots = Object.keys(medHistory).filter(ts => {
        const sales = medHistory[ts].sales || {};
        return Object.values(sales).some(sale => {
          const saleDate = new Date(sale.date);
          let include = true;
          if (startDate) include = include && (saleDate >= new Date(startDate));
          if (endDate) include = include && (saleDate <= new Date(endDate + 'T23:59:59'));
          return include;
        });
      });

      const totalSold = medicineSales[medName];
      const days = startDate && endDate ? (new Date(endDate)-new Date(startDate))/(1000*60*60*24)+1 : 1;
      const dailyRate = (totalSold/days).toFixed(2);
      let color = 'green';
      if (dailyRate > 50) color='red';
      else if (dailyRate > 20) color='orange';

      tableHTML += `
        <tr>
          <td>${medName}</td>
          <td>${filteredSnapshots.length}</td>
          <td>${totalSold}</td>
          <td style="color:${color}; font-weight:bold;">${dailyRate}/day</td>
          <td><button class="view-history-btn" data-med="${medName}">VIEW</button></td>
        </tr>`;
    });

    tableHTML += '</tbody></table>';
    historyContainer.innerHTML += tableHTML;

  } catch(err){
    console.error('Error loading inventory history:', err);
    historyContainer.innerHTML = '<p>Error loading inventory history.</p>';
  }
}



// ---------------- View History Details (Snapshot + Sales Table) ----------------
historyContainer.addEventListener('click', async (e) => {
  if (!e.target.classList.contains('view-history-btn')) return;
  const medName = e.target.dataset.med;

  try {
    const snapshot = await get(ref(database, `InventoryHistory/${medName}`));
    if (!snapshot.exists()) {
      alert('No history found for this medicine.');
      return;
    }

    const medHistory = snapshot.val();

    // ---------------- Build popup HTML ----------------
    let detailsHTML = `
      <div style="text-align:center;">
        <img src="sanyu.png" alt="Hospital Logo" style="width:120px; margin-bottom:10px;">
        <h2>Inventory History Report: ${medName}</h2>
        <p>Print Date: ${new Date().toLocaleString()}</p>
      </div>
    `;
   // Add print & close buttons
    detailsHTML += `<div style="text-align:center; margin-top:10px;">
                      <button id="printHistoryBtn">Print</button>
                      <button id="closePopupBtn">Close</button>
                    </div>`;
    Object.keys(medHistory).forEach(timestamp => {
      const entry = medHistory[timestamp];

      // Format timestamp safely
      let formattedDate;
      try {
 formattedDate = formatFirebaseTimestamp(timestamp);
      } catch {
        formattedDate = timestamp;
      }

      detailsHTML += `
        <div class="snapshot-container" style="border:1px solid #ccc; margin-bottom:10px; border-radius:5px; overflow:hidden;">
          <div class="snapshot-header" style="background:#f2f2f2; padding:8px; cursor:pointer; font-weight:bold;">
            Snapshot: ${formattedDate} (click to toggle)
          </div>
          <div class="snapshot-body" style="padding:10px; max-height:1000px; overflow:hidden; transition:max-height 0.3s ease;">
      `;

 // Mapping for friendly column names
const columnLabels = {
  'name': 'Medicine Name',
  'dob': 'Date of Expiry',
  'dos': 'Date of Stock',
  'parents': 'Parents',
  'supplier': 'Supplier',
  'measurement': 'Measurement',
  'costPrice': 'Cost Price',
  'insurancePrices.apa': 'APA Price',
  'insurancePrices.ga': 'GA Price',
  'insurancePrices.keah': 'KEAH Price'
};

// Flatten object (skip sales)
const flattened = {};
const flattenObject = (obj, parentKey = '') => {
  Object.entries(obj).forEach(([key, value]) => {
    const newKey = parentKey ? `${parentKey}.${key}` : key;
    if (typeof value === 'object' && value !== null && key !== 'sales') {
      flattenObject(value, newKey);
    } else if (key !== 'sales') {
      flattened[newKey] = value;
    }
  });
};
flattenObject(entry);

// Generate table with friendly headers
detailsHTML += `<table border="1" cellpadding="5" cellspacing="0" style="width:100%; border-collapse:collapse; margin-bottom:10px;">
                  <tr style="background:#f2f2f2;">`;

Object.keys(flattened).forEach(col => {
  const label = columnLabels[col] || col; // use mapping, fallback to original key
  detailsHTML += `<th>${label}</th>`;
});

detailsHTML += `</tr><tr>`;
Object.values(flattened).forEach(val => {
  detailsHTML += `<td>${val}</td>`;
});
detailsHTML += `</tr></table>`;


      // Sales table
      if (entry.sales) {
        detailsHTML += `<h4>Sales:</h4>
          <table border="1" cellpadding="5" cellspacing="0" style="width:100%; border-collapse:collapse; margin-bottom:20px;">
            <tr style="background:#d9edf7;">
              <th>Date</th>
              <th>Provider</th>
              <th>Quantity</th>
              <th>Unit Price</th>
              <th>Total Cost</th>
            </tr>`;
        Object.values(entry.sales).forEach(sale => {
          detailsHTML += `<tr>
                            <td>${sale.date}</td>
                            <td>${sale.provider}</td>
                            <td>${sale.quantity}</td>
                            <td>${sale.unitPrice}</td>
                            <td>${sale.totalCost}</td>
                          </tr>`;
        });
        detailsHTML += `</table>`;
      }

      detailsHTML += `</div></div>`; // close snapshot-body & container
    });

 

    // ---------------- Create popup with fade-in ----------------
    const popup = document.createElement('div');
    popup.style.position = 'fixed';
    popup.style.top = '0';
    popup.style.left = '0';
    popup.style.width = '100%';
    popup.style.height = '100%';
    popup.style.background = 'rgba(0,0,0,0.5)';
    popup.style.display = 'flex';
    popup.style.justifyContent = 'center';
    popup.style.alignItems = 'center';
    popup.style.opacity = '0';
    popup.style.zIndex = '99999'; // ensures popup is on top of everything
    popup.style.transition = 'opacity 0.3s ease';
    popup.innerHTML = `<div style="background:#fff; padding:20px; border:1px solid #000; max-height:95vh; overflow-y:auto; width:95%;">${detailsHTML}</div>`;
    document.body.appendChild(popup);
    requestAnimationFrame(() => popup.style.opacity = '1'); // fade in

    // Close popup
    document.getElementById('closePopupBtn').addEventListener('click', () => {
      popup.style.opacity = '0';
      setTimeout(() => document.body.removeChild(popup), 300);
    });

    // Collapse/expand snapshots
    popup.querySelectorAll('.snapshot-header').forEach(header => {
      header.addEventListener('click', () => {
        const body = header.nextElementSibling;
        if (!body.style.maxHeight || body.style.maxHeight === '0px') {
          body.style.maxHeight = body.scrollHeight + 'px';
        } else {
          body.style.maxHeight = '0px';
        }
      });
    });
// ---------------- Print independent ----------------
document.getElementById('printHistoryBtn').addEventListener('click', async () => {
  try {
    const snapshot = await get(ref(database, `InventoryHistory/${medName}`));
    if (!snapshot.exists()) {
      alert('No history found for printing.');
      return;
    }
    const medHistory = snapshot.val();

    // Mapping for friendly column names
    const columnLabels = {
      'name': 'Medicine Name',
      'dob': 'Date of Expiry',
      'dos': 'Date of Stock',
      'parents': 'Parents',
      'supplier': 'Supplier',
      'measurement': 'Measurement',
      'costPrice': 'Cost Price',
      'insurancePrices.apa': 'APA Price',
      'insurancePrices.ga': 'GA Price',
      'insurancePrices.keah': 'KEAH Price'
    };

    // Prepare independent print HTML
    let printHTML = `
      <html><head><title>Inventory History - ${medName}</title>
      <style>
        body { font-family: Arial, sans-serif; padding:20px; }
        table { border-collapse: collapse; width:100%; margin-bottom:15px; }
        th, td { border:1px solid #000; padding:5px; text-align:left; }
        th { background:#f2f2f2; }
        .sales-table th { background:#d9edf7; }
        h1,h2,h3,h4 { margin:5px 0; }
      </style>
      </head><body>
      <div style="text-align:center;">
        <img src="sanyu.png" alt="Hospital Logo" style="width:120px; margin-bottom:10px;">
        <h1>SANYU HOSPITAL </h1>
        <h2>Inventory History Report: ${medName}</h2>
        <p>Print Date: ${new Date().toLocaleString()}</p>
      </div>
    `;

    // Loop through snapshots
    Object.keys(medHistory).forEach(timestamp => {
      const entry = medHistory[timestamp];
      let formattedDate;
      try { 
 formattedDate = formatFirebaseTimestamp(timestamp);
      } catch { 
        formattedDate = timestamp; 
      }

      // Flatten non-sales data
      const flattened = {};
      const flattenObject = (obj, parentKey='') => {
        Object.entries(obj).forEach(([key, value]) => {
          const newKey = parentKey ? `${parentKey}.${key}` : key;
          if (typeof value === 'object' && value !== null && key !== 'sales') {
            flattenObject(value, newKey);
          } else if (key !== 'sales') {
            flattened[newKey] = value;
          }
        });
      };
      flattenObject(entry);

      // Medicine table
      printHTML += `<h3>Snapshot: ${formattedDate}</h3>`;
      printHTML += `<table border="1" cellpadding="5" cellspacing="0"><tr>`;
      Object.keys(flattened).forEach(col => {
        const label = columnLabels[col] || col; // use friendly label
        printHTML += `<th>${label}</th>`;
      });
      printHTML += `</tr><tr>`;
      Object.values(flattened).forEach(val => printHTML += `<td>${val}</td>`);
      printHTML += `</tr></table>`;

      // Sales table
      if(entry.sales){
        printHTML += `<h4>Sales:</h4>
          <table border="1" cellpadding="5" cellspacing="0" class="sales-table">
            <tr><th>Date</th><th>Provider</th><th>Quantity</th><th>Unit Price</th><th>Total Cost</th></tr>`;
        Object.values(entry.sales).forEach(sale => {
          printHTML += `<tr>
                          <td>${sale.date}</td>
                          <td>${sale.provider}</td>
                          <td>${sale.quantity}</td>
                          <td>${sale.unitPrice}</td>
                          <td>${sale.totalCost}</td>
                        </tr>`;
        });
        printHTML += `</table>`;
      }
    });

    printHTML += `</body></html>`;

    const printWindow = window.open('', '', 'width=1000,height=800');
    printWindow.document.write(printHTML);
    printWindow.document.close();
    printWindow.print();

  } catch(err){
    console.error('Error printing inventory history:', err);
    alert('Error generating printout.');
  }
});

  } catch (err) {
    console.error('Error fetching history details:', err);
    alert('Error fetching history details.');
  }
});




const form = document.querySelector('.popup-form');
const submitButton = document.querySelector('.popup-form button');
const patientsContainer = document.getElementById('patients');
let patients = []; // Declare patients variable outside the event listener
form.addEventListener('submit', async function (e) {
  e.preventDefault();

  // ✅ Collect form inputs
  const name = document.getElementById('name').value.trim();
  const dob = document.getElementById('dob').value.trim();
  const parents = document.getElementById('parents').value.trim();
  const dos = document.getElementById('dos').value.trim();
  const supplier = document.getElementById('supplier').value.trim();
  const measurement = document.querySelector('input[name="measurement"]:checked')?.value || '';

  // ✅ Insurance prices
  const keah = parseFloat(document.getElementById('keahPrice').value) || 0;
  const apa = parseFloat(document.getElementById('apaPrice').value) || 0;
  const ga = parseFloat(document.getElementById('gaPrice').value) || 0;

  // ✅ Data to update
  const updatedData = {
    name,
    dob,
    parents,
    dos,
    supplier,
    measurement,
    insurancePrices: {
      apa,
      ga,
      keah
    }
  };

  const medRef = ref(database, 'medicine/' + name);

  try {
    const snapshot = await get(medRef);

    if (snapshot.exists()) {
      const existingData = snapshot.val();

      // ✅ 1️⃣ Backup existing node into /history/
      const timestamp = new Date().toISOString().replace(/[.:]/g, '-');
      const historyRef = ref(database, `medicine/${name}/history/${timestamp}`);
      await set(historyRef, existingData);

      // ✅ 2️⃣ Update only changed fields (non-destructive)
      await update(medRef, updatedData);

      showMessage('✅ Medicine updated without overwriting. Old version saved in history.');
    } else {
      // ✅ Create new record if it doesn’t exist
      await set(medRef, updatedData);
      showMessage('✅ New medicine added successfully.');
    }

    form.reset();
  } catch (error) {
    console.error('Error saving medicine:', error);
    showMessage('❌ Failed to save medicine. Try again.');
  }
});



// Add event listener to search button
searchButton.addEventListener('click', () => {
const searchTerm = searchInput.value.trim(); // Get the search term

// Show the loader
loaderElement.classList.remove('hidden');

// Clear the patients container
patientsContainer.innerHTML = '';

// Search through Firebase for patient names by key
const patientsRef = ref(database, 'medicine');
onValue(patientsRef, (snapshot) => {
  const patientsData = snapshot.val();
  const searchResults = [];

  if (patientsData) {
    const patients = Object.values(patientsData);

    if (searchTerm !== '') {
      // Filter patients based on the search term
      patients.forEach(patient => {
        if (patient.name.toLowerCase().includes(searchTerm.toLowerCase())) {
          searchResults.push(patient);
        }
      });
    } else {
      // Display all patients if the search term is empty
      searchResults.push(...patients);
    }
  }

  // Hide the loader
  loaderElement.classList.add('hidden');

  // Display search results
  if (searchResults.length > 0) {
    renderPatients(searchResults);
  } else {
    patientsContainer.innerHTML = '<p class="no-results">No medicine found.</p>';
  }
});
});





// Function to filter patients based on the search term
function filterPatients(patients, searchTerm) {
const filteredPatients = patients.filter((patient) => {
  const patientName = patient.name.toLowerCase();
  return patientName.includes(searchTerm.toLowerCase());
});
renderPatients(filteredPatients);
}

// Add event listener to search input for live search
searchInput.addEventListener('input', () => {
  const searchTerm = searchInput.value.trim().toLowerCase();

  // Get all table rows except the header
  const tableRows = patientsContainer.querySelectorAll('table tr:not(:first-child)');

  tableRows.forEach(row => {
    const patientName = row.querySelector('td').textContent.toLowerCase();
    if (patientName.includes(searchTerm)) {
      row.style.display = ''; // show row
    } else {
      row.style.display = 'none'; // hide row
    }
  });
});


// Define the sellProductForm variable outside the renderPatients function

patientsContainer.innerHTML = '';

const sellProductForm = document.getElementById('sellProductForm2');
// Event listener for form submission
sellProductForm.addEventListener('submit', handleSellProductSubmit);

function renderPatients(patients) {
const table = document.createElement('table');
table.classList.add('patient-table');

// Create table headers
const headers = ['Name','Add', 'Rmg Stock', 'Expiry', 'Stock lvl', 'D.O.S', 'Initial Stock','Cost Price (Ugx)','Price @Piece',   'Est. Revenue','Supplier', 'Actions'];
const headerRow = document.createElement('tr')
headers.forEach((headerText) => {
  const th = document.createElement('th');
  th.textContent = headerText;
  headerRow.appendChild(th);
});
table.appendChild(headerRow);

const alertMessages = [];
let popupDisplayed = false; // Flag to track if the popup has already been displayed

const alertCategories = [
  { categoryName: 'Almost Expired', messages: [] },
  { categoryName: 'Out of Stock', messages: [] },
  { categoryName: 'Expired', messages: [] }
];

patients.forEach((patient) => {
  const row = document.createElement('tr');

  // Name
  const nameCell = document.createElement('td');
  nameCell.textContent = patient.name;
  row.appendChild(nameCell);
// Remaining Stock
const initialStock = parseInt(patient.parents);
let remainingStock;
if (patient.hasOwnProperty('sales')) {
const salesNode = patient.sales;
let totalSalesQuantity = 0;
for (const saleKey in salesNode) {
  const saleQuantity = parseInt(salesNode[saleKey].quantity);
  if (!isNaN(saleQuantity)) {
    totalSalesQuantity += saleQuantity;
  }
}
remainingStock = initialStock - totalSalesQuantity;
} else {
remainingStock = initialStock;
}
const remainingStockCell = document.createElement('td');
remainingStockCell.textContent = `${remainingStock} pcs`;
remainingStockCell.classList.add('remaining-stock-cell')
const addStockCell = document.createElement('td');

// Create the "Add More Stock" button
const addMoreStockButton = document.createElement('button');
addMoreStockButton.textContent = 'Add';
addMoreStockButton.classList.add('add-stock-button'); // Add a class for styling if needed
addMoreStockButton.addEventListener('click', async function () {
  const password = prompt('Enter password to proceed:');
  const correctPassword = 'sanyu44'; // replace with your actual password

  if (password !== correctPassword) {
    alert('❌ Incorrect password. Action canceled.');
    return; // stop execution
  }

  const medicineName = row.querySelector('td:nth-child(1)').textContent.trim();
  const database = getDatabase();
  const medicineRef = ref(database, 'medicine/' + medicineName);

  try {
    const snapshot = await get(medicineRef);

    if (!snapshot.exists()) {
      showMessage('❌ No details found for this medicine.');
      return;
    }

    const data = snapshot.val();

    // ---------------- Save copy under global "InventoryHistory" node ----------------
    const timestamp = new Date().toISOString().replace(/[.:]/g, '-'); // safe Firebase key
    const historyRef = ref(database, `InventoryHistory/${medicineName}/${timestamp}`);
    await set(historyRef, data);

    // ---------------- Fill form with current medicine details ----------------
    document.getElementById('name').value = data.name || '';
    document.getElementById('dob').value = data.dob || '';
    document.getElementById('parents').value = data.parents || '';
    document.getElementById('dos').value = data.dos || '';
    document.getElementById('supplier').value = data.supplier || '';
    document.getElementById('costPrice').value = data.costPrice || '';

    if (data.measurement) {
      const measurementRadio = document.querySelector(`input[name="measurement"][value="${data.measurement}"]`);
      if (measurementRadio) measurementRadio.checked = true;
    }

    if (data.insurancePrices) {
      document.getElementById('keahPrice').value = data.insurancePrices.keah || '';
      document.getElementById('apaPrice').value = data.insurancePrices.apa || '';
      document.getElementById('gaPrice').value = data.insurancePrices.ga || '';
    }

    // ---------------- Open popup ----------------
    popupOverlay.style.visibility = 'visible';
    popupOverlay.style.opacity = '1';

    showMessage('✅ Medicine details loaded and snapshot saved in InventoryHistory.');
  } catch (error) {
    console.error('Error fetching medicine details:', error);
    showMessage('❌ Error fetching medicine details.');
  }
});

// Append the button to the cell
addStockCell.appendChild(addMoreStockButton);

// Add click event listener to the popup close button
popupClose.addEventListener('click', function () {
  popupOverlay.style.visibility = 'hidden';
  popupOverlay.style.opacity = '0';
});




// Append the button to the cell
addStockCell.appendChild(addMoreStockButton);

// Append the cell to the row
row.appendChild(addStockCell);

row.appendChild(remainingStockCell);

// Expiry
const expiryDate = new Date(patient.dob);
const currentDate = new Date();
const daysRemaining = Math.floor((expiryDate - currentDate) / (1000 * 60 * 60 * 24));
const expiryCell = document.createElement('td');

if (daysRemaining >= 0) {
  expiryCell.textContent = `${daysRemaining}`;
  if (daysRemaining < 5) {
    // Add alert message for medicine almost expiring
    const alertMessage = `${patient.name} is almost expiring! Days remaining: ${daysRemaining}`;
    alertCategories[0].messages.push(alertMessage);
  }
} else {
  expiryCell.textContent = 'Expired';
  expiryCell.style.backgroundColor = 'red'; // Change cell background color to red for expired medicine
  expiryCell.style.color = 'white';
  
  // Show popup alert for expired medicine
  const alertMessage = `${patient.name}`;
  alertCategories[2].messages.push(alertMessage);
}


row.appendChild(expiryCell);


// Out of Stock
if (remainingStock === 0) {
  const outOfStockCell = document.createElement('td');
  outOfStockCell.textContent = 'Out of Stock';
  outOfStockCell.style.backgroundColor = 'red'; // Change cell background color to red for out of stock medicine
  outOfStockCell.style.color = 'white';
  row.appendChild(outOfStockCell);

  // Add alert message for out of stock medicine
  const alertMessage = `${patient.name}`;
  alertMessages.push(alertMessage);
  alertCategories[1].messages.push(alertMessage);
} else {
  const stockLevelCell = document.createElement('td');
  if (remainingStock < 20) {
    stockLevelCell.textContent = 'Low Stock';
    stockLevelCell.style.backgroundColor = 'yellow'; // Change cell background color to yellow for low stock medicine
  } else {
    stockLevelCell.textContent = 'In Stock';
  }
  row.appendChild(stockLevelCell);


  // Only show the alert if there are real messages and if the popup has not been displayed yet
  const hasMessages = alertCategories.some(category => category.messages.length > 0);

  if (hasMessages && !popupDisplayed) {
    showAlert(alertCategories);
    popupDisplayed = true; // Set the flag to indicate the popup has been displayed
  }

}


// --- Date of Stock ---
const dosCell = document.createElement('td');
dosCell.textContent = patient.dos || '-';
row.appendChild(dosCell);

// --- Initial Stock ---
const initialStockCell = document.createElement('td');
initialStockCell.textContent = `${initialStock} pcs`;
initialStockCell.classList.add('stock-cell');
row.appendChild(initialStockCell);

// --- Get selected provider from localStorage or default to 'keah' ---
const providerSelect = document.getElementById('providerSelect');
let selectedProvider = localStorage.getItem('selectedProvider') || 'keah';
providerSelect.value = selectedProvider;


const costPriceCell = document.createElement('td');
costPriceCell.textContent = patient.costPrice || '—';
row.appendChild(costPriceCell);

// --- Price Per Piece ---
const priceCell = document.createElement('td');
priceCell.classList.add('price-per-piece-cell');

// Save all price variants in dataset (match DB keys)
priceCell.dataset.keah = patient.insurancePrices?.keah || 0;
priceCell.dataset.apa = patient.insurancePrices?.apa || 0;
priceCell.dataset.ga = patient.insurancePrices?.ga || 0;

// Display selected provider price by default
const defaultPrice = parseFloat(priceCell.dataset[selectedProvider]) || 0;
priceCell.textContent = `${defaultPrice}.00`;
row.appendChild(priceCell);

// --- Estimated Revenue ---
const revenueCell = document.createElement('td');
revenueCell.classList.add('revenue-cell');

const estimatedRevenue = initialStock * defaultPrice;
revenueCell.textContent = `${estimatedRevenue.toLocaleString('en')}.00`;
row.appendChild(revenueCell);

function updatePrices(provider) {
  document.querySelectorAll('.price-per-piece-cell').forEach((cell) => {
    // Show spinner first
    cell.innerHTML = '<span class="spinner"></span>';

    const row = cell.closest('tr');
    const stockCell = row.querySelector('.stock-cell');
    const revenueCell = row.querySelector('.revenue-cell');

    if (stockCell && revenueCell) {
      // Show spinner in revenue too
      revenueCell.innerHTML = '<span class="spinner"></span>';

      // Simulate async update (optional, or just use setTimeout for UI effect)
      setTimeout(() => {
        const newPrice = parseFloat(cell.dataset[provider]) || 0;
        cell.textContent = `${newPrice}.00`;

        const stock = parseFloat(stockCell.textContent) || 0;
        const newRevenue = stock * newPrice;
        revenueCell.textContent = `${newRevenue.toLocaleString('en')}.00`;
      }, 200); // 200ms delay for effect
    }
  });
}


// --- Event listener ---
providerSelect.addEventListener('change', (e) => {
  const newProvider = e.target.value;
  localStorage.setItem('selectedProvider', newProvider);
  updatePrices(newProvider);
});

// --- Apply saved/default provider on page load ---
updatePrices(selectedProvider);



 // Date of Stock
  const supplier = document.createElement('td');
  supplier.textContent = patient.supplier;
  row.appendChild(supplier);

  
  // Actions
  const actionsCell = document.createElement('td');
  const viewButton = document.createElement('button');
  viewButton.textContent = 'View';
  viewButton.classList.add('view-button');
  viewButton.addEventListener('click', function() {
    currentPatientName = patient.name; // Set the current patient name
    openPatientHistoryPopup(patient);
  });
  actionsCell.appendChild(viewButton);


// Create "Delete" Button
const deleteButton = document.createElement("button");
deleteButton.textContent = "Delete";
deleteButton.classList.add("delete-button");

// Style the button
deleteButton.style.backgroundColor = "#d9534f"; // Red color for delete button
deleteButton.style.color = "white";
deleteButton.style.border = "none";
deleteButton.style.padding = "5px 10px";
deleteButton.style.borderRadius = "5px";
deleteButton.style.cursor = "pointer";

// Use patient.name as the ID
deleteButton.addEventListener("click", function () {
  if (!patient.name) {
    console.error("Error: patient.name is undefined");
    return;
  }

  console.log("Delete button clicked for Medicine ID (Patient Name):", patient.name); // Debugging log

  // Ask for a password before deleting
  const password = prompt("Enter the password to confirm deletion:");

  if (password === "sanyu44") { // Replace with your actual password
    if (confirm(`Are you sure you want to delete ${patient.name}'s medicine?`)) {
      deleteMedicine(patient.name);  // Pass the patient name as the ID
    }
  } else {
    alert("Incorrect password. Deletion cancelled.");
  }
});


actionsCell.appendChild(deleteButton);

const deleteMedicine = (patientName) => {
  if (!patientName) {
    console.error("Error: patientName is undefined or null");
    return;
  }

  console.log("Deleting medicine record for:", patientName); // Debugging log

  const medicineRef = ref(database, `medicine/${patientName}`); // Use patientName as the key

  remove(medicineRef)
    .then(() => {
      alert(`Medicine record for ${patientName} deleted successfully.`);
      //location.reload(); // Refresh the page to update the list
    })
    .catch((error) => {
      console.error("Error deleting medicine record:", error);
      alert("Error deleting medicine. Please try again.");
    });
};

  const sellButton = document.createElement('button');
sellButton.textContent = 'Sell';
sellButton.classList.add('sell-button');
// Define a variable to store the "Grams Per Piece" value
let gramsPerPieceValue;
sellButton.addEventListener('click', function(event) {
  if (daysRemaining < 0) return alert(`${patient.name} has expired!`);
  if (remainingStock === 0) return alert(`${patient.name} is out of stock!`);

  const sellPopupOverlay = document.getElementById('sellPopupOverlay2');
  sellPopupOverlay.style.display = 'block';

  const pricePerPiece = parseFloat(row.querySelector('.price-per-piece-cell').textContent);
  const remainingStockValue = parseInt(row.querySelector('.remaining-stock-cell').textContent);

  const sellFormPatientName = document.getElementById('sellFormPatientName');
  const sellPiecesInput = document.getElementById('sellPieces');
  const sellTotalInput = document.getElementById('totalCost');

  sellFormPatientName.value = patient.name;

  // Prefill from existing cart
  const existingItem = cartItemsArray.find(item => item.patientName === patient.name);
  if (existingItem) {
    sellPiecesInput.value = existingItem.pieces;
    sellTotalInput.value = existingItem.totalCost.toFixed(2);
  } else {
    sellPiecesInput.value = '';
    sellTotalInput.value = '';
  }

  sellPiecesInput.oninput = function() {
    const pieces = parseFloat(sellPiecesInput.value);
    if (!isNaN(pieces) && pieces > 0) {
      const total = pieces * pricePerPiece;
      sellTotalInput.value = total.toFixed(2);
      addToCartButton.disabled = pieces > remainingStockValue;
      document.getElementById('sellPopupMessage').textContent = pieces > remainingStockValue ? 
        'Pieces are more than remaining stock' : '';
    } else {
      sellTotalInput.value = '';
    }
  };

  // Close popup
  document.getElementById('sellPopupClose2').onclick = function() {
    sellPopupOverlay.style.display = 'none';
    sellFormPatientName.value = '';
    sellPiecesInput.value = '';
    sellTotalInput.value = '';
    document.getElementById('sellPopupMessage').textContent = '';
  };
});

actionsCell.appendChild(sellButton);

// Get references to the elements
const sellPiecesInput = document.getElementById('sellPieces');

// Get references to cart-related elements
const openCartButton = document.getElementById('openCartButton');
const cartItems = document.getElementById('cartItems');
const itemCount = document.getElementById('itemCount');
const cartTotalElement = document.getElementById('cartTotal');
const cartPopup = document.getElementById('cartPopup');
const closeCartPopupButton = document.getElementById('closeCartPopupButton');

// Initialize cart count and total
let cartCount = 0;
let cartTotal = 0;
// Initialize an array to keep track of cart items
const cartItemsArray = [];
// Add an event listener to the "Open Cart" button
openCartButton.addEventListener('click', function () {
showCartPopup();
});

// Add an event listener to the "Close" button in the cart popup
closeCartPopupButton.addEventListener('click', function () {
closeCartPopup();
});


// Function to close the cart popup
function closeCartPopup() {
cartPopup.style.display = 'none';
}
function generateAndPrintReceipt(cartItemsArray) {
  // Get the selected billing mode text
  const providerSelect = document.getElementById('providerSelect');
  const selectedProviderText = providerSelect.options[providerSelect.selectedIndex].text;

  // Generate receipt content with billing mode
  const receiptContent = generateReceiptContent(cartItemsArray, selectedProviderText);

  // Open a new print window
  const printWindow = window.open('', '', 'width=800,height=700');
  printWindow.document.open();
  printWindow.document.write(`
    <html>
      <head>
        <title>Receipt</title>
        <style>
          /* Optional: you can include your receipt CSS here for better print formatting */
          body { margin: 0; padding: 0; font-family: 'Open Sans', sans-serif; }
        </style>
      </head>
      <body>
        ${receiptContent}
      </body>
    </html>
  `);
  printWindow.document.close();

  // Automatically trigger print
  printWindow.focus();
  printWindow.print();

  // Optionally close the print window after printing
  //printWindow.close();
}

function generateReceiptContent(cartItemsArray, billingMode) {
  // Compute total cost
  const totalCost = cartItemsArray.reduce((total, item) => total + item.totalCost, 0);

  // Create receipt header with hospital info
  const hospitalInfo = `
  <div class="hospital-info">
    <div class="hospital-logo">
      <img src="sanyu.png" alt="Hospital Logo">
    </div>
    <div class="hospital-details">
      <h1>SANYU HOSPITAL </h1>
      <p>Address: Located at Katooke-Wakiso District</p>
      <p>Phone: +256 782 477 517</p>
      <p>Email: info@keahmedicals.com</p>
    </div>
  </div>

  <style>
    @import url('https://fonts.googleapis.com/css2?family=Open+Sans:wght@300&display=swap');
    .receipt { font-family: 'Open Sans', sans-serif; max-width: 100%; margin: 0 auto; padding: 15px; }
    .hospital-logo img { width: 45%; display: block; margin: 0 auto; }
    .hospital-info, .hospital-details { text-align: center; margin: 0; padding: 0; }
    .hospital-details h1 { font-size: 22px; margin: 0; }
    .hospital-details p { font-size: 18px; margin: 1px 0; }
    .receipt-header { margin-top: 10px; }
    .receipt-header h2 { text-align: center; font-size: 20px; }
    .receipt-header p { font-size: 16px; margin: 3px 0; }
    .receipt-table { width: 100%; border-collapse: collapse; margin-top: 20px; }
    .receipt-table th, .receipt-table td { padding: 10px; border: 1px solid #ccc; font-size: 16px; text-align: left; }
    .receipt-footer { text-align: right; margin-top: 20px; font-size: 18px; font-weight: bold; }
    .billing-mode { margin-top: 10px; text-align: left; font-size: 16px; }
    .note { font-size: 14px; text-align: center; margin-top: 25px; font-style: italic; }
  </style>
  `;

  // Create receipt header with date, time, and billing mode
  const receiptHeader = `
    <div class="receipt-header">
      <h2>Medicine Purchase Receipt</h2>
      <p>Date: ${new Date().toLocaleDateString()}</p>
      <p>Time: ${new Date().toLocaleTimeString()}</p>
      <p class="billing-mode"><strong>Billing Mode:</strong> ${billingMode}</p>
    </div>
  `;

  // Receipt table for items
  const receiptTable = `
    <table class="receipt-table">
      <thead>
        <tr>
          <th>Medicine</th>
          <th>Pieces</th>
          <th>Cost (UGX)</th>
        </tr>
      </thead>
      <tbody>
        ${cartItemsArray.map(item => `
          <tr>
            <td>${item.patientName}</td>
            <td>${item.pieces}</td>
            <td>UGX ${item.totalCost.toLocaleString()}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;

  // Receipt footer with total cost
  const receiptFooter = `
    <div class="receipt-footer">
      Total Cost: UGX ${totalCost.toLocaleString()}
    </div>
  `;

  // Advisory note for patient
  const note = `
    <div class="note">
      Please take your medicine as prescribed by your healthcare provider.
    </div>
  `;

  // Combine everything
  const receiptContent = `
    <div class="receipt">
      ${hospitalInfo}
      ${receiptHeader}
      ${receiptTable}
      ${receiptFooter}
      ${note}
    </div>
  `;

  return receiptContent;
}

// Function to generate receipt rows from cart items
function generateReceiptRows(cartItemsArray) {
return cartItemsArray.map((item) => `
  <tr>
    <td>${item.patientName}</td>
    <td>${item.pieces}</td>
    <td>${item.totalCost}</td>
  </tr>
`).join('');
}
function showCartPopup() {
  cartPopup.style.display = 'block';

  // Clear previous content
  popupItems.innerHTML = '';

  // --- Billing Mode Display ---
  const billingWrapper = document.createElement('div');
  billingWrapper.classList.add('billing-mode-wrapper');

  const billingLabel = document.createElement('span');
  billingLabel.textContent = 'Billing Mode: ';

  const selectedProvider = document.getElementById('providerSelect').value;
  const providerText = document.querySelector(`#providerSelect option[value="${selectedProvider}"]`).textContent;

  const billingValue = document.createElement('strong');
  billingValue.textContent = providerText;

  billingWrapper.appendChild(billingLabel);
  billingWrapper.appendChild(billingValue);
  popupItems.appendChild(billingWrapper);

  // --- Cart Title ---
  const cartTitle = document.createElement('h2');
  cartTitle.textContent = 'Cart Items';
  cartTitle.classList.add('cart-title');
  popupItems.appendChild(cartTitle);

  // --- Cart Table ---
  const cartTable = document.createElement('table');
  cartTable.classList.add('cart-table');

  const thead = document.createElement('thead');
  const headerRow = document.createElement('tr');
  const headers = ['Medicine', 'Pieces', 'Total Cost (UGX)', 'Action'];
  headers.forEach(text => {
    const th = document.createElement('th');
    th.textContent = text;
    headerRow.appendChild(th);
  });
  thead.appendChild(headerRow);
  cartTable.appendChild(thead);

  const tbody = document.createElement('tbody');
  let cartTotalCost = 0;

  cartItemsArray.forEach(item => {
    const row = document.createElement('tr');

    // Medicine Name
    const nameCell = document.createElement('td');
    nameCell.textContent = item.patientName;
    row.appendChild(nameCell);

    // Pieces
    const piecesCell = document.createElement('td');
    piecesCell.textContent = item.pieces;
    row.appendChild(piecesCell);

    // Total Cost
    const costCell = document.createElement('td');
    costCell.textContent = `UGX ${item.totalCost.toLocaleString()}`;
    row.appendChild(costCell);

    // Action Buttons
    const actionCell = document.createElement('td');
    const deleteButton = document.createElement('button');
    deleteButton.classList.add('delete-btn');
    deleteButton.innerHTML = '<i class="fas fa-trash-alt"></i>';
    deleteButton.addEventListener('click', () => deleteCartItem(item));
    actionCell.appendChild(deleteButton);
    row.appendChild(actionCell);

    tbody.appendChild(row);

    cartTotalCost += item.totalCost;
  });

  // --- Total Row ---
  const totalRow = document.createElement('tr');
  totalRow.classList.add('total-row');

  const totalLabelCell = document.createElement('td');
  totalLabelCell.colSpan = 2;
  totalLabelCell.textContent = 'Overall Total Cost:';
  totalRow.appendChild(totalLabelCell);

  const totalCostCell = document.createElement('td');
  totalCostCell.colSpan = 2;
  totalCostCell.textContent = `UGX ${cartTotalCost.toLocaleString()}`;
  totalRow.appendChild(totalCostCell);

  tbody.appendChild(totalRow);
  cartTable.appendChild(tbody);
  popupItems.appendChild(cartTable);

  // --- Sell & Print Button ---
  const sellAllButton = document.createElement('button');
  sellAllButton.classList.add('sell-all-btn');
  sellAllButton.innerHTML = '<i class="fas fa-receipt"></i> Sell & Print Receipt';
  popupItems.appendChild(sellAllButton);

  sellAllButton.addEventListener('click', () => {
    sellAllButton.disabled = true;
    sellAllButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';

    // Pass billing mode to receipt
    generateAndPrintReceipt(cartItemsArray, selectedProvider);

    sellMedicinesInCart(cartItemsArray)
      .then(() => {
        sellAllButton.innerHTML = '<i class="fas fa-check"></i> Sold!';
        cartItemsArray.length = 0;
        itemCount.textContent = '0';
        showCartPopup();
      })
      .catch(err => {
        console.error('Error while selling:', err);
        sellAllButton.innerHTML = '<i class="fas fa-receipt"></i> Sell & Print Receipt';
        sellAllButton.disabled = false;
      });
  });

  // --- Update Cart Count ---
  cartCount = cartItemsArray.length;
  itemCount.textContent = cartCount;
}

// --- Delete Function ---
function deleteCartItem(item) {
  const index = cartItemsArray.indexOf(item);
  if (index !== -1) {
    cartItemsArray.splice(index, 1);
    showCartPopup();
  }
}


addToCartButton.addEventListener('click', function () {
  // Get the item details
  const patientName = document.getElementById('sellFormPatientName').value;
  const pieces = parseFloat(document.getElementById('sellPieces').value);
  const totalCost = parseFloat(document.getElementById('totalCost').value);
  const sellPopupClose = document.getElementById('sellPopupClose2');

  // Validate input
  if (!isNaN(pieces) && !isNaN(totalCost) && pieces > 0) {

    // Check if the item already exists in the cart
    const existingItem = cartItemsArray.find(item => item.patientName === patientName);

    if (existingItem) {
      // Increment pieces and total cost
      existingItem.pieces += pieces;
      existingItem.totalCost += totalCost;
    } else {
      // Add new item to cart
      cartItemsArray.push({
        patientName: patientName,
        pieces: pieces,
        totalCost: totalCost
      });
    }

    // Update cart count and total
    cartCount = cartItemsArray.length;
    itemCount.textContent = cartCount;

    cartTotal += totalCost;
    cartTotalElement.textContent = `UGX ${cartTotal.toLocaleString()}`;

    // Feedback animation
    addToCartButton.innerHTML = '<i class="fas fa-check-circle"></i> Added';
    addToCartButton.style.backgroundColor = 'orange';
    addToCartButton.disabled = true;

    setTimeout(() => {
      addToCartButton.innerHTML = '<i class="fas fa-shopping-cart"></i> Add to Cart';
      addToCartButton.style.backgroundColor = '';
      addToCartButton.disabled = false;

      if (sellPopupClose) sellPopupClose.click();
    }, 500);

  } else {
    alert('Please fill in valid values before adding to the cart.');
  }
});


row.appendChild(actionsCell);
  table.appendChild(row);
});

patientsContainer.innerHTML = '';
patientsContainer.appendChild(table);


}
function toggleAlert() {
  if (customAlert.style.display === 'block') {
    customAlert.style.display = 'none';
    minimizedIcon.style.display = 'block';
  } else {
    customAlert.style.display = 'block';
    minimizedIcon.style.display = 'none';
  }
}



function showAlert(reportMessages) {
  const customAlert = document.getElementById('customAlert');
  const categoryContainer = document.getElementById('categoryContainer');
  const customAlertButton = document.getElementById('customAlertButton');
  const minimizedIcon = document.getElementById('minimizedIcon');

  // Clear existing content in the categoryContainer
  categoryContainer.innerHTML = '';

  // Create a table element
  const table = document.createElement('table');
  table.classList.add('category-table');

  // Iterate through reportMessages to create table rows
  reportMessages.forEach(category => {
    const row = document.createElement('tr');

    // Create table cells for category name and messages
    const categoryNameCell = document.createElement('td');
    categoryNameCell.textContent = category.categoryName;

    const messagesCell = document.createElement('td');
    messagesCell.classList.add('messages-cell');

    // Populate messages cell with message paragraphs
    category.messages.forEach(message => {
      const messageParagraph = document.createElement('p');
      messageParagraph.textContent = message;
      messagesCell.appendChild(messageParagraph);
    });

    // Append cells to the row
    row.appendChild(categoryNameCell);
    row.appendChild(messagesCell);

    // Append the row to the table
    table.appendChild(row);
  });

  // Append the table to the categoryContainer
  categoryContainer.appendChild(table);

  // Show the popup and hide the minimized icon
  customAlert.style.display = 'block';
  minimizedIcon.style.display = 'none';

  // Add event listener to the customAlertButton to toggle visibility
  customAlertButton.addEventListener('click', toggleAlert);


  // Add event listener to the minimizedIcon to show the popup
  minimizedIcon.addEventListener('click', showPopup);

  function showPopup() {
    customAlert.style.display = 'block';
    minimizedIcon.style.display = 'none';
  }
}







async function sellMedicinesInCart(cart) {
const sellButton = document.querySelector('.add-to-cart-button');
sellButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';

if (cart.length === 0) {
  // All items in the cart have been sold
  sellButton.innerHTML = '<i class="fas fa-receipt"></i> Sell & Print Receipt';
  return;
}

// Get the first item from the cart
const item = cart[0];

try {
  await handleSellForMedicine(item);
  // Sale successful, remove the sold item from the cart
  cart.shift();
} catch (error) {
  // Handle errors, e.g., display an error message
  console.error('Error while selling:', error);
}

// Continue selling the remaining items in the cart
sellMedicinesInCart(cart);
}



function handleSellForMedicine(item) {
  // Get the input values from the form / cart item
  const sellFormPatientName = item.patientName;
  const piecesSold = item.pieces; // pieces from cart item
  const totalCost = item.totalCost || 0; // total cost from cart item

  // Compute unit price (guard against divide-by-zero)
  const unitPrice = piecesSold && piecesSold > 0 ? parseFloat((totalCost / piecesSold).toFixed(2)) : 0;

  // Billing provider selected in UI (fallback to 'keah')
  const selectedProvider = document.getElementById('providerSelect')?.value || 'keah';

  // Find medicine record in local patients array
  const patient = patients.find((p) => p.name === sellFormPatientName);

  if (!patient) {
    console.error('Medicine not found.');
    return;
  }

  // Convert patient.parents from string to number (initial stock)
  const initialStock = parseInt(patient.parents);

  // Check remaining stock using existing sales node if any
  if (patient.hasOwnProperty('sales')) {
    const salesNode = patient.sales;
    let totalSalesQuantity = 0;
    for (const saleKey in salesNode) {
      const saleQuantity = parseInt(salesNode[saleKey].quantity);
      if (!isNaN(saleQuantity)) totalSalesQuantity += saleQuantity;
    }
    const remainingStock = initialStock - totalSalesQuantity;
    if (piecesSold > remainingStock) {
      alert('Cannot sell beyond remaining stock.');
      return;
    }
  }

  // Proceed with adding the sale data to the database
  const patientSalesRef = push(ref(database, `medicine/${sellFormPatientName}/sales`));
  const saleId = patientSalesRef.key;

  // Timestamp, date and time
  const currentTime = new Date();
  const saleDate = `${(currentTime.getMonth() + 1).toString().padStart(2, '0')}/${currentTime.getDate().toString().padStart(2, '0')}/${currentTime.getFullYear().toString().slice(2)}`;
  const saleTime = new Date(currentTime).toLocaleTimeString();

  // Sale payload now includes price details and provider
  const salePayload = {
    saleId: saleId,
    quantity: piecesSold,
    unitPrice: unitPrice,
    totalCost: totalCost,
    provider: selectedProvider,
    date: saleDate,
    time: saleTime
  };

  set(patientSalesRef, salePayload)
    .then(() => {
      const successMessage = document.getElementById('sellSuccessMessage');
      successMessage.textContent = `Sale recorded successfully! (${piecesSold} pcs @ ${unitPrice} — Total: ${totalCost})`;
      successMessage.style.display = 'block';

      setTimeout(() => {
        successMessage.style.display = 'none';
        cartPopup.style.display = 'none';
      }, 2000);
    })
    .catch((error) => {
      console.error('Failed to add sale data:', error);
      alert('Error adding sale. Please try again.');
    });
}



function handleSellProductSubmit(e) {
e.preventDefault();

// Get the input values from the form
const sellFormPatientName = document.getElementById('sellFormPatientName').value;
const sellPiecesInput = document.getElementById('sellPieces');
const piecesSold = parseInt(sellPiecesInput.value, 10);

if (!isNaN(piecesSold) && piecesSold > 0) {
  // Assuming you already have access to the patients array
  const patient = patients.find((p) => p.name === sellFormPatientName);

  if (!patient) {
    // Patient not found, handle the error or show a message
    console.error('Medicine not found.');
    return;
  }

  // Convert patient.parents from string to number (initial stock)
  const initialStock = parseInt(patient.parents);

  // Check if the patient has a sales node
  if (patient.hasOwnProperty('sales')) {
    // Get the sales node of the current patient
    const salesNode = patient.sales;

    // Calculate the total sales quantity for the current patient
    let totalSalesQuantity = 0;

    // Loop through the properties of the sales node
    for (const saleKey in salesNode) {
      // Assuming each saleNode has a "quantity" property representing the sales quantity
      const saleQuantity = parseInt(salesNode[saleKey].quantity);
      if (!isNaN(saleQuantity)) {
        totalSalesQuantity += saleQuantity;
      }
    }

    // Calculate the remaining stock for the current patient
    const remainingStock = initialStock - totalSalesQuantity;

    if (piecesSold > remainingStock) {
      alert('Cannot sell beyond remaining stock.');
      return;
    }
  }

  // Proceed with adding the sale data to the database
  const patientSalesRef = push(ref(database, `medicine/${sellFormPatientName}/sales`));

// Generate a unique sale ID using the `key` method
const saleId = patientSalesRef.key;

  // Get the current timestamp
  const currentTime = new Date().getTime();

  // Format the timestamp into date and time
  const saleDate = new Date(currentTime).toLocaleDateString();
  const saleTime = new Date(currentTime).toLocaleTimeString();

  // Set the value of the new sale node including the quantity, date, and time
  set(patientSalesRef, {saleId: saleId, quantity: piecesSold, date: saleDate, time: saleTime })
    .then(() => {
      // Success: Sale data added to the database
      console.log('Sale added successfully with ID:', saleId);

      // Display a success message with the sale details
      const successMessage = document.getElementById('sellSuccessMessage');
      successMessage.textContent = `Sale recorded with  id ${saleId} successfully on ${saleDate} at ${saleTime}`;
      successMessage.style.display = 'block';
      setTimeout(() => {
        successMessage.style.display = 'none';
      }, 5000); // Hide the success message after 3 seconds
    })
    .catch((error) => {
      // Error occurred while adding sale data
      console.error('Failed to add sale data:', error);
      alert('Error adding sale. Please try again.');
    });

  // Close the sell popup
  const sellPopupOverlay = document.getElementById('sellPopupOverlay2');
  sellPopupOverlay.style.display = 'none';
} else {
  alert('Please enter a valid number of pieces to sell.');
}
}




// Define the addRecordForm and currentPatientName variables
const addRecordForm = document.getElementById('addRecordForm');
let currentPatientName = '';
function showMessage(message) {
const messageElement = document.getElementById('message');
messageElement.textContent = message;
messageElement.style.display = 'block';

// Hide the message after 4 seconds (4000 milliseconds)
setTimeout(() => {
  messageElement.style.display = 'none';
}, 4000);
}

// Call showMessage with an empty message to hide the message on page load
showMessage('');


// Attach the submit event listener outside the function
addRecordForm.addEventListener('submit', function (e) {
e.preventDefault();

const patientName = currentPatientName;
const testsTaken = document.getElementById('testsTaken').value;
const resultsObtained = document.getElementById('resultsObtained').value;
const medicationTaken = document.getElementById('medicationTaken').value;
const additionalNotes = document.getElementById('additionalNotes').value;

const recordData = {
  testsTaken: testsTaken,
  resultsObtained: resultsObtained,
  medicationTaken: medicationTaken,
  additionalNotes: additionalNotes
};


const patientRef = ref(database, `medicine/${patientName}`);
const newRecordRef = push(child(patientRef, 'history'));
set(newRecordRef, recordData)
  .then(() => {
    addRecordForm.reset();
    showMessage('Record added successfully!');
  })
  .catch((error) => {
    console.error('Error adding record:', error);
    showMessage('Error adding record. Please try again.');
  });
});

function openPatientHistoryPopup(patient) {
  const popupOverlay = document.getElementById('popupOverlay1');
  const popupClose = document.getElementById('popupClose1');
  const patientHistory = document.getElementById('patientHistory');

  // Clear existing patient history
  patientHistory.innerHTML = '';

  // Populate patient history in the popup
  // You can customize the format and content of the patient history here
  const patientHistoryContent = document.createElement('div');
  patientHistoryContent.innerHTML = `
    <p><strong>Name of Medicine:</strong> ${patient.name}</p>
    <p><strong>Date of Expiry:</strong> ${patient.dob}</p>
    <p><strong>Number of Pieces:</strong> ${patient.parents}</p>
    <p><strong>Date of Stock:</strong> ${patient.dos}</p>
    <p><strong>Medical History:</strong> ${patient.medicalHistory}</p>
  `;
  patientHistory.appendChild(patientHistoryContent);

  // Open the popup
  popupOverlay.style.visibility = 'visible';
  popupOverlay.style.opacity = '1';
// Close the add record popup
addRecordPopupOverlay.style.visibility = 'hidden';
addRecordPopupOverlay.style.opacity = '0';

  // Close the popup when the close button is clicked
  popupClose.addEventListener('click', function() {
    popupOverlay.style.visibility = 'hidden';
    popupOverlay.style.opacity = '0';
  });




const patientHistoryElement = document.getElementById('patientHistory');

// Retrieve and display the patient's history
const patientName = patient.name; // Replace this with the patient's name
const patientHistoryRef = ref(database, `medicine/${patientName}/history`);
onValue(patientHistoryRef, (snapshot) => {
patientHistoryElement.innerHTML = ''; // Clear previous records

if (snapshot.exists()) {
  snapshot.forEach((childSnapshot) => {
    const recordKey = childSnapshot.key;
    const record = childSnapshot.val();
    const recordElement = createRecordElement(recordKey, record);
    patientHistoryElement.appendChild(recordElement);
  });
} else {
  const noRecordsElement = document.createElement('p');
  noRecordsElement.textContent = 'No Records Found';
  noRecordsElement.style.fontStyle = 'italic';
  patientHistoryElement.appendChild(noRecordsElement);
}
});


// Function to create a record element
function createRecordElement(recordKey, record) {
const recordElement = document.createElement('div');
recordElement.classList.add('record');

const recordKeyElement = document.createElement('h4');
recordKeyElement.textContent = 'Record Key: ' + recordKey;
recordElement.appendChild(recordKeyElement);

const testsTakenElement = document.createElement('p');
testsTakenElement.textContent = 'Age Range: ' + record.testsTaken;
recordElement.appendChild(testsTakenElement);

const resultsObtainedElement = document.createElement('p');
resultsObtainedElement.textContent = 'Prescription: ' + record.resultsObtained;
recordElement.appendChild(resultsObtainedElement);

const medicationTakenElement = document.createElement('p');
medicationTakenElement.textContent = 'Works on (Treats): ' + record.medicationTaken;
recordElement.appendChild(medicationTakenElement);

const additionalNotesElement = document.createElement('p');
additionalNotesElement.textContent = 'Additional Notes: ' + record.additionalNotes;
recordElement.appendChild(additionalNotesElement);

// Create delete button
const deleteButton = document.createElement('button');
deleteButton.classList.add('delete-button');

// Create bin icon
const binIcon = document.createElement('i');
binIcon.classList.add('fa', 'fa-trash');

// Set the inner HTML of the delete button
deleteButton.innerHTML = '';
deleteButton.appendChild(binIcon);
deleteButton.innerHTML += ' Delete';


// Add click event listener to delete the record
deleteButton.addEventListener('click', () => {
  deleteRecord(recordKey);
});

// Append the delete button to the record element
recordElement.appendChild(deleteButton);

return recordElement;
}
// Function to delete a record from the database
function deleteRecord(recordKey) {
const patientName = patient.name; // Replace this with the patient's name

// Prompt the user for confirmation
const confirmation = confirm('Are you sure you want to delete this record?');

if (confirmation) {
  // Prompt the user for password
  const password = prompt('Please enter your password to confirm the deletion:');
  
  // Check if the password is correct
  if (password === 'mm') { // Replace 'your_password' with the actual password
    // Create a reference to the specific record in the patient's history
    const recordRef = ref(database, `medicine/${patientName}/history/${recordKey}`);

    // Remove the record from the database
    remove(recordRef)
      .then(() => {
        alert('Record deleted successfully!');
      })
      .catch((error) => {
        console.error('Error deleting record:', error);
        alert('Error deleting record. Please try again.');
      });
  } else {
    alert('Wrong password. Deletion cancelled.');
  }
}
}

};





// Open the add record popup
const addMedicationBtn = document.getElementById('addMedicationBtn');
const addRecordPopupOverlay = document.getElementById('addRecordPopupOverlay');
const addRecordPopupClose = document.getElementById('addRecordPopupClose');

addMedicationBtn.addEventListener('click', () => {
addRecordPopupOverlay.style.visibility = 'visible';
addRecordPopupOverlay.style.opacity = '1';
});

// Close the add record popup
addRecordPopupClose.addEventListener('click', () => {
addRecordPopupOverlay.style.visibility = 'hidden';
addRecordPopupOverlay.style.opacity = '0';
});


const loaderElement = document.getElementById('loader');

// Retrieve and render patients
const patientsRef = ref(database, 'medicine');

// Show the loader
loaderElement.classList.remove('hidden');

onValue(patientsRef, (snapshot) => {
const patientsData = snapshot.val();

if (patientsData) {
  patients = Object.values(patientsData); // Update the patients variable
  renderPatients(patients);
}

// Hide the loader
loaderElement.classList.add('hidden');
});
const uploadForm = document.getElementById('addPatientForm');

uploadForm.addEventListener('submit', (e) => {
  e.preventDefault();

  // Get form input values
  const name = document.getElementById('name').value.trim();
  const dob = document.getElementById('dob').value.trim();
  const parents = document.getElementById('parents').value.trim();
  const dos = document.getElementById('dos').value.trim();
  const supplier = document.getElementById('supplier').value.trim();
  const measurement = document.querySelector('input[name="measurement"]:checked').value;

  // New: Cost price input
  const costPrice = document.getElementById('costPrice').value.trim();

  // Insurance provider price inputs
  const keah = document.getElementById('keahPrice').value.trim();
  const apa = document.getElementById('apaPrice').value.trim();
  const ga = document.getElementById('gaPrice').value.trim();

  // Create the medicine data object
  const medicineData = {
    name: name,
    dob: dob,
    parents: parents,
    dos: dos,
    supplier: supplier,
    measurement: measurement,
    costPrice: parseFloat(costPrice) || 0, // ✅ added cost price
    insurancePrices: {
      apa: parseFloat(apa) || 0,
      ga: parseFloat(ga) || 0,
      keah: parseFloat(keah) || 0
    }
  };

  // Initialize Firebase DB
  const database = getDatabase();
  const medicinesRef = ref(database, 'medicine');
  const newMedicineRef = child(medicinesRef, name); // Use medicine name as key

  // Upload to Firebase
  set(newMedicineRef, medicineData)
    .then(() => {
      showMessage('Medicine details uploaded successfully!');
      uploadForm.reset();
    })
    .catch((error) => {
      console.error('Error uploading medicine details:', error);
      showMessage('Error uploading medicine details. Please try again.');
    });
});



// Get the online status element
const onlineStatusElement = document.getElementById('onlineStatus');
const overlayElement = document.getElementById('overlay');

// Function to update the online status indicator
function updateOnlineStatus() {
if (navigator.onLine) {
  onlineStatusElement.innerHTML = '<i class="fa fa-wifi"></i>';
  onlineStatusElement.classList.remove('offline');
  onlineStatusElement.classList.add('online');
  overlayElement.style.display = 'none';
} else {
  onlineStatusElement.innerHTML = '<i class="fa fa-exclamation-triangle"></i>';
  onlineStatusElement.classList.remove('online');
  onlineStatusElement.classList.add('offline');
  overlayElement.style.display = 'block';
}
}


// Initial update of online status
updateOnlineStatus();

// Add event listeners for online and offline events
window.addEventListener('online', updateOnlineStatus);
window.addEventListener('offline', updateOnlineStatus);
window.addEventListener('load', function () {
    const splashScreen = document.getElementById('splashScreen');
    splashScreen.style.opacity = '0';
    setTimeout(function () {
      splashScreen.style.display = 'none';
    }, 500); // Change this duration to control how long the splash screen is shown (in milliseconds)
  });

