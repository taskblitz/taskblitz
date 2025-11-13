export function USDCInfo() {
  return (
    <div className="flex items-center gap-2 text-sm text-text-secondary">
      <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-500/10 border border-green-500/20 rounded">
        <span className="text-green-400 font-semibold">USDC</span>
      </span>
      <span>All payments in USDC (1:1 with USD)</span>
    </div>
  )
}
