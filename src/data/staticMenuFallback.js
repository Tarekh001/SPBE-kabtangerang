/**
 * Static Menu Fallback untuk SPBE Navbar
 * Path menggunakan # prefix karena SPBE single-page (scroll navigation).
 */
export const STATIC_MENU_FALLBACK = [
  {
    titleID: "Tentang",
    path: "#tentang",
  },
  {
    titleID: "Domain",
    path: "#",
    children: [
      { titleID: "Kebijakan", path: "#indikator" },
      { titleID: "Tata Kelola", path: "#indikator" },
      { titleID: "Manajemen", path: "#indikator" },
      { titleID: "Layanan", path: "#indikator" },
    ],
  },
  {
    titleID: "Implementasi",
    path: "#implementasi",
  },
  {
    titleID: "Kontak",
    path: "#contact-form",
  },
];
