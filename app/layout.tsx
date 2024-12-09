import type {Metadata} from "next";
import {Playfair} from "next/font/google";
import {ReactNode} from "react";

import "./globals.css";

const playfair = Playfair({
    subsets: ["latin", "latin-ext"],
    variable: "--font-playfair",
    display: "swap"
});

export const metadata: Metadata = {
    title: "Akademicka Baza Wiedzy"
};

export default function RootLayout({ children }: Readonly<{
    children: ReactNode;
}>) {
    return (
        <html lang="pl" className={`${playfair.variable}`}>
            <body className={`w-screen h-screen bg-gradient-to-bl from-primary to-secondary`}>
                <div className={`bg-black text-white h-16`}> </div>
                <div className={`flex justify-center content-center w-full h-full`}>
                    {children}
                </div>
            </body>
        </html>
    );
}
