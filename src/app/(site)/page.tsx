import { Music } from "@/components/music";
import { options } from "@/app/api/auth/[...nextauth]/options";
import { getServerSession } from "next-auth";
import { Rooms } from "./rooms/page";
import LogoutButton from "@/components/LogoutButton";
import { User } from "./header/user";
import { SearchBar } from "@/components/searchBar";
import { CreateRoom } from "./rooms/create-room";

export default async function Home() {
  const session = await getServerSession(options);
  return (
    <main className=" min-h-screen  p-7">
      {session && session.user?.name && (
        <>
          <div className="flex justify-between w-full">
            <SearchBar />
            {/* <Notification /> */}
            <User user={session.user} />
          </div>

          <Rooms />

          <div className="fixed bottom-[40px] left-1/2 transform -translate-x-1/2">
            <CreateRoom  jwt={`${session?.backendTokens?.jwt}`} />
          </div>


        </>
      )}
    </main>
  );
}
