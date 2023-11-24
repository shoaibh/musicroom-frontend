import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

// eslint-disable-next-line
export const debounce = <F extends (...args: any[]) => void>(func: F, delay: number) => {
    let timer: NodeJS.Timeout;
    return (...args: Parameters<F>) => {
        clearTimeout(timer);
        timer = setTimeout(() => {
            func(...args);
        }, delay);
    };
};
