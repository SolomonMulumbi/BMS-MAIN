
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.2/firebase-app.js";
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.0.2/firebase-storage.js";
import { getDatabase, ref, remove, push, get, update, onValue, child, set } from "https://www.gstatic.com/firebasejs/9.0.2/firebase-database.js";
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
const auth = getAuth(app);
const storage = getStorage(app);


       
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



/*const medicationTakenSelect = document.getElementById('medicationTaken');

// Retrieve medicines from Firebase and populate the select options
const medicinesRef = ref(database, 'medicine');
onValue(medicinesRef, (snapshot) => {
  const medicinesData = snapshot.val();

  // Clear existing options
  medicationTakenSelect.innerHTML = '';

  // Add options for each medicine
  if (medicinesData) {
    const medicines = Object.values(medicinesData);
    medicines.forEach((medicine) => {
      const option = document.createElement('option');
      option.value = medicine;
      option.textContent = medicine.name;
      medicationTakenSelect.appendChild(option);
    });
  }
});*/


const form = document.querySelector('.popup-form');
const submitButton = document.querySelector('.popup-form button');
const patientsContainer = document.getElementById('patients');
const loader = document.getElementById('loader'); // Add the loader element
let patients = []; // Declare patients variable outside the event listener
let patientCount = 1; // Initialize patient count


// JavaScript code
document.addEventListener('DOMContentLoaded', function () {
  const addPatientForm = document.getElementById('addPatientForm');
  addPatientForm.addEventListener('submit', function (event) {
    event.preventDefault(); // Prevent form submission from refreshing the page

    // Get the current date and time
    const startDate = new Date();

    // Get the form data
    const patientName = document.getElementById('patientNameSelect').value;
    const selectedTests = Array.from(document.getElementById('selectedTests').selectedOptions).map(option => option.value);
    const totalCost = parseInt(document.getElementById('totalcost').value);
    const duration = parseInt(document.getElementById('duration').value);
    const patientStatus = document.getElementById('patientStatus').value;
    const paymentScheme = document.getElementById('PaymentScheme').value;


// Create an object with the form data
const formData = {
  patientName: patientName,
  selectedTests: selectedTests,
  totalCost: totalCost,
  duration: duration,
  patientStatus: patientStatus,
  paymentScheme: paymentScheme,
  startDate: startDate.toLocaleDateString() // Use the localized date string format
};
    // Set the data in Firebase with the patient name as the key
    const patientsRef = ref(database, `treatment-patients/${patientName}`);
    set(patientsRef, formData) // Changed push to set and included patientName as the key
      .then(() => {
        showMessage('Data submitted successfully!');
        // Clear the form fields if needed
        addPatientForm.reset();
        
      })
      .catch((error) => {
        console.error('Error submitting data:', error);
      });
  });
});
// Function to filter patients based on the search term
function filterPatients(patients, searchTerm) {
  const filteredPatients = Object.values(patients).filter((patient) => {
    const patientName = patient.patientName.toLowerCase();
    return patientName.includes(searchTerm.toLowerCase());
  });
  renderPatients(filteredPatients);
}

// Add event listener to search input for live search
searchInput.addEventListener('input', () => {
  const searchTerm = searchInput.value.trim(); // Get the search term
  const patientsRef = ref(database, 'treatment-patients');
  onValue(patientsRef, (snapshot) => {
    const patientsData = snapshot.val();
    const patients = patientsData ? patientsData : {}; // Patients is an object
    filterPatients(patients, searchTerm);
  });
});

// Function to fetch the patient data from Firebase and render it
function fetchAndRenderPatientsData() {
  const patientsRef = ref(database, 'treatment-patients');
  onValue(patientsRef, (snapshot) => {
    if (snapshot.exists()) {
      const patientsData = snapshot.val();
      const patients = patientsData ? Object.values(patientsData) : [];
      renderPatients(patients); // Call the renderPatients function to display the data in a table
    } else {
      console.log('No patients data found.');
    }
  });
}

// Call the fetchAndRenderPatientsData function to fetch and display data on page load
document.addEventListener('DOMContentLoaded', fetchAndRenderPatientsData);



// Function to display patients data in a table
function renderPatients(patients, patientsData) {
  const tableContainer = document.getElementById('tableContainer'); // Replace 'tableContainer' with the ID of the HTML element where you want to display the table

  // Clear the table container before updating the table
  tableContainer.innerHTML = '';

  // Create the HTML table
  const table = document.createElement('table');
  table.classList.add('patients-table'); // Optional: Add a CSS class to the table for styling

  // Create the table header
  const tableHeader = document.createElement('thead');
  tableHeader.innerHTML = `
    <tr>
      <th>Patient ID</th>
      <th>Treatment Plan</th>
      <th>Duration (Days)</th>
      <th>Payment Scheme</th>
      <th>Start Date</th>
      <th>Total Cost</th>
      <th>Treatment Ref.</th>
      <th>Balance</th>
      <th>Actions</th>
    </tr>
  `;

  // Append the header to the table
  table.appendChild(tableHeader);

  // Create the table body
  const tableBody = document.createElement('tbody');
// Assuming you have already initialized Firebase and have access to the database and ref function.

// Function to calculate the total amount from the payments node for a patient
function calculateTotalPayments(patientName) {
  const paymentsRef = ref(database, `treatment-patients/${patientName}/payments`);
  return get(paymentsRef)
    .then((snapshot) => {
      if (snapshot.exists()) {
        const payments = snapshot.val();
        return Object.values(payments).reduce((total, payment) => total + payment.amount, 0);
      } else {
        return 0; // If no payments found, return 0
      }
    })
    .catch((error) => {
      console.error('Error fetching payments data:', error);
      return 0;
    });
}

  
  // Loop through the patients data and create rows in the table
  for (const patient of patients) {
    const row = document.createElement('tr');

    // Calculate the total payments for the current patient
    calculateTotalPayments(patient.patientName).then((totalPayments) => {
      const balance = patient.totalCost - totalPayments;

      // Create a CSS class based on the balance
      const cellClass = balance === 0 ? 'zero-balance' : 'positive-balance';

      row.innerHTML = `
        <td>${patient.patientName}</td>
        <td>${patient.patientStatus}</td>
        <td>${patient.duration}</td>
        <td>${patient.paymentScheme}</td>
        <td>${patient.startDate}</td>
        <td>${patient.totalCost.toLocaleString('en-US', { style: 'currency', currency: 'UGX' })}</td>
        <td>${patient.selectedTests.join(', ')}</td>
        <td class="${cellClass}">${balance.toLocaleString('en-US', { style: 'currency', currency: 'UGX' })}</td>
        <td>
          <button class="view-button">View</button>
        </td>
      `;

    

 // Add the click event listener to the "View" button for each patient row
  const viewButton = row.querySelector('.view-button');
  viewButton.addEventListener('click', function () {
    openPatientHistoryPopup(patient);
  });
// Add the "End Treatment / Discharge" button and its event listener
const endTreatmentButton = document.createElement('button');
endTreatmentButton.textContent = 'End';
endTreatmentButton.classList.add('button', 'save-button');
endTreatmentButton.style.background = 'darkblue';
endTreatmentButton.addEventListener('click', () => {
  // Update the patient status in the database
  updatePatientStatus(patient.patientName, 'Completed');
});


  // Add the button to the last cell in the row
  const actionsCell = row.querySelector('td:last-child');
  //actionsCell.appendChild(endTreatmentButton);
    tableBody.appendChild(row);
  });
}

  // Append the body to the table
  table.appendChild(tableBody);

  // Append the table to the container element
  tableContainer.appendChild(table);
}



          // Function to update the patient status in the database
function updatePatientStatus(patientName, newStatus) {
  const patientRef = ref(database, `treatment-patients/${patientName}`);
  update(patientRef, { currentStatus: newStatus })
    .then(() => {
      showMessage('Patient status updated successfully.');
    })
    .catch((error) => {
      showMessage('Error updating patient status:', error);
    });
}

                // Helper function to format the balance as money with commas
                function formatMoney(amount) {
              return amount.toLocaleString('en-US', { style: 'currency', currency: 'UGX' });
            }

function openPatientHistoryPopup(patientData) {
  const popupOverlay = document.getElementById('popupOverlay1');
  const popupClose = document.getElementById('popupClose1');
  const patientDetailsSection = document.getElementById('patientDetails');
  const patientHistory = document.getElementById('patientHistory');

  // Clear existing patient details and history
  patientDetails.innerHTML = '';
  patientHistory.innerHTML = '';

  // Open the popup
  popupOverlay.style.visibility = 'visible';
  popupOverlay.style.opacity = '1';

  // Close the popup when the close button is clicked
  popupClose.addEventListener('click', function () {
    popupOverlay.style.visibility = 'hidden';
    popupOverlay.style.opacity = '0';
  });

  patientDetailsSection.innerHTML = `
  <div class="patient-details">
    <div class="patient-image-frame">
  <label for="uploadImage" class="upload-label">
    <i class="fa fa-upload"></i>
    Click to Upload Patient's Image or drag and drop here
  </label>
  <input type="file" id="uploadImage" accept="image/*">
</div>
<style>
  .button {
    background-color: #4CAF50;
    border: none;
    color: white;
    padding: 10px;
    text-align: center;
    text-decoration: none;
    font-size: 16px;
    margin: 4px 2px;
    cursor: disabled;
    border-radius: 50px;
  }

  .save-button {
    background-color: #4CAF50;
  }

  .delete-button {
    background-color: #f44336;
  }
</style>
<h3>Patient Demographics:</h3>
<table class="patient-demographics-table">
  <tr>
    <td><strong>Patient ID:</strong></td>
    <td>${patientData.patientName}</td>
  </tr>
  <tr>
    <td><strong>Treatment Reference:</strong></td>
    <td>${patientData.selectedTests.join(', ')}</td>
  </tr>
  <tr>
    <td><strong>Duration (days):</strong></td>
    <td>${patientData.duration}</td>
  </tr>
  <tr>
    <td><strong>Start Date:</strong></td>
    <td>${patientData.startDate}</td>
  </tr>
  <tr>
    <td><strong>Exp. End Date:</strong></td>
    <td>${calculateEndDate(patientData.startDate, patientData.duration)}</td>
  </tr>
  <tr>
    <td><strong>Total treatment cost: UGX</strong></td>
    <td>${formatMoney(patientData.totalCost)}</td>
  </tr>
  <tr>
    <td><strong>Treatment Plan:</strong></td>
    <td><span id="patientStatus">${patientData.patientStatus}</span></td>
  </tr>
  <tr>
    <td><strong>Final Patient's Status:</strong></td>
    <td><span id="patientStatus">${patientData.currentStatus || 'pending...'}</span></td>
  </tr>
</table>
    <!-- Add more patient details as needed -->

    <!-- Add more patient details as needed -->

    <!-- The container for patient visit details -->
<div id="patientVisitDetails" ></div>



<button id="paymentButton" class="button save-button">
  <i style="margin-right: 5px;" class="fa fa-credit-card"></i>Make Payment
</button>
<button id="histButton" class="button save-button"><i class="fas fa-history" style="margin-right: 5px;"></i>Payment History</button>
<button class="button save-button" style="background: darkblue;" id="endTreatmentButton">
  <i class="fas fa-check-circle"></i> End treatment
</button>

  </div>
  `;

 // patientDetailsSection.innerHTML = patientDetailsHTML;
// Get a reference to the "End Treatment / Discharge" button
const endTreatmentButton = document.getElementById('endTreatmentButton');

// Add a click event listener to the button
endTreatmentButton.addEventListener('click', () => {
  // Update the patient status in the database
  // You can access the patient data here
  updatePatientStatus(patientData.patientName, 'Completed');
});



  const patientHistoryElement = document.getElementById('patientHistory');



  function showPaymentHistory(patientName) {
    const paymentHistoryPopupOverlay = document.getElementById('paymentHistoryPopupOverlay');
    const paymentHistoryPopupClose = document.getElementById('paymentHistoryPopupClose');
    const paymentHistoryContent = document.getElementById('paymentHistoryContent');
  
    // Clear existing payment history content
    paymentHistoryContent.innerHTML = '';
  
    // Open the payment history popup
    paymentHistoryPopupOverlay.style.display = 'block';
  
    // Close the payment history popup when the close button is clicked
    paymentHistoryPopupClose.addEventListener('click', function () {
      paymentHistoryPopupOverlay.style.display = 'none';
    });
  
    // Get the payments data for the patient from Firebase
    const patientRef = ref(database, `treatment-patients/${patientName}/payments`);
    onValue(patientRef, (snapshot) => {
      try {
        const paymentsData = snapshot.val();
  
        if (paymentsData) {
          // Create a table to display the payment history
          const table = document.createElement('table');
          table.innerHTML = `
            <tr>
              <th>Date</th>
              <th>Amount</th>
            </tr>
          `;
  
          Object.values(paymentsData).forEach((payment) => {
            const paymentDate = new Date(payment.date).toLocaleDateString();
            const paymentAmount = payment.amount;
            const row = `
              <tr>
                <td>${paymentDate}</td>
                <td>${formatMoney(paymentAmount)}</td>
              </tr>
            `;
            table.innerHTML += row;
          });
  
          paymentHistoryContent.appendChild(table);
        } else {
          const noPaymentItem = document.createElement('div');
          noPaymentItem.textContent = 'No payment history available.';
          paymentHistoryContent.appendChild(noPaymentItem);
        }
      } catch (error) {
        console.error('Error processing payment data:', error);
      }
    }, (error) => {
      console.error('Error fetching payments data:', error);
    });
  }
// Add click event listener to the "Payment History" button
const paymentHistoryButton = document.getElementById('histButton');
paymentHistoryButton.addEventListener('click', function () {
  // Get the patient name from the patientData object or from wherever you have it
  const patientName = patientData.patientName;

  // Debug: Log patientName
  console.log('Patient Name:', patientName);

  // Call the showPaymentHistory function with the patientName as an argument
  showPaymentHistory(patientName);
});

// Function to handle the "Make Payment" button click
function makePayment() {
  const paymentAmount = prompt('Enter the payment amount:');
  const parsedPaymentAmount = parseFloat(paymentAmount);

  if (!isNaN(parsedPaymentAmount)) {
    // Payment amount is a valid number, proceed to update Firebase
    const patientName = patientData.patientName;
    const paymentDate = new Date().toISOString();
    const paymentObject = {
      date: paymentDate,
      amount: parsedPaymentAmount
    };

    // Calculate the current balance by fetching the existing payments
    const paymentsRef = ref(database, `treatment-patients/${patientName}/payments`);
    get(paymentsRef)
      .then((snapshot) => {
        console.log('Snapshot:', snapshot.val()); // Debug: Log the snapshot data

        let totalPayments = 0; // Initialize total payments to 0
        if (snapshot.exists()) {
          const payments = snapshot.val();
          totalPayments = Object.values(payments).reduce((total, payment) => total + payment.amount, 0);
        }

        console.log('Total Payments:', totalPayments); // Debug: Log the total payments
        const currentBalance = patientData.totalCost - totalPayments;
        console.log('Current Balance:', currentBalance); // Debug: Log the current balance

        if (parsedPaymentAmount <= currentBalance) {
          // Payment is within the balance limit, proceed to update Firebase
          // Push the payment object to the 'payments' node under the patient data in Firebase
          const patientPaymentsRef = ref(database, `treatment-patients/${patientName}/payments`);
          console.log('New Payment Object:', paymentObject); // Debug: Log the new payment object
          push(patientPaymentsRef, paymentObject)
            .then(() => {
              showMessage('Payment recorded successfully!');
            })
            .catch((error) => {
              showMessage('Error recording payment:', error);
            });
        } else {
          showMessage('Payment amount exceeds the current balance.');
        }
      })
      .catch((error) => {
        showMessage('Error fetching payments data:', error);
      });
  } else {
    // Invalid payment amount entered
    showMessage('Invalid payment amount:', paymentAmount);
  }
}


  // Add click event listener to the "Make Payment" button
  const makePaymentButton = document.getElementById('paymentButton');
  makePaymentButton.addEventListener('click', makePayment);

// Get references to the elements
const uploadImage = document.getElementById('uploadImage');
const saveButton = document.getElementById('saveButton');
const imageFrame = document.querySelector('.patient-image-frame');
// ...

// Check if the patient has an image URL
if (patientData.image) {


  const imageElement = document.createElement('img');
  imageElement.src = patient.image;
  imageElement.alt = 'Patient Image';

  // Append the image to the frame
  imageFrame.innerHTML = '';
  imageFrame.appendChild(imageElement);
} else {
  // Show the upload input if no image is available
  const uploadLabel = document.createElement('p');
  uploadLabel.htmlFor = 'uploadImage';
  uploadLabel.className = 'no-image-label';
  uploadLabel.innerHTML = `
  <i class="fas fa-image"></i>
  No Image found
`;


  const uploadInput = document.createElement('input');
  uploadInput.type = 'file';
  uploadInput.id = 'uploadImage';
  uploadInput.accept = 'image/*';

  imageFrame.innerHTML = '';
  imageFrame.appendChild(uploadLabel);
  imageFrame.appendChild(uploadInput);

  // Handle file selection
  uploadInput.addEventListener('change', function (event) {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = function (e) {
      const imageUrl = e.target.result;

      // Create the image element
      const imageElement = document.createElement('img');
      imageElement.src = imageUrl;
      imageElement.alt = 'Patient Image';

      // Append the image to the frame
      imageFrame.innerHTML = '';
      imageFrame.appendChild(imageElement);

      // Enable the save button
      saveButton.disabled = false;
    };

    reader.readAsDataURL(file);
  });
}





// Check if the patient has an image URL
if (patientData.image) {
  // Create the image element
  const imageElement = document.createElement('img');
  imageElement.src = patient.image;
  imageElement.alt = 'Patient Image';

  // Append the image to the frame
  imageFrame.innerHTML = '';
  imageFrame.appendChild(imageElement);

  // Enable the delete button
  deleteButton.disabled = false;
}
// ...


function dataURItoBlob(dataURI) {
  const byteString = atob(dataURI.split(',')[1]);
  const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  
  return new Blob([ab], { type: mimeString });
}






 // Retrieve and display the patient's history
const patientName = patientData.name; // Replace this with the patient's name
const patientHistoryRef = ref(database, `patients/${patientName}/testsTaken`);

// Function to get the latest test status
function getLatestTestStatus(records) {
  if (records.length === 0) return 'Unknown';

  // Sort the records by dateTaken in descending order
  records.sort((a, b) => b.data.dateTaken - a.data.dateTaken);

  // Get the status of the latest test result
  const latestTestStatus = records[0].data.results?.finalStatus || 'Pending...';
  return latestTestStatus;
}

onValue(patientHistoryRef, (snapshot) => {
  patientHistoryElement.innerHTML = ''; // Clear previous records

  if (snapshot.exists()) {
    const records = [];
    snapshot.forEach((childSnapshot) => {
      const recordKey = childSnapshot.key;
      const record = childSnapshot.val();
      records.push({ key: recordKey, data: record });
    });

    // Get the patient's current status from the latest test result
    const currentStatusElement = document.getElementById('currentStatus');
    const currentStatus = getLatestTestStatus(records);
    currentStatusElement.textContent =  currentStatus;
    //currentStatusElement.style.color = currentStatus === 'Completed Successfully' ? 'darkblue' : 'orange';

    records.forEach((recordObj) => {
      const recordKey = recordObj.key;
      const record = recordObj.data;

      // Create the record element and add it to the patientHistoryElement
      const recordElement = createRecordElement(recordKey, record);
      patientHistoryElement.appendChild(recordElement);

      // Reference the test result node in Firebase
      const testResultRef = ref(database, `patients/${patientName}/testsTaken/${recordKey}/resultsObtained`);

      // Listen for changes in the test result status
      onValue(testResultRef, (resultSnapshot) => {
        const resultsObtainedElement = recordElement.querySelector('.results-obtained-data');
        if (resultsObtainedElement) {
          if (resultSnapshot.exists()) {
            const resultsObtained = resultSnapshot.val();
            resultsObtainedElement.textContent = (resultsObtained === 'Completed Successfully' ? 'Completed Successfully' : 'Pending...');
            resultsObtainedElement.style.color = resultsObtained === 'Completed Successfully' ? 'darkblue' : 'orange';
          } else {
            resultsObtainedElement.textContent = 'Pending...';
            resultsObtainedElement.style.color = 'orange';
          }
        } else {
          console.error("results-obtained-data element not found in recordElement");
        }
      });
    });
  } else {
    const noRecordsElement = document.createElement('p');
    noRecordsElement.textContent = 'No Records Found';
    noRecordsElement.style.fontStyle = 'italic';
    patientHistoryElement.appendChild(noRecordsElement);
  }
});




function calculateEndDate(startDate, duration) {
  // Convert the startDate to a Date object
  const startDateObj = new Date(startDate);

  // Check if the startDate is valid
  if (isNaN(startDateObj.getTime())) {
    return 'Invalid Start Date';
  }

  // Calculate the expected end date
  const endDate = new Date(startDateObj.getTime() + duration * 24 * 60 * 60 * 1000);
  return endDate.toISOString().slice(0, 10);
}


// Function to display the patient's visit details
function displayPatientVisitDetails(visitKeys, visitDetails) {
  const patientVisitDetailsDiv = document.getElementById('patientVisitDetails');
  patientVisitDetailsDiv.innerHTML = '';

  if (visitDetails) {
    const visitKeys = Object.keys(visitDetails);

    // Sort the visit keys in descending order based on timestamp
    visitKeys.sort((a, b) => visitDetails[b].timestamp - visitDetails[a].timestamp);

         // Get the visit count
         const visitCount = visitKeys.length;

// Display the visit count in the "Visit Count" element
const visitCountElement = document.getElementById('visitCount');
visitCountElement.textContent = visitCount;



    // Get the latest visit key
    const latestVisitKey = visitKeys[0];
    const latestVisitData = visitDetails[latestVisitKey];

    // Create the visit element for the latest visit
    const visitElement = document.createElement('div');

    // Add the visit details to the visit element
    visitElement.innerHTML = `

    <h3>LATEST VISIT TRIAGE:</h3>
<div class="visit-details-container">
  <p><b>Date:</b> ${formatDate(latestVisitData.timestamp)}</p>
  <p><b>Clinician's Name:</b> ${latestVisitData.clinicianName || 'N/D'}</p>
  <p><b>Temperature:</b> ${latestVisitData.temperature || 'N/D'} &deg;C</p>
  <p><b>BP:</b> ${latestVisitData.bp || 'N/D'} (mmHg)</p>
  <p><b>RR:</b> ${latestVisitData.rr || 'N/D'}</p>
  <p><b>HR:</b> ${latestVisitData.hr || 'N/D'}</p>
  <p><b>SpO2:</b> ${latestVisitData.sp02 || 'N/D'} (%)</p>
  <p><b>WT:</b> ${latestVisitData.wt || 'N/D'} (Kg)</p>
  <p><b>HT:</b> ${latestVisitData.ht || 'N/D'} (Cm)</p>
  <p><b>BMI:</b> ${latestVisitData.bmi || 'N/D'}</p>
  <p><b>MUAC:</b> ${latestVisitData.muac || 'N/D'}</p>
  <p><b>Weight for Age Z score:</b> ${latestVisitData.weightForAgeZScore || 'N/D'} (Kg)</p>
  <p><b>Disability:</b> ${latestVisitData.disability || 'N/D'}</p>
  <p><b>Known Chronic Illness:</b> ${latestVisitData.chronicIllness || 'N/D'}</p>
  <p><b>Any Drug Abuse:</b> ${latestVisitData.drugAbuse || 'N/D'}</p>
  <p><b>Allergies:</b> ${latestVisitData.allergies && latestVisitData.allergies.length > 0
    ? latestVisitData.allergies.join(', ')
    : 'N/D'}
  </p>
</div>
<hr>


    `;

    patientVisitDetailsDiv.appendChild(visitElement);
  } else {
    patientVisitDetailsDiv.textContent = 'No visit details found.';
    patientVisitDetailsDiv.style.fontStyle = 'italic';
  }
}


function getPatientVisitDetails(patientName) {
  const visitsRef = ref(database, `patients/${patientName}/visits`);
  onValue(visitsRef, (snapshot) => {
    const visitDetails = snapshot.val();
    if (visitDetails) {
      const visitKeys = Object.keys(visitDetails);
      visitKeys.sort((a, b) => visitDetails[b].timestamp - visitDetails[a].timestamp);

      // Call the function to display the patient's visit details
      displayPatientVisitDetails(visitKeys, visitDetails);
      // Call the function to create the chart
      createVisitTrendChart(visitKeys, visitDetails);
    } else {
      displayPatientVisitDetails(null); // If no visit details found, display an empty state
      createVisitTrendChart([], {}); // If no visit details found, create an empty chart
    }
  });
}

// Call the function to retrieve and display the patient's visit details
getPatientVisitDetails(patientName);

// Variable to track whether the popup is open or not
let isPopupOpen = false;




// Function to close the popup
function closePopup() {
  visitPopupOverlay.style.display = 'none';
}

// Event listener for the "Cancel" button
//const cancelVisitBtn = document.getElementById('cancelVisitBtn');
//cancelVisitBtn.addEventListener('click', closePopup);

// Function to format the timestamp
function formatDate(timestamp) {
  const date = new Date(timestamp);
  const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
  return date.toLocaleString('en-US', options);
}

// Variable to store the reference to the current chart
let visitTrendChart;

// Function to destroy the previous chart if it exists
function destroyChart() {
  if (window.visitTrendChart && window.visitTrendChart.destroy) {
    window.visitTrendChart.destroy();
  }
}

// Move the chart creation code to a separate function
function createVisitTrendChart(visitKeys, visitDetails) {
  // Get the canvas element
  const visitTrendCanvas = document.getElementById('visitTrendChart');
  const ctx = visitTrendCanvas.getContext('2d');

  // Extract the vital signs data from the visitDetails
  const vitalSignsData = visitKeys.map((visitKey) => {
    const visitData = visitDetails[visitKey];
    return {
      date: formatDate(visitData.timestamp),
      temperature: visitData.temperature,
      bp: visitData.bp,
      rr: visitData.rr,
      hr: visitData.hr,
      sp02: visitData.sp02,
      wt: visitData.wt,
      ht: visitData.ht,
      bmi: visitData.bmi,
      muac: visitData.muac
    };
  });

  // Separate the data for each vital sign
  const dates = vitalSignsData.map((data) => data.date);
  const temperatures = vitalSignsData.map((data) => data.temperature);
  const bloodPressures = vitalSignsData.map((data) => data.bp);
  const respiratoryRates = vitalSignsData.map((data) => data.rr);
  const heartRates = vitalSignsData.map((data) => data.hr);
  const spO2Values = vitalSignsData.map((data) => data.sp02);

  // Destroy the previous chart instance if it exists
  destroyChart();

  // Create the line chart
  window.visitTrendChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: dates,
      datasets: [
        {
          label: 'Temperature (&deg;C)',
          data: temperatures,
          borderColor: 'red',
          fill: false
        },
     //   {
       //   label: 'Blood Pressure (mmHg)',
     //     data: bloodPressures,
      //    borderColor: 'blue',
      //    fill: false
     //   },
        {
          label: 'Respiratory Rate',
          data: respiratoryRates,
          borderColor: 'green',
          fill: false
        },
        {
          label: 'Heart Rate',
          data: heartRates,
          borderColor: 'purple',
          fill: false
        },
        {
          label: 'SpO2 (%)',
          data: spO2Values,
          borderColor: 'orange',
          fill: false
        }
      ]
    },
    options: {
      responsive: true,
      scales: {
        x: {
          display: true,
          title: {
            display: true,
            text: 'Date'
          }
        },
        y: {
          display: true,
          title: {
            display: true,
            text: 'Value'
          }
        }
      }
    }
  });
}

// Rest of the code remains the same
// ...


// Function to display the patient's visit details in the popup
function displayVisitsPopup(patientName) {
  // Get the reference to the patient's visits node in Firebase
  const visitsRef = ref(database, `patients/${patientName}/visits`);

  // Clear the existing content of the table body and canvas
  const tableBody = document.getElementById('tableBody');
  const visitTrendCanvas = document.getElementById('visitTrendChart');
  tableBody.innerHTML = '';
  visitTrendCanvas.getContext('2d').clearRect(0, 0, visitTrendCanvas.width, visitTrendCanvas.height);

  // Retrieve the patient's visits from Firebase
  onValue(visitsRef, (snapshot) => {
    const visitDetails = snapshot.val();

    if (visitDetails) {
      // Create an array of visit keys
      const visitKeys = Object.keys(visitDetails);

      // Sort the visit keys in descending order based on timestamp
      visitKeys.sort((a, b) => visitDetails[b].timestamp - visitDetails[a].timestamp);

      // Loop through the visits and display each visit's data in the table
      visitKeys.forEach((visitKey) => {
        const visitData = visitDetails[visitKey];

        // Create a table row for each visit
        const row = document.createElement('tr');

        // Add the visit details to the row
        row.innerHTML = `
          <td>${formatDate(visitData.timestamp)}</td>
          <td>${visitData.clinicianName}</td>
          <td>${visitData.temperature} &deg;C</td>
          <td>${visitData.bp}</td>
          <td>${visitData.rr}</td>
          <td>${visitData.hr}</td>
          <td>${visitData.sp02}</td>
          <td>${visitData.wt}</td>
          <td>${visitData.ht}</td>
          <td>${visitData.bmi}</td>
          <td>${visitData.muac}</td>
          <td>${visitData.weightForAgeZScore}</td>
          <td>${visitData.disability}</td>
          <td>${visitData.chronicIllness}</td>
          <td>${visitData.drugAbuse}</td>
          <td>${visitData.allergies.join(', ')}</td>
        `;

        tableBody.appendChild(row);
      });

      // Call the function to create the chart after displaying the visits data
      createVisitTrendChart(visitKeys, visitDetails);
    } else {
      // If no visit details found, display a message
      const noVisitsRow = document.createElement('tr');
      noVisitsRow.innerHTML = '<td colspan="17">No visit details found.</td>';
      tableBody.appendChild(noVisitsRow);
    }
  });

  // Show the popup
  const popupOverlay = document.getElementById('popup-overlay4');
  popupOverlay.style.display = 'block';
}

// Function to format the timestamp
function formatDate(timestamp) {
  const date = new Date(timestamp);
  const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
  return date.toLocaleString('en-US', options);
}


// Get the close button element and add the click event listener to close the popup
const closePopupBtn4 = document.getElementById('closePopupBtn4');
closePopupBtn4.addEventListener('click', () => {
  const popupOverlay = document.getElementById('popup-overlay4');
  popupOverlay.style.display = 'none';
});
// Variable to store the current patient's name
let currentPatientName = patientData.name;
/*
// Get the button element and add the click event listener
const visitButton = document.getElementById('visit');
const visitPopupOverlay = document.getElementById('popup-overlay3');

visitButton.addEventListener('click', (event) => {
  currentPatientName = event.target.getAttribute('data-patient'); // Extract the patient's name from the data-patient attribute
  visitPopupOverlay.style.display = 'block';
  // Update the isPopupOpen variable to true when the popup is opened
  isPopupOpen = true;
});


// Event listener for the "Save Visit" button (Moved outside other functions)
const saveVisitBtn = document.getElementById('saveVisitBtn');
saveVisitBtn.addEventListener('click', () => {
  // Get the values of the input fields
  const clinicianName = clinicianNameSelect.value;
  const temperature = document.getElementById('temperature').value;
  const bp = document.getElementById('bp').value;
  const rr = document.getElementById('rr').value;
  const hr = document.getElementById('hr').value;
  const sp02 = document.getElementById('sp02').value;
  const wt = document.getElementById('wt').value;
  const ht = document.getElementById('ht').value;
  const bmi = document.getElementById('bmi').value;
  const muac = document.getElementById('muac').value;
  const weightForAgeZScore = document.getElementById('weightForAgeZScore').value;
  const disability = document.getElementById('disability').value;
  const chronicIllness = document.getElementById('chronicIllness').value;
  const drugAbuse = document.getElementById('drugAbuse').value;
  const selectedAllergies = [...testsTakenSelect.selectedOptions].map(option => option.value);

  // Construct the visit object
  const visit = {
    clinicianName,
    temperature,
    bp,
    rr,
    hr,
    sp02,
    wt,
    ht,
    bmi,
    muac,
    weightForAgeZScore,
    disability,
    chronicIllness,
    drugAbuse,
    allergies: selectedAllergies,
    timestamp: Date.now()
  };

  // Push the visit to the "visits" node under the patient
  const visitsRef = ref(database, `patients/${currentPatientName}/visits`);
    push(visitsRef, visit)
    .then(() => {
      showMessage('Visit saved successfully!');
      // Clear the input fields after saving
      clinicianNameSelect.value = '';
      document.getElementById('temperature').value = '';
      document.getElementById('bp').value = '';
      document.getElementById('rr').value = '';
      document.getElementById('hr').value = '';
      document.getElementById('sp02').value = '';
      document.getElementById('wt').value = '';
      document.getElementById('ht').value = '';
      document.getElementById('bmi').value = '';
      document.getElementById('muac').value = '';
      document.getElementById('weightForAgeZScore').value = '';
      document.getElementById('disability').value = '';
      document.getElementById('chronicIllness').value = '';
      document.getElementById('drugAbuse').value = '';
      $('#allergies').val(null).trigger('change'); // Reset the Select2 multiple select
    })
    .catch((error) => {
      console.error('Error saving visit:', error);
    });

   closePopup();
});
*/






  function createRecordElement(recordKey, record) {
    const recordElement = document.createElement('div');
recordElement.classList.add('record');

const recordKeyElement = document.createElement('h4');
recordKeyElement.textContent = 'Record Key: ' + recordKey;
recordElement.appendChild(recordKeyElement);

const table = document.createElement('table');
recordElement.appendChild(table);

// Create record key row
const recordKeyRow = document.createElement('tr');
table.appendChild(recordKeyRow);

const recordKeyHeader = document.createElement('th');
recordKeyHeader.textContent = 'Record Key';
recordKeyRow.appendChild(recordKeyHeader);

const recordKeyData = document.createElement('td');
recordKeyData.textContent = recordKey;
recordKeyRow.appendChild(recordKeyData);

// Create date taken row
const dateTakenRow = document.createElement('tr');
table.appendChild(dateTakenRow);

const dateTakenHeader = document.createElement('th');
dateTakenHeader.textContent = 'Date Taken';
dateTakenRow.appendChild(dateTakenHeader);

const dateTakenData = document.createElement('td');
const dateTaken = new Date(parseInt(record.dateTaken));
if (!isNaN(dateTaken.getTime())) {
  dateTakenData.textContent = dateTaken.toLocaleString();
} else {
  dateTakenData.textContent = 'Invalid Date';
}
dateTakenRow.appendChild(dateTakenData);

// Create Services Offered row
const testsTakenRow = document.createElement('tr');
table.appendChild(testsTakenRow);

const testsTakenHeader = document.createElement('th');
testsTakenHeader.textContent = 'Services Offered';
testsTakenRow.appendChild(testsTakenHeader);

const testsTakenData = document.createElement('td');
testsTakenData.textContent = record.testsTaken;
testsTakenRow.appendChild(testsTakenData);

// Create payment status row
const paymentStatusRow = document.createElement('tr');
table.appendChild(paymentStatusRow);

const paymentStatusHeader = document.createElement('th');
paymentStatusHeader.textContent = 'Service Payment';
paymentStatusRow.appendChild(paymentStatusHeader);

const paymentStatusData = document.createElement('td');
paymentStatusData.textContent = record.paymentstatus || 'Not Paid';
paymentStatusRow.appendChild(paymentStatusData);

if (record.paymentstatus !== 'payment received') {
  paymentStatusData.style.color = 'red';
} else {
  paymentStatusData.style.color = 'blue';
}

// Create medicine payment status row
const medicineStatusRow = document.createElement('tr');
table.appendChild(medicineStatusRow);

const medicineStatusHeader = document.createElement('th');
medicineStatusHeader.textContent = 'Medicine Payment';
medicineStatusRow.appendChild(medicineStatusHeader);

const medicineStatusData = document.createElement('td');
medicineStatusData.textContent = record.medicinestatus || 'Not Paid';
medicineStatusRow.appendChild(medicineStatusData);

if (record.medicinestatus !== 'payment received') {
  medicineStatusData.style.color = 'red';
} else {
  medicineStatusData.style.color = 'blue';
}


  // Create results obtained row
  const resultsObtainedRow = document.createElement('tr');
  table.appendChild(resultsObtainedRow);

  const resultsObtainedHeader = document.createElement('th');
  resultsObtainedHeader.textContent = 'Test Results status ';
  resultsObtainedRow.appendChild(resultsObtainedHeader);

  const resultsObtainedData = document.createElement('td');
  resultsObtainedData.textContent = record.results?.resultsObtained || 'Pending...';
  resultsObtainedData.classList.add('results-obtained-data'); // Add a class name to the results obtained cell
  if (record.results && record.results.resultsObtained === 'Completed Successfully') {
    resultsObtainedData.style.color = 'darkblue';
  } else {
    resultsObtainedData.style.color = 'orange';
  }
  resultsObtainedRow.appendChild(resultsObtainedData);


// Create additional notes row
const additionalNotesRow = document.createElement('tr');
table.appendChild(additionalNotesRow);

const additionalNotesHeader = document.createElement('th');
additionalNotesHeader.textContent = 'Diagnosis';
additionalNotesRow.appendChild(additionalNotesHeader);

const additionalNotesData = document.createElement('td');
additionalNotesData.textContent = record.results?.additionalNotes || 'Pending...';
if (record.results && !record.results.additionalNotes) {
  additionalNotesData.classList.add('pending');
}
additionalNotesRow.appendChild(additionalNotesData);



// Create final status row
const finalStatusRow = document.createElement('tr');
table.appendChild(finalStatusRow);

const finalStatusHeader = document.createElement('th');
finalStatusHeader.textContent = 'Final Status of Patient';
finalStatusRow.appendChild(finalStatusHeader);

const finalStatusData = document.createElement('td');
finalStatusData.textContent = record.results?.finalStatus || 'Pending...';
finalStatusRow.appendChild(finalStatusData);

// Create follow-up date/time row
const followUpRow = document.createElement('tr');
table.appendChild(followUpRow);

const followUpHeader = document.createElement('th');
followUpHeader.textContent = 'Follow-up Date/Time';
followUpRow.appendChild(followUpHeader);

const followUpData = document.createElement('td');
followUpData.textContent = record.results?.followUpDateTime || 'none';
followUpRow.appendChild(followUpData);



const medicationTakenElement = document.createElement('div');
medicationTakenElement.classList.add('medication-taken');
const medicationTable = document.createElement('table');
medicationTable.classList.add('medication-table');

// Create table header row
const tableHeaderRow = document.createElement('tr');
const headers = ['Medication', 'Prescription', 'Milligrams', 'Cost'];
headers.forEach((headerText) => {
  const tableHeaderCell = document.createElement('th');
  tableHeaderCell.textContent = headerText;
  tableHeaderRow.appendChild(tableHeaderCell);
});
medicationTable.appendChild(tableHeaderRow);

let totalCost = 0; // Variable to store the total cost

if (record.results && record.results.medication) {
  const medicationNodes = record.results.medication;
  Object.keys(medicationNodes).forEach((medicationKey) => {
    const medicationData = medicationNodes[medicationKey];
    const tableRow = document.createElement('tr');
    const medicationCell = document.createElement('td');
    medicationCell.textContent = medicationData.medication;
    const prescriptionCell = document.createElement('td');
    prescriptionCell.textContent = medicationData.prescription;
    const gramsCell = document.createElement('td');
    gramsCell.textContent = medicationData.grams;
    const totalCostCell = document.createElement('td');
    totalCostCell.textContent = medicationData.totalCost;
    tableRow.appendChild(medicationCell);
    tableRow.appendChild(prescriptionCell);
    tableRow.appendChild(gramsCell);
    tableRow.appendChild(totalCostCell);
    medicationTable.appendChild(tableRow);

    totalCost += parseFloat(medicationData.totalCost); // Add the total cost to the variable
  });
}

medicationTakenElement.appendChild(medicationTable);
recordElement.appendChild(medicationTakenElement);

// Create the total element row
const totalRow = document.createElement('tr');
medicationTable.appendChild(totalRow);

const emptyCell = document.createElement('td');
emptyCell.setAttribute('colspan', '3');
totalRow.appendChild(emptyCell);

const totalCostCell = document.createElement('td');
totalCostCell.textContent = 'Medicine Total: UGX ' + totalCost.toFixed(2);
totalCostCell.classList.add('total-cell'); // Add the CSS class
totalRow.appendChild(totalCostCell);





// Rest of your code...
// Display the email sign-in popup on page load
window.addEventListener('load', function() {
  // Check if the user is already signed in
  auth.onAuthStateChanged(function(user) {
    if (user) {
      // User is signed in
      console.log('User signed in:', user.email);
     // Set the h2 element text to the user's display name
const profileName = document.querySelector('.profile_info h2');
if (user && user.displayName) {
  profileName.textContent = user.displayName;
} else {
  profileName.textContent = "Unknown";
}

      // Set the profile image source to the user's profile photo URL
      const profileImage = document.querySelector('.profile_pic img');
      profileImage.src = user.photoURL;
      // Set the profile image in the dropdown menu
      const dropdownProfileImage = document.querySelector('.user-profile img');
      dropdownProfileImage.src = user.photoURL;
      // Display success message
      displayMessage('Success', `Welcome, ${user.email}! You are authenticated.`, true); // Pass true for success message
      // Reload the page content
 
      // Perform any necessary actions for an authenticated user
    } else {
      // User is not signed in, display the sign-in popup
      var provider = new GoogleAuthProvider();
      signInWithPopup(auth, provider)
        .then(function(result) {
          // Handle sign-in success
          var user = result.user;
          console.log('User signed in:', user.email);
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
          displayMessage('Success', `Welcome, ${user.email}! You are authenticated.`, true); // Pass true for success message
          // Reload the page content
      
          // Perform any necessary actions for an authenticated user
        })
        .catch(function(error) {
          // Handle sign-in error
          console.error('Error signing in:', error);
          // Display access denied message
          displayMessage('Access Denied', 'You are not authenticated. Please sign in with a valid email.');
        });
    }
  });
});


// Create share button
const shareButton = document.createElement('button');
shareButton.id = 'shareButton';
shareButton.innerHTML = '<i class="fa fa-paper-plane"></i> Send Lab Request'; // Use innerHTML instead of textContent
shareButton.addEventListener('click', () => {
  // Ensure the user object is defined
  const currentUser = auth.currentUser;
  if (currentUser && currentUser.displayName) {
    shareRecord(patient, record, currentUser);
  } else {
    console.error('User object is undefined or does not have a displayName.');
  }
});

// Append the share button to the record element
recordElement.appendChild(shareButton);



function shareRecord(patient, record, user) {
  // Get the patient's name, doctor's username, and the test key
  const patientName = patient.name;
  const doctorUsername = user.displayName; // Assuming `user` is the current authenticated user object
  const testKey = recordKey;

  // Construct the notification message
  const message = `New Test ${testKey} for patient ${patientName} to be done.`;

  // Construct the message object
  const notification = {
    timestamp: Date.now(),
    message: message
  };

  // Update the chat node in Firebase with the notification
  const chatRef = ref(database, 'laboratory-requests');
  push(chatRef, notification)
    .then(() => {
      console.log('Notification sent successfully!');
      showMessage('Notification sent successfully!');
    })
    .catch((error) => {
      console.error('Error sending notification:', error);
      showMessage('Error sending notification:', error);
    });
}






// Create print button
const printButton = document.createElement('button');
printButton.innerHTML = '<i class="fa fa-print"></i> Print Record'; // Use innerHTML instead of textContent
printButton.classList.add('print-button');

// Add event listener to the print button
printButton.addEventListener('click', () => {
  printRecord(patient, record);
});

// Append the print button to the record element
recordElement.appendChild(printButton);

// ...
function printRecord(patient, record) {
  window.jsPDF = window.jspdf.jsPDF;
  // Create a new jsPDF instance
  const doc = new jsPDF();

  // Set the font size
  doc.setFontSize(12);

  // Define the hospital logo URL or path
  const hospitalLogo = 'spena.png'; // Replace with the actual URL or path

  // Define the coordinates and dimensions for the header box
  const headerBoxX = 20;
  const headerBoxY = 10;
  const headerBoxWidth = 170;
  const headerBoxHeight = 40;

  // Draw the header box with black border
  doc.setDrawColor(0, 0, 0);
  doc.setFillColor(255, 255, 255);
  doc.rect(headerBoxX, headerBoxY, headerBoxWidth, headerBoxHeight, 'D'); // Use 'D' for border only

  // Calculate the center position of the header box
  const headerBoxCenterX = headerBoxX + (headerBoxWidth / 2);
  const headerBoxCenterY = headerBoxY + (headerBoxHeight / 2);

  // Print hospital logo
  doc.addImage(hospitalLogo, 'PNG', headerBoxX + 2, headerBoxY + 10, 26, 26);

  // Print hospital name
  const hospitalName = 'BAMBI MEDICAL CLINIC';
  const hospitalNameWidth = doc.getTextWidth(hospitalName);
  const hospitalNameY = headerBoxCenterY - 5; // Adjust the Y coordinate for vertical alignment
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(0, 0, 0); // Set text color to black
  doc.text(hospitalName, headerBoxCenterX, hospitalNameY, { align: 'center' });

  // Print hospital address
  const hospitalAddress = 'Location: Kubbiri Round-about';
  const hospitalAddressY = headerBoxCenterY + 2; // Adjust the Y coordinate
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(12);
  doc.text(hospitalAddress, headerBoxCenterX, hospitalAddressY, { align: 'center' });

  // Print telephone contacts
  const telephoneContacts = 'Telephone: +123456789';
  const telephoneContactsY = headerBoxCenterY + 9; // Adjust the Y coordinate
  doc.text(telephoneContacts, headerBoxCenterX, telephoneContactsY, { align: 'center' });

  // Print email
  const email = 'Email: info@bambimedical.com';
  const emailY = headerBoxCenterY + 15; // Adjust the Y coordinate
  doc.text(email, headerBoxCenterX, emailY, { align: 'center' });

  // Reset the font
  doc.setFont('helvetica', 'normal');

  // Print the heading "LABORATORY REPORT"
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  const reportHeading = 'LABORATORY REPORT';
  const reportHeadingWidth = doc.getTextWidth(reportHeading);
  const reportHeadingX = (doc.internal.pageSize.getWidth() - reportHeadingWidth) / 2;
  const reportHeadingY = headerBoxY + headerBoxHeight + 10;
  doc.text(reportHeading, reportHeadingX, reportHeadingY);

  // Print patient details in a table
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(12);
  const patientDetails = [
    ['Patient Name', patient.name],
    ['Date of Birth', patient.dob],
    ['Payment Type', patient.payment],
    ['Residence', patient.residence],
    ['Contact', patient.parents],
    ['Patient ID', patient.patientId]
  ];
  const patientTableX = 20;
  const patientTableY = reportHeadingY + 5;
  const patientTableOptions = {
    startX: patientTableX,
    startY: patientTableY,
    margin: { top: 10 },
    styles: { font: 'helvetica', fontStyle: 'normal', fontSize: 10 },
    headStyles: { fillColor: [211, 211, 211], fontStyle: 'bold' },
    bodyStyles: { fillColor: 255 },
    columnStyles: { 0: { cellWidth: 80 }, 1: { cellWidth: 100 } }
  };
  doc.autoTable({
    head: [['Field', 'Value']],
    body: patientDetails,
    ...patientTableOptions
  });

  // Print the heading "TEST AND RESULTS"
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  const resultsHeading = 'TEST AND RESULTS';
  const resultsHeadingWidth = doc.getTextWidth(resultsHeading);
  const resultsHeadingX = (doc.internal.pageSize.getWidth() - resultsHeadingWidth) / 2;
  const resultsHeadingY = patientTableY + 65;
  doc.text(resultsHeading, resultsHeadingX, resultsHeadingY);

  // Print record details in a table
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(12);
  const recordDetails = [
    ['Record Key', recordKey],
    ['Date Taken', dateTakenData.textContent],
    ['Services Offered', testsTakenData.textContent],
    ['Service Payment', paymentStatusData.textContent],
    ['Results Obtained', resultsObtainedData.textContent],
    ['Additional Notes', additionalNotesData.textContent]
  ];
  const recordTableX = 20;
  const recordTableY = resultsHeadingY + 5;
  const recordTableOptions = {
    startX: recordTableX,
    startY: recordTableY,
    margin: { top: 10 },
    styles: { font: 'helvetica', fontStyle: 'normal', fontSize: 10 },
    headStyles: { fillColor: [211, 211, 211], fontStyle: 'bold' },
    bodyStyles: { fillColor: 255 },
    columnStyles: { 0: { cellWidth: 80 }, 1: { cellWidth: 100 } }
  };
  doc.autoTable({
    head: [['Field', 'Value']],
    body: recordDetails,
    ...recordTableOptions
  });

  // Print medicine given table
  const medicationTableData = [];
  const medicationRows = medicationTable.querySelectorAll('tr');
  for (let i = 1; i < medicationRows.length; i++) {
    const cells = medicationRows[i].querySelectorAll('td');
    if (cells.length === 4) { // Ensure there are 4 cells in each row
      const medication = cells[0].textContent;
      const prescription = cells[1].textContent;
      const grams = cells[2].textContent;
      const totalCost = cells[3].textContent;
      medicationTableData.push([medication, prescription, grams, totalCost]);
    }
  }

  doc.autoTable({
    startY: 195,
    head: [['Medication', 'Prescription', 'Milligrams', 'Total Cost']],
    body: medicationTableData,
    theme: 'grid',
    styles: {
      fontSize: 10,
      cellPadding: 1.5,
      lineColor: [0, 0, 0],
      lineWidth: 0.1,
    },
    columnStyles: {
      0: { cellWidth: 50 },
      1: { cellWidth: 50 },
      2: { cellWidth: 40 },
      3: { cellWidth: 40 },
    },
  });

  // Add the doctor's signature label
  const signatureLabelX = 20;
  const signatureLabelY = doc.internal.pageSize.getHeight() - 20;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(12);
  doc.text('Doctor\'s Signature:', signatureLabelX, signatureLabelY, { align: 'left' });

  // Print the document
  doc.autoPrint();

  // Open the print dialog
  doc.output('dataurlnewwindow');
}






  
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

// Add event listener to the delete button
deleteButton.addEventListener('click', () => {
  const recordKey = recordKeyElement.getAttribute('data-record-key');
  deleteRecord(recordKey);
});

// Rest of the code...


// Create Finnish button
const finnishButton = document.createElement('button');
finnishButton.textContent = '+ Add Prescription';
finnishButton.classList.add('finnish-button');

// Retrieve the addMedicationForm element
const addMedicationForm = document.getElementById('addMedicationForm');

finnishButton.addEventListener('click', () => {
  // Remove the existing record key input from the form
  const existingRecordKeyInput = addMedicationForm.querySelector('input[name="recordKey"]');
  if (existingRecordKeyInput) {
    existingRecordKeyInput.remove();
  }

  // Get the record key
  const recordKey = recordKeyElement.textContent.replace('Record Key: ', '');

  const overlay = document.createElement('div');
  overlay.classList.add('overlay3');

  const popup = document.createElement('div');
  popup.classList.add('popup3');

  const closeButton = document.createElement('button');
  closeButton.textContent = 'X';
  closeButton.classList.add('close-button');

  const heading = document.createElement('h2');
  heading.textContent = 'Add Medicine & Prescription';
  popup.appendChild(closeButton);
  popup.appendChild(heading);

  // Store the record key in a hidden input field within the form
  const recordKeyInput = document.createElement('input');
  recordKeyInput.type = 'hidden';
  recordKeyInput.name = 'recordKey';
  recordKeyInput.value = recordKey;
  addMedicationForm.appendChild(recordKeyInput);

  popup.appendChild(addMedicationForm);

  // Append the overlay and popup to the document body
  document.body.appendChild(overlay);
  document.body.appendChild(popup);

  // Show the overlay and popup
  overlay.style.display = 'block';
  popup.style.display = 'block';

  // Close button event listener
  closeButton.addEventListener('click', () => {
    // Clear the form fields
    const medicationContainer = document.getElementById('medicationInputsContainer');
      medicationContainer.innerHTML = '';
    document.getElementById('additionalNotes').value = '';


    // Hide the overlay and popup
    overlay.style.display = 'none';
    popup.style.display = 'none';
  });
});

  // Append the Finnish button to the record element
  recordElement.appendChild(finnishButton);

  // Append the delete button to the record element
  recordElement.appendChild(deleteButton);
  recordKeyElement.setAttribute('data-record-key', recordKey);
 
  
  
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
      const recordRef = ref(database, `patients/${patientName}/testsTaken/${recordKey}`);

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

}



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
//const patientsRef = ref(database, 'patients');

// Show the loader
loaderElement.classList.remove('hidden');


  // Hide the loader
  loaderElement.classList.add('hidden');



// Function to calculate the total based on inputs
const calculateTotal = () => {
  const medicationCost = parseFloat(
    medicationInput.selectedOptions[0].dataset.costPerGram
  );
  const gramsValue = parseFloat(gramsInput.value);
  const total = medicationCost * gramsValue;

  // Update the total element with the calculated value
  totalElement.textContent = 'Total: $' + total.toFixed(2);
};
// Function to create a new medication input with delete button
const createMedicationInput = () => {
  const medicationInputContainer = document.createElement('div');
  medicationInputContainer.classList.add('medication-input-container');

  // Medication label
  const medicationLabel = document.createElement('label');
  medicationLabel.textContent = 'Medicine:';
  medicationLabel.setAttribute('for', 'medicationInput');

  const medicationInput = document.createElement('select');
  medicationInput.required = true;
  medicationInput.classList.add('select2');

  const medicineRef = ref(database, 'medicine');
  onValue(medicineRef, (snapshot) => {
    const medicineData = snapshot.val();
    if (medicineData) {
      Object.values(medicineData).forEach((medicine) => {
        const option = document.createElement('option');
        option.value = medicine.name;
        option.text = medicine.name;
        option.dataset.costPerGram = medicine.pricepergram; // Set cost per gram from Firebase
        medicationInput.appendChild(option);
      });

      // Initialize Select2 for the medicationInput
      $(medicationInput).select2({
        dropdownParent: medicationInputContainer
      });
    }
  });

  // Prescription label
  const prescriptionLabel = document.createElement('label');
  prescriptionLabel.textContent = 'Prescription:';
  prescriptionLabel.setAttribute('for', 'prescriptionInput');

  const prescriptionInput = document.createElement('select');
  prescriptionInput.required = true;
  prescriptionInput.classList.add('select2');

  const prescriptionsRef = ref(database, 'prescriptions');
  onValue(prescriptionsRef, (snapshot) => {
    const prescriptionsData = snapshot.val();

    // Clear existing options
    prescriptionInput.innerHTML = '';

    // Add options for each prescription
    if (prescriptionsData) {
      const prescriptions = Object.values(prescriptionsData);
      prescriptions.forEach((prescription) => {
        const option = document.createElement('option');
        option.value = prescription.prescription;
        option.text = prescription.prescription;
        prescriptionInput.appendChild(option);
      });
    }
  });

  // Grams label
  const gramsLabel = document.createElement('label');
  gramsLabel.textContent = 'Milligrams:';
  gramsLabel.setAttribute('for', 'gramsInput');

  const gramsInput = document.createElement('input');
  gramsInput.type = 'number';
  gramsInput.step = 'any'; // Allow decimal values for grams
  gramsInput.placeholder = 'Milligrams';

  // Cost per gram output label
  const costPerGramLabel = document.createElement('label');
  costPerGramLabel.textContent = 'Cost of Milligrams:';
  costPerGramLabel.setAttribute('for', 'costPerGramOutput');

  const costPerGramOutput = document.createElement('output');
  costPerGramOutput.classList.add('cost-per-gram-output');
  costPerGramOutput.value = '';

  const deleteButton = document.createElement('button');
  deleteButton.classList.add('delete-medication-button');
  deleteButton.innerHTML = '<i class="fa fa-trash"></i>';
  deleteButton.addEventListener('click', () => {
    medicationInputContainer.remove();
  });

  // Update the cost per gram output when grams input changes
  gramsInput.addEventListener('input', () => {
    const gramsValue = parseFloat(gramsInput.value); // Use parseFloat to handle decimal values
    const selectedOption = medicationInput.options[medicationInput.selectedIndex];
    const costPerGram = parseFloat(selectedOption.dataset.costPerGram);
    const totalCost = gramsValue * costPerGram;
    costPerGramOutput.value = totalCost.toFixed(2);
  });

  medicationInputContainer.appendChild(medicationLabel);
  medicationInputContainer.appendChild(medicationInput);
  medicationInputContainer.appendChild(prescriptionLabel);
  medicationInputContainer.appendChild(prescriptionInput);
  medicationInputContainer.appendChild(gramsLabel);
  medicationInputContainer.appendChild(gramsInput);
  medicationInputContainer.appendChild(costPerGramLabel);
  medicationInputContainer.appendChild(costPerGramOutput);
  medicationInputContainer.appendChild(deleteButton);

  const submitMedicationButton = document.createElement('button');
  submitMedicationButton.type = 'button';
  submitMedicationButton.textContent = 'Submit Medication';
  submitMedicationButton.classList.add('submit-medication-button');
  submitMedicationButton.addEventListener('click', () => {
    const medicationRecord = {
      medication: medicationInput.value,
      prescription: prescriptionInput.value,
      grams: parseFloat(gramsInput.value),
      totalCost: parseFloat(costPerGramOutput.value.replace(/,/g, ''))
    };

    // Get the record key from the hidden input field
    const recordKeyInput = document.querySelector('input[name="recordKey"]');
    const recordKey = recordKeyInput.value;

    // Write medication record to Firebase under the record key
    const patientRef = ref(database, `patients/${currentPatientName}/testsTaken/${recordKey}/results/medication`);
    const newRecordRef = push(patientRef);

    set(newRecordRef, medicationRecord)
      .then(() => {
        showMessage('Medication submitted successfully!');
      })
      .catch((error) => {
        console.error('Error submitting medication:', error);
        showMessage('Error submitting medication. Please try again.');
      });
  });

  medicationInputContainer.appendChild(submitMedicationButton);

  return medicationInputContainer;
};

const addMedicationButton = document.getElementById('addMedicationButton');
const medicationContainer = document.getElementById('medicationInputsContainer');
addMedicationButton.addEventListener('click', () => {
  const medicationInput = createMedicationInput();
  medicationContainer.appendChild(medicationInput);

  // Initialize Select2 for the new medication input
  $(medicationInput).find('select.select2').select2();
});


// Update the total cost when grams input changes
const medicationInputs = document.querySelectorAll('.medication-input-container');
medicationInputs.forEach((medicationInput) => {
  const gramsInput = medicationInput.querySelector('input[type="number"]');

});
document.addEventListener("DOMContentLoaded", function() {
  const patientNameSelect = document.getElementById('patientNameSelect');
  const selectedTestsSelect = document.getElementById('selectedTests');
  const dobInput = document.getElementById('dob');
  // Initialize Select2 for the "Patient Name" select input
  $('#patientNameSelect').select2({
    dropdownParent: $('body')
  });

  // Initialize Select2 for the "Services Offered" select input
  $('#selectedTests').select2({
    dropdownParent: $('body')
  });
// Function to fetch patients from Firebase and populate the "Patient Name" select options
function fetchAndPopulatePatients() {
  const patientsRef = ref(database, 'patients');
  onValue(patientsRef, (snapshot) => {
    const patientsData = snapshot.val();

    // Clear existing options
    patientNameSelect.innerHTML = '';

    // Add options for each patient
    if (patientsData) {
      Object.entries(patientsData).forEach(([patientId, patient]) => {
        const option = new Option(patient.name + '   PI - ' + patient.patientId, patientId);
        patientNameSelect.appendChild(option);
      });
    }

    // Trigger change event after updating options to refresh Select2
    $('#patientNameSelect').trigger('change');
  });
}

// Function to populate the "Services Offered" select options based on the selected patient's testsTaken
function populateSelectedTestsSelect(patientId) {
  const testsTakenRef = ref(database, `patients/${patientId}/testsTaken`);
  onValue(testsTakenRef, (snapshot) => {
    const testsTakenData = snapshot.val();

    // Clear existing options
    selectedTestsSelect.innerHTML = '';

    // Add options for each test
    if (testsTakenData) {
      Object.entries(testsTakenData).forEach(([testKey, test]) => {
        const option = new Option(`${test.testsTaken} (Key: ${testKey})`, testKey);
        selectedTestsSelect.appendChild(option);
      });
    }

    // Trigger change event after updating options to refresh Select2
    $('#selectedTests').trigger('change');

    // Log the found testsTaken by the patient
    showMessage('Search Complete');
  });
}

// Listen to the click event of the "Check Patients" button
const checkPatientsButton = document.getElementById('checkPatientsButton');
checkPatientsButton.addEventListener('click', () => {
  // Get the selected patient ID
  const selectedPatientId = patientNameSelect.value;
  // Populate the "Services Offered" select options based on the selected patient's testsTaken
  populateSelectedTestsSelect(selectedPatientId);
});

// Populate the patient name select options initially
fetchAndPopulatePatients();
});





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


addRecordForm.addEventListener('submit', function (e) {
  e.preventDefault();

  const patientName = currentPatientName;
  const medicationInputs = document.querySelectorAll('.medication-input-container');

  const testsTakenSelect = document.getElementById('testsTaken');
  const selectedTestOption = testsTakenSelect.options[testsTakenSelect.selectedIndex];
  const testsTaken = selectedTestOption ? selectedTestOption.value : '';

  const additionalNotes = document.getElementById('additionalNotes').value;

  // Generate current timestamp
  const dateTaken = Date.now();

  const recordData = {
    testsTaken: testsTaken,
    additionalNotes: additionalNotes,
    dateTaken: dateTaken
  };

  const patientRef = ref(database, `patients/${patientName}`);
const testsTakenRef = child(patientRef, 'testsTaken');

// Retrieve the existing records to determine the test number
get(testsTakenRef)
  .then((snapshot) => {
    const testsData = snapshot.val();
    const testCount = testsData ? Object.keys(testsData).length : 0; // Get the number of existing records
    const newTestNumber = testCount + 1; // Calculate the new test number

    const newRecordRef = child(testsTakenRef, 'test' + newTestNumber);

    set(newRecordRef, recordData)
      .then(() => {
        // Save medication data under the new record
        medicationInputs.forEach((medicationInput) => {
          const medicationSelect = medicationInput.querySelector('select[name="medication"]');
          const prescriptionSelect = medicationInput.querySelector('select[name="prescription"]');
          const gramsInput = medicationInput.querySelector('input[name="grams"]');
          const costPerGramOutput = medicationInput.querySelector('.cost-per-gram-output');

          if (medicationSelect && prescriptionSelect && gramsInput && costPerGramOutput) {
            const medicationRecord = {
              medication: medicationSelect.value,
              prescription: prescriptionSelect.value,
              grams: parseFloat(gramsInput.value),
              totalCost: parseFloat(costPerGramOutput.value.replace(/,/g, ''))
            };

            const medicationRef = child(newRecordRef, 'medication');
            push(medicationRef, medicationRecord);
          }
       
      })
      .catch((error) => {
        console.error('Error saving new record:', error);
      });
  })
  .catch((error) => {
    console.error('Error retrieving existing records:', error);
  });

      
      addRecordForm.reset();
      showMessage('Record added successfully!');
    })
    .catch((error) => {
      console.error('Error adding record:', error);
      showMessage('Error adding record. Please try again.');
    });

});

const submitMedicationBtn = document.getElementById('submitMedicationButton');
submitMedicationBtn.addEventListener('click', (event) => {
  event.preventDefault(); // Prevent the default form submission

  const medicationRecord = {
    additionalNotes: document.getElementById('additionalNotes').value,
    finalStatus: getFinalStatus(),
    followUpDateTime: document.getElementById('followUpDateTime').value
  };

  // Get the record key from the hidden input field
  const recordKeyInput = document.querySelector('input[name="recordKey"]');
  const recordKey = recordKeyInput.value;

  // Write medication record to Firebase under the "results" node
  const patientRef = ref(database, `patients/${currentPatientName}/testsTaken/${recordKey}/results`);

  set(patientRef, medicationRecord)
    .then(() => {
      showMessage('Medication submitted successfully!');
    })
    .catch((error) => {
      console.error('Error submitting medication:', error);
      showMessage('Error submitting medication. Please try again.');
    });

  // Trigger the click event for all submitMedicationButton elements
  const submitMedicationButtons = document.querySelectorAll('.submit-medication-button');
  submitMedicationButtons.forEach((button) => {
    button.click();
  });

  // Clear medication inputs
  const medicationContainer = document.getElementById('medicationInputsContainer');
  medicationContainer.innerHTML = '';
  document.getElementById('additionalNotes').value = '';
  document.getElementById('followUpDateTime').value = '';
});

function getFinalStatus() {
  const finalStatusRadios = document.getElementsByName('finalStatus');
  for (const radio of finalStatusRadios) {
    if (radio.checked) {
      return radio.value;
    }
  }
  return ''; // Return an empty string if no radio button is checked
}




// Function to format the timestamp
function formatDate(timestamp) {
  const date = new Date(timestamp);
  const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
  return date.toLocaleString('en-US', options);
}


/*
// Get the lab requests popup elements
const listPopupOverlay = document.getElementById('listPopupOverlay');
// Variable to store the latest lab request message
let listMessage = null;

// Function to display a browser notification
function showNotification(message) {
  if (Notification.permission === 'granted') {
    const notification = new Notification('New waiting Request', {
      body: message,
    });

    // Close the notification after a few seconds
    setTimeout(notification.close.bind(notification), 9000);
  } else if (Notification.permission !== 'denied') {
    // Request permission to display notifications
    Notification.requestPermission().then((permission) => {
      if (permission === 'granted') {
        showNotification(message);
      }
    });
  }
}

 // Function to retrieve and display lab requests from Firebase
function retrieveAndDisplaylist() {
  const waitinglist = document.getElementById('waitinglist');
  waitinglist.innerHTML = ''; // Clear previous lab requests

  const chatRef = ref(database, 'waiting-list');
  onValue(chatRef, (snapshot) => {
    try {
      if (snapshot.exists()) {
        let listCount = 0;

        // Add event listeners to the filter buttons
        const notseen = document.getElementById('notseen');
        const seen = document.getElementById('seen');

        notseen.addEventListener('click', () => {
          applyFilter('Not Yet Done');
        });

        seen.addEventListener('click', () => {
          applyFilter('Completed');
        });

        // Function to apply the filter
        function applyFilter(filter) {
          const waitinglist = document.getElementById('waitinglist');
          const waitinglistItems = waitinglist.querySelectorAll('li');

          waitinglistItems.forEach((item) => {
            const status = item.getAttribute('data-status');
            if (status === filter || filter === 'All') {
              item.style.display = 'block';
            } else {
              item.style.display = 'none';
            }
          });

          // Update the active filter button
          const filterButtons = document.querySelectorAll('.filter-button');
          filterButtons.forEach((button) => {
            if (button.textContent === filter) {
              button.classList.add('active');
            } else {
              button.classList.remove('active');
            }
          });
        }

        const messages = [];
        snapshot.forEach((childSnapshot) => {
          const messageId = childSnapshot.key;
          const patient = childSnapshot.val().name;
          const status = childSnapshot.val().status || 'Not Yet Done';
          const timestamp = childSnapshot.val().date || '';
          const listItem = document.createElement('li');
          listItem.id = messageId; // Set the ID to the message ID
          listItem.setAttribute('data-status', status); // Set the "data-status" attribute

          // Create the message content with "Mark as Done" button
          const messageContent = document.createElement('span');
          messageContent.textContent = patient;
          listItem.appendChild(messageContent);

          // Create the "Mark as Done" button
          const messageStatus = document.createElement('span');
          messageStatus.textContent = status + (timestamp ? ' - ' + formatDate(timestamp) : '');
          messageStatus.classList.add('time-status'); // Add the CSS class to the span element
          listItem.appendChild(messageStatus);

          // Create the "Done" button
          const markAsDoneBtn2 = document.createElement('button');
          markAsDoneBtn2.textContent = 'Seen';
          markAsDoneBtn2.classList.add('button-done'); // Add the CSS class to the button
          markAsDoneBtn2.addEventListener('click', () => {
            markpatientAsDone(messageId);
          });
          listItem.appendChild(markAsDoneBtn2);

          // Add each message to the beginning of the array
          messages.unshift(listItem);

          if (status === 'Not Yet Done') {
            listCount++;
            messageStatus.style.color = 'red';
            // Update the latest lab request message
            listMessage = name;
          } else if (status === 'Completed') {
            markAsDoneBtn2.style.display = 'none';
          }
        });

        // Append the reversed array of messages to the waiting list
        messages.forEach((message) => {
          waitinglist.appendChild(message);
        });

        // Show a notification for the latest message (if there is any latest message)
        if (listMessage) {
          showNotification(listMessage);
        }

        // Display the count of not yet done messages
        const listCountSpan = document.getElementById('listCount');
        listCountSpan.textContent = listCount;
      } else {
        const listItem = document.createElement('li');
        listItem.textContent = 'No lab requests found.';
        waitinglist.appendChild(listItem);
      }
    } catch (error) {
      console.error('Error retrieving lab requests:', error);
      showMessage('Error retrieving lab requests:', error);
    }
  });
}


// Attach click event to the envelope icon to open the lab requests popup
//const list = document.getElementById('list');
//let listListener; // Variable to store the event listener

//list.addEventListener('click', () => {
  // Retrieve and display lab requests from Firebase
  //retrieveAndDisplaylist();

 // openlistPopup();
//});

// Call the retrieveAndDisplayLabRequests function on page load
document.addEventListener('DOMContentLoaded', () => {
  retrieveAndDisplaylist();
});

function markpatientAsDone(messageId) {
  // Update the message status in Firebase
  const listRef = ref(database, `waiting-list/${messageId}`);
  update(listRef, { status: 'Completed', timestamp: Date.now() })
    .then(() => {
      console.log('Message marked as done successfully!');
      // Clear the whole list and reload new messages
      retrieveAndDisplaylist();
    })
    .catch((error) => {
      console.error('Error marking message as done:', error);
      showMessage('Error marking message as done:', error);
    });
}

// Function to format a timestamp in a human-readable format
//function formatDate(timestamp) {
 // const date = new Date(timestamp);
 // const options = { year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' };
  //return date.toLocaleString(undefined, options);
//}

// Function to open the lab requests popup
function openlistPopup() {
  const listPopupOverlay = document.getElementById('listPopupOverlay');
  listPopupOverlay.style.display = 'block';
}

// Function to close the lab requests popup
function closelistPopup() {
  const listPopupOverlay = document.getElementById('listPopupOverlay');
  listPopupOverlay.style.display = 'none';
}

// Attach click event to the close button to close the lab requests popup
const listPopupClose = document.getElementById('listPopupClose');
listPopupClose.addEventListener('click', closelistPopup);

// Close the lab requests popup when clicking outside the popup content
window.addEventListener('click', (event) => {
  const listPopupOverlay = document.getElementById('listPopupOverlay');
  if (event.target === listPopupOverlay) {
    closelistPopup();
  }
});

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





//end of waiting list 





// Get the lab requests popup elements
const labRequestsPopupOverlay = document.getElementById('listPopupOverlay');
// Variable to store the latest lab request message
let latestLabRequestMessage = null;

// Function to retrieve and display lab requests from Firebase
function retrieveAndDisplayLabRequests() {
  const labRequestsList = document.getElementById('labRequestsList');
  labRequestsList.innerHTML = ''; // Clear previous lab requests

  const chatRef = ref(database, 'chat');
  onValue(chatRef, (snapshot) => {
    try {
      if (snapshot.exists()) {
        let notDoneCount = 0;
        const messages = [];

        // Add event listeners to the filter buttons
        const notDoneBtn = document.getElementById('notDoneBtn');
        const completedBtn = document.getElementById('completedBtn');

        notDoneBtn.addEventListener('click', () => {
          applyFilter('Not Yet Done');
        });

        completedBtn.addEventListener('click', () => {
          applyFilter('Completed');
        });

        // Function to apply the filter
        function applyFilter(filter) {
          const labRequestsList = document.getElementById('labRequestsList');
          const labRequestItems = labRequestsList.querySelectorAll('li');

          labRequestItems.forEach((item) => {
            const status = item.getAttribute('data-status');
            if (status === filter || filter === 'All') {
              item.style.display = 'block';
            } else {
              item.style.display = 'none';
            }
          });

          // Update the active filter button
          const filterButtons = document.querySelectorAll('.filter-button');
          filterButtons.forEach((button) => {
            if (button.textContent === filter) {
              button.classList.add('active');
            } else {
              button.classList.remove('active');
            }
          });
        }

        snapshot.forEach((childSnapshot) => {
          const messageId = childSnapshot.key;
          const labRequest = childSnapshot.val().message;
          const status = childSnapshot.val().status || 'Not Yet Done';
          const timestamp = childSnapshot.val().timestamp || '';
          const listItem = document.createElement('li');
          listItem.id = messageId; // Set the ID to the message ID
          listItem.setAttribute('data-status', status); // Set the "data-status" attribute

          // Create the message content with "Mark as Done" button
          const messageContent = document.createElement('span');
          messageContent.textContent = labRequest;
          listItem.appendChild(messageContent);

          // Create the "Done" button
          const messageStatus = document.createElement('span');
          messageStatus.textContent = status + (timestamp ? ' - ' + formatDate(timestamp) : '');
          messageStatus.classList.add('time-status'); // Add the CSS class to the span element
          listItem.appendChild(messageStatus);

          // Create the "Mark as Done" button
          const markAsDoneBtn = document.createElement('button');
          markAsDoneBtn.textContent = 'Clear';
          markAsDoneBtn.classList.add('button-done'); // Add the CSS class to the button
          markAsDoneBtn.addEventListener('click', () => {
            markMessageAsDone(messageId);
          });
          listItem.appendChild(markAsDoneBtn);

          // Add each message to the beginning of the array
          messages.unshift(listItem);

          if (status === 'Not Yet Done') {
            notDoneCount++;
            messageStatus.style.color = 'red';
            // Update the latest lab request message
            latestLabRequestMessage = labRequest;
          } else if (status === 'Completed') {
            markAsDoneBtn.style.display = 'none';
          }
        });

        // Append the reversed array of messages to the lab requests list
        messages.forEach((message) => {
          labRequestsList.appendChild(message);
        });

        // Show a notification for the latest message (if there is any latest message)
        if (latestLabRequestMessage) {
          showNotification(latestLabRequestMessage);
        }

        // Display the count of not yet done messages
        const notDoneCountSpan = document.getElementById('notDoneCount');
        notDoneCountSpan.textContent = notDoneCount;
      } else {
        const noLabRequestsItem = document.createElement('li');
        noLabRequestsItem.textContent = 'No lab requests found.';
        labRequestsList.appendChild(noLabRequestsItem);
      }
    } catch (error) {
      console.error('Error retrieving lab requests:', error);
      showMessage('Error retrieving lab requests:', error);
    }
  });
}


// Attach click event to the envelope icon to open the lab requests popup
const envelopeIcon = document.getElementById('envelope-icon');
let labRequestsListener; // Variable to store the event listener

envelopeIcon.addEventListener('click', () => {
  // Retrieve and display lab requests from Firebase
  retrieveAndDisplayLabRequests();

  openLabRequestsPopup();
});

// Call the retrieveAndDisplayLabRequests function on page load
document.addEventListener('DOMContentLoaded', () => {
  retrieveAndDisplayLabRequests();
});

function markMessageAsDone(messageId) {
  // Update the message status in Firebase
  const messageRef = ref(database, `chat/${messageId}`);
  update(messageRef, { status: 'Completed', timestamp: Date.now() })
    .then(() => {
      console.log('Message marked as done successfully!');
      // Clear the whole list and reload new messages
      retrieveAndDisplayLabRequests();
    })
    .catch((error) => {
      console.error('Error marking message as done:', error);
      showMessage('Error marking message as done:', error);
    });
}

// Function to format a timestamp in a human-readable format
//function formatDate(timestamp) {
 // const date = new Date(timestamp);
 // const options = { year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' };
  //return date.toLocaleString(undefined, options);
//}

// Function to open the lab requests popup
function openLabRequestsPopup() {
  const labRequestsPopupOverlay = document.getElementById('labRequestsPopupOverlay');
  labRequestsPopupOverlay.style.display = 'block';
}

// Function to close the lab requests popup
function closeLabRequestsPopup() {
  const labRequestsPopupOverlay = document.getElementById('labRequestsPopupOverlay');
  labRequestsPopupOverlay.style.display = 'none';
}

// Attach click event to the close button to close the lab requests popup
const labRequestsPopupClose = document.getElementById('labRequestsPopupClose');
labRequestsPopupClose.addEventListener('click', closeLabRequestsPopup);

// Close the lab requests popup when clicking outside the popup content
window.addEventListener('click', (event) => {
  const labRequestsPopupOverlay = document.getElementById('labRequestsPopupOverlay');
  if (event.target === labRequestsPopupOverlay) {
    closeLabRequestsPopup();
  }
});

*/

/*


const uploadForm = document.getElementById('addPatientForm');




uploadForm.addEventListener('DOMContentLoaded', () => {
  populateNextPatientId();
});

uploadForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const nameInput = document.getElementById('name');
  const dobInput = document.getElementById('dob');
  const parentsInput = document.getElementById('parents');
  const residenceInput = document.getElementById('residence');
  const paymentInput = document.getElementById('payment');
  const sexInput = document.getElementById('sex');
  const patientIdInput = document.getElementById('patientId');

  // Save patient data to Firebase
  const savePatientData = () => {
    const name = nameInput.value;
    const dob = dobInput.value;
    const parents = parentsInput.value;
    const residence = residenceInput.value;
    const payment = paymentInput.value;
    const sex = sexInput.value;
    const patientId = patientIdInput.value;

    const patientsRef = ref(database, 'patients');
    const newPatientRef = child(patientsRef, patientId); // Use patient ID as the key

    set(newPatientRef, {
      name: name,
      dob: dob,
      parents: parents,
      residence: residence,
      payment: payment,
      sex: sex,
      patientId: patientId
    })
      .then(() => {
        nameInput.value = '';
        dobInput.value = '';
        parentsInput.value = '';
        residenceInput.value = '';
        paymentInput.value = '';
        sexInput.value = '';
        patientIdInput.value = '';

        showMessage('Patient details uploaded successfully!');
      })
      .catch((error) => {
        console.error('Error uploading patient details:', error);
        showMessage('Error uploading patient details. Please try again.');
      });
  };

const showMessage = (message) => {
  const messageElement = document.getElementById('message');
  messageElement.textContent = message;
  messageElement.style.display = 'block';

  setTimeout(() => {
    messageElement.style.display = 'none';
  }, 3000);
};

// Attach the savePatientData function to the form submit event
const addPatientForm = document.getElementById('addPatientForm');
addPatientForm.addEventListener('submit', (e) => {
  e.preventDefault();
  savePatientData();
});

});

*/


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

    const openChatBtn = document.getElementById('openChatBtn');
const chatOverlay = document.getElementById('chatOverlay');
const chatContainer = document.getElementById('chatContainer');

openChatBtn.addEventListener('click', () => {
  chatOverlay.style.display = 'block'; // Show overlay
  chatContainer.style.display = 'block'; // Show chat container
});

// Close chat on overlay click
chatOverlay.addEventListener('click', () => {
  chatOverlay.style.display = 'none'; // Hide overlay
  chatContainer.style.display = 'none'; // Hide chat container
});

// Function to send the message
function sendMessage() {
  const messageText = messageInput.value.trim();
  if (messageText !== '') {
    const sender = 'Laboratory'; // You can replace 'User' with the actual username or user ID
    const timestamp = new Date().toISOString();
    const message = { text: messageText, sender: sender, timestamp: timestamp };

    // Save the message to Firebase
    push(messagesRef, message)
      .catch((error) => {
        console.error('Error sending message:', error);
      });

    messageInput.value = ''; // Clear the input field
  }
}

// Event listener for the Send button
sendMessageBtn.addEventListener('click', sendMessage);

// Event listener for the Enter key in the input field
messageInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    sendMessage();
  }
});