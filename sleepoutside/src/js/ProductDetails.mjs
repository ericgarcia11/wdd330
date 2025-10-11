import { setLocalStorage, getLocalStorage } from "./utils.mjs";

export default class ProductDetails {
    constructor(productId, dataSource){
        this.productId = productId;
        this.product = {};
        this.dataSource = dataSource;
    }
    async init(){
        this.product = await this.dataSource.findProductById(this.productId);
        this.renderProductDetails(this.product);
    }
    addProductToCart(product) {
        const cardItems = getLocalStorage("so-cart") || [];
        cardItems.push(product);
        setLocalStorage("so-cart", cardItems);
    }
    renderProductDetails(product){
        // eslint-disable-next-line no-console
        console.log(product);
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

        button.addEventListener("click", () => {
            this.addProductToCart(product);
        })

        div.appendChild(button);
        productDetail.appendChild(h3);
        productDetail.appendChild(h2);
        productDetail.appendChild(img);
        productDetail.appendChild(p1);
        productDetail.appendChild(p2);
        productDetail.appendChild(p3);
        productDetail.appendChild(div);
        }
}
