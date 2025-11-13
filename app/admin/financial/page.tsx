'use client'
import { useEffect, useState } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { AdminLayout } from '@/components/AdminLayout'
import { getAllTransactions, processRefund } from '@/lib/admin'
import { supabase } from '@/lib/supabase'
import { DollarSign, TrendingUp, Download, Filter, CheckCircle, XCircle } from 'lucide-react'

export default function AdminFinancialPage() {
  const { publicKey } = useWallet()
  const [transactions, setTransactions] = useState<any[]>([])
  const [refundRequests, setRefundRequests] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalVolume: 0,
    platformRevenue: 0,
    pendingRefunds: 0,
    avgTransaction: 0
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    
    // Get transactions
    const { data: txData } = await getAllTransactions()
    setTransactions(txData || [])

    // Get refund requests
    const { data: refunds } = await supabase
      .from('refund_requests')
      .select(`
        *,
        task:tasks(title),
        client:users!refund_requests_requester_id_fkey(username)
      `)
      .order('created_at', { ascending: false })
    
    setRefundRequests(refunds || [])

    // Calculate stats
    const totalVolume = txData?.reduce((sum, tx) => sum + parseFloat(tx.amount), 0) || 0
    const platformRevenue = totalVolume * 0.1
    const pendingRefunds = refunds?.filter(r => r.status === 'pending').length || 0
    const avgTransaction = txData?.length ? totalVolume / txData.length : 0

    setStats({ totalVolume, platformRevenue, pendingRefunds, avgTransaction })
    setLoading(false)
  }

  const handleRefund = async (refundId: string, approved: boolean) => {
    if (!publicKey) return
    await processRefund(refundId, publicKey.toString(), approved)
    loadData()
  }

  const exportTransactions = () => {
    const csv = [
      ['Date', 'Type', 'Amount', 'User', 'Task', 'Status'].join(','),
      ...transactions.map(tx => [
        new Date(tx.created_at).toLocaleDateString(),
        tx.transaction_type,
        tx.amount,
        tx.user?.username || 'N/A',
        tx.task?.title || 'N/A',
        tx.status
      ].join(','))
    ].join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `transactions-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
  }


  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Financial Management</h1>
        <p className="text-text-secondary">Monitor transactions and process refunds</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <DollarSign className="w-8 h-8 text-green-400" />
            <span className="text-2xl font-bold">${stats.totalVolume.toFixed(2)}</span>
          </div>
          <p className="text-text-secondary text-sm">Total Volume</p>
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <TrendingUp className="w-8 h-8 text-purple-400" />
            <span className="text-2xl font-bold">${stats.platformRevenue.toFixed(2)}</span>
          </div>
          <p className="text-text-secondary text-sm">Platform Revenue</p>
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <XCircle className="w-8 h-8 text-orange-400" />
            <span className="text-2xl font-bold">{stats.pendingRefunds}</span>
          </div>
          <p className="text-text-secondary text-sm">Pending Refunds</p>
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <DollarSign className="w-8 h-8 text-cyan-400" />
            <span className="text-2xl font-bold">${stats.avgTransaction.toFixed(2)}</span>
          </div>
          <p className="text-text-secondary text-sm">Avg Transaction</p>
        </div>
      </div>

      {/* Refund Requests */}
      <div className="glass-card p-6 mb-8">
        <h2 className="text-xl font-bold mb-4">Refund Requests</h2>
        <div className="space-y-4">
          {refundRequests.filter(r => r.status === 'pending').length === 0 ? (
            <p className="text-center text-text-secondary py-4">No pending refund requests</p>
          ) : (
            refundRequests.filter(r => r.status === 'pending').map((refund) => (
              <div key={refund.id} className="bg-black/30 rounded-lg p-4 border border-white/10">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-semibold text-white">{refund.task?.title}</h3>
                    <p className="text-sm text-text-secondary">
                      Requested by @{refund.client?.username}
                    </p>
                  </div>
                  <span className="text-xl font-bold text-green-400">${refund.amount}</span>
                </div>
                <p className="text-sm text-text-secondary mb-4">{refund.reason}</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleRefund(refund.id, true)}
                    className="px-4 py-2 bg-green-500 hover:bg-green-600 rounded-lg text-white text-sm font-medium"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleRefund(refund.id, false)}
                    className="px-4 py-2 bg-red-500 hover:bg-red-600 rounded-lg text-white text-sm font-medium"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Transactions */}
      <div className="glass-card p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Recent Transactions</h2>
          <button
            onClick={exportTransactions}
            className="flex items-center gap-2 px-4 py-2 bg-purple-500 hover:bg-purple-600 rounded-lg text-white text-sm font-medium"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left py-3 px-4 text-sm font-medium text-text-secondary">Date</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-text-secondary">Type</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-text-secondary">Amount</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-text-secondary">User</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-text-secondary">Task</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-text-secondary">Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-text-secondary">
                    Loading transactions...
                  </td>
                </tr>
              ) : transactions.slice(0, 50).map((tx) => (
                <tr key={tx.id} className="border-b border-white/5 hover:bg-white/5">
                  <td className="py-3 px-4 text-sm">
                    {new Date(tx.created_at).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4 text-sm capitalize">{tx.transaction_type}</td>
                  <td className="py-3 px-4 text-sm font-medium">${tx.amount}</td>
                  <td className="py-3 px-4 text-sm">@{tx.user?.username || 'N/A'}</td>
                  <td className="py-3 px-4 text-sm">{tx.task?.title || 'N/A'}</td>
                  <td className="py-3 px-4">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      tx.status === 'completed' ? 'bg-green-400/20 text-green-300' :
                      tx.status === 'pending' ? 'bg-yellow-400/20 text-yellow-300' :
                      'bg-red-400/20 text-red-300'
                    }`}>
                      {tx.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  )
}
