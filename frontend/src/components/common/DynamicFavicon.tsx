'use client';

import { useEffect } from 'react';

export function DynamicFavicon() {
    useEffect(() => {
        const handleVisibilityChange = () => {
            const links = document.querySelectorAll('link[rel*="icon"]');
            const timestamp = new Date().getTime();
            const iconPath = document.hidden ? '/favicon-inactive.png' : '/favicon-active.png';
            const finalPath = `${iconPath}?v=${timestamp}`;

            links.forEach((link) => {
                (link as HTMLLinkElement).href = finalPath;
            });
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);

        // Initial set
        handleVisibilityChange();

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, []);

    return null;
}
