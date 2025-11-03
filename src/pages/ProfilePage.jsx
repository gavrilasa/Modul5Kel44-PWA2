// src/pages/ProfilePage.jsx
import { useState, useEffect, useRef } from "react";
import {
	Users,
	User,
	Hash,
	Edit,
	Save,
	X,
	Camera,
	RefreshCw,
	Trash2,
} from "lucide-react";

// Kunci untuk localStorage (tidak berubah)
const STORAGE_KEY = "groupProfileInfo";

// Data awal sebagai fallback (tidak berubah)
const initialMembers = [
	{ name: "Gavrila Samana Ahmad", nim: "21120123130075", avatar: null },
];

export default function ProfilePage() {
	const [members, setMembers] = useState(initialMembers);
	const [isEditing, setIsEditing] = useState(false);
	const fileInputRefs = useRef([]);

	// --- Semua fungsi logic (useEffect, handleInputChange, dll) tetap sama ---
	// Load data dari localStorage
	useEffect(() => {
		const storedMembers = localStorage.getItem(STORAGE_KEY);
		if (storedMembers) {
			setMembers(JSON.parse(storedMembers));
		}
	}, []);

	// Handle perubahan input
	const handleInputChange = (index, field, value) => {
		const updatedMembers = members.map((member, i) => {
			if (i === index) {
				return { ...member, [field]: value };
			}
			return member;
		});
		setMembers(updatedMembers);
	};

	// Handle upload foto
	const handlePhotoChange = (index, event) => {
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
			handleInputChange(index, "avatar", reader.result);
		};
	};

	// Trigger input file
	const triggerFileInput = (index) => {
		if (fileInputRefs.current[index]) {
			fileInputRefs.current[index].click();
		}
	};

	// Hapus Foto
	const handleRemovePhoto = (index) => {
		if (window.confirm("Apakah Anda yakin ingin menghapus foto profil ini?")) {
			handleInputChange(index, "avatar", null);
		}
	};

	// Reset Semua Profil
	const handleResetProfiles = () => {
		if (
			window.confirm(
				"PERINGATAN: Ini akan mereset SEMUA data kelompok ke default. Yakin?"
			)
		) {
			setMembers(initialMembers);
			localStorage.removeItem(STORAGE_KEY);
			setIsEditing(false);
			alert("Semua profil telah di-reset ke data awal.");
		}
	};

	// Simpan perubahan
	const handleSaveChanges = () => {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(members));
		setIsEditing(false);
		alert("Profil berhasil disimpan!");
	};

	// Batal edit
	const handleCancelEdit = () => {
		const storedMembers = localStorage.getItem(STORAGE_KEY);
		setMembers(storedMembers ? JSON.parse(storedMembers) : initialMembers);
		setIsEditing(false);
	};

	const groupInfo = {
		groupName: "Kelompok Praktikum 4 PBB",
	};

	return (
		// --- PERUBAHAN TAMPILAN DIMULAI DARI SINI ---

		// 1. Wrapper Utama: Gunakan gradien tema dan padding atas (pt-16/pt-24) untuk navbar
		<div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-4 md:p-8 pt-16 md:pt-24 pb-20 md:pb-8">
			{/* 2. Kontainer Pembatas Lebar */}
			<div className="max-w-3xl mx-auto">
				{/* 3. Judul Halaman (di luar card) - Konsisten dengan Halaman Lain */}
				<h1 className="text-3xl md:text-5xl font-bold text-slate-800 text-center mb-4">
					Profil Kelompok
				</h1>
				<p className="text-slate-600 text-center mb-8 md:mb-12">
					Informasi anggota kelompok praktikum.
				</p>

				{/* 4. Card Utama (Glassmorphism) - Konsisten dengan Detail Page */}
				<div className="bg-white/60 backdrop-blur-lg border border-white/40 rounded-2xl shadow-xl overflow-hidden">
					{/* 5. Header Card: Nama Kelompok & Tombol Aksi */}
					<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 border-b border-indigo-100">
						<div className="flex items-center gap-4">
							<div className="flex-shrink-0 w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
								<Users className="w-6 h-6" />
							</div>
							<h2 className="text-xl md:text-2xl font-semibold text-blue-900">
								{groupInfo.groupName}
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
									<button
										onClick={handleResetProfiles}
										className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700 shadow-lg transition-all"
										title="Reset Semua Profil"
									>
										<RefreshCw className="w-5 h-5" />
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

					{/* 6. Body Card: Daftar Anggota */}
					<div className="p-6 md:p-8 space-y-6">
						{members.map((member, index) => (
							// 7. Card Anggota (Lebih Minimalis)
							<div
								key={index}
								className="flex items-center gap-4 bg-white/70 border border-white/60 rounded-xl p-12 transition-all duration-300 hover:shadow-lg hover:border-white/60 hover:bg-white/90"
							>
								{/* Avatar/Foto */}
								<div className="relative flex-shrink-0">
									<img
										src={
											member.avatar ||
											`https://ui-avatars.com/api/?name=${encodeURIComponent(
												member.name
											)}&background=e0e7ff&color=4338ca`
										}
										alt={member.name}
										className="w-16 h-16 rounded-full object-cover border-4 border-white shadow-md"
									/>
									{isEditing && (
										<>
											<div className="absolute -bottom-10 flex gap-2">
												<button
													onClick={() => triggerFileInput(index)}
													className="w-7 h-7 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-md hover:bg-blue-700 transition-all"
													title="Ganti Foto"
												>
													<Camera size={14} />
												</button>

												{member.avatar && (
													<button
														onClick={() => handleRemovePhoto(index)}
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
												ref={(el) => (fileInputRefs.current[index] = el)}
												className="hidden"
												onChange={(e) => handlePhotoChange(index, e)}
											/>
										</>
									)}
								</div>

								{/* Informasi Nama dan NIM */}
								<div className="flex-grow">
									{isEditing ? (
										// 8. Input Mode Edit (Minimalis)
										<div className="space-y-1">
											<input
												type="text"
												value={member.name}
												onChange={(e) =>
													handleInputChange(index, "name", e.target.value)
												}
												className="w-full font-medium text-slate-800 text-base md:text-lg border-b border-slate-300 focus:border-blue-500 focus:ring-0 outline-none bg-transparent py-1"
												placeholder="Nama Anggota"
											/>
											<input
												type="text"
												value={member.nim}
												onChange={(e) =>
													handleInputChange(index, "nim", e.target.value)
												}
												className="w-full text-slate-500 text-sm border-b border-slate-300 focus:border-blue-500 focus:ring-0 outline-none bg-transparent py-1"
												placeholder="NIM"
											/>
										</div>
									) : (
										// Tampilan Mode Baca
										<>
											<p className="font-medium text-slate-800 text-base md:text-lg">
												{member.name}
											</p>
											<div className="flex items-center text-slate-500 text-sm mt-1">
												<Hash size={14} className="mr-1.5 text-slate-400" />
												<span>{member.nim}</span>
											</div>
										</>
									)}
								</div>
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	);
}
