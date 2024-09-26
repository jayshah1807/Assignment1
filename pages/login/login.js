const container = document.getElementById("container");
const registerBtn = document.getElementById("register");
const loginBtn = document.getElementById("login");

// Get the main container and form container elements
const mainContainer = document.getElementById('container');
const formContainer = document.querySelector('.form-container');

// Function to adjust the height of the main container
function adjustMainContainerHeight() {
    // Get the height of the form container
    const formContainerHeight = formContainer.offsetHeight;

    // Get the height of the main container
    const mainContainerHeight = mainContainer.offsetHeight;

    // If the form container's height exceeds the main container's height, adjust the main container's height
    if (formContainerHeight > mainContainerHeight) {
        mainContainer.style.height = `${formContainerHeight}px`;
    }
}

// Call the function whenever the form container's height changes
formContainer.addEventListener('DOMSubtreeModified', adjustMainContainerHeight);

// Call the function initially to set the height
adjustMainContainerHeight();

// Get the farmer details div
const farmerDetailsDiv = document.querySelector('.farmer-details');

// Add an event listener to the role select dropdown
document.getElementById('role').addEventListener('change', function() {
    if (this.value === 'farmer') {
        farmerDetailsDiv.style.display = 'block';
    } else {
        farmerDetailsDiv.style.display = 'none';
    }
});

registerBtn.addEventListener("click", () => {
    container.classList.add("active");
});

loginBtn.addEventListener("click", () => {
    container.classList.remove("active");
});

// Error messages
const errorMessages = {
    name: "Oops! We need your name to create an account.",
    email: "Hold on! A valid email address is required.",
    emailFormat: "Yikes! That doesn't look like a valid email.",
    password: "A strong password is essential for security!",
    passwordLength: "Your password must be at least 8 characters long.",
    passwordUpper: "Don't forget to include at least one uppercase letter!",
    passwordLower: "Make sure to have at least one lowercase letter.",
    passwordNumber: "How about including at least one number?",
    passwordSpecial: "Let's add a special character to your password!",
    passwordMismatch: "Oops! The passwords do not match."
};

// Signup Logic
// Signup Logic
// Signup Logic
document.getElementById('signupForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const errors = [];
    const name = document.querySelector('input[placeholder="Full Name"]').value;
    const email = document.querySelector('input[placeholder="Email"]').value;
    const contact = document.querySelector('input[placeholder="Mobile Number"]').value;
    const password = document.querySelector('input[placeholder="Password"]').value;
    const retypePassword = document.querySelector('input[placeholder="Re-enter Password"]').value;
    const role = document.getElementById('role').value;
    let farmName, yearsOfExperience, dateOfEstablishment;

    if (role === 'farmer') {
        farmName = document.getElementById('farmName').value;
        yearsOfExperience = document.getElementById('yearsOfExperience').value;
        dateOfEstablishment = document.getElementById('dateOfEstablishment').value;

        if (!farmName) {
            errors.push('Please enter the name of your farm.');
        }
        if (!yearsOfExperience) {
            errors.push('Please enter your years of experience.');
        }
        if (!dateOfEstablishment) {
            errors.push('Please enter the date of establishment.');
        }
    }

    if (!name) {
        errors.push(errorMessages.name);
    }
    if (!email) {
        errors.push(errorMessages.email);
    } else if (!/\S+@\S+\.\S+/.test(email)) {
        errors.push(errorMessages.emailFormat);
    }
    if (!password) {
        errors.push(errorMessages.password);
    } else if (password.length < 8) {
        errors.push(errorMessages.passwordLength);
    } else if (!/[A-Z]/.test(password)) {
        errors.push(errorMessages.passwordUpper);
    } else if (!/[a-z]/.test(password)) {
        errors.push(errorMessages.passwordLower);
    } else if (!/[0-9]/.test(password)) {
        errors.push(errorMessages.passwordNumber);
    } else if (!/[\W_]/.test(password)) {
        errors.push(errorMessages.passwordSpecial);
    }

    if (password !== retypePassword) {
        errors.push(errorMessages.passwordMismatch);
    }

    const errorContainer = document.getElementById('signupErrors');
    errorContainer.innerHTML = ''; // Clear previous errors
    if (errors.length > 0) {
        errorContainer.innerHTML = errors.join('<br>');
        errorContainer.classList.add('show'); // Show error container
    } else {
        // Retrieve the existing users array from localStorage or create an empty array
        const users = JSON.parse(localStorage.getItem('users')) || [];

        // Check if the email is already registered
        const userExists = users.some(user => user.email === email);
        if (userExists) {
            errorContainer.innerHTML = 'This email is already registered.';
            errorContainer.classList.add('show');
            return;
        }

        // Create a new user object
        const newUser = {
            name: name,
            email: email,
            contact: contact,
            password: password, // Note: Storing plain text passwords is not recommended; consider hashing
            role: role,
            farmName: farmName,
            yearsOfExperience: yearsOfExperience,
            dateOfEstablishment: dateOfEstablishment
        };

        // Add the new user to the array
        users.push(newUser);

        // Save the updated array back to localStorage
        localStorage.setItem('users', JSON.stringify(users));
        localStorage.setItem('userRole', role);

        // Redirect to the sign-in page
        window.location.href = 'login.html'; // Adjust the path as necessary
    }
});

// Signin Logic
document.getElementById('signinForm').addEventListener('submit', function(event) {
    event.preventDefault();
  
    const email = document.getElementById('signinUsername').value;
    const password = document.getElementById('signinPassword').value;
  
    // Retrieve the users array from localStorage
    const users = JSON.parse(localStorage.getItem('users')) || [];
  
    // Check if the credentials match any registered user
    const user = users.find(user => user.email === email && user.password === password);
  
    if (user) {
      // Store the logged-in user's email in localStorage for profile access
      localStorage.setItem('loggedInUserEmail', email);  // Store the email for later use
      localStorage.setItem('userRole', user.role);

      if (user.role == "farmer"){
        localStorage.setItem('farmerId', user.name);
      }
  
      // Check if the user was redirected from the profile icon
      const redirectFromProfile = localStorage.getItem('redirectFromProfile');
  
      if (redirectFromProfile) {
        // If the user was redirected from the profile icon, redirect to the profile page
        window.location.href = '../profile/profile.html';
        localStorage.removeItem('redirectFromProfile');
      } else {
        // If the user was not redirected from the profile icon, redirect to the home page
        window.location.href = '../home/index.html';
      }
    } else {
      const errorContainer = document.getElementById('signinErrors');
      errorContainer.innerHTML = 'Invalid credentials. Please try again.';
      errorContainer.classList.add('show');
    }
  });

window.onload = function () {
    google.accounts.id.initialize({
      client_id: '740253329912-bue2i83r5nhr9gld1k0ejh9mgg8ict5j.apps.googleusercontent.com',
      callback: handleGoogleLoginResponse
    });
    google.accounts.id.renderButton(
      document.querySelector('.g_id_signin'),
      { theme: "outline", size: "large" } // customization options
    );
    google.accounts.id.prompt(); // Shows the prompt if not previously signed in
  };
  
  function handleGoogleLoginResponse(response) {
    // Token received from Google
    const idToken = response.credential;
  
    // Send the token to your backend API for verification
    fetch('https://locahost:3000/auth/google', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ token: idToken })
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        // Save user information or token in localStorage, and redirect
        localStorage.setItem('user', JSON.stringify(data.user));
        window.location.href = '/home/index.html';
      } else {
        console.error('Google sign-in failed:', data.message);
      }
    })
    .catch(error => {
      console.error('Error:', error);
    });
  }

  const { OAuth2Client } = require('google-auth-library');
  const client = new OAuth2Client('740253329912-bue2i83r5nhr9gld1k0ejh9mgg8ict5j.apps.googleusercontent.com');
  
  async function verifyGoogleToken(token) {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: '740253329912-bue2i83r5nhr9gld1k0ejh9mgg8ict5j.apps.googleusercontent.com', // Specify the CLIENT_ID of the app that accesses the backend
    });
    const payload = ticket.getPayload();
    return payload;  // Contains user details like email, name, etc.
  }
  
  app.post('/auth/google', async (req, res) => {
    const token = req.body.token;
  
    try {
      const userPayload = await verifyGoogleToken(token);
  
      // Handle user login/signup logic, e.g., create account if new user or log in existing user
      res.status(200).json({ success: true, user: userPayload });
    } catch (error) {
      res.status(400).json({ success: false, message: 'Invalid token' });
    }
  });
  
