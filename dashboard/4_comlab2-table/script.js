// Initialize Firebase with your project's config
const firebaseConfig = {
    apiKey: "AIzaSyDm9Qpv3uGByOVix841pKBCXIJhhblbwKQ",
    authDomain: "bsu-mabini-comlab.firebaseapp.com",
    databaseURL: "https://bsu-mabini-comlab-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "bsu-mabini-comlab",
    storageBucket: "bsu-mabini-comlab.appspot.com",
    messagingSenderId: "548993981418",
    appId: "1:548993981418:web:b1f35c7b026c253c27b093"
  };
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Get a reference to the database service
const database = firebase.database();

// Reference to the data table body
const tableBody = document.getElementById("dataTableBody");

// Function to fetch data from Firebase and populate the table
function fetchDataAndPopulateTable() {
    // Clear the table body before repopulating
    tableBody.innerHTML = '';

    database.ref('com-lab-2').on('value', function(snapshot) {
        console.log("Snapshot from Firebase:", snapshot.val()); // Log the entire snapshot

        snapshot.forEach(function(childSnapshot) {
            const data = childSnapshot.val();
            console.log("Data from Firebase:", data); // Log each data object

            // Check if data exists and has the expected fields
            if (data && data.srcode && data.fullName && data.pcNumber && data.timeIn && data.date) {

                // Create a table row element
                const row = document.createElement("tr");

                // Populate table row with data
                row.innerHTML = `
                    <td>${data.srcode}</td>
                    <td>${data.fullName}</td>
                    <td>${data.pcNumber}</td>
                    <td>${data.timeIn}</td>
                    <td>${data.date}</td>
                `;

                // Append row to table body
                tableBody.appendChild(row);
            } else {
                console.error("Data structure doesn't match expected format:", data);
            }
        });
    }, function(error) {
        console.error("Error fetching data from Firebase:", error);
    });
}

// Call the function to fetch and populate the table when the page loads
fetchDataAndPopulateTable();
