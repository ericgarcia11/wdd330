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
  const htmlItems = cartItems.map((item) => cartItemTemplate(item.product, item.id, item.quantity));
  document.querySelector(".product-list").innerHTML = htmlItems.join("");

  const itemsPrices = cartItems.map((item1) => item1.product.FinalPrice * item1.quantity);
  // console.log(itemsPrices);
  let total = 0;
  itemsPrices.forEach(prices => {
    total += prices
  });
  // console.log(total);
  document.querySelector(".total-price-container").innerHTML = `
    <p class="total-price">
      Total in the cart: $${total.toFixed(2)} 
    </p>
  `;
}

function cartItemTemplate(item, id, quantity) {
  // eslint-disable-next-line no-console
  // console.log(item);
  const newItem = `<li id="${id}" class="cart-container divider">
    <div style="
      font-weight: 700;    
      display: flex;
      justify-content: flex-end;
      gap: 1rem;
      align-items: center;"><span class="quantity-span">Quantity: ${quantity}</span>
      <button data-id="${item.Id}" class="add-item-btn" style="
          padding: .1rem .5rem;
          margin: 0;
          border-radius: 5px;">+</button>
      <button data-id="${item.Id}" class="remove-item-btn" style="
          padding: .1rem .5rem;
          margin: 0;
          border-radius: 5px;">-</button>
    </div>
    <div class="cart-card">  
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
    </div>
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

      const itemsPrices = cartItems.map((item1) => item1.product.FinalPrice * item1.quantity);
      // console.log(itemsPrices);
      let total = 0;
      itemsPrices.forEach(prices => {
        total += prices
      });
      // console.log(total);
      document.querySelector(".total-price-container").innerHTML = `
        <p class="total-price">
          Total in the cart: $${total.toFixed(2)} 
        </p>
      `;      
    });
  });

  document.querySelectorAll(".remove-item-btn").forEach(btn => {
    btn.addEventListener("click", function() {
    // eslint-disable-next-line no-console
      // console.log("a");
      let cartItems = getLocalStorage("so-cart");
      let id = btn.dataset.id;
      // eslint-disable-next-line no-console
      console.log(id);
      cartItems.forEach(el => {
        if (el.product.Id == id){
          el.quantity -= 1;

          if (el.quantity == 0){
            document.getElementById(el.id).remove();
            cartItems = cartItems.filter(item => item.id !== el.id);
          }

          const quantitySpan = this.closest("div")?.querySelector(".quantity-span");
          if (quantitySpan) {
            quantitySpan.textContent = `Quantity: ${el.quantity}`;
          }
        }
      });
      setLocalStorage("so-cart", cartItems);

      const itemsPrices = cartItems.map((item1) => item1.product.FinalPrice * item1.quantity);
      // console.log(itemsPrices);
      let total = 0;
      itemsPrices.forEach(prices => {
        total += prices
      });
      // console.log(total);
      document.querySelector(".total-price-container").innerHTML = `
        <p class="total-price">
          Total in the cart: $${total.toFixed(2)}
        </p>
      `;      
    });
  });

  document.querySelectorAll(".add-item-btn").forEach(btn => {
    btn.addEventListener("click", function() {
    // eslint-disable-next-line no-console
      // console.log("a");
      let cartItems = getLocalStorage("so-cart");
      let id = btn.dataset.id;
      // eslint-disable-next-line no-console
      console.log(id);
      cartItems.forEach(el => {
        if (el.product.Id == id){
          el.quantity += 1;
          const quantitySpan = this.closest("div")?.querySelector(".quantity-span");
          if (quantitySpan) {
            quantitySpan.textContent = `Quantity: ${el.quantity}`;
          }
        }
      });
      setLocalStorage("so-cart", cartItems);

      const itemsPrices = cartItems.map((item1) => item1.product.FinalPrice * item1.quantity);
      // console.log(itemsPrices);
      let total = 0;
      itemsPrices.forEach(prices => {
        total += prices
      });
      // console.log(total);
      document.querySelector(".total-price-container").innerHTML = `
        <p class="total-price">
          Total in the cart: $${total.toFixed(2)} 
        </p>
      `;      
    });
  });

})

document.getElementById("checkout-btn").addEventListener("click", function(){
  window.location.href = "../../checkout/index.html";
})

renderCartContents();

loadHeaderFooter();
