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
    const headerTemplate = await loadTemplate("/partials/header.html");
    const footerTemplate = await loadTemplate("/partials/footer.html");

    const headerElement = document.querySelector("#main-header");
    const footerElement = document.querySelector("#main-footer");

    renderWithTemplate(headerTemplate, headerElement);
    renderWithTemplate(footerTemplate, footerElement);

    console.warn("Header and Footer loaded successfully!");

    // Generate breadcrumbs after the header loads
    generateBreadcrumbs();
  } catch (error) {
    console.error("Error loading header or footer:", error);
  }
}

function generateBreadcrumbs() {
  const breadcrumbContainer = document.querySelector("#breadcrumbs");

  if (!breadcrumbContainer) {
      console.warn("Breadcrumb container not found.");
      return;
  }

  // Get current path
  const pathParts = window.location.pathname.split("/").filter(part => part !== "");
  let breadcrumbHTML = `<a href="/">Home</a>`;

  let pathAccumulator = "";
  pathParts.forEach((part, index) => {
      pathAccumulator += `/${part}`;
      if (index === pathParts.length - 1) {
          breadcrumbHTML += ` &gt; <span class="current">${decodeURIComponent(part)}</span>`;
      } else {
          breadcrumbHTML += ` &gt; <a href="${pathAccumulator}">${decodeURIComponent(part)}</a>`;
      }
  });

  breadcrumbContainer.innerHTML = breadcrumbHTML;
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


