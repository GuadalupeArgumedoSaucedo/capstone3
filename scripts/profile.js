'use strict';

document.addEventListener("DOMContentLoaded", () => {
    // Check if user is logged in
    if (!isLoggedIn()) {
        window.location.replace("index.html"); // Redirect to index.html if user is not logged in
        return;
    }

    const logoutButton = document.getElementById('logout-button'); // Reference to the logout button element
    const postForm = document.getElementById('post-form'); // Reference to the form element for creating posts
    const editProfileForm = document.getElementById('edit-profile-form'); // Reference to the form element for editing profile

    // Function to handle logout when logout button is clicked
    logoutButton.addEventListener('click', () => {
        logout(); // Call the logout function (presumably logs the user out)
    });

    // Function to handle post creation when the post form is submitted
    postForm.addEventListener('submit', async (event) => {
        event.preventDefault(); // Prevent the default form submission behavior

        // Retrieve the content of the post from the form input
        const postContent = document.getElementById('post-content').value;

        // Retrieve login data (like username and token) from localStorage
        const loginData = getLoginData();

        // Validate that the post content is not empty
        if (!postContent) {
            alert('Post content cannot be empty.'); // Alert user if post content is empty
            return;
        }

        // Prepare data to send as JSON for creating a new post
        const postData = {
            text: postContent, // Assign the post content to the 'text' property
        };

        try {
            // Send a POST request to the API endpoint to create a new post
            const response = await fetch(apiBaseURL + "/api/posts", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json", // Specify JSON content type
                    "Authorization": `Bearer ${loginData.token}`, // Attach authorization token in the header
                },
                body: JSON.stringify(postData), // Convert postData object to JSON string for the request body
            });

            // Check if the response is not successful
            if (!response.ok) {
                const errorText = await response.text(); // Get error message from response body
                throw new Error('Network response was not ok: ' + errorText); // Throw an error with the error message
            }

            // If successful, parse the response JSON
            const result = await response.json();
            console.log(result); // Log the result (optional)

            // Optionally, clear the form input or show a success message
            document.getElementById('post-content').value = ''; // Clear the form input after successful post creation
            alert('Post created successfully.'); // Show an alert to notify user of successful post creation

        } catch (error) {
            console.error('There has been a problem with your fetch operation:', error); // Log error if fetch operation fails
            alert('Failed to create post: ' + error.message); // Show an alert to notify user of failed post creation
        }
    });

    // Function to handle profile update when the edit profile form is submitted
    editProfileForm.addEventListener('submit', async (event) => {
        event.preventDefault(); // Prevent the default form submission behavior

        // Retrieve user information from the form inputs
        const username = document.getElementById('username').value;
        const fullName = document.getElementById('full-name').value;
        const bio = document.getElementById('bio').value;
        const password = document.getElementById('password').value;

        // Retrieve login data (like username and token) from localStorage
        const loginData = getLoginData();

        // Prepare data to send as JSON for updating user information
        const profileData = {
            username: username,
            fullName: fullName,
            bio: bio,
            password: password
        };

        try {
            // Send a PUT request to the API endpoint to update user information
            const response = await fetch(apiBaseURL + `/api/users/${username}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json", // Specify JSON content type
                    "Authorization": `Bearer ${loginData.token}`, // Attach authorization token in the header
                },
                body: JSON.stringify(profileData), // Convert profileData object to JSON string for the request body
            });

            // Check if the response is not successful
            if (!response.ok) {
                const errorText = await response.text(); // Get error message from response body
                throw new Error('Network response was not ok: ' + errorText); // Throw an error with the error message
            }

            // If successful, parse the response JSON
            const result = await response.json();
            console.log(result); // Log the result (optional)

            // Optionally, clear the form input or show a success message
            alert('Profile updated successfully.'); // Show an alert to notify user of successful profile update

        } catch (error) {
            console.error('There has been a problem with your fetch operation:', error); // Log error if fetch operation fails
            alert('Failed to update profile: ' + error.message); // Show an alert to notify user of failed profile update
        }
    });
});
