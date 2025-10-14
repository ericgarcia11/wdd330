import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import * as bootstrap from 'bootstrap';
import Swal from 'sweetalert2';
import introJs from 'intro.js';
import 'intro.js/introjs.css';
import { getLocalStorage, setLocalStorage, loadHeader, getProducts, getClients} from './utils.mjs';

await loadHeader();

// const totalPedidos = 132;
const productsData = await getProducts();
let products = productsData.products;
const totalProducts = products.length;

const clientsData = await getClients();
let clients = clientsData.clients;
const totalClients = clients.length;

document.getElementById("totalClients").textContent = totalClients;
document.getElementById("totalProducts").textContent = totalProducts;

