document.addEventListener('DOMContentLoaded', async function() {
    const usersList = document.getElementById('users-list');
    
    try {
      const response = await fetch('http://microbloglite.us-east-2.elasticbeanstalk.com/api/users?limit=100&offset=0', {
        headers: {
          'Accept': 'application/json',
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Imxhcmd1bWVkbyIsImlhdCI6MTcxOTQ2Nzk2MSwiZXhwIjoxNzE5NTU0MzYxfQ.D9cA4h-6NYLMJm_d3exg13tdSigahZcRIZ7Ar5P_3io'
        }
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const users = await response.json();
  
      // Display users in the UI
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
  
    } catch (error) {
      console.error('Error fetching users:', error);
      usersList.innerHTML = '<p>Failed to fetch users.</p>';
    }
  });