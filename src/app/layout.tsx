import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const openSans = Open_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Parqueadero",
    description:
        "Aplicación de parqueaderopara gestionar el ingreso y salida de autos, ademas de los valores a cobrar, hecho con Next.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="es">
            <body className={`${openSans.className} antialiasedmin-h-screen`}>
                <Providers>
                    {children}
                </Providers>
            </body>
        </html>
    );
}
