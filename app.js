// Product Data
const product = {
    id: 'titanium-pro',
    name: 'Titanium Series Pro',
    price: 399.00,
    image: 'assets/smartwatch_main.png'
};

// State
let currentQty = 1;
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    updateCartUI();
});

// Image Gallery Logic
function changeImage(src, element) {
    // Update main image
    document.getElementById('mainProductImg').src = src;
    
    // Update active state on thumbnails
    const thumbnails = document.querySelectorAll('.thumbnail');
    thumbnails.forEach(thumb => thumb.classList.remove('active'));
    element.classList.add('active');
}

// Quantity Logic
function updateQty(change) {
    const input = document.getElementById('qtyInput');
    let newValue = parseInt(input.value) + change;
    
    if (newValue >= 1) {
        currentQty = newValue;
        input.value = currentQty;
    }
}

// Add to Cart
function addToCart() {
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
        existingItem.quantity += currentQty;
    } else {
        cart.push({
            ...product,
            quantity: currentQty
        });
    }
    
    saveCart();
    updateCartUI();
    
    // Show offcanvas automatically
    const cartOffcanvas = new bootstrap.Offcanvas(document.getElementById('cartOffcanvas'));
    cartOffcanvas.show();
    
    // Reset quantity
    currentQty = 1;
    document.getElementById('qtyInput').value = 1;
}

// Remove from Cart
function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    saveCart();
    updateCartUI();
}

// Save to LocalStorage
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Update Cart UI
function updateCartUI() {
    const container = document.getElementById('cartItemsContainer');
    const badge = document.getElementById('cartBadge');
    const totalElement = document.getElementById('cartTotal');
    
    // Calculate totals
    let totalItems = 0;
    let totalPrice = 0;
    
    container.innerHTML = '';
    
    if (cart.length === 0) {
        container.innerHTML = `
            <div class="text-center text-muted mt-5">
                <i class="bi bi-cart-x fs-1 mb-3 d-block"></i>
                <p>Your cart is empty.</p>
            </div>
        `;
    } else {
        cart.forEach(item => {
            totalItems += item.quantity;
            totalPrice += item.price * item.quantity;
            
            container.innerHTML += `
                <div class="cart-item d-flex align-items-center gap-3">
                    <img src="${item.image}" alt="${item.name}" class="cart-item-img p-1">
                    <div class="flex-grow-1">
                        <h6 class="mb-1 text-light fs-6">${item.name}</h6>
                        <div class="text-accent fw-bold">$${item.price.toFixed(2)}</div>
                        <div class="text-muted fs-7">Qty: ${item.quantity}</div>
                    </div>
                    <button class="btn btn-link text-muted p-2" onclick="removeFromCart('${item.id}')">
                        <i class="bi bi-trash3"></i>
                    </button>
                </div>
            `;
        });
    }
    
    // Update Badge
    if (totalItems > 0) {
        badge.textContent = totalItems;
        badge.classList.remove('d-none');
    } else {
        badge.classList.add('d-none');
    }
    
    // Update Total
    totalElement.textContent = `$${totalPrice.toFixed(2)}`;
}
