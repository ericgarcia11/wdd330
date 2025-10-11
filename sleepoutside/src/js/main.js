import ExternalServices from "../js/ExternalServices.mjs";
import ProductList from "../js/ProductList.mjs";

const dataSource = new ExternalServices("tents");
const productList = new ProductList("tents", dataSource, document.getElementById("product-list-container"));
productList.init();
