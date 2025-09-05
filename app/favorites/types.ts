export interface FavoriteMovie {
  id: string;
  movieId: number;
  createdAt: string;
  movie: {
    id: number;
    title: string;
    overview: string;
    poster_path: string;
    vote_average: number;
    release_date: string;
  };
}
