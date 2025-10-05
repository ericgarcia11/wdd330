import ProductData from "../js/ProductData.mjs";
import ProductList from "../js/ProductList.mjs";

const params = new URLSearchParams(window.location.search);
let categoryName = params.get("category");
const dataSource = new ProductData(categoryName);
const productList = new ProductList(categoryName, dataSource, document.getElementById("product-list-container"));
productList.init();

document.title = `Top Products: ${categoryName}`;