
const template = document.getElementById("product-list-template");
const contaier = document.getElementById("product-list-container");

function renderListWithTemplate(){
    fetch("/json/tents.json")
    .then(response => response.json())
    .then(data => {
        // console.log(data);
        
        data.forEach(product => {
            const clone = template.content.cloneNode(true);
            const [a, img, h3, h2, p] = clone.querySelectorAll("a, img, h3, h2, p");

            a.href = `product_pages/index.html?product=${product.Id}`;
            img.src = product.Image;
            img.alt = product.Brand.Name;
            h3.textContent = product.Brand.Name;
            h2.textContent = product.NameWithoutBrand;
            p.textContent = `$${product.FinalPrice}`;

            contaier.appendChild(clone);
        });    
    });
};

renderListWithTemplate();