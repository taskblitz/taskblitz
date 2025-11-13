'use client'
import { useWallet } from '@solana/wallet-adapter-react'
import { useWalletModal } from '@solana/wallet-adapter-react-ui'
import { useEffect, useState, useRef } from 'react'
import { Copy, LogOut, RefreshCw, Check } from 'lucide-react'

export function CustomWalletButton() {
  const { wallet, connect, disconnect, connecting, connected, publicKey } = useWallet()
  const { setVisible } = useWalletModal()
  const [mounted, setMounted] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  const [copied, setCopied] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false)
      }
    }

    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showDropdown])

  const handleClick = () => {
    if (connected && publicKey) {
      setShowDropdown(!showDropdown)
    } else if (wallet) {
      connect().catch(() => {})
    } else {
      setVisible(true)
    }
  }

  const handleCopyAddress = () => {
    if (publicKey) {
      navigator.clipboard.writeText(publicKey.toBase58())
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleChangeWallet = () => {
    setShowDropdown(false)
    setVisible(true)
  }

  const handleDisconnect = () => {
    setShowDropdown(false)
    disconnect()
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
    <div className="relative" ref={dropdownRef}>
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

      {/* Dropdown Menu */}
      {showDropdown && connected && publicKey && (
        <div className="absolute top-full right-0 mt-2 w-56 bg-gray-900 border border-white/20 rounded-lg shadow-2xl py-2 z-50">
          <button
            onClick={handleCopyAddress}
            className="w-full text-left px-4 py-2.5 text-white hover:bg-white/10 transition-colors flex items-center gap-3"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-green-400" />
                <span className="text-green-400">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Copy Address</span>
              </>
            )}
          </button>

          <button
            onClick={handleChangeWallet}
            className="w-full text-left px-4 py-2.5 text-white hover:bg-white/10 transition-colors flex items-center gap-3"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Change Wallet</span>
          </button>

          <div className="border-t border-white/10 my-1" />

          <button
            onClick={handleDisconnect}
            className="w-full text-left px-4 py-2.5 text-red-400 hover:bg-red-500/10 transition-colors flex items-center gap-3"
          >
            <LogOut className="w-4 h-4" />
            <span>Disconnect</span>
          </button>
        </div>
      )}
    </div>
  )
}
