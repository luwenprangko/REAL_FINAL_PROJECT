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

function fetchDataAndHighlight() {
    const refPath = 'com-lab-2/';

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
                if (!data.timeOut) {
                    // Highlight cell if timeOut is not set
                    dataExists = true;
                    tdElement.style.backgroundColor = 'green';
                    tdElement.style.color = 'white';
                    tdElement.onclick = () => displayStudentDetail(data);
                } else {
                    // Reset cell styles if timeOut is set
                    tdElement.style.backgroundColor = '';
                    tdElement.style.color = '';
                    tdElement.onclick = displayVacant;
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
    
    console.log('Data copied to clipboard');
}

// Function to display "Vacant" in the div
function displayVacant() {
    const studentDetailDiv = document.getElementById('student-detail');
    studentDetailDiv.innerHTML = '<p>Vacant</p>';
}

// Call fetchDataAndHighlight to load the data and highlight cells when the page loads
window.onload = fetchDataAndHighlight;
