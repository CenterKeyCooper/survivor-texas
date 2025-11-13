import { CrewMember, Player, Season, Challenge, Tribe } from '@/types/data';

// Helper function to read JSON files from filesystem during build, or fetch in browser
async function readDataFile<T>(filename: string): Promise<T> {
  if (typeof window === 'undefined') {
    const { readFileSync } = await import('fs')
    const path = await import('path')
    const filePath = path.join(process.cwd(), 'public', 'data', filename)
    const fileContents = readFileSync(filePath, 'utf8')
    return JSON.parse(fileContents) as T
  }

  // client-side fallback
  const res = await fetch(`/data/${filename}`)
  return res.json()
}

export async function fetchSeasons(): Promise<Season[]> {
  return readDataFile<Season[]>('seasons.json');
}

export async function fetchCrew(): Promise<CrewMember[]> {
  return readDataFile<CrewMember[]>('crew.json');
}

export async function fetchPlayers(): Promise<Record<string, Player>> {
  return readDataFile<Record<string, Player>>('player.json');
}

export async function fetchChallenges(): Promise<Challenge[]> {
  return readDataFile<Challenge[]>('challenges.json');
}


// Data processing utilities
export function getFeaturedSeason(seasons: Season[]): Season {
  return seasons[seasons.length - 1]; // Most recent season
}

export function getRecentSeasons(seasons: Season[], count = 5): Season[] {
  return [...seasons]
    .sort((a, b) => b.seasonNumber - a.seasonNumber)
    .slice(1, count);
}

export function sortCrewBySeasons(crew: CrewMember[]): CrewMember[] {
  return [...crew].sort((a, b) => {
    // Pin Founders at the top
    const aIsFounder = a.roles.includes('Founder');
    const bIsFounder = b.roles.includes('Founder');
    if (aIsFounder && !bIsFounder) return -1;
    if (!aIsFounder && bIsFounder) return 1;
    
    // Sort by seasons: most recent first, then next most recent, etc.
    const aSeasons = [...a.seasons].sort((x, y) => y - x);
    const bSeasons = [...b.seasons].sort((x, y) => y - x);
    
    for (let i = 0; i < Math.max(aSeasons.length, bSeasons.length); i++) {
      const aSeason = aSeasons[i] ?? 0;
      const bSeason = bSeasons[i] ?? 0;
      if (bSeason !== aSeason) {
        return bSeason - aSeason;
      }
    }
    return 0;
  });
}

export function getRandomCrewMembers(crew: CrewMember[], count = 4): CrewMember[] {
  // Weight crew members by sum of seasons they worked on
  const weightedCrew: CrewMember[] = [];
  for (const member of crew) {
    const weight = member.seasons.reduce((sum, season) => sum + season, 0);
    for (let i = 0; i < weight; i++) {
      weightedCrew.push(member);
    }
  }
  
  // Shuffle and select unique members
  const shuffled = [...weightedCrew].sort(() => 0.5 - Math.random());
  const selectedIds = new Set<string>();
  const selected: CrewMember[] = [];
  for (const member of shuffled) {
    if (selected.length >= count) break;
    if (!selectedIds.has(member.id)) {
      selectedIds.add(member.id);
      selected.push(member);
    }
  }
  
  return selected;
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

export async function fetchTribes(): Promise<Record<string, Tribe>> {
  return readDataFile<Record<string, Tribe>>('tribes.json');
}

export function getTribeColor(tribes: Record<string, Tribe>, tribeId: string): string {
  return tribes[tribeId]?.color || '#FFFFFF';
}

export function getPlayerTribeColor(tribes: Record<string, Tribe>, player: Player): string {
  // Get the first tribe color (most players are on one tribe)
  const firstTribe = player.tribes[0];
  return getTribeColor(tribes, firstTribe);
}