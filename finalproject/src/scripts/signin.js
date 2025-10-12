import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import Swal from 'sweetalert2';
import { getLocalStorage, setLocalStorage} from './utils.mjs';

const credentials = { username: 'mor_2314', password: '83r5^_' };

// Exemplo: ação do formulário de login
const signinForm = document.getElementById('signinForm');
signinForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const username = document.getElementById('username').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  let users = getLocalStorage('users');

  if(users && users.find(user => user.email === email)){
    await Swal.fire({
        title: `Account found!`,
        text: `The email ${email} is not available. There is already an account registered with this email address.`,
        icon: 'error'
    });
    return;
  }

  fetch('https://fakestoreapi.com/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials)
  })
    .then(response => response.json())
    .then( async (data) => {
      const userData = {
            'active'    : false,
            'token'     : data.token,
            'username'  : username,
            'email'     : email,
            'password'  : password
        };
      if (users && users.length > 0){
        let id = users[users.length - 1].id + 1;
        userData.id = id;
        users.push(userData);
      } else {
        userData.id = 1;
        users = [userData];
      }
      setLocalStorage('users', users);
      await Swal.fire({
            title: `Account created with success!`,
            icon: 'success'
        });
        window.location.href = "../";
    }
  );
});

const containerLogin = document.getElementById('containerLogin');
containerLogin.style.display = 'block';