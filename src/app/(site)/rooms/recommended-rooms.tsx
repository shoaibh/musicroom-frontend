import { IRoom } from '@/app/Constant';
import React, { FC } from 'react';
import { Room } from './room';

interface Props {
    rooms: IRoom[];
}

export const RecommendedRooms: FC<Props> = ({ rooms }) => {
    if (rooms?.length <= 0) {
        return <div className="w-full text-center ">No Rooms created yet</div>;
    }

    return (
        <div className="w-full md:overflow-scroll h-full">
            <h1 className="text-center text-xl hidden md:block">Recommended Rooms</h1>

            {rooms.map((r) => (
                <Room
                    name={r.name}
                    _id={r._id}
                    key={r._id}
                    currentSong={r.currentSong || undefined}
                    owner={r.owner}
                />
            ))}
        </div>
    );
};
