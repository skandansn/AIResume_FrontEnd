'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import AuthLayout from '../../components/auth/AuthLayout'
import { TextField } from '../../components/ui/Fields'
import { ApiError, signUp } from '../../lib/api'
import { AlertIcon } from '../../components/ui/Icons'

const RegisterPage = () => {
    const router = useRouter()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmation, setConfirmation] = useState('')
    const [error, setError] = useState('')
    const [busy, setBusy] = useState(false)

    const registerHandler = async (event: React.FormEvent) => {
        event.preventDefault()
        setError('')

        if (password.length < 6) {
            setError('Use a password with at least 6 characters.')
            return
        }

        if (password !== confirmation) {
            setError('The two passwords do not match.')
            return
        }

        setBusy(true)

        try {
            await signUp(email, password)
            router.push('/resume')
        } catch (caught) {
            const message = caught instanceof ApiError ? caught.message : 'Something went wrong. Please try again.'
            setError(
                message === 'Invalid input. Please try again.'
                    ? 'That email may already have an account, or the password is too weak.'
                    : message,
            )
            setBusy(false)
        }
    }

    return (
        <AuthLayout title="Create your account" subtitle="It takes about two minutes to set up your resume.">
            <form className="space-y-4" onSubmit={registerHandler}>
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
                    autoComplete="new-password"
                    placeholder="At least 6 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <TextField
                    label="Confirm password"
                    type="password"
                    required
                    autoComplete="new-password"
                    placeholder="Type it once more"
                    value={confirmation}
                    onChange={(e) => setConfirmation(e.target.value)}
                />

                <button type="submit" className="btn btn-primary w-full" disabled={busy}>
                    {busy && <span className="loading loading-spinner loading-sm" />}
                    {busy ? 'Creating your account…' : 'Create account'}
                </button>

                <p className="text-center text-sm text-base-content/70">
                    Already have an account?{' '}
                    <Link href="/auth/signin" className="link link-primary font-medium">
                        Sign in
                    </Link>
                </p>
            </form>
        </AuthLayout>
    )
}

export default RegisterPage
