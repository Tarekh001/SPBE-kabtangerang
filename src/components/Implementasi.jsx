import { useState, useEffect, useMemo } from "react";
import { Calendar, Award, Loader2, AlertCircle, RefreshCw, ImageIcon } from "lucide-react";
import { fetchIndeks, getImageUrl } from "@/utils/helpers";

// Ambil URL gambar menggunakan getImageUrl dari helpers (sudah handle VITE_MEDIA_ORIGIN)
const getImageSrc = (card) => getImageUrl(card.imageUrl || card.image || '');

export const Implementasi = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [year, setYear] = useState("");

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await fetchIndeks();

      // === DEBUG: Log seluruh respons API ===
      console.log('=== [Implementasi] DATA DARI API ===');
      console.log(JSON.stringify(result, null, 2));
      if (result.length > 0) {
        console.log('=== [Implementasi] FIELDS ITEM PERTAMA ===');
        console.log('Keys:', Object.keys(result[0]));
        console.log('Full item:', result[0]);
      }

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

  const years = useMemo(() => {
    const uniqueYears = [...new Set(data.map((d) => d.year).filter(Boolean))];
    return uniqueYears.sort((a, b) => b.localeCompare(a));
  }, [data]);

  useEffect(() => {
    if (years.length > 0 && !year) setYear(years[0]);
  }, [years, year]);

  const card = useMemo(() => data.find((d) => d.year === year), [data, year]);

  return (
    <section id="implementasi" className="py-[60px] px-[20px] scroll-mt-20">
      <div className="container">
        {/* Header */}
        <div className="text-center mb-10 animate-fade-in-up">
          <span className="pill bg-secondary text-primary inline-flex items-center gap-2 mb-3">
            <Award className="w-4 h-4" /> Implementasi
          </span>
          <h2 className="text-3xl lg:text-4xl font-extrabold text-gradient">
            Implementasi Pemerintahan Digital
          </h2>
          <p className="text-muted-foreground mt-3 text-sm max-w-2xl mx-auto leading-relaxed">
            Dokumentasi implementasi Pemerintahan Digital Kabupaten Tangerang per tahun
          </p>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex flex-col items-center justify-center gap-3 py-16">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <span className="text-sm text-muted-foreground">Memuat data implementasi...</span>
          </div>
        )}

        {/* Error */}
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
          <div className="text-center py-16 text-muted-foreground text-sm">
            Belum ada data implementasi tersedia.
          </div>
        )}

        {/* Konten Utama */}
        {!loading && !error && data.length > 0 && (
          <>
            {/* Tahun Selector */}
            <div className="flex justify-center mb-10">
              <div className="inline-flex items-center gap-3 bg-card rounded-xl px-5 py-3 shadow-soft border border-border">
                <Calendar className="w-4 h-4 text-primary" />
                <label htmlFor="year-select" className="text-sm font-semibold text-foreground">
                  Pilih Tahun:
                </label>
                <select
                  id="year-select"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className="appearance-none bg-secondary text-foreground font-bold text-sm rounded-lg px-4 py-2 border border-border focus:outline-none focus:ring-2 focus:ring-ring cursor-pointer transition-all hover:border-primary spbe-select"
                >
                  {years.map((y) => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Card Implementasi */}
            {card && <ImplementasiCard card={card} year={year} />}
          </>
        )}
      </div>
    </section>
  );
};

/** Komponen Card */
const ImplementasiCard = ({ card, year }) => {
  const imgSrc = getImageSrc(card);
  // Inisialisasi langsung — tidak pakai useEffect agar tidak ada race condition
  const [imgStatus, setImgStatus] = useState(imgSrc ? 'loading' : 'error');

  return (
    <div className="w-full max-w-5xl mx-auto animate-fade-in-up">
      <div className="bg-card rounded-2xl shadow-soft border border-border overflow-hidden hover:shadow-elegant hover:border-primary/40 transition-all duration-300">

        {/* Header: Badge Tahun + Judul */}
        <div className="px-8 pt-7 pb-5 border-b border-border/50">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="pill text-xs gradient-primary text-primary-foreground font-bold px-3 py-1 shadow-sm">
              {year}
            </span>
            {card.title && (
              <h3 className="font-bold text-foreground text-xl lg:text-2xl leading-tight">
                {card.title}
              </h3>
            )}
          </div>
          {card.description && (
            <p className="text-muted-foreground text-sm mt-3 leading-relaxed">
              {card.description}
            </p>
          )}
        </div>

        {/* Area Gambar */}
        <div className="relative bg-secondary/20">
          {imgStatus === 'loading' && imgSrc && (
            <div className="absolute inset-0 flex flex-col items-center justify-center z-10 bg-secondary/50">
              <Loader2 className="w-8 h-8 animate-spin text-primary mb-3" />
              <span className="text-sm text-muted-foreground">Memuat gambar...</span>
            </div>
          )}

          {imgSrc ? (
            <img
              key={imgSrc}
              src={imgSrc}
              alt={card.title || 'Implementasi'}
              className={`w-full h-auto object-contain transition-opacity duration-300 ${imgStatus === 'loaded' ? 'opacity-100' : 'opacity-0'}`}
              onLoad={() => setImgStatus('loaded')}
              onError={() => {
                console.warn('[Implementasi] Gambar gagal dimuat:', imgSrc);
                setImgStatus('error');
              }}
            />
          ) : null}

          {imgStatus === 'error' && (
            <div className="flex flex-col items-center justify-center py-20 bg-secondary/40">
              <ImageIcon className="w-14 h-14 text-muted-foreground/30 mb-3" />
              <span className="text-sm text-muted-foreground mb-1">Gambar tidak tersedia</span>
              <span className="text-xs text-muted-foreground/50">
                Buka Console (F12) untuk debug info
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
