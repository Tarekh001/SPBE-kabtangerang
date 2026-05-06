import { useEffect, useState } from "react";
import { Menu, X, ChevronDown, Globe, Home, Info, BarChart3, LayoutGrid, Phone } from "lucide-react";

const navItems = [
  { label: "Beranda", target: "beranda", icon: Home },
  {
    label: "Tentang SPBE",
    target: "tentang",
    icon: Info,
    dropdown: [{ label: "Pengertian", target: "tentang" }],
  },
  {
    label: "Implementasi",
    target: "implementasi",
    icon: BarChart3,
    dropdown: [
      { label: "Indeks 2019", target: "implementasi" },
      { label: "Indeks 2020", target: "implementasi" },
      { label: "Indeks 2021", target: "implementasi" },
      { label: "Indeks 2022", target: "implementasi" },
      { label: "Indeks 2023", target: "implementasi" },
      { label: "Indeks 2024", target: "implementasi" },
    ],
  },
  {
    label: "Katalog",
    target: "katalog",
    icon: LayoutGrid,
    dropdown: [
      { label: "Aplikasi", target: "katalog" },
      { label: "Infrastruktur", target: "katalog" },
      { label: "Data", target: "katalog" },
      { label: "Layanan Publik", target: "katalog" },
    ],
  },
  { label: "Kontak", target: "kontak", icon: Phone },
];

const scrollTo = (id) => {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
};

export const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleClick = (target) => {
    scrollTo(target);
    setOpen(false);
    setActive(null);
  };

  return (
    <header className="sticky top-0 z-50 w-full">
      <nav className={`gradient-hero text-primary-foreground transition-all duration-300 ${scrolled ? "shadow-elegant py-0" : "shadow-soft"}`}>
        <div className="container flex items-center justify-between h-16">
          <button onClick={() => handleClick("beranda")} className="group flex items-center gap-2 font-display font-extrabold text-xl tracking-wide">
            <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur grid place-items-center group-hover:rotate-180 transition-transform duration-500">
              <Globe className="w-5 h-5" />
            </div>
            <span>SPBE<span className="text-accent"> Tangerang</span></span>
          </button>

          <ul className="hidden lg:flex items-center gap-1">
            {navItems.map((it) => {
              const Icon = it.icon;
              return (
                <li
                  key={it.label}
                  className="relative"
                  onMouseEnter={() => setActive(it.label)}
                  onMouseLeave={() => setActive(null)}
                >
                  <button
                    onClick={() => handleClick(it.target)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-lg hover:bg-white/15 transition-all text-sm font-medium hover:scale-105"
                  >
                    <Icon className="w-4 h-4" />
                    {it.label}
                    {it.dropdown && (
                      <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${active === it.label ? "rotate-180" : ""}`} />
                    )}
                  </button>
                  {it.dropdown && active === it.label && (
                    <div className="absolute top-full left-0 mt-2 w-56 bg-card text-card-foreground rounded-xl shadow-elegant overflow-hidden animate-scale-in origin-top">
                      {it.dropdown.map((d) => (
                        <button
                          key={d.label}
                          onClick={() => handleClick(d.target)}
                          className="w-full text-left block px-4 py-2.5 text-sm hover:bg-secondary hover:text-primary hover:pl-6 transition-all duration-200"
                        >
                          {d.label}
                        </button>
                      ))}
                    </div>
                  )}
                </li>
              );
            })}
          </ul>

          <button
            className="lg:hidden p-2 rounded-lg hover:bg-white/15 transition-transform active:scale-90"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <X /> : <Menu />}
          </button>
        </div>

        {open && (
          <div className="lg:hidden border-t border-white/15 animate-fade-in">
            <ul className="container py-4 space-y-1">
              {navItems.map((it) => {
                const Icon = it.icon;
                return (
                  <li key={it.label}>
                    <button
                      onClick={() => handleClick(it.target)}
                      className="w-full text-left flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/15 transition-all"
                    >
                      <Icon className="w-4 h-4" /> {it.label}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </nav>
    </header>
  );
};
