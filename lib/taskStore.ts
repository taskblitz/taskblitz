// Simple in-memory task store - will replace with Supabase later
interface Application {
  id: string
  freelancerId: string
  freelancerName: string
  proposal: string
  appliedAt: Date
  status: 'pending' | 'accepted' | 'rejected'
}

interface Submission {
  id: string
  workerId: string
  workerName: string
  submissionType: 'text' | 'file' | 'url'
  submissionText?: string
  submissionFileUrl?: string
  submissionUrl?: string
  submittedAt: Date
  status: 'pending' | 'approved' | 'rejected'
  reviewedAt?: Date
}

interface Task {
  id: string
  title: string
  description: string
  paymentPerWorker: number
  category: string
  difficulty: 'Easy' | 'Medium' | 'Hard'
  timeEstimate: string
  postedBy: string
  postedAt: Date
  deadline: Date
  status: 'open' | 'completed' | 'expired' | 'cancelled'
  workersNeeded: number
  workersCompleted: number
  requirements: string[]
  submissionType: 'text' | 'file' | 'url'
  exampleSubmission?: string
  submissions: Submission[]
}

class TaskStore {
  private tasks: Task[] = [
    {
      id: '1',
      title: 'DM @elonmusk about TaskBlitz on X',
      description: 'Send a direct message to @elonmusk on X (Twitter) telling him about TaskBlitz platform. Be polite and professional. Include the website: taskblitz.click',
      paymentPerWorker: 0.50,
      category: 'Marketing',
      difficulty: 'Easy',
      timeEstimate: '5 minutes',
      postedBy: 'taskblitz_team',
      postedAt: new Date('2024-11-01'),
      deadline: new Date('2024-11-08'),
      status: 'open',
      workersNeeded: 100,
      workersCompleted: 23,
      requirements: ['Must have X (Twitter) account', 'Account must be at least 30 days old', 'Must not be spam account'],
      submissionType: 'url',
      exampleSubmission: 'https://x.com/messages/compose?recipient_id=44196397',
      submissions: [
        {
          id: 'sub1',
          workerId: 'worker1',
          workerName: 'CryptoFan123',
          submissionType: 'url',
          submissionUrl: 'https://x.com/messages/44196397/conversation/12345',
          submittedAt: new Date('2024-11-01T10:30:00'),
          status: 'approved',
          reviewedAt: new Date('2024-11-01T11:00:00')
        },
        {
          id: 'sub2',
          workerId: 'worker2',
          workerName: 'WebWorker99',
          submissionType: 'url',
          submissionUrl: 'https://x.com/messages/44196397/conversation/67890',
          submittedAt: new Date('2024-11-01T11:15:00'),
          status: 'pending'
        }
      ]
    },
    {
      id: '2',
      title: 'Like and Retweet this specific tweet',
      description: 'Go to this tweet: https://x.com/taskblitz/status/123456 and like + retweet it. Must be genuine engagement, no bots.',
      paymentPerWorker: 0.25,
      category: 'Marketing',
      difficulty: 'Easy',
      timeEstimate: '1 minute',
      postedBy: 'crypto_startup',
      postedAt: new Date('2024-10-31'),
      deadline: new Date('2024-11-07'),
      status: 'open',
      workersNeeded: 500,
      workersCompleted: 347,
      requirements: ['Real X account (no bots)', 'Must have profile picture', 'Account older than 1 month'],
      submissionType: 'url',
      exampleSubmission: 'https://x.com/yourusername/status/retweet_id',
      submissions: []
    },
    {
      id: '3',
      title: 'Take a photo with TaskBlitz sign',
      description: 'Print out "TaskBlitz.click" on paper, take a selfie holding it, and post on your social media with #TaskBlitz hashtag.',
      paymentPerWorker: 2.00,
      category: 'Marketing',
      difficulty: 'Easy',
      timeEstimate: '10 minutes',
      postedBy: 'taskblitz_team',
      postedAt: new Date('2024-10-30'),
      deadline: new Date('2024-11-06'),
      status: 'open',
      workersNeeded: 50,
      workersCompleted: 12,
      requirements: ['Must be real person (no AI/fake photos)', 'Clear photo quality', 'Must include #TaskBlitz hashtag'],
      submissionType: 'url',
      exampleSubmission: 'https://twitter.com/username/status/123456 or https://instagram.com/p/abc123',
      submissions: []
    },
    {
      id: '4',
      title: 'Write a positive review for our app',
      description: 'Download our app "CryptoTracker" from App Store, use it for 5 minutes, then write a genuine 4-5 star review.',
      paymentPerWorker: 1.50,
      category: 'Reviews',
      difficulty: 'Easy',
      timeEstimate: '10 minutes',
      postedBy: 'app_developer',
      postedAt: new Date('2024-10-29'),
      deadline: new Date('2024-11-05'),
      status: 'open',
      workersNeeded: 200,
      workersCompleted: 89,
      requirements: ['Must actually download and try the app', 'Honest review (4-5 stars)', 'At least 50 words'],
      submissionType: 'text',
      exampleSubmission: 'Screenshot of your review + App Store link',
      submissions: []
    },
    {
      id: '5',
      title: 'Find email addresses of crypto influencers',
      description: 'Research and find valid email addresses for crypto influencers with 10K+ followers. Provide name, handle, follower count, and email.',
      paymentPerWorker: 3.00,
      category: 'Research',
      difficulty: 'Medium',
      timeEstimate: '30 minutes',
      postedBy: 'marketing_agency',
      postedAt: new Date('2024-10-28'),
      deadline: new Date('2024-11-04'),
      status: 'open',
      workersNeeded: 20,
      workersCompleted: 7,
      requirements: ['Must verify email is valid', 'Influencer must have 10K+ followers', 'No duplicate submissions'],
      submissionType: 'text',
      exampleSubmission: 'Name: John Crypto, Handle: @johncrypto, Followers: 25K, Email: john@example.com',
      submissions: []
    },
    {
      id: '6',
      title: 'Join our Telegram and stay for 7 days',
      description: 'Join our Telegram group, introduce yourself, and stay active for 7 days. Payment released after 7 days.',
      paymentPerWorker: 1.00,
      category: 'Community',
      difficulty: 'Easy',
      timeEstimate: '5 minutes setup',
      postedBy: 'defi_project',
      postedAt: new Date('2024-10-27'),
      deadline: new Date('2024-11-10'),
      status: 'open',
      workersNeeded: 1000,
      workersCompleted: 234,
      requirements: ['Must join with real account', 'Introduce yourself in chat', 'Stay for full 7 days'],
      submissionType: 'text',
      exampleSubmission: 'Your Telegram username and screenshot of joining message',
      submissions: []
    }
  ]

  private listeners: (() => void)[] = []

  getAllTasks(): Task[] {
    return [...this.tasks]
  }

  getTaskById(id: string): Task | undefined {
    return this.tasks.find(task => task.id === id)
  }

  addTask(taskData: Omit<Task, 'id' | 'postedAt' | 'status' | 'workersCompleted' | 'submissions' | 'deadline'>): Task {
    const newTask: Task = {
      ...taskData,
      id: Date.now().toString(),
      postedAt: new Date(),
      deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      status: 'open',
      workersCompleted: 0,
      submissions: []
    }
    
    this.tasks.unshift(newTask) // Add to beginning of array
    this.notifyListeners()
    return newTask
  }

  submitWork(taskId: string, submission: Omit<Submission, 'id' | 'submittedAt' | 'status'>): boolean {
    const task = this.tasks.find(t => t.id === taskId)
    if (!task) return false

    // Check if user already submitted for this task
    const existingSubmission = task.submissions.find(sub => sub.workerId === submission.workerId)
    if (existingSubmission) return false

    // Check if task is still open and not full
    if (task.status !== 'open' || task.workersCompleted >= task.workersNeeded) return false

    const newSubmission: Submission = {
      ...submission,
      id: Date.now().toString(),
      submittedAt: new Date(),
      status: 'pending'
    }

    task.submissions.push(newSubmission)
    task.workersCompleted += 1

    // Mark task as completed if all spots filled
    if (task.workersCompleted >= task.workersNeeded) {
      task.status = 'completed'
    }

    this.notifyListeners()
    return true
  }

  approveSubmission(taskId: string, submissionId: string): boolean {
    const task = this.tasks.find(t => t.id === taskId)
    if (!task) return false

    const submission = task.submissions.find(sub => sub.id === submissionId)
    if (!submission) return false

    submission.status = 'approved'
    submission.reviewedAt = new Date()

    this.notifyListeners()
    return true
  }

  rejectSubmission(taskId: string, submissionId: string): boolean {
    const task = this.tasks.find(t => t.id === taskId)
    if (!task) return false

    const submission = task.submissions.find(sub => sub.id === submissionId)
    if (!submission) return false

    submission.status = 'rejected'
    submission.reviewedAt = new Date()

    // Reopen spot for another worker
    task.workersCompleted -= 1
    if (task.status === 'completed') {
      task.status = 'open'
    }

    this.notifyListeners()
    return true
  }

  getTasksByPoster(posterId: string): Task[] {
    return this.tasks.filter(task => task.postedBy === posterId)
  }

  subscribe(listener: () => void): () => void {
    this.listeners.push(listener)
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener)
    }
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener())
  }
}

export const taskStore = new TaskStore()