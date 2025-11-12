'use client'
import { useState } from 'react'
import { Star, X } from 'lucide-react'
import { createClient } from '@supabase/supabase-js'
import toast from 'react-hot-toast'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

interface RatingModalProps {
  isOpen: boolean
  onClose: () => void
  taskId: string
  toUserId: string
  toUserName: string
  ratingType: 'requester' | 'worker'
  fromUserId: string
}

export function RatingModal({
  isOpen,
  onClose,
  taskId,
  toUserId,
  toUserName,
  ratingType,
  fromUserId,
}: RatingModalProps) {
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [reviewText, setReviewText] = useState('')
  const [submitting, setSubmitting] = useState(false)

  if (!isOpen) return null

  const handleSubmit = async () => {
    if (rating === 0) {
      toast.error('Please select a rating')
      return
    }

    setSubmitting(true)
    try {
      const { error } = await supabase.from('ratings').insert({
        task_id: taskId,
        from_user_id: fromUserId,
        to_user_id: toUserId,
        rating,
        review_text: reviewText || null,
        rating_type: ratingType,
      })

      if (error) throw error

      toast.success('Rating submitted successfully!')
      onClose()
      setRating(0)
      setReviewText('')
    } catch (error: any) {
      console.error('Error submitting rating:', error)
      if (error.code === '23505') {
        toast.error('You have already rated this user for this task')
      } else {
        toast.error('Failed to submit rating')
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-gray-900 border border-white/20 rounded-2xl p-6 md:p-8 max-w-md w-full shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Header */}
        <h2 className="text-2xl font-bold mb-2">Rate {ratingType === 'requester' ? 'Requester' : 'Worker'}</h2>
        <p className="text-gray-400 mb-6">{toUserName}</p>

        {/* Star Rating */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-3">Your Rating</label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                className="transition-transform hover:scale-110"
              >
                <Star
                  className={`w-10 h-10 ${
                    star <= (hoverRating || rating)
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-600'
                  }`}
                />
              </button>
            ))}
          </div>
          {rating > 0 && (
            <p className="text-sm text-gray-400 mt-2">
              {rating === 1 && 'Poor'}
              {rating === 2 && 'Fair'}
              {rating === 3 && 'Good'}
              {rating === 4 && 'Very Good'}
              {rating === 5 && 'Excellent'}
            </p>
          )}
        </div>

        {/* Review Text */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">
            Review (Optional)
          </label>
          <textarea
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            placeholder="Share your experience working with this user..."
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-gray-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all resize-none"
            rows={4}
            maxLength={500}
          />
          <p className="text-xs text-gray-500 mt-1">{reviewText.length}/500</p>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-lg transition-colors"
            disabled={submitting}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={submitting || rating === 0}
            className="flex-1 bg-gradient-to-r from-purple-600 to-cyan-500 text-white px-6 py-3 rounded-lg hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {submitting ? 'Submitting...' : 'Submit Rating'}
          </button>
        </div>
      </div>
    </div>
  )
}
