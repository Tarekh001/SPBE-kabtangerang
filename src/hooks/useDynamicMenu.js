import { useState, useEffect } from 'react';
import fetchMenuFromCMS from '../data/menuConfig';
import { STATIC_MENU_FALLBACK } from '../data/staticMenuFallback';

const CACHE_KEY = 'smartcity_menu_cache_v2';
const CACHE_DURATION = 5 * 60 * 1000; // 5 menit

export const useDynamicMenu = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadMenu = async () => {
      try {
        setLoading(true);

        // Cek cache dulu
        const cached = localStorage.getItem(CACHE_KEY);
        if (cached) {
          const { data, timestamp } = JSON.parse(cached);
          if (Date.now() - timestamp < CACHE_DURATION) {
            setMenuItems(data);
            setLoading(false);
            return;
          }
        }

        const data = await fetchMenuFromCMS();
        setMenuItems(data);

        // Simpan ke cache
        localStorage.setItem(CACHE_KEY, JSON.stringify({
          data,
          timestamp: Date.now()
        }));
      } catch (err) {
        setError(err.message);
        setMenuItems([]);
      } finally {
        setLoading(false);
      }
    };

    loadMenu();
  }, []);

  return { menuItems, loading, error };
};
