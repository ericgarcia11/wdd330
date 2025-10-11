export default class ProductList {
  constructor(category, dataSource, listElement) {
    this.category = category;
    this.dataSource = dataSource;
    this.listElement = listElement;
  }
  async init(){
    const list = await this.dataSource.getData(this.category);
    const template = document.getElementById("product-list-template");
    const contaier = document.getElementById("product-list-container");
    list.forEach(product => {
      // // eslint-disable-next-line no-console
      //       console.log(product);
            const clone = template.content.cloneNode(true);
            const [a, img, h3, h2, p] = clone.querySelectorAll("a, img, h3, h2, p");

            a.href = `../product_pages/product_page.html?productId=${product.Id}&category=${product.Image.split("/")[2]}`;
            img.src = product.Image;
            img.alt = product.Brand.Name;
            h3.textContent = product.Brand.Name;
            h2.textContent = product.NameWithoutBrand;
            p.textContent = `$${product.FinalPrice}`;

            contaier.appendChild(clone);
        }); 
  }
}