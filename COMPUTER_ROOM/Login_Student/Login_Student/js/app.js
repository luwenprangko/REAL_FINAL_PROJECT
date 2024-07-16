// Initialize Firebase with your project's config
const firebaseConfig = {
    apiKey: "AIzaSyAdssKrSZdB5MeO6bLlzs9ra42XSsQbNlg",
    authDomain: "comlab-41b63.firebaseapp.com",
    projectId: "comlab-41b63",
    storageBucket: "comlab-41b63.appspot.com",
    messagingSenderId: "573050227714",
    appId: "1:573050227714:web:8c3720298c64b470fb6b1b"
};

// Initialize Firebase
const firebaseApp = firebase.initializeApp(firebaseConfig);
const database = firebaseApp.database();

// Function to initialize the form and button based on localStorage
function initializeForm() {
    const timeInState = localStorage.getItem('timeIn');
    const submitButton = document.getElementById("submitButton");

    if (timeInState === 'true') {
        submitButton.innerText = 'TIME OUT';
        submitButton.classList.remove('btn-primary');
        submitButton.classList.add('btn-danger');
        disableFormInputs(true); // Disable inputs
        populateFormFromLocalStorage();
    } else {
        submitButton.innerText = 'TIME IN';
        submitButton.classList.remove('btn-danger');
        submitButton.classList.add('btn-primary');
        disableFormInputs(false); // Enable inputs
    }
}

// Function to populate form fields from localStorage
function populateFormFromLocalStorage() {
    const formData = JSON.parse(localStorage.getItem('formData'));

    if (formData) {
        document.getElementById("instructorName").value = formData.instructorName;
        document.getElementById("srCode").value = formData.srCode;
        document.getElementById("lastName").value = formData.lastName;
        document.getElementById("firstName").value = formData.firstName;
        document.getElementById("middleInitial").value = formData.middleInitial;
        document.getElementById("pcNumber").value = formData.pcNumber;
    }
}

// Function to save form data to localStorage
function saveFormDataToLocalStorage() {
    const formData = {
        instructorName: document.getElementById("instructorName").value,
        srCode: document.getElementById("srCode").value,
        lastName: document.getElementById("lastName").value,
        firstName: document.getElementById("firstName").value,
        middleInitial: document.getElementById("middleInitial").value,
        pcNumber: document.getElementById("pcNumber").value
    };

    localStorage.setItem('formData', JSON.stringify(formData));
}

// Function to disable/enable form inputs
function disableFormInputs(disabled) {
    document.getElementById("instructorName").disabled = disabled;
    document.getElementById("srCode").disabled = disabled;
    document.getElementById("lastName").disabled = disabled;
    document.getElementById("firstName").disabled = disabled;
    document.getElementById("middleInitial").disabled = disabled;
    document.getElementById("pcNumber").disabled = disabled;
}

// Check local storage for time-in state and initialize the form and button
window.addEventListener('load', () => {
    initializeForm();
});

// Event listener for the submit button
document.getElementById("submitButton").addEventListener("click", function() {
    const isTimeIn = this.innerText === 'TIME IN';
    this.disabled = true;

    if (isTimeIn) {
        // Handle Time-In
        handleTimeIn().then(() => {
            this.innerText = 'TIME OUT';
            this.classList.remove('btn-primary');
            this.classList.add('btn-danger'); // Change button color to red
            localStorage.setItem('timeIn', 'true');
            saveFormDataToLocalStorage();
            disableFormInputs(true); // Disable inputs after Time-In
            this.disabled = false;
        }).catch(error => {
            console.error("Error writing to Firebase: ", error);
            alert("Error submitting data. Please try again.");
            this.disabled = false;
        });
    } else {
        // Handle Time-Out
        handleTimeOut().then(() => {
            this.innerText = 'TIME IN';
            this.classList.remove('btn-danger');
            this.classList.add('btn-primary'); // Change button color back to blue
            localStorage.removeItem('timeIn');
            localStorage.removeItem('formData'); // Clear form data from localStorage
            disableFormInputs(false); // Enable inputs after Time-Out
            this.disabled = false;
            resetForm(); // Reset the form fields
        }).catch(error => {
            console.error("Error writing to Firebase: ", error);
            alert("Error submitting data. Please try again.");
            this.disabled = false;
        });
    }
});

// Function to reset the form fields
function resetForm() {
    document.getElementById("dataForm").reset();
}

// Update handleTimeIn to use srCode as userId
async function handleTimeIn() {
    const instructorName = document.getElementById("instructorName").value;
    const lastName = document.getElementById("lastName").value;
    const firstName = document.getElementById("firstName").value;
    const middleInitial = document.getElementById("middleInitial").value;
    const pcNumber = document.getElementById("pcNumber").value;
    const srCode = document.getElementById("srCode").value; // Get the srCode from input

    const currentDate = new Date();
    const formattedTimeIn = currentDate.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true
    });

    await database.ref('students/' + srCode).set({
        instructorName: instructorName,
        srCode: srCode,
        lastName: lastName,
        firstName: firstName,
        middleInitial: middleInitial,
        pcNumber: pcNumber,
        timeIn: formattedTimeIn,
        timeOut: '' // Initialize timeOut as empty string
    });
}

// Update handleTimeOut to use srCode as userId
async function handleTimeOut() {
    const srCode = document.getElementById("srCode").value; // Get the srCode from input
    const currentDate = new Date();
    const formattedTimeOut = currentDate.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true
    });

    await database.ref('students/' + srCode).update({
        timeOut: formattedTimeOut
    });

    // Fetch the last entry for today and update timeOut
    const formattedDate = currentDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    }).replace(/\//g, '-');

    const snapshot = await database.ref('students').orderByChild('srCode').equalTo(srCode).limitToLast(1).once('value');
    const updates = {};
    snapshot.forEach(childSnapshot => {
        updates[childSnapshot.key + '/timeOut'] = formattedTimeOut;
    });

    await database.ref('students').update(updates);
}

