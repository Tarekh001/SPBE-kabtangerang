import React, { useState, useEffect, useRef } from 'react';
import {
  FileText, BookOpen, Shield, Settings, Layers, Globe,
  ChevronRight, Filter, Calendar, TrendingUp, CheckCircle,
  ArrowRight, ExternalLink, Star, Award, Target, BarChart2,
  Download, Eye, Loader2, Search
} from 'lucide-react';
import heroBg from '../assets/baru.jpg';
import ilustrasiTentang from '../assets/tentang-spbe.jpg'; // Ganti dengan nama file gambar Anda jika berbeda
import { fetchKebijakan } from '../utils/helpers';

// ─────────────────────────────────────────────
// DUMMY DATA
// ─────────────────────────────────────────────

const dokumenAPI = [
  { id: 1, judul: 'Pedoman Teknis SPBE 2024', tipe: 'PDF', ukuran: '2.4 MB', tanggal: '15 Jan 2024', kategori: 'Panduan' },
  { id: 2, judul: 'API Reference Sistem Integrasi', tipe: 'YAML', ukuran: '540 KB', tanggal: '02 Mar 2024', kategori: 'API Docs' },
  { id: 3, judul: 'Arsitektur SPBE Kabupaten Tangerang', tipe: 'PDF', ukuran: '3.1 MB', tanggal: '20 Apr 2024', kategori: 'Arsitektur' },
  { id: 4, judul: 'Blueprint Transformasi Digital 2023', tipe: 'PDF', ukuran: '4.7 MB', tanggal: '05 Jun 2023', kategori: 'Blueprint' },
  { id: 5, judul: 'Standar Keamanan Sistem Informasi', tipe: 'DOCX', ukuran: '1.2 MB', tanggal: '11 Sep 2023', kategori: 'Keamanan' },
  { id: 6, judul: 'Panduan Data Governance', tipe: 'PDF', ukuran: '980 KB', tanggal: '28 Nov 2023', kategori: 'Tata Kelola' },
];

const peraturanAPI = {
  Kebijakan: [
    { id: 1, nomor: 'Perpres No. 95 Tahun 2018', judul: 'Sistem Pemerintahan Berbasis Elektronik', status: 'Aktif', tahun: 2018 },
    { id: 2, nomor: 'Permenpan-RB No. 59 Tahun 2020', judul: 'Pemantauan dan Evaluasi SPBE', status: 'Aktif', tahun: 2020 },
    { id: 3, nomor: 'Perda No. 12 Tahun 2022', judul: 'Penyelenggaraan SPBE Kab. Tangerang', status: 'Aktif', tahun: 2022 },
    { id: 4, nomor: 'SK Bupati No. 050/2023', judul: 'Penetapan Arsitektur SPBE Daerah', status: 'Aktif', tahun: 2023 },
  ],
  'Tata Kelola': [
    { id: 1, nomor: 'Permenpan-RB No. 5 Tahun 2020', judul: 'Pedoman Manajemen Risiko SPBE', status: 'Aktif', tahun: 2020 },
    { id: 2, nomor: 'SK Diskominfo No. 10/2021', judul: 'Struktur Organisasi Pengelola SPBE', status: 'Aktif', tahun: 2021 },
    { id: 3, nomor: 'SE Bupati No. 800/2022', judul: 'Tata Cara Pengelolaan Data Pemerintah', status: 'Aktif', tahun: 2022 },
  ],
  Manajemen: [
    { id: 1, nomor: 'Permenpan-RB No. 19 Tahun 2022', judul: 'Manajemen Layanan SPBE', status: 'Aktif', tahun: 2022 },
    { id: 2, nomor: 'Perka BSSN No. 4 Tahun 2021', judul: 'Keamanan Informasi Pemerintah', status: 'Aktif', tahun: 2021 },
    { id: 3, nomor: 'SK Kadis No. 28/2023', judul: 'Manajemen Aset Teknologi Informasi', status: 'Aktif', tahun: 2023 },
    { id: 4, nomor: 'Perjanjian Kinerja 2024', judul: 'Target Kinerja Pengelolaan TIK', status: 'Aktif', tahun: 2024 },
  ],
  Layanan: [
    { id: 1, nomor: 'Permenpan-RB No. 13 Tahun 2021', judul: 'Evaluasi Pelayanan Publik Digital', status: 'Aktif', tahun: 2021 },
    { id: 2, nomor: 'Perda No. 8 Tahun 2023', judul: 'Layanan Administrasi Kependudukan Digital', status: 'Aktif', tahun: 2023 },
    { id: 3, nomor: 'SK Bupati No. 560/2024', judul: 'Portal Layanan Terpadu Kab. Tangerang', status: 'Aktif', tahun: 2024 },
  ],
};

const implementasiAPI = [
  { id: 1, tahun: 2022, nama: 'Sistem Informasi Kepegawaian (SIMPEG)', progres: 85, kategori: 'SDM', status: 'Berjalan', capaian: '17 modul aktif dari 20' },
  { id: 2, tahun: 2022, nama: 'Portal Pelayanan Publik v1.0', progres: 100, kategori: 'Layanan', status: 'Selesai', capaian: '32 layanan online tersedia' },
  { id: 3, tahun: 2022, nama: 'Integrasi Sistem Keuangan Daerah', progres: 70, kategori: 'Keuangan', status: 'Berjalan', capaian: '5 OPD terintegrasi' },
  { id: 4, tahun: 2023, nama: 'Data Center Kabupaten Tangerang', progres: 100, kategori: 'Infrastruktur', status: 'Selesai', capaian: 'Kapasitas 120 TB' },
  { id: 5, tahun: 2023, nama: 'Sistem Pengadaan Barang/Jasa Digital', progres: 90, kategori: 'Pengadaan', status: 'Berjalan', capaian: '94% proses sudah digital' },
  { id: 6, tahun: 2023, nama: 'Dashboard Monitoring OPD', progres: 75, kategori: 'Monitoring', status: 'Berjalan', capaian: '42 OPD terpantau realtime' },
  { id: 7, tahun: 2024, nama: 'Satu Data Kabupaten Tangerang', progres: 60, kategori: 'Data', status: 'Berjalan', capaian: '1.240 dataset terpublikasi' },
  { id: 8, tahun: 2024, nama: 'Aplikasi Tangerang Smart City', progres: 80, kategori: 'Layanan', status: 'Berjalan', capaian: '150k+ pengguna aktif' },
  { id: 9, tahun: 2024, nama: 'AI Chatbot Layanan Publik', progres: 45, kategori: 'Inovasi', status: 'Pengembangan', capaian: 'Fase piloting di 3 OPD' },
];

const DOMAIN_CATEGORIES = ['Kebijakan', 'Tata Kelola', 'Manajemen', 'Layanan'];
const TAHUN_OPTIONS = ['Semua', '2022', '2023', '2024'];

const KATEGORI_ICONS = {
  Kebijakan: Shield,
  'Tata Kelola': Settings,
  Manajemen: Layers,
  Layanan: Globe,
};

// ─────────────────────────────────────────────
// UTILITY COMPONENTS
// ─────────────────────────────────────────────

const SectionHeader = ({ label, title, subtitle }) => (
  <div className="text-center mb-12">
    <span className="inline-block px-3 py-1 bg-purple-600/20 border border-purple-500/30 rounded-full text-purple-400 text-xs font-semibold uppercase tracking-widest mb-4">
      {label}
    </span>
    <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">{title}</h2>
    {subtitle && <p className="text-slate-400 max-w-2xl mx-auto text-base leading-relaxed">{subtitle}</p>}
  </div>
);

const ProgressBar = ({ value }) => (
  <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
    <div
      className="h-full rounded-full transition-all duration-1000"
      style={{
        width: `${value}%`,
        background: value === 100
          ? 'linear-gradient(90deg, #10b981, #34d399)'
          : value >= 70
            ? 'linear-gradient(90deg, #8b5cf6, #a78bfa)'
            : 'linear-gradient(90deg, #f59e0b, #fbbf24)',
      }}
    />
  </div>
);

// ─────────────────────────────────────────────
// SECTION: HERO
// ─────────────────────────────────────────────

const HeroSection = () => {
  return (
    <section
      id="section-hero"
      className="relative z-0 min-h-screen flex flex-col items-center justify-center overflow-hidden"
    >
      {/* Background image */}
      <div className="absolute inset-0 -z-10 ">
        <img src={heroBg} alt="Background" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-slate-900/60" /> {/* Overlay tipis agar teks tetap terbaca */}
      </div>

      <div className="w-full px-8 md:px-16 text-left pt-32">
        <h1 className="text-4xl md:text-6xl font-extrabold text-[#f5f5f5] mb-6 leading-tight animate-fade-in-up">
          Selamat{' '}
          <span>
            Datang
          </span>
          <br />Di SPBE Kabupaten Tangerang
        </h1>
      </div>
    </section>
  );
};

// ─────────────────────────────────────────────
// SECTION: TENTANG SPBE
// ─────────────────────────────────────────────

const TABS_KEBIJAKAN = [
  { id: 'presiden', label: 'Peraturan Presiden' },
  { id: 'mentri', label: 'Peraturan Menteri' },
  { id: 'pedoman', label: 'Pedoman Menteri' },
  { id: 'walikota', label: 'Peraturan Walikota' },
  { id: 'keputusan', label: 'Keputusan Walikota' },
];

const KebijakanUI = () => {
  const [activeTab, setActiveTab] = useState('presiden');
  const [dataKebijakan, setDataKebijakan] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const memuatData = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await fetchKebijakan(activeTab);
        setDataKebijakan(result || []); 
      } catch (err) {
        setError('Gagal memuat aturan kebijakan. Silakan periksa koneksi Anda dan coba kembali sesaat lagi.');
      } finally {
        setLoading(false);
      }
    };
    memuatData();
  }, [activeTab]);

  return (
    <div className="py-16 mt-8 mb-16 bg-[#f5f5f5] border border-gray-200 rounded-3xl shadow-sm px-6">
      <div className="text-center mb-10">
        <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
          Regulasi & Kebijakan SPBE
        </h3>
        <p className="text-gray-600 max-w-2xl mx-auto text-sm">
          Kumpulan regulasi, pedoman, dan peraturan yang menjadi landasan hukum penerapan Sistem Pemerintahan Berbasis Elektronik (SPBE).
        </p>
      </div>

      {/* Tab Navigasi Kategori */}
      <div className="flex flex-wrap justify-center gap-2 mb-10">
        {TABS_KEBIJAKAN.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-full font-semibold text-xs transition-all duration-300 shadow-sm ${
                isActive
                  ? 'bg-purple-600 text-white ring-2 ring-purple-600 ring-offset-2 scale-105'
                  : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200 hover:text-purple-600'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Status Loading */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2 className="w-8 h-8 text-purple-600 animate-spin mb-3" />
          <p className="text-gray-500 text-sm font-medium">Memuat kebijakan...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl w-full max-w-xl mx-auto border border-red-100 shadow-sm text-sm text-center">
          {error}
        </div>
      ) : dataKebijakan.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-gray-400">
          <Search className="w-10 h-10 mb-3 opacity-50 text-gray-300" />
          <p className="text-sm">Belum ada data dokumen kebijakan pada kategori ini.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 text-left">
           {dataKebijakan.map((item) => (
              <div 
                 key={item.id} 
                 className="bg-white border border-gray-100 p-5 rounded-xl shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group"
              >
                 <div>
                    <div className="flex justify-between items-start mb-3">
                       <span className="bg-purple-100 text-purple-700 px-2 py-0.5 text-[10px] font-bold rounded-full">
                         Tahun {item.tahun}
                       </span>
                       <FileText className="text-gray-300 group-hover:text-purple-400 transition-colors w-4 h-4"/>
                    </div>
                    <h4 className="text-purple-600 text-xs font-bold mb-1 font-mono">
                       {item.nomor}
                    </h4>
                    <h3 className="text-gray-800 font-semibold mb-3 text-sm leading-relaxed line-clamp-3">
                       {item.judul}
                    </h3>
                 </div>
                 
                 <a 
                   href={item.link} 
                   target="_blank" 
                   rel="noopener noreferrer"
                   className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-purple-600 font-semibold border-t border-gray-50 pt-3 mt-1 transition-colors"
                 >
                   Lihat Referensi <ExternalLink size={14} />
                 </a>
              </div>
           ))}
        </div>
      )}
    </div>
  );
};

const TentangSection = () => {
  const stats = [
    { icon: Award, nilai: '3.2', satuan: '/5.0', label: 'Indeks SPBE 2023' },
    { icon: Target, nilai: '42', satuan: ' OPD', label: 'Terintegrasi' },
    { icon: Globe, nilai: '32+', satuan: '', label: 'Layanan Digital' },
    { icon: BarChart2, nilai: '150K+', satuan: '', label: 'Pengguna Aktif' },
  ];

  return (
    <section id="section-tentang" className="py-24 bg-[#f5f5f5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        {/* Tentang SPBE */}
        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
          {/* KIRI - GAMBAR */}
          <div className="flex justify-center">
            <img
              src={ilustrasiTentang}
              alt="Tentang SPBE"
              className="max-w-md w-full rounded-2xl shadow-xl transition-transform hover:scale-105"
            />
          </div>

          {/* KANAN - TEKS */}
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Apa itu SPBE?
            </h2>

            <p className="text-gray-600 leading-relaxed mb-6 text-lg">
              Berdasarkan Peraturan Presiden Nomor 95 Tahun 2018, SPBE adalah
              penyelenggaraan pemerintahan berbasis teknologi informasi dan komunikasi
              untuk meningkatkan layanan publik.
            </p>

            <div className="grid grid-cols-2 gap-3">
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-center gap-2"><CheckCircle size={16} className="text-purple-600"/> Efektivitas</li>
                <li className="flex items-center gap-2"><CheckCircle size={16} className="text-purple-600"/> Keterpaduan</li>
                <li className="flex items-center gap-2"><CheckCircle size={16} className="text-purple-600"/> Kesinambungan</li>
                <li className="flex items-center gap-2"><CheckCircle size={16} className="text-purple-600"/> Efisiensi</li>
              </ul>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-center gap-2"><CheckCircle size={16} className="text-purple-600"/> Akuntabilitas</li>
                <li className="flex items-center gap-2"><CheckCircle size={16} className="text-purple-600"/> Interoperabilitas</li>
                <li className="flex items-center gap-2"><CheckCircle size={16} className="text-purple-600"/> Keamanan</li>
              </ul>
            </div>
          </div>
        </div>

        {/* --- KOMPONEN KEBIJAKAN SPBE --- */}
        <KebijakanUI />

        {/* Dokumen API */}
        <div className="mt-16">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <FileText size={22} className="text-purple-600" />
              Dokumen &amp; Referensi
            </h3>
            <span className="text-xs text-purple-700 font-medium bg-purple-100 border border-purple-200 px-3 py-1 rounded-full">
              {dokumenAPI.filter((doc) => doc.tipe === 'PDF').length} dokumen PDF
            </span>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {dokumenAPI
              .filter((doc) => doc.tipe === 'PDF')
              .map((doc) => (
                <div
                  key={doc.id}
                  className="group bg-white border border-gray-200 rounded-xl p-5 hover:border-purple-300 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between mb-3">
                      <span className="text-xs font-bold px-2 py-0.5 rounded bg-red-100 text-red-600">
                        {doc.tipe}
                      </span>
                      <span className="text-xs text-slate-500 font-medium">{doc.ukuran}</span>
                    </div>
                    <h4 className="text-gray-800 text-sm font-semibold mb-2 group-hover:text-purple-600 transition-colors">
                      {doc.judul}
                    </h4>
                    <p className="text-xs text-slate-500 mb-4">{doc.tanggal} · {doc.kategori}</p>
                  </div>
                  <div className="border-t border-gray-100 pt-3 mt-2">
                    <a
                      href={doc.link || "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-medium text-purple-600 hover:text-purple-700 transition-colors"
                    >
                      <Eye size={14} /> Lihat PDF
                    </a>
                  </div>
                </div>
              ))}
          </div>
        </div>

      </div>
    </section>
  );
};

// ─────────────────────────────────────────────
// SECTION: DOMAIN
// ─────────────────────────────────────────────

const DomainSection = ({ activeFilter, setActiveFilter }) => {
  const peraturan = peraturanAPI[activeFilter] || [];
  const Icon = KATEGORI_ICONS[activeFilter] || Shield;

  const colorMap = {
    Kebijakan: 'from-purple-600 to-violet-600',
    'Tata Kelola': 'from-blue-600 to-cyan-600',
    Manajemen: 'from-indigo-600 to-blue-600',
    Layanan: 'from-emerald-600 to-teal-600',
  };

  const badgeColor = {
    Kebijakan: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    'Tata Kelola': 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    Manajemen: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
    Layanan: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
  };

  return (
    <section id="section-domain" className="py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <SectionHeader
          label="Regulasi &amp; Domain"
          title="Domain SPBE"
          subtitle="Ikuti perkembangan regulasi dan kebijakan dalam setiap domain penyelenggaraan SPBE Kabupaten Tangerang."
        />

        {/* Filter Tabs */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {DOMAIN_CATEGORIES.map((cat) => {
            const CatIcon = KATEGORI_ICONS[cat];
            const isActive = activeFilter === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveFilter(cat)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 ${isActive
                    ? `bg-gradient-to-r ${colorMap[cat]} text-white shadow-lg scale-105`
                    : 'bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 hover:text-white'
                  }`}
              >
                <CatIcon size={15} />
                {cat}
                <span className={`text-xs px-1.5 py-0.5 rounded-full border ${isActive ? 'bg-white/20 border-white/20 text-white' : badgeColor[cat]}`}>
                  {peraturanAPI[cat].length}
                </span>
              </button>
            );
          })}
        </div>

        {/* Active category header */}
        <div className={`flex items-center gap-3 mb-6 p-4 bg-gradient-to-r ${colorMap[activeFilter]}/10 border border-white/10 rounded-xl`}>
          <div className={`p-2 bg-gradient-to-r ${colorMap[activeFilter]} rounded-lg`}>
            <Icon size={20} className="text-white" />
          </div>
          <div>
            <h3 className="text-white font-bold">{activeFilter}</h3>
            <p className="text-slate-400 text-xs">{peraturan.length} peraturan ditemukan</p>
          </div>
        </div>

        {/* Peraturan list */}
        <div className="grid gap-3">
          {peraturan.map((p, i) => (
            <div
              key={p.id}
              className="group flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/5 border border-white/10 rounded-xl p-5 hover:bg-white/8 hover:border-purple-500/20 hover:shadow-lg hover:shadow-purple-900/10 transition-all duration-300"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <div className="flex items-start gap-4">
                <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-xs font-bold text-slate-400">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div>
                  <p className="text-xs text-purple-400 font-mono mb-1">{p.nomor}</p>
                  <h4 className="text-white text-sm font-semibold group-hover:text-purple-200 transition-colors">{p.judul}</h4>
                </div>
              </div>
              <div className="flex items-center gap-3 sm:flex-shrink-0">
                <span className="text-xs text-slate-500">{p.tahun}</span>
                <span className="text-xs px-2 py-1 bg-emerald-500/15 border border-emerald-500/20 text-emerald-400 rounded-full">
                  {p.status}
                </span>
                <button className="text-slate-500 hover:text-purple-400 transition-colors">
                  <ExternalLink size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ─────────────────────────────────────────────
// SECTION: IMPLEMENTASI SPBE
// ─────────────────────────────────────────────

const ImplementasiSection = () => {
  const [selectedTahun, setSelectedTahun] = useState('Semua');
  const [sortBy, setSortBy] = useState('progres'); // 'progres' | 'nama'

  const filtered = implementasiAPI
    .filter((item) => selectedTahun === 'Semua' || String(item.tahun) === selectedTahun)
    .sort((a, b) => {
      if (sortBy === 'progres') return b.progres - a.progres;
      return a.nama.localeCompare(b.nama);
    });

  const summary = {
    Selesai: implementasiAPI.filter((i) => i.status === 'Selesai').length,
    Berjalan: implementasiAPI.filter((i) => i.status === 'Berjalan').length,
    Pengembangan: implementasiAPI.filter((i) => i.status === 'Pengembangan').length,
  };

  const statusColor = {
    Selesai: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    Berjalan: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    Pengembangan: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  };

  return (
    <section id="section-implementasi" className="py-24 bg-[#f5f5f5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <SectionHeader
          label="Progres &amp; Capaian"
          title="Implementasi SPBE"
          subtitle="Pantau perkembangan implementasi sistem pemerintahan berbasis elektronik di Kabupaten Tangerang."
        />

        {/* Summary cards */}
        <div className="grid grid-cols-3 gap-4 mb-10">
          {Object.entries(summary).map(([status, count]) => (
            <div key={status} className="bg-white/5 border border-white/10 rounded-2xl p-5 text-center hover:border-purple-500/20 transition-colors">
              <div className="text-3xl font-extrabold text-white mb-1">{count}</div>
              <div className={`inline-block text-xs px-2 py-0.5 rounded-full border ${statusColor[status]}`}>{status}</div>
            </div>
          ))}
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          {/* Tahun filter */}
          <div className="flex items-center gap-2 flex-wrap">
            <Filter size={15} className="text-slate-400" />
            <span className="text-slate-400 text-sm mr-1">Tahun:</span>
            {TAHUN_OPTIONS.map((t) => (
              <button
                key={t}
                onClick={() => setSelectedTahun(t)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${selectedTahun === t
                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/20'
                    : 'bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10'
                  }`}
              >
                {t !== 'Semua' && <Calendar size={12} />}
                {t}
              </button>
            ))}
          </div>
          {/* Sort */}
          <div className="flex items-center gap-2">
            <TrendingUp size={15} className="text-slate-400" />
            <span className="text-slate-400 text-sm">Urutkan:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-white/5 border border-white/10 text-slate-300 text-sm rounded-lg px-3 py-1.5 focus:outline-none focus:border-purple-500 cursor-pointer"
            >
              <option value="progres" className="bg-slate-800">Progres (Tertinggi)</option>
              <option value="nama" className="bg-slate-800">Nama (A–Z)</option>
            </select>
          </div>
        </div>

        {/* Items */}
        <div className="grid gap-4">
          {filtered.length === 0 && (
            <div className="text-center text-slate-500 py-16">
              Tidak ada data untuk tahun {selectedTahun}.
            </div>
          )}
          {filtered.map((item, i) => (
            <div
              key={item.id}
              className="group bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/8 hover:border-purple-500/20 hover:shadow-xl hover:shadow-purple-900/10 transition-all duration-300"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs px-2 py-0.5 bg-white/10 border border-white/10 text-slate-400 rounded-full">
                      {item.tahun}
                    </span>
                    <span className="text-xs text-slate-500">{item.kategori}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full border ${statusColor[item.status]}`}>
                      {item.status}
                    </span>
                  </div>
                  <h4 className="text-white font-semibold mb-1 group-hover:text-purple-200 transition-colors">
                    {item.nama}
                  </h4>
                  <p className="text-slate-500 text-xs">{item.capaian}</p>
                </div>
                <div className="sm:text-right sm:flex-shrink-0">
                  <span className="text-2xl font-extrabold text-white">{item.progres}%</span>
                  <p className="text-xs text-slate-500">progres</p>
                </div>
              </div>
              <div className="mt-4">
                <ProgressBar value={item.progres} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ─────────────────────────────────────────────
// HOME PAGE
// ─────────────────────────────────────────────

const Home = ({ domainFilter, setDomainFilter }) => {
  const [activeFilter, setActiveFilter] = useState('Kebijakan');

  // When Header dropdown passes a filter, sync it here
  useEffect(() => {
    if (domainFilter) {
      setActiveFilter(domainFilter);
      setDomainFilter(null); // reset after consumed
    }
  }, [domainFilter, setDomainFilter]);

  return (
    <div className="min-h-screen bg-[#f5f5f5] text-white">
      <HeroSection />
      <TentangSection />
      <DomainSection activeFilter={activeFilter} setActiveFilter={setActiveFilter} />
      <ImplementasiSection />
    </div>
  );
};

export default Home;
