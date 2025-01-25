// https://api.themoviedb.org/3/person/2963?append_to_response=external_ids,images,latest,movie_credits,tv_credits

export interface TrendingPeople {
  page: number;
  results: PersonSummary[];
  total_pages: number;
  total_results: number;
}

export interface Person extends PersonSummary {
  also_known_as: string[];
  biography: string;
  birthday: string; // Consider using Date if you need date manipulation
  deathday: string | null;
  homepage: string | null;
  imdb_id: string;
  place_of_birth: string | null;
  external_ids: ExternalIds;
  images: { profiles: Image[] };
  movie_credits: MovieCredits;
  tv_credits: TvCredits;
}

// genders 0-Not specified, 1 Female, 2 Male, 3 Non-binary

interface KnownForBaseItem {
  backdrop_path: string | null;
  id: number;
  overview: string;
  poster_path: string;
  media_type: 'movie' | 'tv';
  adult: boolean;
  original_language: string;
  genre_ids: number[];
  popularity: number;
  video: boolean;
  vote_average: number;
  vote_count: number;
}

interface KnownForMovie extends KnownForBaseItem {
  media_type: 'movie';
  title: string;
  original_title?: string; // Optional
  release_date: string;
  origin_country: string[];
}

interface KnownForTvSeries extends KnownForBaseItem {
  media_type: 'tv';
  name: string;
  original_name: string;
  first_air_date: string;
  origin_country: string[]; // Assuming this is always present for TV series
}

export const KnownForDepartmentLabelEnum: Record<
  KnownForDepartmentKey,
  string
> = {
  Acting: 'Actor',
  Art: 'Art Department',
  Sound: 'Sound',
  Camera: 'Photography',
  'Costume & Make-Up': 'Costume & Make-Up',
  Directing: 'Director',
  Writing: 'Writer',
  Editing: 'Editor',
  Lighting: 'Lighting',
  'Visual Effects': 'Visual Effects',
  Production: 'Production',
  Crew: 'Crew',
};

export type KnownForDepartmentKey =
  | 'Acting' //
  | 'Art' //
  | 'Sound' //
  | 'Camera' //
  | 'Costume & Make-Up' //
  | 'Directing' //
  | 'Writing' //
  | 'Editing' //
  | 'Lighting' //
  | 'Visual Effects' //
  | 'Production' //
  | 'Crew'; //

interface PersonSummary {
  id: number;
  name: string;
  original_name: string;
  media_type?: 'person';
  adult: boolean;
  popularity: number;
  gender: number;
  known_for_department: KnownForDepartmentKey;
  profile_path: string | null;
  known_for: (KnownForMovie | KnownForTvSeries)[];
}

export interface PersonSummaryResults {
  page: number;
  results: PersonSummary[];
  total_pages: number;
  total_results: number;
}

interface ExternalIds {
  freebase_mid?: string;
  freebase_id?: string;
  imdb_id?: string;
  tvrage_id?: number;
  wikidata_id?: string;
  facebook_id?: string | null;
  instagram_id?: string | null;
  tiktok_id?: string | null;
  twitter_id?: string | null;
  youtube_id?: string | null;
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

interface MovieCredits {
  cast: MovieCredit[];
  crew: CrewCredit[];
}

interface MovieCredit {
  adult: boolean;
  backdrop_path: string | null;
  genre_ids: number[];
  id: number;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string;
  release_date: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
  character: string;
  credit_id: string;
  order: number;
}

interface CrewCredit {
  adult: false;
  backdrop_path: string | null;
  credit_id: string;
  department: string;
  genre_ids: number[];
  id: number;
  job: string;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string | null;
  release_date: string;
  title: string;
  video: false;
  vote_average: number;
  vote_count: number;
}

interface TvCredits {
  cast: TvCredit[];
  crew: TvCrewCredit[];
}

interface TvCredit {
  adult: boolean;
  backdrop_path: string | null;
  genre_ids: number[];
  id: number;
  origin_country: string[];
  original_language: string;
  original_name: string;
  overview: string;
  popularity: number;
  poster_path: string | null;
  first_air_date: string;
  name: string;
  vote_average: number;
  vote_count: number;
  character: string;
  credit_id: string;
  episode_count: number;
}

interface TvCrewCredit {
  adult: false;
  backdrop_path: string | null;
  credit_id: string;
  department: string;
  episode_count: number;
  first_air_date: string;
  genre_ids: number[];
  id: number;
  job: string;
  name: string;
  origin_country: string[];
  original_language: string;
  original_name: string;
  overview: string;
  popularity: number;
  poster_path: string | null;
  vote_average: number;
  vote_count: number;
}
