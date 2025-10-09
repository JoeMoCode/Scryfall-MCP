import * as Scryfall from 'scryfall-sdk';

export async function handleSearchCards(args: { query: string; limit?: number }) {
  try {
    const { query, limit = 10 } = args;

    console.error(`Searching for cards with query: ${query}`);

    const cards = await Scryfall.Cards.search(query)
      .waitForAll()
      .then(cards => cards.slice(0, limit));

    const results = cards.map(card => ({
      name: card.name,
      mana_cost: card.mana_cost || '',
      type_line: card.type_line,
      oracle_text: card.oracle_text || '',
      set_name: card.set_name,
      rarity: card.rarity,
      prices: card.prices
    }));

    return {
      content: [
        {
          type: 'text',
          text: `Found ${results.length} cards matching "${query}":\n\n` +
                results.map(card =>
                  `**${card.name}** ${card.mana_cost}\n` +
                  `${card.type_line}\n` +
                  `${card.oracle_text}\n` +
                  `*Set: ${card.set_name} (${card.rarity})*\n` +
                  `*USD: $${card.prices?.usd || 'N/A'}*`
                ).join('\n\n---\n\n')
        }
      ]
    };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error(`Error searching cards: ${errorMessage}`);
    return {
      content: [
        {
          type: 'text',
          text: `Error searching cards: ${errorMessage}`
        }
      ],
      isError: true
    };
  }
}
