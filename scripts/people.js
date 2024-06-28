document.addEventListener('DOMContentLoaded', async function() {
    const usersList = document.getElementById('users-list');
    const searchBar = document.getElementById('search-bar');
    const logoutButton = document.getElementById('logout-button'); // Assuming you have a logout button in your HTML
  
    function getLoginData() {
        const loginJSON = window.localStorage.getItem("login-data");
        return JSON.parse(loginJSON) || {};
    }

    async function fetchUsers() {
        const loginData = getLoginData();
        if (!loginData.token) {
            usersList.innerHTML = '<p>User is not logged in.</p>';
            return;
        }

        try {
            const response = await fetch('http://microbloglite.us-east-2.elasticbeanstalk.com/api/users?limit=100&offset=0', {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${loginData.token}`
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const users = await response.json();
            displayUsers(users);
        } catch (error) {
            console.error('Error fetching users:', error);
            usersList.innerHTML = '<p>Failed to fetch users.</p>';
        }
    }
  
    function displayUsers(users) {
        usersList.innerHTML = '';
        users.forEach(user => {
            const userCard = document.createElement('div');
            userCard.classList.add('user-card');
            userCard.innerHTML = `
                <h3>${user.fullName}</h3>
                <p>@${user.username}</p>
                <p>${user.bio}</p>
                <p>Joined: ${new Date(user.createdAt).toLocaleDateString()}</p>
            `;
            usersList.appendChild(userCard);
        });
    }
  
    async function searchUser(username) {
        const loginData = getLoginData();
        if (!loginData.token) {
            usersList.innerHTML = '<p>User is not logged in.</p>';
            return;
        }

        try {
            const response = await fetch(`http://microbloglite.us-east-2.elasticbeanstalk.com/api/users/${username}`, {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${loginData.token}`
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const user = await response.json();
            displayUsers([user]);
        } catch (error) {
            console.error('Error fetching user:', error);
            usersList.innerHTML = '<p>Failed to fetch user.</p>';
        }
    }
  
    searchBar.addEventListener('input', function(event) {
        const query = event.target.value.trim();
        if (query) {
            searchUser(query);
        } else {
            fetchUsers();
        }
    });

    // Event listener for logout button
    logoutButton.addEventListener('click', function() {
        logout();
    });
  
    fetchUsers();
});

