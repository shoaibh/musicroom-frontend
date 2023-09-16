"use client";

import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";
import {
  ClientSafeProvider,
  LiteralUnion,
  getProviders,
  signIn,
} from "next-auth/react";
import { getServerSession } from "next-auth/next";
import { options } from "../../../api/auth/[...nextauth]/options";
import { ChangeEvent, FC, FormEvent, useState } from "react";
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
import { redirect, useRouter } from "next/navigation";
import { BuiltInProviderType } from "next-auth/providers/index";
import SocialButton from "@/components/social-button";
import { BsGoogle } from "react-icons/bs";
import toast from "react-hot-toast";

interface Props {
  providers: Record<
    LiteralUnion<BuiltInProviderType, string>,
    ClientSafeProvider
  >;
}

interface FormData {
  email: string;
  password: string;
}

export const SignInForm: FC<Props> = ({ providers }) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
  });

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      setIsLoading(true);
      signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      }).then((callback) => {
        if (callback?.error) {
          toast.error("Something went wrong");
        } else {
          toast.success("Signed Up Successfully");
          router.push("/");
        }
      });
    } catch (e) {
      toast.error(`Something went wrong, ${e}`);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Card>
      <form onSubmit={handleSubmit}>
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">Sign in</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <SocialButton
            icon={BsGoogle}
            onClick={() =>
              signIn("google", { redirect: true, callbackUrl: "/" })
            }
          />

          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              value={formData.email}
              onChange={handleChange}
              id="email"
              name="email"
              type="email"
              placeholder=""
              required
            />{" "}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              value={formData.password}
              onChange={handleChange}
              id="password"
              name="password"
              type="password"
              required
            />{" "}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col">
          <Button className="w-full" type="submit" disabled={isLoading}>
            Login
          </Button>
          <p className="mt-2 text-xs text-center text-gray-700">
            Don't have an account?{" "}
            <Link className=" text-blue-600 hover:underline" href="/signup">
              Sign up
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
};
