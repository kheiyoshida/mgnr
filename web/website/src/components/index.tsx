import Link from 'next/link'
import React from 'react'

export const Section = ({ title }: { title: string }) => (
  <h2 className={'not-first:mt-12 mb-2 text-2xl'}>{title}</h2>
)

export const NavLink = ({ href, title }: { href: string; title: string }) => (
  <Link className="block pb-4" href={href}>
    {title}
  </Link>
)

export const PageBody = ({ children }: { children: React.ReactNode }) => (
  <div className="py-2 min-2xl:px-2">{children}</div>
)

export const IFrameContainer = ({ children }: { children: React.ReactNode }) => (
  <div className="w-full aspect-video">{children}</div>
)
