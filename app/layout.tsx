// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore - allow side-effect global CSS import in Next.js
import "./globals.css";

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { NavBar } from "@/components/NavBar";
import { Footer } from "@/components/Footer";
import { Toaster } from "react-hot-toast";
import { ApolloProviderWrapper } from "@/components/ApolloProviderWrapper";
import { SessionCapabilityProvider } from "@/components/SessionCapabilityProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Atah Group",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ApolloProviderWrapper>
          <SessionCapabilityProvider>
            <NavBar />
            {children}
            <Toaster position="bottom-center" reverseOrder={false} />
            <Footer />
          </SessionCapabilityProvider>
        </ApolloProviderWrapper>
      </body>
    </html>
  );
}
