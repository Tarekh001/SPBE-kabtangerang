import { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";

export const ScrollToTop = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const toggle = () => setVisible(window.scrollY > 300);
    window.addEventListener("scroll", toggle);
    return () => window.removeEventListener("scroll", toggle);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!visible) return null;

  return (
    <button
      onClick={scrollToTop}
      className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full
                 gradient-primary text-primary-foreground shadow-elegant
                 grid place-items-center hover:scale-110
                 transition-all duration-300 animate-fade-in cursor-pointer"
      aria-label="Scroll to top"
      title="Kembali ke atas"
    >
      <ArrowUp className="w-5 h-5" />
    </button>
  );
};
