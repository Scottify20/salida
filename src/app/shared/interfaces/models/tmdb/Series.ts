import {
  Media,
  ProductionCompany,
  ProductionCountry,
  SpokenLanguage,
  Keyword,
  CountryProviders,
  Review,
  MediaImages,
  Genre,
  MediaSummary,
  BaseMedia,
} from './All';

type EpisodeType = 'Regular' | 'Special' | 'Bonus' | 'finale' | 'standard';

export interface Series extends Media {
  media_type: 'tv'; // Explicitly defines the media type as TV
  created_by: SeriesCreator[]; // List of creators involved in the series
  episode_run_time: string[]; // Typical runtime of each episode
  first_air_date: string; // Date when the first episode aired
  homepage: string; // Official website of the series
  in_production: boolean; // Indicates whether the series is still being produced
  languages: string[]; // Languages available for the series
  last_air_date: string; // Date when the last episode aired
  last_episode_to_air: EpisodeToAir; // Details of the last aired episode
  name: string; // Official name of the series
  next_episode_to_air: EpisodeToAir | null;
  networks: TvNetwork[]; // Networks where the series airs/aired
  number_of_episodes: number; // Total number of episodes
  number_of_seasons: number; // Total number of seasons
  origin_country: string[]; // Countries where the series was produced
  original_name: string; // Original name in the original language
  production_companies: ProductionCompany[]; // Companies involved in production
  production_countries: ProductionCountry[]; // Countries involved in production
  seasons: SeasonSummary[]; // Summary of each season
  spoken_languages: SpokenLanguage[]; // Languages spoken in the series
  status: string; // Status of the series (Returning Series, Ended, etc.)
  tagline: string; // Catchphrase or slogan associated with the series
  type: string; // Type of series (Scripted, Reality, etc.)
  genres: Genre[];
  aggregate_credits: {
    cast: SeriesCastCredit[];
    crew: SeriesCrewCredit[];
  };
  images: MediaImages;
  external_ids: {
    imdb_id: string | null;
    freebase_mid: string | null;
    freebase_id: string | null;
    tvdb_id: number;
    tvrage_id: string | null;
    wikidata_id: string | null;
    facebook_id: string | null;
    instagram_id: string | null;
    twitter_id: string | null;
  };
  content_ratings: {
    results: ContentRating[];
  };
  keywords: {
    results: Keyword[];
  };
  'watch/providers': {
    results: Record<string, CountryProviders | undefined>;
  };
  reviews: {
    page: number;
    results: Review[];
    total_pages: number;
    total_results: number;
  };
  overview: string; // Ensure overview is always a string
}

export interface TrendingSeries {
  page: number;
  results: SeriesSummary[];
  total_pages: number;
  total_results: number;
}

export interface SeriesSummary extends MediaSummary {
  media_type?: 'tv'; // not present in some responses
  first_air_date: string;
  name: string;
  original_name: string;
  origin_country: string[];
}

export interface SeriesSummaryResults {
  page: number;
  results: SeriesSummary[];
  total_pages: number;
  total_results: number;
}

interface SeriesExternalIds {
  freebase_mid?: string;
  freebase_id?: string;
  tvdb_id: number;
  tvrage_id?: string;
  wikidata_id?: string;
}

interface EpisodeCastCredit {
  character: string;
  credit_id: string;
  order: number;
  adult: boolean;
  gender: number | null;
  id: number;
  known_for_department: string;
  name: string;
  original_name: string;
  popularity: number;
  profile_path: string | null;
}

interface EpisodeCrewCredit {
  job: string;
  department: string;
  credit_id: string;
  adult: boolean;
  gender: number | null;
  id: number;
  known_for_department: string;
  name: string;
  original_name: string;
  popularity: number;
  profile_path: string | null;
}

export interface SeriesCastCredit {
  roles: Role[];
  adult: boolean;
  gender: number;
  id: number;
  known_for_department: string;
  name: string;
  original_name: string;
  popularity: number;
  profile_path: string | null;
  total_episode_count: number;
  order: number;
}

export interface SeriesCrewCredit {
  adult: boolean;
  gender: number;
  id: number;
  known_for_department: string;
  name: string;
  original_name: string;
  popularity: number;
  profile_path: string | null;
  jobs: Job[];
  department: string;
  total_episode_count: number;
}

interface Job {
  credit_id: string;
  job: string;
  episode_count: number;
}

interface Role {
  credit_id: string;
  character: string;
  episode_count: number;
}

interface SeriesCreator {
  id: number;
  credit_id: string;
  name: string;
  original_name: string;
  gender: number;
  profile_path: string;
}

interface ContentRating {
  descriptors: string[];
  iso_3166_1: string; // 'US'
  rating: string; //'TV-MA'
}

export interface SeasonSummary {
  air_date: string | null; //'2019-07-25'
  episode_count: number;
  id: number;
  name: string;
  overview: string;
  poster_path: string | null;
  season_number: number;
  vote_average: number;
}

interface TvNetwork {
  id: number;
  logo_path: string;
  name: string; //'Prime Video'
  origin_country: string; // sometimes empty string
}

export interface Season {
  _id: string;
  air_date: string;
  episodes: Episode[];
  name: string;
  overview: string;
  id: number;
  poster_path: string;
  season_number: number;
  vote_average: number;
  external_ids: SeriesExternalIds;
  images: MediaImages;
}

export interface Episode extends BaseMedia {
  air_date: string;
  episode_number: number;
  episode_type: EpisodeType;
  production_code: string;
  runtime: number | null;
  season_number: number;
  show_id: number;
  still_path: string | null;
  crew: EpisodeCrewCredit[];
  guest_stars: EpisodeCastCredit[];
}

interface EpisodeToAir {
  id: number;
  name: string;
  overview: string;
  vote_average: number;
  vote_count: number;
  air_date: string;
  episode_number: number;
  episode_type: string;
  production_code: string;
  runtime: number;
  season_number: number;
  show_id: number;
  still_path: string;
}
