import { useEffect, useState } from 'react';
import { FaSun, FaMoon } from 'react-icons/fa';

const ThemeSwitch = () => {
    const [isDarkMode, setIsDarkMode] = useState(
        document.documentElement.classList.contains('dark')
    );

    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [isDarkMode]);

    return (
        <div
            className={`relative w-16 h-8 rounded-full cursor-pointer p-1 
                        flex items-center 
                        ${isDarkMode ? 'bg-accent' : 'bg-border'}`}
            onClick={() => setIsDarkMode(!isDarkMode)}
        >
            <div
                className={`w-6 h-6 rounded-full bg-primary shadow-md transform transition-transform duration-300 
                            flex items-center justify-center
                            ${isDarkMode ? 'translate-x-8' : 'translate-x-0'}`}
            >
                {isDarkMode ? (
                    <FaMoon className="text-blue-400" />
                ) : (
                    <FaSun className="text-yellow-400" />
                )}
            </div>
        </div>
    );
};

export default ThemeSwitch;
