export interface IRoom {
  id: number;
  name: string;
  currentSong?: string;
  owner?: Owner;
  roomPic?: string;
  memberCount?: number;
}

export interface Owner {
  id: number;
  name: string;
  email: string;
  image: string;
  roomIds: string[];
  roomOwned: boolean;
}
