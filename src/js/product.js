import { setLocalStorage, getLocalStorage, loadHeaderFooter } from "./utils.mjs";
// import ExternalServices from "./ExternalServices.mjs";
import { searchById } from "./ExternalServices.mjs";
import ExternalServices from "../js/ExternalServices.mjs";

// eslint-disable-next-line no-console
// console.log("aqui");

// const dataSource = new ExternalServices("tents");

// dataSource.getData().then((productsData) => {
//   // eslint-disable-next-line no-console
//   productsData.forEach(product => {
//     if (product.Id == productId){
//       createProduct(product);

//       // add listener to Add to Cart button
//       document
//         .getElementById("addToCart")
//         .addEventListener("click", addToCartHandler);
//     }
//   });
// });

// function createProduct(product){
//   const productDetail = document.querySelector(".product-detail");
//   const h3 = document.createElement("h3");
//   h3.textContent = product.Brand.Name;
//   const h2 = document.createElement("h2");
//   h2.textContent = product.NameWithoutBrand;
//   h2.classList.add("divider");
//   const img = document.createElement("img");
//   img.classList.add("divider");
//   img.src = product.Image;
//   img.alt = product.NameWithoutBrand;
//   const p1 = document.createElement("p");
//   p1.classList.add("product-card__price");
//   p1.textContent = product.ListPrice;
//   const p2 = document.createElement("p");
//   p2.classList.add("product__color");
//   p2.textContent = product.Colors[0].ColorName;
//   const p3 = document.createElement("p");
//   p3.classList.add("product__description");
//   p3.innerHTML = product.DescriptionHtmlSimple;
//   const div = document.createElement("div");
//   div.classList.add("product-detail__add");
//   const button = document.createElement("button");
//   button.id = "addToCart";
//   button.dataset.id = product.Id;
//   button.textContent = "Add to Cart";

//   div.appendChild(button);
//   productDetail.appendChild(h3);
//   productDetail.appendChild(h2);
//   productDetail.appendChild(img);
//   productDetail.appendChild(p1);
//   productDetail.appendChild(p2);
//   productDetail.appendChild(p3);
//   productDetail.appendChild(div);
// }

const params = new URLSearchParams(window.location.search);
let productId = params.get("productId");
let categoryName = params.get("category");

async function buildDetails(product, category) {
  const dataSource = new ExternalServices(category);
  const dados = await dataSource.getData();

  let products = await searchById(product, dados);
  // eslint-disable-next-line no-console
  // console.log(products);

  const template = document.getElementById("product-detail-template");
  const container = document.querySelector(".product-detail-container"); 

  const clone = template.content.cloneNode(true);

  clone.querySelector(".product__brand").textContent = products.Brand.Name;
  clone.querySelector(".product__name").textContent = products.NameWithoutBrand;

  const img = clone.querySelector(".product__image");
  img.src = products.Image;
  img.alt = products.NameWithoutBrand;

  clone.querySelector(".product-card__price").innerHTML = `<strong>$${products.ListPrice}</strong>`;
  clone.querySelector(".product__color").textContent = products.Colors[0].ColorName;
  clone.querySelector(".product__description").innerHTML = products.DescriptionHtmlSimple;

  const button = clone.querySelector(".addToCart");
  button.dataset.id = products.Id;
  const data = await dataSource.getData();
  // eslint-disable-next-line no-console
  console.log(data);

  button.addEventListener("click", async function(e){
    await addToCartHandler(e,data);
  });
 
  container.appendChild(clone);
}

// document.querySelectorAll(".addToCart").forEach(btn => {
//   btn.dataset.id = products.Id;
//   btn.addEventListener("click", async function() {
//     await addToCartHandler();
//   });
// });

buildDetails(productId, categoryName);


function addProductToCart(product) {
  const cardItems = getLocalStorage("so-cart") || [];

  const idCart = cardItems.length > 0 
    ? cardItems[cardItems.length - 1].id + 1 
    : 0;

  cardItems.push({id: idCart, product: product});
  setLocalStorage("so-cart", cardItems);
}

// add to cart button event handler
// async function addToCartHandler(e) {
//   const product = await dataSource.findProductById(e.target.dataset.id);
//   addProductToCart(product);
// }

async function addToCartHandler(e, data) {
  productId = e.target.dataset.id;
  // eslint-disable-next-line no-console
  // console.log(productId);
  const product = await searchById(productId, data);
  addProductToCart(product);
}

loadHeaderFooter();
