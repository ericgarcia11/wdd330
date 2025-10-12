import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import * as bootstrap from 'bootstrap';
import Swal from 'sweetalert2';
import introJs from 'intro.js';
import 'intro.js/introjs.css';
import { getLocalStorage, setLocalStorage, loadHeader, getProducts} from './utils.mjs';

const totalClientes = 54;
const totalPedidos = 132;
const productsData = await getProducts();
let products = productsData.products;
const totalProducts = products.length;

document.getElementById("totalClients").textContent = totalClientes;
document.getElementById("totalOrders").textContent = totalPedidos;
document.getElementById("totalProducts").textContent = totalProducts;

loadHeader();