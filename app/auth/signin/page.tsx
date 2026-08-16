'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import AuthLayout from '../../components/auth/AuthLayout'
import { TextField } from '../../components/ui/Fields'
import { ApiError, signIn } from '../../lib/api'
import { AlertIcon } from '../../components/ui/Icons'

const SignInPage = () => {
    const router = useRouter()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [busy, setBusy] = useState(false)

    const signInHandler = async (event: React.FormEvent) => {
        event.preventDefault()
        setError('')
        setBusy(true)

        try {
            await signIn(email, password)
            router.push('/')
        } catch (caught) {
            const message = caught instanceof ApiError ? caught.message : 'Something went wrong. Please try again.'
            setError(message === 'Invalid input. Please try again.' ? 'That email and password do not match an account.' : message)
            setBusy(false)
        }
    }

    return (
        <AuthLayout title="Welcome back" subtitle="Sign in to tailor your resume to a new job.">
            <form className="space-y-4" onSubmit={signInHandler}>
                {error && (
                    <div className="alert alert-error py-2 text-sm" role="alert">
                        <AlertIcon className="size-5 shrink-0" />
                        <span>{error}</span>
                    </div>
                )}

                <TextField
                    label="Email"
                    type="email"
                    required
                    autoComplete="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <TextField
                    label="Password"
                    type="password"
                    required
                    autoComplete="current-password"
                    placeholder="Your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <button type="submit" className="btn btn-primary w-full" disabled={busy}>
                    {busy && <span className="loading loading-spinner loading-sm" />}
                    {busy ? 'Signing in…' : 'Sign in'}
                </button>

                <p className="text-center text-sm text-base-content/70">
                    New here?{' '}
                    <Link href="/auth/register" className="link link-primary font-medium">
                        Create an account
                    </Link>
                </p>
            </form>
        </AuthLayout>
    )
}

export default SignInPage
