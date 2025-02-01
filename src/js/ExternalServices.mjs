
// ** Added this helper function to convert response to JSON**
async function convertToJson(res) {
  const jsonResponse = await res.json(); // Convert response to JSON first

  if (res.ok) {
    return jsonResponse;
  } else {
    throw { name: "servicesError", message: jsonResponse };
  }
}

// **Added this class here**
export default class ExternalServices {
  constructor(category) {
    this.category = category;
    this.path = `/json/${this.category}.json`; // Path to fetch data for a specific category
    this.checkoutUrl = `${import.meta.env.VITE_SERVER_URL.replace(/\/$/, '')}/checkout`;

  }

  // Updated getData() method to handle "all" categories
  async getData() {
    if (this.category === "all") {
      try {
        // Fetch all categories and combine them into one array
        const tents = await fetch("/json/tents.json").then(convertToJson);
        const sleepingBags = await fetch("/json/sleeping-bags.json")
          .then(convertToJson)
          .then((data) => data.Result || data); // Access 'Result' if present, else use the data as-is
        const backpacks = await fetch("/json/backpacks.json")
          .then(convertToJson)
          .then((data) => data.Result || data); // Access 'Result' if present, else use the data as-is

        return [...tents, ...sleepingBags, ...backpacks];
      } catch (error) {
        console.error("Error fetching product data:", error);
        throw error;
      }
    } else {
      try {
        const data = await fetch(this.path).then(convertToJson);
        // Access 'Result' if the category's JSON file is nested
        if (["sleeping-bags", "backpacks", "tents"].includes(this.category) && data.Result) {
          return data.Result;
        }
        return data; // Return data as-is for other categories
      } catch (error) {
        console.error(`Error fetching data for category ${this.category}:`, error);
        throw error;
      }
    }
  }

   // **✅ Updated method name from submitOrder() to checkout() for consistency**
async checkout(orderDetails) {
  try {
      // Debugging Logs ✅
      console.error("VITE_SERVER_URL:", import.meta.env.VITE_SERVER_URL);
      console.error("VITE_API_KEY:", import.meta.env.VITE_API_KEY);

      const response = await fetch(`${import.meta.env.VITE_SERVER_URL.replace(/\/$/, '')}/checkout`, {
        method: "POST",
          headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${import.meta.env.VITE_API_KEY}` // Ensure API key is sent
          },
          body: JSON.stringify(orderDetails),
      });

      if (!response.ok) {
          throw new Error("Failed to submit order."); 
      }

      return await response.json(); 
  } catch (error) {
      console.error("Order submission failed:", error);
      throw error;
  }
}  

  

  // **Added this method here**
  async findProductById(id) {
    const products = await this.getData(); // Fetch all products based on category
    if (this.category === "all") {
      // Ensure all products are combined into a single array
      return products.find((item) => item.Id === id);
    } else {
      // Default behavior for single categories
      return products.find((item) => item.Id === id);
    }
  }
}
