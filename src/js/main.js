import ProductListing from './ProductList.mjs'; // Import the ProductListing class
import ProductData from './ProductData.mjs'; // Import the ProductData class
import Alert from './Alert.mjs'; // Import the Alert class

// Create an instance of ProductData for fetching product data
const dataSource = new ProductData('tents'); // Replace 'tents' with the appropriate category if needed

// Select the HTML element where the product list will be rendered
const listElement = document.querySelector('.product-list'); // Ensure this class exists in your HTML

// Create an instance of ProductListing
const productListing = new ProductListing('tents', dataSource, listElement);

// Initialize the ProductListing class
productListing.init();

//Create an instance of Alert
alert = new Alert();

//Initialize the Alert class
alert.init();