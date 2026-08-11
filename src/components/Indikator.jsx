import { useState, useEffect, useMemo, useRef } from "react";
import { Search, Filter, ChevronLeft, ChevronRight, Loader2, AlertCircle, RefreshCw } from "lucide-react";
import { fetchDomains, fetchAspek, fetchIndikator } from "@/utils/helpers";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export const Indikator = () => {
  // ── Data state ──
  const [domains, setDomains] = useState([]);
  const [aspects, setAspects] = useState([]);
  const [indicators, setIndicators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ── Filter state ──
  const [activeDomain, setActiveDomain] = useState("Semua");
  const [activeAspekId, setActiveAspekId] = useState("Semua");
  const [searchQuery, setSearchQuery] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState(4);
  const [currentPage, setCurrentPage] = useState(1);
  const [highlightedDomain, setHighlightedDomain] = useState(null);
  const domainRefs = useRef({});

  // ── Load data — gunakan Promise.allSettled agar satu kegagalan tidak memblokir yang lain ──
  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [domainsResult, aspectsResult, indicatorsResult] = await Promise.allSettled([
        fetchDomains(),
        fetchAspek(),
        fetchIndikator(),
      ]);
      setDomains(domainsResult.status === 'fulfilled' ? domainsResult.value : []);
      setAspects(aspectsResult.status === 'fulfilled' ? aspectsResult.value : []);
      setIndicators(indicatorsResult.status === 'fulfilled' ? indicatorsResult.value : []);

      // Error hanya jika semua gagal
      if (
        domainsResult.status === 'rejected' &&
        aspectsResult.status === 'rejected' &&
        indicatorsResult.status === 'rejected'
      ) {
        setError("Gagal memuat data indikator. Silakan coba lagi.");
      }
    } catch (err) {
      setError("Gagal memuat data indikator. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // ── Listen for domain-select events from Navbar ──
  useEffect(() => {
    const handleDomainSelect = (e) => {
      const { domain } = e.detail;
      if (domain) {
        const found = domains.find((d) => d.name.toLowerCase() === domain.toLowerCase());
        if (found) {
          setActiveDomain(found.name);
          setActiveAspekId("Semua");
          setCurrentPage(1);
          setHighlightedDomain(domain);
          setTimeout(() => setHighlightedDomain(null), 1500);
        }
      }
    };
    window.addEventListener("spbe-domain-select", handleDomainSelect);
    return () => window.removeEventListener("spbe-domain-select", handleDomainSelect);
  }, [domains]);

  // ── Filtered aspects based on active domain ──
  const filteredAspects = useMemo(() => {
    if (activeDomain === "Semua") return aspects;
    const domain = domains.find((d) => d.name === activeDomain);
    if (!domain) return [];
    return aspects.filter((a) => a.domainId === domain.id);
  }, [activeDomain, aspects, domains]);

  // ── Get active domain ID for indicator filtering ──
  const activeDomainId = useMemo(() => {
    if (activeDomain === "Semua") return null;
    return domains.find((d) => d.name === activeDomain)?.id || null;
  }, [activeDomain, domains]);

  // ── Filtered indicators based on domain + aspect ──
  const filtered = useMemo(() => {
    return indicators.filter((ind) => {
      // Filter by domain (via aspek's domainId)
      if (activeDomainId) {
        const aspek = aspects.find((a) => String(a.id) === String(ind.aspekId));
        if (!aspek || String(aspek.domainId) !== String(activeDomainId)) return false;
      }
      // Filter by specific aspek
      if (activeAspekId !== "Semua" && String(ind.aspekId) !== String(activeAspekId)) return false;
      // Search filter
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const aspek = aspects.find((a) => String(a.id) === String(ind.aspekId));
        const domain = aspek ? domains.find((d) => String(d.id) === String(aspek.domainId)) : null;
        const searchable = [
          ind.name,
          aspek?.name,
          domain?.name,
        ].filter(Boolean).join(" ").toLowerCase();
        if (!searchable.includes(q)) return false;
      }
      return true;
    });
  }, [indicators, aspects, domains, activeDomainId, activeAspekId, searchQuery]);

  // ── Enrich filtered data with domain & aspek names ──
  const enrichedData = useMemo(() => {
    return filtered.map((ind, idx) => {
      const aspek = aspects.find((a) => String(a.id) === String(ind.aspekId));
      const domain = aspek ? domains.find((d) => String(d.id) === String(aspek.domainId)) : null;
      return {
        no: idx + 1,
        domain: domain?.name || "—",
        aspek: aspek?.name || "—",
        indikator: ind.name || "—",
        penjelasan: ind.description || ind.penjelasan || "",
      };
    });
  }, [filtered, aspects, domains]);

  // ── Pagination ──
  const totalPages = Math.max(1, Math.ceil(enrichedData.length / entriesPerPage));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const startIdx = (safeCurrentPage - 1) * entriesPerPage;
  const paginatedData = enrichedData.slice(startIdx, startIdx + entriesPerPage);

  // ── Handlers ──
  const handleDomainChange = (domainName) => {
    setActiveDomain(domainName);
    setActiveAspekId("Semua");
    setCurrentPage(1);
  };

  const handleEntriesChange = (val) => { setEntriesPerPage(Number(val)); setCurrentPage(1); };
  const handleSearchChange = (val) => { setSearchQuery(val); setCurrentPage(1); };

  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) { pageNumbers.push(i); }

  // ── Domain names for pills (from API)
  const domainNames = useMemo(() => ["Semua", ...domains.map((d) => d.name)], [domains]);

  return (
    <section id="indikator" className="py-12 bg-gradient-to-b from-background to-secondary/30 scroll-mt-20">
      <div className="container">
        <div className="text-center mb-8 animate-fade-in-up">
          <span className="pill bg-secondary text-primary inline-block mb-2">Penilaian</span>
          <h2 className="text-3xl lg:text-4xl font-extrabold text-gradient">Indikator Pemerintahan Digital</h2>
          <p className="text-muted-foreground mt-2 max-w-2xl mx-auto text-sm">Telusuri indikator penilaian Pemerintahan Digital berdasarkan domain dan aspek penilaian.</p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="bg-white rounded-xl shadow-sm border border-border overflow-hidden mb-6 mt-8 motion-safe:animate-fade-in" aria-live="polite" aria-busy="true">
            <div className="p-5 border-b border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
               <div className="w-32 h-8 bg-secondary/50 rounded motion-safe:animate-pulse" />
               <div className="w-full sm:w-64 h-10 bg-secondary/50 rounded-lg motion-safe:animate-pulse" />
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-secondary/20 border-b border-border">
                  <tr>
                    {[1, 2, 3, 4, 5].map((i) => (
                      <th key={i} className="px-6 py-4"><div className="h-4 bg-border/40 rounded motion-safe:animate-pulse w-20"></div></th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {[1, 2, 3, 4].map((row) => (
                    <tr key={row}>
                      <td className="px-6 py-4"><div className="h-4 bg-border/40 rounded motion-safe:animate-pulse w-6"></div></td>
                      <td className="px-6 py-4"><div className="h-6 bg-border/40 rounded-full motion-safe:animate-pulse w-24"></div></td>
                      <td className="px-6 py-4"><div className="h-4 bg-border/40 rounded motion-safe:animate-pulse w-32"></div></td>
                      <td className="px-6 py-4"><div className="h-4 bg-border/40 rounded motion-safe:animate-pulse w-48"></div></td>
                      <td className="px-6 py-4">
                        <div className="h-4 bg-border/40 rounded motion-safe:animate-pulse w-full max-w-[200px] mb-2"></div>
                        <div className="h-4 bg-border/40 rounded motion-safe:animate-pulse w-3/4 max-w-[150px]"></div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Error State */}
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

        {/* Konten */}
        {!loading && !error && (
          <>
            <div className="bg-card rounded-2xl p-5 shadow-sm border border-border mb-6 space-y-5">
              {/* Baris 1: Label Filter Domain */}
              <div className="flex items-center gap-2 text-foreground font-semibold">
                <Filter className="w-4 h-4 text-primary" />
                <h3>Filter Domain</h3>
              </div>

              {/* Baris 2: Domain category tabs — horizontal, scrollable on mobile */}
              <div 
                role="group" 
                aria-label="Filter berdasarkan domain"
                className="flex items-center justify-start gap-2 overflow-x-auto pb-2 -mx-2 px-2 sm:mx-0 sm:px-0 sm:pb-0 scrollbar-hide"
              >
                {domainNames.map((d) => (
                  <button
                    key={d}
                    type="button"
                    aria-pressed={activeDomain === d}
                    ref={(el) => { domainRefs.current[d] = el; }}
                    onClick={() => handleDomainChange(d)}
                    className={`shrink-0 px-4 py-2 text-sm font-semibold rounded-full border transition-all focus-visible:ring-2 focus-visible:ring-accent outline-none ${
                      activeDomain === d
                        ? "bg-primary text-primary-foreground border-primary shadow-sm"
                        : "bg-white text-muted-foreground border-border hover:bg-secondary hover:text-foreground"
                    } ${highlightedDomain === d ? "motion-safe:animate-highlight-pulse ring-2 ring-accent ring-offset-2" : ""}`}
                  >
                    {d}
                  </button>
                ))}
              </div>

              {/* Baris 3: Pencarian dan Entri */}
              <div className="flex flex-col-reverse sm:flex-row items-start sm:items-center justify-between gap-4 pt-2 border-t border-border">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <label htmlFor="entries-select">Tampilkan</label>
                  <select 
                    id="entries-select" 
                    value={entriesPerPage} 
                    onChange={(e) => handleEntriesChange(e.target.value)} 
                    className="appearance-none bg-background rounded-md px-3 py-1.5 text-foreground font-semibold border border-input focus:outline-none focus:ring-2 focus:ring-ring cursor-pointer hover:border-primary/50 transition-colors"
                  >
                    <option value={4}>4</option>
                    <option value={8}>8</option>
                    <option value={12}>12</option>
                    <option value={20}>20</option>
                  </select>
                  <span>entri</span>
                </div>
                
                <div className="relative w-full sm:w-auto min-w-[200px]">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input 
                    type="search"
                    aria-label="Cari indikator"
                    value={searchQuery} 
                    onChange={(e) => handleSearchChange(e.target.value)} 
                    placeholder="Cari indikator..." 
                    className="pl-9 w-full rounded-md" 
                  />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-border overflow-hidden mb-6">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-secondary/40 text-muted-foreground border-b border-border text-xs uppercase tracking-wider">
                    <tr>
                      {["No", "Domain", "Aspek", "Indikator", "Penjelasan"].map((h) => (
                        <th key={h} scope="col" className="px-6 py-4 font-semibold">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {paginatedData.map((row, i) => (
                      <tr key={row.no} className={`hover:bg-secondary/30 transition-colors motion-safe:animate-fade-in ${highlightedDomain && row.domain === highlightedDomain ? "bg-accent/10" : ""}`} style={{ animationDelay: `${i * 0.05}s` }}>
                        <td className="px-6 py-4 font-semibold text-primary">{row.no}</td>
                        <td className="px-6 py-4 whitespace-nowrap"><span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-secondary text-primary border border-primary/10">{row.domain}</span></td>
                        <td className="px-6 py-4 min-w-[150px] font-medium text-foreground">{row.aspek}</td>
                        <td className="px-6 py-4 min-w-[200px] text-foreground font-semibold">{row.indikator}</td>
                        <td className="px-6 py-4 min-w-[250px] text-muted-foreground leading-relaxed">{row.penjelasan}</td>
                      </tr>
                    ))}
                    {paginatedData.length === 0 && (
                      <tr>
                        <td colSpan={5} className="px-6 py-16 text-center text-muted-foreground" aria-live="polite">
                          <p className="text-base font-medium">Tidak ada data yang sesuai dengan filter yang dipilih.</p>
                          <p className="text-sm mt-1 opacity-80">Silakan ubah kata kunci pencarian atau pilihan domain.</p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between p-4 bg-background/50 border-t border-border gap-4 text-sm text-muted-foreground">
                <span>Menampilkan {enrichedData.length === 0 ? 0 : startIdx + 1}–{Math.min(startIdx + entriesPerPage, enrichedData.length)} dari {enrichedData.length} entri</span>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={safeCurrentPage <= 1}
                    aria-label="Halaman sebelumnya"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  
                  {pageNumbers.map((num) => (
                    <Button
                      key={num}
                      variant={safeCurrentPage === num ? "primary" : "ghost"}
                      size="sm"
                      onClick={() => setCurrentPage(num)}
                      aria-label={`Halaman ${num}`}
                      aria-current={safeCurrentPage === num ? "page" : undefined}
                    >
                      {num}
                    </Button>
                  ))}
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={safeCurrentPage >= totalPages}
                    aria-label="Halaman selanjutnya"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
};
