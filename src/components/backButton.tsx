"use client";

import React from "react";
import { IoArrowBack } from "react-icons/io5";
import { useRouter } from "next/navigation";

export const BackButton = () => {
  const router = useRouter();

  return (
    <IoArrowBack
      size={28}
      className="cursor-pointer"
      onClick={() => router.push("/", { scroll: false })}
    />
  );
};
