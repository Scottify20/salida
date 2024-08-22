import {
  CountryProviders,
  Genre,
  Keyword,
  Media,
  MediaImages,
  MediaSummary,
  ProductionCompany,
  ProductionCountry,
  ReleaseDate,
  Review,
  SpokenLanguage,
} from './All';

export interface Movie extends Media {
  adult: boolean;
  media_type: 'movie'; // Explicitly defines the media type as Movie
  budget: number; // The budget of the movie in dollars
  homepage: string | null; // Official website of the movie
  imdb_id: string | null; // The IMDb ID of the movie
  origin_country: string[]; // Countries where the movie was produced
  release_date: string; // Original theatrical release date
  revenue: number; // Total revenue generated by the movie in dollars
  runtime: number | null; // Duration of the movie in minutes
  spoken_languages: SpokenLanguage[]; // Languages spoken in the movie
  status: string; // The status of the movie (Released, Rumored, etc.)
  tagline: string | null; // Catchphrase or slogan associated with the movie
  title: string; // Official title of the movie
  video: boolean; // Indicates whether there are trailers or clips available
  images: MediaImages;
  genres: Genre[];
  production_companies: ProductionCompany[];
  production_countries: ProductionCountry[];
  credits: {
    cast: CastCredit[];
    crew: Credit[];
  };
  external_ids: MovieExternalIds;
  release_dates: {
    results: ReleasesOfCountry[];
  };
  keywords: { keywords: Keyword[] };
  'watch/providers': {
    results: Record<string, CountryProviders | undefined>;
  };
  reviews: {
    page: number;
    results: Review[];
    total_pages: number;
    total_results: number;
  };
}

export interface TrendingMovies {
  page: number;
  results: MovieSummary[];
  total_pages: number;
  total_results: number;
}

export interface MovieSummary extends MediaSummary {
  original_title: string;
  title: string;
  release_date: string;
  video: boolean;
}

interface CastCredit {
  adult: boolean;
  gender: number | null; // Gender might be unknown
  id: number;
  known_for_department: string;
  name: string;
  original_name: string;
  popularity: number;
  profile_path: string | null;
  cast_id: number;
  character: string;
  credit_id: string;
  order: number;
}

export enum ReleaseType {
  Premiere = 1,
  'Theatrical (limited)' = 2,
  Theatrical = 3,
  Digital = 4,
  Physical = 5,
  TV = 6,
}

export interface ReleasesOfCountry {
  iso_3166_1: string;
  release_dates: ReleaseDate[];
}

interface MovieExternalIds {
  imdb_id: string | null;
  wikidata_id: string | null;
  facebook_id: string | null;
  instagram_id: string | null;
  twitter_id: string | null;
}

export interface Credit {
  adult: boolean;
  credit_id: string;
  department: string;
  gender: number;
  id: number;
  job: string;
  known_for_department: string;
  name: string;
  original_name: string;
  popularity: number;
  profile_path: string | null;
}
