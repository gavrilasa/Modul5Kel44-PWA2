// src/pages/FavoritePage.jsx
import RecipeCard from "../components/common/RecipeCard";
import { Heart } from "lucide-react";

// Props tetap sama
export default function FavoritePage({
	recipes,
	onSelectRecipe,
	favorites,
	onToggleFavorite,
}) {
	return (
		// Ganti <main> menjadi <div>, tambahkan padding bottom di sini
		<div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-red-50 pb-20 md:pb-8">
			{/* Konten utama ditaruh di div terpisah untuk padding horizontal */}
			<div className="max-w-7xl mx-auto px-4 mt-16 md:px-8 py-8 md:py-12">
				<h1 className="text-3xl md:text-5xl font-bold text-slate-800 text-center mb-4">
					Resep Favorit Saya
				</h1>
				<p className="text-center text-slate-500 max-w-2xl mx-auto mb-8 md:mb-12">
					Kumpulan resep makanan dan minuman yang telah Anda tandai sebagai
					favorit.
				</p>

				{recipes.length > 0 ? (
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
						{recipes.map(
							(recipe) =>
								recipe && (
									// Tidak perlu animasi fade-in di sini, tampilkan langsung
									<RecipeCard
										key={recipe.id}
										recipe={recipe}
										onSelectRecipe={onSelectRecipe}
										isFavorite={favorites.includes(recipe.id)}
										onToggleFavorite={onToggleFavorite}
										type={recipe.type}
									/>
								)
						)}
					</div>
				) : (
					<div className="text-center py-16 flex flex-col items-center">
						<Heart size={48} className="text-red-300 mb-4" strokeWidth={1.5} />
						<p className="text-slate-500 text-lg">
							Anda belum memiliki resep favorit.
						</p>
						<p className="text-slate-400 mt-2">
							Klik ikon hati pada resep untuk menambahkannya.
						</p>
					</div>
				)}
			</div>
		</div>
	);
}
