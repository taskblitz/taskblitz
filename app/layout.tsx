import type { Metadata } from 'next'
import { Inter, Montserrat } from 'next/font/google'
import './globals.css'
import { WalletContextProvider } from '@/components/WalletProvider'
import { UserProvider } from '@/contexts/UserContext'
import { Toaster } from 'react-hot-toast'
import { AnnouncementBanner } from '@/components/AnnouncementBanner'
import Script from 'next/script'

const inter = Inter({ subsets: ['latin'] })
const montserrat = Montserrat({ 
  subsets: ['latin'],
  variable: '--font-montserrat'
})

export const metadata: Metadata = {
  title: 'TaskBlitz - Solana Micro-Task Marketplace',
  description: 'The first crypto-native micro-task marketplace on Solana. Post tasks, complete work, get paid instantly in crypto.',
  keywords: 'solana, crypto, tasks, marketplace, blockchain, web3',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
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
      <body className={`${inter.className} ${montserrat.variable} min-h-screen`}>
        <WalletContextProvider>
          <UserProvider>
            <AnnouncementBanner />
            <div className="pt-12"> {/* Add padding-top for fixed banner */}
              {children}
            </div>
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