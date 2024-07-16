// // Initialize Firebase with your project's config
// const firebaseConfig = {
//     apiKey: "AIzaSyAdssKrSZdB5MeO6bLlzs9ra42XSsQbNlg",
//     authDomain: "comlab-41b63.firebaseapp.com",
//     projectId: "comlab-41b63",
//     storageBucket: "comlab-41b63.appspot.com",
//     messagingSenderId: "573050227714",
//     appId: "1:573050227714:web:8c3720298c64b470fb6b1b"
// };

// // Initialize Firebase
// const firebaseApp = firebase.initializeApp(firebaseConfig);

// // Get a reference to the database service
// const database = firebaseApp.database();

// // Function to fetch and highlight data from Firebase
// function fetchDataAndHighlight() {
//     database.ref().on('value', (snapshot) => {
//         snapshot.forEach((dateSnapshot) => {
//             dateSnapshot.forEach((childSnapshot) => {
//                 const data = childSnapshot.val();
//                 const pcNumber = data.pcNumber;
//                 const tdElement = document.getElementById(`pcNumber-${pcNumber}`);
//                 if (tdElement) {
//                     tdElement.style.backgroundColor = 'green';
//                     tdElement.style.color = 'white';
//                 }
//             });
//         });
//     }, (error) => {
//         console.error("Error fetching data: ", error);
//     });
// }

// // Call fetchDataAndHighlight to load the data and highlight cells when the page loads
// window.onload = fetchDataAndHighlight;



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

// Function to fetch and highlight data from Firebase
function fetchDataAndHighlight() {
    database.ref().on('value', (snapshot) => {
        // Clear all cell styles and set vacant click event
        document.querySelectorAll('td.all-pc').forEach(tdElement => {
            tdElement.style.backgroundColor = '';
            tdElement.style.color = '';
            tdElement.onclick = displayVacant;
        });

        let dataExists = false;

        // Highlight cells based on the data
        snapshot.forEach((dateSnapshot) => {
            dateSnapshot.forEach((childSnapshot) => {
                const data = childSnapshot.val();
                const pcNumber = data.pcNumber;
                const tdElement = document.getElementById(`pcNumber-${pcNumber}`);
                if (tdElement) {
                    if (data.timeOut) {
                        // Reset cell styles to default if timeOut is set
                        tdElement.style.backgroundColor = '';
                        tdElement.style.color = '';
                        tdElement.onclick = displayVacant;
                    } else {
                        // Highlight cell if timeOut is not set
                        dataExists = true;
                        tdElement.style.backgroundColor = 'green';
                        tdElement.style.color = 'white';
                        tdElement.onclick = () => displayStudentDetail(data);
                    }
                }
            });
        });

        // Clear student details if no data exists
        if (!dataExists) {
            displayVacant();
        }
    }, (error) => {
        console.error("Error fetching data: ", error);
    });
}

// // Function to display student details in the div
// function displayStudentDetail(data) {
//     const studentDetailDiv = document.getElementById('student-detail');
//     studentDetailDiv.innerHTML = `
//         <span>${data.lastName}</span>
//         <span> ${data.firstName}</span>
//         <span> ${data.middleInitial}</span>
//         <div>PC #: ${data.pcNumber}</div>
//         <div>Time In: ${data.timeIn}</div>
//         <a href=""><button>Report</button></a>
//     `;
// }

// Function to display student details in the div
function displayStudentDetail(data) {
    const studentDetailDiv = document.getElementById('student-detail');
    studentDetailDiv.innerHTML = `
        <span>${data.lastName}</span>
        <span>${data.firstName}</span>
        <span>${data.middleInitial}</span>
        <div>PC #: ${data.pcNumber}</div>
        <div>Time In: ${data.timeIn}</div>
        <button onclick="copyData('${data.lastName}', '${data.firstName}', '${data.middleInitial}', '${data.pcNumber}', '${data.timeIn}')">Report</button>
    `;
}

// Function to copy data
function copyData(lastName, firstName, middleInitial, pcNumber, timeIn) {
    const dataToCopy = `${lastName}, ${firstName} ${middleInitial} | PC #: ${pcNumber} | Time In: ${timeIn}`;
    
    // Create a temporary textarea element
    const textarea = document.createElement('textarea');
    textarea.value = dataToCopy;
    document.body.appendChild(textarea);
    
    // Select the text and copy it
    textarea.select();
    document.execCommand('copy');
    
    // Clean up - remove the textarea
    document.body.removeChild(textarea);
    
    // Optionally, you can show a success message or perform any other action
    console.log('Data copied to clipboard');
}


// Function to display "Vacant" in the div
function displayVacant() {
    const studentDetailDiv = document.getElementById('student-detail');
    studentDetailDiv.innerHTML = '<p>Vacant</p>';
}

// Call fetchDataAndHighlight to load the data and highlight cells when the page loads
window.onload = fetchDataAndHighlight;