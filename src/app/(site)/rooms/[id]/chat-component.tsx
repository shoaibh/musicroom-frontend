"use client";

import { useSocket } from "@/Context/SocketProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React, { useState, useEffect, FC, useCallback, useRef } from "react";
import { HiPaperAirplane } from "react-icons/hi2";
import MessageBox from "./message-box";

export const ChatComponent: FC<{
  user: {
    id: Number;
    name: string;
    email: string;
    image: string;
  };
  roomId: string;
}> = ({ user, roomId }) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<
    Array<{
      sender: {
        id: Number;
        name: string;
        email: string;
        image: string;
      };
      message: string;
      createdAt: number;
    }>
  >([]);

  const lastMessageRef = useCallback((node: any) => {
    if (node) {
      node.scrollIntoView({ smooth: true });
    }
  }, []);

  const { socket, isConnected } = useSocket();

  useEffect(() => {
    if (!isConnected) return;

    // Load chat messages from Redis when the component mounts
    fetch(`http://localhost:5001/chat-messages/${roomId}`)
      .then((response) => response.json())
      .then((data) => {
        setMessages(data);
      });

    // Listen for new messages from WebSocket
    socket.on("receive-message", (data: any) => {
      console.log("==receive", { data });
      setMessages((messages) => [...messages, data]);
    });

    return () => {
      socket.disconnect();
      socket.off("receive-message");
    };
  }, [roomId, isConnected, socket]);

  const sendMessage = useCallback(() => {
    console.log("checking");
    socket.emit("send-message", {
      sender: { ...user },
      message,
      roomId,
      createdAt: Date.now(),
    });
    setMessage("");
  }, [user, message, roomId, socket]);

  return (
    <div className="max-h-[70vh] h-full overflow-scroll ">
      <div className="h-full flex flex-col">
        <div className="flex-1 overflow-y-auto bg-white p-4">
          {messages.map((msg, index) => {
            const lastMessage = messages.length - 1 === index;
            return (
              <div key={index} ref={lastMessage ? lastMessageRef : null}>
                <MessageBox
                  data={msg}
                  key={index}
                  isOwn={user.email === msg.sender.email}
                />
              </div>
            );
          })}
        </div>
        <div
          className="py-4 
        px-4 
        bg-white 
        border-t 
        flex 
        items-center 
        gap-2 
        lg:gap-4 
        w-full border border-slate-200  border-solid rounded"
        >
          <Input
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                sendMessage();
              }
            }}
          />
          <Button onClick={sendMessage}>
            <HiPaperAirplane size={18} className="text-white" />
          </Button>
        </div>
      </div>{" "}
    </div>
  );
};
