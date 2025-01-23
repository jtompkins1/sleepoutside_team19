import { renderListWithTemplate } from "./utils.mjs"; // Import the utility function

function productCardTemplate(product) {
  return `<li class="product-card">
    <a href="/product-pages/?product=${product.Id}"> <!-- Absolute Path -->
      <img src="${product.Image}" alt="Image of ${product.Name}">
      <h3 class="card__brand">${product.Brand.Name}</h3>
      <h2 class="card__name">${product.NameWithoutBrand}</h2>
      <p class="product-card__price">$${product.FinalPrice}</p>
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
  
    async init() {
      // Fetch the data (assumes getData() returns a Promise)
      const list = await this.dataSource.getData(this.category);
      // Log to confirm data retrieval
      // eslint-disable-next-line no-console
      console.log('Data fetched:', list);

      // Filter the list to show only the first 4 products
      const filteredList = this.filterProducts(list, 4);

      // Log to confirm filtered data
      // eslint-disable-next-line no-console
      console.log("Filtered list of products:", filteredList);

      // Use the reusable utility function to render the filtered list
      this.renderList(filteredList);
    }
  
    renderList(list) {
        // Render the list of products dynamically
        // eslint-disable-next-line no-console
        console.log('Rendering list of products:', list);
      
        // Use the reusable renderListWithTemplate function to render the list
        renderListWithTemplate(productCardTemplate, this.listElement, list, "afterbegin", true);
    }
    
    // New method to filter the list of products
    filterProducts(list, count) {
      return list.slice(0, count); // Returns the first 'count' items from the list
    }
}