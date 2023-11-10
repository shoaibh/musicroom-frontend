import axios from "axios";
import { options } from "../api/auth/[...nextauth]/options";
import { getSession } from "next-auth/react";

const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

instance.interceptors.request.use(
  async (config) => {
    const session = await getSession();

    config.headers["jwtToken"] = session?.backendTokens?.jwt;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default instance;
