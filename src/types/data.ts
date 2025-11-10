export interface CrewMember {
    id: string;
    name: string;
    photo: string;
    roles: string[];
    seasons: number[];
    contributions: string[];
    memories: string;
    fun_fact: string;
    note: string;
    social: string;
  }
  
  export interface Player {
    id: string;
    name: string;
    seasons: number[];
    tribes: string[];
    placement: number;
    stats: Record<string, unknown>;
    bio: string;
    image: string;
    memorableMoments: string[];
  }
  
  export interface Season {
    seasonNumber: number;
    title: string;
    location: string;
    semesterFilmed: string;
    description: string;
    winner: string;
    logo: string;
    banner: string;
    cover: string;
    images: string[];
    episodesPlaylistId?: string;
    players: string[];
  }
  
  export interface Challenge {
    id: string;
    season: number;
    episode: number;
    name: string;
    type: string;
    winners: string[];
    description: string;
    // INCOMPLETE
  }
  
  export interface Tribe {
    id: string;
    season: number;
    name: string;
    color: string;
    members: string[];
    // INCOMPLETE
  }

  export interface CrewNote {
    id: string;
    crewId: string;
    content: string;
    author: string;
    createdAt: string;
    password?: string; // Not exposed to frontend, only used for filtering
  }
