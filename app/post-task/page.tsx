import { Header } from '@/components/Header'
import { PostTaskForm } from '@/components/PostTaskForm'

export default function PostTaskPage() {
  return (
    <main className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Post a New Task</h1>
          <p className="text-text-secondary">Create a micro-task and get it completed by skilled freelancers</p>
        </div>
        
        <PostTaskForm />
      </div>
    </main>
  )
}