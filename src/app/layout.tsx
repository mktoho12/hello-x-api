import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Xでログインしてツイートする',
  description:
    'OAuth2.0を使ってXにログインしてツイートする動作確認のページです。POST tweets APIの使用回数制限を確認したい。',
  openGraph: {
    title: 'Xでログインしてツイートする',
    description:
      'OAuth2.0を使ってXにログインしてツイートする動作確認のページです。POST tweets APIの使用回数制限を確認したい。',
    url: 'https://tweet.mktoho.dev/',
    siteName: 'Xでログインしてツイートするサイト',
    images: [
      {
        url: 'https://tweet.mktoho.dev/ogp.png',
        width: 1200,
        height: 630,
        alt: 'Xでログインしてツイートする',
      },
    ],
    locale: 'ja_JP',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Xでログインしてツイートする',
    description:
      'OAuth2.0を使ってXにログインしてツイートする動作確認のページです。POST tweets APIの使用回数制限を確認したい。',
    images: 'https://tweet.mktoho.dev/ogp-twitter.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ja">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  )
}
