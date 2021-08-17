import { ErrorObject, User } from "../utils/types";

const users: User[] = [];
export function addUser({ id, username, room }: User): ErrorObject | User {
    //Clean the data
    username = username.trim().toLocaleLowerCase();
    room = room.trim().toLocaleLowerCase();
    //Validate the data
    if(!username || !room){
        return {
            error: 'Username and room are required!'
        }
    }
    //Check for existing user
    const existingUser = users.find((user:User)=>{
        return user.room === room && user.username === username
    });

    //validate username
    if(existingUser){
        return {
            error: 'Username is in use!'
        }
    }
    //Store user
    const user: User = { id, username, room}
    users.push(user);
    return user;
};

export function removeUser(id:string): User | null{ 
    const index = users.findIndex((user:User)=> user.id === id);
    if(index !== -1) return users.splice(index,1)[0];
    return null;
}

export function getUser(id:string): User | undefined{
    return users.find((user)=> user.id === id);
}

export function getUsersInRoom(room: string): User[] |undefined{
    room = room.trim().toLocaleLowerCase();
    return users.filter((user)=> user.room === room);
}
