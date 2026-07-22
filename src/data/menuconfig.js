import { STATIC_MENU_FALLBACK } from './staticMenuFallback';
import { apiEndpoints } from '../utils/helpers';

/**
 * Transform flat menu data dari API -> nested format untuk Navbar
 * API return: flat array (sudah di-unwrap oleh fetchApiData)
 * Development mode: abaikan isVisible (tampilkan semua menu)
 */
const transformMenuData = (flatMenus) => {
  const visibleMenus = flatMenus;
  const mainMenus = visibleMenus.filter(item => !item.parentId);
  const subMenus = visibleMenus.filter(item => item.parentId);

  return mainMenus.map(main => {
    const children = subMenus
      .filter(sub => sub.parentId === main.id)
      .map(sub => ({
        id: sub.id,
        titleID: sub.name,
        titleEN: sub.name,
        // Gunakan ID bukan name-slug agar tidak ada duplicate/ambigu
        path: sub.externalLink || '/halaman/' + sub.id,
      }));

    const result = {
      id: main.id,
      titleID: main.name,
      titleEN: main.name,
      path: children.length > 0 ? '#' : (main.externalLink || '/halaman/' + main.id),
    };

    if (children.length > 0) {
      result.children = children;
    }

    return result;
  });
};

/**
 * Gabungkan menu statis (base) dengan menu dari API.
 */
const mergeMenus = (staticMenus, apiMenus) => {
  const merged = staticMenus.map(staticItem => {
    const apiMatch = apiMenus.find(
      api => api.titleID.toLowerCase() === staticItem.titleID.toLowerCase()
    );
    if (apiMatch) return apiMatch;
    return staticItem;
  });

  const newApiMenus = [];

  apiMenus.forEach(apiItem => {
    const existsInStatic = staticMenus.some(
      s => s.titleID.toLowerCase() === apiItem.titleID.toLowerCase()
    );
    if (!existsInStatic) {
      newApiMenus.push(apiItem);
    }
  });

  if (newApiMenus.length > 0) {
    const produkMenu = {
      titleID: 'Produk',
      titleEN: 'Produk',
      path: '#',
      children: newApiMenus.map(item => ({
        ...item,
        // Pastikan path berbasis ID jika belum
        path: item.path || '/halaman/' + item.id,
      }))
    };
    
    const kontakIdx = merged.findIndex(s => s.titleID.toLowerCase() === 'kontak');
    if (kontakIdx >= 0) {
      merged.splice(kontakIdx, 0, produkMenu);
    } else {
      merged.push(produkMenu);
    }
  }

  return merged;
};

export const fetchMenuFromCMS = async () => {
  try {
    const rawMenus = await apiEndpoints.menu.getAll();

    if (!Array.isArray(rawMenus) || rawMenus.length === 0) {
      throw new Error('Invalid menu data from API');
    }

    const apiMenus = transformMenuData(rawMenus);
    const merged = mergeMenus(STATIC_MENU_FALLBACK, apiMenus);
    console.log('Menu merged (static + API):', merged);
    return merged;
  } catch (error) {
    console.error('API Error, using fallback:', error);
    return STATIC_MENU_FALLBACK;
  }
};

export default fetchMenuFromCMS;
