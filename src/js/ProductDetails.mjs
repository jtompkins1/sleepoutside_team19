import { setLocalStorage } from "./utils.mjs";

function productDetailsTemplate(product) {
  return `<section class="product-detail">
    <h3>${product.Brand?.Name || "No Brand Available"}</h3>
    <h2 class="divider">${product.NameWithoutBrand || "Unknown Product"}</h2>
    <img
      class="divider"
      src="${product.Image || "/images/default-product.jpg"}"
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

  addToCart() {
    if (!this.product) {
      console.error("Cannot add an undefined product to the cart.");
      return;
    }

    let cart = JSON.parse(localStorage.getItem("so-cart")) || [];
    cart = Array.isArray(cart) ? cart : [cart];
    cart.push(this.product);
    setLocalStorage("so-cart", cart);
  }

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