import { options } from '@/app/api/auth/[...nextauth]/options';
import { Header } from '@/components/header';
import { getServerSession } from 'next-auth';
import { AllRooms } from './rooms/all-rooms';
import { CreateRoom } from '../../components/modals/create-room';
import { Button } from '@/components/ui/button';
import { signOut } from 'next-auth/react';
import LogoutButton from '@/components/LogoutButton';

export default async function Home() {
    const session = await getServerSession(options);

    return (
        <main className=" min-h-screen p-7 pb-0 max-h-max md:max-h-[calc(100vh-28px)]">
            {session && session.user?.name && (
                <>
                    <Header user={session.user} />

                    {session?.backendTokens?.jwt && (
                        <AllRooms jwt={session.backendTokens.jwt} userId={session.user.id} />
                    )}

                    <div className="fixed bottom-[40px] left-1/2 transform -translate-x-1/2">
                        <CreateRoom jwt={`${session?.backendTokens?.jwt}`} />
                    </div>
                </>
            )}

            {!session?.user && (
                <div>
                    something wrong, try logging out and log in again <LogoutButton />
                </div>
            )}
        </main>
    );
}
