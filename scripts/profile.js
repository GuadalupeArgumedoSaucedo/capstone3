"use strict";

document.addEventListener("DOMContentLoaded", () => {
    // Check if user is logged in
    if (!isLoggedIn()) {
        window.location.replace("index.html");
        return;
    }

    const logoutButton = document.getElementById('logout-button');
    const postForm = document.getElementById('post-form');

    // Function to handle logout
    logoutButton.addEventListener('click', () => {
        logout();
    });

    // Function to handle post creation
    postForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const postContent = document.getElementById('post-content').value;
        const loginData = getLoginData();

        if (!postContent) {
            alert('Post content cannot be empty.');
            return;
        }

        const postData = {
            content: postContent,
        };

        try {
            const response = await fetch(`http://microbloglite.us-east-2.elasticbeanstalk.com/api/posts`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${loginData.token}`,
                },
                body: JSON.stringify(postData),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error('Network response was not ok ' + response.statusText);
            }

            const result = await response.json();
            console.log(result);
            // Optionally, you can clear the form or show a success message here
            document.getElementById('post-content').value = '';
            alert('Post created successfully.');

        } catch (error) {
            console.error('There has been a problem with your fetch operation:', error);
            alert('Failed to create post: ' + error.message);
        }
    });
});

