export interface MovieDetail {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  vote_average: number;
  release_date: string;
  runtime: number;
  genres: Array<{ id: number; name: string }>;
  videos: {
    results: Array<{
      key: string;
      name: string;
      site: string;
      type: string;
    }>;
  };
}
