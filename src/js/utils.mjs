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
