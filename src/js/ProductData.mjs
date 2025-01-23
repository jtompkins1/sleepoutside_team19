const baseURL = import.meta.env.VITE_SERVER_URL

function convertToJson(res) {
  if (res.ok) {
    return res.json();
  } else {
    throw new Error("Bad Response");
  }
}

export default class ProductData {
//   constructor(category) {
//     // this.category = category;
//     // // Updated the path to reference the public directory
//     // this.path = `/json/${this.category}.json`;
  // }

  async getData(category) {
    // Fetch data and return the JSON directly
  const response = await fetch(baseURL + `products/search/${category}`);
  const data = await convertToJson(response);
  return data.Result;
  }

  async findProductById(id) {
    const products = await this.getData();
    // Search for the product by ID
    return products.find((item) => item.Id === id);
  }
}