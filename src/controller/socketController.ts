import { Server, Socket } from "socket.io";
import { MessageBody } from "../interface/MessageBody";



var connectedUsers = [];
var activeUsersList = []


const socketController = {

    connected: async (socketInstance: Socket, data: string) => {
        if(!activeUsersList.includes(data)){
            connectedUsers[data] = socketInstance.id;
            activeUsersList.push(data)
            console.log(`connection opened for user ${data}`)
            console.log(connectedUsers)
        }
    },

    disconnectUser: async (socketInstance: Socket, data: string) => {

      //  let indexToRemove = data;
       // connectedUsers.splice(indexToRemove, 1);

    },

    sendMessage: async(socketInstance: Server, messageBody: MessageBody) => {
        socketInstance.to(connectedUsers[messageBody.to]).emit("receiveMessage", messageBody);
        socketInstance.to(connectedUsers[messageBody.to]).emit('notification', messageBody)
    },

    joinRoom: async (socketInstance: Socket) => {
        // join the room named 'atlasUsers'
        socketInstance.join('atlasUsers');
    },
    leaveRoom: async (socketInstance: Socket) => {
        // leave the room named 'atlasUsers'
        socketInstance.leave('atlasUsers');
    },

    keepConnectionAlive: async (socketInstance: Socket) => {
        // emit Pong to client, to keep connection alive
        socketInstance.emit('pong', 'Pong from server');
    },

    getAllConnectedUsers: async () => {
        return connectedUsers;
    },
    
    getAllActiveUsers: async () => {
        return activeUsersList;
    }



}



module.exports = socketController
