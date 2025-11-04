'use client'
import { 
  Zap, 
  DollarSign, 
  Shield, 
  Globe, 
  Clock, 
  TrendingUp,
  Users,
  Smartphone
} from 'lucide-react'

const features = [
  {
    icon: Zap,
    title: 'Instant Crypto Payments',
    description: 'Get paid immediately when work is approved. Powered by Solana for lightning-fast transactions.',
    color: 'text-yellow-400'
  },
  {
    icon: DollarSign,
    title: 'Low Platform Fees',
    description: 'Only 10% platform fee compared to traditional platforms that charge 20-40%.',
    color: 'text-green-400'
  },
  {
    icon: Shield,
    title: 'Escrow Protection',
    description: 'Smart contracts ensure funds are safely held until work is completed and approved.',
    color: 'text-purple-400'
  },
  {
    icon: Globe,
    title: 'Global Workforce',
    description: 'Access talent worldwide. Anyone with a Solana wallet can participate.',
    color: 'text-cyan-400'
  },
  {
    icon: Clock,
    title: 'Auto-Approval',
    description: 'Tasks are automatically approved after 72 hours if not reviewed, ensuring workers get paid.',
    color: 'text-orange-400'
  },
  {
    icon: TrendingUp,
    title: 'Built for Crypto',
    description: 'Specialized for crypto marketing tasks: memes, KOL outreach, raids, and content creation.',
    color: 'text-pink-400'
  },
  {
    icon: Users,
    title: 'Token Economy',
    description: 'Future $TASK holders get fee discounts and revenue sharing from platform growth.',
    color: 'text-indigo-400'
  },
  {
    icon: Smartphone,
    title: 'Mobile Optimized',
    description: 'Complete tasks on any device. Responsive design works perfectly on mobile.',
    color: 'text-emerald-400'
  }
]

export function Features() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Why Choose <span className="gradient-text">TaskBlitz</span>?
          </h2>
          <p className="text-xl text-text-secondary max-w-3xl mx-auto">
            The first marketplace built specifically for the crypto economy. 
            Fast, fair, and designed for the future of work.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <div 
                key={index}
                className="glass-card p-6 glass-hover group"
              >
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-lg bg-white/10 flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
                    <Icon className={`w-6 h-6 ${feature.color}`} />
                  </div>
                </div>
                <h3 className="text-lg font-semibold mb-3 text-white">
                  {feature.title}
                </h3>
                <p className="text-text-secondary leading-relaxed">
                  {feature.description}
                </p>
              </div>
            )
          })}
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <div className="glass-card p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold mb-4">Ready to Get Started?</h3>
            <p className="text-text-secondary mb-6">
              Join thousands of users already earning and hiring on TaskBlitz
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="gradient-primary text-white font-semibold px-8 py-3 rounded-xl hover:scale-105 transition-transform shadow-lg">
                Start Earning
              </button>
              <button className="glass-card border-white/20 text-white px-8 py-3 rounded-xl hover:bg-white/20 transition-all">
                Post Your First Task
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}