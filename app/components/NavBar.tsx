'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { signOut } from '../lib/api'
import { LogoutIcon, SparkleIcon, UserIcon } from './ui/Icons'

const links = [
    { href: '/', label: 'Tailor a resume' },
    { href: '/resume', label: 'My resume' },
]

const NavBar = ({ email }: { email?: string }) => {
    const pathname = usePathname()
    const router = useRouter()
    const [signingOut, setSigningOut] = useState(false)

    const signOutHandler = async () => {
        setSigningOut(true)

        try {
            await signOut()
        } catch {
            // Either way the session is over for this browser; just move on.
        }

        router.push('/auth/signin')
    }

    return (
        <header className="sticky top-0 z-30 border-b border-base-300 bg-base-100/90 backdrop-blur">
            <nav className="page flex items-center gap-3 py-3">
                <Link href="/" className="flex items-center gap-2 font-semibold">
                    <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-content">
                        <SparkleIcon className="size-5" />
                    </span>
                    <span className="text-lg">AIResume</span>
                </Link>

                <div className="mx-auto flex items-center gap-1">
                    {links.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`btn btn-sm ${pathname === link.href ? 'btn-primary' : 'btn-ghost'}`}
                        >
                            {link.label}
                        </Link>
                    ))}
                </div>

                <div className="dropdown dropdown-end">
                    <div tabIndex={0} role="button" className="btn btn-ghost btn-circle" aria-label="Account menu">
                        <UserIcon />
                    </div>
                    <ul tabIndex={0} className="menu dropdown-content menu-sm z-40 mt-2 w-60 rounded-box border border-base-300 bg-base-100 p-2 shadow-lg">
                        {email && (
                            <li className="menu-title truncate px-3 pb-2 pt-1 text-xs text-base-content/60" title={email}>
                                {email}
                            </li>
                        )}
                        <li>
                            <Link href="/resume">Edit my resume</Link>
                        </li>
                        <li>
                            <button onClick={signOutHandler} disabled={signingOut}>
                                <LogoutIcon className="size-4" />
                                {signingOut ? 'Signing out…' : 'Sign out'}
                            </button>
                        </li>
                    </ul>
                </div>
            </nav>
        </header>
    )
}

export default NavBar
