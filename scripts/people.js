document.addEventListener('DOMContentLoaded', async function() {
    const usersList = document.getElementById('users-list');
    const searchBar = document.getElementById('search-bar');
  
    async function fetchUsers() {
        try {
            const response = await fetch('http://microbloglite.us-east-2.elasticbeanstalk.com/api/users?limit=100&offset=0', {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Imxhcmd1bWVkbyIsImlhdCI6MTcxOTU1NzcxNCwiZXhwIjoxNzE5NjQ0MTE0fQ.ER4nZ_f7LHj5zlaO9S6ubLyuBUfa5wQjUxlls0wm9r8'
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
        try {
            const response = await fetch(`http://microbloglite.us-east-2.elasticbeanstalk.com/api/users/${username}`, {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Imxhcmd1bWVkbyIsImlhdCI6MTcxOTU1NzcxNCwiZXhwIjoxNzE5NjQ0MTE0fQ.ER4nZ_f7LHj5zlaO9S6ubLyuBUfa5wQjUxlls0wm9r8'
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
  
    fetchUsers();
  });