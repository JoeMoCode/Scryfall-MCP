import { LRUCache } from 'lru-cache';
import { CardDetails } from '../types/index';

/**
 * Cached card data structure - extends CardDetails with access timestamp
 */
export interface CachedCard extends CardDetails {
  accessedAt: number;
}

/**
 * Card cache configuration
 */
const CACHE_CONFIG = {
  max: 500,  // Maximum number of cards to cache
  ttl: 1000 * 60 * 60,  // 1 hour TTL (prices change frequently)
  updateAgeOnGet: true,  // Update TTL on cache hit
  updateAgeOnHas: false,  // Don't update TTL on has() check
};

/**
 * LRU cache for card data
 * - Stores up to 500 cards
 * - 1 hour TTL to keep prices/legalities fresh
 * - Automatically evicts least recently used cards
 */
class CardCache {
  private cache: LRUCache<string, CachedCard>;

  constructor() {
    this.cache = new LRUCache<string, CachedCard>(CACHE_CONFIG);
  }

  /**
   * Get a card from the cache
   */
  get(cardName: string): CachedCard | undefined {
    const normalized = this.normalizeCardName(cardName);
    const card = this.cache.get(normalized);

    if (card) {
      // Update access time on get
      card.accessedAt = Date.now();
      this.cache.set(normalized, card);
    }

    return card;
  }

  /**
   * Store a card in the cache
   */
  set(cardName: string, cardData: CardDetails): void {
    const normalized = this.normalizeCardName(cardName);
    const cachedCard: CachedCard = {
      ...cardData,
      accessedAt: Date.now(),
    };
    this.cache.set(normalized, cachedCard);
  }

  /**
   * Check if a card exists in the cache
   */
  has(cardName: string): boolean {
    const normalized = this.normalizeCardName(cardName);
    return this.cache.has(normalized);
  }

  /**
   * Get all cached card names
   * Returns an array of card names sorted by most recently accessed
   */
  getCachedCardNames(): string[] {
    const entries: Array<{ name: string; accessedAt: number }> = [];

    for (const [, data] of this.cache.entries()) {
      // Use the actual card name from the data, not the normalized cache key
      entries.push({ name: data.name, accessedAt: data.accessedAt });
    }

    // Sort by most recently accessed
    entries.sort((a, b) => b.accessedAt - a.accessedAt);

    return entries.map(entry => entry.name);
  }

  /**
   * Get cache statistics
   */
  getStats() {
    return {
      size: this.cache.size,
      max: CACHE_CONFIG.max,
      ttl: CACHE_CONFIG.ttl,
    };
  }

  /**
   * Clear the entire cache
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Normalize card name for consistent cache keys
   * Converts to lowercase and trims whitespace
   */
  private normalizeCardName(cardName: string): string {
    return cardName.toLowerCase().trim();
  }
}

// Export a singleton instance
export const cardCache = new CardCache();
