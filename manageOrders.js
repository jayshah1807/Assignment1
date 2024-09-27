/** Redirects to the Manage Product Page if the Role is Farmer */
document.getElementById('farmer-icon').addEventListener('click', function () {
    window.location.href = './manageProducts.html';
});

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

    /** Handle the Login Button click */
    loginButton.addEventListener("click", function () {
        localStorage.setItem("isLoggedIn", "true");
        showLoggedInState();
        window.location.href = './login.html';
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
            window.location.href = './profile.html';
        } else {
            // If the user is not logged in, set a flag to redirect to the profile page after login
            localStorage.setItem('redirectFromProfile', true);
            window.location.href = './login.html';
        }
    });
});

const ordersTableBody = document.getElementById('orders-table-body');

// Function to create orders table
function createOrdersTable(orders) {
    ordersTableBody.innerHTML = '';
    orders.forEach(order => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${order.orderId}</td>
            <td>${order.customerName}</td>
            <td>${order.productId}</td>
            <td>${order.productName}</td>
            <td>${order.productQuantity}</td>
            <td>${order.totalAmount}</td>
            <td>${order.paymentStatus}</td>
            <td>${order.productStatus}</td>
            <td>${order.estimationDeliveryDate}</td>
            <td>${order.customerAddress}</td>
            <td>${order.customerEmail}</td>
            <td>
                <button class="btn btn-primary" onclick="updateOrderStatus(${order.orderId})">Update Status</button>
            </td>
        `;
        ordersTableBody.appendChild(row);
    });
}

// Get the orders from local storage
const orders = JSON.parse(localStorage.getItem('orders'));

// Render the orders table
createOrdersTable(orders);

// Add event listener to the add order button
document.getElementById('addOrderBtn').addEventListener('click', addOrder);

// Add event listener to the logout button
document.getElementById('logout-btn').addEventListener('click', function() {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('farmerId');
    localStorage.removeItem('userRole');
    window.location.href = './index.html';
});

document.getElementById('profile-btn').addEventListener('click', function() {
    window.location.href = './profile.html';
});

document.getElementById('orders').addEventListener('click', function() {
    window.location.href = './manageOrders.html';
});

document.querySelector('.btn.custom-btn').addEventListener('click', function () {
    window.location.href = './login.html';
});

document.getElementById('farmer-icon').addEventListener('click', function () {
    window.location.href = './manageProducts.html';
});

document.addEventListener("DOMContentLoaded", function () {
    const loginButton = document.querySelector('.btn.custom-btn');
    const profileBtn = document.getElementById("profile-btn");
    const logoutBtn = document.getElementById("logout-btn");

    function showLoggedInState() {
        loginButton.style.display = "none";
    }

    function showLoggedOutState() {
        loginButton.style.display = "block";
    }

    const isLoggedIn = localStorage.getItem("isLoggedIn");
    const farmerId = localStorage.getItem("farmerId");

    if ((isLoggedIn && farmerId) || isLoggedIn) {
        showLoggedInState();
    } else {
        showLoggedOutState();
    }

    /** Handle the Login Button click */
    loginButton.addEventListener("click", function () {
        localStorage.setItem("isLoggedIn", "true");
        showLoggedInState();
        window.location.href = './login.html';
    });

    /** Handles the log out button click */
    logoutBtn.addEventListener("click", function () {
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("farmerId");
        localStorage.removeItem("userRole");
        showLoggedOutState();

        window.location.href = './index.html';
    });

    /** Handles the profile click */
    profileBtn.addEventListener('click', () => {
        const isLoggedIn = localStorage.getItem('isLoggedIn');

        if (isLoggedIn) {
            window.location.href = './profile.html';
        } else {
            // If the user is not logged in, set a flag to redirect to the profile page after login
            localStorage.setItem('redirectFromProfile', true);
            window.location.href = './login.html';
        }
    });

    const userRole = localStorage.getItem('userRole');
    const farmerIcon = document.getElementById('farmer-icon');

    // Check if the user is a farmer
    if (userRole === 'farmer') {
        farmerIcon.style.display = 'block';
    } else {
        farmerIcon.style.display = 'none';
    }
});