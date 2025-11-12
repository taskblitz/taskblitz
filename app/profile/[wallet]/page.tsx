'use client'
import { Header } from '@/components/Header'
import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import { Star, Briefcase, CheckCircle, TrendingUp, Calendar } from 'lucide-react'
import Link from 'next/link'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

interface UserProfile {
  id: string
  wallet_address: string
  username: string | null
  bio: string | null
  avatar_url: string | null
  role: string
  total_spent: number
  total_earned: number
  tasks_posted: number
  tasks_completed: number
  rating_as_requester: number
  rating_as_worker: number
  total_ratings_received: number
  created_at: string
}

interface Rating {
  id: string
  rating: number
  review_text: string | null
  rating_type: string
  created_at: string
  from_user: {
    username: string | null
    wallet_address: string
  }
  task: {
    title: string
  }
}

export default function ProfilePage({ params }: { params: { wallet: string } }) {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [ratings, setRatings] = useState<Rating[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'requester' | 'worker'>('requester')

  useEffect(() => {
    fetchProfile()
  }, [params.wallet])

  const fetchProfile = async () => {
    setLoading(true)
    try {
      // Fetch user profile
      const { data: user, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('wallet_address', params.wallet)
        .single()

      if (userError) throw userError
      setProfile(user)

      // Fetch ratings
      const { data: ratingsData, error: ratingsError } = await supabase
        .from('ratings')
        .select(`
          *,
          from_user:users!ratings_from_user_id_fkey(username, wallet_address),
          task:tasks(title)
        `)
        .eq('to_user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(20)

      if (ratingsError) throw ratingsError
      setRatings(ratingsData || [])
    } catch (error) {
      console.error('Error fetching profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-5 h-5 ${
              star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-600'
            }`}
          />
        ))}
      </div>
    )
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="animate-pulse space-y-6">
            <div className="h-32 bg-white/10 rounded-xl"></div>
            <div className="h-64 bg-white/10 rounded-xl"></div>
          </div>
        </div>
      </main>
    )
  }

  if (!profile) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center py-20">
            <h2 className="text-2xl font-bold mb-4">User Not Found</h2>
            <p className="text-gray-400 mb-6">This wallet address doesn't have a profile yet</p>
            <Link href="/" className="text-cyan-400 hover:text-cyan-300">
              ← Back to Home
            </Link>
          </div>
        </div>
      </main>
    )
  }

  const requesterRatings = ratings.filter((r) => r.rating_type === 'requester')
  const workerRatings = ratings.filter((r) => r.rating_type === 'worker')

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Profile Header */}
        <div className="glass-card rounded-2xl p-4 md:p-8 mb-8">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-4 md:gap-6">
            {/* Avatar */}
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-br from-purple-600 to-cyan-500 flex items-center justify-center text-2xl md:text-3xl font-bold flex-shrink-0">
              {profile.username?.[0]?.toUpperCase() || profile.wallet_address[0]}
            </div>

            {/* Info */}
            <div className="flex-1 text-center md:text-left w-full">
              <h1 className="text-2xl md:text-3xl font-bold mb-2">
                {profile.username || `${profile.wallet_address.slice(0, 8)}...${profile.wallet_address.slice(-6)}`}
              </h1>
              
              {profile.bio && (
                <p className="text-gray-400 mb-4 text-sm md:text-base">{profile.bio}</p>
              )}

              <div className="flex items-center justify-center md:justify-start gap-2 text-sm text-gray-500 mb-4">
                <Calendar className="w-4 h-4" />
                <span>Joined {new Date(profile.created_at).toLocaleDateString()}</span>
              </div>

              <div className="flex items-center justify-center md:justify-start gap-2">
                <span className="font-mono text-xs text-gray-600 break-all px-2 py-1 bg-white/5 rounded">
                  {profile.wallet_address}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 mb-8">
          <div className="glass-card rounded-xl p-4 md:p-6">
            <div className="flex items-center gap-2 md:gap-3 mb-2">
              <Briefcase className="w-4 h-4 md:w-5 md:h-5 text-purple-400" />
              <span className="text-xs md:text-sm text-gray-400">Tasks Posted</span>
            </div>
            <div className="text-2xl md:text-3xl font-bold">{profile.tasks_posted}</div>
          </div>

          <div className="glass-card rounded-xl p-4 md:p-6">
            <div className="flex items-center gap-2 md:gap-3 mb-2">
              <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-green-400" />
              <span className="text-xs md:text-sm text-gray-400">Tasks Completed</span>
            </div>
            <div className="text-2xl md:text-3xl font-bold">{profile.tasks_completed}</div>
          </div>

          <div className="glass-card rounded-xl p-4 md:p-6">
            <div className="flex items-center gap-2 md:gap-3 mb-2">
              <TrendingUp className="w-4 h-4 md:w-5 md:h-5 text-cyan-400" />
              <span className="text-xs md:text-sm text-gray-400">Total Earned</span>
            </div>
            <div className="text-2xl md:text-3xl font-bold">${profile.total_earned.toFixed(2)}</div>
          </div>

          <div className="glass-card rounded-xl p-4 md:p-6">
            <div className="flex items-center gap-2 md:gap-3 mb-2">
              <TrendingUp className="w-4 h-4 md:w-5 md:h-5 text-orange-400" />
              <span className="text-xs md:text-sm text-gray-400">Total Spent</span>
            </div>
            <div className="text-2xl md:text-3xl font-bold">${profile.total_spent.toFixed(2)}</div>
          </div>
        </div>

        {/* Ratings Section */}
        <div className="glass-card rounded-2xl p-8">
          <h2 className="text-2xl font-bold mb-6">Ratings & Reviews</h2>

          {/* Tabs */}
          <div className="flex gap-4 mb-6 border-b border-white/10">
            <button
              onClick={() => setActiveTab('requester')}
              className={`pb-3 px-4 transition-colors ${
                activeTab === 'requester'
                  ? 'border-b-2 border-purple-500 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              As Requester ({requesterRatings.length})
            </button>
            <button
              onClick={() => setActiveTab('worker')}
              className={`pb-3 px-4 transition-colors ${
                activeTab === 'worker'
                  ? 'border-b-2 border-cyan-500 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              As Worker ({workerRatings.length})
            </button>
          </div>

          {/* Average Rating */}
          <div className="flex items-center gap-6 mb-8 p-6 bg-white/5 rounded-xl">
            <div>
              <div className="text-5xl font-bold mb-2">
                {activeTab === 'requester'
                  ? profile.rating_as_requester.toFixed(1)
                  : profile.rating_as_worker.toFixed(1)}
              </div>
              {renderStars(
                activeTab === 'requester'
                  ? Math.round(profile.rating_as_requester)
                  : Math.round(profile.rating_as_worker)
              )}
            </div>
            <div className="text-gray-400">
              <div className="text-sm">Based on</div>
              <div className="text-2xl font-semibold">
                {activeTab === 'requester' ? requesterRatings.length : workerRatings.length} reviews
              </div>
            </div>
          </div>

          {/* Reviews List */}
          <div className="space-y-4">
            {(activeTab === 'requester' ? requesterRatings : workerRatings).map((rating) => (
              <div key={rating.id} className="p-6 bg-white/5 rounded-xl">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="font-semibold mb-1">
                      {rating.from_user.username || `${rating.from_user.wallet_address.slice(0, 8)}...`}
                    </div>
                    <div className="text-sm text-gray-400">
                      Task: {rating.task.title}
                    </div>
                  </div>
                  <div className="text-right">
                    {renderStars(rating.rating)}
                    <div className="text-xs text-gray-500 mt-1">
                      {new Date(rating.created_at).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                {rating.review_text && (
                  <p className="text-gray-300">{rating.review_text}</p>
                )}
              </div>
            ))}

            {(activeTab === 'requester' ? requesterRatings : workerRatings).length === 0 && (
              <div className="text-center py-12 text-gray-400">
                No reviews yet as {activeTab}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
