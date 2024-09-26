/** Redirects to the login Page */
document.querySelector('.btn.custom-btn').addEventListener('click', function () {
    window.location.href = '../login/login.html';
});

/** Redirects to the Manage Product Page if the Role is Farmer */
document.getElementById('farmer-icon').addEventListener('click', function () {
    window.location.href = '../manageProducts/manageProducts.html';
});

document.addEventListener("DOMContentLoaded", function () {
    const loginButton = document.querySelector('.btn.custom-btn');
    const profileBtn = document.getElementById("profile-btn");
    const logoutBtn = document.getElementById("logout-btn");

    // Function to show logged-in state
    function showLoggedInState() {
        loginButton.style.display = "none";
    }

    // Function to show logged-out state
    function showLoggedOutState() {
        loginButton.style.display = "block";
    }

    // Initialize state based on login status
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    const farmerId = localStorage.getItem("farmerId");

    if ((isLoggedIn && farmerId) || isLoggedIn) {
        showLoggedInState();
    } else {
        showLoggedOutState();
    }

    /** Handle the Login Button click */
    loginButton.addEventListener("click", function () {
        // Simulate login action
        localStorage.setItem("isLoggedIn", "true");
        showLoggedInState();
        window.location.href = '../login/login.html'; // Redirect to login page if needed
    });

    /** Handles the log out button click */
    logoutBtn.addEventListener("click", function () {
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("farmerId");
        localStorage.removeItem("userRole");
        showLoggedOutState();

        // Redirect to the index page
        window.location.href = '../home/index.html';
    });

    /** Handles the profile click */
    profileBtn.addEventListener('click', () => {
        // Check if the user is logged in
        const isLoggedIn = localStorage.getItem('isLoggedIn');

        if (isLoggedIn) {
            // If the user is logged in, redirect to the profile page
            window.location.href = '../profile/profile.html';
        } else {
            // If the user is not logged in, set a flag to redirect to the profile page after login
            localStorage.setItem('redirectFromProfile', true);
            // Redirect to the login page
            window.location.href = '../login/login.html';
        }
    });

    // Get the user's role from local storage
    const userRole = localStorage.getItem('userRole');

    // Get the farmer icon element
    const farmerIcon = document.getElementById('farmer-icon');

    // Check if the user is a farmer
    if (userRole === 'farmer') {
        // Show the farmer icon
        farmerIcon.style.display = 'block';
    } else {
        // Hide the farmer icon
        farmerIcon.style.display = 'none';
    }
});