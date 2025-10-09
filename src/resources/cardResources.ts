import * as Scryfall from 'scryfall-sdk';
import { cardCache } from '../cache/cardCache';
import { CardDetails } from '../types/index';

/**
 * Get a card resource by name
 * This returns the full card data as a JSON resource
 * Uses LRU cache with 1-hour TTL to reduce API calls and improve performance
 */
export async function getCardResource(cardName: string) {
  try {
    // Check cache first
    let cardData = cardCache.get(cardName);

    if (!cardData) {
      // Cache miss - fetch from Scryfall API
      console.error(`Cache miss for card: ${cardName}`);
      const card = await Scryfall.Cards.byName(cardName);

      // Create CardDetails object
      const details: CardDetails = {
        name: card.name,
        mana_cost: card.mana_cost || '',
        cmc: card.cmc,
        type_line: card.type_line,
        oracle_text: card.oracle_text || '',
        power: card.power || undefined,
        toughness: card.toughness || undefined,
        loyalty: card.loyalty || undefined,
        set_name: card.set_name,
        set_code: card.set,
        rarity: card.rarity,
        artist: card.artist || '',
        collector_number: card.collector_number,
        prices: card.prices,
        legalities: card.legalities,
        image_uris: card.image_uris
      };

      // Store in cache
      cardCache.set(cardName, details);
      cardData = cardCache.get(cardName)!;
    } else {
      console.error(`Cache hit for card: ${cardName}`);
    }

    return {
      contents: [
        {
          uri: `scryfall://card/${encodeURIComponent(cardName)}`,
          mimeType: 'application/json',
          text: JSON.stringify(cardData, null, 2)
        }
      ]
    };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    throw new Error(`Failed to get card resource: ${errorMessage}`);
  }
}

/**
 * List available card resources
 * Returns recently accessed cards from the cache, sorted by most recent first
 */
export async function listCardResources() {
  const cachedCards = cardCache.getCachedCardNames();

  return {
    resources: cachedCards.map(cardName => ({
      uri: `scryfall://card/${encodeURIComponent(cardName)}`,
      name: cardName,
      description: `Get detailed information about ${cardName}`,
      mimeType: 'application/json'
    }))
  };
}
