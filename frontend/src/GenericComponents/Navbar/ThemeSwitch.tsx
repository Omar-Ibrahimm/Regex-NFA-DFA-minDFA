import { useEffect, useState } from 'react';
import { Switch } from '@mui/material';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';

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
        <div className="flex items-center gap-2 cursor-pointer">
            <LightModeIcon sx={{ color: '#fbbf24' }} />
            <Switch
                checked={isDarkMode}
                onChange={() => setIsDarkMode(!isDarkMode)}
                color="default"
                sx={{
                    '& .MuiSwitch-switchBase.Mui-checked': {
                        color: '#60a5fa', // Moon color (light blue)
                    },
                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                        backgroundColor: '#60a5fa',
                    },
                    '& .MuiSwitch-switchBase': {
                        color: '#fbbf24', // Sun color (yellow)
                    },
                    '& .MuiSwitch-switchBase + .MuiSwitch-track': {
                        backgroundColor: '#fbbf24',
                    }
                }}
            />
            <DarkModeIcon sx={{ color: '#60a5fa' }} />
        </div>
    );
};

export default ThemeSwitch;
