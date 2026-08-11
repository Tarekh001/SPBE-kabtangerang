import { useEffect, useState, useRef, useMemo } from "react";
import {
  Menu, X, ChevronDown, ChevronRight, Globe,
  Sun, Moon, Search,
} from "lucide-react";
import { useDynamicMenu } from "@/hooks/useDynamicMenu";
import { useNavigate, useLocation } from "react-router-dom";
import { fetchDomains, fetchAspek, fetchIndikator, fetchRegulasiList, fetchCategoryRegulasi } from "@/utils/helpers";
import { Button } from "@/components/ui/Button";

/* ── Static searchable content data for global search ── */
const staticSearchableItems = [
  { label: "Tentang Pemerintahan Digital", section: "tentang", type: "Informasi" },
  { label: "Pengertian Pemerintahan Digital", section: "tentang", type: "Informasi" },
  { label: "Implementasi Pemerintahan Digital", section: "implementasi", type: "Informasi" },
];

const extractTargetId = (path) => {
  if (!path || path === '#') return null;
  // Strip leading # or #/ prefix to get the element ID
  return path.replace(/^#\/?/, '') || null;
};

const scrollTo = (id) => {
  if (id === "beranda") {
    window.scrollTo({ top: 0, behavior: "smooth" });
    return;
  }
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
};

export const Navbar = () => {
  const { menuItems } = useDynamicMenu();
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [mobileExpanded, setMobileExpanded] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchableItems, setSearchableItems] = useState(staticSearchableItems);
  const navRef = useRef(null);
  const searchRef = useRef(null);
  const searchInputRef = useRef(null);

  useEffect(() => {
    let active = true;
    const loadSearchData = async () => {
      try {
        const [
          domainsResult,
          aspectsResult,
          indicatorsResult,
          categoriesResult,
          regulationsResult
        ] = await Promise.allSettled([
          fetchDomains(),
          fetchAspek(),
          fetchIndikator(),
          fetchCategoryRegulasi(),
          fetchRegulasiList()
        ]);

        if (!active) return;

        const domains = domainsResult.status === 'fulfilled' ? domainsResult.value : [];
        const aspects = aspectsResult.status === 'fulfilled' ? aspectsResult.value : [];
        const indicators = indicatorsResult.status === 'fulfilled' ? indicatorsResult.value : [];
        const categories = categoriesResult.status === 'fulfilled' ? categoriesResult.value : [];
        const regulations = regulationsResult.status === 'fulfilled' ? regulationsResult.value : [];

        const dynamicItems = [];

        // 1. Indikator
        indicators.forEach(ind => {
          const aspek = aspects.find((a) => String(a.id) === String(ind.aspekId));
          const domain = aspek ? domains.find((d) => String(d.id) === String(aspek.domainId)) : null;
          dynamicItems.push({
            label: ind.name,
            section: "indikator",
            domain: domain ? domain.name : null,
            type: "Indikator"
          });
        });

        // 2. Kategori Regulasi
        categories.forEach(cat => {
          dynamicItems.push({
            label: cat.name,
            section: "tentang",
            type: "Kategori Regulasi"
          });
        });

        // 3. Regulasi
        regulations.forEach(reg => {
          dynamicItems.push({
            label: reg.title,
            section: "tentang",
            type: "Regulasi"
          });
        });

        setSearchableItems([...staticSearchableItems, ...dynamicItems]);
      } catch (err) {
        console.error("Gagal memuat data pencarian global:", err);
      }
    };

    loadSearchData();
    return () => {
      active = false;
    };
  }, []);

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
    
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setActiveDropdown(null);
        setSearchOpen(false);
        setMobileOpen(false);
        setMobileExpanded(null);
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    document.documentElement.classList.toggle("dark", newMode);
    localStorage.setItem("spbe-theme", newMode ? "dark" : "light");
  };

  const toggleDropdown = (label) => setActiveDropdown((prev) => (prev === label ? null : label));
  const toggleMobileExpanded = (parentId, childId = null) => {
    if (!childId) {
      setMobileExpanded((prev) => (prev === parentId ? null : parentId));
    } else {
      const fullId = `${parentId}-${childId}`;
      setMobileExpanded((prev) => (prev === fullId ? parentId : fullId));
    }
  };

  const handleNavClick = (target, label = null) => {
    if (target.startsWith('/')) {
      navigate(target);
    } else {
      // Jika user tidak berada di beranda (misal: halaman dinamis), pindah ke Home dulu
      if (location.pathname !== '/') {
        navigate('/');
        // Beri waktu sebentar agar layout Home selesai dimuat, lalu scroll
        setTimeout(() => scrollTo(target), 300);
      } else {
        scrollTo(target);
      }
    }
    setMobileOpen(false);
    setActiveDropdown(null);
    setMobileExpanded(null);

    // KETIKA KLIK MENU, DISPATCH EVENT JUGA UNTUK DOMAIN SELECT
    if (label) {
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent("spbe-domain-select", { detail: { domain: label } }));
      }, 400);
    }
  };

  const handleSearchResultClick = (item) => {
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => scrollTo(item.section), 300);
    } else {
      scrollTo(item.section);
    }
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
  }, [searchQuery, searchableItems]);

  return (
    <header className="sticky top-0 z-50 w-full" ref={navRef}>
      <nav aria-label="Main Navigation" className={`gradient-hero text-primary-foreground transition-all duration-300 ${scrolled ? "shadow-elegant py-0" : "shadow-soft"}`}>
        <div className="container flex items-center justify-between h-14 gap-2">
          {/* Logo */}
          <button onClick={() => handleNavClick("beranda")} aria-label="Beranda Portal SPBE" className="group flex items-center gap-2 font-display font-extrabold text-xl tracking-wide shrink-0 focus-visible:ring-2 focus-visible:ring-accent outline-none rounded-lg">
            <div className="w-8 h-8 rounded-lg bg-white/20 backdrop-blur grid place-items-center group-hover:rotate-180 transition-transform duration-500">
              <Globe className="w-4 h-4" />
            </div>
            <span className="hidden sm:inline">PEMERINTAHAN<span className="text-accent"> DIGITAL</span></span>
          </button>

          {/* Theme Toggle */}
          <Button variant="ghost" size="icon" onClick={toggleDarkMode} className="w-9 h-9 hover:bg-white/25 text-white border-transparent shrink-0 focus-visible:ring-2 focus-visible:ring-accent outline-none" aria-label={darkMode ? "Beralih ke mode terang" : "Beralih ke mode gelap"} title={darkMode ? "Mode Terang" : "Mode Gelap"}>
            {darkMode ? <Sun className="w-4 h-4 text-accent transition-transform duration-300 hover:rotate-180" /> : <Moon className="w-4 h-4 transition-transform duration-300 hover:-rotate-12" />}
          </Button>

          {/* Search Bar */}
          <div className="relative flex-1 max-w-xs hidden md:block" ref={searchRef}>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-white/60 pointer-events-none" />
              <input ref={searchInputRef} type="text" id="desktop-search" aria-label="Pencarian Global" value={searchQuery} onChange={(e) => { setSearchQuery(e.target.value); setSearchOpen(true); }} onFocus={() => setSearchOpen(true)} placeholder="Cari indikator, regulasi..." className="w-full pl-9 pr-4 py-1.5 rounded-lg bg-white/15 backdrop-blur border border-white/20 text-sm text-primary-foreground placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:bg-white/20 transition-all" />
            </div>
            {searchOpen && searchQuery.trim() && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-card text-card-foreground rounded-xl shadow-elegant overflow-hidden animate-scale-in origin-top z-50 max-h-72 overflow-y-auto">
                {searchResults.length > 0 ? (
                  searchResults.map((item, idx) => (
                    <button key={idx} onClick={() => handleSearchResultClick(item)} className="w-full text-left flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-secondary hover:pl-6 transition-all duration-200 border-b border-border/50 last:border-0">
                      <Search className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                      <div className="min-w-0">
                        <div className="font-medium truncate">{item.label}</div>
                        <div className="text-xs text-muted-foreground">
                          {item.type || (item.domain ? `Domain: ${item.domain}` : `Section: ${item.section}`)}
                          {item.domain && ` • Domain: ${item.domain}`}
                        </div>
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="px-4 py-6 text-center text-sm text-muted-foreground">Tidak ada hasil untuk "{searchQuery}"</div>
                )}
              </div>
            )}
          </div>

          {/* Desktop Menu — Dynamic */}
          <ul className="hidden lg:flex items-center gap-1">
            {menuItems.map((it) => {
              const isOpen = activeDropdown === it.titleID;
              return (
                <li key={it.titleID} className="relative">
                  <button
                    aria-haspopup={it.children ? "true" : "false"}
                    aria-expanded={it.children ? isOpen : undefined}
                    onClick={() => {
                      if (it.children) {
                        toggleDropdown(it.titleID);
                      } else if (it.externalLink) {
                        window.open(it.externalLink, "_blank", "noopener,noreferrer");
                      } else if (it.path && it.path.startsWith('/')) {
                         handleNavClick(it.path, it.titleID);
                      } else {
                        const targetId = extractTargetId(it.path);
                        if (targetId) handleNavClick(targetId, it.titleID);
                      }
                    }}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-lg hover:bg-white/15 focus-visible:bg-white/15 focus-visible:ring-2 focus-visible:ring-accent outline-none transition-all text-sm font-medium"
                  >
                    {it.titleID}
                    {it.children && <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />}
                  </button>
                  {it.children && isOpen && (
                    <div className="absolute top-full left-0 mt-1 w-48 bg-card text-card-foreground rounded-xl shadow-elegant overflow-hidden animate-scale-in origin-top">
                      {it.children.map((d) => (
                        <div key={d.titleID} className="group/sub">
                          <button
                            onClick={() => {
                              if (!d.children) {
                                setMobileOpen(false);
                                setActiveDropdown(null);
                                if (d.externalLink) {
                                  window.open(d.externalLink, "_blank", "noopener,noreferrer");
                                } else if (d.path && d.path.startsWith('/')) {
                                   handleNavClick(d.path, d.titleID);
                                } else {
                                  const targetId = extractTargetId(d.path);
                                  if (targetId) handleNavClick(targetId, d.titleID);
                                }
                              }
                            }}
                            className="w-full flex items-center justify-between px-4 py-2.5 text-sm hover:bg-secondary hover:text-primary transition-all duration-200"
                          >
                            <span>{d.titleID}</span>
                            {d.children && <ChevronDown className="w-3.5 h-3.5 transition-transform duration-300 group-hover/sub:rotate-180" />}
                          </button>

                          {d.children && (
                            <div className="hidden group-hover/sub:block bg-black/5 dark:bg-white/5 animate-fade-in">
                              {d.children.map((sub) => (
                                <button
                                  key={sub.titleID}
                                  onClick={() => {
                                    setMobileOpen(false);
                                    setActiveDropdown(null);
                                    if (sub.externalLink) {
                                      window.open(sub.externalLink, "_blank", "noopener,noreferrer");
                                    } else if (sub.path && sub.path.startsWith('/')) {
                                       handleNavClick(sub.path, sub.titleID);
                                    } else {
                                      const targetId = extractTargetId(sub.path);
                                      if (targetId) handleNavClick(targetId, sub.titleID);
                                    }
                                  }}
                                  className="w-full text-left block px-6 py-2 text-xs text-muted-foreground hover:text-primary hover:bg-secondary transition-all duration-200 border-l-2 border-transparent hover:border-primary"
                                >
                                  {sub.titleID}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </li>
              );
            })}
          </ul>

          {/* Mobile toggle */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="lg:hidden hover:bg-white/15 text-white border-transparent focus-visible:ring-accent" 
            onClick={() => { setMobileOpen(!mobileOpen); setMobileExpanded(null); }} 
            aria-label={mobileOpen ? "Tutup menu navigasi" : "Buka menu navigasi"}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </Button>
        </div>

        {/* Mobile Menu — Dynamic */}
        {mobileOpen && (
          <div className="lg:hidden border-t border-white/15 animate-fade-in">
            <div className="container pt-3 pb-1">
              <div className="relative" ref={searchRef}>
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-white/60 pointer-events-none" />
                <input type="text" aria-label="Pencarian Global Mobile" value={searchQuery} onChange={(e) => { setSearchQuery(e.target.value); setSearchOpen(true); }} onFocus={() => setSearchOpen(true)} placeholder="Cari indikator, regulasi..." className="w-full pl-9 pr-4 py-2 rounded-lg bg-white/15 backdrop-blur border border-white/20 text-sm text-primary-foreground placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all" />
                {searchOpen && searchQuery.trim() && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-card text-card-foreground rounded-xl shadow-elegant overflow-hidden animate-scale-in origin-top z-50 max-h-60 overflow-y-auto">
                    {searchResults.length > 0 ? (
                      searchResults.map((item, idx) => (
                        <button key={idx} onClick={() => handleSearchResultClick(item)} className="w-full text-left flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-secondary transition-all border-b border-border/50 last:border-0">
                          <Search className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                          <div className="min-w-0">
                            <div className="font-medium truncate">{item.label}</div>
                            <div className="text-xs text-muted-foreground">
                              {item.type || (item.domain ? `Domain: ${item.domain}` : `Section: ${item.section}`)}
                              {item.domain && ` • Domain: ${item.domain}`}
                            </div>
                          </div>
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
              {menuItems.map((it) => {
                const isExpanded = mobileExpanded === it.titleID || (mobileExpanded && mobileExpanded.startsWith(it.titleID + '-'));
                return (
                  <li key={it.titleID}>
                    <button
                      aria-haspopup={it.children ? "true" : "false"}
                      aria-expanded={it.children ? isExpanded : undefined}
                      onClick={() => {
                        if (it.children) {
                          toggleMobileExpanded(it.titleID);
                        } else if (it.externalLink) {
                          window.open(it.externalLink, "_blank", "noopener,noreferrer");
                          setMobileOpen(false);
                        } else if (it.path && it.path.startsWith('/')) {
                           handleNavClick(it.path, it.titleID);
                        } else {
                          const targetId = extractTargetId(it.path);
                          if (targetId) {
                            handleNavClick(targetId, it.titleID);
                          }
                        }
                      }}
                      className="w-full text-left flex items-center justify-between px-3 py-2 rounded-lg hover:bg-white/15 focus-visible:bg-white/15 focus-visible:ring-2 focus-visible:ring-accent outline-none transition-all"
                    >
                      <span className="flex items-center gap-2 text-sm">{it.titleID}</span>
                      {it.children && <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`} />}
                    </button>
                    {it.children && isExpanded && (
                      <ul className="ml-6 mt-1 space-y-1 border-l-2 border-white/20 pl-3 animate-fade-in">
                        {it.children.map((d) => {
                          const isSubExpanded = mobileExpanded === `${it.titleID}-${d.titleID}`;
                          return (
                            <li key={d.titleID}>
                              <button
                                onClick={() => {
                                  if (d.children) {
                                    toggleMobileExpanded(it.titleID, d.titleID);
                                  } else {
                                    setMobileOpen(false);
                                    if (d.externalLink) {
                                      window.open(d.externalLink, "_blank", "noopener,noreferrer");
                                    } else if (d.path && d.path.startsWith('/')) {
                                       handleNavClick(d.path, d.titleID);
                                    } else {
                                      const targetId = extractTargetId(d.path);
                                      if (targetId) handleNavClick(targetId, d.titleID);
                                    }
                                  }
                                }}
                                className="w-full text-left flex items-center justify-between px-3 py-1.5 rounded-lg text-sm hover:bg-white/15 transition-all"
                              >
                                <span>{d.titleID}</span>
                                {d.children && <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${isSubExpanded ? "rotate-180" : ""}`} />}
                              </button>
                              
                              {d.children && isSubExpanded && (
                                <ul className="ml-4 mt-1 space-y-1 border-l-2 border-white/20 pl-3 animate-fade-in">
                                  {d.children.map((sub) => (
                                    <li key={sub.titleID}>
                                      <button
                                        onClick={() => {
                                          setMobileOpen(false);
                                          if (sub.externalLink) {
                                            window.open(sub.externalLink, "_blank", "noopener,noreferrer");
                                          } else if (sub.path && sub.path.startsWith('/')) {
                                             handleNavClick(sub.path, sub.titleID);
                                          } else {
                                            const targetId = extractTargetId(sub.path);
                                            if (targetId) handleNavClick(targetId, sub.titleID);
                                          }
                                        }}
                                        className="w-full text-left px-3 py-1.5 rounded-lg text-sm hover:bg-white/15 transition-all text-white/80"
                                      >
                                        {sub.titleID}
                                      </button>
                                    </li>
                                  ))}
                                </ul>
                              )}
                            </li>
                          );
                        })}
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
