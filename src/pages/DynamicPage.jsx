import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ScrollToTop } from '@/components/ScrollToTop';
import { FileText, ArrowLeft, Image as ImageIcon, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { apiEndpoints, getImageUrl } from '@/utils/helpers';
import logger from '@/lib/logger';

const DynamicPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imgError, setImgError] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      setImgError(false);
      
      const [menus, contents] = await Promise.all([
        apiEndpoints.menu.getAll(),
        apiEndpoints.content.getAll()
      ]);

      const matchedMenu = menus.find(m => m.id === slug);

      if (!matchedMenu) {
        const byName = menus.find(
          m => m.name.toLowerCase().replace(/\s+/g, '-') === slug
        );
        if (!byName) throw new Error('Halaman tidak ditemukan');
        
        const contentByName = contents.find(c => c.menuId === byName.id);
        setContent({
          title: contentByName?.title || byName.name,
          body: contentByName?.body || null,
          imageUrl: contentByName?.imageUrl || null,
        });
        return;
      }

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

  useEffect(() => {
    loadData();
  }, [slug]);

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="mb-6 animate-fade-in-up">
            <Button 
              variant="ghost" 
              onClick={handleBack}
              leftIcon={<ArrowLeft className="w-4 h-4" />}
              className="text-muted-foreground hover:text-primary hover:bg-primary/5"
            >
              Kembali
            </Button>
          </div>

          <div className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden min-h-[500px]">
            {loading ? (
              <div className="flex flex-col items-center justify-center h-96 text-muted-foreground" aria-live="polite">
                <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full motion-safe:animate-spin mb-4"></div>
                <p>Memuat konten...</p>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center h-96 text-center px-6" role="alert">
                <div className="w-16 h-16 bg-destructive/10 text-destructive rounded-full flex items-center justify-center mb-4">
                  <AlertCircle className="w-8 h-8" />
                </div>
                <h2 className="text-xl font-bold text-foreground mb-2">Oops! Terjadi Kesalahan</h2>
                <p className="text-muted-foreground mb-6 max-w-md">{error}</p>
                <Button onClick={loadData} variant="primary">
                  Coba Lagi
                </Button>
              </div>
            ) : content ? (
              <article className="animate-fade-in-up">
                {/* Header Section */}
                <div className="px-8 pt-8 pb-6 border-b border-border/50 text-center flex justify-center">
                  <h1 className="font-extrabold tracking-tight text-foreground text-3xl lg:text-4xl leading-tight">
                    {content.title}
                  </h1>
                </div>

                {/* Optional Image Section */}
                {content.imageUrl && (
                  <div className="relative bg-secondary/30 border-b border-border/50 w-full flex items-center justify-center min-h-[300px]">
                    {!imgError ? (
                      <img 
                        src={getImageUrl(content.imageUrl)}
                        alt={content.title}
                        className="w-full h-auto max-h-[500px] object-contain motion-safe:animate-fade-in"
                        onError={() => setImgError(true)}
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
                        <ImageIcon className="w-12 h-12 mb-3 opacity-50" />
                        <span className="text-sm font-medium">Gambar tidak tersedia</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Body Content */}
                <div className="p-8 md:p-10 prose prose-slate max-w-none prose-headings:text-foreground prose-a:text-primary hover:prose-a:text-primary/80 prose-a:transition-colors">
                  {content.body ? (
                    <div dangerouslySetInnerHTML={{ __html: content.body }} />
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12 text-muted-foreground" aria-live="polite">
                      <FileText className="w-10 h-10 mb-3 opacity-40" />
                      <p className="italic text-center">Konten sedang dalam penulisan.</p>
                    </div>
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
