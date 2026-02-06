import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Link from 'next/link'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'ModelLab - ML Experiment Command Center',
  description: 'Reproducible ML experimentation with dataset versioning, run tracking, and honest evaluation',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <nav className="border-b border-gray-200 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex">
                <Link href="/" className="flex items-center">
                  <span className="text-2xl font-bold text-primary">ModelLab</span>
                </Link>
                <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                  <Link href="/" className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900">
                    Dashboard
                  </Link>
                  <Link href="/datasets" className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-500 hover:text-gray-900">
                    Datasets
                  </Link>
                  <Link href="/runs" className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-500 hover:text-gray-900">
                    Runs
                  </Link>
                  <Link href="/compare" className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-500 hover:text-gray-900">
                    Compare
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </nav>
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>

        {/* Footer */}
        <footer className="mt-20 pt-12 pb-12 bg-gradient-to-br from-blue-50/50 to-indigo-50/50 border-t-2 border-gray-200 rounded-t-3xl">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center gap-6">
            <a
              href="https://calebnewton.me"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 px-8 py-6 bg-white/60 backdrop-blur-sm rounded-full border-2 border-blue-200/50 shadow-md hover:shadow-xl hover:-translate-y-0.5 hover:border-blue-400/70 transition-all duration-300 no-underline"
            >
              <img
                src="/caleb-usc.jpg"
                alt="Caleb Newton at USC"
                className="w-12 h-12 rounded-full object-cover border-2 border-blue-400 shadow-lg"
                style={{ objectPosition: 'center 30%' }}
              />
              <div className="flex flex-col items-start gap-1">
                <span className="text-xs text-gray-400 uppercase tracking-wider font-semibold">
                  Built by
                </span>
                <span className="text-base text-gray-900 font-bold">
                  Caleb Newton
                </span>
              </div>
            </a>
            <div className="text-center text-sm text-gray-600">
              <p className="font-semibold text-gray-800 mb-1">ModelLab</p>
              <p className="text-xs">ML experiment tracking with reproducibility and honest evaluation</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  )
}
