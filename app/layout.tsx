import type {Metadata} from "next";
import {Playfair} from "next/font/google";
import {ReactNode} from "react";

import "./globals.css";
import "@/lib/i18next.ts";
import i18next from "i18next";
import { useTranslation, Trans } from "react-i18next";

const playfair = Playfair({
    subsets: ["latin", "latin-ext"],
    variable: "--font-playfair",
    display: "swap"
});

export const metadata: Metadata = {
    title: "Akademicka Baza Wiedzy"
};

export default async function RootLayout({ children }: Readonly<{
    children: ReactNode;
}>) {
    
    const { t, i18n} = useTranslation();
    return (
        <html lang="pl" className={`${playfair.variable} antialiased`}>
            <body className={`w-screen h-screen bg-gradient-to-tr from-primary to-secondary bg-fixed flex flex-col`}>
                {/* TODO: Header bar icons */}
                <div className={`bg-black text-white h-16 p-1 flex gap-1 flex-shrink-0 flex-grow-0`}>
                    <div className={`bg-white h-full w-auto aspect-square`}>
                    </div>
                    <div className={`bg-white h-full w-auto aspect-[3/2]`}>
                    </div>
                    <div className={`bg-white h-full w-auto aspect-square`}>
                    </div>
                </div>
                <div className={`flex justify-center content-center flex-1`}>
                    {children}
                </div>
            </body>
        </html>
    );
}
