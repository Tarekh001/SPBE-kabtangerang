import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ScrollToTop } from '@/components/ScrollToTop';
import { FileText, ArrowLeft, Image as ImageIcon } from 'lucide-react';
import { apiEndpoints, getImageUrl } from '@/utils/helpers';
import logger from '@/lib/logger';

const DynamicPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch menus and contents secara paralel
        const [menus, contents] = await Promise.all([
          apiEndpoints.menu.getAll(),
          apiEndpoints.content.getAll()
        ]);

        // Slug sekarang adalah UUID menu langsung — matching by ID, bukan name
        const matchedMenu = menus.find(m => m.id === slug);

        if (!matchedMenu) {
          // Fallback: coba cari by name-slug untuk backward compat
          const byName = menus.find(
            m => m.name.toLowerCase().replace(/\s+/g, '-') === slug
          );
          if (!byName) throw new Error('Halaman tidak ditemukan');
          // Jika ketemu by name, pakai ID-nya untuk cari konten
          const contentByName = contents.find(c => c.menuId === byName.id);
          setContent({
            title: contentByName?.title || byName.name,
            body: contentByName?.body || null,
            imageUrl: contentByName?.imageUrl || null,
          });
          return;
        }

        // Cari konten berdasarkan menuId (UUID) — tidak ada ambigu
        const matchedContent = contents.find(c => c.menuId === matchedMenu.id);

        setContent({
          title: matchedContent?.title || matchedMenu.name,
          body: matchedContent?.body || null,
          imageUrl: matchedContent?.imageUrl || null,
        });

      } catch (err) {
        logger.error('Failed to load dynamic page content', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [slug]);

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="bg-card rounded-2xl shadow-soft border border-border overflow-hidden hover:shadow-elegant hover:border-primary/40 transition-all duration-300 min-h-[500px]">
            {loading ? (
              <div className="flex flex-col items-center justify-center h-96 text-slate-400">
                <div className="w-10 h-10 border-4 border-[#0057A4] border-t-transparent rounded-full animate-spin mb-4"></div>
                <p>Memuat konten...</p>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center h-96 text-center px-6">
                <div className="w-16 h-16 bg-red-50 text-red-400 rounded-full flex items-center justify-center mb-4">
                  <FileText size={24} />
                </div>
                <h2 className="text-xl font-bold text-slate-800 mb-2">Oops!</h2>
                <p className="text-slate-500">{error}</p>
              </div>
            ) : content ? (
              <article className="animate-fade-in-up">
                {/* Header Section */}
                <div className="px-8 pt-7 pb-5 border-b border-border/50 text-center flex justify-center">
                  <h1 className="font-bold text-foreground text-2xl lg:text-3xl leading-tight">
                    {content.title}
                  </h1>
                </div>

                {/* Optional Image Section */}
                {content.imageUrl && (
                  <div className="relative bg-secondary/20 border-b border-border/50 w-full flex justify-center">
                    <img 
                      src={getImageUrl(content.imageUrl)}
                      alt={content.title}
                      className="w-full h-auto max-h-[500px] object-contain transition-opacity duration-300"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.parentElement.classList.add('flex', 'items-center', 'justify-center', 'py-16');
                        e.target.parentElement.innerHTML = '<div class="text-slate-400 flex flex-col items-center"><svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-image mb-3"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg><span class="mt-2 text-sm">Gambar tidak tersedia</span></div>';
                      }}
                    />
                  </div>
                )}

                {/* Body Content */}
                <div className="p-8 md:p-10 prose prose-slate max-w-none prose-headings:text-slate-800 prose-a:text-[#0057A4]">
                  {content.body ? (
                    <div dangerouslySetInnerHTML={{ __html: content.body }} />
                  ) : (
                    <p className="text-slate-500 italic text-center">Konten sedang dalam penulisan.</p>
                  )}
                </div>
              </article>
            ) : null}
          </div>
        </div>
      </main>

      <Footer />
      <ScrollToTop />
    </div>
  );
};

export default DynamicPage;
