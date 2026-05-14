import { useState, useCallback, useMemo, useEffect } from "react";
import { Mail, User, FileText, MessageSquare, ShieldCheck, RefreshCw, X, CheckCircle2 } from "lucide-react";

/* ═══════════════════════════════════════════════════════════════════════════
   Helper: Generate random alphanumeric captcha (5-6 chars)
   ═══════════════════════════════════════════════════════════════════════════ */
const generateCaptcha = () => {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789";
  const length = Math.random() < 0.5 ? 5 : 6;
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

/* ═══════════════════════════════════════════════════════════════════════════
   Helper: Simple email regex validator
   ═══════════════════════════════════════════════════════════════════════════ */
const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

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
  const [isRobotChecked, setIsRobotChecked] = useState(false);
  const [captchaCode, setCaptchaCode] = useState(generateCaptcha);
  const [captchaInput, setCaptchaInput] = useState("");
  const [buttonLabel, setButtonLabel] = useState("Send Email");
  const [isVerified, setIsVerified] = useState(false);
  const [captchaError, setCaptchaError] = useState(false);

  // ── Derived: Is main form valid? ──
  const isFormValid = useMemo(() => {
    const { username, email, subject, message } = formData;
    return (
      username.trim() !== "" &&
      isValidEmail(email) &&
      subject.trim() !== "" &&
      message.trim() !== ""
    );
  }, [formData]);

  // ── Derived: Is verification modal valid? ──
  const isVerifyReady = useMemo(
    () => isRobotChecked && captchaInput === captchaCode,
    [isRobotChecked, captchaInput, captchaCode]
  );

  // ── Handlers ──
  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  const openModal = useCallback(() => {
    setCaptchaCode(generateCaptcha());
    setCaptchaInput("");
    setIsRobotChecked(false);
    setCaptchaError(false);
    setShowModal(true);
  }, []);

  const closeModal = useCallback(() => {
    setShowModal(false);
  }, []);

  const refreshCaptcha = useCallback(() => {
    setCaptchaCode(generateCaptcha());
    setCaptchaInput("");
    setCaptchaError(false);
  }, []);

  const handleVerifyAndSend = useCallback(() => {
    // Case-sensitive captcha check
    if (captchaInput !== captchaCode) {
      setCaptchaError(true);
      return;
    }

    // ── Close modal ──
    setShowModal(false);
    setIsVerified(true);
    setButtonLabel("✓ Verified / Saya Bukan Robot");

    // ── Simulate email send ──
    console.log("══════════════════════════════════════");
    console.log("📧 Email Sent Successfully!");
    console.log("══════════════════════════════════════");
    console.log("Username :", formData.username);
    console.log("Email    :", formData.email);
    console.log("Subjek   :", formData.subject);
    console.log("Pesan    :", formData.message);
    console.log("══════════════════════════════════════");

    alert(
      `✅ Email berhasil dikirim!\n\nDari: ${formData.username} (${formData.email})\nSubjek: ${formData.subject}`
    );

    // ── Reset after 2 seconds ──
    setTimeout(() => {
      setFormData({ username: "", email: "", subject: "", message: "" });
      setButtonLabel("Send Email");
      setIsVerified(false);
      setCaptchaInput("");
      setIsRobotChecked(false);
    }, 2000);
  }, [captchaInput, captchaCode, formData]);

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
              className="text-sm font-semibold text-foreground flex items-center gap-1.5"
            >
              <User className="w-4 h-4 text-primary" />
              Username
            </label>
            <input
              id="cf-username"
              type="text"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              placeholder="Masukkan nama lengkap"
              className="w-full px-4 py-2.5 rounded-xl border border-input bg-background text-foreground text-sm
                         placeholder:text-muted-foreground
                         focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent
                         transition-all duration-200"
            />
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
              className="w-full px-4 py-2.5 rounded-xl border border-input bg-background text-foreground text-sm
                         placeholder:text-muted-foreground
                         focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent
                         transition-all duration-200"
            />
            {formData.email && !isValidEmail(formData.email) && (
              <p className="text-xs text-destructive mt-1 flex items-center gap-1">
                <X className="w-3 h-3" /> Format email tidak valid
              </p>
            )}
          </div>

          {/* Subjek */}
          <div className="space-y-1.5">
            <label
              htmlFor="cf-subject"
              className="text-sm font-semibold text-foreground flex items-center gap-1.5"
            >
              <FileText className="w-4 h-4 text-primary" />
              Subjek
            </label>
            <input
              id="cf-subject"
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleInputChange}
              placeholder="Subjek pesan Anda"
              className="w-full px-4 py-2.5 rounded-xl border border-input bg-background text-foreground text-sm
                         placeholder:text-muted-foreground
                         focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent
                         transition-all duration-200"
            />
          </div>

          {/* Pesan */}
          <div className="space-y-1.5">
            <label
              htmlFor="cf-message"
              className="text-sm font-semibold text-foreground flex items-center gap-1.5"
            >
              <MessageSquare className="w-4 h-4 text-primary" />
              Pesan
            </label>
            <textarea
              id="cf-message"
              name="message"
              rows={4}
              value={formData.message}
              onChange={handleInputChange}
              placeholder="Tulis pesan Anda di sini..."
              className="w-full px-4 py-2.5 rounded-xl border border-input bg-background text-foreground text-sm
                         placeholder:text-muted-foreground resize-none
                         focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent
                         transition-all duration-200"
            />
          </div>

          {/* ── Tombol Send Email ── */}
          <button
            type="submit"
            disabled={!isFormValid || isVerified}
            className={`w-full py-3 rounded-xl text-sm font-bold tracking-wide flex items-center justify-center gap-2
                        transition-colors duration-300 cursor-pointer
                        ${
                          isVerified
                            ? "bg-emerald-500 text-white cursor-default"
                            : isFormValid
                            ? "gradient-primary text-primary-foreground hover:opacity-90 shadow-elegant"
                            : "bg-gray-400 text-white cursor-not-allowed opacity-60"
                        }`}
          >
            {isVerified ? (
              <CheckCircle2 className="w-5 h-5" />
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
            <div className="p-6 space-y-5">
              {/* ── Checkbox "I'm not a robot" ── */}
              <label
                htmlFor="cf-robot-check"
                className="flex items-center gap-3 p-4 rounded-xl border-2 border-border hover:border-primary/40 cursor-pointer
                           transition-all duration-200 select-none group"
              >
                <div className="relative">
                  <input
                    id="cf-robot-check"
                    type="checkbox"
                    checked={isRobotChecked}
                    onChange={(e) => setIsRobotChecked(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div
                    className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all duration-200
                      ${
                        isRobotChecked
                          ? "bg-primary border-primary"
                          : "border-gray-300 bg-white group-hover:border-primary/50"
                      }`}
                  >
                    {isRobotChecked && (
                      <svg
                        className="w-4 h-4 text-primary-foreground"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={3}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    )}
                  </div>
                </div>
                <span className="text-sm font-semibold text-foreground">
                  I'm not a robot
                </span>
                <ShieldCheck className="w-5 h-5 text-muted-foreground ml-auto" />
              </label>

              {/* ── Captcha Display ── */}
              <div className="space-y-2">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Masukkan kode berikut (case-sensitive):
                </p>
                <div className="flex items-center gap-3">
                  <div
                    className="flex-1 bg-muted/60 border border-border rounded-xl px-5 py-3 text-center select-none
                                relative overflow-hidden"
                  >
                    {/* Decorative noise lines */}
                    <div className="absolute inset-0 opacity-10 pointer-events-none">
                      <div className="absolute top-1/3 left-0 right-0 h-px bg-foreground rotate-2" />
                      <div className="absolute top-2/3 left-0 right-0 h-px bg-foreground -rotate-1" />
                      <div className="absolute top-1/2 left-0 right-0 h-px bg-foreground rotate-[0.5deg]" />
                    </div>
                    <span
                      className="font-mono text-2xl font-bold tracking-[0.35em] italic text-foreground"
                      style={{
                        textShadow: "1px 1px 2px rgba(0,0,0,0.1)",
                        letterSpacing: "0.35em",
                      }}
                    >
                      {captchaCode}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={refreshCaptcha}
                    className="p-2.5 rounded-xl border border-border bg-background hover:bg-muted text-muted-foreground
                               hover:text-primary transition-all duration-200 cursor-pointer"
                    aria-label="Refresh captcha"
                    title="Generate captcha baru"
                  >
                    <RefreshCw className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* ── Captcha Input ── */}
              <div className="space-y-1.5">
                <input
                  id="cf-captcha-input"
                  type="text"
                  value={captchaInput}
                  onChange={(e) => {
                    setCaptchaInput(e.target.value);
                    setCaptchaError(false);
                  }}
                  placeholder="Ketik kode captcha di sini"
                  autoComplete="off"
                  className={`w-full px-4 py-2.5 rounded-xl border text-sm font-mono tracking-widest text-center
                             bg-background text-foreground
                             placeholder:text-muted-foreground placeholder:font-sans placeholder:tracking-normal
                             focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent
                             transition-all duration-200
                             ${captchaError ? "border-destructive ring-2 ring-destructive/30" : "border-input"}`}
                />
                {captchaError && (
                  <p className="text-xs text-destructive flex items-center gap-1 justify-center">
                    <X className="w-3 h-3" /> Kode captcha tidak sesuai
                    (perhatikan huruf besar/kecil)
                  </p>
                )}
              </div>

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

              {/* Hint text */}
              <p className="text-[11px] text-center text-muted-foreground">
                Verifikasi ini bersifat{" "}
                <span className="font-semibold">case-sensitive</span>. Pastikan
                huruf besar dan kecil sesuai.
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
