// src/pages/MakananPage.jsx
import { useState } from "react";
import { useRecipes } from "../hooks/useRecipes";
import RecipeGrid from "../components/makanan/RecipeGrid";
import AdvancedFilter from "../components/common/AdvancedFilter";
import Pagination from "../components/common/Pagination"; // <- GANTI KE KOMPONEN REUSABLE

export default function MakananPage({ onRecipeClick }) {
	const [searchQuery, setSearchQuery] = useState("");
	const [filters, setFilters] = useState({
		difficulty: "",
		sortBy: "created_at",
		order: "desc",
		prepTimeMax: "",
	});
	const [page, setPage] = useState(1);

	// Fetch recipes from API with all filters
	const { recipes, loading, error, pagination, refetch } = useRecipes({
		category: "makanan",
		search: searchQuery || undefined,
		difficulty: filters.difficulty || undefined,
		page,
		limit: 12,
		sort_by: filters.sortBy,
		order: filters.order,
	});

	const handleSearchChange = (query) => {
		setSearchQuery(query);
		setPage(1); // Reset to first page on search
	};

	const handleFilterChange = (newFilters) => {
		setFilters(newFilters);
		setPage(1); // Reset to first page on filter change
	};

	// Client-side filter for prep time (since API might
	// not support it)
	const filteredRecipes = filters.prepTimeMax
		? recipes.filter(
				(recipe) => recipe.prep_time <= parseInt(filters.prepTimeMax)
		  )
		: recipes;

	return (
		<div
			className="min-h-screen bg-linear-to-br from-
 blue-50 via-white to-indigo-50 pb-20 md:pb-8"
		>
			<main
				className="max-w-7xl mx-auto px-4 md:px-8 py-
 8 md:py-12"
			>
				{/* Header */}
				<div className="mb-8 text-center">
					<h1
						className="text-3xl md:text-5xl font-bold
 text-slate-800 mb-4"
					>
						Resep Makanan
					</h1>
					<p
						className="text-slate-600 max-w-2xl mx-
 auto"
					>
						Temukan berbagai resep makanan nusantara yang lezat
					</p>
				</div>
				{/* Advanced Filter (Reusable Search Bar) */}
				<AdvancedFilter
					onSearchChange={handleSearchChange}
					onFilterChange={handleFilterChange}
					initialFilters={{ ...filters, search: searchQuery }}
				/>
				{/* Loading State */}
				{loading && (
					<div className="text-center py-12">
						<div
							className="animate-spin rounded-full h-
 12 w-12 border-b-2 border-indigo-600 mx-auto"
						></div>
						<p className="mt-4 text-gray-600">Memuat resep...</p>
					</div>
				)}
				{/* Error State */}
				{error && (
					<div className="text-center py-12">
						<div
							className="bg-red-50 border border-red-
 200 rounded-lg p-6"
						>
							<p
								className="text-red-600 font-semibold
 mb-2"
							>
								Terjadi Kesalahan
							</p>
							<p className="text-red-500">{error}</p>
							<button
								onClick={refetch}
								className="mt-4 px-4 py-2 bg-red-600
 text-white rounded-lg hover:bg-red-700"
							>
								Coba Lagi
							</button>
						</div>
					</div>
				)}
				{/* Recipes Grid */}
				{!loading && !error && (
					<>
						{filteredRecipes.length === 0 ? (
							<div className="text-center py-12">
								<p className="text-gray-600 text-lg">
									Tidak ada resep ditemukan
								</p>
								<p className="text-gray-500 mt-2">
									Coba ubah filter atau kata kunci pencarian
								</p>
							</div>
						) : (
							<RecipeGrid
								recipes={filteredRecipes}
								onRecipeClick={onRecipeClick}
							/>
						)}

						{/* Panggil Komponen Pagination Reusable */}
						{pagination && (
							<Pagination
								pagination={pagination}
								onPageChange={setPage}
								variant="makanan"
							/>
						)}
					</>
				)}
			</main>
		</div>
	);
}
