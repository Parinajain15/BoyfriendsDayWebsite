import React, { useState, useRef } from 'react';
import confetti from 'canvas-confetti';
import { playPopSound, playSparkleSound } from '../utils/audio';
import { RotateCw, Sparkles, Heart } from 'lucide-react';

export const WHEEL_REWARDS = [
  'Spank Me',
  'Tongue Wrestling',
  'Try a New Position Next Time',
  'Tie Me',
  'Jacuzzi Time',
  'Get Head',
  'Give Me A Hickey',
  'Risky Quickie',
  'Strip Poker',
  'Massage',
] as const;

export type WheelReward = (typeof WHEEL_REWARDS)[number];

// High-energy popping palette: Bright Yellow, Hot Pink, Electric Blue, Bright Orange
const POP_SLICE_COLORS = [
  '#FFE600', // 1. Spank Me (Bright Yellow)
  '#FF2D87', // 2. Tongue Wrestling (Hot Pink)
  '#0055FF', // 3. Try a New Position Next Time (Electric Blue)
  '#FF5500', // 4. Tie Me (Orange)
  '#FFE600', // 5. Jacuzzi Time (Bright Yellow)
  '#FF2D87', // 6. Get Head (Hot Pink)
  '#0055FF', // 7. Give Me A Hickey (Electric Blue)
  '#FF5500', // 8. Risky Quickie (Orange)
  '#FFE600', // 9. Strip Poker (Bright Yellow)
  '#FF2D87', // 10. Massage (Hot Pink)
];

export const SurpriseWheel: React.FC = () => {
  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [winner, setWinner] = useState<WheelReward | null>(null);
  const [hasSpun, setHasSpun] = useState(false);
  const totalSpinsRef = useRef(0);

  const SLICE_COUNT = WHEEL_REWARDS.length; // 10
  const SLICE_DEGREE = 360 / SLICE_COUNT; // 36

  // Coordinates helper for drawing pie slices (center 250, 250, radius 236)
  const getCoordinatesForPercent = (angleInDegrees: number, radius = 236) => {
    const angleInRadians = (angleInDegrees - 90) * (Math.PI / 180);
    return {
      x: 250 + radius * Math.cos(angleInRadians),
      y: 250 + radius * Math.sin(angleInRadians),
    };
  };

  const handleSpin = () => {
    if (isSpinning) return;

    playPopSound();
    setIsSpinning(true);
    setWinner(null);
    setHasSpun(true);
    totalSpinsRef.current += 1;

    // Pick random target slice index (0 to 9)
    const targetIndex = Math.floor(Math.random() * SLICE_COUNT);

    // Calculate rotation to place winning slice directly at the top pointer (0 deg / 12 o'clock)
    const targetOffset = 360 - (targetIndex + 0.5) * SLICE_DEGREE;
    const fullSpins = (5 + Math.floor(Math.random() * 3)) * 360;
    const currentMod = rotation % 360;
    const additionalRotation = fullSpins + ((targetOffset - currentMod + 360) % 360);

    const nextRotation = rotation + additionalRotation;
    setRotation(nextRotation);

    // Finish spinning after 4s
    setTimeout(() => {
      setIsSpinning(false);
      const wonReward = WHEEL_REWARDS[targetIndex];
      setWinner(wonReward);
      playSparkleSound();

      confetti({
        particleCount: 80,
        spread: 95,
        origin: { y: 0.6 },
        colors: ['#FFE600', '#FF2D87', '#0055FF', '#FF5500', '#FFFFFF', '#000000'],
      });
    }, 4100);
  };

  // Perimeter tick dots (24 dots around rim)
  const perimeterDots = Array.from({ length: 24 }, (_, idx) => {
    const angle = (idx * 360) / 24;
    const rad = (angle - 90) * (Math.PI / 180);
    return {
      x: 250 + 242 * Math.cos(rad),
      y: 250 + 242 * Math.sin(rad),
      isYellow: idx % 2 === 0,
    };
  });

  return (
    <div className="relative w-full max-w-5xl mx-auto select-none">
      <div className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-14">
        {/* ======================================================== */}
        {/* STANDALONE WHEEL (NO GENERIC CARD, THICK OUTLINE)        */}
        {/* ======================================================== */}
        <div className="relative flex flex-col items-center justify-center shrink-0">
          {/* TOP POINTER: Bold Chunky Arrow pointing DOWN at winning slice */}
          <div className="absolute -top-6 z-30 filter drop-shadow-[0_6px_10px_rgba(0,0,0,0.5)]">
            <svg width="48" height="56" viewBox="0 0 48 56" fill="none">
              <polygon
                points="24,54 4,10 44,10"
                fill="#FF1744"
                stroke="#000000"
                strokeWidth="4.5"
                strokeLinejoin="round"
              />
              <circle cx="24" cy="20" r="6" fill="#FFE600" stroke="#000000" strokeWidth="2.5" />
            </svg>
          </div>

          {/* SVG Standalone Wheel with 5px dark outline & pop drop-shadow */}
          <div className="relative w-[330px] h-[330px] sm:w-[420px] sm:h-[420px] flex items-center justify-center">
            <svg
              viewBox="0 0 500 500"
              className="w-full h-full rounded-full overflow-hidden filter drop-shadow-[0_14px_0px_#000000]"
              style={{
                transform: `rotate(${rotation}deg)`,
                transition: isSpinning
                  ? 'transform 4s cubic-bezier(0.15, 0.9, 0.2, 1)'
                  : 'none',
              }}
            >
              {/* Outer Thick Dark Rim */}
              <circle cx="250" cy="250" r="248" fill="#000000" />
              <circle cx="250" cy="250" r="236" fill="#FFFDF5" stroke="#000000" strokeWidth="4" />

              {/* Perimeter Carnival Lights */}
              {perimeterDots.map((dot, dIdx) => (
                <circle
                  key={dIdx}
                  cx={dot.x}
                  cy={dot.y}
                  r={4.5}
                  fill={dot.isYellow ? '#FFE600' : '#FF2D87'}
                  stroke="#000000"
                  strokeWidth="1.5"
                />
              ))}

              {/* 10 Prize Slices */}
              {WHEEL_REWARDS.map((reward, i) => {
                const startAngle = i * SLICE_DEGREE;
                const endAngle = (i + 1) * SLICE_DEGREE;
                const start = getCoordinatesForPercent(startAngle, 236);
                const end = getCoordinatesForPercent(endAngle, 236);
                const midAngle = startAngle + SLICE_DEGREE / 2;
                const isYellowSlice = i % 4 === 0;

                return (
                  <g key={reward}>
                    {/* Slice Wedge */}
                    <path
                      d={`M 250 250 L ${start.x} ${start.y} A 236 236 0 0 1 ${end.x} ${end.y} Z`}
                      fill={POP_SLICE_COLORS[i % POP_SLICE_COLORS.length]}
                      stroke="#000000"
                      strokeWidth="3.5"
                    />

                    {/* Highly Legible Text inside each Slice */}
                    <g transform={`rotate(${midAngle} 250 250)`}>
                      <text
                        x="250"
                        y="108"
                        textAnchor="middle"
                        fill={isYellowSlice ? '#000000' : '#FFFFFF'}
                        className="font-sans font-black select-none uppercase tracking-tight"
                        style={{
                          paintOrder: 'stroke fill',
                          stroke: isYellowSlice ? 'none' : '#000000',
                          strokeWidth: isYellowSlice ? '0' : '2.5px',
                          strokeLinejoin: 'round',
                        }}
                      >
                        {reward === 'Spank Me' ? (
                          <tspan x="250" y="108" fontSize="16px">
                            SPANK ME
                          </tspan>
                        ) : reward === 'Tongue Wrestling' ? (
                          <>
                            <tspan x="250" y="98" fontSize="14px">
                              TONGUE
                            </tspan>
                            <tspan x="250" y="116" fontSize="13px">
                              WRESTLING
                            </tspan>
                          </>
                        ) : reward === 'Try a New Position Next Time' ? (
                          <>
                            <tspan x="250" y="93" fontSize="11px">
                              TRY A NEW
                            </tspan>
                            <tspan x="250" y="107" fontSize="12px">
                              POSITION
                            </tspan>
                            <tspan x="250" y="121" fontSize="11px">
                              NEXT TIME
                            </tspan>
                          </>
                        ) : reward === 'Tie Me' ? (
                          <tspan x="250" y="108" fontSize="17px">
                            TIE ME
                          </tspan>
                        ) : reward === 'Jacuzzi Time' ? (
                          <>
                            <tspan x="250" y="98" fontSize="14px">
                              JACUZZI
                            </tspan>
                            <tspan x="250" y="116" fontSize="14px">
                              TIME
                            </tspan>
                          </>
                        ) : reward === 'Get Head' ? (
                          <tspan x="250" y="108" fontSize="16px">
                            GET HEAD
                          </tspan>
                        ) : reward === 'Give Me A Hickey' ? (
                          <>
                            <tspan x="250" y="98" fontSize="13px">
                              GIVE ME
                            </tspan>
                            <tspan x="250" y="116" fontSize="13px">
                              A HICKEY
                            </tspan>
                          </>
                        ) : reward === 'Risky Quickie' ? (
                          <>
                            <tspan x="250" y="98" fontSize="14px">
                              RISKY
                            </tspan>
                            <tspan x="250" y="116" fontSize="14px">
                              QUICKIE
                            </tspan>
                          </>
                        ) : reward === 'Strip Poker' ? (
                          <>
                            <tspan x="250" y="98" fontSize="14px">
                              STRIP
                            </tspan>
                            <tspan x="250" y="116" fontSize="14px">
                              POKER
                            </tspan>
                          </>
                        ) : (
                          <tspan x="250" y="108" fontSize="16px">
                            MASSAGE
                          </tspan>
                        )}
                      </text>
                    </g>
                  </g>
                );
              })}

              {/* Large Central Hub with Thick Black Border */}
              <circle cx="250" cy="250" r="58" fill="#000000" />
              <circle cx="250" cy="250" r="50" fill="#FFE600" stroke="#000000" strokeWidth="4" />
              <circle cx="250" cy="250" r="42" fill="#FF2D87" />
              <circle cx="250" cy="250" r="34" fill="#FFE600" stroke="#000000" strokeWidth="2.5" />
              <text
                x="250"
                y="256"
                textAnchor="middle"
                fill="#000000"
                className="font-sans font-black text-base uppercase tracking-wider select-none pointer-events-none"
              >
                SPIN
              </text>
            </svg>

            {/* Clickable Center Button */}
            <button
              type="button"
              onClick={handleSpin}
              disabled={isSpinning}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-28 h-28 rounded-full cursor-pointer z-20 focus:outline-none disabled:cursor-not-allowed group"
              title="Click here to spin the wheel!"
            />
          </div>
        </div>

        {/* ======================================================== */}
        {/* WHEEL CONTROLS & PRIZE RESULT (BOLD POP DISPLAY)        */}
        {/* ======================================================== */}
        <div className="flex-1 max-w-md w-full space-y-5 text-left">
          {/* Header Title */}
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-[#FFE600] text-black font-mono text-xs font-black uppercase rounded-full border-3 border-black shadow-[3px_3px_0px_#000]">
              <Sparkles className="w-3.5 h-3.5 fill-black" />
              <span>SPIN FOR PRIZES</span>
            </div>
            <h3 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-black text-black tracking-tight leading-none pt-1">
              The Surprise Wheel 🎡
            </h3>
            <p className="font-sans text-sm sm:text-base font-bold text-black/85 leading-snug pt-1">
              Every slice is a real romantic reward claimable on demand with Parina. Give it a spin, boyfriend!
            </p>
          </div>

          {/* Big Action Spin Button */}
          <div>
            <button
              type="button"
              onClick={handleSpin}
              disabled={isSpinning}
              className={`w-full py-4 px-8 rounded-2xl font-sans font-black text-lg uppercase tracking-wider flex items-center justify-center gap-3 transition-all cursor-pointer border-4 border-black ${
                isSpinning
                  ? 'bg-stone-300 text-stone-600 cursor-not-allowed shadow-none'
                  : 'bg-[#FFE600] hover:bg-[#FFD600] text-black shadow-[6px_6px_0px_#000000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0px_#000000] active:translate-x-[6px] active:translate-y-[6px] active:shadow-none'
              }`}
            >
              <RotateCw className={`w-6 h-6 stroke-[3] ${isSpinning ? 'animate-spin' : ''}`} />
              <span>{isSpinning ? 'Spinning Wheel...' : hasSpun ? 'Spin Again! 🚀' : 'SPIN THE WHEEL! 🎡'}</span>
            </button>
          </div>

          {/* Unlocked Prize Card */}
          {winner && !isSpinning ? (
            <div className="bg-[#FFFDF5] border-4 border-black rounded-3xl p-5 shadow-[6px_6px_0px_#000] animate-in zoom-in-95 duration-300 relative overflow-hidden">
              <div className="absolute top-2.5 right-3 font-mono text-[10px] font-black uppercase bg-[#FF2D87] text-white px-2.5 py-0.5 rounded-full border-2 border-black">
                CLAIMABLE NOW
              </div>
              <span className="text-[11px] font-mono font-black text-[#FF5500] uppercase tracking-wider block mb-1">
                🎉 THE WHEEL HAS SPOKEN:
              </span>
              <h4 className="font-serif text-2xl sm:text-3xl font-black text-black tracking-tight leading-tight">
                {winner}
              </h4>
              <p className="font-handwriting text-xl sm:text-2xl text-[#FF2D87] font-black mt-2 leading-snug">
                “Claimable on demand with your girlfriend. No trade-ins, no excuses! ♡”
              </p>
              <div className="mt-3 pt-3 border-t-2 border-black/15 flex items-center gap-2 text-xs font-bold font-sans text-black">
                <Heart className="w-4 h-4 fill-[#FF2D87] text-[#FF2D87]" />
                <span>Show this screen or take a screenshot to redeem!</span>
              </div>
            </div>
          ) : (
            <div className="bg-[#FFFDF5]/90 border-3 border-black rounded-2xl p-4 shadow-[4px_4px_0px_#000] text-xs font-bold text-black/85 space-y-1">
              <span className="font-mono text-[#FF2D87] uppercase tracking-wider block">RULEBOOK:</span>
              <span>Tap the big yellow button or click directly on the center hub to set the wheel in motion!</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
