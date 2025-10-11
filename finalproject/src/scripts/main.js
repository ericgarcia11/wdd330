import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import * as bootstrap from 'bootstrap';
import Swal from 'sweetalert2';
import introJs from 'intro.js';
import 'intro.js/introjs.css';
import { getLocalStorage, setLocalStorage} from './utils.mjs';

const credentials = { username: 'mor_2314', password: '83r5^_' };

// Exemplo: ação do formulário de login
const loginForm = document.getElementById('loginForm');
loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  fetch('https://fakestoreapi.com/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials)
  })
  .then(response => response.json())
  .then(async (data) => {
    let users = getLocalStorage('users');
    let authenticated = null;
    if (users && users.length > 0){
      users = users.map(user => { 
        if (user.email === email) {
          user.active = true;
          user.token = data.token;
          console.log(user);
        } else {
          user.active = false;
        }
        return user;
      });
      let user = null;
      user = users.find( user1 => user1.email === email);
      console.log(user);
      if (!user){
        await Swal.fire({
            title: `Account not identified!`,
            text: 'You may need to create an account.',
            icon: 'error'
        });
        signInTutorial();
        return null;
      } else if( user.password === password) {
        authenticated = true;
      } else {
        await Swal.fire({
            title: `Wrong password!`,
            text: 'Please, try again with the correct password.',
            icon: 'error'
        });
      }
    } else {
      await Swal.fire({
          title: `Account not identified!`,
          text: 'You may need to create an account.',
          icon: 'error'
      });
      signInTutorial();
    }
    setLocalStorage('users', users);
    // modal configurations to anitate it
    if (authenticated){
      const loadingModal = new bootstrap.Modal(document.getElementById('loadingModal'), {
        backdrop: 'static',
        keyboard: false 
      });

      loadingModal.show(); 

      try {
        setTimeout(() => {
          loadingModal.hide();
          window.location.href = '../home/';
        }, 2000);

      } catch (err) {
        loadingModal.hide();  
        alert(err.message);
      }
    }
  });
});

function signInTutorial(){
  introJs.tour().setOptions({
    steps: [
        {
          element: document.querySelector('#signinBtn'),
          intro: "Click here to create an account"
        }
      ]
  }).start();
}

const containerLogin = document.getElementById('containerLogin');
containerLogin.style.display = 'block';