document.addEventListener("DOMContentLoaded", async function () {
    const usersList = document.getElementById("users-list"); 
    const searchBar = document.getElementById("search-bar"); 
    const logoutButton = document.getElementById("logout-button"); 

    // Function to retrieve login data from local storage
    function getLoginData() {
        const loginJSON = window.localStorage.getItem("login-data");
        return JSON.parse(loginJSON) || {};
    }

    // Function to fetch and display a list of users
    async function fetchUsers() {
        const loginData = getLoginData();
        // Check if user is logged in
        if (!loginData.token) {
            usersList.innerHTML = "<p>User is not logged in.</p>"; // Display message if not logged in
            return;
        }

        try {
            // Fetch list of users from the API
            const response = await fetch("http://microbloglite.us-east-2.elasticbeanstalk.com/api/users?limit=100&offset=0", {
                headers: {
                    Accept: "application/json",
                    Authorization: `Bearer ${loginData.token}`, // Send authorization token
                },
            });

            // Check if the response is successful
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            // Parse the JSON response
            const users = await response.json();
            displayUsers(users); // Display fetched users
        } catch (error) {
            console.error("Error fetching users:", error);
            usersList.innerHTML = "<p>Failed to fetch users.</p>"; // Display error message
        }
    }

    // Function to display users in the UI
    function displayUsers(users) {
        usersList.innerHTML = ""; // Clear previous user cards
        users.forEach((user) => {
            // Create a div element for each user
            const userCard = document.createElement("div");
            userCard.classList.add("user-card"); // Add a CSS class for styling
            // Populate user information inside the user card
            userCard.innerHTML = `
                <h3>${user.fullName}</h3>
                <p>@${user.username}</p>
                <p>${user.bio}</p>
                <p>Joined: ${new Date(user.createdAt).toLocaleDateString()}</p>
            `;
            usersList.appendChild(userCard); // Append the user card to the list
        });
    }

    // Function to search for a specific user by username
    async function searchUser(username) {
        const loginData = getLoginData();
        // Check if user is logged in
        if (!loginData.token) {
            usersList.innerHTML = "<p>User is not logged in.</p>"; // Display message if not logged in
            return;
        }

        try {
            // Fetch user data for the specified username
            const response = await fetch(`http://microbloglite.us-east-2.elasticbeanstalk.com/api/users/${username}`, {
                headers: {
                    Accept: "application/json",
                    Authorization: `Bearer ${loginData.token}`, // Send authorization token
                },
            });

            // Check if the response is successful
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            // Parse the JSON response
            const user = await response.json();
            displayUsers([user]); // Display the fetched user
        } catch (error) {
            console.error("Error fetching user:", error);
            usersList.innerHTML = "<p>Failed to fetch user.</p>"; // Display error message
        }
    }

    // Event listener for input changes in the search bar
    searchBar.addEventListener("input", function (event) {
        const query = event.target.value.trim(); // Get the trimmed value of the search input
        if (query) {
            searchUser(query); // If there is a query, search for the user
        } else {
            fetchUsers(); // Otherwise, fetch and display all users
        }
    });

    // Event listener for clicking the logout button
    logoutButton.addEventListener("click", function () {
        logout(); // Call the logout function when the button is clicked
    });

    fetchUsers(); // Initial fetch and display of users when the page loads
});

