import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { AuthProvider } from "@/contexts/AuthContext";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "Cursor Rules Hub - Share & Discover AI Coding Rules",
    template: "%s | Cursor Rules Hub"
  },
  description: "An independent community platform for sharing and discovering Cursor AI coding rules. Built by developers, for developers. Boost productivity with custom AI behavior patterns.",
  keywords: ["cursor", "ai coding", "developer tools", "coding rules", "productivity", "software development", "programming", "ai assistant"],
  authors: [{ name: "Cursor Rules Community" }],
  creator: "Cursor Rules Community",
  publisher: "Cursor Rules Hub",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://cursor-rules-hub.vercel.app'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://cursor-rules-hub.vercel.app',
    title: 'Cursor Rules Hub - Share & Discover AI Coding Rules',
    description: 'An independent community platform for sharing and discovering Cursor AI coding rules. Built by developers, for developers.',
    siteName: 'Cursor Rules Hub',
    images: [
      {
        url: '/Logo.png',
        width: 1200,
        height: 630,
        alt: 'Cursor Rules Hub - AI Coding Rules Community',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Cursor Rules Hub - Share & Discover AI Coding Rules',
    description: 'An independent community platform for sharing and discovering Cursor AI coding rules. Built by developers, for developers.',
    images: ['/Logo.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
    yahoo: 'your-yahoo-verification-code',
  },
  icons: {
    icon: [
      { url: '/favicon.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: [
      { url: '/favicon.png', sizes: '180x180', type: 'image/png' },
    ],
    shortcut: '/favicon.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.png" type="image/png" />
        <link rel="apple-touch-icon" href="/favicon.png" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className={`${inter.className} flex flex-col min-h-screen`}>
        <AuthProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
