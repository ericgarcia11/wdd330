import ProductData from "../js/ProductData.mjs";
import ProductList from "../js/ProductList.mjs";

const dataSource = new ProductData("tents");
const productList = new ProductList("tents", dataSource, document.getElementById("product-list-container"));
productList.init();
