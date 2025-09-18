import { getParam } from "./utils.mjs";
import ProductData from "./ProductData.mjs";
import ProductDetails from "./ProductDetails.mjs";

const dataSource = new ProductData("tents");
const productId = getParam("product");

const product = new ProductDetails(productId, dataSource);


// eslint-disable-next-line no-console
// console.log(productId);
// eslint-disable-next-line no-console
// console.log(dataSource.findProductById(productId));

product.init();




