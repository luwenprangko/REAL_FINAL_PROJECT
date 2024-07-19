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
firebase.initializeApp(firebaseConfig);

// Get a reference to the database service
const database = firebase.database();

// Reference to the data table body
const tableBody = document.getElementById("dataTableBody");

// Function to fetch data from Firebase and populate the table
function fetchDataAndPopulateTable() {
    database.ref('com-lab-2').once('value', function(snapshot) {
        console.log("Snapshot from Firebase:", snapshot.val()); // Log the entire snapshot

        snapshot.forEach(function(childSnapshot) {
            const data = childSnapshot.val();
            console.log("Data from Firebase:", data); // Log each data object

            // Check if data exists and has the expected fields
            if (data && data.srcode && data.fullName && data.pcNumber && data.timeIn) {

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
    }).catch(function(error) {
        console.error("Error fetching data from Firebase:", error);
    });
}

// Call the function to fetch and populate the table when the page loads
fetchDataAndPopulateTable();
