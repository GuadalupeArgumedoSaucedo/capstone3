'use strict';

document.addEventListener("DOMContentLoaded", () => {
    // Check if user is logged in
    if (!isLoggedIn()) {
        window.location.replace("index.html"); // Redirect to index.html if not logged in
        return;
    }

    const postsContainer = document.getElementById('posts-container'); // Reference to the container where posts will be displayed
    const logoutButton = document.getElementById('logout-button'); // Reference to the logout button on the page
    const sortOptions = document.getElementById('sort-options'); // Reference to the sort options dropdown

    // Function to retrieve posts asynchronously
    async function getPosts() {
        try {
            const response = await fetch(`${apiBaseURL}/api/posts`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getLoginData().token}` // Include authorization token
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch posts');
            }

            return await response.json(); // Return parsed JSON response
        } catch (error) {
            console.error('Error fetching posts:', error);
            return []; // Return empty array or handle error as needed
        }
    }

    // Function to find user's like for a specific post
    async function findUserLike(postId) {
        try {
            const loginData = getLoginData(); // Retrieve login data from localStorage
            const posts = await getPosts(); // Await the asynchronous getPosts() function

            // Find the post in the list
            const post = posts.find(p => p._id === postId);
            if (!post) return null;

            // Find user's like in post.likes array
            return post.likes.find(like => like.username === loginData.username);
        } catch (error) {
            console.error('Error finding user like:', error);
            return null; // Handle error appropriately
        }
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
                const like = await findUserLike(postId); // Wait for findUserLike to get the like
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

    // Function to handle post deletion
    async function handlePostDelete(postId) {
        const loginData = getLoginData(); // Retrieve login data (like username and token) from localStorage
        try {
            // Fetch the post details to check if the user is the owner of the post
            const response = await fetch(`${apiBaseURL}/api/posts/${postId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${loginData.token}` // Attach authorization token for API request
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch post details');
            }

            const post = await response.json(); // Parse JSON response into JavaScript object

            // Check if the logged-in user is the owner of the post
            if (post.username !== loginData.username) {
                throw new Error('You can only delete your own posts');
            }

            // Proceed with deleting the post if ownership is confirmed
            const deleteResponse = await fetch(`${apiBaseURL}/api/posts/${postId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${loginData.token}` // Attach authorization token for API request
                }
            });

            if (!deleteResponse.ok) {
                throw new Error('Failed to delete post');
            }

            // Remove the deleted post from the UI
            const postElement = document.getElementById(`post-${postId}`);
            if (postElement) {
                postElement.remove();
            }
        } catch (error) {
            console.error('Error deleting post:', error); // Log error if post deletion fails
        }
    }

    // Function to fetch and display posts
    async function fetchPosts() {
        const posts = await getPosts(); // Retrieve posts asynchronously
        const sortBy = sortOptions.value; // Get the selected sort option

        if (sortBy === 'author') {
            posts.sort((a, b) => a.username.localeCompare(b.username)); // Sort posts by author name
        } else {
            posts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); // Sort posts by most recent
        }

        displayPosts(posts); // Display sorted posts
    }

    function displayPosts(posts) {
        postsContainer.innerHTML = ''; // Clear existing posts in the container
        posts.forEach(post => {
            const userLiked = post.likes.some(like => like.username === getLoginData().username); // Check if current user has liked this post
            const postElement = document.createElement('div'); // Create a new div element for each post
            postElement.id = `post-${post._id}`; // Set id for the post element
            postElement.className = 'col-12 mb-4'; // Assign class for styling
    
            // Generate Gravatar URL based on user's email
            const gravatarUrl = `https://www.gravatar.com/avatar/${md5(post.email)}?s=150`;
    
            postElement.innerHTML = `
                <div class="card">
                    <div class="card-body d-flex">
                        <div>
                            <img src="${gravatarUrl}" alt="Profile Picture" class="rounded-circle me-3" style="width: 50px; height: 50px;">
                        </div>
                        <div>
                            <h5 class="card-title">${post.username}</h5>
                            <h6 class="card-subtitle mb-2 text-muted">${new Date(post.createdAt).toLocaleString()}</h6>
                            <p class="card-text">${post.text}</p>
                            <div class = "postButtons">

                            <button class="btn btn-like" data-post-id="${post._id}" data-liked="${userLiked}">${userLiked ? 'Unlike' : 'Like'}</button>
                            
                            <span class = "likeCount" class="like-count ms-2" id="like-count-${post._id}">${post.likes.length}</span>
                            ${post.username === getLoginData().username ? `<button class="btn btn-danger btn-delete" data-post-id="${post._id}" style="margin-left: 10px;">Delete</button>` : ''}
                            </div>
                        </div>
                    </div>
                </div>
            `;
            postsContainer.appendChild(postElement); // Append the post element to the posts container
    
            // Add event listener to delete button (only if the post belongs to the logged-in user)
            if (post.username === getLoginData().username) {
                const deleteButton = postElement.querySelector('.btn-delete');
                if (deleteButton) {
                    deleteButton.addEventListener('click', () => handlePostDelete(post._id));
                }
            }
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

    // Event listener for sort options change
    sortOptions.addEventListener('change', fetchPosts); // Re-fetch and display posts when the sort

    // Fetch and display posts when the page is fully loaded
    fetchPosts();
});

// Get the button:
let mybutton = document.getElementById("myBtn");

// When the user scrolls down 20px from the top of the document, show the button
window.onscroll = function() {scrollFunction()};

function scrollFunction() {
  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    mybutton.style.display = "block";
  } else {
    mybutton.style.display = "none";
  }
}

// When the user clicks on the button, scroll to the top of the document
function topFunction() {
  document.body.scrollTop = 0; // For Safari
  document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
}
  