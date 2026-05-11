import logo from "@/assets/logo-smartcity.svg";
import { MapPin, Phone, Mail, Clock, Globe, ExternalLink } from "lucide-react";

/* Inline SVG social icons — lucide-react v1.x removed brand icons */
const FacebookIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 1.09.05 1.593.149v3.295a6.5 6.5 0 0 0-.985-.05c-1.394 0-1.928.527-1.928 1.9v2.264h2.737l-.47 3.667h-2.267v8.133c5.024-.803 8.861-5.164 8.861-10.411C22.5 6.357 17.851 1.708 12.159 1.708S1.309 6.357 1.309 12.233c0 5.16 3.712 9.46 8.592 10.359z" />
  </svg>
);

const InstagramIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
  </svg>
);

const TwitterIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const YoutubeIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);

const socialIcons = [FacebookIcon, InstagramIcon, TwitterIcon, YoutubeIcon];

export const Footer = () => {
  return (
    <footer className="bg-gradient-to-b from-background to-secondary/40 pt-16 pb-6 border-t-4 border-primary">
      <div className="container grid md:grid-cols-2 lg:grid-cols-4 gap-10">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <img src={logo} alt="Tangerang Smart City" loading="lazy" width={64} height={64} className="w-16 h-16 object-contain" />
            <div>
              <div className="font-display font-extrabold text-primary text-lg">SPBE</div>
              <div className="text-xs text-muted-foreground">Kab. Tangerang</div>
            </div>
          </div>
          <h4 className="font-bold text-primary">Alamat</h4>
          <p className="text-sm text-muted-foreground flex gap-2">
            <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-primary" />
            Jl. H. Somawinata, Kadu Agung, Kec. Tigaraksa, Kabupaten Tangerang, Banten 15720
          </p>
          <h4 className="font-bold text-primary pt-2">Kontak</h4>
          <p className="text-sm text-muted-foreground flex items-center gap-2"><Phone className="w-4 h-4 text-primary" /> (021) 5990240</p>
          <p className="text-sm text-muted-foreground flex items-center gap-2"><Mail className="w-4 h-4 text-primary" /> diskominfo@tangerangkab.go.id</p>
        </div>

        <div className="space-y-3">
          <h4 className="font-bold text-primary">Jam Operasional</h4>
          <p className="text-sm text-muted-foreground flex items-center gap-2"><Clock className="w-4 h-4 text-primary" /> Senin – Jumat</p>
          <p className="text-sm text-muted-foreground ml-6">07.30 – 16.00 WIB</p>

          <h4 className="font-bold text-primary pt-2">Website Resmi</h4>
          <a href="#" className="text-sm text-primary hover:underline flex items-center gap-2">
            <Globe className="w-4 h-4" /> tangerangkab.go.id
          </a>
        </div>

        <div className="space-y-3">
          <h4 className="font-bold text-primary">Tautan Cepat</h4>
          <ul className="space-y-2 text-sm">
            {["Tentang SPBE", "Domain SPBE", "Implementasi", "Indikator SPBE", "Kebijakan Privasi"].map(l => (
              <li key={l}>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors hover:translate-x-1 inline-block">→ {l}</a>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-4">
          <h4 className="font-bold text-primary">Temukan Kami</h4>
          <div className="flex gap-2">
            {socialIcons.map((Icon, i) => (
              <a key={i} href="#" className="w-10 h-10 rounded-xl gradient-primary text-primary-foreground grid place-items-center hover-lift hover:rotate-6 transition-all">
                <Icon className="w-5 h-5" />
              </a>
            ))}
          </div>

          <h4 className="font-bold text-primary pt-2">Download Aplikasi</h4>
          <div className="space-y-2">
            <a href="#" className="flex items-center gap-2 bg-foreground text-background rounded-xl px-4 py-2.5 hover-lift">
              <span className="text-2xl">▶</span>
              <div>
                <div className="text-[10px] opacity-70">GET IT ON</div>
                <div className="font-bold text-sm">Google Play</div>
              </div>
            </a>
            <a href="#" className="flex items-center gap-2 bg-foreground text-background rounded-xl px-4 py-2.5 hover-lift">
              <span className="text-2xl"></span>
              <div>
                <div className="text-[10px] opacity-70">Download on the</div>
                <div className="font-bold text-sm">App Store</div>
              </div>
            </a>
          </div>
        </div>
      </div>

      <div className="container mt-12 pt-6 border-t border-border text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} SPBE Kabupaten Tangerang. All rights reserved. Powered by <span className="text-primary font-semibold">Diskominfo Tangerang</span>.
      </div>
    </footer>
  );
};
