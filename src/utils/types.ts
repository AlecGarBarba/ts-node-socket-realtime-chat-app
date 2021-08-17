export type ErrorMessage = string;
export type ChatCallBack= (errorMessage?: ErrorMessage) =>void;

export type  MessageObject={
    text: string;
    createdAt: number;
    username:string;
}
export type ErrorObject={
    error: string
}

export type  LocationMessageObject={
    url: string
    createdAt: number;
    username:string;

}

export type LocationObject = {
    latitude: string,
    longitude: string
};

export type UserRequest={
    username:string,
    room:string,
}

export type User={
    id:string,
    username:string,
    room:string
}

export type UserObject = {user: User}

export type UserTry = ErrorObject | User;