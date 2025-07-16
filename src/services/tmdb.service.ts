import axios, { AxiosResponse } from "axios";

// Helper to extract error message
function extractErrorMessage(error: unknown): string {
	let code = "UNKNOWN";
	let message = "Unknown error";
	if (axios.isAxiosError(error)) {
		code = error.response?.status?.toString() || "UNKNOWN";
		message =
			error.response?.data?.status_message || error.message || "Unknown error";
	} else if (error instanceof Error) {
		message = error.message;
	}
	return `Error ${code}: ${message}`;
}

// Generic GET request
export async function getRequest<T>(
	url: string,
	params?: Record<string, unknown>
): Promise<AxiosResponse<T> | string> {
	try {
		const response = await axios.get<T>(url, { params });
		return response;
	} catch (error) {
		return extractErrorMessage(error);
	}
}

// Discover movies from TMDB
export async function discoverMovies(
	page = 1,
	includeAdult = false,
	includeVideo = false,
	language = "en-US",
	sortBy = "popularity.desc"
): Promise<AxiosResponse | string> {
	const url = "https://api.themoviedb.org/3/discover/movie";
	const params = {
		include_adult: includeAdult,
		include_video: includeVideo,
		language,
		page,
		sort_by: sortBy,
	};
	const headers = {
		accept: "application/json",
		Authorization: `Bearer ${import.meta.env.VITE_TMDB_API_TOKEN}`,
	};

	try {
		const response = await axios.get(url, { params, headers });
		return response;
	} catch (error) {
		return extractErrorMessage(error);
	}
}
