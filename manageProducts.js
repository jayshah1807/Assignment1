let products = [];

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
async function addProduct(event) {
    event.preventDefault();
    
    // Fetch product details from the form
    const productName = document.getElementById('productName').value;
    const productDescription = document.getElementById('productDescription').value;
    const productQuantity = document.getElementById('productQuantity').value;
    const productPhoto = document.getElementById('productPhoto').files[0];
    
    const farmerId = localStorage.getItem('farmerId');

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
    localStorage.setItem(farmerId, JSON.stringify(products));
    
    addProductToList(product);

    document.getElementById('add-product-form').reset();
}

function loadProducts() {
    const farmerId = localStorage.getItem('farmerId');
    let products = JSON.parse(localStorage.getItem(farmerId)) || [];
    
    products.forEach(product => {
        addProductToList(product);
    });
}

window.onload = function() {
    loadProducts();
};

function addProductToList(product) {
    const productList = document.getElementById('product-list');
    const card = document.createElement('div');
    card.classList.add('col-md-4', 'product-card');
    card.setAttribute('data-id', product.id); 
    
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
}

function editProduct(productId) {
    const farmerId = localStorage.getItem('farmerId');

    let products = JSON.parse(localStorage.getItem(farmerId)) || [];

    const product = products.find(p => p.id === productId);

    if (!product) {
        alert("Product not found");
        return;
    }

    document.getElementById('productName').value = product.name;
    document.getElementById('productDescription').value = product.description;
    document.getElementById('productQuantity').value = product.quantity;

    const productPhotoInput = document.getElementById('productPhoto');
    productPhotoInput.removeAttribute('required');

    const submitButton = document.querySelector('#add-product-form button[type="submit"]');
    submitButton.textContent = 'Update Product';

    submitButton.removeEventListener('click', addProduct);
    submitButton.addEventListener('click', async function updateProduct(event) {
        event.preventDefault();

        product.name = document.getElementById('productName').value;
        product.description = document.getElementById('productDescription').value;
        product.quantity = document.getElementById('productQuantity').value;

        if (productPhotoInput.files[0]) {
            product.photoUrl = await convertToBase64(productPhotoInput.files[0]);
        }

        localStorage.setItem(farmerId, JSON.stringify(products));

        const productCard = document.querySelector(`[data-id="${productId}"]`);
        productCard.querySelector('.card-title').textContent = product.name;
        productCard.querySelector('.card-text').textContent = product.description;
        productCard.querySelector('.card-text + .card-text').textContent = `Quantity: ${product.quantity} kgs`;

        if (productPhotoInput.files[0]) {
            productCard.querySelector('img').src = product.photoUrl;
        }

        document.getElementById('add-product-form').reset();
        productPhotoInput.setAttribute('required', 'required');
        submitButton.textContent = 'Add Product';

        submitButton.removeEventListener('click', updateProduct);
        submitButton.addEventListener('click', addProduct);
    });
}


function deleteProduct(productId) {
    const farmerId = localStorage.getItem('farmerId'); 

    let products = JSON.parse(localStorage.getItem(farmerId)) || [];

    products = products.filter(product => product.id !== productId);

    localStorage.setItem(farmerId, JSON.stringify(products));

    const productCard = document.querySelector(`[data-id="${productId}"]`);
    if (productCard) {
        productCard.remove();
    } else {
        alert('Product not found');
    }
}
