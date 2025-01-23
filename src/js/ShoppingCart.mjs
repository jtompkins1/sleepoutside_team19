import { getLocalStorage, setLocalStorage } from "./utils.mjs";

function cartItemTemplate(item) {
  const quantity = item.quantity || 1;
  return `<li class="cart-card divider">
    <a href="#" class="cart-card__image">
      <img src="${item.Image}" alt="${item.Name}">
    </a>
    <a href="#">
      <h2 class="card__name">${item.Name}</h2>
    </a>
    <p class="cart-card__color">${item.Colors[0].ColorName}</p>
    <div class="cart-card__quantity">
      <button class="quantity-btn minus" data-id="${item.Id}">-</button>
      <span class="quantity">${quantity}</span>
      <button class="quantity-btn plus" data-id="${item.Id}">+</button>
    </div>
    <p class="cart-card__price">$${(item.FinalPrice * quantity).toFixed(2)}</p>
    <span class="remove-item" data-id="${item.Id}">❌</span>
  </li>`;
}

export default class ShoppingCart {
  constructor(parentSelector) {
    this.parentElement = document.querySelector(parentSelector);
    this.cartItems = getLocalStorage("so-cart") || [];
  }

  async init() {
    this.renderCart();
    this.bindButtons();
  }

  calculateTotal() {
    return this.cartItems.reduce((total, item) => {
      const price = parseFloat(item.FinalPrice);
      const quantity = item.quantity || 1;
      return total + (price * quantity);
    }, 0).toFixed(2);
  }

  renderCart() {
    if (!this.cartItems.length) {
      this.parentElement.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
      return;
    }

    const htmlItems = this.cartItems.map(item => cartItemTemplate(item));
    this.parentElement.innerHTML = htmlItems.join("");
    document.querySelector(".cart-total").textContent = `Total: $${this.calculateTotal()}`;
    document.querySelector(".cart-footer").classList.remove("hide");
  }

  updateQuantity(productId, change) {
    const itemIndex = this.cartItems.findIndex(item => item.Id === productId);
    if (itemIndex !== -1) {
      this.cartItems[itemIndex].quantity = (this.cartItems[itemIndex].quantity || 1) + change;
      if (this.cartItems[itemIndex].quantity < 1) this.cartItems[itemIndex].quantity = 1;
      setLocalStorage("so-cart", this.cartItems);
      this.renderCart();
    }
  }

  removeItem(productId) {
    this.cartItems = this.cartItems.filter(item => item.Id !== productId);
    setLocalStorage("so-cart", this.cartItems);
    this.renderCart();
  }

  clearCart() {
    localStorage.removeItem("so-cart");
    this.cartItems = [];
    this.renderCart();
  }

  bindButtons() {
    this.parentElement.addEventListener("click", (e) => {
      if (e.target.classList.contains("quantity-btn")) {
        const change = e.target.classList.contains("plus") ? 1 : -1;
        this.updateQuantity(e.target.dataset.id, change);
      }
      if (e.target.classList.contains("remove-item")) {
        this.removeItem(e.target.dataset.id);
      }
    });

    const clearCartBtn = document.getElementById("clearCart");
    if (clearCartBtn) {
      clearCartBtn.addEventListener("click", () => this.clearCart());
    }
  }
}