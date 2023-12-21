import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';

// async function refreshToken(token: JWT): Promise<JWT> {
//     const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user/refresh`, {
//         method: 'POST',
//         headers: {
//             refreshtoken: `${token.backendTokens.refreshToken}`
//         }
//     });

//     const response = await res.json();

//     return {
//         ...token,
//         backendTokens: response
//     };
// }

export const options: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string
        }),
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: {
                    label: 'Email:',
                    type: 'text',
                    placeholder: 'email'
                },
                password: {
                    label: 'Password:',
                    type: 'password',
                    placeholder: 'password'
                },
                recaptchaValue: {
                    type: 'text'
                }
            },
            async authorize(credentials) {
                // console.log('==', { credentials });
                const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user/login`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        email: credentials?.email,
                        password: credentials?.password,
                        recaptchaValue: credentials?.recaptchaValue
                    })
                });
                if (response.status === 401) {
                    return null;
                }
                if (response.status !== 200) {
                    throw new Error('something went wrong');
                }
                const r = await response.json();

                const user = r.data;

                return user;
            }
        })
    ],
    debug: process.env.NODE_ENV === 'development',
    theme: {
        colorScheme: 'dark', // "auto" | "dark" | "light"
        brandColor: '', // Hex color code
        logo: '', // Absolute URL to image
        buttonText: '' // Hex color code
    },
    callbacks: {
        async signIn({ user, account, profile, email, credentials }) {
            return true;
        },
        async jwt(props) {
            const { token, user, account, profile } = props;

            if (user) return { ...token, ...user };

            return token;
            // if (new Date().getTime() < token.backendTokens?.expiresIn) return token;

            // return await refreshToken(token);
        },
        async session({ token, session, user }) {
            // console.log('==session', { token, session, user });

            if (!token.user && session?.user) {
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/oauth/getJwt`,
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            email: session.user?.email
                        })
                    }
                );
                if (response.status !== 201) {
                    throw new Error('something went wrong');
                }
                const r = await response.json();

                session.user = r.data.user;
                session.backendTokens = r.data.backendTokens;

                return session;
            }

            session.user = token.user;
            session.backendTokens = token.backendTokens;

            return session;
        }
    },
    pages: {
        signIn: '/auth/signin'
    }
};
