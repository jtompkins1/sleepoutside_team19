import {loadHeaderFooter} from './utils.mjs'; // Import the load HeaderFooter function
loadHeaderFooter(); // Load the header and footer on page load

import ProductListing from './ProductList.mjs'; // Import the ProductListing class
import ProductData from './ProductData.mjs'; // Import the ProductData class
import Alert from './Alert.mjs'; // Import the Alert class



// Create an instance of ProductData for fetching product data
const dataSource = new ProductData('tents'); // Replace 'tents' with the appropriate category if needed

// Select the HTML element where the product list will be rendered
const listElement = document.querySelector('.product-list'); // Ensure this class exists in your HTML

// Check if the list element exists
if (!listElement) {
  console.error('Error: The product list element is missing in the HTML.');
} else {
  console.warn('Product list element found:', listElement);
}

// Create an instance of ProductListing
const productListing = new ProductListing('tents', dataSource, listElement);

// Create an instance of Alert
const alert = new Alert();

// Add error handling during initialization
try {
  // Initialize the ProductListing
  productListing.init();
  
  // Initialize the Alert system
  alert.init();
  
  console.warn('Product listing and alert system initialized successfully.');
} catch (error) {
  console.error('Error during initialization:', error);
}
