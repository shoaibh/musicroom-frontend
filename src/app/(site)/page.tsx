import { Music } from "@/components/music";
import { options } from "@/app/api/auth/[...nextauth]/options";
import { getServerSession } from "next-auth";
import { Rooms } from "./rooms/page";
import LogoutButton from "@/components/LogoutButton";
import { User } from "./header/user";
import { SearchBar } from "@/components/searchBar";

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
        </>
      )}
    </main>
  );
}
