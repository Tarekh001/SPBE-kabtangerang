import { useState, useEffect, useMemo, useRef } from "react";
import { Search, Filter, ChevronLeft, ChevronRight } from "lucide-react";

const domains = ["Semua", "Kebijakan", "Tata Kelola", "Manajemen", "Layanan"];

const data = [
  { no: 1, domain: "Kebijakan", aspek: "Kebijakan Internal SPBE", indikator: "Kebijakan Internal Arsitektur SPBE", penjelasan: "Tingkat kematangan kebijakan internal terkait Arsitektur SPBE." },
  { no: 2, domain: "Kebijakan", aspek: "Kebijakan Internal SPBE", indikator: "Kebijakan Internal Peta Rencana SPBE", penjelasan: "Tingkat kematangan kebijakan internal terkait Peta Rencana SPBE." },
  { no: 3, domain: "Kebijakan", aspek: "Kebijakan Internal SPBE", indikator: "Kebijakan Internal Manajemen Data", penjelasan: "Tingkat kematangan kebijakan internal terkait Manajemen Data." },
  { no: 4, domain: "Kebijakan", aspek: "Kebijakan Internal SPBE", indikator: "Kebijakan Internal Pembangunan Aplikasi SPBE", penjelasan: "Tingkat kematangan kebijakan internal terkait Pembangunan Aplikasi SPBE." },
  { no: 5, domain: "Kebijakan", aspek: "Kebijakan Internal SPBE", indikator: "Kebijakan Internal Layanan Pusat Data", penjelasan: "Tingkat kematangan kebijakan internal terkait Layanan Pusat Data." },
  { no: 6, domain: "Kebijakan", aspek: "Kebijakan Internal SPBE", indikator: "Kebijakan Internal Layanan Jaringan Intra", penjelasan: "Tingkat kematangan kebijakan internal terkait Layanan Jaringan Intra." },
  { no: 7, domain: "Kebijakan", aspek: "Kebijakan Internal SPBE", indikator: "Kebijakan Internal Penggunaan Sistem Penghubung Layanan", penjelasan: "Tingkat kematangan kebijakan internal terkait Penggunaan Sistem Penghubung Layanan." },
  { no: 8, domain: "Kebijakan", aspek: "Kebijakan Internal SPBE", indikator: "Kebijakan Internal Manajemen Keamanan Informasi", penjelasan: "Tingkat kematangan kebijakan internal terkait Manajemen Keamanan Informasi." },
  { no: 9, domain: "Kebijakan", aspek: "Kebijakan Internal SPBE", indikator: "Kebijakan Internal Audit TIK", penjelasan: "Tingkat kematangan kebijakan internal terkait Audit TIK." },
  { no: 10, domain: "Kebijakan", aspek: "Kebijakan Internal SPBE", indikator: "Kebijakan Internal Tim Koordinasi SPBE", penjelasan: "Tingkat kematangan kebijakan internal terkait Tim Koordinasi SPBE." },
  { no: 11, domain: "Tata Kelola", aspek: "Perencanaan Strategis SPBE", indikator: "Arsitektur SPBE Instansi Pusat/Pemerintah Daerah", penjelasan: "Tingkat kematangan penerapan Arsitektur SPBE." },
  { no: 12, domain: "Tata Kelola", aspek: "Perencanaan Strategis SPBE", indikator: "Peta Rencana SPBE Instansi Pusat/Pemerintah Daerah", penjelasan: "Tingkat kematangan penerapan Peta Rencana SPBE." },
  { no: 13, domain: "Tata Kelola", aspek: "Perencanaan Strategis SPBE", indikator: "Rencana dan Anggaran SPBE", penjelasan: "Tingkat kematangan penerapan Rencana dan Anggaran SPBE." },
  { no: 14, domain: "Tata Kelola", aspek: "Perencanaan Strategis SPBE", indikator: "Inovasi Proses Bisnis SPBE", penjelasan: "Tingkat kematangan Inovasi Proses Bisnis SPBE." },
  { no: 15, domain: "Tata Kelola", aspek: "Teknologi Informasi dan Komunikasi", indikator: "Pembangunan Aplikasi SPBE", penjelasan: "Tingkat kematangan Pembangunan Aplikasi SPBE." },
  { no: 16, domain: "Tata Kelola", aspek: "Teknologi Informasi dan Komunikasi", indikator: "Layanan Pusat Data", penjelasan: "Tingkat kematangan penerapan Layanan Pusat Data." },
  { no: 17, domain: "Tata Kelola", aspek: "Teknologi Informasi dan Komunikasi", indikator: "Layanan Jaringan Intra", penjelasan: "Tingkat kematangan penerapan Layanan Jaringan Intra." },
  { no: 18, domain: "Tata Kelola", aspek: "Teknologi Informasi dan Komunikasi", indikator: "Penggunaan Sistem Penghubung Layanan", penjelasan: "Tingkat kematangan Penggunaan Sistem Penghubung Layanan." },
  { no: 19, domain: "Tata Kelola", aspek: "Penyelenggara SPBE", indikator: "Penyelenggaraan Tim Koordinasi SPBE", penjelasan: "Tingkat kematangan Penyelenggaraan Tim Koordinasi SPBE." },
  { no: 20, domain: "Tata Kelola", aspek: "Penyelenggara SPBE", indikator: "Kolaborasi Penerapan SPBE", penjelasan: "Tingkat kematangan Kolaborasi Penerapan SPBE." },
  { no: 21, domain: "Manajemen", aspek: "Penerapan Manajemen SPBE", indikator: "Penerapan Manajemen Risiko SPBE", penjelasan: "Tingkat kematangan Penerapan Manajemen Risiko SPBE." },
  { no: 22, domain: "Manajemen", aspek: "Penerapan Manajemen SPBE", indikator: "Penerapan Manajemen Keamanan Informasi SPBE", penjelasan: "Tingkat kematangan Penerapan Manajemen Keamanan Informasi SPBE." },
  { no: 23, domain: "Manajemen", aspek: "Penerapan Manajemen SPBE", indikator: "Penerapan Manajemen Data SPBE", penjelasan: "Tingkat kematangan Penerapan Manajemen Data SPBE." },
  { no: 24, domain: "Manajemen", aspek: "Penerapan Manajemen SPBE", indikator: "Penerapan Manajemen Aset TIK SPBE", penjelasan: "Tingkat kematangan Penerapan Manajemen Aset TIK SPBE." },
  { no: 25, domain: "Manajemen", aspek: "Penerapan Manajemen SPBE", indikator: "Penerapan Manajemen SDM SPBE", penjelasan: "Tingkat kematangan Penerapan Manajemen SDM SPBE." },
  { no: 26, domain: "Manajemen", aspek: "Penerapan Manajemen SPBE", indikator: "Penerapan Manajemen Pengetahuan SPBE", penjelasan: "Tingkat kematangan Penerapan Manajemen Pengetahuan SPBE." },
  { no: 27, domain: "Manajemen", aspek: "Penerapan Manajemen SPBE", indikator: "Penerapan Manajemen Perubahan SPBE", penjelasan: "Tingkat kematangan Penerapan Manajemen Perubahan SPBE." },
  { no: 28, domain: "Manajemen", aspek: "Penerapan Manajemen SPBE", indikator: "Penerapan Manajemen Layanan SPBE", penjelasan: "Tingkat kematangan Penerapan Manajemen Layanan SPBE." },
  { no: 29, domain: "Manajemen", aspek: "Pelaksanaan Audit TIK", indikator: "Pelaksanaan Audit Infrastruktur SPBE", penjelasan: "Tingkat kematangan Pelaksanaan Audit Infrastruktur SPBE." },
  { no: 30, domain: "Manajemen", aspek: "Pelaksanaan Audit TIK", indikator: "Pelaksanaan Audit Aplikasi SPBE", penjelasan: "Tingkat kematangan Pelaksanaan Audit Aplikasi SPBE." },
  { no: 31, domain: "Manajemen", aspek: "Pelaksanaan Audit TIK", indikator: "Pelaksanaan Audit Keamanan SPBE", penjelasan: "Tingkat kematangan Pelaksanaan Audit Keamanan SPBE." },
  { no: 32, domain: "Layanan", aspek: "Layanan Administrasi Pemerintahan", indikator: "Layanan Perencanaan Berbasis Elektronik", penjelasan: "Tingkat kematangan Layanan Perencanaan Berbasis Elektronik." },
  { no: 33, domain: "Layanan", aspek: "Layanan Administrasi Pemerintahan", indikator: "Layanan Penganggaran Berbasis Elektronik", penjelasan: "Tingkat kematangan Layanan Penganggaran Berbasis Elektronik." },
  { no: 34, domain: "Layanan", aspek: "Layanan Administrasi Pemerintahan", indikator: "Layanan Keuangan Berbasis Elektronik", penjelasan: "Tingkat kematangan Layanan Keuangan Berbasis Elektronik." },
  { no: 35, domain: "Layanan", aspek: "Layanan Administrasi Pemerintahan", indikator: "Layanan Pengadaan Barang dan Jasa Berbasis Elektronik", penjelasan: "Tingkat kematangan Layanan Pengadaan Barang dan Jasa Berbasis Elektronik." },
  { no: 36, domain: "Layanan", aspek: "Layanan Administrasi Pemerintahan", indikator: "Layanan Kepegawaian Berbasis Elektronik", penjelasan: "Tingkat kematangan Layanan Kepegawaian Berbasis Elektronik." },
  { no: 37, domain: "Layanan", aspek: "Layanan Administrasi Pemerintahan", indikator: "Layanan Kearsipan Berbasis Elektronik", penjelasan: "Tingkat kematangan Layanan Kearsipan Berbasis Elektronik." },
  { no: 38, domain: "Layanan", aspek: "Layanan Administrasi Pemerintahan", indikator: "Layanan Pengelolaan Barang Milik Negara/Daerah Berbasis Elektronik", penjelasan: "Tingkat kematangan Layanan Pengelolaan BMN/BMD Berbasis Elektronik." },
  { no: 39, domain: "Layanan", aspek: "Layanan Administrasi Pemerintahan", indikator: "Layanan Pengawasan Internal Berbasis Elektronik", penjelasan: "Tingkat kematangan Layanan Pengawasan Internal Berbasis Elektronik." },
  { no: 40, domain: "Layanan", aspek: "Layanan Administrasi Pemerintahan", indikator: "Layanan Akuntabilitas Kinerja Berbasis Elektronik", penjelasan: "Tingkat kematangan Layanan Akuntabilitas Kinerja Berbasis Elektronik." },
  { no: 41, domain: "Layanan", aspek: "Layanan Administrasi Pemerintahan", indikator: "Layanan Kinerja Pegawai Berbasis Elektronik", penjelasan: "Tingkat kematangan Layanan Kinerja Pegawai Berbasis Elektronik." },
  { no: 42, domain: "Layanan", aspek: "Layanan Publik", indikator: "Layanan Pengaduan Pelayanan Publik Berbasis Elektronik", penjelasan: "Tingkat kematangan Layanan Pengaduan Pelayanan Publik Berbasis Elektronik." },
  { no: 43, domain: "Layanan", aspek: "Layanan Publik", indikator: "Layanan Data Terbuka Berbasis Elektronik", penjelasan: "Tingkat kematangan Layanan Data Terbuka Berbasis Elektronik." },
  { no: 44, domain: "Layanan", aspek: "Layanan Publik", indikator: "Layanan JDIH Berbasis Elektronik", penjelasan: "Tingkat kematangan Layanan Jaringan Dokumentasi dan Informasi Hukum Berbasis Elektronik." },
  { no: 45, domain: "Layanan", aspek: "Layanan Publik", indikator: "Layanan Publik Sektoral 1", penjelasan: "Tingkat kematangan Layanan Publik Sektoral 1." },
  { no: 46, domain: "Layanan", aspek: "Layanan Publik", indikator: "Layanan Publik Sektoral 2", penjelasan: "Tingkat kematangan Layanan Publik Sektoral 2." },
  { no: 47, domain: "Layanan", aspek: "Layanan Publik", indikator: "Layanan Publik Sektoral 3", penjelasan: "Tingkat kematangan Layanan Publik Sektoral 3." }
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
        setHighlightedDomain(domain);
        setTimeout(() => setHighlightedDomain(null), 1500);
      }
    };
    window.addEventListener("spbe-domain-select", handleDomainSelect);
    return () => window.removeEventListener("spbe-domain-select", handleDomainSelect);
  }, []);

  const filtered = useMemo(() => {
    return data.filter((d) => {
      const matchDomain = activeDomain === "Semua" || d.domain === activeDomain;
      const matchSearch = searchQuery === "" || JSON.stringify(d).toLowerCase().includes(searchQuery.toLowerCase());
      return matchDomain && matchSearch;
    });
  }, [activeDomain, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / entriesPerPage));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const startIdx = (safeCurrentPage - 1) * entriesPerPage;
  const paginatedData = filtered.slice(startIdx, startIdx + entriesPerPage);

  const handleDomainChange = (domain) => { setActiveDomain(domain); setCurrentPage(1); };
  const handleEntriesChange = (val) => { setEntriesPerPage(Number(val)); setCurrentPage(1); };
  const handleSearchChange = (val) => { setSearchQuery(val); setCurrentPage(1); };

  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) { pageNumbers.push(i); }

  return (
    <section id="indikator" className="py-12 bg-gradient-to-b from-background to-secondary/30 scroll-mt-20">
      <div className="container">
        <div className="text-center mb-8 animate-fade-in-up">
          <span className="pill bg-secondary text-primary inline-block mb-2">Penilaian</span>
          <h2 className="text-3xl lg:text-4xl font-extrabold text-gradient">Indikator SPBE</h2>
          <p className="text-muted-foreground mt-2 max-w-2xl mx-auto text-sm">Telusuri indikator penilaian SPBE berdasarkan domain dan aspek penilaian.</p>
        </div>

        <div className="bg-card rounded-2xl p-5 shadow-soft mb-6 space-y-4">
          {/* Baris 1: Label Filter Domain */}
          <div>
            <button className="pill gradient-primary text-primary-foreground inline-flex items-center gap-2">
              <Filter className="w-4 h-4" /> Filter Domain
            </button>
          </div>

          {/* Baris 2: Domain category pills — horizontal, left aligned */}
          <div className="flex items-center justify-start gap-3 flex-wrap">
            {domains.map((d) => (
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
            <span>Menampilkan {filtered.length === 0 ? 0 : startIdx + 1}–{Math.min(startIdx + entriesPerPage, filtered.length)} dari {filtered.length} entri</span>
            <div className="flex gap-1">
              <button onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={safeCurrentPage <= 1} className="p-2 rounded-lg hover:bg-secondary transition-colors disabled:opacity-40 disabled:cursor-not-allowed"><ChevronLeft className="w-4 h-4" /></button>
              {pageNumbers.map((num) => (
                <button key={num} onClick={() => setCurrentPage(num)} className={`px-3 py-1 rounded-lg transition-all ${safeCurrentPage === num ? "gradient-primary text-primary-foreground shadow-soft" : "hover:bg-secondary"}`}>{num}</button>
              ))}
              <button onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={safeCurrentPage >= totalPages} className="p-2 rounded-lg hover:bg-secondary transition-colors disabled:opacity-40 disabled:cursor-not-allowed"><ChevronRight className="w-4 h-4" /></button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
