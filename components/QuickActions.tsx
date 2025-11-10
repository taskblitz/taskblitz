'use client'
import { PlusIcon, DashboardIcon, FileTextIcon } from '@radix-ui/react-icons'
import Link from 'next/link'
import { useWallet } from '@solana/wallet-adapter-react'

export function QuickActions() {
  const { connected } = useWallet()

  if (!connected) return null

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col space-y-3">
      <Link
        href="/post-task"
        className="group relative"
      >
        <div className="gradient-primary p-4 rounded-full shadow-lg hover:scale-110 transition-transform">
          <PlusIcon className="w-6 h-6 text-white" />
        </div>
        <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          <div className="glass-card px-3 py-2 text-sm whitespace-nowrap">
            Post New Task
          </div>
        </div>
      </Link>

      <Link
        href="/my-tasks"
        className="group relative"
      >
        <div className="glass-card p-3 rounded-full shadow-lg hover:scale-110 hover:bg-white/20 transition-all">
          <FileTextIcon className="w-5 h-5 text-purple-400" />
        </div>
        <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          <div className="glass-card px-3 py-2 text-sm whitespace-nowrap">
            My Tasks
          </div>
        </div>
      </Link>

      <Link
        href="/dashboard"
        className="group relative"
      >
        <div className="glass-card p-3 rounded-full shadow-lg hover:scale-110 hover:bg-white/20 transition-all">
          <DashboardIcon className="w-5 h-5 text-cyan-400" />
        </div>
        <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          <div className="glass-card px-3 py-2 text-sm whitespace-nowrap">
            Dashboard
          </div>
        </div>
      </Link>
    </div>
  )
}