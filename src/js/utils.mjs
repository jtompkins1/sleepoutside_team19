//utils.mjs
// wrapper for querySelector...returns matching element
export function qs(selector, parent = document) {
  return parent.querySelector(selector);
}
// or a more concise version if you are into that sort of thing:
// export const qs = (selector, parent = document) => parent.querySelector(selector);

// retrieve data from localstorage
export function getLocalStorage(key) {
  return JSON.parse(localStorage.getItem(key));
}

// save data to local storage
export function setLocalStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

// set a listener for both touchend and click
export function setClick(selector, callback) {
  qs(selector).addEventListener("touchend", (event) => {
    event.preventDefault();
    callback();
  });
  qs(selector).addEventListener("click", callback);
}

// get parameter from URL
export function getParam(param) {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  return urlParams.get(param);
}

// calculate discount percentage
export function calculateDiscount(FinalPrice, SuggestedRetailPrice) {
  if (FinalPrice < SuggestedRetailPrice) {
    const discount = ((SuggestedRetailPrice - FinalPrice) / SuggestedRetailPrice) * 100;
    return `${discount.toFixed(2)}% OFF`;
  }
  return null;
}

// Renders a list of items using a provided template function
export function renderListWithTemplate(templateFn, parentElement, list, position = "afterbegin", clear = false) {
  // Clear the parent element if the clear flag is set to true
  if (clear) {
    parentElement.innerHTML = "";
  }

  // Generate HTML using the provided template function
  const htmlStrings = list.map(templateFn);

  // Insert the generated HTML into the parent element
  parentElement.insertAdjacentHTML(position, htmlStrings.join(""));
}

// Render a single template into a parent element
export function renderWithTemplate(template, parent, data) {
  const clone = template.content.cloneNode(true); // Clone the template content
  if (data) {
    // Replace placeholders in the template with data
    Object.keys(data).forEach((key) => {
      const element = clone.querySelector(`[data-${key}]`);
      if (element) {
        element.textContent = data[key];
      }
    });
  }
  parent.appendChild(clone); // Append the cloned content to the parent
}

// Fetch HTML template from a file
export async function loadTemplate(templatePath) {
  try {
    const response = await fetch(templatePath);
    if (!response.ok) throw new Error(`Failed to fetch template: ${templatePath}`);
    const text = await response.text();
    const template = document.createElement("template");
    template.innerHTML = text.trim();
    return template;
  } catch (error) {
    console.error("Error loading template:", error);
    throw error; // Re-throw the error for better handling by the caller
  }
}

// **Add this function**
export async function loadHeaderFooter() {
  try {
    // Use absolute paths for the header and footer templates
    const headerTemplate = await loadTemplate("/partials/header.html"); // Changed to absolute path
    const footerTemplate = await loadTemplate("/partials/footer.html"); // Changed to absolute path

    const headerElement = document.querySelector("#main-header"); // Changed to match the ID in the HTML
    const footerElement = document.querySelector("#main-footer"); // Changed to match the ID in the HTML

    renderWithTemplate(headerTemplate, headerElement);
    renderWithTemplate(footerTemplate, footerElement);

    console.warn("Header and Footer loaded successfully!");
  } catch (error) {
    console.error("Error loading header or footer:", error);
  }
}

// Added alertMessage function | 
export function alertMessage(message, scroll = true) { 
  // Create an alert div
  const alert = document.createElement("div"); 
  alert.classList.add("alert"); 
  alert.style.background = "#fffae6"; 
  alert.style.border = "1px solid #ffcc00"; 
  alert.style.padding = "10px"; 
  alert.style.color = "#cc9900"; 
  alert.style.textAlign = "center"; 
  alert.style.margin = "10px 0"; 
  alert.style.fontWeight = "bold"; 
  alert.style.borderRadius = "5px"; 
  alert.textContent = `⚠️ ${message}`; 

  // Insert alert at the top of <main>
  const main = document.querySelector("main"); 
  if (main) { 
    main.prepend(alert); 
  } 

  // Scroll to the top so the user sees the message
  if (scroll) { 
    window.scrollTo(0, 0); 
  } 

  // Remove after 4 seconds
  // eslint-disable-next-line no-undef
  setTimeout(() => { 
    alert.remove(); 
  }, 4000); 
} 


// generate breadcrumbs

export function generateBreadcrumbs() {
  const category = getParam("category");
  const productId = getParam("id");
  
  console.warn("Breadcrumb Debug:");
  console.warn("Category:", category);
  console.warn("Product ID:", productId);

  // Don't proceed if we're on the home page
  if (!category) {
    console.warn("No category found - not showing breadcrumbs");
    return;
  }

  const breadcrumbContainer = document.createElement("div");
  breadcrumbContainer.id = "breadcrumb";
  breadcrumbContainer.style.padding = "10px";
  breadcrumbContainer.style.fontSize = "14px";
  console.warn("Created breadcrumb container");

  // Make it very visible for debugging
  breadcrumbContainer.style.backgroundColor = "#e9ecef";
  breadcrumbContainer.style.color = "#333";
  breadcrumbContainer.style.borderBottom = "2px solid #dee2e6";
  breadcrumbContainer.style.marginBottom = "20px";
  breadcrumbContainer.style.width = "100%";
  breadcrumbContainer.style.textAlign = "left";
  breadcrumbContainer.style.paddingLeft = "20px";

  const insertBreadcrumb = () => {
    // Try multiple possible parent elements
    const header = document.querySelector("header") || document.querySelector(".logo").closest("div");
    if (header) {
      console.warn("Found header element, inserting breadcrumb");
      header.insertAdjacentElement('afterend', breadcrumbContainer);
    } else {
      console.warn("Could not find header element!");
    }
  };

  if (category && !productId) {
    // For product listing pages, wait for products to load
    const checkProducts = () => {
      // Changed selector to look for .product-list instead of .product-card
      const products = document.querySelectorAll(".product-list li");
      console.warn("Checking for products, found:", products.length);
      
      if (products.length > 0) {
        // Format category string to be more readable
        const formattedCategory = category.split('-')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
        const text = `${formattedCategory} -> (${products.length} items)`;
        console.warn("Setting breadcrumb text to:", text);
        breadcrumbContainer.textContent = text;
        insertBreadcrumb();
      } else {
        console.warn("No products found yet, retrying...");
        window.setTimeout(checkProducts, 100);
      }
    };
    checkProducts();
  } else if (category && productId) {
    console.warn("Product page detected");
    const formattedCategory = category.split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
    breadcrumbContainer.textContent = formattedCategory;
    insertBreadcrumb();
  }
}