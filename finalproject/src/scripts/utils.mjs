import Swal from 'sweetalert2';

// retrieve data from localstorage
export function getLocalStorage(key) {
  return JSON.parse(localStorage.getItem(key));
}
// save data to local storage
export function setLocalStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

export function loadHeader(){
    let users = getLocalStorage('users');
    if (!users){
        window.location.href = "../";
    } 
    const user = users.find(user1 => user1.active);
    if (!user){
        window.location.href = "../";
    } else {
        document.getElementById('header').innerHTML = `
                <header class="d-flex justify-content-between align-items-center px-4 py-3">
                <button class="btn btn-light btn-sm" id="btnPerfil">
                    <i class="bi bi-person-circle me-2"></i> ${user.username}
                </button>
                <nav>
                    <a href="../home/" class="btn btn-outline-light btn-sm me-2">Home</a>
                    <a href="../products/" class="btn btn-outline-light btn-sm me-2">Products</a>
                    <a href="../clients/" class="btn btn-outline-light btn-sm me-2">Clients</a>
                    <a href="../orders/" class="btn btn-outline-light btn-sm">Orders</a>
                </nav>
                </header>
            `;
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