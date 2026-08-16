import React from 'react'
import { CheckIcon, SparkleIcon } from '../ui/Icons'

const highlights = [
    'Fill in your details once, in plain English.',
    'Paste any job posting and get a matching resume.',
    'Download a clean, one-page PDF that reads well to recruiters and applicant tracking systems.',
]

const AuthLayout = ({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) => (
    <main className="grid min-h-screen lg:grid-cols-2">
        <section className="hidden flex-col justify-center gap-8 bg-neutral p-12 text-neutral-content lg:flex">
            <div className="flex items-center gap-3">
                <span className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-content">
                    <SparkleIcon className="size-6" />
                </span>
                <span className="text-2xl font-semibold">AIResume</span>
            </div>

            <div className="max-w-md">
                <h1 className="text-3xl font-semibold leading-snug">A resume that matches the job, every time.</h1>
                <ul className="mt-8 space-y-4">
                    {highlights.map((item) => (
                        <li key={item} className="flex gap-3 text-sm leading-relaxed text-neutral-content/85">
                            <CheckIcon className="mt-0.5 size-5 shrink-0 text-accent" />
                            <span>{item}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </section>

        <section className="flex items-center justify-center p-6">
            <div className="panel w-full max-w-md p-6 sm:p-8">
                <div className="mb-6 flex items-center gap-2 lg:hidden">
                    <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-content">
                        <SparkleIcon className="size-5" />
                    </span>
                    <span className="text-lg font-semibold">AIResume</span>
                </div>

                <h2 className="text-2xl font-semibold">{title}</h2>
                <p className="mt-1 text-sm text-base-content/60">{subtitle}</p>

                <div className="mt-6">{children}</div>
            </div>
        </section>
    </main>
)

export default AuthLayout
