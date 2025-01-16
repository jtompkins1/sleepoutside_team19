import { getLocalStorage } from "./utils.mjs";

function renderCartContents() {
  // Retrieve the cart items from localStorage or initialize as an empty array if null
  const cartItems = getLocalStorage("so-cart") || [];
  // Generate HTML for each cart item using the cartItemTemplate function and join them into a single string
  const htmlItems = cartItems.map(cartItemTemplate).join("");
  // Insert the generated HTML into the element with the class 'product-list'
  document.querySelector(".product-list").innerHTML = htmlItems;
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

renderCartContents();
