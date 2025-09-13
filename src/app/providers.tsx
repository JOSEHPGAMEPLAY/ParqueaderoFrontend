'use client';
import { AuthProvider } from "@/context/AuthContext";
import { HeroUIProvider } from "@heroui/react";
import { ThemeProvider } from "next-themes";
import { ToastContainer } from "react-toastify";

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <HeroUIProvider>
            <ThemeProvider defaultTheme="system">
                <AuthProvider>
                    {children}
                </AuthProvider>
            </ThemeProvider>
            <ToastContainer />
        </HeroUIProvider>
    );
}
