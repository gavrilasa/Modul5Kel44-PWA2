// src/pages/ProfilePage.jsx
import { useState, useEffect, useRef } from "react";
import {
	User,
	Edit,
	Save,
	X,
	Camera,
	Trash2,
	Heart,
	MessageSquare,
	Star,
	Loader2,
} from "lucide-react";
import userService from "../services/userService";
import { useFavorites } from "../hooks/useFavorites";
import { useReviewsByUser } from "../hooks/useReviews"; // (Hook ini belum ada)
import RecipeCard from "../components/common/RecipeCard"; // Asumsi path ini benar

// Komponen placeholder untuk daftar resep (jika RecipeCard tidak ditemukan)
const SimpleRecipeCard = ({ recipe, onClick }) => (
	<div
		onClick={onClick}
		className="bg-white/70 border border-white/60 rounded-xl p-4 transition-all duration-300 hover:shadow-lg hover:border-white/60 hover:bg-white/90 cursor-pointer"
	>
		<img
			src={
				recipe.image_url ||
				`https://ui-avatars.com/api/?name=${encodeURIComponent(
					recipe.name
				)}&background=e0e7ff&color=4338ca`
			}
			alt={recipe.name}
			className="w-full h-32 object-cover rounded-lg mb-3"
		/>
		<h4 className="font-semibold text-slate-800 line-clamp-2">{recipe.name}</h4>
		<p className="text-sm text-slate-500 capitalize">{recipe.category}</p>
	</div>
);

export default function ProfilePage({ onRecipeClick }) {
	const [userProfile, setUserProfile] = useState(userService.getUserProfile());
	const [isEditing, setIsEditing] = useState(false);
	const fileInputRef = useRef(null);

	// 1. Ambil data Akun (dari userService)
	useEffect(() => {
		setUserProfile(userService.getUserProfile());
	}, []);

	const { favorites, loading: favLoading, error: favError } = useFavorites();

	// 3. Ambil data Ulasan Saya (Gunakan hook baru)
	const {
		myReviews,
		loading: revLoading,
		error: revError,
	} = useReviewsByUser(); // Ganti dengan data dari hook kustom (misal: useReviewsByUser())

	// --- Handler untuk Edit Profil Akun ---

	// Handle perubahan input
	const handleInputChange = (field, value) => {
		setUserProfile((prev) => ({ ...prev, [field]: value }));
	};

	// Handle upload foto
	const handlePhotoChange = (event) => {
		const file = event.target.files[0];
		if (!file) return;
		if (!file.type.startsWith("image/")) {
			alert("Harap pilih file gambar (jpg, png, webp).");
			return;
		}
		if (file.size > 2 * 1024 * 1024) {
			alert("Ukuran file terlalu besar, maksimal 2MB.");
			return;
		}
		const reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onloadend = () => {
			handleInputChange("avatar", reader.result);
		};
	};

	// Trigger input file
	const triggerFileInput = () => {
		if (fileInputRef.current) {
			fileInputRef.current.click();
		}
	};

	// Hapus Foto
	const handleRemovePhoto = () => {
		if (window.confirm("Apakah Anda yakin ingin menghapus foto profil ini?")) {
			handleInputChange("avatar", null);
		}
	};

	// Simpan perubahan
	const handleSaveChanges = () => {
		const result = userService.saveUserProfile(userProfile);
		if (result.success) {
			setIsEditing(false);
			alert("Profil berhasil disimpan!");
		} else {
			alert("Gagal menyimpan profil: " + result.message);
		}
	};

	// Batal edit
	const handleCancelEdit = () => {
		setUserProfile(userService.getUserProfile()); // Reset ke data yang tersimpan
		setIsEditing(false);
	};

	// --- Fungsi Render Helper ---

	// Render Konten Favorit
	const renderFavorites = () => {
		if (favLoading) {
			return (
				<div className="flex justify-center items-center py-10">
					<Loader2 className="w-8 h-8 text-slate-400 animate-spin" />
				</div>
			);
		}
		if (favError) {
			return (
				<p className="text-center text-red-500 py-10">
					Gagal memuat favorit: {favError}
				</p>
			);
		}
		if (!favorites || favorites.length === 0) {
			return (
				<p className="text-center text-slate-500 py-10">
					Anda belum memiliki resep favorit.
				</p>
			);
		}

		// Gunakan RecipeCard jika ada, jika tidak gunakan SimpleRecipeCard
		const CardComponent = RecipeCard || SimpleRecipeCard;

		return (
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
				{favorites.map((recipe) => (
					<CardComponent
						key={recipe.id}
						recipe={recipe}
						onSelectRecipe={onRecipeClick}
						isFavorite={true}
						// onToggleFavorite tidak diperlukan di sini karena ini adalah daftar favorit
						type={recipe.category}
					/>
				))}
			</div>
		);
	};

	// Render Konten Ulasan
	const renderMyReviews = () => {
		if (revLoading) {
			return (
				<div className="flex justify-center items-center py-10">
					<Loader2 className="w-8 h-8 text-slate-400 animate-spin" />
				</div>
			);
		}
		if (revError) {
			return (
				<p className="text-center text-red-500 py-10">
					Gagal memuat ulasan: {revError}
				</p>
			);
		}

		if (!myReviews || myReviews.length === 0) {
			return (
				<p className="text-center text-slate-500 py-10">
					Anda belum menulis ulasan.
				</p>
			);
		}

		return (
			<div className="space-y-4">
				{myReviews.map((review) => (
					<div
						key={review.id}
						className="bg-white/70 border border-white/60 rounded-xl p-4"
					>
						{/* Asumsi backend mengembalikan `recipe_name` atau objek `recipe` */}
						<p className="font-semibold text-slate-700">
							{review.recipe_name || "Nama Resep Tidak Tersedia"}
						</p>
						<div className="flex items-center gap-1 text-yellow-500 my-1">
							{[...Array(5)].map((_, i) => (
								<Star
									key={i}
									size={16}
									className={i < review.rating ? "fill-current" : ""}
								/>
							))}
						</div>
						{review.comment && (
							<p className="text-slate-600 mt-2 italic">"{review.comment}"</p>
						)}
					</div>
				))}
			</div>
		);
	};

	return (
		// 1. Wrapper Utama
		<div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-4 md:p-8 pt-16 md:pt-24 pb-20 md:pb-8">
			{/* 2. Kontainer Pembatas Lebar */}
			<div className="max-w-5xl mx-auto">
				{/* 3. Judul Halaman */}
				<h1 className="text-3xl md:text-5xl font-bold text-slate-800 text-center mb-4">
					Profil Saya
				</h1>
				<p className="text-slate-600 text-center mb-8 md:mb-12">
					Kelola informasi akun, resep favorit, dan ulasan Anda.
				</p>

				{/* 4. Grid untuk Tiga Kartu */}
				<div className="space-y-8">
					{/* === KARTU 1: PROFIL AKUN === */}
					<div className="bg-white/60 backdrop-blur-lg border border-white/40 rounded-2xl shadow-xl overflow-hidden">
						{/* Header Card: Nama Akun & Tombol Aksi */}
						<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 border-b border-indigo-100">
							<div className="flex items-center gap-4">
								<div className="flex-shrink-0 w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
									<User className="w-6 h-6" />
								</div>
								<h2 className="text-xl md:text-2xl font-semibold text-blue-900">
									Profil Akun
								</h2>
							</div>

							{/* Tombol Aksi */}
							<div className="flex gap-2 flex-shrink-0">
								{isEditing ? (
									<>
										<button
											onClick={handleSaveChanges}
											className="p-2 bg-green-600 text-white rounded-full hover:bg-green-700 shadow-lg transition-all"
											title="Simpan Perubahan"
										>
											<Save className="w-5 h-5" />
										</button>
										<button
											onClick={handleCancelEdit}
											className="p-2 bg-yellow-500 text-white rounded-full hover:bg-yellow-600 shadow-lg transition-all"
											title="Batal"
										>
											<X className="w-5 h-5" />
										</button>
									</>
								) : (
									<button
										onClick={() => setIsEditing(true)}
										className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 shadow-lg transition-all"
										title="Edit Profil"
									>
										<Edit className="w-5 h-5" />
									</button>
								)}
							</div>
						</div>

						{/* Body Card: Info Akun */}
						<div className="p-6 md:p-8">
							<div className="flex items-center gap-4 bg-white/70 border border-white/60 rounded-xl p-12 transition-all duration-300">
								{/* Avatar/Foto */}
								<div className="relative flex-shrink-0">
									<img
										src={
											userProfile.avatar ||
											`https://ui-avatars.com/api/?name=${encodeURIComponent(
												userProfile.username
											)}&background=e0e7ff&color=4338ca`
										}
										alt={userProfile.username}
										className="w-16 h-16 rounded-full object-cover border-4 border-white shadow-md"
									/>
									{isEditing && (
										<>
											<div className="absolute -bottom-10 flex gap-2">
												<button
													onClick={triggerFileInput}
													className="w-7 h-7 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-md hover:bg-blue-700 transition-all"
													title="Ganti Foto"
												>
													<Camera size={14} />
												</button>

												{userProfile.avatar && (
													<button
														onClick={handleRemovePhoto}
														className="w-7 h-7 bg-red-600 text-white rounded-full flex items-center justify-center shadow-md hover:bg-red-700 transition-all"
														title="Hapus Foto"
													>
														<Trash2 size={14} />
													</button>
												)}
											</div>
											<input
												type="file"
												accept="image/*"
												ref={fileInputRef}
												className="hidden"
												onChange={handlePhotoChange}
											/>
										</>
									)}
								</div>

								{/* Informasi Nama dan ID */}
								<div className="flex-grow">
									{isEditing ? (
										<div className="space-y-1">
											<input
												type="text"
												value={userProfile.username}
												onChange={(e) =>
													handleInputChange("username", e.target.value)
												}
												className="w-full font-medium text-slate-800 text-base md:text-lg border-b border-slate-300 focus:border-blue-500 focus:ring-0 outline-none bg-transparent py-1"
												placeholder="Nama Pengguna"
											/>
											<p className="text-slate-500 text-sm py-1">
												ID: {userProfile.userId}
											</p>
										</div>
									) : (
										<>
											<p className="font-medium text-slate-800 text-base md:text-lg">
												{userProfile.username}
											</p>
											<p className="text-slate-500 text-sm mt-1">
												ID: {userProfile.userId}
											</p>
										</>
									)}
								</div>
							</div>
						</div>
					</div>

					{/* === KARTU 2: RESEP FAVORIT === */}
					<div className="bg-white/60 backdrop-blur-lg border border-white/40 rounded-2xl shadow-xl overflow-hidden">
						{/* Header Card */}
						<div className="flex items-center gap-4 p-6 border-b border-indigo-100">
							<div className="flex-shrink-0 w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center">
								<Heart className="w-6 h-6" />
							</div>
							<h2 className="text-xl md:text-2xl font-semibold text-red-900">
								Resep Favorit Saya
							</h2>
						</div>
						{/* Body Card */}
						<div className="p-6 md:p-8">{renderFavorites()}</div>
					</div>

					{/* === KARTU 3: ULASAN SAYA === */}
					<div className="bg-white/60 backdrop-blur-lg border border-white/40 rounded-2xl shadow-xl overflow-hidden">
						{/* Header Card */}
						<div className="flex items-center gap-4 p-6 border-b border-indigo-100">
							<div className="flex-shrink-0 w-12 h-12 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center">
								<MessageSquare className="w-6 h-6" />
							</div>
							<h2 className="text-xl md:text-2xl font-semibold text-yellow-900">
								Ulasan Saya
							</h2>
						</div>
						{/* Body Card */}
						<div className="p-6 md:p-8">{renderMyReviews()}</div>
					</div>
				</div>
			</div>
		</div>
	);
}
