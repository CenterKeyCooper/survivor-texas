import { CrewMember, Player, Season, Challenge, Tribe } from '@/types/data';

export async function fetchSeasons(): Promise<Season[]> {
  const res = await fetch('/data/seasons.json');
  return res.json();
}

export async function fetchCrew(): Promise<CrewMember[]> {
  const res = await fetch('/data/crew.json');
  return res.json();
}

export async function fetchPlayers(): Promise<Record<string, Player>> {
  const res = await fetch('/data/player.json');
  return res.json();
}

export async function fetchChallenges(): Promise<Challenge[]> {
  const res = await fetch('/data/challenges.json');
  return res.json();
}

export async function fetchTribes(): Promise<Tribe[]> {
  const res = await fetch('/data/tribes.json');
  return res.json();
}

// Data processing utilities
export function getFeaturedSeason(seasons: Season[]): Season {
  return seasons[seasons.length - 1]; // Most recent season
}

export function getRecentSeasons(seasons: Season[], count = 5): Season[] {
  return [...seasons]
    .sort((a, b) => b.seasonNumber - a.seasonNumber)
    .slice(0, count);
}

export function getRandomCrewMembers(crew: CrewMember[], count = 4): CrewMember[] {
  return [...crew].sort(() => 0.5 - Math.random()).slice(0, count);
}

export function getPlayerChallengeWins(playerId: string, challenges: Challenge[]): number {
  return challenges.filter(challenge => 
    challenge.winners.includes(playerId)
  ).length;
}

export function getPlayersBySeason(players: Record<string, Player>, season: number): Player[] {
  return Object.values(players).filter(player => 
    player.seasons.includes(season)
  );
}

export function getPlayersByTribe(players: Record<string, Player>, tribe: string): Player[] {
  return Object.values(players).filter(player => 
    player.tribes.includes(tribe)
  );
}

export function getWinners(players: Record<string, Player>): Player[] {
  return Object.values(players).filter(player => player.placement === 1);
}

export function getFinalists(players: Record<string, Player>): Player[] {
  return Object.values(players).filter(player => player.placement <= 3);
}

export function getPlayersSortedByPlacement(players: Record<string, Player>): Player[] {
  return Object.values(players).sort((a, b) => a.placement - b.placement);
}