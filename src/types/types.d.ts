
export interface IUser {
    id: string;
    avatar: string;
    name: string;
}

export interface ILocation {
    longitude: number;
    latitude: number,
}

export interface IUserLocation extends IUser, ILocation {}
