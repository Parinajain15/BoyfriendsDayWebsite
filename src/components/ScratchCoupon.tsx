import React, { useState, useRef, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { playSparkleSound, playPopSound } from '../utils/audio';
import { Ticket, RotateCcw, Sparkles } from 'lucide-react';

interface ScratchParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  color: string;
}

// Realistic Illustrated Metallic Silver Coin
export const IllustratedSilverCoin: React.FC<{
  size?: number;
  isDragging?: boolean;
  className?: string;
}> = ({ size = 80, isDragging = false, className = '' }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      className={`select-none filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.35)] transition-transform duration-100 ${
        isDragging ? 'scale-115 rotate-[-12deg]' : 'hover:scale-110 hover:rotate-6'
      } ${className}`}
    >
      <defs>
        <radialGradient id="silverOuterRealisticPop" cx="35%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="25%" stopColor="#E6EAEF" />
          <stop offset="55%" stopColor="#C4CCD5" />
          <stop offset="85%" stopColor="#9AA2AC" />
          <stop offset="100%" stopColor="#555E68" />
        </radialGradient>

        <linearGradient id="silverBevelRealisticPop" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="40%" stopColor="#D8DDE3" />
          <stop offset="70%" stopColor="#9AA2AC" />
          <stop offset="100%" stopColor="#3E454F" />
        </linearGradient>

        <radialGradient id="silverFaceRealisticPop" cx="40%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="35%" stopColor="#F1F4F7" />
          <stop offset="65%" stopColor="#C4CCD5" />
          <stop offset="90%" stopColor="#9AA2AC" />
          <stop offset="100%" stopColor="#555E68" />
        </radialGradient>
      </defs>

      {/* Reeded / Milled Outer Edge Rim with Dark Stroke */}
      <circle cx="50" cy="50" r="48" fill="url(#silverOuterRealisticPop)" stroke="#000000" strokeWidth="2.5" />

      {/* Reeded Teeth */}
      {Array.from({ length: 36 }).map((_, i) => {
        const angle = (i * 360) / 36;
        const rad = (angle * Math.PI) / 180;
        const x1 = 50 + 44 * Math.cos(rad);
        const y1 = 50 + 44 * Math.sin(rad);
        const x2 = 50 + 47.5 * Math.cos(rad);
        const y2 = 50 + 47.5 * Math.sin(rad);
        return (
          <line
            key={i}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke={i % 2 === 0 ? '#FFFFFF' : '#454D56'}
            strokeWidth="1.4"
          />
        );
      })}

      {/* Raised Inner Rim */}
      <circle cx="50" cy="50" r="42" fill="url(#silverBevelRealisticPop)" stroke="#717A85" strokeWidth="1" />
      <circle cx="50" cy="50" r="39" fill="url(#silverFaceRealisticPop)" stroke="#CBD2D9" strokeWidth="1" />

      {/* Beaded Border */}
      <circle
        cx="50"
        cy="50"
        r="35"
        fill="none"
        stroke="#454D56"
        strokeWidth="1.5"
        strokeDasharray="2 3"
        opacity="0.9"
      />

      {/* Center Engraved Emblem */}
      <g transform="translate(50, 48)">
        <path
          d="M 0 -2 C -8 -16, -22 -2, 0 16 C 22 -2, 8 -16, 0 -2 Z"
          fill="#D8DDE3"
          stroke="#333A42"
          strokeWidth="1.8"
        />
        <circle cx="0" cy="4" r="3" fill="#FF2D87" stroke="#000000" strokeWidth="0.8" />
      </g>

      {/* Arc Lettering */}
      <path id="coinArcTopPop" d="M 22 50 A 28 28 0 0 1 78 50" fill="none" />
      <text fill="#22262B" fontSize="6.5" fontFamily="sans-serif" fontWeight="900" letterSpacing="1.2">
        <textPath href="#coinArcTopPop" startOffset="50%" textAnchor="middle">
          ★ SCRATCH COIN ★
        </textPath>
      </text>

      <path id="coinArcBottomPop" d="M 76 52 A 26 26 0 0 1 24 52" fill="none" />
      <text fill="#3E454F" fontSize="6" fontFamily="sans-serif" fontWeight="bold" letterSpacing="1.2">
        <textPath href="#coinArcBottomPop" startOffset="50%" textAnchor="middle">
          ABHI & PARINA
        </textPath>
      </text>
    </svg>
  );
};

export const ScratchCoupon: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [isScratched, setIsScratched] = useState(false);
  const [scratchPercent, setScratchPercent] = useState(0);
  const [isDraggingCoin, setIsDraggingCoin] = useState(false);
  const [coinPos, setCoinPos] = useState<{ x: number; y: number; onCanvas: boolean }>({
    x: 0,
    y: 0,
    onCanvas: false,
  });

  const particlesRef = useRef<ScratchParticle[]>([]);
  const isScratchingRef = useRef(false);
  const lastPointRef = useRef<{ x: number; y: number } | null>(null);
  const isCompletedRef = useRef(false);

  // Initialize and paint shimmering metallic foil onto canvas
  const initFoil = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    ctx.globalCompositeOperation = 'source-over';
    ctx.clearRect(0, 0, width, height);

    // Shimmering Metallic Silver Foil Gradient
    const grad = ctx.createLinearGradient(0, 0, width, height);
    grad.addColorStop(0, '#BFC5CC');
    grad.addColorStop(0.2, '#FFFFFF');
    grad.addColorStop(0.4, '#9AA2AC');
    grad.addColorStop(0.65, '#E6EAEF');
    grad.addColorStop(0.85, '#BFC5CC');
    grad.addColorStop(1, '#5B646F');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    // Micro Sparkle Grid
    ctx.fillStyle = 'rgba(255, 255, 255, 0.55)';
    for (let i = 0; i < width; i += 8) {
      for (let j = 0; j < height; j += 8) {
        if ((i + j) % 16 === 0) {
          ctx.fillRect(i, j, 2, 2);
        }
      }
    }

    // Bold Stamped Border
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2.5;
    ctx.strokeRect(8, 8, width - 16, height - 16);

    // Stamped Foil Label
    ctx.fillStyle = '#000000';
    ctx.font = '900 15px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('✦ SCRATCH OFF TO REVEAL ✦', width / 2, height / 2 - 10);

    ctx.font = 'bold 12px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#1A1A1A';
    ctx.fillText('🪙 Drag the silver coin across to uncover your pass', width / 2, height / 2 + 12);

    isCompletedRef.current = false;
    setScratchPercent(0);
    setIsScratched(false);
  }, []);

  // Resize canvas
  useEffect(() => {
    const handleResize = () => {
      const container = containerRef.current;
      const canvas = canvasRef.current;
      if (!container || !canvas) return;

      const rect = container.getBoundingClientRect();
      const w = Math.floor(rect.width);
      const h = Math.floor(rect.height || 140);

      if (w > 0 && h > 0) {
        canvas.width = w;
        canvas.height = h;
        initFoil();
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [initFoil]);

  const scratchAt = (x: number, y: number) => {
    const canvas = canvasRef.current;
    if (!canvas || isCompletedRef.current) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.globalCompositeOperation = 'destination-out';

    ctx.beginPath();
    if (lastPointRef.current) {
      ctx.lineWidth = 42;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.moveTo(lastPointRef.current.x, lastPointRef.current.y);
      ctx.lineTo(x, y);
      ctx.stroke();
    } else {
      ctx.arc(x, y, 21, 0, Math.PI * 2);
      ctx.fill();
    }

    lastPointRef.current = { x, y };

    if (Math.random() > 0.6) {
      checkCompletion();
    }
  };

  const checkCompletion = () => {
    const canvas = canvasRef.current;
    if (!canvas || isCompletedRef.current) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    try {
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imgData.data;
      let clearPixels = 0;
      const totalPixels = data.length / 4;

      for (let i = 3; i < data.length; i += 16) {
        if (data[i] === 0) {
          clearPixels++;
        }
      }

      const ratio = clearPixels / (totalPixels / 4);
      const percent = Math.min(100, Math.round(ratio * 100));
      setScratchPercent(percent);

      if (percent >= 35 && !isCompletedRef.current) {
        isCompletedRef.current = true;
        setIsScratched(true);
        playSparkleSound();
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        confetti({
          particleCount: 65,
          spread: 85,
          origin: { y: 0.6 },
          colors: ['#FFE600', '#FF2D87', '#0055FF', '#FF6000', '#FFFFFF', '#000000'],
        });
      }
    } catch {
      // Ignore
    }
  };

  // Mouse handlers
  const handleCanvasMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    isScratchingRef.current = true;
    setIsDraggingCoin(true);
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    lastPointRef.current = { x, y };
    scratchAt(x, y);
    setCoinPos({ x, y, onCanvas: true });
    playPopSound();
  };

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setCoinPos({ x, y, onCanvas: true });

    if (isScratchingRef.current) {
      scratchAt(x, y);
    }
  };

  const handleCanvasMouseUp = () => {
    isScratchingRef.current = false;
    setIsDraggingCoin(false);
    lastPointRef.current = null;
  };

  const handleCanvasMouseLeave = () => {
    isScratchingRef.current = false;
    setIsDraggingCoin(false);
    lastPointRef.current = null;
    setCoinPos((prev) => ({ ...prev, onCanvas: false }));
  };

  // Touch handlers
  const handleCanvasTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    isScratchingRef.current = true;
    setIsDraggingCoin(true);
    const touch = e.touches[0];
    const rect = e.currentTarget.getBoundingClientRect();
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;
    lastPointRef.current = { x, y };
    scratchAt(x, y);
    setCoinPos({ x, y, onCanvas: true });
    playPopSound();
  };

  const handleCanvasTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    const touch = e.touches[0];
    const rect = e.currentTarget.getBoundingClientRect();
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;
    setCoinPos({ x, y, onCanvas: true });

    if (isScratchingRef.current) {
      scratchAt(x, y);
    }
  };

  const handleCanvasTouchEnd = () => {
    isScratchingRef.current = false;
    setIsDraggingCoin(false);
    lastPointRef.current = null;
    setCoinPos((prev) => ({ ...prev, onCanvas: false }));
  };

  return (
    <div className="relative w-full max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-6 sm:gap-8 select-none">
      {/* ======================================================== */}
      {/* 1. LARGE HORIZONTAL POP TICKET SCRATCH CARD              */}
      {/* Thick 4px black borders, scalloped notches, vibrant tags */}
      {/* ======================================================== */}
      <div
        id="scratch-card"
        className="flex-1 w-full bg-[#FFFDF5] rounded-3xl border-4 border-black p-5 sm:p-6 shadow-[8px_8px_0px_#000000] relative overflow-hidden transform -rotate-[0.5deg] hover:rotate-0 transition-transform duration-300"
      >
        {/* Scalloped Notches on Left & Right Sides */}
        <div className="absolute top-1/2 -left-4 -translate-y-1/2 w-8 h-8 rounded-full bg-[#FF5A1F] border-r-4 border-black z-20" />
        <div className="absolute top-1/2 -right-4 -translate-y-1/2 w-8 h-8 rounded-full bg-[#FF5A1F] border-l-4 border-black z-20" />

        {/* Top Ticket Header Badge */}
        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b-2 border-dashed border-black/30">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-[#FFE600] text-black font-mono font-black text-xs uppercase tracking-wider rounded-lg border-2 border-black shadow-[2px_2px_0px_#000]">
              GOLDEN VOUCHER
            </span>
            <span className="text-xs font-mono font-bold text-black/60">
              #BF-LIFETIME-PASS
            </span>
          </div>
          <div className="flex items-center gap-1 font-mono text-xs font-black text-[#FF2D87]">
            <Sparkles className="w-3.5 h-3.5 fill-[#FF2D87]" />
            <span>AUTHENTIC GUARANTEE</span>
          </div>
        </div>

        {/* Content & Description */}
        <div className="pt-3 pb-2 space-y-1">
          <h3 className="font-serif text-2xl sm:text-3xl font-black text-black tracking-tight">
            Scratch & Win Voucher 🎟️
          </h3>
          <p className="font-sans text-xs sm:text-sm font-bold text-black/75">
            Grab the silver coin and scratch off the metallic surface below to unlock your secret privilege!
          </p>
        </div>

        {/* The Foil Canvas Box */}
        <div
          ref={containerRef}
          className="relative min-h-[145px] sm:min-h-[160px] rounded-2xl border-4 border-black overflow-hidden shadow-inner bg-[#FFF8E7] flex items-center justify-center cursor-crosshair select-none my-2"
        >
          {/* UNDERLYING SECRET REWARD */}
          <div className="w-full h-full p-4 flex flex-col items-center justify-center text-center bg-gradient-to-br from-[#FFF8E7] via-[#FFFDF5] to-[#FFE600]/30">
            <span className="px-3 py-0.5 bg-[#FF2D87] text-white font-mono text-[10px] sm:text-xs font-black uppercase tracking-widest rounded-full border-2 border-black shadow-[2px_2px_0px_#000] mb-1">
              ★ OFFICIAL UNLOCKED PRIVILEGE ★
            </span>
            <p className="font-serif text-2xl sm:text-3xl lg:text-4xl text-black font-black my-1 tracking-tight">
              ONE SKIP-THE-FIGHT PASS
            </p>
            <p className="font-handwriting text-lg sm:text-xl md:text-2xl text-[#FF1744] font-black leading-snug">
              Valid for one argument. No questions. No complaints. Parina surrenders immediately!<br />
              Use it wisely, boyfriend. ♡
            </p>
          </div>

          {/* HTML5 CANVAS FOIL */}
          {!isCompletedRef.current && (
            <canvas
              ref={canvasRef}
              onMouseDown={handleCanvasMouseDown}
              onMouseMove={handleCanvasMouseMove}
              onMouseUp={handleCanvasMouseUp}
              onMouseLeave={handleCanvasMouseLeave}
              onTouchStart={handleCanvasTouchStart}
              onTouchMove={handleCanvasTouchMove}
              onTouchEnd={handleCanvasTouchEnd}
              className="absolute inset-0 w-full h-full touch-none z-10"
              style={{ touchAction: 'none' }}
            />
          )}

          {/* CURSOR FOLLOWER COIN */}
          {!isCompletedRef.current && coinPos.onCanvas && (
            <div
              className="absolute pointer-events-none z-30 transition-transform duration-75"
              style={{
                left: `${coinPos.x - 40}px`,
                top: `${coinPos.y - 40}px`,
              }}
            >
              <IllustratedSilverCoin size={80} isDragging={isDraggingCoin} />
            </div>
          )}
        </div>

        {/* Progress & Reset Status */}
        <div className="flex items-center justify-between text-xs sm:text-sm font-sans font-black pt-1">
          <span className={isScratched ? 'text-emerald-700' : 'text-[#FF2D87]'}>
            {isScratched
              ? '🎉 100% UNLOCKED — Active & Redeemable Forever!'
              : scratchPercent > 0
              ? `⚡ Scratched: ${scratchPercent}% revealed`
              : '🪙 Drag the coin across the foil'}
          </span>

          {isScratched && (
            <button
              type="button"
              onClick={initFoil}
              className="px-3 py-1 bg-[#FFE600] text-black font-sans font-black text-xs rounded-xl border-2 border-black shadow-[2px_2px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px] cursor-pointer flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Cover foil again</span>
            </button>
          )}
        </div>
      </div>

      {/* ======================================================== */}
      {/* 2. BIG REALISTIC SILVER COIN PLACED BESIDE IT            */}
      {/* ======================================================== */}
      <div className="shrink-0 flex flex-col items-center justify-center text-center p-3">
        {/* Playful Handwritten Doodles */}
        <div className="font-handwriting text-xl sm:text-2xl text-black font-black -rotate-6 leading-tight mb-2">
          grab this coin! ↴
          <br />
          <span className="text-[#FF2D87] text-lg">scratch & uncover! 🪙</span>
        </div>

        {/* The Coin */}
        <div
          onMouseDown={() => {
            setIsDraggingCoin(true);
            playPopSound();
          }}
          className="cursor-grab active:cursor-grabbing transform hover:scale-115 active:scale-95 transition-all p-2"
          title="Drag this silver coin across the scratch card!"
        >
          <IllustratedSilverCoin size={88} isDragging={isDraggingCoin} />
        </div>

        <span className="mt-2 px-3 py-0.5 bg-black text-white font-mono text-[10px] font-black uppercase rounded-full tracking-wider">
          SILVER SCRATCHER
        </span>
      </div>
    </div>
  );
};
