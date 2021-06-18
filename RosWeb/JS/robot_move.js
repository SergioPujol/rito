const screenWidth= window.innerWidth
const screenHeight= document.getElementById("map").clientHeight;
const robotSize = 25
const mapLength= {x: 9.2, y: 9.2}

const robot= document.getElementById("robot")

var ipReady = false

document.addEventListener('DOMContentLoaded', event => {
    login().then((a)=>{console.log(a);getList()});

    jail = false;// define the service to be called

    let ip = getCookie("connection");

    if(ip != undefined) ipReady = true

    console.log(ip)

    if(ipReady){
        data = {
            // ros connection
            ros: null,
            rosbridge_address: 'ws://' + ip + "/",
            connected:  false,
            // action information
            goal: null,
            action : {
                goal: {position: {x: 0, y: 0} },
                feedback: { 
                position:  {x: 0, y: 0},
                    state: ''
                },
                result: {success: false},
                status: {status: 0, text: ''},
            }    
        }
        connect(ip)
    }
})

async function getList(){
    const listsService = feathersClient.service('lists')
    let userShoppingLists = await listsService.find();
    let listsList = document.querySelector('#list-list');
    listsList.innerHTML = '';
    userShoppingLists.data.forEach(async element => {
        let id = (element._id)
        let price = 0;
        
        
        /*await Promise.all(element.products.map(async (i) => {
            await fetch(`http://localhost:3030/products/${i.product}`)
            .then(response => response.json())
            .then(data => {price += data.price;}
            )
        }));*/

        let listaHTML = `
        <li class="form-check">
            <input class="form-check-input" type="checkbox" id="${id.toString()}">
            <label class="form-check-label" for="${id.toString()}">${element.title}</label>
        </li>
        `
        listsList.innerHTML += listaHTML;
        /*document.querySelector(`#dlt-${id}`).addEventListener('click', e =>{
            deleteList(e.target.id.slice(4))
        })*/
        
    });
}



async function startShopping(){
    const listsService = feathersClient.service('lists')
    
    let placesToGo = []
    let checkboxes = document.querySelectorAll('input[type="checkbox"]:checked')
    let stringPlacesToGo=''
    /*
    await checkboxes.forEach(async checkbox =>{
        //console.log(checkbox.id)
        let selectedLists = await listsService.get(checkbox.id.toString(),{});
        
        await Promise.all(selectedLists.products.map(async (i) => {
            await fetch(`http://localhost:3030/products/${i.product}`)
            .then(response => response.json())
            .then(data => {
                
                if(data.category){
                    if(!placesToGo.includes(data.category))
                        placesToGo.push(data.category)
                        stringPlacesToGo += data.category+",";
                }
            })
        }));
    })
    */
    for(var i = 0; i < checkboxes.length; i++){
        //console.log(checkbox.id)
        let selectedLists = await listsService.get(checkboxes[i].id.toString(),{});
        await Promise.all(selectedLists.products.map(async (i) => {
            await fetch(`http://${SERVER_IP}:${SERVER_PORT}/products/${i.product}`)
            .then(response => response.json())
            .then(data => {
                if(data.category){
                    if(!placesToGo.includes(data.category))
                        placesToGo.push(data.category)
                        if(!stringPlacesToGo.includes(data.category)){

                            stringPlacesToGo += data.category+",";
                        }
                }
            })
        }));
    }
    
    
    let isConnected = false;
    if(!isConnected){
        connect(getIPfromInput())
    }
    
    
    console.log(stringPlacesToGo.slice(0,-1)) //carniceria | pescaderia | carniceria, pescaderia
    sendGoal(stringPlacesToGo.slice(0,-1)) 
    
}

function setCamera(){
	console.log("setting the camera")
	let viewer1 = new MJPEGCANVAS.Viewer({
	    divID: "divCamera", //elemento del html donde mostraremos la cámara
	    host: "127.0.0.1:8080", //dirección del servidor de vídeo
	    width: 320, //no pongas un tamaño mucho mayor porque puede dar error
	    height: 240,
	    topic: "/turtlebot3/camera/image_raw",
	    ssl: false,
	})
}

function getIPfromInput(){
    return document.getElementById('input_ip').value;
}

/**
 * Connect to ROS
 * @param {*} ip 
 */
function connect(ip) {
    console.log("L - " + ip)
    if (typeof ip === undefined || ip == "")
     data.rosbridge_address = 'ws://127.0.0.1:9090/'
    else data.rosbridge_address = 'ws://' + ip + ":9090/"

    data.ros = new ROSLIB.Ros({
        url: data.rosbridge_address
    })

    let topic = new ROSLIB.Topic({
        ros: data.ros,
        name: '/odom',
        messageType: 'nav_msgs/Odometry'
    })

    let topic2 = new ROSLIB.Topic({
        ros: data.ros,
        name: '/weight',
        messageType: 'sensor_msgs/Range'
    })

    // Define callbacks
    data.ros.on("connection", () => {
        data.connected = true
        console.log("Conexion con ROSBridge correcta")
        setCamera()
        topic.subscribe((message) => {
            data.position = message.pose.pose.position
            topicCoords(data.position.x - 7, data.position.y + 2)
        })
        topic2.subscribe((message) => {
            let res = message/375;
            document.getElementById('label_peso').value = res
        })
    })
    data.ros.on("error", (error) => {
        console.log("Se ha producido algun error mientras se intentaba realizar la conexion")
        console.log(error)
    })
    data.ros.on("close", () => {
        data.connected = false
        console.log("Conexion con ROSBridge cerrada")
        document.getElementById("divCamera").innerHTML = ""
    })
}

//Aquí irá la lectura del topic
function topicCoords(x,y) {
    let rCoords = changeCoords({ x: x, y: y})

    robot.style.top= rCoords.y + "px"
    robot.style.left= rCoords.x + "px"
}

function changeCoords(coordGazebo) {
        let nx = (screenWidth / 2) - robotSize + (screenWidth - robotSize) * (coordGazebo.y / mapLength.y);
        let ny = screenHeight - (screenHeight) * (-coordGazebo.x / mapLength.x) - (robotSize * 2);

        return { x: nx, y: ny }
}

function sendGoal(task){
    let service = new ROSLIB.Service({
        ros : data.ros,
        name : '/activate_state',
        serviceType : 'rossrv/Type',
    })
    // define the request
    let request = new ROSLIB.ServiceRequest({
        tasks : task,
    }) // define a callback
    service.callService(request, (result) => {
        console.log('This is the response of the service ')
        console.log(result)
    
    }, (error) => {
        console.error(error)
    })
}

function disconnect() {
    data.ros.close()
    data.connected = false
    console.log('Clic en botón de desconexión')
}