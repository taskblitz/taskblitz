'use client'
import { Header } from '@/components/Header'
import { useWallet } from '@solana/wallet-adapter-react'
import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import { ArrowUpRight, ArrowDownLeft, DollarSign, RefreshCw } from 'lucide-react'
import Link from 'next/link'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

interface Transaction {
  id: string
  transaction_type: string
  amount: number
  currency: string
  status: string
  created_at: string
  task_id: string | null
  from_user_id: string | null
  to_user_id: string | null
  solana_tx_hash: string | null
  task?: {
    title: string
  }
}

export default function TransactionsPage() {
  const { publicKey } = useWallet()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'incoming' | 'outgoing'>('all')

  useEffect(() => {
    if (publicKey) {
      fetchTransactions()
    }
  }, [publicKey, filter])

  const fetchTransactions = async () => {
    if (!publicKey) return

    setLoading(true)
    try {
      // Get user ID
      const { data: user } = await supabase
        .from('users')
        .select('id')
        .eq('wallet_address', publicKey.toString())
        .single()

      if (!user) return

      let query = supabase
        .from('transactions')
        .select(`
          *,
          task:tasks(title)
        `)
        .order('created_at', { ascending: false })
        .limit(100)

      if (filter === 'incoming') {
        query = query.eq('to_user_id', user.id)
      } else if (filter === 'outgoing') {
        query = query.eq('from_user_id', user.id)
      } else {
        query = query.or(`from_user_id.eq.${user.id},to_user_id.eq.${user.id}`)
      }

      const { data, error } = await query

      if (error) throw error
      setTransactions(data || [])
    } catch (error) {
      console.error('Error fetching transactions:', error)
    } finally {
      setLoading(false)
    }
  }

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'payment':
      case 'withdrawal':
        return <ArrowUpRight className="w-5 h-5 text-green-400" />
      case 'deposit':
      case 'fee':
        return <ArrowDownLeft className="w-5 h-5 text-red-400" />
      case 'refund':
        return <RefreshCw className="w-5 h-5 text-cyan-400" />
      default:
        return <DollarSign className="w-5 h-5 text-gray-400" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-400 bg-green-400/10'
      case 'pending':
        return 'text-yellow-400 bg-yellow-400/10'
      case 'failed':
        return 'text-red-400 bg-red-400/10'
      default:
        return 'text-gray-400 bg-gray-400/10'
    }
  }

  if (!publicKey) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center py-20">
            <h2 className="text-2xl font-bold mb-4">Connect Your Wallet</h2>
            <p className="text-gray-400">Please connect your wallet to view transaction history</p>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
            Transaction History
          </h1>
          <p className="text-gray-400">View all your payments, deposits, and refunds</p>
        </div>

        {/* Filters */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filter === 'all'
                ? 'bg-purple-600 text-white'
                : 'bg-white/5 text-gray-400 hover:bg-white/10'
            }`}
          >
            All Transactions
          </button>
          <button
            onClick={() => setFilter('incoming')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filter === 'incoming'
                ? 'bg-green-600 text-white'
                : 'bg-white/5 text-gray-400 hover:bg-white/10'
            }`}
          >
            Incoming
          </button>
          <button
            onClick={() => setFilter('outgoing')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filter === 'outgoing'
                ? 'bg-red-600 text-white'
                : 'bg-white/5 text-gray-400 hover:bg-white/10'
            }`}
          >
            Outgoing
          </button>
        </div>

        {/* Transactions List */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="glass-card rounded-xl p-6 animate-pulse">
                <div className="h-6 bg-white/10 rounded w-1/3 mb-2"></div>
                <div className="h-4 bg-white/5 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : transactions.length === 0 ? (
          <div className="glass-card rounded-xl p-12 text-center">
            <DollarSign className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Transactions Yet</h3>
            <p className="text-gray-400 mb-6">Your transaction history will appear here</p>
            <Link
              href="/"
              className="inline-block bg-gradient-to-r from-purple-600 to-cyan-500 text-white px-6 py-3 rounded-lg hover:scale-105 transition-transform"
            >
              Browse Tasks
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {transactions.map((tx) => (
              <div
                key={tx.id}
                className="glass-card rounded-xl p-6 hover:bg-white/10 transition-all"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="p-3 bg-white/5 rounded-lg">
                      {getTransactionIcon(tx.transaction_type)}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="font-semibold text-lg capitalize">
                          {tx.transaction_type.replace('_', ' ')}
                        </h3>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(tx.status)}`}>
                          {tx.status}
                        </span>
                      </div>
                      
                      {tx.task && (
                        <p className="text-gray-400 text-sm mb-2">
                          Task: {tx.task.title}
                        </p>
                      )}
                      
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>{new Date(tx.created_at).toLocaleDateString()}</span>
                        <span>{new Date(tx.created_at).toLocaleTimeString()}</span>
                        {tx.solana_tx_hash && (
                          <a
                            href={`https://solscan.io/tx/${tx.solana_tx_hash}?cluster=devnet`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                          >
                            View on Solscan
                            <ArrowUpRight className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-2xl font-bold">
                      {tx.transaction_type === 'payment' || tx.transaction_type === 'refund' ? (
                        <span className="text-green-400">+${tx.amount.toFixed(2)}</span>
                      ) : (
                        <span className="text-red-400">-${tx.amount.toFixed(2)}</span>
                      )}
                    </div>
                    <div className="text-sm text-gray-500">{tx.currency}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
