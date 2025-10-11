// import { qtdInCart } from "./cart";
import { loadHeaderFooter ,getLocalStorage, alertMessage} from "../js/utils.mjs";
const baseURL = `${import.meta.env.VITE_SERVER_URL}checkout`;
// eslint-disable-next-line no-console
// console.log(baseURL);

loadHeaderFooter();

export default class CheckoutProcess {
    constructor(key, outputSelector){
        this.key = key;
        this.outputSelector = outputSelector;
        this.itemTotal = 0;
        this.shipping = 0;
        this.tax = 0;
        this.orderTotal = 0;
        this.itemsPrices = [];
    }
    init(){
        this.calculateItemSummary();
    }
    calculateSubtotal(){
        const cartItems = getLocalStorage("so-cart");
        const itemsPrices = cartItems.map((item1) => item1.product.FinalPrice * item1.quantity);
        this.itemsPrices = itemsPrices;
        // console.log(itemsPrices);
        let subtotal = 0;
        itemsPrices.forEach(prices => {
            subtotal += prices
        });
        this.itemTotal = subtotal;
    }
    calculateTax(){
        this.tax = (this.itemTotal / 100) * 6;
    }
    calculateShipping(){
        if (this.itemsPrices.length == 0){
            this.shipping = 0;
        } else {
            this.shipping = ((this.itemsPrices.length - 1) * 2) + 10;
        }
    }
    calculateTotal(){
        this.orderTotal =  (this.itemTotal + this.tax + this.shipping).toFixed(2);
    }
    calculateItemSummary(){
        this.calculateSubtotal();
        this.calculateTax();
        this.calculateShipping();
        this.calculateTotal();
        document.getElementById("subtotal").textContent = `$${this.itemTotal}`;
        document.getElementById("tax").textContent = `$${this.tax}`;
        document.getElementById("shipping").textContent = `$${this.shipping}`;
        document.getElementById("orderTotal").textContent = `$${this.orderTotal}`;
    }
}

function packageItems(items) {
  const itemsList = items.reduce((acc, item) => {
    const id = item.product.Id;
    const existingItem = acc.find(i => i.id === id);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      acc.push({
        id: id,
        name: item.product.Name,
        price: Number(item.product.ListPrice),
        quantity: 1
      });
    }

    return acc;
  }, []);

  return itemsList;
}

function formDataToJSON(formEl){
    const formData = new FormData(formEl),
    convertedJSON = {};

    formData.forEach(function (value, key) {
        convertedJSON[key] = value;
    });
    // eslint-disable-next-line no-console
    // console.log(convertedJSON);
    return convertedJSON;
}


const formElement = document.getElementById("checkoutForm")
formElement.addEventListener("submit", async (event) => {
    event.preventDefault();
    checkout(formElement);
})

export async function checkout(formElemen){
    const dataJSON = await formDataToJSON(formElemen);
    const cartItems = getLocalStorage("so-cart");
    const payload = {
        orderDate: "2021-01-27T18:18:26.095Z",
        fname: dataJSON.firstName,
        lname: dataJSON.lastName,
        street: dataJSON.address,
        city: dataJSON.city,
        state: dataJSON.state,
        zip: dataJSON.zip,
        cardNumber: dataJSON.cardNumber || 1234123412341234 ,
        expiration: dataJSON.expDate || "10/30",
        code: dataJSON.securityCode || 123,
        items: packageItems(cartItems),
        orderTotal: checkoutProcess.orderTotal,
        shipping: checkoutProcess.shipping,
        tax: checkoutProcess.tax
    }
    // eslint-disable-next-line no-console
    console.log(payload);

    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
    }
    fetch(baseURL, options)
  .then(async response => {
        const jsonResponse = await response.json();
        if (response.ok) {
            return jsonResponse;
        } else {
            throw { name: "servicesError", message: jsonResponse };
        }
    })
    .then(() =>{
        localStorage.removeItem("so-cart");
        window.location.href("success.html");
    })
    .catch(async(error) => {    
        // eslint-disable-next-line no-console
        console.log();
        const messageError = (`Error:  ${error.name}.`);
        await alertMessage(messageError);
    });

}

const checkoutProcess = new CheckoutProcess("data", "checkout-content");
checkoutProcess.init();