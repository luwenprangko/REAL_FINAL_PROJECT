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
const firebaseApp = firebase.initializeApp(firebaseConfig);
const database = firebaseApp.database();


function fetchDataAndHighlight() {
    const refPath = 'com-lab-1/';

    // Clear all cell styles and set vacant click event
    document.querySelectorAll('td.all-pc').forEach(tdElement => {
        tdElement.style.backgroundColor = '';
        tdElement.style.color = '';
        tdElement.onclick = displayVacant;
    });

    database.ref(refPath).on('value', (snapshot) => {
        let dataExists = false;

        snapshot.forEach((childSnapshot) => {
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

        // Clear student details if no data exists
        if (!dataExists) {
            displayVacant();
        }
    }, (error) => {
        console.error("Error fetching data: ", error);
    });
}




// Function to display student details in the div
function displayStudentDetail(data) {
    const studentDetailDiv = document.getElementById('student-detail');
    studentDetailDiv.innerHTML = `
        <span>${data.fullName}</span>
        <div>PC #: ${data.pcNumber}</div>
        <div>Time In: ${data.timeIn}</div>
        <button onclick="copyData('${data.fullName}', '${data.pcNumber}', '${data.timeIn}')">Report</button>
    `;
}

// Function to copy data
function copyData(fullName, pcNumber, timeIn) {
    const dataToCopy = `${fullName} | PC #: ${pcNumber} | Time In: ${timeIn}`;
    
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