'use client';

import { Open_Sans } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import Head from "next/head";
import 'react-toastify/dist/ReactToastify.css';

const openSans = Open_Sans({ subsets: ["latin"] });

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="es">
            <Head>
                <meta charSet="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <title>Parqueadero</title>
                <meta name="description" content={"Aplicación de parqueaderopara gestionar el ingreso y salida de autos, ademas de los valores a cobrar, hecho con Next."} />
            </Head>
            <body className={`${openSans.className} antialiasedmin-h-screen`}>
                <Providers>
                    {children}
                </Providers>
            </body>
        </html>
    );
}
