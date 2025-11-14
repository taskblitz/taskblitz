'use client'
import { useState, useEffect } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { useRouter } from 'next/navigation'
import { DollarSign, Clock, FileText, Upload, Plus, X } from 'lucide-react'
import toast from 'react-hot-toast'
import { createTask } from '@/lib/database'
import { createTaskWithEscrow } from '@/lib/anchor-client'
import { useUser } from '@/contexts/UserContext'

interface TaskFormData {
  title: string
  description: string
  category: string
  difficulty: 'Easy' | 'Medium' | 'Hard'
  paymentPerWorker: string
  workersNeeded: string
  timeEstimate: string
  submissionType: 'text' | 'file' | 'url'
  requirements: string[]
  exampleSubmission: string
  currency: 'SOL' | 'USDC'
}

export function PostTaskForm() {
  const wallet = useWallet()
  const { connected, publicKey } = wallet
  const { user } = useUser()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [formData, setFormData] = useState<TaskFormData>({
    title: '',
    description: '',
    category: '',
    difficulty: 'Easy',
    paymentPerWorker: '',
    workersNeeded: '',
    timeEstimate: '',
    submissionType: 'url',
    requirements: [''],
    exampleSubmission: '',
    currency: 'SOL'
  })

  useEffect(() => {
    setMounted(true)
  }, [])

  const categories = [
    'Marketing', 'Social Media', 'Reviews', 'Research', 'Data Entry',
    'Testing', 'Content Creation', 'Community', 'Surveys', 'Other'
  ]

  const timeEstimates = [
    '< 1 hour', '1-2 hours', '2-4 hours', '4-8 hours', '1-2 days', '2-5 days', '1+ weeks'
  ]

  const handleInputChange = (field: keyof TaskFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const addRequirement = () => {
    setFormData(prev => ({
      ...prev,
      requirements: [...prev.requirements, '']
    }))
  }

  const updateRequirement = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      requirements: prev.requirements.map((req, i) => i === index ? value : req)
    }))
  }

  const removeRequirement = (index: number) => {
    setFormData(prev => ({
      ...prev,
      requirements: prev.requirements.filter((_, i) => i !== index)
    }))
  }



  const validateForm = () => {
    if (!formData.title.trim()) {
      toast.error('Please enter a task title')
      return false
    }
    if (!formData.description.trim()) {
      toast.error('Please enter a task description')
      return false
    }
    if (!formData.category) {
      toast.error('Please select a category')
      return false
    }
    if (!formData.paymentPerWorker || parseFloat(formData.paymentPerWorker) < 0.10) {
      toast.error('Payment per worker must be at least $0.10')
      return false
    }
    if (!formData.workersNeeded || parseInt(formData.workersNeeded) <= 0) {
      toast.error('Please enter number of workers needed')
      return false
    }
    if (!formData.timeEstimate) {
      toast.error('Please select a time estimate')
      return false
    }
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!connected) {
      toast.error('Please connect your wallet to post a task')
      return
    }

    if (!validateForm()) return

    setLoading(true)
    const loadingToast = toast.loading('Creating task...')
    
    try {
      if (!publicKey) {
        toast.dismiss(loadingToast)
        toast.error('Wallet not connected')
        return
      }

      // Filter out empty requirements
      const cleanRequirements = formData.requirements.filter(req => req.trim() !== '')
      
      const paymentPerWorker = parseFloat(formData.paymentPerWorker)
      const workersNeeded = parseInt(formData.workersNeeded)
      
      // Create task in database WITH escrow
      const newTask = await createTask({
        title: formData.title.trim(),
        description: formData.description.trim(),
        category: formData.category,
        paymentPerWorker,
        workersNeeded,
        timeEstimate: formData.timeEstimate,
        submissionType: formData.submissionType,
        requesterWallet: publicKey.toString(),
        requirements: cleanRequirements,
        exampleSubmission: formData.exampleSubmission.trim() || undefined,
        currency: formData.currency
      }, async (taskId: string) => {
        // Lock funds in escrow using Anchor
        toast.loading(`Locking ${formData.currency} in escrow...`, { id: loadingToast })
        const txHash = await createTaskWithEscrow(
          wallet,
          taskId,
          paymentPerWorker,
          workersNeeded,
          formData.currency
        )
        return txHash
      })
      
      console.log('Task posted successfully:', newTask)
      
      toast.dismiss(loadingToast)
      toast.success('✅ Task posted! Funds locked in escrow.')
      
      // Redirect after a short delay
      setTimeout(() => router.push('/'), 1500)
    } catch (error: any) {
      console.error('Error posting task:', error)
      toast.dismiss(loadingToast)
      toast.error(error.message || 'Failed to post task. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (!mounted) {
    return (
      <div className="glass-card p-8 text-center">
        <div className="animate-pulse">
          <div className="h-6 bg-white/10 rounded mb-4"></div>
          <div className="h-4 bg-white/5 rounded mb-6"></div>
          <div className="h-12 bg-white/10 rounded"></div>
        </div>
      </div>
    )
  }

  if (!connected) {
    return (
      <div className="glass-card p-8 text-center">
        <h2 className="text-xl font-semibold mb-4">Connect Your Wallet</h2>
        <p className="text-text-secondary mb-6">
          You need to connect your Solana wallet to post tasks and manage payments.
        </p>
        <WalletMultiButton />
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Basic Information */}
      <div className="glass-card p-8">
        <h2 className="text-xl font-semibold mb-6 flex items-center">
          <FileText className="w-5 h-5 mr-2 text-purple-400" />
          Basic Information
        </h2>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Task Title *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="e.g., Write 5 product descriptions for e-commerce store"
              className="w-full glass-card px-4 py-3 bg-transparent border-white/20 rounded-lg focus:border-purple-400 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Description *</label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Provide detailed information about what needs to be done..."
              rows={6}
              className="w-full glass-card px-4 py-3 bg-transparent border-white/20 rounded-lg focus:border-purple-400 focus:outline-none resize-none"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Category *</label>
              <select
                value={formData.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
                className="w-full glass-card px-4 py-3 bg-transparent border-white/20 rounded-lg focus:border-purple-400 focus:outline-none text-white"
                required
              >
                <option value="" className="bg-gray-800">Select a category</option>
                {categories.map(category => (
                  <option key={category} value={category} className="bg-gray-800">
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Difficulty</label>
              <select
                value={formData.difficulty}
                onChange={(e) => handleInputChange('difficulty', e.target.value as 'Easy' | 'Medium' | 'Hard')}
                className="w-full glass-card px-4 py-3 bg-transparent border-white/20 rounded-lg focus:border-purple-400 focus:outline-none text-white"
              >
                <option value="Easy" className="bg-gray-800">Easy</option>
                <option value="Medium" className="bg-gray-800">Medium</option>
                <option value="Hard" className="bg-gray-800">Hard</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Payment & Workers */}
      <div className="glass-card p-8">
        <h2 className="text-xl font-semibold mb-6 flex items-center">
          <DollarSign className="w-5 h-5 mr-2 text-green-400" />
          Payment & Workers
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">Currency *</label>
            <select
              value={formData.currency}
              onChange={(e) => handleInputChange('currency', e.target.value)}
              className="w-full glass-card px-4 py-3 bg-transparent border-white/20 rounded-lg focus:border-purple-400 focus:outline-none text-white"
            >
              <option value="SOL" className="bg-gray-800">SOL (Solana) - Devnet</option>
              <option value="USDC" className="bg-gray-800">USDC (Stablecoin)</option>
            </select>
            <p className="text-xs text-text-muted mt-1">
              {formData.currency === 'SOL' ? 'Live SOL/USD rate' : '1:1 with USD'}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Payment Per Worker (USD) *</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-green-400">$</span>
              <input
                type="number"
                step="0.01"
                min="0.10"
                value={formData.paymentPerWorker}
                onChange={(e) => handleInputChange('paymentPerWorker', e.target.value)}
                placeholder="0.50"
                className="w-full glass-card pl-8 pr-4 py-3 bg-transparent border-white/20 rounded-lg focus:border-purple-400 focus:outline-none"
                required
              />
            </div>
            <p className="text-xs text-text-muted mt-1">Minimum: $0.10</p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Workers Needed *</label>
            <input
              type="number"
              min="1"
              max="10000"
              value={formData.workersNeeded}
              onChange={(e) => handleInputChange('workersNeeded', e.target.value)}
              placeholder="100"
              className="w-full glass-card px-4 py-3 bg-transparent border-white/20 rounded-lg focus:border-purple-400 focus:outline-none"
              required
            />
            <p className="text-xs text-text-muted mt-1">How many people should complete this task</p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Time Estimate *</label>
            <select
              value={formData.timeEstimate}
              onChange={(e) => handleInputChange('timeEstimate', e.target.value)}
              className="w-full glass-card px-4 py-3 bg-transparent border-white/20 rounded-lg focus:border-purple-400 focus:outline-none text-white"
              required
            >
              <option value="" className="bg-gray-800">Select time estimate</option>
              {timeEstimates.map(time => (
                <option key={time} value={time} className="bg-gray-800">
                  {time}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Cost Calculator */}
        {formData.paymentPerWorker && formData.workersNeeded && (
          <div className="mt-6 glass-card p-4 bg-purple-500/10 border-purple-500/20">
            <h3 className="text-sm font-medium mb-2">Total Cost Breakdown:</h3>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span>Worker Payments:</span>
                <span>${(parseFloat(formData.paymentPerWorker) * parseInt(formData.workersNeeded)).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Platform Fee (10%):</span>
                <span>${((parseFloat(formData.paymentPerWorker) * parseInt(formData.workersNeeded)) * 0.1).toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-semibold text-green-400 border-t border-white/10 pt-1">
                <span>Total Deposit:</span>
                <span>${((parseFloat(formData.paymentPerWorker) * parseInt(formData.workersNeeded)) * 1.1).toFixed(2)}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Requirements */}
      <div className="glass-card p-8">
        <h2 className="text-xl font-semibold mb-6">Requirements</h2>
        
        <div className="space-y-4">
          {formData.requirements.map((requirement, index) => (
            <div key={index} className="flex items-center space-x-3">
              <input
                type="text"
                value={requirement}
                onChange={(e) => updateRequirement(index, e.target.value)}
                placeholder="e.g., Native English speaker preferred"
                className="flex-1 glass-card px-4 py-3 bg-transparent border-white/20 rounded-lg focus:border-purple-400 focus:outline-none"
              />
              {formData.requirements.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeRequirement(index)}
                  className="p-2 text-red-400 hover:text-red-300 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
          
          <button
            type="button"
            onClick={addRequirement}
            className="flex items-center text-purple-400 hover:text-purple-300 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Requirement
          </button>
        </div>
      </div>

      {/* Submission Type */}
      <div className="glass-card p-8">
        <h2 className="text-xl font-semibold mb-6">How Workers Submit Proof</h2>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-3">Submission Type *</label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <label className="cursor-pointer block">
                <input
                  type="radio"
                  name="submissionType"
                  value="text"
                  checked={formData.submissionType === 'text'}
                  onChange={(e) => handleInputChange('submissionType', e.target.value)}
                  className="sr-only"
                />
                <div className={`glass-card p-4 text-center border-2 transition-all relative ${
                  formData.submissionType === 'text' 
                    ? 'border-purple-500 bg-purple-500/30 shadow-lg shadow-purple-500/20 scale-105' 
                    : 'border-white/20 hover:border-purple-400 hover:bg-white/5'
                }`}>
                  {formData.submissionType === 'text' && (
                    <div className="absolute top-2 right-2 w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                  <FileText className={`w-6 h-6 mx-auto mb-2 ${formData.submissionType === 'text' ? 'text-purple-300' : 'text-purple-400'}`} />
                  <div className={`font-medium ${formData.submissionType === 'text' ? 'text-white' : ''}`}>Text Response</div>
                  <div className="text-xs text-text-muted mt-1">Workers type their response</div>
                </div>
              </label>

              <label className="cursor-pointer block">
                <input
                  type="radio"
                  name="submissionType"
                  value="url"
                  checked={formData.submissionType === 'url'}
                  onChange={(e) => handleInputChange('submissionType', e.target.value)}
                  className="sr-only"
                />
                <div className={`glass-card p-4 text-center border-2 transition-all relative ${
                  formData.submissionType === 'url' 
                    ? 'border-cyan-500 bg-cyan-500/30 shadow-lg shadow-cyan-500/20 scale-105' 
                    : 'border-white/20 hover:border-cyan-400 hover:bg-white/5'
                }`}>
                  {formData.submissionType === 'url' && (
                    <div className="absolute top-2 right-2 w-5 h-5 bg-cyan-500 rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                  <Clock className={`w-6 h-6 mx-auto mb-2 ${formData.submissionType === 'url' ? 'text-cyan-300' : 'text-purple-400'}`} />
                  <div className={`font-medium ${formData.submissionType === 'url' ? 'text-white' : ''}`}>URL/Link</div>
                  <div className="text-xs text-text-muted mt-1">Social media posts, websites</div>
                </div>
              </label>

              <label className="cursor-pointer block">
                <input
                  type="radio"
                  name="submissionType"
                  value="file"
                  checked={formData.submissionType === 'file'}
                  onChange={(e) => handleInputChange('submissionType', e.target.value)}
                  className="sr-only"
                />
                <div className={`glass-card p-4 text-center border-2 transition-all relative ${
                  formData.submissionType === 'file' 
                    ? 'border-green-500 bg-green-500/30 shadow-lg shadow-green-500/20 scale-105' 
                    : 'border-white/20 hover:border-green-400 hover:bg-white/5'
                }`}>
                  {formData.submissionType === 'file' && (
                    <div className="absolute top-2 right-2 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                  <Upload className={`w-6 h-6 mx-auto mb-2 ${formData.submissionType === 'file' ? 'text-green-300' : 'text-purple-400'}`} />
                  <div className={`font-medium ${formData.submissionType === 'file' ? 'text-white' : ''}`}>File Upload</div>
                  <div className="text-xs text-text-muted mt-1">Images, documents, screenshots</div>
                </div>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Example Submission (Optional)</label>
            <input
              type="text"
              value={formData.exampleSubmission}
              onChange={(e) => handleInputChange('exampleSubmission', e.target.value)}
              placeholder={
                formData.submissionType === 'text' ? 'Example: "I posted the tweet and got 15 likes..."' :
                formData.submissionType === 'url' ? 'Example: https://twitter.com/username/status/123456' :
                'Example: Screenshot showing completed task'
              }
              className="w-full glass-card px-4 py-3 bg-transparent border-white/20 rounded-lg focus:border-purple-400 focus:outline-none"
            />
            <p className="text-xs text-text-muted mt-1">Help workers understand what you expect</p>
          </div>
        </div>
      </div>



      {/* Submit */}
      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="glass-card px-6 py-3 rounded-lg hover:bg-white/20 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="gradient-primary text-white font-semibold px-8 py-3 rounded-xl hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Posting Task...
            </>
          ) : (
            'Post Task'
          )}
        </button>
      </div>
    </form>
  )
}