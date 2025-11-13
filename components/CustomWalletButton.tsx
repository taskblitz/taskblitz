'use client'
import { useWallet } from '@solana/wallet-adapter-react'
import { useWalletModal } from '@solana/wallet-adapter-react-ui'
import { useEffect, useState } from 'react'

export function CustomWalletButton() {
  const { wallet, connect, disconnect, connecting, connected, publicKey } = useWallet()
  const { setVisible } = useWalletModal()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleClick = () => {
    if (connected && publicKey) {
      disconnect()
    } else if (wallet) {
      connect().catch(() => {})
    } else {
      setVisible(true)
    }
  }

  if (!mounted) {
    return (
      <button className="gradient-primary text-white font-semibold px-4 py-2 rounded-lg text-sm md:text-base">
        Connect Wallet
      </button>
    )
  }

  const formatAddress = (address: string) => {
    return `${address.slice(0, 4)}...${address.slice(-4)}`
  }

  return (
    <button
      onClick={handleClick}
      disabled={connecting}
      className="gradient-primary text-white font-semibold px-4 py-2 rounded-lg hover:scale-105 transition-all duration-200 text-sm md:text-base flex items-center gap-2"
    >
      {connecting ? (
        'Connecting...'
      ) : connected && publicKey ? (
        <>
          {wallet?.adapter.icon && (
            <img src={wallet.adapter.icon} alt={wallet.adapter.name} className="w-5 h-5" />
          )}
          {formatAddress(publicKey.toBase58())}
        </>
      ) : (
        'Connect Wallet'
      )}
    </button>
  )
}
