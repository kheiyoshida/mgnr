import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "mgnr",
  description: "generative music library for js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="bg-stone-600">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className='bg-stone-600 text-white w-screen min-h-screen'>
          {/* menu and stuff might come here */}
          <div id="content" className='m-auto max-w-6xl'>
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
