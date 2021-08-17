import { LocationObject, ObjectMessage, LocationMessage } from "./types";

export function generateMessage(text:string):ObjectMessage{
    return {
        text: text,
        createdAt: new Date().getTime()
    }
}

export function generateLocationMessageObject(location: LocationObject): LocationMessage{
    return {
        url: `https://google.com/maps?q${location.latitude},${location.longitude}`,
        createdAt: new Date().getTime()
    }
}

