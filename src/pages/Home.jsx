import React, { useState, useEffect, useRef } from 'react';
import {
  FileText, BookOpen, Shield, Settings, Layers, Globe,
  ChevronRight, Filter, Calendar, TrendingUp, CheckCircle,
  ArrowRight, ExternalLink, Star, Award, Target, BarChart2,
  Download, Eye
} from 'lucide-react';

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
    <span className="inline-block px-3 py-1 bg-[#0057A4]/20 border border-[#0057A4]/30 rounded-full text-[#0057A4] text-xs font-semibold uppercase tracking-widest mb-4">
      {label}
    </span>
    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">{title}</h2>
    {subtitle && <p className="text-slate-500 max-w-2xl mx-auto text-base leading-relaxed">{subtitle}</p>}
  </div>
);

const ProgressBar = ({ value }) => (
  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
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
  const scrollToTentang = () => {
    document.getElementById('section-tentang')?.scrollIntoView({ behavior: 'smooth' });
  };

  const stats = [
    { icon: Award, nilai: '3.2', satuan: '/5.0', label: 'Indeks SPBE 2023' },
    { icon: Target, nilai: '42', satuan: ' OPD', label: 'Terintegrasi' },
    { icon: Globe, nilai: '32+', satuan: '', label: 'Layanan Digital' },
    { icon: BarChart2, nilai: '150K+', satuan: '', label: 'Pengguna Aktif' },
  ];

  return (
    <section id="section-hero" className="relative w-full bg-slate-50 overflow-hidden pb-16">
      {/* Top Background - Requested Color #0057A4 */}
      <div className="absolute top-0 left-0 w-full h-[40%] sm:h-[45%] lg:h-[48%] bg-[#0057A4] border-b border-[#004b8d] z-0"></div>

      <div className="relative z-10 flex flex-col items-center pt-32 px-4 max-w-6xl mx-auto">
        
        {/* Text Content Above Image */}
        <div className="text-center max-w-4xl mx-auto mb-10">
          <h1 className="text-2xl md:text-4xl lg:text-5xl font-extrabold text-white mb-5 leading-tight animate-fade-in-up">
            Selamat Datang di SPBE Kabupaten Tangerang
          </h1>
          
          <p className="text-sm md:text-lg text-blue-50 max-w-3xl mx-auto leading-relaxed animate-fade-in-up delay-200">
            Transformasi digital pemerintahan menuju pelayanan publik yang lebih cepat, transparan, dan berdaya saing melalui integrasi teknologi informasi
          </p>
        </div>

        {/* Center Image intersecting backgrounds */}
        <div className="w-full max-w-4xl relative mb-16 shadow-2xl rounded-2xl ring-4 ring-white/50 bg-white p-2 animate-smooth-float animate-pulse-glow">
          <img 
            src="/beranda.svg" 
            alt="Beranda SPBE Kabupaten Tangerang" 
            className="w-full h-auto object-contain object-center max-h-[500px] rounded-xl"
          />
        </div>

        {/* Actions & Stats Below Image */}
        <div className="max-w-5xl mx-auto w-full animate-fade-in-up delay-300">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <button
              onClick={scrollToTentang}
              className="flex items-center gap-2 px-7 py-3.5 bg-gradient-to-r from-[#0057A4] to-[#00478F] text-white rounded-xl font-semibold shadow-lg shadow-[#0057A4]/30 hover:shadow-[#0057A4]/50 hover:scale-105 transition-all duration-300"
            >
              Pelajari SPBE <ArrowRight size={18} />
            </button>
            <button
              onClick={() => document.getElementById('section-domain')?.scrollIntoView({ behavior: 'smooth' })}
              className="flex items-center gap-2 px-7 py-3.5 bg-white shadow-sm border border-slate-200 text-slate-700 rounded-xl font-semibold hover:bg-slate-50 transition-all duration-300"
            >
              Lihat Regulasi <ChevronRight size={18} />
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map(({ icon: Icon, nilai, satuan, label }) => (
              <div
                key={label}
                className="bg-white shadow-sm border border-slate-200 rounded-2xl p-5 hover:bg-slate-50 hover:border-[#0057A4]/30 transition-all duration-300 group text-center"
              >
                <Icon size={24} className="text-[#0057A4] mb-3 mx-auto group-hover:scale-110 transition-transform" />
                <div className="text-3xl font-bold text-slate-900 mb-1">
                  {nilai}<span className="text-[#0057A4] text-base">{satuan}</span>
                </div>
                <div className="text-sm font-medium text-slate-500">{label}</div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

// ─────────────────────────────────────────────
// SECTION: TENTANG SPBE
// ─────────────────────────────────────────────

const TentangSection = () => {
  return (
    <section id="section-tentang" className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <SectionHeader
          label="Tentang Kami"
          title="Apa itu SPBE?"
          subtitle="Sistem Pemerintahan Berbasis Elektronik adalah penyelenggaraan pemerintahan yang memanfaatkan teknologi informasi dan komunikasi untuk memberikan layanan kepada pengguna SPBE."
        />

        {/* Deskripsi + poin */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <div className="bg-white shadow-sm border border-slate-200 rounded-2xl p-7 hover:border-[#0057A4]/30 transition-colors">
            <BookOpen size={28} className="text-[#0057A4] mb-4" />
            <h3 className="text-xl font-bold text-slate-900 mb-3">Latar Belakang</h3>
            <p className="text-slate-500 text-sm leading-relaxed mb-4">
              Kabupaten Tangerang berkomitmen menjalankan amanat Peraturan Presiden Nomor 95 Tahun 2018
              tentang SPBE. Melalui SPBE, pemerintah daerah mendorong pemanfaatan teknologi untuk
              mewujudkan birokrasi berkelas dunia yang efisien, efektif, dan akuntabel.
            </p>
            <p className="text-slate-500 text-sm leading-relaxed">
              SPBE Kabupaten Tangerang dikelola oleh Dinas Komunikasi dan Informatika (Diskominfo)
              sebagai koordinator pengembangan dan evaluasi transformasi digital di seluruh Organisasi
              Perangkat Daerah (OPD).
            </p>
          </div>

          <div className="bg-white shadow-sm border border-slate-200 rounded-2xl p-7 hover:border-[#0057A4]/30 transition-colors">
            <Target size={28} className="text-blue-400 mb-4" />
            <h3 className="text-xl font-bold text-slate-900 mb-3">Tujuan SPBE</h3>
            <ul className="space-y-3">
              {[
                'Mewujudkan tata kelola pemerintahan yang bersih dan transparan',
                'Meningkatkan kualitas pelayanan publik berbasis digital',
                'Mendorong efisiensi dan efektivitas penyelenggaraan pemerintahan',
                'Mengintegrasikan sistem informasi di seluruh OPD',
                'Menjamin keamanan data dan informasi pemerintah daerah',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2.5 text-slate-500 text-sm">
                  <CheckCircle size={16} className="text-emerald-400 flex-shrink-0 mt-0.5" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Dokumen API */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <FileText size={22} className="text-[#0057A4]" />
              Dokumen &amp; Referensi
            </h3>
            <span className="text-xs text-slate-600 bg-white shadow-sm border border-slate-200 px-3 py-1 rounded-full">
              {dokumenAPI.length} dokumen tersedia
            </span>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {dokumenAPI.map((doc) => (
              <div
                key={doc.id}
                className="group bg-white shadow-sm border border-slate-200 rounded-xl p-5 hover:bg-slate-50 hover:border-[#0057A4]/30 hover:shadow-lg hover:shadow-[#0057A4]/20 transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-3">
                  <span
                    className={`text-xs font-bold px-2 py-0.5 rounded ${
                      doc.tipe === 'PDF'
                        ? 'bg-red-500/20 text-red-400'
                        : doc.tipe === 'YAML'
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-blue-500/20 text-blue-400'
                    }`}
                  >
                    {doc.tipe}
                  </span>
                  <span className="text-xs text-slate-600">{doc.ukuran}</span>
                </div>
                <h4 className="text-slate-900 text-sm font-semibold mb-1 group-hover:text-[#0057A4] transition-colors">
                  {doc.judul}
                </h4>
                <p className="text-xs text-slate-600 mb-4">{doc.tanggal} · {doc.kategori}</p>
                <div className="flex gap-2">
                  <button className="flex items-center gap-1 text-xs text-[#0057A4] hover:text-[#0057A4] transition-colors">
                    <Eye size={12} /> Lihat
                  </button>
                  <span className="text-slate-700">·</span>
                  <button className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-900 transition-colors">
                    <Download size={12} /> Unduh
                  </button>
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
    Kebijakan: 'from-[#0057A4] to-[#00478F]',
    'Tata Kelola': 'from-blue-600 to-cyan-600',
    Manajemen: 'from-indigo-600 to-blue-600',
    'Tata Kelola': 'from-[#0057A4] to-[#00478F]',
    Manajemen: 'from-[#0057A4] to-[#00478F]',
    Layanan: 'from-[#0057A4] to-[#00478F]',
  };

  const badgeColor = {
    Kebijakan: 'bg-[#0057A4]/20 text-[#0057A4] border-[#0057A4]/30',
    'Tata Kelola': 'bg-[#0057A4]/20 text-[#0057A4] border-[#0057A4]/30',
    Manajemen: 'bg-[#0057A4]/20 text-[#0057A4] border-[#0057A4]/30',
    Layanan: 'bg-[#0057A4]/20 text-[#0057A4] border-[#0057A4]/30',
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
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 ${
                  isActive
                    ? `bg-gradient-to-r ${colorMap[cat]} text-white shadow-lg scale-105`
                    : 'bg-white shadow-sm border border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900'
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
        <div className={`flex items-center gap-3 mb-6 p-4 bg-gradient-to-r ${colorMap[activeFilter]}/10 border border-slate-200 rounded-xl`}>
          <div className={`p-2 bg-gradient-to-r ${colorMap[activeFilter]} rounded-lg`}>
            <Icon size={20} className="text-slate-900" />
          </div>
          <div>
            <h3 className="text-slate-900 font-bold">{activeFilter}</h3>
            <p className="text-slate-500 text-xs">{peraturan.length} peraturan ditemukan</p>
          </div>
        </div>

        {/* Peraturan list */}
        <div className="grid gap-3">
          {peraturan.map((p, i) => (
            <div
              key={p.id}
              className="group flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white shadow-sm border border-slate-200 rounded-xl p-5 hover:bg-slate-50 hover:border-[#0057A4]/20 hover:shadow-lg hover:shadow-[#0057A4]/10 transition-all duration-300"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <div className="flex items-start gap-4">
                <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-white shadow-sm border border-slate-200 flex items-center justify-center text-xs font-bold text-slate-500">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div>
                  <p className="text-xs text-[#0057A4] font-mono mb-1">{p.nomor}</p>
                  <h4 className="text-slate-900 text-sm font-semibold group-hover:text-[#0057A4] transition-colors">{p.judul}</h4>
                </div>
              </div>
              <div className="flex items-center gap-3 sm:flex-shrink-0">
                <span className="text-xs text-slate-600">{p.tahun}</span>
                <span className="text-xs px-2 py-1 bg-emerald-500/15 border border-emerald-500/20 text-emerald-400 rounded-full">
                  {p.status}
                </span>
                <button className="text-slate-600 hover:text-[#0057A4] transition-colors">
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
    <section id="section-implementasi" className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <SectionHeader
          label="Progres &amp; Capaian"
          title="Implementasi SPBE"
          subtitle="Pantau perkembangan implementasi sistem pemerintahan berbasis elektronik di Kabupaten Tangerang."
        />

        {/* Summary cards */}
        <div className="grid grid-cols-3 gap-4 mb-10">
          {Object.entries(summary).map(([status, count]) => (
            <div key={status} className="bg-white shadow-sm border border-slate-200 rounded-2xl p-5 text-center hover:border-[#0057A4]/20 transition-colors">
              <div className="text-3xl font-extrabold text-slate-900 mb-1">{count}</div>
              <div className={`inline-block text-xs px-2 py-0.5 rounded-full border ${statusColor[status]}`}>{status}</div>
            </div>
          ))}
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          {/* Tahun filter */}
          <div className="flex items-center gap-2 flex-wrap">
            <Filter size={15} className="text-slate-500" />
            <span className="text-slate-500 text-sm mr-1">Tahun:</span>
            {TAHUN_OPTIONS.map((t) => (
              <button
                key={t}
                onClick={() => setSelectedTahun(t)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  selectedTahun === t
                    ? 'bg-[#0057A4] text-slate-900 shadow-lg shadow-[#0057A4]/20'
                    : 'bg-white shadow-sm border border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                {t !== 'Semua' && <Calendar size={12} />}
                {t}
              </button>
            ))}
          </div>
          {/* Sort */}
          <div className="flex items-center gap-2">
            <TrendingUp size={15} className="text-slate-500" />
            <span className="text-slate-500 text-sm">Urutkan:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-white shadow-sm border border-slate-200 text-slate-600 text-sm rounded-lg px-3 py-1.5 focus:outline-none focus:border-[#0057A4] cursor-pointer"
            >
              <option value="progres" className="bg-white">Progres (Tertinggi)</option>
              <option value="nama" className="bg-white">Nama (A–Z)</option>
            </select>
          </div>
        </div>

        {/* Items */}
        <div className="grid gap-4">
          {filtered.length === 0 && (
            <div className="text-center text-slate-600 py-16">
              Tidak ada data untuk tahun {selectedTahun}.
            </div>
          )}
          {filtered.map((item, i) => (
            <div
              key={item.id}
              className="group bg-white shadow-sm border border-slate-200 rounded-2xl p-6 hover:bg-slate-50 hover:border-[#0057A4]/20 hover:shadow-xl hover:shadow-[#0057A4]/10 transition-all duration-300"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs px-2 py-0.5 bg-slate-100 border border-slate-200 text-slate-500 rounded-full">
                      {item.tahun}
                    </span>
                    <span className="text-xs text-slate-600">{item.kategori}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full border ${statusColor[item.status]}`}>
                      {item.status}
                    </span>
                  </div>
                  <h4 className="text-slate-900 font-semibold mb-1 group-hover:text-[#0057A4] transition-colors">
                    {item.nama}
                  </h4>
                  <p className="text-slate-600 text-xs">{item.capaian}</p>
                </div>
                <div className="sm:text-right sm:flex-shrink-0">
                  <span className="text-2xl font-extrabold text-slate-900">{item.progres}%</span>
                  <p className="text-xs text-slate-600">progres</p>
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
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <HeroSection />
      <TentangSection />
      <DomainSection activeFilter={activeFilter} setActiveFilter={setActiveFilter} />
      <ImplementasiSection />
    </div>
  );
};

export default Home;
