import { setLocalStorage } from "./utils.mjs";

function productDetailsTemplate(product) {
  return `<section class="product-detail">
    <h3>${product.Brand.Name}</h3>
    <h2 class="divider">${product.NameWithoutBrand}</h2>
    <img
      class="divider"
      src="${product.Image}"
      alt="${product.NameWithoutBrand}"
    />
    <p class="product-card__price">$${product.FinalPrice}</p>
    <p class="product__color">${product.Colors[0].ColorName}</p>
    <p class="product__description">${product.DescriptionHtmlSimple}</p>
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

      // Handle invalid product
      if (!this.product) {
        this.renderError("Product not found.");
        return; // Exit early to prevent further execution
      }

      // Render product details
      this.renderProductDetails("main");

      // Add listener to Add to Cart button
      document
        .getElementById("addToCart")
        .addEventListener("click", this.addToCart.bind(this));
    } catch (error) {
      // Log the error and display an error message to the user
      console.error("Error loading product details:", error);
      this.renderError("There was an error loading the product details.");
    }
  }

  addToCart() {
    let cart = JSON.parse(localStorage.getItem("so-cart")) || [];

    // Ensure cart is an array
    if (!Array.isArray(cart)) {
      cart = [cart];
    }

    cart.push(this.product);
    setLocalStorage("so-cart", cart);
  }

  renderProductDetails(selector) {
    const element = document.querySelector(selector);
    element.insertAdjacentHTML(
      "afterBegin",
      productDetailsTemplate(this.product)
    );
  }

  renderError(message) {
    const element = document.querySelector("main");
    element.innerHTML = `<p class="error-message">${message}</p>`;
  }
}
