import { useState, useEffect, useContext } from "react";
import { discoverMovies } from "../services/tmdb.service";
import {
	Movie,
	VideoItem,
	BannerPromo,
	ContinueWatchingItem,
	PopularItem,
	DiscoverMoviesResponse,
} from "../types/types";
import { ToastContext } from "./index";

interface MovieData {
	videos: VideoItem[];
	bannerPromo: BannerPromo;
	continueWatching: ContinueWatchingItem[];
	popular: PopularItem[];
	loading: boolean;
	error: Error | null;
}

export const useMovieData = (): MovieData => {
	const { setToastType } = useContext(ToastContext);
	const [videos, setVideos] = useState<VideoItem[]>([]);
	const [bannerPromo, setBannerPromo] = useState<BannerPromo>(
		{} as BannerPromo
	);
	const [continueWatching, setContinueWatching] = useState<
		ContinueWatchingItem[]
	>([]);
	const [popular, setPopular] = useState<PopularItem[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<Error | null>(null);

	useEffect(() => {
		const fetchMovieData = async () => {
			try {
				setLoading(true);
				const response = await discoverMovies();
				const data: DiscoverMoviesResponse =
					typeof response === "string" ? JSON.parse(response) : response.data;
				const fetchedMovies: Movie[] = data.results;

				const transformedVideos: VideoItem[] = fetchedMovies
					.slice(0, 2)
					.map((movie: Movie) => ({
						title: movie.title,
						secondaryTitle: movie.original_language.toUpperCase(),
						link: `/movie/${movie.id}`,
						thirdTitle: movie.release_date
							? new Date(movie.release_date).getFullYear().toString()
							: "",
						duration: "01:29",
						views: `${(movie.popularity / 1000000).toFixed(1)}m`,
						imageSrc: movie.poster_path
							? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
							: "/static/image_placeholder.jpg",
						genre:
							movie.genre_ids.length > 0 ? movie.genre_ids.join(", ") : "N/A",
						description: movie.overview,
					}));
				setVideos(transformedVideos);

				if (fetchedMovies.length > 0) {
					const mainMovie: Movie = fetchedMovies[0];
					setBannerPromo({
						genre:
							mainMovie.genre_ids.length > 0
								? mainMovie.genre_ids.join(", ")
								: "N/A",
						description: mainMovie.overview,
						imageSrc: mainMovie.backdrop_path
							? `https://image.tmdb.org/t/p/original${mainMovie.backdrop_path}`
							: "/static/image_placeholder.jpg",
						currentViewers: [
							{ id: "1", imageSrc: "/static/viewer1.png" },
							{ id: "2", imageSrc: "/static/viewer2.png" },
						],
					});
				}

				const transformedContinueWatching: ContinueWatchingItem[] =
					fetchedMovies.slice(0, 2).map((movie: Movie, index: number) => ({
						title: movie.title,
						secondaryTitle: movie.original_language.toUpperCase(),
						link: `/movie/${movie.id}`,
						thirdTitle: `${Math.floor(Math.random() * 10) + 1}h`,
						duration: "01:45",
						imageSrc: movie.poster_path
							? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
							: "/static/image_placeholder.jpg",
						genre:
							movie.genre_ids.length > 0 ? movie.genre_ids.join(", ") : "N/A",
						description: movie.overview,
						trend: index === 0,
						views:
							index === 1
								? `${(movie.vote_count / 1000).toFixed(0)}K`
								: undefined,
						currentViewers:
							index === 1
								? [
										{ id: "1", imageSrc: "/static/viewer1.png" },
										{ id: "2", imageSrc: "/static/viewer2.png" },
								  ]
								: undefined,
					}));
				setContinueWatching(transformedContinueWatching);

				const transformedPopular: PopularItem[] = fetchedMovies
					.slice(0, 3)
					.map((movie: Movie) => ({
						title: movie.title,
						secondaryTitle:
							movie.genre_ids.length > 0 ? movie.genre_ids.join(" / ") : "N/A",
						link: `/movie/${movie.id}`,
						duration: "02:15",
						imageSrc: movie.poster_path
							? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
							: "/static/image_placeholder.jpg",
						stars: movie.vote_average
							? (movie.vote_average / 2).toFixed(1)
							: "N/A",
						genre:
							movie.genre_ids.length > 0 ? movie.genre_ids.join(", ") : "N/A",
					}));
				setPopular(transformedPopular);
			} catch (err) {
				const errorObj = err as Error;
				setError(errorObj);
				// 🔔 Mostrar el toast de error
				setToastType?.("network_error");
			} finally {
				setLoading(false);
			}
		};

		fetchMovieData();
	}, [setToastType]);

	return { videos, bannerPromo, continueWatching, popular, loading, error };
};
