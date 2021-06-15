   
fetch(`http://${SERVER_IP}:${SERVER_PORT}/products`)
.then(response => response.json())
.then(data => data.data.forEach(element => {
        addProduct(element)
    })
);

function showPopup(){
      $("#popup").modal();
}

function pairDevice(){
  // Complete code
}


/*
var socket = io('http://localhost:3030', {transports: ['websocket']});
// feathers-client is exposed as the `feathers` global.
var feathersClient = feathers().configure(feathers.hooks()).configure(feathers.socketio(socket)).configure(feathers.authentication({storage: window.localStorage}))



//const socket = io();
//const client = feathers();

// Create the Feathers application with a `socketio` connection
//feathersClient.configure(feathers.socketio(socket));

// Get the service for our `messages` endpoint
const compra = feathersClient.service('compra');

//compra.find().then(page => page.data.forEach(addMessage));
compra.on('created', (d)=>{
    console.log(d)
});

function addItem(){
    console.log("creado")
}

document.querySelector("button").addEventListener("click", ()=>{
    console.log("AA")
    feathersClient.service('compra').create({
        text: "holat",
        name: "hola"
    }).then(() => {
        
    });
    login().then((data)=>{
        console.log(data)
    })
})
*/
   

const addProduct = product =>{
    let productHTML = `
    <li class="align-items-center product-list" data-toggle="${product.name}">
    <div class="row">
      <div class="col-4">
        <img src="${product.img_url}" alt="${product.name}">
      </div>
      <article class="col-8">
        <h3>${product.name}</h3>
        <div class="d-flex product-price">
          <h5>${product.weight}g</h5>
          <h3>${product.price}€</h3>
        </div>
        <button type="button" href="#" class="btn btn-outline-success">AÑADIR A LA LISTA DE LA COMPRA</button>
      </article>
    </div>
    <hr>
    </li>
    ` 
    let listaProductos = document.querySelector("#product-list");
    listaProductos.innerHTML += productHTML;
}