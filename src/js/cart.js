import { getLocalStorage } from "./utils.mjs";

// Function to calculate the total price of items in the cart
function calculateTotal(cartItems) {
  return cartItems.reduce((total, item) => {
    const price = parseFloat(item.FinalPrice);
    return isNaN(price) ? total : total + price;
  }, 0).toFixed(2);
}



function renderCartContents() {
  let cartItems = getLocalStorage("so-cart");

  // If no items in cart, display an "empty cart" message
  if (!cartItems || cartItems.length === 0) {
    document.querySelector(".product-list").innerHTML = `
      <p class="empty-cart-message">Your cart is empty.</p>
    `;
    document.querySelector(".cart-total").textContent = "Total: $0.00"; // Reset total to 0
    document.querySelector(".cart-footer").classList.add("hide"); // Hide footer if cart is empty
    return;
  }

  // Make sure cartItems is an array (to avoid issues with single items)
  if (!Array.isArray(cartItems)) {
    cartItems = [cartItems];
  }

  // Map cart items to HTML and display them
  const htmlItems = cartItems.map((item) => cartItemTemplate(item));
  document.querySelector(".product-list").innerHTML = htmlItems.join("");

  // Calculate and update the total
  const total = calculateTotal(cartItems);
  document.querySelector(".cart-total").textContent = `Total: $${total}`;
  document.querySelector(".cart-footer").classList.remove("hide"); // Show footer if cart has items
}

function cartItemTemplate(item) {
  const newItem = `<li class="cart-card divider">
    <a href="#" class="cart-card__image">
      <img
        src="${item.Image || ''}"
        alt="${item.Name || 'Item'}"
      />
    </a>
    <a href="#">
      <h2 class="card__name">${item.Name || 'Unnamed Item'}</h2>
    </a>
    <p class="cart-card__color">${item.Colors && item.Colors[0] ? item.Colors[0].ColorName : 'Unknown'}</p>
    <p class="cart-card__quantity">qty: 1</p>
    <p class="cart-card__price">$${item.FinalPrice || '0.00'}</p>
  </li>`;
  return newItem;
}

// Clear Cart Function
function clearCart() {
  // Remove the cart from localStorage
  localStorage.removeItem("so-cart");

  // Re-render the cart to show the empty cart message
  renderCartContents();
}

// Render the cart contents when the script loads
document.addEventListener('DOMContentLoaded', () => {
  renderCartContents();

  // Attach the clearCart function to the Clear Cart button
  const clearCartButton = document.getElementById("clearCart");
  if (clearCartButton) {
    clearCartButton.addEventListener("click", clearCart);
  } else {
    console.error("Clear cart button not found in the DOM.");
  }
});