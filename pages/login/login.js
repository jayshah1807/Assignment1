const container = document.getElementById("container");
const registerBtn = document.getElementById("register");
const loginBtn = document.getElementById("login");

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
document.getElementById('signupForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const errors = [];
    const name = document.querySelector('input[placeholder="Full Name"]').value;
    const email = document.querySelector('input[placeholder="Email"]').value;
    const password = document.querySelector('input[placeholder="Password"]').value;
    const retypePassword = document.querySelector('input[placeholder="Re-enter Password"]').value;

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
        // Save user data in local storage
        localStorage.setItem('username', email);
        localStorage.setItem('password', password);
        
        // Redirect to signin page
        window.location.href = 'signin.html'; // Adjust the path as necessary
    }
});

// Signin Logic
document.getElementById('signinForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const email = document.getElementById('signinUsername').value;
    const password = document.getElementById('signinPassword').value;

    // Retrieve user data from local storage
    const storedUsername = localStorage.getItem('username');
    const storedPassword = localStorage.getItem('password');

    // Check if the credentials match
    if (email === storedUsername && password === storedPassword) {
        // Redirect to home page
        window.location.href = '../home/index.html'; // Adjust the path as necessary
    } else {
        alert('Invalid credentials. Please try again.');
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
  
