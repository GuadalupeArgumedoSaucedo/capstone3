"use strict";

document.addEventListener("DOMContentLoaded", async () => {
    // Check if the user is logged in by calling isLoggedIn() function
    if (!isLoggedIn()) {
        // Redirect to index.html if not logged in
        window.location.replace("index.html");
        return; // Exit the function early if redirected
    }

    // Get references to important DOM elements
    const logoutButton = document.getElementById("logout-button"); 
    const postForm = document.getElementById("post-form"); 
    const editProfileForm = document.getElementById("edit-profile-form"); 
    const profileInfo = document.getElementById("profile-info"); 
    const userPosts = document.getElementById("user-posts"); 

    // Event listener for clicking logout button
    logoutButton.addEventListener("click", () => {
        logout(); // Calls logout function when clicked
    });

    // Function to fetch and display user profile information
    const displayUserProfile = async () => {
        const loginData = getLoginData(); // Retrieves user's login data
        try {
            // Fetch user profile data from the API
            const profileResponse = await fetch(apiBaseURL + `/api/users/${loginData.username}`, {
                headers: {
                    Authorization: `Bearer ${loginData.token}`,
                },
            });

            if (!profileResponse.ok) {
                throw new Error("Failed to fetch profile data"); // Throws error if fetching profile fails
            }

            const profileData = await profileResponse.json(); // Parses JSON response
            const { username, fullName, bio } = profileData; // Destructures profile data

            // Display profile information in HTML
            profileInfo.innerHTML = `
                <p><strong>Username:</strong> ${username}</p>
                <p><strong>Full Name:</strong> ${fullName}</p>
                <p><strong>Bio:</strong> ${bio || "No bio provided"}</p>
            `;
        } catch (error) {
            console.error("Error fetching profile:", error); // Logs error if fetching profile fails
            profileInfo.innerHTML = "<p>Failed to fetch profile information.</p>"; // Displays error message
        }
    };

    // Function to fetch and display user's posts
    const displayUserPosts = async () => {
        const loginData = getLoginData(); // 
        const username = loginData.username; 

        try {
            // Fetch user's posts from the API
            const postsResponse = await fetch(`${apiBaseURL}/api/posts?limit=100&offset=0&username=${username}`, {
                headers: {
                    Authorization: `Bearer ${loginData.token}`, // Include authorization token in headers
                },
            });

            if (!postsResponse.ok) {
                throw new Error(`Failed to fetch user posts: ${postsResponse.status} ${postsResponse.statusText}`); // Throws error if fetching posts fails
            }

            const postsData = await postsResponse.json(); // Parses JSON response

            // Display user's posts in HTML
            if (postsData.length === 0) {
                userPosts.innerHTML = "<p>No posts yet.</p>"; // Displays message if no posts found
            } else {
                userPosts.innerHTML = postsData
                    .map(
                        (post) => `
                    <div class="card mb-3">
                        <div class="card-body">
                            <p class="card-text">${post.text}</p>
                            <p class="card-text"><small class="text-muted">${new Date(post.createdAt).toLocaleString()}</small></p>
                            <span class="like-count ms-2" id="like-count-${post._id}">${post.likes.length}</span>
                        </div>
                    </div>
                `
                    )
                    .join(""); // Generates HTML for each post and joins into a string
            }
        } catch (error) {
            console.error("Error fetching user posts:", error); // Logs error if fetching posts fails
            userPosts.innerHTML = `<p>Failed to fetch user posts. Error: ${error.message}</p>`; // Displays error message
        }
    };

    // Load user profile information and posts when the page loads
    await Promise.all([
        displayUserProfile(), 
        displayUserPosts(), 
    ]);

    // Event listener for submitting the post creation form
    postForm.addEventListener("submit", async (event) => {
        event.preventDefault(); // Prevents default form submission behavior

        const postContent = document.getElementById("post-content").value; 
        const loginData = getLoginData(); 

        if (!postContent) {
            alert("Post content cannot be empty."); 
            return; // Exits function if post content is empty
        }

        // Data to send as JSON for creating a new post
        const postData = {
            text: postContent, // Assigns post content to 'text' property
        };

        try {
            // Sends a POST request to API endpoint to create a new post
            const response = await fetch(apiBaseURL + "/api/posts", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json", 
                    Authorization: `Bearer ${loginData.token}`, 
                },
                body: JSON.stringify(postData), 
            });

            // Throws error if response is not successful
            if (!response.ok) {
                const errorText = await response.text(); // Retrieves error message from response body
                throw new Error("Network response was not ok: " + errorText); // Throws error with error message
            }

            const result = await response.json(); // Parses JSON response
            console.log(result); // Logs the result (optional)

            document.getElementById("post-content").value = ""; 
            alert("Post created successfully."); 

            await displayUserPosts(); // Refreshes user posts after successful creation
        } catch (error) {
            console.error("There has been a problem with your fetch operation:", error); 
            alert("Failed to create post: " + error.message); 
        }
    });

    // Event listener for submitting the edit profile form
    editProfileForm.addEventListener("submit", async (event) => {
        event.preventDefault(); // Prevents default form submission behavior

        // Retrieves user information from form inputs
        const username = document.getElementById("username").value;
        const fullName = document.getElementById("full-name").value;
        const bio = document.getElementById("bio").value;
        const password = document.getElementById("password").value;

        const loginData = getLoginData(); 

        // Data to send as JSON for updating user information
        const profileData = {
            username: username,
            fullName: fullName,
            bio: bio,
            password: password,
        };

        try {
            // Sends a PUT request to API endpoint to update user information
            const response = await fetch(apiBaseURL + `/api/users/${username}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json", 
                    Authorization: `Bearer ${loginData.token}`, 
                },
                body: JSON.stringify(profileData), 
            });

            // Throws error if response is not successful
            if (!response.ok) {
                const errorText = await response.text(); // Retrieves error message from response body
                throw new Error("Network response was not ok: " + errorText); // Throws error with error message
            }

            const result = await response.json(); // Parses JSON response
            console.log(result); 

            alert("Profile updated successfully."); 

            await displayUserProfile(); // Refreshes profile information after successful update
        } catch (error) {
            console.error("There has been a problem with your fetch operation:", error); 
            alert("Failed to update profile: " + error.message); 
        }
    });
});

// Another event listener for when the DOM is fully loaded
document.addEventListener("DOMContentLoaded", () => {
    const modeToggleCheckbox = document.querySelector(".switch .input"); 
    const body = document.body;

    // Check if user has a stored preference for dark mode
    const isDarkMode = localStorage.getItem("darkMode") === "true";

    // Function to enable dark mode
    const enableDarkMode = () => {
        body.classList.add("dark-mode"); // Adds 'dark-mode' class to body for dark mode styles
        localStorage.setItem("darkMode", "true"); // Stores dark mode preference in local storage
    };

    // Function to enable light mode
    const enableLightMode = () => {
        body.classList.remove("dark-mode"); // Removes 'dark-mode' class from body for light mode styles
        localStorage.setItem("darkMode", "false"); // Stores light mode preference in local storage
    };

    // Event listener for toggle switch change
    modeToggleCheckbox.addEventListener("change", () => {
        if (modeToggleCheckbox.checked) {
            enableDarkMode(); 
        } else {
            enableLightMode(); 
        }
    });

    // Initialize mode based on user's stored preference
    if (isDarkMode) {
        modeToggleCheckbox.checked = true; // Sets toggle switch to checked if dark mode preference is stored
        enableDarkMode(); 
    } else {
        enableLightMode(); 
    }
});

