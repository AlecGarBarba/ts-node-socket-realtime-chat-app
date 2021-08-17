export type LocationObject = {
    latitude: string,
    longitude: string
};
export type ErrorMessage = string;
export type ChatCallBack= (errorMessage?: ErrorMessage) =>void;

export type  ObjectMessage={
    text: string
    createdAt: number;
}
export type  LocationMessage={
    url: string
    createdAt: number;
}