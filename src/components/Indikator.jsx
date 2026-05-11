<<<<<<< HEAD
import { useState, useEffect, useMemo, useRef } from "react";
import { Search, Filter, ChevronLeft, ChevronRight } from "lucide-react";

const domains = ["Semua", "Kebijakan", "Tata Kelola", "Manajemen", "Layanan"];

const data = [
  { no: 1, domain: "Kebijakan", aspek: "Kebijakan Internal SPBE", indikator: "Tim Koordinasi SPBE", penjelasan: "Pembentukan dan penetapan tim koordinasi SPBE tingkat daerah yang bertanggung jawab atas perencanaan, pelaksanaan, dan evaluasi SPBE." },
  { no: 2, domain: "Kebijakan", aspek: "Kebijakan Internal SPBE", indikator: "Rencana Induk SPBE", penjelasan: "Dokumen perencanaan SPBE jangka menengah yang memuat visi, misi, tujuan, sasaran, arah kebijakan, strategi, dan peta jalan SPBE." },
  { no: 3, domain: "Tata Kelola", aspek: "Perencanaan Strategis", indikator: "Arsitektur SPBE", penjelasan: "Kerangka dasar yang mendeskripsikan integrasi proses bisnis, data, infrastruktur, dan aplikasi SPBE secara menyeluruh." },
  { no: 4, domain: "Tata Kelola", aspek: "Perencanaan Strategis", indikator: "Peta Rencana SPBE", penjelasan: "Peta jalan implementasi SPBE yang menjadi acuan dalam pelaksanaan pembangunan dan pengembangan SPBE." },
  { no: 5, domain: "Tata Kelola", aspek: "Teknologi Informasi", indikator: "Jaringan Intra Pemerintah", penjelasan: "Jaringan tertutup yang menghubungkan antar simpul jaringan dalam instansi pemerintah untuk pertukaran data yang aman." },
  { no: 6, domain: "Manajemen", aspek: "Manajemen Risiko", indikator: "Penerapan Manajemen Risiko", penjelasan: "Implementasi proses identifikasi, analisis, dan penanganan risiko keamanan informasi sesuai standar nasional." },
  { no: 7, domain: "Manajemen", aspek: "Manajemen Keamanan", indikator: "Audit Keamanan SPBE", penjelasan: "Pelaksanaan audit berkala terhadap sistem keamanan informasi untuk memastikan kepatuhan dan efektivitas kontrol." },
  { no: 8, domain: "Manajemen", aspek: "Manajemen Data", indikator: "Satu Data Indonesia", penjelasan: "Kebijakan pengelolaan data pemerintah yang menghasilkan data akurat, mutakhir, terpadu, dan dapat dipertanggungjawabkan." },
  { no: 9, domain: "Layanan", aspek: "Layanan Publik", indikator: "Portal Layanan Terpadu", penjelasan: "Portal web yang menyediakan akses terpusat ke berbagai layanan publik pemerintah daerah secara digital." },
  { no: 10, domain: "Layanan", aspek: "Layanan Administrasi", indikator: "Sistem e-Office", penjelasan: "Sistem administrasi perkantoran elektronik yang mencakup persuratan, disposisi, dan tata naskah dinas digital." },
  { no: 11, domain: "Layanan", aspek: "Layanan Publik", indikator: "Pengaduan Online", penjelasan: "Kanal pengaduan masyarakat secara online yang terintegrasi dengan sistem penanganan dan tindak lanjut." },
  { no: 12, domain: "Kebijakan", aspek: "Kebijakan Tata Kelola", indikator: "Regulasi SPBE Daerah", penjelasan: "Peraturan daerah dan peraturan bupati yang mengatur implementasi SPBE di lingkungan Pemkab Tangerang." },
];

export const Indikator = () => {
  const [activeDomain, setActiveDomain] = useState("Semua");
  const [searchQuery, setSearchQuery] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState(4);
  const [currentPage, setCurrentPage] = useState(1);
  const [highlightedDomain, setHighlightedDomain] = useState(null);
  const domainRefs = useRef({});

  // Listen for domain-select events from Navbar
  useEffect(() => {
    const handleDomainSelect = (e) => {
      const { domain } = e.detail;
      if (domain && domains.includes(domain)) {
        setActiveDomain(domain);
        setCurrentPage(1);

        // Trigger highlight animation
        setHighlightedDomain(domain);
        setTimeout(() => setHighlightedDomain(null), 1500);
      }
    };

    window.addEventListener("spbe-domain-select", handleDomainSelect);
    return () => window.removeEventListener("spbe-domain-select", handleDomainSelect);
  }, []);

  // Filter data by domain and search
  const filtered = useMemo(() => {
    return data.filter((d) => {
      const matchDomain = activeDomain === "Semua" || d.domain === activeDomain;
      const matchSearch =
        searchQuery === "" ||
        JSON.stringify(d).toLowerCase().includes(searchQuery.toLowerCase());
      return matchDomain && matchSearch;
    });
  }, [activeDomain, searchQuery]);

  // Pagination calculations
  const totalPages = Math.max(1, Math.ceil(filtered.length / entriesPerPage));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const startIdx = (safeCurrentPage - 1) * entriesPerPage;
  const paginatedData = filtered.slice(startIdx, startIdx + entriesPerPage);

  // Reset page when filters change
  const handleDomainChange = (domain) => {
    setActiveDomain(domain);
    setCurrentPage(1);
  };

  const handleEntriesChange = (val) => {
    setEntriesPerPage(Number(val));
    setCurrentPage(1);
  };

  const handleSearchChange = (val) => {
    setSearchQuery(val);
    setCurrentPage(1);
  };

  // Generate page numbers
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <section id="indikator" className="py-12 bg-gradient-to-b from-background to-secondary/30 scroll-mt-20">
      <div className="container">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in-up">
          <span className="pill bg-secondary text-primary inline-block mb-2">Penilaian</span>
          <h2 className="text-3xl lg:text-4xl font-extrabold text-gradient">Indikator SPBE</h2>
          <p className="text-muted-foreground mt-2 max-w-2xl mx-auto text-sm">
            Telusuri indikator penilaian SPBE berdasarkan domain dan aspek penilaian.
          </p>
        </div>

        {/* Filters */}
        <div className="bg-card rounded-2xl p-5 shadow-soft mb-6 space-y-4">
          {/* Domain filter pills */}
          <div className="flex items-center gap-2 flex-wrap">
            <button className="pill gradient-primary text-primary-foreground inline-flex items-center gap-2">
              <Filter className="w-4 h-4" /> Filter Domain
            </button>
            {domains.map((d) => (
              <button
                key={d}
                ref={(el) => { domainRefs.current[d] = el; }}
                onClick={() => handleDomainChange(d)}
                className={`pill border transition-all ${
                  activeDomain === d
                    ? "gradient-primary text-primary-foreground border-transparent shadow-soft"
                    : "bg-background text-foreground border-border hover:border-primary hover:text-primary"
                } ${
                  highlightedDomain === d ? "animate-highlight-pulse ring-2 ring-accent ring-offset-2" : ""
                }`}
              >
                {d}
              </button>
            ))}
          </div>

          {/* Entries selector + Search */}
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>Tampilkan</span>
              <select
                value={entriesPerPage}
                onChange={(e) => handleEntriesChange(e.target.value)}
                className="appearance-none bg-secondary rounded-lg px-3 py-1.5 text-foreground font-semibold border border-border focus:outline-none focus:ring-2 focus:ring-ring cursor-pointer spbe-select"
              >
                <option value={4}>4</option>
                <option value={8}>8</option>
                <option value={12}>12</option>
              </select>
              <span>entri</span>
            </div>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder="Cari indikator..."
                className="pl-9 pr-4 py-2 rounded-lg bg-secondary border border-border text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-card rounded-2xl shadow-soft overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="gradient-primary text-primary-foreground">
                  {["No", "Domain", "Aspek", "Indikator", "Penjelasan"].map((h) => (
                    <th key={h} className="px-6 py-4 text-left font-semibold">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paginatedData.map((row, i) => (
                  <tr
                    key={row.no}
                    className={`border-b border-border hover:bg-secondary/50 transition-colors animate-fade-in ${
                      highlightedDomain && row.domain === highlightedDomain ? "bg-accent/10" : ""
                    }`}
                    style={{ animationDelay: `${i * 0.05}s` }}
                  >
                    <td className="px-6 py-4 font-semibold text-primary">{row.no}</td>
                    <td className="px-6 py-4">
                      <span className="pill text-xs bg-secondary text-primary">{row.domain}</span>
                    </td>
                    <td className="px-6 py-4">{row.aspek}</td>
                    <td className="px-6 py-4 font-medium">{row.indikator}</td>
                    <td className="px-6 py-4 text-muted-foreground max-w-xs">{row.penjelasan}</td>
                  </tr>
                ))}
                {paginatedData.length === 0 && (
                  <tr>
                    <td colSpan={5} className="text-center py-10 text-muted-foreground">
                      Tidak ada data yang ditemukan.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          <div className="flex items-center justify-between p-4 border-t border-border text-sm text-muted-foreground">
            <span>
              Menampilkan {filtered.length === 0 ? 0 : startIdx + 1}–
              {Math.min(startIdx + entriesPerPage, filtered.length)} dari {filtered.length} entri
            </span>
            <div className="flex gap-1">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={safeCurrentPage <= 1}
                className="p-2 rounded-lg hover:bg-secondary transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              {pageNumbers.map((num) => (
                <button
                  key={num}
                  onClick={() => setCurrentPage(num)}
                  className={`px-3 py-1 rounded-lg transition-all ${
                    safeCurrentPage === num
                      ? "gradient-primary text-primary-foreground shadow-soft"
                      : "hover:bg-secondary"
                  }`}
                >
                  {num}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={safeCurrentPage >= totalPages}
                className="p-2 rounded-lg hover:bg-secondary transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
=======
import { useState } from "react";
import { Search, Filter, ChevronLeft, ChevronRight } from "lucide-react";

const domains = ["Semua", "Kebijakan", "Tata Kelola", "Manajemen", "Layanan"];

const data = [
  { no: 1, domain: "Kebijakan", aspek: "Kebijakan Internal SPBE", indikator: "Tim Koordinasi SPBE", penilaian: "Sangat Baik" },
  { no: 2, domain: "Tata Kelola", aspek: "Perencanaan Strategis", indikator: "Arsitektur SPBE", penilaian: "Baik" },
  { no: 3, domain: "Manajemen", aspek: "Manajemen Risiko", indikator: "Penerapan ISO 31000", penilaian: "Sangat Baik" },
  { no: 4, domain: "Layanan", aspek: "Layanan Publik", indikator: "Portal Layanan Terpadu", penilaian: "Memuaskan" },
  { no: 5, domain: "Layanan", aspek: "Layanan Administrasi", indikator: "e-Office", penilaian: "Baik" },
  { no: 6, domain: "Manajemen", aspek: "Manajemen Data", indikator: "Satu Data Indonesia", penilaian: "Sangat Baik" },
];

const badgeColor = (p) =>
  p === "Sangat Baik" ? "bg-emerald-100 text-emerald-700"
  : p === "Memuaskan" ? "bg-accent/20 text-accent-foreground"
  : "bg-blue-100 text-blue-700";

export const Indikator = () => {
  const [active, setActive] = useState("Semua");
  const [q, setQ] = useState("");

  const filtered = data.filter(d =>
    (active === "Semua" || d.domain === active) &&
    (q === "" || JSON.stringify(d).toLowerCase().includes(q.toLowerCase()))
  );

  return (
    <section id="indikator" className="py-20 bg-gradient-to-b from-background to-secondary/30">
      <div className="container">
        <div className="text-center mb-10 animate-fade-in-up">
          <span className="pill bg-secondary text-primary inline-block mb-3">Penilaian</span>
          <h2 className="text-4xl lg:text-5xl font-extrabold text-gradient">Indikator SPBE</h2>
          <p className="text-muted-foreground mt-3 max-w-2xl mx-auto">
            Telusuri indikator penilaian SPBE berdasarkan domain dan aspek penilaian.
          </p>
        </div>

        {/* Filters */}
        <div className="bg-card rounded-2xl p-5 shadow-soft mb-6 space-y-4">
          <div className="flex items-center gap-2 flex-wrap">
            <button className="pill gradient-primary text-primary-foreground inline-flex items-center gap-2">
              <Filter className="w-4 h-4" /> Filter Domain
            </button>
            {domains.map((d) => (
              <button
                key={d}
                onClick={() => setActive(d)}
                className={`pill border transition-all ${
                  active === d
                    ? "gradient-primary text-primary-foreground border-transparent shadow-soft"
                    : "bg-background text-foreground border-border hover:border-primary hover:text-primary"
                }`}
              >
                {d}
              </button>
            ))}
          </div>
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>Show</span>
              <select className="bg-secondary rounded-lg px-2 py-1 text-foreground border border-border">
                <option>10</option><option>25</option><option>50</option>
              </select>
              <span>entries</span>
            </div>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                value={q}
                onChange={e => setQ(e.target.value)}
                placeholder="Cari..."
                className="pl-9 pr-4 py-2 rounded-lg bg-secondary border border-border text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-card rounded-2xl shadow-soft overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="gradient-primary text-primary-foreground">
                  {["No", "Domain", "Aspek", "Indikator", "Penilaian"].map(h => (
                    <th key={h} className="px-6 py-4 text-left font-semibold">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((row, i) => (
                  <tr
                    key={row.no}
                    className="border-b border-border hover:bg-secondary/50 transition-colors animate-fade-in"
                    style={{ animationDelay: `${i * 0.05}s` }}
                  >
                    <td className="px-6 py-4 font-semibold text-primary">{row.no}</td>
                    <td className="px-6 py-4">{row.domain}</td>
                    <td className="px-6 py-4">{row.aspek}</td>
                    <td className="px-6 py-4">{row.indikator}</td>
                    <td className="px-6 py-4">
                      <span className={`pill text-xs ${badgeColor(row.penilaian)}`}>{row.penilaian}</span>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr><td colSpan={5} className="text-center py-10 text-muted-foreground">Tidak ada data.</td></tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between p-4 border-t border-border text-sm text-muted-foreground">
            <span>Menampilkan {filtered.length} dari {data.length} entri</span>
            <div className="flex gap-2">
              <button className="p-2 rounded-lg hover:bg-secondary transition-colors"><ChevronLeft className="w-4 h-4" /></button>
              <button className="px-3 py-1 rounded-lg gradient-primary text-primary-foreground">1</button>
              <button className="p-2 rounded-lg hover:bg-secondary transition-colors"><ChevronRight className="w-4 h-4" /></button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
>>>>>>> c5aac93 (perubahan)
