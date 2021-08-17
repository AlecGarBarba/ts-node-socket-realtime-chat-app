import { LocationObject, MessageObject, LocationMessageObject } from "./types";

export function generateWelcome(text:string){
    return {
        text:text,
        createdAt: new Date().getTime(),
        username: "Admin"
    }
}

export function generateMessage(username:string, text:string):MessageObject{
    return {
        text: text,
        createdAt: new Date().getTime(),
        username:username
    }
}

export function generateLocationMessageObject(username: string, location: LocationObject): LocationMessageObject{
    return {
        url: `https://google.com/maps?q${location.latitude},${location.longitude}`,
        createdAt: new Date().getTime(),
        username: username
    }
}

