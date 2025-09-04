const TMDB_API_KEY = process.env.TMDB_API_KEY || "";
const TMDB_BASE_URL = "https://api.themoviedb.org/3";


export interface TMDBMovie {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  release_date: string;
  vote_average: number;
  genre_ids: number[];
}

export interface TMDBGenre {
  id: number;
  name: string;
}

export interface TMDBResponse<T> {
  results: T[];
  page: number;
  total_pages: number;
  total_results: number;
}

export interface TMDBMovieDetail extends TMDBMovie {
  genres: TMDBGenre[];
  runtime: number;
  status: string;
  videos: {
    results: Array<{
      key: string;
      name: string;
      site: string;
      type: string;
    }>;
  };
}

async function tmdbRequest<T>(endpoint: string, params: Record<string, string> = {}): Promise<T> {
  const url = new URL(`${TMDB_BASE_URL}${endpoint}`);
  url.searchParams.set("api_key", TMDB_API_KEY);
  url.searchParams.set("language", "en-US");

  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.set(key, value);
  });

  const response = await fetch(url.toString());

  if (!response.ok) {
    console.log(process.env.TMDB_API_KEY)

    console.error(response)

    throw new Error(`TMDB API error: ${response.status}`);
  }
  console.error(response)
  return response.json();
}

export async function getPopularMovies(page: number = 1): Promise<TMDBResponse<TMDBMovie>> {
  return tmdbRequest<TMDBResponse<TMDBMovie>>("/movie/popular", { page: page.toString() });
}

export async function searchMovies(query: string, page: number = 1): Promise<TMDBResponse<TMDBMovie>> {
  return tmdbRequest<TMDBResponse<TMDBMovie>>("/search/movie", {
    query,
    page: page.toString(),
  });
}

export async function getMoviesByGenre(genreId: number, page: number = 1): Promise<TMDBResponse<TMDBMovie>> {
  return tmdbRequest<TMDBResponse<TMDBMovie>>("/discover/movie", {
    with_genres: genreId.toString(),
    page: page.toString(),
  });
}

export async function getGenres(): Promise<{ genres: TMDBGenre[] }> {
  return tmdbRequest<{ genres: TMDBGenre[] }>("/genre/movie/list");
}

export async function getMovieDetail(movieId: number): Promise<TMDBMovieDetail> {
  return tmdbRequest<TMDBMovieDetail>(`/movie/${movieId}`, {
    append_to_response: "videos",
  });
}

export function getPosterUrl(path: string, size: string = "w500"): string {
  return `https://image.tmdb.org/t/p/${size}${path}`;
}

export function getBackdropUrl(path: string, size: string = "w1280"): string {
  return `https://image.tmdb.org/t/p/${size}${path}`;
}

