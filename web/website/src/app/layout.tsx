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
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className='bg-stone-600 text-white w-screen min-h-screen p-2'>
          <div className='py-8'>
            <h1 className='text-4xl'>mgnr</h1>
            <div className='text-lg leading-10'>generative music library for js</div>
          </div>
          {children}
        </div>
      </body>
    </html>
  );
}
