import {
	NavItem,
	UserData,
	Category, // Keep this import for now, if it's used elsewhere in the app. Otherwise, can be removed.
} from "../../types/types"; // Adjust path if your types.ts is elsewhere

export const navItems: NavItem[] = [
	{ title: "Movies", link: "" },
	{ title: "TV shows", link: "" },
	{ title: "Animations", link: "" },
	{ title: "Plans", link: "" },
];

export const userData: UserData[] = [
	{
		name: "Joe",
		imageSrc: "/static/Profile.png",
	},
];

export const category: Category = {
	allCategories: ["Action", "Western", "Adventures", "Drama", "Sci-Fi"],
	favouriteCategorie: ["Crime", "Comedy", "Thriller"],
};
