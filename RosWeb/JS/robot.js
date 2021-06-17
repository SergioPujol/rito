function connect(ip) {
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
    if (typeof ip === undefined || ip == "")
     data.rosbridge_address = 'ws://127.0.0.1:9090/'
    else data.rosbridge_address = 'ws://' + ip + ":9090/"
    $("#status").attr("src", "Imagenes/loading.gif");

console.log(data.rosbridge_address)

    data.ros = new ROSLIB.Ros({
        url: data.rosbridge_address
    })

    let topic = new ROSLIB.Topic({
        ros: data.ros,
        name: '/odom',
        messageType: 'nav_msgs/Odometry'
    })

    console.log("Connecting to: " + ip)

    // Define callbacks
    data.ros.on("connection", () => {
        data.connected = true
        console.log("Conexion con ROSBridge correcta")
        $("#status").attr("src", "Imagenes/green.png");
        document.cookie = "connection=" + ip        
    })
    data.ros.on("error", (error) => {
        console.log("Se ha producido algun error mientras se intentaba realizar la conexion")
        $("#status").attr("src", "Imagenes/yellow.png");
        document.cookie = "connection=null"       
        console.log(error)
    })
    data.ros.on("close", () => {
        data.connected = false
        console.log("Conexion con ROSBridge cerrada")
        $("#status").attr("src", "Imagenes/red.png");
        document.cookie = "connection=null"   
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
