import { getLocalStorage, setLocalStorage } from "./utils.mjs";
import ProductData from "./ProductData.mjs";

const dataSource = new ProductData("tents");

function addProductToCart(product) {
  //get existing cart or initialize empty array
  let cart = getLocalStorage("so-cart") || [];

  //ensure cart is an array
  if (!Array.isArray(cart)) {
    cart = [];
  }

  //add new product to cart
  cart.push(product);

  setLocalStorage("so-cart", cart);
}
// add to cart button event handler
async function addToCartHandler(e) {
  const product = await dataSource.findProductById(e.target.dataset.id);
  addProductToCart(product);
}

// add listener to Add to Cart button
document
  .getElementById("addToCart")
  .addEventListener("click", addToCartHandler);
