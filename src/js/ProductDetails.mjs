import { setLocalStorage } from "./utils.mjs";

function productDetailsTemplate(product) {

  return `<section class="product-detail">
    <h3>${product.Brand?.Name || "No Brand Available"}</h3>
    <h2 class="divider">${product.NameWithoutBrand || "Unknown Product"}</h2>
    <img
      class="divider"
      src="${product.Image || product.Images?.PrimaryLarge || '/images/default-product.jpg'}"
      alt="${product.NameWithoutBrand || "Product Image"}"
    />
    <p class="product-card__price">$${product.FinalPrice.toFixed(2)}</p>
    <p class="product__color">${product.Colors[0]?.ColorName || "No Color Available"}</p>
    <p class="product__description">${product.DescriptionHtmlSimple || ""}</p>
    <div class="product-detail__add">
      <button id="addToCart" data-id="${product.Id}">Add to Cart</button>
    </div>
  </section>`;
}


export default class ProductDetails {
  constructor(productId, dataSource) {
    this.productId = productId;
    this.product = {};
    this.dataSource = dataSource;
  }

  async init() {
    try {
      // Get the details for this specific product
      this.product = await this.dataSource.findProductById(this.productId);
  
      if (!this.product) {
        this.renderError("Product not found.");
        return;
      }
  
      this.renderProductDetails("main");
      this.setupEventListeners();
    } catch (error) {
      console.error("Error loading product details:", error);
      this.renderError("There was an error loading the product details.");
    }
  }
  

  setupEventListeners() {
    const addToCartButton = document.getElementById("addToCart");
    if (addToCartButton) {
      addToCartButton.addEventListener("click", this.addToCart.bind(this));
    } else {
      console.error("Add to Cart button not found.");
    }
  }

  // Updated addToCart function to handle adding products to the cart
  addToCart() {
    if (!this.product) {
      console.error("Cannot add an undefined product to the cart.");
      return;
    }
  
    // Resolve image URL for the product (convert local paths to absolute)
    const resolvedImage = this.product.Image
      ? `${window.location.origin}${this.product.Image}` // Convert local paths to absolute
      : this.product.Images?.PrimaryLarge || "/images/tents/default-tent.jpg"; // Fallback for external or missing images
  
    let cart = JSON.parse(localStorage.getItem("so-cart")) || [];
    cart = Array.isArray(cart) ? cart : [cart];
  
    const existingItemIndex = cart.findIndex((item) => item.Id === this.product.Id);
  
    // Prepare product for the cart
    const productToSave = {
      ...this.product,
      Image: resolvedImage, // Always store an absolute URL for the image
    };
  
    if (existingItemIndex >= 0) {
      cart[existingItemIndex].quantity = (cart[existingItemIndex].quantity || 1) + 1;
    } else {
      productToSave.quantity = 1;
      cart.push(productToSave);
    }
  
    setLocalStorage("so-cart", cart);
  }  
  
  // Updated renderProductDetails method to use the productDetailsTemplate
  renderProductDetails(selector) {
    const element = document.querySelector(selector);
    if (!element) {
      console.error(`Selector ${selector} not found.`);
      return;
    }

    element.insertAdjacentHTML(
      "afterBegin",
      productDetailsTemplate(this.product),
    );
  }

  renderError(message) {
    const element = document.querySelector("main");
    if (element) {
      element.innerHTML = `<p class="error-message">${message}</p>`;
    } else {
      console.error("Main element not found for rendering error.");
    }
  }
}