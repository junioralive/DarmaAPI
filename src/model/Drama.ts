export interface Drama {
  title?: string;
  id?: string;
  year?: String;
  episodes?: {
    name: string;
    type: string;
    date: string;
    id: string;
    image?: string;
  }[];
  description?: String;
  altTitles?: string[];
  country?: string;
  genre?: string[];
  image?: string;
  status?: string;
  trailer?: string;
  totalEpisodes?: number;
  time?: string;
  type?: string;
  epsNumber?: number;
  actors?: { name: String; image?: String; id?: string }[];
}
export interface Provider {
  name: string;
  url: string;
}

export interface Actor {
  name?: string;
  image?: string;
  id: string;
  otherNames?: string[];
  age?: string;
  dob?: string;
  nationality?: string;
  height?: string;
  about?: string;
  movies?: Drama[];
}
