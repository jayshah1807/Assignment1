const container = document.getElementById("container");
const registerBtn = document.getElementById("register");
const loginBtn = document.getElementById("login");

const mainContainer = document.getElementById('container');
const formContainer = document.querySelector('.form-container');

// Function to adjust the height of the main container
function adjustMainContainerHeight() {
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

const farmerDetailsDiv = document.querySelector('.farmer-details');

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
        errorContainer.classList.add('show');
    } else {
        const users = JSON.parse(localStorage.getItem('users')) || [];

        const userExists = users.some(user => user.email === email);
        if (userExists) {
            errorContainer.innerHTML = 'This email is already registered.';
            errorContainer.classList.add('show');
            return;
        }

        const newUser = {
            name: name,
            email: email,
            contact: contact,
            password: password,
            role: role,
            farmName: farmName,
            yearsOfExperience: yearsOfExperience,
            dateOfEstablishment: dateOfEstablishment
        };
        users.push(newUser);

        localStorage.setItem('users', JSON.stringify(users));
        localStorage.setItem('userRole', role);

        window.location.href = 'login.html'; 
    }
});

// Signin Logic
document.getElementById('signinForm').addEventListener('submit', function(event) {
  event.preventDefault();

  const email = document.getElementById('signinUsername').value;
  const password = document.getElementById('signinPassword').value;

  const users = JSON.parse(localStorage.getItem('users')) || [];

  const user = users.find(user => user.email === email && user.password === password);

  if (user) {
    localStorage.setItem('loggedInUserEmail', email); 
    localStorage.setItem('userRole', user.role);

    if (user.role == "farmer"){
      localStorage.setItem('farmerId', user.name);
    }

    localStorage.setItem("isLoggedIn", "true");

    const redirectFromProfile = localStorage.getItem('redirectFromProfile');

    if (redirectFromProfile) {
      window.location.href = './profile.html';
      localStorage.removeItem('redirectFromProfile');
    } else {
      window.location.href = './index.html';
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
      { theme: "outline", size: "large" }
    );
    google.accounts.id.prompt();
  };
  
  function handleGoogleLoginResponse(response) {
    const idToken = response.credential;
  
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
