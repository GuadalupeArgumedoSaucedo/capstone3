/* Register Page JavaScript */

"use strict"; // Enable strict mode to enforce cleaner JavaScript and better error handling

const apiBaseURL = "http://microbloglite.us-east-2.elasticbeanstalk.com"; // Base URL for the API endpoints

document.querySelector("#register").onsubmit = function (event) {
    event.preventDefault(); // Prevent the default form submission behavior

    // Collect registration data from the form
    const registerData = {
        username: event.target.username.value, // Retrieve username from the form input
        fullName: event.target.fullName.value, // Retrieve full name from the form input
        password: event.target.password.value, // Retrieve password from the form input
    };

    // Disable the register button to prevent multiple submissions
    event.target.registerButton.disabled = true;

    // Perform a POST request to register the new user
    fetch(apiBaseURL + "/api/users", {
        method: "POST", // HTTP method for the request is POST
        headers: {
            "Content-Type": "application/json", // Specify JSON content type for the request
        },
        body: JSON.stringify(registerData), // Convert registerData object to JSON string for the request body
    })
    .then(response => response.json()) // Parse the JSON response from the server
    .then(data => {
        if (data.error) {
            // If there's an error in the registration, display an alert with the error message
            alert(data.error.message);
            // Re-enable the register button to allow user to correct input and try again
            event.target.registerButton.disabled = false;
        } else {
            // If registration is successful, inform the user with an alert
            alert("Registration successful! Please log in.");
            // Redirect the user to the login page
            window.location.href = "index.html";
        }
    })
    .catch(error => {
        // Handle any other errors that may occur during the fetch operation
        console.error("Error:", error);
        // Re-enable the register button in case of error to allow retry
        event.target.registerButton.disabled = false;
    });
};


