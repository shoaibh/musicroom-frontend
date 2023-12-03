'use client';

import SearchComponent from '@/app/(site)/rooms/[id]/song-queue/search-component';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from '@/components/ui/dialog';
import { useState } from 'react';
import { BsPlus } from 'react-icons/bs';

export const AddSong = ({ jwt, id, isOwner }: { id: string; jwt: string; isOwner: boolean }) => {
    const [open, setOpen] = useState(false);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="m-3 w-[60%] m-auto mt-7 mb-4" onClick={() => setOpen(true)}>
                    Add Song <BsPlus />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="text-black">Add Song to Queue</DialogTitle>
                </DialogHeader>
                <SearchComponent id={id} jwt={jwt} isOwner={isOwner} setOpen={setOpen} />
            </DialogContent>
        </Dialog>
    );
};
