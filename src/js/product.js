import { setLocalStorage, getLocalStorage } from "./utils.mjs";
import ProductData from "./ProductData.mjs";

const dataSource = new ProductData("tents");

function addProductToCart(product) {
  // Retrieve the current cart items from localStorage
  let cartItems = getLocalStorage("so-cart") || [];
  // Check if cartItems is an array, if not, initialize it as an empty array
  if (!Array.isArray(cartItems)) {
    cartItems = []; // Ensure cartItems is an array
  }
   // Add the new product to the cartItems array
  cartItems.push(product);
   // Save the updated cartItems array back to localStorage
  setLocalStorage("so-cart", cartItems);

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
