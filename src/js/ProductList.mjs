//ProdcutList.mjs
import { renderListWithTemplate, calculateDiscount } from "./utils.mjs"; // Import the utility function

function productCardTemplate(product) {
  // Check both `product.Image` (local paths) and `product.Images.PrimaryLarge` (external links)
  const imageUrl = product.Image || product.Images?.PrimaryLarge || "/images/default-product.jpg";

  //Define different image sizes 
  const srcSet = `
    ${product.Images?.PrimarySmall || "/images/default-product-small.jpg"} 300w,
    ${product.Images?.PrimaryMedium || "/images/default-product-medium.jpg"} 600w,
    ${product.Images?.PrimaryLarge || imageUrl} 1200w
  `;
  //Use the attribute 'sizes' to determine what size the image will use.
  const sizes = `
    (max-width: 600px) 300px,
    (max-width: 1200px) 600px,
    1200px
  `;

  // Calculate the discount percentage
  const discount = calculateDiscount(product.FinalPrice, product.SuggestedRetailPrice);

  return `<li class="product-card">
    <a href="/product-pages/?product=${product.Id}"> <!-- Absolute Path -->
      <img 
        src="${imageUrl}"
        srcset="${srcSet}"
        sizes="${sizes}"
        alt="Image of ${product.Name}">
      <h3 class="card__brand">${product.Brand?.Name || "Unknown Brand"}</h3>
      <h2 class="card__name">${product.NameWithoutBrand || "Unnamed Product"}</h2>
      <p class="product-card__price">$${product.FinalPrice || "N/A"}</p>
      ${discount ? `<p class="product-card__discount">${discount}</p>` : ""}

    </a>
  </li>`;
}



export default class ProductListing {
  constructor(category, dataSource, listElement) {
    // Make the class flexible and reusable by passing in category, data source, and target HTML element
    this.category = category;
    this.dataSource = dataSource;
    this.listElement = listElement;
  }
  // Updated init method to handle top products
  async init() {
    try {
      // Fetch all products
      const list = await this.dataSource.getData();
      console.warn("Data fetched:", list); // Log to confirm data retrieval

      // Render all products
      this.renderList(list);
    } catch (error) {
      console.error("Error initializing ProductListing:", error);
    }
  }

  // New Method for Top Products
  async initTopProducts(count) {
    try {
      // Fetch all products
      const list = await this.dataSource.getData();
      console.warn("Fetched products:", list); // Log fetched products

      // Filter the list to show only the top `count` products
      const topProducts = this.filterProducts(list, count);

      console.warn("Top products:", topProducts); // Log filtered products

      // Render the top products
      this.renderList(topProducts);
    } catch (error) {
      console.error("Error fetching top products:", error);
    }
  }

  renderList(list) {
    // Render the list of products dynamically
    console.warn("Rendering list of products:", list);

    // Use the reusable renderListWithTemplate function to render the list
    renderListWithTemplate(productCardTemplate, this.listElement, list, "afterbegin", true);
  }

  // Helper Method to Filter Products
  filterProducts(list, count) {
    return list.slice(0, count); // Returns the first 'count' items from the list
  }
}
