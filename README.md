# Scryfall MCP Server

A Model Context Protocol (MCP) server that brings Magic: The Gathering card data directly into Claude Desktop. Ask Claude about any Magic card, and it will provide detailed information from Scryfall's comprehensive database.

## What Can It Do?

- **Search for Cards** - Find cards by name, type, color, mana cost, or any game characteristic you can think of
- **Get Card Details** - View complete card information including prices, format legalities, and high-quality images
- **Explore Sets** - Learn about Magic sets, their release dates, and what cards they contain
- **Random Cards** - Discover random cards for deck inspiration or just for fun
- **Smart Caching** - Previously viewed cards load instantly from a local cache
- **Resource Browser** - Access your recently viewed cards through Claude's resource system

## Installation

### Prerequisites

You'll need **Node.js and npm** installed on your computer. npm is a tool that helps install and manage the software this server needs to run.

**To install Node.js and npm:**
- **On Mac:**
  - Download from [nodejs.org](https://nodejs.org/) and run the installer, or
  - If you have Homebrew: `brew install node`
- **On Windows:**
  - Download from [nodejs.org](https://nodejs.org/) and run the installer

To verify it's installed, open a terminal and type: `npm --version`

### Installation Steps

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

## How to Use

Once you've installed and configured the server, you can simply ask Claude about Magic cards in natural language. Here are some examples:

### Searching for Cards
- "Search for Lightning Bolt"
- "Find all red creatures with power 4 or greater"
- "Show me cards with 'draw a card' in their text"
- "Find blue instants that cost 2 mana"

### Getting Card Information
- "Tell me about Black Lotus"
- "What are the format legalities for Sol Ring?"
- "Show me the current price of Jace, the Mind Sculptor"
- "Get details for Ragavan, Nimble Pilferer"

### Exploring Sets
- "What's in the Dominaria United set?"
- "Tell me about set code MOM"
- "Show me information about the latest set"

### Random Discovery
- "Show me a random card"
- "Give me 3 random creatures"
- "Surprise me with 5 random cards"

### Accessing Recently Viewed Cards
Cards you've already looked up are cached locally and appear in Claude's resource browser, making them quick to access again without additional searches.

## Technical Details

### Available Tools

The server provides these tools that Claude can use:

**`search_cards`** - Search for cards using Scryfall's powerful search syntax
- Supports searching by name, type, color, mana cost, card text, set, rarity, and more
- Returns up to 10 results by default (configurable)

**`get_card_details`** - Get complete information about a specific card
- Includes prices, legalities, images, and all card attributes
- Uses smart caching to speed up repeated lookups

**`get_set_info`** - Get information about a Magic set
- Requires the set code (like "dmu" for Dominaria United or "mom" for March of the Machine)

**`get_random_card`** - Get random cards
- Can request multiple random cards at once
- Great for deck inspiration or exploring the game

### Resources Feature

The server implements MCP resources, which means:
- Cards you look up are cached locally for 1 hour
- Recently viewed cards appear in Claude's resource browser
- Cached cards load instantly without making new API requests
- The cache automatically cleans up old entries

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

## Performance & Limits

### Smart Caching
To improve speed and reduce unnecessary API calls, this server caches card information:
- Cached cards load instantly
- Cache expires after 1 hour
- Up to 100 cards stored in memory at once

### Scryfall API Rate Limits
This server uses Scryfall's free API, which allows:
- Up to 100 requests per second
- No API key required

The server automatically handles errors and rate limits gracefully.

## Troubleshooting

### The server isn't showing up in Claude Desktop

1. **Check your configuration file** - Make sure the path is correct and the JSON syntax is valid
   - On Mac: `cat ~/Library/Application\ Support/Claude/claude_desktop_config.json`
   - On Windows: Open the file in Notepad and verify it looks correct

2. **Verify the path is absolute** - The path must be complete (like `/Users/yourname/projects/ScryfallMCP/dist/index.js`), not relative (like `./dist/index.js`)

3. **Make sure it built successfully:**
   ```bash
   npm run build
   ```

4. **Restart Claude Desktop completely** - Quit the app entirely and reopen it

### Claude says "Unknown tool" or the tools don't work

- This usually means Claude Desktop didn't reload the configuration
- Try restarting Claude Desktop again
- Check that the `dist/index.js` file exists after running `npm run build`

### API or connection errors

1. **Check your internet connection** - The server needs to reach Scryfall's API
2. **Visit https://scryfall.com** to make sure their service is up
3. **Look at the console output** when running `npm run dev` to see detailed error messages

### Build or installation problems

- **"npm: command not found"** - You need to install Node.js and npm (see Prerequisites above)
- **Build failures** - Try deleting the `node_modules` folder and running `npm install` again
- **Permission errors** - Make sure you have permission to read and execute files in the project folder

## Contributing

Want to improve this server? Contributions are welcome!

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request with a clear description of *what* you've added and *why*

## License

This project is licensed under the MIT License.

## Acknowledgments

- [Scryfall](https://scryfall.com) for providing the excellent Magic: The Gathering API
- [Model Context Protocol](https://modelcontextprotocol.io) for the MCP specification
- [Anthropic](https://anthropic.com) for Claude and MCP support