import { useState, useCallback, useMemo, useEffect } from "react";
import { Mail, User, FileText, MessageSquare, ShieldCheck, RefreshCw, X, CheckCircle2 } from "lucide-react";
import ReCAPTCHA from "react-google-recaptcha";

/* ═══════════════════════════════════════════════════════════════════════════
   Helpers
   ═══════════════════════════════════════════════════════════════════════════ */
const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const isXSSPattern = (str) => /<script>|javascript:|onerror=|onclick=|iframe/i.test(str);
const isValidName = (str) => str.length <= 50 && /^[a-zA-Z0-9\s.\'-]+$/.test(str);
const countWords = (str) => str.trim().split(/\s+/).filter(Boolean).length;

/* ═══════════════════════════════════════════════════════════════════════════
   ContactForm Component
   ═══════════════════════════════════════════════════════════════════════════ */
export const ContactForm = () => {
  // ── Form state ──
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    subject: "",
    message: "",
  });

  // ── UI state ──
  const [showModal, setShowModal] = useState(false);
  const [recaptchaToken, setRecaptchaToken] = useState("");
  const [buttonLabel, setButtonLabel] = useState("Send Email");
  const [isVerified, setIsVerified] = useState(false);
  const [cooldown, setCooldown] = useState(0); // Anti-spam countdown timer
  const [submitError, setSubmitError] = useState("");

  // Anti-spam countdown logic
  useEffect(() => {
    let timer;
    if (cooldown > 0) {
      setButtonLabel(`Kirim ulang dalam ${cooldown} detik...`);
      timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
    } else if (cooldown === 0 && buttonLabel.includes("Kirim ulang dalam")) {
      setButtonLabel("Send Email");
    }
    return () => clearTimeout(timer);
  }, [cooldown, buttonLabel]);

  // ── Data Validation ──
  const validationErrors = useMemo(() => {
    const errs = { username: "", email: "", subject: "", message: "", xss: "" };
    
    // Check XSS first for early termination warning
    const allInput = Object.values(formData).join(" ");
    if (isXSSPattern(allInput)) {
      errs.xss = "Input mengandung karakter atau pola yang tidak diperbolehkan.";
    }

    if (formData.username.trim() === "") {
      errs.username = "Nama wajib diisi.";
    } else if (formData.username.length > 50) {
      errs.username = "Maksimal 50 karakter.";
    } else if (!isValidName(formData.username)) {
      errs.username = "Hanya menerima huruf, angka, spasi, titik, apostrof, dan tanda hubung.";
    }

    if (formData.email.trim() === "") {
      errs.email = "Email wajib diisi.";
    } else if (!isValidEmail(formData.email)) {
      errs.email = "Format email tidak valid.";
    }

    const subjectWords = countWords(formData.subject);
    if (formData.subject.trim() === "") {
      errs.subject = "Subjek wajib diisi.";
    } else if (subjectWords > 50) {
      errs.subject = "Subjek maksimal 50 kata.";
    }

    const messageWords = countWords(formData.message);
    if (formData.message.trim() === "") {
      errs.message = "Pesan wajib diisi.";
    } else if (messageWords > 100) {
      errs.message = "Pesan maksimal 100 kata.";
    }

    return errs;
  }, [formData]);

  const isFormValid =
    !validationErrors.xss &&
    !validationErrors.username &&
    !validationErrors.email &&
    !validationErrors.subject &&
    !validationErrors.message &&
    cooldown === 0;

  // ── Derived: Is verification modal valid? ──
  const isVerifyReady = useMemo(
    () => !!recaptchaToken,
    [recaptchaToken]
  );

  // ── Handlers ──
  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  const openModal = useCallback(() => {
    if (validationErrors.xss) {
      setSubmitError(validationErrors.xss);
      return;
    }
    setSubmitError("");
    setRecaptchaToken("");
    setShowModal(true);
  }, [validationErrors.xss]);

  const closeModal = useCallback(() => {
    setShowModal(false);
  }, []);

  const handleVerifyAndSend = useCallback(() => {
    if (!recaptchaToken) {
      return;
    }

    // ── Pre-Submit XSS Double Check ──
    const allInput = Object.values(formData).join(" ");
    if (isXSSPattern(allInput)) {
      setShowModal(false);
      setSubmitError("Permintaan ditolak: Input mengandung karakter atau pola yang tidak diperbolehkan.");
      return;
    }

    // ── Close modal ──
    setShowModal(false);
    setIsVerified(true);
    setButtonLabel("Mengirim...");

    const formspreeUrl = import.meta.env.VITE_FORMSPREE_URL || '';

    if (!formspreeUrl || formspreeUrl.includes('ganti_dengan_id_anda')) {
      alert("⚠️ Mohon isi VITE_FORMSPREE_URL di file .env terlebih dahulu!");
      setButtonLabel("Send Email");
      setIsVerified(false);
      return;
    }

    // Gunakan trik proxy untuk membodohi Antivirus
    const proxyUrl = formspreeUrl.replace('https://formspree.io', '/api/formspree');

    fetch(proxyUrl, {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        nama: formData.username,
        email: formData.email,
        subjek: formData.subject,
        pesan: formData.message,
        "g-recaptcha-response": recaptchaToken
      })
    })
    .then(async (response) => {
      if (response.ok) {
        setButtonLabel("✓ Berhasil Terkirim");
        alert(
          `✅ Email berhasil dikirim!\n\nDari: ${formData.username} (${formData.email})\nSubjek: ${formData.subject}`
        );
        
        setTimeout(() => {
          setFormData({ username: "", email: "", subject: "", message: "" });
          setIsVerified(false);
          setRecaptchaToken("");
          setCooldown(5); // Anti spam cooldown
        }, 2000);
      } else {
        const data = await response.json().catch(() => ({}));
        setButtonLabel("❌ Gagal");
        alert(`❌ Gagal mengirim pesan. Pastikan URL Formspree benar.`);
        
        setTimeout(() => {
          setButtonLabel("Send Email");
          setIsVerified(false);
          setRecaptchaToken("");
        }, 2000);
      }
    })
    .catch((error) => {
      setButtonLabel("❌ Gagal");
      alert(`❌ Koneksi Terputus. Pastikan internet Anda aktif.`);
      
      setTimeout(() => {
        setButtonLabel("Send Email");
        setIsVerified(false);
        setRecaptchaToken("");
      }, 2000);
    });
  }, [recaptchaToken, formData]);

  // ── Close modal on Escape key ──
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") closeModal();
    };
    if (showModal) window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [showModal, closeModal]);

  /* ═════════════════════════════════════════════════════════════════════════
     Render
     ═════════════════════════════════════════════════════════════════════════ */
  return (
    <section id="contact-form" className="py-16">
      <div className="max-w-lg mx-auto p-6 sm:p-8 bg-card shadow-xl border border-border rounded-2xl relative overflow-hidden">
        {/* ── Decorative top accent ── */}
        <div className="absolute top-0 left-0 right-0 h-1.5 gradient-primary" />

        {/* ── Header ── */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl gradient-primary text-primary-foreground mb-4">
            <Mail className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-bold text-foreground">
            Hubungi <span className="text-gradient">Diskominfo</span>
          </h2>
          <p className="text-sm text-muted-foreground mt-2">
            Kirim pesan kepada Dinas Komunikasi dan Informatika Kabupaten
            Tangerang
          </p>
        </div>

        {submitError && (
          <div className="mb-4 p-3 rounded-lg bg-destructive/10 border border-destructive/30 text-destructive text-sm flex items-start gap-2">
            <X className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <p>{submitError}</p>
          </div>
        )}

        {/* ═══════════════ TAHAP 1: FORMULIR UTAMA ═══════════════ */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (isFormValid) openModal();
          }}
          className="space-y-5"
        >
          {/* Username */}
          <div className="space-y-1.5">
            <label
              htmlFor="cf-username"
              className="text-sm font-semibold text-foreground flex items-center justify-between"
            >
              <span className="flex items-center gap-1.5">
                <User className="w-4 h-4 text-primary" />
                Username
              </span>
              <span className="text-xs font-normal text-muted-foreground">{formData.username.length}/50</span>
            </label>
            <input
              id="cf-username"
              type="text"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              maxLength={50}
              placeholder="Masukkan nama lengkap"
              className={`w-full px-4 py-2.5 rounded-xl border bg-background text-foreground text-sm
                         placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent
                         transition-all duration-200 ${validationErrors.username && formData.username ? 'border-destructive' : 'border-input'}`}
            />
            {formData.username && validationErrors.username && (
              <p className="text-xs text-destructive mt-1 flex items-center gap-1">
                <X className="w-3 h-3" /> {validationErrors.username}
              </p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <label
              htmlFor="cf-email"
              className="text-sm font-semibold text-foreground flex items-center gap-1.5"
            >
              <Mail className="w-4 h-4 text-primary" />
              Email
            </label>
            <input
              id="cf-email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="contoh@email.com"
              className={`w-full px-4 py-2.5 rounded-xl border bg-background text-foreground text-sm
                         placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent
                         transition-all duration-200 ${validationErrors.email && formData.email ? 'border-destructive' : 'border-input'}`}
            />
            {formData.email && validationErrors.email && (
              <p className="text-xs text-destructive mt-1 flex items-center gap-1">
                <X className="w-3 h-3" /> {validationErrors.email}
              </p>
            )}
          </div>

          {/* Subjek */}
          <div className="space-y-1.5">
            <label
              htmlFor="cf-subject"
              className="text-sm font-semibold text-foreground flex items-center justify-between"
            >
              <span className="flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-primary" />
                Subjek
              </span>
              <span className={`text-xs font-normal ${countWords(formData.subject) > 50 ? 'text-destructive font-bold' : 'text-muted-foreground'}`}>
                {countWords(formData.subject)}/50 kata
              </span>
            </label>
            <input
              id="cf-subject"
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleInputChange}
              placeholder="Subjek pesan Anda"
              className={`w-full px-4 py-2.5 rounded-xl border bg-background text-foreground text-sm
                         placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent
                         transition-all duration-200 ${validationErrors.subject && formData.subject ? 'border-destructive' : 'border-input'}`}
            />
            {formData.subject && countWords(formData.subject) > 50 && (
              <p className="text-xs text-destructive mt-1 flex items-center gap-1">
                <X className="w-3 h-3" /> Subjek Anda melebih batas 50 kata.
              </p>
            )}
          </div>

          {/* Pesan */}
          <div className="space-y-1.5">
            <label
              htmlFor="cf-message"
              className="text-sm font-semibold text-foreground flex items-center justify-between"
            >
              <span className="flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4 text-primary" />
                Pesan
              </span>
              <span className={`text-xs font-normal ${countWords(formData.message) > 100 ? 'text-destructive font-bold' : 'text-muted-foreground'}`}>
                {countWords(formData.message)}/100 kata
              </span>
            </label>
            <textarea
              id="cf-message"
              name="message"
              rows={4}
              value={formData.message}
              onChange={handleInputChange}
              placeholder="Tulis pesan Anda di sini..."
              className={`w-full px-4 py-2.5 rounded-xl border bg-background text-foreground text-sm
                         placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent
                         transition-all duration-200 ${validationErrors.message && formData.message ? 'border-destructive' : 'border-input'}`}
            />
            {formData.message && countWords(formData.message) > 100 && (
              <p className="text-xs text-destructive mt-1 flex items-center gap-1">
                <X className="w-3 h-3" /> Pesan Anda melebihi batas 100 kata.
              </p>
            )}
          </div>

          {/* ── Tombol Send Email ── */}
          <button
            type="submit"
            disabled={!isFormValid || isVerified || cooldown > 0}
            className={`w-full py-3 rounded-xl text-sm font-bold tracking-wide flex items-center justify-center gap-2
                        transition-colors duration-300 cursor-pointer
                        ${
                          isVerified
                            ? "bg-emerald-500 text-white cursor-default"
                            : cooldown > 0 
                            ? "bg-primary/20 text-primary cursor-not-allowed"
                            : isFormValid
                            ? "gradient-primary text-primary-foreground hover:opacity-90 shadow-elegant"
                            : "bg-gray-400 text-white cursor-not-allowed opacity-60"
                        }`}
          >
            {isVerified ? (
              <CheckCircle2 className="w-5 h-5" />
            ) : cooldown > 0 ? (
              <RefreshCw className="w-5 h-5 animate-spin" />
            ) : (
              <Mail className="w-5 h-5" />
            )}
            {buttonLabel}
          </button>
        </form>
      </div>

      {/* ═══════════════ TAHAP 2: OVERLAY VERIFIKASI ═══════════════ */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in"
          onClick={closeModal}
          style={{ animationDuration: "0.3s" }}
        >
          <div
            className="bg-card w-full max-w-md mx-4 rounded-2xl shadow-2xl border border-border overflow-hidden animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="gradient-primary px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-6 h-6 text-primary-foreground" />
                <div>
                  <h3 className="text-base font-bold text-primary-foreground">
                    Verifikasi Keamanan
                  </h3>
                  <p className="text-xs text-primary-foreground/70">
                    Selesaikan verifikasi untuk mengirim pesan
                  </p>
                </div>
              </div>
              <button
                onClick={closeModal}
                className="text-primary-foreground/60 hover:text-primary-foreground transition-colors cursor-pointer"
                aria-label="Tutup modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6 flex flex-col items-center">
              <ReCAPTCHA
                sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY || ""}
                onChange={(token) => setRecaptchaToken(token)}
              />

              {/* ── Tombol Verify & Send ── */}
              <button
                type="button"
                onClick={handleVerifyAndSend}
                disabled={!isVerifyReady}
                className={`w-full py-3 rounded-xl text-sm font-bold tracking-wide flex items-center justify-center gap-2
                            transition-colors duration-300 cursor-pointer
                            ${
                              isVerifyReady
                                ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg"
                                : "bg-gray-400 text-white cursor-not-allowed opacity-60"
                            }`}
              >
                <ShieldCheck className="w-5 h-5" />
                Verify &amp; Send
              </button>

              <p className="text-[11px] text-center text-muted-foreground w-full">
                Website ini dilindungi oleh reCAPTCHA dan Kebijakan Privasi serta
                Persyaratan Layanan Google yang berlaku.
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
