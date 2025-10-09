import * as Scryfall from 'scryfall-sdk';

export async function handleGetRandomCard(args: { count?: number }) {
  try {
    const { count = 1 } = args;

    console.error(`Getting ${count} random card(s)`);

    const results = [];

    for (let i = 0; i < count; i++) {
      const card = await Scryfall.Cards.random();

      const details = {
        name: card.name,
        mana_cost: card.mana_cost || '',
        cmc: card.cmc,
        type_line: card.type_line,
        oracle_text: card.oracle_text || '',
        power: card.power,
        toughness: card.toughness,
        loyalty: card.loyalty,
        set_name: card.set_name,
        set_code: card.set,
        rarity: card.rarity,
        artist: card.artist,
        collector_number: card.collector_number,
        prices: card.prices,
        legalities: card.legalities,
        image_uris: card.image_uris
      };

      let detailText = `**${details.name}** ${details.mana_cost}\n`;
      detailText += `*Mana Value: ${details.cmc}*\n\n`;
      detailText += `**Type:** ${details.type_line}\n\n`;

      if (details.oracle_text) {
        detailText += `**Oracle Text:**\n${details.oracle_text}\n\n`;
      }

      if (details.power && details.toughness) {
        detailText += `**Power/Toughness:** ${details.power}/${details.toughness}\n\n`;
      }

      if (details.loyalty) {
        detailText += `**Loyalty:** ${details.loyalty}\n\n`;
      }

      detailText += `**Set:** ${details.set_name} (${details.set_code.toUpperCase()}) #${details.collector_number}\n`;
      detailText += `**Rarity:** ${details.rarity}\n`;
      detailText += `**Artist:** ${details.artist}\n\n`;

      detailText += `**Prices:**\n`;
      detailText += `- USD: $${details.prices?.usd || 'N/A'}\n`;
      detailText += `- USD Foil: $${details.prices?.usd_foil || 'N/A'}\n`;
      detailText += `- EUR: €${details.prices?.eur || 'N/A'}\n\n`;

      detailText += `**Format Legalities:**\n`;
      Object.entries(details.legalities || {}).forEach(([format, legality]) => {
        if (legality === 'legal') {
          detailText += `- ${format}: ✅ Legal\n`;
        } else if (legality === 'banned') {
          detailText += `- ${format}: ❌ Banned\n`;
        } else if (legality === 'restricted') {
          detailText += `- ${format}: ⚠️ Restricted\n`;
        }
      });

      if (details.image_uris?.normal) {
        detailText += `\n**Card Image:** ${details.image_uris.normal}`;
      }

      results.push(detailText);
    }

    return {
      content: [
        {
          type: 'text',
          text: `Random Card${count > 1 ? 's' : ''}:\n\n` + results.join('\n\n---\n\n')
        }
      ]
    };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error(`Error getting random card: ${errorMessage}`);
    return {
      content: [
        {
          type: 'text',
          text: `Error getting random card: ${errorMessage}`
        }
      ],
      isError: true
    };
  }
}
