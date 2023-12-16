import { IRoom } from '@/app/Constant';
import React, { FC } from 'react';
import { Room } from './room';

interface Props {
    rooms: IRoom[];
    userId: string;
}

export const MyRooms: FC<Props> = ({ rooms, userId }) => {
    if (rooms?.length <= 0) {
        return <div className="w-full text-center">You have not created any rooms yet.</div>;
    }

    return (
        <div className="w-full md:overflow-scroll h-full">
            <h1 className="text-center text-xl hidden md:block">My Rooms</h1>
            {rooms?.map((r) => {
                return (
                    <Room
                        name={r.name}
                        _id={r._id}
                        key={r._id}
                        currentSong={r?.currentSong || undefined}
                        isOwner={r?.owner?._id === userId}
                        owner={r.owner}
                        memberCount={r?.joinedUsers?.length}
                    />
                );
            })}
        </div>
    );
};
