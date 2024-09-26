let products = []; // Array to store all products

// Add event listener to the add product form
document.getElementById('add-product-form').addEventListener('submit', addProduct);

// Convert image file to base64
function convertToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

// Function to add a new product
// Function to add a new product
async function addProduct(event) {
    event.preventDefault();
    
    // Fetch product details from the form
    const productName = document.getElementById('productName').value;
    const productDescription = document.getElementById('productDescription').value;
    const productQuantity = document.getElementById('productQuantity').value;
    const productPhoto = document.getElementById('productPhoto').files[0];
    
    const farmerId = localStorage.getItem('farmerId'); // Retrieve the farmer ID dynamically
    
    // Retrieve current product list from local storage or initialize an empty list
    let products = JSON.parse(localStorage.getItem(farmerId)) || [];
    
    // Convert product photo to base64
    const photoBase64 = await convertToBase64(productPhoto);
    
    // Create a new product object
    const product = {
        id: Date.now(),
        name: productName,
        description: productDescription,
        quantity: productQuantity,
        photoUrl: photoBase64 // Save the base64 string of the photo
    };
    
    // Add the new product to the products array
    products.push(product);
    
    // Store the updated product list in local storage
    localStorage.setItem(farmerId, JSON.stringify(products));
    
    // Add the product to the list on the page
    addProductToList(product);
    
    // Clear form fields
    document.getElementById('add-product-form').reset();
}

// Function to load products from local storage and display them on the page
function loadProducts() {
    const farmerId = localStorage.getItem('farmerId'); // Retrieve the farmer ID dynamically
    
    // Retrieve products from local storage
    let products = JSON.parse(localStorage.getItem(farmerId)) || [];
    
    // Loop through the product list and display each product
    products.forEach(product => {
        addProductToList(product);
    });
}


// Call loadProducts when the page loads
window.onload = function() {
    loadProducts();
};

// Function to add a product to the product list on the page
function addProductToList(product) {
    const productList = document.getElementById('product-list');
    const card = document.createElement('div');
    card.classList.add('col-md-4', 'product-card');
    card.setAttribute('data-id', product.id); // Add the data-id attribute
    
    card.innerHTML = `
        <img src="${product.photoUrl}" alt="Product Photo">
        <div class="card-body">
            <h5 class="card-title">${product.name}</h5>
            <p class="card-text">${product.description}</p>
            <p class="card-text">Quantity: ${product.quantity} kgs</p>
            <div class="actions">
                <button class="btn btn-success" onclick="editProduct(${product.id})">Edit</button>
                <button class="btn btn-danger" onclick="deleteProduct(${product.id})">Delete</button>
            </div>
        </div>
    `;
    
    productList.appendChild(card);
}s

// Function to edit a product
function editProduct(productId) {
    const farmerId = localStorage.getItem('farmerId'); // Retrieve the farmer ID dynamically

    // Retrieve the latest products from localStorage
    let products = JSON.parse(localStorage.getItem(farmerId)) || [];

    // Find the product by its ID in the products array
    const product = products.find(p => p.id === productId);

    if (!product) {
        alert("Product not found");
        return;
    }

    // Populate the form with the product details
    document.getElementById('productName').value = product.name;
    document.getElementById('productDescription').value = product.description;
    document.getElementById('productQuantity').value = product.quantity;

    // Remove the photo input requirement for editing
    const productPhotoInput = document.getElementById('productPhoto');
    productPhotoInput.removeAttribute('required');

    // Change the submit button to "Update Product"
    const submitButton = document.querySelector('#add-product-form button[type="submit"]');
    submitButton.textContent = 'Update Product';

    // Add event listener for updating the product
    submitButton.removeEventListener('click', addProduct);
    submitButton.addEventListener('click', async function updateProduct(event) {
        event.preventDefault();

        // Update the product details with new values
        product.name = document.getElementById('productName').value;
        product.description = document.getElementById('productDescription').value;
        product.quantity = document.getElementById('productQuantity').value;

        // Update the photo only if the user selected a new one
        if (productPhotoInput.files[0]) {
            product.photoUrl = await convertToBase64(productPhotoInput.files[0]);
        }

        // Save the updated product list to localStorage
        localStorage.setItem(farmerId, JSON.stringify(products));

        // Update the product card in the DOM
        const productCard = document.querySelector(`[data-id="${productId}"]`);
        productCard.querySelector('.card-title').textContent = product.name;
        productCard.querySelector('.card-text').textContent = product.description;
        productCard.querySelector('.card-text + .card-text').textContent = `Quantity: ${product.quantity} kgs`;

        if (productPhotoInput.files[0]) {
            productCard.querySelector('img').src = product.photoUrl;
        }

        // Reset the form
        document.getElementById('add-product-form').reset();
        productPhotoInput.setAttribute('required', 'required');
        submitButton.textContent = 'Add Product';

        // Restore the original event listener for adding a product
        submitButton.removeEventListener('click', updateProduct);
        submitButton.addEventListener('click', addProduct);
    });
}


// Function to delete a product
function deleteProduct(productId) {
    const farmerId = localStorage.getItem('farmerId'); // Retrieve the farmer ID dynamically

    // Retrieve the latest products from localStorage
    let products = JSON.parse(localStorage.getItem(farmerId)) || [];

    // Filter out the product with the given productId
    products = products.filter(product => product.id !== productId);

    // Save the updated product list to localStorage
    localStorage.setItem(farmerId, JSON.stringify(products));

    // Remove the product card from the DOM
    const productCard = document.querySelector(`[data-id="${productId}"]`);
    if (productCard) {
        productCard.remove();
    } else {
        alert('Product not found');
    }
}
