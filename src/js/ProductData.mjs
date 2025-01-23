function convertToJson(res) {
  if (res.ok) {
    return res.json();
  } else {
    throw new Error("Bad Response");
  }
}

export default class ProductData {
  constructor(category) {
    this.category = category;
    // Updated the path to reference the public directory
    this.path = `/json/${this.category}.json`;
  }

  getData() {
    // Fetch data and return the JSON directly
    return fetch(this.path)
      .then(convertToJson)
      .then((data) => data); // Simplify arrow function
  }

  async findProductById(id) {
    const products = await this.getData();
    // Search for the product by ID
    return products.find((item) => item.Id === id);
  }
}