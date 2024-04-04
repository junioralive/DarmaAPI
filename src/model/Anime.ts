export interface Anime {
  id: string;
  aniId?: number;
  poster?: string;
  cover?: string;
  trailer?: string;
  desc?: string;
  title?: string;
  altTitle?: string[];
  year?: string;
  status?: string;
  type?: string;
  totalEpisodes?: number;
  tags?: string[];
  episodes?: Episode[];
  episodeId?: String;
}

export interface Episode {
  id?: string;
  anime_id?: number;
  episode: string;
  title?: string;
  image?: string;
  disc?: string;
  type?: string;
  duration?: string;
  created_at?: string;
}
