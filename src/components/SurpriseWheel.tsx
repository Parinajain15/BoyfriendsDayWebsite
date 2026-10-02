import React, { useState, useRef } from 'react';
import confetti from 'canvas-confetti';
import { playPopSound, playSparkleSound } from '../utils/audio';
import { RotateCw, Heart, Sparkles } from 'lucide-react';

export const WHEEL_REWARDS = [
  'Spank Her',
  'Tongue Wrestling',
  'Try a New Position Next Time',
  'Tie Her',
  'Jacuzzi Time',
  'Get Head',
  'Give Her A Hickey',
  'Risky Quickie',
  'Strip Poker',
  'Massage',
] as const;

export type WheelReward = (typeof WHEEL_REWARDS)[number];

// Colorful carnival prize wheel segments matching the new palette
const SLICE_COLORS = [
  '#E94B45', // 1. Spank Her (Tomato Red)
  '#F6D66A', // 2. Tongue Wrestling (Muted Yellow)
  '#A9D8EA', // 3. Try a New Position Next Time (Powder Blue)
  '#F29AAF', // 4. Tie Her (Dusty Pink)
  '#BEE3DB', // 5. Jacuzzi Time (Soft Sage)
  '#FFD6BA', // 6. Get Head (Warm Apricot)
  '#FCD34D', // 7. Give Her A Hickey (Warm Amber)
  '#C7E9B0', // 8. Risky Quickie (Sweet Mint)
  '#DDD6FE', // 9. Strip Poker (Lilac)
  '#FFF0A5', // 10. Massage (Butter Cream)
];

export const SurpriseWheel: React.FC = () => {
  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [winner, setWinner] = useState<WheelReward | null>(null);
  const [hasSpun, setHasSpun] = useState(false);
  const totalSpinsRef = useRef(0);

  const SLICE_COUNT = WHEEL_REWARDS.length; // 10
  const SLICE_DEGREE = 360 / SLICE_COUNT; // 36

  // Coordinates helper for drawing pie slices
  const getCoordinatesForPercent = (angleInDegrees: number, radius = 175) => {
    const angleInRadians = (angleInDegrees - 90) * (Math.PI / 180);
    return {
      x: 200 + radius * Math.cos(angleInRadians),
      y: 200 + radius * Math.sin(angleInRadians),
    };
  };

  const handleSpin = () => {
    if (isSpinning) return;

    playPopSound();
    setIsSpinning(true);
    setWinner(null);
    setHasSpun(true);
    totalSpinsRef.current += 1;

    // Pick a random target slice index (0 to 9)
    const targetIndex = Math.floor(Math.random() * SLICE_COUNT);

    // Calculate rotation:
    const targetOffset = 360 - (targetIndex + 0.5) * SLICE_DEGREE;
    const fullSpins = (5 + Math.floor(Math.random() * 3)) * 360;
    const currentMod = rotation % 360;
    const additionalRotation = fullSpins + ((targetOffset - currentMod + 360) % 360);

    const nextRotation = rotation + additionalRotation;
    setRotation(nextRotation);

    // After animation finishes (~4000ms)
    setTimeout(() => {
      setIsSpinning(false);
      const wonReward = WHEEL_REWARDS[targetIndex];
      setWinner(wonReward);
      playSparkleSound();

      confetti({
        particleCount: 50,
        spread: 80,
        origin: { y: 0.65 },
        colors: ['#E94B45', '#A9D8EA', '#F6D66A', '#F29AAF', '#2B211E'],
        disableForReducedMotion: true,
      });
    }, 4100);
  };

  // Carnival lights around the perimeter (20 lights)
  const bulbPositions = Array.from({ length: 20 }, (_, idx) => {
    const angle = (idx * 360) / 20;
    const rad = (angle - 90) * (Math.PI / 180);
    return {
      x: 200 + 191 * Math.cos(rad),
      y: 200 + 191 * Math.sin(rad),
      isGold: idx % 2 === 0,
    };
  });

  return (
    // Standalone illustrated game object on warm ivory canvas - NO white card enclosure!
    <div className="relative py-4 select-none">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        {/* ======================================================== */}
        {/* LEFT COLUMN: LARGE SURPRISE WHEEL (7 COLS)               */}
        {/* ======================================================== */}
        <div className="lg:col-span-7 flex flex-col items-center justify-center relative">
          {/* Small hand-drawn doodles around the wheel */}
          <div className="absolute -top-4 -left-2 text-[#F6D66A] text-2xl font-bold select-none pointer-events-none">
            ✦
          </div>
          <div className="absolute top-1/2 -right-4 text-[#E94B45] text-xl font-bold select-none pointer-events-none">
            ♥
          </div>
          <div className="absolute -bottom-3 left-8 text-[#A9D8EA] text-lg font-bold select-none pointer-events-none">
            ★
          </div>
          <div className="absolute -top-6 right-8 text-[#2B211E] font-handwriting text-lg rotate-12 select-none pointer-events-none hidden sm:block">
            spin me! ↴
          </div>

          <div className="relative w-[310px] h-[310px] sm:w-[385px] sm:h-[385px] flex items-center justify-center">
            {/* Top Pointer Needle: Espresso & Gold Arrow with Red Detail */}
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-30 drop-shadow-[0_4px_8px_rgba(43,33,30,0.35)]">
              <svg width="38" height="44" viewBox="0 0 38 44">
                <polygon
                  points="19,44 4,4 34,4"
                  fill="#2B211E"
                  stroke="#F6D66A"
                  strokeWidth="2.5"
                  strokeLinejoin="round"
                />
                <circle cx="19" cy="12" r="4.5" fill="#E94B45" stroke="#FFFDF7" strokeWidth="1" />
              </svg>
            </div>

            {/* Subtle outer dashed game ring */}
            <div className="absolute inset-0 rounded-full border-2 border-dashed border-[#2B211E]/20 pointer-events-none" />

            {/* SVG Rotating Wheel with drop-shadow onto warm ivory canvas */}
            <svg
              viewBox="0 0 400 400"
              className="w-full h-full drop-shadow-[0_16px_36px_rgba(43,33,30,0.18)] rounded-full overflow-hidden"
              style={{
                transform: `rotate(${rotation}deg)`,
                transition: isSpinning
                  ? 'transform 4s cubic-bezier(0.15, 0.9, 0.2, 1)'
                  : 'none',
              }}
            >
              {/* Carnival Outer Rim in Espresso Brown */}
              <circle cx="200" cy="200" r="198" fill="#2B211E" stroke="#F6D66A" strokeWidth="3" />
              <circle cx="200" cy="200" r="185" fill="#FFFDF7" stroke="#2B211E" strokeWidth="1.5" />

              {/* Perimeter Light Bulbs */}
              {bulbPositions.map((bulb, bIdx) => (
                <circle
                  key={bIdx}
                  cx={bulb.x}
                  cy={bulb.y}
                  r={3}
                  fill={bulb.isGold ? '#F6D66A' : '#FFFDF7'}
                  stroke="#2B211E"
                  strokeWidth={0.7}
                />
              ))}

              {/* 10 Pie Slices */}
              {WHEEL_REWARDS.map((reward, i) => {
                const startAngle = i * SLICE_DEGREE;
                const endAngle = (i + 1) * SLICE_DEGREE;
                const start = getCoordinatesForPercent(startAngle, 183);
                const end = getCoordinatesForPercent(endAngle, 183);
                const midAngle = startAngle + SLICE_DEGREE / 2;

                return (
                  <g key={reward}>
                    {/* Slice Wedge */}
                    <path
                      d={`M 200 200 L ${start.x} ${start.y} A 183 183 0 0 1 ${end.x} ${end.y} Z`}
                      fill={SLICE_COLORS[i % SLICE_COLORS.length]}
                      stroke="#2B211E"
                      strokeWidth="1.5"
                    />

                    {/* Slice Label */}
                    <g transform={`rotate(${midAngle - 90} 200 200)`}>
                      <text
                        x="288"
                        y="204"
                        textAnchor="middle"
                        fill="#2B211E"
                        className="font-sans font-extrabold select-none"
                        style={{ fontSize: reward.length > 20 ? '8.5px' : '9.5px', letterSpacing: '-0.2px' }}
                      >
                        {reward === 'Try a New Position Next Time' ? (
                          <>
                            <tspan x="288" dy="-5">Try a New</tspan>
                            <tspan x="288" dy="11">Position</tspan>
                          </>
                        ) : reward === 'Tongue Wrestling' ? (
                          <>
                            <tspan x="288" dy="-5">Tongue</tspan>
                            <tspan x="288" dy="11">Wrestling</tspan>
                          </>
                        ) : reward === 'Give Her A Hickey' ? (
                          <>
                            <tspan x="288" dy="-5">Give Her A</tspan>
                            <tspan x="288" dy="11">Hickey</tspan>
                          </>
                        ) : (
                          <tspan x="288" dy="3">{reward}</tspan>
                        )}
                      </text>
                    </g>
                  </g>
                );
              })}

              {/* Inner Center Hub */}
              <circle cx="200" cy="200" r="43" fill="#2B211E" stroke="#F6D66A" strokeWidth="3" />
              <circle cx="200" cy="200" r="33" fill="#F6D66A" />
              <circle cx="200" cy="200" r="28" fill="#FFFDF7" stroke="#2B211E" strokeWidth="1" />
              <text
                x="200"
                y="204"
                textAnchor="middle"
                fill="#2B211E"
                className="text-xs font-sans font-black uppercase tracking-wider select-none pointer-events-none"
              >
                SPIN
              </text>
            </svg>

            {/* Clickable Center Area */}
            <button
              type="button"
              onClick={handleSpin}
              disabled={isSpinning}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full cursor-pointer z-20 focus:outline-hidden disabled:cursor-not-allowed"
              title="Click to spin the wheel"
            />
          </div>
        </div>

        {/* ======================================================== */}
        {/* RIGHT COLUMN: ALL SUPPORTING CONTENT & RESULT (5 COLS)   */}
        {/* Heading, short description, spin button, claim text      */}
        {/* ======================================================== */}
        <div className="lg:col-span-5 space-y-4 text-left">
          {/* 1. Heading & Description (No "Valentine's Carnival Wheel" label) */}
          <div className="space-y-1.5">
            <h3 className="font-serif text-3xl sm:text-4xl text-[#2B211E] font-black tracking-tight">
              The Surprise Wheel
            </h3>
            <p className="font-sans text-sm text-[#2B211E]/80 leading-relaxed">
              Every slice on this wheel is an exclusive romantic prize to claim with Parina on demand. Give it a spin!
            </p>
          </div>

          {/* 2. Spin Button */}
          <div className="pt-1 space-y-2">
            <button
              type="button"
              onClick={handleSpin}
              disabled={isSpinning}
              className={`w-full sm:w-auto px-8 py-3.5 rounded-full font-sans font-extrabold text-sm sm:text-base flex items-center justify-center gap-2.5 transition-all cursor-pointer shadow-md ${
                isSpinning
                  ? 'bg-stone-300 text-stone-500 cursor-not-allowed scale-95 border border-stone-400'
                  : 'bg-[#2B211E] hover:bg-[#171717] text-[#FFFDF7] hover:scale-105 active:scale-95 border-2 border-[#E94B45] shadow-[0_6px_20px_rgba(43,33,30,0.22)]'
              }`}
            >
              <RotateCw className={`w-4 h-4 ${isSpinning ? 'animate-spin text-[#F6D66A]' : 'text-[#F6D66A]'}`} />
              <span>{isSpinning ? 'Spinning the Wheel...' : hasSpun ? 'Spin Again 🎡' : 'Spin the Wheel 🎡'}</span>
            </button>
            <p className="text-xs font-sans text-[#2B211E]/70">
              {isSpinning ? 'Hold your breath, Abhi! Let’s see what you get…' : 'Tap the spin button or center hub.'}
            </p>
          </div>

          {/* 3. Result Information — Appears RIGHT HERE in right column */}
          {winner && !isSpinning ? (
            <div className="mt-4 bg-[#FFFDF7] rounded-2xl border-2 border-[#2B211E] p-5 text-left animate-in zoom-in-95 duration-300 shadow-[0_12px_28px_rgba(43,33,30,0.16)] relative">
              {/* Decorative tape on result card */}
              <div className="absolute -top-2.5 right-6 px-3 py-0.5 bg-[#A9D8EA] text-[#2B211E] text-[9px] font-mono font-bold uppercase rounded-xs border border-[#2B211E]/30">
                UNLOCKED PRIZE
              </div>

              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#E94B45]/10 text-[#E94B45] text-[10px] font-mono font-bold uppercase tracking-wider mb-2 border border-[#E94B45]/30">
                <Sparkles className="w-3.5 h-3.5 text-[#E94B45]" />
                <span>THE WHEEL HAS SPOKEN!</span>
                <Sparkles className="w-3.5 h-3.5 text-[#E94B45]" />
              </div>

              <h4 className="font-serif text-2xl sm:text-3xl font-black text-[#2B211E] tracking-tight my-1">
                {winner}
              </h4>

              <p className="font-handwriting text-xl text-[#E94B45] font-bold mt-1">
                "Claimable on demand with your girlfriend. No trade-ins, no excuses! ♡"
              </p>

              <div className="mt-3 pt-3 border-t border-[#2B211E]/15 flex items-center gap-1.5 text-xs text-[#2B211E] font-sans font-bold">
                <Heart className="w-3.5 h-3.5 fill-[#E94B45] text-[#E94B45]" />
                <span>Enjoy your prize, boyfriend!</span>
              </div>
            </div>
          ) : (
            <div className="mt-2 p-3.5 rounded-xl border border-[#2B211E]/15 bg-[#FFFDF7]/70 backdrop-blur-xs text-xs text-[#2B211E]/80 space-y-1">
              <span className="font-mono font-bold text-[#E94B45] block">HOW TO CLAIM:</span>
              <span>Whenever you win a slice, take a screenshot or show this to Parina. Valid for immediate redemption! ♡</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
