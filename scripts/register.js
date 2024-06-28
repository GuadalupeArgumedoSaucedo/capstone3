/* Register Page JavaScript */

"use strict";

const apiBaseURL = "http://microbloglite.us-east-2.elasticbeanstalk.com"; 

// Event listener for form submission on the register form
document.querySelector("#register").onsubmit = function (event) {
    event.preventDefault(); // Prevent the default form submission behavior

    // Collect registration data from the form inputs
    const registerData = {
        username: event.target.username.value, 
        fullName: event.target.fullName.value, 
        password: event.target.password.value, 
    };

    // Disable the register button to prevent multiple submissions
    event.target.registerButton.disabled = true;

    // Perform a POST request to register the new user
    fetch(apiBaseURL + "/api/users", {
        method: "POST", 
        headers: {
            "Content-Type": "application/json", 
        },
        body: JSON.stringify(registerData), 
    })
        .then((response) => response.json()) 
        .then((data) => {
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
        .catch((error) => {
            // Handle any other errors that may occur during the fetch operation
            console.error("Error:", error);
            // Re-enable the register button in case of error to allow retry
            event.target.registerButton.disabled = false;
        });
};

