import { ReleaseType } from './Movies';

type MediaType = 'movie' | 'tv';

export type TmdbTimeWindow = 'day' | 'week';

type VideoType =
  | 'Trailer'
  | 'Teaser'
  | 'Clip'
  | 'Featurette'
  | 'Behind the Scenes'
  | 'Opening Credits'
  | 'Blooper Reel';

export interface MediaSummary {
  media_type: MediaType;
  backdrop_path: string | null;
  id: number;
  overview: string;
  poster_path: string | null;
  adult: boolean;
  original_language: string;
  genre_ids: number[];
  popularity: number;
  vote_average: number;
  vote_count: number;
  // Specific to Movies or Series
  original_title?: string; // For Movies
  title?: string; // For movies
  release_date?: string; // For movies
  video?: boolean; // For movies
  first_air_date?: string; // For series
  name?: string; // For series
  original_name?: string; // For series
  origin_country?: string[]; // For series
}

export interface Media {
  id: number;
  adult: boolean;
  backdrop_path: string | null;
  genre_ids: number[];
  original_language: string;
  original_title: string;
  overview: string | null;
  popularity: number;
  poster_path: string | null;

  vote_average: number;
  vote_count: number;
  videos: { results: Video[] };
  recommendations: {
    page: number;
    results: MediaSummary[]; // Use MediaSummary for both movies and series recommendations
    total_pages: number;
    total_results: number;
  };
}

interface Image {
  aspect_ratio: number;
  height: number;
  iso_639_1: string | null;
  file_path: string;
  vote_average: number;
  vote_count: number;
  width: number;
}

export interface MediaImages {
  posters: Image[];
  backdrops: Image[];
  logos: Image[];
}

export interface ReleaseDate {
  certification: string;
  descriptors: any[];
  iso_639_1: string;
  note: string;
  release_date: string;
  type: ReleaseType;
}

export interface Video {
  iso_639_1: string;
  iso_3166_1: string;
  name: string;
  key: string;
  site: string;
  size: number;
  type: VideoType;
  official: boolean;
  published_at: string;
  id: string;
}

export interface CountryProviders {
  link?: string;
  flatrate?: WatchtableInfo[];
  rent?: WatchtableInfo[];
  buy?: WatchtableInfo[];
  ads?: WatchtableInfo[];
}

interface WatchtableInfo {
  logo_path: string;
  provider_id: number;
  provider_name: string;
  display_priority: number;
}

export interface Reviews {
  page: number;
  results: Review[];
  total_pages: number;
  total_results: number;
}

export interface Review {
  author: string;
  author_details: {
    name: string;
    username: string;
    avatar_path: string | null;
    rating: number | null;
  };
  content: string;
  created_at: string;
  id: string;
  updated_at: string;
  url: string;
}

export interface SpokenLanguage {
  english_name: string;
  iso_639_1: string;
  name: string;
}

export interface Keyword {
  name: string;
  id: number;
}

export interface ProductionCompany {
  id: number;
  logo_path: string | null;
  name: string;
  origin_country: string;
}

export interface Genre {
  id: number;
  name: string;
}

export interface ProductionCountry {
  iso_3166_1: string;
  name: string;
}

interface Image {
  aspect_ratio: number;
  height: number;
  iso_639_1: string | null;
  file_path: string;
  vote_average: number;
  vote_count: number;
  width: number;
}
export interface Country {
  iso_3166_1: string;
  english_name: string;
  native_name: string;
}
