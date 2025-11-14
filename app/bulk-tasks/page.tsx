'use client'
import { useState, useEffect } from 'react'
import { Header } from '@/components/Header'
import { useWallet } from '@solana/wallet-adapter-react'
import { createBulkTaskJob, getUserBulkJobs, processBulkTaskJob } from '@/lib/bulk-tasks'
import { BulkTaskJob } from '@/types/advanced-features'
import { Upload, Download, CheckCircle, XCircle, Clock, FileText } from 'lucide-react'
import toast from 'react-hot-toast'

export default function BulkTasksPage() {
  const { publicKey } = useWallet()
  const [jobs, setJobs] = useState<BulkTaskJob[]>([])
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    if (publicKey) {
      loadJobs()
    }
  }, [publicKey])

  async function loadJobs() {
    if (!publicKey) return
    
    try {
      const data = await getUserBulkJobs(publicKey.toString())
      setJobs(data)
    } catch (error) {
      console.error('Error loading jobs:', error)
    }
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file || !publicKey) return
    
    if (!file.name.endsWith('.csv')) {
      toast.error('Please upload a CSV file')
      return
    }
    
    // Check file size (5MB limit)
    const maxSize = 5 * 1024 * 1024 // 5MB in bytes
    if (file.size > maxSize) {
      toast.error('File size must be less than 5MB')
      return
    }
    
    try {
      setUploading(true)
      const job = await createBulkTaskJob(publicKey.toString(), file)
      toast.success('File uploaded! Processing tasks...')
      
      // Start processing in background
      processBulkTaskJob(job.id).catch(console.error)
      
      loadJobs()
    } catch (error) {
      console.error('Error uploading file:', error)
      toast.error('Failed to upload file')
    } finally {
      setUploading(false)
    }
  }

  function downloadTemplate() {
    const csv = `title,description,category,difficulty,reward,estimated_time,requirements,deliverables
"Write a product description","Write a 200-word description for a tech product","Content Writing","easy",15,30,"Good English skills","Product description in Google Doc"
"Social media post","Create an engaging Instagram post","Social Media","easy",10,15,"Creative writing","Post text and hashtags"
"Data entry task","Enter 100 records into spreadsheet","Data Entry","easy",20,60,"Attention to detail","Completed spreadsheet"`
    
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'bulk-tasks-template.csv'
    a.click()
  }

  if (!publicKey) {
    return (
      <main className="min-h-screen">
        <Header />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="glass-card p-12 text-center">
            <h1 className="text-3xl font-bold mb-4">Bulk Task Creation</h1>
            <p className="text-text-secondary mb-6">Connect your wallet to create multiple tasks at once</p>
          </div>
        </div>      </main>
    )
  }

  return (
    <main className="min-h-screen">
      <Header />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
          Bulk Task Creation
        </h1>
        <p className="text-text-secondary mb-8">Upload a CSV file to create multiple tasks at once</p>

        {/* Upload Section */}
        <div className="glass-card p-8 mb-8">
          <h2 className="text-2xl font-bold mb-4">Upload Tasks</h2>
          
          <div className="mb-6">
            <button
              onClick={downloadTemplate}
              className="btn-secondary flex items-center gap-2 mb-4"
            >
              <Download className="w-5 h-5" />
              Download CSV Template
            </button>
            <p className="text-text-secondary text-sm">
              Download the template, fill in your task details, and upload it below
            </p>
          </div>

          <div className="border-2 border-dashed border-white/20 rounded-lg p-12 text-center hover:border-purple-400/50 transition-colors">
            <input
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              className="hidden"
              id="csv-upload"
              disabled={uploading}
            />
            <label htmlFor="csv-upload" className="cursor-pointer">
              <Upload className="w-12 h-12 text-purple-400 mx-auto mb-4" />
              <p className="text-lg font-semibold mb-2">
                {uploading ? 'Uploading...' : 'Click to upload CSV file'}
              </p>
              <p className="text-text-secondary text-sm">
                or drag and drop your file here
              </p>
            </label>
          </div>

          <div className="mt-6 bg-black/30 p-4 rounded-lg">
            <h3 className="font-semibold mb-2 text-purple-400">CSV Format Requirements:</h3>
            <ul className="text-sm text-text-secondary space-y-1">
              <li>• Required columns: title, description, category, difficulty, reward</li>
              <li>• Optional columns: estimated_time, requirements, deliverables</li>
              <li>• Difficulty must be: easy, medium, or hard</li>
              <li>• Reward must be a number (in USDC)</li>
              <li>• Maximum file size: 5MB</li>
              <li>• Recommended: Keep under 1000 tasks per file</li>
            </ul>
          </div>
        </div>

        {/* Jobs History */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Upload History</h2>
          {jobs.length === 0 ? (
            <div className="glass-card p-12 text-center">
              <FileText className="w-12 h-12 text-text-muted mx-auto mb-4" />
              <p className="text-text-secondary">No bulk uploads yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {jobs.map(job => (
                <div key={job.id} className="glass-card p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      {job.status === 'completed' && <CheckCircle className="w-6 h-6 text-green-400" />}
                      {job.status === 'failed' && <XCircle className="w-6 h-6 text-red-400" />}
                      {job.status === 'processing' && <Clock className="w-6 h-6 text-yellow-400 animate-spin" />}
                      {job.status === 'pending' && <Clock className="w-6 h-6 text-text-muted" />}
                      <div>
                        <h3 className="font-semibold">
                          {job.status === 'completed' && 'Upload Completed'}
                          {job.status === 'failed' && 'Upload Failed'}
                          {job.status === 'processing' && 'Processing...'}
                          {job.status === 'pending' && 'Pending'}
                        </h3>
                        <p className="text-text-secondary text-sm">
                          {new Date(job.created_at).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-text-muted text-sm">Total Tasks</p>
                      <p className="text-xl font-semibold">{job.total_tasks}</p>
                    </div>
                    <div>
                      <p className="text-text-muted text-sm">Successful</p>
                      <p className="text-xl font-semibold text-green-400">{job.successful_tasks}</p>
                    </div>
                    <div>
                      <p className="text-text-muted text-sm">Failed</p>
                      <p className="text-xl font-semibold text-red-400">{job.failed_tasks}</p>
                    </div>
                    <div>
                      <p className="text-text-muted text-sm">Progress</p>
                      <p className="text-xl font-semibold">
                        {Math.round((job.processed_tasks / job.total_tasks) * 100)}%
                      </p>
                    </div>
                  </div>

                  {job.error_log && job.error_log.length > 0 && (
                    <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                      <h4 className="font-semibold text-red-400 mb-2">Errors:</h4>
                      <div className="space-y-1 text-sm text-text-secondary max-h-32 overflow-y-auto">
                        {job.error_log.map((error, i) => (
                          <p key={i}>Row {error.row}: {error.error}</p>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>    </main>
  )
}
