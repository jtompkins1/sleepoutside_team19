import { loadHeaderFooter } from "./utils.mjs"; // Import loadHeaderFooter
import ProductListing from './ProductList.mjs'; // Import the ProductListing class
import ProductData from './ProductData.mjs'; // Import the ProductData class
import Alert from './Alert.mjs'; // Import the Alert class

// Load the header and footer
loadHeaderFooter(); // Dynamically fetch and render header and footer

// Create an instance of ProductData for fetching product data
const dataSource = new ProductData('all'); // Use 'all' to fetch products from all categories

// Select the HTML element where the product list will be rendered
const listElement = document.querySelector('.product-list'); // Ensure this class exists in your HTML

// Create an instance of ProductListing
const productListing = new ProductListing('top-products', dataSource, listElement);

// Add error handling during initialization
try {
  productListing.initTopProducts(4);
  new Alert().init();
} catch (error) {
  console.error('Error:', error);
}
