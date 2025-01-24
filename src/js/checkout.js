import { loadHeaderFooter, getLocalStorage } from "./utils.mjs";


// Updated renderCheckoutItems function to include quantity
function renderCheckoutItems() {
    const cartItems = getLocalStorage("so-cart") || [];
    const checkoutList = document.querySelector(".checkout-list");
    const orderTotal = document.querySelector(".order-total");
    let total = 0;
  
    const itemsHtml = cartItems.map(item => {
      const itemTotal = item.FinalPrice * (item.quantity || 1);
      total += itemTotal;
      return `<li class="checkout-item">
        <img src="${item.Image}" alt="${item.Name}" width="100">
        <h3>${item.Name}</h3>
        <p>Quantity: ${item.quantity || 1}</p>
        <p>Price: $${item.FinalPrice} x ${item.quantity || 1} = $${itemTotal.toFixed(2)}</p>
      </li>`;
    }).join("");
  
    checkoutList.innerHTML = itemsHtml;
    orderTotal.textContent = `Total: $${total.toFixed(2)}`;
  }

function handleSubmit(e) {
  e.preventDefault();
  alert('Order submitted successfully!');
  localStorage.removeItem('so-cart');
  window.location.href = '/';
}
// Attach listeners AFTER rendering content
document.addEventListener("DOMContentLoaded", async () => {
  await loadHeaderFooter();
  renderCheckoutItems();
  
  const form = document.querySelector('.checkout-form');
  if (form) {
    form.addEventListener('submit', handleSubmit);
  }
});