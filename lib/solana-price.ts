// Fetch real-time SOL/USD price from CoinGecko (free API)
let cachedPrice: { price: number; timestamp: number } | null = null
const CACHE_DURATION = 60000 // 1 minute cache

export async function getSolPrice(): Promise<number> {
  // Return cached price if still valid
  if (cachedPrice && Date.now() - cachedPrice.timestamp < CACHE_DURATION) {
    return cachedPrice.price
  }

  try {
    const response = await fetch(
      'https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd',
      { next: { revalidate: 60 } } // Cache for 60 seconds
    )
    
    if (!response.ok) {
      throw new Error('Failed to fetch SOL price')
    }

    const data = await response.json()
    const price = data.solana?.usd || 150 // Fallback to $150 if API fails

    // Update cache
    cachedPrice = { price, timestamp: Date.now() }

    console.log('SOL Price updated:', price)
    return price
  } catch (error) {
    console.error('Error fetching SOL price:', error)
    // Return cached price if available, otherwise fallback
    return cachedPrice?.price || 150
  }
}

// Convert USD to lamports using real-time price
export async function usdToLamportsLive(usd: number): Promise<number> {
  const solPrice = await getSolPrice()
  const sol = usd / solPrice
  return Math.floor(sol * 1_000_000_000) // LAMPORTS_PER_SOL
}

// Convert lamports to USD using real-time price
export async function lamportsToUsdLive(lamports: number): Promise<number> {
  const solPrice = await getSolPrice()
  const sol = lamports / 1_000_000_000
  return sol * solPrice
}
