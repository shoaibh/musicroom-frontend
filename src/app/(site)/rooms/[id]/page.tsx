import { options } from "@/app/api/auth/[...nextauth]/options";
import { getServerSession } from "next-auth";
import AudioRoom from "./AudioRoom";

export default async function PlayerRoom({
  params,
}: {
  params: { id: string };
}) {
  const session = await getServerSession(options);
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/room/${params.id}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        jwtToken: `${session?.backendTokens?.jwt}`,
      },
    }
  );

  const res = await response.json();

  return (
    <div className="h-[100vh] flex flex-col justify-between">
      {res.success && (
        <AudioRoom
          res={res}
          session={session}
          id={params.id}
          videoId={res.data.videoId}
        />
      )}
    </div>
  );
}
