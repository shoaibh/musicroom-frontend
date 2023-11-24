'use client';

import { FC, useRef, useState } from 'react';
import { BsSearch } from 'react-icons/bs';
import { Input } from './ui/input';

interface Props {
    iconShow?: boolean;
}

export const SearchBar: FC<Props> = ({ iconShow = true }) => {
    const [searchInput, setSearchInput] = useState('');
    const [showIcon, setShowIcon] = useState(iconShow);
    const inputRef = useRef(null);

    const handleSubmit = () => {};

    const showSearch = () => {
        setShowIcon(false);
        if (inputRef && inputRef.current) {
            const inputElement = inputRef.current as HTMLInputElement;
            setTimeout(() => inputElement.focus(), 0); // Use setTimeout to focus after the input is visible
        }
    };

    return (
        <div className="flex" onBlur={() => setShowIcon(true)}>
            <form onSubmit={handleSubmit}>
                <span
                    onClick={showSearch}
                    className={`block w-[25px] h-[25px] cursor-pointer transition-all duration-5000 ${
                        !showIcon ? 'hidden' : ''
                    }`}>
                    <BsSearch className="w-full h-full" />
                </span>
                <Input
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    id="search"
                    name="search"
                    type="search"
                    required
                    placeholder="search room"
                    className={`bg-white box-border p-2  w-full ${showIcon ? 'hidden' : ''}`}
                    onBlur={() => setShowIcon(true)}
                    ref={inputRef}
                />
            </form>
        </div>
    );
};
