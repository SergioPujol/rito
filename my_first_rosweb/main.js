document.addEventListener('DOMContentLoaded', event => {

    document.getElementById("btn_con").addEventListener("click", connect)
    document.getElementById("btn_dis").addEventListener("click", disconnect)
    document.getElementById("btn_move").addEventListener("click", move)
    document.getElementById("btn_stop").addEventListener("click", stop)
    document.getElementById("btn_backwards").addEventListener("click", backwards)
    document.getElementById("btn_start_nav").addEventListener("click", send_goal)
    document.getElementById("btn_stop_nav").addEventListener("click", cancel_goal)

    jail = false;

    data = {
        // ros connection
        ros: null,
        rosbridge_address: 'ws://127.0.0.1:9090/',
        connected: false,
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

    function connect() {
        console.log("Clic en connect")

        let ip = document.getElementById("ip_connect").value
        if (typeof ip === undefined || ip == "")
            data.rosbridge_address = 'ws://127.0.0.1:9090/'
        else
            data.rosbridge_address = 'ws://' + ip + "/"
        console.log("La ip es " + data.rosbridge_address)

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
            document.getElementById("status").innerHTML = "Conectado"
            topic.subscribe((message) => {
                data.position = message.pose.pose.position
                data.position.x = data.position.x - 7
                data.position.y = data.position.y + 2
                document.getElementById("pos_x").innerHTML = data.position.x.toFixed(2)
                document.getElementById("pos_y").innerHTML = data.position.y.toFixed(2)
                /*
                if (jail) {
                    if (data.position.x > 2 || data.position.y > 2)
                        backwards()
                    if (data.position.x < 2 || data.position.y < 2)
                        move()
                        
                }*/
            })
        })
        data.ros.on("error", (error) => {
            console.log("Se ha producido algun error mientras se intentaba realizar la conexion")
            console.log(error)
            document.getElementById("status").innerHTML = "Error"
        })
        data.ros.on("close", () => {
            data.connected = false
            console.log("Conexion con ROSBridge cerrada")
            document.getElementById("status").innerHTML = "Desconectado"
        })
    }

    function send_goal() {
        //leemos los valores de la interfaz (suponemos que están en los siguientes campos)
        data.action.goal.position.x = parseFloat(document.getElementById("x_goto").value)
        data.action.goal.position.y = parseFloat(document.getElementById("y_goto").value)

        //definimos un ActionClient para el /move_base
        let action_client = new ROSLIB.ActionClient({
            ros: data.ros,
            serverName: "/move_base",
            actionName: "move_base_msgs/MoveBaseAction"
        })

        //definimos el mensaje Goal que enviaremos al servidor
        data.goal = new ROSLIB.Goal({
            actionClient: action_client,
            goalMessage: {
                target_pose: {
                    header: {
                        frame_id: 'map'
                    },
                    pose: {
                        position: data.action.goal.position,
                        orientation: { x: 0, y: 0, z: 1, w: 0 }
                    }
                },
            }
        })

        //definimos los callacks
        data.goal.on('status', (status) => {
            data.action.status = status
        })

        data.goal.on('feedback', (feedback) => {
            data.action.feedback = feedback.base_position.pose
        })

        data.goal.on('result', (result) => {
            data.action.result = result
        })

        //enviamos el mensaje
        data.goal.send()
    }

    function cancel_goal() {
        data.goal.cancel()
    }

    function move() {
        let topic = new ROSLIB.Topic({
            ros: data.ros,
            name: '/cmd_vel',
            messageType: 'geometry_msgs/Twist'
        })
        let message = new ROSLIB.Message({
            linear: { x: 1, y: 0, z: 0, },
            angular: { x: 0, y: 0, z: 0.5, },
        })
        topic.publish(message)
    }

    function stop() {
        let topic = new ROSLIB.Topic({
            ros: data.ros,
            name: '/cmd_vel',
            messageType: 'geometry_msgs/Twist'
        })
        let message = new ROSLIB.Message({
            linear: { x: 0, y: 0, z: 0, },
            angular: { x: 0, y: 0, z: 0, },
        })
        topic.publish(message)
    }

    function backwards() {
        let topic = new ROSLIB.Topic({
            ros: data.ros,
            name: '/cmd_vel',
            messageType: 'geometry_msgs/Twist'
        })
        let message = new ROSLIB.Message({
            linear: { x: -1, y: 0, z: 0, },
            angular: { x: 0, y: 0, z: -0.5, },
        })
        topic.publish(message)
    }

    function jailmode() {
        jail = !jail

    }

    function disconnect() {
        data.ros.close()
        data.connected = false
        console.log('Clic en botón de desconexión')
        document.getElementById("status").innerHTML = "Desconectado"
    }

});

