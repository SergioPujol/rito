var socket = io(`http://${SERVER_IP}:${SERVER_PORT}`, {transports: ['websocket']});
var feathersClient = feathers().configure(feathers.hooks()).configure(feathers.socketio(socket)).configure(feathers.authentication({storage: window.localStorage}))

const login = async () => {
    try{
        let x = await feathersClient.reAuthenticate();
        return x
        
    }catch(error){
        return await feathersClient.authenticate({
            strategy:'local',
            email:'nnatxo@gmail.com',
            password:'lmao'
        })
    }
}

