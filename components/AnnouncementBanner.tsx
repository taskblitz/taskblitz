'use client'
import { useState } from 'react'
import { X } from 'lucide-react'
import Link from 'next/link'

export function AnnouncementBanner() {
  const [isVisible, setIsVisible] = useState(true)

  if (!isVisible) return null

  return (
    <div 
      className="fixed top-0 left-0 right-0 z-[1000] bg-white border-b border-gray-200 h-10 md:h-12 overflow-hidden"
      aria-label="Announcement banner"
    >
      <div className="relative h-full flex items-center">
        {/* Scrolling content */}
        <div className="animate-marquee whitespace-nowrap flex items-center h-full">
          <span className="text-black font-montserrat text-xs md:text-base px-4">
            Phase 1 testing live • Test with fresh wallets • I&apos;m building TaskBlitz in public on my{' '}
            <Link 
              href="https://x.com/Hedgie100x" 
              target="_blank" 
              rel="noopener noreferrer"
              className="underline hover:no-underline"
            >
              X account
            </Link>
            {' '}
          </span>
        </div>

        {/* Close button */}
        <button
          onClick={() => setIsVisible(false)}
          className="absolute right-1 md:right-2 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full transition-colors"
          aria-label="Close announcement"
        >
          <X className="w-3 h-3 md:w-4 md:h-4 text-gray-600" />
        </button>
      </div>
    </div>
  )
}