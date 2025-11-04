'use client'
import { useState, useEffect } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { TaskManagementCard } from '@/components/TaskManagementCard'
import { SubmissionCard } from '@/components/SubmissionCard'
import { Plus, Briefcase, FileText } from 'lucide-react'
import Link from 'next/link'
import { getTasksByRequester, getSubmissionsByWorker } from '@/lib/database'

// Mock submissions data - will replace with Supabase
const mockMySubmissions = [
  {
    id: 'mysub1',
    taskId: '2',
    taskTitle: 'Like and Retweet this specific tweet',
    taskPayment: 0.25,
    taskPoster: 'crypto_startup',
    submittedAt: new Date('2024-10-31T09:00:00'),
    status: 'pending',
    submissionUrl: 'https://x.com/myusername/status/retweet123',
    submissionType: 'url'
  },
  {
    id: 'mysub2',
    taskId: '3',
    taskTitle: 'Take a photo with TaskBlitz sign',
    taskPayment: 2.00,
    taskPoster: 'taskblitz_team',
    submittedAt: new Date('2024-10-29T16:00:00'),
    status: 'approved',
    submissionUrl: 'https://instagram.com/p/mypost123',
    submissionType: 'url'
  }
]

export function MyTasksManager() {
  const { connected, publicKey } = useWallet()
  const [postedTasks, setPostedTasks] = useState<any[]>([])
  const [mySubmissions, setMySubmissions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    if (connected && publicKey) {
      fetchUserData()
    } else {
      setLoading(false)
    }
  }, [connected, publicKey])

  const fetchUserData = async () => {
    if (!publicKey) return
    
    try {
      setLoading(true)
      const walletAddress = publicKey.toString()
      
      console.log('Fetching tasks for wallet:', walletAddress)
      
      // Fetch tasks posted by this user
      const tasks = await getTasksByRequester(walletAddress)
      console.log('Found posted tasks:', tasks.length)
      
      // Transform tasks to match component expectations
      const transformedTasks = tasks.map(task => ({
        id: task.id,
        title: task.title,
        description: task.description,
        paymentPerWorker: task.payment_per_task,
        category: task.category,
        difficulty: 'Easy', // We'll add this field later
        timeEstimate: '1-2 hours', // We'll add this field later
        postedBy: task.requester?.wallet_address || walletAddress,
        postedAt: new Date(task.created_at),
        deadline: new Date(task.deadline),
        status: task.status,
        workersNeeded: task.workers_needed,
        workersCompleted: task.workers_completed,
        submissionType: task.submission_type,
        requirements: task.requirements || [],
        exampleSubmission: task.example_submission,
        submissions: task.submissions || []
      }))
      
      setPostedTasks(transformedTasks)
      
      // Fetch submissions by this user
      const submissions = await getSubmissionsByWorker(walletAddress)
      console.log('Found submissions:', submissions.length)
      
      // Transform submissions to match component expectations
      const transformedSubmissions = submissions.map(submission => ({
        id: submission.id,
        taskId: submission.task?.id,
        taskTitle: submission.task?.title,
        taskPayment: submission.task?.payment_per_task,
        taskPoster: submission.task?.requester?.wallet_address,
        submittedAt: new Date(submission.submitted_at),
        status: submission.status,
        submissionUrl: submission.submission_url,
        submissionText: submission.submission_text,
        submissionFileUrl: submission.submission_file_url,
        submissionType: submission.submission_type
      }))
      
      setMySubmissions(transformedSubmissions)
      
    } catch (error) {
      console.error('Error fetching user data:', error)
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
        </div>
      </div>
    )
  }

  if (!connected) {
    return (
      <div className="glass-card p-8 text-center">
        <h2 className="text-xl font-semibold mb-4">Connect Your Wallet</h2>
        <p className="text-text-secondary mb-6">
          Connect your wallet to view and manage your tasks and submissions.
        </p>
        <WalletMultiButton />
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400"></div>
        <span className="ml-2 text-text-secondary">Loading your tasks...</span>
      </div>
    )
  }

  return (
    <Tabs defaultValue="posted" className="space-y-6">
      <TabsList className="glass-card p-1 bg-transparent border-white/20">
        <TabsTrigger 
          value="posted" 
          className="flex items-center data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-300"
        >
          <Briefcase className="w-4 h-4 mr-2" />
          Posted Tasks ({postedTasks.length})
        </TabsTrigger>
        <TabsTrigger 
          value="submissions"
          className="flex items-center data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-300"
        >
          <FileText className="w-4 h-4 mr-2" />
          My Submissions ({mySubmissions.length})
        </TabsTrigger>
      </TabsList>

      <TabsContent value="posted" className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Your Posted Tasks</h2>
          <Link 
            href="/post-task"
            className="gradient-primary text-white font-medium px-4 py-2 rounded-lg hover:scale-105 transition-transform flex items-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            Post New Task
          </Link>
        </div>

        {postedTasks.length === 0 ? (
          <div className="glass-card p-8 text-center">
            <Briefcase className="w-12 h-12 text-text-muted mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No tasks posted yet</h3>
            <p className="text-text-secondary mb-6">
              Start by posting your first task to get work done by skilled freelancers.
            </p>
            <Link 
              href="/post-task"
              className="gradient-primary text-white font-medium px-6 py-3 rounded-lg hover:scale-105 transition-transform inline-flex items-center"
            >
              <Plus className="w-4 h-4 mr-2" />
              Post Your First Task
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {postedTasks.map((task) => (
              <TaskManagementCard key={task.id} task={task} />
            ))}
          </div>
        )}
      </TabsContent>

      <TabsContent value="submissions" className="space-y-6">
        <h2 className="text-xl font-semibold">Your Submissions</h2>

        {mySubmissions.length === 0 ? (
          <div className="glass-card p-8 text-center">
            <FileText className="w-12 h-12 text-text-muted mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No submissions yet</h3>
            <p className="text-text-secondary mb-6">
              Browse the marketplace and complete tasks to start earning.
            </p>
            <Link 
              href="/"
              className="gradient-primary text-white font-medium px-6 py-3 rounded-lg hover:scale-105 transition-transform inline-block"
            >
              Browse Tasks
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {mySubmissions.map((submission) => (
              <SubmissionCard key={submission.id} submission={submission} />
            ))}
          </div>
        )}
      </TabsContent>
    </Tabs>
  )
}