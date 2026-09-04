import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.2/firebase-app.js";
  import { getDatabase, ref,remove, push,get, onValue,child,set,update } from "https://www.gstatic.com/firebasejs/9.0.2/firebase-database.js";
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




const medicationTakenSelect = document.getElementById('medicationTaken');

// Retrieve medicines from Firebase and populate the select options
const medicinesRef = ref(database, 'tests');
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
});


// Get references to the necessary elements
const uploadPrescriptionsButton = document.getElementById('uploadPrescriptionsButton');
const overlay = document.getElementById('overlay');
const popupContainer = document.getElementById('uploadPrescriptionsPopup');
const closePopupButton = document.getElementById('closePopupButton');
const prescriptionsForm = document.getElementById('prescriptionsForm');

// Function to show the popup and overlay
const showPopup = () => {
  overlay.style.display = 'block';
  popupContainer.style.display = 'block';
};

// Function to hide the popup and overlay
const hidePopup = () => {
  overlay.style.display = 'none';
  popupContainer.style.display = 'none';
};

// Function to handle form submission
const handleFormSubmit = (e) => {
  e.preventDefault();
// Get the prescription value
const prescription = document.getElementById('prescription').value;

// Send the prescription to Firebase
const prescriptionsRef = ref(database, `prescriptions/${prescription}`);
set(prescriptionsRef, { prescription })
  .then(() => {
    // Clear the prescription field
    document.getElementById('prescription').value = '';
    // Close the popup
    hidePopup();
    // Show success message (replace this with your desired success message display)
    alert('Prescription uploaded successfully!');
  })
  .catch((error) => {
    console.error('Error uploading prescription:', error);
    // Show error message (replace this with your desired error message display)
    alert('Error uploading prescription. Please try again.');
  });

};

// Event listener for the "Upload Prescriptions" button
uploadPrescriptionsButton.addEventListener('click', showPopup);

// Event listener for the close button
closePopupButton.addEventListener('click', hidePopup);

// Event listener for the overlay (to close the popup when clicked outside)
overlay.addEventListener('click', hidePopup);

// Event listener for form submission
prescriptionsForm.addEventListener('submit', handleFormSubmit);
const form = document.querySelector('.popup-form');
const typeSelect = document.getElementById('testType');
const categorySelect = document.getElementById('sex');
const services = document.getElementById('services');

const submitButton = document.querySelector('.popup-form button');
// Reference to DOM elements
const patientsContainer = document.getElementById('patients');
const loaderElement = document.getElementById('loader');

let patientsData = []; // Will hold all tests

const categories = {
  investigations: ['Laboratory', 'Ultrascan', 'Xray', 'Biopsy', 'Clinical'],
  procedures: ['Maternity', 'Theatre', 'Treatment-room', 'Other'],
  services: ['Hospital Admission', 'Professional Fees', 'Consultation Fees', 'Other']
};

const parametersContainer = document.getElementById('parametersContainer');
const addParameterBtn = document.getElementById('addParameterBtn');

// Populate category dynamically
typeSelect.addEventListener('change', () => {
  const selectedType = typeSelect.value;
  categorySelect.innerHTML = '<option value="">-- Select Category --</option>';
  if (selectedType && categories[selectedType]) {
    categories[selectedType].forEach(cat => {
      const option = document.createElement('option');
      option.value = cat;
      option.textContent = cat;
      categorySelect.appendChild(option);
    });
  }
});
// Add dynamic parameter row
addParameterBtn.addEventListener('click', () => {
  const div = document.createElement('div');
  div.classList.add('parameter-row');
  div.innerHTML = `
    <input type="text" placeholder="Parameter Name" class="param-name" required>
    <input type="text" placeholder="Unit (e.g., mg/dL)" class="param-unit">
    <input type="text" placeholder="Normal Range" class="param-normal">
    <button type="button" class="remove-param">Remove</button>
  `;
  parametersContainer.appendChild(div);

  div.querySelector('.remove-param').addEventListener('click', () => div.remove());
});

// Submit form and save to Firebase
form.addEventListener('submit', function (e) {
  e.preventDefault();

 const type = typeSelect.value.trim();
const name = document.getElementById('name').value.trim();
const costInput = document.getElementById('dob');
const cost = Number(costInput.value);
const category = categorySelect.value.trim();

if (!type || !name || !category || costInput.value.trim() === '') {
  alert('⚠️ Please fill in all fields.');
  return;
}

if (isNaN(cost) || cost < 0) {
  alert('⚠️ Please enter a valid cost.');
  return;
}
  // Collect parameters
  const parameters = Array.from(document.querySelectorAll('.parameter-row')).map(row => ({
    name: row.querySelector('.param-name').value.trim(),
    unit: row.querySelector('.param-unit').value.trim(),
    normal: row.querySelector('.param-normal').value.trim()
  }));

  const testData = { type, category, name, cost, parameters };

  const testsRef = ref(database, 'tests');
  const newTestRef = child(testsRef, name.replace(/\s+/g, '_').toLowerCase());

  get(newTestRef)
    .then(snapshot => {
      if (snapshot.exists()) {
        alert('⚠️ A test with this name already exists.');
      } else {
        set(newTestRef, testData)
          .then(() => {
            form.reset();
            parametersContainer.innerHTML = '';
            alert('✅ Test details uploaded successfully!');
          })
          .catch(error => console.error('Error uploading test:', error));
      }
    })
    .catch(error => console.error('Error checking if test exists:', error));
});

// ----------------------
// Live render from Firebase
// ----------------------
const testsRef = ref(database, 'tests');

onValue(testsRef, snapshot => {
  patientsData = snapshot.val() ? Object.values(snapshot.val()).reverse() : [];
  renderPatients(patientsData);
  loaderElement.classList.add('hidden');
});

// ----------------------
// Render function
// ----------------------
function renderPatients(patients) {
  patientsContainer.innerHTML = '';

  const table = document.createElement('table');
  table.classList.add('patient-table');

  // Header
  const headers = ['Type', 'Category', 'Name', 'Cost (UGX)', 'Parameters', 'Actions'];
  const tableHeaderRow = document.createElement('tr');
  tableHeaderRow.classList.add('table-header');
  headers.forEach(text => {
    const th = document.createElement('th');
    th.textContent = text;
    tableHeaderRow.appendChild(th);
  });
  table.appendChild(tableHeaderRow);

  // Rows
  patients.forEach(test => {
    const row = document.createElement('tr');
    row.classList.add('table-row');

    const typeCell = createCell(test.type);
    const categoryCell = createCell(test.category);
    const nameCell = createCell(test.name);
const costCell = document.createElement('td');

const costText = document.createElement('span');
costText.textContent = test.cost != null
  ? Number(test.cost).toLocaleString()
  : '-';

const editButton = document.createElement('button');
editButton.textContent = 'Edit';
editButton.className = 'edit-cost-btn';

editButton.addEventListener('click', () => {
  costCell.innerHTML = '';

  const costInput = document.createElement('input');
  costInput.type = 'number';
  costInput.value = test.cost != null ? test.cost : '';
  costInput.className = 'cost-edit-input';

  const saveButton = document.createElement('button');
  saveButton.textContent = 'Save';
  saveButton.className = 'save-cost-btn';

  const cancelButton = document.createElement('button');
  cancelButton.textContent = 'Cancel';
  cancelButton.className = 'cancel-cost-btn';

  // ----------------------
  // SAVE COST TO FIREBASE
  // ----------------------
  saveButton.addEventListener('click', async () => {
    const newCost = Number(costInput.value);

    if (costInput.value === '' || isNaN(newCost) || newCost < 0) {
      alert('Please enter a valid cost.');
      return;
    }

    // EXACT SAME TEST NODE USED BY DELETE
    const testKey = test.name.replace(/\s+/g, '_').toLowerCase();

    const testRef = ref(database, 'tests/' + testKey);

    try {
      // Only update the cost field.
      // Everything else in the test node remains untouched.
      await update(testRef, {
        cost: newCost
      });

      // Update local object too
      test.cost = newCost;

      // Restore normal display
      costCell.innerHTML = '';

      const newCostText = document.createElement('span');
      newCostText.textContent = Number(newCost).toLocaleString();

      const newEditButton = document.createElement('button');
      newEditButton.textContent = 'Edit';
      newEditButton.className = 'edit-cost-btn';

      // Re-open editor
      newEditButton.addEventListener('click', () => {
        editButton.click();
      });

      costCell.appendChild(newCostText);
      costCell.appendChild(newEditButton);

      showMessage('✅ Cost updated successfully.');

    } catch (error) {
      console.error('Error updating test cost:', error);
      alert('❌ Failed to update the cost.');
    }
  });

  // ----------------------
  // CANCEL
  // ----------------------
  cancelButton.addEventListener('click', () => {
    costCell.innerHTML = '';
    costCell.appendChild(costText);
    costCell.appendChild(editButton);
  });

  costCell.appendChild(costInput);
  costCell.appendChild(saveButton);
  costCell.appendChild(cancelButton);

  costInput.focus();
});

costCell.appendChild(costText);
costCell.appendChild(editButton);
    // Parameters cell with mini table
    const paramsCell = document.createElement('td');
    if (test.parameters && test.parameters.length > 0) {
      const paramTable = document.createElement('table');
      paramTable.classList.add('param-table');
      test.parameters.forEach(param => {
        const paramRow = document.createElement('tr');

        const nameCell = document.createElement('td');
        nameCell.textContent = param.name || '-';
        nameCell.style.fontWeight = '600';

        const unitCell = document.createElement('td');
        unitCell.textContent = param.unit || '-';

       const rangeCell = document.createElement('td');
rangeCell.textContent = param.normal || '-';


        paramRow.appendChild(nameCell);
        paramRow.appendChild(unitCell);
        paramRow.appendChild(rangeCell);
        paramTable.appendChild(paramRow);
      });

      paramsCell.appendChild(paramTable);
    } else {
      paramsCell.textContent = '-';
    }

    // Actions
    const actionsCell = document.createElement('td');
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.classList.add('delete-button');
    deleteBtn.addEventListener('click', () => {
      const confirmed = confirm('Are you sure you want to delete this test?');
      if (!confirmed) return;

      const password = prompt('Enter password to confirm deletion:');
      if (password !== 'mm') {
        alert('Incorrect password. Deletion canceled.');
        return;
      }

      const testRef = ref(database, 'tests/' + test.name.replace(/\s+/g, '_').toLowerCase());
      remove(testRef)
        .then(() => showMessage('🗑️ Test deleted successfully.'))
        .catch(error => {
          console.error('Error deleting test:', error);
          showMessage('❌ Error deleting test.');
        });
    });

    actionsCell.appendChild(deleteBtn);

    row.appendChild(typeCell);
    row.appendChild(categoryCell);
    row.appendChild(nameCell);
    row.appendChild(costCell);
    row.appendChild(paramsCell);
    row.appendChild(actionsCell);

    table.appendChild(row);
  });

  patientsContainer.appendChild(table);

  function createCell(text) {
    const cell = document.createElement('td');
    cell.textContent = text ?? '-';
    return cell;
  }
}


// Rest of the code...

// Add event listener to search button
searchButton.addEventListener('click', () => {
  const searchTerm = searchInput.value.trim(); // Get the search term

  // Show the loader
  loaderElement.classList.remove('hidden');

  // Clear the patients container
  patientsContainer.innerHTML = '';

  // Search through Firebase for patient names by key
  const patientsRef = ref(database, 'tests');
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
      patientsContainer.innerHTML = '<p class="no-results">No Tests found.</p>';
    }
  });
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


// Attach the submit event listener outside the function
addRecordForm.addEventListener('submit', function (e) {
  e.preventDefault();

  const patientName = currentPatientName;
  const testsTaken = document.getElementById('testsTaken').value;
  const resultsObtained = document.getElementById('resultsObtained').value;
  const medicationTaken = document.getElementById('medicationTaken').value;
  const additionalNotes = document.getElementById('additionalNotes').value;

  // Generate current timestamp
  const dateTaken = Date.now();

  const recordData = {
    testsTaken: testsTaken,
    resultsObtained: resultsObtained,
    medicationTaken: medicationTaken,
    additionalNotes: additionalNotes,
    dateTaken: dateTaken
  };

  const patientRef = ref(database, `tests/${patientName}`);
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
    <h3>Test Details:</h3>
    <p><strong>Test Name:</strong> ${patient.name}</p>
    <p><strong>Cost:</strong> ${patient.dob}</p>
    <p><strong>Test Case:</strong> ${patient.sex}</p>
    <!-- Add more patient details as needed -->
     <button class="edit-button"><i class="fa fa-edit"></i>Edit</button>
        <button class="print-button"><i class="fa fa-print"></i>Print Details</button>
        <button class="del-button"><i class="fa fa-trash"></i>Delete Test</button>
  </div>
`;


  patientDetails.innerHTML = patientDetailsHTML;


  

  const patientHistoryElement = document.getElementById('patientHistory');

// Retrieve and display the patient's history
const patientName = patient.name; // Replace this with the patient's name
const patientHistoryRef = ref(database, `tests/${patientName}/history`);
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

function createRecordElement(recordKey, record) {
  const recordElement = document.createElement('div');
  recordElement.classList.add('record');

  const recordKeyElement = document.createElement('h4');
  recordKeyElement.textContent = 'Record Key: ' + recordKey;
  recordElement.appendChild(recordKeyElement);

  const dateTakenElement = document.createElement('p');
  const dateTaken = new Date(parseInt(record.dateTaken));
  if (!isNaN(dateTaken.getTime())) { // Check if the date is valid
    dateTakenElement.textContent = 'Date Taken: ' + dateTaken.toLocaleString();
  } else {
    dateTakenElement.textContent = 'Invalid Date';
  }
  recordElement.appendChild(dateTakenElement);

  const testsTakenElement = document.createElement('p');
  testsTakenElement.textContent = 'Services Offered: ' + record.testsTaken;
  recordElement.appendChild(testsTakenElement);

  const resultsObtainedElement = document.createElement('p');
  resultsObtainedElement.textContent = 'Results Obtained: ' + record.resultsObtained;
  recordElement.appendChild(resultsObtainedElement);

  const medicationTakenElement = document.createElement('p');
  medicationTakenElement.textContent = 'Medication Taken: ' + record.medicationTaken;
  recordElement.appendChild(medicationTakenElement);

  const additionalNotesElement = document.createElement('p');
  additionalNotesElement.textContent = 'Additional Notes: ' + record.additionalNotes;
  recordElement.appendChild(additionalNotesElement);

  // Create delete button
  const deleteButton = document.createElement('button');
  deleteButton.classList.add('delete-button');
  // Rest of the code...


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
      const recordRef = ref(database, `patients/${patientName}/history/${recordKey}`);

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


// Show the loader
loaderElement.classList.remove('hidden');

// Firebase reference (make sure this is defined somewhere)
const patientsRef = ref(database, 'tests'); // or 'investigations' / 'procedures' depending on your structure

// Listen for live updates
onValue(patientsRef, (snapshot) => {
  patientsData = snapshot.val() ? Object.values(snapshot.val()).reverse() : [];

  // Render the table using the data
  renderPatients(patientsData);

  // Hide the loader after rendering
  loaderElement.classList.add('hidden');
});

const uploadForm = document.getElementById('addPatientForm');








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