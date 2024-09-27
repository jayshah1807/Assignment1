const countrySelect = document.getElementById('country');
const stateSelect = document.getElementById('state');

// Fetch countries from REST Countries API
async function fetchCountries() {
    try {
        const response = await fetch('https://restcountries.com/v3.1/all');
        const countries = await response.json();
        populateCountries(countries);
    } catch (error) {
        console.error('Error fetching countries:', error);
        countrySelect.innerHTML = '<option value="">Failed to load countries</option>';
    }
}

// Populate country dropdown
function populateCountries(countries) {
    countrySelect.innerHTML = '<option value="">Select a country</option>';
    countries.sort((a, b) => a.name.common.localeCompare(b.name.common));

    countries.forEach(country => {
        const option = document.createElement('option');
        option.value = country.cca2;
        option.textContent = country.name.common;
        countrySelect.appendChild(option);
    });
}

// Fetch states based on selected country using GeoDB Cities API
async function fetchStates(countryCode) {
    try {
        stateSelect.innerHTML = '<option value="">Loading states...</option>';
        const response = await fetch(`https://wft-geo-db.p.rapidapi.com/v1/geo/countries/${countryCode}/regions?limit=10`, {
            method: 'GET',
            headers: {
                'X-RapidAPI-Key': '9c4ff8d322msh4e877d0f725ababp1642ecjsn4ce3f84b2d79',
                'X-RapidAPI-Host': 'wft-geo-db.p.rapidapi.com'
            }
        });

        const data = await response.json();

        // Check if the data structure contains regions or if it's empty
        if (data && data.data && Array.isArray(data.data)) {
            populateStates(data.data);
        } else {
            console.error('No states found for the selected country.');
            stateSelect.innerHTML = '<option value="">No states available</option>';
        }
    } catch (error) {
        console.error('Error fetching states:', error);
        stateSelect.innerHTML = '<option value="">Failed to load states</option>';
    }
}

// Populate state dropdown
function populateStates(states) {
    stateSelect.innerHTML = '<option value="">Select a state</option>';
    
    // Ensure states is an array before iterating
    states.forEach(state => {
        const option = document.createElement('option');
        option.value = state.isoCode || state.name;
        option.textContent = state.name;
        stateSelect.appendChild(option);
    });
}

countrySelect.addEventListener('change', function() {
    const selectedCountryCode = this.value;
    if (selectedCountryCode) {
        fetchStates(selectedCountryCode);
    } else {
        stateSelect.innerHTML = '<option value="">Select a state</option>';
    }
});

fetchCountries();

document.addEventListener('DOMContentLoaded', () => {
    const users = JSON.parse(localStorage.getItem('users')) || [];

    const currentUserEmail = localStorage.getItem('loggedInUserEmail');

    const currentUser = users.find(user => user.email === currentUserEmail);

    if (currentUser) {
        console.log('Current User Found:', currentUser);

        // Populate the form fields if current user exists
        document.getElementById('profileName').value = currentUser.name || '';
        document.getElementById('profileEmail').value = currentUser.email || '';
        document.getElementById('profileContact').value = currentUser.contact || '';
        document.getElementById('profileAddress1').value = currentUser.address1 || '';
        document.getElementById('profileAddress2').value = currentUser.address2 || '';
        document.getElementById('country').value = currentUser.country || '';
        document.getElementById('state').value = currentUser.state || '';
        document.getElementById('profileZipCode').value = currentUser.zipCode || '';
    } else {
        console.error('No current user found or user data is not accessible.');
    }
});

document.getElementById('editProfile').addEventListener('submit', function (event) {
    event.preventDefault();

    const users = JSON.parse(localStorage.getItem('users')) || [];
    const currentUserEmail = localStorage.getItem('loggedInUserEmail');

    const currentUserIndex = users.findIndex(user => user.email === currentUserEmail);

    if (currentUserIndex === -1) {
        alert('Error: User not found. Please log in again.');
        return;
    }

    // Get updated values from input fields
    const updatedName = document.getElementById('profileName').value;
    const updatedEmail = document.getElementById('profileEmail').value;
    const updatedContact = document.getElementById('profileContact').value;
    const updatedAddress1 = document.getElementById('profileAddress1').value;
    const updatedAddress2 = document.getElementById('profileAddress2').value;
    const updatedCountry = document.getElementById('country').value;
    const updatedState = document.getElementById('state').value;
    const updatedZipCode = document.getElementById('profileZipCode').value;

    const errors = [];
    if (!updatedName) errors.push('Name is required.');
    if (!updatedEmail) errors.push('Email is required.');
    if (!updatedContact) errors.push('Mobile number is required.');

    const errorContainer = document.getElementById('profileErrors');
    errorContainer.innerHTML = '';
    if (errors.length > 0) {
        errorContainer.innerHTML = errors.join('<br>');
        errorContainer.classList.add('show');
    } else {
        // Update the current user's details in the array
        users[currentUserIndex] = {
            ...users[currentUserIndex],
            name: updatedName,
            email: updatedEmail,
            contact: updatedContact,
            address1: updatedAddress1,
            address2: updatedAddress2,
            country: updatedCountry,
            state: updatedState,
            zipCode: updatedZipCode
        };

        // Save the updated array back to localStorage
        localStorage.setItem('users', JSON.stringify(users));
        
        localStorage.setItem('loggedInUserEmail', updatedEmail);

        alert('Profile updated successfully!');
        window.location.href = './index.html';
    }
});

