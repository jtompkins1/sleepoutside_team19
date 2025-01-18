import ProductData from "./ProductData.mjs";
import ProductDetails from "./ProductDetails.mjs";
import { getParam } from "./utils.mjs";

const productId = getParam("product"); // Get product ID from URL parameter
const dataSource = new ProductData("tents"); // Load the correct JSON file
const product = new ProductDetails(productId, dataSource);

product.init(); // Initialize and render the product details
