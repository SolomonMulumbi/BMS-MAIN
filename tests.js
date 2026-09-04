
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

// Retrieve the maximum patient count from the database
const patientsRef = ref(database, 'patients');
get(patientsRef)
  .then((snapshot) => {
    if (snapshot.exists()) {
      const patientData = snapshot.val();
      const patientIds = Object.values(patientData).map((patient) => parseInt(patient.patientId));
      patientCount = Math.max(...patientIds, 0) + 1;
    } else {
      patientCount = 1; // If no patient data exists, start from 1
    }

    form.addEventListener('submit', function(e) {
      e.preventDefault();

      const name = document.getElementById('name').value.trim(); // Remove leading and trailing spaces
      const dob = document.getElementById('dob').value;
      const parents = document.getElementById('parents').value;
      const residence = document.getElementById('residence').value;
      const payment = document.getElementById('payment').value;
      const sex = document.getElementById('sex').value;
      const patientId = patientCount.toString(); // Generate patient ID as plain number

      const patientData = {
        name: name,
        dob: dob,
        parents: parents,
        residence: residence,
        payment: payment,
        sex: sex,
        patientId: patientId,
        
      };

      const newPatientRef = ref(database, `patients/${name}`); // Use patient name as the key

      // Check if patient with the same name already exists
      get(newPatientRef)
        .then((snapshot) => {
          if (snapshot.exists()) {
            // Display an alert if patient with the same name already exists
            alert('Patient with the same name already exists.');
          } else {
            // Show the loader
            loader.style.display = 'block';

            // Save the new patient data
            set(newPatientRef, patientData)
              .then(() => {
                form.reset();
                showMessage('Patient details uploaded successfully!');
                patientCount++; // Increment patient count

                // Hide the loader
                loader.style.display = 'none';
              })
              .catch((error) => {
                console.error('Error uploading patient details:', error);
                showMessage('Error uploading patient details. Please try again.');

                // Hide the loader
                loader.style.display = 'none';
              });
          }
        })
        .catch((error) => {
          console.error('Error checking if patient exists:', error);
          showMessage('Error checking if patient exists. Please try again.');

          // Hide the loader
          loader.style.display = 'none';
        });
    });
  })
  .catch((error) => {
    console.error('Error retrieving patient count:', error);
    showMessage('Error retrieving patient count. Please try again.');
  });

// Add event listener to search button
searchButton.addEventListener('click', () => {
  const searchTerm = searchInput.value.trim(); // Get the search term

  // Show the loader
  loaderElement.classList.remove('hidden');

  // Clear the patients container
  patientsContainer.innerHTML = '';

  // Search through Firebase for patient names and IDs
  const patientsRef = ref(database, 'patients');
  onValue(patientsRef, (snapshot) => {
    const patientsData = snapshot.val();
    const searchResults = [];

    if (patientsData) {
      const patients = Object.entries(patientsData);

      if (searchTerm !== '') {
        // Filter patients based on the search term
        patients.forEach(([patientId, patient]) => {
          if (patient.name.toLowerCase().includes(searchTerm.toLowerCase()) || patient.patientId.includes(searchTerm)) {
            searchResults.push(patient);
          }
        });
      } else {
        // Display all patients if the search term is empty
        searchResults.push(...patients.map(([patientId, patient]) => patient));
      }
    }

    // Hide the loader
    loaderElement.classList.add('hidden');

    // Display search results
    if (searchResults.length > 0) {
      renderPatients(searchResults);
    } else {
      patientsContainer.innerHTML = '<p class="no-results">No Patients found.</p>';
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
  const searchTerm = searchInput.value.trim(); // Get the search term
  const patientsRef = ref(database, 'patients');
  onValue(patientsRef, (snapshot) => {
    const patientsData = snapshot.val();
    const patients = patientsData ? Object.values(patientsData) : [];
    filterPatients(patients, searchTerm);
  });
});

function renderPatients(patients) {
  
  patientsContainer.innerHTML = '';

// Create the table element
const table = document.createElement('table');
table.classList.add('patient-table');

// Create the table header row
const tableHeaderRow = document.createElement('tr');
tableHeaderRow.classList.add('table-header');

// Define the table header columns
const headers = ['Name', 'Place of Residence', 'Payment Terms', 'Sex', 'Patient ID', 'Contact', 'Date of Birth', 'Age', 'Actions'];

// Create the table header cells
headers.forEach(headerText => {
  const tableHeaderCell = document.createElement('th');
  tableHeaderCell.textContent = headerText;
  tableHeaderRow.appendChild(tableHeaderCell);
});
// Function to create a table cell with hidden first digits
function createHiddenDigitsTableCell(text, visibleDigitsCount) {
  const cell = document.createElement('td');
  const hiddenDigits = '*'.repeat(text.length - visibleDigitsCount);
  const visibleDigits = text.slice(-visibleDigitsCount);
  cell.textContent = hiddenDigits + visibleDigits;
  return cell;
}
// Append the header row to the table
table.appendChild(tableHeaderRow);

patients.forEach(patient => {
  // Create a table row for each patient
  const tableRow = document.createElement('tr');
  tableRow.classList.add('table-row');

  // Create the table cells for patient information
  const nameCell = createTableCell(patient.name);
  const residenceCell = createTableCell(patient.residence);
  const paymentCell = createTableCell(patient.payment);
  const sexCell = createTableCell(patient.sex);
  const patientIdCell = createTableCell('PI- ' + patient.patientId);
  const parentsCell = createHiddenDigitsTableCell(patient.parents, 3);
  const dobCell = createTableCell(patient.dob);
  
  // Calculate the age based on the date of birth
  const dob = new Date(patient.dob);
  const today = new Date();
  const age = today.getFullYear() - dob.getFullYear();
  const ageCell = createTableCell(age.toString());

  // Create the actions cell with the view button
  const actionsCell = document.createElement('td');
  const viewButton = document.createElement('button');
  viewButton.textContent = 'View';
  viewButton.classList.add('view-button');
  viewButton.addEventListener('click', function() {
    currentPatientName = patient.name; // Set the current patient name
    openPatientHistoryPopup(patient);
  });
  actionsCell.appendChild(viewButton);

  // Append the cells to the table row
  tableRow.appendChild(nameCell);
  tableRow.appendChild(residenceCell);
  tableRow.appendChild(paymentCell);
  tableRow.appendChild(sexCell);
  tableRow.appendChild(patientIdCell);
  tableRow.appendChild(parentsCell);
  tableRow.appendChild(dobCell);
  tableRow.appendChild(ageCell);
  tableRow.appendChild(actionsCell);

  // Append the row to the table
  table.appendChild(tableRow);
});



// Append the table to the patients container
patientsContainer.appendChild(table);

function createTableCell(text) {
  const cell = document.createElement('td');
  cell.textContent = text;
  return cell;
}
}


















// Function to format the timestamp
function formatDate(timestamp) {
  const date = new Date(timestamp);
  const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
  return date.toLocaleString('en-US', options);
}












function openPatientHistoryPopup(patient) {
  const popupOverlay = document.getElementById('popupOverlay1');
  const popupClose = document.getElementById('popupClose1');
  const patientDetails = document.getElementById('patientDetails');
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

  const patientDetailsHTML = `
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
    font-size: 14px;
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
    <p><strong>Name:</strong> ${patient.name}</p>
<p><strong>Date of Birth:</strong> ${patient.dob}</p>
<p><strong>Payment Type:</strong> ${patient.payment}</p>
<p><strong>Residence:</strong> ${patient.residence}</p>
<p><strong>Contact:</strong> ${patient.parents}</p>
<p><strong>Patient ID:</strong> ${patient.patientId}</p>
<p><strong>Current Patient's Status:</strong> <span id="currentStatus"></span></p>

    <!-- Add a "Visit Count" element in your HTML -->
    <p><strong>No. of visits:</strong>  <span id="visitCount"></span></p>
    <!-- Add more patient details as needed -->

    <!-- The container for patient visit details -->
<div id="patientVisitDetails" ></div>


    <!-- Assuming you have the patient's name as patientName variable -->
<button style="background: darkblue;" id="visit" data-patient="${patient.name}" class="button save-button">
  <i id="visitIcon" style="margin-right: 5px;" class="fas fa-calendar-check"></i>Reg. Visit
</button>
          <button  style="background: darkblue; " id="triageButton"  class="button save-button"><i style="margin-right: 5px;" class="fas fa-chart-line"></i>Triage History</button>

<button id="saveButton"  class="button save-button" disabled><i style="margin-right: 5px;" class="fa fa-save"></i>Save Image</button>
<button id="delButton" class="button delete-button"><i class="fa fa-trash"></i>Delete Image</button>
<button id="addToWaitingListButton" class="button save-button">
  <i style="margin-right: 5px;" class="fas fa-list"></i>Add to Waiting List
</button>

  </div>
  `;

  patientDetails.innerHTML = patientDetailsHTML;

// Function to handle saving the visit
function handleSaveVisit() {
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

  // Push the visit to the "visits" node under the specific patient
  const visitsRef = ref(database, `patients/${currentPatientName}/visits`);
  push(visitsRef, visit)
    .then(() => {
      showMessage('Visit saved successfully!');
      
      // Reset the patient name and close the popup
      currentPatientName = '';
      visitPopupTitle.textContent = ''; // Clear the patient name from the popup title
      visitPopupOverlay.style.display = 'none'; // Hide the popup
      isPopupOpen = false; // Update the isPopupOpen variable

      // Reset the form fields after saving the visit
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
   // Remove the event listener to avoid duplicates
   saveVisitButton.removeEventListener('click', handleSaveVisit);
    })
    .catch((error) => {
      console.error('Error saving visit:', error);
      showMessage('Error saving visit. Please try again.');
    });
}
// Get the "Save Visit" button element
const saveVisitButton = document.getElementById('saveVisitBtn');

// Get the button element and add the click event listener
const visitButton = document.getElementById('visit');
const visitPopupOverlay = document.getElementById('popup-overlay3');
const visitPopupTitle = document.getElementById('visitPopupTitle');
let currentPatientName = ''; // Declare a variable to store the current patient name

visitButton.addEventListener('click', (event) => {
  // Check if the popup is already open before opening it again
  if (!isPopupOpen) {
    currentPatientName = event.target.getAttribute('data-patient'); // Extract the patient's name from the data-patient attribute
    visitPopupTitle.textContent = `Save Visit for Patient: ${currentPatientName}`; // Set the popup title
    visitPopupOverlay.style.display = 'block';
    // Update the isPopupOpen variable to true when the popup is opened
    isPopupOpen = true;

    // Remove any existing event listeners from "Save Visit" button and add the click event listener
    saveVisitButton.removeEventListener('click', handleSaveVisit);
    saveVisitButton.addEventListener('click', handleSaveVisit);
  }
});

// Get the close button element and add the click event listener to close the popup
const closePopupBtn4 = document.getElementById('closePopupBtn4');
closePopupBtn4.addEventListener('click', () => {
  const popupOverlay = document.getElementById('popup-overlay4');
  popupOverlay.style.display = 'none';
});





// Assuming you have already included the Select2 library in your HTML
// Initialize Select2 for the "Allergies" select input
$('#allergies').select2({
  dropdownParent: $('body')
});

// Initialize Select2 for the "Clinician's Name" select input
$('#clinicianName').select2({
  dropdownParent: $('body')
});

// Assuming you have the "testsTakenSelect" element as the "Allergies" select input
const testsTakenSelect = document.getElementById('allergies');

// Assuming you have the "clinicianNameSelect" element as the "Clinician's Name" select input
const clinicianNameSelect = document.getElementById('clinicianName');

// Retrieve allergies from Firebase and populate the "Allergies" select options
const allergiesRef = ref(database, 'medicine');
onValue(allergiesRef, (snapshot) => {
  const allergiesData = snapshot.val();

  // Clear existing options
  $('#allergies').empty(); // Use Select2 method to clear options

  // Add options for each allergy
  if (allergiesData) {
    const allergies = Object.values(allergiesData);
    allergies.forEach((allergy) => {
      const option = new Option(allergy.name, allergy.name);
      $('#allergies').append(option); // Use Select2 method to add option
    });
  }

  // Trigger change event after updating options to refresh Select2
  $('#allergies').trigger('change');
});

// Retrieve clinician names from Firebase and populate the "Clinician's Name" select options
const cliniciansRef = ref(database, 'staff');
onValue(cliniciansRef, (snapshot) => {
  const cliniciansData = snapshot.val();
  clinicianNameSelect.innerHTML = '<option value="" disabled selected>Select a clinician</option>';

  // Clear existing options
 // $('#clinicianName').empty(); // Use Select2 method to clear options

  // Add options for each clinician
  if (cliniciansData) {
    const clinicians = Object.values(cliniciansData);
    clinicians.forEach((clinician) => {
      const option = new Option(clinician.name, clinician.name);
      $('#clinicianName').append(option); // Use Select2 method to add option
    });
  }

  // Trigger change event after updating options to refresh Select2
  $('#clinicianName').trigger('change');
});

// Assuming you have the "patientName" variable with the patient's name

const addToWaitingListButton = document.getElementById('addToWaitingListButton');

addToWaitingListButton.addEventListener('click', () => {
  const patientName = patient.name;
  const patientId = patient.patientId;

  // Get the current date and time
  const currentDate = new Date();
  const formattedDate = formatDate(currentDate);

  // Send patient details along with the date and time to Firebase in the "waiting-list" node
  addToWaitingList(patientName, patientId, formattedDate);
});

// Function to add patient to the waiting list in Firebase
function addToWaitingList(patientName, patientId, date) {
  const waitingListRef = ref(database, 'waiting-list');
  push(waitingListRef, { name: patientName, id: patientId, date: date })
    .then(() => {
      
      showMessage('Patient added to the waiting list successfully!');
    })
    .catch((error) => {
      console.error('Error adding patient to the waiting list:', error);
      showMessage('Error adding patient to the waiting list:', error);
    });
}

// Function to format the date and time in a readable format (e.g., "YYYY-MM-DD HH:mm:ss")
function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

  
  const patientHistoryElement = document.getElementById('patientHistory');
// Get references to the elements
const uploadImage = document.getElementById('uploadImage');
const saveButton = document.getElementById('saveButton');
const imageFrame = document.querySelector('.patient-image-frame');
// ...

// Check if the patient has an image URL
if (patient.image) {
  // Create the image element
  const imageElement = document.createElement('img');
  imageElement.src = patient.image;
  imageElement.alt = 'Patient Image';

  // Append the image to the frame
  imageFrame.innerHTML = '';
  imageFrame.appendChild(imageElement);
} else {
  // Show the upload input if no image is available
  const uploadLabel = document.createElement('label');
  uploadLabel.htmlFor = 'uploadImage';
  uploadLabel.className = 'upload-label';
  uploadLabel.innerHTML = `
    <i class="fas fa-cloud-upload-alt"></i>
    Upload Patient's Image Here
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


// Handle save button click
saveButton.addEventListener('click', function () {
  // Get the image data from the image element
  const imageElement = imageFrame.querySelector('img');
  const imageData = imageElement.src;

  // Get the patient name
  const patientName = patient.name;

  // Generate a unique filename for the image using the patient's name
  const filename = `${patientName}_${Date.now()}.jpg`;

  // Save the image data to Firebase Storage under the patient's name
  const imageRef = storageRef(storage, `images/${filename}`);
  const imageBlob = dataURItoBlob(imageData);

  // Upload the image blob to Firebase Storage
  const uploadTask = uploadBytes(imageRef, imageBlob);

  // Monitor the upload completion using the then method
  uploadTask.then(function () {
    // The image has been successfully uploaded
    // Get the download URL of the image
    getDownloadURL(imageRef).then(function (downloadURL) {
      // Save the download URL to the patient's data in Firebase
      const patientRef = ref(database, `patients/${patient.name}`);
      update(patientRef, {
        image: downloadURL,
      });

      // Show success message or perform any additional actions
      showMessage('Image saved successfully!');
    });
  }).catch(function (error) {
    // Handle the upload error
    console.error('Error uploading image:', error);
    showMessage('Error uploading image. Please try again.');
  });
});

const deleteButton = document.getElementById('delButton')
// ...

// Handle delete button click
deleteButton.addEventListener('click', function () {
  if (!patient.image) {
    // No image available, do nothing
    return;
  }

  // Update the patient's data to remove the image reference
  const patientRef = ref(database, `patients/${patient.name}`);
  update(patientRef, {
    image: null,
  })
    .then(() => {
      imageFrame.innerHTML = '';

      // Disable the delete button
      deleteButton.disabled = true;

      // Show success message or perform any additional actions
      showMessage('Image deleted successfully!');
    })
    .catch((error) => {
      console.error('Error deleting image:', error);
      showMessage('Error deleting image. Please try again.');
    });
});

// ...



// Check if the patient has an image URL
if (patient.image) {
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
const patientName = patient.name; // Replace this with the patient's name
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
            resultsObtainedElement.textContent = 'Test Results status: ' + (resultsObtained === 'Completed Successfully' ? 'Completed Successfully' : 'Pending...');
            resultsObtainedElement.style.color = resultsObtained === 'Completed Successfully' ? 'darkblue' : 'orange';
          } else {
            resultsObtainedElement.textContent = 'Test Results status: Pending...';
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












// Variable to track whether the popup is open or not
let isPopupOpen = false;




// Function to close the popup
function closePopup() {
  visitPopupOverlay.style.display = 'none';
}

// Event listener for the "Cancel" button
const cancelVisitBtn = document.getElementById('cancelVisitBtn');
cancelVisitBtn.addEventListener('click', closePopup);

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

// Get the button element and add the click event listener
const triageButton = document.getElementById('triageButton');
triageButton.addEventListener('click', () => {
  displayVisitsPopup(patientName);
});
















function createRecordElement(recordKey, record) {
  const recordElement = document.createElement('div');
  recordElement.classList.add('record');


  const recordKeyElement = document.createElement('h4');
  recordKeyElement.textContent = 'Record Key: ' + recordKey;
  recordElement.appendChild(recordKeyElement);

  const dateTakenElement = document.createElement('p');
  const dateTaken = new Date(parseInt(record.dateTaken));
  if (!isNaN(dateTaken.getTime())) {
    dateTakenElement.textContent = 'Date Taken: ' + dateTaken.toLocaleString();
  } else {
    dateTakenElement.textContent = 'Invalid Date';
  }
  recordElement.appendChild(dateTakenElement);

  const testsTakenElement = document.createElement('p');
  testsTakenElement.textContent = 'Services Offered: ' + record.testsTaken;
  recordElement.appendChild(testsTakenElement);

// Add this line at the beginning of your code to store the prices data
const pricesData = {};
// Create a button for uploading consumables and sundries prices
const uploadPricesButton = document.createElement('button');
uploadPricesButton.textContent = ' + Prices';
uploadPricesButton.classList.add('upload-prices-button');

// Add event listener to the upload prices button
uploadPricesButton.addEventListener('click', () => {
  // Get the current record key
  const recordKey = recordKeyElement.textContent.replace('Record Key: ', '');

  const overlay = document.createElement('div');
  overlay.classList.add('overlay3');

  const popup = document.createElement('div');
  popup.classList.add('popup3');

  const closeButton = document.createElement('button');
  closeButton.textContent = 'X';
  closeButton.classList.add('close-button');

  const heading = document.createElement('h2');
  heading.textContent = 'Upload Medical Consumables & Sundries Prices';
  popup.appendChild(closeButton);
  popup.appendChild(heading);

  // Create a form to input the prices
  const pricesForm = document.createElement('form');
  pricesForm.id = 'pricesForm';

  // Input field for consumables price
  const consumablesLabel = document.createElement('label');
  consumablesLabel.textContent = 'Consumables Price (UGX):';
  const consumablesInput = document.createElement('input');
  consumablesInput.type = 'number';
  consumablesInput.name = 'consumablesPrice';
  consumablesInput.required = true;
  consumablesLabel.appendChild(consumablesInput);

  // Input field for sundries price
  const sundriesLabel = document.createElement('label');
  sundriesLabel.textContent = 'Sundries Price (UGX):';
  const sundriesInput = document.createElement('input');
  sundriesInput.type = 'number';
  sundriesInput.name = 'sundriesPrice';
  sundriesInput.required = true;
  sundriesLabel.appendChild(sundriesInput);

  // Submit button for the form
  const submitButton = document.createElement('button');
  submitButton.type = 'submit';
  submitButton.textContent = 'Upload';
  submitButton.classList.add('upload-button');

  pricesForm.appendChild(consumablesLabel);
  pricesForm.appendChild(sundriesLabel);
  pricesForm.appendChild(submitButton);

  popup.appendChild(pricesForm);

  // Append the overlay and popup to the document body
  document.body.appendChild(overlay);
  document.body.appendChild(popup);

  // Show the overlay and popup
  overlay.style.display = 'block';
  popup.style.display = 'block';

  // Close button event listener
  closeButton.addEventListener('click', () => {
    // Hide the overlay and popup
    overlay.style.display = 'none';
    popup.style.display = 'none';
  });

  // Form submit event listener
  pricesForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(pricesForm);
    const consumablesPrice = formData.get('consumablesPrice');
    const sundriesPrice = formData.get('sundriesPrice');

    // Save the consumables and sundries data to Firebase under the exact test record
    saveConsumablesAndSundriesData(recordKey, consumablesPrice, sundriesPrice);

    // Hide the overlay and popup
    overlay.style.display = 'none';
    popup.style.display = 'none';
  });
});

function saveConsumablesAndSundriesData(recordKey, consumablesPrice, sundriesPrice) {
  // Save the consumablesPrice and sundriesPrice to the data object under the current record key
  const data = {
    consumablesPrice: parseFloat(consumablesPrice),
    sundriesPrice: parseFloat(sundriesPrice),
    dateUploaded: new Date().toLocaleString(),
  };

  // Save the data to Firebase under the exact test record
  const testRecordRef = ref(database, `patients/${patient.name}/testsTaken/${recordKey}`);
  update(testRecordRef, { consumablesAndSundries: data })
    .then(() => {
      showMessage('Consumables and Sundries data saved successfully!');
    })
    .catch((error) => {
      console.error('Error saving consumables and sundries data:', error);
      showMessage('Error saving consumables and sundries data. Please try again.');
    });
}

// Create payment status element
const paymentStatusElement = document.createElement('p');
paymentStatusElement.textContent = 'Service Payment: ' + (record.paymentstatus || 'Not Paid');
paymentStatusElement.classList.add('payment-status'); // Add the CSS class
recordElement.appendChild(paymentStatusElement);

// Create approve button only if payment is not received
if (record.paymentstatus !== 'payment received') {

  paymentStatusElement.style.color = 'red';
  // Create approve button
  const approveButton = document.createElement('button');
  approveButton.classList.add('approve-button');

  // Create check icon
  const checkIcon = document.createElement('i');
  checkIcon.classList.add('fas', 'fa-check-circle');

  // Set the inner HTML of the approve button
  approveButton.innerHTML = '';
  approveButton.appendChild(checkIcon);
  approveButton.innerHTML += ' Approve Service Payment';

  // Add click event listener to the approve button
  approveButton.addEventListener('click', () => {
    // Update the payment status in Firebase
    const paymentStatusRef = ref(database, `patients/${patientName}/testsTaken/${recordKey}/paymentstatus`);

    set(paymentStatusRef, 'payment received')
      .then(() => {
        showMessage('Payment status updated successfully!');
        console.log('Payment status updated successfully.');
      })
      .catch((error) => {
        console.error('Error updating payment status:', error);
        showMessage('Error updating payment status:', error);
      });
  });

  // Append the approve button to a container element on your webpage
  recordElement.appendChild(approveButton);
}else {
  paymentStatusElement.style.color = 'blue';
}

// Create results obtained element
const resultsObtainedElement = document.createElement('p');
  resultsObtainedElement.textContent = 'Test Results status: ' + (record.results?.resultsObtained || 'Pending...');
  
  // Add the 'results-obtained-data' class to the element
  resultsObtainedElement.classList.add('results-obtained-data');

  if (record.results && record.results.resultsObtained === 'Completed Successfully') {
    resultsObtainedElement.style.color = 'darkblue';
  } else {
    resultsObtainedElement.style.color = 'orange';
  }
  recordElement.appendChild(resultsObtainedElement);




// Create a row for the consumables price
const consumablesRow = document.createElement('tr');
recordElement.appendChild(consumablesRow);

  const consumablesPriceHeader = document.createElement('th');
  consumablesPriceHeader.textContent = 'Consumables Price (UGX)';
  consumablesPriceHeader.style.color = "blue"
  consumablesPriceHeader.style.fontWeight = "bold"
  consumablesRow.appendChild(consumablesPriceHeader);

  // Check if consumables price data exists for the current record key and the nested node
  if (record.hasOwnProperty('consumablesAndSundries')) {
    const consumablesPriceData = record.consumablesAndSundries.consumablesPrice.toLocaleString('en-US', {    style: 'currency',   currency: 'UGX',  });

    const consumablesPriceDataCell = document.createElement('td');
    consumablesPriceDataCell.textContent = consumablesPriceData;
    consumablesPriceDataCell.style.color = "green"
    consumablesPriceDataCell.style.fontWeight = "bold"
    consumablesRow.appendChild(consumablesPriceDataCell);
  } else {
    // If consumables price data not found, display "Not Found" in the table cell
    const noConsumablesDataCell = document.createElement('td');
    noConsumablesDataCell.textContent = 'Not Found';
    noConsumablesDataCell.style.color = "red"
    noConsumablesDataCell.style.fontWeight = "bold"
    consumablesRow.appendChild(noConsumablesDataCell);
  }

  // Create a row for the sundries price
  const sundriesRow = document.createElement('tr');
  recordElement.appendChild(sundriesRow);

  const sundriesPriceHeader = document.createElement('th');
  sundriesPriceHeader.textContent = 'Sundries Price (UGX)';
  sundriesPriceHeader.style.color = "blue"
  sundriesRow.appendChild(sundriesPriceHeader);

  // Check if sundries price data exists for the current record key and the nested node
  if (record.hasOwnProperty('consumablesAndSundries')) {
    const sundriesPriceData = record.consumablesAndSundries.sundriesPrice.toLocaleString('en-US', {    style: 'currency',   currency: 'UGX',  });

    const sundriesPriceDataCell = document.createElement('td');
    sundriesPriceDataCell.style.color = "green"
    sundriesPriceDataCell.style.fontWeight = "bold"
    sundriesPriceDataCell.textContent = sundriesPriceData;
    sundriesRow.appendChild(sundriesPriceDataCell);
  } else {
    // If sundries price data not found, display "Not Found" in the table cell
    const noSundriesDataCell = document.createElement('td');
    noSundriesDataCell.textContent = 'Not Found';
    noSundriesDataCell.textContent = 'Not Found';
    noSundriesDataCell.style.color = "red"
    noSundriesDataCell.style.fontWeight = "bold"
    sundriesRow.appendChild(noSundriesDataCell);
  }


// Create a row for the treatment total
const treatmentTotalRow = document.createElement('tr');
  recordElement.appendChild(treatmentTotalRow);

  const totalHeader = document.createElement('th');
  totalHeader.textContent = 'Treatment Total (UGX)';
  treatmentTotalRow.appendChild(totalHeader);

  // Calculate the treatment total by adding consumables and sundries prices
  if (record.hasOwnProperty('consumablesAndSundries')) {
    const consumablesPrice = record.consumablesAndSundries.consumablesPrice;
    const sundriesPrice = record.consumablesAndSundries.sundriesPrice;
    const treatmentTotal = consumablesPrice + sundriesPrice;

    const totalDataCell = document.createElement('td');
    totalDataCell.textContent = treatmentTotal.toLocaleString('en-US', {    style: 'currency',   currency: 'UGX',  });
    treatmentTotalRow.appendChild(totalDataCell);
  } else {
    // If consumables and sundries price data not found, display "Not Found" in the table cell
    const noTotalDataCell = document.createElement('td');
    noTotalDataCell.textContent = 'Not Found';
    treatmentTotalRow.appendChild(noTotalDataCell);
  }

const medicationTakenElement = document.createElement('div');
medicationTakenElement.classList.add('medication-taken');
const medicationTable = document.createElement('table');
medicationTable.classList.add('medication-table');

// Create table header row
const tableHeaderRow = document.createElement('tr');
const headers = ['Medication', 'Prescription', 'Milligrams', 'Total Cost'];
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
totalCostCell.textContent = 'Medicine Total: ' + totalCost.toLocaleString('en-US', { style: 'currency', currency: 'UGX' });
totalCostCell.classList.add('total-cell'); // Add the CSS class
totalRow.appendChild(totalCostCell);

// Create payment status element
const medicineStatusElement = document.createElement('p');
medicineStatusElement.textContent = 'Medicine Payment: ' + (record.medicinestatus || 'Not Paid');
medicineStatusElement.classList.add('payment-status'); // Add the CSS class
recordElement.appendChild(medicineStatusElement);

// Create approve button only if payment is not received
if (record.medicinestatus !== 'payment received') {

  medicineStatusElement.style.color = 'red';
  // Create approve button
  const approve2Button = document.createElement('button');
  approve2Button.classList.add('approve-button');

  // Create check icon
  const checkIcon = document.createElement('i');
  checkIcon.classList.add('fas', 'fa-check-circle');

  // Set the inner HTML of the approve button
  approve2Button.innerHTML = '';
  approve2Button.appendChild(checkIcon);
  approve2Button.innerHTML += ' Approve medicine payment';

  // Add click event listener to the approve button
  approve2Button.addEventListener('click', () => {
    // Update the payment status in Firebase
    const medicineStatusRef = ref(database, `patients/${patientName}/testsTaken/${recordKey}/medicinestatus`);

    set(medicineStatusRef, 'payment received')
      .then(() => {
        showMessage('Payment status updated successfully!');
        console.log('Payment status updated successfully.');
      })
      .catch((error) => {
        console.error('Error updating payment status:', error);
        showMessage('Error updating payment status:', error);
      });
  });

  // Append the approve button to a container element on your webpage
  recordElement.appendChild(approve2Button);
}else {
  medicineStatusElement.style.color = 'blue';
}



const additionalNotesElement = document.createElement('p');
additionalNotesElement.textContent = 'Diagnosis: ' + (record.results?.additionalNotes || 'Pending...');
if (record.results && !record.results.additionalNotes) {
  additionalNotesElement.classList.add('pending');
}
recordElement.appendChild(additionalNotesElement);



// Append the upload prices button to the record element
recordElement.appendChild(uploadPricesButton);






// Create share button
const shareButton = document.createElement('button');
shareButton.id = 'shareButton';
shareButton.innerHTML = '<i class="fa fa-paper-plane"></i> Lab Request'; // Use innerHTML instead of textContent
shareButton.addEventListener('click', () => {
  // Ensure the user object is defined
    shareRecord(patient, record);
  }
);

// Append the share button to the record element
recordElement.appendChild(shareButton);



function shareRecord(patient, record) {
  // Get the patient's name, doctor's username, and the test key
  const patientId = patient.patientId;
  const patientName = patient.name;
  const testKey = recordKey;

  // Construct the notification message
  const message = `New Test ${testKey} for patient ${patientName} PI - ${patientId} to be done.`;

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


// Define visitKeys at a higher scope to make it accessible to both functions
let visitKeys = [];
let visitDetails = {};

// Function to display the patient's visit details
function displayPatientVisitDetails(visitKeys, visitDetails, latestVisitData) {
  const patientVisitDetailsDiv = document.getElementById('patientVisitDetails');
  patientVisitDetailsDiv.innerHTML = '';

  if (latestVisitData) {
    // Get the visit count
    const visitCount = visitKeys.length;

    // Display the visit count in the "Visit Count" element
    const visitCountElement = document.getElementById('visitCount');
    visitCountElement.textContent = visitCount;

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
      // Get the visit keys and sort them in descending order based on timestamp
      visitKeys = Object.keys(visitDetails).sort((a, b) => visitDetails[b].timestamp - visitDetails[a].timestamp);

      // Get the latest visit data if available
      const latestVisitKey = visitKeys[0];
      const latestVisitData = visitDetails[latestVisitKey];

      // Call the function to display the patient's visit details
      displayPatientVisitDetails(visitKeys, visitDetails, latestVisitData);

      // Call the function to create the chart
      createVisitTrendChart(visitKeys, visitDetails);
    } else {
      displayPatientVisitDetails([], {}); // If no visit details found, display an empty state
      createVisitTrendChart([], {}); // If no visit details found, create an empty chart
    }
  });
}


// Call the function to retrieve and display the patient's visit details
getPatientVisitDetails(patientName);

// Create print button
const printButton = document.createElement('button');
printButton.innerHTML = '<i class="fa fa-print"></i> Print Record'; // Use innerHTML instead of textContent
printButton.classList.add('print-button');

// Add event listener to the print button
printButton.addEventListener('click', () => {
  const latestVisitKey = visitKeys[0];
  const latestVisitData = visitDetails[latestVisitKey];

  // Call the function to print the record with the latest visit data as the current visit data
  printRecord(patient, record, visitKeys, visitDetails, latestVisitData);
});

// Append the print button to the record element
recordElement.appendChild(printButton);



// ...
// Function to print the record
function printRecord(patient, record, visitKeys, visitDetails, latestVisitData) {

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
    ['Date Taken', dateTakenElement.textContent],
    ['Services Offered', testsTakenElement.textContent],
    ['Service Payment', paymentStatusElement.textContent],
    ['Results Obtained', resultsObtainedElement.textContent],
    ['Additional Notes', additionalNotesElement.textContent]
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

  if (latestVisitData) {
    console.log("Latest Visit Data:", latestVisitData); // Add this line to check the contents of latestVisitData
    latestVisitDetails.push(['Date', formatDate(latestVisitData.timestamp)]);
    latestVisitDetails.push(['Clinician\'s Name', latestVisitData.clinicianName || 'N/D']);
    // ... (rest of the code)
  } else {
    console.log("No Latest Visit Data"); // Add this line to check if the else block is executed
    // ... (rest of the code)
  }
    // Print the heading "LATEST VISIT TRIAGE"
    doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  const latestVisitHeading = 'LATEST VISIT TRIAGE';
  const latestVisitHeadingWidth = doc.getTextWidth(latestVisitHeading);
  const latestVisitHeadingX = (doc.internal.pageSize.getWidth() - latestVisitHeadingWidth) / 2;
  const latestVisitHeadingY = recordTableY + 90;
  doc.text(latestVisitHeading, latestVisitHeadingX, latestVisitHeadingY);

  // Print the latest visit triage details in a table
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(12);
  const latestVisitDetails = [];
  if (latestVisitData) {
    latestVisitDetails.push(['Date', formatDate(latestVisitData.timestamp)]);
    latestVisitDetails.push(['Clinician\'s Name', latestVisitData.clinicianName || 'N/D']);
    latestVisitDetails.push(['Temperature', latestVisitData.temperature || 'N/D']);
    latestVisitDetails.push(['BP', latestVisitData.bp || 'N/D']);
    latestVisitDetails.push(['RR', latestVisitData.rr || 'N/D']);
    latestVisitDetails.push(['HR', latestVisitData.hr || 'N/D']);
    latestVisitDetails.push(['SpO2', latestVisitData.sp02 || 'N/D']);
    latestVisitDetails.push(['WT', latestVisitData.wt || 'N/D']);
    latestVisitDetails.push(['HT', latestVisitData.ht || 'N/D']);
    latestVisitDetails.push(['BMI', latestVisitData.bmi || 'N/D']);
    latestVisitDetails.push(['MUAC', latestVisitData.muac || 'N/D']);
    latestVisitDetails.push(['Weight for Age Z score', latestVisitData.weightForAgeZScore || 'N/D']);
    latestVisitDetails.push(['Disability', latestVisitData.disability || 'N/D']);
    latestVisitDetails.push(['Known Chronic Illness', latestVisitData.chronicIllness || 'N/D']);
    latestVisitDetails.push(['Any Drug Abuse', latestVisitData.drugAbuse || 'N/D']);
    latestVisitDetails.push(['Allergies', latestVisitData.allergies && latestVisitData.allergies.length > 0
      ? latestVisitData.allergies.join(', ')
      : 'N/D']);
  } else {
    // If there's no latest visit data, display "N/A" for each field
    latestVisitDetails.push(['Date', 'N/A']);
    latestVisitDetails.push(['Clinician\'s Name', 'N/A']);
    latestVisitDetails.push(['Temperature', 'N/A']);
    latestVisitDetails.push(['BP', 'N/A']);
    latestVisitDetails.push(['RR', 'N/A']);
    latestVisitDetails.push(['HR', 'N/A']);
    latestVisitDetails.push(['SpO2', 'N/A']);
    latestVisitDetails.push(['WT', 'N/A']);
    latestVisitDetails.push(['HT', 'N/A']);
    latestVisitDetails.push(['BMI', 'N/A']);
    latestVisitDetails.push(['MUAC', 'N/A']);
    latestVisitDetails.push(['Weight for Age Z score', 'N/A']);
    latestVisitDetails.push(['Disability', 'N/A']);
    latestVisitDetails.push(['Known Chronic Illness', 'N/A']);
    latestVisitDetails.push(['Any Drug Abuse', 'N/A']);
    latestVisitDetails.push(['Allergies', 'N/A']);
  }

  const latestVisitTableX = 20;
  const latestVisitTableY = latestVisitHeadingY + 5;
  const latestVisitTableOptions = {
    startX: latestVisitTableX,
    startY: latestVisitTableY,
    margin: { top: 10 },
    styles: { font: 'helvetica', fontStyle: 'normal', fontSize: 10 },
    headStyles: { fillColor: [211, 211, 211], fontStyle: 'bold' },
    bodyStyles: { fillColor: 255 },
    columnStyles: { 0: { cellWidth: 100 }, 1: { cellWidth: 60 } }
  };
  doc.autoTable({
    head: [['Field', 'Value']],
    body: latestVisitDetails,
    ...latestVisitTableOptions
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
/*
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
finnishButton.textContent = 'Add Results';
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
  heading.textContent = 'Add Medical Record';
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
    document.getElementById('resultsObtained').value = '';
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
*/
  return recordElement;
}
/*
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
 */

};



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
          //listItem.appendChild(markAsDoneBtn2);

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
const list = document.getElementById('list');
let listListener; // Variable to store the event listener

list.addEventListener('click', () => {
  // Retrieve and display lab requests from Firebase
  retrieveAndDisplaylist();

  openlistPopup();
});

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
/*
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
*/




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


const loaderElement = document.getElementById('loader');

// Retrieve and render patients
//const patientsRef = ref(database, 'patients');

// Show the loader
loaderElement.classList.remove('hidden');

// Fetch patient data from Firebase
onValue(patientsRef, (snapshot) => {
  patientsData = snapshot.val() ? Object.values(snapshot.val()).reverse() : [];
  // Update the pagination and render the patients
  renderPatients();
  loaderElement.classList.add('hidden');

});

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
  medicationLabel.textContent = 'Medication:';
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
  }
});
// Prescription label
const prescriptionLabel = document.createElement('label');
  prescriptionLabel.textContent = 'Prescription:';
  prescriptionLabel.setAttribute('for', 'prescriptionInput');


  const prescriptionInput = document.createElement('select');
  prescriptionInput.required = true;

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
addMedicationButton.addEventListener('click', () => {
  const medicationInput = createMedicationInput();
  const medicationContainer = document.getElementById('medication');
  medicationContainer.appendChild(medicationInput);

 // Initialize Select2 for the new medication input
 $(medicationInput).find('select').select2({
    dropdownParent: medicationInput
  });
});


// Update the total cost when grams input changes
const medicationInputs = document.querySelectorAll('.medication-input-container');
medicationInputs.forEach((medicationInput) => {
  const gramsInput = medicationInput.querySelector('input[type="number"]');

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

  const resultsObtained = document.getElementById('resultsObtained').value;
  const additionalNotes = document.getElementById('additionalNotes').value;

  // Generate current timestamp
  const dateTaken = Date.now();

  const recordData = {
    testsTaken: testsTaken,
    resultsObtained: resultsObtained,
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

      // Clear medication inputs
      const medicationContainer = document.getElementById('medicationInputsContainer');
      medicationContainer.innerHTML = '';

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
    resultsObtained: document.getElementById('resultsObtained').value,
    additionalNotes: document.getElementById('additionalNotes').value
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

});






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
    onlineStatusElement.innerHTML = '<i class="fa fa-wifi"></i>Online';
    onlineStatusElement.classList.remove('offline');
    onlineStatusElement.classList.add('online');
    overlayElement.style.display = 'none';
  } else {
    onlineStatusElement.innerHTML = '<i class="fa fa-exclamation-triangle"></i>Offline';
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




    // Get a reference to the database
    const messagesRef = ref(database, 'chat-messages');
    const chatBox = document.getElementById('chatBox');
    const messageInput = document.getElementById('messageInput');
    const sendMessageBtn = document.getElementById('sendMessageBtn');
    
    // Audio for message sent
    const messageSentAudio = new Audio('');

    
    // Audio for new message received
    const newMessageAudio = new Audio('');
    
    // Array to store IDs of displayed messages
    let displayedMessageIds = [];
    
    // Listen for new messages
    onValue(messagesRef, (snapshot) => {
      if (snapshot.exists()) {
        snapshot.forEach((childSnapshot) => {
          const messageId = childSnapshot.key;
          const message = childSnapshot.val();
    
          // Display the message only if it's not already displayed
          if (!displayedMessageIds.includes(messageId)) {
            displayChatMessage(message);
            playMessageSound(message.sender);
            displayedMessageIds.push(messageId);
          }
        });
      }
    });
    
// Function to display messages in the chatBox
function displayChatMessage(message) {
  if (message) {
    const messageDiv = document.createElement('div');

// Display sender's name and profile icon in the header
const headerDiv = document.createElement('div');
headerDiv.classList.add('message-header');

// Creating the profile icon element (assuming it's an image)
const profileIcon = document.createElement('img');
profileIcon.src = 'profile.webp'; // Add the path to your profile icon image
profileIcon.classList.add('profile-icon2');
headerDiv.appendChild(profileIcon);

// Creating the span for sender's name
const nameSpan = document.createElement('span');
nameSpan.textContent = message.sender;
nameSpan.style.fontWeight = 'bold';
headerDiv.appendChild(nameSpan);

    messageDiv.appendChild(headerDiv);

    // Display message text
    const messageTextSpan = document.createElement('span');
    messageTextSpan.textContent = message.text;
    messageDiv.appendChild(messageTextSpan);

    // Display timestamp in 6:00 pm format
    const timestampSpan = document.createElement('span');
    const timestamp = new Date(message.timestamp);
    const formattedDate = `${timestamp.toLocaleDateString()} `;
    const formattedTime = `${timestamp.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}`;
    timestampSpan.textContent = `${formattedDate}${formattedTime}`;
    timestampSpan.style.fontSize = '9px'; // Set font size for the timestamp
    timestampSpan.style.color = '#888'; // Set color for the timestamp
    messageDiv.appendChild(timestampSpan);

    // Add different classes based on the sender
    if (message.sender === 'Tests') {
      messageDiv.classList.add('patients-reception');
    } else {
      messageDiv.classList.add('other-sender');
    }

    chatBox.appendChild(messageDiv);
    chatBox.scrollTop = chatBox.scrollHeight; // Auto-scroll to the latest message
  }
}

// Function to play message sound
function playMessageSound(sender) {
  if (sender === 'Tests') {
    messageSentAudio.play();
  } else {
    newMessageAudio.play();
  }
}
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
    const sender = 'Tests'; // You can replace 'User' with the actual username or user ID
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