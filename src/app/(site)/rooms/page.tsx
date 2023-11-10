import { options } from "@/app/api/auth/[...nextauth]/options";
import { getServerSession } from "next-auth";
import { AllRooms } from "./all-rooms";

export const Rooms = async () => {
  const session = await getServerSession(options);

  if (session?.backendTokens?.jwt) {
    return (
      <>
        <AllRooms jwt={session.backendTokens.jwt} />
      </>
    );
  }

  return <div>...loading</div>;
};
