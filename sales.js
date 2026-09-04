import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.2/firebase-app.js";
import { getDatabase,update, ref,remove, push,get, onValue,child,set } from "https://www.gstatic.com/firebasejs/9.0.2/firebase-database.js";
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

if ('serviceWorker' in navigator) {
window.addEventListener('load', () => {
  navigator.serviceWorker.register('service-worker.js')
    .then(registration => {
      console.log('Service Worker registered with scope:', registration.scope);
    })
    .catch(error => {
      console.error('Service Worker registration failed:', error);
    });
});
}


let deferredPrompt;
const installPopup = document.getElementById('installPopup');
const installButton = document.getElementById('installButton');

window.addEventListener('beforeinstallprompt', event => {
event.preventDefault();
deferredPrompt = event;

// Show the install popup
installPopup.style.display = 'block';
});

installButton.addEventListener('click', () => {
// Prompt the user to install
deferredPrompt.prompt();
deferredPrompt.userChoice.then(choiceResult => {
  if (choiceResult.outcome === 'accepted') {
    console.log('User accepted the A2HS prompt');
  } else {
    console.log('User dismissed the A2HS prompt');
  }
  deferredPrompt = null;
});

// Hide the install popup
installPopup.style.display = 'none';
});




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


// Reference the "staff" node in Firebase Realtime Database
// Function to update the staff count
function updateStaffCount() {
const staffRef = ref(database, "staff");

get(staffRef)
  .then(snapshot => {
    const staffData = snapshot.val();
    const staffCount = staffData ? Object.keys(staffData).length : 0;

    // Update the staff count in the HTML
    const staffCountElement = document.getElementById("staffCount");
    if (staffCountElement) {
      staffCountElement.innerText = staffCount.toString();
    }
  })
  .catch(error => {
    console.error("Error fetching staff count:", error);
  });
}

// Function to update the patients count
function updatePatientsCount() {
const patientsRef = ref(database, "patients");

get(patientsRef)
  .then(snapshot => {
    const patientsData = snapshot.val();
    const patientsCount = patientsData ? Object.keys(patientsData).length : 0;

    // Update the patients count in the HTML
    const patientsCountElement = document.getElementById("patientsCount");
    if (patientsCountElement) {
      patientsCountElement.innerText = patientsCount.toString();
    }
  })
  .catch(error => {
    console.error("Error fetching patients count:", error);
  });
}

// Update counts initially
updateStaffCount();
updatePatientsCount();

// Refresh counts every second
setInterval(() => {
updateStaffCount();
updatePatientsCount();
}, 1000);



// Function to open the popup
function openExpenseSummaryPopup() {
          const overlay = document.getElementById('ExpenseSummaryPopupOverlay');
          const ExpenseSummaryPopup = document.getElementById('ExpenseSummaryPopup');
          overlay.style.display = 'block';
          ExpenseSummaryPopup.style.display = 'block';

          // Fetch and display daily expenses when the popup is opened
          const startDate = document.getElementById('dailystartDate').value;
          const endDate = document.getElementById('dailyendDate').value;
          fetchAndDisplayDailyExpenses(startDate, endDate);
      }

      // Function to close the popup
      function closeExpenseSummaryPopup() {
          const overlay = document.getElementById('ExpenseSummaryPopupOverlay');
          const ExpenseSummaryPopup = document.getElementById('ExpenseSummaryPopup');
          overlay.style.display = 'none';
          ExpenseSummaryPopup.style.display = 'none';
      }

      // Attach click event listeners to buttons
      document.getElementById('showPopupButton').addEventListener('click', openExpenseSummaryPopup);
      document.getElementById('closePopupButton').addEventListener('click', closeExpenseSummaryPopup);




// Function to filter daily expenses by date
function filterExpensesByDate() {
const startDateValue = document.getElementById('dailystartDate').value;
const endDateValue = document.getElementById('dailyendDate').value;

if (!startDateValue || !endDateValue) {
  alert('Please select both start and end dates.');
  return;
}

const startDate = new Date(startDateValue);
const endDate = new Date(endDateValue);

fetchAndDisplayDailyExpenses(startDate, endDate);
}

// Function to render the filtered daily expenses in the table
function renderFilteredDailyExpenses(filteredExpenses) {
const dailyExpensesTableBody = document.getElementById('dailyExpensesBody');
dailyExpensesTableBody.innerHTML = '';

filteredExpenses.forEach((expense) => {
  const row = document.createElement('tr');
  row.innerHTML = `
    <td>${expense.date}</td>
    <td>${expense.amount.toLocaleString('en-US', { style: 'currency', currency: 'UGX' })}</td>
    <td>${expense.expense}</td>
    
    <td>
      <button class="delete-button2" onclick="deleteDailyExpense('${expense.key}')">Delete</button>
    </td>
  `;

  dailyExpensesTableBody.appendChild(row);
});
}

     // Add event listener to the "Filter by Date" button
     document.getElementById('filterByDateButton').addEventListener('click', filterExpensesByDate);

// Function to fetch and display the daily expenses in the table
function fetchAndDisplayDailyExpenses(startDate, endDate) {
const dailyExpensesRef = ref(database, 'daily_expenses');

onValue(dailyExpensesRef, (snapshot) => {
  const dailyExpensesData = snapshot.val();

  if (dailyExpensesData) {
    const dailyExpensesTableBody = document.getElementById('dailyExpensesBody');
    dailyExpensesTableBody.innerHTML = '';

    // Create an object to store daily expenses and total amount for each date
    const dailyExpensesSummary = {};
    let totalAmountSum = 0;  // Initialize total amount sum

    for (const dateKey in dailyExpensesData) {
      const dateExpenses = dailyExpensesData[dateKey];

      // Extract the date from the Firebase key (assuming the key is in ISO format)
      const dateParts = dateKey.split('-'); // Split the key by hyphens
      const formattedDate = `${dateParts[1]}/${dateParts[2]}/${dateParts[0]}`;

      for (const expenseKey in dateExpenses) {
        const expenseData = dateExpenses[expenseKey];

        // Check if the expense date falls within the selected date range
        const expenseDate = new Date(expenseData.date);

        if (!startDate || !endDate || (expenseDate >= startDate && expenseDate <= endDate)) {
          if (!dailyExpensesSummary[formattedDate]) {
            // Initialize the daily summary if it doesn't exist
            dailyExpensesSummary[formattedDate] = {
              count: 0,
              totalAmount: 0,
            };
          }

          // Update the daily summary with the current expense
          dailyExpensesSummary[formattedDate].count++;
          dailyExpensesSummary[formattedDate].totalAmount += expenseData.amount;

          // Accumulate total amount sum
          totalAmountSum += expenseData.amount;
        }
      }
    }

    // Sort the summary by date in descending order
    const sortedDates = Object.keys(dailyExpensesSummary).sort((a, b) => {
      const dateA = new Date(a);
      const dateB = new Date(b);
      return dateB - dateA;
    });

    // Iterate through the sorted daily summary and display in the table
    for (const date of sortedDates) {
      const summary = dailyExpensesSummary[date];

      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${date}</td>
        <td>${summary.count}</td>
        <td>${summary.totalAmount.toLocaleString('en-US', { style: 'currency', currency: 'UGX' })}</td>
        <td>
          <button class="details-button" data-date="${date}">Details</button>
        </td>
      `;

      dailyExpensesTableBody.appendChild(row);
    }

// Display the total amount sum in a div
const totalAmountSumDiv = document.getElementById('totalAmountSum');
totalAmountSumDiv.innerHTML = `<i class="fas fa-money-bill"></i>  Table Summation : ${totalAmountSum.toLocaleString('en-US', { style: 'currency', currency: 'UGX' })}`;

    // Add event listeners to the "Details" buttons
    const detailsButtons = document.querySelectorAll('.details-button');
    detailsButtons.forEach((button) => {
      button.addEventListener('click', function () {
        // Get the date from the date cell in the same row
        const dateCell = this.parentElement.parentElement.querySelector('td:first-child');
        const selectedDateCellFormat = dateCell.textContent.trim(); // Trim any extra whitespace

        // Convert the date to Firebase format
        const selectedDateFirebaseFormat = convertDateToFirebaseFormat(selectedDateCellFormat);

        // Call the function to show details for the selected date
        searchAndDisplayExpensesByDate(selectedDateFirebaseFormat);
      });
    });
  }
});
// Add event listener to the "Refresh Filter" button
const clearFilterButton = document.getElementById('clear-filter-details');
clearFilterButton.addEventListener('click', function () {
// Clear the filter by calling the function with empty startDate and endDate
fetchAndDisplayDailyExpenses(null, null);

// Clear the input fields
const startDateInput = document.getElementById('dailystartDate');
const endDateInput = document.getElementById('dailyendDate');
startDateInput.value = '';
endDateInput.value = '';
});

}





// Function to convert a date from 'MM/DD/YYYY' format to 'YYYY-MM-DD' format
function convertDateToFirebaseFormat(dateString) {
const parts = dateString.split('/');
const year = parts[2];
const month = parts[0].padStart(2, '0');
const day = parts[1].padStart(2, '0');
return `${year}-${month}-${day}`;
}
// Function to search and display expenses by date
function searchAndDisplayExpensesByDate(searchDate) {
const detailsPopup = document.getElementById('detailsPopup');
const dailyExpensesDetails = document.getElementById('dailyExpensesDetails');
const popupTitle = document.getElementById('popupTitle');

// Update the popup title with the selected date
popupTitle.textContent = `Expenses made on ${searchDate}`;

// Clear the previous details
dailyExpensesDetails.innerHTML = '';

// Reference the Firebase node for the selected date
const dateExpensesRef = ref(database, 'daily_expenses/' + searchDate);

get(dateExpensesRef)
  .then((snapshot) => {
    const dateExpensesData = snapshot.val();

    if (dateExpensesData) {
      // Create a table to display expenses, their times, and delete buttons
      const table = document.createElement('table');
      table.classList.add('expense-table');

      // Create a table header
      const headerRow = table.createTHead().insertRow(0);
      const expenseHeader = document.createElement('th');
      expenseHeader.textContent = 'Expense';
      headerRow.appendChild(expenseHeader);
      const timeHeader = document.createElement('th');
      timeHeader.textContent = 'Time';
      headerRow.appendChild(timeHeader);
      const amountHeader = document.createElement('th');
      amountHeader.textContent = 'Amount (UGX)';
      headerRow.appendChild(amountHeader);
      const actionHeader = document.createElement('th');
      actionHeader.textContent = 'Action';
      headerRow.appendChild(actionHeader);

      // Initialize total amount
      let totalAmount = 0;

       // Populate the details for the selected date
       for (const key in dateExpensesData) {
         const expenseData = dateExpensesData[key];
       
         // Create a row in the table
         const row = table.insertRow(-1);
         const expenseCell = row.insertCell(0);
         const timeCell = row.insertCell(1);
         const amountCell = row.insertCell(2);
         const actionCell = row.insertCell(3);
       
        // Fill the cells with data
        expenseCell.textContent = expenseData.expense;
        timeCell.textContent = new Date(expenseData.date).toLocaleTimeString('en-US');
        amountCell.textContent = expenseData.amount.toLocaleString('en-US', { style: 'currency', currency: 'UGX' });

         // Create a delete button
         const deleteButton = document.createElement('button');
         deleteButton.textContent = 'Delete';
         deleteButton.classList.add('delete-button');

         // Attach the event listener directly to the delete button
         deleteButton.addEventListener('click', () => deleteDailyExpense(searchDate, key));

         // Add the delete button to the action cell
         actionCell.appendChild(deleteButton);
               // Add the expense amount to the total
        totalAmount += expenseData.amount;
      }

      // Create a row for the total
      const totalRow = table.insertRow(-1);
      const totalLabelCell = totalRow.insertCell(0);
      totalLabelCell.textContent = 'Total:';
      const totalAmountCell = totalRow.insertCell(1);
      totalAmountCell.colSpan = 3;
      totalAmountCell.textContent = totalAmount.toLocaleString('en-US', { style: 'currency', currency: 'UGX' });

      // Append the table to dailyExpensesDetails
      dailyExpensesDetails.appendChild(table);
    } else {
      // Handle the case where there are no expenses for the selected date
      dailyExpensesDetails.innerHTML = 'No expenses found for the selected date.';
    }

    // Show the details popup
    detailsPopup.style.display = 'block';

    // Add event listener to close the details popup
    document.getElementById('closeDetailsButton').addEventListener('click', closeDetailsPopup);
  })
  .catch((error) => {
    console.error('Error fetching expenses:', error);
  });
  
}


// Function to close the details popup
function closeDetailsPopup() {
const detailsPopup = document.getElementById('detailsPopup');
detailsPopup.style.display = 'none';
}

// Function to delete an expense
function deleteDailyExpense(date, expenseKey) {
// Ask the user to enter the password
const enteredPassword = window.prompt('Enter the password to delete the expense:');
const correctPassword = 'mm'; // Replace 'your_password_here' with the actual password

if (enteredPassword === correctPassword) {
  // Reference the expense to be deleted
  const expenseRef = ref(database, `daily_expenses/${date}/${expenseKey}`);

  // Remove the expense from Firebase
  remove(expenseRef)
    .then(() => {
      showMessage('Daily expense deleted successfully!');
      // Refresh the details popup to reflect the changes
      searchAndDisplayExpensesByDate(date);
    })
    .catch((error) => {
      console.error('Error deleting expense:', error);
    });
} else {
  showMessage('Password incorrect. Deletion canceled.');
}
}









// Fetch and display the daily expenses in the table when the DOM content is loaded
document.addEventListener('DOMContentLoaded', () => {
fetchAndDisplayDailyExpenses();
});
function calculateAndDisplayTotalSums(expensesData) {
let totalSumMonthly = 0;
let totalSumYearly = 0;
let totalSumAfter2Years = 0;
let totalSumAfter3Years = 0;
let totalSumAfter5Years = 0;

for (const key in expensesData) {
  const expenseData = expensesData[key];
  switch (expenseData.scheme) {
    case 'monthly':
      totalSumMonthly += expenseData.amount;
      break;
    case 'yearly':
      totalSumYearly += expenseData.amount;
      break;
    case 'after_2_years':
      totalSumAfter2Years += expenseData.amount;
      break;
    case 'after_3_years':
      totalSumAfter3Years += expenseData.amount;
      break;
    case 'after_5_years':
      totalSumAfter5Years += expenseData.amount;
      break;
    default:
      break;
  }
}

// Update the existing information
const totalSumMonthlyDiv = document.getElementById('totalSumMonthly');
totalSumMonthlyDiv.textContent = `Billed (Monthly): ${totalSumMonthly.toLocaleString('en-US', {
  style: 'currency',
  currency: 'UGX',
})}`;

const totalSumYearlyDiv = document.getElementById('totalSumYearly');
totalSumYearlyDiv.textContent = `Billed  (Yearly): ${totalSumYearly.toLocaleString('en-US', {
  style: 'currency',
  currency: 'UGX',
})}`;

const totalSumAfter2YearsDiv = document.getElementById('totalSumAfter2Years');
totalSumAfter2YearsDiv.textContent = `Billed  (After 2 Years): ${totalSumAfter2Years.toLocaleString('en-US', {
  style: 'currency',
  currency: 'UGX',
})}`;

const totalSumAfter3YearsDiv = document.getElementById('totalSumAfter3Years');
totalSumAfter3YearsDiv.textContent = `Billed  (After 3 Years): ${totalSumAfter3Years.toLocaleString('en-US', {
  style: 'currency',
  currency: 'UGX',
})}`;

const totalSumAfter5YearsDiv = document.getElementById('totalSumAfter5Years');
totalSumAfter5YearsDiv.textContent = `Billed  (After 5 Years): ${totalSumAfter5Years.toLocaleString('en-US', {
  style: 'currency',
  currency: 'UGX',
})}`;
// Create a pie chart
const expensesPieChart = document.getElementById('expensesPieChart');
new Chart(expensesPieChart, {
type: 'pie',
data: {
  labels: ['Monthly', 'Yearly', 'After 2 Years', 'After 3 Years', 'After 5 Years'],
  datasets: [
    {
      data: [totalSumMonthly, totalSumYearly, totalSumAfter2Years, totalSumAfter3Years, totalSumAfter5Years],
      backgroundColor: [
        'rgba(255, 99, 132, 0.6)',
        'rgba(54, 162, 235, 0.6)',
        'rgba(255, 206, 86, 0.6)',
        'rgba(75, 192, 192, 0.6)',
        'rgba(153, 102, 255, 0.6)',
      ],
    },
  ],
},
options: {
  responsive: true,
  maintainAspectRatio: false,
  title: {
    display: true,
    text: 'Expense Distribution',
  },
  plugins: {
    legend: {
      labels: {
        color: 'white', // Set label text color to white
      },
    },
  },
},
});

}

// Function to fetch and display the schemed expenses in the table with retry mechanism
function fetchAndDisplaySchemedExpensesWithRetry(maxRetries, retryDelay) {
let retries = 0;

function fetchSchemedExpenses() {
  retries++;

  const schemedExpensesRef = ref(database, 'schemed_expenses');

  // Return a promise for the onValue event to enable retry mechanism
  return new Promise((resolve, reject) => {
    onValue(
      schemedExpensesRef,
      (snapshot) => {
        const schemedExpensesData = snapshot.val();

  if (schemedExpensesData) {
    const schemedExpensesTableBody = document.getElementById('schemedExpensesBody');
    schemedExpensesTableBody.innerHTML = '';

    for (const key in schemedExpensesData) {
      const expenseData = schemedExpensesData[key];

      // Format the date in MM/DD/YYYY format
      const formattedDate = new Date(expenseData.date).toLocaleDateString('en-US');

      // Calculate the due date based on the payment scheme
      const paymentScheme = expenseData.scheme;
      const startDate = new Date(expenseData.date);
      let dueDate;
      if (paymentScheme === 'monthly') {
        dueDate = new Date(startDate);
        dueDate.setMonth(startDate.getMonth() + 1);
      } else if (paymentScheme === 'yearly') {
        dueDate = new Date(startDate);
        dueDate.setFullYear(startDate.getFullYear() + 1);
      } else if (paymentScheme === 'after_2_years') {
        dueDate = new Date(startDate);
        dueDate.setFullYear(startDate.getFullYear() + 2);
      } else if (paymentScheme === 'after_3_years') {
        dueDate = new Date(startDate);
        dueDate.setFullYear(startDate.getFullYear() + 3);
      } else if (paymentScheme === 'after_5_years') {
        dueDate = new Date(startDate);
        dueDate.setFullYear(startDate.getFullYear() + 5);
      }

      // Format the due date in MM/DD/YYYY format
      const formattedDueDate = dueDate.toLocaleDateString('en-US');

      // Calculate the number of days left between current date and due date
      const currentDate = new Date();
      const daysLeft = Math.ceil((dueDate - currentDate) / (1000 * 60 * 60 * 24));

      // Determine the text color for the "Days Left" column based on the number of days
      let daysLeftColorClass;
      if (daysLeft <= 0) {
        daysLeftColorClass = 'red-text';
      } else if (daysLeft <= 10) {
        daysLeftColorClass = 'orange-text';
      } else {
        daysLeftColorClass = 'green-text';
      }

      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${expenseData.expense}</td>
        <td>${expenseData.amount.toLocaleString('en-US', { style: 'currency', currency: 'UGX' })}</td>
        <td>${expenseData.scheme}</td>
        <td>${formattedDate}</td>
        <td>${formattedDueDate}</td>
        <td class="${daysLeftColorClass}">${daysLeft} days</td>
        <td>
          <button class="delete-button" data-key="${key}"><i class="fa fa-trash"></i></button>
         <button class="renew-button" data-key="${key}"><i class="fa fa-refresh"></i></button>
        </td>
      `;

      schemedExpensesTableBody.appendChild(row);
    }

    // Add event listeners to the "Delete" buttons
    const deleteButtons = document.querySelectorAll('.delete-button');
    deleteButtons.forEach((button) => {
      button.addEventListener('click', function () {
        const key = this.dataset.key;
        deleteExpense(key);
      });
    });

    // Add event listeners to the "Renew" buttons
    const renewButtons = document.querySelectorAll('.renew-button');
    renewButtons.forEach((button) => {
      button.addEventListener('click', function () {
        const key = this.dataset.key;
        renewExpense(key);
      });
    });
      // Call the function to calculate and display the total sum
      calculateAndDisplayTotalSums(schemedExpensesData);
      console.log('Schemed expenses fetched successfully!');
          resolve(); // Resolve the promise when schemed expenses are fetched
        } else {
          // If data is not available, retry after a delay
          if (retries < maxRetries) {
            console.log(`Retrying in ${retryDelay} milliseconds...`);
            setTimeout(() => {
              fetchSchemedExpenses().then(resolve); // Retry by calling fetchSchemedExpenses again
            }, retryDelay);
          } else {
            console.error('Exceeded maximum retries. Unable to fetch schemed expenses.');
            reject(); // Reject the promise when retries are exhausted
          }
        }
      },
      (error) => {
        console.error('Error fetching schemed expenses:', error);

        if (retries < maxRetries) {
          console.log(`Retrying in ${retryDelay} milliseconds...`);
          setTimeout(() => {
            fetchSchemedExpenses().then(resolve); // Retry by calling fetchSchemedExpenses again
          }, retryDelay);
        } else {
          console.error('Exceeded maximum retries. Unable to fetch schemed expenses.');
          reject(); // Reject the promise when retries are exhausted
        }
      }
    );
  });
}

// Start the initial fetch attempt
fetchSchemedExpenses().catch(() => {
  console.log('Initial fetch failed. Retrying...');
  return fetchSchemedExpenses(); // Retry the initial fetch
});
}

// Call the function with maximum retries of 3 and a retry delay of 1000 milliseconds (1 second)
fetchAndDisplaySchemedExpensesWithRetry(3, 1000);    

// Function to delete the expense from Firebase
function deleteExpense(key) {
// Ask the user to enter the password
const enteredPassword = window.prompt('Enter the password to delete the expense:');
const correctPassword = 'mm'; // Replace 'your_password_here' with the actual password

if (enteredPassword === correctPassword) {
  const expenseRef = ref(database, `schemed_expenses/${key}`);
  remove(expenseRef)
    .then(() => {
      showMessage('Expense deleted successfully!');
    })
    .catch((error) => {
      showMessage('Error deleting expense:', error);
    });
} else {
  showMessage('Password incorrect. Deletion canceled.');
}
}

// Function to renew the expense with the current date in Firebase
function renewExpense(key) {
// Ask the user to enter the password
const enteredPassword = window.prompt('Enter the password to renew the expense:');
const correctPassword = 'mm'; // Replace 'your_password_here' with the actual password

if (enteredPassword === correctPassword) {
  const expenseRef = ref(database, `schemed_expenses/${key}`);
  const currentDate = new Date().toISOString();

  update(expenseRef, {
    date: currentDate
  })
    .then(() => {
      showMessage('Expense renewed successfully!');
    })
    .catch((error) => {
      showMessage('Error renewing expense:', error);
    });
} else {
  showMessage('Password incorrect. Renewal canceled.');
}
}


// Call the functions to fetch and display the expenses data
fetchAndDisplayDailyExpenses();



// Function to save the schemed expense details to Firebase
function saveSchemeExpense(expense, amount, scheme) {
const schemeExpensesRef = ref(database, 'schemed_expenses');
const newSchemeExpenseRef = push(schemeExpensesRef);

// Get the current date and time
const currentDate = new Date();
const currentDateTimeString = currentDate.toISOString(); // Convert to ISO string format

// Create an object with the scheme expense details
const schemeExpenseData = {
  expense: expense,
  amount: amount,
  scheme: scheme,
  date: currentDateTimeString // Add the date and time to the object
};

// Save the scheme expense data to Firebase
set(newSchemeExpenseRef, schemeExpenseData)
  .then(() => {
    showMessage('Schemed expense details saved successfully!');
  })
  .catch((error) => {
    showMessage('Error saving schemed expense details:', error);
  });
}


// Add event listener to the "Save" button in the scheme popup
const saveSchemeExpenseButton = document.getElementById('saveSchemeExpenseButton');
saveSchemeExpenseButton.addEventListener('click', function () {
const schemeExpenseInput = document.getElementById('schemeExpense');
const schemeAmountInput = document.getElementById('schemeAmount');
const schemePaymentSelect = document.getElementById('schemePayment');

const schemeExpense = schemeExpenseInput.value.trim();
const schemeAmount = parseFloat(schemeAmountInput.value);
const schemePayment = schemePaymentSelect.value;

if (schemeExpense && !isNaN(schemeAmount) && schemeAmount > 0) {
  // Save the schemed expense details to Firebase
  saveSchemeExpense(schemeExpense, schemeAmount, schemePayment);

  // Clear the input fields
  schemeExpenseInput.value = '';
  schemeAmountInput.value = '';
  
  // Close the scheme popup
  closeSchemePopup();
} else {
  alert('Please enter valid expense and amount.');
}
});

// Function to open the scheme popup
function openSchemePopup() {
const schemePopupContainer = document.getElementById('schemePopupContainer');
const schemeOverlay = document.getElementById('schemeOverlay');
schemePopupContainer.classList.add('active');
schemeOverlay.classList.add('active');
}

// Function to close the scheme popup
function closeSchemePopup() {
const schemePopupContainer = document.getElementById('schemePopupContainer');
const schemeOverlay = document.getElementById('schemeOverlay');
schemePopupContainer.classList.remove('active');
schemeOverlay.classList.remove('active');
}

// Add event listener to the "Open Scheme Popup" button
const openSchemePopupButton = document.getElementById('openSchemePopupButton');
openSchemePopupButton.addEventListener('click', openSchemePopup);

// Add event listener to the "Close" button in the scheme popup
const schemeCloseButton = document.getElementById('schemeCloseButton');
schemeCloseButton.addEventListener('click', closeSchemePopup);


// Function to save the expense details to Firebase
function saveExpenseDetails(expense, amount) {
const expensesRef = ref(database, 'daily_expenses');

// Get the current date in ISO string format (YYYY-MM-DD)
const currentDate = new Date().toISOString().split('T')[0]; // Extract the date part

// Create an object with the expense details
const expenseData = {
  expense: expense,
  amount: amount,
  date: new Date().toISOString(), // Convert the date to ISO format
};

// Save the expense data under the current date node in Firebase
const dateNodeRef = child(expensesRef, currentDate);
push(dateNodeRef, expenseData)
  .then(() => {
    showMessage('Expense details saved successfully!');
  })
  .catch((error) => {
    showMessage('Error saving expense details:', error);
  });
}


// Add event listener to the "Save" button in the popup
const saveExpenseButton = document.getElementById('saveExpenseButton');
saveExpenseButton.addEventListener('click', function () {
const expenseInput = document.getElementById('expense');
const amountInput = document.getElementById('amount');

const expense = expenseInput.value.trim();
const amount = parseFloat(amountInput.value);

if (expense && !isNaN(amount) && amount > 0) {
  // Save the expense details to Firebase
  saveExpenseDetails(expense, amount);

  // Clear the input fields
  expenseInput.value = '';
  amountInput.value = '';
  
  // Close the popup
  closePopup();
} else {
  alert('Please enter valid expense and amount.');
}
});

// Function to open the popup
function openPopup() {
const popupContainer = document.getElementById('popupContainer');
const overlay = document.getElementById('overlay');
popupContainer.classList.add('active');
overlay.classList.add('active');
}

// Function to close the popup
function closePopup() {
const popupContainer = document.getElementById('popupContainer');
const overlay = document.getElementById('overlay');
popupContainer.classList.remove('active');
overlay.classList.remove('active');
}


const openPopupButton = document.getElementById('openPopupButton');
const popupContainer = document.getElementById('popupContainer');
const overlay = document.getElementById('overlay');
const closeButton = document.getElementById('closeButton');

openPopupButton.addEventListener('click', () => {
popupContainer.style.display = 'block';
overlay.style.display = 'block';
});

closeButton.addEventListener('click', () => {
popupContainer.style.display = 'none';
overlay.style.display = 'none';
});

// Assuming you have already initialized Firebase and have a reference to the database
// Add event listener to the "Clear Filter" button
const clearFilterButton2 = document.getElementById('clear-filter-button2');
clearFilterButton2.addEventListener('click', function () {
// Reset the date inputs
document.getElementById('start-date2').value = '';
document.getElementById('end-date2').value = '';

// Display all tests again
fetchAndDisplayTests();
});

// Add event listener to the "Filter" button
const filterButton2 = document.getElementById('filter-button2');
filterButton2.addEventListener('click', function () {
// Get the selected start and end dates
const startDateValue = document.getElementById('start-date2').value;
const endDateValue = document.getElementById('end-date2').value;

// Convert the date strings to Date objects
const startDate2 = new Date(startDateValue);
const endDate2 = new Date(endDateValue);

// Filter the tests based on the selected date range
filterTestsByDate(startDate2, endDate2).then((filteredTests) => {
  // Render the filtered tests in the table
  renderFilteredTests(filteredTests);
});
});

// Function to filter the tests based on the selected date range
function filterTestsByDate(startDate2, endDate2) {
// Get a reference to the "patients" node in Firebase
const patientsRef = ref(database, 'patients');

// Fetch the patient data from Firebase
return get(patientsRef).then((snapshot) => {
    const patientsData = snapshot.val();
    const filteredTests = [];

    // Check if patientsData exists and contains patient objects
    if (patientsData) {
      // Loop through each patient in the patientsData
      for (const patientId in patientsData) {
        const patient = patientsData[patientId];

        // Check if the patient has the "testsTaken" node
        if (patient.hasOwnProperty('testsTaken')) {
          const testsTaken = patient.testsTaken;

          // Loop through each test with unique identifiers
          for (const testId in testsTaken) {
            const testData = testsTaken[testId];
            const dateTakenValue = testData.dateTaken;

            // Check if the test date is within the selected date range
            if (dateTakenValue >= startDate2 && dateTakenValue <= endDate2) {
              // Add the test data to the filteredTests array
              filteredTests.push({
                patientId: patientId,
                testId: testId,
                testsTakenValue: testData.testsTaken,
                
                dateTakenValue: new Date(testData.dateTaken), // Convert to Date object
                priceValue: testData.price
              });
            }
            
          }
        }
      }
    }

    return filteredTests;

  }).catch((error) => {
    console.error('Error fetching patients data:', error);
    return [];
  });
}
// Function to render the filtered tests in the table
function renderFilteredTests(filteredTests) {
  // Create a table element
  const table = document.createElement('table');
  table.classList.add('test-table');
// Calculate total price
let totalPrice = 0;
filteredTests.forEach(test => {
  totalPrice += test.priceValue;
});
// Display total price in the div
const totalPriceDiv = document.getElementById('total-price');
totalPriceDiv.innerHTML = `Total Tests Revenue: ${totalPrice.toLocaleString('en-US', { style: 'currency', currency: 'UGX' })}`;

  // Create the table header row
  const headerRow = document.createElement('tr');
  headerRow.innerHTML = `
    <th>Patient</th>
    <th>Test ID</th>
    <th>Services Offered</th>
  
    <th>Date Taken</th>
    <th>Price (UGX)</th>
  `;
  table.appendChild(headerRow);

  // Loop through each filtered test and create table rows
  filteredTests.forEach(test => {
    const row = document.createElement('tr');
     // Format the dateTakenValue in MM/DD/YYYY format
  const formattedDate = test.dateTakenValue.toLocaleDateString('en-US');

    row.innerHTML = `
      <td>${test.patientId}</td>
      <td>${test.testId}</td>
      <td>${test.testsTakenValue}</td>
      
      <td>${formattedDate}</td>
      <td>${test.priceValue.toLocaleString('en-US', { style: 'currency', currency: 'UGX' })}</td>
    `;
    table.appendChild(row);
  });

  // Replace the existing table (if any) with the new table
  const testTableContainer = document.getElementById('test-table-container');
  testTableContainer.innerHTML = '';
  testTableContainer.appendChild(table);
}

// Define variables
let testsData = [];
const testsPerPage = 10;
let currentPage = 1;

// Function to fetch and display tests data with pagination
function fetchAndDisplayTestsWithPagination() {
const testTableContainer = document.getElementById('test-table-container');

// Calculate the start and end indices for the current page
const startIndex = (currentPage - 1) * testsPerPage;
const endIndex = startIndex + testsPerPage;

// Create a subset of tests for the current page
const testsForPage = testsData.slice(startIndex, endIndex);

// Create a table element
const table = document.createElement('table');
table.classList.add('test-table');

// Create the table header row
const headerRow = document.createElement('tr');
headerRow.innerHTML = `
  <th>Patient</th>
  <th>Test ID</th>
  <th>Services Offered</th>
  <th>Date Taken</th>
  <th>Price (UGX)</th>
`;
table.appendChild(headerRow);

// Calculate total price while rendering the table
let totalPrice = 0;

// Loop through testsForPage and render the table
testsForPage.forEach((test) => {
  const { patientId, testId, testsTaken, dateTaken, price } = test;

  // Format the dateTaken in MM/DD/YYYY format
  const formattedDate = new Date(dateTaken).toLocaleDateString('en-US');

  // Create a row element for each test
  const row = document.createElement('tr');
  row.innerHTML = `
    <td>${patientId}</td>
    <td>${testId}</td>
    <td>${testsTaken}</td>
    <td>${formattedDate}</td>
    <td>${price}</td>
  `;

  // Append the row to the table
  table.appendChild(row);

  // Add the test's price to the total price
  totalPrice += price;
});

// Replace the existing table (if any) with the new table
testTableContainer.innerHTML = '';
testTableContainer.appendChild(table);

// Display total price in the div
const totalPriceDiv = document.getElementById('total-price');
totalPriceDiv.innerHTML = `Total Tests Revenue: ${totalPrice.toLocaleString('en-US', { style: 'currency', currency: 'UGX' })}`;
}

// Function to update pagination
function updatePagination() {
const totalPages = Math.ceil(testsData.length / testsPerPage);
const paginationDiv = document.getElementById('pagination');
paginationDiv.innerHTML = '';

// Create previous button
const prevButton = document.createElement('button');
prevButton.textContent = 'Previous';
prevButton.addEventListener('click', () => {
  if (currentPage > 1) {
    currentPage--;
    fetchAndDisplayTestsWithPagination();
  }
});

// Create next button
const nextButton = document.createElement('button');
nextButton.textContent = 'Next';
nextButton.addEventListener('click', () => {
  if (currentPage < totalPages) {
    currentPage++;
    fetchAndDisplayTestsWithPagination();
  }
});

// Display current page and total pages
const pageInfo = document.createElement('span');
pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;

// Append the buttons and page info to the pagination div
paginationDiv.appendChild(prevButton);
paginationDiv.appendChild(pageInfo);
paginationDiv.appendChild(nextButton);
}

// Function to fetch and display the testsTaken data in a table with retry mechanism
function fetchAndDisplayTestsWithRetry(maxRetries, retryDelay) {
let retries = 0;

function fetchTests() {
  retries++;

  const patientsRef = ref(database, 'patients');

  get(patientsRef)
    .then((snapshot) => {
      const patientsData = snapshot.val();

      if (patientsData) {
        // Extract and format tests data here
        const extractedTests = extractTestsData(patientsData);
        
        // Set testsData to the extracted tests data
        testsData = extractedTests;

        // Update pagination and display data
        currentPage = 1;
        fetchAndDisplayTestsWithPagination();
        updatePagination();
      } else {
        // Handle the case when there are no patients
        showMessage('No patients data found.');
      }
    })
    .catch((error) => {
      console.error('Error fetching patients data:', error);

      if (retries < maxRetries) {
        setTimeout(fetchTests, retryDelay);
      } else {
        console.error('Exceeded maximum retries. Unable to display tests.');
      }
    });
}

fetchTests();
}

// Extract and format tests data
function extractTestsData(patientsData) {
const extractedTests = [];

for (const patientId in patientsData) {
  const patient = patientsData[patientId];

  if (patient.hasOwnProperty('testsTaken')) {
    const testsTaken = patient.testsTaken;

    for (const testId in testsTaken) {
      const testData = testsTaken[testId];
      const testsTakenValue = testData.testsTaken;
      const dateTakenValue = new Date(testData.dateTaken); // Convert to Date object
      const priceValue = testData.price;

      extractedTests.push({
        patientId,
        testId,
        testsTaken: testsTakenValue,
        dateTaken: dateTakenValue,
        price: priceValue,
      });
    }
  }
}

return extractedTests;
}

// Call the function with maximum retries of 3 and a retry delay of 1000 milliseconds (1 second)
fetchAndDisplayTestsWithRetry(10, 1000);






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



const form = document.querySelector('.popup-form');
const submitButton = document.querySelector('.popup-form button');
const successMessage = document.createElement('p');
successMessage.textContent = 'Medicine details uploaded successfully!';
successMessage.style.color = 'green';
const errorMessage = document.createElement('p');
errorMessage.textContent = 'Error uploading patient details. Please try again.';
errorMessage.style.color = 'red';
const patientsContainer = document.getElementById('patients');
let patients = []; // Declare patients variable outside the event listener




function renderPatients(patients) {

}
patientsContainer.innerHTML = '';



const salesContainer = document.getElementById('salesContainer');
// Add these lines at the beginning of your JavaScript file to get references to the filter elements
const startDateInput = document.getElementById('start-date');
const endDateInput = document.getElementById('end-date');
const filterButton = document.getElementById('filter-button');

// Declare the salesChart and salesTrendChart variables outside the renderSalesTable function
let salesChart;
let salesTrendChart;
// Function to render the sales table and sales trend chart
function renderSalesTable(sales, salesByDate) {

// Sort the sales array by date and time in descending order
sales.sort((a, b) => {
const dateA = new Date(`${a.saleData.date} ${a.saleData.time}`);
const dateB = new Date(`${b.saleData.date} ${b.saleData.time}`);
return dateB - dateA;
});

// Add an event listener to the filter button
filterButton.addEventListener('click', applyDateFilter);

// Function to filter the sales data by date
function applyDateFilter() {
const startDate = new Date(startDateInput.value);
let endDate = new Date(endDateInput.value);

// Adjust the end date to the end of the day
endDate.setHours(23, 59, 59, 999);

// Fetch the original sales data (before sorting by date)
const originalSales = [...sales];

// Filter the sales data based on the date range
const filteredSales = originalSales.filter((sale) => {
  const [month, day, year] = sale.saleData.date.split('/').map(Number);
  const saleDate = new Date(year, month - 1, day, 0, 0, 0, 0); // Start of the day

  return saleDate >= startDate && saleDate <= endDate;
});


// Render the filtered sales table
showMessage('Filter Complete');
renderSalesTable(filteredSales);
}




// Get a reference to the "Clear Filter" button
const clearFilterButton = document.getElementById('clear-filter-button');

function clearDateFilter() {
startDateInput.value = ''; // Reset the start date input
endDateInput.value = ''; // Reset the end date input

// Render the table with the original sales data
renderSalesTable(originalSales);
}

// Add an event listener to the "Clear Filter" button
clearFilterButton.addEventListener('click', searchByMedicine);

// Create a table element
const table = document.createElement('table');
table.classList.add('sales-table');

// Create the table header row
const headerRow = document.createElement('tr');
headerRow.innerHTML = `
  <th>Medicine</th>
  <th>Quantity</th>
  <th>Price (Ug.sh)</th>
  <th>Date</th>
  <th>Total</th>
  <th>Action</th>
`;
table.appendChild(headerRow);

// Object to store the total incomes for each medicine
const medicineIncomes = {};

// Object to store the total sales for each day
const salesByDay = {};


// Destroy the existing salesChart if it exists
if (salesChart) {
  salesChart.destroy();
}

// Destroy the existing salesTrendChart if it exists
if (salesTrendChart) {
  salesTrendChart.destroy();
}

// Loop through each sale
sales.forEach(sale => {
  const patientName = sale.patientName;
  const saleData = sale.saleData;

  // Create a row element for each sale
  const row = document.createElement('tr');

  // Create and append the patient name cell
  const patientNameCell = document.createElement('td');
  patientNameCell.textContent = patientName;
  row.appendChild(patientNameCell);

  // Create and append the sale quantity cell
  const quantityCell = document.createElement('td');
  quantityCell.textContent = saleData.quantity + ' pcs';
  row.appendChild(quantityCell);

    // Create a row element for each sale
  const date = document.createElement('tr');

// Create and append the patient name cell
const dateCell = document.createElement('td');

// Convert saleData.date to a readable format
const saleDate = new Date(saleData.date);
dateCell.textContent = saleDate.toLocaleString('en-UG', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hour12: true
});


  // Create and append the price cell
  const priceCell = document.createElement('td');
  const totalCell = document.createElement('td');

  // Fetch the medicine data from the database and determine unit price + total for this sale
  const medicineRef = ref(database, `medicine/${patientName}`);
  get(medicineRef).then((snapshot) => {
    const medicineData = snapshot.exists() ? snapshot.val() : null;

    const quantity = Number(saleData.quantity) || 0;

    // Determine unit price priority:
    // 1) saleData.unitPrice
    // 2) saleData.totalCost / quantity (if totalCost present)
    // 3) medicine insurancePrices.keah or medicine.keahPrice
    let unitPrice = null;
    if (saleData.unitPrice !== undefined && saleData.unitPrice !== null) {
      unitPrice = Number(saleData.unitPrice);
    } else if (saleData.totalCost !== undefined && quantity > 0) {
      unitPrice = Number(saleData.totalCost) / quantity;
    } else if (medicineData) {
      unitPrice = Number(medicineData.insurancePrices?.keah ?? medicineData.keahPrice ?? medicineData.insurancePrices?.keahPrice ?? NaN);
      if (isNaN(unitPrice)) unitPrice = null;
    }

    // Determine total for this sale: prefer saleData.totalCost, else unitPrice * quantity
    let totalIncome = null;
    if (saleData.totalCost !== undefined && saleData.totalCost !== null) {
      totalIncome = Number(saleData.totalCost);
    } else if (unitPrice !== null && !isNaN(unitPrice)) {
      totalIncome = unitPrice * quantity;
    } else {
      totalIncome = 0;
    }

    // Display formatted unit price and total
    priceCell.textContent = (unitPrice !== null && !isNaN(unitPrice)) ? `UGX ${Math.round(unitPrice).toLocaleString()}` : 'N/A';
    totalCell.textContent = (!isNaN(totalIncome) && totalIncome !== null) ? `UGX ${Math.round(totalIncome).toLocaleString()}` : 'N/A';

    // Aggregate the total income for each medicine (ensure numeric)
    if (medicineIncomes[patientName]) {
      medicineIncomes[patientName] += Number(totalIncome) || 0;
    } else {
      medicineIncomes[patientName] = Number(totalIncome) || 0;
    }

    // Aggregate the total sales (monetary) for each day
    const day = saleData.date;
    if (salesByDay[day]) {
      salesByDay[day] += Number(totalIncome) || 0;
    } else {
      salesByDay[day] = Number(totalIncome) || 0;
    }

    // Update charts and totals
    updateChart();
    updateTotalAmount();

  }).catch((error) => {
    console.log('Error fetching medicine data:', error);
    priceCell.textContent = 'N/A';
    totalCell.textContent = 'N/A';
  });

  row.appendChild(priceCell);
    row.appendChild(dateCell);

  row.appendChild(totalCell);

// Create and append the delete button cell
const deleteCell = document.createElement('td');
const deleteButton = document.createElement('button');
deleteButton.classList.add('delete-button');
deleteButton.innerHTML = '<i class="fa fa-trash"></i>';

// Get the sale ID
const saleId = sale.saleId; // Assuming you have the sale ID available in the sale object

// Add the sale ID as a data attribute to the delete button
deleteButton.dataset.saleId = saleId;

deleteButton.addEventListener('click', function() {
// Get the patient name and sale ID from the data attributes
const patientName = sale.patientName;
const saleId = this.dataset.saleId;

// Call the deleteSale function to delete the sale from Firebase
deleteSale(patientName, saleId)
  .then(() => {
    // Delete successful
    row.remove();

    // Update the chart and total amount after deleting a sale
    updateChart();
    updateTotalAmount();
  })
  .catch(error => {
    console.log('Error deleting sale:', error);
  });
});


deleteCell.appendChild(deleteButton);
row.appendChild(deleteCell);




// Function to delete a sale from Firebase
function deleteSale(patientName, saleId) {
console.log('Deleting sale for medicine:', patientName);
console.log('Sale ID:', saleId);

// Prompt the user for confirmation
const confirmation = confirm('Are you sure you want to delete this sale?');

if (confirmation) {
  // Prompt the user for password
  const password = prompt('Please enter your password to confirm the deletion:');

  // Check if the password is correct
  if (password === 'mm') { // Replace 'your_password' with the actual password
    // Create a reference to the specific sale in the patient's sales node
    const saleRef = ref(database, `medicine/${patientName}/sales/${saleId}`);

    // Remove the sale node from the database
    return remove(saleRef)
      .then(() => {
        alert('Sale deleted successfully!');
      })
      .catch((error) => {
        console.error('Error deleting sale:', error);
        alert('Error deleting sale. Please try again.');
      });
  } else {
    alert('Wrong password. Deletion cancelled.');
  }
}
}




  // Aggregate the total sales for each day
  const day = saleData.date;
  if (salesByDay[day]) {
    salesByDay[day]++;
  } else {
    salesByDay[day] = 1;
  }

  // Append the row to the table
  table.appendChild(row);
  
});

// Clear the sales container
salesContainer.innerHTML = '';

// Append the table to the sales container
salesContainer.appendChild(table);


// Create and update the chart
const chartCanvas = document.getElementById('salesChart');
if (chartCanvas) {
updateChart();
}

// Create and update the sales trend chart
const trendChartCanvas = document.getElementById('salesTrendChart');
if (trendChartCanvas) {
updateSalesTrendChart();
}

function updateChart() {
// Destroy the existing chart if it exists
if (salesChart) {
  salesChart.destroy();
}

const medicineNames = Object.keys(medicineIncomes);
const totalIncomes = Object.values(medicineIncomes);

// Sort the medicines based on their incomes in descending order
const sortedMedicines = medicineNames
  .map((name, index) => ({ name, income: totalIncomes[index] }))
  .sort((a, b) => b.income - a.income);

// Get the top 5 selling medicines
const topSellingMedicines = sortedMedicines.slice(0, 5);

const chartData = {
  labels: medicineNames, // Use all medicine names for the chart labels
  datasets: [
    {
      label: 'Estimated Income (UGX)',
      data: totalIncomes, // Use all medicine incomes for the chart data
      backgroundColor: 'rgba(75, 192, 192, 0.5)',
      borderColor: 'rgba(75, 192, 192, 1)',
      borderWidth: 1,
    },
  ],
};

const chartOptions = {
  scales: {
    y: {
      beginAtZero: true,
    },
  },
};

const ctx = chartCanvas.getContext('2d');
salesChart = new Chart(ctx, {
  type: 'bar',
  data: chartData,
  options: chartOptions,
});

// Display the top selling medicines in the topSellingTable element
const topSellingTable = document.getElementById('topsells');
topSellingTable.innerHTML = '';

// Create a table element
const table = document.createElement('table');
table.classList.add('topsell-table');

// Create the table header row
const headerRow = document.createElement('tr');
headerRow.innerHTML = `
<th>Medicine Name</th>
<th>Income (UGX)</th>
`;
table.appendChild(headerRow);

// Loop through each top selling medicine
topSellingMedicines.forEach((medicine) => {
// Create a row element for each medicine
const row = document.createElement('tr');

// Create the cell for medicine name
const medicineNameCell = document.createElement('td');
medicineNameCell.textContent = medicine.name;
row.appendChild(medicineNameCell);

// Create the cell for medicine income
const medicineIncomeCell = document.createElement('td');
medicineIncomeCell.textContent = ` ${medicine.income.toLocaleString('en-US', { style: 'currency', currency: 'UGX' })}`;
row.appendChild(medicineIncomeCell);

// Append the row to the table
table.appendChild(row);
});

// Append the table to the topSellingTable element
topSellingTable.appendChild(table);

}

function updateSalesTrendChart() {
// Destroy the existing chart if it exists
if (salesTrendChart) {
  salesTrendChart.destroy();
}

const days = Object.keys(salesByDay).reverse(); // Reverse the array of days
const salesCount = Object.values(salesByDay).reverse(); // Reverse the array of sales counts

const chartData = {
  labels: days,
  datasets: [
    {
      label: 'Sales Count by Date',
      data: salesCount,
      backgroundColor: 'rgba(255, 99, 132, 0.5)',
      borderColor: 'rgba(255, 99, 132, 1)',
      borderWidth: 1,
    },
  ],
};

const chartOptions = {
  scales: {
    y: {
      beginAtZero: true,
    },
  },
};

const ctx = trendChartCanvas.getContext('2d');
salesTrendChart = new Chart(ctx, {
  type: 'line',
  data: chartData,
  options: chartOptions,
});
}

function updateTotalAmount() {
const totalAmountElement = document.getElementById('totalAmount');
const totalAmount = Object.values(medicineIncomes).reduce((acc, curr) => acc + curr, 0);
const formattedAmount = totalAmount.toLocaleString('en');
totalAmountElement.innerHTML = `<i class="fa fa-money earnings-icon"></i> <span class="earnings-text"><br> UGX ${formattedAmount}.00</span>`;
}

// Call the function to update the total revenue collected
updateTotalAmount();


let totalSalesCount = 0;
let previousDaySalesCount = 0;

// Update the sales count in the HTML
const salesCountElement = document.getElementById('salesCount');

// Iterate over the values in salesByDay and add them to the totalSalesCount
Object.values(salesByDay).forEach(count => {
totalSalesCount += count;
});

// Compare with the previous day's sales count and update arrow direction
if (previousDaySalesCount > totalSalesCount) {
// Display arrow up
const arrowUp = '<span class="arrow-down">&#8595;</span>';
salesCountElement.innerHTML = totalSalesCount + ' ' + arrowUp;
} else if (previousDaySalesCount < totalSalesCount) {
// Display arrow down
const arrowDown = '<span class="arrow-up">&#8593;</span>';
salesCountElement.innerHTML = totalSalesCount + ' ' + arrowDown;
} else {
// No change, display sales count without arrow
salesCountElement.innerText = totalSalesCount.toString();
}

// Set previousDaySalesCount to the current totalSalesCount value
previousDaySalesCount = totalSalesCount;

}



// Function to fetch all sales data with retry mechanism
function fetchAllSalesDataWithRetry(maxRetries, retryDelay) {
let retries = 0;

function fetchSalesData() {
  retries++;

  // Show the loader
 // loaderElement.classList.remove('hidden');

  // Clear the sales container
  salesContainer.innerHTML = '';

  const patientsRef = ref(database, 'medicine');

  // Return a promise for the onValue event to enable retry mechanism
  return new Promise((resolve, reject) => {
    onValue(
      patientsRef,
      (snapshot) => {
        const patientsData = snapshot.val();
        const allSales = [];
        const salesByDate = {};

        if (patientsData) {
          const patients = Object.values(patientsData);

          // Loop through all patients and collect sales data
          patients.forEach((patient) => {
            if (patient.hasOwnProperty('sales')) {
              const salesNode = patient.sales;

              for (const saleKey in salesNode) {
                const saleData = salesNode[saleKey];
                const saleId = saleKey; // Set the saleId as the key

                const date = new Date(saleData.date); // Convert the date string to Date object
                const dateString = date.toISOString().split('T')[0]; // Get the date in YYYY-MM-DD format

                // Add the sale data to the allSales array
                allSales.push({
                  patientName: patient.name,
                  saleData: saleData,
                  saleId: saleId, // Include the saleId property
                  date: date, // Include the date object
                  dateString: dateString, // Include the date string
                });

                // Store the sale data in salesByDate
                if (!salesByDate[dateString]) {
                  salesByDate[dateString] = 0;
                }
                salesByDate[dateString] += saleData.amount; // Update the sales count for the date
              }
            }
          });
        }

        // Pass the allSales array and salesByDate object to the renderSalesTable function
        renderSalesTable(allSales, salesByDate);

        // Hide the loader
        loaderElement.classList.add('hidden');
        console.log('Sales data fetched successfully!');
        resolve(); // Resolve the promise when sales data is fetched
      },
      (error) => {
        console.error('Error fetching sales data:', error);

        if (retries < maxRetries) {
          console.log(`Retrying in ${retryDelay} milliseconds...`);
          setTimeout(() => {
            fetchSalesData().then(resolve); // Retry by calling fetchSalesData again
          }, retryDelay);
        } else {
          console.error('Exceeded maximum retries. Unable to fetch sales data.');
          reject(); // Reject the promise when retries are exhausted
        }
      }
    );
  });
}

// Start the initial fetch attempt
fetchSalesData().catch(() => {
  console.log('Initial fetch failed. Retrying...');
  return fetchSalesData(); // Retry the initial fetch
});
}

// Call the function with maximum retries of 3 and a retry delay of 1000 milliseconds (1 second)
fetchAllSalesDataWithRetry(3, 1000);

// Reference to the 'treatment-patients' node
const treatmentPatientsRef = ref(database, 'treatment-patients');

// Initialize counts for Admitted and OPD clients
let admittedPatientsCount = 0;
let opdClientsCount = 0;

// Listen for changes in the 'treatment-patients' node
onValue(treatmentPatientsRef, (snapshot) => {
  snapshot.forEach((childSnapshot) => {
    // Check the patientStatus of each patient
    const patientStatus = childSnapshot.child('patientStatus').val();

    if (patientStatus === 'Admitted') {
      // Count Admitted patients
      admittedPatientsCount++;
    } else if (patientStatus === 'OPD Client') {
      // Count OPD clients
      opdClientsCount++;
    }
  });

  // Update the counts in your HTML
  const admittedPatientsCountElement = document.getElementById('admittedPatientsCount');
  const opdClientsCountElement = document.getElementById('opdClientsCount');

  // Add console.log statements for debugging
  console.log('Admitted Patients Count:', admittedPatientsCount);
  console.log('OPD Clients Count:', opdClientsCount);

  // Update the HTML elements
  if (admittedPatientsCountElement) {
    admittedPatientsCountElement.textContent = admittedPatientsCount;
  } else {
    console.error("Element with ID 'admittedPatientsCount' not found.");
  }

  if (opdClientsCountElement) {
    opdClientsCountElement.textContent = opdClientsCount;
  } else {
    console.error("Element with ID 'opdClientsCount' not found.");
  }
});

// Function to search sales by medicine
function searchByMedicine() {
const medicineInput = document.getElementById('medicineInput');
const medicineKeyword = medicineInput.value.toLowerCase();

// Function to filter patients based on the search term
function filterPatients(patients, searchTerm) {
const filteredPatients = patients.filter((patient) => {
  const patientName = patient.name.toLowerCase();
  return patientName.includes(searchTerm.toLowerCase());
});
renderPatients(filteredPatients);
}

// Add event listener to search input for live search
medicineInput.addEventListener('input', () => {
const searchTerm = medicineInput.value.trim(); // Get the search term
const patientsRef = ref(database, 'medicine');
onValue(patientsRef, (snapshot) => {
  const patientsData = snapshot.val();
  const patients = patientsData ? Object.values(patientsData) : [];
  filterPatients(patients, searchTerm);
});
});
// Show the loader
loaderElement.classList.remove('hidden');

// Clear the sales container
salesContainer.innerHTML = '';

// Search through Firebase for patient names by key
const patientsRef = ref(database, 'medicine');
onValue(patientsRef, (snapshot) => {
  const patientsData = snapshot.val();
  const searchResults = [];

  if (patientsData) {
    const patients = Object.values(patientsData);

    // Filter patients based on the search term
    patients.forEach(patient => {
      const medicineMatch = patient.name.toLowerCase().includes(medicineKeyword);

      // Check if the patient has sales data
      if (patient.hasOwnProperty('sales')) {
        const salesNode = patient.sales;

        // Loop through each sale in the sales node
        for (const saleKey in salesNode) {
          const saleData = salesNode[saleKey];

          if (medicineKeyword === '' || medicineMatch) {
            searchResults.push({
              patientName: patient.name,
              saleData: saleData
            });
          }
        }
      }
    });
  }

  // Hide the loader
  loaderElement.classList.add('hidden');

  // Display search results
  if (searchResults.length > 0) {
    renderSalesTable(searchResults);
  } else {
    salesContainer.innerHTML = '<p class="no-results">Oops... No sales found.</p>';
  }
});
}

// Get a reference to the medicine input element
const medicineInput = document.getElementById('medicineInput');

// Add event listener to medicine input for live search
medicineInput.addEventListener('input', searchByMedicine);
// Add event listener to search medicine button
const searchMedicineButton = document.getElementById('searchMedicineButton');
searchMedicineButton.addEventListener('click', searchByMedicine);

// Fetch all sales data on page load
window.addEventListener('load', fetchAllSalesDataWithRetry);


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


function getGreeting() {
var currentDate = new Date();
var currentHour = currentDate.getHours();

var greeting;
if (currentHour < 12) {
  greeting = "Good morning";
} else if (currentHour < 18) {
  greeting = "Good afternoon";
} else {
  greeting = "Good evening";
}

return greeting;
}

var greetingDiv = document.getElementById("greeting");
var greeting = getGreeting();
greetingDiv.textContent = greeting;

window.addEventListener('load', function () {
const splashScreen = document.getElementById('splashScreen');
splashScreen.style.opacity = '1';

// Smoothly fade out the splash screen
setTimeout(function () {
  splashScreen.style.transition = 'opacity 0.5s ease-in-out';
  splashScreen.style.opacity = '0';
  setTimeout(function () {
    splashScreen.style.display = 'none';
  }, 500);
}, 1000); // The splash screen will be shown for 5 seconds

// Initialize the spinner
const spinner = new Spinner().spin();

// Append the spinner to the spinner element
const spinnerElement = document.getElementById('spinner');
spinnerElement.appendChild(spinner.el);
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
    if (message.sender === 'Data Entry') {
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
  if (sender === 'Data Entry') {
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
    const sender = 'Data Entry'; // You can replace 'User' with the actual username or user ID
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