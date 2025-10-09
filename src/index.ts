#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ListResourcesRequestSchema,
  ReadResourceRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';

// Import handlers
import { handleSearchCards } from './handlers/searchCards.js';
import { handleGetCardDetails } from './handlers/getCardDetails.js';
import { handleGetSetInfo } from './handlers/getSetInfo.js';
import { handleGetRandomCard } from './handlers/getRandomCard.js';

// Import resource handlers
import { listCardResources, getCardResource } from './resources/cardResources.js';

// Server instance
const server = new Server(
  {
    name: 'scryfall-mcp-server',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
      resources: {},
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
              description: 'Search query using Scryfall syntax. Supported prefixes: c:/color: (card color), id:/identity: (color identity), t:/type: (card/sub/supertype), o:/oracle: (card text), fo:/fulloracle: (full oracle text), keyword:/kw: (keyword abilities), m:/mana: (mana symbols), mv:/manavalue: (converted mana cost), power:, toughness:, loyalty:, devotion:, is: (card characteristics), f:/format: (format legality), e:/s:/set: (set code), r:/rarity:, a:/artist:, year:, game: (paper/arena/mtgo), usd: (USD price), eur: (EUR price), tix: (MTGO ticket price). Operators: >, <, =, >=, <=, !=. Use OR for alternatives, - for negation, parentheses for grouping, quotes for exact phrases, ! for exact names.'
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

// List available resources
server.setRequestHandler(ListResourcesRequestSchema, async () => {
  return await listCardResources();
});

// Read a specific resource
server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
  const uri = request.params.uri;

  console.error(`Reading resource: ${uri}`);

  // Parse the URI to extract the card name
  // Expected format: scryfall://card/{cardName}
  const match = uri.match(/^scryfall:\/\/card\/(.+)$/);

  if (!match) {
    throw new Error(`Invalid resource URI: ${uri}`);
  }

  const cardName = decodeURIComponent(match[1]);
  return await getCardResource(cardName);
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
