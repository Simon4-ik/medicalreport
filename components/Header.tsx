
import React from 'react';
import { Icon } from './common/Icon';

interface HeaderProps {
    toggleSidebar: () => void;
}

export const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
    return (
        <header className="bg-white shadow-sm h-16 flex items-center justify-between px-4 sm:px-6 z-10">
             <div className="flex items-center">
                <button
                    onClick={toggleSidebar}
                    className="md:hidden text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
                >
                    <Icon name="menu" className="h-6 w-6" />
                </button>
                <div className="flex items-center ml-4 md:ml-0">
                    <div className="bg-primary-light p-2 rounded-full">
                        <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 20.944a11.955 11.955 0 018.618-3.04 11.955 11.955 0 018.618 3.04 12.02 12.02 0 00-3-17.984z" />
                        </svg>
                    </div>
                    <h1 className="text-xl font-bold text-secondary ml-3 hidden sm:block">Health Guardian</h1>
                </div>
            </div>
            
            <div className="flex items-center">
                <p className="text-sm text-gray-600 mr-4 hidden md:block">
                    Your AI-powered medical companion.
                </p>
                <img
                    className="h-9 w-9 rounded-full object-cover"
                    src={`https://picsum.photos/seed/user/100/100`}
                    alt="User avatar"
                />
            </div>
        </header>
    );
};
