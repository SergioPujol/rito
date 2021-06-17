let ip = getCookie("connection");
if(ip != "" && ip != "null") 
  $("#status").attr("src", "Imagenes/green.png");

function pairDevice(){
  // Complete code
  //IP completa robot -> 172.18.224.94
  let ipA = parseInt("172").toString(16); // AC
  let ipB = parseInt("18").toString(16); // 12
  let val = $('#pin').val();
  if(val.length < 4) alert("Pon un pin valido!");
  val = ipA + "." + ipB + "." + val[0] + val[1] + "." + val[2] + val[3]; // ac.12 [e0.5e] - 
  var splitData = val.split(".");
  for (var i = 0; i < splitData.length; i++){
      splitData[i] = parseInt(splitData[i], 16);
  }
  var ip = splitData.join("."); // 172.18.224.94
  console.log(ip);
  connect(ip);
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