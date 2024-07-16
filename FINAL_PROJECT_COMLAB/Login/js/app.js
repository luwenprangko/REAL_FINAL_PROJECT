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

// Get a reference to the database service
const database = firebaseApp.database();

// Handle form submission
document.getElementById("submitButton").addEventListener("click", function() {
    // Disable the button to prevent multiple submissions
    this.disabled = true;

    // Get form values
    const instructorName = document.getElementById("instructorName").value;
    const lastName = document.getElementById("lastName").value;
    const firstName = document.getElementById("firstName").value;
    const middleInitial = document.getElementById("middleInitial").value;
    const pcNumber = document.getElementById("pcNumber").value;
    
    // Get current date and time
    const currentDate = new Date();
    
    // Format date with dashes (e.g., "mm-dd-yyyy")
    const formattedDate = currentDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    }).replace(/\//g, '-'); // Replace slashes with dashes

    // Format time
    const formattedTime = currentDate.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true
    });

    // Push data to Firebase
    database.ref(formattedDate).push({
        instructorName: instructorName,
        lastName: lastName,
        firstName: firstName,
        middleInitial: middleInitial,
        pcNumber: pcNumber,
        dateIn: formattedDate,  // Store formatted date
        timeIn: formattedTime   // Store formatted time
    }).then(function() {
        // Clear form after submission
        document.getElementById("dataForm").reset();
        alert("Data submitted successfully!");
        
        // Re-enable the button after submission
        document.getElementById("submitButton").disabled = false;
    }).catch(function(error) {
        console.error("Error writing to Firebase: ", error);
        alert("Error submitting data. Please try again.");
        
        // Re-enable the button after error
        document.getElementById("submitButton").disabled = false;
    });
});
