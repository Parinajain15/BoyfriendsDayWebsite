import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  HeartDoodle,
  OutlineHeartDoodle,
  StarDoodle,
  SparkleDoodle,
  FlowerDoodle,
  MusicNoteDoodle,
  MiniEnvelopeDoodle,
} from './Doodles';
import { playSparkleSound, playPopSound } from '../utils/audio';
import { Music, VolumeX, Loader2 } from 'lucide-react';

interface IntroScreenProps {
  onEnter: () => void;
  boyfriendName: string;
  senderName: string;
  isPlayingMusic: boolean;
  toggleMusic: () => void;
}

/**
 * Hand-drawn open envelope illustration with a handwritten note peeking out.
 * Whimsical, personal SVG craft without any photo or boxed container.
 */
const IllustratedEnvelope: React.FC<{ onClick?: () => void }> = ({ onClick }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group relative inline-block my-5 sm:my-7 select-none filter drop-shadow-[0_10px_20px_rgba(32,48,74,0.07)] transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer focus:outline-none"
      aria-label="Open surprise envelope"
    >
      <svg
        viewBox="0 0 240 180"
        className="w-56 sm:w-64 md:w-72 h-auto overflow-visible"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Tiny hand-drawn sparkles around the envelope */}
        {/* Sparkle top-left (Baby Yellow) */}
        <g className="animate-pulse" style={{ animationDuration: '3s' }}>
          <path
            d="M 28 28 C 28 35, 33 40, 40 40 C 33 40, 28 45, 28 52 C 28 45, 23 40, 16 40 C 23 40, 28 35, 28 28 Z"
            fill="#F6D365"
          />
          <circle cx="44" cy="24" r="1.5" fill="#F6D365" />
        </g>

        {/* Sparkle top-right (Soft Pink / Coral) */}
        <g className="animate-pulse" style={{ animationDuration: '2.5s', animationDelay: '0.6s' }}>
          <path
            d="M 216 32 C 216 38, 220 42, 226 42 C 220 42, 216 46, 216 52 C 216 46, 212 42, 206 42 C 212 42, 216 38, 216 32 Z"
            fill="#FF9FC4"
          />
          <circle cx="202" cy="26" r="1.5" fill="#FF9FC4" />
        </g>

        {/* Sparkle bottom-left (Mint) */}
        <g className="animate-pulse" style={{ animationDuration: '3.2s', animationDelay: '1.2s' }}>
          <path
            d="M 18 136 C 18 141, 21 144, 26 144 C 21 144, 18 147, 18 152 C 18 147, 15 144, 10 144 C 15 144, 18 141, 18 136 Z"
            fill="#9FE8C1"
          />
        </g>

        {/* Sparkle bottom-right (Lavender) */}
        <g className="animate-pulse" style={{ animationDuration: '2.8s', animationDelay: '0.9s' }}>
          <path
            d="M 224 128 C 224 134, 228 138, 234 138 C 228 138, 224 142, 224 148 C 224 142, 220 138, 214 138 C 220 138, 224 134, 224 128 Z"
            fill="#C9B5FF"
          />
        </g>

        {/* Tiny hand-drawn decorative heart floating near top */}
        <path
          d="M 72 24 C 68 20, 62 21, 60 25 C 58 21, 52 20, 48 24 C 44 28, 48 35, 60 42 C 72 35, 76 28, 72 24 Z"
          fill="#FF9FC4"
          opacity="0.85"
          transform="rotate(-12 60 30)"
        />

        {/* Envelope back base */}
        <rect
          x="32"
          y="76"
          width="176"
          height="100"
          rx="8"
          fill="#E2EEF8"
          opacity="0.5"
        />

        {/* Open Flap folded up (Interior background) */}
        <path
          d="M 32 82 L 120 22 L 208 82 Z"
          fill="#F5F3FF"
          stroke="#344663"
          strokeWidth="2.4"
          strokeLinejoin="round"
          strokeLinecap="round"
        />

        {/* Interior pocket */}
        <path
          d="M 34 82 L 120 132 L 206 82 L 206 174 L 34 174 Z"
          fill="#EDF4FC"
        />

        {/* Note Card Peeking Out (slanted playfully) */}
        <g transform="rotate(-3 120 80)">
          {/* Card paper */}
          <rect
            x="48"
            y="38"
            width="144"
            height="96"
            rx="6"
            fill="#FFFDF9"
            stroke="#D1DFEE"
            strokeWidth="1.8"
          />
          {/* Mini washi tape on note card */}
          <rect
            x="100"
            y="34"
            width="40"
            height="11"
            rx="2"
            fill="#FFE66D"
            opacity="0.85"
            transform="rotate(2 120 39)"
          />
          {/* Lined paper lines */}
          <line x1="60" y1="62" x2="180" y2="62" stroke="#E6EEF8" strokeWidth="1" strokeDasharray="3 3" />
          <line x1="60" y1="84" x2="180" y2="84" stroke="#E6EEF8" strokeWidth="1" strokeDasharray="3 3" />
          <line x1="60" y1="106" x2="180" y2="106" stroke="#E6EEF8" strokeWidth="1" strokeDasharray="3 3" />

          {/* Tiny handwritten note: "Open me ♡" */}
          <text
            x="120"
            y="82"
            textAnchor="middle"
            fill="#20304A"
            fontFamily="'Caveat', cursive"
            fontSize="28"
            fontWeight="bold"
          >
            Open me ♡
          </text>
        </g>

        {/* Envelope Front Left Flap */}
        <path
          d="M 32 82 L 120 134 L 32 176 Z"
          fill="#FFFFFF"
          stroke="#344663"
          strokeWidth="2.3"
          strokeLinejoin="round"
          strokeLinecap="round"
        />

        {/* Envelope Front Right Flap */}
        <path
          d="M 208 82 L 120 134 L 208 176 Z"
          fill="#FFFFFF"
          stroke="#344663"
          strokeWidth="2.3"
          strokeLinejoin="round"
          strokeLinecap="round"
        />

        {/* Envelope Front Bottom Fold */}
        <path
          d="M 32 176 L 120 114 L 208 176 Z"
          fill="#FCFDFE"
          stroke="#344663"
          strokeWidth="2.3"
          strokeLinejoin="round"
          strokeLinecap="round"
        />

        {/* Tiny heart sticker on front intersection */}
        <g transform="translate(120, 124)">
          <circle cx="0" cy="0" r="10" fill="#FFE3EC" stroke="#F5A9C0" strokeWidth="1.2" />
          <path
            d="M 0 5 C -5 1, -8 -2, -8 -5 C -8 -8, -5 -9, -3 -9 C -1 -9, 0 -7, 0 -7 C 0 -7, 1 -9, 3 -9 C 5 -9, 8 -8, 8 -5 C 8 -2, 5 1, 0 5 Z"
            fill="#E0567E"
          />
        </g>
      </svg>
    </button>
  );
};

export const IntroScreen: React.FC<IntroScreenProps> = ({
  onEnter,
  isPlayingMusic,
  toggleMusic,
}) => {
  const handleOpenEnvelope = () => {
    playPopSound();
    playSparkleSound();
    onEnter();
  };

  return (
    <div
      className="relative min-h-screen w-full flex flex-col items-center justify-center p-4 sm:p-6 overflow-hidden select-none"
      style={{
        backgroundColor: '#EAF6FF',
        backgroundImage: 'radial-gradient(#BFDDF5 1.3px, transparent 1.3px)',
        backgroundSize: '24px 24px',
      }}
    >
      {/* Subtle paper-tape details in corners (soft & organic) */}
      <div className="absolute top-4 left-6 w-20 h-5 washi-tape-yellow transform -rotate-12 pointer-events-none opacity-80 rounded-xs" />
      <div className="absolute bottom-6 left-8 w-24 h-5 washi-tape-mint transform rotate-6 pointer-events-none opacity-75 rounded-xs hidden sm:block" />
      <div className="absolute bottom-6 right-8 w-24 h-5 washi-tape-lavender transform -rotate-6 pointer-events-none opacity-75 rounded-xs" />

      {/* ========================================================
          LEFT SIDE SCRAPBOOK DOODLES (Asymmetrical, hand-drawn mix)
          ======================================================== */}
      {/* 1. Small paper scrap (Baby Yellow) */}
      <div className="absolute top-[8%] left-[3%] sm:left-[6%] pointer-events-none select-none">
        <div className="w-14 sm:w-16 h-4 sm:h-4.5 washi-tape-yellow transform -rotate-12 opacity-80 rounded-xs shadow-2xs" />
      </div>

      {/* 2. Star Doodle (Baby Yellow) */}
      <div className="absolute top-[16%] left-[8%] sm:left-[13%] pointer-events-none select-none opacity-85">
        <StarDoodle className="w-6 h-6 text-[#FFE66D] transform rotate-12" />
      </div>

      {/* 3. Small Flower (Soft Pink) */}
      <div className="absolute top-[25%] left-[3%] sm:left-[5%] pointer-events-none select-none opacity-85">
        <FlowerDoodle className="w-7 h-7 text-[#FF9FC4] transform -rotate-12" />
      </div>

      {/* 4. Decorative handwritten mark ✦ */}
      <span className="absolute top-[31%] left-[10%] sm:left-[15%] font-handwriting text-base text-[#536B88]/40 pointer-events-none select-none">
        ✦
      </span>

      {/* 5. Music Notes (Lavender) */}
      <div className="absolute top-[38%] left-[7%] sm:left-[12%] pointer-events-none select-none opacity-80">
        <MusicNoteDoodle className="w-6 h-6 text-[#C9B5FF] transform rotate-6" />
      </div>

      {/* 6. Sparkle (Mint) */}
      <div className="absolute top-[47%] left-[2%] sm:left-[4%] pointer-events-none select-none opacity-85">
        <SparkleDoodle className="w-5 h-5 text-[#9FE8C1] animate-pulse" />
      </div>

      {/* 7. Tiny Envelope Doodle (White/Navy with pink heart) */}
      <div className="absolute top-[56%] left-[7%] sm:left-[11%] pointer-events-none select-none opacity-85">
        <MiniEnvelopeDoodle className="w-7 h-5 text-[#344663] transform -rotate-6 filter drop-shadow-2xs" />
      </div>

      {/* 8. Outline Heart (Soft Pink) */}
      <div className="absolute top-[65%] left-[3%] sm:left-[6%] pointer-events-none select-none opacity-80">
        <OutlineHeartDoodle className="w-7 h-7 text-[#FF9FC4] transform rotate-12" />
      </div>

      {/* 9. Small paper scrap (Mint) */}
      <div className="absolute top-[74%] left-[8%] sm:left-[13%] pointer-events-none select-none">
        <div className="w-14 sm:w-16 h-4 washi-tape-mint transform rotate-8 opacity-75 rounded-xs shadow-2xs" />
      </div>

      {/* 10. Small Flower (Yellow/Peach) */}
      <div className="absolute top-[82%] left-[3%] sm:left-[5%] pointer-events-none select-none opacity-80">
        <FlowerDoodle className="w-6 h-6 text-[#FFE66D] transform rotate-45" />
      </div>

      {/* 11. Heart Doodle (Lavender) */}
      <div className="absolute top-[89%] left-[8%] sm:left-[12%] pointer-events-none select-none opacity-80">
        <HeartDoodle className="w-6 h-6 text-[#C9B5FF] transform -rotate-12" />
      </div>

      {/* 12. Decorative marks (+ and · ·) */}
      <span className="absolute top-[43%] left-[12%] sm:left-[16%] font-mono text-xs text-[#536B88]/40 pointer-events-none select-none">
        +
      </span>
      <span className="absolute top-[71%] left-[4%] sm:left-[7%] font-mono text-xs text-[#536B88]/40 pointer-events-none select-none">
        · ·
      </span>

      {/* =========================================================
          RIGHT SIDE SCRAPBOOK DOODLES (Asymmetrical, hand-drawn mix)
          ========================================================= */}
      {/* 1. Sparkle (Soft Pink) */}
      <div className="absolute top-[9%] right-[9%] sm:right-[15%] pointer-events-none select-none opacity-80">
        <SparkleDoodle className="w-6 h-6 text-[#FF9FC4] transform rotate-12 animate-pulse" />
      </div>

      {/* 2. Small paper scrap (Lavender) */}
      <div className="absolute top-[17%] right-[3%] sm:right-[6%] pointer-events-none select-none">
        <div className="w-14 sm:w-16 h-4.5 washi-tape-lavender transform rotate-6 opacity-80 rounded-xs shadow-2xs" />
      </div>

      {/* 3. Outline Heart (Baby Yellow) */}
      <div className="absolute top-[26%] right-[8%] sm:right-[13%] pointer-events-none select-none opacity-85">
        <OutlineHeartDoodle className="w-7 h-7 text-[#FFE66D] transform -rotate-12" />
      </div>

      {/* 4. Decorative mark ✦ */}
      <span className="absolute top-[32%] right-[4%] sm:right-[7%] font-handwriting text-base text-[#536B88]/40 pointer-events-none select-none">
        ✦
      </span>

      {/* 5. Tiny Envelope Doodle (White/Mint) */}
      <div className="absolute top-[37%] right-[9%] sm:right-[14%] pointer-events-none select-none opacity-85">
        <MiniEnvelopeDoodle className="w-7 h-5 text-[#344663] transform rotate-8 filter drop-shadow-2xs" />
      </div>

      {/* 6. Small Flower (Lavender) */}
      <div className="absolute top-[46%] right-[3%] sm:right-[6%] pointer-events-none select-none opacity-85">
        <FlowerDoodle className="w-7 h-7 text-[#C9B5FF] transform rotate-15" />
      </div>

      {/* 7. Music Notes (Navy/Slate) */}
      <div className="absolute top-[55%] right-[8%] sm:right-[12%] pointer-events-none select-none opacity-75">
        <MusicNoteDoodle className="w-6 h-6 text-[#344663] transform -rotate-12" />
      </div>

      {/* 8. Star Doodle (Baby Yellow) */}
      <div className="absolute top-[64%] right-[3%] sm:right-[6%] pointer-events-none select-none opacity-85">
        <StarDoodle className="w-6 h-6 text-[#FFE66D] transform rotate-45" />
      </div>

      {/* 9. Small paper scrap (Pink) */}
      <div className="absolute top-[72%] right-[8%] sm:right-[13%] pointer-events-none select-none">
        <div className="w-14 sm:w-16 h-4 washi-tape-pink transform -rotate-6 opacity-75 rounded-xs shadow-2xs" />
      </div>

      {/* 10. Sparkle (Mint) */}
      <div className="absolute top-[80%] right-[3%] sm:right-[6%] pointer-events-none select-none opacity-85">
        <SparkleDoodle className="w-6 h-6 text-[#9FE8C1] transform rotate-12 animate-pulse" />
      </div>

      {/* 11. Heart Doodle (Soft Pink) */}
      <div className="absolute top-[88%] right-[8%] sm:right-[12%] pointer-events-none select-none opacity-80">
        <HeartDoodle className="w-6 h-6 text-[#FF9FC4] transform rotate-6" />
      </div>

      {/* 12. Decorative marks (+ and · ·) */}
      <span className="absolute top-[21%] right-[11%] sm:right-[17%] font-mono text-xs text-[#536B88]/40 pointer-events-none select-none">
        +
      </span>
      <span className="absolute top-[49%] right-[12%] sm:right-[16%] font-mono text-xs text-[#536B88]/40 pointer-events-none select-none">
        +
      </span>
      <span className="absolute top-[75%] right-[4%] sm:right-[7%] font-mono text-xs text-[#536B88]/40 pointer-events-none select-none">
        · ·
      </span>

      {/* Subtle top right music button (NO special edition badge, NO clunky card) */}
      <header className="absolute top-5 right-5 sm:right-8 z-20">
        <button
          type="button"
          onClick={toggleMusic}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/85 hover:bg-white border border-[#BFDDF5] shadow-2xs hover:shadow-xs text-xs text-[#20304A] transition-all cursor-pointer"
          title={isPlayingMusic ? 'Pause “her” — JVKE' : 'Play “her” — JVKE'}
        >
          {isPlayingMusic ? (
            <>
              <Music className="w-3.5 h-3.5 text-[#20304A] animate-spin" style={{ animationDuration: '4s' }} />
              <span className="font-sans text-[11px] font-semibold text-[#20304A]">“her” — JVKE 🎵</span>
            </>
          ) : (
            <>
              <VolumeX className="w-3.5 h-3.5 text-[#6B85A6]" />
              <span className="font-sans text-[11px] font-medium text-[#6B85A6]">Play “her” 🎵</span>
            </>
          )}
        </button>
      </header>

      {/* Main Landing / Surprise Presentation (NO large white box, plenty of breathing room) */}
      <main className="relative w-full max-w-xl mx-auto z-10 flex flex-col items-center justify-center text-center px-4 py-8">
        <div className="flex flex-col items-center justify-center space-y-3 sm:space-y-4 animate-in fade-in duration-500">
          {/* 1. Small handwritten-style line */}
          <p className="font-handwriting text-xl sm:text-2xl md:text-3xl text-[#536B88] font-bold tracking-wide">
            A little something for my favourite human
          </p>

          {/* 2. Main heading with soft contrasting lavender/pink for "Abhi" */}
          <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl font-normal text-[#1B2A4A] tracking-tight leading-tight">
            Happy Boyfriend's Day,{' '}
            <span className="italic font-semibold text-[#D15882] drop-shadow-2xs">
              Abhi
            </span>
          </h1>

          {/* 3. Subtitle */}
          <p className="font-handwriting sm:font-serif text-lg sm:text-xl md:text-2xl text-[#4A627E] italic font-medium max-w-md pt-0.5">
            “Because you deserve more than just a text.”
          </p>

          {/* 4. Cute hand-drawn open-envelope illustration (Click to open surprise immediately) */}
          <IllustratedEnvelope onClick={handleOpenEnvelope} />
        </div>
      </main>
    </div>
  );
};
