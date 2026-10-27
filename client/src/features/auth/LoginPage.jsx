import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.js';
import httpClient from '../../api/httpClient.js';

/**
 * Editorial Arched Atelier Split Login Page matching Stitch specification.
 */
export function LoginPage() {
  const [email, setEmail] = useState('priya.sharma@email.com');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e) => {
    e?.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const res = await httpClient.post('/auth/login', { email, password });
      login(res.data.token, res.data.user);
      const target =
        location.state?.from?.pathname ||
        (res.data.user.role === 'admin' ? '/admin' : '/books');
      navigate(target, { replace: true });
    } catch (err) {
      setError(err.message || 'Invalid email or password');
    } finally {
      setSubmitting(false);
    }
  };

  const handleFillAuthor = () => {
    setEmail('priya.sharma@email.com');
    setPassword('password123');
    setError(null);
  };

  const handleFillAdmin = () => {
    setEmail('admin@bookleaf.com');
    setPassword('admin123');
    setError(null);
  };

  return (
    <div className="min-h-screen bg-[#FFF8F5] text-[#2B2622] font-sans antialiased selection:bg-[#D4704B] selection:text-white flex flex-col">
      {/* Desktop Asymmetrical 50/50 Split Container */}
      <div className="flex-1 flex flex-col lg:flex-row min-h-screen">
        {/* ============================================== */}
        {/* LEFT HALF: ATMOSPHERIC EDITORIAL ATELIER       */}
        {/* ============================================== */}
        <aside className="lg:w-1/2 bg-atelier-gradient relative flex flex-col justify-between p-8 sm:p-12 lg:p-16 border-b lg:border-b-0 lg:border-r border-[#E5DCCE] overflow-hidden">
          {/* Background Ambient Glow & Subtle Watermark Texture */}
          <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-[#E0B050]/15 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -right-20 w-96 h-96 rounded-full bg-[#D4704B]/10 blur-3xl pointer-events-none" />

          {/* Atelier Header Tag & Foil Seal */}
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center justify-center w-8 h-8 rounded-full border border-[#2B2622]/20 text-xs font-serif italic text-[#2B2622] bg-[#FFFBF7]/80 shadow-sm">
                №
              </span>
              <span className="text-xs uppercase tracking-widest text-[#55433c] font-medium">
                Atelier Vault &amp; Guild Bindery
              </span>
            </div>
            <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-[#E5DCCE] bg-white/70 backdrop-blur-sm text-[11px] text-[#2B2622] font-medium shadow-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
              Archive Online
            </div>
          </div>

          {/* Centerpiece: Multi-tier Architectural Bookshelf Composition */}
          <div className="relative z-10 my-auto py-10 flex flex-col items-center justify-center w-full max-w-xl mx-auto">
            {/* Arched Niche Recessed Atelier Bookcase */}
            <div className="relative w-full max-w-md mx-auto">
              {/* Ambient Sunbeam light sweep overlay */}
              <div className="absolute -top-12 -left-10 w-72 h-80 bg-gradient-to-br from-amber-100/50 via-amber-100/20 to-transparent rotate-12 blur-2xl pointer-events-none z-20" />

              {/* Outer Plaster Niche Arch Wrapper */}
              <div className="relative bg-[#EFE4D3] border border-amber-200/40 rounded-t-full rounded-b-2xl p-5 pt-8 alcove-recess overflow-hidden">
                {/* Architectural Keystoned Head Ribbon / Arch Accent */}
                <div className="absolute top-2 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#E5D5BF] border border-amber-300/40 text-[9px] font-editorial tracking-widest uppercase text-[#2B2622]/70">
                  <span>✦ Vaulted Niche I ✦</span>
                </div>

                {/* UPPER NICHE LEVEL (Curved apex with books + ceramic bud vase) */}
                <div className="relative pt-6 pb-2 px-4 flex flex-col items-center">
                  <div className="w-full flex items-end justify-between px-3 mb-0 z-10 relative">
                    {/* Left: Leaning & Upright Classic Volumes */}
                    <div className="flex items-end gap-2">
                      <div className="w-7 h-28 bg-[#7C9A6B] rounded-t-[3px] shadow-book spine-foil relative transition-transform duration-300 hover:-translate-y-1">
                        <div className="absolute inset-x-1 top-2.5 h-6 border-y border-amber-200/50" />
                        <div className="absolute -bottom-2.5 left-2 w-1.5 h-3.5 bg-amber-200 shadow-xs" />
                        <span className="absolute bottom-2 inset-x-0 text-[8px] text-white/80 text-center font-editorial tracking-tighter">
                          LIB. I
                        </span>
                      </div>
                      <div className="w-6 h-32 bg-[#C88C35] rounded-t-[3px] shadow-book spine-foil relative transition-transform duration-300 hover:-translate-y-1">
                        <div className="absolute top-3 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full border border-white/60 bg-amber-200/80" />
                        <span className="absolute bottom-3 inset-x-0 text-[7px] text-white/90 text-center font-mono">
                          №4
                        </span>
                      </div>
                      <div className="w-6 h-30 bg-[#3F7F8C] rounded-t-[3px] shadow-book spine-foil transform rotate-[8deg] origin-bottom-left transition-transform duration-300 hover:rotate-2">
                        <div className="absolute inset-y-2 left-1 w-0.5 bg-amber-200/40" />
                      </div>
                    </div>

                    {/* Center Arch Flora: Terracotta Artisanal Bud Vase with Botanical Sprig */}
                    <div className="flex flex-col items-center relative -mb-1">
                      <div className="flex justify-center -space-x-1 mb-0.5">
                        <div className="w-0.5 h-8 bg-[#8C7A5E] rotate-[-12deg] rounded-full" />
                        <div className="w-0.5 h-10 bg-[#7A8E65] rounded-full" />
                        <div className="w-0.5 h-7 bg-[#A68A68] rotate-[15deg] rounded-full" />
                      </div>
                      <div className="w-7 h-9 bg-[#D4704B] rounded-b-xl rounded-t-sm shadow-sm relative border-t-2 border-amber-200/50 flex items-center justify-center">
                        <div className="w-2.5 h-2.5 rounded-full border border-amber-200/40" />
                      </div>
                    </div>

                    {/* Right: Stamped Guild Tome with Gilded Medallion */}
                    <div className="flex items-end gap-1.5">
                      <div className="w-8 h-34 bg-[#984221] rounded-t-[3px] shadow-book spine-foil relative transition-transform duration-300 hover:-translate-y-1">
                        <div className="absolute top-3 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full border border-amber-300/60 flex items-center justify-center text-[8px] text-amber-200">
                          ✦
                        </div>
                        <div className="absolute bottom-6 inset-x-1 h-0.5 bg-amber-200/50" />
                        <div className="absolute bottom-4 inset-x-1 h-0.5 bg-amber-200/50" />
                      </div>
                      <div className="w-3 h-16 border-r-2 border-t-2 border-amber-300/80 rounded-tr-md bg-amber-200/20" />
                    </div>
                  </div>

                  {/* Timber Shelf Arch Tier 1 */}
                  <div className="w-full h-3.5 shelf-timber rounded-sm relative">
                    <div className="absolute inset-x-0 bottom-0 h-1 bg-[#4A2E17]/80 rounded-b-sm" />
                  </div>
                  <div className="w-full h-2 bg-[#2B2622]/20 blur-[3px] -mt-0.5" />
                </div>

                {/* MIDDLE NICHE LEVEL: Horizontal Folio Stacks & Guild Editions */}
                <div className="relative py-3 px-4 flex flex-col items-center">
                  <div className="w-full flex items-end justify-between px-2 mb-0 z-10 relative">
                    {/* Left: Leaning & Pocket Volumes */}
                    <div className="flex items-end gap-2">
                      <div className="w-3 h-20 border-l-2 border-t-2 border-amber-300/80 rounded-tl-md bg-amber-200/20" />
                      <div className="w-7 h-36 bg-[#b85536] rounded-t-[3px] shadow-book spine-foil relative transition-transform duration-300 hover:-translate-y-1">
                        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full border border-amber-200/60 bg-amber-100/40" />
                        <span className="absolute inset-x-0 bottom-3 text-[8px] text-amber-100 font-editorial tracking-widest text-center">
                          MDCCC
                        </span>
                      </div>
                      <div className="w-6 h-30 bg-[#7C9A6B] rounded-t-[3px] shadow-book spine-foil relative transition-transform duration-300 hover:-translate-y-1">
                        <div className="absolute inset-y-2 right-1 w-0.5 bg-white/40" />
                      </div>
                    </div>

                    {/* Center: Antique Laid Horizontal Folio Stack */}
                    <div className="flex flex-col items-center justify-end -mb-0.5">
                      <div className="w-24 h-4 bg-[#D4704B] rounded-sm shadow-sm relative border-b border-black/30">
                        <span className="absolute inset-y-0 left-2 w-1.5 bg-amber-200/60" />
                        <span className="absolute right-2 top-0.5 text-[7px] text-amber-100 font-editorial tracking-wider">
                          CANTOS
                        </span>
                      </div>
                      <div className="w-28 h-4.5 bg-[#3F7F8C] rounded-sm shadow-sm relative border-b border-black/30">
                        <span className="absolute inset-y-0 right-3 w-1 bg-white/50" />
                        <span className="absolute left-3 top-0.5 text-[7px] text-white/80 font-editorial tracking-wider">
                          POETICA
                        </span>
                      </div>
                      <div className="w-32 h-5 bg-[#4a3224] rounded-sm shadow-sm relative border-b border-black/40">
                        <span className="absolute left-3 top-1 text-[8px] font-editorial tracking-widest text-amber-200/90">
                          OPUS IV • FOLIO
                        </span>
                        <div className="absolute -right-1 bottom-1 w-2 h-1 bg-amber-200/70 rounded-xs" />
                      </div>
                    </div>

                    {/* Right: Ochre & Indigo Bindings */}
                    <div className="flex items-end gap-2">
                      <div className="w-6 h-34 bg-[#E0B050] rounded-t-[3px] shadow-book spine-foil relative transition-transform duration-300 hover:-translate-y-1">
                        <div className="absolute top-4 inset-x-1 h-3 border-y border-[#2B2622]/30" />
                      </div>
                      <div className="w-7 h-28 bg-[#3F7F8C] rounded-t-[3px] shadow-book spine-foil relative transform rotate-[-7deg] origin-bottom-right transition-transform duration-300 hover:rotate-0">
                        <div className="absolute inset-x-1 bottom-3 h-0.5 bg-white/50" />
                      </div>
                    </div>
                  </div>

                  {/* Timber Shelf Tier 2 */}
                  <div className="w-full h-3.5 shelf-timber rounded-sm relative">
                    <div className="absolute inset-x-0 bottom-0 h-1 bg-[#4A2E17]/80 rounded-b-sm" />
                  </div>
                  <div className="w-full h-2 bg-[#2B2622]/20 blur-[3px] -mt-0.5" />
                </div>

                {/* LOWER NICHE LEVEL: Grand Reference Folios & Archive Label */}
                <div className="relative pt-2 pb-1 px-4 flex flex-col items-center">
                  <div className="w-full flex items-end justify-between px-4 mb-0 z-10 relative">
                    <div className="flex items-end gap-2">
                      <div className="w-8 h-26 bg-[#984221] rounded-t-[3px] shadow-book spine-foil relative">
                        <span className="absolute bottom-2 inset-x-0 text-[7px] text-amber-200 text-center font-mono">
                          VOL. IX
                        </span>
                      </div>
                      <div className="w-6 h-22 bg-[#D4704B] rounded-t-[3px] shadow-book spine-foil relative" />
                      <div className="w-7 h-24 bg-[#7C9A6B] rounded-t-[3px] shadow-book spine-foil relative transform rotate-[6deg] origin-bottom-left" />
                    </div>

                    {/* Archive Plaque Badge */}
                    <div className="px-3 py-1 bg-[#E3D3BE] border border-amber-300/40 rounded-sm shadow-xs text-center">
                      <span className="block text-[8px] font-editorial uppercase tracking-widest text-[#2B2622] font-semibold">
                        CURATED FOLIOS
                      </span>
                      <span className="block text-[7px] text-[#2B2622]/60 font-mono tracking-wider">
                        SEC. 14 / ATELIER
                      </span>
                    </div>

                    <div className="flex items-end gap-1.5">
                      <div className="w-6 h-24 bg-[#3F7F8C] rounded-t-[3px] shadow-book spine-foil relative" />
                      <div className="w-7 h-28 bg-[#C88C35] rounded-t-[3px] shadow-book spine-foil relative" />
                    </div>
                  </div>

                  {/* Bottom Shelf Base */}
                  <div className="w-full h-4 shelf-timber rounded-b-md relative">
                    <div className="absolute inset-x-0 bottom-0 h-1.5 bg-[#4A2E17] rounded-b-md" />
                  </div>
                  <div className="w-full h-2.5 bg-[#2B2622]/25 blur-[4px] -mt-0.5" />
                </div>
              </div>
            </div>
          </div>

          {/* Inspiring Literary Quote Plate & Folio Edition Mark */}
          <div className="relative z-10 mt-6 pt-6 border-t border-[#E5DCCE]/80">
            <div className="bg-white/60 backdrop-blur-sm border border-[#E5DCCE] rounded-xl p-5 shadow-soft-card max-w-lg mx-auto lg:mx-0">
              <div className="flex items-start gap-3.5">
                <span className="text-[#D4704B] text-3xl font-display-italic leading-none mt-1 select-none">
                  “
                </span>
                <div className="space-y-1.5">
                  <p className="font-display-italic text-[#2B2622] text-base sm:text-lg leading-relaxed tracking-wide">
                    Where stories find permanence in cloth, gold leaf, and letterpress.
                  </p>
                  <div className="pt-1 flex items-center justify-between text-xs border-t border-[#E5DCCE]/60">
                    <span className="font-editorial font-semibold text-[#55433c] text-xs tracking-widest uppercase">
                      Folio Editions Press &amp; Bindery
                    </span>
                    <span className="text-[11px] text-[#2B2622]/60 uppercase tracking-widest font-mono">
                      EST. 1928
                    </span>
                  </div>
                  <p className="text-[11px] text-[#2B2622]/70 font-sans tracking-tight">
                    An archival sanctuary dedicated to authors, typographers, and master binders.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* ============================================== */}
        {/* RIGHT HALF: AUTHOR & EDITORIAL DESK SIGN IN    */}
        {/* ============================================== */}
        <main className="lg:w-1/2 bg-[#FFF8F5] flex flex-col justify-between p-8 sm:p-12 lg:p-16">
          {/* Top Bar: Monogram & Masthead Navigation */}
          <header className="flex items-center justify-between w-full max-w-lg mx-auto">
            <div className="inline-flex items-center gap-3.5 group cursor-default">
              <div className="w-10 h-10 rounded-xl bg-[#984221] text-white flex items-center justify-center font-editorial text-2xl font-medium shadow-sm transition-transform duration-200 group-hover:scale-95 border border-amber-200/30">
                B
              </div>
              <div>
                <span className="block font-editorial text-2xl tracking-tight text-[#2B2622] font-semibold leading-tight">
                  BookLeaf
                </span>
                <span className="block text-[10px] uppercase tracking-widest text-[#55433c] font-medium font-sans">
                  Press &amp; Atelier
                </span>
              </div>
            </div>

            <nav className="flex items-center gap-4 text-xs font-medium text-[#55433c]">
              <span className="hover:text-[#984221] transition-colors hidden sm:inline-block tracking-wide uppercase font-sans text-[11px] cursor-pointer">
                The Shelf
              </span>
              <span className="w-1 h-1 rounded-full bg-[#E5DCCE] hidden sm:inline-block" />
              <span className="hover:text-[#984221] transition-colors text-[#984221] font-medium font-editorial text-sm tracking-wide cursor-pointer flex items-center gap-1">
                Catalogue <span className="font-sans text-xs">→</span>
              </span>
            </nav>
          </header>

          {/* Center Sign-In Experience */}
          <div className="w-full max-w-lg mx-auto my-auto py-8">
            {/* Portal Title & Subtitle */}
            <div className="mb-8">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#984221]/10 border border-[#984221]/20 text-[#984221] text-[11px] font-sans font-semibold uppercase tracking-widest mb-3">
                <span className="w-1.5 h-1.5 rounded-full bg-[#984221]" />
                <span>Author &amp; Editorial Desk</span>
              </div>
              <h1 className="font-editorial text-4xl sm:text-5xl text-[#2B2622] font-normal tracking-tight leading-tight">
                Sign In to{' '}
                <span className="font-display-italic text-[#984221] font-medium">
                  Your Desk
                </span>
              </h1>
              <p className="text-[#55433c] text-sm sm:text-base mt-2 font-display-italic font-normal tracking-wide text-[#2B2622]/80">
                Author Support, Manuscript Proofs &amp; Literary Royalties Portal
              </p>
            </div>

            {/* Sign-In Form Container */}
            <div className="bg-[#FCF9F5] rounded-2xl border border-[#E5DCCE] p-6 sm:p-8 shadow-soft-card">
              {error && (
                <div className="mb-5 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Email Field */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="email"
                      className="block text-[11px] font-sans font-semibold tracking-widest uppercase text-[#55433c]"
                    >
                      Email Address
                    </label>
                    <span className="text-[10px] text-[#2B2622]/50 uppercase tracking-wider font-mono">
                      Folio ID
                    </span>
                  </div>
                  <div className="relative">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="author@bookleaf.com"
                      className="w-full bg-[#FAF5EE] text-[#2B2622] text-sm rounded-xl border border-[#E5DCCE] px-4 py-3 placeholder:text-[#55433c]/40 focus:border-[#984221] focus:ring-1 focus:ring-[#984221] focus:outline-none transition-all font-sans"
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="password"
                      className="block text-[11px] font-sans font-semibold tracking-widest uppercase text-[#55433c]"
                    >
                      Security Phrase / Password
                    </label>
                    <button
                      type="button"
                      onClick={() => alert('Please use the quick demo credentials below or contact your literary coordinator.')}
                      className="text-xs text-[#55433c] hover:text-[#984221] transition-colors underline-offset-4 hover:underline font-editorial tracking-wide italic"
                    >
                      Forgot phrase?
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter security phrase"
                      className="w-full bg-[#FAF5EE] text-[#2B2622] text-sm rounded-xl border border-[#E5DCCE] px-4 py-3 pr-11 placeholder:text-[#55433c]/40 focus:border-[#984221] focus:ring-1 focus:ring-[#984221] focus:outline-none transition-all tracking-wider font-sans"
                    />
                    {/* Visibility Toggle Button */}
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label="Toggle password visibility"
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#55433c] hover:text-[#2B2622] transition-colors"
                      title="Toggle password view"
                    >
                      {showPassword ? (
                        <svg className="w-4 h-4 text-[#984221]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                        </svg>
                      ) : (
                        <svg className="w-4 h-4 text-[#55433c]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                {/* Remember Workstation Option */}
                <div className="flex items-center pt-1">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 rounded border-[#E5DCCE] text-[#984221] focus:ring-[#984221]/40 bg-[#FAF5EE] cursor-pointer"
                  />
                  <label
                    htmlFor="remember-me"
                    className="ml-2.5 block text-xs text-[#55433c] cursor-pointer select-none font-sans"
                  >
                    Keep this literary workstation active for 30 days
                  </label>
                </div>

                {/* Primary Action Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-[#984221] hover:bg-[#7e3215] text-white font-editorial text-lg tracking-wide py-3 px-6 rounded-full shadow-sm transition-all duration-200 active:scale-[0.99] flex items-center justify-center gap-2.5 group border border-amber-200/20 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    <span>{submitting ? 'Entering Desk...' : 'Enter Workstation'}</span>
                    <span className="group-hover:translate-x-1.5 transition-transform text-amber-200 font-sans text-sm">
                      →
                    </span>
                  </button>
                </div>
              </form>

              {/* Divider */}
              <div className="mt-6 pt-5 fine-rule" />

              {/* Quick Demo Credentials Pills */}
              <div className="pt-1 text-center">
                <p className="text-[10px] uppercase tracking-widest text-[#55433c]/80 mb-2.5 font-sans font-semibold">
                  Quick Demo Access Credentials
                </p>
                <div className="flex flex-wrap items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={handleFillAuthor}
                    className="px-3.5 py-1.5 text-xs rounded-full bg-[#FAF5EE] hover:bg-[#F2ECE3] text-[#2B2622] border border-[#E5DCCE] transition-colors font-editorial font-medium flex items-center gap-2 shadow-xs cursor-pointer"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#D4704B]" />
                    <span>
                      Priya Sharma <span className="text-[11px] text-[#2B2622]/60 font-sans">(Author)</span>
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={handleFillAdmin}
                    className="px-3.5 py-1.5 text-xs rounded-full bg-[#FAF5EE] hover:bg-[#F2ECE3] text-[#2B2622] border border-[#E5DCCE] transition-colors font-editorial font-medium flex items-center gap-2 shadow-xs cursor-pointer"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#3F7F8C]" />
                    <span>Editor &amp; Archival Desk</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side Bottom Colophon Links */}
          <footer className="w-full max-w-lg mx-auto pt-6 border-t border-[#E5DCCE]/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#55433c]">
            <p>© 2026 BookLeaf Publishing.</p>
            <div className="flex items-center gap-4 text-xs font-medium">
              <span className="hover:text-[#984221] transition-colors cursor-pointer">
                Register Manuscript
              </span>
              <span className="text-[#E5DCCE]">•</span>
              <span className="hover:text-[#984221] transition-colors cursor-pointer">
                Help &amp; Colophon
              </span>
              <span className="text-[#E5DCCE]">•</span>
              <span className="hover:text-[#984221] transition-colors cursor-pointer">
                Privacy
              </span>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
}
export default LoginPage;
