import { useState, useEffect } from 'react';
import fetchMenuFromCMS from '../data/menuconfig';
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
        // By-pass cache while using Postman for mockup
        const data = await fetchMenuFromCMS();
        setMenuItems(data);
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
