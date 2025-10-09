export interface ToolResponse {
  content: Array<{
    type: 'text';
    text: string;
  }>;
  isError?: boolean;
}

export interface CallToolResult {
  content: Array<{
    type: 'text';
    text: string;
  }>;
  isError?: boolean;
}

export interface CardSearchResult {
  name: string;
  mana_cost: string;
  type_line: string;
  oracle_text: string;
  set_name: string;
  rarity: string;
  prices: any;
}

export interface CardDetails {
  name: string;
  mana_cost: string;
  cmc: number;
  type_line: string;
  oracle_text: string;
  power?: string;
  toughness?: string;
  loyalty?: string;
  set_name: string;
  set_code: string;
  rarity: string;
  artist: string;
  collector_number: string;
  prices: any;
  legalities: any;
  image_uris?: any;
}
