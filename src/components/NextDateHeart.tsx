import React from 'react';

export const NextDateHeart: React.FC = () => {
  return (
    <div className="relative w-full max-w-[420px] mx-auto select-none transform rotate-[1.5deg] hover:rotate-0 transition-transform duration-300">
      {/* Decorative Powder Blue Washi Tape Pinning Top of Heart */}
      <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
        <div className="w-16 h-5 bg-[#A9D8EA] border border-[#2B211E]/30 shadow-2xs transform -rotate-2 rounded-xs flex items-center justify-center">
          <span className="text-[8px] font-mono font-bold text-[#2B211E] uppercase tracking-widest">
            HISTORY DEBATE
          </span>
        </div>
      </div>

      {/* Hand-Drawn Coffee Cup Doodle on Upper Left */}
      <div className="absolute top-1 -left-3 z-20 hidden sm:block pointer-events-none -rotate-6">
        <svg width="44" height="40" viewBox="0 0 44 40" fill="none">
          {/* Steam curves */}
          <path d="M12 9 Q14 2 12 0" stroke="#2B211E" strokeWidth="1.3" strokeLinecap="round" />
          <path d="M18 8 Q20 1 18 -1" stroke="#2B211E" strokeWidth="1.3" strokeLinecap="round" />
          <path d="M24 9 Q26 2 24 0" stroke="#2B211E" strokeWidth="1.3" strokeLinecap="round" />
          {/* Cup body */}
          <path d="M6 11 L30 11 C30 23, 26 27, 18 27 C10 27, 6 23, 6 11 Z" fill="#FFFDF7" stroke="#2B211E" strokeWidth="1.8" />
          {/* Handle */}
          <path d="M30 14 C37 14, 37 22, 30 23" stroke="#2B211E" strokeWidth="1.8" fill="none" />
          {/* Heart on cup */}
          <path d="M18 16 C16 13, 13 15, 18 20 C23 15, 20 13, 18 16 Z" fill="#E94B45" />
          {/* Saucer */}
          <path d="M4 28 C12 30, 24 30, 32 28" stroke="#2B211E" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      </div>

      {/* Doodled Arrow with Handwritten Note on Lower Right */}
      <div className="absolute -bottom-2 -right-3 z-20 hidden sm:block pointer-events-none rotate-3">
        <span className="font-handwriting text-sm text-[#E94B45] font-bold">
          prove it to me! ☕ ⤴
        </span>
      </div>

      {/* THE HAND-DRAWN HEART COMPOSITION (Illustration drawn directly on scrapbook page) */}
      <div className="relative w-full aspect-[1/0.96] flex items-center justify-center p-6 sm:p-8">
        {/* Layered SVG Heart Artwork (No white rectangular container!) */}
        <svg
          viewBox="0 0 400 380"
          className="absolute inset-0 w-full h-full filter drop-shadow-[0_12px_24px_rgba(43,33,30,0.14)]"
          fill="none"
        >
          {/* Layer 1: Hand-Drawn Filled Heart Base in Warm Ivory (#FFF8EF / #FFFDF7) */}
          <path
            d="M 200,355 C 95,275 22,190 22,110 C 22,48 68,16 128,16 C 165,16 188,38 200,64 C 212,38 235,16 272,16 C 332,16 378,48 378,110 C 378,190 305,275 200,355 Z"
            fill="#FFFDF7"
          />

          {/* Layer 2: Sketchy Outline 1 — Tomato Red Main Stroke (#E94B45) */}
          <path
            d="M 200,355 C 95,275 22,190 22,110 C 22,48 68,16 128,16 C 165,16 188,38 200,64 C 212,38 235,16 272,16 C 332,16 378,48 378,110 C 378,190 305,275 200,355 Z"
            stroke="#E94B45"
            strokeWidth="3.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Layer 3: Sketchy Outline 2 — Dusty Pink Stroke (#F29AAF) */}
          <path
            d="M 198,358 C 92,278 18,192 18,108 C 18,44 65,12 126,12 C 162,12 186,34 198,62 C 210,34 238,12 274,12 C 336,12 382,44 382,108 C 382,192 308,278 198,358 Z"
            stroke="#F29AAF"
            strokeWidth="2"
            strokeDasharray="140 10 90 8"
            opacity="0.9"
          />

          {/* Layer 4: Sketchy Outline 3 — Inner Espresso Ink Line (#2B211E) */}
          <path
            d="M 200,345 C 102,268 32,185 32,112 C 32,56 72,24 128,24 C 162,24 184,42 200,68 C 216,42 238,24 272,24 C 328,24 368,56 368,112 C 368,185 298,268 200,345 Z"
            stroke="#2B211E"
            strokeWidth="1.2"
            strokeDasharray="12 6 24 6"
            opacity="0.45"
          />

          {/* Layer 5: Decorative Gold Sparkles (#F6D66A) & Stars */}
          <g fill="#F6D66A">
            <path d="M 70 80 L 72 74 L 78 72 L 72 70 L 70 64 L 68 70 L 62 72 L 68 74 Z" />
            <path d="M 330 80 L 332 74 L 338 72 L 332 70 L 330 64 L 328 70 L 322 72 L 328 74 Z" />
            <path d="M 198 335 L 200 330 L 204 328 L 200 326 L 198 321 L 196 326 L 192 328 L 196 330 Z" />
          </g>

          {/* Tiny Doodle Hearts in Margin */}
          <path
            d="M 52 140 C 48 132, 40 135, 48 144 C 56 135, 48 132, 52 140 Z"
            fill="#E94B45"
            opacity="0.8"
          />
          <path
            d="M 348 140 C 344 132, 336 135, 344 144 C 352 135, 344 132, 348 140 Z"
            fill="#E94B45"
            opacity="0.8"
          />
        </svg>

        {/* ARTISTIC TEXT CONTENT INTEGRATED INSIDE THE HEART */}
        <div className="relative z-10 w-full max-w-[280px] sm:max-w-[310px] text-center space-y-2 sm:space-y-2.5 pt-2">
          {/* Header integrated in heart center top */}
          <div className="flex items-center justify-center gap-1.5">
            <span className="text-xs text-[#E94B45]">✦</span>
            <h3 className="font-sans text-xs sm:text-sm font-black tracking-widest uppercase text-[#E94B45] border-b-2 border-[#E94B45]/40 pb-0.5 inline-block">
              NEXT DATE IDEA
            </h3>
            <span className="text-xs text-[#E94B45]">✦</span>
          </div>

          {/* The Exact Challenge Text */}
          <div className="space-y-1.5 sm:space-y-2 font-casual text-[#2B211E] leading-snug">
            <p className="text-sm sm:text-base font-bold">
              You tell me why Jinnah left Congress —<br />
              <span className="text-xs sm:text-sm font-semibold text-[#2B211E]/90">
                and prove to me it wasn’t just about religion.
              </span>
            </p>

            <p className="text-xs sm:text-sm italic text-[#2B211E]/80 pt-0.5">
              I saw that reel you liked.<br />
              <strong className="text-[#E94B45] font-bold">Your turn to explain.</strong>
            </p>
          </div>

          {/* Bottom Heart Tip — Handwritten Coffee Note */}
          <div className="pt-1 flex items-center justify-center gap-1 text-xs text-[#E94B45] font-handwriting text-base font-bold">
            <span>☕ debate over coffee?</span>
            <span className="text-[#2B211E]">♡ Parina</span>
          </div>
        </div>
      </div>
    </div>
  );
};
