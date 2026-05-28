import { Open_Sans } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import Head from "next/head";
import 'react-toastify/dist/ReactToastify.css';

const openSans = Open_Sans({ subsets: ["latin"] });

export const metadata = {
    title: "Parqueadero",
    description:
        "Aplicación de parqueadero para gestionar el ingreso y salida de autos.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="es" suppressHydrationWarning>
            <body className={`${openSans.className} antialiased min-h-screen`}>
                <Providers>
                    {children}
                </Providers>
            </body>
        </html>
    );
}