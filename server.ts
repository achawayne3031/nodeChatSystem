
import { MessageBody } from './src/interface/MessageBody';
import { VendorOrderNotification } from './src/interface/VendorOrderNotification';
const socketController = require('./src/controller/socketController')
import { io, app, server, port } from './src/socket/Socket'




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
        socketController.connected(socket, userId, io);
        socketController.joinRoom(socket)

         io.emit("connection-success", socket.id);
        // io.to(socket.id).emit("connection-success", socket.id);
        // console.log(socket.id, 'current ID')

        socketController.getAllConnectedUsers()

    });


    /// Handle send messages 
    socket.on("send-message", (data: MessageBody) => {
        console.log(data)
        socketController.sendMessage(data)
    });

     /// Handle vendor notifications 
     socket.on("vendor-order-notification", (data: VendorOrderNotification) => {
        socketController.notifyVendor(data)
    });


     // Handle disconnection
    socket.on('disconnect', async () => {
       await socketController.leaveRoom(socket)
        let currentUser = await socketController.getAllConnectedUsers()

    });


    // Listen for ping event from the client, keep the client connected
    socket.on('ping', () => {
        // Respond with a pong
        console.log('we gat pingged.....')
        socketController.keepConnectionAlive()
    });

    socket.on('connected-user-list', () => {
        // Respond with a pong

        socketController.getAllConnectedUsers()
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




