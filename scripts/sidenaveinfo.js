// Function to generate Gravatar URL based on email address
const getGravatarUrl = (email) => {
    if (!email) {
        // Return a default Gravatar URL if email is missing
        return "https://www.gravatar.com/avatar/00000000000000000000000000000000";
    }
    const hash = md5(email.trim().toLowerCase()); // Calculate MD5 hash of the email
    return `https://www.gravatar.com/avatar/${hash}`; // Return Gravatar URL with the hash
};

// Placeholder MD5 hash function (to be replaced with an actual implementation)
const md5 = (string) => {
    // Implement the MD5 hash function here (this is just a placeholder)
    return string; // Placeholder returns the input string as is
};

// Function to fetch and display user profile information
const displayUserProfile = async () => {
    const loginData = getLoginData(); 
    try {
        // Fetch user profile data from the API endpoint
        const profileResponse = await fetch(apiBaseURL + `/api/users/${loginData.username}`, {
            headers: {
                Authorization: `Bearer ${loginData.token}`, 
            },
        });

        if (!profileResponse.ok) {
            throw new Error("Failed to fetch profile data"); // Throw an error if fetching profile fails
        }

        const profileData = await profileResponse.json(); // Parse the JSON response
        const { username, fullName, bio, email } = profileData; // Destructure profile data

        const gravatarUrl = getGravatarUrl(email);

        // Create HTML structure for the profile card
        const profileCard = `
            <div class="card">
                <div class="card-body d-flex">
                    <div>
                        <img src="${gravatarUrl}" alt="Profile Picture" class="rounded-circle me-3" style="width: 50px; height: 50px;">
                    </div>
                    <div>
                        <h5 class="card-title">${username}</h5>
                        <h6 class="card-subtitle mb-2 text-muted">${fullName}</h6>
                        <p class="card-text">${bio || "No bio provided"}</p>
                    </div>
                </div>
            </div>
        `;

        const profileInfo = document.getElementById("profile-info"); 
        profileInfo.innerHTML = profileCard; // Render profile card HTML inside the container
    } catch (error) {
        console.error("Error fetching profile:", error); // Log error if fetching profile fails
        const profileInfo = document.getElementById("profile-info"); 
        profileInfo.innerHTML = "<p>Failed to fetch profile information.</p>"; // Display error message in case of failure
    }
};

document.addEventListener("DOMContentLoaded", displayUserProfile);

// Event listener for toggling dark mode
document.addEventListener("DOMContentLoaded", () => {
    const modeToggleCheckbox = document.querySelector(".switch .input"); 
    const body = document.body; 

    const isDarkMode = localStorage.getItem("darkMode") === "true";

    // Function to enable dark mode
    const enableDarkMode = () => {
        body.classList.add("dark-mode"); // Add 'dark-mode' class to body for dark mode styles
        localStorage.setItem("darkMode", "true"); // Store dark mode preference in localStorage
    };

    // Function to enable light mode
    const enableLightMode = () => {
        body.classList.remove("dark-mode"); // Remove 'dark-mode' class from body for light mode styles
        localStorage.setItem("darkMode", "false"); // Store light mode preference in localStorage
    };

    // Toggle dark mode based on checkbox change
    modeToggleCheckbox.addEventListener("change", () => {
        if (modeToggleCheckbox.checked) {
            enableDarkMode(); 
        } else {
            enableLightMode(); 
        }
    });

    // Initialize page based on user's stored mode preference
    if (isDarkMode) {
        modeToggleCheckbox.checked = true; 
        enableDarkMode(); 
    } else {
        enableLightMode(); 
    }
});