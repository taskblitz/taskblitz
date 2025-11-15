import { Metadata } from 'next'
import { Header } from '@/components/Header'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Frequently Asked Questions (FAQ)',
  description: 'Get answers to common questions about TaskBlitz, the Solana-powered micro-task marketplace. Learn about payments, security, fees, and how to get started.',
  alternates: {
    canonical: 'https://taskblitz.com/faq',
  },
}

const faqs = [
  {
    question: "What is TaskBlitz?",
    answer: "TaskBlitz is a decentralized micro-task marketplace built on the Solana blockchain. It connects clients who need tasks completed with workers who want to earn USDC cryptocurrency. Unlike traditional freelance platforms, TaskBlitz uses smart contracts for instant, secure payments and operates with complete transparency on the blockchain."
  },
  {
    question: "How does TaskBlitz work?",
    answer: "TaskBlitz is simple: Connect your Solana wallet (like Phantom or Solflare), browse available tasks or post your own with USDC payment, complete the work, and get paid instantly through secure smart contracts. All transactions are recorded on the Solana blockchain for complete transparency."
  },
  {
    question: "What wallet do I need for TaskBlitz?",
    answer: "You need a Solana-compatible wallet such as Phantom, Solflare, Backpack, or any wallet that supports the Solana blockchain. These wallets are free to download and easy to set up. Your wallet is your identity on TaskBlitz - no email or password required."
  },
  {
    question: "Is TaskBlitz safe and secure?",
    answer: "Yes! TaskBlitz uses Solana smart contracts to secure all payments in escrow. When a client posts a task, the payment is locked in a smart contract. The funds are only released when the task is completed and approved. This eliminates payment fraud and ensures both parties are protected. All transactions are transparent and verifiable on the Solana blockchain."
  },
  {
    question: "How do I get paid on TaskBlitz?",
    answer: "Payments on TaskBlitz are instant and automatic. When you complete a task and it's approved by the client, the USDC payment is immediately transferred from the smart contract escrow to your Solana wallet. There's no waiting period, no payment processing delays - you get paid the moment the task is approved."
  },
  {
    question: "What is USDC?",
    answer: "USDC (USD Coin) is a stablecoin cryptocurrency that's always worth $1 USD. Unlike Bitcoin or other volatile cryptocurrencies, USDC maintains a stable value, making it perfect for payments. You can easily convert USDC to regular dollars through cryptocurrency exchanges or keep it in your wallet for future use."
  },
  {
    question: "What fees does TaskBlitz charge?",
    answer: "TaskBlitz charges a platform fee on completed tasks to maintain and improve the service. Clients pay a 10% fee when posting tasks. There are no hidden fees or surprise charges."
  },
  {
    question: "How long does payment take?",
    answer: "Payments on TaskBlitz are instant! Thanks to Solana's high-speed blockchain, transactions complete in seconds. Once a client approves your completed work, the USDC is immediately transferred to your wallet. No waiting days or weeks like traditional platforms."
  },
  {
    question: "Can I use TaskBlitz from anywhere in the world?",
    answer: "Yes! TaskBlitz is a global, decentralized platform. As long as you have internet access and a Solana wallet, you can use TaskBlitz from anywhere. There are no geographic restrictions, and payments work the same way worldwide thanks to blockchain technology."
  },
  {
    question: "How are disputes handled on TaskBlitz?",
    answer: "If there's a disagreement between a client and worker, TaskBlitz has a dispute resolution system. Either party can open a dispute, which is reviewed by our team. We examine the task requirements, submitted work, and communication between both parties to make a fair decision. The escrowed funds remain locked until the dispute is resolved."
  },
  {
    question: "Do I need cryptocurrency experience to use TaskBlitz?",
    answer: "No! While TaskBlitz uses blockchain technology, you don't need to be a crypto expert. Our platform is designed to be user-friendly. If you can use a regular website and install a wallet app, you can use TaskBlitz. We provide comprehensive guides to help you get started."
  },
  {
    question: "What types of tasks can I post or complete on TaskBlitz?",
    answer: "TaskBlitz supports a wide variety of micro-tasks including graphic design, writing, data entry, social media management, video editing, translation, research, testing, and much more. Tasks typically range from $0.50 to $50, though there's no strict limit. If it's a digital task that can be completed remotely, it belongs on TaskBlitz."
  },
  {
    question: "How do I build reputation on TaskBlitz?",
    answer: "Your reputation on TaskBlitz is built through completed tasks and ratings. After each task, both the client and worker can leave a rating and review. These ratings are securely stored and linked to your wallet address, creating a transparent reputation history. A strong reputation helps you get more tasks and charge higher rates."
  },
  {
    question: "What makes TaskBlitz different from Amazon MTurk and others?",
    answer: "TaskBlitz offers instant crypto payments (no waiting 14 days), lower fees than traditional platforms, complete transparency through blockchain technology, no chargebacks or payment fraud, global access without restrictions, and true ownership of your reputation data. Plus, all transactions are secured by smart contracts, not a centralized company."
  },
  {
    question: "How do I get started on TaskBlitz?",
    answer: "Getting started is easy: 1) Install a Solana wallet like Phantom, 2) Visit TaskBlitz.com and connect your wallet, 3) Browse tasks to complete or post your own task, 4) Start earning or hiring! Check our Getting Started guide for detailed step-by-step instructions."
  }
]

export default function FAQPage() {
  // Generate FAQPage schema
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  }

  return (
    <main className="min-h-screen">
      <Header />
      
      {/* JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-cyan-400 text-transparent bg-clip-text">
            Frequently Asked Questions
          </h1>
          <p className="text-lg text-text-muted max-w-2xl mx-auto">
            Everything you need to know about TaskBlitz, the Solana-powered micro-task marketplace
          </p>
        </div>

        {/* FAQ List */}
        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <div key={index} className="glass-card p-6 rounded-xl">
              <h2 className="text-xl font-semibold mb-3 text-white">
                {faq.question}
              </h2>
              <p className="text-text-muted leading-relaxed">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-12 text-center glass-card p-8 rounded-xl">
          <h2 className="text-2xl font-bold mb-4">Still have questions?</h2>
          <p className="text-text-muted mb-6">
            Check out our comprehensive documentation or join our community
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/docs"
              className="btn-primary"
            >
              Read Documentation
            </Link>
            <Link
              href="/docs/getting-started"
              className="btn-secondary"
            >
              Get Started Guide
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
