import { useState } from "react";
import {
  LayoutGrid, Smartphone, Database, Server, FileStack, Users, ShieldCheck, Globe2,
  ExternalLink, Search,
} from "lucide-react";

const menus = [
  {
    key: "Aplikasi",
    icon: Smartphone,
    items: [
      { name: "SiPandu", desc: "Sistem Pelayanan Administrasi Terpadu", icon: LayoutGrid },
      { name: "e-Office", desc: "Tata naskah dinas elektronik", icon: FileStack },
      { name: "SiCantik", desc: "Cerdas Layanan Perizinan Terpadu", icon: ShieldCheck },
      { name: "Tangerang LIVE", desc: "Aplikasi layanan masyarakat", icon: Smartphone },
    ],
  },
  {
    key: "Infrastruktur",
    icon: Server,
    items: [
      { name: "Data Center", desc: "Pusat data terpadu Pemkab", icon: Server },
      { name: "Jaringan Intra", desc: "Jaringan komunikasi antar OPD", icon: Globe2 },
      { name: "Cloud Service", desc: "Layanan komputasi awan", icon: Database },
      { name: "Keamanan SPBE", desc: "SOC & monitoring 24/7", icon: ShieldCheck },
    ],
  },
  {
    key: "Data",
    icon: Database,
    items: [
      { name: "Satu Data", desc: "Portal Satu Data Kabupaten Tangerang", icon: Database },
      { name: "Dashboard Eksekutif", desc: "Visualisasi data pimpinan", icon: LayoutGrid },
      { name: "Open Data", desc: "Data terbuka untuk publik", icon: Globe2 },
      { name: "Big Data Analytic", desc: "Analitik data lintas sektor", icon: FileStack },
    ],
  },
  {
    key: "Layanan Publik",
    icon: Users,
    items: [
      { name: "PPID", desc: "Pejabat Pengelola Informasi & Dokumentasi", icon: FileStack },
      { name: "Lapor!", desc: "Layanan aspirasi & pengaduan online", icon: Users },
      { name: "PTSP Online", desc: "Pelayanan Terpadu Satu Pintu", icon: ShieldCheck },
      { name: "e-Health", desc: "Layanan kesehatan elektronik", icon: Smartphone },
    ],
  },
];

export const Katalog = () => {
  const [active, setActive] = useState(menus[0].key);
  const [q, setQ] = useState("");
  const current = menus.find(m => m.key === active);
  const filtered = current.items.filter(i =>
    q === "" || (i.name + i.desc).toLowerCase().includes(q.toLowerCase())
  );

  return (
    <section id="katalog" className="py-20 bg-gradient-to-b from-secondary/30 to-background scroll-mt-20">
      <div className="container">
        <div className="text-center mb-10 animate-fade-in-up">
          <span className="pill bg-secondary text-primary inline-flex items-center gap-2 mb-3">
            <LayoutGrid className="w-4 h-4" /> Dynamic Menu
          </span>
          <h2 className="text-4xl lg:text-5xl font-extrabold text-gradient">Katalog SPBE</h2>
          <p className="text-muted-foreground mt-3">Jelajahi katalog aplikasi, infrastruktur, dan layanan SPBE Kabupaten Tangerang</p>
        </div>

        {/* Dynamic menu tabs */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {menus.map((m) => {
            const Icon = m.icon;
            const isActive = active === m.key;
            return (
              <button
                key={m.key}
                onClick={() => setActive(m.key)}
                className={`pill inline-flex items-center gap-2 transition-all duration-300 hover:scale-105 ${
                  isActive
                    ? "gradient-primary text-primary-foreground shadow-elegant scale-105"
                    : "bg-card text-foreground border border-border hover:border-primary hover:text-primary"
                }`}
              >
                <Icon className="w-4 h-4" /> {m.key}
              </button>
            );
          })}
        </div>

        {/* Search */}
        <div className="max-w-md mx-auto mb-8 relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={`Cari di ${active}...`}
            className="w-full pl-10 pr-4 py-3 rounded-xl bg-card border border-border shadow-soft text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        {/* Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5" key={active}>
          {filtered.map((item, i) => {
            const Icon = item.icon;
            return (
              <a
                key={item.name}
                href="#"
                className="group bg-card rounded-2xl p-6 shadow-soft hover:shadow-elegant border border-border hover:border-primary/40 hover-lift relative overflow-hidden animate-fade-in-up"
                style={{ animationDelay: `${i * 0.08}s` }}
              >
                <div className="absolute -top-10 -right-10 w-32 h-32 gradient-primary blob-shape opacity-0 group-hover:opacity-20 transition-opacity duration-500" />
                <div className="w-12 h-12 rounded-xl gradient-primary text-primary-foreground grid place-items-center mb-4 group-hover:rotate-12 group-hover:scale-110 transition-all duration-300">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-foreground group-hover:text-primary transition-colors">{item.name}</h3>
                <p className="text-sm text-muted-foreground mt-1">{item.desc}</p>
                <div className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-primary opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all">
                  Buka <ExternalLink className="w-3 h-3" />
                </div>
              </a>
            );
          })}
          {filtered.length === 0 && (
            <div className="col-span-full text-center py-10 text-muted-foreground">Tidak ada item.</div>
          )}
        </div>
      </div>
    </section>
  );
};
// This file has been intentionally emptied — Katalog feature removed.
