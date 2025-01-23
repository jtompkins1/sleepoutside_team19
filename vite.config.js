import { resolve } from "path";
import { defineConfig } from "vite";

export default defineConfig({
  root: "src/", // Specifies the source directory for the project
  base: "/", // Ensures absolute paths in the build output
  build: {
    outDir: "../dist", // Specifies the output directory for the built files
    emptyOutDir: true, // Ensures the dist folder is cleared before each build
    rollupOptions: {
      input: {
        main: resolve(__dirname, "src/index.html"), // Entry for the main index.html
        cart: resolve(__dirname, "src/cart/index.html"), // Entry for the cart page
        checkout: resolve(__dirname, "src/checkout/index.html"), // Entry for the checkout page
        cartCheckout: resolve(__dirname, "src/cart/checkout.html"), // Entry for cart/checkout page
        product1: resolve(
          __dirname,
          "src/product-pages/cedar-ridge-rimrock-2.html"
        ), // Entry for the cedar-ridge-rimrock-2.html product page
        product2: resolve(__dirname, "src/product-pages/marmot-ajax-3.html"), // Entry for the marmot-ajax-3.html product page
        product3: resolve(
          __dirname,
          "src/product-pages/northface-alpine-3.html"
        ), // Entry for the northface-alpine-3.html product page
        product4: resolve(
          __dirname,
          "src/product-pages/northface-talus-4.html"
        ), // Entry for the northface-talus-4.html product page
        product: resolve(__dirname, "src/product-pages/index.html"), // Added this line for the product listing page
        productPagesIndex: resolve(__dirname, "src/product-pages/index.html"), // Duplicate entry for clarity if required
      },
    },
  },

  server: {
    historyApiFallback: true, // Allows clean URLs to fallback to index.html in the dev server
  },
});
