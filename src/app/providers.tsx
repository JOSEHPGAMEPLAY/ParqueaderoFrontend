'use client';
import { HeroUIProvider } from "@heroui/react";
import { ThemeProvider } from "next-themes";

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <HeroUIProvider>
            <ThemeProvider defaultTheme="system">
                {children}
            </ThemeProvider>
        </HeroUIProvider>
    );
}
