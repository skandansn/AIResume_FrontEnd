import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import NavBar from './components/NavBar'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'AIResume',
  description: 'AI Resume Fixer',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" data-theme = "retro">
      <body className={inter.className}>
        <NavBar/>
        {children}
        </body>
    </html>
  )
}
