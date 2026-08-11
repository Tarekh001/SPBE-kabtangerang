import logo from "@/assets/logo_SPBE.png";
import logoSmartcity from "@/assets/logo-smartcity.svg";
import googlePlayBadge from "@/assets/google-play-badge.png";
import appStoreBadge from "@/assets/app-store-badge.png";
import { MapPin, Phone, Mail, Clock, Globe } from "lucide-react";

/* Inline SVG social icons — lucide-react v1.x removed brand icons */
const TikTokIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 0 0-.79-.05A6.34 6.34 0 0 0 3.15 15a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.77a8.16 8.16 0 0 0 4.76 1.52v-3.4a4.85 4.85 0 0 1-1-.2z" />
  </svg>
);

const InstagramIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
  </svg>
);

const YoutubeIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);

const socialLinks = [
  { Icon: TikTokIcon, label: "TikTok", href: "https://www.tiktok.com/@pemkabtangerang" },
  { Icon: InstagramIcon, label: "Instagram", href: "https://instagram.com/pemkabtangerang" },
  { Icon: YoutubeIcon, label: "YouTube", href: "https://youtube.com/@pemkabtangerang" },
];

export const Footer = () => {
  return (
    <footer className="bg-gradient-to-b from-background to-secondary/40 pt-12 pb-16 border-t-4 border-primary">
      <div className="container px-4 sm:px-6 lg:px-8">
        
        {/* ── Top Bar: Logo & Social ── */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pb-8 border-b border-border">
          {/* Brand Logo */}
          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            <div className="flex items-center gap-4">
              <div className="relative w-14 h-14 shrink-0">
                <img 
                  src={logo} 
                  alt="Logo SPBE Kabupaten Tangerang" 
                  loading="lazy" 
                  className="w-full h-full object-contain" 
                  style={{ filter: "url(#color-primary-filter)" }}
                />
                <svg width="0" height="0" className="absolute" aria-hidden="true">
                  <filter id="color-primary-filter">
                    <feFlood floodColor="var(--color-primary)" result="flood" />
                    <feComposite in="flood" in2="SourceAlpha" operator="in" />
                  </filter>
                </svg>
              </div>
            </div>

            {/* Separator */}
            <div className="w-px h-10 bg-border hidden sm:block" aria-hidden="true"></div>

            {/* Logo SmartCity */}
            <a 
              href="https://dev.tangerangkab.my.id/smartcity-landing/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="shrink-0 transition-transform hover:scale-105"
              aria-label="Portal Tangerang Smart City"
            >
              <img 
                src={logoSmartcity} 
                alt="Tangerang Smart City" 
                loading="lazy" 
                className="h-10 sm:h-11 w-auto object-contain" 
              />
            </a>
          </div>

          {/* Social Icons */}
          <div className="flex items-center gap-3">
            {socialLinks.map(({ Icon, label, href }) => (
              <a 
                key={label} 
                href={href} 
                target="_blank" 
                rel="noopener noreferrer" 
                aria-label={label} 
                title={label}
                className="w-10 h-10 rounded-full bg-secondary/80 text-primary flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all duration-300 hover:-translate-y-1 focus-visible:ring-2 focus-visible:ring-accent outline-none"
              >
                <Icon className="w-5 h-5" aria-hidden="true" />
              </a>
            ))}
          </div>
        </div>

        {/* ── Main Content: 2 Columns ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16 pt-10">
          
          {/* Column 1: Kontak Kami */}
          <div className="space-y-4">
            <h3 className="font-bold text-foreground text-base">Kontak Kami</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-primary" aria-hidden="true" />
                <span className="leading-relaxed">Jl. H. Somawinata, Kadu Agung, Kec. Tigaraksa,<br/>Kabupaten Tangerang, Banten 15720</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-muted-foreground">
                <Phone className="w-4 h-4 shrink-0 text-primary" aria-hidden="true" /> 
                (021) 5990240
              </li>
              <li className="flex items-center gap-3 text-sm text-muted-foreground">
                <Mail className="w-4 h-4 shrink-0 text-primary" aria-hidden="true" /> 
                helpdesk@tangerangkab.go.id
              </li>
              <li className="flex items-center gap-3 text-sm text-muted-foreground">
                <Clock className="w-4 h-4 shrink-0 text-primary" aria-hidden="true" /> 
                Senin - Jumat, 07.30 - 16.00 WIB
              </li>
            </ul>
          </div>

          {/* Column 3: Layanan & App */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h3 className="font-bold text-foreground text-base">Layanan Eksternal</h3>
              <a 
                href="https://tangerangkab.go.id" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors group"
              >
                <Globe className="w-4 h-4 text-primary shrink-0" aria-hidden="true" /> 
                <span className="group-hover:underline">Website Resmi Pemkab Tangerang</span>
              </a>
            </div>

            <div className="space-y-4">
              <h3 className="font-bold text-foreground text-base">Unduh Aplikasi</h3>
              <div className="flex flex-col gap-3">
                <a
                  href="https://play.google.com/store/apps/details?id=go.id.tangerangkab.gemilang"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg bg-white border border-border overflow-hidden transition-all hover:scale-105 hover:shadow-md inline-block w-[140px]"
                  aria-label="Unduh di Google Play"
                >
                  <img
                    src={googlePlayBadge}
                    alt="GET IT ON Google Play"
                    className="w-full h-auto block"
                    loading="lazy"
                  />
                </a>
                <a
                  href="https://apps.apple.com/id/app/tangerang-gemilang/id1642259427"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg bg-white border border-border overflow-hidden transition-all hover:scale-105 hover:shadow-md inline-block w-[140px]"
                  aria-label="Unduh di App Store"
                >
                  <img
                    src={appStoreBadge}
                    alt="Download on the App Store"
                    className="w-full h-auto block"
                    loading="lazy"
                  />
                </a>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </footer>
  );
};
