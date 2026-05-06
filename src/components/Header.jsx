import React, { useState, useEffect } from 'react';
import { ChevronDown, Menu, X } from 'lucide-react';
import smartcityImg from '../assets/smartcity.svg';

/**
 * scrollToSection(id) — smooth scrolls to element with that id
 * setDomainFilter(cat) — passed as prop so navbar dropdown can trigger filter in Home
 */
const Header = ({ setDomainFilter }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // darken header slightly after scrolling past hero
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    setMobileOpen(false);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setMobileOpen(false);
  };

  const handleDomainClick = (category) => {
    // scroll to domain section, then activate filter
    scrollToSection('section-domain');
    if (setDomainFilter) setDomainFilter(category);
    setIsDropdownOpen(false);
    setMobileOpen(false);
  };

  const navLinkClass =
    'transition-colors duration-200 hover:text-[#0057A4] cursor-pointer';

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/80 backdrop-blur-xl shadow-lg shadow-[#0057A4]/20 border-b border-slate-200'
          : 'bg-white shadow-sm backdrop-blur-lg border-b border-slate-200'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
        {/* Logo */}
        <button
          onClick={scrollToTop}
          className="flex items-center transition-transform hover:scale-105 focus:outline-none"
          aria-label="Kembali ke Beranda"
        >
          <img
            src={smartcityImg}
            alt="Smart City Kabupaten Tangerang"
            className="h-12 w-auto"
          />
        </button>

        {/* Desktop Nav */}
        <nav className="hidden md:block">
          <ul className="flex items-center gap-7 text-slate-900 font-medium text-sm">
            <li>
              <button
                onClick={scrollToTop}
                className={navLinkClass}
              >
                Beranda
              </button>
            </li>

            <li>
              <button
                onClick={() => scrollToSection('section-tentang')}
                className={navLinkClass}
              >
                Tentang SPBE
              </button>
            </li>

            {/* Domain Dropdown */}
            <li
              className="relative"
              onMouseEnter={() => setIsDropdownOpen(true)}
              onMouseLeave={() => setIsDropdownOpen(false)}
            >
              <button className={`flex items-center gap-1 ${navLinkClass}`}>
                Domain
                <ChevronDown
                  size={15}
                  className={`transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}
                />
              </button>

              <div
                className={`absolute left-0 mt-3 w-48 bg-white/95 backdrop-blur-md border border-slate-200 rounded-xl shadow-2xl overflow-hidden transition-all duration-200 ${
                  isDropdownOpen
                    ? 'opacity-100 visible translate-y-0'
                    : 'opacity-0 invisible -translate-y-2'
                }`}
              >
                <div className="flex flex-col py-1.5">
                  {['Kebijakan', 'Tata Kelola', 'Manajemen', 'Layanan'].map(
                    (cat) => (
                      <button
                        key={cat}
                        onClick={() => handleDomainClick(cat)}
                        className="px-4 py-2.5 text-left text-slate-600 hover:bg-[#0057A4]/20 hover:text-[#0057A4] transition-colors text-sm"
                      >
                        {cat}
                      </button>
                    )
                  )}
                </div>
              </div>
            </li>

            <li>
              <button
                onClick={() => scrollToSection('section-implementasi')}
                className={navLinkClass}
              >
                Implementasi SPBE
              </button>
            </li>

            <li>
              <button
                onClick={() => scrollToSection('section-tentang')}
                className={navLinkClass}
              >
                Katalog
              </button>
            </li>
          </ul>
        </nav>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden text-slate-900 p-2 rounded-lg hover:bg-white/10 transition-colors"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden transition-all duration-300 overflow-hidden ${
          mobileOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        } bg-white/95 backdrop-blur-xl border-t border-slate-200`}
      >
        <div className="px-6 py-4 flex flex-col gap-3 text-slate-900 font-medium text-sm">
          <button onClick={scrollToTop} className="text-left py-2 hover:text-[#0057A4] transition-colors">Beranda</button>
          <button onClick={() => scrollToSection('section-tentang')} className="text-left py-2 hover:text-[#0057A4] transition-colors">Tentang SPBE</button>
          <div className="py-2 border-t border-slate-200">
            <p className="text-[#0057A4] text-xs uppercase tracking-wider mb-2">Domain</p>
            {['Kebijakan', 'Tata Kelola', 'Manajemen', 'Layanan'].map((cat) => (
              <button
                key={cat}
                onClick={() => handleDomainClick(cat)}
                className="block w-full text-left py-1.5 pl-3 hover:text-[#0057A4] transition-colors"
              >
                {cat}
              </button>
            ))}
          </div>
          <button onClick={() => scrollToSection('section-implementasi')} className="text-left py-2 hover:text-[#0057A4] transition-colors">Implementasi SPBE</button>
        </div>
      </div>
    </header>
  );
};

export default Header;
