'use client'
import Link from 'next/link'

interface UsernameLinkProps {
  username: string
  walletAddress: string
  className?: string
  showAt?: boolean
}

export function UsernameLink({ username, walletAddress, className = '', showAt = true }: UsernameLinkProps) {
  const displayName = username || `${walletAddress.slice(0, 8)}...${walletAddress.slice(-6)}`
  
  return (
    <Link
      href={`/profile/${walletAddress}`}
      className={`hover:text-purple-400 transition-colors cursor-pointer ${className}`}
      onClick={(e) => e.stopPropagation()} // Prevent parent click events
    >
      {showAt && '@'}{displayName}
    </Link>
  )
}
