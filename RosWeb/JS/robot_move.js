const screenWidth= window.innerWidth
const screenHeight= window.innerHeight

const robotY = screenHeight
const robotX = (screenWidth / 2) - 35

const mapLength= {x: 9.2, y: 9.2}

const robot= document.getElementById("robot")

document.addEventListener('DOMContentLoaded', event => {

    jail = false;// define the service to be called

    data = {
        // ros connection
        ros: null,
        rosbridge_address: 'ws://127.0.0.1:9090/',
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
    //connect()
})

function connect(ip) {

    if (typeof ip === undefined || ip == "")
     data.rosbridge_address = 'ws://127.0.0.1:9090/'
    else data.rosbridge_address = 'ws://' + ip + "/"

    data.ros = new ROSLIB.Ros({
        url: data.rosbridge_address
    })

    let topic = new ROSLIB.Topic({
        ros: data.ros,
        name: '/odom',
        messageType: 'nav_msgs/Odometry'
    })

    // Define callbacks
    data.ros.on("connection", () => {
        data.connected = true
        console.log("Conexion con ROSBridge correcta")
        topic.subscribe((message) => {
            data.position = message.pose.pose.position
            // PARA NATXO Y FUTURO EQUIPO, EN EL MUNDO REAL VARIAR=?
            topicCoords(data.position.x - 7, data.position.y + 2)
        })
    })
    data.ros.on("error", (error) => {
        console.log("Se ha producido algun error mientras se intentaba realizar la conexion")
        console.log(error)
    })
    data.ros.on("close", () => {
        data.connected = false
        console.log("Conexion con ROSBridge cerrada")
    })
}

var xOffset = 500;
var yOffset = 150;

//Aquí irá la lectura del topic
function topicCoords(x,y) {
    //let rCoords = changeCoords({ x: x, y: y})
    
    console.log("TOP - " + robot.style.top)
    
    robot.style.top= (xOffset + x) + "px"
    robot.style.left= (yOffset + y) + "px"

   // setRobotX(rCoords.x)
   // setRobotY(rCoords.y)
}

function changeCoords(coordGazebo) {
        console.log(coordGazebo)
        let nx = (screenWidth / 2) - 35 + (screenWidth - 35) * (coordGazebo.y / mapLength.y);
        let ny = screenHeight - screenHeight * (coordGazebo.x / mapLength.x * (-1));

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
