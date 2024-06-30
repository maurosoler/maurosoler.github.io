const container = document.getElementById("container");
const commentsSection = document.getElementById("commentsSection");
const userCommentSection = document.getElementById("userCommentsSection");
const productID = localStorage.productID;
const sortByDateBtn = document.getElementById("sortByDate");
const sortByStarsBtn = document.getElementById("sortByStars");
const addToCartBtn = document.getElementById('addToCart');
const alertCart = document.getElementById('alertCart');
let cartProducts = JSON.parse(localStorage.getItem('cartProducts')) || [];
//import {userEmail, sidebar} from "helpers.js";

userEmailFunction();
themeFunction();

function showProduct(array) {
    const divProduct = document.createElement('div');
    const product = `
    <div class="text-center">
    <h2 class="display2 my-4">${array.name}</h2>
  </div> 
  <div class="row">
    <div class="col-md-6 col-sm-12 mb-sm-3 mb-3">
      <ul class="list-group list-group-flush border rounded">
        <li class="list-group-item list-color"><b>Precio</b><br>${array.currency} $${array.cost}</li>
        <li class="list-group-item list-color"><b>Descripción</b><br>${array.description}</li>
        <li class="list-group-item list-color"><b>Categoría</b><br>${array.category}</li>
        <li class="list-group-item list-color"><b>Cantidad de vendidos</b><br>${array.soldCount}</li>
        </li>
      </ul>
    </div>
    <div class="col-md-6 col-sm-12 mb-sm-2">
      <div id="carouselExampleDark" class="carousel carousel-dark slide" data-bs-ride="carousel">
      <div class="carousel-indicators">
      <button type="button" data-bs-target="#carouselExampleDark" data-bs-slide-to="0" class="active" aria-current="true" aria-label="Slide 1"></button>
      <button type="button" data-bs-target="#carouselExampleDark" data-bs-slide-to="1" aria-label="Slide 2"></button>
      <button type="button" data-bs-target="#carouselExampleDark" data-bs-slide-to="2" aria-label="Slide 3"></button>
      <button type="button" data-bs-target="#carouselExampleDark" data-bs-slide-to="3" aria-label="Slide 4"></button>
    </div>
        <div class="carousel-inner">
          <div class="carousel-item active">
            <img src="${array.images[0]}" class="d-block w-100">
          </div>
          <div class="carousel-item">
            <img src="${array.images[1]}" class="d-block w-100">
          </div>
          <div class="carousel-item">
            <img src="${array.images[2]}" class="d-block w-100">
          </div>
          <div class="carousel-item">
            <img src="${array.images[3]}" class="d-block w-100">
          </div>
           <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleDark" data-bs-slide="prev">
    <span class="carousel-control-prev-icon" aria-hidden="true"></span>
    <span class="visually-hidden">Previous</span>
  </button>
  <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleDark" data-bs-slide="next">
    <span class="carousel-control-next-icon" aria-hidden="true"></span>
    <span class="visually-hidden">Next</span>
  </button>
</div>
      </div>
    </div>
        `;

    divProduct.innerHTML = product;
  //  container.appendChild(divProduct);
    container.insertBefore(divProduct, container.firstChild)
}


async function fetchDataAndShow() {
    const productID = localStorage.productID;
    urlProduct = `https://japceibal.github.io/emercado-api/products/${productID}.json`
try {
   const response = await fetch(urlProduct);
   const data = await response.json();
   showProduct(data);
}
catch(error) {
  throw new Error(`HTTP error! Status: ${error}`);
}   
}

fetchDataAndShow()

// Star rating based in UserScore
const starRating = (userScore) =>{
  switch (Math.round(userScore)) {
    case 0:
      return `
      <span class="fa fa-star"></span>
      <span class="fa fa-star"></span>
      <span class="fa fa-star"></span>
      <span class="fa fa-star"></span>
      <span class="fa fa-star"></span>
            `
      break;
    case 1:
      return `
      <span class="fa fa-star checked"></span>
      <span class="fa fa-star"></span>
      <span class="fa fa-star"></span>
      <span class="fa fa-star"></span>
      <span class="fa fa-star"></span>
            `
      break;
    case 2:
      return `
      <span class="fa fa-star checked"></span>
      <span class="fa fa-star checked"></span>
      <span class="fa fa-star"></span>
      <span class="fa fa-star"></span>
      <span class="fa fa-star"></span>
            `
      break;  
    case 3:
      return `
      <span class="fa fa-star checked"></span>
      <span class="fa fa-star checked"></span>
      <span class="fa fa-star checked"></span>
      <span class="fa fa-star"></span>
      <span class="fa fa-star"></span>`
    break;
    case 4:
      return `
      <span class="fa fa-star checked"></span>
      <span class="fa fa-star checked"></span>
      <span class="fa fa-star checked"></span>
      <span class="fa fa-star checked"></span>
      <span class="fa fa-star"></span>
            `
    break;
    case 5:
      return `
      <span class="fa fa-star checked"></span>
      <span class="fa fa-star checked"></span>
      <span class="fa fa-star checked"></span>
      <span class="fa fa-star checked"></span>
      <span class="fa fa-star checked"></span>
            `
    break;
    default:
      return userScore
      break;

  }
}

function showComments(array){
  array.forEach((comment)=>{
        commentsSection.appendChild(createCommentComponent(comment.user,starRating(comment.score), comment.description,comment.dateTime))
      })
}

function sortDateASC(array) {
   array.sort(function(a, b) { 
        return new Date(a.dateTime) - new Date(b.dateTime); 
      });
}

function sortDateDES(array) {
  array.sort(function(a, b) { 
        return new Date(b.dateTime) - new Date(a.dateTime); 
      });
}

function sortStarsASC(array) {
  array.sort(function(a, b) { 
    return (a.score) - (b.score); 
  });
}

function sortByStarsDES(array){
  array.sort(function(a, b) { 
    return (b.score) - (a.score); 
  });
} 

// create html comment elemment
const createCommentComponent = (user, score, desc, date)=>{
 const commentElement = document.createElement("div")

  commentElement.innerHTML = `        
<div  class="commentContainer">
<p  class="commentUser">${user}</p>
<p  class="commentScore">${score}</p>
<p  class="commentDesc ">${desc}</p>
<p  class="commentDate">${date}</p>
</div>
`
return commentElement
}

let clickSortDate = false;
let clickSortStars = true;
let commentsUpdated = [];
const sortIconDate = document.getElementById('sortIconDate');
const sortIconStars = document.getElementById('sortIconStars');

// Fetch comments
const getAndRenderComments = async () => {
  const productID = localStorage.productID;
  try {
    const request = await fetch(`${PRODUCT_INFO_COMMENTS_URL}${productID}.json`);
    response = await request.json();
    console.log(response);
    sortDateASC(response);
    commentsUpdated = commentsUpdated.concat(response);
    renderCommentsLocalStorage();
    showComments(commentsUpdated);
    console.log(commentsSection)
  } catch (error) {
    console.log(error);
  }
}

sortByDateBtn.addEventListener("click", ()=> {
  if(!clickSortDate) {
  commentsSection.innerHTML = '';
    sortDateDES(commentsUpdated);
    showComments(commentsUpdated);
    clickSortDate = true;
   sortIconDate.src = "icons/sort-up-date.png"
  } else {
  commentsSection.innerHTML = '';
    sortDateASC(commentsUpdated);
    showComments(commentsUpdated);
    clickSortDate = false;
    sortIconDate.src = "icons/sort-down-date.png"
  }
  })

sortByStarsBtn.addEventListener("click", ()=> {
  if(clickSortStars) {
    commentsSection.innerHTML = '';
    sortStarsASC(commentsUpdated);
    showComments(commentsUpdated);
    clickSortStars = false;
    sortIconStars.src = "icons/sort-up-stars.png"
  } else {
    commentsSection.innerHTML = '';
    sortByStarsDES(commentsUpdated);
    showComments(commentsUpdated);
    clickSortStars = true;
    sortIconStars.src = "icons/sort-down-stars.png"
  }
})

// new comments
const commentForm = document.getElementById('commentForm');
commentForm.addEventListener('submit', function (e){
    e.preventDefault();
    const nameUserComment = document.getElementById('nameCommentUser');
    const description = document.getElementById('description');
    const starSelector = document.getElementById('starSelector');
    const scoreUser = starRating(starSelector.selectedIndex + 1);
    const date = new Date().toLocaleString('sv-SE');
    const newComment = createCommentComponent(nameUserComment.value, scoreUser, description.value, date);
    
    commentsSection.appendChild(newComment);
    const newCommentObject = {
        user: nameUserComment.value,
        description: description.value,
        score: starSelector.value,
        dateTime: date,
    };
    let userComments = JSON.parse(localStorage.getItem(`${productID}`)) || [];
    console.log(response)
    userComments.push(newCommentObject);
    localStorage.setItem(`${productID}`, JSON.stringify(userComments));
    //nameUserComment.value = '';
    description.value = '';
    starSelector.selectedIndex = 0;
});

document.addEventListener('DOMContentLoaded', function () {
  getAndRenderComments();
  // Agregado al cargar la página que cargue el dato guardado del EMAIL del LocalStorage 
  //                                                 para el input NAME de los comments.
  const nameInput = document.getElementById("nameCommentUser");
  const getLocalName = localStorage.getItem("email");
  
  if (getLocalName) {
    nameInput.value = getLocalName;
    nameInput.classList.add('text-center')
    nameInput.disabled = true;
  }

});

const renderCommentsLocalStorage = ()=>{
  const userComments = JSON.parse(localStorage.getItem(`${productID}`)) || [];
  if (userComments.length > 0) {
      userComments.forEach(comment => {
          commentsUpdated.push(comment);
      });
  }
}
                                                          
const related_Products = document.getElementById('relatedProducts');
const catID = localStorage.getItem('catID');
const url = `https://japceibal.github.io/emercado-api/cats_products/${catID}.json`;
const arrayRelated = [];

async function fetchData(url) {
  try {
    const response = await fetch(url);
    const data = await response.json();
    arrayRelated.push(...data.products);
    console.log(arrayRelated);
    renderRelatedProducts();
  } catch (error) {
    console.error(error);
  }
}
fetchData(url)

// RENDERIZAR los productos relacionados *************
function renderRelatedProducts() {
  let html = '';
  const filteredArray = arrayRelated.filter(product => product.id != productID);
  filteredArray.forEach(product => {
    html += `
      <div class="divProductRelated list-group-item">
        <h5 class="text-center fw-bold">${product.name}</h5>
        <img src="${product.image}" class="img-thumbnail mt-2" alt="${product.name}">
        <h4 class="text-center text-muted mt-2">${product.currency} $${product.cost}</h4>
      </div>
    `;
  });

  
  related_Products.innerHTML = html;
  // AGREGADO UN addEventListener al hacerle click a las imágenes de nuestros RelatedProducts.
  const images = related_Products.querySelectorAll('img');
  images.forEach((image, index) => {
    image.addEventListener('click', () => {
      redirectToProductInfo(filteredArray[index].id);
    });
  });
  // Redireccionar a products-info
  function redirectToProductInfo(productId) {
    try {
      localStorage.setItem('productID', productId);
      window.location.assign('product-info.html');
    } catch (error) {
      console.error('Error al redireccionar a la página de información del producto:', error);
    }
  }
}

//funcionalidad agregar al carrito
addToCartBtn.addEventListener("click", function(e) {
 e.target.closest("#addToCart");
    if (!cartProducts.includes(productID)) {
      cartProducts.push(productID);

      localStorage.setItem('cartProducts', JSON.stringify(cartProducts));
      const alertProductAdded = `<div class="alert alert-success text-center" role="alert" style="z-index: 1;">
      Producto agregado al carrito!
   </div>`;
   alertCart.innerHTML += alertProductAdded;
    } else {
      const alertAddProductFail = `<div class="alert alert-danger text-center" role="alert" style="z-index: 1;">
      Este item ya esta en su carrito de compras
   </div>
      `; 
      alertCart.innerHTML += alertAddProductFail;
    }
       setTimeout(() => {
        alertCart.innerHTML = '';
    }, 4000);
  }
);

