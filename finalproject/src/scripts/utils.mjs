import Swal from 'sweetalert2';
import Product from "./products.mjs";
import Client from "./clients.mjs";

// retrieve data from localstorage
export function getLocalStorage(key) {
  return JSON.parse(localStorage.getItem(key));
}
// save data to local storage
export function setLocalStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

export async function loadHeader(){
    let users = getLocalStorage('users');
    if (!users){
        window.location.href = "../";
    } 
    const user = users.find(user1 => user1.active);
    if (!user){
        window.location.href = "../";
    } else {
        let headerSelect = '';
        const countryRes = await fetch(`https://restcountries.com/v3.1/all?fields=name,currencies`);
        const countries = await countryRes.json();
        countries.forEach(country => {
            if (country.name.common.toLowerCase() === user.country.toLowerCase()){
                headerSelect += `<option value="${Object.keys(country.currencies)[0]}" selected>${country.name.common}</option>`;
            } else {
                headerSelect += `<option value="${Object.keys(country.currencies)[0]}">${country.name.common}</option>`;
            }
        });

        document.getElementById('header').innerHTML = `
                <header class="d-flex justify-content-between align-items-center px-4 py-3">
                <button class="btn btn-light btn-sm" id="btnPerfil">
                    <i class="bi bi-person-circle me-2"></i> ${user.username}
                </button>
                <div>
                    <nav>
                        <a href="../home/" class="btn btn-outline-light btn-sm me-2">Home</a>
                        <a href="../products/" class="btn btn-outline-light btn-sm me-2">Products</a>
                        <a href="../clients/" class="btn btn-outline-light btn-sm me-2">Clients</a>
                        <a  class="btn btn-outline-light btn-sm me-2 exchangeValue"><strong>Exchange: </strong></a>
                    </nav>
                    <select class="form-select" aria-label="Default select example">
                        ${headerSelect}
                    </select>
                </div>
                </header>
            `;

        headerSelect = document.getElementById('header')
            .querySelector('div')
            .querySelector('select');

        resizeSelect(headerSelect)
        
        headerSelect.addEventListener('change', async function(){
            user.country = headerSelect.options[headerSelect.selectedIndex].textContent;
            user.currency = headerSelect.options[headerSelect.selectedIndex].value;
            let users = getLocalStorage('users');
            users = users.map(user1 => {
                if (user1.email === user.email){
                    return user;
                } else {
                    return user1;
                }
            })
            setLocalStorage('users', users);
            await resizeSelect(headerSelect);
        })

        async function resizeSelect(headerSelect){
            const temp = document.createElement('span');
            temp.style.visibility = 'hidden';
            temp.style.whiteSpace = 'nowrap';
            temp.style.font = window.getComputedStyle(headerSelect).font;
            temp.textContent = headerSelect.options[headerSelect.selectedIndex].text;

            document.body.appendChild(temp);
            const newWidth = temp.offsetWidth + 100; // margem pro botãozinho ▼
            document.body.removeChild(temp);

            headerSelect.style.width = `${newWidth}px`;

            let user = getActiveUser();
            const convertedAmount = await convert("USD", user.currency, 1);
            if (convertedAmount){
                document.querySelector('.exchangeValue').innerHTML = `<strong>(USD) $1 = $${convertedAmount} (${user.currency}) `;
            } else {
                document.querySelector('.exchangeValue').textContent = 'Exchange not available';
            }
        }
        
        document.getElementById("btnPerfil").addEventListener("click", async () => {
            const result = await Swal.fire({
                title: 'What would you like to do?',
                text: "Choose an option:",
                icon: 'question',
                showDenyButton: true,
                showCancelButton: false,
                confirmButtonText: 'Update Profile',
                denyButtonText: 'Logout',
                allowOutsideClick: true
            });

            if (result.isConfirmed) {
                updateProfile(user, users)
            } else if (result.isDenied) {
                users = users.map(user => {
                    user.active = false;
                    return user;
                });
                setLocalStorage('users', users);
                window.location.href = "../";
            }
        });   
    }
}

async function convert(from, to, amount) {
  return fetch(`https://api.frankfurter.dev/v1/latest?base=${from}&symbols=${to}`)
    .then(resp => resp.json())
    .then(data => data.rates[to].toFixed(2))
    .catch(err => {
      console.error(err); 
      return null;
    });
}

async function updateProfile(user, users){
    const result = await Swal.fire({
    title: 'Update your profile:',
    html:
      `<input id="swal-input-name" class="swal2-input" placeholder="${user.username}" autocomplete="${user.username}">` +
      `<input id="swal-input-email" class="swal2-input" placeholder="${user.email}" type="email">` +
      `<input id="swal-input-password" class="swal2-input" placeholder="${user.password}" type="tel">`,
    showCancelButton: true,
    confirmButtonText: 'Confirm',
    cancelButtonText: 'Cancel',
    preConfirm: async () => {
      const name = document.getElementById('swal-input-name').value;
      const email = document.getElementById('swal-input-email').value;
      var password = document.getElementById('swal-input-password').value;

      if (!name && !email && !password) {
        Swal.showValidationMessage('Please, fill one field in order to update your profile.');
        return false;
      } else {
        if (name){
            user.username = name;
        } else if (email){
            user.email = email;
        } else if (password){
            user.password = password;
        }
        users = users.map(user1 => {
            if (user1.email === user.email){
                return user;
            } else {
                return user1;
            }
        })
        setLocalStorage('users', users);

        document.getElementById('btnPerfil').innerHTML = `<i class="bi bi-person-circle me-2"></i> ${user.username}`;
      }
      return;
    }
  });
}

export function getActiveUser(){
    const users = getLocalStorage('users');
    let user = users.find(user => user.active === true);
    return user;
}

export async function getProducts(){
    let user = getActiveUser();
    let products = getLocalStorage('products');
    if (!products || products.length === 0){
        products = [];
        const response = await fetch('https://fakestoreapi.com/products')
        const data = await response.json();
        let products_items = data.map(product => new Product(product));
        products.push(
            {
                user_id : user.id,
                products : products_items
            }
        );
        setLocalStorage('products', products);
        let productsActiveUser = products.find(productData => productData.user_id === user.id);
        return productsActiveUser;
    } else {
        const productsUser = products.find(productsUser => productsUser.user_id === user.id);
        if (!productsUser){
            const response = await fetch('https://fakestoreapi.com/products')
            const data = await response.json();
            let products_items = data.map(product => new Product(product));
            products.push(
                {
                    user_id : user.id,
                    products : products_items
                }
            );
            setLocalStorage('products', products);
            let productsActiveUser = products.find(productData => productData.user_id === user.id);
            return productsActiveUser;
        } else {
            let productsActiveUser = products.find(productData => productData.user_id === user.id);
            return productsActiveUser;
        }
    }
}

export async function getClients(){
    let user = getActiveUser();
    let clientsAll = getLocalStorage('clients');
    if (!clientsAll || clientsAll.length === 0){
        clientsAll = [];
        const response = await fetch('https://fakestoreapi.com/users')
        const data = await response.json();
        let id = 0;
        let clients = data.map(client => 
            new Client({
                    id: id+=1,
                    name : `${client.name.firstname} ${client.name.lastname}`,
                    phone : client.phone,
                    address : `${client.address.number} ${client.address.street}, ${client.address.city}, ${client.address.zipcode}`,
                    email : client.email
                })
            );

        clientsAll.push(
            {
                user_id : user.id,
                clients : clients
            }
        );
        setLocalStorage('clients', clientsAll);
        let clientsActiveUser = clientsAll.find(clientsData => clientsData.user_id === user.id);
        return clientsActiveUser;
    } else {
        const clientsUser = clientsAll.find(clientsUser => clientsUser.user_id === user.id);
        if (!clientsUser){
            const response = await fetch('https://fakestoreapi.com/users')
            const data = await response.json();
            let id = 0;
            let clients_items = data.map(client => new Client({
                    id: id+=1,
                    name : `${client.name.firstname} ${client.name.lastname}`,
                    phone : client.phone,
                    address : `${client.address.number} ${client.address.street}, ${client.address.city}, ${client.address.zipcode}`,
                    email : client.email
                })
            );

            clientsAll.push(
                {
                    user_id : user.id,
                    clients : clients_items
                }
            );
            setLocalStorage('clients', clientsAll);
            let clientsActiveUser = clientsAll.find(clientsData => clientsData.user_id === user.id);
            return clientsActiveUser;
        } else {
            let clientsActiveUser = clientsAll.find(clientsData => clientsData.user_id === user.id);
            return clientsActiveUser;
        }
    }
}