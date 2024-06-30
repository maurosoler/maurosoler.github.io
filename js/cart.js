// Sumar y restar 1 de las cantidades
function updateProductQuantity(value) {
  const quantityInputs = document.querySelectorAll('.cart-quantity');
  quantityInputs.forEach((input) => {
    const currentQuantity = parseInt(input.value);
    if (!isNaN(currentQuantity)) {
      input.value = currentQuantity + value;
      const event = new Event('input', { bubbles: true });
      input.dispatchEvent(event);
    }
  });
}

document.addEventListener('DOMContentLoaded', function () {
  setTimeout(() => {
    updateProductQuantity(1);
  }, 100);

  setTimeout(() => {
    updateProductQuantity(-1);
  }, 100);

  cardCheck.addEventListener('click', alternatePayment);
  bankCheck.addEventListener('click', alternatePayment);
  
// Llamada a funciones
fetchCartData();
userEmailFunction();
});
window.addEventListener('load', fetchDataAndShow);



// Calculo del subtotal
function calculateSubtotal(unitCost, quantity) {
  if (isNaN(quantity)) {
    quantity = 1;
  }

  return unitCost * quantity;
}

let totalSum = 0;

// Calcular suma de subtotales
function updateTotalSum() {
  totalSum = 0;
  const subtotalElements = document.querySelectorAll('.subtotal');
  subtotalElements.forEach(subtotalElement => {
    totalSum += parseFloat(subtotalElement.textContent);
  });

  subtotalSum.textContent = totalSum.toFixed(2);
  updateDeliveryFee();
}

// Cambiar precio de envio en tiempo real
const selectShip = document.getElementById('selectShip');
let selectedOption = selectShip.value;

selectShip.addEventListener('change', () => {
  selectedOption = selectShip.value;
  updateDeliveryFee();
});

function updateDeliveryFee() {
  const subtotalSumValue = parseFloat(subtotalSum.textContent);

  let deliveryFeePercentage = 0;
  const selectShip = document.getElementById('selectShip');
  let selectedOption = selectShip.value;
  // Calcular precio de envio y total
  switch (selectedOption) {
    case "disabled":
      deliveryFeePercentage = 0;
      break;
    case "premium":
      deliveryFeePercentage = 0.15;
      break;
    case "express":
      deliveryFeePercentage = 0.07;
      break;
    case "standard":
      deliveryFeePercentage = 0.05;
      break;
    default:
      deliveryFeePercentage = 0;
  }

  const deliveryFeeValue = subtotalSumValue * deliveryFeePercentage;

  deliveryFee.textContent = deliveryFeeValue.toFixed(2);

  const totalPriceValue = subtotalSumValue + deliveryFeeValue;
  totalPrice.textContent = totalPriceValue.toFixed(2);
}



// Fetch carrito de compras
async function fetchCartData() {
  try {
    const response = await fetch('https://japceibal.github.io/emercado-api/user_cart/25801.json');
    const data = await response.json();
    arrayCartStandar.push(...data.articles);
    console.log(arrayCartStandar);

    const selectedItem = arrayCartStandar[0];
    updateCartUI(selectedItem);
    updateTotalSum();
  } catch (error) {
    console.log('Error al obtener los datos:', error);
  }
}

// Fetch productos de localStorage
async function fetchDataAndShow() {
  const productIDs = JSON.parse(localStorage.getItem('cartProducts')) || [];
  if (!Array.isArray(productIDs)) {
    console.error('Invalid product IDs in localStorage, impossible to fetch.');
    return;
  }

  const cartProducts = document.getElementById('cartProducts');

  for (const productID of productIDs) {
    const urlProduct = `https://japceibal.github.io/emercado-api/products/${productID}.json`;

    try {
      const response = await fetch(urlProduct);
      const data = await response.json();
      appendProductToCart(data, productID, cartProducts);
    
    } catch (error) {
      console.error(`Error fetching product with ID ${productID}: ${error}`);
    }
  }

  updateTotalSum();
}

// Agregar productos al carro
  function appendProductToCart(productData, productID, cartProducts) {
  const productItem = document.createElement("div");
  productItem.className = "cart-item row ms-1 align-items-center p-0";

  let price = productData.cost;
  if (productData.currency === 'UYU') {
    price /= 40;
  }

  const productHTML = `
    <div class="d-none d-sm-block col-sm-2 text-center p-0"><img src="../img/productspng/${productID}.png" title="${productData.name}" class="py-2 product-image" alt="${productData.name}"></div>
    <div class="col-3 col-sm-3 text-center p-0">${productData.name}</div>
    <div class="d-none d-sm-block col-sm-2 text-center p-0">USD ${price.toFixed(2)}</div>
    <div class="col-1 col-sm-2 text-center p-0">
      <input class="cart-quantity text-end" type="number" value="1" max="999" maxlength="3" min="1">
    </div>
    <div class="col-6 col-sm-2 text-end text-sm-center fw-bold p-0">USD <span class="subtotal">${price.toFixed(2)}</span></div>
    <div class="col-1 col-sm-1 p-0 text-center p-0 removeItem" id="trash" title="Eliminar del carrito" data-productID="${productID}"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="red" class="bi bi-trash3" viewBox="0 0 22 22">
    <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5ZM11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1h-.995a.59.59 0 0 0-.01 0H11Zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5h9.916Zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47ZM8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5Z"/>
  </svg></div>
  `;

  productItem.innerHTML = productHTML;
  cartProducts.appendChild(productItem);

  const quantityInput = productItem.querySelector('.cart-quantity');
  
  // Leer cantidades de localstorage
  const storedQuantity = localStorage.getItem(`quantity_${productID}`);
  if (storedQuantity) {
    quantityInput.value = storedQuantity;
  }

  quantityInput.addEventListener('input', function () {
    const selectedQuantity = parseInt(quantityInput.value);
    const subtotalElement = productItem.querySelector('.subtotal');

    let price = productData.cost;
    if (productData.currency === 'UYU') {
      price /= 40;
    }

    const newSubtotal = calculateSubtotal(price, selectedQuantity);
    subtotalElement.textContent = ` ${newSubtotal.toFixed(2)}`;
    updateTotalSum();
    updateDeliveryFee();

    localStorage.setItem(`quantity_${productID}`, selectedQuantity);
  });

  // Remover productos del carro
  const removeButton = productItem.querySelector('.removeItem');
  removeButton.addEventListener('click', function () {
    const productIDToRemove = removeButton.getAttribute("data-productID");
    cartProducts.removeChild(productItem);
    removeProductFromCart(productIDToRemove);
    updateTotalSum();
    updateDeliveryFee();
  });
  

//Obtener todas las categorias con sus nombres e IDs
let categoriesData;
fetch('https://japceibal.github.io/emercado-api/cats/cat.json')
.then(res => res.json())
.then(data => {
   categoriesData = data;
});

//Función que devuelve la categoria según su nombre
function getProductCat(categories, categoryName){
const cat = categories.find(category => category.name === categoryName);
return cat;
};

//Función que obtiene el nombre e id de la categoria del producto para reedirigir a product-info 
function redirectAndSetCatID(productId){
  fetch(`https://japceibal.github.io/emercado-api/products/${productId}.json`)
  .then(response => response.json())
  .then(product => {
    const productCategoryName = product.category;
    const cat = getProductCat(categoriesData, productCategoryName);
    const catID = cat.id;
    redirectToProductInfo(productId, catID);
  })
  .catch(error => {
    console.error(error);
  });
}

//Función reutilizada de products.js para redirigir a products-info.js
function redirectToProductInfo(productId, catId) {
    localStorage.setItem('catID', catId);
    localStorage.setItem('productID', productId);
    window.location.assign('product-info.html');
}

  //Obtener los productID correspondientes a cada imagen para redirigir a la página del producto
  const images = cartProducts.querySelectorAll('img');
  const productIDs = JSON.parse(localStorage.getItem('cartProducts')) || [];
  images.forEach((image, index)=> {
    image.addEventListener('click', () => {
    redirectAndSetCatID(productIDs[index]);
      });
    });
}


//Funcion para remover el producto del carrito en el localStorage
function removeProductFromCart(productID) {
  const productIDs = JSON.parse(localStorage.getItem('cartProducts')) || [];
  const updatedProductIDs = productIDs.filter(id => id !== productID);
  localStorage.setItem('cartProducts', JSON.stringify(updatedProductIDs));
  updateTotalSum();
}

let selectedQuantity = 1;
const arrayCartStandar = [];

/* 
Validaciónes de MODAL para los métodos de PAGO
*/
     // VARIABLES GLOBALES
const monthInput = document.getElementById('month');
const cardNumber = document.getElementById('cardNumber');
const cardSelected = document.getElementById('cardSelected');
const cvv = document.getElementById('cvv');
const cardIcon = document.getElementById('cardIcon');
const cardCheck = document.getElementById('cardCheck');
const bankCheck = document.getElementById('bankCheck');
const accountNumber = document.getElementById('accountNumber');
const btnSelectPay = document.getElementById('btnSelectPay');
const cancelPay = document.getElementById('cancelPay');

// CAMBIAR IMÁGEN DE TARJETA DE CREDITO AL SELECCIONARLA
cardSelected.addEventListener('change', function() {
  const selectedOption = cardSelected.value;
  if (selectedOption === 'Visa') {
    cardIcon.innerHTML = '<img class="img-thumbnail img-fluid" src="/icons/visa.png" alt="Visa">';
  } else if (selectedOption === 'Master') {
    cardIcon.innerHTML = '<img class="img-thumbnail img-fluid" src="/icons/master.png" alt="MasterCard">';
  } else {
    cardIcon.innerHTML = '';
  }
});
cardIcon.innerHTML = '';

// ************  DECLARACION DE FUNCIONES: DE DISABLED, ENABLED, CLEAR **************************
function disableFields(inputs) {
  inputs.forEach(input => {
    input.setAttribute('disabled', 'disabled');
  });
}

function enableFields(inputs) {
  inputs.forEach(input => {
    input.removeAttribute('disabled');
  });
}

function clearFields(inputs) {
  inputs.forEach(input => {
    input.value = '';
  });
}
/* ********************************************************************************************** */
//Variable para guardar el método de pago seleccionado
let methodPaymentSelected = undefined; 

// BlOQUEAR OPCIONES (TARJETA O TRANSFERENCIA) al ingresar al botón "Seleccionar"
btnSelectPay.addEventListener('click', function () {
  if (cardCheck.checked) {
    disableFields([accountNumber]);
    clearFields([accountNumber]);
    enableFields([cardNumber, cvv, monthInput, cardSelected]);
    methodPaymentSelected = 'card';
  } else if (bankCheck.checked) {
    enableFields([accountNumber]);
    disableFields([cardNumber, cvv, monthInput, cardSelected]);
    clearFields([cardNumber, monthInput, cvv]);
    methodPaymentSelected = 'bank';
    cardSelected.value = 'disabled';
  } else {
    disableFields([accountNumber,cardNumber,cvv,monthInput,cardSelected]);
    clearFields([accountNumber, cardNumber, cvv, monthInput]);
    methodPaymentSelected = undefined;
    cardSelected.value = 'disabled';
  }
});

// Deshabilitar campos de la opción no seleccionada ALTERNANDO
function alternatePayment() {
  if (cardCheck.checked) {
    disableFields([accountNumber]);
    clearFields([accountNumber]);
    enableFields([cardNumber, cvv, monthInput, cardSelected]);
    methodPaymentSelected = 'card';
  } else if (bankCheck.checked) {
    enableFields([accountNumber]);
    disableFields([cardNumber, cvv, monthInput, cardSelected]);
    methodPaymentSelected = 'bank';
    clearFields([cardNumber, cvv, monthInput, cardSelected]);
  }
}
// FUNCION PARA ELIMINAR DATOS AL BOTON CANCELAR del modal
cancelPay.addEventListener('click' , function(){
  clearFields([accountNumber, cardNumber, monthInput, cvv]);
  bankCheck.checked = false;
  cardCheck.checked = false;
})
//******************************************************************************************* */

//Función para remover las alertas
const divAlert = document.getElementById('divAlert');
function removeAlert() {
    setTimeout(() => {
        divAlert.innerHTML = '';
    }, 4000);
};

//Función que válida que los campos del modal no esten vacíos en consecuencia del método de pago selecionado.
function validateMethodPayment(methodSelected){
  if (methodSelected === 'card'){
   if(monthInput.value !== '' && validateCardExpiration(monthInput.value) && cardNumber.value !== '' && cvv.value !== '' && cardSelected.value !== 'disabled') {
    return true;
   } else {
    return false;
   }
  } else if(methodSelected === 'bank'){
    if(accountNumber.value !== ''){
      return true;
    } else {
      return false;
    }
  }
};

//Función para validar la fecha de vencimiento de la tarjeta ingresada comparandola con la fecha local
function validateCardExpiration(cardExpiration){
  const newDate = new Date();
  const currentDate = newDate.toLocaleString('sv-SE', {year:'numeric', month:'2-digit'});
  const currentDateString = currentDate.toString();
  if(cardExpiration > currentDateString){
    return true;
  } else {
    return false
  };
};

//Función para realizar las validaciones previas a la compra y aplicar estilos con bootstrap 
(()=> {
  'use strict'

  const form = document.querySelector('.needs-validation');

  form.addEventListener('submit', event => {
    

    if (!form.checkValidity()) {
      event.preventDefault();
      event.stopPropagation();
    }

const streetAddress = document.getElementById('streetA');
const numberAddress = document.getElementById('numberA');
const cornerAddress = document.getElementById('cornerA');
const selectMethodPayment = document.getElementById('selectMethodPayment');

if(streetAddress.value === ""){
  event.preventDefault();
  streetAddress.classList.remove('is-valid');
  streetAddress.classList.add('is-invalid');
} else {
  streetAddress.classList.remove('is-invalid');
  streetAddress.classList.add('is-valid');
}

if(numberAddress.value === ""){
  event.preventDefault();
  numberAddress.classList.remove('is-valid');
  numberAddress.classList.add('is-invalid');
} else {
  numberAddress.classList.remove('is-invalid');
  numberAddress.classList.add('is-valid');
}

if(cornerAddress.value === ""){
  event.preventDefault();
  cornerAddress.classList.remove('is-valid');
  cornerAddress.classList.add('is-invalid');
} else {
  cornerAddress.classList.remove('is-invalid');
  cornerAddress.classList.add('is-valid');
}

if(selectedOption === "disabled") {
  event.preventDefault();
  selectShip.classList.remove('is-valid');
  selectShip.classList.add('is-invalid');
} else {
  selectShip.classList.remove('is-invalid');
  selectShip.classList.add('is-valid');
}

if(validateMethodPayment(methodPaymentSelected)) {
  event.preventDefault();
  btnSelectPay.classList.remove('is-invalid', 'custom');
  btnSelectPay.classList.add('is-valid');
  selectMethodPayment.classList.add('is-valid');
  selectMethodPayment.classList.remove('is-invalid');
} else {
 btnSelectPay.classList.remove('is-valid');
  btnSelectPay.classList.add('is-invalid', 'custom');
  selectMethodPayment.classList.add('is-invalid');
  selectMethodPayment.classList.remove('is-valid');
}

if(methodPaymentSelected === 'card'){
  
  if(monthInput.value === '' || !validateCardExpiration(monthInput.value)) {
    monthInput.classList.add('is-invalid');
    monthInput.classList.remove('is-valid');
  } else {
    monthInput.classList.add('is-valid');
    monthInput.classList.remove('is-invalid');
  }

  if(cvv.value === '') {
  cvv.classList.add('is-invalid');
  cvv.classList.remove('is-valid');
  } else {
  cvv.classList.add('is-valid');
  cvv.classList.remove('is-invalid');
  }

  if(cardNumber.value === '') {
  cardNumber.classList.add('is-invalid');
  cardNumber.classList.remove('is-valid');
  } else {
  cardNumber.classList.add('is-valid');
  cardNumber.classList.remove('is-invalid');
  }

  if(cardSelected.value == 'disabled') {
  cardSelected.classList.add('is-invalid');
  cardSelected.classList.remove('is-valid');
  } else {
  cardSelected.classList.add('is-valid');
  cardSelected.classList.remove('is-invalid');
  }

} else if(methodPaymentSelected === 'bank'){
if(accountNumber.value === ''){
  accountNumber.classList.add('is-invalid');
  accountNumber.classList.remove('is-valid');
  } else {
  accountNumber.classList.add('is-valid');
  accountNumber.classList.remove('is-invalid');
}
}

if(streetAddress.value !== '' && numberAddress.value !== '' && cornerAddress.value !== '' && selectedOption !== "disabled"  && selectedQuantity <= 1 && validateMethodPayment(methodPaymentSelected)) {
  form.classList.add('was-validated');
  divAlert.innerHTML += `
  <div id="successAlert" class="alert alert-success" role="alert" style="z-index: 1;">
  ¡Has comprado con éxito!
  </div>
  `;
  event.preventDefault()
} else {
  divAlert.innerHTML +=`
   <div id="failAlert" class="alert alert-danger" role="alert" style="z-index: 1;">
   Verifica que los datos ingresados sean correctos
</div>
   `;  
   event.preventDefault()
   form.classList.remove('was-validated');
}
removeAlert()
  }, false)

  

})()