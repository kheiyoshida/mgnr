import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import React from 'react'
import Link from 'next/link'
import { NavLink } from '@/components'

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
      <div className='bg-stone-600 text-white w-screen min-h-screen p-4'>
        <div className='m-auto max-w-6xl'>
          <div className="mt-12 mb-8">
            <Link href="/">
              <h1 className="text-4xl">mgnr</h1>
            </Link>
            <div className="text-lg leading-12">generative music library for js</div>
          </div>

          <div className="w-full min-2xl:flex">
            <div className='min-w-1/4 pt-4'>
              <NavLink href='/' title={'@mgnr/tone'}/>
              <NavLink href='/cli' title={'@mgnr/midi'}/>
              <NavLink href='/cli' title={'@mgnr/cli'}/>
            </div>
            <div id="content" className='flex-grow-1'>
              {children}
            </div>
          </div>
        </div>
      </div>
      </body>
    </html>
  );
}
