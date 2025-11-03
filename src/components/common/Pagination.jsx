// src/components/common/Pagination.jsx
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Pagination({ pagination, onPageChange, variant = 'makanan' }) {
  if (!pagination || pagination.total_pages <= 1) {
    return null;
  }

  const { page, total_pages, total } = pagination;

  // Tentukan style hover berdasarkan variant (makanan/minuman)
  const colorStyles = {
    makanan: {
      hover: 'hover:bg-blue-50 hover:border-blue-400',
    },
    minuman: {
      hover: 'hover:bg-green-50 hover:border-green-400',
    }
  };
  
  const style = colorStyles[variant] || colorStyles.makanan;

  return (
    <div className="mt-12 flex flex-col md:flex-row items-center justify-center gap-4">
      {/* Tombol Sebelumnya */}
      <button
        onClick={() => onPageChange(p => Math.max(1, p - 1))}
        disabled={page === 1}
        className={`px-6 py-3 bg-white/80 backdrop-blur border border-slate-300 rounded-xl ${style.hover} disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium text-slate-700`}
      >
        <ChevronLeft size={18} className="inline mr-1" />
        Sebelumnya
      </button>
      
      {/* Info Halaman */}
      <div className="flex flex-col md:flex-row items-center gap-2 bg-white/60 backdrop-blur px-4 py-2 rounded-xl border border-white/40">
        <span className="text-slate-700 font-semibold">
          Halaman {page} dari {total_pages}
        </span>
        <span className="text-slate-500 text-sm">
          ({total} resep)
        </span>
      </div>
      
      {/* Tombol Selanjutnya */}
      <button
        onClick={() => onPageChange(p => p + 1)}
        disabled={page === total_pages}
        className={`px-6 py-3 bg-white/80 backdrop-blur border border-slate-300 rounded-xl ${style.hover} disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium text-slate-700`}
      >
        Selanjutnya
        <ChevronRight size={18} className="inline ml-1" />
      </button>
    </div>
  );
}