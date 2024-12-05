import { Server, Socket } from "socket.io";
import { MessageBody } from "../interface/MessageBody";
import { io } from './../socket/Socket'
import { VendorOrderNotification } from "../interface/VendorOrderNotification";


var connectedUsers = [];
var activeUsersList = []
var userSocketIds = []


const socketController = {

    connected: async (socketInstance: Socket, data: string, io: any) => {

        let connectedAlready = !!connectedUsers.find((value) => value.socketId === socketInstance.id)

        if(!connectedAlready){
            connectedUsers.push({
                userCode: data,
                socketId: socketInstance.id
            })

            activeUsersList.push(data)
            userSocketIds.push(socketInstance.id)
            console.log(`connection opened for user ${data}`)
          ///  console.log(connectedUsers)
        }

    },

    disconnectUser: async (socketInstance: Socket, data: string) => {

     

    },

    sendMessage: async(messageBody: MessageBody) => {
        io.emit("emit-sent-message", messageBody);
        let connectedAlready = !!connectedUsers.find((value) => value.userCode === messageBody.to)

        if(connectedAlready){
            let userChatData = connectedUsers.find((value) => value.userCode === messageBody.to)
            io.to(userChatData.socketId).emit("emit-sent-message", messageBody);
            io.to(userChatData.socketId).emit('emit-sent-message-notification', messageBody)
        }
    },

    notifyVendor: async(notificationBody: VendorOrderNotification) => {
        io.emit("emit-vendor-notification-order", notificationBody);
       
    },

    joinRoom: async (socketInstance: Socket) => {
        // join the room named 'atlasUsers'
        socketInstance.join('atlasUsers');
    },
    leaveRoom: async (socketInstance: Socket) => {
        connectedUsers = connectedUsers.filter((value) => value.socketId !== socketInstance.id)       
    },

    keepConnectionAlive: async () => {
        // emit Pong to client, to keep connection alive
       // socketInstance.emit('pong', 'Pong from server');
    },

    getAllConnectedUsers() {
        io.emit('emit-connected-user-list', connectedUsers);
    },
    
    getAllActiveUsers: async (socketInstance: Socket) => {
     //   socketInstance.emit('emit-active-user-list', activeUsersList);
    }



}



module.exports = socketController
