import { Player } from '@/types/data';

/**
 * Spoiler gate.
 *
 * Seasons >= FIRST_LOCKED_SEASON have their placements / winner / memorable
 * moments stored in data/private/spoilers.json (never served statically) and
 * are only returned by /api/spoilers when the correct password is supplied.
 *
 * To release a season: move its entries from data/private/spoilers.json back
 * into public/data/player.json (placement, memorableMoments) and
 * public/data/seasons.json (winner), then bump FIRST_LOCKED_SEASON below.
 */
export const FIRST_LOCKED_SEASON = 4;

export const SPOILER_STORAGE_KEY = 'survivorTexasSpoilerPassword';

export interface SpoilerData {
  players: Record<string, { placement: number; memorableMoments: string[] }>;
  seasons: Record<string, { winner: string }>;
}

export function isLockedSeason(season: number): boolean {
  return season >= FIRST_LOCKED_SEASON;
}

export function isLockedPlayer(player: Player): boolean {
  return player.seasons.some(isLockedSeason);
}

export function applySpoilers(player: Player, data: SpoilerData | null): Player {
  const extra = data?.players[player.id];
  if (!extra) return player;
  return { ...player, placement: extra.placement, memorableMoments: extra.memorableMoments };
}

export function sortByPlacement(players: Player[]): Player[] {
  return [...players].sort((a, b) => {
    if (a.placement == null || b.placement == null) return a.name.localeCompare(b.name);
    return a.placement - b.placement;
  });
}
