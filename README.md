# Scryfall MCP Server

A Model Context Protocol (MCP) server that provides Magic: The Gathering card data through Scryfall's API. This server enables Claude Desktop to search for cards, get detailed card information, retrieve set data, and access random cards.

## Features

- **Card Search** - Search for cards by name, type, mana cost, or any other criteria
- **Card Details** - Get comprehensive card information including prices, legalities, and images
- **Set Information** - Retrieve detailed information about Magic sets
- **Random Cards** - Get random cards for inspiration or discovery
- **Rich Formatting** - Well-formatted responses with card details, prices, and legalities

## Installation

1. **Clone or download this repository**

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Build the server:**
   ```bash
   npm run build
   ```

## Configuration

### For Claude Desktop

1. **Locate your Claude Desktop config file:**
   - **macOS:** `~/Library/Application\ Support/Claude/claude_desktop_config.json`
   - **Windows:** `%APPDATA%\Claude\claude_desktop_config.json`

2. **Add the server configuration:**
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

   Replace `/absolute/path/to/your/project` with the actual path to this project directory.

3. **Restart Claude Desktop**

## Usage

Once configured, you can use the following tools in Claude Desktop:

### Search Cards
```
Search for Lightning Bolt
Find all red creatures with power 4
Show me cards with "draw a card" in the text
```

### Get Card Details
```
Get details for Black Lotus
Show me information about Jace, the Mind Sculptor
What are the legalities for Sol Ring?
```

### Set Information
```
Tell me about set dmu
What's in the Dominaria United set?
Show me info about set code neo
```

### Random Cards
```
Give me a random card
Show me 3 random cards
Get 5 random creatures
```

## Available Tools

### `search_cards`
Search for Magic: The Gathering cards by various criteria.

**Parameters:**
- `query` (required): Search query (card name, type, mana cost, etc.)
- `limit` (optional): Maximum number of results (default: 10)

**Example:** `search_cards("lightning bolt")`

### `get_card_details`
Get detailed information about a specific card by exact name.

**Parameters:**
- `name` (required): Exact card name

**Example:** `get_card_details("Black Lotus")`

### `get_set_info`
Get information about a Magic: The Gathering set.

**Parameters:**
- `set_code` (required): Three or four letter set code (e.g., "dmu", "neo")

**Example:** `get_set_info("dmu")`

### `get_random_card`
Get one or more random Magic: The Gathering cards.

**Parameters:**
- `count` (optional): Number of random cards to get (default: 1)

**Example:** `get_random_card(3)`

## Development

### Running in Development Mode
```bash
npm run dev
```

### Building
```bash
npm run build
```

### Project Structure
```
├── src/
│   └── index.ts          # Main server implementation
├── dist/                 # Compiled JavaScript output
├── package.json          # Node.js dependencies and scripts
├── tsconfig.json         # TypeScript configuration
└── README.md            # This file
```

## API Rate Limits

This server uses the Scryfall API, which has the following rate limits:
- 100 requests per second
- Be respectful with your usage

The server includes error handling for rate limits and API issues.

## Troubleshooting

### Server Not Appearing in Claude Desktop

1. **Check config file path and syntax:**
   ```bash
   cat ~/Library/Application\ Support/Claude/claude_desktop_config.json
   ```

2. **Verify the server path is absolute and correct**

3. **Check server builds successfully:**
   ```bash
   npm run build
   ```

4. **Test server manually:**
   ```bash
   npm run dev
   ```

### API Errors

1. **Check internet connection**
2. **Verify Scryfall service status at https://scryfall.com**
3. **Check server logs for detailed error messages**

### Common Issues

- **"Unknown tool" errors:** Restart Claude Desktop after configuration changes
- **Build failures:** Ensure TypeScript dependencies are installed
- **Permission errors:** Check file permissions on the dist/index.js file

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Acknowledgments

- [Scryfall](https://scryfall.com) for providing the excellent Magic: The Gathering API
- [Model Context Protocol](https://modelcontextprotocol.io) for the MCP specification
- [Anthropic](https://anthropic.com) for Claude and MCP support