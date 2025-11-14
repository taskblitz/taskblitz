import type { Metadata } from 'next'
import { Inter, Montserrat } from 'next/font/google'
import './globals.css'
import { WalletContextProvider } from '@/components/WalletProvider'
import { UserProvider } from '@/contexts/UserContext'
import { Toaster } from 'react-hot-toast'
import { AnnouncementBanner } from '@/components/AnnouncementBanner'
import { Footer } from '@/components/Footer'
import Script from 'next/script'

const inter = Inter({ subsets: ['latin'] })
const montserrat = Montserrat({ 
  subsets: ['latin'],
  variable: '--font-montserrat'
})

export const metadata: Metadata = {
  metadataBase: new URL('https://taskblitz.com'),
  title: {
    default: 'TaskBlitz - Solana-Powered Micro-Task Marketplace | Earn & Hire with Crypto',
    template: '%s | TaskBlitz'
  },
  description: 'TaskBlitz is the leading blockchain-based micro-task platform. Post tasks, earn USDC, and connect with global talent on Solana. Fast, secure, and transparent.',
  keywords: ['taskblitz', 'micro tasks', 'solana marketplace', 'crypto gigs', 'USDC payments', 'blockchain freelance', 'web3 jobs', 'decentralized marketplace', 'earn crypto', 'solana tasks'],
  authors: [{ name: 'TaskBlitz' }],
  creator: 'TaskBlitz',
  publisher: 'TaskBlitz',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: '/favicon.ico',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://taskblitz.com',
    siteName: 'TaskBlitz',
    title: 'TaskBlitz - Solana-Powered Micro-Task Marketplace',
    description: 'Post tasks, earn USDC, and connect with global talent on the Solana blockchain. Fast, secure, and transparent micro-task marketplace.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'TaskBlitz - Solana Micro-Task Marketplace',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TaskBlitz - Solana Micro-Task Marketplace',
    description: 'Post tasks, earn USDC, and connect with global talent on Solana.',
    creator: '@taskblitz',
    images: ['/twitter-image.png'],
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
  alternates: {
    canonical: 'https://taskblitz.com',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en-US" className="dark">
      <head>
        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-VEQEWSTFR0"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-VEQEWSTFR0');
          `}
        </Script>

        {/* Microsoft Clarity */}
        <Script id="microsoft-clarity" strategy="afterInteractive">
          {`
            (function(c,l,a,r,i,t,y){
              c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
              t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
              y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "u0chwbt0t4");
          `}
        </Script>
      </head>
      <body className={`${inter.className} ${montserrat.variable} min-h-screen flex flex-col`}>
        <WalletContextProvider>
          <UserProvider>
            <AnnouncementBanner />
            <div className="pt-12 flex-1 flex flex-col"> {/* Add padding-top for fixed banner */}
              {children}
            </div>
            <Footer />
            <Toaster 
              position="top-right"
              toastOptions={{
                style: {
                  background: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  color: '#fff',
                },
              }}
            />
          </UserProvider>
        </WalletContextProvider>
      </body>
    </html>
  )
}