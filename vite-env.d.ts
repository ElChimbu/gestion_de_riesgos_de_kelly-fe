// src/vite-env.d.ts
/// <reference types="vite/client" />

interface ImportMetaEnv {
	readonly VITE_TMDB_API_TOKEN: string;
	// Add other environment variables here if you use them
	// readonly VITE_ANOTHER_VAR: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
