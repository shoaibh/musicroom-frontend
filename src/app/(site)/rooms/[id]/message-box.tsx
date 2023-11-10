"use client";

import clsx from "clsx";
import { format } from "date-fns";

const MessageBox: React.FC<{
  data: {
    sender: {
      id: Number;
      name: string;
      email: string;
      image: string;
    };
    message: string;
    createdAt: number;
  };
  isOwn: boolean;
}> = ({ data, isOwn = false }) => {
  const container = clsx("flex gap-3 p-4", isOwn && "justify-end");
  const avatar = clsx(isOwn && "order-2");
  const body = clsx("flex flex-col gap-2", isOwn && "items-end");
  const message = clsx(
    "text-sm w-fit overflow-hidden pt-[5px] pb-[5px] pl-[10px] pr-[10px] rounded-md",
    isOwn
      ? "bg-sky-500 text-white  rounded-br-none"
      : "bg-gray-100  rounded-bl-none"
  );

  const time = clsx("text-[10px]", isOwn ? "text-slate-200" : "text-slate-500");

  return (
    <div className={container}>
      <div className={body}>
        <div className="flex items-center gap-1">
          <div className="text-sm text-gray-500">{data.sender.name}</div>
        </div>
        <div className={message}>
          <div>{data.message}</div>
          <div className={time}>
            {data?.createdAt && format(new Date(data?.createdAt), "p")}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageBox;
