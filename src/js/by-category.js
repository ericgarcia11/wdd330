import { searchByCategoty } from "./ProductData.mjs";

const params = new URLSearchParams(window.location.search);
const category = params.get("category");


async function buildTemplateByCategory(category){
    const products = await searchByCategoty(category);
    const template = document.getElementById("product-list-template");
    const contaier = document.getElementById("product-list-container");

    products.forEach(product => {
        const clone = template.content.cloneNode(true);
        const [a, img, h3, h2, p] = clone.querySelectorAll("a, img, h3, h2, p");

        a.href = `/product_pages/product_page.html?productId=${product.Id}`;
        img.src = product.Images.PrimaryLarge;
        img.alt = product.Brand.Name;
        h3.textContent = product.Brand.Name;
        h2.textContent = product.NameWithoutBrand;
        p.textContent = `$${product.FinalPrice}`;

        contaier.appendChild(clone);
    });    
};

buildTemplateByCategory(category);
