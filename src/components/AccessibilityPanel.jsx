import React, { useState, useEffect } from 'react';
import { Accessibility, Volume2, ZoomIn, ZoomOut, Contrast, BookOpen, RotateCcw, X, Palette, Eye, Lightbulb, Link, AlignLeft } from 'lucide-react';

export const AccessibilityPanel = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [textScale, setTextScale] = useState(1);
  const [highContrast, setHighContrast] = useState(false);
  const [readableText, setReadableText] = useState(false);
  const [voiceMode, setVoiceMode] = useState(false);
  const [grayscaleMode, setGrayscaleMode] = useState(false);
  const [underlineLinks, setUnderlineLinks] = useState(false);
  const [alignTextMode, setAlignTextMode] = useState(false);
  const [synthSupport] = useState('speechSynthesis' in window);

  // Apply scales
  useEffect(() => {
    document.documentElement.style.fontSize = `${textScale * 100}%`;
  }, [textScale]);

  // Apply CSS Classes
  useEffect(() => {
    document.body.classList.toggle('high-contrast', highContrast);
    document.body.classList.toggle('readable-text', readableText);
    document.body.classList.toggle('grayscale-mode', grayscaleMode);
    document.body.classList.toggle('underline-links', underlineLinks);
    document.body.classList.toggle('align-text-mode', alignTextMode);
  }, [highContrast, readableText, grayscaleMode, underlineLinks, alignTextMode]);

  // Voice mode: Hover to speak
  useEffect(() => {
    if (!synthSupport) return;
    
    if (voiceMode) {
      const handleMouseOver = (e) => {
        if (e.target.closest('#a11y-panel')) return;
        
        // Only read elements that typically contain text to avoid reading massive containers
        const validTags = ['P', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'A', 'BUTTON', 'SPAN', 'LI', 'LABEL', 'TH', 'TD'];
        if (validTags.includes(e.target.tagName)) {
          const textToSpeak = e.target.innerText || e.target.textContent;
          if (textToSpeak && textToSpeak.trim().length > 0) {
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(textToSpeak.trim());
            utterance.lang = 'id-ID';
            window.speechSynthesis.speak(utterance);
          }
        }
      };
      
      document.addEventListener('mouseover', handleMouseOver, { capture: true });
      return () => {
        document.removeEventListener('mouseover', handleMouseOver, { capture: true });
        window.speechSynthesis.cancel();
      };
    } else {
      window.speechSynthesis.cancel();
    }
  }, [voiceMode, synthSupport]);

  const handleZoomIn = () => setTextScale(prev => Math.min(prev + 0.1, 1.5));
  const handleZoomOut = () => setTextScale(prev => Math.max(prev - 0.1, 0.8));
  const handleHighContrast = () => setHighContrast(prev => !prev);
  const handleReadableText = () => setReadableText(prev => !prev);
  const handleVoiceMode = () => setVoiceMode(prev => !prev);
  const handleGrayscale = () => setGrayscaleMode(prev => !prev);
  const handleUnderlineLinks = () => setUnderlineLinks(prev => !prev);
  const handleAlignText = () => setAlignTextMode(prev => !prev);

  const handleDarkMode = (isDark) => {
    document.documentElement.classList.toggle("dark", isDark);
    localStorage.setItem("spbe-theme", isDark ? "dark" : "light");
  };

  const resetAll = () => {
    setTextScale(1);
    setHighContrast(false);
    setReadableText(false);
    setVoiceMode(false);
    setGrayscaleMode(false);
    setUnderlineLinks(false);
    setAlignTextMode(false);
    handleDarkMode(false);
  };

  const ItemBtn = ({ icon: Icon, label, onClick, isActive }) => (
    <button 
      onClick={onClick} 
      className={`w-full flex items-center gap-3 px-4 py-2.5 hover:bg-black/5 dark:hover:bg-white/5 transition-colors text-sm font-medium ${isActive ? 'text-primary bg-primary/5' : 'text-foreground'}`}
    >
      <Icon className="w-4 h-4 shrink-0" />
      <span>{label}</span>
    </button>
  );

  return (
    <div 
      id="a11y-panel" 
      className="fixed top-24 left-0 z-50 flex items-start"
      style={{ transform: `scale(${1 / textScale})`, transformOrigin: 'top left' }}
    >
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="p-2.5 rounded-r-lg bg-primary text-primary-foreground shadow-lg hover:scale-105 transition-transform duration-200 relative z-50"
        aria-label="Aksesibilitas"
      >
        <Accessibility className="w-5 h-5" />
      </button>

      {isOpen && (
        <div className="absolute left-12 top-0 w-56 bg-card rounded-xl shadow-2xl border border-border overflow-hidden animate-scale-in origin-top-left flex flex-col z-40">
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-border bg-muted/30">
            <h3 className="font-bold text-foreground text-xs flex items-center gap-2">
              <Accessibility className="w-3.5 h-3.5" /> Aksesibilitas
            </h3>
            <button onClick={() => setIsOpen(false)} className="text-muted-foreground hover:text-foreground">
              <X className="w-4 h-4" />
            </button>
          </div>
          
          <div className="flex flex-col py-1 max-h-[65vh] overflow-y-auto">
            <ItemBtn icon={Volume2} label="Moda Suara" onClick={handleVoiceMode} isActive={voiceMode} />
            <ItemBtn icon={ZoomIn} label="Perbesar Teks" onClick={handleZoomIn} />
            <ItemBtn icon={ZoomOut} label="Perkecil Teks" onClick={handleZoomOut} />
            <ItemBtn icon={Palette} label="Skala Abu - Abu" onClick={handleGrayscale} isActive={grayscaleMode} />
            <ItemBtn icon={Contrast} label="Kontras Tinggi" onClick={handleHighContrast} isActive={highContrast} />
            <ItemBtn icon={Eye} label="Latar Gelap" onClick={() => handleDarkMode(true)} />
            <ItemBtn icon={Lightbulb} label="Latar Terang" onClick={() => handleDarkMode(false)} />
            <ItemBtn icon={BookOpen} label="Tulisan Dapat Dibaca" onClick={handleReadableText} isActive={readableText} />
            <ItemBtn icon={Link} label="Garis Bawahi Tautan" onClick={handleUnderlineLinks} isActive={underlineLinks} />
            <ItemBtn icon={AlignLeft} label="Rata Tulisan" onClick={handleAlignText} isActive={alignTextMode} />
          </div>

          <button 
            onClick={resetAll} 
            className="w-full flex items-center justify-center gap-2 px-4 py-3 border-t border-border bg-foreground text-background hover:bg-foreground/90 transition-colors font-bold text-sm"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Atur Ulang</span>
          </button>
        </div>
      )}
    </div>
  );
};
