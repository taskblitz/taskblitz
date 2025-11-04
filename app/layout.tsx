import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { WalletContextProvider } from '@/components/WalletProvider'
import { UserProvider } from '@/contexts/UserContext'
import { Toaster } from 'react-hot-toast'

const inter = Inter({ subsets: ['latin'] })

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
      <body className={`${inter.className} min-h-screen`}>
        <WalletContextProvider>
          <UserProvider>
            {children}
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