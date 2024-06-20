/* Register Page JavaScript */

"use strict";

const apiBaseURL = "http://microbloglite.us-east-2.elasticbeanstalk.com";

document.querySelector("#register").onsubmit = function (event) {
    event.preventDefault();
    
    // Collect registration data from the form
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
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            // If there's an error in the registration, display an alert and re-enable the button
            alert(data.error.message);
            event.target.registerButton.disabled = false;
        } else {
            // If registration is successful, inform the user and redirect to the login page
            alert("Registration successful! Please log in.");
            window.location.href = "index.html";
        }
    })
    .catch(error => {
        // Handle any other errors that may occur
        console.error("Error:", error);
        event.target.registerButton.disabled = false;
    });
};

