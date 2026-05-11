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
