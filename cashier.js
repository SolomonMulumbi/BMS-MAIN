

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




document.addEventListener('DOMContentLoaded', () => {
  const nameInput = document.getElementById('name');
  const nameFeedback = document.createElement('div');
  nameFeedback.id = 'nameFeedback';
  nameInput.insertAdjacentElement('afterend', nameFeedback);

  const existingPatientsPopup = document.getElementById('existingPatientsPopup');
  const existingPatientsContent = document.getElementById('existingPatientsContent');
  const closePopup = document.getElementById('closePopup');

  nameInput.addEventListener('input', async () => {
    const name = nameInput.value.trim();
    if (name) {
      const snapshot = await get(child(ref(database), 'patients'));
      if (snapshot.exists()) {
        const patients = snapshot.val();
        const matchingPatients = Object.values(patients).filter(patient =>
          patient.name.toLowerCase().includes(name.toLowerCase())
        );
        if (matchingPatients.length > 0) {
          nameFeedback.textContent = `Patient(s) with the name "${name}" already exist(s).`;
          nameFeedback.style.color = 'red';

          existingPatientsContent.innerHTML = ''; // Clear previous content
          const heading = document.createElement('h3');
          heading.textContent = `Existing Patients with the name "${name}":`;
          existingPatientsContent.appendChild(heading);

          matchingPatients.forEach(patient => {
            const patientDiv = document.createElement('div');
            patientDiv.classList.add('patient');
            patientDiv.innerHTML = `
              <p><strong>Name:</strong> ${patient.name}</p>
              <p><strong>Date of Birth:</strong> ${patient.dob}</p>
              <p><strong>Telephone Contact:</strong> ${patient.parents}</p>
              <p><strong>Next of Kin's Telephone Contact:</strong> ${patient.nok || 'Not Found'}</p>
              <p><strong>Place of Residence:</strong> ${patient.residence}</p>
              <p><strong>Payment Terms:</strong> ${patient.payment}</p>
              <p><strong>Sex:</strong> ${patient.sex}</p>
            `;
            existingPatientsContent.appendChild(patientDiv);
          });

          openPopup();
        } else {
          nameFeedback.textContent = '';
          closePopup.click(); // Close the popup if no matching patients
        }
      } else {
        nameFeedback.textContent = '';
        closePopup.click(); // Close the popup if no patients exist
      }
    } else {
      nameFeedback.textContent = '';
      closePopup.click(); // Close the popup if name input is empty
    }
  });

  // Close popup functionality
  closePopup.addEventListener('click', closePopupHandler);

  function openPopup() {
    existingPatientsPopup.style.display = 'block';
  }

  function closePopupHandler() {
    existingPatientsPopup.style.display = 'none';
  }
});







const fetchPatientCountBtn = document.getElementById('fetchPatientCountBtn');
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

function fetchPatientCount() {
  const countRef = ref(database, 'meta/patientCount');

  return get(countRef)
    .then((snapshot) => {
      if (snapshot.exists()) {
        patientCount = snapshot.val(); // Use current value
        showMessage(`Current Patient ID: ${patientCount}`);
      } else {
        patientCount = 1; // Default start if none exists
        showMessage('Starting from Patient ID: 1');
      }
    })
    .catch((error) => {
      console.error('Error retrieving patient count from meta:', error);
      showMessage('Failed to load patient count.');
    });
}



// Add event listener to the fetch patient count button
fetchPatientCountBtn.addEventListener('click', fetchPatientCount);

  var uploadBtn = document.getElementById('uploadBtn');
        var popupOverlay = document.getElementById('popupOverlay');
        var popupClose = document.getElementById('popupClose');
      uploadBtn.addEventListener('click', function() {
      popupOverlay.style.visibility = 'visible';
      popupOverlay.style.opacity = '1';
      fetchPatientCount()
      });
      
      popupClose.addEventListener('click', function() {
      popupOverlay.style.visibility = 'hidden';
      popupOverlay.style.opacity = '0';
      });

      
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


displayMessage('', 'Please wait...', false); // Pass false for error message
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
const loader = document.getElementById('loader');
let patients = [];
let patientCount = 1;
const patientsRef = ref(database, 'patients');

const validateAndSanitizeData = (data, defaultValue = 'No data') => {
  for (const key in data) {
    if (data.hasOwnProperty(key) && (data[key] === undefined || data[key] === '')) {
      data[key] = defaultValue;
    }
  }
  return data;
};

const loadPatientCount = () => {
  const countRef = ref(database, 'meta/patientCount');
  onValue(countRef, (snapshot) => {
    if (snapshot.exists()) {
      patientCount = snapshot.val();
    } else {
      patientCount = 1; // Default start if not yet set
    }
  });
};

loadPatientCount(); // Call this early when the page loads

const savePatientData = (name, dob, parents, residence, payment, sex, nok) => {
  const patientId = patientCount.toString();

  if (!patientId || patientId.trim() === '') {
    alert('Error: Missing Patient ID. Please refresh the page and try again.');
    location.reload();
    return;
  }

  const registrationDate = new Date().toISOString();
  const parentsCountryCode = document.getElementById('parentsCountryCode').value.trim();
  const nokCountryCode = document.getElementById('NOKCountryCode').value.trim();

  const patientData = {
    name,
    dob,
    parents: `${parentsCountryCode}${parents}`,
    residence,
    payment,
    sex,
    nok: `${nokCountryCode}${nok}`,
    patientId,
    registrationDate,
  };

  const sanitizedPatientData = validateAndSanitizeData(patientData);
  const newPatientRef = ref(database, `patients/${patientId}`);
  const metaCountRef = ref(database, 'meta/patientCount');

  loader.style.display = 'block';

  set(newPatientRef, sanitizedPatientData)
    .then(() => {
      // ✅ Increment patientCount in database
      return set(metaCountRef, patientCount + 1);
    })
    .then(() => {
      patientCount++; // Update locally
      showMessage('Patient details uploaded successfully!');
      form.reset();
      loader.style.display = 'none';
      closePopup();
    })
    .catch((error) => {
      console.error('Error saving patient:', error);
      showMessage('Error uploading patient details. Please try again.');
      loader.style.display = 'none';
    });
};




// Function to close the popup
function closePopup() {
  const popupOverlay = document.getElementById('popupOverlay');
  popupOverlay.style.visibility = 'hidden';
  popupOverlay.style.opacity = '0';
}


form.addEventListener('submit', (e) => {
  e.preventDefault();

  // Ensure you fetch the latest patient count before saving
  fetchPatientCount().then(() => {
    const name = document.getElementById('name').value.trim();
    const dob = document.getElementById('dob').value;
    const parents = document.getElementById('parents').value;
    const residence = document.getElementById('residence').value;
    const payment = document.getElementById('payment').value;
    const sex = document.getElementById('sex').value;
    const nok = document.getElementById('NOK').value;

    // Save patient data after fetching the latest patient count
    savePatientData(name, dob, parents, residence, payment, sex, nok);
  });
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

// Define variables
let patientsData = []; // Store all patient data
let searchResults = []; // Store search results
let currentPage = 1;
const patientsPerPage = 100;

// Add event listener to search input for live search
searchInput.addEventListener('input', () => {
  const searchTerm = searchInput.value.trim().toLowerCase(); // Get the search term

  // Clear the search results
  searchResults = [];

  if (searchTerm !== '') {
    // Filter patients based on the search term
    searchResults = patientsData.filter(patient => {
      return (
        patient.name.toLowerCase().includes(searchTerm) ||
        patient.patientId.includes(searchTerm)
      );
    });
  }

  // Update the pagination and render the patients
  currentPage = 1;
  renderPatients();
});

// Fetch patient data from Firebase
onValue(patientsRef, (snapshot) => {
  patientsData = snapshot.val() ? Object.values(snapshot.val()).reverse() : [];
  // Update the pagination and render the patients
  renderPatients();
});


// Function to check if it's today's date (helper function)
function isToday(date) {
  const today = new Date();
  return date.getDate() === today.getDate() && date.getMonth() === today.getMonth();
}
// Function to find patients with birthdays today in Firebase
function findPatientsWithBirthdaysToday() {
  const patientsRef = ref(database, 'patients');

  onValue(patientsRef, (snapshot) => {
    const patientsData = snapshot.val();
    const searchResults = [];

    if (patientsData) {
      // Iterate through patient data to find birthdays today
      Object.entries(patientsData).forEach(([patientId, patient]) => {
        // Convert the DOB string to a Date object
        const dobDate = new Date(patient.dob);

        if (isToday(dobDate)) {
          searchResults.push(patient);
        }
      });
    }

 // Check if there are patients with birthdays today
 if (searchResults.length > 0) {
  // Display the list of patients in the action center
  displayPatientsInActionCenter(searchResults);
} else {
  // Display a message in the action center if there are no patients with birthdays today
  displayNoBirthdaysMessage();
}
});
}

// Function to display a message in the action center when there are no birthdays today
function displayNoBirthdaysMessage() {
  const actionCenter = document.getElementById('actionCenter'); // Replace 'actionCenter' with your actual element ID
  const messageContainer = document.createElement('div');

  // Add an image
  const image = document.createElement('img');
  image.src = 'no results.jpg'; // Replace with the actual path to your image
  image.alt = 'No Birthdays Today Image';
  image.style.width = '200px'; // Adjust the width as needed
  image.style.height = '200px'; // Adjust the height as needed
  messageContainer.appendChild(image);

  // Add the message
  const message = document.createElement('p');
  message.textContent = 'No birthdays today.';
  messageContainer.appendChild(message);

  // Replace the content of the action center with the message container
  actionCenter.innerHTML = '';
  actionCenter.appendChild(messageContainer);
}

// Function to display the list of patients in the action center
function displayPatientsInActionCenter(patients) {
  const actionCenter = document.getElementById('actionCenter'); // Replace 'actionCenter' with your actual element ID
  actionCenter.innerHTML = ''; // Clear the existing content


  // Add a header to the action center
  const header = document.createElement('h5');
  header.textContent = '🎉Wow! 🎂🎁 Some patients have birthdays today! 🎉';
  actionCenter.appendChild(header);
// Create a table to display patients
const patientTable = document.createElement('table'); // Use 'table' for a table format

// Add a header row to the table
const headerRow = document.createElement('tr');
const headerNameCell = document.createElement('th');
const headerButtonCell = document.createElement('th');
headerNameCell.textContent = 'Patient Name';
headerButtonCell.textContent = 'Actions';
headerRow.appendChild(headerNameCell);
headerRow.appendChild(headerButtonCell);
patientTable.appendChild(headerRow);

patients.forEach((patient) => {
  // Create a table row for each patient
  const tableRow = document.createElement('tr');

  // Create a cell for patient name
  const nameCell = document.createElement('td');
  nameCell.textContent = patient.name;
  // Create a cell for patient name
  const numberCell = document.createElement('td');
  numberCell.textContent = patient.parents;
   const overlay5 = document.getElementById('overlay');
    // Create a cell for the "Send Wishes" button
    const sendWishCell = document.createElement('td');
    const sendWishButton = document.createElement('button');
    sendWishButton.textContent = ' 🎉Send Wishes';
    sendWishButton.classList.add('sendBirthdayMessage'); // Add a class for styling
    sendWishButton.addEventListener('click', () => {
      // Handle the action to open the popup for sending wishes
      overlay5.style.display= 'block'
      openWishesPopup(patient);
    });
    sendWishCell.appendChild(sendWishButton);

  // Append cells to the table row
  tableRow.appendChild(nameCell);
  tableRow.appendChild(sendWishCell);

  // Append the table row to the table
  patientTable.appendChild(tableRow);
});

// Append the table to the action center
actionCenter.appendChild(patientTable);
}

// Call findPatientsWithBirthdaysToday on page load or as needed
window.onload = function () {
  findPatientsWithBirthdaysToday();
};


// Function to open the popup for sending wishes
function openWishesPopup(patient) {
  const WishesPopup = document.createElement('div');
  WishesPopup.classList.add('WishesPopup');

  // Create form elements for composing and sending wishes
  const form = document.createElement('form');
  const patientDetails = document.createElement('div');
  patientDetails.classList.add('details');
  patientDetails.innerHTML = `
    <p><strong>Name:</strong> ${patient.name}</p>
    <p><strong>Date of Birth:</strong> ${patient.dob}</p>
    <p><strong>Contact:</strong> ${patient.parents}</p>
  `;
  const yourHospitalName = 'SANYU HOSPITAL  ';
  const hospitalInfo = 'Katooke Wakiso District, Uganda';
  const messageLabel = document.createElement('label');
  messageLabel.textContent = 'Compose Birthday Message for:';
  const messageInput = document.createElement('textarea');
  messageInput.rows = 4;
  messageInput.placeholder = 'Type your birthday wishes here...';
  // Pre-fill the message with a template or any default content
  messageInput.value = `🎉 Happy Birthday, ${patient.name}! 🎂🎁\n\n`
    + `From all of us at ${yourHospitalName}, we wish you a day filled with joy and happiness. 🌞\n\n`
    + `As a birthday gift, we invite you to visit our hospital for a free comprehensive body checkup. 🩺🏥\n\n`
    + `Your health is important to us, and we are here to ensure you have a healthy and vibrant year ahead. 💪\n\n`
    + `Feel free to pass by and get the best care. 🚶‍♂️🚶‍♀️\n\n`
    + `Address: ${hospitalInfo}\n\n`
    + `Contact us at +256 782 477 517 for any inquiries. 📞`;

  const sendButton = document.createElement('button');
  sendButton.textContent = '🎉Send Wishes';
  sendButton.classList.add('sendBirthdayMessage');
  sendButton.addEventListener('click', (event) => {
    // Prevent the default form submission behavior
    event.preventDefault();

    const message = messageInput.value;
    const recipientNumber = patient.parents; // Use the patient's number as the recipient
    const recipientName = patient.name; // Use the patient's name as the recipient's name
    // Call a function to send the wishes using recipientNumber, recipientName, and message
    sendWishes(recipientNumber, recipientName, message);

    closeWishesPopup(WishesPopup);
  });

  // Create close button
  const closeButton = document.createElement('button');
  closeButton.textContent = 'Close';
  closeButton.classList.add('close-button');
  closeButton.addEventListener('click', () => {
    closeWishesPopup(WishesPopup);
  });

  // Append form elements to the form
  form.appendChild(messageLabel);
  form.appendChild(patientDetails);
  form.appendChild(messageInput);
  form.appendChild(sendButton);
  form.appendChild(closeButton);

  // Append the form to the popup
  WishesPopup.appendChild(form);

  // Append the popup to the document body
  document.body.appendChild(WishesPopup);

  // Show overlay
  overlay5.style.display = 'block';
}

// Rest of your code...




  const overlay5 = document.getElementById('overlay')

// Function to close the popup
function closeWishesPopup(WishesPopup) {
  // Remove the popup from the document body 
   // Close the popup after sending wishes
    overlay5.style.display= 'none'

  document.body.removeChild(WishesPopup);
}

// Function to send wishes (replace this with your actual implementation)
function sendWishes(recipientNumber, recipientName, message) {
  // Implement the logic to send wishes using the recipient's number, name, and the composed message
  showMessage(`Sending wishes to ${recipientName}`);

 // Open WhatsApp with pre-filled message using the WhatsApp Web API
 window.open(`https://api.whatsapp.com/send?phone=${recipientNumber}&text=${encodeURIComponent(message)}`);
}



// Function to show a loading spinner while loading more patients
function showLoadingSpinner() {
  const spinner = document.createElement('div');
  spinner.classList.add('loading-spinner');
  patientsContainer.appendChild(spinner);
}

function hideLoadingSpinner() {
  const spinner = document.querySelector('.loading-spinner');
  if (spinner) {
    spinner.remove();
  }
}
// ====================== PLACEHOLDERS ======================
function renderPlaceholders(rows = 5) {
  patientsContainer.innerHTML = '';
  const table = document.createElement('table');
  table.classList.add('patient-table');

  const headers = ['Name', 'Place of Residence', 'Payment Terms', 'Sex', 'Patient ID', 'Contact', 'Date of Birth', 'Age', 'Actions'];

  // Header
  const headerRow = document.createElement('tr');
  headers.forEach(headerText => {
    const th = document.createElement('th');
    th.textContent = headerText;
    headerRow.appendChild(th);
  });
  table.appendChild(headerRow);

  // Skeleton rows
  for (let i = 0; i < rows; i++) {
    const row = document.createElement('tr');
    row.classList.add('placeholder-row');

    headers.forEach(() => {
      const cell = document.createElement('td');
      const skeletonDiv = document.createElement('div');
      skeletonDiv.classList.add('skeleton');
      cell.appendChild(skeletonDiv);
      row.appendChild(cell);
    });

    table.appendChild(row);
  }

  patientsContainer.appendChild(table);
}

// ====================== CONFIG ======================

let lastFetchedKey = null;
const batchSize = 40;
let loading = false;

const paginationDiv = document.getElementById('pagination');

// ====================== FETCH IN BATCHES ======================
async function fetchPatientsBatch() {
  if (loading) return;
  loading = true;

  // Show skeleton immediately
  renderPlaceholders(patientsPerPage);

  let patientsQuery;
  if (lastFetchedKey) {
    patientsQuery = query(
      patientsRef,
      orderByKey(),
      startAfter(lastFetchedKey),
      limitToFirst(batchSize)
    );
  } else {
    patientsQuery = query(
      patientsRef,
      orderByKey(),
      limitToFirst(batchSize)
    );
  }

  try {
    const snapshot = await get(patientsQuery);
    if (snapshot.exists()) {
      const data = snapshot.val();
      const newPatients = Object.keys(data).map(key => ({
        id: key,
        ...data[key],
      }));

      lastFetchedKey = newPatients[newPatients.length - 1].id;
      patientsData = [...patientsData, ...newPatients];
      renderPatients(); // render first page
    } else {
      renderPatients();
    }
  } catch (error) {
    console.error('Error fetching patients:', error);
  } finally {
    loading = false;
  }
}

// ====================== RENDER FUNCTION ======================
function renderPatients() {
  const dataToDisplay = searchResults.length > 0 ? searchResults : patientsData;
  if (dataToDisplay.length === 0) {
    patientsContainer.innerHTML = '<p>No patients found.</p>';
    paginationDiv.innerHTML = '';
    return;
  }

  const startIndex = (currentPage - 1) * patientsPerPage;
  const endIndex = startIndex + patientsPerPage;
  const patientsForPage = dataToDisplay.slice(startIndex, endIndex);

  const table = document.createElement('table');
  table.classList.add('patient-table');

  const headers = ['Name', 'Place of Residence', 'Payment Terms', 'Sex', 'Patient ID', 'Contact', 'Date of Birth', 'Age', 'Actions'];
  const headerRow = document.createElement('tr');
  headers.forEach(headerText => {
    const th = document.createElement('th');
    th.textContent = headerText;
    headerRow.appendChild(th);
  });
  table.appendChild(headerRow);

  // Collect patients with birthdays today
  const todayPatients = [];

  patientsForPage.forEach(patient => {
    const row = document.createElement('tr');

    const nameCell = createTableCell(patient.name);
    const residenceCell = createTableCell(patient.residence);
    const paymentCell = createTableCell(patient.payment);
    const sexCell = createTableCell(patient.sex);
    const idCell = createTableCell('PI - ' + (patient.patientId || patient.id));
    const contactCell = createHiddenDigitsTableCell(patient.parents || '', 3);
    const dobCell = createTableCell(patient.dob || '');
    const ageCell = createTableCell(patient.dob ? new Date().getFullYear() - new Date(patient.dob).getFullYear() : '');

    const actionCell = document.createElement('td');
    const viewButton = document.createElement('button');
    viewButton.textContent = 'View';
    viewButton.classList.add('view-button');
    viewButton.addEventListener('click', () => openPatientHistoryPopup(patient));
    actionCell.appendChild(viewButton);

    [nameCell, residenceCell, paymentCell, sexCell, idCell, contactCell, dobCell, ageCell, actionCell].forEach(c => row.appendChild(c));

    // Birthday highlight
    if (patient.dob && isToday(new Date(patient.dob))) {
      dobCell.style.backgroundColor = 'yellow';
      dobCell.innerHTML += ' 🎂🎁';
      todayPatients.push(patient);
    }

    table.appendChild(row);
  });

  patientsContainer.innerHTML = '';
  patientsContainer.appendChild(table);

  renderPagination(dataToDisplay.length);

  // Trigger birthday messaging popup if any
  if (todayPatients.length > 0) openBirthdayMessagePopup(todayPatients);
}

// ====================== PAGINATION ======================
function renderPagination(totalItems) {
  const totalPages = Math.ceil(totalItems / patientsPerPage);
  paginationDiv.innerHTML = '';

  const prevButton = document.createElement('button');
  prevButton.textContent = 'Previous';
  prevButton.disabled = currentPage === 1;
  prevButton.addEventListener('click', () => {
    if (currentPage > 1) {
      currentPage--;
      renderPatients();
    }
  });

  const nextButton = document.createElement('button');
  nextButton.textContent = 'Next';
  nextButton.disabled = currentPage >= totalPages;
  nextButton.addEventListener('click', () => {
    if (currentPage < totalPages) {
      currentPage++;
      if ((currentPage * patientsPerPage) > patientsData.length) {
        fetchPatientsBatch();
      } else {
        renderPatients();
      }
    }
  });

  const pageInfo = document.createElement('span');
  pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;

  paginationDiv.append(prevButton, pageInfo, nextButton);
}

// ====================== SEARCH ======================
searchInput.addEventListener('input', () => {
  const searchTerm = searchInput.value.trim().toLowerCase();
  searchResults = [];

  if (searchTerm !== '') {
    searchResults = patientsData.filter(patient => {
      return (
        (patient.name && patient.name.toLowerCase().includes(searchTerm)) ||
        (patient.patientId && patient.patientId.includes(searchTerm))
      );
    });
  }

  currentPage = 1;
  renderPatients();
});

// ====================== HELPERS ======================
function createTableCell(text) {
  const cell = document.createElement('td');
  cell.textContent = text || '';
  return cell;
}

function createHiddenDigitsTableCell(text, visibleDigitsCount) {
  const cell = document.createElement('td');
  if (!text) {
    cell.textContent = '';
    return cell;
  }
  if (text.length <= visibleDigitsCount) {
    cell.textContent = text;
  } else {
    const hiddenDigits = '*'.repeat(text.length - visibleDigitsCount);
    const visibleDigits = text.slice(-visibleDigitsCount);
    cell.textContent = hiddenDigits + visibleDigits;
  }
  return cell;
}


// ====================== BIRTHDAY POPUP & MESSAGING ======================
function openBirthdayMessagePopup(patients) {
  const popup = document.getElementById('birthdayMessagePopup');
  const table = document.getElementById('patientsTable');
  const overlay = document.getElementById('overlay');
  const closeBtn = document.getElementById('closeMessagePopup');

  if (!popup || !table || !overlay || !closeBtn) return;

  table.innerHTML = '';
  patients.forEach(p => {
    const row = table.insertRow();
    const nameCell = row.insertCell(0);
    const phoneCell = row.insertCell(1);
    nameCell.textContent = p.name;
    phoneCell.textContent = p.parents;
  });

  popup.classList.add('active');
  overlay.style.display = 'block';

  const sendBtn = document.getElementById('sendBirthdayMessage');
  if (sendBtn) {
    sendBtn.onclick = () => {
      const messageInput = document.getElementById('birthdayMessageInput').value;
      const hospitalName = 'Sanyu Hospital';
      const hospitalInfo = 'Katooke Wakiso District, Uganda';

      patients.forEach((p, i) => {
        setTimeout(() => {
          const message = `🎉 Happy Birthday, ${p.name}! 🎂🎁\n\n${messageInput}\nFrom ${hospitalName}\nAddress: ${hospitalInfo}`;
          window.open(`https://api.whatsapp.com/send?phone=${p.parents}&text=${encodeURIComponent(message)}`);
        }, i * 3000);
      });

      overlay.style.display = 'none';
      popup.style.display = 'none';
    };
  }

  closeBtn.onclick = () => {
    overlay.style.display = 'none';
    popup.style.display = 'none';
  };
}

// ====================== INITIAL LOAD ======================
document.addEventListener('DOMContentLoaded', () => {
  fetchPatientsBatch();
});



















// Function to format the timestamp
function formatDate(timestamp) {
  const date = new Date(timestamp);
  const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
  return date.toLocaleString('en-US', options);
}









const testsTakenSelect = document.getElementById('testsTaken');
const totalAmountSpan = document.getElementById('totalAmount');
const calculateTotalButton = document.getElementById('calculateTotalButton');

// Get references to the input fields
const amountInput = document.getElementById('amountInput');
const balanceInput = document.getElementById('balanceInput');

// Add event listener to the amount input field
amountInput.addEventListener('input', () => {
    // Extract numeric value from the totalAmountSpan
    let totalText = totalAmountSpan.textContent; // e.g., "Total: UGX 1,250,000"
    let totalNumber = parseFloat(totalText.replace(/[^0-9.-]+/g, '')); // remove everything except digits and dot

    // Parse tendered amount
    let tenderedAmount = parseFloat(amountInput.value) || 0;

    // Calculate change
    let change = tenderedAmount - totalNumber;

    // Display change in balance input
    balanceInput.value = change.toFixed(2);
});


function updateTotal() {
  const allItems = window.allItems || []; // reference your items array
  let total = 0;

  allItems.forEach((item, index) => {
    const checkbox = document.getElementById(`${item.type}-${index}`);
    if (checkbox && checkbox.checked) {
      total += item.amount;
    }
  });

  const totalAmountSpan = document.getElementById('totalAmount');
  if (totalAmountSpan) {
    totalAmountSpan.textContent = `UGX ${total.toLocaleString()}`;
  }
}



// Function to calculate total when button is clicked
function calculateTotalOnClick() {
  updateTotal(); // Calculate and update total
}

document.addEventListener('DOMContentLoaded', () => {
  const testsTakenSelect = document.getElementById('testsTakenSelect');
  if (testsTakenSelect) {
    testsTakenSelect.addEventListener('change', updateTotal);
  }
});

// Event listener for button click
calculateTotalButton.addEventListener('click', calculateTotalOnClick);




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
 <div class="patient-image-frame">
  <label for="uploadImage" class="upload-label">
    <i class="fa fa-upload"></i>
    
  </label>
  <input type="file" id="uploadImage" accept="image/*">
</div>
<h3>Patient Demographics:</h3>
<table class="patient-demographics-table">
    <tr>
      <td><strong>Name:</strong></td>
      <td>${patient.name}</td>
    </tr>
    <tr>
      <td><strong>Date of Birth:</strong></td>
      <td>${patient.dob}</td>
    </tr>
    <tr>
      <td><strong>Gender:</strong></td>
      <td>${patient.sex}</td>
    </tr>
    <tr>
      <td><strong>Payment Type:</strong></td>
      <td>${patient.payment}</td>
    </tr>
    <tr>
      <td><strong>Residence:</strong></td>
      <td>${patient.residence}</td>
    </tr>
    <tr>
      <td><strong>Contact:</strong></td>
      <td>${patient.parents}</td>
    </tr>
    <tr>
      <td><strong>Patient ID:</strong></td>
      <td>${patient.patientId}</td>
    </tr>
    <tr>
    <td><strong>Next of Kin Telephone Contact:</strong></td>
    <td>${patient.nok || 'Not Found'}</td>
  </tr>
 <tr>
  <td><strong>Registration Date:</strong></td>
  <td>
    ${patient.registrationDate 
      ? new Date(patient.registrationDate).toLocaleString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true
        }) 
      : 'Not Found'}
  </td>
</tr>

    <tr>
    <td><strong>No. of Visits:</strong></td>
    <td id="visitCount"> </td>
  </tr>
    <tr>
      <td><strong>Current Patient's Status:</strong></td>
      <td><span id="currentStatus"></span></td>
    </tr>
  </table>
    <div id="barcode"></div> <!-- This is where the generated barcode will be displayed -->

    <!-- Add a "Visit Count" element in your HTML -->
    <!-- Add more patient details as needed -->

    <!-- The container for patient visit details -->
<div id="patientVisitDetails" ></div>
<!-- Add this inside your patient details HTML -->

<button style="display:none;" id="generateBarcodeButton" class="button save-button">
    <i style="margin-right: 5px;" class="fa fa-barcode"></i>Generate Barcode
  </button>



    <!-- Assuming you have the patient's name as patientName variable -->
<button style="background: darkblue;" id="visit" data-patient="${patient.patientId}" class="button save-button">
  <i id="visitIcon" style="margin-right: 5px;" class="fas fa-calendar-check"></i>Reg. Visit
</button>
          <button  style="background: darkblue; " id="triageButton"  class="button save-button"><i style="margin-right: 5px;" class="fas fa-chart-line"></i>Triage History</button>

<button id="saveButton"  class="button save-button" disabled><i style="margin-right: 5px;" class="fa fa-save"></i>Save Image</button>
<button id="delButton" class="button delete-button"><i class="fa fa-trash"></i>Delete Image</button>
<button id="addToWaitingListButton" class="button save-button">
  <i style="margin-right: 5px;" class="fas fa-list"></i>Add to Waiting List
</button>
<button id="editButton" class="button save-button">
  <i style="margin-right: 5px;" class="fa fa-edit"></i>Edit Details
</button>

<button style="background: darkblue; " id="printCardButton" class="button save-button">
  <i style="margin-right: 5px;" class="fa fa-print"></i>Patient Card
</button>

  </div>
  `;

  patientDetails.innerHTML = patientDetailsHTML;


// Define the function to print the patient card
function printPatientCard() {
  // Create a new window for printing
  const printWindow = window.open('', '', 'width=600,height=600');

  // Create the content to be printed
  const patientCardContent = `
    <div style="text-align: center;">
      <h1>${patient.name}</h1>
      <p><strong>Patient ID:</strong> ${patient.patientId}</p>
      <p><strong>Date of Birth:</strong> ${patient.dob}</p>
      <p><strong>Gender:</strong> ${patient.sex}</p>
      <p style="margin-top: 20px;"><strong>Hospital Name:</strong>SANYU HOSPITAL  </p>
      <p><strong>Note:</strong> Please return to the hospital if found lost</p>
    </div>
  `;

  // Define the CSS styles for the patient card
  const cardStyles = `
    body {
      font-family: Arial, sans-serif;
      margin: 0;
      padding: 0;
    }
    h1 {
      color: #333;
      font-size: 24px;
      margin: 0;
    }
    p {
      color: #666;
      font-size: 16px;
      margin: 5px 0;
    }
    div {
      background-color: #f4f4f4;
      padding: 20px;
      border: 1px solid #ccc;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
      border-radius: 4px;
    }
  `;

  // Set the content of the print window
  printWindow.document.open();
  printWindow.document.write(`<style>${cardStyles}</style>`);
  printWindow.document.write(patientCardContent);
  printWindow.document.close();

  // Print the window
  printWindow.print();

  // Close the print window
  printWindow.close();
}

// Add an event listener to the "Print Patient Card" button
const printCardButton = document.getElementById('printCardButton');
printCardButton.addEventListener('click', printPatientCard);

/*

function generateBarcode() {
  const patientId =  "PI-" + patient.patientId; // Replace with the actual patient ID

  // Create an SVG element
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute('jsbarcode-format', 'CODE128');
  svg.setAttribute('jsbarcode-value', patientId);
  svg.classList.add("barcode");

  // Add the SVG element to the barcode container
  const barcodeContainer = document.getElementById('barcode');
  barcodeContainer.innerHTML = ''; // Clear previous content
  barcodeContainer.appendChild(svg);

  // Initialize JsBarcode for this specific SVG
  JsBarcode(".barcode").init();
}
*/
let currentPatientId; // Store the current patient's ID

const editButton = document.getElementById('editButton');
editButton.addEventListener('click', () => openEditPopup(patient.patientId));

let saveEditedDetailsHandler; // Variable to store the event listener

function openEditPopup(patientId) {
  const editPopupOverlay = document.getElementById('editPopupOverlay');
  const editPopup = document.getElementById('editPopup');
  editPopup.style.display = 'block';
  editPopupOverlay.style.visibility = 'visible';
  editPopupOverlay.style.opacity = '1';
  overlay.style.display = 'block'
// Add the event listener for saving edited details
saveEditedDetailsHandler = saveEditedDetails;

  // Store the current patient's ID
  currentPatientId = patientId;
  // Fill input fields with current patient details
  document.getElementById('editedName').value = patient.name;
  document.getElementById('editedDOB').value = patient.dob;
  document.getElementById('editedTel').value = patient.parents;
  // Display the patient ID in the popup
  document.getElementById('patientIdDisplay').innerText = `Patient ID: ${patientId}`;

}

// Event listener for closing the edit popup
const closeEditPopupButton = document.getElementById('closeEditPopup');
closeEditPopupButton.addEventListener('click', closeEditPopup);

function closeEditPopup() {
  const editPopup = document.getElementById('editPopup');
  const editPopupOverlay = document.getElementById('editPopupOverlay');
  editPopup.style.display = 'none';
  editPopupOverlay.style.visibility = 'hidden';
  editPopupOverlay.style.opacity = '0';
  overlay.style.display = 'none';
  // Remove the event listener for saving edited details
  saveEditedDetailsButton.removeEventListener('click', saveEditedDetailsHandler);

  // Clear the patient ID display when closing the popup
  document.getElementById('patientIdDisplay').innerText = '';
}

function saveEditedDetails() {
  const editedName = document.getElementById('editedName').value;
  const editedDOB = document.getElementById('editedDOB').value;
  const editedTel = document.getElementById('editedTel').value;

  // Ensure none of the fields is empty
  if (editedName.trim() === '' || editedDOB.trim() === '' || editedTel.trim() === '') {
    showMessage('Please fill in all fields.');
    return;
  }

  // Ensure the current patient's ID is available
  if (currentPatientId) {
    const editedPatient = {
      name: editedName,
      dob: editedDOB,
      parents: editedTel,
    };

    // Save updated details to Firebase under the specific patient
    const patientRef = ref(database, `patients/${currentPatientId}`);
    update(patientRef, editedPatient)
      .then(() => {
        showMessage('Patient details updated successfully!');
        closeEditPopup(); // Close the popup on success
      })
      .catch(error => {
        showMessage('Error updating patient details:', error);
      });

    // Remove the event listener to avoid duplicates
    saveEditedDetailsButton.removeEventListener('click', saveEditedDetails);
  } else {
    showMessage('Invalid patient data.');
  }
}


// Event listener for saving edited details
const saveEditedDetailsButton = document.getElementById('saveEditedDetails');
saveEditedDetailsButton.addEventListener('click', saveEditedDetails);



// Function to handle saving the visit
function handleSaveVisit() {
  if (currentPatientName) {
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
      currentPatientName = ''; // Ensure you reset it when the visit is saved
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
} else {
showMessage('Invalid patient data.');

// Reset the patient name and close the popup
currentPatientName = ''; // Ensure you reset it when the visit is saved
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
}
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
    visitPopupTitle.textContent = `Save Visit for Patient: PI - ${currentPatientName}`; // Set the popup title
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
// Event listener for the "Cancel" button
const cancelVisitBtn = document.getElementById('cancelVisitBtn');

// Variable to track whether the popup is open or not
let isPopupOpen = false;
// Function to close the popup
function closePopup() {
  visitPopupOverlay.style.display = 'none';
}
// Function to close the "Visit" button popup
function closeVisitPopup() {
  visitPopupOverlay.style.display = 'none';
  // Update the isPopupOpen variable to false when the popup is closed
  isPopupOpen = false;
}

// Event listener for the "Cancel" button in the "Visit" button popup
cancelVisitBtn.addEventListener('click', closeVisitPopup);




// Assuming you have already included the Select2 library in your HTML
// Initialize Select2 for the "Allergies" select input
$('#allergies').select2({
  dropdownParent: $('body')
});

// Initialize Select2 for the "Clinician's Name" select input
$('#clinicianName').select2({
  dropdownParent: $('body')
});
/**
// Initialize Select2 for the "Clinician's Name" select input
$('#testsTaken').select2({
  dropdownParent: $('body')
});
// Initialize Select2 for the "Clinician's Name" select input
$('#testsTakenClone').select2({
  dropdownParent: $('body')
}); */
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
    Patient's Image 
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
  // Show loading spinner
  saveButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';

  // Get the image data from the image element
  const imageElement = imageFrame.querySelector('img');
  const imageData = imageElement.src;

  // Convert the image to WebP format
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  const img = new Image();

  img.onload = function () {
    // Set canvas dimensions to the image dimensions
    canvas.width = img.width;
    canvas.height = img.height;

    // Draw the image onto the canvas
    context.drawImage(img, 0, 0, img.width, img.height);

    // Convert the canvas content to a WebP data URL
    const webpDataURL = canvas.toDataURL('image/webp', 0.8); // Adjust quality as needed

    // Convert the WebP data URL to a Blob
    const imageBlob = dataURItoBlob(webpDataURL);

    // Get the patient name
    const patientName = patient.patientId;

    // Generate a unique filename for the image using the patient's name
    const filename = `${patientName}_${Date.now()}.webp`;

    // Save the image data to Firebase Storage under the patient's name
    const imageRef = storageRef(storage, `images/${filename}`);

    // Upload the image blob to Firebase Storage
    const uploadTask = uploadBytes(imageRef, imageBlob);

    // Monitor the upload completion using the then method
    uploadTask
      .then(function () {
        // The image has been successfully uploaded
        // Get the download URL of the image
        getDownloadURL(imageRef)
          .then(function (downloadURL) {
            // Save the download URL to the patient's data in Firebase
            const patientRef = ref(database, `patients/${patient.patientId}`);
            update(patientRef, {
              image: downloadURL,
            });

            // Show success message or perform any additional actions
            showMessage('Image saved successfully!');
          })
          .finally(() => {
            // Revert back to the original button text after the save is complete or fails
            saveButton.textContent = 'Save Image';
          });
      })
      .catch(function (error) {
        // Handle the upload error
        console.error('Error uploading image:', error);
        showMessage('Error uploading image. Please try again.');
        // Revert back to the original button text if there's an error
        saveButton.textContent = 'Save';
      });
  };

  // Set the source of the image element
  img.src = imageData;
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
  const patientRef = ref(database, `patients/${patient.patientId}`);
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
const patientName = patient.patientId; // Replace this with the patient's name
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

// Function to analyze the trend and provide recommendations
function analyzeAndProvideRecommendations(temperatures, respiratoryRates, heartRates, spO2Values, vitalSignsData) {
  // Analyze the trend and generate recommendations based on the vital signs data
  const newTemperature = temperatures[0];
  const previousTemperature = temperatures[1];
  const temperatureDifference = newTemperature - previousTemperature;

  const newRespiratoryRate = respiratoryRates[0];
  const previousRespiratoryRate = respiratoryRates[1];
  const respiratoryRateDifference = newRespiratoryRate - previousRespiratoryRate;

  const newHeartRate = heartRates[0];
  const previousHeartRate = heartRates[1];
  const heartRateDifference = newHeartRate - previousHeartRate;

  const newSpO2 = spO2Values[0];
  const previousSpO2 = spO2Values[1];
  const spO2Difference = newSpO2 - previousSpO2;

  // Assuming 'wt' is the weight data
  const weightValues = vitalSignsData.map((data) => data.wt);

  // Calculate weight difference
  const lastWeight = weightValues[0];
  const previousWeight = weightValues[1];
  const weightDifference = lastWeight - previousWeight;

  const normalRanges = {
    temperature: { min: 36.1, max: 37.2 },
    respiratoryRate: { min: 12, max: 20 },
    heartRate: { min: 60, max: 100 },
    spO2: { min: 95, max: 100 },
    weight: { min: 50, max: 80 }
  };


  function getNoteAndIconClass(vital, value) {
  const normalRange = normalRanges[vital];
  let potentialSicknesses = '';

  if (isNaN(value) || value === 0) {
    return { note: 'No data registered yet', iconClass: 'no-data' };
  } else if (value < normalRange.min) {
    potentialSicknesses = '<ul>PS:';
    switch (vital) {
      case 'temperature':
        potentialSicknesses += '<li>Hypothermia</li><li>Exposure to cold conditions</li><li>Metabolic disorders</li>';
        break;
      case 'respiratoryRate':
        potentialSicknesses += '<li>Bradypnea</li><li>Overdose of certain medications</li><li>Neurological disorders</li>';
        break;
      case 'heartRate':
        potentialSicknesses += '<li>Bradycardia</li><li>Heart block</li><li>Hypothyroidism</li>';
        break;
      case 'spO2':
        potentialSicknesses += '<li>Hypoxemia</li><li>Respiratory distress</li><li>Lung disease</li>';
        break;
      case 'weight':
        potentialSicknesses += '<li>Malnutrition</li><li>Eating disorders</li><li>Chronic illness</li>';
        break;
      default:
        potentialSicknesses += '<li>Unknown potential sicknesses</li>';
    }
    potentialSicknesses += '</ul>';
    return { note: `Below normal range: ${potentialSicknesses}`, iconClass: 'below-normal' };
  } else if (value > normalRange.max) {
    potentialSicknesses = '<ul>PS:';
    switch (vital) {
      case 'temperature':
        potentialSicknesses += '<li>Fever</li><li>Infection</li><li>Inflammatory disorders</li>';
        break;
      case 'respiratoryRate':
        potentialSicknesses += '<li>Tachypnea</li><li>Respiratory distress</li><li>Anxiety</li><li>Lung diseases</li>';
        break;
      case 'heartRate':
        potentialSicknesses += '<li>Tachycardia</li><li>Hypertension</li><li>Anxiety</li><li>Heart disease</li>';
        break;
      case 'spO2':
        potentialSicknesses += '<li>Unknown potential sicknesses</li>';
        break;
      case 'weight':
        potentialSicknesses += '<li>Overweight</li><li>Obesity</li><li>Metabolic disorders</li>';
        break;
      default:
        potentialSicknesses += '<li>Unknown potential sicknesses</li>';
    }
    potentialSicknesses += '</ul>';
    return { note: `Above normal range: ${potentialSicknesses}`, iconClass: 'above-normal' };
  } else {
    return { note: `Within normal range.`, iconClass: 'normal' };
  }
}

const trendAnalysis = `
  <div class="trend-container">
    <div class="trend-box">
      <span class="icon ${getNoteAndIconClass('temperature', previousTemperature).iconClass}"><i class="fas fa-thermometer-half"></i></span>
      <span class="info">
        <strong>Temperature:</strong> ${getNoteAndIconClass('temperature', previousTemperature).note}
      </span>
    </div>
    <div class="trend-box">
      <span class="icon ${getNoteAndIconClass('respiratoryRate', previousRespiratoryRate).iconClass}"><i class="fas fa-lungs"></i></span>
      <span class="info">
        <strong>Respiratory Rate:</strong> ${getNoteAndIconClass('respiratoryRate', previousRespiratoryRate).note}
      </span>
    </div>
    <div class="trend-box">
      <span class="icon ${getNoteAndIconClass('heartRate', previousHeartRate).iconClass}"><i class="fas fa-heartbeat"></i></span>
      <span class="info">
        <strong>Heart Rate:</strong> ${getNoteAndIconClass('heartRate', previousHeartRate).note}
      </span>
    </div>
    <div class="trend-box">
      <span class="icon ${getNoteAndIconClass('spO2', previousSpO2).iconClass}"><i class="fas fa-chart-line"></i></span>
      <span class="info">
        <strong>SpO2 Levels:</strong> ${getNoteAndIconClass('spO2', previousSpO2).note}
      </span>
    </div>
    <div class="trend-box">
      <span class="icon ${getNoteAndIconClass('weight', previousWeight).iconClass}"><i class="fas fa-weight"></i></span>
      <span class="info">
        <strong>Weight:</strong> ${getNoteAndIconClass('weight', previousWeight).note}
      </span>
    </div>
  </div>
`;

return { trendAnalysis };
}


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
  const respiratoryRates = vitalSignsData.map((data) => data.rr);
  const heartRates = vitalSignsData.map((data) => data.hr);
  const spO2Values = vitalSignsData.map((data) => data.sp02);
  const weightValues = vitalSignsData.map((data) => data.wt); // Assuming wt is weight

  // Destroy the previous chart instance if it exists
  destroyChart();

  // Reverse the data arrays to show the trend from left to right
  temperatures.reverse();
  respiratoryRates.reverse();
  heartRates.reverse();
  spO2Values.reverse();
  weightValues.reverse();  // Reverse the weight data array
  const { trendAnalysis } = analyzeAndProvideRecommendations(temperatures, respiratoryRates, heartRates, spO2Values, vitalSignsData);


  // Create the line chart
  window.visitTrendChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: dates.reverse(),
      datasets: [
        {
          label: 'Temperature (&deg;C)',
          data: temperatures,
          borderColor: 'red',
          fill: false
        },
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
        },
        {
          label: 'Weight (kg)',
          data: weightValues,
          borderColor: 'blue', // Adjust the color as needed
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


  // Display the trend analysis and recommendations in a div
  const trendAnalysisDiv = document.getElementById('trendAnalysisDiv');
  trendAnalysisDiv.innerHTML = `
    <h3>Trend Analysis:</h3>
    <p>${trendAnalysis}</p>

  `;

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
  <td>${Array.isArray(visitData.allergies) ? visitData.allergies.join(', ') : ''}</td>
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


// Create the table
const table = document.createElement('table');
table.style.width = '100%';
table.setAttribute('border', '1');
recordElement.appendChild(table);

// Create and append row for 'Record Key'
const recordKeyRow = document.createElement('tr');
table.appendChild(recordKeyRow);

// Create and append header cell for 'Record Key'
const recordKeyHeader = document.createElement('th');
recordKeyHeader.textContent = 'Record Key:';
recordKeyRow.appendChild(recordKeyHeader);

// Create and append data cell for 'Record Key'
const recordKeyCell = document.createElement('td');
recordKeyCell.textContent = recordKey;
recordKeyRow.appendChild(recordKeyCell);

// Create and append row for 'Date Taken'
const dateTakenRow = document.createElement('tr');
table.appendChild(dateTakenRow);

// Create and append header cell for 'Date Taken'
const dateTakenHeader = document.createElement('th');
dateTakenHeader.textContent = 'Date Taken:';
dateTakenRow.appendChild(dateTakenHeader);

// Create and append data cell for 'Date Taken'
const dateTakenCell = document.createElement('td');
const dateTaken = new Date(parseInt(record.dateTaken));
if (!isNaN(dateTaken.getTime())) {
  dateTakenCell.textContent = dateTaken.toLocaleString();
} else {
  dateTakenCell.textContent = 'Invalid Date';
}
dateTakenRow.appendChild(dateTakenCell);

// Create and append row for 'Services Offered'
const testsTakenRow = document.createElement('tr');
table.appendChild(testsTakenRow);
// Create and append header cell for 'Services Offered'
const testsTakenHeader = document.createElement('th');
testsTakenHeader.textContent = 'Services Offered:';
testsTakenRow.appendChild(testsTakenHeader);

// Create and append data cell for 'Services Offered'
const testsTakenCell = document.createElement('td');

// --- Investigations ---
let investigationsText = '';
if (record.investigationsTaken && record.investigationsTaken.length > 0) {
  investigationsText = record.investigationsTaken
    .map(i => `${i.category ? i.category + ': ' : ''}${i.name}${i.amount ? ` - UGX ${i.amount.toLocaleString()}` : ''}`)
    .join(', ');
}

// --- Procedures ---
let proceduresText = '';
if (record.proceduresTaken && record.proceduresTaken.length > 0) {
  proceduresText = record.proceduresTaken
    .map(p => `${p.category ? p.category + ': ' : ''}${p.name}${p.amount ? ` - UGX ${p.amount.toLocaleString()}` : ''}`)
    .join(', ');
}

// --- Services ---
let servicesText = '';
if (record.servicesTaken && record.servicesTaken.length > 0) {
  servicesText = record.servicesTaken
    .map(s => `${s.category ? s.category + ': ' : ''}${s.name}${s.amount ? ` - UGX ${s.amount.toLocaleString()}` : ''}`)
    .join(', ');
}

// --- Combine all ---
const allServicesText = [investigationsText, proceduresText, servicesText]
  .filter(Boolean)
  .join(', ');

// Set the combined text in the table cell
testsTakenCell.textContent = allServicesText || '-- None --';

// Append the data cell to the row
testsTakenRow.appendChild(testsTakenCell);


// --- Create examination row ---
const examinationRow = document.createElement('tr');
table.appendChild(examinationRow);

// Header cell
const examinationHeader = document.createElement('th');
examinationHeader.textContent = 'Examination';
examinationRow.appendChild(examinationHeader);

// Table cell for detailed examination
const examinationElement = document.createElement('td');

if (record.examination && typeof record.examination === 'object') {
  const examData = record.examination;
  const examContainer = document.createElement('div');
  examContainer.style.display = 'flex';
  examContainer.style.flexDirection = 'column';
  examContainer.style.gap = '6px';

  for (const [key, value] of Object.entries(examData)) {
    if (value && value.trim() !== '') {
      const fieldDiv = document.createElement('div');
      fieldDiv.style.marginBottom = '3px';

      // Format the label — capitalize & add spaces between words
      const formattedKey = key
        .replace(/([A-Z])/g, ' $1') // Add space before capital letters
        .replace(/\s+/g, ' ')       // Clean extra spaces
        .replace(/^./, s => s.toUpperCase()); // Capitalize first letter

      const labelSpan = document.createElement('strong');
      labelSpan.textContent = `${formattedKey}: `;
      labelSpan.style.color = '#111';
      labelSpan.style.textTransform = 'capitalize';

      const valueSpan = document.createElement('span');
      valueSpan.textContent = value;

      fieldDiv.appendChild(labelSpan);
      fieldDiv.appendChild(valueSpan);
      examContainer.appendChild(fieldDiv);
    }
  }

  examinationElement.appendChild(examContainer);
} else {
  examinationElement.textContent = record.examination || 'No examination found';
}

examinationRow.appendChild(examinationElement);



// Add this line at the beginning of your code to store the prices data
const pricesData = {};
// Create a button for uploading consumables and sundries prices
const uploadPricesButton = document.createElement('button');
uploadPricesButton.textContent = ' + Prices';
uploadPricesButton.classList.add('upload-prices-button');

// Add event listener to the upload prices button
uploadPricesButton.addEventListener('click', () => {
  // Get the current record key
  const recordKey = recordKeyCell.textContent;

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
  const testRecordRef = ref(database, `patients/${patient.patientId}/testsTaken/${recordKey}`);
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
  approveButton.innerHTML += ' Approve Service payment';

approveButton.addEventListener('click', () => {
  const confirmPayment = confirm("Are you sure you want to approve the Service payment?");
  if (confirmPayment) {
    handlePaymentAction(patient, record); // <-- pass patient and record here
  }
});



function handlePaymentAction(patient, record) {
  const confirmationPopup = document.getElementById('confirmationPopup');
  const testsTakenContainer = document.getElementById('testsTakenContainer');
  const patientIdInput = document.getElementById('patientIdInput');
  const totalAmountSpan = document.getElementById('totalAmount');

  testsTakenContainer.innerHTML = ''; // clear previous entries
  const allItems = [];

  // Set reason for payment as "Patient Name - Patient ID"
  if (patientIdInput) {
    patientIdInput.value = `${patient.name} - PI${patient.patientId}`;
  }

  function createCheckbox(item, index, type) {
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = true;
    checkbox.id = `${type}-${index}`;
    item.checkboxId = checkbox.id;

    const label = document.createElement('label');
    label.htmlFor = checkbox.id;
    label.innerText = `${item.category || type}: ${item.name} - UGX ${item.amount.toLocaleString()}`;

    const div = document.createElement('div');
    div.appendChild(checkbox);
    div.appendChild(label);
    testsTakenContainer.appendChild(div);

    checkbox.addEventListener('change', calculateTotal);

    allItems.push(item);
  }

  // Add Investigations
  if (record.investigationsTaken) {
    record.investigationsTaken.forEach((i, index) => createCheckbox(i, index, 'investigation'));
  }

  // Add Procedures
  if (record.proceduresTaken) {
    record.proceduresTaken.forEach((p, index) => createCheckbox(p, index, 'procedure'));
  }

  // Add Services
  if (record.servicesTaken) {
    record.servicesTaken.forEach((s, index) => createCheckbox(s, index, 'service'));
  }

  function calculateTotal() {
    let total = 0;
    allItems.forEach(item => {
      const checkbox = document.getElementById(item.checkboxId);
      if (checkbox && checkbox.checked) total += item.amount;
    });
    if (totalAmountSpan) totalAmountSpan.innerText = `Total: UGX ${total.toLocaleString()}`;
  }

  // Show popup
  confirmationPopup.style.display = 'block';
  calculateTotal(); // initial total

  // Close popup
  const closePopupBtn = document.getElementById('closePopupBtn');
  closePopupBtn.addEventListener('click', () => {
    confirmationPopup.style.display = 'none';
  });

  // Confirm payment
  const confirmPaymentBtn = document.getElementById('confirmPaymentBtn');
  confirmPaymentBtn.onclick = async () => {
    const selectedItems = allItems.filter(item => {
      const checkbox = document.getElementById(item.checkboxId);
      return checkbox && checkbox.checked;
    });

    if (selectedItems.length === 0) {
      alert('Please select at least one item to pay for.');
      return;
    }

    // --- Combine selected items into string ---
    const testsTakenData = selectedItems
      .map(item => `${item.category || item.type}: ${item.name}${item.amount ? ` - UGX ${item.amount.toLocaleString()}` : ''}`)
      .join(', ');

    if (patientIdInput) patientIdInput.value = `${patient.name} - ${patient.patientId}`;

    const totalAmount = selectedItems.reduce((sum, item) => sum + (item.amount || 0), 0);
    totalAmountSpan.innerText = `Total: UGX ${totalAmount.toLocaleString()}`;

    // Call confirmPaymentAction with selected items and patient info
    await confirmPaymentAction(selectedItems, patient);
  };
}




// Function to handle closing of the confirmation popup
function closeConfirmationPopup() {
  const confirmationPopup = document.getElementById('confirmationPopup');
  confirmationPopup.style.display = 'none';

  // Remove event listener from the confirm payment button
  const confirmPaymentBtn = document.getElementById('confirmPaymentBtn');
  confirmPaymentBtn.removeEventListener('click', confirmPaymentAction);
}
// Updated confirmPaymentAction to accept selected items
async function confirmPaymentAction(selectedItems, patient) {
  document.getElementById('overlayLoader').style.display = 'flex';

  const patientIdInput = document.getElementById('patientIdInput');
  const departmentSelect = document.getElementById('department');
  const paymentModeSelect = document.getElementById('paymentMode');
  const amountInput = document.getElementById('amountInput');
  const balanceInput = document.getElementById('balanceInput');
  const totalAmountSpan = document.getElementById('totalAmount');
  const confirmationPopup = document.getElementById('confirmationPopup');

  try {
    const testsTakenData = selectedItems
      .map(item => `${item.category || item.type}: ${item.name}${item.amount ? ` - UGX ${item.amount.toLocaleString()}` : ''}`)
      .join(', ');

    const totalAmount = selectedItems.reduce((sum, item) => sum + (item.amount || 0), 0);
    const amountTendered = parseFloat(amountInput.value) || totalAmount;
    const balance = amountTendered - totalAmount;

    // Build receipt object
    const salesReceipt = {
      patientId: patientIdInput.value,
      department: departmentSelect.value,
      paymentMode: paymentModeSelect.value,
      testsTaken: testsTakenData,
      totalAmount,
      amountTendered,
      balance,
      timestamp: Date.now(),
    };

    // Generate receipt number
    const counterRef = ref(database, 'receiptCounter');
    const counterSnap = await get(counterRef);
    let receiptNumber = counterSnap.exists() ? counterSnap.val() + 1 : 1;
    await set(counterRef, receiptNumber);

    const now = new Date();
    const dateString = now.toISOString().split('T')[0].replace(/-/g, '');
    const formattedReceiptNo = `R-${dateString}-${String(receiptNumber).padStart(3, '0')}`;

    // Upload receipt
    const salesReceiptsRef = ref(database, 'salesReceipts');
    await push(salesReceiptsRef, salesReceipt);

    showMessage('Sales receipt uploaded successfully');

   // Print receipt
const shouldPrint = confirm('Payment successful. Do you want to print the receipt?');
if (shouldPrint) {
  const receiptWindow = window.open('', '_blank');

  // Create a table for services
  let servicesTableRows = selectedItems.map(item => {
    return `<tr>
      <td>${item.category || item.type}</td>
      <td>${item.name}</td>
      <td>UGX ${item.amount.toLocaleString()}</td>
    </tr>`;
  }).join('');

  receiptWindow.document.write(`
    <html>
      <head>
        <title>Payment Receipt</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; text-align: center; background: #fff; }
          .hospital-logo img { width: 80px; height: auto; margin-bottom: 10px; }
          .hospital-details h1 { margin: 5px 0; font-size: 22px; }
          .hospital-details p { margin: 2px 0; font-size: 14px; }
          .receipt { border:1px solid #ccc; display:inline-block; padding:20px; max-width:500px; text-align:left; }
          .receipt h2 { text-align:center; margin-top:0; margin-bottom:15px; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 15px; }
          th, td { border:1px solid #ccc; padding: 5px; text-align:left; font-size: 14px; }
          th { background-color: #f2f2f2; }
          hr { margin: 15px 0; }
        </style>
      </head>
      <body>
        <div class="hospital-logo">
          <img src="sanyu.png" alt="KEAH Logo">
        </div>
        <div class="hospital-details">
          <h1>SANYU HOSPITAL </h1>
          <p>Plot 294 Kevina Road, Nsambya-Kampala</p>
          <p>Phone: +256 782 477 517</p>
          <p>Email: info@keahmedicals.com</p>
        </div>
        <div class="receipt">
          <h2>Payment Receipt</h2>
          <p><strong>Receipt No:</strong> ${formattedReceiptNo}</p>
          <p><strong>Patient/Reason:</strong> ${patientIdInput.value}</p>
          <p><strong>Department:</strong> ${departmentSelect.value}</p>
          <p><strong>Payment Mode:</strong> ${paymentModeSelect.value}</p>
          <h3>Services Paid</h3>
          <table>
            <thead>
              <tr>
                <th>Type</th>
                <th>Service</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              ${servicesTableRows}
            </tbody>
          </table>
          <p><strong>Total:</strong> UGX ${totalAmount.toFixed(2)}</p>
          <p><strong>Amount Paid:</strong> UGX ${amountTendered.toFixed(2)}</p>
          <p><strong>Balance:</strong> UGX ${balance.toFixed(2)}</p>
          <p><strong>Date:</strong> ${now.toLocaleString()}</p>
          <hr>
          <p style="text-align:center;">Thank you for your payment!</p>
        </div>
        <script>
          window.onload = function() { window.print(); }
        </script>
      </body>
    </html>
  `);

  receiptWindow.document.close();
}


    // Close popup & reset
    confirmationPopup.style.display = 'none';
    amountInput.value = '';
    balanceInput.value = '';
    totalAmountSpan.innerText = '0.00';

const paymentStatusRef = ref(database, `patients/${patient.patientId}/testsTaken/${recordKey}/paymentstatus`);
await set(paymentStatusRef, 'payment received');

  } catch (error) {
    console.error('Payment error:', error);
    showMessage('Error uploading sales receipt:', error);
  } finally {
    document.getElementById('overlayLoader').style.display = 'none';
  }
}

  // Append the approve button to a container element on your webpage
  recordElement.appendChild(approveButton);
}else {
  paymentStatusElement.style.color = 'blue';
}






// Create complaints row
const complaintsRow = document.createElement('tr');
recordElement.appendChild(complaintsRow);

// Create table header for 'Complaints'
const complaintsHeader = document.createElement('th');
complaintsHeader.textContent = 'Patient Complaints';
complaintsRow.appendChild(complaintsHeader);

// Create table cell for 'Complaints'
const complaintsElement = document.createElement('td');
complaintsElement.textContent = record.additionalNotes || 'No complaints';
complaintsRow.appendChild(complaintsElement);

// Optionally, style the complaints element based on the content (if required)
if (!record.additionalNotes) {
  complaintsElement.style.color = 'gray';
} else {
  complaintsElement.style.color = 'black';
}


// --- Investigations Row ---
const invRow = document.createElement('tr');
table.appendChild(invRow);

const invHeader = document.createElement('th');
invHeader.textContent = 'Investigations';
invRow.appendChild(invHeader);

const invElement = document.createElement('td');

if (record.investigationsTaken && Array.isArray(record.investigationsTaken) && record.investigationsTaken.length > 0) {
  // Group by category
  const invByCategory = {};
  record.investigationsTaken.forEach(i => {
    if (!invByCategory[i.category]) invByCategory[i.category] = [];
    invByCategory[i.category].push(`${i.name} - UGX ${i.amount.toLocaleString()}`);
  });

  // Render HTML with categories and items
  invElement.innerHTML = Object.entries(invByCategory)
    .map(([category, items]) => {
      return `<strong>${category}</strong><br>${items.join('<br>')}`;
    })
    .join('<br><br>'); // space between categories

} else {
  invElement.textContent = '-- Select Investigation --';
}

invRow.appendChild(invElement);

// --- Procedures Row ---
const procRow = document.createElement('tr');
table.appendChild(procRow);

const procHeader = document.createElement('th');
procHeader.textContent = 'Procedures';
procRow.appendChild(procHeader);

const procElement = document.createElement('td');

if (record.proceduresTaken && Array.isArray(record.proceduresTaken) && record.proceduresTaken.length > 0) {
  // Group by category
  const procByCategory = {};
  record.proceduresTaken.forEach(p => {
    if (!procByCategory[p.category]) procByCategory[p.category] = [];
    procByCategory[p.category].push(`${p.name} - UGX ${p.amount.toLocaleString()}`);
  });

  // Render HTML with categories and items
  procElement.innerHTML = Object.entries(procByCategory)
    .map(([category, items]) => {
      return `<strong>${category}</strong><br>${items.join('<br>')}`;
    })
    .join('<br><br>'); // space between categories

} else {
  procElement.textContent = '-- Select Procedure --';
}

procRow.appendChild(procElement);



// --- Procedures & Services Row ---
const servicesRow = document.createElement('tr');
table.appendChild(servicesRow);

// Header
const servicesHeader = document.createElement('th');
servicesHeader.textContent = 'Procedures & Services';
servicesRow.appendChild(servicesHeader);

// Data cell
const servicesElement = document.createElement('td');

if (
  (record.servicesTaken && record.servicesTaken.length > 0)
) {
  // Group by category
  const itemsByCategory = {};


  // Add services
  (record.servicesTaken || []).forEach(s => {
    if (!itemsByCategory[s.category]) itemsByCategory[s.category] = [];
    itemsByCategory[s.category].push(`${s.name} - UGX ${s.amount.toLocaleString()}`);
  });

  // Render HTML
  servicesElement.innerHTML = Object.entries(itemsByCategory)
    .map(([category, items]) => `<strong>${category}</strong><br>${items.join('<br>')}`)
    .join('<br><br>'); // space between categories
} else {
  servicesElement.textContent = '-- None --';
}

// Append to row
servicesRow.appendChild(servicesElement);



// --- Grand Total Row ---
const grandTotalRow = document.createElement('tr');
recordElement.appendChild(grandTotalRow);

const grandTotalHeader = document.createElement('th');
grandTotalHeader.textContent = 'Grand Total';
grandTotalRow.appendChild(grandTotalHeader);

const grandTotalElement = document.createElement('td');
const grandTotal = 
  (record.investigationsTaken || []).reduce((sum, i) => sum + (i.amount || 0), 0) +
    (record.servicesTaken || []).reduce((sum, i) => sum + (i.amount || 0), 0) +
  (record.proceduresTaken || []).reduce((sum, p) => sum + (p.amount || 0), 0);
grandTotalElement.textContent = `UGX ${grandTotal.toLocaleString()}`;
grandTotalElement.style.fontWeight = 'bold';
grandTotalElement.style.color = 'green'; // Highlight grand total
grandTotalRow.appendChild(grandTotalElement);





function updateTotal() {
  // Get the grand total text from the grand total element
  let grandTotalText = grandTotalElement.textContent; // e.g., "UGX 1,250,000"

  // Remove "UGX" and commas, then convert to a number
  let totalPrice = parseFloat(grandTotalText.replace(/UGX|\s|,/g, ''));

  // Display the total price in the totalAmount span
  totalAmountSpan.textContent = totalPrice.toFixed(2); // e.g., "1250000.00"
}



// Function to calculate total when button is clicked
function calculateTotalOnClick() {
  updateTotal(); // Calculate and update total
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

  const followUp = document.createElement('th');
  followUp.textContent = 'Follow Up date & time';
recordElement.appendChild(followUp);

const followUpData = document.createElement('td');
followUpData.textContent = record.results?.followUpDateTime || 'none';
recordElement.appendChild(followUpData);

  const finalStatusHeader = document.createElement('th');
finalStatusHeader.textContent = 'Final Status of Patient';
recordElement.appendChild(finalStatusHeader);

const finalStatusData = document.createElement('td');
finalStatusData.textContent = record.results?.finalStatus || 'Pending...';
recordElement.appendChild(finalStatusData);
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

  let totalDataCell;
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


    totalDataCell = document.createElement('td');
    totalDataCell.textContent = 'UGX ' + treatmentTotal.toFixed(2); // Use toFixed(2) to ensure two decimal places
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

const medicationTableData = [];

// Create table header row
const tableHeaderRow = document.createElement('tr');
const headers = ['Medication', 'Prescription', 'Pieces', 'Total Cost'];
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
        // Create an object to represent each row of medication data
        const rowData = {
      medication: medicationData.medication,
      prescription: medicationData.prescription,
      grams: medicationData.grams,
      totalCost: medicationData.totalCost,
      overallTotalCost: medicationData.totalCost,
    };

    // Push the row data object into the medicationTableData array
    medicationTableData.push(rowData);
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

// Create total cost cell
let totalCostCell = document.createElement('td');
totalCostCell.textContent = 'Total Cost: UGX ' + totalCost.toFixed(2);
totalCostCell.classList.add('total-cell'); // Add the CSS class
totalRow.appendChild(totalCostCell);

// Create payment status element
const medicineStatusElement = document.createElement('p');
medicineStatusElement.textContent = 'Medicine Payment: ' + (record.medicinestatus || 'Not Paid');
medicineStatusElement.classList.add('payment-status'); // Add the CSS class
recordElement.appendChild(medicineStatusElement);
// ==========================================================
// CALCULATE OVERALL TOTAL
// ==========================================================

// Tests total
const testsTotal =
    Number(record.totalAmount) || 0;


// Medication total
const medicationTotal =
    Number(totalCost) || 0;


// Consumables total
const consumablesTotal =
    Number(
        record.consumablesAndSundries?.consumablesPrice
    ) || 0;


// Sundries total
const sundriesTotal =
    Number(
        record.consumablesAndSundries?.sundriesPrice
    ) || 0;


// Treatment total = Consumables + Sundries
const treatmentTotal =
    consumablesTotal +
    sundriesTotal;


// Overall total
const overallTotal =
    testsTotal +
    medicationTotal +
    treatmentTotal;


console.log('Tests Total:', testsTotal);
console.log('Medication Total:', medicationTotal);
console.log('Consumables:', consumablesTotal);
console.log('Sundries:', sundriesTotal);
console.log('Treatment Total:', treatmentTotal);
console.log('Overall Total:', overallTotal);


// ==========================================================
// DISPLAY OVERALL TOTAL
// ==========================================================

const overallTotalSpan =
    document.createElement('span');

overallTotalSpan.textContent =
    'Overall Total: UGX ' +
    overallTotal.toLocaleString(
        'en-US',
        {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }
    );

overallTotalSpan.classList.add(
    'overall-total'
);

medicationTable.appendChild(
    overallTotalSpan
);

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
  approve2Button.innerHTML += ' Approve Medicine Payment';

 // Add click event listener to the approve button
approve2Button.addEventListener('click', () => {
    // Clone and show the approval popup
    const medicinePaymentPopupClone = document.getElementById('medicinePaymentPopup');
    medicinePaymentPopupClone.style.display = 'block';
  
    // Set the values for the popup
    const totalAmount = overallTotal; // Use the overall total here
    const paidAmount = 0; // Initialize with a value or leave blank
    let balance = totalAmount - paidAmount;
  
    // Set the total amount, amount paid, balance, department, and payment mode
    document.getElementById('totalAmountValue').textContent = `UGX ${totalAmount.toFixed(2)}`;
    document.getElementById('amountReceivedInput').value = paidAmount.toFixed(2);
    document.getElementById('remainingBalanceInput').value = balance.toFixed(2);
  
    // Set the department and payment mode dropdowns
    document.getElementById('paymentDepartmentSelect').value = "general";  // Set default department, change if necessary
    document.getElementById('paymentMethodSelect').value = "Cash";  // Set default payment mode, change if necessary
  
    // Event listener for closing the popup
    const closeMedicinePopupBtn = document.getElementById('closeMedicinePopupBtn');
    closeMedicinePopupBtn.addEventListener('click', () => {
      medicinePaymentPopupClone.style.display = 'none'; // Close the popup
    });
  
    // Handle dynamic balance update as amountReceivedInput changes
    const amountReceivedInput = document.getElementById('amountReceivedInput');
    const remainingBalanceInput = document.getElementById('remainingBalanceInput');
    
    amountReceivedInput.addEventListener('input', () => {
      const amountReceived = parseFloat(amountReceivedInput.value);
      if (!isNaN(amountReceived)) {
        balance = totalAmount - amountReceived;
        remainingBalanceInput.value = balance.toFixed(2);
  
        // Change color of balance field based on the amount received
        if (balance > 0) {
          remainingBalanceInput.style.color = 'red'; // Color it red if there's still a balance
        } else if (balance === 0) {
          remainingBalanceInput.style.color = 'green'; // Green when fully paid
        } else {
          remainingBalanceInput.style.color = 'blue'; // Optional: Blue if overpaid, handle this as you see fit
        }
      } else {
        remainingBalanceInput.value = totalAmount.toFixed(2); // In case of invalid input
        remainingBalanceInput.style.color = 'black'; // Default color if input is invalid
      }
    });
  
// Handle confirming the medicine payment
const confirmMedicinePaymentButton = document.getElementById('confirmMedicinePaymentButton');
confirmMedicinePaymentButton.addEventListener('click', async () => {

  document.getElementById('overlayLoader').style.display = 'flex';

  // Get the patient ID and test record key
  const patientId = patient.patientId; // Replace with actual patient ID
  const testKey = recordKey; // Replace with the actual key for the test (use the correct reference)
  const amountReceived = parseFloat(document.getElementById('amountReceivedInput').value);
  const balanceValue = parseFloat(document.getElementById('remainingBalanceInput').value);
  const totalAmount = overallTotal; // Use the overall total here
  const department = document.getElementById('paymentDepartmentSelect').value;
  const paymentMode = document.getElementById('paymentMethodSelect').value;
  const testsTaken = recordKey; // Get Services Offered information if needed

  const salesReceipt = {
    testsTaken,
    totalAmount,
    amountReceived,
    balance: balanceValue, // Update with actual balance after payment
    patientId,
    department,
    paymentMode,
    timestamp: Date.now(),
  };

  try {
    // Get and increment receipt counter
    const counterRef = ref(database, 'receiptCounter');
    const counterSnap = await get(counterRef);
    let receiptNumber = 1;
    if (counterSnap.exists()) {
      receiptNumber = counterSnap.val() + 1;
    }
    await set(counterRef, receiptNumber);

    const now = new Date();
    const dateString = now.toISOString().split('T')[0].replace(/-/g, '');
    const formattedReceiptNo = `R-${dateString}-${String(receiptNumber).padStart(3, '0')}`;

    // Push receipt to database
    const salesReceiptsRef = ref(database, 'salesReceipts');
    await push(salesReceiptsRef, salesReceipt);

    showMessage('Sales receipt uploaded successfully');

    // Ask the user if they want to print the receipt
    const shouldPrint = confirm("Payment successful. Do you want to print the receipt?");

    if (shouldPrint) {
      const receiptWindow = window.open('', '_blank');
      receiptWindow.document.write(`
        <html>
        <head>
          <title>Payment Receipt</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              padding: 10px;
              background: #fff;
              margin: 0;
              color: #000; /* Ensure text is black */
            }
            .hospital-logo img {
              width: 120px;
              height: auto;
              margin: 10px auto;
              display: block; /* Center the logo */
            }
            .hospital-details {
              text-align: center;
              margin-bottom: 20px;
            }
            .hospital-details h1 {
              margin: 0;
              font-size: 28px;
              color: #000;
            }
            .hospital-details p {
              margin: 4px 0;
              font-size: 14px;
              color: #000;
            }
            .receipt {
              background: #fff;
              border: 1px solid #000;
              padding: 15px;
              max-width: 450px;
              margin: 20px auto;
              box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            }
            .receipt h2 {
              text-align: center;
              margin-top: 0;
              font-size: 22px;
              color: #000;
            }
            .receipt p {
              margin: 10px 0;
              font-size: 15px;
              color: #000;
            }
            .receipt p strong {
              color: #000;
            }
            hr {
              margin: 15px 0;
              border: 1px solid #000;
            }
            .thank-you {
              text-align: center;
              font-size: 16px;
              color: #000;
              margin-top: 20px;
            }
            .date-time {
              text-align: center;
              font-size: 14px;
              color: #000;
              margin-top: 20px;
              padding: 10px;
              border: 1px solid #000;
              width: 200px;
              margin: 20px auto;
            }
            .date-time p {
              margin: 5px 0;
            }
          </style>
        </head>
        <body>
          <div class="hospital-logo">
            <img src="sanyu.png" alt="Hospital Logo">
          </div>
          <div class="hospital-details">
            <h1>SANYU HOSPITAL  </h1>
            <p>Address: Located at Katooke-Wakiso District</p>
            <p>Phone: +256 782 477 517</p>
            <p>Email: info@keahmedicals.com</p>
          </div>
          <div class="date-time">
            <p><strong>Date:</strong> ${now.toLocaleDateString()}</p>
            <p><strong>Time:</strong> ${now.toLocaleTimeString()}</p>
          </div>

          <div class="receipt">
            <h2>Payment Receipt</h2>
            <p><strong>Receipt No:</strong> ${formattedReceiptNo}</p>
            <p><strong>Patient ID:</strong> ${patientId}</p>
            <p><strong>Department:</strong> ${department}</p>
            <p><strong>Payment Mode:</strong> ${paymentMode}</p>
            <p><strong>Services Offered:</strong> ${testsTaken}</p>
            <p><strong>Total Amount:</strong> UGX ${totalAmount.toFixed(2)}</p>
            <p><strong>Amount Tendered:</strong> UGX ${amountReceived.toFixed(2)}</p>
            <p><strong>Balance:</strong> UGX ${balanceValue.toFixed(2)}</p>
            <hr>
            <p class="thank-you">Thank you for your payment!</p>
          </div>

          <script>
            window.onload = function() {
              window.print();
            };
          </script>
        </body>
        </html>
      `);
      receiptWindow.document.close();
    }

    // Update payment status in the database
    const paymentStatusRef = ref(database, `patients/${patientId}/testsTaken/${testKey}/medicinestatus`);
    await set(paymentStatusRef, 'payment received');
    showMessage('Payment status updated successfully!');
    console.log('Payment status updated successfully.');

    // Store balance details under the test in Firebase
    const balanceRef = ref(database, `patients/${patientId}/testsTaken/${testKey}/paymentDetails`);
    await set(balanceRef, {
      totalAmount,
      amountReceived,
      balance: balanceValue,
      department,
      paymentMode,
      timestamp: Date.now(),
    });

    // Close the popup after successful processing
    medicinePaymentPopupClone.style.display = 'none';

  } catch (error) {
    showMessage('Error uploading sales receipt:', error);
    console.error('Receipt error:', error);

    // Restore button state in case of error
    confirmMedicinePaymentButton.disabled = false;
    confirmMedicinePaymentButton.innerHTML = 'Confirm Payment';
  }
  finally {
    // Hide loader after all is done
    document.getElementById('overlayLoader').style.display = 'none';
  }

});

  });
  


// Append the approve button to a container element on your webpage
recordElement.appendChild(approve2Button);

}else {
  medicineStatusElement.style.color = 'blue';
}
// Create payment details row
const paymentDetailsRow = document.createElement('tr');

// Create table header for 'Payment Details'
const paymentHeader = document.createElement('th');
paymentHeader.textContent = 'Payment Details';
paymentDetailsRow.appendChild(paymentHeader);

// Create table cell for 'Payment Details'
const paymentDetailsCell = document.createElement('td');
paymentDetailsCell.classList.add('payment-details-cell'); // Add CSS class

// Get payment details from the record
const paymentDetails = record.paymentDetails;

if (paymentDetails) {
  const { totalAmount, amountReceived, balance, department, paymentMode } = paymentDetails;

  paymentDetailsCell.innerHTML = `
    <div class="payment-line"><strong>Total:</strong> UGX ${totalAmount?.toFixed(2) || 0}</div>
    <div class="payment-line"><strong>Paid:</strong> UGX ${amountReceived?.toFixed(2) || 0}</div>
    <div class="payment-line balance-line"><strong>Balance:</strong> UGX ${balance?.toFixed(2) || 0}</div>
    <div class="payment-line"><strong>Department:</strong> ${department || 'N/A'}</div>
    <div class="payment-line"><strong>Payment Mode:</strong> ${paymentMode || 'N/A'}</div>
  `;

  if (balance > 0) {
    paymentDetailsCell.classList.add('unpaid');
  } else {
    paymentDetailsCell.classList.add('paid');
  }
} else {
  paymentDetailsCell.textContent = 'No payment recorded';
  paymentDetailsCell.classList.add('no-payment');
}

paymentDetailsRow.appendChild(paymentDetailsCell);
recordElement.appendChild(paymentDetailsRow);
if (!record.paymentDetails || record.paymentDetails.balance > 0) {
    const completePaymentBtn = document.createElement('button');
    completePaymentBtn.textContent = '💳 Complete Payment';
    completePaymentBtn.classList.add('complete-payment-btn');
    
    completePaymentBtn.addEventListener('click', () => {
      // Clone and show the medicine payment popup
      const medicinePaymentPopupClone = document.getElementById('medicinePaymentPopup');
      medicinePaymentPopupClone.style.display = 'block';
  
      // Extract payment details
      const paymentDetails = record.paymentDetails || {};
      const previousBalance = paymentDetails.balance || 0;
  
      // Set the total amount to the previous balance (for completing the payment)
      document.getElementById('totalAmountValue').textContent = `UGX ${previousBalance.toFixed(2)}`;
      document.getElementById('amountReceivedInput').value = '0.00'; // Start from 0 for the new input
      document.getElementById('remainingBalanceInput').value = previousBalance.toFixed(2);
  
      // Set the department and payment mode dropdowns
      document.getElementById('paymentDepartmentSelect').value = paymentDetails.department || "general";  // Set default department
      document.getElementById('paymentMethodSelect').value = paymentDetails.paymentMode || "Cash";  // Set default payment mode
  
      // Handle dynamic balance update as amountReceivedInput changes
      const amountReceivedInput = document.getElementById('amountReceivedInput');
      const remainingBalanceInput = document.getElementById('remainingBalanceInput');
  
      amountReceivedInput.addEventListener('input', () => {
        const amountReceived = parseFloat(amountReceivedInput.value);
        if (!isNaN(amountReceived)) {
          const remainingBalance = previousBalance - amountReceived; // Calculate the remaining balance
          remainingBalanceInput.value = remainingBalance.toFixed(2);
  
          // Change color of balance field based on the amount received
          if (remainingBalance > 0) {
            remainingBalanceInput.style.color = 'red'; // Red if there's still a balance
          } else if (remainingBalance === 0) {
            remainingBalanceInput.style.color = 'green'; // Green if fully paid
          } else {
            remainingBalanceInput.style.color = 'blue'; // Blue if overpaid
          }
        }
      });
  
      // Event listener for closing the popup
      const closeMedicinePopupBtn = document.getElementById('closeMedicinePopupBtn');
      closeMedicinePopupBtn.addEventListener('click', () => {
        medicinePaymentPopupClone.style.display = 'none'; // Close the popup
      });
  
      // Handle confirming the payment
      const confirmMedicinePaymentButton = document.getElementById('confirmMedicinePaymentButton');
      confirmMedicinePaymentButton.addEventListener('click', async () => {

        document.getElementById('overlayLoader').style.display = 'flex';

        const amountReceived = parseFloat(document.getElementById('amountReceivedInput').value);
        const remainingBalanceValue = parseFloat(document.getElementById('remainingBalanceInput').value);
  
        // Get patient ID and test record key
        const patientId = patient.patientId; // Replace with actual patient ID
        const testKey = recordKey; // Replace with the actual key for the test (use the correct reference)
  
        const totalAmount = previousBalance; // Set the total amount to the previous balance
        const department = document.getElementById('paymentDepartmentSelect').value;
        const paymentMode = document.getElementById('paymentMethodSelect').value;
        const testsTaken = recordKey; // Get Services Offered information if needed
  
        const salesReceipt = {
          testsTaken,
          totalAmount,
          amountReceived,
          balance: remainingBalanceValue, // Update balance after payment
          patientId,
          department,
          paymentMode,
          timestamp: Date.now(),
        };
  
        try {
          // Get and increment receipt counter
          const counterRef = ref(database, 'receiptCounter');
          const counterSnap = await get(counterRef);
          let receiptNumber = 1;
          if (counterSnap.exists()) {
            receiptNumber = counterSnap.val() + 1;
          }
          await set(counterRef, receiptNumber);
  
          const now = new Date();
          const dateString = now.toISOString().split('T')[0].replace(/-/g, '');
          const formattedReceiptNo = `R-${dateString}-${String(receiptNumber).padStart(3, '0')}`;
  
          // Push receipt to the database
          const salesReceiptsRef = ref(database, 'salesReceipts');
          await push(salesReceiptsRef, salesReceipt);
  
          showMessage('Sales receipt uploaded successfully');
  
// Ask the user if they want to print the receipt
const shouldPrint = confirm("Payment successful. Do you want to print the receipt?");

if (shouldPrint) {
  const receiptWindow = window.open('', '_blank');
  receiptWindow.document.write(`
    <html>
    <head>
      <title>Payment Receipt</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          padding: 10px;
          background: #fff;
          margin: 0;
          color: #000;
        }
        .hospital-logo img {
          width: 120px;
          height: auto;
          margin: 10px auto;
          display: block;
        }
        .hospital-details {
          text-align: center;
          margin-bottom: 20px;
        }
        .hospital-details h1 {
          margin: 0;
          font-size: 28px;
          color: #000;
        }
        .hospital-details p {
          margin: 4px 0;
          font-size: 14px;
          color: #000;
        }
        .receipt {
          background: #fff;
          border: 1px solid #000;
          padding: 15px;
          max-width: 450px;
          margin: 20px auto;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }
        .receipt h2 {
          text-align: center;
          margin-top: 0;
          font-size: 22px;
          color: #000;
        }
        .receipt p {
          margin: 10px 0;
          font-size: 15px;
          color: #000;
        }
        .receipt p strong {
          color: #000;
        }
        hr {
          margin: 15px 0;
          border: 1px solid #000;
        }
        .thank-you {
          text-align: center;
          font-size: 16px;
          color: #000;
          margin-top: 20px;
        }
        .date-time {
          text-align: center;
          font-size: 14px;
          color: #000;
          margin-top: 20px;
          padding: 10px;
          border: 1px solid #000;
          width: 200px;
          margin: 20px auto;
        }
        .date-time p {
          margin: 5px 0;
        }
      </style>
    </head>
    <body>
      <div class="hospital-logo">
        <img src="sanyu.png" alt="Hospital Logo">
      </div>
      <div class="hospital-details">
        <h1>SANYU HOSPITAL  </h1>
        <p>Address: Located at Katooke-Wakiso District</p>
        <p>Phone: +256 782 477 517</p>
        <p>Email: info@keahmedicals.com</p>
      </div>
      <div class="date-time">
        <p><strong>Date:</strong> ${now.toLocaleDateString()}</p>
        <p><strong>Time:</strong> ${now.toLocaleTimeString()}</p>
      </div>

      <div class="receipt">
        <h2>Payment Receipt</h2>
        <p><strong>Receipt No:</strong> ${formattedReceiptNo}</p>
        <p><strong>Patient ID:</strong> ${patientId}</p>
        <p><strong>Department:</strong> ${department}</p>
        <p><strong>Payment Mode:</strong> ${paymentMode}</p>
        <p><strong>Services Offered:</strong> ${testsTaken}</p>
        <p><strong>Total Amount:</strong> UGX ${totalAmount.toFixed(2)}</p>
        <p><strong>Amount Tendered:</strong> UGX ${amountReceived.toFixed(2)}</p>
        <p><strong>Balance:</strong> UGX ${remainingBalanceValue.toFixed(2)}</p>
        <hr>
        <p class="thank-you">Thank you for your payment!</p>
      </div>

      <script>
        // Automatically trigger print dialog
        window.onload = function () {
          window.print();
          window.onafterprint = function () {
            window.close(); // Close the window after printing
          };
        };
      </script>
    </body>
    </html>
  `);
  receiptWindow.document.close();
}

          // Update payment status in the database
          const paymentStatusRef = ref(database, `patients/${patientId}/testsTaken/${testKey}/medicinestatus`);
          await set(paymentStatusRef, 'payment received');
          showMessage('Payment status updated successfully!');
  
          // Store balance details under the test in Firebase
          const balanceRef = ref(database, `patients/${patientId}/testsTaken/${testKey}/paymentDetails`);
          await set(balanceRef, {
            totalAmount,
            amountReceived,
            balance: remainingBalanceValue,
            department,
            paymentMode,
            timestamp: Date.now(),
          });
  
          // Close the popup after successful processing
          medicinePaymentPopupClone.style.display = 'none';
  
        } catch (error) {
          showMessage('Error uploading sales receipt:', error);
          console.error('Receipt error:', error);
        }
        finally {
          // Hide loader after all is done
          document.getElementById('overlayLoader').style.display = 'none';
        }
      });
    });
  
    // Append the complete payment button after payment details
    const paymentActionRow = document.createElement('tr');
    const emptyCell = document.createElement('td');
    const buttonCell = document.createElement('td');
  
    buttonCell.appendChild(completePaymentBtn);
    paymentActionRow.appendChild(emptyCell);
    paymentActionRow.appendChild(buttonCell);
  
    recordElement.appendChild(paymentActionRow);
  }
  
  
  

// Function to handle payment action
function handlePaymentAction() {
  // Capture the Services Offered
  const testsTakenData = testsTakenCell.textContent.trim();
  console.log('Services Offered:', testsTakenData);

  // Get the input element where you want to display the Services Offered data
  const testsTakenInput = document.getElementById('testsTaken');

  // Set the value of the input element to the captured Services Offered data
  testsTakenInput.value = testsTakenData;

  // Show custom payment details popup
  const confirmationPopup = document.getElementById('confirmationPopup');
  confirmationPopup.style.display = 'block';
  calculateTotalOnClick()
  // Close popup when close button is clicked
  const closePopupBtn = document.getElementById('closePopupBtn');
  closePopupBtn.addEventListener('click', closePopup);

  // Add event listener to the confirm payment button
  const confirmPaymentBtn = document.getElementById('confirmPaymentBtn');
  confirmPaymentBtn.addEventListener('click', confirmPaymentAction);

  // Function to close the popup
  function closePopup() {
    confirmationPopup.style.display = 'none';
    closePopupBtn.removeEventListener('click', closePopup);
    confirmPaymentBtn.removeEventListener('click', confirmPaymentAction);
  }
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
// Create a WhatsApp share button
const whatsappShareButton = document.createElement('button');
whatsappShareButton.id = 'whatsappShareButton';
whatsappShareButton.innerHTML = '<i class="fa fa-whatsapp"></i> Results';
// Add a click event listener to the WhatsApp share button

// Add a click event listener to the WhatsApp share button
whatsappShareButton.addEventListener('click', () => {
  // Get the download URL of the result file
  const patientName = patient.patientId;
  const recordKey = recordKeyCell.textContent.replace('Record Key: ', '');
  const testRef = ref(database, `patients/${patientName}/testsTaken/${recordKey}`);

  get(testRef)
    .then((snapshot) => {
      const testData = snapshot.val();
      if (testData && testData.resultFileURL) {
        // Get the patient's WhatsApp number from the patient object
        const patientPhoneNumber = patient.parents;

        // Create the WhatsApp message with the file URL
        const fileURL = testData.resultFileURL;
        const message = generateWhatsAppMessage(fileURL);

        // Construct the WhatsApp URL with the patient's number and message using the official  API
        const whatsappURL = `https://api.whatsapp.com/send?phone=${patientPhoneNumber}&text=${encodeURIComponent(message)}`;

        // Open WhatsApp in a new tab or window
        window.open(whatsappURL, '_blank');
      } else {
        showMessage('No results file available.');
      }
    })
    .catch((error) => {
      console.error('Error retrieving file URL:', error);
      showMessage('Error retrieving file URL. Please try again.');
    });
});

// Function to generate the WhatsApp message
function generateWhatsAppMessage(fileURL) {
  // Customize the message content here based on the patient's information and the file URL
  const patientName = patient.name; // Replace with the actual patient's name
  const hospitalName = 'SANYU HOSPITAL  '; // Replace with the hospital's name
  const contactNumber = '+256 782 477 517'; // Replace with the hospital's contact number

  // Create the message text with the file URL
  const message = `Hello ${patientName},\n\nThis is ${hospitalName}. We are pleased to share your latest medical results with you. Please click on the link below to access your results:\n\n${fileURL}\n\nFor any questions or assistance, feel free to contact us at ${contactNumber}.\n\nThank you for choosing ${hospitalName} for your healthcare needs. We value your trust and are here to assist you with any medical concerns.\n\nBest regards,\n${hospitalName}`;

  return message;
}



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
// Function to get patient details
function getPatientDetails(patientName) {
  const patientRef = ref(database, `patients/${patientName}`);
  return get(patientRef)
    .then((snapshot) => {
      if (snapshot.exists()) {
        return snapshot.val();
      } else {
        return null;
      }
    })
    .catch((error) => {
      console.error('Error fetching patient details:', error);
      return null;
    });
}

// Function to get the latest visit data for a patient
function getLatestVisitData(patientName) {
  const visitsRef = ref(database, `patients/${patientName}/visits`);
  return get(visitsRef)
    .then((snapshot) => {
      const visitDetails = snapshot.val();
      if (visitDetails) {
        // Get the visit keys and sort them in descending order based on timestamp
        const visitKeys = Object.keys(visitDetails).sort((a, b) => visitDetails[b].timestamp - visitDetails[a].timestamp);

        // Get the latest visit data if available
        const latestVisitKey = visitKeys[0];
        const latestVisitData = visitDetails[latestVisitKey];
        return latestVisitData;
      } else {
        return null;
      }
    })
    .catch((error) => {
      console.error('Error fetching latest visit data:', error);
      return null;
    });
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
  // Define the signature popup element
  const signaturePopup = document.getElementById('signaturePopup');
  let signatureData; // Declare signatureData variable at a higher scope

  // Create print button
  const printButton = document.createElement('button');
  printButton.innerHTML = '<i class="fa fa-print"></i> Print Record';
  printButton.classList.add('print-button');

  const overlay2 = document.getElementById('overlay2');

  // Initialize Signature Pad once when the page loads
  const signatureCanvas = document.getElementById('signatureCanvas');
  const signaturePad = new SignaturePad(signatureCanvas, { /* Add options if needed */ });

  const saveSignatureButton = document.getElementById('saveSignature');
  const closeSignatureButton = document.getElementById('closeSignaturePopup');

  saveSignatureButton.addEventListener('click', () => {
    signatureData = signaturePad.toDataURL();
    if (signatureData) {
      // Save the signatureData and close the popup
      signaturePopup.style.display = 'none';
      overlay2.style.display = 'none';
    } else {
      alert('Please provide a signature before saving.');
    }
  });
  const clearSignatureButton = document.getElementById('clearSignature');

  clearSignatureButton.addEventListener('click', () => {
    // Clear the signature
    signaturePad.clear();
  });
  
  closeSignatureButton.addEventListener('click', () => {
    // Clear the signature and close the popup
    signaturePad.clear();
    signaturePopup.style.display = 'none';
    overlay2.style.display = 'none';
  });

printButton.addEventListener('click', async () => {
  // Get the patient details and latest visit data
  const patient = await getPatientDetails(patientName);
  const latestVisitData = await getLatestVisitData(patientName);


  // Proceed to print with the current signatureData
  printRecord(patient, record, recordKey, visitDetails, latestVisitData);
});

  // Append the print button to the record element
  recordElement.appendChild(printButton);

  // async function to show the signature popup
  async function openSignaturePopup() {
    overlay2.style.display = 'block';
    signaturePopup.style.display = 'block';
  }
// Append the print button to the record element
recordElement.appendChild(printButton);

// Create a WhatsApp share button for medical form details
const whatsappMedicalFormButton = document.createElement('button');
whatsappMedicalFormButton.id = 'whatsappMedicalFormButton';
whatsappMedicalFormButton.innerHTML = '<i class="fa fa-whatsapp"></i>Medical Form';


// Add a click event listener to the WhatsApp medical form button
whatsappMedicalFormButton.addEventListener('click', () => {
  // Replace 'patientPhoneNumber' with the actual WhatsApp number of the patient
  const patientPhoneNumber = patient.parents; // Replace with the correct property name
  const latestVisitData = generateLatestVisitDetailsFromDisplay();

  // Generate the WhatsApp message for the shared medical form
  const message = generateMedicalFormWhatsAppMessage(
    patient,
    latestVisitData,
    medicationTableData,
    testsTakenCell,
    paymentStatusElement,
    resultsObtainedElement,
    followUpData,
    consumablesRow,
    sundriesRow,
    treatmentTotalRow
  );

  // Construct the WhatsApp URL with the patient's number and message
  const whatsappURL = `https://wa.me/${patientPhoneNumber}?text=${encodeURIComponent(message)}`;

  // Open WhatsApp in a new tab or window
  window.open(whatsappURL, '_blank');
});

// Append the WhatsApp medical form share button to the record element
recordElement.appendChild(whatsappMedicalFormButton);

function generateMedicalFormWhatsAppMessage(patient, latestVisitData, medicationTableData, testsTakenElement, paymentStatusElement, resultsObtainedElement, followUpData, consumablesRow, sundriesRow, treatmentTotalRow) {
  // Customize the message content here based on the patient's information, latest visit data, medication details, and the new details

  const patientName = patient.name; // Replace with the actual patient's name
  const latestVisitDetails = generateLatestVisitDetailsFromDisplay(latestVisitData);
  const medicationDetails = generateMedicationDetails(medicationTableData);

  const testsTaken = `Services Offered: ${testsTakenElement.textContent}`;
  const paymentStatus = `Service Payment: ${paymentStatusElement.textContent}`;
  const resultsObtained = `Test Results Status: ${resultsObtainedElement.textContent}`;
  const followUp = `Follow Up Date & Time: ${followUpData.textContent}`;
  const consumablesPrice = `Consumables Price (UGX): ${consumablesRow.lastChild.textContent}`;
  const sundriesPrice = `Sundries Price (UGX): ${sundriesRow.lastChild.textContent}`;
  const treatmentTotal = `Treatment Total (UGX): ${treatmentTotalRow.lastChild.textContent}`;

  // Create the message text
  const message = `Hello ${patientName},\n\nMedical Form Details:\n${latestVisitDetails}\n\nMedication Details:\n${medicationDetails}\n\nAdditional Details:\n${testsTaken}\n${paymentStatus}\n${resultsObtained}\n${followUp}\n${consumablesPrice}\n${sundriesPrice}\n${treatmentTotal}\n\nThank you for choosing our healthcare services. If you have any questions or need further assistance, please feel free to contact us.`;

  return message;
}





function generateLatestVisitDetails(latestVisitData) {
  if (latestVisitData) {
    // Customize this based on the fields you want to include
    const date = formatDate(latestVisitData.timestamp);
    const clinicianName = latestVisitData.clinicianName || 'N/D';
    const temperature = latestVisitData.temperature || 'N/D';
    const bp = latestVisitData.bp || 'N/D';
    // Add more fields as needed

    return `Date: ${date}\nClinician's Name: ${clinicianName}\nTemperature: ${temperature}\nBP: ${bp}\n`;
  } else {
    return 'Latest visit data not available.';
  }
}


function generateMedicationDetails(medicationTableData) {
  if (medicationTableData.length > 0) {
    // Customize this based on the medication details format
    const details = medicationTableData.map((medication) => {
      const medicationName = medication.medication;
      const prescription = medication.prescription;
      const grams = medication.grams;
      return `${medicationName}: Prescription - ${prescription}, Milligrams - ${grams}`;
    });

    return details.join('\n');
  } else {
    return 'No medication details available.';
  }
}


function generateLatestVisitDetailsFromDisplay() {
  const visitDetailsContainer = document.querySelector('.visit-details-container');
  const date = visitDetailsContainer.querySelector("p:nth-child(1)").textContent;
  const clinicianName = visitDetailsContainer.querySelector("p:nth-child(2)").textContent;
  const temperature = visitDetailsContainer.querySelector("p:nth-child(3)").textContent;
  const bp = visitDetailsContainer.querySelector("p:nth-child(4)").textContent;
  const rr = visitDetailsContainer.querySelector("p:nth-child(5)").textContent;
  const hr = visitDetailsContainer.querySelector("p:nth-child(6)").textContent;
  const sp02 = visitDetailsContainer.querySelector("p:nth-child(7)").textContent;
  const wt = visitDetailsContainer.querySelector("p:nth-child(8)").textContent;
  const ht = visitDetailsContainer.querySelector("p:nth-child(9)").textContent;
  const bmi = visitDetailsContainer.querySelector("p:nth-child(10)").textContent;
  const muac = visitDetailsContainer.querySelector("p:nth-child(11)").textContent;
  const weightForAgeZScore = visitDetailsContainer.querySelector("p:nth-child(12)").textContent;
  const disability = visitDetailsContainer.querySelector("p:nth-child(13)").textContent;
  const chronicIllness = visitDetailsContainer.querySelector("p:nth-child(14)").textContent;
  const drugAbuse = visitDetailsContainer.querySelector("p:nth-child(15)").textContent;
  const allergies = visitDetailsContainer.querySelector("p:nth-child(16)").textContent;

  // Return all the extracted details
  return `${date}\n${clinicianName}\n${temperature}\n${bp}\n${rr}\n${hr}\n${sp02}\n${wt}\n${ht}\n${bmi}\n${muac}\n${weightForAgeZScore}\n${disability}\n${chronicIllness}\n${drugAbuse}\n${allergies}`;
}


function getPatientCBCGroup(patient) {

    if (!patient || !patient.dob) {
        return "general";
    }

    const parts = String(patient.dob).split("-");

    if (parts.length !== 3) {
        return "general";
    }

    const birthDate = new Date(
        Number(parts[0]),
        Number(parts[1]) - 1,
        Number(parts[2])
    );

    if (Number.isNaN(birthDate.getTime())) {
        return "general";
    }

    const today = new Date();

    // Exact age in days — needed for neonates
    const ageMilliseconds =
        today.getTime() - birthDate.getTime();

    const ageDays =
        Math.floor(
            ageMilliseconds / (1000 * 60 * 60 * 24)
        );

    let ageYears =
        today.getFullYear() -
        birthDate.getFullYear();

    const monthDiff =
        today.getMonth() -
        birthDate.getMonth();

    if (
        monthDiff < 0 ||
        (
            monthDiff === 0 &&
            today.getDate() < birthDate.getDate()
        )
    ) {
        ageYears--;
    }

    const sex =
        String(patient.sex || "")
            .trim()
            .toLowerCase();

    let group = "general";


    // Neonate: first 28 days of life
    if (ageDays >= 0 && ageDays < 28) {

        group = "neonate";

    }

    // Under 18 -> BC-2800 Child group
    else if (ageYears >= 0 && ageYears < 18) {

        group = "child";

    }

    else if (
        sex === "male" ||
        sex === "m" ||
        sex === "man"
    ) {

        group = "adult_male";

    }

    else if (
        sex === "female" ||
        sex === "f" ||
        sex === "woman"
    ) {

        group = "adult_female";

    }


    console.log("🧍 BC-2800 REFERENCE GROUP:", {
        dob: patient.dob,
        sex: patient.sex,
        ageDays,
        ageYears,
        selectedGroup: group
    });


    return group;
}
function getCBCConfigKey(parameter) {

    const key = String(parameter || '')
        .trim()
        .toUpperCase();

    const map = {
        'WBC': 'WBC',

        'LYM #': 'LymphAbs',
        'LYM#': 'LymphAbs',
        'LYMPH #': 'LymphAbs',
        'LYMPH#': 'LymphAbs',

        'MID #': 'MidAbs',
        'MID#': 'MidAbs',

        'GRAN #': 'GranAbs',
        'GRAN#': 'GranAbs',

        'LYM %': 'LymphPct',
        'LYM%': 'LymphPct',
        'LYMPH %': 'LymphPct',
        'LYMPH%': 'LymphPct',

        'MID %': 'MidPct',
        'MID%': 'MidPct',

        'GRAN %': 'GranPct',
        'GRAN%': 'GranPct',

        'RBC': 'RBC',
        'HGB': 'HGB',
        'HCT': 'HCT',
        'MCV': 'MCV',
        'MCH': 'MCH',
        'MCHC': 'MCHC',

        'RDW-CV': 'RDW_CV',
        'RDW CV': 'RDW_CV',

        'RDW-SD': 'RDW_SD',
        'RDW SD': 'RDW_SD',

        'PLT': 'PLT',
        'MPV': 'MPV',
        'PDW': 'PDW',
        'PCT': 'PCT'
    };

    return map[key] || parameter;
}
function getCBCReference(parameter, patient) {

    const config = CBC_REFERENCE_CONFIG[parameter];

    if (!config || !Array.isArray(config.ranges)) {
        return null;
    }

    const group = getPatientCBCGroup(patient);

    console.log("🧍 CBC RANGE GROUP:", {
        dob: patient?.dob,
        sex: patient?.sex,
        age: getPatientAge(patient?.dob),
        group
    });

    return config.ranges.find(
        range => range.group === group
    ) || null;
}
const CBC_REFERENCE_CONFIG = {

    WBC: {
        label: "WBC",
        unit: "10⁹/L",
        ranges: [
            { group: "general", low: 4.0, high: 10.0 },
            { group: "adult_male", low: 4.0, high: 10.0 },
            { group: "adult_female", low: 4.0, high: 10.0 },
            { group: "child", low: 5.0, high: 12.0 },
            { group: "neonate", low: 15.0, high: 20.0 }
        ]
    },

    LymphAbs: {
        label: "LYM #",
        unit: "10⁹/L",
        ranges: [
            { group: "general", low: 0.8, high: 4.0 },
            { group: "adult_male", low: 0.8, high: 4.0 },
            { group: "adult_female", low: 0.8, high: 4.0 },
            { group: "child", low: 0.8, high: 4.0 },
            { group: "neonate", low: 3.0, high: 12.0 }
        ]
    },

    MidAbs: {
        label: "MID #",
        unit: "10⁹/L",
        ranges: [
            { group: "general", low: 0.1, high: 1.2 },
            { group: "adult_male", low: 0.1, high: 1.2 },
            { group: "adult_female", low: 0.1, high: 1.2 },
            { group: "child", low: 0.1, high: 1.2 }
        ]
    },

    GranAbs: {
        label: "GRAN #",
        unit: "10⁹/L",
        ranges: [
            { group: "general", low: 2.0, high: 7.0 },
            { group: "adult_male", low: 2.0, high: 7.0 },
            { group: "adult_female", low: 2.0, high: 7.0 },
            { group: "child", low: 2.0, high: 7.0 }
        ]
    },

    LymphPct: {
        label: "LYM %",
        unit: "%",
        ranges: [
            { group: "general", low: 20.0, high: 40.0 },
            { group: "adult_male", low: 20.0, high: 40.0 },
            { group: "adult_female", low: 20.0, high: 40.0 },
            { group: "child", low: 20.0, high: 40.0 }
        ]
    },

    MidPct: {
        label: "MID %",
        unit: "%",
        ranges: [
            { group: "general", low: 3.0, high: 14.0 },
            { group: "adult_male", low: 3.0, high: 14.0 },
            { group: "adult_female", low: 3.0, high: 14.0 },
            { group: "child", low: 3.0, high: 14.0 }
        ]
    },

    GranPct: {
        label: "GRAN %",
        unit: "%",
        ranges: [
            { group: "general", low: 50.0, high: 70.0 },
            { group: "adult_male", low: 50.0, high: 70.0 },
            { group: "adult_female", low: 50.0, high: 70.0 },
            { group: "child", low: 50.0, high: 70.0 }
        ]
    },

    HGB: {
        label: "HGB",
        unit: "g/dL",
        ranges: [
            { group: "general", low: 11.0, high: 16.0 },
            { group: "adult_male", low: 12.0, high: 16.0 },
            { group: "adult_female", low: 11.0, high: 15.0 },
            { group: "child", low: 12.0, high: 15.5 },
            { group: "neonate", low: 17.0, high: 20.0 }
        ]
    },

    RBC: {
        label: "RBC",
        unit: "10¹²/L",
        ranges: [
            { group: "general", low: 3.50, high: 5.50 },
            { group: "adult_male", low: 4.00, high: 5.50 },
            { group: "adult_female", low: 3.50, high: 5.00 },
            { group: "child", low: 4.00, high: 5.20 },
            { group: "neonate", low: 6.00, high: 7.00 }
        ]
    },

    HCT: {
        label: "HCT",
        unit: "%",
        ranges: [
            { group: "general", low: 37.0, high: 50.0 },
            { group: "adult_male", low: 40.0, high: 50.0 },
            { group: "adult_female", low: 37.0, high: 48.0 },
            { group: "child", low: 35.0, high: 49.0 }
        ]
    },

    MCV: {
        label: "MCV",
        unit: "fL",
        ranges: [
            { group: "general", low: 82.0, high: 95.0 },
            { group: "adult_male", low: 82.0, high: 95.0 },
            { group: "adult_female", low: 82.0, high: 95.0 },
            { group: "child", low: 82.0, high: 95.0 }
        ]
    },

    MCH: {
        label: "MCH",
        unit: "pg",
        ranges: [
            { group: "general", low: 27.0, high: 31.0 },
            { group: "adult_male", low: 27.0, high: 31.0 },
            { group: "adult_female", low: 27.0, high: 31.0 },
            { group: "child", low: 27.0, high: 31.0 }
        ]
    },

    MCHC: {
        label: "MCHC",
        unit: "g/dL",
        ranges: [
            { group: "general", low: 32.0, high: 36.0 },
            { group: "adult_male", low: 32.0, high: 36.0 },
            { group: "adult_female", low: 32.0, high: 36.0 },
            { group: "child", low: 32.0, high: 36.0 }
        ]
    },

    RDW_CV: {
        label: "RDW-CV",
        unit: "%",
        ranges: [
            { group: "general", low: 11.5, high: 14.5 },
            { group: "adult_male", low: 11.5, high: 14.5 },
            { group: "adult_female", low: 11.5, high: 14.5 },
            { group: "child", low: 11.5, high: 14.5 }
        ]
    },

    RDW_SD: {
        label: "RDW-SD",
        unit: "fL",
        ranges: [
            { group: "general", low: 35.0, high: 56.0 },
            { group: "adult_male", low: 35.0, high: 56.0 },
            { group: "adult_female", low: 35.0, high: 56.0 },
            { group: "child", low: 35.0, high: 56.0 }
        ]
    },

    PLT: {
        label: "PLT",
        unit: "10⁹/L",
        ranges: [
            { group: "general", low: 100, high: 300 },
            { group: "adult_male", low: 100, high: 300 },
            { group: "adult_female", low: 100, high: 300 },
            { group: "child", low: 100, high: 300 },
            { group: "neonate", low: 100, high: 300 }
        ]
    },

    MPV: {
        label: "MPV",
        unit: "fL",
        ranges: [
            { group: "general", low: 7.0, high: 11.0 },
            { group: "adult_male", low: 7.0, high: 11.0 },
            { group: "adult_female", low: 7.0, high: 11.0 },
            { group: "child", low: 7.0, high: 11.0 }
        ]
    },

    PDW: {
        label: "PDW",
        unit: "fL",
        ranges: [
            { group: "general", low: 15.0, high: 17.0 },
            { group: "adult_male", low: 15.0, high: 17.0 },
            { group: "adult_female", low: 15.0, high: 17.0 },
            { group: "child", low: 15.0, high: 17.0 }
        ]
    },

    PCT: {
        label: "PCT",
        unit: "%",
        ranges: [
            { group: "general", low: 0.108, high: 0.282 },
            { group: "adult_male", low: 0.108, high: 0.282 },
            { group: "adult_female", low: 0.108, high: 0.282 },
            { group: "child", low: 0.108, high: 0.282 }
        ]
    }
};
function getPatientAge(dob) {
    if (!dob) return null;

    const [year, month, day] = dob.split("-").map(Number);
    const birthDate = new Date(year, month - 1, day);
    const today = new Date();

    let age = today.getFullYear() - birthDate.getFullYear();

    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
        monthDiff < 0 ||
        (
            monthDiff === 0 &&
            today.getDate() < birthDate.getDate()
        )
    ) {
        age--;
    }

    return age;
}
function getCBCReferenceRange(reference) {

    if (!reference) {
        return "-";
    }

    const hasLow =
        reference.low !== null &&
        reference.low !== undefined &&
        reference.low !== "";

    const hasHigh =
        reference.high !== null &&
        reference.high !== undefined &&
        reference.high !== "";

    if (hasLow && hasHigh) {
        return `${reference.low} - ${reference.high}`;
    }

    if (hasLow) {
        return `≥ ${reference.low}`;
    }

    if (hasHigh) {
        return `≤ ${reference.high}`;
    }

    return "-";
}
function getCBCFlag(value, reference) {

    if (!reference) {
        return "";
    }


    const result =
        Number(value);


    if (!Number.isFinite(result)) {
        return "";
    }


    const hasLow =
        reference.low !== null &&
        reference.low !== undefined &&
        reference.low !== "";


    const hasHigh =
        reference.high !== null &&
        reference.high !== undefined &&
        reference.high !== "";


    // Prevent null becoming Number(null) = 0

    if (hasLow) {

        const low =
            Number(reference.low);


        if (
            Number.isFinite(low) &&
            result < low
        ) {

            return "L";
        }

    }


    if (hasHigh) {

        const high =
            Number(reference.high);


        if (
            Number.isFinite(high) &&
            result > high
        ) {

            return "H";
        }

    }


    return "";
}

async function printRecord(patient, record, recordKey, visitDetails, latestVisitData) {
  window.jsPDF = window.jspdf.jsPDF;
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 15;
  let cursorY = margin;

  const lineHeight = 5;
  const bodyFontSize = 9;
  const headingFontSize = 11;

  // ---------------- Watermark ----------------
  doc.setGState(new doc.GState({ opacity: 0.05 }));
  const watermarkSize = 100;
  doc.addImage('sanyu.png', 'PNG', (pageWidth - watermarkSize) / 2, (pageHeight - watermarkSize) / 2, watermarkSize, watermarkSize);
  doc.setGState(new doc.GState({ opacity: 1 }));

// ---------------- Header ----------------

cursorY -= 8;

doc.addImage(
  'sanyu.png',
  'PNG',
  margin,
  cursorY - 6,
  40,
  40
);


// ==========================================
// MAIN HOSPITAL TITLE - EXTRA THICK
// ==========================================

doc.setFont('helvetica', 'bold');
doc.setFontSize(20);
doc.setTextColor(0, 100, 0);

const titleX = pageWidth / 2 + 10;
const titleY = cursorY + 10;

// Draw multiple times with tiny offsets
// to create an extra-heavy bold appearance
doc.text(
  'SANYU HOSPITAL',
  titleX,
  titleY,
  { align: 'center' }
);

doc.text(
  'SANYU HOSPITAL',
  titleX + 0.15,
  titleY,
  { align: 'center' }
);

doc.text(
  'SANYU HOSPITAL',
  titleX - 0.15,
  titleY,
  { align: 'center' }
);

doc.text(
  'SANYU HOSPITAL',
  titleX,
  titleY + 0.12,
  { align: 'center' }
);


cursorY += 13;


// ==========================================
// LOCATION - BOLD
// ==========================================

doc.setFont('helvetica', 'bold');
doc.setFontSize(13);
doc.setTextColor(0, 0, 0);

doc.text(
  'Located at Katooke-Wakiso District',
  pageWidth / 2 + 10,
  cursorY + 6,
  { align: 'center' }
);


cursorY += 7;


// ==========================================
// CONTACT DETAILS - BOLD
// ==========================================

doc.setFont('helvetica', 'bold');
doc.setFontSize(13);
doc.setTextColor(0, 0, 0);

doc.text(
  'Tel: +256 708 657 717 | Email: sanyuhospital@gmail.com',
  pageWidth / 2 + 10,
  cursorY + 6,
  { align: 'center' }
);


cursorY += 15;
// ---------------- Outer Box ----------------

// Small space between the box and paper edge
const boxMargin = 6;

const boxX = boxMargin;

// Keep the current top position
const boxY = cursorY;

// Extend box almost to both left and right paper edges
const boxWidth = pageWidth - (boxMargin * 2);

// Extend box almost to bottom paper edge
const boxHeight = pageHeight - boxY - boxMargin;

doc.setDrawColor(0, 100, 0);
doc.setLineWidth(0.8);

doc.rect(
  boxX,
  boxY,
  boxWidth,
  boxHeight
);
  // Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(headingFontSize);
  doc.text('Doctor Notes', boxX + boxWidth / 2, boxY + 10, { align: 'center' });

 // ---------------- Top Section ----------------

const topY = boxY + 18;
const topHeight = 40;

const topLeftWidth = boxWidth * 0.5 - 2;
const topRightWidth = boxWidth * 0.5 - 2;


// Horizontal line below Doctor Notes title
doc.line(
  boxX,
  topY - 2,
  boxX + boxWidth,
  topY - 2
);


// Shorter vertical divider between
// Patient Info and Contact Info
doc.line(
  boxX + boxWidth / 2,
  topY,
  boxX + boxWidth / 2,
  topY + topHeight - 10
);
  // Top left: Patient Info
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(headingFontSize);
  doc.text('Patient Info', boxX + 2, topY + 6);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(bodyFontSize);

  let leftY = topY + 12;
  const topLeftInfo = [
    ['Name', patient.name],
    ['Date Of Birth', patient.dob],
    ['PI', patient.patientId],
  ];
  topLeftInfo.forEach(([k, v]) => {
    const lines = doc.splitTextToSize(`${k}: ${v}`, topLeftWidth - 4);
    lines.forEach(line => {
      doc.text(line, boxX + 2, leftY);
      leftY += lineHeight;
    });
  });

  // Top right: Contact Info
  const rightX = boxX + boxWidth / 2 + 2;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(headingFontSize);
  doc.text('Contact Info', rightX, topY + 6);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(bodyFontSize);

  let rightY = topY + 12;
const topRightInfo = [
  ['Contact', patient.parents || 'N/A'],
  ['Residence', patient.residence || 'N/A'],
  ['Record Key', recordKey || 'N/A'],  // ✅ now shows "test1"
  ['Date Taken', new Date(record.dateTaken).toLocaleString() || 'N/A'],
];

  topRightInfo.forEach(([k, v]) => {
    const lines = doc.splitTextToSize(`${k}: ${v}`, topRightWidth - 4);
    lines.forEach(line => {
      doc.text(line, rightX, rightY);
      rightY += lineHeight;
    });
  });

// ---------------- Lower Section ----------------

const sectionPadding = 6;

// Move lower section UP
const lowerY = topY + topHeight - 5;

// Automatically make it taller because it starts higher
const lowerHeight = boxY + boxHeight - lowerY - 20;

const lowerLeftWidth = boxWidth * 0.35;

const lowerRightWidth = boxWidth - lowerLeftWidth - 10;


// Vertical divider
doc.line(
  boxX + lowerLeftWidth + 5,
  lowerY,
  boxX + lowerLeftWidth + 5,
  lowerY + lowerHeight
);


// Horizontal divider
doc.line(
  boxX,
  lowerY - 3,
  boxX + boxWidth,
  lowerY - 3
);
  // ---------------- Lower left: Vitals & Investigations ----------------
  let leftStartY = lowerY + sectionPadding;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(headingFontSize);
  doc.text('Vitals & Investigations', boxX + sectionPadding, leftStartY);
  leftStartY += lineHeight;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(bodyFontSize);

  const vitals = latestVisitData || {};
  const vitalsList = [
    ['Temp', vitals.temperature, '°C'],
    ['BP', vitals.bp, 'mmHg'],
    ['RR', vitals.rr, 'breaths/min'],
    ['HR', vitals.hr, 'bpm'],
    ['SpO₂', vitals.sp02, '%'],
    ['WT', vitals.wt, 'kg'],
    ['HT', vitals.ht, 'cm'],
    ['BMI', vitals.bmi, 'kg/m²'],
    ['MUAC', vitals.muac, 'cm'],
  ];

  let hasVitals = false;
  vitalsList.forEach(([label, value, unit]) => {
    if (value !== undefined && value !== null && value !== '' && value !== 'N/D') {
      hasVitals = true;
      const displayText = `${label}: ${value} ${unit || ''}`;
      const lines = doc.splitTextToSize(displayText, lowerLeftWidth - 2 * sectionPadding);
      lines.forEach(line => {
        doc.text(line.trim(), boxX + sectionPadding, leftStartY);
        leftStartY += lineHeight;
      });
    }
  });

  if (!hasVitals) {
    doc.text('No vitals recorded.', boxX + sectionPadding, leftStartY);
  }

  if (record.investigationsTaken?.length > 0) {
    doc.setFont('helvetica', 'bold');
    const invTitle = doc.splitTextToSize('Investigations:', lowerLeftWidth - 2 * sectionPadding);
    invTitle.forEach(line => {
      doc.text(line, boxX + sectionPadding, leftStartY);
      leftStartY += lineHeight;
    });
    doc.setFont('helvetica', 'normal');
    record.investigationsTaken.forEach(inv => {
      const lines = doc.splitTextToSize(`${inv.category}: ${inv.name}`, lowerLeftWidth - 2 * sectionPadding);
      lines.forEach(line => {
        doc.text(line, boxX + sectionPadding, leftStartY);
        leftStartY += lineHeight;
      });
    });
  }

 // ============================================================
// 3️⃣ MEDICATIONS — LOWER LEFT, UNDER VITALS / INVESTIGATIONS
// ============================================================

if (
  record.results?.medication &&
  Object.keys(record.results.medication).length > 0
) {

  // Space after vitals/investigations
  leftStartY += 3;

  const medicationX =
    boxX + sectionPadding;

  const medicationWidth =
    lowerLeftWidth - (2 * sectionPadding);


  // ---------------- Heading ----------------
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);

  doc.text(
    'Medications:',
    medicationX,
    leftStartY
  );

  leftStartY += lineHeight;


  // ---------------- Get medications ----------------
  const medicationNodes =
    record.results.medication;

  const meds =
    Object.keys(medicationNodes).map(key => {

      const med =
        medicationNodes[key] || {};

      return {
        name:
          String(
            med.medication || 'N/A'
          ),

        prescription:
          String(
            med.prescription || ''
          )
      };

    });


  // ==========================================================
  // TWO COLUMNS
  // ==========================================================

  const colWidths = [
    medicationWidth * 0.42, // Medication
    medicationWidth * 0.58  // Prescription
  ];

  const rowHeight = 4;


  // ---------------- Table Header ----------------

  doc.setFillColor(235, 235, 235);

  doc.rect(
    medicationX,
    leftStartY - rowHeight + 1,
    medicationWidth,
    rowHeight,
    'F'
  );


  doc.setFont(
    'helvetica',
    'bold'
  );

  doc.setFontSize(6);


  doc.text(
    'Medication',
    medicationX + 1,
    leftStartY
  );


  doc.text(
    'Prescription',
    medicationX + colWidths[0] + 1,
    leftStartY
  );


  // Header bottom line
  doc.setDrawColor(180);

  doc.line(
    medicationX,
    leftStartY + 1,
    medicationX + medicationWidth,
    leftStartY + 1
  );


  leftStartY +=
    rowHeight + 1;


  // ==========================================================
  // MEDICATION ROWS
  // ==========================================================

  doc.setFont(
    'helvetica',
    'normal'
  );

  doc.setFontSize(7);


  meds.forEach((row, index) => {

    const y =
      leftStartY;


    // Alternate background
    if (index % 2 === 0) {

      doc.setFillColor(
        248,
        248,
        248
      );

    } else {

      doc.setFillColor(
        255,
        255,
        255
      );

    }


    doc.rect(
      medicationX,
      y - rowHeight + 1,
      medicationWidth,
      rowHeight,
      'F'
    );


    const cells = [
      row.name,
      row.prescription
    ];


    cells.forEach(
      (cellText, i) => {

        const previousWidth =
          colWidths
            .slice(0, i)
            .reduce(
              (a, b) => a + b,
              0
            );


        const x =
          medicationX +
          previousWidth;


        let text =
          String(cellText);


        const maxTextWidth =
          colWidths[i] - 2;


        // Keep text inside column
        while (
          text.length > 0 &&
          doc.getTextWidth(text) >
            maxTextWidth
        ) {

          text =
            text.slice(0, -1);

        }


        doc.text(
          text,
          x + 1,
          y
        );

      }
    );


    // Row separator
    doc.setDrawColor(180);
    doc.setLineWidth(0.2);

    doc.line(
      medicationX,
      y + 1,
      medicationX + medicationWidth,
      y + 1
    );


    leftStartY +=
      rowHeight + 1;

  });


  leftStartY += 2;


} else {

  // Optional: show no medication message under vitals
  leftStartY += 3;

  doc.setFont(
    'helvetica',
    'italic'
  );

  doc.setFontSize(6);

  doc.text(
    'No medications recorded.',
    boxX + sectionPadding,
    leftStartY
  );

  leftStartY += lineHeight;

}

// ---------------- Lower right: Examination, Medications, Results ----------------
const rightStartX = boxX + lowerLeftWidth + 10 + sectionPadding;
let rightStartY = lowerY + sectionPadding;

// 1️⃣ Examination & Notes
doc.setFont('helvetica', 'bold');
doc.setFontSize(headingFontSize);
doc.text('Examination & Notes', rightStartX, rightStartY);
rightStartY += lineHeight;

doc.setFont('helvetica', 'normal');
doc.setFontSize(bodyFontSize);

// --- Format examination for printing ---
let formattedExamination = '—';
if (record.examination && typeof record.examination === 'object') {
  const lines = [];

  for (const [key, value] of Object.entries(record.examination)) {
    if (value && value.trim() !== '') {
      const formattedKey = key
        .replace(/([A-Z])/g, ' $1') // space between words
        .replace(/\s+/g, ' ')       // clean multiple spaces
        .replace(/^./, s => s.toUpperCase()); // capitalize first letter

      // Bold and neat spacing for print layout
      lines.push(`${formattedKey}: ${value}`);
    }
  }

  formattedExamination = lines.join('\n');
} else if (typeof record.examination === 'string') {
  formattedExamination = record.examination;
}

// Adjust these for compact layout
const compactLineHeight = 4; // smaller than default 5
const subsectionSpacing = 1;  // spacing between subsections
const sectionSpacing = 2;     // spacing after main section

// --- Prepare rightDetails ---
const rightDetails = [
  ['Complaints', record.additionalNotes || record.complaints || record.results?.complaints || '—'],
  ['Examination', record.examination || record.results?.examination || '—'],
  ['Diagnosis', record.diagnosis || record.results?.additionalNotes || '—'],
];

// --- Print rightDetails compactly ---
rightDetails.forEach(([k, v]) => {
  // Bold main header
  doc.setFont('helvetica', 'bold');
  const formattedKey = k
    .replace(/([A-Z])/g, ' $1')
    .replace(/\s+/g, ' ')
    .replace(/^./, s => s.toUpperCase());
  doc.text(`${formattedKey}:`, rightStartX, rightStartY);
  rightStartY += compactLineHeight;

  // Normal font for values
  doc.setFont('helvetica', 'normal');

  if (v && typeof v === 'object') {
    // Loop through each subsection
    for (const [section, text] of Object.entries(v)) {
      if (text && text.trim() !== '') {
        const formattedSection = section
          .replace(/([A-Z])/g, ' $1')
          .replace(/\s+/g, ' ')
          .replace(/^./, s => s.toUpperCase());

        const lines = doc.splitTextToSize(`${formattedSection}: ${text}`, lowerRightWidth - 2 * sectionPadding);
        lines.forEach(line => {
          doc.text(line, rightStartX + 3, rightStartY); // slight indent
          rightStartY += compactLineHeight;
        });
        rightStartY += subsectionSpacing; // small gap between subsections
      }
    }
  } else {
    // Single string value
    const lines = doc.splitTextToSize(String(v), lowerRightWidth - 2 * sectionPadding);
    lines.forEach(line => {
      doc.text(line, rightStartX + 3, rightStartY);
      rightStartY += compactLineHeight;
    });
  }

  rightStartY += sectionSpacing; // small gap after main section
});


// ============================================================
// BC-2800 CBC RESULTS + NORMAL RANGES + SMALL HISTOGRAMS
// ============================================================

const savedInvestigations =
  record.results?.investigationsResults || {};

const savedHistograms =
  record.results?.cbcHistograms || {};


// Find the CBC test regardless of exact test-name spelling
const cbcTestName = Object.keys(savedInvestigations).find(name => {

  const n = name.toLowerCase();

  return (
    n.includes('cbc') &&
    (
      n.includes('haematology') ||
      n.includes('hematology')
    )
  );

});


if (cbcTestName) {

  const cbcResults =
    savedInvestigations[cbcTestName];

  if (
    Array.isArray(cbcResults) &&
    cbcResults.length > 0
  ) {

    // --------------------------------------------------------
    // TITLE
    // --------------------------------------------------------

    rightStartY += 3;

    doc.setFont(
      'helvetica',
      'bold'
    );

    doc.setFontSize(8);

    doc.text(
      'CBC HAEMATOLOGY',
      rightStartX,
      rightStartY
    );

    rightStartY += 4;


    // --------------------------------------------------------
    // PATIENT REFERENCE GROUP
    // --------------------------------------------------------

    const patientForCBC =
      window.currentPatient || patient || null;

    const patientGroup =
      getPatientCBCGroup(patientForCBC);

    const groupLabel = {
      adult_male: 'Adult Male',
      adult_female: 'Adult Female',
      child: 'Child',
      neonate: 'Neonate',
      general: 'General'
    }[patientGroup] || 'General';


    doc.setFont(
      'helvetica',
      'normal'
    );

    doc.setFontSize(6);

    doc.text(
      `Reference Group: ${groupLabel}`,
      rightStartX,
      rightStartY
    );

    rightStartY += 3;


    // --------------------------------------------------------
    // CBC TABLE HEADER
    // --------------------------------------------------------

    const colParameter =
      rightStartX;

    const colResult =
      rightStartX + 25;

    const colUnit =
      rightStartX + 42;

    const colRange =
      rightStartX + 59;

    const colFlag =
      rightStartX + 85;


    doc.setFont(
      'helvetica',
      'bold'
    );

    doc.setFontSize(5.5);


    doc.text(
      'Parameter',
      colParameter,
      rightStartY
    );

    doc.text(
      'Result',
      colResult,
      rightStartY
    );

    doc.text(
      'Unit',
      colUnit,
      rightStartY
    );

    doc.text(
      'Normal Range',
      colRange,
      rightStartY
    );

    doc.text(
      'Flag',
      colFlag,
      rightStartY
    );


    rightStartY += 1;


    // Header line
    doc.setLineWidth(0.2);

    doc.line(
      rightStartX,
      rightStartY,
      colFlag + 8,
      rightStartY
    );

    rightStartY += 3;


    // --------------------------------------------------------
    // PRINT EACH CBC RESULT
    // --------------------------------------------------------

    doc.setFontSize(7);

cbcResults.forEach(result => {

  // What we want to DISPLAY on the report
  const parameter =
    result.parameter || '-';

  const value =
    result.value ?? '-';


  // ==========================================================
  // CONVERT DISPLAY NAME TO CBC_REFERENCE_CONFIG KEY
  // ==========================================================

  const configKey =
    getCBCConfigKey(parameter);


  // ==========================================================
  // GET REFERENCE RANGE
  // ==========================================================

  const reference =
    getCBCReference(
      configKey,
      patientForCBC
    );


  const normalRange =
    getCBCReferenceRange(
      reference
    );


  // ==========================================================
  // H / L FLAG
  // ==========================================================

  const flag =
    getCBCFlag(
      value,
      reference
    );


  // ==========================================================
  // UNIT
  // ==========================================================

  const config =
    CBC_REFERENCE_CONFIG[
      configKey
    ];


  const unit =
    config?.unit || '-';


  // ==========================================================
  // PRINT PARAMETER
  // ==========================================================

  doc.setFont(
    'helvetica',
    'normal'
  );

  doc.text(
    String(parameter),
    colParameter,
    rightStartY
  );


  // ==========================================================
  // PRINT RESULT
  // ==========================================================

  if (flag) {

    doc.setFont(
      'helvetica',
      'bold'
    );

  } else {

    doc.setFont(
      'helvetica',
      'normal'
    );

  }


  doc.text(
    String(value),
    colResult,
    rightStartY
  );


  // ==========================================================
  // PRINT UNIT
  // ==========================================================

  doc.setFont(
    'helvetica',
    'normal'
  );

  doc.text(
    String(unit),
    colUnit,
    rightStartY
  );


  // ==========================================================
  // PRINT NORMAL RANGE
  // ==========================================================

  doc.text(
    String(normalRange),
    colRange,
    rightStartY
  );


  // ==========================================================
  // PRINT H / L
  // ==========================================================

  if (flag) {

    doc.setFont(
      'helvetica',
      'bold'
    );

    doc.text(
      String(flag),
      colFlag,
      rightStartY
    );

  }


  rightStartY += 3;

});
    // Bottom line
    doc.setLineWidth(0.2);

    doc.line(
      rightStartX,
      rightStartY,
      colFlag + 8,
      rightStartY
    );


    rightStartY += 4;


    // ========================================================
    // PRINT SAVED BC-2800 HISTOGRAMS
    // ========================================================

    const histogramTestName =
      Object.keys(savedHistograms)
        .find(name => {

          const n =
            name.toLowerCase();

          return (
            n.includes('cbc') ||
            n.includes('haematology') ||
            n.includes('hematology')
          );

        });


    if (histogramTestName) {

      const histograms =
        savedHistograms[
          histogramTestName
        ];


      if (histograms) {

        printCBCHistograms(
          doc,
          histograms,
          rightStartX,
          rightStartY,
          28,     // graph width
          18      // graph height
        );


        rightStartY += 23;

      }

    }

  }

}





function printCBCHistograms(
  doc,
  histograms,
  startX,
  startY,
  graphWidth = 28,
  graphHeight = 18
) {

  if (!histograms) {
    return;
  }


  const graphs = [
    {
      key: 'WBC',
      title: 'WBC'
    },
    {
      key: 'RBC',
      title: 'RBC'
    },
    {
      key: 'PLT',
      title: 'PLT'
    }
  ];


  const gap = 3;


  graphs.forEach(
    (graph, graphIndex) => {

      const rawPoints =
        histograms[graph.key] ||
        histograms[
          graph.key.toLowerCase()
        ];


      if (!rawPoints) {
        return;
      }


      // Firebase may return arrays as objects
      const values =
        Array.isArray(rawPoints)

          ? rawPoints.map(Number)

          : Object.keys(rawPoints)

              .sort(
                (a, b) =>
                  Number(a) - Number(b)
              )

              .map(
                key =>
                  Number(rawPoints[key])
              );


      if (values.length === 0) {
        return;
      }


      const x =
        startX +
        graphIndex *
        (
          graphWidth +
          gap
        );


      const y =
        startY;


      // ------------------------------------------------------
      // GRAPH TITLE
      // ------------------------------------------------------

      doc.setFont(
        'helvetica',
        'bold'
      );

      doc.setFontSize(5);

      doc.text(
        graph.title,
        x + graphWidth / 2,
        y,
        {
          align: 'center'
        }
      );


      const graphTop =
        y + 2;


      // ------------------------------------------------------
      // GRAPH BORDER
      // ------------------------------------------------------

      doc.setLineWidth(0.15);

      doc.rect(
        x,
        graphTop,
        graphWidth,
        graphHeight
      );


      // ------------------------------------------------------
      // NORMALIZE DATA
      // ------------------------------------------------------

      const cleanValues =
        values.map(value => {

          return Number.isFinite(value)
            ? value
            : 0;

        });


      const maxValue =
        Math.max(
          ...cleanValues,
          1
        );


      // ------------------------------------------------------
      // DRAW HISTOGRAM CURVE
      // ------------------------------------------------------

      doc.setLineWidth(0.25);


      let previousX = null;
      let previousY = null;


      cleanValues.forEach(
        (value, index) => {

          const pointX =
            x +
            (
              index /
              Math.max(
                cleanValues.length - 1,
                1
              )
            ) *
            graphWidth;


          const pointY =
            graphTop +
            graphHeight -
            (
              value /
              maxValue
            ) *
            graphHeight;


          if (
            previousX !== null &&
            previousY !== null
          ) {

            doc.line(
              previousX,
              previousY,
              pointX,
              pointY
            );

          }


          previousX =
            pointX;

          previousY =
            pointY;

        }
      );


      // ------------------------------------------------------
      // SMALL AXIS LABELS
      // ------------------------------------------------------

      doc.setFont(
        'helvetica',
        'normal'
      );

      doc.setFontSize(3.8);


      doc.text(
        '0',
        x,
        graphTop +
          graphHeight +
          2
      );


      doc.text(
        String(
          cleanValues.length - 1
        ),
        x + graphWidth,
        graphTop +
          graphHeight +
          2,
        {
          align: 'right'
        }
      );

    }
  );

}
// ============================================================
// 2️⃣ OTHER INVESTIGATION RESULTS
// CBC IS EXCLUDED — IT HAS ITS OWN PRINT SECTION
// ============================================================

if (
  record.results?.investigationsResults &&
  Object.keys(record.results.investigationsResults).length > 0
) {

  try {

    const otherInvestigationValues = [];

    const resultEntries =
      Object.entries(
        record.results.investigationsResults
      );


    // ========================================================
    // COLLECT NON-CBC RESULTS ONLY
    // ========================================================

    for (const [testName, vals] of resultEntries) {

      if (
        !Array.isArray(vals) ||
        vals.length === 0
      ) {
        continue;
      }


      // ------------------------------------------------------
      // IDENTIFY CBC
      // ------------------------------------------------------

      const testText =
        String(testName)
          .trim()
          .toLowerCase();


      const isCBC =
        testText.includes('cbc') &&
        (
          testText.includes('haematology') ||
          testText.includes('hematology')
        );


      // CBC is printed separately with:
      // Result + Unit + Normal Range + Flag + Histograms
      if (isCBC) {

        console.log(
          "🩸 Skipping CBC from Other Results:",
          testName
        );

        continue;

      }


      // ------------------------------------------------------
      // ALL OTHER LABORATORY RESULTS
      // ------------------------------------------------------

      vals.forEach(v => {

        if (
          !v ||
          v.value === undefined ||
          v.value === null ||
          String(v.value).trim() === ''
        ) {
          return;
        }


        const parameter =
          String(
            v.parameter || ''
          ).trim();


        // If this investigation has a meaningful parameter
        if (
          parameter &&
          parameter !== 'Result' &&
          parameter !== testName
        ) {

          otherInvestigationValues.push(
            `${testName} - ${parameter}: ${v.value}`
          );

        }

        // Normal single result / radio result
        else {

          otherInvestigationValues.push(
            `${testName}: ${v.value}`
          );

        }

      });

    }


    // ========================================================
    // PRINT ONLY IF OTHER RESULTS EXIST
    // ========================================================

    if (
      otherInvestigationValues.length > 0
    ) {

      rightStartY += 4;


      // ------------------------------------------------------
      // HEADING
      // ------------------------------------------------------

      doc.setFont(
        'helvetica',
        'bold'
      );

      doc.setFontSize(7);

      doc.text(
        'Other Laboratory Results:',
        rightStartX,
        rightStartY
      );


      rightStartY += 4;


      // ------------------------------------------------------
      // RESULT BOX
      // ------------------------------------------------------

      const resultBoxX =
        rightStartX;

      const resultBoxY =
        rightStartY - 2;

      const resultBoxWidth =
        lowerRightWidth -
        2 * sectionPadding;

      const boxPadding = 3;

      const resultLineHeight = 4;


      // ------------------------------------------------------
      // PREPARE WRAPPED TEXT FIRST
      // ------------------------------------------------------

      const printableLines = [];


      otherInvestigationValues.forEach(
        result => {

          const wrapped =
            doc.splitTextToSize(
              result,
              resultBoxWidth -
              boxPadding * 2
            );


          wrapped.forEach(line => {

            printableLines.push(
              line
            );

          });

        }
      );


      // ------------------------------------------------------
      // CALCULATE BOX HEIGHT
      // ------------------------------------------------------

      const resultBoxHeight =
        (
          printableLines.length *
          resultLineHeight
        ) +
        (
          boxPadding * 2
        );


      // ------------------------------------------------------
      // DRAW BOX
      // ------------------------------------------------------

      doc.setLineWidth(0.3);

      doc.rect(
        resultBoxX,
        resultBoxY,
        resultBoxWidth,
        resultBoxHeight
      );


      // ------------------------------------------------------
      // PRINT RESULTS
      // ------------------------------------------------------

      doc.setFont(
        'helvetica',
        'normal'
      );

      doc.setFontSize(7);


      let resultY =
        resultBoxY +
        boxPadding +
        2;


      printableLines.forEach(line => {

        doc.text(
          String(line),
          resultBoxX +
          boxPadding,
          resultY
        );


        resultY +=
          resultLineHeight;

      });


      // Move next print section below box
      rightStartY =
        resultBoxY +
        resultBoxHeight +
        6;

    }

  }

  catch (err) {

    console.warn(
      "Error printing other investigation results:",
      err
    );

  }

}
// ============================================================
// PROCEDURES — LOWER LEFT
// ============================================================

if (
  record.proceduresTaken &&
  record.proceduresTaken.length > 0
) {

  leftStartY += 2;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);

  doc.text(
    'Procedures:',
    boxX + sectionPadding,
    leftStartY
  );

  leftStartY += lineHeight - 2;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);


  record.proceduresTaken.forEach(proc => {

    const text =
      `${proc.category || ''}: ${proc.name || ''}`;

    const lines =
      doc.splitTextToSize(
        text,
        lowerLeftWidth - 2 * sectionPadding
      );

    lines.forEach(line => {

      doc.text(
        line,
        boxX + sectionPadding,
        leftStartY
      );

      leftStartY += lineHeight - 2;

    });

  });

} else {

  leftStartY += 2;

  doc.setFont('helvetica', 'italic');
  doc.setFontSize(7);

  doc.text(
    'No procedures recorded.',
    boxX + sectionPadding,
    leftStartY
  );

  leftStartY += lineHeight - 2;
}


// ============================================================
// SERVICES — LOWER LEFT
// ============================================================

if (
  record.servicesTaken &&
  record.servicesTaken.length > 0
) {

  leftStartY += 2;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);

  doc.text(
    'Services:',
    boxX + sectionPadding,
    leftStartY
  );

  leftStartY += lineHeight - 2;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);


  record.servicesTaken.forEach(srv => {

    const text =
      `${srv.category || ''}: ${srv.name || ''}`;

    const lines =
      doc.splitTextToSize(
        text,
        lowerLeftWidth - 2 * sectionPadding
      );

    lines.forEach(line => {

      doc.text(
        line,
        boxX + sectionPadding,
        leftStartY
      );

      leftStartY += lineHeight - 2;

    });

  });

} else {

  leftStartY += 2;

  doc.setFont('helvetica', 'italic');
  doc.setFontSize(7);

  doc.text(
    'No services recorded.',
    boxX + sectionPadding,
    leftStartY
  );

  leftStartY += lineHeight - 2;
}

  // ---------------- Signature ----------------
  const signatureY = boxY + boxHeight - 6;
  doc.setFont('helvetica', 'bold');
  doc.text("Doctor's Signature: ____________________", boxX + 5, signatureY);

  // ---------------- Print ----------------
  doc.autoPrint();
  doc.output('dataurlnewwindow');
}



// Create a button for printing the test invoice
const printInvoiceButton = document.createElement('button');
printInvoiceButton.textContent = 'Print TI';
printInvoiceButton.classList.add('button', 'print-invoice-button');
// Create an icon element (e.g., using Font Awesome)
const invoiceIcon = document.createElement('i');
invoiceIcon.classList.add('fas', 'fa-file-invoice');

// Append the icon to the button
printInvoiceButton.appendChild(invoiceIcon);

// Add an event listener to the "Print Test Invoice" button
printInvoiceButton.addEventListener('click', () => {
  printTestInvoice(patient.name, patient.patientId, recordKey, record.testsTaken, recordKey); // Modify these arguments as needed
});

// Append the "Print Test Invoice" button to the record element
recordElement.appendChild(printInvoiceButton);
function printTestInvoice(patientName, patientId, recordKey, testName) {
  
// Inside the printTestInvoice function, pass the recordKey to generateInvoiceNumber
const invoiceNumber = generateInvoiceNumber(recordKey);

// Create the content to be printed as a test invoice, including hospital credentials
const invoiceContent = `
  <div class="invoice">
    <div class="invoice-header">
      <h2>SANYU HOSPITAL  </h2>
      <p>Katooke</p>
      <p>Wakiso District (Uganda)</p>
      <p>Phone: +256 782 477 517</p>
      <p>Email: info@keahmedicals.com</p>
    </div>
    <div class="invoice-details">
      <h1>Test Invoice</h1>
      <p><strong>Invoice Ref:</strong> ${invoiceNumber}<p>
      <p><strong>Invoice Date:</strong> ${getCurrentDate()}</p>
      <p><strong>Patient Name:</strong> ${patientName}</p>
      <p><strong>Patient ID:</strong> ${patientId}</p>
      <p><strong>Test Name:</strong> ${testName}</p>
      <p><strong>Record Key:</strong> ${recordKey}</p>
    </div>
    <div class="watermark">
      <img src="sanyu.png" alt="Watermark" class="watermark-image">
    </div>
  </div>
`;

// Create a new window for printing
const printWindow = window.open('', '', 'width=600,height=600');

// Set the content of the print window
printWindow.document.open();
printWindow.document.write(`<style>${invoiceStyles}</style>`);
printWindow.document.write(invoiceContent);
printWindow.document.close();

// Print the window
printWindow.print();
}

// Generate the invoice number as the same value as the record key
function generateInvoiceNumber(recordKey) {
  return `${recordKey}`;
}

// Get the current date in a formatted string
function getCurrentDate() {
  const currentDate = new Date();
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return currentDate.toLocaleDateString(undefined, options);
}

const invoiceStyles = `
  .invoice {
    font-family: Arial, sans-serif;
    background-color: #f9f9f9;
    border: 1px solid #ddd;
    margin: 0 auto;
    padding: 20px;
    width: 80%;
  }

  .invoice-header {
    text-align: left;
  }

  .invoice-header h2 {
    font-size: 24px;
    margin: 0;
  }

  .invoice-header p {
    font-size: 16px;
    margin: 5px 0;
  }

  .invoice-details {
    text-align: right;
  }

  .invoice-details h1 {
    font-size: 28px;
  }

  .invoice-details p {
    font-size: 18px;
    margin: 5px 0;
  }
  /* Add styles for the watermark */
.watermark {
  position: absolute;
  top: 50%; /* Position at the vertical center of the receipt */
  left: 50%; /* Position at the horizontal center of the receipt */
  transform: translate(-50%, -50%); /* Center the watermark */
  z-index: -1; /* Place it behind the receipt content */
  opacity: 0.2; /* Adjust opacity to your preference */
}

.watermark-image {
  width: 100%; /* Make the watermark cover the entire receipt */
  height: auto;
}

`;

// Select the search input field
const testSearchInput = document.getElementById('testSearch');

// Add an input event listener to the search input field
testSearchInput.addEventListener('input', () => {
  const searchTerm = testSearchInput.value.toLowerCase(); // Get the search term and convert to lowercase

  // Select all the test record elements
  const testRecordElements = document.querySelectorAll('.record');

  // Loop through the test record elements and filter based on record keys
  testRecordElements.forEach((recordElement) => {
    const recordKeyElement = recordElement.querySelector('h4'); // Assuming record keys are inside h4 elements

    if (recordKeyElement) {
      const recordKey = recordKeyElement.textContent.toLowerCase();

      if (recordKey.includes(searchTerm)) {
        // Show the test if the record key matches the search term
        recordElement.style.display = 'block';
      } else {
        // Hide the test if the record key doesn't match the search term
        recordElement.style.display = 'none';
      }
    }
  });
});
// Append the WhatsApp share button to the record element
recordElement.appendChild(whatsappShareButton);

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

const recordKeyElement = document.createElement('h4');
recordKeyElement.textContent = 'Record Key: ' + recordKey;
//recordElement.appendChild(recordKeyElement);

// Create View Results button
const viewResultsButton = document.createElement('button');
viewResultsButton.textContent = 'View Results';
viewResultsButton.classList.add('view-results-button');

// Create the icon element (using Font Awesome's "fa-eye" icon)
const iconElement = document.createElement('i');
iconElement.classList.add('fas', 'fa-eye'); 
viewResultsButton.appendChild(iconElement);

// Add event listener
viewResultsButton.addEventListener('click', async () => {
  const patientName = patient.patientId;
  const recordKey = recordKeyElement.textContent.replace('Record Key: ', '');

  // Reference the test node in Firebase
  const testRef = ref(database, `patients/${patientName}/testsTaken/${recordKey}`);

  try {
    const snapshot = await get(testRef);
    const testData = snapshot.val();

    if (testData) {
      if (testData.resultFileURL) {
        // Open the file if it exists
        window.open(testData.resultFileURL, '_blank');
      } else if (testData.results) {
        // Show results in a popup
        openResultsPopup(testData, patientName, recordKey);
      } else {
        showMessage('No results found for this test.');
      }
    } else {
      showMessage('Test data not found.');
    }
  } catch (error) {
    console.error('Error retrieving test data:', error);
    showMessage('Error retrieving test data. Please try again.');
  }
});

// Append the button
recordElement.appendChild(viewResultsButton);

async function openResultsPopup(testData, patientName, recordKey) {
  const popup = document.getElementById('viewResultsPopup');
  const container = document.getElementById('viewResultsContainer');
  const header = document.getElementById('viewResultsHeader');

  header.textContent = `${recordKey} - Results for PI- ${patientName}`;
  container.innerHTML = '';
console.log("🔥 FULL TEST DATA:", testData);
console.log("📊 RESULTS:", testData.results);
console.log(
  "📊 SAVED CBC HISTOGRAMS:",
  testData.results?.cbcHistograms
);
  async function getTestDef(testName) {
    const testKey = testName.replace(/\s+/g, '_').toLowerCase();
    const snapshot = await get(ref(database, `tests/${testKey}`));
    return snapshot.val();
  }

  function buildCBCSavedGraphs(cbcHistograms) {

  if (!cbcHistograms) {
    return null;
  }

  // cbcHistograms is saved using the test name:
  // cbcHistograms["CBC Haematology"] = { WBC, RBC, PLT }
  const testNames =
    Object.keys(cbcHistograms);

  if (testNames.length === 0) {
    return null;
  }

  const graphSection =
    document.createElement('div');

  graphSection.className =
    'cbc-saved-graphs-section';


  const heading =
    document.createElement('h4');

  heading.textContent =
    'BC-2800 Histograms';

  graphSection.appendChild(heading);


  testNames.forEach(testName => {

    const histograms =
      cbcHistograms[testName];

    if (!histograms) {
      return;
    }


    const testTitle =
      document.createElement('h5');

    testTitle.textContent =
      testName;

    graphSection.appendChild(
      testTitle
    );


    const graphsContainer =
      document.createElement('div');

    graphsContainer.className =
      'cbc-saved-graphs';


    [
      { key: 'WBC', title: 'WBC Histogram' },
      { key: 'RBC', title: 'RBC Histogram' },
      { key: 'PLT', title: 'PLT Histogram' }

    ].forEach(graph => {

      // Accept uppercase or lowercase keys
      const points =
        histograms[graph.key] ||
        histograms[graph.key.toLowerCase()];


      if (!points) {
        return;
      }


      // Firebase may return an object instead of an Array.
      const values =
        Array.isArray(points)
          ? points
          : Object.keys(points)
              .sort(
                (a, b) =>
                  Number(a) - Number(b)
              )
              .map(key =>
                Number(points[key])
              );


      if (values.length === 0) {
        return;
      }


      const graphBox =
        document.createElement('div');

      graphBox.className =
        'cbc-saved-graph-box';


      const title =
        document.createElement('div');

      title.className =
        'cbc-saved-graph-title';

      title.textContent =
        graph.title;

      graphBox.appendChild(title);


      const canvas =
        document.createElement('canvas');

      canvas.width = 320;
      canvas.height = 150;

      graphBox.appendChild(canvas);

      graphsContainer.appendChild(
        graphBox
      );


      // Draw after canvas exists
      requestAnimationFrame(() => {

        drawSavedCBCHistogram(
          canvas,
          values,
          graph.key
        );

      });

    });


    graphSection.appendChild(
      graphsContainer
    );

  });


  return graphSection;
}
function drawSavedCBCHistogram(
  canvas,
  values,
  label
) {

  if (
    !canvas ||
    !Array.isArray(values) ||
    values.length === 0
  ) {
    return;
  }


  const ctx =
    canvas.getContext('2d');


  const width =
    canvas.width;

  const height =
    canvas.height;


  // Padding
  const left = 30;
  const right = 10;
  const top = 15;
  const bottom = 25;


  const graphWidth =
    width - left - right;

  const graphHeight =
    height - top - bottom;


  // Clear
  ctx.clearRect(
    0,
    0,
    width,
    height
  );


  // White background
  ctx.fillStyle = '#ffffff';

  ctx.fillRect(
    0,
    0,
    width,
    height
  );


  // ============================================
  // AXES
  // ============================================

  ctx.strokeStyle = '#94a3b8';
  ctx.lineWidth = 1;

  ctx.beginPath();

  ctx.moveTo(left, top);

  ctx.lineTo(
    left,
    height - bottom
  );

  ctx.lineTo(
    width - right,
    height - bottom
  );

  ctx.stroke();


  // ============================================
  // FIND MAXIMUM VALUE
  // ============================================

  const numericValues =
    values.map(value => {

      const number =
        Number(value);

      return Number.isFinite(number)
        ? number
        : 0;

    });


  const maxValue =
    Math.max(
      ...numericValues,
      1
    );


  // ============================================
  // DRAW HISTOGRAM
  // ============================================

  ctx.beginPath();

  numericValues.forEach(
    (value, index) => {

      const x =
        left +
        (
          index /
          Math.max(
            numericValues.length - 1,
            1
          )
        ) *
        graphWidth;


      const y =
        top +
        graphHeight -
        (
          value /
          maxValue
        ) *
        graphHeight;


      if (index === 0) {

        ctx.moveTo(x, y);

      } else {

        ctx.lineTo(x, y);

      }

    }
  );


  // Different analyzer curves
  if (label === 'WBC') {

    ctx.strokeStyle =
      '#2563eb';

  } else if (label === 'RBC') {

    ctx.strokeStyle =
      '#dc2626';

  } else {

    ctx.strokeStyle =
      '#16a34a';

  }


  ctx.lineWidth = 1.5;

  ctx.stroke();


  // ============================================
  // LABELS
  // ============================================

  ctx.fillStyle =
    '#64748b';

  ctx.font =
    '10px Arial';


  ctx.fillText(
    '0',
    left - 3,
    height - 8
  );


  ctx.fillText(
    String(
      numericValues.length - 1
    ),
    width - 30,
    height - 8
  );


  ctx.fillText(
    String(maxValue),
    3,
    top + 5
  );

}
async function buildInvestigationSection(data) {
  if (!data || Object.keys(data).length === 0) return null;

  const sectionDiv = document.createElement('div');
  sectionDiv.classList.add('result-section');

  const titleEl = document.createElement('h4');
  titleEl.textContent = 'Investigations';
  titleEl.style.marginBottom = '6px';
  sectionDiv.appendChild(titleEl);

  // ---------------- Color guide ----------------
  const guideDiv = document.createElement('div');
  guideDiv.style.display = 'flex';
  guideDiv.style.gap = '10px';
  guideDiv.style.marginBottom = '8px';
  
  const colors = [
    { color: 'blue', text: 'Below Normal' },
    { color: 'green', text: 'Within Normal' },
    { color: 'red', text: 'Above Normal' }
  ];

  colors.forEach(c => {
    const item = document.createElement('div');
    item.style.display = 'flex';
    item.style.alignItems = 'center';
    item.style.gap = '4px';

    const colorBox = document.createElement('div');
    colorBox.style.width = '12px';
    colorBox.style.height = '12px';
    colorBox.style.backgroundColor = c.color;
    colorBox.style.border = '1px solid #000';
    item.appendChild(colorBox);

    const label = document.createElement('span');
    label.textContent = c.text;
    label.style.fontSize = '12px';
    item.appendChild(label);

    guideDiv.appendChild(item);
  });

  sectionDiv.appendChild(guideDiv);
  // ----------------------------------------------

  for (const [testName, results] of Object.entries(data)) {
    const testDiv = document.createElement('div');
    testDiv.classList.add('test-result-block');
    testDiv.style.marginBottom = '10px';

    const nameEl = document.createElement('h5');
    nameEl.textContent = isNaN(testName) ? testName : `Test ${parseInt(testName) + 1}`;
    nameEl.style.marginBottom = '4px';
    testDiv.appendChild(nameEl);

    const testDef = await getTestDef(testName);
    let paramDefs = testDef?.parameters || [];
    if (paramDefs && !Array.isArray(paramDefs)) paramDefs = Object.values(paramDefs);

    const table = document.createElement('table');
    table.classList.add('results-table');

    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    ['Parameter', 'Value', 'Normal Range', 'Unit'].forEach(text => {
      const th = document.createElement('th');
      th.textContent = text;
      headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);

    const tbody = document.createElement('tbody');

    const addRow = (parameter, value, normal, unit) => {
      const tr = document.createElement('tr');
      [parameter, value, normal, unit].forEach((val, idx) => {
        const td = document.createElement('td');
        td.textContent = val;

        // Color the value cell (index 1) based on normal range
        if (idx === 1 && normal) {
          const numericVal = parseFloat(value);
          const rangeMatch = normal.match(/([\d.]+)\s*-\s*([\d.]+)/);
          if (rangeMatch) {
            const min = parseFloat(rangeMatch[1]);
            const max = parseFloat(rangeMatch[2]);
            if (!isNaN(numericVal)) {
              if (numericVal < min) td.style.color = 'blue';
              else if (numericVal > max) td.style.color = 'red';
              else td.style.color = 'green';
            }
          } else {
            const singleVal = parseFloat(normal);
            if (!isNaN(numericVal) && !isNaN(singleVal)) {
              td.style.color = numericVal === singleVal ? 'green' : 'red';
            }
          }
        }

        tr.appendChild(td);
      });
      tbody.appendChild(tr);
    };

    if (Array.isArray(results)) {
      results.forEach(r => {
        const paramDef = paramDefs.find(p => p.name === r.parameter) || {};
        addRow(
          r.parameter || '-',
          r.value || '-',
          paramDef.normal || '-',
          paramDef.unit || '-'
        );
      });
    } else if (typeof results === 'object') {
      Object.entries(results).forEach(([paramKey, paramVal]) => {
        let parameter = paramKey;
        let value = '';
        let normal = '';
        let unit = '';

        if (typeof paramVal === 'object') {
          parameter = paramVal.parameter || paramKey;
          value = paramVal.value || '';
          const paramDef = paramDefs.find(p => p.name === parameter) || {};
          normal = paramDef.normal || '';
          unit = paramDef.unit || '';
        } else {
          value = paramVal;
        }

        addRow(parameter, value, normal, unit);
      });
    }

    table.appendChild(tbody);
    testDiv.appendChild(table);
    sectionDiv.appendChild(testDiv);
  }

  return sectionDiv;
}

  function buildSimpleSection(title, data) {
  if (!data || Object.keys(data).length === 0) return null;

  const sectionDiv = document.createElement('div');
  sectionDiv.classList.add('result-section');

  const titleEl = document.createElement('h4');
  titleEl.textContent = title;
  titleEl.style.marginBottom = '6px';
  sectionDiv.appendChild(titleEl);

  const container = document.createElement('div');
  container.style.display = 'flex';
  container.style.flexWrap = 'wrap';
  container.style.gap = '8px'; // spacing between blocks
  sectionDiv.appendChild(container);

  Object.entries(data).forEach(([key, val]) => {
    const block = document.createElement('div');
    block.style.background = '#f9f9f9';
    block.style.padding = '6px 10px';
    block.style.borderRadius = '5px';
    block.style.flex = '1 1 calc(33% - 8px)'; // 3 per row, adjust if needed
    block.style.minWidth = '120px'; // ensures small blocks don't shrink too much
    block.style.boxSizing = 'border-box';
    block.style.display = 'flex';
    block.style.flexDirection = 'column';

    const nameEl = document.createElement('strong');
    nameEl.textContent = isNaN(key) ? key : `Item ${parseInt(key) + 1}`;
    nameEl.style.marginBottom = '2px';
    block.appendChild(nameEl);

    const valueEl = document.createElement('span');
    valueEl.textContent = typeof val === 'object' ? (val.value || '-') : val;
    valueEl.style.fontSize = '13px';
    block.appendChild(valueEl);

    container.appendChild(block);
  });

  return sectionDiv;
}

// ============================================
// INVESTIGATION RESULTS
// ============================================

const investigationSection =
  await buildInvestigationSection(
    testData.results?.investigationsResults
  );

if (investigationSection) {
  container.appendChild(
    investigationSection
  );
}


// ============================================
// SAVED BC-2800 HISTOGRAMS
// ============================================

const cbcGraphs =
  buildCBCSavedGraphs(
    testData.results?.cbcHistograms
  );

if (cbcGraphs) {
  container.appendChild(
    cbcGraphs
  );
}  const proceduresSection = buildSimpleSection('Procedures', testData.results?.proceduresResults);
  const servicesSection = buildSimpleSection('Services', testData.results?.servicesResults);

  [investigationSection, proceduresSection, servicesSection].forEach(sec => {
    if (sec) container.appendChild(sec);
  });

  if (!investigationSection && !proceduresSection && !servicesSection) {
    const p = document.createElement('p');
    p.textContent = 'No results available for this record.';
    container.appendChild(p);
  }

  popup.style.display = 'flex';
  const closeBtn = popup.querySelector('.close-popup-button');
  closeBtn.onclick = () => { popup.style.display = 'none'; };
}



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

// Automatically generate the barcode when the patient details are displayed
//generateBarcode();

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

const labResultShownMessages = new Set(); // Set to keep track of shown lab result messages

// Function to play a lab result notification sound without displaying a message
function playLabResultNotificationSound() {
  // Play a sound (replace 'lab-notification.mp3' with your desired sound file)
  const audio = new Audio('');
  audio.play();
}

// Function to display a lab result browser notification and play a sound
function showLabResultNotification(message, messageId) {
  if (!labResultShownMessages.has(messageId)) {
    // Play the lab result notification sound
    playLabResultNotificationSound();

    // Add the message ID to the set of shown lab result messages
    labResultShownMessages.add(messageId);
  }
}

// Array to cache lab result messages
const labResultMessagesCache = [];


// Function to retrieve and display lab requests from Firebase
function retrieveAndDisplayLabRequests() {
  const labRequestsList = document.getElementById('labRequestsList');
  labRequestsList.innerHTML = ''; // Clear previous lab requests

  const chatRef = ref(database, 'lab-results');
  onValue(chatRef, (snapshot) => {
    try {
      if (snapshot.exists()) {
        let notDoneCount = 0;
        const messages = [];

        // Initialize variables to track latest message
        let latestLabRequestMessage = null;
        let latestLabRequestTimestamp = null;

        snapshot.forEach((childSnapshot) => {
          const messageId = childSnapshot.key;
          const labRequest = childSnapshot.val().message;
          const status = childSnapshot.val().status || 'Not Yet Done';
          const timestamp = childSnapshot.val().timestamp || '';

          // Check if the timestamp matches the current time
          const currentTime = new Date();
          const messageTime = new Date(timestamp);

          if (messageTime.getTime() === currentTime.getTime()) {
            // Show a notification for the current time lab request message
            showLabResultNotification(labRequest, messageId);
          }

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
            // Update the latest lab request message and timestamp
            if (!latestLabRequestTimestamp || messageTime > latestLabRequestTimestamp) {
              latestLabRequestMessage = labRequest;
              latestLabRequestTimestamp = messageTime;
            }
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
          showLabResultNotification(latestLabRequestMessage);
        }

        // Display the count of not yet done messages
        const notDoneCountSpan = document.getElementById('notDoneCount');
        notDoneCountSpan.textContent = notDoneCount;
      } else {
        const noLabRequestsItem = document.createElement('li');
        noLabRequestsItem.textContent = 'No lab results found.';
        labRequestsList.appendChild(noLabRequestsItem);
      }
    } catch (error) {
      console.error('Error retrieving lab results:', error);
      showMessage('Error retrieving lab results:', error);
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
  const messageRef = ref(database, `lab-results/${messageId}`);
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
// JavaScript code to set the current date in the popup
const currentDateElement = document.getElementById('currentDate');
if (currentDateElement) {
    const currentDate = new Date();
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    currentDateElement.textContent = currentDate.toLocaleDateString(undefined, options);
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

// Array to store timestamps of all messages retrieved
let messageTimestamps = [];

// Get the last opened timestamp from local storage
const lastOpenedTimestamp = localStorage.getItem('lastOpenedTimestamp');

const updateUnreadMessageCount = () => {
  const unreadMessageCount = messageTimestamps.filter(timestamp => timestamp > lastOpenedTimestamp).length;
  const spanCount = document.getElementById('unreadMessageCount');
  spanCount.textContent = unreadMessageCount.toString();
};

let lastSeenTimestamp = 0;

// Listen for new messages
onValue(messagesRef, (snapshot) => {
  if (snapshot.exists()) {
    snapshot.forEach((childSnapshot) => {
      const messageId = childSnapshot.key;
      const message = childSnapshot.val();

      // Store the timestamp of the message
      messageTimestamps.push(message.timestamp);

      // Display the message only if it's not already displayed
      if (!displayedMessageIds.includes(messageId)) {
        displayChatMessage(message);
        playMessageSound(message.sender);
        displayedMessageIds.push(messageId);
      }
    });

    // Update unread message count after processing all new messages
    updateUnreadMessageCount();
  }
});

const openChatBtn = document.getElementById('openChatBtn');

// Event listener for opening the chat room button
openChatBtn.addEventListener('click', () => {
  // Reset span count to 0
  const spanCount = document.getElementById('unreadMessageCount');
  spanCount.textContent = '0';

  // Register the time and date when the chat room is opened
  const lastOpenedTimestamp = new Date().toISOString();
  localStorage.setItem('lastOpenedTimestamp', lastOpenedTimestamp);

  // Display chat room
  chatOverlay.style.display = 'block';
  chatContainer.style.display = 'block';
});


// Rest of your code...





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
// Request permission for notifications when the page loads
document.addEventListener('DOMContentLoaded', (event) => {
  if (Notification.permission !== 'granted') {
    Notification.requestPermission();
  }
});

// Assuming currentPageSender is defined elsewhere in your code
 const currentPageSender = 'Cashier'; // Example

// Function to parse timestamp in the format "6/13/2024 6:53 PM"
function parseTimestamp(timestampStr) {
  return new Date(Date.parse(timestampStr));
}

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

    // Append tick icon for read status
    const tickIcon = document.createElement('i');
    tickIcon.classList.add('tick-icon', 'fas', 'fa-check'); // Assuming you're using Font Awesome for the tick icon
    if (message.read) {
      tickIcon.classList.add('read'); // Add 'read' class if message is read
    }
    //headerDiv.appendChild(tickIcon);

    messageDiv.appendChild(headerDiv);

    // Display message text
    const messageTextSpan = document.createElement('span');
    messageTextSpan.textContent = message.text;
    messageDiv.appendChild(messageTextSpan);

    // Display timestamp in 6:00 pm format
    const timestampSpan = document.createElement('span');
    const timestamp = parseTimestamp(message.timestamp);
    const formattedDate = `${timestamp.toLocaleDateString()} `;
    const formattedTime = `${timestamp.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}`;
    timestampSpan.textContent = `${formattedDate}${formattedTime}`;
    timestampSpan.style.fontSize = '9px'; // Set font size for the timestamp
    timestampSpan.style.color = '#888'; // Set color for the timestamp
    messageDiv.appendChild(timestampSpan);

    // Add different classes based on the sender
    if (message.sender === 'Cashier') {
      messageDiv.classList.add('patients-reception');
    } else {
      messageDiv.classList.add('other-sender');
    }

    chatBox.appendChild(messageDiv);
    chatBox.scrollTop = chatBox.scrollHeight; // Auto-scroll to the latest message

    // Display browser notification for new message if sent now and sender is different from the current page
    const currentTime = new Date();
    const timeDifference = currentTime - timestamp;
    const timeThreshold = 5000; // 5 seconds

    if (Notification.permission === 'granted' && timeDifference <= timeThreshold && message.sender !== currentPageSender) {
      new Notification('New message from ' + message.sender, {
        body: message.text,
        icon: 'profile.webp' // Optional: add an icon to the notification
      });
    }
  }
}




// Function to play message sound and update span count
function playMessageSound(sender) {
  if (sender === 'Cashier') {
    messageSentAudio.play();
  } else {
    newMessageAudio.play();
    // Increment span count
   // const spanCount = document.getElementById('unreadMessageCount');
    //spanCount.textContent = parseInt(spanCount.textContent) + 1;
  }
}

// Array to store IDs of displayed messages


// Event listener for the Send button
sendMessageBtn.addEventListener('click', sendMessage);

// Event listener for the Enter key in the input field
messageInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    sendMessage();
  }
});

// Function to send the message
function sendMessage() {
  const messageText = messageInput.value.trim();
  if (messageText !== '') {
    const sender = 'Cashier'; // You can replace 'User' with the actual username or user ID
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




    // Ensure the DOM is fully loaded before adding event listeners
    document.addEventListener('DOMContentLoaded', function() {
      // Get a reference to the button
      const confirmPaymentBtnClone = document.getElementById('confirmPaymentBtnClone');

      // Function to handle closing of the confirmation popup
      function closeConfirmationPopup() {
        const confirmationPopupClone = document.getElementById('confirmationPopupClone');
        confirmationPopupClone.style.display = 'none';

        // Remove event listener from the confirm payment button
        //confirmPaymentBtnClone.removeEventListener('click', confirmPaymentAction2);
      }

      // Confirm payment action
      function confirmPaymentAction2(event) {
        //console.log('Button clicked'); // Debugging line
        event.preventDefault();
        document.getElementById('overlayLoader').style.display = 'flex';

        const patientIdInputClone = document.getElementById('patientIdInputClone');
        const departmentSelectClone = document.getElementById('departmentClone');
        const paymentModeSelectClone = document.getElementById('paymentModeClone');
        const consumablesInputClone = document.getElementById('consumablesClone');
        
        const totalCostClone = parseFloat(consumablesInputClone.value);
        const patientIdClone = patientIdInputClone.value;

        // Construct the sales receipt object
        const salesReceipt = {
          totalAmount: totalCostClone,
          amountTendered: totalCostClone,
          patientId: patientIdClone,
          department: departmentSelectClone.value,
          paymentMode: paymentModeSelectClone.value,
          timestamp: Date.now(),
        };

        // Upload the sales receipt to the database
        const salesReceiptsRef = ref(database, 'salesReceipts');

        push(salesReceiptsRef, salesReceipt)
          .then(async (snapshot) => {
            showMessage('Sales receipt uploaded successfully');
            closeConfirmationPopup();
        
            const now = new Date();
            const dateString = now.toISOString().split('T')[0].replace(/-/g, ''); // YYYYMMDD
        
            // Step 1: Get last receipt number from Firebase
            const counterRef = ref(database, 'receiptCounter');
            let receiptNumber = 1;
        
            try {
              const snapshot = await get(counterRef);
              if (snapshot.exists()) {
                receiptNumber = snapshot.val() + 1;
              }
        
              // Step 2: Save updated receipt number
              await set(counterRef, receiptNumber);
        
            } catch (error) {
              console.error('Error accessing receipt counter:', error);
            } 
        
            const formattedReceiptNo = `R-${dateString}-${String(receiptNumber).padStart(3, '0')}`;
        
// Step 3: Ask if the user wants to print the receipt
const shouldPrint = confirm("Payment successful. Do you want to print the receipt?");

if (shouldPrint) {
  const receiptWindow = window.open('', '_blank');
  receiptWindow.document.write(`
           <html>
  <head>
    <title>Payment Receipt</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        padding: 10px;
        background: #fff;
        margin: 0;
        color: #000; /* Ensure text is black */
      }
      .hospital-logo img {
        width: 120px;
        height: auto;
        margin: 10px auto;
        display: block; /* Center the logo */
      }
      .hospital-details {
        text-align: center;
        margin-bottom: 20px;
      }
      .hospital-details h1 {
        margin: 0;
        font-size: 28px;
        color: #000;
      }
      .hospital-details p {
        margin: 4px 0;
        font-size: 14px;
        color: #000;
      }
      .receipt {
        background: #fff;
        border: 1px solid #000;
        padding: 20px;
        max-width: 450px;
        margin: 20px auto;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      }
      .receipt h2 {
        text-align: center;
        margin-top: 0;
        font-size: 22px;
        color: #000;
      }
      .receipt p {
        margin: 10px 0;
        font-size: 15px;
        color: #000;
      }
      .receipt p strong {
        color: #000;
      }
      hr {
        margin: 15px 0;
        border: 1px solid #000;
      }
      .thank-you {
        text-align: center;
        font-size: 16px;
        color: #000;
        margin-top: 20px;
      }
      .date-time {
        text-align: center;
        font-size: 14px;
        color: #000;
        margin-top: 20px;
        padding: 10px;
        border: 1px solid #000;
        width: 200px;
        margin: 20px auto;
      }
      .date-time p {
        margin: 5px 0;
      }
    </style>
  </head>

  <body>
    <div class="hospital-logo">
      <img src="sanyu.png" alt="Hospital Logo">
    </div>

    <div class="hospital-details">
      <h1>SANYU HOSPITAL  </h1>
      <p>Address: Located at Katooke-Wakiso District</p>
      <p>Phone: +256 782 477 517</p>
      <p>Email: info@keahmedicals.com</p>
    </div>

    <div class="date-time">
      <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
      <p><strong>Time:</strong> ${new Date().toLocaleTimeString()}</p>
    </div>

    <div class="receipt">
      <h2>Payment Receipt</h2>
      <p><strong>Receipt No:</strong> ${formattedReceiptNo}</p>
      <p><strong>Patient ID / Reason:</strong> ${salesReceipt.patientId}</p>
      <p><strong>Department:</strong> ${salesReceipt.department}</p>
      <p><strong>Payment Mode:</strong> ${salesReceipt.paymentMode}</p>
      <p><strong>Total Amount:</strong> UGX ${salesReceipt.totalAmount.toFixed(2)}</p>
      <p><strong>Date:</strong> ${new Date(salesReceipt.timestamp).toLocaleString()}</p>
      <hr>
      <p class="thank-you">Thank you for your payment!</p>
    </div>

     <script>
        window.onload = function() {
          window.print();
        };
      </script>
    </body>
    </html>
  `);
  receiptWindow.document.close();
}
        
            // Reset form
            consumablesInputClone.value = '';
            patientIdInputClone.value = '';
            departmentSelectClone.value = '';
            paymentModeSelectClone.value = '';
            updateTotal();
          })
          .catch((error) => {
            showMessage('Error uploading sales receipt:', error);
          })
          .finally(() => {
            document.getElementById('overlayLoader').style.display = 'none';
          });
        
      }

      // Add event listener for button click
      confirmPaymentBtnClone.addEventListener('click', confirmPaymentAction2);
    });




document.addEventListener('DOMContentLoaded', function () {
  const callButton = document.getElementById('callButton');
  const callModal = document.getElementById('callModal');
  const closeModal = document.querySelector('.modal-content .close');
  const receptionButton = document.getElementById('receptionButton');
  const labButton = document.getElementById('labButton');
  const doctorRoomButton = document.getElementById('doctorRoomButton');

  // Audio for notification sound
  const notificationSound = new Audio('ring.mp3');

  callButton.addEventListener('click', function () {
    // Display the modal
    callModal.style.display = 'block';
  });

  closeModal.addEventListener('click', function () {
    // Hide the modal
    callModal.style.display = 'none';
  });

  window.addEventListener('click', function (event) {
    if (event.target == callModal) {
      // Hide the modal if the user clicks outside of it
      callModal.style.display = 'none';
    }
  });

  function makeCall(destination) {
    // Check if there is already a call node
    const callsRef = ref(database, 'calls');
    get(callsRef).then((snapshot) => {
      const existingCall = snapshot.val();
      if (existingCall) {
        // Update the existing call node
        update(ref(database, `calls/${Object.keys(existingCall)[0]}`), {
          status: 'calling',
          destination: destination,
          timestamp: Date.now()
        }).then(() => {
          console.log('Call node updated successfully.');
          callModal.style.display = 'none'; // Hide the modal after successful update
          playNotificationSound(); // Play notification sound
        }).catch((error) => {
          console.error('Error updating call node:', error);
        });
      } else {
        // Create a new call node if none exists
        const callNodeRef = push(callsRef);
        set(callNodeRef, {
          status: 'calling',
          destination: destination,
          timestamp: Date.now()
        }).then(() => {
          console.log('Call node created successfully.');
          callModal.style.display = 'none'; // Hide the modal after successful creation
          playNotificationSound(); // Play notification sound
        }).catch((error) => {
          console.error('Error creating call node:', error);
        });
      }
    }).catch((error) => {
      console.error('Error fetching calls:', error);
    });
  }

  receptionButton.addEventListener('click', function () {
    makeCall('Reception');
  });

  labButton.addEventListener('click', function () {
    makeCall('Lab');
  });

  doctorRoomButton.addEventListener('click', function () {
    makeCall('Doctor\'s Room');
  });

  // Function to play notification sound
  function playNotificationSound() {
    // Check if the sound is muted
    if (!notificationSound.muted) {
      // Play the notification sound
      notificationSound.play().catch((error) => {
        console.error('Error playing notification sound:', error);
      });
    }
  }
});



// Get elements
const addReportBtn = document.getElementById("addReportBtn");
const reportPopup = document.getElementById("reportPopup");
const closeReportPopup = document.getElementById("closeReportPopup");
const reportForm = document.getElementById("reportForm");
const reportTitleInput = document.getElementById("reportTitle");
const popupOverlay2 = document.getElementById("popupOverlay2");

// Function to format date as "Day, Month Date, Year"
const getFormattedDate = () => {
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  return new Date().toLocaleDateString('en-US', options);
};

// Show popup and overlay when Add Report button is clicked
addReportBtn.addEventListener("click", () => {
  reportPopup.style.display = "block";
  popupOverlay2.style.display = "block";

  // Automatically set report title to today's date
  reportTitleInput.value = getFormattedDate();
});

// Close popup and overlay when the Close button is clicked
closeReportPopup.addEventListener("click", () => {
  reportPopup.style.display = "none";
  popupOverlay2.style.display = "none";
});

// Close popup and overlay when clicking the overlay itself
popupOverlay2.addEventListener("click", () => {
  reportPopup.style.display = "none";
  popupOverlay2.style.display = "none";
});

// Form submission
reportForm.addEventListener("submit", (e) => {
  e.preventDefault(); // Prevent default form submission

  // Get form data
  const reportData = {
    title: reportTitleInput.value, // Date as title
    totalPatients: document.getElementById("totalPatients").value,
    totalTests: document.getElementById("totalTests").value,
    followUpAppointments: document.getElementById("followUpAppointments").value,
    description: document.getElementById("reportDescription").value || "No additional notes",
    timestamp: new Date().toISOString(),
  };

  // Save the report to Firebase
  const reportsRef = ref(database, "reports");
  push(reportsRef, reportData)
    .then(() => {
      console.log("Report saved successfully!");
      alert("Report added successfully!");
    })
    .catch((error) => {
      console.error("Error saving report:", error);
      alert("Failed to add report. Please try again.");
    });

  // Clear the form
  reportForm.reset();
  reportTitleInput.value = getFormattedDate(); // Reset title to today's date

  // Hide the popup and overlay
  reportPopup.style.display = "none";
  popupOverlay2.style.display = "none";
});
function loadSalesReceipts() {
  const receiptsRef = ref(database, 'salesReceipts');
  const tableBody = document.querySelector('#salesReceiptsTable tbody');
  
  // Select the elements where totals will be displayed
  const availableCashElement = document.querySelector('#cashTotal'); // Available Cash
  const mobileMoneyElement = document.querySelector('#mobileMoneyTotal'); // Mobile Money
  const insuranceElement = document.querySelector('#insuranceTotal'); // Insurance
  const creditCardElement = document.querySelector('#creditCardTotal'); // Credit Card
  const merchantElement = document.querySelector('#merchantTotal'); // Merchant
  const grandTotalElement = document.querySelector('#grandTotal'); // Grand Total

  // Update today's date in the title
  const today = new Date();
  const formattedDate = today.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  document.getElementById('receipt-date').textContent = ` - ${formattedDate}`;

  tableBody.innerHTML = ''; // Clear table

  // Initialize totals for each payment mode
  let cashTotal = 0;
  let mobileMoneyTotal = 0;
  let insuranceTotal = 0;
  let creditCardTotal = 0;
  let merchantTotal = 0;

  onValue(receiptsRef, (snapshot) => {
    tableBody.innerHTML = ''; // Clear on update

    // Reset totals every time data is updated
    cashTotal = 0;
    mobileMoneyTotal = 0;
    insuranceTotal = 0;
    creditCardTotal = 0;
    merchantTotal = 0;
function getCurrentShift() {
  const now = new Date();

  let shiftStart, shiftEnd, shiftName, nextShiftStart;

  // Morning shift: 08:00 AM - 06:00 PM
  const morningStart = new Date(now);
  morningStart.setHours(8, 0, 0, 0);

  const morningEnd = new Date(now);
  morningEnd.setHours(18, 0, 0, 0);

  if (now >= morningStart && now < morningEnd) {
    // Morning Shift
    shiftStart = morningStart;
    shiftEnd = morningEnd;
    shiftName = "Morning Shift";
    nextShiftStart = shiftEnd; // next shift = night
  } else {
    // Night Shift: 06:00 PM - 08:00 AM
    if (now >= morningEnd) {
      shiftStart = morningEnd;
      shiftEnd = new Date(morningStart);
      shiftEnd.setDate(shiftEnd.getDate() + 1); // next morning
    } else {
      // before morningStart → night shift started yesterday
      shiftEnd = morningStart;
      shiftStart = new Date(morningEnd);
      shiftStart.setDate(shiftStart.getDate() - 1);
    }
    shiftName = "Night Shift";
    nextShiftStart = shiftEnd; // next shift = morning
  }

  // Format date like: Thu, 28th Aug 2025
  const options = { weekday: "short", day: "numeric", month: "short", year: "numeric" };
  let dateStr = shiftStart.toLocaleDateString("en-GB", options);

  // Add ordinal suffix (st, nd, rd, th)
  const day = shiftStart.getDate();
  const suffix = (day % 10 === 1 && day !== 11) ? "st"
               : (day % 10 === 2 && day !== 12) ? "nd"
               : (day % 10 === 3 && day !== 13) ? "rd"
               : "th";
  dateStr = dateStr.replace(/\d+/, day + suffix);

  const shiftLabel = `${dateStr} - ${shiftName}`;

  return { shiftName, shiftStart, shiftEnd, shiftLabel, nextShiftStart };
}


// Show on receipt
const { shiftLabel, nextShiftStart } = getCurrentShift();
document.getElementById('receipt-date').textContent = shiftLabel;

function updateCountdown() {
  const now = new Date();
  const diff = nextShiftStart - now;

  if (diff <= 0) {
    document.getElementById('shift-countdown').textContent = "Shift change now!";
    return;
  }

  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  // Format next shift start time (hh:mm AM/PM)
  const options = { hour: "numeric", minute: "2-digit", hour12: true };
  const nextShiftTime = nextShiftStart.toLocaleTimeString("en-US", options);

  document.getElementById('shift-countdown').textContent =
    `Next shift begins in ${hours}h ${minutes}m ${seconds}s (at ${nextShiftTime})`;
}


// Run countdown every second
setInterval(updateCountdown, 1000);
updateCountdown();

    // Collect and sort receipts by timestamp descending (latest first)
    const receipts = [];
    snapshot.forEach(childSnapshot => {
      receipts.push({
        id: childSnapshot.key,
        data: childSnapshot.val()
      });
    });

// Get shift window
const { shiftStart, shiftEnd } = getCurrentShift();

// Filter receipts for the current shift
const todayReceipts = receipts.filter(({ data: receipt }) => {
  const receiptDate = new Date(receipt.timestamp);
  return receiptDate >= shiftStart && receiptDate <= shiftEnd;
});

todayReceipts.sort(
  (a, b) =>
    (Number(b.data.timestamp) || 0) -
    (Number(a.data.timestamp) || 0)
);

const totalReceipts = todayReceipts.length;


todayReceipts.forEach(({ id, data: receipt }, index) => {

  const row =
    document.createElement('tr');


  // ------------------------------------------
  // DATE
  // ------------------------------------------

  const timestamp =
    Number(receipt.timestamp) || 0;

  const formattedReceiptDate =
    timestamp
      ? new Date(timestamp).toLocaleString()
      : '';


  // ------------------------------------------
  // SAFE NUMERIC VALUES
  // ------------------------------------------

  const totalAmount =
    Number(receipt.totalAmount) || 0;

  const balance =
    Number(receipt.balance) || 0;


  // Use saved amountTendered if available.
  // Otherwise calculate it from total and balance.
  let amountTendered;

  if (
    receipt.amountTendered !== undefined &&
    receipt.amountTendered !== null &&
    receipt.amountTendered !== ''
  ) {

    amountTendered =
      Number(receipt.amountTendered) || 0;

  } else {

    amountTendered =
      (balance > 0 && balance < totalAmount)
        ? totalAmount - balance
        : totalAmount;
  }


  // ------------------------------------------
  // PAYMENT MODE TOTALS
  // ------------------------------------------

  const paymentMode =
    String(receipt.paymentMode || '')
      .trim()
      .toLowerCase();


  if (paymentMode === 'cash') {

    cashTotal += amountTendered;

  } else if (paymentMode === 'mobile money') {

    mobileMoneyTotal += amountTendered;

  } else if (paymentMode === 'insurance') {

    insuranceTotal += amountTendered;

  } else if (paymentMode === 'credit card') {

    creditCardTotal += amountTendered;

  } else if (paymentMode === 'merchant') {

    merchantTotal += amountTendered;
  }


  // ------------------------------------------
  // RECEIPT NUMBER
  // ------------------------------------------

  const receiptNumber =
    String(totalReceipts - index)
      .padStart(3, '0');


  // ------------------------------------------
  // TABLE ROW
  // ------------------------------------------

  const rowHTML = `

    <td>${receiptNumber}</td>

    <td>${receipt.patientId || ''}</td>

    <td>${receipt.department || ''}</td>

    <td>${receipt.paymentMode || ''}</td>

    <td>${receipt.testsTaken || ''}</td>

    <td>${totalAmount.toFixed(2)}</td>

    <td>${amountTendered.toFixed(2)}</td>

    <td>${balance.toFixed(2)}</td>

    <td>${formattedReceiptDate}</td>

    <td>

      <button
        class="print-btn"
        data-receipt-no="${receiptNumber}">
        Print
      </button>

      <button
        class="delete-btn"
        data-receipt-id="${id}"
        style="background-color:red; color:white;">
        🗑 Delete
      </button>

    </td>
  `;


  row.innerHTML =
    rowHTML;

  tableBody.appendChild(
    row
  );

});
  // Global variable to store last deleted receipt data
let lastDeletedReceipt = null;
let undoTimeoutId = null;

// Function to show Undo Snackbar
function showUndoSnackbar() {
  const snackbar = document.createElement('div');
  snackbar.id = 'undo-snackbar';
  snackbar.style = `
    position: fixed;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    background: #333;
    color: white;
    padding: 10px 20px;
    border-radius: 5px;
    z-index: 1000;
    display: flex;
    align-items: center;
  `;
  snackbar.textContent = 'Receipt deleted. ';
  
  const undoBtn = document.createElement('button');
  undoBtn.textContent = 'Undo';
  undoBtn.style = `
    margin-left: 10px;
    background: #4CAF50;
    border: none;
    color: white;
    padding: 5px 10px;
    cursor: pointer;
    border-radius: 3px;
  `;

  undoBtn.addEventListener('click', () => {
    if (!lastDeletedReceipt) return;
    const { id, data } = lastDeletedReceipt;

    // Restore to Firebase
    const receiptRef = ref(database, `salesReceipts/${id}`);
    set(receiptRef, data)
      .then(() => {
        alert('Receipt restored.');
        lastDeletedReceipt = null;
        clearTimeout(undoTimeoutId);
        snackbar.remove();
      })
      .catch(err => {
        alert('Failed to restore receipt.');
        console.error(err);
      });
  });

  snackbar.appendChild(undoBtn);
  document.body.appendChild(snackbar);

  // Remove snackbar after 5 seconds if no undo
  undoTimeoutId = setTimeout(() => {
    snackbar.remove();
    lastDeletedReceipt = null;
  }, 5000);
}
let isAuthenticated = false;
let authTimeoutId = null;

tableBody.addEventListener('click', function (e) {
  if (!e.target.classList.contains('delete-btn')) return;

  e.preventDefault();
  e.stopPropagation();

  const receiptId = e.target.dataset.receiptId;
  if (!receiptId) {
    alert('Receipt ID not found.');
    return;
  }

  const row = e.target.closest('tr');

  // 1. Confirm deletion first
  if (!confirm(`Are you sure you want to delete receipt #${receiptId}?`)) return;

  // 2. Then ask for password, but only if not authenticated recently
  if (!isAuthenticated) {
    const password = prompt('Enter admin password to confirm deletion:');
    if (password !== "sanyu44") {
      alert('Incorrect password. Deletion cancelled.');
      return;
    }
    isAuthenticated = true;

    // Reset auth after 5 minutes
    if (authTimeoutId) clearTimeout(authTimeoutId);
    authTimeoutId = setTimeout(() => {
      isAuthenticated = false;
    }, 300000);
  }

  // 3. Proceed with deletion
  const receiptRef = ref(database, `salesReceipts/${receiptId}`);

  get(receiptRef).then(snapshot => {
    if (!snapshot.exists()) {
      alert('Receipt not found.');
      return;
    }

    lastDeletedReceipt = {
      id: receiptId,
      data: snapshot.val()
    };

    // Fade out animation
    row.style.transition = 'opacity 0.5s ease';
    row.style.opacity = '0';

    setTimeout(() => {
      row.remove();

      remove(receiptRef).then(() => {
        console.log(`Receipt ${receiptId} deleted`);
        showUndoSnackbar();
      }).catch(err => {
        alert('Failed to delete receipt.');
        console.error(err);
      });
    }, 500);
  }).catch(err => {
    alert('Failed to retrieve receipt data.');
    console.error(err);
  });
});

    // Format the totals with commas and update the UI
    const formatNumber = (num) => {
      return new Intl.NumberFormat('en-US').format(num); // Format number with commas
    };

    // Update the totals on the dashboard
    if (availableCashElement) {
      availableCashElement.textContent = `UGX. ${formatNumber(cashTotal.toFixed(2))}`;
    }
    if (mobileMoneyElement) {
      mobileMoneyElement.textContent = `UGX. ${formatNumber(mobileMoneyTotal.toFixed(2))}`;
    }
    if (insuranceElement) {
      insuranceElement.textContent = `UGX. ${formatNumber(insuranceTotal.toFixed(2))}`;
    }
    if (creditCardElement) {
      creditCardElement.textContent = `UGX. ${formatNumber(creditCardTotal.toFixed(2))}`;
    }
    if (merchantElement) {
      merchantElement.textContent = `UGX. ${formatNumber(merchantTotal.toFixed(2))}`;
    }
    if (grandTotalElement) {
      const grandTotal = cashTotal + mobileMoneyTotal + insuranceTotal + creditCardTotal + merchantTotal;
      grandTotalElement.textContent = `UGX. ${formatNumber(grandTotal.toFixed(2))}`;
    }
 

    // Hook up print buttons
    document.querySelectorAll('.print-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const row = e.target.closest('tr');
        const receiptDetails = {
          receiptNumber: row.cells[0].textContent,
          patientId: row.cells[1].textContent,
          department: row.cells[2].textContent,
          paymentMode: row.cells[3].textContent,
          testsTaken: row.cells[4].textContent,
          totalAmount: row.cells[5].textContent,
          amountTendered: row.cells[6].textContent,
          balance: row.cells[7].textContent,
          date: row.cells[8].textContent
        };
        printReceipt(receiptDetails);
      });
    });
  });
}
loadSalesReceipts()
function printReceipt(receipt) {
  const receiptWindow = window.open('', '_blank');

  receiptWindow.document.write(`
<html>
  <head>
    <title>Payment Receipt</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        padding: 10px;
        background: #fff;
        margin: 0;
        color: #000;
      }

      .hospital-logo img {
        width: 120px;
        height: auto;
        margin: 10px auto;
        display: block;
      }

      .hospital-details {
        text-align: center;
        margin-bottom: 20px;
      }

      .hospital-details h1 {
        margin: 0;
        font-size: 28px;
        color: #000;
      }

      .hospital-details p {
        margin: 4px 0;
        font-size: 14px;
        color: #000;
      }

      .receipt {
        background: #fff;
        border: 1px solid #000;
        padding: 20px;
        max-width: 450px;
        margin: 20px auto;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      }

      .receipt h2 {
        text-align: center;
        margin-top: 0;
        font-size: 22px;
        color: #000;
      }

      .receipt p {
        margin: 10px 0;
        font-size: 15px;
        color: #000;
      }

      .receipt p strong {
        color: #000;
      }

      hr {
        margin: 15px 0;
        border: 1px solid #000;
      }

      .thank-you {
        text-align: center;
        font-size: 16px;
        color: #000;
        margin-top: 20px;
      }

      .date-time {
        text-align: center;
        font-size: 14px;
        color: #000;
        margin-top: 20px;
        padding: 10px;
        border: 1px solid #000;
        width: 200px;
        margin: 20px auto;
      }

      .date-time p {
        margin: 5px 0;
      }
    </style>
  </head>

  <body>
    <div class="hospital-logo">
      <img src="sanyu.png" alt="Hospital Logo" />
    </div>

    <div class="hospital-details">
      <h1>SANYU HOSPITAL  </h1>
      <p>Address: Located at Katooke-Wakiso District</p>
      <p>Phone: +256 782 477 517</p>
      <p>Email: info@keahmedicals.com</p>
    </div>

    <div class="date-time">
      <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
      <p><strong>Time:</strong> ${new Date().toLocaleTimeString()}</p>
    </div>

    <div class="receipt">
  <h2>Payment Receipt</h2>
  <p><strong>Receipt No:</strong> ${receipt.receiptNumber}</p>
  <p><strong>Patient ID / Reason:</strong> ${receipt.patientId}</p>
  <p><strong>Department:</strong> ${receipt.department}</p>
  <p><strong>Payment Mode:</strong> ${receipt.paymentMode}</p>
  
  <!-- Only display "Services Offered" if it's not empty -->
  ${receipt.testsTaken ? `<p><strong>Services Offered:</strong> ${receipt.testsTaken}</p>` : ''}
  
  <p><strong>Total Amount:</strong> UGX ${parseFloat(receipt.totalAmount).toFixed(2)}</p>
  <p><strong>Amount Tendered:</strong> UGX ${parseFloat(receipt.amountTendered).toFixed(2)}</p>
  <p><strong>Balance:</strong> UGX ${parseFloat(receipt.balance).toFixed(2)}</p>
  <p><strong>Issued On:</strong> ${receipt.date}</p>
  <hr />
  <p class="thank-you">Thank you for your payment!</p>
</div>


    <script>
      window.onload = function () {
        window.print();
      };
    </script>
  </body>
</html>

  `);

  receiptWindow.document.close();
}



document.getElementById('receiptSearchBar').addEventListener('input', function(e) {
  const searchTerm = e.target.value.toLowerCase();
  const tableRows = document.querySelectorAll('#salesReceiptsTable tbody tr');

  tableRows.forEach(row => {
    const receiptNoCell = row.querySelector('td:first-child');
    const receiptNo = receiptNoCell ? receiptNoCell.textContent.toLowerCase() : '';

    if (receiptNo.includes(searchTerm)) {
      row.style.display = ''; // Show the row
    } else {
      row.style.display = 'none'; // Hide the row
    }
  });
});

// Get elements
const openPopupButton = document.getElementById('openPopupButton');
const popupModal = document.getElementById('popupModal');
const closePopupButton = document.getElementById('closePopupButton');
const dateFilter = document.getElementById('dateFilter');
const receiptsTableBody = document.querySelector('#receiptsTable tbody');
const totalCashElement = document.getElementById('totalCash');
const totalMobileMoneyElement = document.getElementById('totalMobileMoney');
const totalInsuranceElement = document.getElementById('totalInsurance');
const totalCreditCardElement = document.getElementById('totalCreditCard');
const totalMerchantElement = document.getElementById('totalMerchant');  // Add element for merchant total
const grandTotalElement = document.getElementById('grandTotal2');

// Function to open popup
openPopupButton.addEventListener('click', () => {
    popupModal.style.display = 'flex'; // Show popup
});

// Function to close popup
closePopupButton.addEventListener('click', () => {
    popupModal.style.display = 'none'; // Hide popup
});

// Function to load daily receipts and total money
function loadDailySales() {
    const selectedDate = dateFilter.value;

    if (!selectedDate) {
        alert('Please select a date');
        return;
    }

    const receiptsRef = ref(database, 'salesReceipts');
    const selectedDateStart = new Date(selectedDate);
    selectedDateStart.setHours(0, 0, 0, 0);
    const selectedDateEnd = new Date(selectedDate);
    selectedDateEnd.setHours(23, 59, 59, 999);

    // Initialize totals for each payment mode
    let cashTotal = 0;
    let mobileMoneyTotal = 0;
    let insuranceTotal = 0;
    let creditCardTotal = 0;
    let merchantTotal = 0; // Add merchant total

    onValue(receiptsRef, (snapshot) => {
        receiptsTableBody.innerHTML = ''; // Clear table

        snapshot.forEach(childSnapshot => {
            const receipt = childSnapshot.val();
            const receiptDate = new Date(receipt.timestamp);

            if (receiptDate >= selectedDateStart && receiptDate <= selectedDateEnd) {
                const row = document.createElement('tr');

                const totalAmount = parseFloat(receipt.totalAmount) || 0;
                const balance = parseFloat(receipt.balance) || 0;
                let amountTendered = totalAmount - balance;

                // Add the amounts based on payment method
                if (receipt.paymentMode?.toLowerCase() === 'cash') {
                    cashTotal += amountTendered;
                } else if (receipt.paymentMode?.toLowerCase() === 'mobile money') {
                    mobileMoneyTotal += amountTendered;
                } else if (receipt.paymentMode?.toLowerCase() === 'insurance') {
                    insuranceTotal += amountTendered;
                } else if (receipt.paymentMode?.toLowerCase() === 'credit card') {
                    creditCardTotal += amountTendered;
                } else if (receipt.paymentMode?.toLowerCase() === 'merchant') { // Add merchant total handling
                    merchantTotal += amountTendered;
                }

                row.innerHTML = `
                    <td>${receipt.receiptNumber || ''}</td>
                    <td>${receipt.patientId || ''}</td>
                    <td>${receipt.department || ''}</td>
                    <td>${receipt.paymentMode || ''}</td>
                    <td>${totalAmount.toFixed(2)}</td>
                    <td>${amountTendered.toFixed(2)}</td>
                    <td>${balance.toFixed(2)}</td>
                `;
                receiptsTableBody.appendChild(row);
            }
        });

        // Calculate and display totals
        const formatNumber = (num) => new Intl.NumberFormat('en-US').format(num);

        // Update the total elements
        totalCashElement.textContent = `UGX. ${formatNumber(cashTotal.toFixed(2))}`;
        totalMobileMoneyElement.textContent = `UGX. ${formatNumber(mobileMoneyTotal.toFixed(2))}`;
        totalInsuranceElement.textContent = `UGX. ${formatNumber(insuranceTotal.toFixed(2))}`;
        totalCreditCardElement.textContent = `UGX. ${formatNumber(creditCardTotal.toFixed(2))}`;
        totalMerchantElement.textContent = `UGX. ${formatNumber(merchantTotal.toFixed(2))}`; // Update merchant total

        // Calculate and display Grand Total
        const grandTotal = cashTotal + mobileMoneyTotal + insuranceTotal + creditCardTotal + merchantTotal;
        grandTotalElement.textContent = `UGX. ${formatNumber(grandTotal.toFixed(2))}`;
    });
}

// Trigger the load function when a date is selected
dateFilter.addEventListener('change', loadDailySales);

  // ✅ UI references
  const expensePanel = document.getElementById('expensePanel');
  const screenDimmer = document.getElementById('screenDimmer');
  const launchBtn = document.getElementById('launchExpensePanel');
  const saveButton = document.getElementById('saveExpenseBtn');

  // ✅ Open panel
  launchBtn.addEventListener('click', () => {
    expensePanel.style.display = 'block';
    screenDimmer.style.display = 'block';
  });
saveButton.addEventListener('click', () => {
  const expenseNotes = document.querySelector('#expensePanel input[type="text"]').value;
  const amount = document.querySelector('#expensePanel input[type="number"]').value;
  const category = document.querySelector('#expensePanel select').value;

  if (!expenseNotes || !amount || !category) {
    alert("Please fill out all required fields.");
    return;
  }

  const today = new Date().toISOString().split("T")[0]; // e.g. 2024-06-09

  const newExpense = {
    expense: expenseNotes,
    amount: parseFloat(amount),
    category: category,
    date: today,
    timestamp: new Date().toISOString() // store as ISO string for readability
  };

  const expensesRef = ref(database, `daily_expenses/${today}`);
  const newExpenseRef = push(expensesRef); // create unique ID

  set(newExpenseRef, newExpense)
    .then(() => {
      alert("Expense saved with timestamp!");

      // Close and clear form
      expensePanel.style.display = 'none';
      screenDimmer.style.display = 'none';

      document.querySelector('#expensePanel input[type="text"]').value = '';
      document.querySelector('#expensePanel input[type="number"]').value = '';
      document.querySelector('#expensePanel select').value = '';
    })
    .catch((error) => {
      alert("Error saving data: " + error.message);
    });
});

  // ✅ Click outside to close
  screenDimmer.addEventListener('click', () => {
    expensePanel.style.display = 'none';
    screenDimmer.style.display = 'none';
  });

// Add this HTML snippet somewhere inside your #summaryPopup (e.g., top)
// HTML:
// <div id="dateFilter" style="margin-bottom: 15px;">
//   <label for="startDate">From:</label>
//   <input type="date" id="startDate" />
//   <label for="endDate">To:</label>
//   <input type="date" id="endDate" />
//   <button id="applyDateFilter">Apply Filter</button>
// </div>
const summaryBtn = document.getElementById('showPopupButton');
const summaryPopup = document.getElementById('summaryPopup');
const summaryContent = document.getElementById('summaryContent');
const summaryDimmer = document.getElementById('summaryDimmer');
const closeSummaryBtn = document.getElementById('closeSummaryBtn');
const printRangeSummaryBtn = document.getElementById('printRangeSummaryBtn');
const resetFilterBtn = document.getElementById('resetFilterBtn');
const filterError = document.getElementById('filterError');

let globalExpenseSnap = null;
let globalDailyTotals = {};
let globalSortedDates = [];
async function renderSummaries(startDate = null, endDate = null) {

  // ==========================================
  // SHOW SUMMARY LOADER
  // ==========================================

  summaryContent.innerHTML = `
    <div class="summary-loader-container">

      <div class="summary-loader">
        <div class="summary-loader-ring"></div>

        <div class="summary-loader-text">
          <strong>Loading Financial Summary</strong>
          <span>Please wait while BIBO prepares the report...</span>
        </div>
      </div>

    </div>
  `;

  const formatUGX = (value) => new Intl.NumberFormat('en-UG', {
    style: 'currency',
    currency: 'UGX',
    minimumFractionDigits: 0
  }).format(value);


  const now = new Date();

  // Helper: calculate business date (7:30AM → 7:30AM next day)
  function getBusinessDate(timestamp) {
    const d = new Date(timestamp);
    if (d.getHours() < 7 || (d.getHours() === 7 && d.getMinutes() < 30)) {
      d.setDate(d.getDate() - 1);
    }
    return d.toISOString().split("T")[0];
  }

  // --- Add sales amount to correct shift ---
  function addShiftAmount(ts, amount, dailyTotals) {
    const minutes = ts.getHours() * 60 + ts.getMinutes();
    const startDay = 7 * 60 + 30;
    const endDay = 19 * 60 + 30;

    if (minutes >= startDay && minutes < endDay) {
      dailyTotals.dayGross += amount;
    } else {
      dailyTotals.nightGross += amount;
    }
  }

  // --- Add expense to correct shift, default to Day if no timestamp ---
  function addShiftExpense(ts, amount, dailyTotals) {
    if (!ts) {
      dailyTotals.dayExpenses += amount;
      return;
    }

    const minutes = ts.getHours() * 60 + ts.getMinutes();
    const startDay = 7 * 60 + 30;
    const endDay = 19 * 60 + 30;

    if (minutes >= startDay && minutes < endDay) {
      dailyTotals.dayExpenses += amount;
    } else {
      dailyTotals.nightExpenses += amount;
    }
  }

  try {
    const dbRef = ref(database);
const [salesSnap, expenseSnap] = await Promise.all([
  get(child(dbRef, 'salesReceipts')),
  get(child(dbRef, 'daily_expenses'))
]);


// ==========================================
// DATA LOADED — REMOVE LOADER
// ==========================================

summaryContent.innerHTML = '';


globalExpenseSnap = expenseSnap;

const dailyTotals = {};

    // --- Process sales ---
    if (salesSnap.exists()) {
      const sales = salesSnap.val();
      for (const key in sales) {
        const sale = sales[key];
        const ts = new Date(sale.timestamp);

        if (ts.getTime() > now.getTime()) continue; // skip future sales

        const date = getBusinessDate(ts);

        if (!dailyTotals[date]) {
          dailyTotals[date] = {
            gross: 0, expenses: 0,
            dayGross: 0, nightGross: 0,
            dayExpenses: 0, nightExpenses: 0
          };
        }

        const amount = parseFloat(sale.amountTendered || 0);
        dailyTotals[date].gross += amount;
        addShiftAmount(ts, amount, dailyTotals[date]);
      }
    }

    // --- Process expenses ---
    if (expenseSnap.exists()) {
      const allExpenses = expenseSnap.val();
      for (const dateKey in allExpenses) {
        const entries = allExpenses[dateKey];
        for (const id in entries) {
          const item = entries[id];
          const ts = item.timestamp ? new Date(item.timestamp) : null;

          if (ts && ts.getTime() > now.getTime()) continue; // skip future expenses

          const businessDate = ts ? getBusinessDate(ts) : dateKey;

          if (!dailyTotals[businessDate]) {
            dailyTotals[businessDate] = {
              gross: 0, expenses: 0,
              dayGross: 0, nightGross: 0,
              dayExpenses: 0, nightExpenses: 0
            };
          }

          const amount = parseFloat(item.amount || 0);
          dailyTotals[businessDate].expenses += amount;
          addShiftExpense(ts, amount, dailyTotals[businessDate]);
        }
      }
    }

    const sortedDates = Object.keys(dailyTotals).sort().reverse();
    globalSortedDates = sortedDates;
    globalDailyTotals = dailyTotals;

    const filteredDates = sortedDates.filter(date => {
      if (!startDate || !endDate) return true;
      return date >= startDate && date <= endDate;
    });

    if (filteredDates.length === 0) {
      summaryContent.innerHTML = "<p>No data available for selected dates.</p>";
      return;
    }

    // --- Render each day's summary ---
    filteredDates.forEach(date => {
      const { gross, expenses, dayGross, nightGross, dayExpenses, nightExpenses } = dailyTotals[date];

      const dayNet = dayGross - dayExpenses;
      const nightNet = nightGross - nightExpenses;
      const net = gross - expenses;

      const section = document.createElement('div');
      section.innerHTML = `
        <h4>${date}</h4>
        <p><strong>Total Gross (7:30AM → 7:30AM next day):</strong> ${formatUGX(gross)}</p>

        <div class="shift-container">
          <div class="shift-box day">
            <p>🌞 <strong>Day Shift (7:30AM - 7:30PM)</strong></p>
            <ul>
              <li>Gross: ${formatUGX(dayGross)}</li>
              <li>Expenses: ${formatUGX(dayExpenses)}</li>
              <li class="${dayNet < 0 ? 'net-negative' : 'net-positive'}">Net: ${formatUGX(dayNet)}</li>
            </ul>
          </div>

          <div class="shift-box night">
            <p>🌙 <strong>Night Shift (7:30PM - 7:30AM)</strong></p>
            <ul>
              <li>Gross: ${formatUGX(nightGross)}</li>
              <li>Expenses: ${formatUGX(nightExpenses)}</li>
              <li class="${nightNet < 0 ? 'net-negative' : 'net-positive'}">Net: ${formatUGX(nightNet)}</li>
            </ul>
          </div>
        </div>

        <p><strong>Total Expenses:</strong> ${formatUGX(expenses)}</p>
        <p class="${net < 0 ? 'net-negative' : 'net-positive'}">
          <strong>Overall Net Income:</strong> ${formatUGX(net)}</p>

        <button class="toggleExpensesBtn">Show Expenses</button>
        <ul class="expenseList" style="display: none; margin-top: 10px;"></ul>
        <button class="printSummaryBtn">🖨️ Print This Day</button>
        <hr>
      `;

      summaryContent.appendChild(section);

      const toggleBtn = section.querySelector('.toggleExpensesBtn');
      const expenseList = section.querySelector('.expenseList');

      toggleBtn.addEventListener('click', () => {
        if (expenseList.style.display === 'none') {
          const entries = Object.entries(globalExpenseSnap.val()?.[date] || {});

          if (entries.length === 0) {
            expenseList.innerHTML = '<p>No expenses recorded.</p>';
          } else {
            const table = document.createElement('table');
            table.className = 'expense-table';

            table.innerHTML = `
              <thead>
                <tr>
                  <th>Expense Notes</th>
                  <th>Amount</th>
                  <th>Category</th>
                  <th>Shift</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                ${entries.map(([id, e]) => {
                  // Determine shift: default to Day if timestamp is missing
                  let shift = "🌞 Day";
                  if (e.timestamp) {
                    const ts = new Date(e.timestamp);
                    const minutes = ts.getHours() * 60 + ts.getMinutes();
                    const startDay = 7 * 60 + 30;
                    const endDay = 19 * 60 + 30;
                    shift = (minutes >= startDay && minutes < endDay) ? "🌞 Day" : "🌙 Night";
                  }

                  return `
                    <tr data-id="${id}">
                      <td>${e.expense || '-'}</td>
                      <td>${formatUGX(e.amount || 0)}</td>
                      <td>${e.category || '-'}</td>
                      <td>${shift}</td>
                      <td>
                        <button style="background-color: red; color: white; border: none; padding: 6px 10px; border-radius: 4px; cursor: pointer;" 
                                class="delete-btn" data-id="${id}">
                          🗑 Delete
                        </button>
                      </td>
                    </tr>
                  `;
                }).join('')}
              </tbody>
            `;

expenseList.innerHTML = '';
expenseList.appendChild(table);
expenseList.style.display = 'block'; // show the list

            // Define your password (ideally this should be securely managed)
const DELETE_PASSWORD = 'sanyu44';
// Attach event listeners to delete buttons
table.querySelectorAll('.delete-btn').forEach(button => {
  button.addEventListener('click', function () {
    const id = this.dataset.id;
    const row = this.closest('tr');

    if (!confirm('Are you sure you want to delete this expense?')) return;

    // Ask for password
    const password = prompt('Enter admin password to confirm deletion:');
    if (password !== DELETE_PASSWORD) {
      alert('Incorrect password. Deletion cancelled.');
      return;
    }

    // Backup the deleted data
    const expenseData = {
      ...Object(globalExpenseSnap.val()?.[date]?.[id]),
      id,
      date
    };

    // Add fade-out animation
    row.style.transition = 'opacity 0.5s ease';
    row.style.opacity = '0';

    setTimeout(() => {
      // Remove row from DOM
      row.remove();

      // Remove from Firebase
      const expenseRef = ref(database, `daily_expenses/${date}/${id}`);
      remove(expenseRef).then(() => {
        console.log(`Deleted expense with ID: ${id}`);
        renderSummaries(startDate = null, endDate = null)
        // Show Undo Snackbar
        showUndoSnackbar(expenseData);
      }).catch(err => {
        alert('Failed to delete expense.');
        console.error(err);
      });
    }, 500); // Match animation duration
  });
});


          }

          expenseList.style.display = 'block';
          toggleBtn.textContent = 'Hide Expenses';
        } else {
          expenseList.style.display = 'none';
          toggleBtn.textContent = 'Show Expenses';
        }
      });

const printBtn = section.querySelector('.printSummaryBtn');
printBtn.addEventListener('click', () => {
  const printWindow = window.open('', '_blank');

  const summaryHTML = `
<html>
<head>
  <title>Summary for ${date}</title>
  <style>
    body {
      font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
      padding: 40px;
      color: #333;
      background-color: #fff;
    }

    .header { text-align: center; margin-bottom: 40px; }
    .header img { max-height: 150px; margin-bottom: 10px; }
    .header h1 { margin: 10px 0 5px; font-size: 24px; color: #2c3e50; }
    .header p { margin: 0; font-size: 14px; color: #555; }

    h2 { color: #2c3e50; margin-bottom: 10px; font-size: 22px; border-bottom: 2px solid #eee; padding-bottom: 5px; }
    h3 { margin-top: 30px; color: #2c3e50; }

    .net-positive { color: #27ae60; font-weight: bold; }
    .net-negative { color: #c0392b; font-weight: bold; }
    .info-block p { font-size: 16px; margin: 6px 0; }
    .printed-on { font-size: 12px; color: #777; margin-bottom: 20px; }

    .expense-table { width: 100%; border-collapse: collapse; margin-top: 15px; font-size: 15px; }
    .expense-table th, .expense-table td { border: 1px solid #ccc; padding: 10px; text-align: left; }
    .expense-table th { background-color: #ecf0f1; color: #2c3e50; }
    .expense-table tr:nth-child(even) { background-color: #f9f9f9; }
    .expense-table tr:hover { background-color: #f1f1f1; }

    .shift-container { display: flex; gap: 20px; flex-wrap: wrap; margin-top: 20px; }
    .shift-box { flex: 1 1 45%; border-left: 6px solid; padding: 15px; border-radius: 8px; }
    .shift-box.day { border-color: #f1c40f; background-color: #fffdf5; color: #2c3e50; }
    .shift-box.night { border-color: #1f2a38; background-color: #1a1f2b; color: #ecf0f1; }
    .shift-box.night ul li, .shift-box.night p { color: #ecf0f1; }
  </style>
</head>
<body>
  <div class="header">
    <img src="sanyu.png" alt="Hospital Logo" />
    <h1>SANYU HOSPITAL   KATOOKE - (UGANDA)</h1>
    <p>P.O. Box 12345, Kampala, Uganda</p>
    <p>Tel: +256 708 657717 | Email: info@keahmedicals.com</p>
  </div>

  <h2>Daily Financial Summary - ${new Date(date).toLocaleDateString('en-UG', { weekday:'long', year:'numeric', month:'long', day:'numeric' })}</h2>
  <p class="printed-on">Report Generated On: ${new Date().toLocaleString('en-UG')}</p>

  <div class="info-block">
    <p><strong>Total Gross Income (7:30AM → 7:30AM next day):</strong> ${formatUGX(gross)}</p>
    <p><strong>Total Expenses:</strong> ${formatUGX(expenses)}</p>
    <p class="${net < 0 ? 'net-negative' : 'net-positive'}">
      <strong>Overall Net Income:</strong> ${formatUGX(net)}</p>
  </div>

  <h3>Shift Breakdown</h3>
  <div class="shift-container">
    <div class="shift-box day">
      <p>🌞 <strong>Day Shift (7:30AM - 7:30PM)</strong></p>
      <ul>
        <li>Gross: ${formatUGX(dayGross)}</li>
        <li>Expenses: ${formatUGX(dayExpenses)}</li>
        <li class="${dayNet < 0 ? 'net-negative' : 'net-positive'}">Net: ${formatUGX(dayNet)}</li>
      </ul>
    </div>
    <div class="shift-box night">
      <p>🌙 <strong>Night Shift (7:30PM - 7:30AM)</strong></p>
      <ul>
        <li>Gross: ${formatUGX(nightGross)}</li>
        <li>Expenses: ${formatUGX(nightExpenses)}</li>
        <li class="${nightNet < 0 ? 'net-negative' : 'net-positive'}">Net: ${formatUGX(nightNet)}</li>
      </ul>
    </div>
  </div>

  <h3>Expenses:</h3>
  <table class="expense-table">
    <thead>
      <tr>
        <th>Expense Notes</th>
        <th>Amount</th>
        <th>Category</th>
        <th>Shift</th>
      </tr>
    </thead>
    <tbody>
      ${Object.values(globalExpenseSnap.val()?.[date] || {}).map(e => {
        let shift = "-";
        if (e.timestamp) {
          const ts = new Date(e.timestamp);
          const minutes = ts.getHours() * 60 + ts.getMinutes();
          const startDay = 7 * 60 + 30;
          const endDay = 19 * 60 + 30;
          shift = (minutes >= startDay && minutes < endDay) ? "🌞 Day" : "🌙 Night";
        }
        return `
          <tr>
            <td>${e.expense}</td>
            <td>${formatUGX(e.amount)}</td>
            <td>${e.category}</td>
            <td>${shift}</td>
          </tr>
        `;
      }).join('')}
    </tbody>
  </table>
</body>
</html>
  `;

  printWindow.document.write(summaryHTML);
  printWindow.document.close();
  printWindow.print();
});
   });

  } catch (error) {
    alert("Error loading summary: " + error.message);
  }
}
function showUndoSnackbar(deletedExpense) {
  const snackbar = document.getElementById('undoSnackbar');
  const undoBtn = document.getElementById('undoBtn');
  snackbar.style.display = 'block';

  // Timeout to auto-hide snackbar after 5s
  const timeout = setTimeout(() => {
    snackbar.style.display = 'none';
  }, 7000);

  // Handle undo click
  undoBtn.onclick = async () => {
    clearTimeout(timeout);
    snackbar.style.display = 'none';

    // Restore in Firebase
    const restoreRef = ref(database, `daily_expenses/${deletedExpense.date}/${deletedExpense.id}`);
    await set(restoreRef, {
      expense: deletedExpense.expense,
      amount: deletedExpense.amount,
      category: deletedExpense.category
    });

    alert('Expense restored!');
    renderSummaries()

    // Optional: re-render the list
  };
}

summaryBtn.addEventListener('click', () => {
  summaryPopup.style.display = 'block';
  summaryDimmer.style.display = 'block';
  renderSummaries();
});

document.getElementById('applyDateFilter').addEventListener('click', () => {
  const startDate = document.getElementById('startDate').value;
  const endDate = document.getElementById('endDate').value;
  if (!startDate || !endDate) {
    filterError.style.display = 'block';
    return;
  }
  filterError.style.display = 'none';
  renderSummaries(startDate, endDate);
});

resetFilterBtn.addEventListener('click', () => {
  document.getElementById('startDate').value = '';
  document.getElementById('endDate').value = '';
  filterError.style.display = 'none';
  renderSummaries();
});

printRangeSummaryBtn.addEventListener('click', () => {
  const startDate = document.getElementById('startDate').value;
  const endDate = document.getElementById('endDate').value;

  if (!startDate || !endDate) {
    filterError.style.display = 'block';
    return;
  }

  filterError.style.display = 'none';
  const formatUGX = (value) => new Intl.NumberFormat('en-UG', { style: 'currency', currency: 'UGX', minimumFractionDigits: 0 }).format(value);

  const filtered = globalSortedDates.filter(d => d >= startDate && d <= endDate);
  if (filtered.length === 0) {
    alert("No data found for the selected date range.");
    return;
  }

  let totalGross = 0;
  let totalExpenses = 0;
  const combinedExpenses = [];

 // Compute category totals along with the expenses
const categoryTotals = {};

filtered.forEach(date => {
  const { gross, expenses } = globalDailyTotals[date];
  totalGross += gross;
  totalExpenses += expenses;
  const entries = Object.values(globalExpenseSnap.val()?.[date] || {});
  
  entries.forEach(e => {
    combinedExpenses.push({ date, expense: e.expense, amount: e.amount, category: e.category });
    
    // Calculate total for each category
    if (categoryTotals[e.category]) {
      categoryTotals[e.category] += e.amount;
    } else {
      categoryTotals[e.category] = e.amount;
    }
  });
});


  const totalNet = totalGross - totalExpenses;
  // Initialize the printWindow here to avoid scope issues
  const printWindow = window.open('', '_blank');

// Create a table for category totals
const categorySummaryHTML = `
  <h3>Category Totals</h3>
  <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
    <thead>
      <tr>
        <th style="border: 1px solid #dfe6e9; padding: 10px; text-align: left; background-color: #ecf0f1;">Category</th>
        <th style="border: 1px solid #dfe6e9; padding: 10px; text-align: right; background-color: #ecf0f1;">Total</th>
      </tr>
    </thead>
    <tbody>
      ${Object.keys(categoryTotals).map(category => `
        <tr>
          <td style="border: 1px solid #dfe6e9; padding: 10px; color: #2c3e50;">${category}</td>
          <td style="border: 1px solid #dfe6e9; padding: 10px; text-align: right; color: #2c3e50;">${formatUGX(categoryTotals[category])}</td>
        </tr>
      `).join('')}
    </tbody>
  </table>
`;
const reportHTML = `
<!DOCTYPE html>
<html>
<head>
  <title>Summary Report (${startDate} to ${endDate})</title>
  <style>
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      color: #2c3e50;
      background-color: #fff;
      padding: 40px;
      line-height: 1.6;
    }

    .header {
      text-align: center;
      margin-bottom: 40px;
      border-bottom: 2px solid #e0e0e0;
      padding-bottom: 15px;
    }

    .header img {
      max-height: 150px;
      margin-bottom: 10px;
    }

    .header h1 {
      margin: 5px 0;
      font-size: 24px;
      color: #34495e;
    }

    .header p {
      margin: 2px 0;
      font-size: 14px;
      color: #555;
    }

    h2 {
      text-align: center;
      color: #2c3e50;
      font-size: 22px;
      margin-bottom: 10px;
    }

    h3 {
      margin-top: 30px;
      font-size: 18px;
      color: #2c3e50;
    }

    .net-positive {
      color: #27ae60;
      font-weight: bold;
    }

    .net-negative {
      color: #c0392b;
      font-weight: bold;
    }

    p {
      font-size: 15px;
      margin: 6px 0;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 20px;
      font-size: 14px;
    }

    th, td {
      border: 1px solid #dfe6e9;
      padding: 10px;
      text-align: left;
    }

    th {
      background-color: #ecf0f1;
      font-weight: bold;
      color: #2c3e50;
    }

    tr:nth-child(even) {
      background-color: #f9f9f9;
    }

    tr:hover {
      background-color: #f1f1f1;
    }

    .footer-note {
      margin-top: 40px;
      font-size: 12px;
      color: #888;
      text-align: right;
    }
  </style>
</head>
<body>
  <div class="header">
    <img src="sanyu.png" alt="Logo" />
    <h1>SANYU HOSPITAL   KATOOKE - (UGANDA)</h1>
    <p>P.O. Box 12345, Kampala, Uganda</p>
    <p>Tel: +256 708 657717 | Email: info@keahmedicals.com</p>
  </div>

  <h2>Financial Summary Report</h2>
  <p><strong>From:</strong> ${startDate} &nbsp;&nbsp; <strong>To:</strong> ${endDate}</p>
  <p><strong>Total Gross Income:</strong> ${formatUGX(totalGross)}</p>
  <p><strong>Total Expenses:</strong> ${formatUGX(totalExpenses)}</p>
  <p class="${totalNet < 0 ? 'net-negative' : 'net-positive'}">
    <strong>Total Net Income:</strong> ${formatUGX(totalNet)}
  </p>

  ${categorySummaryHTML}

  <h3>Combined Expenses (${combinedExpenses.length} entries)</h3>
  <table>
    <thead>
      <tr>
        <th>Date</th>
        <th>Expense Notes</th>
        <th>Amount</th>
        <th>Category</th>
      </tr>
    </thead>
    <tbody>
      ${combinedExpenses.map(e => `
        <tr>
          <td>${e.date}</td>
          <td>${e.expense}</td>
          <td>${formatUGX(e.amount)}</td>
          <td>${e.category}</td>
        </tr>`).join('')}
    </tbody>
  </table>

  <p class="footer-note">
    Report generated on: ${new Date().toLocaleString('en-UG')}
  </p>
</body>
</html>
`;

printWindow.document.write(reportHTML);
printWindow.document.close();
printWindow.print();
});

closeSummaryBtn.addEventListener('click', () => {
  summaryPopup.style.display = 'none';
  summaryDimmer.style.display = 'none';
});


async function computeAndStoreDailySummary() {
  const dbRef = ref(database);
  const [salesSnap, expenseSnap] = await Promise.all([
    get(child(dbRef, 'salesReceipts')),
    get(child(dbRef, 'daily_expenses'))
  ]);

  const today = new Date().toISOString().split("T")[0];
  let gross = 0, expenses = 0;

  if (salesSnap.exists()) {
    const sales = salesSnap.val();
    for (const key in sales) {
      const sale = sales[key];
      const date = new Date(sale.timestamp).toISOString().split("T")[0];
      if (date === today) {
        gross += parseFloat(sale.amountTendered || 0);
      }
    }
  }

  if (expenseSnap.exists()) {
    const allExpenses = expenseSnap.val()[today] || {};
    for (const id in allExpenses) {
      expenses += parseFloat(allExpenses[id].amount || 0);
    }
  }

  const net = gross - expenses;

  // Save to Firebase
  await set(ref(database, `daily_summaries/${today}`), {
    gross,
    expenses,
    net,
    savedAt: new Date().toISOString()
  });
}


window.addEventListener("load", async () => {
  const today = new Date().toISOString().split("T")[0];
  const summaryRef = ref(database, `daily_summaries/${today}`);
  const snap = await get(summaryRef);

  if (!snap.exists()) {
    try {
      await computeAndStoreDailySummary();
      console.log("Daily summary saved.");
    } catch (err) {
      console.error("Failed to store summary:", err);
    }
  }
});
const saveSummaryBtn = document.getElementById("saveDailySummaryBtn");

saveSummaryBtn.addEventListener("click", async () => {
  try {
    await computeAndStoreDailySummary();
    alert("✅ Daily summary saved successfully!");
  } catch (err) {
    console.error("Failed to save summary:", err);
    alert("⚠️ Error saving summary: " + err.message);
  }
});



