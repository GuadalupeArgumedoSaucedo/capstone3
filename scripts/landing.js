/* Landing Page JavaScript */

"use strict";

const loginForm = document.querySelector("#login");

loginForm.onsubmit = function (event) {
    // Prevent the form from refreshing the page,
    // as it will do by default when the Submit event is triggered:
    event.preventDefault();

    // We can use loginForm.username (for example) to access
    // the input element in the form which has the ID of "username".
    const loginData = {
        username: loginForm.username.value,
        password: loginForm.password.value,
    }

    // Disables the button after the form has been submitted already:
    loginForm.loginButton.disabled = true;

    // Time to actually process the login using the function from auth.js!
    //'login' function sends username/password to server and returns a Promise.'then' method handles result of Promise once it resolves.
    login(loginData).then(response => {
        // If 'response' is truthy, login was successful
        if (response) {
            // Redirect the user to the 'posts.html' page
            window.location.href = "posts.html";
            // If 'response' is falsy, login failed (invalid username/password).
        } else {
             // Re-enable the login button so the user can try logging in again.
            loginForm.loginButton.disabled = false;
            // Shows alert stating login incorrect.
            alert("Invalid username or password. Please try again.");
        }
    });
};
