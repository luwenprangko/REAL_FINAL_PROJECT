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

// Function to fetch and highlight data from Firebase
function fetchDataAndHighlight() {
    database.ref().on('value', (snapshot) => {
        snapshot.forEach((dateSnapshot) => {
            dateSnapshot.forEach((childSnapshot) => {
                const data = childSnapshot.val();
                const pcNumber = data.pcNumber;
                const tdElement = document.getElementById(`pcNumber-${pcNumber}`);
                if (tdElement) {
                    tdElement.style.backgroundColor = 'green';
                    tdElement.style.color = 'white';
                }
            });
        });
    }, (error) => {
        console.error("Error fetching data: ", error);
    });
}

// Call fetchDataAndHighlight to load the data and highlight cells when the page loads
window.onload = fetchDataAndHighlight;
