import { useState, useEffect, useMemo, useRef } from "react";
import { Search, Filter, ChevronLeft, ChevronRight, Loader2, AlertCircle, RefreshCw } from "lucide-react";
import { fetchDomains, fetchAspek, fetchIndikator } from "@/utils/helpers";

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
          <div className="flex flex-col items-center justify-center gap-3 py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <span className="text-sm text-muted-foreground">Memuat data indikator...</span>
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

        {/* Konten */}
        {!loading && !error && (
          <>
            <div className="bg-card rounded-2xl p-5 shadow-soft mb-6 space-y-4">
              {/* Baris 1: Label Filter Domain */}
              <div>
                <button className="pill gradient-primary text-primary-foreground inline-flex items-center gap-2">
                  <Filter className="w-4 h-4" /> Filter Domain
                </button>
              </div>

              {/* Baris 2: Domain category pills — horizontal, left aligned */}
              <div className="flex items-center justify-start gap-3 flex-wrap">
                {domainNames.map((d) => (
                  <button
                    key={d}
                    ref={(el) => { domainRefs.current[d] = el; }}
                    onClick={() => handleDomainChange(d)}
                    className={`pill border-2 transition-all ${
                      activeDomain === d
                        ? "gradient-primary text-primary-foreground border-transparent shadow-soft"
                        : "bg-white text-primary border-primary hover:bg-primary/5"
                    } ${highlightedDomain === d ? "animate-highlight-pulse ring-2 ring-accent ring-offset-2" : ""}`}
                  >
                    {d}
                  </button>
                ))}
              </div>

              <div className="flex items-center justify-between gap-4 flex-wrap">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>Tampilkan</span>
                  <select value={entriesPerPage} onChange={(e) => handleEntriesChange(e.target.value)} className="appearance-none bg-secondary rounded-lg px-3 py-1.5 text-foreground font-semibold border border-border focus:outline-none focus:ring-2 focus:ring-ring cursor-pointer spbe-select">
                    <option value={4}>4</option>
                    <option value={8}>8</option>
                    <option value={12}>12</option>
                  </select>
                  <span>entri</span>
                </div>
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input value={searchQuery} onChange={(e) => handleSearchChange(e.target.value)} placeholder="Cari indikator..." className="pl-9 pr-4 py-2 rounded-lg bg-secondary border border-border text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
                </div>
              </div>
            </div>

            <div className="bg-card rounded-2xl shadow-soft overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="gradient-primary text-primary-foreground">
                      {["No", "Domain", "Aspek", "Indikator", "Penjelasan"].map((h) => (
                        <th key={h} className="px-6 py-4 text-left font-semibold">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedData.map((row, i) => (
                      <tr key={row.no} className={`border-b border-border hover:bg-secondary/50 transition-colors animate-fade-in ${highlightedDomain && row.domain === highlightedDomain ? "bg-accent/10" : ""}`} style={{ animationDelay: `${i * 0.05}s` }}>
                        <td className="px-6 py-4 font-semibold text-primary">{row.no}</td>
                        <td className="px-6 py-4"><span className="pill text-xs bg-secondary text-primary">{row.domain}</span></td>
                        <td className="px-6 py-4">{row.aspek}</td>
                        <td className="px-6 py-4 font-medium">{row.indikator}</td>
                        <td className="px-6 py-4 text-muted-foreground max-w-xs">{row.penjelasan}</td>
                      </tr>
                    ))}
                    {paginatedData.length === 0 && (
                      <tr><td colSpan={5} className="text-center py-10 text-muted-foreground">Tidak ada data yang ditemukan.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>

              <div className="flex items-center justify-between p-4 border-t border-border text-sm text-muted-foreground">
                <span>Menampilkan {enrichedData.length === 0 ? 0 : startIdx + 1}–{Math.min(startIdx + entriesPerPage, enrichedData.length)} dari {enrichedData.length} entri</span>
                <div className="flex gap-1">
                  <button onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={safeCurrentPage <= 1} className="p-2 rounded-lg hover:bg-secondary transition-colors disabled:opacity-40 disabled:cursor-not-allowed"><ChevronLeft className="w-4 h-4" /></button>
                  {pageNumbers.map((num) => (
                    <button key={num} onClick={() => setCurrentPage(num)} className={`px-3 py-1 rounded-lg transition-all ${safeCurrentPage === num ? "gradient-primary text-primary-foreground shadow-soft" : "hover:bg-secondary"}`}>{num}</button>
                  ))}
                  <button onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={safeCurrentPage >= totalPages} className="p-2 rounded-lg hover:bg-secondary transition-colors disabled:opacity-40 disabled:cursor-not-allowed"><ChevronRight className="w-4 h-4" /></button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
};
