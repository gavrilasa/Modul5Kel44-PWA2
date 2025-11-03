// src/components/common/RecipeCard.jsx
import { Clock, Star, ChefHat, Coffee, Heart } from "lucide-react";

export default function RecipeCard({
	recipe,
	onSelectRecipe,
	isFavorite,
	onToggleFavorite,
	type,
}) {
	// Fallback jika recipe tidak valid
	if (!recipe || !recipe.id) return null;

	const IconComponent = type === "makanan" ? ChefHat : Coffee;
	const tagColor =
		type === "makanan" ? "blue" : type === "minuman" ? "green" : "gray";

	const handleFavoriteClick = (e) => {
		e.stopPropagation(); // Mencegah trigger onSelectRecipe saat klik ikon hati
		onToggleFavorite(recipe.id);
	};

	return (
		// Wrapper div untuk animasi (jika diperlukan nanti)
		<div>
			<div
				className="group transform transition-all duration-300 cursor-pointer hover:scale-[1.03]"
				onClick={() => onSelectRecipe(recipe.id, type)} // Kirim type juga
			>
				<div
					className={`relative bg-white/40 backdrop-blur-lg border border-white/30 rounded-2xl md:rounded-3xl overflow-hidden shadow-lg md:shadow-xl shadow-${tagColor}-500/10 hover:shadow-${tagColor}-500/20 group-hover:bg-white/50 transition-all duration-300 h-full flex flex-col`}
				>
					{" "}
					{/* Ensure consistent height */}
					<div
						className={`absolute inset-0 bg-linear-to-br from-white/10 via-transparent to-${tagColor}-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
					/>
					{/* Tombol Favorit */}
					<button
						onClick={handleFavoriteClick}
						className={`absolute top-3 right-3 z-20 p-1.5 rounded-full transition-all duration-200 hover:scale-110 ${
							isFavorite
								? "bg-red-100 text-red-500"
								: "bg-white/70 text-slate-400 hover:text-red-500 hover:bg-white/90"
						} backdrop-blur-sm shadow-sm`}
						aria-label={isFavorite ? "Hapus dari favorit" : "Tambah ke favorit"}
					>
						<Heart size={16} fill={isFavorite ? "currentColor" : "none"} />
					</button>
					{/* Gambar */}
					<div className="relative h-40 md:h-56 overflow-hidden shrink-0">
						<img
							src={recipe.image_url}
							alt={recipe.name}
							className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
						/>
						<div className="absolute inset-0 bg-linear-to-t from-black/20 via-transparent to-transparent" />
					</div>
					{/* Konten */}
					<div className="relative z-10 p-4 md:p-6 flex flex-col grow">
						{" "}
						{/* flex-grow */}
						<div className="flex items-center justify-between mb-3 md:mb-4">
							<span
								className={`text-xs font-semibold text-${tagColor}-700 bg-${tagColor}-100/90 px-2 md:px-3 py-1 md:py-1.5 rounded-full capitalize`}
							>
								{type || "Resep"}
							</span>
							<div className="flex items-center space-x-1 bg-white/90 px-2 py-1 rounded-full shadow-sm">
								<Star className="w-3 h-3 md:w-4 md:h-4 text-yellow-500 fill-current" />
								<span className="text-xs md:text-sm font-semibold text-slate-700">
									{/* Rating bisa dinamis, contoh: */}
									{type === "makanan" ? "4.8" : "4.7"}
								</span>
							</div>
						</div>
						<h3
							className={`font-bold text-slate-800 mb-3 md:mb-4 text-base md:text-lg group-hover:text-${tagColor}-600 transition-colors duration-200 line-clamp-2 grow`}
						>
							{" "}
							{/* flex-grow */}
							{recipe.name}
						</h3>
						{/* Bagian bawah kartu (info bahan & langkah) */}
						<div className="flex items-center justify-between text-xs md:text-sm text-slate-600 mt-auto">
							{" "}
							{/* mt-auto */}
							<div className="flex items-center space-x-1 md:space-x-2 bg-white/70 px-2 md:px-3 py-1 md:py-2 rounded-full shadow-sm">
								<Clock className="w-3 h-3 md:w-4 md:h-4" />
								<span className="font-medium">
									{recipe.ingredients?.length || "?"} bahan
								</span>
							</div>
							<div className="flex items-center space-x-1 md:space-x-2 bg-white/70 px-2 md:px-3 py-1 md:py-2 rounded-full shadow-sm">
								<IconComponent className="w-3 h-3 md:w-4 md:h-4" />
								<span className="font-medium">
									{recipe.steps?.length || "?"} langkah
								</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
