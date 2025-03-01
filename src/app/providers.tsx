'use client';

import ThemeRegistry from './ThemeRegistry';

export default function Providers({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <ThemeRegistry>
            {children}
        </ThemeRegistry>
    );
} 