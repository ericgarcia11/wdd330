// import { qtdInCart } from "./cart";
import { loadHeaderFooter ,getLocalStorage} from "../js/utils.mjs";
const baseURL = `${import.meta.env.VITE_SERVER_URL}checkout`;
// eslint-disable-next-line no-console
console.log(baseURL);

// qtdInCart();

loadHeaderFooter();


// function popupaleSummary(){
//     const cartItems = getLocalStorage("so-cart");
//     const itemsPrices = cartItems.map((item1) => item1.product.FinalPrice);
//     // console.log(itemsPrices);
//     let subtotal = 0;
//     itemsPrices.forEach(prices => {
//         subtotal += prices
//     });

//     let tax = (subtotal / 100) * 6;

//     let shipping = ((itemsPrices.length - 1) * 2) + 10;
//     let orderTotal = subtotal + tax + shipping;
    

//     document.getElementById("subtotal").textContent = `$${subtotal}`;
//     document.getElementById("tax").textContent = `$${tax}`;
//     document.getElementById("shipping").textContent = `$${shipping}`;
//     document.getElementById("orderTotal").textContent = `$${orderTotal}`;
// }

// popupaleSummary();

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
        const itemsPrices = cartItems.map((item1) => item1.product.FinalPrice);
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
        this.shipping = ((this.itemsPrices.length - 1) * 2) + 10;
    }
    calculateTotal(){
        this.orderTotal =  this.itemTotal + this.tax + this.shipping;
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

const checkoutProcess = new CheckoutProcess("data", "checkout-content");
checkoutProcess.init();