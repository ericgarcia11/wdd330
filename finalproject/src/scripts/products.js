import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import Swal from 'sweetalert2';
import introJs from 'intro.js';
import 'intro.js/introjs.css';
import { getLocalStorage, getActiveUser, setLocalStorage, loadHeader, getProducts} from './utils.mjs';
import Product from "./products.mjs";


loadHeader();

async function loadProducts(){
    let productsData = await getProducts();
    let products = productsData.products;

    const productsCardsContainer = document.getElementById('productsCardsContainer');
    products.forEach(product => {
        const div  = document.createElement('div');
        div.style.width = '18rem';
        div.id = `product-${product.id}`;
        div.classList.add('card');
        div.innerHTML  = `<img src="${product.image}" class="card-img-top" alt="${product.title}">
          <div class="card-body">
            <h5 class="card-title">${product.title}</h5>
            <p class="card-text">${product.description.slice(0,100)}...</p>
          </div>
          <ul class="list-group list-group-flush">
            <li class="list-group-item">#ID: ${product.id}</li>
            <li class="list-group-item price_product">Price: $${product.price}</li>
          </ul>
          <div class="card-body">
            <button style="background: #008000;
                    border: none;" class="btn btn-primary editBtnCartProduct">Edit</button>
            <button style="background: #B71C1C;
                    border: none;" class="btn btn-primary deleteBtnCartProduct">Delete</button>
          </div>`;
        productsCardsContainer.appendChild(div);

        div.querySelector('.editBtnCartProduct').addEventListener('click', async function(){
            await editProduct(product, products);
        })

        div.querySelector('.deleteBtnCartProduct').addEventListener('click', async function(){
            await deleteProduct(product, products);
        })
    });
}

async function loadCarrossel(){
    let productsData = await getProducts();
    let products = productsData.products;
    const carroselContainer = document.querySelector('.carroselContainer');
     const carouselInner = carroselContainer.querySelector('.carousel-inner');

    // limpa o conteúdo anterior (caso a função seja chamada mais de uma vez)
    carouselInner.innerHTML = '';

    products.forEach((product, index) => {
        const item = document.createElement('div');
        item.classList.add('carousel-item');
        item.id = `carrossel-item-${product.id}`;
        if (index === 0) item.classList.add('active'); // primeiro item precisa ter .active

        item.innerHTML = `
        <img src="${product.image}" style="max-height:400px;object-fit:cover;" class="d-block w-100" alt="${product.title}">
        <div class="carousel-caption d-none d-md-block">
            <h5>${product.title}</h5>
            <p>${product.description.substring(0, 50)}...</p>
        </div>
        `;
        carouselInner.appendChild(item);
    });
    carroselContainer.style.display = 'flex';
}

async function editProduct(product, products){
    const result = await Swal.fire({
    title: 'Update product:',
   html: `
        <div style="display: flex; flex-direction: column;">
            <label for="swal-input-title">Title:</label>
            <input 
            style="margin: 0 40px 20px;" 
            id="swal-input-title" 
            class="swal2-input" 
            placeholder="${product.title}" 
            value="${product.title}" 
            type="text"
            >

            <label for="swal-input-description">Description:</label>
            <input 
            style="margin: 0 40px 20px;" 
            id="swal-input-description" 
            class="swal2-input" 
            placeholder="${product.description}" 
            value="${product.description}" 
            type="text"
            >

            <label for="swal-input-price">Price:</label>
            <input 
            style="margin: 0 40px 20px;" 
            id="swal-input-price" 
            class="swal2-input" 
            placeholder="${product.price}" 
            value="${product.price}" 
            type="number"
            >
        </div>
        `,  
    showCancelButton: true,
    confirmButtonText: 'Confirm',
    cancelButtonText: 'Cancel',
    preConfirm: async () => {
      const title = document.getElementById('swal-input-title').value;
      const description = document.getElementById('swal-input-description').value;
      const price = document.getElementById('swal-input-price').value;

      if (!title && !description && !price) {
        Swal.showValidationMessage('Please, fill one field in order to update the product.');
        return false;
      } else {
        product.title = title;
        product.description = description;
        product.price = price;

        const productElement = document.getElementById(`product-${product.id}`);
        const card_body = productElement.querySelector('.card-body');
        card_body.querySelector('.card-title').textContent = product.title;
        card_body.querySelector('.card-text').textContent = product.description;

        const list_group = productElement.querySelector('.list-group');
        list_group.querySelector('.price_product').textContent = product.price;

        products = products.map(product1 => {
            if (product1.id === product.id){
                return product;
            } else {
                return product1;
            }
        })
        let productsData = getLocalStorage('products');
        let user = getActiveUser();
        productsData = productsData.map(productsData1 => {
            if (productsData1.user_id === user.id){
                productsData1.products = products;
            }
            return productsData1;
        })
        setLocalStorage('products', productsData);
      }
      return;
    }
  });
}

async function deleteProduct(product, products){
    const result = await Swal.fire({
        title: 'Are you sure?',
        text: "This action can't be undone.",
        icon: 'question',
        showDenyButton: true,
        showCancelButton: false,
        confirmButtonText: 'Delete permanently',
        allowOutsideClick: true
    });

    if (result.isConfirmed) {
        document.getElementById(`product-${product.id}`).remove();
        // document.getElementById(`carrossel-item-${product.id}`).remove();
        products = products.filter(p => p.id !== product.id);

        let productsData = getLocalStorage('products');
        let user = getActiveUser();
        productsData = productsData.map(productsData1 => {
            if (productsData1.user_id === user.id){
                productsData1.products = products;
            }
            return productsData1;
        })
        setLocalStorage('products', productsData);
        Swal.fire('Deleted!', 'The product has been removed.', 'success');
    }
}

document.getElementById('productsListHeader')
    .querySelector('button')
    .addEventListener('click', async function(){
    const result = await Swal.fire({
    title: 'Create a new product:',
    html: `
    <div style="display: flex;
    flex-direction: column;">
        <label for="swal-input-title">Title:</label>
        <input style="margin: 0 40px 20px;" id="swal-input-title" class="swal2-input" type="text">

        <label for="swal-input-description">Description:</label>
        <input style="margin: 0 40px 20px;" id="swal-input-description" class="swal2-input" type="text">

        <label for="swal-input-price">Price:</label>
        <input style="margin: 0 40px 20px;" id="swal-input-price" class="swal2-input" type="number">

        <label for="swal-input-imageurl">Image URL:</label>
        <input style="margin: 0 40px 20px;" id="swal-input-imageurl" class="swal2-input" placeholder="https://..." type="text">
    </div>
    `,
    showCancelButton: true,
    confirmButtonText: 'Confirm',
    cancelButtonText: 'Cancel',
    preConfirm: async () => {
      const title = document.getElementById('swal-input-title').value;
      const description = document.getElementById('swal-input-description').value;
      const price = document.getElementById('swal-input-price').value;
      const imageurl = document.getElementById('swal-input-imageurl').value;

      if (!title || !description || !price || !imageurl) {
        Swal.showValidationMessage('Please, fill all fields in order to create the product.');
        return false;
      } else {
        let productsData = await getProducts();
        let products = productsData.products;
        let new_product_id = products[products.length - 1].id + 1;
        let product = new Product(
            {
                description : description,
                id : new_product_id,
                image : imageurl,
                price : price,
                title : title
            }
        );
        products.push(product);
        let user = getActiveUser();
        let productsDataAll = getLocalStorage('products');
        productsDataAll = productsDataAll.map(productsData1 => {
            if (productsData1.user_id === user.id){
                productsData1.products = products;
            }
            return productsData1;
        })
        setLocalStorage('products', productsDataAll);
        window.location.reload();
      }
      return;
    }
  });
})

loadProducts();
loadCarrossel();
