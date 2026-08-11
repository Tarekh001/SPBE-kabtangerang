import heroImg from "@/assets/hero-spbe.jpg";
import { Sparkles, ShieldCheck } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

export const Hero = () => {
  return (
    <section className="relative overflow-hidden">
      {/* Decorative blobs - reduced opacity per IDDS clean style */}
      <div className="absolute -top-32 -left-32 w-96 h-96 gradient-primary blob-shape opacity-10 animate-blob" />
      <div className="absolute top-20 right-0 w-80 h-80 bg-accent/10 blob-shape animate-blob" style={{ animationDelay: "2s" }} />

      <div className="relative gradient-hero text-primary-foreground border-b border-white/10">
        <div className="container py-10 lg:py-16 pb-28 grid lg:grid-cols-2 gap-8 items-center">
          <div className="space-y-6 animate-fade-in-up">
            <div className="space-y-4">
              <span className="inline-flex items-center gap-2 px-3 py-1 text-xs font-semibold rounded-full bg-white/15 backdrop-blur text-primary-foreground border border-white/20">
                <Sparkles className="w-3.5 h-3.5 text-accent" />
                Pemerintahan Digital
              </span>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold leading-tight tracking-tight">
                Selamat Datang di <br className="hidden sm:block" />
                <span className="text-accent">Pemerintahan Digital</span><br />
                Kabupaten Tangerang
              </h1>
              <p className="text-base md:text-lg opacity-90 max-w-xl font-medium leading-relaxed">
                Mewujudkan tata kelola pemerintahan yang bersih, efektif, transparan, dan akuntabel melalui transformasi digital terintegrasi.
              </p>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <a 
                href="#indikator"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('indikator')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }}
                className={cn(buttonVariants({ variant: "primary", size: "lg" }), "w-full sm:w-auto shadow-md gap-2 outline-none")}
              >
                Jelajahi Indikator
              </a>
              <a 
                href="#tentang"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('tentang')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }}
                className={cn(buttonVariants({ variant: "secondary", size: "lg" }), "w-full sm:w-auto bg-white/10 hover:bg-white/20 border-white/20 text-white backdrop-blur focus-visible:ring-2 focus-visible:ring-accent outline-none")}
              >
                Pelajari Pemdi
              </a>
            </div>

            <div className="grid grid-cols-3 gap-4 pt-6 max-w-lg border-t border-white/15 mt-6">
              {[
                { v: "3.91", l: "Indeks SPBE" },
                { v: "34", l: "Sinergi Pemdi" },
                { v: "17", l: "Layanan Digital" },
              ].map((s) => (
                <div key={s.l} className="text-center sm:text-left">
                  <div className="text-3xl lg:text-4xl font-extrabold text-accent tracking-tight leading-none">{s.v}</div>
                  <div className="text-[13px] font-medium opacity-90 mt-2">{s.l}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative animate-scale-in">
            <div className="absolute inset-0 bg-accent/30 blob-shape blur-2xl animate-blob" />
            <div className="relative rounded-lg overflow-hidden shadow-md border border-white/20 hover-lift">
              <img src={heroImg} alt="SPBE Kabupaten Tangerang" className="w-full h-auto" width={1280} height={896} />
            </div>
            {/* Floating badge */}
            <div className="absolute -bottom-3 -left-3 bg-white text-card-foreground rounded-lg px-2.5 py-2 shadow-md border border-border flex flex-col gap-0.5 motion-safe:animate-float">
               <div className="flex items-center gap-1.5">
                 <ShieldCheck className="w-3 h-3 text-primary" />
                 <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">Predikat</span>
               </div>
               <div className="font-extrabold text-base text-primary leading-none tracking-tight">Sangat Baik</div>
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
