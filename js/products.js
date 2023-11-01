const contenedor = document.getElementById('elContenedor');
const idCat = localStorage.catID;
const tituloCat = document.getElementById('tituloCategoria');
const inputSearch = document.getElementById('inputSearch');
const formSearch = document.getElementById('formSearch');


themeFunction()
userEmailFunction()

//Redireccionar a products-info
function redirectToProductInfo(productId) {
    localStorage.setItem('productID', productId);
    window.location.assign('product-info.html');
}

//Funcion que le da estructura a cada div del producto
function mostrarProducto(dataArray) {
    contenedor.innerHTML = '';
    if (dataArray.length === 0) {
      const sinResultados = document.createElement('div');
      sinResultados.innerHTML += '<p id="notFound"> No se encontraron resultados. </p>';
      contenedor.appendChild(sinResultados);
    } else {
    for (const item of dataArray) {
        const divDeProducto = document.createElement('div');
        divDeProducto.classList.add('divProducto', 'row','border', 'list-group-item','rounded', 'd-flex', 'justify-content-between', 'mt-3');
        const productHTML = `
            <div class="col-lg-3 col-sm-12 col-md-6">
                <img src="${item.image}" class="img-thumbnail">
            </div>
            <div class="col-lg-6">
                <h3 class="pt-2">${item.name} - ${item.currency} ${item.cost}</h3>
                <p>${item.description}</p>
            </div>
            <div class="col-lg-3 col-md-12 text-muted text-end">
                <small>${item.soldCount} vendidos</small>
            </div>
        `;
        divDeProducto.innerHTML = productHTML;

        contenedor.appendChild(divDeProducto);

        divDeProducto.addEventListener('click', function () {
            redirectToProductInfo(item.id);
        });
    }
  }
}

let productsArray = [];

// Fetch de los productos
async function fetchDataAndShow() {
    const idCat = localStorage.catID;
    const modifiedURL = `https://japceibal.github.io/emercado-api/cats_products/${idCat}.json`;

    const response = await fetch(modifiedURL);
    if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    productsArray = data.products;
    
    //Mostrar el array inicial y el titulo de cada categoria
    mostrarProducto(productsArray);
    tituloCat.textContent = data.catName;

}

fetchDataAndShow(productsArray);


// Funcion btn Filtrar
const btnFilter = document.getElementById("rangeFilterCount"); 
btnFilter.addEventListener("click", function() {
  filterPrice(priceMin, priceMax);
});

// Funcion para filtrar precio
let priceMin = "";
let priceMax = "";
const minimo = document.getElementById("rangeFilterCountMin"); 
const maximo = document.getElementById("rangeFilterCountMax"); 

let productsFiltered = [];

function filterPrice(priceMin, priceMax) {
    const minValue = parseFloat(minimo.value);
    const maxValue = parseFloat(maximo.value);

    if (!isNaN(minValue) && !isNaN(maxValue)) {
        productsFiltered = productsArray.filter(element => element.cost >= minValue && element.cost <= maxValue);
    } else if (!isNaN(minValue)) {
        productsFiltered = productsArray.filter(element => element.cost >= minValue);
    } else if (!isNaN(maxValue)) {
        productsFiltered = productsArray.filter(element => element.cost <= maxValue);
    } else {
        productsFiltered = productsArray;
    }

    contenedor.innerHTML = '';
    mostrarProducto(productsFiltered);
}

// Funcion btn limpiar
const btnClean = document.getElementById("clearRangeFilter"); 
btnClean.addEventListener("click", clean);

function clean() {
    priceMin = "";
    priceMax = "";
    minimo.value = "";
    maximo.value = "";
    contenedor.innerHTML = '';
    productsFiltered = [];
    fetchDataAndShow(productsArray);
}

//Botones de orden
function sortByMaxPrice(products) {
    return products.slice().sort((a, b) => b.cost - a.cost);
}

function sortByMinPrice(products) {
    return products.slice().sort((a, b) => a.cost - b.cost);
}

function sortBySoldCount(products) {
    return products.slice().sort((a, b) => b.soldCount - a.soldCount);
}

const btnSortMaxPrice = document.getElementById("sortDesc"); 
const btnSortMinPrice = document.getElementById("sortAsc"); 
const btnSortSoldCount = document.getElementById("sortByCount"); 

btnSortMaxPrice.addEventListener("click", function () {
    const sortedProducts = sortByMaxPrice(productsFiltered.length > 0 ? productsFiltered : productsArray);
    mostrarProducto(sortedProducts);
});

btnSortMinPrice.addEventListener("click", function () {
    const sortedProducts = sortByMinPrice(productsFiltered.length > 0 ? productsFiltered : productsArray);
    mostrarProducto(sortedProducts);
});

btnSortSoldCount.addEventListener("click", function () {
    const sortedProducts = sortBySoldCount(productsFiltered.length > 0 ? productsFiltered : productsArray);
    mostrarProducto(sortedProducts);
});
 

// DEBAJO IMPLEMENTACION DE CÓDIGO PARA EL MOTOR DE BÚSQUEDA
function filtrarProductos(busqueda, dataArray) {
  const resultados = dataArray.filter(item => {
    const titulo = item.name.toLowerCase();
    const descripcion = item.description.toLowerCase();
    return titulo.includes(busqueda) || descripcion.includes(busqueda);
  });
  mostrarProducto(resultados);
}

formSearch.addEventListener('input', function (event) {
    const busqueda = inputSearch.value.toLowerCase();
    if(productsFiltered.length === 0){
        filtrarProductos(busqueda,productsArray)
    }else{
        filtrarProductos(busqueda,productsFiltered)
    }
    event.preventDefault(); 
  });
