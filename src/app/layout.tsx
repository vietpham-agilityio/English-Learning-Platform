import type { Metadata } from 'next'
import { ClerkProvider, Show, SignInButton, SignUpButton, UserButton } from '@clerk/nextjs'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import Link from 'next/link'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'EnglishFlow — Learn English with Confidence',
  description: 'Structured lessons, real-world practice, and personalised feedback.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ClerkProvider>
          {/*
            absolute + z-50 so it floats over the dark hero gradient.
            No background — the hero shows through.
          */}
          <header className="absolute top-0 left-0 right-0 z-50 h-16 flex items-center justify-between px-6 lg:px-10">

            {/* Logo */}
            <Link
              href="/"
              className="flex items-center gap-2 text-white font-bold text-lg tracking-tight select-none"
            >
              🌿 <span>EnglishFlow</span>
            </Link>

            {/* Centre nav — hidden on mobile */}
            <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-stone-300">
              <Link href="/courses" className="hover:text-white transition-colors">Courses</Link>
              <Link href="/users" className="hover:text-white transition-colors">Users</Link>
              <Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link>
            </nav>

            {/* Auth */}
            <div className="flex items-center justify-end gap-3 min-w-40">
              <Show when="signed-out">
                <>
                  <div className="text-stone-300 hover:text-white text-sm font-medium transition-colors cursor-pointer px-2"><SignInButton>Sign in</SignInButton></div>
                  <div className="bg-emerald-500 hover:bg-emerald-400 text-white text-sm font-semibold px-5 py-2 rounded-lg transition-all duration-200 hover:-translate-y-0.5 cursor-pointer shadow-lg shadow-emerald-900/30"><SignUpButton>Sign up</SignUpButton></div>
                </>
              </Show>
              <Show when="signed-in">
                <UserButton
                  appearance={{
                    elements: { avatarBox: 'w-9 h-9' },
                  }}
                />
              </Show>
            </div>
          </header>

          {children}

          {/* ── FOOTER ── */}
          <footer className="border-t border-stone-200 bg-white">
            <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-stone-400">
              <span className="font-bold text-stone-700 text-base">🌿 EnglishFlow</span>
              <span>© 2026 EnglishFlow. All rights reserved.</span>
              <div className="flex gap-6">
                <Link href="#" className="hover:text-stone-600 transition-colors">Privacy</Link>
                <Link href="#" className="hover:text-stone-600 transition-colors">Terms</Link>
                <Link href="#" className="hover:text-stone-600 transition-colors">Contact</Link>
              </div>
            </div>
          </footer>
        </ClerkProvider>
      </body>
    </html>
  )
}
