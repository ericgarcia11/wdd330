import { setLocalStorage, getLocalStorage } from "./utils.mjs";
import ProductData from "./ProductData.mjs";

const dataSource = new ProductData("tents");

const params = new URLSearchParams(window.location.search);
const productId = params.get("productId");

dataSource.getData().then((productsData) => {
  // eslint-disable-next-line no-console
  productsData.forEach(product => {
    if (product.Id == productId){
      createProduct(product);

      // add listener to Add to Cart button
      document
        .getElementById("addToCart")
        .addEventListener("click", addToCartHandler);
    }
  });
});

function createProduct(product){
  const productDetail = document.querySelector(".product-detail");
  const h3 = document.createElement("h3");
  h3.textContent = product.Brand.Name;
  const h2 = document.createElement("h2");
  h2.textContent = product.NameWithoutBrand;
  h2.classList.add("divider");
  const img = document.createElement("img");
  img.classList.add("divider");
  img.src = product.Image;
  img.alt = product.NameWithoutBrand;
  const p1 = document.createElement("p");
  p1.classList.add("product-card__price");
  p1.textContent = product.ListPrice;
  const p2 = document.createElement("p");
  p2.classList.add("product__color");
  p2.textContent = product.Colors[0].ColorName;
  const p3 = document.createElement("p");
  p3.classList.add("product__description");
  p3.innerHTML = product.DescriptionHtmlSimple;
  const div = document.createElement("div");
  div.classList.add("product-detail__add");
  const button = document.createElement("button");
  button.id = "addToCart";
  button.dataset.id = product.Id;
  button.textContent = "Add to Cart";

  div.appendChild(button);
  productDetail.appendChild(h3);
  productDetail.appendChild(h2);
  productDetail.appendChild(img);
  productDetail.appendChild(p1);
  productDetail.appendChild(p2);
  productDetail.appendChild(p3);
  productDetail.appendChild(div);
}

function addProductToCart(product) {
  const cardItems = getLocalStorage("so-cart") || [];
  cardItems.push(product);
  setLocalStorage("so-cart", cardItems);
}
// add to cart button event handler
async function addToCartHandler(e) {
  const product = await dataSource.findProductById(e.target.dataset.id);
  addProductToCart(product);
}

