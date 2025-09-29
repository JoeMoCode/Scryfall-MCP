# MCP Server for Scryfall Implementation Guide

## Overview

This guide outlines the steps to create a Model Context Protocol (MCP) server that integrates with Scryfall's Magic: The Gathering API using their TypeScript client.

## Prerequisites

- Node.js (18+ recommended)
- TypeScript knowledge
- Basic understanding of Magic: The Gathering terminology
- Claude Desktop app for testing

## Project Setup

### 1. Initialize Project

```bash
mkdir scryfall-mcp-server
cd scryfall-mcp-server
npm init -y
```

### 2. Install Dependencies

```bash
# MCP SDK
npm install @modelcontextprotocol/sdk

# Scryfall TypeScript client
npm install scryfall-sdk

# Development dependencies
npm install -D typescript @types/node ts-node
```

### 3. Configure TypeScript

Create `tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

### 4. Update package.json

Add scripts:

```json
{
  "scripts": {
    "build": "tsc",
    "start": "node dist/index.js",
    "dev": "ts-node src/index.ts"
  }
}
```

## Implementation

### 1. Create Server Structure

Create `src/index.ts`:

```typescript
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

// Tool definitions will go here
// Handler implementations will go here

// Start server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('Scryfall MCP Server running on stdio');
}

main().catch(console.error);
```

### 2. Define Scryfall Tools

#### Core Tools to Implement:

1. **search_cards** - Search for cards by various criteria
2. **get_card_details** - Get detailed information about a specific card
3. **get_set_info** - Retrieve Magic set information
4. **search_prices** - Get current card pricing
5. **get_rulings** - Get card rulings and errata

#### Example Tool Implementation:

```typescript
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
              description: 'Search query (card name, type, etc.)'
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
      // Additional tools...
    ]
  };
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  switch (name) {
    case 'search_cards':
      return await handleSearchCards(args);
    // Additional handlers...
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
});
```

### 3. Implement Tool Handlers

```typescript
async function handleSearchCards(args: any) {
  try {
    const { query, limit = 10 } = args;

    const cards = await Scryfall.Cards.search(query)
      .waitForAll()
      .then(cards => cards.slice(0, limit));

    const results = cards.map(card => ({
      name: card.name,
      mana_cost: card.mana_cost,
      type_line: card.type_line,
      oracle_text: card.oracle_text,
      set_name: card.set_name,
      rarity: card.rarity,
      prices: card.prices
    }));

    return {
      content: [
        {
          type: 'text',
          text: `Found ${results.length} cards:\n\n` +
                results.map(card =>
                  `**${card.name}** ${card.mana_cost || ''}\n` +
                  `${card.type_line}\n` +
                  `${card.oracle_text}\n` +
                  `Set: ${card.set_name} (${card.rarity})\n`
                ).join('\n---\n')
        }
      ]
    };
  } catch (error) {
    return {
      content: [
        {
          type: 'text',
          text: `Error searching cards: ${error.message}`
        }
      ],
      isError: true
    };
  }
}
```

## Configuration

### 1. Build the Server

```bash
npm run build
```

### 2. Configure Claude Desktop

Edit `~/Library/Application Support/Claude/claude_desktop_config.json` (macOS) or equivalent:

```json
{
  "mcpServers": {
    "scryfall": {
      "command": "node",
      "args": ["/absolute/path/to/your/project/dist/index.js"]
    }
  }
}
```

### 3. Restart Claude Desktop

The server should now be available in Claude Desktop.

## Best Practices

### Error Handling
- Always wrap Scryfall API calls in try-catch blocks
- Provide meaningful error messages to users
- Handle rate limiting gracefully

### Logging
- Use `console.error()` for logging (never `console.log()`)
- Log important events and errors for debugging

### Response Formatting
- Format card data in a readable way
- Include relevant information (name, cost, text, set, rarity)
- Use markdown formatting for better readability

### Rate Limiting
- Respect Scryfall's API rate limits
- Consider implementing caching for frequently requested data
- Add delays between requests if necessary

## Testing

### 1. Local Testing
```bash
npm run dev
```

### 2. Test with Claude Desktop
- Open Claude Desktop
- Try commands like "Search for Lightning Bolt"
- Verify responses are properly formatted

## Additional Tools to Consider

- **get_card_legality** - Check format legality
- **search_by_artist** - Find cards by artist
- **get_card_image** - Get card image URLs
- **search_commander_legal** - Find Commander-legal cards
- **get_price_history** - Historical pricing data (if available)

## Troubleshooting

### Common Issues:
1. **Server not appearing in Claude**: Check config file path and syntax
2. **API errors**: Verify internet connection and Scryfall service status
3. **TypeScript errors**: Ensure all dependencies are properly installed
4. **Rate limiting**: Add delays between API calls

### Debug Steps:
1. Check server logs in terminal
2. Verify JSON config file syntax
3. Test Scryfall SDK separately
4. Check file permissions on executable

## Resources

- [MCP Documentation](https://modelcontextprotocol.io/docs)
- [Scryfall API Documentation](https://scryfall.com/docs/api)
- [Scryfall SDK GitHub](https://github.com/scryfall/api-types)