const mongoose = require('mongoose');
const dotenv = require('dotenv');

//plug in websockets
const WebSocket = require( "ws");

process.on('uncaughtException', err =>{
    console.log('Uncaught Exception! Shutting Down...');
    console.log(err.name, err.message);
    process.exit(1);
})


const app = require('./app');
dotenv.config({path: './config.env'});

mongoose.connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
}).then(()=>console.log('DB connection successful. Mode: ' + process.env.NODE_ENV + '.'));

const port = process.env.PORT || 3000;
const server = app.listen(port, ()=>{
    console.log(`Server is running on port ${port}...`)
});



const webSocketServer = new WebSocket.Server({ server });
const users = [];
webSocketServer.on('connection', ws => {
    users.push(ws);
    ws.on('message', message => {
        webSocketServer.clients.forEach(client => client.send(JSON.stringify(message)));
    });
    // const receivers = users.filter(user => user !== ws);
    //
    // receivers.forEach(receiver => receiver.send(message));

    ws.on("error", e => ws.send(e));
    // ws.send('Hi there, I am a WebSocket server');
});



process.on('unhandledRejection', err => {
    console.log('Unhandled Rejection! Shutting Down...');
    console.log(err.name, err.message);
    server.close(()=>{
        process.exit(1);
    });
});




