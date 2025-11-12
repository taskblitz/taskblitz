'use client'
import { useState, useEffect, useRef } from 'react'
import { Bell, Check, X, MoreVertical } from 'lucide-react'
import { createClient } from '@supabase/supabase-js'
import { useWallet } from '@solana/wallet-adapter-react'
import Link from 'next/link'
import { markAsRead, markAllAsRead } from '@/lib/notifications'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

interface Notification {
  id: string
  type: string
  title: string
  message: string
  link: string | null
  read: boolean
  created_at: string
}

export function NotificationBell() {
  const { publicKey } = useWallet()
  const [isOpen, setIsOpen] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [activeTab, setActiveTab] = useState<'priority' | 'flagged' | 'unread'>('priority')
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (publicKey) {
      fetchNotifications()
      
      // Set up real-time subscription
      const channel = supabase
        .channel('notifications')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'notifications',
          },
          () => {
            fetchNotifications()
          }
        )
        .subscribe()

      return () => {
        supabase.removeChannel(channel)
      }
    }
  }, [publicKey])

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  const fetchNotifications = async () => {
    if (!publicKey) return

    try {
      const { data: user } = await supabase
        .from('users')
        .select('id')
        .eq('wallet_address', publicKey.toString())
        .single()

      if (!user) return

      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(20)

      if (error) throw error

      setNotifications(data || [])
      setUnreadCount(data?.filter((n) => !n.read).length || 0)
    } catch (error) {
      console.error('Error fetching notifications:', error)
    }
  }

  const handleMarkAsRead = async (notificationId: string) => {
    await markAsRead(notificationId)
    fetchNotifications()
  }

  const handleMarkAllAsRead = async () => {
    if (!publicKey) return

    const { data: user } = await supabase
      .from('users')
      .select('id')
      .eq('wallet_address', publicKey.toString())
      .single()

    if (user) {
      await markAllAsRead(user.id)
      fetchNotifications()
    }
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'submission_approved':
        return '✅'
      case 'submission_rejected':
        return '❌'
      case 'task_completed':
        return '🎉'
      case 'new_submission':
        return '📝'
      case 'payment_received':
        return '💰'
      case 'rating_received':
        return '⭐'
      default:
        return '🔔'
    }
  }

  const formatTimeAgo = (date: string) => {
    const now = new Date()
    const notifDate = new Date(date)
    const diffInMinutes = Math.floor((now.getTime() - notifDate.getTime()) / (1000 * 60))

    if (diffInMinutes < 1) return 'Just now'
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    
    const diffInHours = Math.floor(diffInMinutes / 60)
    if (diffInHours < 24) return `${diffInHours}h ago`
    
    const diffInDays = Math.floor(diffInHours / 24)
    return `${diffInDays}d ago`
  }

  const filteredNotifications = notifications.filter((n) => {
    if (activeTab === 'unread') return !n.read
    if (activeTab === 'priority') return !n.read // Show unread as priority
    return true // flagged - we'll implement this later
  })

  const groupedNotifications = filteredNotifications.reduce((acc, notif) => {
    const date = new Date(notif.created_at)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    let group = 'EARLIER'
    if (date.toDateString() === today.toDateString()) {
      group = 'NEW'
    } else if (date.toDateString() === yesterday.toDateString()) {
      group = 'YESTERDAY'
    }

    if (!acc[group]) acc[group] = []
    acc[group].push(notif)
    return acc
  }, {} as Record<string, Notification[]>)

  if (!publicKey) return null

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Icon */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-white/10"
        aria-label="Notifications"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-0.5 right-0.5 w-4 h-4 bg-red-500 rounded-full text-[10px] flex items-center justify-center text-white font-bold">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Backdrop for mobile */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setIsOpen(false)} />
      )}

      {/* Dropdown */}
      {isOpen && (
        <div className="fixed md:absolute right-0 md:right-0 top-16 md:top-auto md:mt-2 left-0 md:left-auto w-full md:w-96 bg-gray-900 border-t md:border border-white/20 md:rounded-xl shadow-2xl overflow-hidden z-50 max-h-[calc(100vh-4rem)] md:max-h-[32rem]">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-white/10">
            <h3 className="text-lg font-semibold">Notifications</h3>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllAsRead}
                  className="text-xs text-cyan-400 hover:text-cyan-300"
                >
                  Mark all read
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-white/10 bg-black/20">
            <button
              onClick={() => setActiveTab('priority')}
              className={`flex-1 py-3 text-sm font-medium transition-colors ${
                activeTab === 'priority'
                  ? 'text-white border-b-2 border-purple-500'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Priority
            </button>
            <button
              onClick={() => setActiveTab('flagged')}
              className={`flex-1 py-3 text-sm font-medium transition-colors ${
                activeTab === 'flagged'
                  ? 'text-white border-b-2 border-purple-500'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Flagged
            </button>
            <button
              onClick={() => setActiveTab('unread')}
              className={`flex-1 py-3 text-sm font-medium transition-colors ${
                activeTab === 'unread'
                  ? 'text-white border-b-2 border-purple-500'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Unread
            </button>
          </div>

          {/* Notifications List */}
          <div className="max-h-96 overflow-y-auto">
            {Object.keys(groupedNotifications).length === 0 ? (
              <div className="p-8 text-center text-gray-400">
                <Bell className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No notifications yet</p>
              </div>
            ) : (
              Object.entries(groupedNotifications).map(([group, notifs]) => (
                <div key={group}>
                  {/* Group Header */}
                  <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider bg-black/20">
                    {group}
                  </div>

                  {/* Notifications */}
                  {notifs.map((notif) => (
                    <div
                      key={notif.id}
                      className={`relative border-l-4 ${
                        notif.read ? 'border-transparent' : 'border-purple-500'
                      } ${
                        notif.read ? 'bg-transparent' : 'bg-purple-500/5'
                      } hover:bg-white/5 transition-colors`}
                    >
                      <div className="p-4">
                        <div className="flex items-start gap-3">
                          {/* Icon */}
                          <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-xl flex-shrink-0">
                            {getNotificationIcon(notif.type)}
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2 mb-1">
                              <p className="text-sm font-medium text-white">
                                {notif.title}
                              </p>
                              <button className="text-gray-400 hover:text-white">
                                <MoreVertical className="w-4 h-4" />
                              </button>
                            </div>
                            <p className="text-sm text-gray-400 mb-2">
                              {notif.message}
                            </p>
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-gray-500">
                                {formatTimeAgo(notif.created_at)}
                              </span>
                              {notif.link && (
                                <Link
                                  href={notif.link}
                                  onClick={() => {
                                    handleMarkAsRead(notif.id)
                                    setIsOpen(false)
                                  }}
                                  className="text-xs text-cyan-400 hover:text-cyan-300"
                                >
                                  View →
                                </Link>
                              )}
                            </div>
                          </div>

                          {/* Mark as read */}
                          {!notif.read && (
                            <button
                              onClick={() => handleMarkAsRead(notif.id)}
                              className="text-gray-400 hover:text-green-400 transition-colors"
                              title="Mark as read"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="p-3 border-t border-white/10 text-center">
              <button
                onClick={() => setIsOpen(false)}
                className="text-sm text-cyan-400 hover:text-cyan-300"
              >
                See all communications
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
