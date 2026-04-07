import React from "react";
import smartcityImg from "../assets/smartcity.png";
import reactImg from "../assets/react.svg";

// Inline SVG icons for social media (lucide-react removed brand icons in v1)
const TwitterIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
    <path d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 1.09.05 1.593.149v3.295a6.5 6.5 0 0 0-.985-.05c-1.394 0-1.928.527-1.928 1.9v2.264h2.737l-.47 3.667h-2.267v8.133c5.024-.803 8.861-5.164 8.861-10.411C22.5 6.357 17.851 1.708 12.159 1.708S1.309 6.357 1.309 12.233c0 5.16 3.712 9.46 8.592 10.359z" />
  </svg>
);

const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
  </svg>
);

const YoutubeIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);

const TiktokIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 1 1-2.31-2.83V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 1 0 15.86 15.67v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.10z" />
  </svg>
);

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-slate-300 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-10">

        {/* Logo & Alamat */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-4 mb-2">
            <img
              src={smartcityImg}
              alt="Logo Smart City"
              className="h-16 w-auto rounded-lg shadow-lg shadow-purple-500/10"
            />
            <img
              src={reactImg}
              alt="Logo React"
              className="h-14 w-auto"
            />
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-1">
              Alamat
            </h4>
            <p className="text-slate-400 text-sm leading-relaxed">
              Jl. H. Somawinata No.1, Gedung Smart Building Puspemkab Tangerang,
              Kec. Tigaraksa, Kabupaten Tangerang, Banten 15720, Indonesia
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-1">
              Kontak
            </h4>
            <p className="text-slate-400 text-sm">+62 811-10310632</p>
            <p className="text-slate-400 text-sm">
              Email:{" "}
              <a
                href="mailto:diskominfo@tangerangkab.go.id"
                className="text-purple-400 hover:text-purple-300 transition-colors"
              >
                diskominfo@tangerangkab.go.id
              </a>
            </p>
          </div>
        </div>

        {/* Sosial Media */}
        <div className="flex flex-col items-center md:items-start gap-4">
          <h4 className="text-white font-semibold text-sm uppercase tracking-wider">
            Temukan Kami di Sosial Media
          </h4>
          <div className="flex items-center gap-3">
            <a
              href="https://x.com/pemkabtangerang"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 bg-white/5 border border-white/10 rounded-xl text-slate-400 
                         hover:text-white hover:bg-purple-600/20 hover:border-purple-500/50 
                         transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-purple-500/20"
            >
              <TwitterIcon />
            </a>

            <a
              href="https://facebook.com/pemkabtangerang"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 bg-white/5 border border-white/10 rounded-xl text-slate-400 
                         hover:text-white hover:bg-blue-600/20 hover:border-blue-500/50 
                         transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-blue-500/20"
            >
              <FacebookIcon />
            </a>

            <a
              href="https://www.tiktok.com/@pemkabtangerang"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 bg-white/5 border border-white/10 rounded-xl text-slate-400 
                         hover:text-white hover:bg-pink-600/20 hover:border-pink-500/50 
                         transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-pink-500/20"
            >
              <TiktokIcon />
            </a>

            <a
              href="https://instagram.com/pemkabtangerang"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 bg-white/5 border border-white/10 rounded-xl text-slate-400 
                         hover:text-white hover:bg-gradient-to-br hover:from-purple-600/20 hover:to-pink-600/20 
                         hover:border-pink-500/50 transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-pink-500/20"
            >
              <InstagramIcon />
            </a>

            <a
              href="https://youtube.com/@pemkabtangerang"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 bg-white/5 border border-white/10 rounded-xl text-slate-400 
                         hover:text-white hover:bg-red-600/20 hover:border-red-500/50 
                         transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-red-500/20"
            >
              <YoutubeIcon />
            </a>
          </div>
        </div>

        {/* Informasi */}
        <div className="flex flex-col gap-4">
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-1">
              Jam Operasional Pelayanan
            </h4>
            <p className="text-slate-400 text-sm">
              Senin - Jumat: 07.30 - 16.30 WIB
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-1">
              Website Resmi
            </h4>
            <a
              href="https://diskominfo.tangerangkab.go.id"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-purple-400 hover:text-purple-300 
                         transition-colors text-sm group"
            >
              diskominfo.tangerangkab.go.id
              <svg
                className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
              </svg>
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-2">
          <p className="text-slate-500 text-xs">
            © {new Date().getFullYear()} Dinas Komunikasi dan Informatika Kabupaten Tangerang. All rights reserved.
          </p>
          <p className="text-slate-600 text-xs">
            Built with React &amp; Tailwind CSS
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
