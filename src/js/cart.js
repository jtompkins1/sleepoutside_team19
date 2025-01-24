import { getLocalStorage, setLocalStorage, loadHeaderFooter } from "./utils.mjs"; // Added loadHeaderFooter import
import ShoppingCart from "./ShoppingCart.mjs";

// Function to calculate the total price of items in the cart
// Updated to handle quantity changes
function calculateTotal(cartItems) {
  return cartItems.reduce((total, item) => {
    const price = parseFloat(item.FinalPrice);
    const quantity = parseInt(item.quantity) || 1;
    const itemTotal = price * quantity;
    return isNaN(itemTotal) ? total : total + itemTotal;
  }, 0).toFixed(2);
}

function renderCartContents() {
  let cartItems = getLocalStorage("so-cart");

  // If no items in cart, display an "empty cart" message
  if (!cartItems || cartItems.length === 0) {
    document.querySelector(".product-list").innerHTML = `
      <p class="empty-cart-message">Your cart is empty.</p>
    `;
    document.querySelector(".cart-total").textContent = "Total: $0.00";
    document.querySelector(".cart-footer").classList.add("hide");
    return;
  }

  // Make sure cartItems is an array
  if (!Array.isArray(cartItems)) {
    cartItems = [cartItems];
  }

  // Map cart items to HTML and display them
  const htmlItems = cartItems.map((item) => cartItemTemplate(item));
  document.querySelector(".product-list").innerHTML = htmlItems.join("");

  // Attach listeners AFTER rendering content
  attachRemoveListeners();
  attachQuantityListeners();

 // Updated the calculate and update the total
const total = calculateTotal(cartItems);
document.querySelector(".cart-total").textContent = `Total: $${total}`;
document.querySelector(".cart-footer").classList.remove("hide");
}

// Updated cartItemTemplate function to include quantity buttons
function cartItemTemplate(item) {
  return `<li class="cart-card divider">
    <a href="#" class="cart-card__image">
      <img src="${item.Image || ''}" alt="${item.Name || 'Item'}" />
    </a>
    <a href="#">
      <h2 class="card__name">${item.Name || 'Unnamed Item'}</h2>
    </a>
    <p class="cart-card__color">${item.Colors?.[0]?.ColorName || 'Unknown'}</p>
    <div class="cart-card__quantity">
      <button class="quantity-btn minus" data-id="${item.Id}">-</button>
      <span class="quantity">${item.quantity || 1}</span>
      <button class="quantity-btn plus" data-id="${item.Id}">+</button>
    </div>
    <p class="cart-card__price">$${(item.FinalPrice * (item.quantity || 1)).toFixed(2)}</p>
    <span class="remove-item" data-id="${item.Id}">❌</span>
  </li>`;
}

// Added updateQuantity function to handle quantity changes
function updateQuantity(productId, change) {
  let cartItems = getLocalStorage("so-cart") || [];
  const itemIndex = cartItems.findIndex(item => item.Id === productId);
  
  if (itemIndex !== -1) {
    cartItems[itemIndex].quantity = (cartItems[itemIndex].quantity || 1) + change;
    if (cartItems[itemIndex].quantity < 1) cartItems[itemIndex].quantity = 1;
    setLocalStorage("so-cart", cartItems);
    renderCartContents();
  }
}

function attachQuantityListeners() {
  document.querySelectorAll('.quantity-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const change = e.target.classList.contains('plus') ? 1 : -1;
      updateQuantity(e.target.dataset.id, change);
    });
  });
}

// Clear Cart Function
function clearCart() {
  // Remove the cart from localStorage
  localStorage.removeItem("so-cart");

  // Re-render the cart to show the empty cart message
  renderCartContents();
}

// Adds click event listeners to each 'remove' button in the cart.
function attachRemoveListeners() {
  const removeButtons = document.querySelectorAll(".remove-item");
  removeButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
      const productId = event.target.getAttribute("data-id");
      removeFromCart(productId);
    });
  });
}

// Fixed removes a product from the cart based on its ID since when the user clicks the 'remove' button.
function removeFromCart(productId) {
  let cartItems = getLocalStorage("so-cart") || [];

  // Filter out the item to be removed
  cartItems = cartItems.filter((item) => item.Id !== productId);

  // Update localStorage with the new cart items
  setLocalStorage("so-cart", cartItems);

  // Re-render the cart
  renderCartContents();
}

// Function to handle the "Proceed to Checkout" button
function handleProceedToCheckout() {
  const cartItems = getLocalStorage("so-cart");
  if (!cartItems || cartItems.length === 0) {
    alert("Your cart is empty. Please add items before proceeding to checkout.");
    return;
  }

  // Redirect to the checkout page
  window.location.href = "/cart/checkout.html";
}

// Added initialize cart functionality and dynamically load header/footer
document.addEventListener("DOMContentLoaded", async () => {
  // Dynamically load the header and footer
  await loadHeaderFooter(); // Added to load header and footer dynamically
  const cart = new ShoppingCart(".product-list");
  cart.init();

  // Render the cart contents
  renderCartContents(); // Existing functionality to render cart items

  // Attached the clearCart function to the Clear Cart button
  const clearCartButton = document.getElementById("clearCart");
  if (clearCartButton) {
    clearCartButton.addEventListener("click", clearCart); // Existing functionality for clearing the cart
  } else {
    console.error("Clear cart button not found in the DOM.");
  }

  // Attach the handleProceedToCheckout function to the "Proceed to Checkout" button
  const proceedToCheckoutButton = document.getElementById("proceedToCheckout");
  if (proceedToCheckoutButton) {
    proceedToCheckoutButton.addEventListener("click", handleProceedToCheckout);
  } else {
    console.error("Proceed to Checkout button not found in the DOM.");
  }
});
