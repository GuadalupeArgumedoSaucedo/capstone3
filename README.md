# Enjoy the Microblog Project and the MicroblogLite API!

Don't forget to read the [*MicroblogLite* API docs](http://microbloglite.us-east-2.elasticbeanstalk.com/docs) and experiment with the API in *Postman!*

Practice and experimentation provide experience, and experience provides confidence.



Social media website for software developers to network 
![image](https://github.com/GuadalupeArgumedoSaucedo/capstone3/assets/166437700/246a1884-9390-4f8a-9de7-3fefc2f7363b)
![image](https://github.com/GuadalupeArgumedoSaucedo/capstone3/assets/166437700/f12bba18-a826-4187-8331-52ff27e7a360)
![image](https://github.com/GuadalupeArgumedoSaucedo/capstone3/assets/166437700/6c6d08b0-d8fd-4955-835a-f0f21a708c09)
![image](https://github.com/GuadalupeArgumedoSaucedo/capstone3/assets/166437700/6801aaaf-5f94-4483-9463-64a009857669)
![image](https://github.com/GuadalupeArgumedoSaucedo/capstone3/assets/166437700/39cfa677-a519-49a6-ab76-319f4fb8c258)

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

    // Function to display users
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





