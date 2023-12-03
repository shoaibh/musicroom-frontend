'use client';

import { createContext, useContext, useEffect, useState } from 'react';

export interface MainContextData {
    readonly isMobile: boolean;
}

const MainContext = createContext<MainContextData>({ isMobile: false });

export const useMainContext = () => {
    return useContext(MainContext);
};

export const MainContextProvider = ({ children }: { children: React.ReactNode }) => {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        // Function to update state based on window width
        const handleResize = () => {
            setIsMobile(window.innerWidth < 1024);
        };

        // Initial check on component mount
        handleResize();

        // Event listener for window resize
        window.addEventListener('resize', handleResize);

        // Clean up the event listener on component unmount
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return <MainContext.Provider value={{ isMobile }}>{children}</MainContext.Provider>;
};
