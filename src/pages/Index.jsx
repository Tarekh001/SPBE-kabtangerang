import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Tentang } from "@/components/Tentang";
import { Indikator } from "@/components/Indikator";
import { Implementasi } from "@/components/Implementasi";
import { Katalog } from "@/components/Katalog";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <div id="beranda"><Hero /></div>
        <Tentang />
        <Indikator />
        <Implementasi />
        <Katalog />
      </main>
      <div id="kontak"><Footer /></div>
    </div>
  );
};

export default Index;
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Tentang } from "@/components/Tentang";
import { Indikator } from "@/components/Indikator";
import { Implementasi } from "@/components/Implementasi";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <div id="beranda"><Hero /></div>
        <Tentang />
        <Indikator />
        <Implementasi />
      </main>
      <div id="kontak"><Footer /></div>
    </div>
  );
};

export default Index;

