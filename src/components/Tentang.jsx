import { useState, useEffect, useRef } from "react";
import gedung from "@/assets/image.png";
import { Info, BookOpen, Loader2, AlertCircle, FileText, ChevronDown, Eye } from "lucide-react";
import { fetchRegulasiList, fetchCategoryRegulasi, getFileUrl } from "@/utils/helpers";

/** Ikon default yang dirotasi berdasarkan index kategori */
const CATEGORY_ICONS = ['🏛️', '📋', '📘', '🏢', '📜', '📄', '⚖️', '📑'];

export const Tentang = () => {
  const [categories, setCategories] = useState([]);
  const [regulasiList, setRegulasiList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState(null);
  const cardGridRef = useRef(null);

  // Toggle kategori aktif — klik lagi untuk menutup
  const handleCategoryClick = (categoryId) => {
    setActiveCategory((prev) => (prev === categoryId ? null : categoryId));
  };

  // Scroll ke card grid saat kategori dipilih
  useEffect(() => {
    if (activeCategory && cardGridRef.current) {
      cardGridRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [activeCategory]);

  // Load data dari API — gunakan Promise.allSettled agar satu kegagalan tidak memblokir yang lain
  useEffect(() => {
    let cancelled = false;

    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        const [catResult, regResult] = await Promise.allSettled([
          fetchCategoryRegulasi(),
          fetchRegulasiList(),
        ]);

        if (!cancelled) {
          const cats = catResult.status === 'fulfilled' ? catResult.value : [];
          const regs = regResult.status === 'fulfilled' ? regResult.value : [];

          setCategories(cats);
          setRegulasiList(regs);

          // Tampilkan error parsial jika salah satu gagal
          if (catResult.status === 'rejected' && regResult.status === 'rejected') {
            setError("Gagal memuat data regulasi. Silakan coba lagi nanti.");
          }
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

    loadData();
    return () => { cancelled = true; };
  }, []);

  // Filter regulasi berdasarkan kategori aktif
  const filteredRegulations = activeCategory
    ? regulasiList.filter((r) => r.categoryRegulasiId === activeCategory)
    : [];

  // Ambil nama kategori aktif
  const activeCategoryData = categories.find((c) => c.id === activeCategory);

  return (
    <>
      <section id="tentang" className="py-12 relative scroll-mt-20">
      <div className="container">
        <div className="text-center mb-10 animate-fade-in-up">
          <span className="pill bg-secondary text-primary inline-flex items-center gap-2 mb-3">
            <Info className="w-4 h-4" /> Tentang Kami
          </span>
          <h2 className="text-3xl lg:text-4xl font-extrabold text-gradient tracking-tight">Tentang Pemerintahan Digital</h2>
        </div>

        <div className="gradient-hero rounded-2xl p-6 lg:p-10 shadow-lg border border-white/10 text-primary-foreground relative overflow-hidden transition-all duration-500">
          <div className="absolute -top-20 -right-20 w-72 h-72 bg-accent/20 blob-shape animate-blob" />
          <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-white/10 blob-shape animate-blob" style={{ animationDelay: "3s" }} />

          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center relative">
            <div className="rounded-xl overflow-hidden border border-white/20 shadow-md group">
              <img
                src={gedung}
                alt="Kantor Bupati Tangerang"
                loading="lazy"
                width={800}
                height={640}
                className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-700"
              />
            </div>
            <div className="space-y-4 animate-fade-in-up">
              <h3 className="text-2xl font-bold text-accent tracking-tight">Pengertian Pemerintahan Digital</h3>
              <p className="text-base lg:text-lg leading-relaxed opacity-90">
                Berdasarkan <strong className="text-accent font-semibold">Peraturan Menteri Nomor 8 Tahun 2026</strong>,
                <strong className="font-semibold"> Pemerintahan Digital </strong> adalah transformasi pemerintahan yang memanfaatkan
                data dan teknologi digital untuk peningkatan kualitas
                layanan pemerintah guna pencapaian visi, misi, dan
                arah pembangunan nasional.
              </p>
            </div>
          </div>

          {/* ── Regulasi Pemerintahan Digital Section ── */}
          <div className="relative mt-8 pt-6 border-t border-white/20">
            <div className="flex items-center gap-2 mb-5">
              <BookOpen className="w-5 h-5 text-accent" />
              <h3 className="text-lg font-bold text-accent">Dasar Hukum & Regulasi Pemerintahan Digital</h3>
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

            {!loading && !error && categories.length === 0 && (
              <div className="text-center py-8 opacity-70 text-sm">Belum ada data regulasi tersedia.</div>
            )}

            {!loading && !error && categories.length > 0 && (() => {
              const renderCategoryCard = (cat, idx) => {
                const icon = CATEGORY_ICONS[idx % CATEGORY_ICONS.length];
                const count = regulasiList.filter((r) => r.categoryRegulasiId === cat.id).length;
                const isActive = activeCategory === cat.id;
                const catRegulations = regulasiList.filter((r) => r.categoryRegulasiId === cat.id);

                return (
                  <button
                    key={cat.id}
                    onClick={() => handleCategoryClick(cat.id)}
                    aria-expanded={isActive}
                    className={`w-full text-left backdrop-blur-sm rounded-lg p-4 border transition-all duration-300 group focus-visible:ring-2 focus-visible:ring-accent outline-none ${
                      isActive
                        ? 'bg-white/25 border-accent/50 ring-2 ring-accent/30 shadow-md'
                        : 'bg-white/10 border-white/15 hover:bg-white/20'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-2xl shrink-0">{icon}</span>
                      <div className="min-w-0 flex-1">
                        <h4 className="font-semibold text-sm text-accent">{cat.name}</h4>
                        <p className="text-xs opacity-70 mt-0.5">
                          {count > 0 ? `${count} regulasi` : 'Belum ada regulasi'}
                        </p>

                        {count > 0 && (
                          <ul className="mt-2 space-y-1">
                            {catRegulations.slice(0, 3).map((reg, regIdx) => (
                              <li key={reg.id || regIdx} className="text-xs opacity-80 truncate flex items-start gap-1">
                                <span className="text-accent mt-0.5 shrink-0">•</span>
                                <span className="truncate">{reg.title || `Regulasi ${regIdx + 1}`}</span>
                              </li>
                            ))}
                            {count > 3 && (
                              <li className="text-xs text-accent font-medium mt-1">
                                +{count - 3} lainnya
                              </li>
                            )}
                          </ul>
                        )}
                      </div>
                      <ChevronDown className={`w-4 h-4 text-accent/60 shrink-0 transition-transform duration-300 ${isActive ? 'rotate-180' : ''}`} />
                    </div>
                  </button>
                );
              };

              return (
                <div className="flex flex-col gap-4">
                  {/* Grid kategori cards — responsive, max 3 kolom */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {categories.map((cat, idx) => renderCategoryCard(cat, idx))}
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
                            {CATEGORY_ICONS[categories.findIndex((c) => c.id === activeCategory) % CATEGORY_ICONS.length] || '📄'}
                          </div>
                          <div>
                            <h4 className="font-bold text-sm text-accent">
                              {activeCategoryData?.name || 'Kategori'}
                            </h4>
                            <p className="text-[11px] opacity-60">
                              {filteredRegulations.length > 0
                                ? `${filteredRegulations.length} dokumen tersedia`
                                : 'Belum ada dokumen'}
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
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 max-w-5xl mx-auto justify-items-center">
                        {filteredRegulations.length > 0
                          ? filteredRegulations.map((reg, idx) => (
                              <div
                                key={reg.id || idx}
                                className="group relative bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden hover:shadow-md hover:border-accent/50 transition-all duration-300 flex flex-col h-[180px] w-full max-w-[240px]"
                                style={{ animationDelay: `${idx * 80}ms`, animationFillMode: 'both' }}
                              >
                                {/* Aksen gradient atas */}
                                <div className="h-1 w-full bg-gradient-to-r from-primary/50 to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                                {/* PDF Thumbnail Placeholder */}
                                <div className="relative mx-2.5 mt-2.5 aspect-[4/3] max-h-20 bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg flex flex-col items-center justify-center overflow-hidden border border-slate-200/60">
                                  <>
                                    <div className="absolute inset-0 opacity-[0.03]">
                                      <div className="absolute top-2 left-2 right-2 h-[2px] bg-slate-400 rounded" />
                                      <div className="absolute top-4 left-2 right-5 h-[2px] bg-slate-400 rounded" />
                                      <div className="absolute top-6 left-2 right-8 h-[2px] bg-slate-400 rounded" />
                                      <div className="absolute top-8 left-2 right-4 h-[2px] bg-slate-400 rounded" />
                                    </div>
                                    <div className="w-6 h-6 rounded-md bg-white shadow-sm border border-slate-200 flex items-center justify-center mb-0.5 group-hover:scale-110 group-hover:bg-primary group-hover:border-primary transition-all duration-300">
                                      <FileText className="w-3.5 h-3.5 text-primary group-hover:text-white transition-colors duration-300" />
                                    </div>
                                    <span className="text-[7px] font-bold tracking-widest uppercase text-slate-400 bg-white/80 px-1 py-[1px] rounded-full border border-slate-200/50">
                                      PDF
                                    </span>
                                  </>
                                </div>

                                {/* Card Body */}
                                <div className="px-2.5 pt-1.5 pb-2.5 flex-1 flex flex-col justify-between">
                                  <h5 className="font-semibold text-[11px] text-slate-800 line-clamp-2 group-hover:text-primary transition-colors duration-300 leading-tight">
                                    {reg.title || `Dokumen Regulasi ${idx + 1}`}
                                  </h5>
                                  <a
                                    href={reg.fileUrl ? (reg.fileUrl.startsWith('http') ? reg.fileUrl : `${(import.meta.env.VITE_MEDIA_ORIGIN || 'http://localhost:8000').replace(/\/$/, '')}${reg.fileUrl.startsWith('/') ? '' : '/'}${reg.fileUrl}`) : '#'}
                                    target="_blank"
                                    rel="noreferrer"
                                    onClick={(e) => {
                                      if (!reg.fileUrl) {
                                        e.preventDefault();
                                        alert("File dokumen belum tersedia.");
                                      }
                                    }}
                                    className="mt-1.5 inline-flex items-center justify-center gap-1.5 w-full py-1.5 rounded bg-secondary text-primary hover:bg-primary hover:text-primary-foreground text-[10px] font-semibold transition-all duration-300 focus-visible:ring-2 focus-visible:ring-accent outline-none"
                                  >
                                    <Eye className="w-4 h-4" />
                                    Lihat PDF
                                  </a>
                                </div>
                              </div>
                            ))
                          : /* ── Pesan saat belum ada regulasi di kategori ini ── */
                            <div className="col-span-full text-center py-8 opacity-70 text-sm">
                              Belum ada dokumen regulasi untuk kategori ini.
                            </div>
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
