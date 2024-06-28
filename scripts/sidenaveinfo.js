// Function to get Gravatar URL based on email
const getGravatarUrl = (email) => {
    if (!email) {
        // Return a default Gravatar URL or handle the case where email is missing
        return 'https://www.gravatar.com/avatar/00000000000000000000000000000000';
    }
    const hash = md5(email.trim().toLowerCase());
    return `https://www.gravatar.com/avatar/${hash}`;
}

// MD5 hash function (you can use a library or write your own)
const md5 = (string) => {
    // Implement the MD5 hash function or use an external library
    // This is just a placeholder
    return string; // Replace with actual MD5 hash implementation
}

// Function to fetch and display user profile information
const displayUserProfile = async () => {
    const loginData = getLoginData();
    try {
        // Fetch user profile data
        const profileResponse = await fetch(apiBaseURL + `/api/users/${loginData.username}`, {
            headers: {
                "Authorization": `Bearer ${loginData.token}`
            }
        });

        if (!profileResponse.ok) {
            throw new Error('Failed to fetch profile data');
        }

        const profileData = await profileResponse.json();
        const { username, fullName, bio, email } = profileData;

        // Get Gravatar URL for the profile
        const gravatarUrl = getGravatarUrl(email);

        // Create and display profile card
        const profileCard = `
            <div class="card">
                <div class="card-body d-flex">
                    <div>
                        <img src="${gravatarUrl}" alt="Profile Picture" class="rounded-circle me-3" style="width: 50px; height: 50px;">
                    </div>
                    <div>
                        <h5 class="card-title">${username}</h5>
                        <h6 class="card-subtitle mb-2 text-muted">${fullName}</h6>
                        <p class="card-text">${bio || 'No bio provided'}</p>
                    </div>
                </div>
            </div>
        `;

        const profileInfo = document.getElementById('profile-info');
        profileInfo.innerHTML = profileCard;
    } catch (error) {
        console.error('Error fetching profile:', error);
        const profileInfo = document.getElementById('profile-info');
        profileInfo.innerHTML = '<p>Failed to fetch profile information.</p>';
    }
}

// Example usage
document.addEventListener('DOMContentLoaded', displayUserProfile);

document.addEventListener('DOMContentLoaded', () => {
    const modeToggleCheckbox = document.querySelector('.switch .input');
    const body = document.body;

    // Check if user has a stored preference for mode
    const isDarkMode = localStorage.getItem('darkMode') === 'true';

    // Function to set dark mode
    const enableDarkMode = () => {
        body.classList.add('dark-mode');
        localStorage.setItem('darkMode', 'true');
    };

    // Function to set light mode
    const enableLightMode = () => {
        body.classList.remove('dark-mode');
        localStorage.setItem('darkMode', 'false');
    };

    // Toggle mode on checkbox change
    modeToggleCheckbox.addEventListener('change', () => {
        if (modeToggleCheckbox.checked) {
            enableDarkMode();
        } else {
            enableLightMode();
        }
    });

    // Initialize based on user preference
    if (isDarkMode) {
        modeToggleCheckbox.checked = true;
        enableDarkMode();
    } else {
        enableLightMode();
    }
});
