'use strict';

document.addEventListener("DOMContentLoaded", () => {
    // Check if user is logged in
    if (!isLoggedIn()) {
        window.location.replace("index.html"); // Redirect to index.html if not logged in
        return;
    }

    const postsContainer = document.getElementById('posts-container'); // Reference to the container where posts will be displayed
    const logoutButton = document.getElementById('logout-button'); // Reference to the logout button on the page

    // Function to retrieve posts (example using a global variable)
    function getPosts() {
        // Replace with your actual implementation to fetch or return posts
        return posts; // Assuming posts is a global variable or fetched from an API
    }

    // Function to find user's like for a specific post
    function findUserLike(postId) {
        const loginData = getLoginData(); // Retrieve login data from localStorage
        const posts = getPosts(); // Retrieve posts using your implementation

        // Find the post in the list
        const post = posts.find(p => p._id === postId);
        if (!post) return null;

        // Find user's like in post.likes array
        return post.likes.find(like => like.username === loginData.username);
    }

    // Function to handle like button click
    async function handleLikeButtonClick(event) {
        const button = event.target; // Get the clicked button element
        const postId = button.getAttribute('data-post-id'); // Get the post ID from the button's data attribute
        const liked = button.getAttribute('data-liked') === 'true'; // Check if the button was previously liked or not
        const likeCountElement = document.getElementById(`like-count-${postId}`); // Get the element displaying like count
    
        if (!postId) {
            console.error('Post ID is not defined'); // Log error if post ID is missing
            return;
        }
    
        const loginData = getLoginData(); // Retrieve login data from localStorage
    
        try {
            let response;
            if (liked) {
                // Find the like ID to be deleted
                const like = findUserLike(postId);
                if (!like) {
                    console.error('User did not like this post'); // Log error if user did not like this post
                    return;
                }
                
                const options = {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${loginData.token}` // Attach authorization token for API request
                    }
                };
                response = await fetch(`${apiBaseURL}/api/likes/${like._id}`, options); // Send request to remove the like
            } else {
                const options = {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${loginData.token}` // Attach authorization token for API request
                    },
                    body: JSON.stringify({ postId }) // Send request to like the post with post ID in request body
                };
                response = await fetch(`${apiBaseURL}/api/likes`, options); // Send request to like the post
            }
    
            if (!response.ok) {
                throw new Error('Network response was not ok: ' + response.statusText); // Throw error if response is not successful
            }
    
            const likeData = await response.json(); // Parse JSON response into JavaScript object
    
            // Update button state based on like/unlike action
            button.setAttribute('data-liked', !liked); // Toggle liked state
            button.textContent = liked ? 'Like' : 'Unlike'; // Change button text based on current state
    
            // Update like count displayed on the webpage
            const currentLikes = parseInt(likeCountElement.textContent, 10); // Get current number of likes
            likeCountElement.textContent = liked ? currentLikes - 1 : currentLikes + 1; // Increment or decrement like count based on like/unlike action
        } catch (error) {
            console.error('There has been a problem with your fetch operation:', error); // Log error if like/unlike operation fails
        }
    }

    // Function to fetch and display posts
    async function fetchPosts() {
        const loginData = getLoginData(); // Retrieve login data (like username and token) from localStorage
        const options = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${loginData.token}` // Attach authorization token for API request
            }
        };
        
        try {
            const response = await fetch(apiBaseURL + '/api/posts', options); // Fetch posts from API endpoint
            if (!response.ok) {
                throw new Error('Network response was not ok: ' + response.statusText); // Throw error if response is not successful
            }
            const posts = await response.json(); // Parse JSON response into JavaScript object
            console.log('Fetched posts:', posts); // Log fetched posts to console for debugging
            displayPosts(posts); // Call function to display posts on the webpage
        } catch (error) {
            console.error('There has been a problem with fetching posts:', error); // Log error if fetching posts fails
        }
    }

    // Function to display posts on the webpage
    function displayPosts(posts) {
        postsContainer.innerHTML = ''; // Clear existing posts in the container
        posts.forEach(post => {
            const userLiked = post.likes.some(like => like.username === getLoginData().username); // Check if current user has liked this post
            const postElement = document.createElement('div'); // Create a new div element for each post
            postElement.className = 'col-12 mb-4'; // Assign class for styling
            postElement.innerHTML = `
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title">${post.username}</h5>
                        <h6 class="card-subtitle mb-2 text-muted">${new Date(post.createdAt).toLocaleString()}</h6>
                        <p class="card-text">${post.text}</p>
                        <button class="btn btn-like" data-post-id="${post._id}" data-liked="${userLiked}">${userLiked ? 'Unlike' : 'Like'}</button>
                        <span class="like-count ms-2" id="like-count-${post._id}">${post.likes.length}</span>
                    </div>
                </div>
            `;
            postsContainer.appendChild(postElement); // Append the post element to the posts container
        });

        // Add event listeners to like buttons
        document.querySelectorAll('.btn-like').forEach(button => {
            button.addEventListener('click', handleLikeButtonClick); // Attach click event listener for each like button
        });
    }

    // Function to handle logout button click
    logoutButton.addEventListener('click', () => {
        logout(); // Call logout function when logout button is clicked
    });

    // Fetch and display posts when the page is fully loaded
    fetchPosts();
});

