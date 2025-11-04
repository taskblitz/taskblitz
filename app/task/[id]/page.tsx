import { Header } from '@/components/Header'
import { TaskDetail } from '@/components/TaskDetail'

interface TaskPageProps {
  params: {
    id: string
  }
}

export default function TaskPage({ params }: TaskPageProps) {
  return (
    <main className="min-h-screen">
      <Header />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <TaskDetail taskId={params.id} />
      </div>
    </main>
  )
}