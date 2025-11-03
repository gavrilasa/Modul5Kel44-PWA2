// vite.config.js
import { VitePWA } from "vite-plugin-pwa";
import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
	plugins: [
		react(),
		VitePWA(),
		tailwindcss(),
		{
			registerType: "autoUpdate",
			includeAssets: [
				"favicon.ico",
				"robots.txt",
				"apple-touch-icon.png",
				"LOGORN.png",
			],
			injectRegister: false,
			pwaAssets: {
				disabled: false,
				config: true,
			},
			manifest: {
				// ... (isi manifest Anda tidak berubah)
				name: "Resep Nusantara",
				short_name: "Resep Nusantara",
				description: "Aplikasi Resep Makanan dan Minuman Khas Indonesia",
				theme_color: "#2563eb",
				background_color: "#ffffff",
				display: "standalone",
				scope: "/",
				start_url: "/",
				orientation: "portrait",
				icons: [
					// ... (icons tidak berubah)
				],
			},
			workbox: {
				globPatterns: ["**/*.{js,css,html,svg,png,ico}"],
				cleanupOutdatedCaches: true,
				clientsClaim: true,

				// --- TAMBAHKAN BLOK INI UNTUK QUERY CACHING ---
				runtimeCaching: [
					{
						// Strategi untuk semua request API resep
						// URL Pattern ini akan cocok dengan:
						// /api/v1/recipes
						// /api/v1/recipes/12345
						// /api/v1/recipes/12345/reviews
						urlPattern: ({ url }) => {
							return url.pathname.startsWith("/api/v1/recipes");
						},
						// Gunakan StaleWhileRevalidate
						handler: "StaleWhileRevalidate",
						options: {
							// Nama cache di Cache Storage
							cacheName: "api-resep-cache",
							// Pengaturan kadaluwarsa
							expiration: {
								maxEntries: 100, // Simpan maks 100 request
								maxAgeSeconds: 60 * 60 * 24, // Kadaluwarsa dalam 1 hari
							},
							// Hanya cache response yang sukses (status 0 untuk opaque, 200 untuk OK)
							cacheableResponse: {
								statuses: [0, 200],
							},
						},
					},
					{
						// Strategi untuk API lain (jika ada, misal favorites atau upload)
						// Gunakan NetworkFirst: Coba jaringan dulu, jika gagal, ambil dari cache.
						urlPattern: ({ url }) => {
							return url.pathname.startsWith("/api/v1/");
						},
						handler: "NetworkFirst",
						options: {
							cacheName: "api-lain-cache",
							networkTimeoutSeconds: 10, // Timeout 10 detik
							expiration: {
								maxEntries: 50,
							},
							cacheableResponse: {
								statuses: [0, 200],
							},
						},
					},
				],
				// --- AKHIR BLOK TAMBAHAN ---
			},
			devOptions: {
				enabled: false,
				navigateFallback: "index.html",
				suppressWarnings: true,
				type: "module",
			},
		},
	],
});
