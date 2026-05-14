
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Tentang } from "@/components/Tentang";
import { Indikator } from "@/components/Indikator";
import { Implementasi } from "@/components/Implementasi";
import { Footer } from "@/components/Footer";
import { ContactForm } from "@/components/ContactForm";
import { ScrollToTop } from "@/components/ScrollToTop";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <div id="beranda"><Hero /></div>
        <Tentang />
        <Indikator />
        <Implementasi />
        <ContactForm />
      </main>
      <div id="kontak"><Footer /></div>
      <ScrollToTop />
    </div>
  );
};

export default Index;
