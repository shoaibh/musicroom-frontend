import { options } from '@/app/api/auth/[...nextauth]/options';
import { BackButton } from '@/components/backButton';
import { Logo } from '@/components/logo';
import { getServerSession } from 'next-auth';
import { User } from '../../header/user';
import { WholePage } from './WholePage';

export default async function PlayerRoom({ params }: { params: { id: string } }) {
    const session = await getServerSession(options);

    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/room/${params.id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            jwtToken: `${session?.backendTokens?.jwt}`
        }
    });

    const response = await res.json();

    const isOwner = response?.data?.ownerId === session?.user?.id;

    return (
        <div className="h-[100vh] flex flex-col justify-between">
            <WholePage session={session} id={params.id} isOwner={isOwner} />
        </div>
    );
}
