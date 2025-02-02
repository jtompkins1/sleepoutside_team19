import { getLocalStorage, setLocalStorage } from "./utils.mjs";

function cartItemTemplate(item) {
    // Use resolved image URL
    const imageUrl = item.Image || `${window.location.origin}/images/tents/default-tent.jpg`;
  
    const quantity = item.quantity || 1;
  
    return `<li class="cart-card divider">
      <a href="#" class="cart-card__image">
        <img src="${imageUrl}" alt="Image of ${item.Name}">
      </a>
      <a href="#">
        <h2 class="card__name">${item.Name}</h2>
      </a>
      <p class="cart-card__color">${item.Colors?.[0]?.ColorName || "No Color"}</p>
      <div class="cart-card__quantity">
        <button class="quantity-btn minus" data-id="${item.Id}">-</button>
        <span class="quantity">${quantity}</span>
        <button class="quantity-btn plus" data-id="${item.Id}">+</button>
      </div>
      <p class="cart-card__price">$${(item.FinalPrice * quantity).toFixed(2)}</p>
      <span class="remove-item" data-id="${item.Id}">❌</span>
    </li>`;
  }
  
  // ShoppingCart Class
export default class ShoppingCart {
    constructor(parentSelector) {
        this.parentElement = document.querySelector(parentSelector);
      
        // Ensure all cart items have a resolved image
        this.cartItems = (getLocalStorage("so-cart") || []).map(item => ({
          ...item,
          Image: item.Image || item.Images?.PrimaryLarge || "/images/tents/default-tent.jpg", // Use a valid fallback
        }));
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
  
    // Ensure all cart items have properly resolved image URLs
    this.cartItems = this.cartItems.map((item) => ({
      ...item,
      Image: item.Image || item.Images?.PrimaryLarge || `${window.location.origin}/images/tents/default-tent.jpg`,
    }));
  
    // Log the cart items for debugging
    console.warn("Cart Items:", this.cartItems);
  
    const htmlItems = this.cartItems.map((item) => cartItemTemplate(item));
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

