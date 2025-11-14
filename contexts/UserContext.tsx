'use client'
import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { getOrCreateUser } from '@/lib/database'
import type { Database } from '@/lib/supabase'

type User = Database['public']['Tables']['users']['Row']

interface UserContextType {
  user: User | null
  loading: boolean
  refreshUser: () => Promise<void>
}

const UserContext = createContext<UserContextType>({
  user: null,
  loading: true,
  refreshUser: async () => {}
})

export function UserProvider({ children }: { children: ReactNode }) {
  const { connected, publicKey } = useWallet()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  const refreshUser = async () => {
    if (!connected || !publicKey) {
      setUser(null)
      setLoading(false)
      return
    }

    try {
      const userData = await getOrCreateUser(publicKey.toString())
      setUser(userData)
    } catch (error) {
      console.error('Error fetching user:', error)
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    refreshUser()
  }, [connected, publicKey])

  return (
    <UserContext.Provider value={{ user, loading, refreshUser }}>
      {children}
    </UserContext.Provider>
  )
}

export const useUser = () => {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error('useUser must be used within UserProvider')
  }
  return context
}