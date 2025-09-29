#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import * as Scryfall from 'scryfall-sdk';

// Server instance
const server = new Server(
  {
    name: 'scryfall-mcp-server',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// List available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'search_cards',
        description: 'Search for Magic: The Gathering cards by name, type, or other criteria',
        inputSchema: {
          type: 'object',
          properties: {
            query: {
              type: 'string',
              description: 'Search query (card name, type, mana cost, etc.)'
            },
            limit: {
              type: 'number',
              description: 'Maximum number of results (default: 10)',
              default: 10
            }
          },
          required: ['query']
        }
      },
      {
        name: 'get_card_details',
        description: 'Get detailed information about a specific card by exact name',
        inputSchema: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
              description: 'Exact card name'
            }
          },
          required: ['name']
        }
      },
      {
        name: 'get_set_info',
        description: 'Get information about a Magic: The Gathering set',
        inputSchema: {
          type: 'object',
          properties: {
            set_code: {
              type: 'string',
              description: 'Three or four letter set code (e.g., "dmu", "neo")'
            }
          },
          required: ['set_code']
        }
      },
      {
        name: 'get_random_card',
        description: 'Get one or more random Magic: The Gathering cards',
        inputSchema: {
          type: 'object',
          properties: {
            count: {
              type: 'number',
              description: 'Number of random cards to get (default: 1)',
              default: 1
            }
          }
        }
      }
    ]
  };
});

// Tool handler functions
async function handleSearchCards(args: { query: string; limit?: number }) {
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

async function handleGetCardDetails(args: { name: string }) {
  try {
    const { name } = args;

    console.error(`Getting details for card: ${name}`);

    const card = await Scryfall.Cards.byName(name);

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

    return {
      content: [
        {
          type: 'text',
          text: detailText
        }
      ]
    };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error(`Error getting card details: ${errorMessage}`);
    return {
      content: [
        {
          type: 'text',
          text: `Error getting card details: ${errorMessage}`
        }
      ],
      isError: true
    };
  }
}

async function handleGetSetInfo(args: { set_code: string }) {
  try {
    const { set_code } = args;

    console.error(`Getting set info for: ${set_code}`);

    const set = await Scryfall.Sets.byCode(set_code);

    let setInfo = `**${set.name}** (${set.code.toUpperCase()})\n\n`;
    setInfo += `**Type:** ${set.set_type}\n`;
    setInfo += `**Release Date:** ${set.released_at}\n`;
    setInfo += `**Card Count:** ${set.card_count}\n`;

    if (set.block) {
      setInfo += `**Block:** ${set.block}\n`;
    }

    if (set.parent_set_code) {
      setInfo += `**Parent Set:** ${set.parent_set_code.toUpperCase()}\n`;
    }

    setInfo += `**Digital Only:** ${set.digital ? 'Yes' : 'No'}\n`;
    setInfo += `**Foil Only:** ${set.foil_only ? 'Yes' : 'No'}\n\n`;

    if (set.icon_svg_uri) {
      setInfo += `**Set Icon:** ${set.icon_svg_uri}\n\n`;
    }

    setInfo += `**Scryfall URI:** ${set.scryfall_uri}`;

    return {
      content: [
        {
          type: 'text',
          text: setInfo
        }
      ]
    };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error(`Error getting set info: ${errorMessage}`);
    return {
      content: [
        {
          type: 'text',
          text: `Error getting set info: ${errorMessage}`
        }
      ],
      isError: true
    };
  }
}

async function handleGetRandomCard(args: { count?: number }) {
  try {
    const { count = 1 } = args;

    console.error(`Getting ${count} random card(s)`);

    const results = [];

    for (let i = 0; i < count; i++) {
      const card = await Scryfall.Cards.random();
      results.push({
        name: card.name,
        mana_cost: card.mana_cost || '',
        type_line: card.type_line,
        oracle_text: card.oracle_text || '',
        set_name: card.set_name,
        rarity: card.rarity,
        image_uri: card.image_uris?.normal
      });
    }

    return {
      content: [
        {
          type: 'text',
          text: `Random Card${count > 1 ? 's' : ''}:\n\n` +
                results.map(card =>
                  `**${card.name}** ${card.mana_cost}\n` +
                  `${card.type_line}\n` +
                  `${card.oracle_text}\n` +
                  `*Set: ${card.set_name} (${card.rarity})*` +
                  (card.image_uri ? `\n*Image: ${card.image_uri}*` : '')
                ).join('\n\n---\n\n')
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

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  console.error(`Handling tool call: ${name}`);

  if (!args) {
    throw new Error(`No arguments provided for tool: ${name}`);
  }

  switch (name) {
    case 'search_cards':
      return await handleSearchCards(args as { query: string; limit?: number });
    case 'get_card_details':
      return await handleGetCardDetails(args as { name: string });
    case 'get_set_info':
      return await handleGetSetInfo(args as { set_code: string });
    case 'get_random_card':
      return await handleGetRandomCard(args as { count?: number });
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
});

// Start server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('Scryfall MCP Server running on stdio');
}

main().catch((error) => {
  console.error('Server error:', error);
  process.exit(1);
});