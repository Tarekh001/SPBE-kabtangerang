import { useState, useEffect, useMemo } from "react";
import { Calendar, Award, Loader2, AlertCircle, RefreshCw, ImageIcon } from "lucide-react";
import { fetchIndeks, getImageUrl } from "@/utils/helpers";

export const Implementasi = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [year, setYear] = useState("");
  const [imgError, setImgError] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      setImgError(false);
      const result = await fetchIndeks();
      setData(result);
    } catch (err) {
      setError("Gagal memuat data implementasi. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Ekstrak daftar tahun unik dari data API, urutkan descending
  const years = useMemo(() => {
    const uniqueYears = [...new Set(data.map((d) => d.year).filter(Boolean))];
    return uniqueYears.sort((a, b) => b.localeCompare(a));
  }, [data]);

  // Set tahun default ke tahun pertama saat data siap
  useEffect(() => {
    if (years.length > 0 && !year) {
      setYear(years[0]);
    }
  }, [years, year]);

  // Cari card yang sesuai dengan tahun terpilih
  const card = useMemo(() => data.find((d) => d.year === year), [data, year]);

  // Reset imgError saat card berubah (gambar baru mungkin tersedia)
  useEffect(() => { setImgError(false); }, [card]);

  return (
    <section id="implementasi" className="py-[60px] px-[20px] scroll-mt-20">
      <div className="container">
        <div className="text-center mb-8 animate-fade-in-up">
          <span className="pill bg-secondary text-primary inline-flex items-center gap-2 mb-2">
            <Award className="w-4 h-4" /> Implementasi
          </span>
          <h2 className="text-3xl lg:text-4xl font-extrabold text-gradient">Implementasi Pemerintahan Digital</h2>
          <p className="text-muted-foreground mt-2 text-sm">Dokumentasi implementasi Pemerintahan Digital Kabupaten Tangerang per tahun</p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center gap-3 py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <span className="text-sm text-muted-foreground">Memuat data implementasi...</span>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="max-w-md mx-auto">
            <div className="flex items-center gap-3 py-6 px-5 bg-destructive/10 border border-destructive/20 rounded-xl">
              <AlertCircle className="w-5 h-5 text-destructive shrink-0" />
              <span className="text-sm text-destructive">{error}</span>
            </div>
            <div className="text-center mt-4">
              <button onClick={loadData} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity">
                <RefreshCw className="w-4 h-4" /> Coba Lagi
              </button>
            </div>
          </div>
        )}

        {/* Data Kosong */}
        {!loading && !error && data.length === 0 && (
          <div className="text-center py-12 text-muted-foreground text-sm">Belum ada data implementasi tersedia.</div>
        )}

        {/* Konten */}
        {!loading && !error && data.length > 0 && (
          <>
            <div className="flex justify-center mb-6">
              <div className="inline-flex items-center gap-3 bg-card rounded-xl px-5 py-2.5 shadow-soft border border-border">
                <Calendar className="w-4 h-4 text-primary" />
                <label htmlFor="year-select" className="text-sm font-semibold text-foreground">Tahun:</label>
                <select id="year-select" value={year} onChange={(e) => setYear(e.target.value)} className="appearance-none bg-secondary text-foreground font-bold text-sm rounded-lg px-3 py-1.5 border border-border focus:outline-none focus:ring-2 focus:ring-ring cursor-pointer transition-all hover:border-primary spbe-select">
                  {years.map((y) => (<option key={y} value={y}>{y}</option>))}
                </select>
              </div>
            </div>

            {card && (
              <div className="max-w-[1000px] mx-auto relative animate-fade-in-up" key={year}>
                <div className="group bg-card rounded-2xl shadow-soft border border-border overflow-hidden hover:shadow-elegant hover:border-primary/40 transition-all duration-300">
                  <div className="relative bg-secondary/50 overflow-hidden">
                    {!imgError ? (
                      <img
                        src={getImageUrl(card.imageUrl)}
                        alt={card.title}
                        className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={() => setImgError(true)}
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center py-16 bg-secondary/80">
                        <ImageIcon className="w-12 h-12 text-muted-foreground/40 mb-3" />
                        <span className="text-sm text-muted-foreground">Gambar tidak tersedia</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <span className="absolute top-3 left-3 pill text-xs gradient-primary text-primary-foreground shadow-lg">{year}</span>
                  </div>
                  {card.title && (
                    <div className="px-6 py-4">
                      <h3 className="font-bold text-foreground text-lg">{card.title}</h3>
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};
