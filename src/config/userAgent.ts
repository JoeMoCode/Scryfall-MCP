/**
 * Configure fetch with a custom User-Agent for Scryfall API compliance
 * Scryfall requires a descriptive User-Agent header
 */

export function configureUserAgent() {
  // Store the original fetch
  const originalFetch = global.fetch;

  // Wrap fetch to add User-Agent header
  global.fetch = async (
    input: RequestInfo | URL,
    init?: RequestInit
  ): Promise<Response> => {
    // Create a new headers object if not present
    const headers = new Headers(init?.headers || {});

    // Set a descriptive User-Agent if not already set
    if (!headers.has('User-Agent')) {
      headers.set(
        'User-Agent',
        'ScryfallMCPServer/1.0 (+https://github.com/joemocode/scryfall-mcp)'
      );
    }

    // Call the original fetch with updated headers
    return originalFetch(input, { ...init, headers });
  };
}
