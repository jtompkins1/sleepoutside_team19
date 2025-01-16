import { getParam } from "../js/utils.mjs";
import ProductData from "./ProductData.mjs";
import ProductDetails from "./ProductDetails.mjs";

// Uncomment the line below for debugging purposes:
// console.log("Product.js is loading");

// Initialize ProductData for the "tents" category
const dataSource = new ProductData("tents");

// Retrieve product ID from URL query string
const productId = getParam("product");

// Uncomment the line below for debugging purposes:
// console.log("Product ID found:", productId);

// Initialize ProductDetails and render the product
if (productId) {
  const product = new ProductDetails(productId, dataSource);
  product.init();
} else {
  // eslint-disable-next-line no-console
  console.error("Product ID not found in URL.");
}
