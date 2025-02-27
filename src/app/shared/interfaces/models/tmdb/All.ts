import { ReleaseType } from './Movies';

export type MediaType = 'movie' | 'tv';

export type TmdbTimeWindow = 'day' | 'week';

type VideoType =
  | 'Trailer'
  | 'Teaser'
  | 'Clip'
  | 'Featurette'
  | 'Behind the Scenes'
  | 'Opening Credits'
  | 'Blooper Reel';

export interface BaseMedia {
  id: number;
  backdrop_path: string | null;
  overview: string;
  poster_path: string | null;
  adult: boolean;
  original_language: string;
  genre_ids: number[];
  popularity: number;
  vote_average: number;
  vote_count: number;
  [key: string]: any;
}

export interface MediaSummary extends BaseMedia {
  media_type?: MediaType; // not present in some responses
  original_title?: string; // For Movies
  title?: string; // For movies
  release_date?: string; // For movies
  video?: boolean; // For movies
  first_air_date?: string; // For series
  name?: string; // For series
  original_name?: string; // For series
  origin_country?: string[]; // For series
  watch_provider_id?: number | null;
}

export interface PersonSummary {
  adult: boolean;
  id: number;
  name: string;
  gender: number;
  original_name: string;
  popularity: number;
  profile_path: string | null;
  known_for: MediaSummary[];
  known_for_department: string | null;
}

export interface MediaAndPersonSummary extends BaseMedia {
  media_type?: MediaType;
  name: string;
  original_name?: string;
  origin_country?: string[];
  profile_path: string | null;
  known_for: MediaSummary[];
  original_title?: string;
  title?: string;
  release_date?: string;
  video?: boolean;
}

export interface MultiSearchSummaryResults {
  page: number;
  results: MediaAndPersonSummary[];
  total_pages: number;
  total_results: number;
}

export interface Media extends BaseMedia {
  original_title: string;
  videos: { results: Video[] };
  recommendations: {
    page: number;
    results: MediaSummary[];
    total_pages: number;
    total_results: number;
  };
}

export interface Image {
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

export interface Country {
  iso_3166_1: string;
  english_name: string;
  native_name: string;
}

export interface WatchProviders {
  results: WatchProvider[];
}

export interface WatchProvider {
  display_priorities: { [key: string]: number };
  display_priority: number;
  logo_path: string;
  provider_name: string;
  provider_id: number;
}
