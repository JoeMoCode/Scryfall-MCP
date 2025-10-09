import * as Scryfall from 'scryfall-sdk';

/**
 * Get a card resource by name
 * This returns the full card data as a JSON resource
 */
export async function getCardResource(cardName: string) {
  try {
    const card = await Scryfall.Cards.byName(cardName);

    return {
      contents: [
        {
          uri: `scryfall://card/${encodeURIComponent(cardName)}`,
          mimeType: 'application/json',
          text: JSON.stringify({
            id: card.id,
            name: card.name,
            mana_cost: card.mana_cost || '',
            cmc: card.cmc,
            type_line: card.type_line,
            oracle_text: card.oracle_text || '',
            power: card.power,
            toughness: card.toughness,
            loyalty: card.loyalty,
            colors: card.colors,
            color_identity: card.color_identity,
            keywords: card.keywords,
            set_name: card.set_name,
            set_code: card.set,
            rarity: card.rarity,
            artist: card.artist,
            collector_number: card.collector_number,
            prices: card.prices,
            legalities: card.legalities,
            image_uris: card.image_uris,
            scryfall_uri: card.scryfall_uri,
            rulings_uri: card.rulings_uri
          }, null, 2)
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
 * This can be used to provide a list of recently searched or popular cards
 */
export async function listCardResources() {
  // For now, return a basic list
  // In the future, this could be enhanced to track recently accessed cards
  // or provide a curated list of popular cards
  return {
    resources: [
      {
        uri: 'scryfall://card/Black%20Lotus',
        name: 'Black Lotus',
        description: 'Get detailed information about Black Lotus',
        mimeType: 'application/json'
      },
      {
        uri: 'scryfall://card/Lightning%20Bolt',
        name: 'Lightning Bolt',
        description: 'Get detailed information about Lightning Bolt',
        mimeType: 'application/json'
      }
    ]
  };
}
