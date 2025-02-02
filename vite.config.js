import { resolve } from "path";
import { defineConfig, loadEnv } from "vite";

export default defineConfig(({ mode }) => {
  // Load environment variables based on the current mode
  const env = loadEnv(mode, process.cwd(), "");

  return {
    root: "src/", 
    base: "/", 
    build: {
      outDir: "../dist", 
      emptyOutDir: true, 
      rollupOptions: {
        input: {
          main: resolve(__dirname, "src/index.html"),
          cart: resolve(__dirname, "src/cart/index.html"),
          checkout: resolve(__dirname, "src/checkout/index.html"),
          cartCheckout: resolve(__dirname, "src/cart/checkout.html"),
          productListing: resolve(__dirname, "src/product-listing/index.html"),
          orderConfirmation: resolve(__dirname, "src/checkout/order-confirmation.html"),
          product1: resolve(__dirname, "src/product-pages/cedar-ridge-rimrock-2.html"),
          product2: resolve(__dirname, "src/product-pages/marmot-ajax-3.html"),
          product3: resolve(__dirname, "src/product-pages/northface-alpine-3.html"),
          product4: resolve(__dirname, "src/product-pages/northface-talus-4.html"),
          product: resolve(__dirname, "src/product-pages/index.html"),
          productPagesIndex: resolve(__dirname, "src/product-pages/index.html"),
        },
      },
    },

    server: {
      historyApiFallback: true, 
    },

    define: {
      "import.meta.env.VITE_SERVER_URL": JSON.stringify(env.VITE_SERVER_URL),
      "import.meta.env.VITE_API_KEY": JSON.stringify(env.VITE_API_KEY),
    },
  };
});