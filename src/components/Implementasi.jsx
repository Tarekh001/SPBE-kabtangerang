import { useState } from "react";
import { Calendar, Award } from "lucide-react";
import gedungImg from "@/assets/image.png";
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
    <section id="implementasi" className="py-[60px] px-[20px] scroll-mt-20">
      <div className="container">
        <div className="text-center mb-8 animate-fade-in-up">
          <span className="pill bg-secondary text-primary inline-flex items-center gap-2 mb-2">
            <Award className="w-4 h-4" /> Implementasi
          </span>
          <h2 className="text-3xl lg:text-4xl font-extrabold text-gradient">Implementasi SPBE</h2>
          <p className="text-muted-foreground mt-2 text-sm">Dokumentasi implementasi SPBE Kabupaten Tangerang per tahun</p>
        </div>

        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center gap-3 bg-card rounded-xl px-5 py-2.5 shadow-soft border border-border">
            <Calendar className="w-4 h-4 text-primary" />
            <label htmlFor="year-select" className="text-sm font-semibold text-foreground">Tahun:</label>
            <select id="year-select" value={year} onChange={(e) => setYear(e.target.value)} className="appearance-none bg-secondary text-foreground font-bold text-sm rounded-lg px-3 py-1.5 border border-border focus:outline-none focus:ring-2 focus:ring-ring cursor-pointer transition-all hover:border-primary spbe-select">
              {years.map((y) => (<option key={y} value={y}>{y}</option>))}
            </select>
          </div>
        </div>

        <div className="max-w-[1000px] mx-auto relative animate-fade-in-up" key={year}>
          <div className="group bg-card rounded-2xl shadow-soft border border-border overflow-hidden hover:shadow-elegant hover:border-primary/40 transition-all duration-300">
            <div className="relative bg-secondary/50 overflow-hidden">
              <img src={card.image} alt={card.title} className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <span className="absolute top-3 left-3 pill text-xs gradient-primary text-primary-foreground shadow-lg">{year}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
