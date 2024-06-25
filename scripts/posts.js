"use strict";

document.addEventListener("DOMContentLoaded", () => {
    // Check if user is logged in
    if (!isLoggedIn()) {
        window.location.replace("index.html");
        return;
    }

    const postsContainer = document.getElementById('posts-container');
    const logoutButton = document.getElementById('logout-button');

    // Function to fetch and display posts
    async function fetchPosts() {
        const loginData = getLoginData(); // Retrieve login data from localStorage
        const options = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${loginData.token}` // Add the token to the headers
            }
        };
        
        try {
            const response = await fetch(apiBaseURL + '/api/posts', options);
            if (!response.ok) {
                throw new Error('Network response was not ok: ' + response.statusText);
            }
            const posts = await response.json();
            console.log('Fetched posts:', posts); // Log posts for debugging
            displayPosts(posts);
        } catch (error) {
            console.error('There has been a problem with your fetch operation:', error);
        }
    }

    // Function to display posts
    function displayPosts(posts) {
        postsContainer.innerHTML = ''; // Clear any existing posts
        posts.forEach(post => {
            const postElement = document.createElement('div');
            postElement.className = 'col-12 mb-4';
            postElement.innerHTML = `
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title">${post.username}</h5>
                        <h6 class="card-subtitle mb-2 text-muted">${new Date(post.createdAt).toLocaleString()}</h6>
                        <p class="card-text">${post.text}</p>
                    </div>
                </div>
            `;
            postsContainer.appendChild(postElement);
        });
    }

    // Function to handle logout
    logoutButton.addEventListener('click', () => {
        logout();
    });

    // Fetch and display posts on page load
    fetchPosts();
});



