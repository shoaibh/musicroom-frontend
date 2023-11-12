"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { BsPlus } from "react-icons/bs";
import axios from "@/app/libs/axios-config";
import { useSocket } from "@/Context/SocketProvider";

export const CreateRoom = ({ jwt }: { jwt: string }) => {
  const [name, setName] = useState("Music Night");

  const [open, setOpen] = useState(false);

  const { socket, isConnected } = useSocket();

  const { mutate: onCreateRoom, isPending } = useMutation({
    mutationFn: async () => axios.post("/room/create", { name }),

    onSuccess: () => {
      socket.emit("refresh-rooms");
      toast.success("Room Created Successfully");
      setName("");
      setOpen(false);
    },
    onError: () => {
      toast.error("Something went wrong");
    },
  });

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button className="w-full" onClick={() => setOpen(true)}>
            Create New Room <BsPlus />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create New Room</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={name}
                className="col-span-3"
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="submit"
              onClick={() => {
                onCreateRoom();
              }}
              isLoading={isPending}
            >
              Create Room
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
