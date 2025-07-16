// src/types.ts

// Type for a single movie object from TMDB API
export interface Movie {
	adult: boolean;
	backdrop_path: string | null;
	genre_ids: number[];
	id: number;
	original_language: string;
	original_title: string;
	overview: string;
	popularity: number;
	poster_path: string | null;
	release_date: string;
	title: string;
	video: boolean;
	vote_average: number;
	vote_count: number;
}

// Type for the response structure from TMDB discoverMovies
export interface DiscoverMoviesResponse {
	page: number;
	results: Movie[];
	total_pages: number;
	total_results: number;
}

// Types for your UI components' props
export interface NavItem {
	title: string;
	link: string;
}

export interface UserData {
	name: string;
	imageSrc: string;
}

export interface VideoItem {
	title: string;
	secondaryTitle: string;
	link: string;
	thirdTitle: string;
	duration: string;
	views?: string; // Optional
	imageSrc: string;
	genre: string;
	description: string;
}

export interface Category {
	allCategories: string[];
	favouriteCategorie: string[];
}

export interface Viewer {
	id: string;
	imageSrc: string;
}

export interface BannerPromo {
	genre: string;
	description: string;
	imageSrc: string;
	currentViewers: Viewer[];
}

export interface ContinueWatchingItem {
	title: string;
	secondaryTitle: string;
	link: string;
	thirdTitle: string;
	duration: string;
	imageSrc: string;
	genre: string;
	description: string;
	trend?: boolean; // Optional
	views?: string; // Optional
	currentViewers?: Viewer[]; // Optional
}

export interface PopularItem {
	title: string;
	secondaryTitle: string;
	link: string;
	duration: string;
	imageSrc: string;
	stars: string;
	genre: string;
}

export interface Operation {
    id: number;
    result: 'Ganada' | 'Perdida';
    initialCapital: number;
    montoRb: number;
    finalCapital: number;
    kellyUsed: number;
}
