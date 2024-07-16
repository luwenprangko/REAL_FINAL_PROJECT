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

// Function to fetch and display data from Firebase
function fetchData() {
    const dataTableBody = document.getElementById("dataTableBody");
    database.ref().on('value', (snapshot) => {
        // Clear existing data before re-rendering
        dataTableBody.innerHTML = '';
        
        snapshot.forEach((dateSnapshot) => {
            dateSnapshot.forEach((childSnapshot) => {
                const data = childSnapshot.val();
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td>${data.instructorName}</td>
                    <td>${data.lastName}</td>
                    <td>${data.firstName}</td>
                    <td>${data.middleInitial}</td>
                    <td>${data.pcNumber}</td>
                    <td>${data.dateIn}</td>
                    <td>${data.timeIn}</td>
                `;
                dataTableBody.appendChild(row);
            });
        });
    }, (error) => {
        console.error("Error fetching data: ", error);
    });
}

// Call fetchData to load the data when the page loads
window.onload = fetchData;
