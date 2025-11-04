import { Header } from '@/components/Header'
import { MyTasksManager } from '@/components/MyTasksManager'

export default function MyTasksPage() {
  return (
    <main className="min-h-screen">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">My Tasks</h1>
          <p className="text-text-secondary">Manage your posted tasks and applications</p>
        </div>
        
        <MyTasksManager />
      </div>
    </main>
  )
}