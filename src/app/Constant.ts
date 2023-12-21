export interface IRoom {
    _id: string;
    name: string;
    currentSong?: {
        name: string;
    };
    owner?: Owner;
    roomPic?: string;
    memberCount?: number;
    isOwner?: boolean;
    joinedUsers?: string[];
}

export interface Owner {
    _id: string;
    name: string;
    email: string;
    image: string;
    roomIds: string[];
    roomOwned: boolean;
}

export interface IMessage {
    sender: {
        _id: string;
        name: string;
        email: string;
        image: string;
        createdAt: string;
        updatedAt: string;
    };
    message: string;
    createdAt: number;
    _id: string;
}

export interface IUser {
    user: {
        createdAt: string;
        email: string;
        image: string;
        name: string;
        updatedAt: string;
        _id: string;
    };
    _id: string;
}
