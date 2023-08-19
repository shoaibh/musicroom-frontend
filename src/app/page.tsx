import { Music } from "@/components/music";
import { options } from "@/app/api/auth/[...nextauth]/options";
import { getServerSession } from "next-auth";
import { Rooms } from "./rooms/page";

export default async function Home() {
  const session = await getServerSession(options);
  console.log("==", { session });
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      {session ? (
        <>
          <Rooms />
        </>
      ) : (
        <h1>login please</h1>
      )}
    </main>
  );
}
