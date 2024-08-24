// // Initialize Firebase with your project's config
// const firebaseConfig = {
//     apiKey: "AIzaSyAdssKrSZdB5MeO6bLlzs9ra42XSsQbNlg",
//     authDomain: "comlab-41b63.firebaseapp.com",
//     databaseURL: "https://comlab-41b63-default-rtdb.firebaseio.com",
//     projectId: "comlab-41b63",
//     storageBucket: "comlab-41b63.appspot.com",
//     messagingSenderId: "573050227714",
//     appId: "1:573050227714:web:8c3720298c64b470fb6b1b"
// };

// // Initialize Firebase
// firebase.initializeApp(firebaseConfig);

// // Get a reference to the database service
// const database = firebase.database();

// // Reference to the data table body
// const tableBody = document.getElementById("dataTableBody");

// // Function to fetch data from Firebase and populate the table
// function fetchDataAndPopulateTable() {
//     // Clear the table body before repopulating
//     tableBody.innerHTML = '';

//     database.ref('users').on('value', function(snapshot) {
//         console.log("Snapshot from Firebase:", snapshot.val()); // Log the entire snapshot

//         snapshot.forEach(function(childSnapshot) {
//             const data = childSnapshot.val();
//             console.log("Data from Firebase:", data); // Log each data object

//             // Check if data exists and has the expected fields
//             if (data && data.srcode && data.firstName && data.lastName && data.email) {
//                 // Create a table row element
//                 const row = document.createElement("tr");

//                 // Populate table row with data
//                 row.innerHTML = `
//                     <td>${data.srcode}</td>
//                     <td>${data.firstName} ${data.middleInitial} ${data.lastName}</td>
//                     <td>${data.email}</td>
//                 `;

//                 // Append row to table body
//                 tableBody.appendChild(row);
//             } else {
//                 console.error("Data structure doesn't match expected format:", data);
//             }
//         });
//     }, function(error) {
//         console.error("Error fetching data from Firebase:", error);
//     });
// }

// // Call the function to fetch and populate the table when the page loads
// fetchDataAndPopulateTable();

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
    // Show the skeleton rows while data is loading
    const skeletonRows = document.querySelectorAll('.skeleton-row');
    skeletonRows.forEach(row => row.style.display = 'table-row');

    database.ref('users').on('value', function(snapshot) {
        // Hide the skeleton rows after data is fetched
        skeletonRows.forEach(row => row.style.display = 'none');

        console.log("Snapshot from Firebase:", snapshot.val()); // Log the entire snapshot

        // Clear the table body before repopulating
        tableBody.innerHTML = '';

        snapshot.forEach(function(childSnapshot) {
            const data = childSnapshot.val();
            console.log("Data from Firebase:", data); // Log each data object

            // Check if data exists and has the expected fields
            if (data && data.srcode && data.firstName && data.lastName && data.email) {
                // Create a table row element
                const row = document.createElement("tr");

                // Populate table row with data
                row.innerHTML = `
                    <td>${data.srcode}</td>
                    <td>${data.firstName} ${data.middleInitial || ''} ${data.lastName}</td>
                    <td>${data.email}</td>
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
