import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import NavBar from "./components/NavBar";
import { Providers } from "./components/Providers";
import { Toaster } from "react-hot-toast";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "The Grand Library",
    template: "%s | The Grand Library",
  },
  description: "A place to discover and manage your favorite books",
   openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Library App",
  },
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
        <Providers>
        <header>
          <NavBar />
        </header>
        <main>
          <Toaster position="top-center" />
          {children}
        </main>
        <footer>
          
        </footer>
        </Providers>
      </body>
    </html>
  );
}
