<<<<<<< HEAD
import { useState } from "react";
import { Calendar, Award } from "lucide-react";
import gedungImg from "@/assets/gedung.jpg";
import baruImg from "@/assets/baru.jpg";

const initialData = {
  "2019": { title: "Kebijakan Internal SPBE", description: "Penetapan regulasi internal terkait tata kelola SPBE di lingkungan Pemkab Tangerang. Pembentukan tim koordinasi dan penyusunan rencana induk SPBE.", image: gedungImg },
  "2020": { title: "Pusat Data & Jaringan", description: "Pembangunan data center dan jaringan intra pemerintah daerah untuk konektivitas antar OPD serta implementasi sistem e-Office.", image: baruImg },
  "2021": { title: "Integrasi Sistem Informasi", description: "Menghubungkan berbagai aplikasi OPD dalam satu ekosistem terpadu. Penerapan kerangka manajemen risiko keamanan informasi.", image: gedungImg },
  "2022": { title: "Cloud & Keamanan Siber", description: "Migrasi layanan ke infrastruktur cloud untuk skalabilitas. Penguatan Security Operation Center dan monitoring keamanan 24/7.", image: baruImg },
  "2023": { title: "Satu Data Indonesia", description: "Implementasi kebijakan satu data di tingkat kabupaten. Penyesuaian arsitektur SPBE daerah dengan standar nasional.", image: gedungImg },
  "2024": { title: "Transformasi Digital", description: "Pemanfaatan AI & Big Data Analytics untuk analitik data lintas sektor. Perluasan layanan SPBE hingga tingkat kelurahan dan desa.", image: baruImg },
};

export const Implementasi = () => {
  const years = Object.keys(initialData);
  const [year, setYear] = useState("2024");

  const card = initialData[year];

  return (
    <section id="implementasi" className="py-12 scroll-mt-20">
      <div className="container">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in-up">
          <span className="pill bg-secondary text-primary inline-flex items-center gap-2 mb-2">
            <Award className="w-4 h-4" /> Implementasi
          </span>
          <h2 className="text-3xl lg:text-4xl font-extrabold text-gradient">
            Implementasi SPBE
          </h2>
          <p className="text-muted-foreground mt-2 text-sm">
            Dokumentasi implementasi SPBE Kabupaten Tangerang per tahun
          </p>
        </div>

        {/* Year Dropdown */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center gap-3 bg-card rounded-xl px-5 py-2.5 shadow-soft border border-border">
            <Calendar className="w-4 h-4 text-primary" />
            <label htmlFor="year-select" className="text-sm font-semibold text-foreground">
              Tahun:
            </label>
            <select
              id="year-select"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="appearance-none bg-secondary text-foreground font-bold text-sm rounded-lg px-3 py-1.5 border border-border focus:outline-none focus:ring-2 focus:ring-ring cursor-pointer transition-all hover:border-primary spbe-select"
            >
              {years.map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Single Card — Compact sizing */}
        <div className="max-w-xl mx-auto animate-fade-in-up" key={year}>
          <div className="group bg-card rounded-2xl shadow-soft border border-border overflow-hidden hover:shadow-elegant hover:border-primary/40 transition-all duration-300">
            {/* Image Area — Reduced height */}
            <div className="relative h-44 sm:h-52 bg-secondary/50 overflow-hidden">
              <img
                src={card.image}
                alt={card.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <span className="absolute top-3 left-3 pill text-xs gradient-primary text-primary-foreground shadow-lg">
                {year}
              </span>
            </div>

            {/* Content — Compact padding */}
            <div className="p-4 space-y-2">
              <h3 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors">
                {card.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {card.description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
=======
import { useState } from "react";
import { Calendar, TrendingUp, Award } from "lucide-react";

const dataByYear = {
  "2019": [
    { label: "Kebijakan", value: 2.4 },
    { label: "Tata Kelola", value: 2.2 },
    { label: "Manajemen", value: 2.1 },
    { label: "Layanan", value: 2.6 },
  ],
  "2020": [
    { label: "Kebijakan", value: 2.8 },
    { label: "Tata Kelola", value: 2.6 },
    { label: "Manajemen", value: 2.5 },
    { label: "Layanan", value: 2.9 },
  ],
  "2021": [
    { label: "Kebijakan", value: 3.1 },
    { label: "Tata Kelola", value: 2.9 },
    { label: "Manajemen", value: 2.8 },
    { label: "Layanan", value: 3.3 },
  ],
  "2022": [
    { label: "Kebijakan", value: 3.4 },
    { label: "Tata Kelola", value: 3.2 },
    { label: "Manajemen", value: 3.0 },
    { label: "Layanan", value: 3.6 },
  ],
  "2023": [
    { label: "Kebijakan", value: 3.6 },
    { label: "Tata Kelola", value: 3.4 },
    { label: "Manajemen", value: 3.2 },
    { label: "Layanan", value: 3.8 },
  ],
  "2024": [
    { label: "Kebijakan", value: 3.9 },
    { label: "Tata Kelola", value: 3.7 },
    { label: "Manajemen", value: 3.6 },
    { label: "Layanan", value: 4.1 },
  ],
};

const predikat = (avg) =>
  avg >= 3.5 ? "Sangat Baik" : avg >= 2.6 ? "Baik" : avg >= 1.8 ? "Cukup" : "Kurang";

export const Implementasi = () => {
  const years = Object.keys(dataByYear);
  const [year, setYear] = useState("2024");
  const data = dataByYear[year];
  const max = 5;
  const avgNum = data.reduce((s, d) => s + d.value, 0) / data.length;
  const avg = avgNum.toFixed(2);

  return (
    <section id="implementasi" className="py-20 scroll-mt-20">
      <div className="container">
        <div className="text-center mb-10 animate-fade-in-up">
          <span className="pill bg-secondary text-primary inline-flex items-center gap-2 mb-3">
            <Award className="w-4 h-4" /> Statistik
          </span>
          <h2 className="text-4xl lg:text-5xl font-extrabold text-gradient">Implementasi SPBE</h2>
          <p className="text-muted-foreground mt-3">Indeks pencapaian SPBE Kabupaten Tangerang dari tahun 2019 sampai 2024</p>
        </div>

        {/* Year tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {years.map((y) => (
            <button
              key={y}
              onClick={() => setYear(y)}
              className={`pill inline-flex items-center gap-2 transition-all duration-300 hover:scale-105 ${
                year === y
                  ? "gradient-primary text-primary-foreground shadow-elegant scale-105"
                  : "bg-card text-foreground border border-border hover:border-primary hover:text-primary"
              }`}
            >
              <Calendar className="w-4 h-4" /> {y}
            </button>
          ))}
        </div>

        <div className="bg-card rounded-3xl p-8 shadow-elegant relative overflow-hidden hover-lift transition-all">
          <div className="absolute top-0 right-0 w-64 h-64 gradient-primary blob-shape opacity-10 animate-blob" />

          <div className="flex items-center justify-between mb-8 relative flex-wrap gap-4">
            <div className="animate-fade-in-up" key={year}>
              <div className="text-sm text-muted-foreground">Rata-rata Indeks {year}</div>
              <div className="text-5xl font-extrabold text-gradient">{avg}</div>
            </div>
            <div className="flex items-center gap-2 pill bg-emerald-100 text-emerald-700 animate-pulse-glow">
              <TrendingUp className="w-4 h-4" /> Predikat: {predikat(avgNum)}
            </div>
          </div>

          {/* Bar chart */}
          <div className="space-y-5 relative" key={`bars-${year}`}>
            {data.map((d, i) => (
              <div key={d.label} className="space-y-2 animate-fade-in" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="flex justify-between text-sm">
                  <span className="font-semibold">{d.label}</span>
                  <span className="font-bold text-primary">{d.value.toFixed(2)} / {max}</span>
                </div>
                <div className="h-4 bg-secondary rounded-full overflow-hidden relative group cursor-pointer">
                  <div
                    className="h-full gradient-primary rounded-full transition-all duration-1000 ease-out relative overflow-hidden"
                    style={{ width: `${(d.value / max) * 100}%` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer" style={{ backgroundSize: "200% 100%" }} />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Mini cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-10">
            {data.map((d, i) => (
              <div
                key={d.label}
                className="gradient-hero text-primary-foreground rounded-2xl p-5 hover-lift cursor-pointer hover:rotate-1 transition-all duration-300 animate-fade-in-up"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className="text-xs opacity-80">{d.label}</div>
                <div className="text-3xl font-extrabold mt-1">{d.value.toFixed(1)}</div>
                <div className="text-xs text-accent mt-2">▲ Indeks {year}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
>>>>>>> c5aac93 (perubahan)
