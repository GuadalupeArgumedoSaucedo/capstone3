/* Posts Page JavaScript */

"use strict";

document.addEventListener("DOMContentLoaded", () => {
    // Check if user is logged in
    if (isLoggedIn() === false) {
        window.location.replace("index.html");
        return;
    }

    const postsContainer = document.getElementById('posts-container');
    const logoutButton = document.getElementById('logout-button');

    // Function to fetch and display posts
    async function fetchPosts() {
        try {
            const response = await fetch('http://microbloglite.us-east-2.elasticbeanstalk.com/api/posts');  // Adjust the URL to your API endpoint
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            const posts = await response.json();
            displayPosts(posts);
        } catch (error) {
            console.error('There has been a problem with your fetch operation:', error);
        }
    }

    // Function to display posts
    function displayPosts(posts) {
        postsContainer.innerHTML = '';
        posts.forEach(post => {
            const postElement = document.createElement('div');
            postElement.className = 'col-12 mb-4';
            postElement.innerHTML = `
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title">${post.author}</h5>
                        <h6 class="card-subtitle mb-2 text-muted">${new Date(post.timestamp).toLocaleString()}</h6>
                        <p class="card-text">${post.content}</p>
                    </div>
                </div>
            `;
            postsContainer.appendChild(postElement);
        });
    }

    // Function to handle logout
    logoutButton.addEventListener('click', () => {
        logout();  // Assuming logout() is defined in auth.js
    });

    // Fetch and display posts on page load
    fetchPosts();
});