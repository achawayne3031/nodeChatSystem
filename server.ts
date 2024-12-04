import express from 'express';
import { createServer } from 'node:http';
const env = require('dotenv').config({ debug: process.env.DEBUG })
import { Server } from 'socket.io';
import { MessageBody } from './src/interface/MessageBody';
const socketController = require('./src/controller/socketController')

const app = express();
const server = createServer(app);
var io = new Server(server, { cors: { origin: '*'}, maxHttpBufferSize: 1e8});
const port = process.env.PORT || 3000;



io.on('connection', (socket) => {
    console.log('user connected', socket.id);

    setInterval(() => {
    //     let activeUser = socketController.getAllActiveUsers()
    //     console.log(activeUser, 'active users......')

    //   let allConnectedUsers = socketController.getAllConnectedUsers()
    //   console.log(allConnectedUsers, 'connected users')

    }, 5000)

    //// Handle connected users 
    socket.on('connected', (userId: string) => {
        socketController.connected(socket, userId);
        socketController.joinRoom(socket)
    });


    /// Handle send messages 
    socket.on("send-message", (data: any) => {
       /// console.log(data)
        socketController.sendMessage(io, data)
    });

     /// Handle vendor notifications 
     socket.on("vendor-notification", (data: any) => {
       // console.log(data)
        socketController.sendMessage(io, data)
    });


     // Handle disconnection
    socket.on('disconnect', () => {
        socketController.leaveRoom(socket)
        console.log('disconnect users.......', socket.id)
    });


    // Listen for ping event from the client, keep the client connected
    socket.on('ping', () => {
        // Respond with a pong
        socketController.keepConnectionAlive(socket)
    });


 });








// const app = require('express')();
// const http = require('http').createServer(app);
// const io = require('socket.io')(http, {
//     cors: {
//         origins: '*'
//     }
// });




app.get('/', (req, res) => {
    res.send('Hello World! Happy new day and July 13 2024')
})


server.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`);
 /// logger.log("info", "testing our logger", {test: "hello world"})
  
});


// Improved graceful shutdown
function gracefulShutdown() {
  server.close(() => {
      console.log('\nExpress server closed');
      // Ensure the queue stops before exiting the process
      process.exit(0)
  });
}

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);




