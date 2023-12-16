declare module 'next-auth' {
    interface Session {
        user: {
            id: string;
            name: string;
            email: string;
            image: string;
        };

        backendTokens: {
            jwt: string;
            refreshToken: string;
            expiresIn: number;
        };
    }
}

import 'next-auth/jwt';

declare module 'next-auth/jwt' {
    interface JWT {
        user: {
            id: string;
            email: string;
            name: string;
            image: string;
        };

        backendTokens: {
            jwt: string;
            refreshToken: string;
            expiresIn: number;
        };
    }
}
