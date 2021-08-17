import express from 'express';
import path from 'path';
import { createServer } from "http";
import { Server, Socket} from 'socket.io';
import BadWordsFilter from 'bad-words'
import { generateMessage, generateLocationMessageObject } from './utils/messages';
import { LocationObject, ChatCallBack} from './utils/types';

const port: string | number = process.env.PORT || 3000;
const publicDirectoryPath: string = path.join(__dirname, '../public');

function main(){
    const app = express(); 
    const httpServer = createServer(app);
    const io = new Server(httpServer);
    io.on("connection", (socket: Socket) => { 
        console.log("New web socket connection"); 
        socket.emit("welcome",  generateMessage('Welcome!')); //unicast.
        socket.broadcast.emit('message', 'A new user has joined'); //multicast (everybody but that particular connection.)

        socket.on("sendMessage",(message:string, callback:ChatCallBack)=>{ 
            const badWordsFilter = new BadWordsFilter();
            if(badWordsFilter.isProfane(message)) return callback('Profanity is not allowed');
            
            io.emit('message',generateMessage(message)); //broadcast.

            callback(); 
        });


        socket.on('disconnect',()=> io.emit('message', 'A use has left!') );

        socket.on('sendLocation',(location: LocationObject, callback:ChatCallBack) =>{
            io.emit('location_message', generateLocationMessageObject(location));
            callback();
        });
    
    });
    
    app.use(express.static(publicDirectoryPath));

    httpServer.listen(port, ()=>{
        console.log(`Listening on port ${port}`)
    })
}

main();