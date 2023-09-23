const resultado = document.getElementById("resultado");
const btnGetData = document.getElementById("btnGetData");
const API_KEY = '323c5e46c84145a4977163005232309';


btnGetData.addEventListener("click", () => {
  let ciudad = document.getElementById("ciudad").value;

  fetch(`https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${ciudad}&lang=es`)
    .then(response => response.json())
    .then(data => {
      showData(data);
    })
    .catch(error => {
      console.log(error);
    });

  function showData(data) {
    resultado.innerHTML = '';
    resultado.innerHTML += `
      <div class="text-center mt-5 border rounded p-1">
        <div>
          <h3>${data.location.name}</h3>
          <h6>${data.location.country}</h6> 
          <hr>
          <h4>Fecha y Hora</h4>
          <h5>${data.location.localtime}hs🕑</h5>
          <hr>
          <h4>Temp: ${data.current.temp_c} °C 🌡</h4>
          <hr>
          <img src="${data.current.condition.icon}">
          <h4>${data.current.condition.text}</h4>
          <hr>
          <h4>Humedad: ${data.current.humidity} % 💧</h4>
          <h5>Viento: ${data.current.wind_kph} km/h 🌫</h5>
        </div>
        
      </div>`;

    document.getElementById("ciudad").value = "";
    resultado.classList.add("show-shadow");
    changeBackgroundImage(data.current.condition.text);
  }
});

// Función para cambiar la imagen de fondo del body según el clima
function changeBackgroundImage(clima) {
  console.log(clima);

  // Se crea un objeto "climaImagenes" el cual será comparado con el "data.current.condition.text" de la API y así cambiar
  const climaImagenes = {
    "soleado": "url('img/soleado.jpeg')",
    "despejado": "url('img/noche.jpg')",    
    "parcialmente nublado": "url('img/solynubes.jpg')",
    
    "nublado": "url('img/nublado.jpg')",
    "cielos tormentosos en las aproximaciones": "url('img/tormenta.jpg')",
    
    "cielo cubierto": "url('img/nublado.jpg')",
    
    "lluvia  moderada a intervalos": "url('img/lluvia.jpg')",
    "ligeras lluvias": "url('img/lluvia.jpg')",
    
    "neblina": "url('img/neblina.jpg')",
  };
  // Los datos del clima de la API serán comvertidos a minúsculas para evitar problemas al comparar con nuestro Objeto "climaImagenes"
  const datos_clima_minuscula = clima.toLowerCase();
  console.log(datos_clima_minuscula);
  
  // Acá cambiamos la imágen del background comparando los datos del Clima de la API con la propiedad de nuestro objeto correspondiente a la nueva imágen deseada
  const newImage = climaImagenes[datos_clima_minuscula] || "url('img/default.jpg')";  // Si no se encuentra coincidencia entonces mostrará la imágen por defecto.
  document.body.style.backgroundImage = newImage;
}