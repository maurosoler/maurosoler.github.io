const imageInput = document.getElementById('imgInput');
const displayImage = document.getElementById('displayImage');
const deleteImage = document.getElementById('deleteImage');
const nameInput = document.getElementById('name');
const secondNameInput = document.getElementById('second-name');
const lastNameInput = document.getElementById('last-name');
const secondLastNameInput =  document.getElementById('second-last-name');
const emailInput = document.getElementById('email');
const phoneNumberInput = document.getElementById('phone-number');
const dataUserForm = document.getElementById('dataUserForm');
const btnSaveData = document.getElementById('btnSaveData'); 
const alert = document.getElementById('alert'); 

userEmailFunction();
themeFunction();

const userEmail = localStorage.getItem('email');

if (!userEmail) {
    window.location.href = 'index.html';
}


emailInput.value = userEmail;

//Cargar foto si existe
if (localStorage.getItem('image')) {
    displayImage.src = localStorage.getItem('image');
}

// Guardar foto de perfil en localStorage
imageInput.addEventListener('change', (event) => {
    const image = event.target.files[0];
    const reader = new FileReader();

    reader.addEventListener('load', () => {
        localStorage.setItem('image', reader.result);

        displayImage.src = reader.result;
    });

    if (image) {
        reader.readAsDataURL(image);
    }
});

// Borrar foto de perfil
deleteImage.addEventListener('click', () => {
   const confirmation = confirm('Borrar foto de perfil?');

   if (confirmation) {
       localStorage.removeItem('image');
       window.location.reload();
   }
});

function createUserDataObj(name, secondName, lastName, secondLastName, email, phoneNumber) {
const userDataObj = {
    name: name,
    second_name: secondName,
    last_name: lastName,
    second_last_name: secondLastName,
    email: email,
    phone_number: phoneNumber,
}
 return userDataObj;
}

dataUserForm.addEventListener('submit', event => {
if(nameInput.value === '' || lastNameInput.value === '' || emailInput.value === '') {
event.preventDefault();
event.stopPropagation();
}

if(nameInput.value === ''){
 event.preventDefault();
 nameInput.classList.add('is-invalid');
} else {
    nameInput.classList.remove('is-invalid')
}

if(lastNameInput.value === ''){
    event.preventDefault();
    lastNameInput.classList.add('is-invalid');
   } else {
       lastNameInput.classList.remove('is-invalid')
   }

   if(emailInput.value === ''){
    event.preventDefault();
    emailInput.classList.add('is-invalid');
   } else {
    emailInput.classList.remove('is-invalid')
   }

   if(nameInput.value !== '' && lastNameInput.value !== '' && emailInput.value !== ''){
    event.preventDefault();
    const userDataObj = createUserDataObj(nameInput.value, secondNameInput.value, lastNameInput.value, secondLastNameInput.value, emailInput.value, phoneNumberInput.value);
    localStorage.setItem('user-data', JSON.stringify(userDataObj));
    alert.innerHTML += `
    <div class="alert alert-success text-center" role="alert" style="z-index: 1;">
    Datos guardados!
    </div>
    `;
   } else {
    alert.innerHTML += `
    <div class="alert alert-danger text-center" role="alert" style="z-index: 1;">
    Sus datos no han sido guardados, existen campos vacíos
    </div>
    `;
   }
   setTimeout(()=> {
    alert.innerHTML = '';
   }, 4000);

});

// Cargar datos del usuario a los inputs desde el LocalStorage
const userData = JSON.parse(localStorage.getItem('user-data'));

if (userData) {
  // Cargamos los valores a los campos de entrada, y si no hay datos guardados asignamos campo vacío '';
  nameInput.value = userData.name || '';
  secondNameInput.value = userData.second_name || '';
  lastNameInput.value = userData.last_name || '';
  secondLastNameInput.value = userData.second_last_name || '';
  phoneNumberInput.value = userData.phone_number || '';
}