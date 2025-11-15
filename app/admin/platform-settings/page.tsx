'use client'
import { useEffect, useState } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { AdminLayout } from '@/components/AdminLayout'
import { supabase } from '@/lib/supabase'
import { Settings, Wallet, DollarSign, Save, AlertCircle } from 'lucide-react'

interface PlatformSettings {
  platform_wallet_address: string
  platform_fee_percentage: string
  minimum_task_payment: string
}

export default function PlatformSettingsPage() {
  const { publicKey } = useWallet()
  const [settings, setSettings] = useState<PlatformSettings>({
    platform_wallet_address: '',
    platform_fee_percentage: '10',
    minimum_task_payment: '0.10'
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    setLoading(true)
    const { data } = await supabase
      .from('platform_settings')
      .select('*')

    if (data) {
      const settingsMap: any = {}
      data.forEach(item => {
        settingsMap[item.setting_key] = item.setting_value
      })
      
      setSettings({
        platform_wallet_address: settingsMap.platform_wallet_address || '',
        platform_fee_percentage: settingsMap.platform_fee_percentage || '10',
        minimum_task_payment: settingsMap.minimum_task_payment || '0.10'
      })
    }
    setLoading(false)
  }

  const handleSave = async () => {
    if (!publicKey) {
      setMessage({ type: 'error', text: 'Please connect your wallet' })
      return
    }

    // Validate wallet address
    if (!settings.platform_wallet_address || settings.platform_wallet_address.length < 32) {
      setMessage({ type: 'error', text: 'Invalid wallet address' })
      return
    }

    // Validate fee percentage
    const fee = parseFloat(settings.platform_fee_percentage)
    if (isNaN(fee) || fee < 0 || fee > 50) {
      setMessage({ type: 'error', text: 'Fee percentage must be between 0 and 50' })
      return
    }

    // Validate minimum payment
    const minPayment = parseFloat(settings.minimum_task_payment)
    if (isNaN(minPayment) || minPayment < 0) {
      setMessage({ type: 'error', text: 'Minimum payment must be a positive number' })
      return
    }

    setSaving(true)
    setMessage(null)

    try {
      // Update each setting
      const updates = [
        { key: 'platform_wallet_address', value: settings.platform_wallet_address },
        { key: 'platform_fee_percentage', value: settings.platform_fee_percentage },
        { key: 'minimum_task_payment', value: settings.minimum_task_payment }
      ]

      for (const update of updates) {
        const { error } = await supabase
          .from('platform_settings')
          .upsert({
            setting_key: update.key,
            setting_value: update.value,
            updated_at: new Date().toISOString()
          }, {
            onConflict: 'setting_key'
          })

        if (error) throw error
      }

      setMessage({ type: 'success', text: 'Settings saved successfully! Remember to update your .env.local file and restart the dev server.' })
    } catch (error: any) {
      setMessage({ type: 'error', text: 'Error saving settings: ' + error.message })
    } finally {
      setSaving(false)
    }
  }

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Platform Settings</h1>
        <p className="text-text-secondary">Configure platform wallet and fee structure</p>
      </div>

      {message && (
        <div className={`mb-6 p-4 rounded-lg flex items-start gap-3 ${
          message.type === 'success' ? 'bg-green-500/20 border border-green-500/30' : 'bg-red-500/20 border border-red-500/30'
        }`}>
          <AlertCircle className={`w-5 h-5 mt-0.5 ${message.type === 'success' ? 'text-green-400' : 'text-red-400'}`} />
          <p className={message.type === 'success' ? 'text-green-300' : 'text-red-300'}>{message.text}</p>
        </div>
      )}

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent"></div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Platform Wallet */}
          <div className="glass-card p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Wallet className="w-6 h-6 text-purple-400" />
              Platform Wallet Address
            </h2>
            <p className="text-sm text-text-secondary mb-4">
              This is where all platform fees will be sent. Make sure you control this wallet.
            </p>
            <input
              type="text"
              value={settings.platform_wallet_address}
              onChange={(e) => setSettings({ ...settings, platform_wallet_address: e.target.value })}
              className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-3 text-white font-mono text-sm"
              placeholder="Enter Solana wallet address..."
            />
            <p className="text-xs text-text-secondary mt-2">
              Current: {settings.platform_wallet_address || 'Not set'}
            </p>
          </div>

          {/* Fee Configuration */}
          <div className="glass-card p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <DollarSign className="w-6 h-6 text-cyan-400" />
              Fee Configuration
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Platform Fee Percentage
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    min="0"
                    max="50"
                    step="0.1"
                    value={settings.platform_fee_percentage}
                    onChange={(e) => setSettings({ ...settings, platform_fee_percentage: e.target.value })}
                    className="flex-1 bg-black/30 border border-white/10 rounded-lg px-4 py-3 text-white"
                  />
                  <span className="text-white font-medium">%</span>
                </div>
                <p className="text-xs text-text-secondary mt-2">
                  Recommended: 5-15%. Current industry standard is around 10%.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Minimum Task Payment (USD)
                </label>
                <div className="flex items-center gap-3">
                  <span className="text-white font-medium">$</span>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={settings.minimum_task_payment}
                    onChange={(e) => setSettings({ ...settings, minimum_task_payment: e.target.value })}
                    className="flex-1 bg-black/30 border border-white/10 rounded-lg px-4 py-3 text-white"
                  />
                </div>
                <p className="text-xs text-text-secondary mt-2">
                  Minimum payment per worker to prevent spam tasks.
                </p>
              </div>
            </div>
          </div>

          {/* Environment Variables Notice */}
          <div className="glass-card p-6 bg-yellow-500/10 border-yellow-500/30">
            <h3 className="text-lg font-bold mb-2 text-yellow-300">⚠️ Important</h3>
            <p className="text-sm text-yellow-200 mb-3">
              After saving these settings, you must also update your <code className="bg-black/30 px-2 py-1 rounded">.env.local</code> file:
            </p>
            <div className="bg-black/50 rounded-lg p-4 font-mono text-xs text-gray-300 space-y-1">
              <div>NEXT_PUBLIC_PLATFORM_WALLET={settings.platform_wallet_address || 'YOUR_WALLET_HERE'}</div>
              <div>NEXT_PUBLIC_PLATFORM_FEE_PERCENTAGE={settings.platform_fee_percentage}</div>
              <div>NEXT_PUBLIC_MIN_TASK_PAYMENT={settings.minimum_task_payment}</div>
            </div>
            <p className="text-sm text-yellow-200 mt-3">
              Then restart your development server for changes to take effect.
            </p>
          </div>

          {/* Save Button */}
          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full gradient-primary text-white font-semibold px-6 py-4 rounded-lg hover:scale-105 transition-transform disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center gap-2"
          >
            {saving ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                Saving...
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                Save Platform Settings
              </>
            )}
          </button>
        </div>
      )}
    </AdminLayout>
  )
}
