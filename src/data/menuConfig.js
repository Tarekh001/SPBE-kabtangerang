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
        titleID: sub.name,
        titleEN: sub.name,
        path: sub.externalLink || '#' + sub.name.toLowerCase().replace(/\s+/g, '-'),
      }));

    const result = {
      titleID: main.name,
      titleEN: main.name,
      path: children.length > 0 ? '#' : (main.externalLink || '#' + main.name.toLowerCase().replace(/\s+/g, '-')),
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

  apiMenus.forEach(apiItem => {
    const existsInStatic = staticMenus.some(
      s => s.titleID.toLowerCase() === apiItem.titleID.toLowerCase()
    );
    if (!existsInStatic) {
      const kontakIdx = merged.findIndex(s => s.titleID.toLowerCase() === 'kontak');
      if (kontakIdx >= 0) {
        merged.splice(kontakIdx, 0, apiItem);
      } else {
        merged.push(apiItem);
      }
    }
  });

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
