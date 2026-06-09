import { useState, useEffect, useRef } from "react";
import gedung from "@/assets/gedung.jpg";
import { Info, BookOpen, Loader2, AlertCircle, FileText, ExternalLink, ChevronDown, Eye } from "lucide-react";
import { fetchAllRegulasi, KEBIJAKAN_LABELS, KEBIJAKAN_ICONS } from "@/utils/helpers";

export const Tentang = () => {
  const [regulasi, setRegulasi] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState(null);
  const cardGridRef = useRef(null);

  // Toggle kategori aktif — klik lagi untuk menutup
  const handleCategoryClick = (key) => {
    setActiveCategory((prev) => (prev === key ? null : key));
  };

  // Scroll ke card grid saat kategori dipilih
  useEffect(() => {
    if (activeCategory && cardGridRef.current) {
      cardGridRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [activeCategory]);

  useEffect(() => {
    let cancelled = false;

    const loadRegulasi = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchAllRegulasi();
        if (!cancelled) {
          setRegulasi(data);
        }
      } catch (err) {
        if (!cancelled) {
          setError("Gagal memuat data regulasi. Silakan coba lagi nanti.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadRegulasi();
    return () => { cancelled = true; };
  }, []);

  const kategoriOrder = ['presiden', 'mentri', 'pedoman', 'walikota', 'keputusan'];

  return (
    <>
      <section id="tentang" className="py-12 relative scroll-mt-20">
      <div className="container">
        <div className="text-center mb-8 animate-fade-in-up">
          <span className="pill bg-secondary text-primary inline-flex items-center gap-2 mb-2">
            <Info className="w-4 h-4" /> Tentang Kami
          </span>
          <h2 className="text-3xl lg:text-4xl font-extrabold text-gradient">TENTANG SPBE</h2>
        </div>

        <div className="gradient-hero rounded-[2rem] p-6 lg:p-10 shadow-elegant text-primary-foreground relative overflow-hidden hover-lift transition-all duration-500">
          <div className="absolute -top-20 -right-20 w-72 h-72 bg-accent/20 blob-shape animate-blob" />
          <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-white/10 blob-shape animate-blob" style={{ animationDelay: "3s" }} />

          <div className="grid lg:grid-cols-2 gap-8 items-center relative">
            <div className="rounded-2xl overflow-hidden border-4 border-white/30 shadow-elegant hover-lift group">
              <img
                src={gedung}
                alt="Kantor Bupati Tangerang"
                loading="lazy"
                width={800}
                height={640}
                className="w-full h-auto group-hover:scale-110 transition-transform duration-700"
              />
            </div>
            <div className="space-y-3 animate-fade-in-up">
              <h3 className="text-xl font-bold text-accent">Pengertian SPBE</h3>
              <p className="text-base leading-relaxed">
                Berdasarkan <strong className="text-accent">Peraturan Presiden Nomor 95 Tahun 2018</strong>,
                <strong> Sistem Pemerintahan Berbasis Elektronik (SPBE)</strong> adalah penyelenggaraan
                pemerintahan yang memanfaatkan teknologi informasi dan komunikasi untuk memberikan layanan
                kepada Pengguna SPBE — yaitu masyarakat, pelaku usaha, aparatur sipil negara, dan instansi
                pemerintah maupun non-pemerintah lainnya.
              </p>
            </div>
          </div>

          {/* ── Regulasi SPBE Section ── */}
          <div className="relative mt-8 pt-6 border-t border-white/20">
            <div className="flex items-center gap-2 mb-5">
              <BookOpen className="w-5 h-5 text-accent" />
              <h3 className="text-lg font-bold text-accent">Dasar Hukum & Regulasi SPBE</h3>
            </div>

            {loading && (
              <div className="flex items-center justify-center gap-3 py-8">
                <Loader2 className="w-6 h-6 animate-spin text-accent" />
                <span className="text-sm opacity-80">Memuat data regulasi...</span>
              </div>
            )}

            {error && (
              <div className="flex items-center gap-3 py-6 px-4 bg-white/10 rounded-xl">
                <AlertCircle className="w-5 h-5 text-accent shrink-0" />
                <span className="text-sm opacity-90">{error}</span>
              </div>
            )}

            {!loading && !error && regulasi && (() => {
              const renderCategoryCard = (key) => {
                const item = regulasi[key];
                const label = KEBIJAKAN_LABELS[key];
                const icon = KEBIJAKAN_ICONS[key];
                const count = item?.data?.length || 0;
                const isActive = activeCategory === key;

                return (
                  <div
                    key={key}
                    onClick={() => handleCategoryClick(key)}
                    className={`backdrop-blur-sm rounded-xl p-4 border transition-all duration-300 group cursor-pointer ${
                      isActive
                        ? 'bg-white/25 border-accent/50 ring-2 ring-accent/30 scale-[1.02] shadow-lg'
                        : 'bg-white/10 border-white/15 hover:bg-white/20'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-2xl shrink-0">{icon}</span>
                      <div className="min-w-0 flex-1">
                        <h4 className="font-semibold text-sm text-accent">{label}</h4>
                        <p className="text-xs opacity-70 mt-0.5">
                          {item?.status === 'error'
                            ? 'Data tidak tersedia'
                            : `${count} regulasi`
                          }
                        </p>

                        {item?.status === 'success' && count > 0 && (
                          <ul className="mt-2 space-y-1">
                            {item.data.slice(0, 3).map((reg, idx) => (
                              <li key={idx} className="text-xs opacity-80 truncate flex items-start gap-1">
                                <span className="text-accent mt-0.5 shrink-0">•</span>
                                <span className="truncate">{reg.judul || reg.nama || reg.title || `Regulasi ${idx + 1}`}</span>
                              </li>
                            ))}
                            {count > 3 && (
                              <li className="text-xs text-accent font-medium">
                                +{count - 3} lainnya
                              </li>
                            )}
                          </ul>
                        )}
                      </div>
                      {/* Indikator toggle */}
                      <ChevronDown className={`w-4 h-4 text-accent/60 shrink-0 transition-transform duration-300 ${isActive ? 'rotate-180' : ''}`} />
                    </div>
                  </div>
                );
              };

              // Data yang difilter berdasarkan kategori aktif
              const filteredRegulations = activeCategory && regulasi[activeCategory]
                ? regulasi[activeCategory].data?.filter(
                    (item) => item.category === activeCategory || true // siap untuk filter API
                  ) || []
                : [];

              // Placeholder cards saat data kosong
              const placeholderCards = [1, 2, 3];

              return (
                <div className="flex flex-col gap-4">
                  {/* Baris 1: Peraturan Presiden, Peraturan Menteri, Pedoman Menteri */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {kategoriOrder.slice(0, 3).map(renderCategoryCard)}
                  </div>
                  {/* Baris 2: Peraturan Walikota, Keputusan Walikota — centered */}
                  <div className="flex justify-center gap-4 flex-wrap">
                    {kategoriOrder.slice(3).map((key) => (
                      <div key={key} className="w-full sm:w-[calc(33.333%-0.67rem)]">
                        {renderCategoryCard(key)}
                      </div>
                    ))}
                  </div>

                  {/* ── Inline PDF Card Grid ── */}
                  {activeCategory && (
                    <div
                      ref={cardGridRef}
                      className="mt-6 pt-6 border-t border-white/15 animate-in fade-in slide-in-from-top-4 duration-300"
                    >
                      {/* Header kategori aktif */}
                      <div className="flex items-center justify-between mb-5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center text-xl">
                            {KEBIJAKAN_ICONS[activeCategory]}
                          </div>
                          <div>
                            <h4 className="font-bold text-sm text-accent">
                              {KEBIJAKAN_LABELS[activeCategory]}
                            </h4>
                            <p className="text-[11px] opacity-60">
                              {filteredRegulations.length > 0
                                ? `${filteredRegulations.length} dokumen tersedia`
                                : 'Menunggu data dari API'}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => setActiveCategory(null)}
                          className="text-xs text-accent/70 hover:text-accent px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-all duration-200"
                        >
                          Tutup
                        </button>
                      </div>

                      {/* Grid of PDF Cards */}
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {filteredRegulations.length > 0
                          ? filteredRegulations.map((reg, idx) => (
                              <div
                                key={reg.id || idx}
                                className="group relative bg-white rounded-3xl shadow-md overflow-hidden hover:shadow-xl hover:scale-105 transition-all duration-300 flex flex-col h-[340px]"
                                style={{ animationDelay: `${idx * 80}ms`, animationFillMode: 'both' }}
                              >
                                {/* Aksen gradient atas */}
                                <div className="h-1.5 w-full bg-gradient-to-r from-[#0057A4]/50 to-[#0057A4] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                                {/* PDF Thumbnail Placeholder */}
                                <div className="relative mx-5 mt-5 aspect-[3/4] max-h-48 bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl flex flex-col items-center justify-center overflow-hidden border border-slate-200/60">
                                  {reg.thumbnail ? (
                                    <img
                                      src={reg.thumbnail}
                                      alt={`Preview ${reg.title || reg.judul || ''}`}
                                      className="w-full h-full object-cover rounded-2xl group-hover:scale-105 transition-transform duration-500"
                                      loading="lazy"
                                    />
                                  ) : (
                                    <>
                                      {/* Dekorasi background garis */}
                                      <div className="absolute inset-0 opacity-[0.03]">
                                        <div className="absolute top-4 left-4 right-4 h-2 bg-slate-400 rounded" />
                                        <div className="absolute top-9 left-4 right-8 h-2 bg-slate-400 rounded" />
                                        <div className="absolute top-14 left-4 right-12 h-2 bg-slate-400 rounded" />
                                        <div className="absolute top-19 left-4 right-6 h-2 bg-slate-400 rounded" />
                                        <div className="absolute top-24 left-4 right-16 h-2 bg-slate-400 rounded" />
                                      </div>
                                      <div className="w-14 h-14 rounded-2xl bg-white shadow-sm border border-slate-200 flex items-center justify-center mb-3 group-hover:scale-110 group-hover:bg-[#0057A4] group-hover:border-[#0057A4] transition-all duration-300">
                                        <FileText className="w-7 h-7 text-[#0057A4] group-hover:text-white transition-colors duration-300" />
                                      </div>
                                      <span className="text-[10px] font-bold tracking-widest uppercase text-slate-400 bg-white/80 px-2.5 py-1 rounded-full border border-slate-200/50">
                                        PDF
                                      </span>
                                    </>
                                  )}
                                </div>

                                {/* Card Body */}
                                <div className="px-5 pt-3 pb-5 flex-1 flex flex-col justify-between">
                                  <h5 className="font-semibold text-sm text-slate-800 line-clamp-2 group-hover:text-[#0057A4] transition-colors duration-300">
                                    {reg.judul || reg.nama || reg.title || `Dokumen Regulasi ${idx + 1}`}
                                  </h5>
                                  <a
                                    href={reg.pdf_url || reg.file_url || '#'}
                                    target="_blank"
                                    rel="noreferrer"
                                    onClick={(e) => {
                                      if (!reg.pdf_url && !reg.file_url) {
                                        e.preventDefault();
                                      }
                                    }}
                                    className="mt-3 inline-flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-gradient-to-r from-[#0057A4] to-[#0070CC] text-white text-xs font-semibold hover:shadow-lg hover:shadow-[#0057A4]/25 transition-all duration-300"
                                  >
                                    <Eye className="w-4 h-4" />
                                    Lihat PDF
                                  </a>
                                </div>
                              </div>
                            ))
                          : /* ── Placeholder Cards (data kosong / API belum tersedia) ── */
                            placeholderCards.map((_, idx) => (
                              <div
                                key={`placeholder-${idx}`}
                                className="group relative bg-white rounded-3xl shadow-md overflow-hidden hover:shadow-xl hover:scale-105 transition-all duration-300 flex flex-col h-[340px]"
                                style={{ animationDelay: `${idx * 80}ms`, animationFillMode: 'both' }}
                              >
                                {/* Aksen gradient atas */}
                                <div className="h-1.5 w-full bg-gradient-to-r from-[#0057A4]/50 to-[#0057A4] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                                {/* PDF Thumbnail Placeholder */}
                                <div className="relative mx-5 mt-5 aspect-[3/4] max-h-48 bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl flex flex-col items-center justify-center overflow-hidden border border-slate-200/60">
                                  <div className="absolute inset-0 opacity-[0.03]">
                                    <div className="absolute top-4 left-4 right-4 h-2 bg-slate-400 rounded" />
                                    <div className="absolute top-9 left-4 right-8 h-2 bg-slate-400 rounded" />
                                    <div className="absolute top-14 left-4 right-12 h-2 bg-slate-400 rounded" />
                                    <div className="absolute top-19 left-4 right-6 h-2 bg-slate-400 rounded" />
                                    <div className="absolute top-24 left-4 right-16 h-2 bg-slate-400 rounded" />
                                  </div>
                                  <div className="w-14 h-14 rounded-2xl bg-white shadow-sm border border-slate-200 flex items-center justify-center mb-3 group-hover:scale-110 group-hover:bg-[#0057A4] group-hover:border-[#0057A4] transition-all duration-300">
                                    <FileText className="w-7 h-7 text-[#0057A4] group-hover:text-white transition-colors duration-300" />
                                  </div>
                                  <span className="text-[10px] font-bold tracking-widest uppercase text-slate-400 bg-white/80 px-2.5 py-1 rounded-full border border-slate-200/50">
                                    PDF
                                  </span>
                                </div>

                                {/* Card Body Placeholder */}
                                <div className="px-5 pt-3 pb-5 flex-1 flex flex-col justify-between">
                                  <div className="space-y-2">
                                    <div className="h-3 bg-slate-200 rounded-full w-3/4 animate-pulse" />
                                    <div className="h-3 bg-slate-200 rounded-full w-1/2 animate-pulse" />
                                  </div>
                                  <div className="mt-3 flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-slate-200 text-slate-400 text-xs font-semibold cursor-not-allowed">
                                    <Eye className="w-4 h-4" />
                                    Lihat PDF
                                  </div>
                                </div>
                              </div>
                            ))
                        }
                      </div>
                    </div>
                  )}
                </div>
              );
            })()}
          </div>
        </div>
      </div>
    </section>

    </>
  );
};
