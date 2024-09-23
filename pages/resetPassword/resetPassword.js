const resetPasswordForm = document.getElementById('resetPasswordForm');
const emailInput = document.getElementById('email');
const requestOtpButton = document.getElementById('requestOtpButton');
const otpContainer = document.getElementById('otpContainer');
const otpInput = document.getElementById('otp');
const verifyOtpButton = document.getElementById('verifyOtpButton');
const newPasswordContainer = document.getElementById('newPasswordContainer');
const newPasswordInput = document.getElementById('newPassword');
const reEnterNewPasswordInput = document.getElementById('reEnterNewPassword');
const resetPasswordButton = document.getElementById('resetPasswordButton');
const resetPasswordErrors = document.getElementById('resetPasswordErrors');

let otpGenerated = false;
let otpVerified = false;

requestOtpButton.addEventListener('click', (e) => {
    e.preventDefault();
    const email = emailInput.value.trim();
    
    if (email === '') {
        showError('Please enter your email address.');
        return;
    }
    
    // Retrieve the stored email from localStorage
    const storedUsername = localStorage.getItem('username');
    
    if (email === storedUsername) {
        // Generate a random OTP and store it in local storage
        const otp = Math.floor(100000 + Math.random() * 900000);
        localStorage.setItem('otp', otp);
        otpGenerated = true;
        otpContainer.style.display = 'block';
        requestOtpButton.disabled = true;
        showSuccess('OTP sent to your email address. Please enter the OTP below.');
    } else {
        showError('Email address does not match our records.');
    }
});


verifyOtpButton.addEventListener('click', (e) => {
    e.preventDefault();
    const otpEntered = otpInput.value.trim();
    if (otpEntered === '') {
        showError('Please enter the OTP sent to your email address.');
        return;
    }
    const storedOtp = localStorage.getItem('otp');
    if (otpEntered !== storedOtp) {
        showError('Invalid OTP. Please try again.');
        return;
    }
    otpVerified = true;
    otpContainer.style.display = 'none';
    newPasswordContainer.style.display = 'block';
    showSuccess('OTP verified successfully. Please enter your new password below.');
});

resetPasswordButton.addEventListener('click', (e) => {
    e.preventDefault();
    const newPassword = newPasswordInput.value.trim();
    const reEnterNewPassword = reEnterNewPasswordInput.value.trim();
    
    if (newPassword === '' || reEnterNewPassword === '') {
        showError('Please enter your new password and re-enter it below.');
        return;
    }
    
    if (newPassword !== reEnterNewPassword) {
        showError('New password and re-entered password do not match.');
        return;
    }

    // Assuming the user's email is already available
    const email = emailInput.value.trim();
    const storedUsername = localStorage.getItem('username');
    
    // Ensure the email matches the one stored in local storage
    if (email === storedUsername) {
        // Update the password in local storage
        localStorage.setItem('password', newPassword);
        showSuccess('Password reset successfully. You can now log in with your new password.');

        setTimeout(() => {
            window.location.href = '../signin/login.html'; // Redirect to the login page
        }, 2000); // 2000 milliseconds = 2 seconds

    } else {
        showError('Email does not match the registered account.');
    }

    // Clear the OTP from local storage after resetting the password
    localStorage.removeItem('otp');
});


function showError(message) {
    resetPasswordErrors.style.display = 'block';
    resetPasswordErrors.style.backgroundColor = '#f8d7da';
    resetPasswordErrors.style.color = '#721c24';
    resetPasswordErrors.innerText = message;
}

function showSuccess(message) {
    resetPasswordErrors.style.display = 'block';
    resetPasswordErrors.style.backgroundColor = '#dff0df';
    resetPasswordErrors.style.color = '#3e8e41';
    resetPasswordErrors.innerText = message;
}