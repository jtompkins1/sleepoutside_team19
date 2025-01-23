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

// Renders a list of items using a provided template function
export function renderWithTemplate(templateFn, parentElement, data, position = "afterbegin", clear = false) {
  // Clear the parent element if the clear flag is set to true
  // if (clear) {
  //   parentElement.innerHTML = "";
  // }

  // Generate HTML using the provided template function
  const htmlStrings = data.map(templateFn);

  // Insert the generated HTML into the parent element
  parentElement.insertAdjacentHTML(position, htmlStrings.join(""));
}

// Render a single template into a parent element
// Added this function for rendering a single HTML template
// export function renderWithTemplate(template, parent, data) {
//   const clone = template.content.cloneNode(true); // Clone the template content
//   if (data) {
//     // Replace placeholders in the template with data
//     Object.keys(data).forEach((key) => {
//       const element = clone.querySelector(`[data-${key}]`);
//       if (element) {
//         element.textContent = data[key];
//       }
//     });
//   }
//   parent.appendChild(clone); // Append the cloned content to the parent
// }

// Fetch HTML template from a file
// Added this function to fetch templates dynamically
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

export async function loadHeaderFooter() {

  try {
    const headerTemplate = await loadTemplate("/partials/header.html");
    const headerElement = document.querySelector("#main-header");
    const footerTemplate = await loadTemplate("/partials/footer.html");
    const footerElement = document.querySelector("#main-footer");

    renderWithTemplate(headerTemplate, headerElement, footerElement, footerTemplate);
    
  } catch (error) {
    console.error("Error loading header/footer:", error);
    throw error;
  }
}