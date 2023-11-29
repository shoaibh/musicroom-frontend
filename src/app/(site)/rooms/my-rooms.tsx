import { IRoom } from '@/app/Constant';
import React, { FC } from 'react';
import { Room } from './room';

interface Props {
    rooms: IRoom[];
}

export const MyRooms: FC<Props> = ({ rooms }) => {
    if (rooms.length <= 0) {
        return <div>You have not created any rooms yet.</div>;
    }

    return (
        <div className="w-full ">
            <h1 className="text-center text-xl hidden md:block">My Rooms</h1>
            {rooms.map((r) => (
                <Room
                    name={r.name}
                    id={r.id}
                    key={r.id}
                    currentSong={r.currentSong || undefined}
                    owner={r.owner}
                />
            ))}
        </div>
    );
};
