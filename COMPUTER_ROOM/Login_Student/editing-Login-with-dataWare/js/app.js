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

// Reference to Firebase authentication and database
const auth = firebase.auth();
const database = firebase.database();

// Get a reference to the login form
const dataForm = document.getElementById('dataForm');

// Function to handle form submission
dataForm.addEventListener('submit', async (e) => {
    e.preventDefault(); // Prevent default form submission

    const submitButton = document.getElementById('submitButton');
    submitButton.disabled = true;

    // Get user input
    const comlab = dataForm['comlab'].value;
    const profName = dataForm['profName'].value;
    const srcode = dataForm['srcode'].value;
    const email = dataForm['email'].value;
    const password = dataForm['password'].value;
    const pcNumber = dataForm['pcNumber'].value;
    const action = submitButton.getAttribute('data-action'); // Get the action type

    try {
        if (action === 'time-in') {
            // Sign in user with Firebase authentication
            const userCredential = await auth.signInWithEmailAndPassword(email, password);
            const user = userCredential.user;

            // Fetch user details (including fullName) from users node
            const userRef = database.ref('users/' + srcode);
            userRef.once('value', (snapshot) => {
                if (snapshot.exists()) {
                    const userData = snapshot.val();
                    const fullName = userData.lastName + ' ' + userData.firstName + ' ' + userData.middleInitial;

                    // Record login timestamp and full name in attendance node
                    const currentDate = new Date();
                    const formattedTimeIn = currentDate.toLocaleTimeString('en-US', {
                        hour: 'numeric',
                        minute: 'numeric',
                        hour12: true
                    });

                    // Format the date as "DD-MM-YYYY"
                    const day = String(currentDate.getDate()).padStart(2, '0');
                    const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Months are zero-based
                    const year = currentDate.getFullYear();

                    const formattedDate = `${day}-${month}-${year}`;

                    // Store user inputs in local storage
                    localStorage.setItem('comlab', comlab);
                    localStorage.setItem('srcode', srcode);
                    localStorage.setItem('email', email);
                    localStorage.setItem('pcNumber', pcNumber);

                    database.ref(comlab + srcode).update({
                        srcode: srcode,
                        date: formattedDate,
                        timeIn: formattedTimeIn,
                        fullName: fullName,
                        pcNumber: pcNumber
                    });

                    // Disable form inputs
                    dataForm['comlab'].disabled = true;
                    dataForm['srcode'].disabled = true;
                    dataForm['email'].disabled = true;
                    dataForm['password'].disabled = true;
                    dataForm['pcNumber'].disabled = true;

                    // Update button for time out
                    submitButton.textContent = 'TIME OUT';
                    submitButton.setAttribute('data-action', 'time-out');
                    submitButton.classList.remove('btn-primary');
                    submitButton.classList.add('btn-danger');

                    // Store current button state in local storage
                    localStorage.setItem('buttonState', 'time-out');

                    // Enable the submit button for time out
                    submitButton.disabled = false;

                    // Display success message (you can replace with redirection or other logic)
                    alert('Login successful!');
                } else {
                    alert('User data not found. Please check your credentials and try again.');
                    submitButton.disabled = false; // Re-enable button on failure
                }
            });
        } else if (action === 'time-out') {
            // Update time out functionality
            const currentDate = new Date();
            const formattedTimeOut = currentDate.toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: 'numeric',
                hour12: true
            });

            const storedSrcode = localStorage.getItem('srcode');

            // Move data from comlab to dataWare
            const comlabRef = database.ref(comlab + storedSrcode);
            comlabRef.once('value', (snapshot) => {
                if (snapshot.exists()) {
                    const data = snapshot.val();
                    data.timeOut = formattedTimeOut; // Add timeOut to data

                    // Save to dataWare
                    database.ref('dataWare/' + storedSrcode).set(data, (error) => {
                        if (!error) {
                            // Remove data from comlab
                            comlabRef.remove();

                            // Clear local storage
                            localStorage.removeItem('comlab');
                            localStorage.removeItem('srcode');
                            localStorage.removeItem('email');
                            localStorage.removeItem('pcNumber');
                            localStorage.removeItem('buttonState');

                            // Reset form and button
                            dataForm.reset();
                            submitButton.textContent = 'TIME IN';
                            submitButton.setAttribute('data-action', 'time-in');
                            submitButton.classList.remove('btn-danger');
                            submitButton.classList.add('btn-primary');

                            // Enable form inputs
                            dataForm['comlab'].disabled = false;
                            dataForm['srcode'].disabled = false;
                            dataForm['email'].disabled = false;
                            dataForm['password'].disabled = false;
                            dataForm['pcNumber'].disabled = false;

                            alert('Time out successful!');
                        } else {
                            console.error('Error moving data to dataWare:', error);
                            alert('Failed to move data to archive. Please try again.');
                            submitButton.disabled = false; // Re-enable button on failure
                        }
                    });
                } else {
                    console.error('Error fetching data for time out');
                    alert('Failed to fetch data for time out. Please try again.');
                    submitButton.disabled = false; // Re-enable button on failure
                }
            });
        }
    } catch (error) {
        // Handle errors during login or timeout
        console.error('Error:', error.message);
        alert('Operation failed. Please try again.');
        submitButton.disabled = false; // Re-enable button on error
    }
});

// Check local storage on page load
window.addEventListener('load', () => {
    const storedComlab = localStorage.getItem('comlab');
    const storedSrcode = localStorage.getItem('srcode');
    const storedEmail = localStorage.getItem('email');
    const storedPcNumber = localStorage.getItem('pcNumber');
    const buttonState = localStorage.getItem('buttonState');

    if (storedComlab && storedSrcode && storedEmail && storedPcNumber) {
        // Populate form fields with stored values
        dataForm['comlab'].value = storedComlab;
        dataForm['srcode'].value = storedSrcode;
        dataForm['email'].value = storedEmail;
        dataForm['pcNumber'].value = storedPcNumber;

        // Disable form inputs
        dataForm['comlab'].disabled = true;
        dataForm['srcode'].disabled = true;
        dataForm['email'].disabled = true;
        dataForm['password'].disabled = true;
        dataForm['pcNumber'].disabled = true;

        // Set button state based on local storage
        const submitButton = document.getElementById('submitButton');
        if (buttonState === 'time-out') {
            submitButton.textContent = 'TIME OUT';
            submitButton.setAttribute('data-action', 'time-out');
            submitButton.classList.remove('btn-primary');
            submitButton.classList.add('btn-danger');

            // Enable the submit button for time out
            submitButton.disabled = false;
        } else {
            submitButton.textContent = 'TIME IN';
            submitButton.setAttribute('data-action', 'time-in');
            submitButton.classList.remove('btn-danger');
            submitButton.classList.add('btn-primary');
        }
    }
});
