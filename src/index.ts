import express from 'express';
import path from 'path';
import { createServer } from "http";
import { Server, Socket} from 'socket.io';
import BadWordsFilter from 'bad-words'
import { generateMessage, generateLocationMessageObject, generateWelcome } from './utils/messages';
import { LocationObject, ChatCallBack, UserRequest, UserTry} from './utils/types';
import { addUser, getUser, getUsersInRoom, removeUser,   } from './users/users';

const port: string | number = process.env.PORT || 3000;
const publicDirectoryPath: string = path.join(__dirname, '../public');

function main(){
    const app = express(); 
    const httpServer = createServer(app);
    const io = new Server(httpServer);
    io.on("connection", (socket: Socket) => { 
        console.log("New web socket connection"); 
        
        socket.on("join", ({username, room}: UserRequest, callback: ChatCallBack)=>{

            const user: UserTry = addUser({ id: socket.id  , username, room  });

            if('error' in user) return callback(user.error);
            
            socket.join(user.room); 
            socket.emit("welcome",  generateWelcome('Welcome!')); //unicast.
            socket.broadcast.to(user.room).emit('message', generateMessage(username, `${username} has joined the room.`)); //multicast (everybody but that particular connection.)
            
            io.to(user.room).emit('roomData', {
                room: user.room,
                users: getUsersInRoom(user.room)
            })
            callback();
            
        })

        socket.on("sendMessage",(message:string, callback:ChatCallBack)=>{ 
            const user = getUser(socket.id);
            if(!user) return callback('Like what');

            const badWordsFilter = new BadWordsFilter();
            if(badWordsFilter.isProfane(message)) return callback('Profanity is not allowed');
            
            io.to(user.room).emit('message',generateMessage(user.username, message)); //broadcast.

            callback(); 
        });

        socket.on('sendLocation',(location: LocationObject, callback:ChatCallBack) =>{
            const user = getUser(socket.id);
            if(!user) return callback('Like what');
            io.to(user.room).emit('location_message', generateLocationMessageObject(user.username, location));
            callback();
        });


        socket.on('disconnect',()=> {
            const user = removeUser(socket.id);
            if(user){
                io.to(user.room).emit('message', generateMessage(user.username, `${user.username} has left the room.`)) 
                io.to(user.room).emit('roomData', {
                    room: user.room,
                    users: getUsersInRoom(user.room)
                })
            } 
        });

        
    
    });
    
    app.use(express.static(publicDirectoryPath));

    httpServer.listen(port, ()=>{
        console.log(`Listening on port ${port}`)
    })
}

main();