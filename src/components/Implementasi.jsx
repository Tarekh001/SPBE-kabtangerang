import { useState, useEffect, useMemo } from "react";
import { Calendar, Award, Loader2, AlertCircle, RefreshCw, ImageIcon } from "lucide-react";
import { fetchIndeks, getImageUrl } from "@/utils/helpers";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

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
        <div className="text-center mb-10 motion-safe:animate-fade-in-up">
          <span className="pill bg-secondary text-primary inline-flex items-center gap-2 mb-3">
            <Award className="w-4 h-4" /> Implementasi
          </span>
          <h2 className="text-3xl lg:text-4xl font-extrabold text-gradient tracking-tight">
            Implementasi Pemerintahan Digital
          </h2>
          <p className="text-muted-foreground mt-3 text-sm max-w-2xl mx-auto leading-relaxed">
            Dokumentasi implementasi Pemerintahan Digital Kabupaten Tangerang per tahun
          </p>
        </div>

        {/* Loading */}
        {loading && (
          <div className="w-full max-w-5xl mx-auto motion-safe:animate-fade-in" aria-live="polite" aria-busy="true">
            {/* Skeleton Year Selector */}
            <div className="flex justify-center mb-10">
              <div className="w-48 h-12 bg-secondary/50 rounded-xl motion-safe:animate-pulse" />
            </div>
            {/* Skeleton Card */}
            <Card className="overflow-hidden">
              <CardHeader className="border-b border-border/50 gap-3">
                <div className="w-16 h-5 rounded-full bg-secondary/50 motion-safe:animate-pulse" />
                <div className="w-3/4 sm:w-1/2 h-8 rounded-lg bg-secondary/50 motion-safe:animate-pulse" />
                <div className="w-full h-12 rounded bg-secondary/50 motion-safe:animate-pulse mt-2" />
              </CardHeader>
              <CardContent className="p-0 h-[300px] md:h-[500px] bg-secondary/30 motion-safe:animate-pulse" />
            </Card>
          </div>
        )}

        {/* Error */}
        {error && !loading && (
          <div className="max-w-md mx-auto py-12 motion-safe:animate-fade-in-up" role="alert">
            <div className="flex items-start gap-4 py-6 px-5 bg-destructive/10 border border-destructive/20 rounded-xl">
              <AlertCircle className="w-6 h-6 text-destructive shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-destructive mb-1">Data tidak dapat dimuat</h3>
                <p className="text-sm text-destructive/90 leading-relaxed">{error}</p>
              </div>
            </div>
            <div className="text-center mt-6">
              <Button onClick={loadData} leftIcon={<RefreshCw className="w-4 h-4" />}>
                Coba Lagi
              </Button>
            </div>
          </div>
        )}

        {/* Data Kosong */}
        {!loading && !error && data.length === 0 && (
          <div className="text-center py-16 text-muted-foreground" aria-live="polite">
            <p className="text-base font-medium">Dokumen implementasi belum tersedia.</p>
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
                  aria-label="Pilih tahun implementasi"
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
    <div className="w-full max-w-5xl mx-auto motion-safe:animate-fade-in-up">
      <Card className="overflow-hidden hover:border-primary/40 transition-colors duration-300">
        {/* Header: Badge Tahun + Judul */}
        <CardHeader className="border-b border-border/50 gap-3">
          <div className="flex items-start">
            <span className="inline-flex items-center rounded-full text-[11px] bg-secondary text-primary border border-primary/10 font-bold px-2.5 py-0.5">
              Tahun {year}
            </span>
          </div>
          {card.title && (
            <CardTitle className="text-xl lg:text-2xl tracking-tight leading-snug">
              {card.title}
            </CardTitle>
          )}
          {card.description && (
            <CardDescription className="mt-2 text-sm leading-relaxed">
              {card.description}
            </CardDescription>
          )}
        </CardHeader>

        {/* Area Gambar */}
        <CardContent className="relative bg-secondary/20 p-0 min-h-[300px] md:min-h-[500px] flex flex-col justify-center">
          {imgStatus === 'loading' && imgSrc && (
            <div className="absolute inset-0 flex flex-col items-center justify-center z-10 bg-secondary/50" aria-live="polite">
              <Loader2 className="w-8 h-8 motion-safe:animate-spin text-primary mb-3" />
              <span className="text-sm text-muted-foreground">Memuat gambar preview...</span>
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
        </CardContent>
      </Card>
    </div>
  );
};
