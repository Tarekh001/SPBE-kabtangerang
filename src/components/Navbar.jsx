import { useEffect, useState, useRef, useMemo } from "react";
import { Menu, X, ChevronDown, Globe, Info, BarChart3, Layers, Sun, Moon, Search, Mail } from "lucide-react";

/* ── Searchable content data for global search ── */
const searchableItems = [
  { label: "Tim Koordinasi SPBE", section: "indikator", domain: "Kebijakan" },
  { label: "Rencana Induk SPBE", section: "indikator", domain: "Kebijakan" },
  { label: "Arsitektur SPBE", section: "indikator", domain: "Tata Kelola" },
  { label: "Peta Rencana SPBE", section: "indikator", domain: "Tata Kelola" },
  { label: "Jaringan Intra Pemerintah", section: "indikator", domain: "Tata Kelola" },
  { label: "Penerapan Manajemen Risiko", section: "indikator", domain: "Manajemen" },
  { label: "Audit Keamanan SPBE", section: "indikator", domain: "Manajemen" },
  { label: "Satu Data Indonesia", section: "indikator", domain: "Manajemen" },
  { label: "Portal Layanan Terpadu", section: "indikator", domain: "Layanan" },
  { label: "Sistem e-Office", section: "indikator", domain: "Layanan" },
  { label: "Pengaduan Online", section: "indikator", domain: "Layanan" },
  { label: "Regulasi SPBE Daerah", section: "indikator", domain: "Kebijakan" },
  { label: "Peraturan Presiden", section: "tentang" },
  { label: "Peraturan Menteri", section: "tentang" },
  { label: "Pedoman Menteri", section: "tentang" },
  { label: "Peraturan Walikota", section: "tentang" },
  { label: "Keputusan Walikota", section: "tentang" },
  { label: "Tentang SPBE", section: "tentang" },
  { label: "Pengertian SPBE", section: "tentang" },
  { label: "Implementasi SPBE", section: "implementasi" },
  { label: "Kebijakan Internal SPBE", section: "indikator", domain: "Kebijakan" },
  { label: "Peraturan Pemerintah", section: "tentang" },
];

const scrollTo = (id) => {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
};

const navItems = [
  { label: "Tentang SPBE", target: "tentang", icon: Info },
  {
    label: "Domain",
    target: "indikator",
    icon: Layers,
    dropdown: [
      { label: "Kebijakan", target: "indikator", domain: "Kebijakan" },
      { label: "Tata Kelola", target: "indikator", domain: "Tata Kelola" },
      { label: "Manajemen", target: "indikator", domain: "Manajemen" },
      { label: "Layanan", target: "indikator", domain: "Layanan" },
    ],
  },
  { label: "Implementasi", target: "implementasi", icon: BarChart3 },
  { label: "Kontak", target: "contact-form", icon: Mail },
];

export const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [mobileExpanded, setMobileExpanded] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navRef = useRef(null);
  const searchRef = useRef(null);
  const searchInputRef = useRef(null);

  useEffect(() => {
    const stored = localStorage.getItem("spbe-theme");
    const isDark = stored === "dark" || (!stored && window.matchMedia("(prefers-color-scheme: dark)").matches);
    setDarkMode(isDark);
    document.documentElement.classList.toggle("dark", isDark);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) setActiveDropdown(null);
      if (searchRef.current && !searchRef.current.contains(e.target)) setSearchOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    document.documentElement.classList.toggle("dark", newMode);
    localStorage.setItem("spbe-theme", newMode ? "dark" : "light");
  };

  const toggleDropdown = (label) => setActiveDropdown((prev) => (prev === label ? null : label));
  const toggleMobileExpanded = (label) => setMobileExpanded((prev) => (prev === label ? null : label));

  const handleNavClick = (target) => {
    scrollTo(target);
    setMobileOpen(false);
    setActiveDropdown(null);
    setMobileExpanded(null);
  };

  const handleDomainClick = (target, domain) => {
    scrollTo(target);
    setMobileOpen(false);
    setActiveDropdown(null);
    setMobileExpanded(null);
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent("spbe-domain-select", { detail: { domain } }));
    }, 400);
  };

  const handleSearchResultClick = (item) => {
    scrollTo(item.section);
    setSearchOpen(false);
    setSearchQuery("");
    if (item.domain) {
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent("spbe-domain-select", { detail: { domain: item.domain } }));
      }, 400);
    }
  };

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    return searchableItems.filter((item) => item.label.toLowerCase().includes(q)).slice(0, 8);
  }, [searchQuery]);

  return (
    <header className="sticky top-0 z-50 w-full" ref={navRef}>
      <nav className={`gradient-hero text-primary-foreground transition-all duration-300 ${scrolled ? "shadow-elegant py-0" : "shadow-soft"}`}>
        <div className="container flex items-center justify-between h-14 gap-2">
          {/* Logo */}
          <button onClick={() => handleNavClick("beranda")} className="group flex items-center gap-2 font-display font-extrabold text-xl tracking-wide shrink-0">
            <div className="w-8 h-8 rounded-lg bg-white/20 backdrop-blur grid place-items-center group-hover:rotate-180 transition-transform duration-500">
              <Globe className="w-4 h-4" />
            </div>
            <span className="hidden sm:inline">SPBE<span className="text-accent"> Tangerang</span></span>
          </button>

          {/* Theme Toggle */}
          <button onClick={toggleDarkMode} className="w-9 h-9 rounded-lg bg-white/15 backdrop-blur grid place-items-center hover:bg-white/25 transition-all duration-300 shrink-0" aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"} title={darkMode ? "Mode Terang" : "Mode Gelap"}>
            {darkMode ? <Sun className="w-4 h-4 text-accent transition-transform duration-300 hover:rotate-180" /> : <Moon className="w-4 h-4 transition-transform duration-300 hover:-rotate-12" />}
          </button>

          {/* Search Bar */}
          <div className="relative flex-1 max-w-xs hidden md:block" ref={searchRef}>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-white/60 pointer-events-none" />
              <input ref={searchInputRef} type="text" value={searchQuery} onChange={(e) => { setSearchQuery(e.target.value); setSearchOpen(true); }} onFocus={() => setSearchOpen(true)} placeholder="Cari indikator, regulasi..." className="w-full pl-9 pr-4 py-1.5 rounded-lg bg-white/15 backdrop-blur border border-white/20 text-sm text-primary-foreground placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:bg-white/20 transition-all" />
            </div>
            {searchOpen && searchQuery.trim() && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-card text-card-foreground rounded-xl shadow-elegant overflow-hidden animate-scale-in origin-top z-50 max-h-72 overflow-y-auto">
                {searchResults.length > 0 ? (
                  searchResults.map((item, idx) => (
                    <button key={idx} onClick={() => handleSearchResultClick(item)} className="w-full text-left flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-secondary hover:pl-6 transition-all duration-200 border-b border-border/50 last:border-0">
                      <Search className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                      <div className="min-w-0">
                        <div className="font-medium truncate">{item.label}</div>
                        <div className="text-xs text-muted-foreground">{item.domain ? `Domain: ${item.domain}` : `Section: ${item.section}`}</div>
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="px-4 py-6 text-center text-sm text-muted-foreground">Tidak ada hasil untuk "{searchQuery}"</div>
                )}
              </div>
            )}
          </div>

          {/* Desktop Menu */}
          <ul className="hidden lg:flex items-center gap-1">
            {navItems.map((it) => {
              const Icon = it.icon;
              const isOpen = activeDropdown === it.label;
              return (
                <li key={it.label} className="relative">
                  <button onClick={() => { if (it.dropdown) { toggleDropdown(it.label); } else { handleNavClick(it.target); } }} className="flex items-center gap-1.5 px-4 py-2 rounded-lg hover:bg-white/15 transition-all text-sm font-medium">
                    <Icon className="w-4 h-4" />
                    {it.label}
                    {it.dropdown && <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />}
                  </button>
                  {it.dropdown && isOpen && (
                    <div className="absolute top-full left-0 mt-1 w-48 bg-card text-card-foreground rounded-xl shadow-elegant overflow-hidden animate-scale-in origin-top">
                      {it.dropdown.map((d) => (
                        <button key={d.label} onClick={() => handleDomainClick(d.target, d.domain)} className="w-full text-left block px-4 py-2.5 text-sm hover:bg-secondary hover:text-primary hover:pl-6 transition-all duration-200">{d.label}</button>
                      ))}
                    </div>
                  )}
                </li>
              );
            })}
          </ul>

          {/* Mobile toggle */}
          <button className="lg:hidden p-2 rounded-lg hover:bg-white/15 transition-transform active:scale-90" onClick={() => { setMobileOpen(!mobileOpen); setMobileExpanded(null); }} aria-label="Toggle menu">
            {mobileOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="lg:hidden border-t border-white/15 animate-fade-in">
            <div className="container pt-3 pb-1">
              <div className="relative" ref={searchRef}>
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-white/60 pointer-events-none" />
                <input type="text" value={searchQuery} onChange={(e) => { setSearchQuery(e.target.value); setSearchOpen(true); }} onFocus={() => setSearchOpen(true)} placeholder="Cari indikator, regulasi..." className="w-full pl-9 pr-4 py-2 rounded-lg bg-white/15 backdrop-blur border border-white/20 text-sm text-primary-foreground placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all" />
                {searchOpen && searchQuery.trim() && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-card text-card-foreground rounded-xl shadow-elegant overflow-hidden animate-scale-in origin-top z-50 max-h-60 overflow-y-auto">
                    {searchResults.length > 0 ? (
                      searchResults.map((item, idx) => (
                        <button key={idx} onClick={() => handleSearchResultClick(item)} className="w-full text-left flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-secondary transition-all border-b border-border/50 last:border-0">
                          <Search className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                          <span className="truncate">{item.label}</span>
                        </button>
                      ))
                    ) : (
                      <div className="px-4 py-4 text-center text-sm text-muted-foreground">Tidak ada hasil</div>
                    )}
                  </div>
                )}
              </div>
            </div>

            <ul className="container py-3 space-y-1">
              {navItems.map((it) => {
                const Icon = it.icon;
                const isExpanded = mobileExpanded === it.label;
                return (
                  <li key={it.label}>
                    <button onClick={() => { if (it.dropdown) { toggleMobileExpanded(it.label); } else { handleNavClick(it.target); } }} className="w-full text-left flex items-center justify-between px-3 py-2 rounded-lg hover:bg-white/15 transition-all">
                      <span className="flex items-center gap-2 text-sm"><Icon className="w-4 h-4" /> {it.label}</span>
                      {it.dropdown && <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`} />}
                    </button>
                    {it.dropdown && isExpanded && (
                      <ul className="ml-6 mt-1 space-y-1 border-l-2 border-white/20 pl-3 animate-fade-in">
                        {it.dropdown.map((d) => (
                          <li key={d.label}>
                            <button onClick={() => handleDomainClick(d.target, d.domain)} className="w-full text-left px-3 py-1.5 rounded-lg text-sm hover:bg-white/15 transition-all">{d.label}</button>
                          </li>
                        ))}
                      </ul>
                    )}
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
