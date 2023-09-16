import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";
import { getProviders, signIn } from "next-auth/react";
import { getServerSession } from "next-auth/next";
import { options } from "../../../api/auth/[...nextauth]/options";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { redirect } from "next/navigation";
import { SignInForm } from "./sigin-form";

export default async function SignIn() {
  const session = await getServerSession(options);

  if (session) {
    redirect("/");
  }

  const providers = await getProviders();

  // console.log("==", { providers: Object.values(providers!!) });

  return (
    <div className="relative flex flex-col justify-center items-center min-h-screen overflow-hidden">
      <div className="w-full m-auto bg-white lg:max-w-lg">
        {providers && <SignInForm providers={providers} />}
      </div>
    </div>
  );
}
