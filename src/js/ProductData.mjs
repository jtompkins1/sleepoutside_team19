const baseURL = import.meta.env.VITE_SERVER_URL;

// Helper function to convert fetch responses to JSON
function convertToJson(res) {
  if (res.ok) {
    return res.json();
  } else {
    throw new Error("Bad Response");
  }
}
// **Added this class here**
export default class ProductData {
  constructor() {
    // Removed Category and path
  }

  // Updated getData() method to handle "all" categories
  // async getData() {
  //   if (this.category === "all") {
  //     try {
  //       // Fetch all categories and combine them into one array
  //       const tents = await fetch("/json/tents.json").then(convertToJson);
  //       const sleepingBags = await fetch("/json/sleeping-bags.json")
  //         .then(convertToJson)
  //         .then((data) => data.Result || data); // Access 'Result' if present, else use the data as-is
  //       const backpacks = await fetch("/json/backpacks.json")
  //         .then(convertToJson)
  //         .then((data) => data.Result || data); // Access 'Result' if present, else use the data as-is

  //       return [...tents, ...sleepingBags, ...backpacks];
  //     } catch (error) {
  //       console.error("Error fetching product data:", error);
  //       throw error;
  //     }
  //   } else {
  //     try {
  //       const data = await fetch(this.path).then(convertToJson);
  //       // Access 'Result' if the category's JSON file is nested
  //       if (["sleeping-bags", "backpacks", "tents"].includes(this.category) && data.Result) {
  //         return data.Result;
  //       }
  //       return data; // Return data as-is for other categories
  //     } catch (error) {
  //       console.error(`Error fetching data for category ${this.category}:`, error);
  //       throw error;
  //     }
  //   }
  // }

// changed getData method to add category parameter and use async.await
async getData(category) {
  const response = await fetch(baseURL + `products/search/${category}`);
  const data = await convertToJson(response);
  return data.Result;
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
