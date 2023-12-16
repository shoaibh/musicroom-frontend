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
