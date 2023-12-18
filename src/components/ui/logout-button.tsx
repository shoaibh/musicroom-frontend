'use client';

import React from 'react';
import { Button } from './button';
import { signOut } from 'next-auth/react';

export const LogoutButton = () => {
    return <Button onClick={() => signOut()}>Log Out</Button>;
};
