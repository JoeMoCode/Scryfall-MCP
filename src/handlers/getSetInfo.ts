import * as Scryfall from 'scryfall-sdk';

export async function handleGetSetInfo(args: { set_code: string }) {
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
