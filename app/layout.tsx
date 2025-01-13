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

export default async function RootLayout({ children }: Readonly<{
    children: ReactNode;
}>) {
    return (
        <html lang="pl" className={`${playfair.variable} antialiased`}>
            <body>
                {children}
            </body>
        </html>
    );
}
