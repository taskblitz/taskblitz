'use client'
import { useWallet } from '@solana/wallet-adapter-react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { isAdmin } from '@/lib/admin'
import { Header } from './Header'
import { 
  LayoutDashboard, 
  Users, 
  Briefcase, 
  DollarSign, 
  AlertTriangle,
  Megaphone,
  BarChart3,
  Settings,
  Shield
} from 'lucide-react'

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const { publicKey } = useWallet()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [authorized, setAuthorized] = useState(false)

  useEffect(() => {
    let isMounted = true

    const checkAdmin = async () => {
      // If already authorized, don't check again or redirect
      if (authorized) {
        console.log('Already authorized, skipping check')
        return
      }

      if (!publicKey) {
        console.log('No wallet connected')
        if (isMounted && !authorized) {
          setLoading(false)
        }
        return
      }

      console.log('Checking admin status for:', publicKey.toString())
      const adminStatus = await isAdmin(publicKey.toString())
      console.log('Admin status:', adminStatus)
      
      if (!isMounted) return

      if (adminStatus) {
        console.log('✅ Admin authorized!')
        setAuthorized(true)
        setLoading(false)
      } else {
        console.log('❌ Not authorized')
        setLoading(false)
      }
    }

    checkAdmin()

    return () => {
      isMounted = false
    }
  }, [publicKey, authorized])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent"></div>
      </div>
    )
  }

  if (!authorized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="glass-card p-8 max-w-md text-center">
          <Shield className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Access Denied</h2>
          <p className="text-text-secondary mb-4">
            You need admin privileges to access this page.
          </p>
          <p className="text-xs text-text-muted">
            Wallet: {publicKey?.toString() || 'Not connected'}
          </p>
        </div>
      </div>
    )
  }


  const navItems = [
    { href: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
    { href: '/admin/users', icon: Users, label: 'Users' },
    { href: '/admin/tasks', icon: Briefcase, label: 'Tasks' },
    { href: '/admin/financial', icon: DollarSign, label: 'Financial' },
    { href: '/admin/disputes', icon: AlertTriangle, label: 'Disputes' },
    { href: '/admin/announcements', icon: Megaphone, label: 'Announcements' },
    { href: '/admin/analytics', icon: BarChart3, label: 'Analytics' },
    { href: '/admin/settings', icon: Settings, label: 'Settings' },
  ]

  return (
    <div className="min-h-screen">
      <Header />
      
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 min-h-screen bg-black/20 border-r border-white/10 p-4">
          <div className="flex items-center gap-2 mb-6 px-3">
            <Shield className="w-6 h-6 text-purple-400" />
            <h2 className="text-xl font-bold text-white">Admin Panel</h2>
          </div>
          
          <nav className="space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-text-secondary hover:bg-white/10 hover:text-white transition-colors"
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
