/**
 * URL Utilities for SEO-friendly URLs
 */

/**
 * Generate a URL-friendly slug from text
 * @param text - The text to slugify
 * @param maxLength - Maximum length of the slug (default: 50)
 * @returns URL-friendly slug
 */
export function generateSlug(text: string, maxLength: number = 50): string {
  return text
    .toLowerCase()
    .trim()
    // Remove special characters except spaces and hyphens
    .replace(/[^\w\s-]/g, '')
    // Replace spaces with hyphens
    .replace(/\s+/g, '-')
    // Replace multiple hyphens with single hyphen
    .replace(/-+/g, '-')
    // Remove leading/trailing hyphens
    .replace(/^-+|-+$/g, '')
    // Limit length
    .substring(0, maxLength)
}

/**
 * Generate SEO-friendly task URL
 * @param taskId - UUID of the task
 * @param title - Title of the task
 * @returns SEO-friendly URL path
 */
export function getTaskUrl(taskId: string, title: string): string {
  const slug = generateSlug(title)
  // Use first 8 characters of UUID for uniqueness
  const shortId = taskId.split('-')[0]
  return `/task/${slug}-${shortId}`
}

/**
 * Extract task ID from SEO-friendly URL
 * @param slugWithId - The slug with ID (e.g., "my-task-title-abc123de")
 * @returns The task UUID or null if invalid
 */
export function extractTaskId(slugWithId: string): string | null {
  // Get the last segment after the last hyphen (should be the short ID)
  const parts = slugWithId.split('-')
  const shortId = parts[parts.length - 1]
  
  // Short ID should be 8 characters (first part of UUID)
  if (shortId && shortId.length === 8) {
    return shortId
  }
  
  // Fallback: check if the entire string is a UUID
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
  if (uuidRegex.test(slugWithId)) {
    return slugWithId
  }
  
  return null
}

/**
 * Generate SEO-friendly profile URL
 * @param username - Username of the user
 * @param walletAddress - Wallet address (fallback if no username)
 * @returns SEO-friendly URL path
 */
export function getProfileUrl(username: string | null, walletAddress: string): string {
  if (username) {
    return `/u/${username.toLowerCase()}`
  }
  // Fallback to shortened wallet address
  return `/u/${walletAddress.slice(0, 8)}`
}

/**
 * Extract username or wallet from profile URL
 * @param identifier - Username or wallet address from URL
 * @returns The identifier
 */
export function extractProfileIdentifier(identifier: string): string {
  return identifier
}

/**
 * Check if a string is a valid Solana wallet address
 * @param address - String to check
 * @returns true if valid wallet address format
 */
export function isWalletAddress(address: string): boolean {
  // Solana addresses are base58 encoded, typically 32-44 characters
  return /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(address)
}

/**
 * Generate breadcrumb-friendly title
 * @param slug - URL slug
 * @returns Human-readable title
 */
export function slugToTitle(slug: string): string {
  return slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}
