import React, { useState, useEffect } from 'react';
import { Accessibility, Volume2, ZoomIn, ZoomOut, Contrast, BookOpen, RotateCcw, X, VolumeX } from 'lucide-react';

export const AccessibilityPanel = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [textScale, setTextScale] = useState(1);
  const [highContrast, setHighContrast] = useState(false);
  const [readableText, setReadableText] = useState(false);
  const [voiceMode, setVoiceMode] = useState(false);
  const [synthSupport] = useState('speechSynthesis' in window);

  // Apply scales
  useEffect(() => {
    document.documentElement.style.fontSize = `${textScale * 100}%`;
  }, [textScale]);

  // Apply High Contrast & Readable Text classes
  useEffect(() => {
    if (highContrast) {
      document.body.classList.add('high-contrast');
    } else {
      document.body.classList.remove('high-contrast');
    }

    if (readableText) {
      document.body.classList.add('readable-text');
    } else {
      document.body.classList.remove('readable-text');
    }
  }, [highContrast, readableText]);

  // Voice mode: Click to speak
  useEffect(() => {
    if (!synthSupport) return;
    
    if (voiceMode) {
      const handleClickToSpeak = (e) => {
        // Prevent speech if clicking inside the accessibility panel itself
        if (e.target.closest('#a11y-panel')) return;
        
        // Grab the text of the clicked element
        const textToSpeak = e.target.innerText || e.target.textContent;
        if (textToSpeak && textToSpeak.trim().length > 0) {
          window.speechSynthesis.cancel();
          const utterance = new SpeechSynthesisUtterance(textToSpeak.trim());
          utterance.lang = 'id-ID';
          window.speechSynthesis.speak(utterance);
        }
      };

      // Add capture listener so it intercepts clicks early
      document.addEventListener('click', handleClickToSpeak, { capture: true });
      
      return () => {
        document.removeEventListener('click', handleClickToSpeak, { capture: true });
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

  const resetAll = () => {
    setTextScale(1);
    setHighContrast(false);
    setReadableText(false);
    setVoiceMode(false);
  };

  return (
    <div id="a11y-panel">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-24 left-0 z-50 p-3 rounded-r-lg bg-primary text-primary-foreground shadow-lg hover:scale-105 transition-transform duration-200"
        aria-label="Aksesibilitas"
      >
        <Accessibility className="w-6 h-6" />
      </button>

      {isOpen && (
        <div className="fixed top-24 left-16 z-50 w-80 bg-card rounded-2xl shadow-2xl border border-border overflow-hidden animate-scale-in origin-top-left">
          <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/30">
            <h3 className="font-bold text-foreground text-sm flex items-center gap-2">
              <Accessibility className="w-4 h-4" /> Panel Aksesibilitas
            </h3>
            <button onClick={() => setIsOpen(false)} className="text-muted-foreground hover:text-foreground">
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="p-4 flex flex-col gap-2 max-h-[70vh] overflow-y-auto">
            
            <button onClick={handleVoiceMode} className="w-full flex items-center justify-between p-3 rounded-xl border border-border hover:border-primary/50 hover:bg-primary/5 transition-colors">
              <div className="flex items-center gap-3">
                {voiceMode ? <Volume2 className="w-5 h-5 text-primary" /> : <VolumeX className="w-5 h-5 text-muted-foreground" />}
                <div className="text-left">
                  <p className="text-sm font-semibold text-foreground">Mode Suara</p>
                  <p className="text-xs text-muted-foreground">
                    {!synthSupport ? "Tidak didukung browser" : (voiceMode ? "Mode Aktif" : "Mode Nonaktif")}
                  </p>
                </div>
              </div>
              <div className={`w-10 h-5 rounded-full relative transition-colors ${voiceMode ? 'bg-primary' : 'bg-muted'}`}>
                <div className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform ${voiceMode ? 'translate-x-5' : 'translate-x-0'}`} />
              </div>
            </button>

            <button onClick={handleZoomIn} className="w-full flex items-center gap-3 p-3 rounded-xl border border-border hover:border-primary/50 hover:bg-primary/5 transition-colors">
              <ZoomIn className="w-5 h-5 text-primary" />
              <div className="text-left">
                <p className="text-sm font-semibold text-foreground">Perbesar Teks</p>
                <p className="text-xs text-muted-foreground">Tingkatkan ukuran font</p>
              </div>
            </button>

            <button onClick={handleZoomOut} className="w-full flex items-center gap-3 p-3 rounded-xl border border-border hover:border-primary/50 hover:bg-primary/5 transition-colors">
              <ZoomOut className="w-5 h-5 text-secondary-foreground" />
              <div className="text-left">
                <p className="text-sm font-semibold text-foreground">Perkecil Teks</p>
                <p className="text-xs text-muted-foreground">Kurangi ukuran font</p>
              </div>
            </button>

            <button onClick={handleHighContrast} className={`w-full flex items-center justify-between p-3 rounded-xl border transition-colors ${highContrast ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/50 hover:bg-primary/5'}`}>
              <div className="flex items-center gap-3">
                <Contrast className={`w-5 h-5 ${highContrast ? 'text-primary' : 'text-muted-foreground'}`} />
                <div className="text-left">
                  <p className="text-sm font-semibold text-foreground">Kontras Tinggi</p>
                  <p className="text-xs text-muted-foreground">Lebih mudah dibaca</p>
                </div>
              </div>
              <div className={`w-10 h-5 rounded-full relative transition-colors ${highContrast ? 'bg-primary' : 'bg-muted'}`}>
                <div className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform ${highContrast ? 'translate-x-5' : 'translate-x-0'}`} />
              </div>
            </button>

            <button onClick={handleReadableText} className={`w-full flex items-center justify-between p-3 rounded-xl border transition-colors ${readableText ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/50 hover:bg-primary/5'}`}>
              <div className="flex items-center gap-3">
                <BookOpen className={`w-5 h-5 ${readableText ? 'text-primary' : 'text-muted-foreground'}`} />
                <div className="text-left">
                  <p className="text-sm font-semibold text-foreground">Tulisan Mudah</p>
                  <p className="text-xs text-muted-foreground">Spasi rentang & lebar</p>
                </div>
              </div>
              <div className={`w-10 h-5 rounded-full relative transition-colors ${readableText ? 'bg-primary' : 'bg-muted'}`}>
                <div className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform ${readableText ? 'translate-x-5' : 'translate-x-0'}`} />
              </div>
            </button>

            <button onClick={resetAll} className="mt-2 w-full flex items-center justify-center gap-2 p-2.5 rounded-xl border border-destructive/20 text-destructive bg-destructive/5 hover:bg-destructive hover:text-destructive-foreground transition-colors">
              <RotateCcw className="w-4 h-4" />
              <span className="text-sm font-medium">Atur Ulang</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
