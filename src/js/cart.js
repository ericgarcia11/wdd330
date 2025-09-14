import { getLocalStorage } from "./utils.mjs";

function renderCartContents() {
  const cartItems = getLocalStorage("so-cart");
  const htmlItems = cartItems.map((item) => cartItemTemplate(item));
  document.querySelector(".product-list").innerHTML = htmlItems.join("");
}

function cartItemTemplate(item) {
  const newItem = `<li class="cart-card divider">
  <a href="#" class="cart-card__image">
    <img
      src="${item.Image}"
      alt="${item.Name}"
    />
  </a>
  <a href="#">
    <h2 class="card__name">${item.Name}</h2>
  </a>
  <p class="cart-card__color">${item.Colors[0].ColorName}</p>
  <p class="cart-card__quantity">qty: 1</p>
  <p class="cart-card__price">$${item.FinalPrice}</p>
</li>`;


const cartItems = getLocalStorage("so-cart");
const itemsPrices = cartItems.map((item) => item.FinalPrice);
console.log(itemsPrices);
let total = 0;
itemsPrices.forEach(prices => {
  total += prices
});
console.log(total);
const showTotal = document.querySelector(".total-price-container").innerHTML = `
  <p class="total-price">
    Total in the cart: $${total} 
  </p>
`;

  return newItem;
}

renderCartContents();
