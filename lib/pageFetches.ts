import { FavoriteMovie } from "@/app/favorites/types";
import { MovieDetail } from "@/app/movie/[id]/types";
import { WatchLaterMovie } from "@/app/watch-later/types";
import axios, { AxiosResponse } from "axios";

export const fetchWatchLater = async (
  stateSetter: Function,
  loadingSetter: Function,
  errorSetter: Function,
  toastShow: Function
) => {
  try {
    const response = await axios.get("/api/user/watch-later");
    const watchLaterPromises: Promise<AxiosResponse<MovieDetail>>[] = [] as Promise<AxiosResponse<MovieDetail>>[];

    response.data.forEach((movie: WatchLaterMovie) => {
      watchLaterPromises.push(axios.get(`/api/movies/${movie.movieId}`));
    });

    const responses = await Promise.all(watchLaterPromises);

    stateSetter(responses.map((res) => res.data));
  } catch (error: any) {
    if (error.response?.status === 401) {
      errorSetter("Please sign in to view your watch later list");
      toastShow("Please sign in to view your watch later list", { variant: "error" });
    } else {
      const msg = error?.response?.data?.error || "Failed to load watch later list";
      errorSetter(msg);
      toastShow(msg, { variant: "error" });
    }
  } finally {
    loadingSetter(false);
  }
};

export const fetchFavorites = async (
  stateSetter: Function,
  loadingSetter: Function,
  errorSetter: Function,
  toastShow: Function
) => {
  try {
    const response = await axios.get("/api/user/favorites");
    const favoritesPromises: Promise<AxiosResponse<MovieDetail>>[] = [] as Promise<AxiosResponse<MovieDetail>>[];

    response.data.forEach((favorite: FavoriteMovie) => {
      favoritesPromises.push(axios.get(`/api/movies/${favorite.movieId}`));
    });

    const responses = await Promise.all(favoritesPromises);

    stateSetter(responses.map((res) => res.data));
  } catch (error: any) {
    if (error.response?.status === 401) {
      errorSetter("Please sign in to view your favorites");
      toastShow("Please sign in to view your favorites", { variant: "error" });
    } else {
      const msg = error?.response?.data?.error || "Failed to load favorites";
      errorSetter(msg);
      toastShow(msg, { variant: "error" });
    }
  } finally {
    loadingSetter(false);
  }
};
