import { loadHeaderFooter } from "./utils.mjs";
import CheckoutProcess from "./CheckoutProcess.mjs"; // Import CheckoutProcess


// Attach listeners AFTER rendering content
document.addEventListener("DOMContentLoaded", async () => {
  await loadHeaderFooter();
  const checkout = new CheckoutProcess("so-cart"); // Initialize CheckoutProcess for the cart
  checkout.init(); // Start checkout process
});