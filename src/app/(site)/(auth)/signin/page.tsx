import { getServerSession } from 'next-auth/next';
import { getProviders } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { options } from '../../../api/auth/[...nextauth]/options';
import { SignInForm } from './sigin-form';

export default async function SignIn() {
    const session = await getServerSession(options);

    if (session) {
        redirect('/');
    }

    const providers = await getProviders();

    return (
        <div className="relative flex flex-col justify-center items-center min-h-screen overflow-hidden">
            <div className="w-full m-auto bg-white lg:max-w-lg">
                {providers && <SignInForm providers={providers} />}
            </div>
        </div>
    );
}
