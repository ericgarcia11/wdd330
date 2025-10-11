import { resolve } from "path";
import { defineConfig } from "vite";

export default defineConfig({
  root: "src/",
  base: "./",

  build: {
    outDir: "../dist",
    rollupOptions: {
      input: {
        login: resolve(__dirname, "src/index.html"),
        home: resolve(__dirname, "src/home/index.html"),
        clients: resolve(__dirname, "src/clients/index.html"),
        product: resolve(__dirname, "src/products/index.html"),
        orders: resolve (__dirname, "src/orders/index.html")
      },
    },
  },
});
