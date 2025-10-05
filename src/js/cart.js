import { getLocalStorage, setLocalStorage,loadHeaderFooter } from "./utils.mjs";


function checkNull(){
  try{
    const cartItems = getLocalStorage("so-cart");
    const cartEmptyWarning = document.getElementById("cart-is-empty");
    if (!cartItems || cartItems.length == 0){
      cartEmptyWarning.classList.remove("hide");
    }
  } catch (error){
    // console.error(`ERROR CHECKING: ${error}`)
  }
}

checkNull();

export function qtdInCart(){
  try{
    const cartItems = getLocalStorage("so-cart");
    const itemsPrices = cartItems.map((item) => item.FinalPrice);
    document.getElementById("svg-text").textContent = itemsPrices.length;

  } catch (error){
    // console.error(`FREAK BRO: ${error}`)
  };
};
qtdInCart();


function renderCartContents() {
  const cartItems = getLocalStorage("so-cart");
  // // eslint-disable-next-line no-console
  // console.log(cartItems);
  const htmlItems = cartItems.map((item) => cartItemTemplate(item.product, item.id));
  document.querySelector(".product-list").innerHTML = htmlItems.join("");

  const itemsPrices = cartItems.map((item1) => item1.product.FinalPrice);
  // console.log(itemsPrices);
  let total = 0;
  itemsPrices.forEach(prices => {
    total += prices
  });
  // console.log(total);
  document.querySelector(".total-price-container").innerHTML = `
    <p class="total-price">
      Total in the cart: $${total} 
    </p>
  `;
}

function cartItemTemplate(item, id) {
  // eslint-disable-next-line no-console
  // console.log(item);
  const newItem = `<li id="${id}" class="cart-card divider">
    <a href="#" class="cart-card__image">
      <img
        src="${item.Image}"
        alt="${item.Name}" 
      />  
    </a>
    <a href="#">
      <h2 class="card__name">${item.Name}</h2>
    </a>
    <button data-id="${id}" class="cart-delete-btn" style="background:none;">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-trash-2">
        <polyline points="3 6 5 6 21 6"></polyline>
        <path d="M19 6L17.5 20H6.5L5 6"></path>
        <line x1="10" y1="11" x2="10" y2="17"></line>
        <line x1="14" y1="11" x2="14" y2="17"></line>
      </svg>
    </button>
    <p class="cart-card__color">${item.Colors[0].ColorName}</p>
    <p class="cart-card__price"><strong>$${item.FinalPrice}</p></strong>
  </li>`;

  return newItem;
}

document.addEventListener("DOMContentLoaded", function(){
  document.querySelectorAll(".cart-delete-btn").forEach(btn => {
    btn.addEventListener("click", function() {
    // eslint-disable-next-line no-console
      // console.log("a");
      let cartItems = getLocalStorage("so-cart");
      let id = btn.dataset.id;
      // eslint-disable-next-line no-console
      console.log(id);
      cartItems = cartItems.filter(cart => Number(cart.id) !== Number(id));
      setLocalStorage("so-cart", cartItems);
      document.getElementById(id).remove();

      const itemsPrices = cartItems.map((item1) => item1.product.FinalPrice);
      // console.log(itemsPrices);
      let total = 0;
      itemsPrices.forEach(prices => {
        total += prices
      });
      // console.log(total);
      document.querySelector(".total-price-container").innerHTML = `
        <p class="total-price">
          Total in the cart: $${total} 
        </p>
      `;      
    });
  });
})

renderCartContents();

loadHeaderFooter();
