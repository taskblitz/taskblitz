# TaskBlitz Development Guidelines

## Project Context
You are building TaskBlitz - a Solana-based micro-task marketplace. Reference the TaskBlitz_PRD.md file for complete specifications.

## Development Priorities
1. **Speed over perfection** - Ship MVP fast, iterate later
2. **Follow the Implementation Checklist** - Work through phases in order
3. **Use exact design system** - Purple/cyan gradients, glassmorphism cards
4. **Test on Devnet** - Never use Mainnet during development

## Code Standards
- Use TypeScript for all files
- Follow Next.js 14 App Router patterns
- Use TailwindCSS with custom color palette from PRD
- Implement responsive design (mobile-first)
- Add loading states and error handling

## Database Schema
Always reference the exact schema in TaskBlitz_PRD.md sections. Use Supabase with RLS policies.

## Smart Contract Integration
- Use Anchor framework for Solana programs
- Test all transactions on Devnet first
- Handle transaction confirmations properly
- Show transaction hashes with Solscan links

## UI/UX Guidelines
- Glassmorphism cards: `bg-white/5 backdrop-blur-sm border border-white/10`
- Primary buttons: Purple to cyan gradient with hover scale
- Dark theme with purple/cyan accents
- Smooth animations and transitions

## File Organization
```
/app - Next.js pages
/components - Reusable UI components  
/lib - Utilities and configurations
/types - TypeScript type definitions
/contracts - Anchor smart contracts
```

## Testing Approach
- Test wallet connection first
- Use small amounts on Devnet
- Test complete user flows end-to-end
- Verify payments work before moving to next feature