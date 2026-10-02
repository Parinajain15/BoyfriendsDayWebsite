import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { playSparkleSound } from '../utils/audio';
import { NavSection } from './Navbar';
import { Sparkles, Award, Gift } from 'lucide-react';
import { SurpriseWheel } from './SurpriseWheel';

interface HomeScreenProps {
  boyfriendName: string;
  senderName: string;
  anniversaryDate: string;
  specialNickname: string;
  onNavigate?: (section: NavSection) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  boyfriendName,
  senderName,
  anniversaryDate,
}) => {
  // Live duration counter
  const [timeTogether, setTimeTogether] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  // Scratch card state
  const [isScratched, setIsScratched] = useState(false);

  useEffect(() => {
    const calculateTime = () => {
      const start = new Date(anniversaryDate).getTime();
      const now = new Date().getTime();
      const diff = Math.max(0, now - start);

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      setTimeTogether({ days, hours, minutes, seconds });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [anniversaryDate]);

  const handleScratch = () => {
    if (!isScratched) {
      setIsScratched(true);
      playSparkleSound();
      confetti({
        particleCount: 35,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#FFE66D', '#FF9FC4', '#C9B5FF', '#9FE8C1'],
        disableForReducedMotion: true,
      });
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-10">
      {/* ======================================================== */}
      {/* 1. RELATIONSHIP COUNTDOWN SECTION                        */}
      {/* Colorful scrapbook card with warm buttercup & mint tones */}
      {/* ======================================================== */}
      <section className="bg-gradient-to-br from-[#FFFBEA] via-[#FFFDF5] to-[#F0FDF4] rounded-3xl border-2 border-[#86EFAC]/70 p-6 sm:p-8 text-center relative overflow-hidden shadow-[0_12px_32px_rgba(134,239,172,0.15)]">
        {/* Top washi tape */}
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-44 h-6 washi-tape-mint transform -rotate-1 rounded-xs flex items-center justify-center shadow-xs">
          <span className="text-[10px] font-mono font-bold text-[#20304A] tracking-wider uppercase">
            DAYS IN LOVE WITH YOU
          </span>
        </div>

        <h2 className="font-serif text-2xl sm:text-3xl text-[#20304A] font-bold mt-2">
          We have been in love for...
        </h2>

        {/* 4 Vibrant Metric Blocks */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 max-w-2xl mx-auto mt-6">
          <div className="bg-[#E0F2FE] rounded-2xl border-2 border-[#7DD3FC] p-4 sm:p-5 shadow-2xs hover:scale-102 transition-transform">
            <span className="font-serif text-3xl sm:text-4xl font-bold text-[#0369A1] tabular-nums">
              {timeTogether.days}
            </span>
            <div className="text-[11px] font-sans font-bold text-[#0369A1]/80 mt-1 uppercase tracking-wider">Days</div>
          </div>
          <div className="bg-[#FEF9C3] rounded-2xl border-2 border-[#FDE047] p-4 sm:p-5 shadow-2xs hover:scale-102 transition-transform">
            <span className="font-serif text-3xl sm:text-4xl font-bold text-[#854D0E] tabular-nums">
              {timeTogether.hours}
            </span>
            <div className="text-[11px] font-sans font-bold text-[#854D0E]/80 mt-1 uppercase tracking-wider">Hours</div>
          </div>
          <div className="bg-[#DCFCE7] rounded-2xl border-2 border-[#86EFAC] p-4 sm:p-5 shadow-2xs hover:scale-102 transition-transform">
            <span className="font-serif text-3xl sm:text-4xl font-bold text-[#15803D] tabular-nums">
              {timeTogether.minutes}
            </span>
            <div className="text-[11px] font-sans font-bold text-[#15803D]/80 mt-1 uppercase tracking-wider">Minutes</div>
          </div>
          <div className="bg-[#FFE4E6] rounded-2xl border-2 border-[#FDA4AF] p-4 sm:p-5 shadow-2xs hover:scale-102 transition-transform">
            <span className="font-serif text-3xl sm:text-4xl font-bold text-[#BE123C] tabular-nums">
              {timeTogether.seconds}
            </span>
            <div className="text-[11px] font-sans font-bold text-[#BE123C]/80 mt-1 uppercase tracking-wider">Seconds</div>
          </div>
        </div>

        <p className="font-handwriting text-2xl text-[#20304A] font-bold mt-5">
          ...and I'd still choose you in every lifetime. ♡
        </p>
      </section>

      {/* ======================================================== */}
      {/* 2-COLUMN BALANCED KEEPSAKE SECTION                       */}
      {/* Left: Golden Boyfriend Certificate                      */}
      {/* Right: Secret Scratch Card (Lavender Ticket)            */}
      {/* ======================================================== */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch w-full">
        {/* 1. Official Best Boyfriend Certificate - RICH GOLDEN AESTHETIC */}
        <div className="relative bg-gradient-to-br from-[#FFFDF0] via-[#FFF9E5] to-[#FEF3C7] rounded-3xl border-2 border-[#D4AF37] p-6 sm:p-8 shadow-[0_16px_40px_rgba(212,175,55,0.18)] ring-1 ring-[#FDE68A] flex flex-col justify-between h-full overflow-hidden">
          {/* Certificate Corner Ornaments */}
          <div className="absolute top-2 left-2 text-[#D4AF37]/50 select-none pointer-events-none text-xl font-serif">⌜</div>
          <div className="absolute top-2 right-2 text-[#D4AF37]/50 select-none pointer-events-none text-xl font-serif">⌝</div>
          <div className="absolute bottom-2 left-2 text-[#D4AF37]/50 select-none pointer-events-none text-xl font-serif">⌞</div>
          <div className="absolute bottom-2 right-2 text-[#D4AF37]/50 select-none pointer-events-none text-xl font-serif">⌟</div>

          {/* Gold Washi Tape Top */}
          <div className="absolute -top-3 right-8 w-36 h-6 washi-tape-gold transform rotate-1 rounded-xs flex items-center justify-center shadow-xs">
            <span className="text-[9px] font-mono font-bold text-[#78350F] tracking-wider">VERIFIED OFFICIAL</span>
          </div>

          <div className="relative z-10">
            {/* Top Seal & Certificate Number */}
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono font-semibold text-[#854D0E] uppercase tracking-wider">
                NO. 2026-BF-01
              </span>
              {/* Golden Embossed Rosette Seal */}
              <div className="flex items-center gap-1 px-2.5 py-1 bg-gradient-to-r from-amber-200 via-amber-300 to-yellow-200 rounded-full border border-amber-400/80 shadow-xs">
                <Award className="w-4 h-4 text-amber-800" />
                <span className="text-[10px] font-mono font-bold text-amber-900 tracking-wider uppercase">GOLD TIER</span>
              </div>
            </div>

            <div className="flex items-center gap-2 mt-3">
              <span className="text-amber-500 text-sm">✦</span>
              <h3 className="font-serif text-xl sm:text-2xl text-[#20304A] font-bold tracking-tight">
                Official Best Boyfriend Certificate
              </h3>
            </div>

            <p className="font-sans text-xs text-[#20304A]/80 mt-1.5">
              Presented to: <strong className="text-[#20304A] font-bold">{boyfriendName || 'Abhinab P Kashyap'}</strong>
            </p>

            {/* Checklist with golden parchment divider */}
            <div className="mt-4 space-y-2.5 border-t border-b border-[#D4AF37]/40 py-3.5 text-xs sm:text-sm font-serif text-[#20304A] bg-[#FFFBEA]/40 rounded-xl px-2">
              <div className="flex items-start gap-2">
                <span className="text-amber-600 font-bold">✓</span>
                <span>Unlimited warm hugs & back scratches on demand</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-amber-600 font-bold">✓</span>
                <span>Pardon for stealing my food or fries</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-amber-600 font-bold">✓</span>
                <span>Permanent VIP residency inside my heart</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-amber-600 font-bold">✓</span>
                <span>Entitled to endless love and affection</span>
              </div>
            </div>
          </div>

          {/* Signature with golden flourish */}
          <div className="mt-4 pt-3 flex items-center justify-between text-xs text-[#20304A]/80 font-handwriting text-base relative z-10 border-t border-[#D4AF37]/20">
            <span className="italic">Signed with all my love,</span>
            <span className="font-bold text-[#20304A] text-xl border-b-2 border-amber-400 pb-0.5">
              {senderName || 'Parina'} ♡
            </span>
          </div>
        </div>

        {/* 2. Secret Scratch Card - LAVENDER/PURPLE TICKET AESTHETIC */}
        <div id="scratch-card" className="relative bg-gradient-to-br from-[#FAF5FF] via-[#F3E8FF] to-[#EDE9FE] rounded-3xl border-2 border-[#C4B5FD] p-6 sm:p-8 shadow-[0_16px_40px_rgba(196,181,253,0.18)] flex flex-col justify-between h-full">
          {/* Lavender Washi Tape */}
          <div className="absolute -top-3 left-8 w-34 h-6 washi-tape-lavender transform -rotate-1 rounded-xs flex items-center justify-center shadow-xs">
            <span className="text-[9px] font-mono font-bold text-[#4C1D95] tracking-wider">SURPRISE TICKET</span>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono font-semibold text-purple-700 uppercase tracking-wider">
                SECRET SCRATCH CARD
              </span>
              <Gift className="w-5 h-5 text-purple-600" />
            </div>

            <h3 className="font-serif text-xl sm:text-2xl text-[#20304A] mt-3 font-bold">
              Today's Secret Scratch Note
            </h3>
            <p className="font-sans text-xs text-[#20304A]/80 mt-1">
              Tap or scratch the ticket below to uncover today's secret surprise!
            </p>

            {/* The Scratch Area */}
            <div className="mt-4 relative">
              <div className="w-full min-h-[140px] rounded-2xl p-4 bg-gradient-to-br from-pink-100 via-rose-50 to-pink-100 border-2 border-dashed border-[#F472B6] flex flex-col items-center justify-center text-center shadow-inner">
                <span className="text-[10px] font-mono text-[#9D174D] uppercase tracking-widest font-bold mb-1">
                  YOU WON:
                </span>
                <p className="font-serif text-xl sm:text-2xl text-[#831843] font-extrabold my-1">
                  ONE SKIP-THE-FIGHT PASS
                </p>
                <div className="font-handwriting text-lg sm:text-xl text-[#9D174D] font-bold leading-snug mt-1">
                  Valid for one argument.<br />
                  No questions. No complaints.<br />
                  Use it wisely, boyfriend.
                </div>
              </div>

              {/* Scratch Cover in Warm Foil Texture */}
              {!isScratched && (
                <button
                  type="button"
                  onClick={handleScratch}
                  className="absolute inset-0 rounded-2xl bg-gradient-to-br from-slate-200 via-stone-100 to-slate-300 hover:from-stone-100 hover:to-slate-200 cursor-pointer shadow-inner flex flex-col items-center justify-center transition-all p-4 text-center group border border-slate-300"
                >
                  <Sparkles className="w-5 h-5 text-purple-600 group-hover:scale-110 transition-transform mb-1" />
                  <span className="font-sans text-xs font-bold text-[#20304A]">
                    Tap to Scratch & Reveal 🎟️
                  </span>
                  <span className="text-[10px] font-mono text-stone-600 mt-0.5">
                    Click to peel silver foil
                  </span>
                </button>
              )}
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between text-xs text-[#4C1D95]/80 font-sans">
            <span>{isScratched ? 'Coupon Unlocked ✨' : 'Locked Mystery'}</span>
            {isScratched && (
              <button
                type="button"
                onClick={() => setIsScratched(false)}
                className="text-purple-800 hover:underline font-sans cursor-pointer text-xs font-semibold"
              >
                Hide again
              </button>
            )}
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 3. SURPRISE WHEEL                                        */}
      {/* Framing with cheerful carnival mint & cream background   */}
      {/* ======================================================== */}
      <div id="surprise-wheel" className="max-w-2xl mx-auto w-full bg-gradient-to-br from-[#F0FDF4] via-[#F8FAFC] to-[#FFF7ED] rounded-3xl border-2 border-[#86EFAC]/70 p-2 sm:p-5 shadow-sm">
        <SurpriseWheel />
      </div>
    </div>
  );
};
