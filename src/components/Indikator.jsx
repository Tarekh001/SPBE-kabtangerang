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
