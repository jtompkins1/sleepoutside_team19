// Load the header and footer
import { loadHeaderFooter, generateBreadcrumbs } from "../js/utils.mjs";
import ProductListing from "../js/ProductList.mjs";
import ExternalServices from "../js/ExternalServices.mjs";
import { getParam } from "../js/utils.mjs";
 
// Wrap the initialization in an async function
async function init() {
  // Wait for header and footer to load
  await loadHeaderFooter();
 
  // Generate breadcrumbs after header is loaded
  generateBreadcrumbs();
 
 
// Get the category parameter from the URL
let category = getParam("category");
if (!category) {
    console.error("No category parameter found");
    // Set a default category if none is found
    const defaultCategory = "all";
    category = defaultCategory;
    console.warn(`No category parameter found. Defaulting to category: ${defaultCategory}`);
}
 
// Create a data source instance based on the category
const dataSource = new ExternalServices(category);
 
// Select the HTML element where the product list will be rendered
const listElement = document.querySelector(".product-list");
 
// Update the page heading dynamically based on the category
// Update this section in product-listing.js
const pageHeading = document.querySelector(".products h2");
if (category !== "all") {
    const formattedCategory = category.replace("-", " ").replace(/^\w/, (c) => c.toUpperCase());
    pageHeading.textContent = `Top Products: ${formattedCategory}`;
} else {
    pageHeading.textContent = "Top Products";
}
 
// Check if the list element exists
if (!listElement) {
  console.error("Error: The product list element is missing in the HTML.");
} else {
  console.warn("Product list element found:", listElement);
}
 
// Create an instance of ProductListing
const productListing = new ProductListing(category, dataSource, listElement);
 
// Add error handling during initialization
try {
  // Initialize the ProductListing to display products for the selected category
  productListing.init();
  console.warn(`Product listing initialized successfully for category: ${category}`);
} catch (error) {
  console.error("Error during product listing initialization:", error);
}
}
 
// Call the initialization function
init().catch(error => {
  console.error("Initialization error:", error);
});



 
 