import { getLocalStorage } from "./utils.mjs";
import ExternalServices from "./ExternalServices.mjs"; // Import ExternalServices

export default class CheckoutProcess {
  constructor(cartKey) {
    this.cartKey = cartKey;
    this.cartItems = getLocalStorage(this.cartKey) || [];
    this.apiService = new ExternalServices(); // Create an instance of ExternalServices
  }

  init() {
    this.renderCheckoutItems();
    this.attachFormListener();
  }

  renderCheckoutItems() {
    const checkoutList = document.querySelector(".checkout-list");
    const orderTotal = document.querySelector(".order-total");
    const shippingCostElem = document.querySelector(".shipping-cost");
    const taxElem = document.querySelector(".tax-amount");
    const finalTotalElem = document.querySelector(".final-total");

    let subtotal = 0;
    let shippingCost = 10; // Base shipping cost for the first item
    let itemCount = 0;

    if (!checkoutList || !orderTotal) {
      console.error("Checkout elements not found in the DOM.");
      return;
    }

    const itemsHtml = this.cartItems.map((item) => {
      const quantity = item.quantity || 1;
      const itemTotal = item.FinalPrice * quantity;
      subtotal += itemTotal;
      itemCount += quantity;
      return `<li class="checkout-item">
        <img src="${item.Image}" alt="${item.Name}" width="100">
        <h3>${item.Name}</h3>
        <p>Quantity: ${quantity}</p>
        <p>Price: $${item.FinalPrice} x ${quantity} = $${itemTotal.toFixed(2)}</p>
      </li>`;
    }).join("");

    // Add $2 for each additional item beyond the first one
    if (itemCount > 1) {
      shippingCost += (itemCount - 1) * 2;
    }

    // Calculate tax (6% of subtotal)
    const taxAmount = subtotal * 0.06;
    const finalTotal = subtotal + shippingCost + taxAmount;

    checkoutList.innerHTML = itemsHtml;
    orderTotal.textContent = `Subtotal: $${subtotal.toFixed(2)}`;
    shippingCostElem.textContent = `Shipping: $${shippingCost.toFixed(2)}`;
    taxElem.textContent = `Tax (6%): $${taxAmount.toFixed(2)}`;
    finalTotalElem.textContent = `Order Total: $${finalTotal.toFixed(2)}`;
  }

  attachFormListener() {
    const form = document.querySelector(".checkout-form");
    if (form) {
      form.addEventListener("submit", (e) => this.checkout(e, form)); // Updated to call checkout() method
    } else {
      console.error("Checkout form not found in the DOM.");
    }
  }

  packageItems() {
    return this.cartItems.map(item => ({
      id: item.Id,
      name: item.Name,
      price: item.FinalPrice,
      quantity: item.quantity || 1
    }));
  }

  async checkout(e, form) {
    e.preventDefault();
    // eslint-disable-next-line no-undef
    const formData = new FormData(form);
    let errors = []; // ✅ Store all errors in an array

    // ✅ Get input values and trim spaces
    let cardNumber = formData.get("cardNumber").trim();
    let expiration = formData.get("expiration").trim();
    let securityCode = formData.get("code").trim();

    // ✅ Validate Card Number (Must be 16 digits)
    if (!/^\d{16}$/.test(cardNumber)) {
        errors.push("⚠️ Card number must be exactly 16 digits.");
    }

    // ✅ Validate Expiration Date (MM/YY format)
    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiration)) {
        errors.push("⚠️ Expiration date is invalid. Use MM/YY format.");
    }

    // ✅ Validate CVV (Security Code) (Must be 3 or 4 digits)
    if (!/^\d{3,4}$/.test(securityCode)) {
        errors.push("⚠️ Security code must be 3 or 4 digits.");
    }

    // ✅ Validate Other Required Fields
    const requiredFields = ["fname", "lname", "street", "city", "state", "zip"];
    requiredFields.forEach(field => {
        if (!formData.get(field) || formData.get(field).trim() === "") {
            errors.push(`⚠️ ${field.charAt(0).toUpperCase() + field.slice(1)} cannot be empty!`);
        }
    });

    // ✅ If there are errors, show all of them and stop checkout
    if (errors.length > 0) {
        this.displayError(errors); // ✅ Show all errors
        return;
    }

    // ✅ If all fields are valid, proceed to checkout
    const orderData = {
        orderDate: new Date().toISOString(),
        fname: formData.get("fname"),
        lname: formData.get("lname"),
        street: formData.get("street"),
        city: formData.get("city"),
        state: formData.get("state"),
        zip: formData.get("zip"),
        cardNumber,
        expiration,
        code: securityCode,
        items: this.packageItems(),
        orderTotal: document.querySelector(".final-total").textContent.split("$")[1],
        shipping: document.querySelector(".shipping-cost").textContent.split("$")[1],
        tax: document.querySelector(".tax-amount").textContent.split("$")[1]
    };

    try {
        console.warn("📤 Sending order data:", orderData);
        await this.apiService.checkout(orderData);
        localStorage.removeItem(this.cartKey);
        window.location.href = "/checkout/order-confirmation.html";
    } catch (error) {
        console.error("Order submission failed:", error);
        this.displayError(["⚠️ There was an error processing your order. Please try again."]);
        return;
    }
}


/** ✅ Show multiple error messages at once */
displayError(messages) {
  const main = document.querySelector("main");
  let errorDiv = document.querySelector(".alert.error");

  if (!errorDiv) {
      errorDiv = document.createElement("div");
      errorDiv.classList.add("alert", "error");
      errorDiv.style.background = "#ffdddd";
      errorDiv.style.border = "1px solid #ff0000";
      errorDiv.style.padding = "10px";
      errorDiv.style.color = "#ff0000";
      errorDiv.style.textAlign = "center";
      errorDiv.style.margin = "10px 0";
      errorDiv.style.fontWeight = "bold";
      errorDiv.style.borderRadius = "5px";
      main.prepend(errorDiv);
  }

  // ✅ If multiple messages, join them into one string with line breaks
  errorDiv.innerHTML = messages.join("<br>");
  errorDiv.style.display = "block";
  window.scrollTo({ top: 0, behavior: "smooth" });

  // ✅ Keep errors visible for 7 seconds
  // eslint-disable-next-line no-undef
  setTimeout(() => {
      errorDiv.style.display = "none";
  }, 7000);
}


}