'use client'
import { useState, useEffect, useCallback } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { ArrowLeft, Clock, Users, DollarSign, Calendar, User, MessageSquare } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { getTaskById, submitWork } from '@/lib/database'
import { useUser } from '@/contexts/UserContext'
import toast from 'react-hot-toast'
import { FileUpload } from './FileUpload'
import { UsernameLink } from './UsernameLink'
import { ApplicationButton } from './ApplicationButton'
import { ApplicationsManager } from './ApplicationsManager'

interface TaskDetailProps {
  taskId: string
}

// Mock task data - will replace with Supabase
const mockTaskDetail = {
  id: '1',
  title: 'DM @elonmusk about TaskBlitz on X',
  description: `Send a direct message to @elonmusk on X (Twitter) telling him about TaskBlitz platform. Be polite and professional. Include the website: taskblitz.click

Message should include:
- Brief introduction of yourself
- Mention TaskBlitz as a new Solana-based micro-task platform
- Include the website: taskblitz.click
- Be respectful and professional
- Keep it under 280 characters

Example message: "Hi Elon! I wanted to share TaskBlitz.click - a new Solana-based platform for micro-tasks with instant crypto payments. Thought you might find it interesting given your support for crypto innovation!"`,
  paymentPerWorker: 0.50,
  category: 'Marketing',
  difficulty: 'Easy' as const,
  timeEstimate: '5 minutes',
  postedBy: 'taskblitz_team',
  postedAt: new Date('2024-11-01'),
  deadline: new Date('2024-11-08'),
  status: 'open',
  workersNeeded: 100,
  workersCompleted: 23,
  submissionType: 'url' as const,
  requirements: [
    "Must have X (Twitter) account",
    "Account must be at least 30 days old",
    "Must not be spam account",
    "Must actually send the DM"
  ],
  exampleSubmission: 'https://x.com/messages/compose?recipient_id=44196397'
}

export function TaskDetail({ taskId }: TaskDetailProps) {
  const { connected, publicKey } = useWallet()
  const { user } = useUser()
  const router = useRouter()
  const [task, setTask] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [showSubmissionModal, setShowSubmissionModal] = useState(false)
  const [submissionText, setSubmissionText] = useState('')
  const [submissionUrl, setSubmissionUrl] = useState('')
  const [submissionFileUrl, setSubmissionFileUrl] = useState('')
  const [submissionFileName, setSubmissionFileName] = useState('')
  const [submissionFileSize, setSubmissionFileSize] = useState(0)
  const [submissionFileType, setSubmissionFileType] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [canSubmit, setCanSubmit] = useState(false)

  const fetchTask = useCallback(async () => {
    try {
      setLoading(true)
      const data = await getTaskById(taskId)
      
      // Transform data to match component expectations
      const transformedTask = {
        id: data.id,
        title: data.title,
        description: data.description,
        paymentPerWorker: data.payment_per_task,
        category: data.category,
        difficulty: 'Easy', // We'll add this field later
        timeEstimate: '1-2 hours', // We'll add this field later
        postedBy: data.requester?.username || data.requester?.wallet_address || 'unknown',
        requesterWallet: data.requester?.wallet_address,
        postedAt: new Date(data.created_at),
        deadline: new Date(data.deadline),
        status: data.status,
        workersNeeded: data.workers_needed,
        workersCompleted: data.workers_completed,
        submissionType: data.submission_type,
        requirements: data.requirements || [],
        exampleSubmission: data.example_submission,
        submissions: data.submissions || []
      }
      
      setTask(transformedTask)
    } catch (error) {
      console.error('Error fetching task:', error)
      setTask(mockTaskDetail) // Fallback to mock data
    } finally {
      setLoading(false)
    }
  }, [taskId])

  useEffect(() => {
    setMounted(true)
    fetchTask()
  }, [taskId, fetchTask])

  const difficultyColors = {
    Easy: 'text-green-400 bg-green-400/20',
    Medium: 'text-yellow-400 bg-yellow-400/20',
    Hard: 'text-red-400 bg-red-400/20'
  }

  const formatTimeAgo = (date: Date | string | undefined) => {
    if (!date) return 'Unknown'
    const dateObj = typeof date === 'string' ? new Date(date) : date
    if (isNaN(dateObj.getTime())) return 'Unknown'
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - dateObj.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return 'Just posted'
    if (diffInHours < 24) return `${diffInHours}h ago`
    const diffInDays = Math.floor(diffInHours / 24)
    return `${diffInDays}d ago`
  }

  const handleStartTask = () => {
    if (!connected) {
      alert('Please connect your wallet to complete tasks')
      return
    }
    
    // Check if task is still available
    if (task.status !== 'open' || task.workersCompleted >= task.workersNeeded) {
      alert('This task is no longer available')
      return
    }
    
    setShowSubmissionModal(true)
  }

  const handleSubmitWork = async () => {
    if (!publicKey) {
      toast.error('Please connect your wallet')
      return
    }

    let submissionData: any = {
      taskId,
      workerWallet: publicKey.toString(),
      submissionType: task.submissionType
    }

    // Validate and add submission data based on type
    if (task.submissionType === 'text') {
      if (!submissionText.trim()) {
        toast.error('Please enter your submission text')
        return
      }
      submissionData.submissionText = submissionText.trim()
    } else if (task.submissionType === 'url') {
      if (!submissionUrl.trim()) {
        toast.error('Please enter a valid URL')
        return
      }
      submissionData.submissionUrl = submissionUrl.trim()
    } else if (task.submissionType === 'file') {
      if (!submissionFileUrl) {
        toast.error('Please upload a file')
        return
      }
      submissionData.submissionFileUrl = submissionFileUrl
      submissionData.fileName = submissionFileName
      submissionData.fileSize = submissionFileSize
      submissionData.fileType = submissionFileType
    }

    try {
      setSubmitting(true)
      await submitWork(submissionData)
      
      setShowSubmissionModal(false)
      setSubmissionText('')
      setSubmissionUrl('')
      setSubmissionFileUrl('')
      setSubmissionFileName('')
      toast.success('Work submitted successfully! You will be notified when reviewed.')
      
      // Refresh task data to show updated count
      await fetchTask()
      
      router.push('/my-tasks')
    } catch (error: any) {
      console.error('Error submitting work:', error)
      toast.error(error.message || 'Failed to submit work. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-8">
      {/* Back button */}
      <button 
        onClick={() => router.back()}
        className="flex items-center text-purple-400 hover:text-purple-300 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to marketplace
      </button>

      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400"></div>
          <span className="ml-2 text-text-secondary">Loading task...</span>
        </div>
      )}

      {!loading && !task && (
        <div className="glass-card p-8 text-center">
          <h2 className="text-xl font-semibold mb-4">Task Not Found</h2>
          <p className="text-text-secondary mb-6">
            The task you&apos;re looking for doesn&apos;t exist or has been removed.
          </p>
          <Link href="/" className="gradient-primary text-white px-6 py-3 rounded-lg hover:scale-105 transition-transform inline-block">
            Back to Marketplace
          </Link>
        </div>
      )}

      {!loading && task && (
        <>

      {/* Task header */}
      <div className="glass-card p-8">
        <div className="flex flex-col lg:flex-row lg:items-start gap-6">
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-3 mb-4">
              <span className="text-sm px-3 py-1 rounded-full bg-purple-500/20 text-purple-300">
                {task.category}
              </span>
              <span className={`text-sm px-3 py-1 rounded-full ${difficultyColors[task.difficulty as keyof typeof difficultyColors] || difficultyColors.Easy}`}>
                {task.difficulty}
              </span>
            </div>
            
            <h1 className="text-3xl font-bold mb-4">{task.title}</h1>
            
            <div className="flex flex-wrap items-center gap-4 text-sm text-text-secondary">
              <div className="flex items-center">
                <User className="w-4 h-4 mr-2" />
                <span>by <UsernameLink 
                  username={task.postedBy}
                  walletAddress={task.requesterWallet || task.postedBy}
                /></span>
              </div>
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                <span>Posted {formatTimeAgo(task.postedAt)}</span>
              </div>
              <div className="flex items-center">
                <Users className="w-4 h-4 mr-2" />
                <span>{task.workersCompleted} completed</span>
              </div>
            </div>
          </div>

          <div className="w-full lg:w-80 flex-shrink-0">
            <div className="glass-card p-6 mb-4">
              <div className="flex items-center justify-center text-green-400 font-bold text-2xl mb-2">
                <span>${task.paymentPerWorker}</span>
              </div>
              <div className="text-sm text-text-muted text-center">
                per completion
              </div>
              <div className="flex items-center justify-center text-sm text-text-secondary mt-2">
                <Clock className="w-4 h-4 mr-2" />
                <span>{task.timeEstimate}</span>
              </div>
            </div>

            {/* Progress */}
            <div className="glass-card p-4 mb-4">
              <div className="flex justify-between text-sm mb-2">
                <span>Progress</span>
                <span>{task.workersCompleted}/{task.workersNeeded}</span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-purple-500 to-cyan-500 h-2 rounded-full"
                  style={{ width: `${Math.min((task.workersCompleted / task.workersNeeded) * 100, 100)}%` }}
                />
              </div>
              <div className="text-xs text-text-muted mt-1">
                {task.workersNeeded - task.workersCompleted} spots remaining
              </div>
            </div>
            
            {!mounted ? (
              <div className="w-full gradient-primary text-white font-semibold py-3 px-6 rounded-xl text-center">
                Loading...
              </div>
            ) : !connected ? (
              <div className="space-y-3">
                <WalletMultiButton className="w-full" />
                <p className="text-xs text-text-muted text-center">
                  Connect your wallet to complete tasks
                </p>
              </div>
            ) : task.status === 'open' && task.workersCompleted < task.workersNeeded ? (
              <>
                {/* Application Button for application-based tasks */}
                {task.task_mode === 'application' && !canSubmit && (
                  <ApplicationButton
                    taskId={task.id}
                    taskMode={task.task_mode}
                    onApproved={() => setCanSubmit(true)}
                  />
                )}
                
                {/* Submit button - show for open tasks OR approved application tasks */}
                {(task.task_mode === 'open' || canSubmit) && (
                  <button 
                    onClick={handleStartTask}
                    className="w-full gradient-primary text-white font-semibold py-3 px-6 rounded-xl hover:scale-105 transition-transform"
                  >
                    Complete This Task
                  </button>
                )}
              </>
            ) : task.status === 'completed' || task.workersCompleted >= task.workersNeeded ? (
              <button 
                disabled
                className="w-full bg-gray-600 text-gray-300 font-semibold py-3 px-6 rounded-xl cursor-not-allowed"
              >
                Task Full
              </button>
            ) : (
              <button 
                disabled
                className="w-full bg-gray-600 text-gray-300 font-semibold py-3 px-6 rounded-xl cursor-not-allowed"
              >
                Task Expired
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Task description */}
      <div className="glass-card p-8">
        <h2 className="text-xl font-semibold mb-4">Description</h2>
        <div className="prose prose-invert max-w-none">
          <p className="text-text-secondary whitespace-pre-line">{task.description}</p>
        </div>
      </div>

      {/* Applications Manager - Only show to task owner for application-based tasks */}
      {task.task_mode === 'application' && publicKey && task.requesterWallet === publicKey.toString() && (
        <ApplicationsManager 
          taskId={task.id}
          taskTitle={task.title}
        />
      )}

      {/* Requirements and Submission Info */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="glass-card p-8">
          <h2 className="text-xl font-semibold mb-4">Requirements</h2>
          <ul className="space-y-2">
            {task.requirements.map((req: string, index: number) => (
              <li key={index} className="flex items-start">
                <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 mr-3 flex-shrink-0" />
                <span className="text-text-secondary">{req}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="glass-card p-8">
          <h2 className="text-xl font-semibold mb-4">How to Submit</h2>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-text-muted mb-2">Submission Type:</p>
              <span className="inline-block px-3 py-1 bg-cyan-500/20 text-cyan-300 rounded-full text-sm">
                {task.submissionType === 'text' ? 'Text Response' : 
                 task.submissionType === 'file' ? 'File Upload' : 'URL/Link'}
              </span>
            </div>
            
            {task.exampleSubmission && (
              <div>
                <p className="text-sm text-text-muted mb-2">Example:</p>
                <p className="text-sm text-text-secondary bg-white/5 p-3 rounded-lg">
                  {task.exampleSubmission}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Submission Modal */}
      {showSubmissionModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="glass-card p-8 max-w-md w-full">
            <h3 className="text-xl font-semibold mb-4">Submit Your Work</h3>
            <p className="text-text-secondary mb-4">
              Complete the task and provide proof of completion below.
            </p>
            
            {task.submissionType === 'text' && (
              <textarea
                value={submissionText}
                onChange={(e) => setSubmissionText(e.target.value)}
                placeholder="Paste your response, description, or proof here..."
                className="w-full h-32 glass-card p-4 bg-transparent border-white/20 rounded-lg focus:border-purple-400 focus:outline-none resize-none"
              />
            )}
            
            {task.submissionType === 'url' && (
              <input
                type="url"
                value={submissionUrl}
                onChange={(e) => setSubmissionUrl(e.target.value)}
                placeholder="https://twitter.com/your-post or https://example.com/proof"
                className="w-full glass-card p-4 bg-transparent border-white/20 rounded-lg focus:border-purple-400 focus:outline-none"
              />
            )}
            
            {task.submissionType === 'file' && (
              <FileUpload
                onFileUploaded={(url, name, size, type) => {
                  setSubmissionFileUrl(url)
                  setSubmissionFileName(name)
                  setSubmissionFileSize(size)
                  setSubmissionFileType(type)
                }}
                accept="image/*,.pdf"
                maxSizeMB={2}
              />
            )}
            
            <div className="flex space-x-4 mt-6">
              <button
                onClick={() => setShowSubmissionModal(false)}
                className="flex-1 glass-card py-2 px-4 rounded-lg hover:bg-white/20 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitWork}
                disabled={submitting}
                className="flex-1 gradient-primary text-white py-2 px-4 rounded-lg hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? 'Submitting...' : 'Submit Work'}
              </button>
            </div>
          </div>
        </div>
      )}
      </>
      )}
    </div>
  )
}