import { useState, useEffect } from 'react';

export const useResponsive = () => {
    const [screenSize, setScreenSize] = useState({
        isMobile: false,
        isTablet: false,
        isDesktop: true,
        width: typeof window !== 'undefined' ? window.innerWidth : 1024
    });

    useEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth;
            setScreenSize({
                isMobile: width < 768,
                isTablet: width >= 768 && width < 1024,
                isDesktop: width >= 1024,
                width
            });
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return screenSize;
};
