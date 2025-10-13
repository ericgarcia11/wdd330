import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import Swal from 'sweetalert2';
import introJs from 'intro.js';
import 'intro.js/introjs.css';
import { getLocalStorage, getActiveUser, setLocalStorage, loadHeader, getClients} from './utils.mjs';
import Client from "./clients.mjs";

loadHeader();

async function loadClients(){
    let clientsData = await getClients();
    let clients = clientsData.clients;

    const clientsContainer = document.getElementById('clientsContainer');
    clients.forEach(client => {
        const div  = document.createElement('div');
        div.id = `client-${client.id}`;
        div.classList.add('card');
        div.innerHTML  = `<h5 class="card-header">#ID ${client.id}</h5>
                            <div class="card-body">
                                <h5 class="card-title">${client.name}</h5>
                                <p class="card-text clientAddress"><strong>Address:</strong> ${client.address}.</p>
                                <p class="card-text clientPhone"><strong>Phone:</strong> ${client.phone}.</p>
                                <p class="card-text clientEmail"><strong>Email:</strong> ${client.email}.</p>
                                <button href="#" class="btn btn-primary EditBtnClient">Edit</button>
                                <button href="#" class="btn btn-primary delBtnClient">Delete</button>
                            </div>`;
        clientsContainer.appendChild(div);

        div.querySelector('.EditBtnClient').addEventListener('click', async function(){
            await editClient(client, clients);
        })

        div.querySelector('.delBtnClient').addEventListener('click', async function(){
            await deleteClient(client, clients);
        })
    });
}

async function editClient(client, clients){
    const result = await Swal.fire({
    title: 'Update client:',
   html: `
        <div style="display: flex; flex-direction: column;">
            <label for="swal-input-name">Name:</label>
            <input 
            style="margin: 0 40px 20px;" 
            id="swal-input-name" 
            class="swal2-input" 
            placeholder="${client.name}" 
            value="${client.name}" 
            type="text"
            >

            <label for="swal-input-email">Email:</label>
            <input 
            style="margin: 0 40px 20px;" 
            id="swal-input-email" 
            class="swal2-input" 
            placeholder="${client.email}" 
            value="${client.email}" 
            type="text"
            >

            <label for="swal-input-phone">Phone:</label>
            <input 
            style="margin: 0 40px 20px;" 
            id="swal-input-phone" 
            class="swal2-input" 
            placeholder="${client.phone}" 
            value="${client.phone}" 
            type="text"
            >

            <label for="swal-input-address">Address:</label>
            <input 
            style="margin: 0 40px 20px;" 
            id="swal-input-address" 
            class="swal2-input" 
            placeholder="${client.address}" 
            value="${client.address}" 
            type="text"
            >
        </div>
        `,  
    showCancelButton: true,
    confirmButtonText: 'Confirm',
    cancelButtonText: 'Cancel',
    preConfirm: async () => {
      const name = document.getElementById('swal-input-name').value;
      const email = document.getElementById('swal-input-email').value;
      const phone = document.getElementById('swal-input-phone').value;
      const address = document.getElementById('swal-input-address').value;

      if (!name && !email && !phone && !address) {
        Swal.showValidationMessage('Please, fill one field in order to update the client.');
        return false;
      } else {
        client.name = name;
        client.email = email;
        client.phone = phone;
        client.address = address;

        const clientElement = document.getElementById(`client-${client.id}`);
        const card_body = clientElement.querySelector('.card-body');
        card_body.querySelector('.card-title').textContent = client.name;
        card_body.querySelector('.clientAddress').innerHTML = `<strong>Address:</strong> ${client.address}.`;
        card_body.querySelector('.clientPhone').innerHTML = `<strong>Phone:</strong> ${client.phone}.`;
        card_body.querySelector('.clientEmail').innerHTML = `<strong>Email:</strong> ${client.email}.`;

        clients = clients.map(clients1 => {
            if (clients1.id === client.id){
                clients1 = client;
            }
            return clients1;
        })
        let clientsData = getLocalStorage('clients');
        let user = getActiveUser();
        clientsData = clientsData.map(clientsData1 => {
            if (clientsData1.user_id === user.id){
                clientsData1.clients = clients;
            }
            return clientsData1;
        })
        setLocalStorage('clients', clientsData);
      }
      return;
    }
  });
}

async function deleteClient(client, clients){
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
        document.getElementById(`client-${client.id}`).remove();
        // document.getElementById(`carrossel-item-${product.id}`).remove();
        clients = clients.filter(c => c.id !== client.id);

        let clientsData = getLocalStorage('clients');
        let user = getActiveUser();
        clientsData = clientsData.map(clientsData1 => {
            if (clientsData1.user_id === user.id){
                clientsData1.clients = clients;
            }
            return clientsData1;
        })
        setLocalStorage('clients', clientsData);
        Swal.fire('Deleted!', 'The client has been removed.', 'success');
    }
}

document.getElementById('clientsHeader')
    .querySelector('button')
    .addEventListener('click', async function(){
    const result = await Swal.fire({
    title: 'Create a new client:',
    html: `
    <div style="display: flex;
    flex-direction: column;">
        <label for="swal-input-name">Name:</label>
        <input style="margin: 0 40px 20px;" id="swal-input-name" class="swal2-input" type="text">

        <label for="swal-input-email">Email:</label>
        <input style="margin: 0 40px 20px;" id="swal-input-email" class="swal2-input" type="text">

        <label for="swal-input-phone">Phone:</label>
        <input style="margin: 0 40px 20px;" id="swal-input-phone" class="swal2-input" type="text">

        <label for="swal-input-address">Address:</label>
        <input style="margin: 0 40px 20px;" id="swal-input-address" class="swal2-input"  type="text">
    </div>
    `,
    showCancelButton: true,
    confirmButtonText: 'Confirm',
    cancelButtonText: 'Cancel',
    preConfirm: async () => {
      const name = document.getElementById('swal-input-name').value;
      const email = document.getElementById('swal-input-email').value;
      const phone = document.getElementById('swal-input-phone').value;
      const address = document.getElementById('swal-input-address').value;

      if (!email || !name || !phone || !address) {
        Swal.showValidationMessage('Please, fill all fields in order to create the client.');
        return false;
      } else {
        let clientsData = await getClients();
        let clients = clientsData.clients;
        let new_client_id = clients[clients.length - 1].id + 1;
        let client = new Client(
            {
                name : name,
                id : new_client_id,
                phone : phone,
                email : email,
                address : address
            }
        );
        clients.push(client);
        let user = getActiveUser();
        let clientsDataAll = getLocalStorage('products');
        clientsDataAll = clientsDataAll.map(clientsData1 => {
            if (clientsData1.user_id === user.id){
                clientsData1.clients = clients;
            }
            return clientsData1;
        })
        setLocalStorage('clients', clientsDataAll);
        window.location.reload();
      }
      return;
    }
  });
})

document.querySelector('.form-control').addEventListener('input', async function(){
    const typed = document.querySelector('.form-control').value.toLowerCase();
    let clientsData = await getClients();
    let clients = clientsData.clients;
    clients.forEach(client => {
        if (typed === "") {
            document.getElementById(`client-${client.id}`).style.display = 'block';
        } else {
            if (
                client.name.toLowerCase().includes(typed) || 
                client.phone.toLowerCase().includes(typed) || 
                client.email.toLowerCase().includes(typed) || 
                client.address.toLowerCase().includes(typed) 
            ) {
                document.getElementById(`client-${client.id}`).style.display = 'block';
            } else {
                document.getElementById(`client-${client.id}`).style.display = 'none';
            }
        }
    });
})

loadClients();
