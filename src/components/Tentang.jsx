import gedung from "@/assets/gedung.jpg";
import { Info } from "lucide-react";

export const Tentang = () => {
  return (
    <section id="tentang" className="py-20 relative scroll-mt-20">
      <div className="container">
        <div className="text-center mb-12 animate-fade-in-up">
          <span className="pill bg-secondary text-primary inline-flex items-center gap-2 mb-3">
            <Info className="w-4 h-4" /> Tentang Kami
          </span>
          <h2 className="text-4xl lg:text-5xl font-extrabold text-gradient">TENTANG SPBE</h2>
        </div>

        <div className="gradient-hero rounded-[2.5rem] p-8 lg:p-14 shadow-elegant text-primary-foreground relative overflow-hidden hover-lift transition-all duration-500">
          <div className="absolute -top-20 -right-20 w-72 h-72 bg-accent/20 blob-shape animate-blob" />
          <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-white/10 blob-shape animate-blob" style={{ animationDelay: "3s" }} />

          <div className="grid lg:grid-cols-2 gap-10 items-center relative">
            <div className="rounded-3xl overflow-hidden border-4 border-white/30 shadow-elegant hover-lift group">
              <img
                src={gedung}
                alt="Kantor Bupati Tangerang"
                loading="lazy"
                width={800}
                height={640}
                className="w-full h-auto group-hover:scale-110 transition-transform duration-700"
              />
            </div>
            <div className="space-y-4 animate-fade-in-up">
              <h3 className="text-2xl font-bold text-accent">Pengertian SPBE</h3>
              <p className="text-lg leading-relaxed">
                Berdasarkan <strong className="text-accent">Peraturan Presiden Nomor 95 Tahun 2018</strong>,
                <strong> Sistem Pemerintahan Berbasis Elektronik (SPBE)</strong> adalah penyelenggaraan
                pemerintahan yang memanfaatkan teknologi informasi dan komunikasi untuk memberikan layanan
                kepada Pengguna SPBE — yaitu masyarakat, pelaku usaha, aparatur sipil negara, dan instansi
                pemerintah maupun non-pemerintah lainnya.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
import { useState, useEffect } from "react";
import gedung from "@/assets/gedung.jpg";
import { Info, BookOpen, Loader2, AlertCircle } from "lucide-react";
import { fetchAllRegulasi, KEBIJAKAN_LABELS, KEBIJAKAN_ICONS } from "@/utils/helpers";

export const Tentang = () => {
  const [regulasi, setRegulasi] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

            {!loading && !error && regulasi && (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {kategoriOrder.map((key) => {
                  const item = regulasi[key];
                  const label = KEBIJAKAN_LABELS[key];
                  const icon = KEBIJAKAN_ICONS[key];
                  const count = item?.data?.length || 0;

                  return (
                    <div
                      key={key}
                      className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/15 hover:bg-white/20 transition-all duration-300 group"
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
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

