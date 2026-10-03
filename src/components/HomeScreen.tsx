import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { SurpriseWheel } from './SurpriseWheel';
import { ScratchCoupon } from './ScratchCoupon';
import { playPopSound, playSparkleSound } from '../utils/audio';
import { Sparkles, Heart, Zap, X } from 'lucide-react';
import { NavSection } from './Navbar';

interface HomeScreenProps {
  boyfriendName: string;
  senderName: string;
  anniversaryDate: string;
  specialNickname: string;
  onNavigate?: (section: NavSection) => void;
}

// -------------------------------------------------------------
// ADORABLE CHIBI SHINCHAN & FLUFFY PUPPY VECTOR ILLUSTRATIONS
// Wholesome, soft rounded, big expressive eyes, premium craft
// -------------------------------------------------------------

// Second Adorable Chibi Puppy for Top-Left Corner:
// Warm light brown / caramel fur, darker brown floppy ears, cream muzzle, rosy pink cheeks & big expressive dark eyes
const SecondCuteChibiPuppy: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg viewBox="0 0 140 140" className={`w-28 h-28 select-none ${className}`} fill="none">
    {/* Soft Drop Shadow for sticker depth */}
    <ellipse cx="70" cy="132" rx="40" ry="6" fill="#000000" opacity="0.18" />

    {/* Darker Brown Floppy Ears */}
    <g>
      {/* Left Ear (playful floppy angle) */}
      <path
        d="M 36 44 C 18 36, 12 65, 20 84 C 26 96, 40 92, 42 78 Z"
        fill="#854823"
        stroke="#1A1A1A"
        strokeWidth="4"
        strokeLinejoin="round"
      />
      <path
        d="M 28 54 C 20 50, 18 70, 24 80 C 28 86, 36 84, 37 76 Z"
        fill="#6D3716"
        opacity="0.5"
      />

      {/* Right Ear (floppy & perky angle) */}
      <path
        d="M 104 44 C 122 36, 128 65, 120 84 C 114 96, 100 92, 98 78 Z"
        fill="#854823"
        stroke="#1A1A1A"
        strokeWidth="4"
        strokeLinejoin="round"
      />
      <path
        d="M 112 54 C 120 50, 122 70, 116 80 C 112 86, 104 84, 103 76 Z"
        fill="#6D3716"
        opacity="0.5"
      />
    </g>

    {/* Warm Light Brown / Caramel Round Head */}
    <circle
      cx="70"
      cy="68"
      r="44"
      fill="#D99B62"
      stroke="#1A1A1A"
      strokeWidth="4"
    />

    {/* Fluffy Caramel Tuft on Top */}
    <path
      d="M 64 26 C 66 18, 74 18, 76 26"
      stroke="#1A1A1A"
      strokeWidth="3.5"
      strokeLinecap="round"
      fill="#D99B62"
    />

    {/* Lighter Caramel Forehead Glow */}
    <ellipse cx="70" cy="48" rx="20" ry="12" fill="#E4AB74" opacity="0.6" />

    {/* Big Expressive Dark Manga Puppy Eyes with Dual Catchlights */}
    <g>
      {/* Left Eye */}
      <ellipse cx="50" cy="62" rx="8.5" ry="11" fill="#1A1A1A" />
      <circle cx="47" cy="57" r="3.8" fill="#FFFFFF" />
      <circle cx="53" cy="66" r="1.8" fill="#FFFFFF" />
      <circle cx="48" cy="65" r="1" fill="#FFFFFF" />

      {/* Right Eye */}
      <ellipse cx="90" cy="62" rx="8.5" ry="11" fill="#1A1A1A" />
      <circle cx="87" cy="57" r="3.8" fill="#FFFFFF" />
      <circle cx="93" cy="66" r="1.8" fill="#FFFFFF" />
      <circle cx="88" cy="65" r="1" fill="#FFFFFF" />
    </g>

    {/* Cute Puppy Brow Dots */}
    <ellipse cx="49" cy="46" rx="3.5" ry="2.5" fill="#BF7E48" />
    <ellipse cx="91" cy="46" rx="3.5" ry="2.5" fill="#BF7E48" />

    {/* Soft Radiant Pink Cheeks */}
    <circle cx="35" cy="74" r="8.5" fill="#FF70A6" opacity="0.8" />
    <circle cx="105" cy="74" r="8.5" fill="#FF70A6" opacity="0.8" />

    {/* Cream Muzzle / Snout */}
    <ellipse cx="70" cy="76" rx="16" ry="12" fill="#FFF7ED" stroke="#1A1A1A" strokeWidth="2.5" />

    {/* Dark Button Puppy Nose */}
    <path
      d="M 70 71 C 67 67, 63 68, 63 71 C 63 74, 70 77, 70 77 C 70 77, 77 74, 77 71 C 77 68, 73 67, 70 71 Z"
      fill="#1A1A1A"
    />

    {/* Sweet Smiling Mouth with Tiny Tongue */}
    <path
      d="M 64 78 Q 70 82 76 78"
      stroke="#1A1A1A"
      strokeWidth="2.5"
      strokeLinecap="round"
      fill="none"
    />
    <path
      d="M 66 80 C 66 89, 74 89, 74 80 Z"
      fill="#FF3366"
      stroke="#1A1A1A"
      strokeWidth="2"
    />

    {/* Cute Waving Caramel Paw with Darker Pads */}
    <g transform="translate(98, 86) rotate(-20)">
      <ellipse cx="12" cy="10" rx="9" ry="7" fill="#D99B62" stroke="#1A1A1A" strokeWidth="3" />
      <circle cx="8" cy="7" r="1.5" fill="#854823" />
      <circle cx="12" cy="5" r="1.5" fill="#854823" />
      <circle cx="16" cy="7" r="1.5" fill="#854823" />
      <ellipse cx="12" cy="11" rx="4" ry="3" fill="#854823" />
    </g>
  </svg>
);

// Irresistible Chibi Puppy with big glossy eyes, floppy ears & cute paws
const SuperCuteChibiPuppy: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg viewBox="0 0 140 140" className={`w-28 h-28 select-none ${className}`} fill="none">
    {/* Soft Drop Shadow */}
    <ellipse cx="70" cy="132" rx="42" ry="6" fill="#000000" opacity="0.15" />

    {/* Soft Floppy Caramel Ears */}
    <g>
      {/* Left Ear */}
      <path
        d="M 38 48 C 20 40, 10 70, 18 90 C 24 104, 38 100, 42 86 Z"
        fill="#E69547"
        stroke="#1A1A1A"
        strokeWidth="4"
        strokeLinejoin="round"
      />
      {/* Right Ear */}
      <path
        d="M 102 48 C 120 40, 130 70, 122 90 C 116 104, 102 100, 98 86 Z"
        fill="#E69547"
        stroke="#1A1A1A"
        strokeWidth="4"
        strokeLinejoin="round"
      />
    </g>

    {/* Big Chubby Round Puppy Head */}
    <circle
      cx="70"
      cy="68"
      r="44"
      fill="#FFF6ED"
      stroke="#1A1A1A"
      strokeWidth="4"
    />

    {/* Caramel Eye Patch on Left Eye */}
    <ellipse cx="50" cy="62" rx="18" ry="16" fill="#FCE0C5" />

    {/* Huge Glistening Puppy-Dog Eyes */}
    <g>
      {/* Left Eye */}
      <circle cx="50" cy="62" r="9" fill="#1A1A1A" />
      <circle cx="47" cy="58" r="3.8" fill="#FFFFFF" />
      <circle cx="53" cy="66" r="1.8" fill="#FFFFFF" />
      <circle cx="48" cy="65" r="1" fill="#FFFFFF" />

      {/* Right Eye */}
      <circle cx="90" cy="62" r="9" fill="#1A1A1A" />
      <circle cx="87" cy="58" r="3.8" fill="#FFFFFF" />
      <circle cx="93" cy="66" r="1.8" fill="#FFFFFF" />
      <circle cx="88" cy="65" r="1" fill="#FFFFFF" />
    </g>

    {/* Soft Radiant Pink Cheeks */}
    <circle cx="36" cy="74" r="8" fill="#FF8FAB" opacity="0.75" />
    <circle cx="104" cy="74" r="8" fill="#FF8FAB" opacity="0.75" />

    {/* White Snout */}
    <ellipse cx="70" cy="76" rx="16" ry="12" fill="#FFFFFF" stroke="#1A1A1A" strokeWidth="2.5" />

    {/* Cute Heart-shaped Puppy Nose */}
    <path
      d="M 70 71 C 67 67, 63 68, 63 71 C 63 74, 70 78, 70 78 C 70 78, 77 74, 77 71 C 77 68, 73 67, 70 71 Z"
      fill="#1A1A1A"
    />

    {/* Happy Smiling Puppy Mouth & Tongue */}
    <path
      d="M 64 78 Q 70 82 76 78"
      stroke="#1A1A1A"
      strokeWidth="2.5"
      strokeLinecap="round"
      fill="none"
    />
    <path
      d="M 66 80 C 66 89, 74 89, 74 80 Z"
      fill="#FF3366"
      stroke="#1A1A1A"
      strokeWidth="2"
    />

    {/* Cute Little Paws Peeking Over Edge */}
    <g transform="translate(42, 104)">
      <ellipse cx="10" cy="8" rx="8" ry="6" fill="#FFF6ED" stroke="#1A1A1A" strokeWidth="3" />
      <circle cx="6" cy="4" r="1.5" fill="#E69547" />
      <circle cx="10" cy="3" r="1.5" fill="#E69547" />
      <circle cx="14" cy="4" r="1.5" fill="#E69547" />
    </g>
    <g transform="translate(78, 104)">
      <ellipse cx="10" cy="8" rx="8" ry="6" fill="#FFF6ED" stroke="#1A1A1A" strokeWidth="3" />
      <circle cx="6" cy="4" r="1.5" fill="#E69547" />
      <circle cx="10" cy="3" r="1.5" fill="#E69547" />
      <circle cx="14" cy="4" r="1.5" fill="#E69547" />
    </g>
  </svg>
);

export const HomeScreen: React.FC<HomeScreenProps> = ({
  anniversaryDate,
}) => {
  // -------------------------------------------------------------
  // 1. RELATIONSHIP TIMER (ORIGINAL FUNCTIONALITY UNCHANGED)
  // -------------------------------------------------------------
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

  // -------------------------------------------------------------
  // 2. LOVE QUESTION INTERACTION STATE (SMOOTH & UNPREDICTABLE DODGE)
  // -------------------------------------------------------------
  const [noPos, setNoPos] = useState({ x: 0, y: 0 });
  const [dodgeCount, setDodgeCount] = useState(0);
  const [reactionText, setReactionText] = useState('');
  const [yesSuccess, setYesSuccess] = useState(false);
  const questionBoxRef = useRef<HTMLDivElement | null>(null);

  const dodgeReactions = [
    'Nice try mister! 😂',
    'Too slow, Abhi! 🏃‍♂️💨',
    'Error 404: "NO" not found! 🚀',
    'Not an option dummy! 🐶',
    'You know you love me! 😏',
    'Give up and click YES! 😜',
    'My love is inescapable! 🔒',
    'Resistance is futile, boyfriend! 💖',
  ];

  const dodgeNoButton = () => {
    playPopSound();

    // Generate random offset within bounds, at least 80px away from current
    const maxX = 120;
    const maxY = 65;
    let nextX = (Math.random() * 2 - 1) * maxX;
    let nextY = (Math.random() * 2 - 1) * maxY;

    if (Math.abs(nextX - noPos.x) < 55) {
      nextX = nextX > 0 ? nextX + 65 : nextX - 65;
    }
    if (Math.abs(nextY - noPos.y) < 35) {
      nextY = nextY > 0 ? nextY + 45 : nextY - 45;
    }

    setNoPos({ x: nextX, y: nextY });
    setDodgeCount((prev) => prev + 1);
    setReactionText(dodgeReactions[dodgeCount % dodgeReactions.length]);
  };

  const handleYesClick = () => {
    playSparkleSound();
    setYesSuccess(true);
    confetti({
      particleCount: 90,
      spread: 100,
      origin: { y: 0.6 },
      colors: ['#FFE600', '#FF2D87', '#0055FF', '#FF5500', '#FFFFFF', '#000000'],
    });
  };

  return (
    <div className="relative w-full max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-16 sm:space-y-22 select-none overflow-x-hidden">
      {/* ======================================================== */}
      {/* RETRO POP DECORATIONS & FLOATING STICKERS IN BACKGROUND  */}
      {/* ======================================================== */}
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden -z-10">
        <div className="absolute top-10 left-6 text-[#FFE600] font-black text-3xl sm:text-4xl animate-bounce drop-shadow-[2px_2px_0px_#000]">
          ★
        </div>
        <div className="absolute top-24 right-8 text-[#FF2D87] font-black text-3xl sm:text-4xl -rotate-12 drop-shadow-[2px_2px_0px_#000]">
          ✦
        </div>
        <div className="absolute top-[400px] left-4 text-[#0055FF] font-black text-4xl rotate-12 drop-shadow-[2px_2px_0px_#000]">
          ★
        </div>
        <div className="absolute top-[800px] right-6 text-[#FFE600] font-black text-4xl animate-pulse drop-shadow-[2px_2px_0px_#000]">
          ✦
        </div>
        <div className="absolute bottom-36 left-8 text-[#FF1744] font-black text-4xl drop-shadow-[2px_2px_0px_#000]">
          ♥
        </div>

        {/* Playful Stickers in Margins */}
        <div className="absolute top-4 right-1/4 px-4 py-1 bg-[#FFE600] border-2 border-black text-black font-mono font-black text-[10px] uppercase tracking-wider rotate-3 shadow-[3px_3px_0px_#000]">
          OFFICIAL BOYFRIEND ACCESS ONLY 🔥
        </div>
        <div className="absolute top-[650px] -left-2 px-4 py-1 bg-[#FF2D87] border-2 border-black text-white font-mono font-black text-[10px] uppercase tracking-wider -rotate-6 shadow-[3px_3px_0px_#000]">
          100% HANDMADE BY PARINA 💌
        </div>
      </div>

      {/* ======================================================== */}
      {/* 2. RELATIONSHIP TIMER — TOP OF HOME PAGE                 */}
      {/* EXACT calculations & displayed info, BOLD POP STYLING    */}
      {/* ======================================================== */}
      <section id="relationship-timer" className="relative text-center max-w-4xl mx-auto pt-2 space-y-6">
        <div className="flex flex-col items-center justify-center space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#FFE600] border-3 border-black rounded-full shadow-[4px_4px_0px_#000] -rotate-1 hover:rotate-0 transition-transform">
            <Zap className="w-4 h-4 fill-black text-black" />
            <span className="font-mono text-xs sm:text-sm font-black uppercase text-black tracking-wider">
              OFFICIAL LOVE COUNTER ⏱️
            </span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl font-black text-black tracking-tight leading-none drop-shadow-[2px_2px_0px_#FFFFFF]">
            We have been in love for…
          </h1>

          {/* EXACT TEXT REQUESTED: "EVERY SINGLE SECOND COUNTED WITH YOU!" */}
          <p className="font-sans text-xs sm:text-sm font-black uppercase tracking-widest text-black bg-white/80 px-5 py-1.5 rounded-full border-3 border-black shadow-[3px_3px_0px_#000]">
            EVERY SINGLE SECOND COUNTED WITH YOU!
          </p>
        </div>

        {/* 4 Chunky Pop Timer Blocks */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 pt-2">
          {/* BLOCK 1: DAYS (Bright Yellow) */}
          <div className="relative group">
            <div className="w-full bg-[#FFE600] border-4 border-black rounded-3xl p-4 sm:p-6 text-center shadow-[6px_6px_0px_#000000] transform -rotate-[2deg] hover:rotate-0 hover:-translate-y-1 transition-all duration-200">
              <span className="font-serif text-4xl sm:text-5xl lg:text-6xl font-black text-black tabular-nums block leading-none">
                {timeTogether.days}
              </span>
              <div className="mt-2.5 inline-block px-3 py-0.5 bg-black text-[#FFE600] font-mono text-xs sm:text-sm font-black uppercase tracking-wider rounded-full">
                Days
              </div>
            </div>
          </div>

          {/* BLOCK 2: HOURS (Hot Pink) */}
          <div className="relative group">
            <div className="w-full bg-[#FF2D87] border-4 border-black rounded-3xl p-4 sm:p-6 text-center shadow-[6px_6px_0px_#000000] transform rotate-[2deg] hover:rotate-0 hover:-translate-y-1 transition-all duration-200">
              <span className="font-serif text-4xl sm:text-5xl lg:text-6xl font-black text-white tabular-nums block leading-none drop-shadow-[2px_2px_0px_#000]">
                {timeTogether.hours}
              </span>
              <div className="mt-2.5 inline-block px-3 py-0.5 bg-[#FFE600] text-black font-mono text-xs sm:text-sm font-black uppercase tracking-wider rounded-full border border-black">
                Hours
              </div>
            </div>
          </div>

          {/* BLOCK 3: MINUTES (Electric Blue) */}
          <div className="relative group">
            <div className="w-full bg-[#0055FF] border-4 border-black rounded-3xl p-4 sm:p-6 text-center shadow-[6px_6px_0px_#000000] transform -rotate-[1.5deg] hover:rotate-0 hover:-translate-y-1 transition-all duration-200">
              <span className="font-serif text-4xl sm:text-5xl lg:text-6xl font-black text-white tabular-nums block leading-none drop-shadow-[2px_2px_0px_#000]">
                {timeTogether.minutes}
              </span>
              <div className="mt-2.5 inline-block px-3 py-0.5 bg-white text-black font-mono text-xs sm:text-sm font-black uppercase tracking-wider rounded-full border border-black">
                Minutes
              </div>
            </div>
          </div>

          {/* BLOCK 4: SECONDS (Cream White) */}
          <div className="relative group">
            <div className="w-full bg-[#FFFDF5] border-4 border-black rounded-3xl p-4 sm:p-6 text-center shadow-[6px_6px_0px_#000000] transform rotate-[2.5deg] hover:rotate-0 hover:-translate-y-1 transition-all duration-200">
              <span className="font-serif text-4xl sm:text-5xl lg:text-6xl font-black text-[#FF1744] tabular-nums block leading-none">
                {timeTogether.seconds}
              </span>
              <div className="mt-2.5 inline-block px-3 py-0.5 bg-black text-white font-mono text-xs sm:text-sm font-black uppercase tracking-wider rounded-full">
                Seconds
              </div>
            </div>
          </div>
        </div>

        {/* Playful Handwriting Quote */}
        <div className="pt-2">
          <p className="font-handwriting text-2xl sm:text-3xl lg:text-4xl text-black font-black leading-snug drop-shadow-[1px_1px_0px_#FFE600]">
            “…and I’d still choose you in every lifetime. ♡”
          </p>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 3. LOVE QUESTION (QUIRKY & IMPOSSIBLE-TO-CLICK "NO")     */}
      {/* “Do you love me as much as I love you?”                  */}
      {/* YES: Celebration | NO: Playfully dodges smoothly         */}
      {/* ======================================================== */}
      <section
        id="love-question"
        ref={questionBoxRef}
        className="relative max-w-3xl mx-auto bg-[#FFFDF5] border-4 border-black rounded-3xl p-6 sm:p-10 shadow-[8px_8px_0px_#000000] text-center overflow-hidden"
      >
        {/* Adorable Second Chibi Puppy on Top-Left Corner */}
        <div className="absolute -top-4 -left-3 rotate-[-10deg] z-20 hover:scale-110 transition-transform">
          <SecondCuteChibiPuppy className="w-22 h-22 sm:w-26 sm:h-26 filter drop-shadow-[3px_3px_0px_#000]" />
        </div>

        {/* Super Cute Fluffy Puppy on Bottom-Right Corner */}
        <div className="absolute -bottom-4 -right-2 rotate-[10deg] z-20 hover:scale-110 transition-transform">
          <SuperCuteChibiPuppy className="w-22 h-22 sm:w-26 sm:h-26 filter drop-shadow-[3px_3px_0px_#000]" />
        </div>

        {/* Header Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#FF2D87] text-white font-mono text-xs font-black uppercase rounded-full border-2 border-black shadow-[2px_2px_0px_#000] mb-3">
          <Heart className="w-3.5 h-3.5 fill-white" />
          <span>IMPORTANT QUESTION 💬</span>
        </div>

        {/* Question Title */}
        <h2 className="font-serif text-2xl sm:text-4xl md:text-5xl font-black text-black tracking-tight leading-tight max-w-xl mx-auto">
          “Do you love me as much as I love you?”
        </h2>

        {/* Reaction commentary bubble when he tries to click NO */}
        {reactionText && (
          <div className="inline-block mt-3 px-4 py-1.5 bg-[#FFE600] border-3 border-black rounded-2xl text-black font-sans font-black text-sm animate-bounce shadow-[3px_3px_0px_#000]">
            {reactionText}
          </div>
        )}

        {/* The Two Big Action Buttons */}
        <div className="relative mt-8 sm:mt-10 min-h-[110px] sm:min-h-[130px] flex items-center justify-center gap-4 sm:gap-8">
          {/* BUTTON 1: YES, OBVIOUSLY! (Works normally) */}
          <button
            type="button"
            onClick={handleYesClick}
            className="px-6 sm:px-10 py-4 sm:py-5 bg-[#FF2D87] hover:bg-[#E02674] text-white font-sans font-black text-base sm:text-xl uppercase tracking-wider rounded-2xl border-4 border-black shadow-[6px_6px_0px_#000000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0px_#000000] active:translate-x-[6px] active:translate-y-[6px] active:shadow-none transition-all cursor-pointer z-10"
          >
            YES, OBVIOUSLY! 💖
          </button>

          {/* BUTTON 2: NO (Quirky, runaway dodging button!) */}
          <div
            className="relative transition-transform duration-250 ease-out z-10"
            style={{
              transform: `translate(${noPos.x}px, ${noPos.y}px)`,
            }}
          >
            <button
              type="button"
              onMouseEnter={dodgeNoButton}
              onTouchStart={dodgeNoButton}
              onClick={dodgeNoButton}
              className="px-6 sm:px-8 py-3.5 sm:py-4 bg-[#0055FF] text-white font-sans font-black text-sm sm:text-base uppercase tracking-wider rounded-2xl border-4 border-black shadow-[5px_5px_0px_#000000] cursor-pointer hover:bg-rose-600 transition-colors"
            >
              NO 🏃‍♂️
            </button>
          </div>
        </div>

        {/* Celebratory Dialog upon clicking YES */}
        {yesSuccess && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-[#FFFDF5] border-4 border-black rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-[8px_8px_0px_#000] text-center space-y-4 animate-in zoom-in-95 duration-200 relative">
              <button
                type="button"
                onClick={() => setYesSuccess(false)}
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-[#FFE600] border-2 border-black flex items-center justify-center font-black cursor-pointer hover:bg-amber-400"
              >
                <X className="w-5 h-5 text-black" />
              </button>

              <div className="flex items-center justify-center gap-2">
                <SecondCuteChibiPuppy className="w-20 h-20" />
                <SuperCuteChibiPuppy className="w-20 h-20" />
              </div>

              <div className="space-y-1">
                <span className="px-3.5 py-1 bg-[#FFE600] border-2 border-black rounded-full font-mono text-xs font-black uppercase text-black">
                  CORRECT ANSWER UNLOCKED!
                </span>
                <h3 className="font-serif text-3xl font-black text-black pt-2">
                  I KNEW IT! 🥰
                </h3>
              </div>

              <p className="font-handwriting text-2xl text-[#FF2D87] font-black leading-snug">
                “Parina loves you 10,000,000x more though! You are officially stuck with me forever and ever! ♡”
              </p>

              <button
                type="button"
                onClick={() => setYesSuccess(false)}
                className="w-full py-3.5 bg-[#FF2D87] hover:bg-[#E02674] text-white font-sans font-black text-sm uppercase rounded-xl border-3 border-black shadow-[4px_4px_0px_#000] cursor-pointer"
              >
                I AGREE FOREVER ♡
              </button>
            </div>
          </div>
        )}
      </section>

      {/* ======================================================== */}
      {/* 5. SCRATCH CARD (VINTAGE TICKET WITH REAL SILVER COIN)   */}
      {/* Horizontal format, draggable coin, ONE SKIP-THE-FIGHT    */}
      {/* ======================================================== */}
      <section id="scratch-section" className="relative pt-2">
        <ScratchCoupon />
      </section>

      {/* ======================================================== */}
      {/* 6. SURPRISE WHEEL (STANDALONE GAME WITH 10 REWARDS)      */}
      {/* Bold, high-contrast, crystal-clear typography             */}
      {/* ======================================================== */}
      <section id="surprise-wheel" className="relative pt-2">
        <SurpriseWheel />
      </section>
    </div>
  );
};
