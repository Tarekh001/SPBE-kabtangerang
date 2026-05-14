import heroImg from "@/assets/hero-spbe.jpg";
import { Sparkles, ShieldCheck } from "lucide-react";

export const Hero = () => {
  return (
    <section className="relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute -top-32 -left-32 w-96 h-96 gradient-primary blob-shape opacity-30 animate-blob" />
      <div className="absolute top-20 right-0 w-80 h-80 bg-accent/20 blob-shape animate-blob" style={{ animationDelay: "2s" }} />

      <div className="relative gradient-hero text-primary-foreground shadow-elegant">
        <div className="container py-10 lg:py-16 pb-28 grid lg:grid-cols-2 gap-8 items-center">
          <div className="space-y-4 animate-fade-in-up">
            <span className="inline-flex items-center gap-2 pill bg-white/15 backdrop-blur text-primary-foreground border border-white/20">
              <Sparkles className="w-4 h-4 text-accent" />
              Sistem Pemerintahan Berbasis Elektronik
            </span>
            <h1 className="text-3xl lg:text-5xl font-extrabold leading-tight">
              Selamat Datang di <br />
              <span className="text-accent">Kabupaten Tangerang</span>
              <br />
              <span className="text-xl lg:text-2xl font-semibold opacity-90">SPBE Portal Resmi</span>
            </h1>
            <p className="text-base opacity-90 max-w-xl">
              Mewujudkan tata kelola pemerintahan yang bersih, efektif, transparan, dan akuntabel melalui transformasi digital.
            </p>

            <div className="grid grid-cols-3 gap-4 pt-4 max-w-lg">
              {[
                { v: "3.85", l: "Indeks SPBE" },
                { v: "47", l: "OPD Terintegrasi" },
                { v: "100+", l: "Layanan Digital" },
              ].map((s) => (
                <div key={s.l} className="text-center">
                  <div className="text-2xl lg:text-3xl font-extrabold text-accent">{s.v}</div>
                  <div className="text-xs opacity-80 mt-1">{s.l}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative animate-scale-in">
            <div className="absolute inset-0 bg-accent/30 blob-shape blur-2xl animate-blob" />
            <div className="relative rounded-2xl overflow-hidden shadow-elegant border-4 border-white/30 hover-lift">
              <img src={heroImg} alt="SPBE Kabupaten Tangerang" className="w-full h-auto" width={1280} height={896} />
            </div>
            {/* Floating badge */}
            <div className="absolute -bottom-3 -left-3 bg-card text-card-foreground rounded-xl p-2.5 shadow-elegant flex items-center gap-2 animate-float">
              <div className="w-9 h-9 rounded-lg gradient-primary grid place-items-center text-primary-foreground">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <div className="text-[10px] text-muted-foreground">Predikat</div>
                <div className="font-bold text-sm text-primary">Sangat Baik</div>
              </div>
            </div>
          </div>
        </div>

        {/* Wave bottom */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">
          <svg viewBox="0 0 1440 320" className="w-full h-[100px]" preserveAspectRatio="none">
            <path
              fill="var(--wave-fill, #ffffff)"
              d="M0,224L60,208C120,192,240,160,360,160C480,160,600,192,720,197.3C840,203,960,181,1080,186.7C1200,192,1320,224,1380,240L1440,256L1440,320L0,320Z"
            />
          </svg>
        </div>
      </div>
    </section>
  );
};
