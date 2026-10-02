import React, { useState, useEffect } from 'react';
import { NavSection } from './Navbar';
import { Award, Heart } from 'lucide-react';
import { SurpriseWheel } from './SurpriseWheel';
import { ScratchCoupon } from './ScratchCoupon';
import { NextDateHeart } from './NextDateHeart';

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

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-14 sm:space-y-18 relative select-none">
      {/* ======================================================== */}
      {/* BACKGROUND DECORATIONS (WARM IVORY SCRAPBOOK SPREAD)     */}
      {/* Hand-drawn flowers, hearts, stars, arrows, tiny bows     */}
      {/* Hand-placed look — NO repetitive dot grid!              */}
      {/* ======================================================== */}
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden -z-10">
        {/* Curved decorative sketchbook lines */}
        <svg className="absolute inset-0 w-full h-full opacity-30" preserveAspectRatio="none" viewBox="0 0 1000 1300" fill="none">
          <path d="M 80 160 C 220 280, 240 120, 440 220 S 760 160, 940 300" stroke="#2B211E" strokeWidth="1.2" strokeDasharray="5 7" />
          <path d="M 60 480 C 140 600, 220 780, 160 980 S 300 1200, 480 1280" stroke="#E94B45" strokeWidth="1" strokeDasharray="4 6" />
          <path d="M 940 450 C 820 620, 890 820, 850 1050" stroke="#A9D8EA" strokeWidth="1.2" strokeDasharray="6 8" />
        </svg>

        {/* 1. Doodled Flower (Upper Left) */}
        <div className="absolute top-10 left-8 opacity-75 animate-float-petal">
          <svg width="42" height="42" viewBox="0 0 42 42" fill="none">
            <circle cx="21" cy="21" r="5" fill="#F6D66A" stroke="#2B211E" strokeWidth="1.5" />
            <circle cx="21" cy="11" r="5" fill="#F29AAF" stroke="#2B211E" strokeWidth="1.2" opacity="0.9" />
            <circle cx="31" cy="21" r="5" fill="#F29AAF" stroke="#2B211E" strokeWidth="1.2" opacity="0.9" />
            <circle cx="21" cy="31" r="5" fill="#F29AAF" stroke="#2B211E" strokeWidth="1.2" opacity="0.9" />
            <circle cx="11" cy="21" r="5" fill="#F29AAF" stroke="#2B211E" strokeWidth="1.2" opacity="0.9" />
          </svg>
        </div>

        {/* 2. Doodled Bow (Upper Right) */}
        <div className="absolute top-8 right-12 opacity-80 rotate-6">
          <svg width="44" height="34" viewBox="0 0 44 34" fill="none">
            <path d="M22 17 C14 8, 4 10, 6 18 C8 24, 18 20, 22 17 Z" fill="#A9D8EA" stroke="#2B211E" strokeWidth="1.5" />
            <path d="M22 17 C30 8, 40 10, 38 18 C36 24, 26 20, 22 17 Z" fill="#A9D8EA" stroke="#2B211E" strokeWidth="1.5" />
            <circle cx="22" cy="17" r="4" fill="#F6D66A" stroke="#2B211E" strokeWidth="1.5" />
            <path d="M20 20 C18 26, 14 30, 12 32" stroke="#2B211E" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M24 20 C26 26, 30 30, 32 32" stroke="#2B211E" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </div>

        {/* 3. Doodled Music Notes */}
        <div className="absolute top-80 right-14 opacity-70 -rotate-12">
          <svg width="28" height="32" viewBox="0 0 28 32" fill="none">
            <path d="M10 24 C10 27, 7 29, 4 28 C1 27, 0 24, 2 21 C4 18, 9 19, 10 21 L10 6 L24 2 L24 18 C24 21, 21 23, 18 22 C15 21, 14 18, 16 15 C18 12, 23 13, 24 15 L24 2" stroke="#2B211E" strokeWidth="1.8" strokeLinecap="round" fill="none" />
          </svg>
        </div>

        {/* 4. Doodled Tiny Postage Stamp Detail */}
        <div className="absolute top-[520px] left-8 opacity-65 rotate-12">
          <div className="w-16 h-12 border-2 border-dashed border-[#2B211E]/40 rounded-xs flex flex-col items-center justify-center p-1 bg-[#FFFDF7]">
            <span className="text-[8px] font-mono font-bold text-[#E94B45]">ABHI ♡ PARINA</span>
            <span className="text-[10px] text-[#A9D8EA]">★ 2026 ★</span>
          </div>
        </div>

        {/* 5. Handwritten Little Annotations & Sparkles */}
        <div className="absolute top-36 left-1/4 text-[#E94B45] text-lg font-bold">♥</div>
        <div className="absolute top-28 right-1/3 text-[#F6D66A] text-xl font-bold">✦</div>
        <div className="absolute top-96 left-12 text-[#A9D8EA] text-2xl font-bold">★</div>
        <div className="absolute bottom-96 right-16 text-[#F29AAF] text-xl font-bold">♥</div>
        <div className="absolute bottom-48 left-1/3 text-[#F6D66A] text-lg font-bold">✧</div>
      </div>

      {/* ======================================================== */}
      {/* 1. TIMER SECTION                                         */}
      {/* "Our Story in Numbers" label removed!                    */}
      {/* "We have been in love for..."                            */}
      {/* Horizontal timeline with 4 hanging scrapbook tags:       */}
      {/* DAYS (Ivory), HOURS (Powder Blue), MINUTES (Tomato Red), */}
      {/* SECONDS (Muted Yellow)                                   */}
      {/* ======================================================== */}
      <section className="relative text-center max-w-4xl mx-auto pt-2">
        <div className="space-y-1 mb-6 sm:mb-8">
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#2B211E] font-black tracking-tight">
            We have been in love for…
          </h1>
          <p className="font-sans text-xs text-[#2B211E]/60 tracking-wider uppercase font-medium">
            every second counted with you
          </p>
        </div>

        {/* Horizontal Hanging Scrapbook String Timeline */}
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6">
          {/* Hand-drawn connecting string */}
          <div className="relative h-[2px] w-full bg-[#2B211E] shadow-2xs my-4">
            {/* Small pins holding string */}
            <div className="absolute top-1/2 left-[12%] -translate-y-1/2 w-3 h-3 rounded-full bg-[#F6D66A] border-2 border-[#2B211E] shadow-xs" />
            <div className="absolute top-1/2 left-[38%] -translate-y-1/2 w-3 h-3 rounded-full bg-[#A9D8EA] border-2 border-[#2B211E] shadow-xs" />
            <div className="absolute top-1/2 left-[64%] -translate-y-1/2 w-3 h-3 rounded-full bg-[#E94B45] border-2 border-[#2B211E] shadow-xs" />
            <div className="absolute top-1/2 left-[88%] -translate-y-1/2 w-3 h-3 rounded-full bg-[#F6D66A] border-2 border-[#2B211E] shadow-xs" />
          </div>

          {/* 4 Hanging Tags with specific individual colors & subtle tilt */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 mt-6">
            {/* TAG 1: DAYS (Warm Ivory with Tomato Red accent) */}
            <div className="relative pt-3 flex flex-col items-center">
              <div className="absolute top-0 w-[1.5px] h-3 bg-[#2B211E]" />
              <div className="w-full bg-[#FFFDF7] border-2 border-[#2B211E] rounded-2xl p-4 sm:p-5 text-center shadow-[0_8px_20px_rgba(43,33,30,0.12)] transform -rotate-[2deg] hover:rotate-0 transition-transform duration-300 relative group">
                <div className="w-3 h-3 rounded-full bg-[#E94B45] border border-[#2B211E] mx-auto -mt-2 mb-2 shadow-2xs" />
                <span className="font-serif text-3xl sm:text-4xl font-black text-[#2B211E] tabular-nums block">
                  {timeTogether.days}
                </span>
                <span className="text-[11px] font-mono font-bold text-[#E94B45] tracking-widest uppercase mt-1 block">
                  Days
                </span>
                <div className="absolute -bottom-1 -right-1 text-[#E94B45] text-[10px]">✦</div>
              </div>
            </div>

            {/* TAG 2: HOURS (Powder Blue with Espresso text) */}
            <div className="relative pt-3 flex flex-col items-center">
              <div className="absolute top-0 w-[1.5px] h-3 bg-[#2B211E]" />
              <div className="w-full bg-[#A9D8EA] border-2 border-[#2B211E] rounded-2xl p-4 sm:p-5 text-center shadow-[0_8px_20px_rgba(43,33,30,0.12)] transform rotate-[2deg] hover:rotate-0 transition-transform duration-300 relative group">
                <div className="w-3 h-3 rounded-full bg-[#FFFDF7] border border-[#2B211E] mx-auto -mt-2 mb-2 shadow-2xs" />
                <span className="font-sans text-3xl sm:text-4xl font-black text-[#2B211E] tabular-nums block">
                  {timeTogether.hours}
                </span>
                <span className="text-[11px] font-mono font-bold text-[#2B211E] tracking-widest uppercase mt-1 block">
                  Hours
                </span>
                <div className="absolute -bottom-1 -right-1 text-[#2B211E] text-[10px]">♥</div>
              </div>
            </div>

            {/* TAG 3: MINUTES (Tomato Red with Warm Ivory text) */}
            <div className="relative pt-3 flex flex-col items-center">
              <div className="absolute top-0 w-[1.5px] h-3 bg-[#2B211E]" />
              <div className="w-full bg-[#E94B45] border-2 border-[#2B211E] rounded-2xl p-4 sm:p-5 text-center shadow-[0_8px_20px_rgba(43,33,30,0.12)] transform -rotate-[1.5deg] hover:rotate-0 transition-transform duration-300 relative group">
                <div className="w-3 h-3 rounded-full bg-[#F6D66A] border border-[#2B211E] mx-auto -mt-2 mb-2 shadow-2xs" />
                <span className="font-serif text-3xl sm:text-4xl font-black text-[#FFFDF7] tabular-nums block drop-shadow-2xs">
                  {timeTogether.minutes}
                </span>
                <span className="text-[11px] font-mono font-bold text-[#FFFDF7] tracking-widest uppercase mt-1 block">
                  Minutes
                </span>
                <div className="absolute -bottom-1 -right-1 text-[#FFFDF7]/70 text-[10px]">✦</div>
              </div>
            </div>

            {/* TAG 4: SECONDS (Muted Yellow with Espresso text) */}
            <div className="relative pt-3 flex flex-col items-center">
              <div className="absolute top-0 w-[1.5px] h-3 bg-[#2B211E]" />
              <div className="w-full bg-[#F6D66A] border-2 border-dashed border-[#2B211E] rounded-2xl p-4 sm:p-5 text-center shadow-[0_8px_20px_rgba(43,33,30,0.12)] transform rotate-[2.5deg] hover:rotate-0 transition-transform duration-300 relative group">
                <div className="w-3 h-3 rounded-full bg-[#2B211E] border border-[#F6D66A] mx-auto -mt-2 mb-2 shadow-2xs" />
                <span className="font-sans text-3xl sm:text-4xl font-black text-[#2B211E] tabular-nums block">
                  {timeTogether.seconds}
                </span>
                <span className="text-[11px] font-mono font-bold text-[#2B211E] tracking-widest uppercase mt-1 block">
                  Seconds
                </span>
                <div className="absolute -bottom-1 -right-1 text-[#E94B45] text-[10px]">✧</div>
              </div>
            </div>
          </div>
        </div>

        <p className="font-handwriting text-2xl sm:text-3xl text-[#2B211E] font-bold mt-7">
          “…and I’d still choose you in every lifetime. ♡”
        </p>
      </section>

      {/* ======================================================== */}
      {/* 2 & 5. CERTIFICATE + NEXT DATE HEART (SIDE BY SIDE)      */}
      {/* Certificate = Formal/Elegant Ivory Parchment             */}
      {/* Heart = Playful/Romantic Hand-Drawn Artwork              */}
      {/* Different sizes, rotations & scales arranged together    */}
      {/* ======================================================== */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
        {/* ===================================================== */}
        {/* OBJECT 1: OFFICIAL BEST BOYFRIEND CERTIFICATE (7 COLS) */}
        {/* Warm ivory paper, espresso typography, red lines,    */}
        {/* muted yellow seal, powder blue washi tape             */}
        {/* ===================================================== */}
        <div className="lg:col-span-7 relative group">
          {/* Subtle Powder Blue Washi Tape holding top right corner */}
          <div className="absolute -top-3.5 right-8 w-36 h-6 bg-[#A9D8EA] border border-[#2B211E]/30 text-[#2B211E] transform rotate-2 rounded-xs shadow-2xs z-20 flex items-center justify-center pointer-events-none">
            <span className="text-[9px] font-mono font-bold tracking-widest uppercase">
              OFFICIAL CERTIFIED
            </span>
          </div>

          {/* Certificate Paper Sheet */}
          <div className="relative bg-[#FFFDF7] rounded-3xl border-2 border-[#2B211E] p-6 sm:p-9 shadow-[0_16px_36px_rgba(43,33,30,0.12)] transform -rotate-[1deg] hover:rotate-0 transition-transform duration-300 overflow-hidden">
            {/* Hand-drawn Ornate Corners */}
            <div className="absolute top-3 left-3 text-[#F6D66A] text-2xl font-serif select-none pointer-events-none">⌜</div>
            <div className="absolute top-3 right-3 text-[#F6D66A] text-2xl font-serif select-none pointer-events-none">⌝</div>
            <div className="absolute bottom-3 left-3 text-[#F6D66A] text-2xl font-serif select-none pointer-events-none">⌞</div>
            <div className="absolute bottom-3 right-3 text-[#F6D66A] text-2xl font-serif select-none pointer-events-none">⌟</div>

            {/* Inner Border with Red & Gold Accents */}
            <div className="border border-[#F6D66A] rounded-2xl p-4 sm:p-6 bg-[#FFF8EF]/50 relative z-10 space-y-4">
              {/* Header Badge & ID */}
              <div className="flex items-center justify-between border-b border-[#2B211E]/15 pb-3">
                <span className="text-[11px] font-mono font-bold text-[#E94B45] uppercase tracking-wider">
                  NO. 2026-BF-01
                </span>
                {/* Muted Gold Seal */}
                <div className="flex items-center gap-1.5 px-3 py-1 bg-[#F6D66A] rounded-full border border-[#2B211E]/30 shadow-2xs">
                  <Award className="w-4 h-4 text-[#2B211E]" />
                  <span className="text-[10px] font-mono font-extrabold text-[#2B211E] tracking-wider uppercase">
                    GOLD TIER SEAL
                  </span>
                </div>
              </div>

              {/* Title & Conferred to */}
              <div className="text-center pt-1 space-y-1">
                <div className="flex items-center justify-center gap-2 text-[#E94B45]">
                  <span>✦</span>
                  <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#2B211E]">
                    HONORARY LIFETIME AWARD
                  </span>
                  <span>✦</span>
                </div>
                <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-[#2B211E] font-black tracking-tight">
                  Official Best Boyfriend Certificate
                </h2>
                <p className="font-sans text-xs text-[#2B211E]/80">
                  Presented with endless pride to:{' '}
                  <strong className="text-[#2B211E] font-bold underline decoration-[#E94B45] decoration-2 underline-offset-2">
                    {boyfriendName || 'Abhinab P Kashyap'}
                  </strong>
                </p>
              </div>

              {/* Verified Checklist with Tomato Red checkmarks */}
              <div className="space-y-2.5 py-3 text-xs sm:text-sm font-serif text-[#2B211E] bg-[#FFFDF7] rounded-xl p-3.5 border border-[#2B211E]/15">
                <div className="flex items-start gap-2.5">
                  <span className="text-[#E94B45] font-bold text-sm">✓</span>
                  <span>Unlimited warm hugs & back scratches on demand</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="text-[#E94B45] font-bold text-sm">✓</span>
                  <span>Pardon for stealing my food or fries</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="text-[#E94B45] font-bold text-sm">✓</span>
                  <span>Permanent VIP residency inside my heart</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="text-[#E94B45] font-bold text-sm">✓</span>
                  <span>Entitled to endless love and affection</span>
                </div>
              </div>

              {/* Signature Line */}
              <div className="pt-2 flex items-center justify-between text-xs text-[#2B211E]/80 border-t border-[#2B211E]/15">
                <span className="italic font-serif">Signed with all my love,</span>
                <span className="font-handwriting text-2xl font-bold text-[#2B211E] border-b-2 border-[#E94B45] pb-0.5">
                  {senderName || 'Parina'} ♡
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ===================================================== */}
        {/* OBJECT 2: NEXT DATE HEART (5 COLS) — SIDE BY SIDE     */}
        {/* Playful & Romantic Hand-Drawn Layered Heart Artwork   */}
        {/* NO rectangular card! Drawn directly into composition  */}
        {/* ===================================================== */}
        <div className="lg:col-span-5 flex justify-center">
          <NextDateHeart />
        </div>
      </section>

      {/* ======================================================== */}
      {/* 3. SCRATCH CARD + SILVER COIN SECTION                    */}
      {/* Wider and shorter vintage scratch ticket voucher         */}
      {/* Realistic silver coin with "drag the coin →" & "scratch it!"*/}
      {/* ======================================================== */}
      <section className="relative max-w-4xl mx-auto">
        <ScratchCoupon />
      </section>

      {/* ======================================================== */}
      {/* 4. SURPRISE WHEEL (STANDALONE GAME OBJECT)               */}
      {/* Left: Wheel | Right: Content & Spin & Reveal            */}
      {/* ======================================================== */}
      <section id="surprise-wheel" className="relative pt-2">
        <SurpriseWheel />
      </section>
    </div>
  );
};
