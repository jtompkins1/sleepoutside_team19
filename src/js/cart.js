import { getLocalStorage } from "./utils.mjs";

function renderCartContents() {
  let cartItems = getLocalStorage("so-cart");

  // If no items in cart, display an "empty cart" message
  if (!cartItems || cartItems.length === 0) {
    document.querySelector(".product-list").innerHTML = `
      <p class="empty-cart-message">Your cart is empty.</p>
    `;
    return;
  }

  // Make sure cartItems is an array (to avoid issues with single items)
  if (!Array.isArray(cartItems)) {
    cartItems = [cartItems];
  }

  // Map cart items to HTML and display them
  const htmlItems = cartItems.map((item) => cartItemTemplate(item));
  document.querySelector(".product-list").innerHTML = htmlItems.join("");
}

function cartItemTemplate(item) {
  const newItem = `<li class="cart-card divider">
    <a href="#" class="cart-card__image">
      <img
        src="${item.Image}"
        alt="${item.Name}"
      />
    </a>
    <a href="#">
      <h2 class="card__name">${item.Name}</h2>
    </a>
    <p class="cart-card__color">${item.Colors[0].ColorName}</p>
    <p class="cart-card__quantity">qty: 1</p>
    <p class="cart-card__price">$${item.FinalPrice}</p>
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
renderCartContents();

// Attach the clearCart function to the Clear Cart button
document.getElementById("clearCart").addEventListener("click", clearCart);
