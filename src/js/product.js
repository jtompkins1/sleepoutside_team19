import ProductData from "./ProductData.mjs";
import ProductDetails from "./ProductDetails.mjs";
import { getParam, loadHeaderFooter } from "./utils.mjs"; // Import loadHeaderFooter

// Dynamically load the header and footer
loadHeaderFooter();

const productId = getParam("product"); // Get product ID from URL parameter
const dataSource = new ProductData("all"); // Use "all" to load all products across categories
const product = new ProductDetails(productId, dataSource);

product.init(); // Initialize and render the product details
