document.addEventListener("DOMContentLoaded", function () {
    const loginButton = document.querySelector('.btn.custom-btn');
    const profileBtn = document.getElementById("profile-btn");
    const logoutBtn = document.getElementById("logout-btn");
    const ordersBtn = document.getElementById("orders");
    const farmerIcon = document.getElementById('farmer-icon');

    /** Function to show logged-in state */
    function showLoggedInState() {
        loginButton.style.display = "none";
    }

    /** Function to show logged-out state */
    function showLoggedOutState() {
        loginButton.style.display = "block";
    }
    
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    const farmerId = localStorage.getItem("farmerId");
    const userRole = localStorage.getItem("userRole");

    if ((isLoggedIn && farmerId) || isLoggedIn) {
        showLoggedInState();
    } else {
        showLoggedOutState();
    }

    // Update the orders button based on the user's role
    if (userRole === 'farmer') {
        ordersBtn.textContent = 'Manage Orders';
        ordersBtn.href = './manageOrders.html';
    } else if (userRole === 'user') {
        ordersBtn.textContent = 'Order History';
        ordersBtn.href = './orderHistory.html';
    }

    // Show or hide the farmer icon based on the user's role
    if (userRole === 'farmer') {
        farmerIcon.style.display = 'block';
    } else {
        farmerIcon.style.display = 'none';
    }

    // Check if the user is logged in when the page loads
    if (isLoggedIn) {
        showLoggedInState();
    } else {
        showLoggedOutState();
    }

    /** Handle the Login Button click */
    loginButton.addEventListener("click", function () {
        // Simulate login action
        // localStorage.setItem("isLoggedIn", "true");
        showLoggedInState();
        window.location.href = './login.html'; // Redirect to login page if needed
    });

    /** Handles the log out button click */
    logoutBtn.addEventListener("click", function () {
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("farmerId");
        localStorage.removeItem("userRole");
        showLoggedOutState();

        // Redirect to the index page
        window.location.href = './index.html';
    });

    /** Handles the profile click */
    profileBtn.addEventListener('click', () => {
        // Check if the user is logged in
        const isLoggedIn = localStorage.getItem('isLoggedIn');

        if (isLoggedIn) {
            // If the user is logged in, redirect to the profile page
            window.location.href = './profile.html';
        } else {
            // If the user is not logged in, set a flag to redirect to the profile page after login
            localStorage.setItem('redirectFromProfile', true);
            // Redirect to the login page
            window.location.href = './login.html';
        }
    });

    // Add event listener to the logo
    document.querySelector('.navbar-brand').addEventListener('click', function () {
        const isLoggedIn = localStorage.getItem("isLoggedIn");
        if (isLoggedIn) {
            showLoggedInState();
        } else {
            showLoggedOutState();
        }
        window.location.href = './index.html';
    });
});

// Redirects to the login Page
document.querySelector('.btn.custom-btn').addEventListener('click', function () {
    window.location.href = './login.html';
});

// Redirects to the Manage Product Page if the Role is Farmer
document.getElementById('farmer-icon').addEventListener('click', function () {
    window.location.href = './manageProducts.html';
});