import React, { useState, useRef, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { playSparkleSound, playPopSound } from '../utils/audio';
import { Sparkles, Ticket, RotateCcw } from 'lucide-react';

interface ScratchParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  color: string;
}

// Realistic Illustrated Metallic Silver Coin (#BFC5CC palette)
export const IllustratedSilverCoin: React.FC<{
  size?: number;
  isDragging?: boolean;
  className?: string;
}> = ({ size = 72, isDragging = false, className = '' }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      className={`select-none filter drop-shadow-[0_8px_18px_rgba(43,33,30,0.28)] transition-transform duration-100 ${
        isDragging ? 'scale-110 rotate-[-12deg]' : 'hover:scale-108 hover:rotate-6'
      } ${className}`}
    >
      <defs>
        {/* Outer Silver Gradient (#BFC5CC base with highlights) */}
        <radialGradient id="silverOuterRealistic" cx="35%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="25%" stopColor="#E6EAEF" />
          <stop offset="55%" stopColor="#BFC5CC" />
          <stop offset="85%" stopColor="#9AA2AC" />
          <stop offset="100%" stopColor="#6C7580" />
        </radialGradient>

        {/* Inner Bevel Gradient */}
        <linearGradient id="silverBevelRealistic" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="40%" stopColor="#D8DDE3" />
          <stop offset="70%" stopColor="#9AA2AC" />
          <stop offset="100%" stopColor="#535B65" />
        </linearGradient>

        {/* Embossed Face Gradient */}
        <radialGradient id="silverFaceRealistic" cx="40%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="35%" stopColor="#F1F4F7" />
          <stop offset="65%" stopColor="#BFC5CC" />
          <stop offset="90%" stopColor="#9AA2AC" />
          <stop offset="100%" stopColor="#6C7580" />
        </radialGradient>
      </defs>

      {/* Reeded / Milled Outer Edge Rim */}
      <circle cx="50" cy="50" r="48" fill="url(#silverOuterRealistic)" stroke="#535B65" strokeWidth="1.5" />

      {/* 36 Concentric Reeded Teeth */}
      {Array.from({ length: 36 }).map((_, i) => {
        const angle = (i * 360) / 36;
        const rad = (angle * Math.PI) / 180;
        const x1 = 50 + 44 * Math.cos(rad);
        const y1 = 50 + 44 * Math.sin(rad);
        const x2 = 50 + 47 * Math.cos(rad);
        const y2 = 50 + 47 * Math.sin(rad);
        return (
          <line
            key={i}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke={i % 2 === 0 ? '#FFFFFF' : '#6C7580'}
            strokeWidth="1.2"
          />
        );
      })}

      {/* Raised Inner Rim */}
      <circle cx="50" cy="50" r="42" fill="url(#silverBevelRealistic)" stroke="#9AA2AC" strokeWidth="1" />
      <circle cx="50" cy="50" r="39" fill="url(#silverFaceRealistic)" stroke="#CBD2D9" strokeWidth="1" />

      {/* Dotted Beaded Border */}
      <circle
        cx="50"
        cy="50"
        r="35"
        fill="none"
        stroke="#6C7580"
        strokeWidth="1.2"
        strokeDasharray="2 3"
        opacity="0.8"
      />

      {/* Center Engraved Emblem: Heart & Starburst */}
      <g transform="translate(50, 48)">
        <path
          d="M 0 -2 C -8 -16, -22 -2, 0 16 C 22 -2, 8 -16, 0 -2 Z"
          fill="#D8DDE3"
          stroke="#535B65"
          strokeWidth="1.5"
          filter="drop-shadow(0 1px 1px rgba(255,255,255,0.8))"
        />
        <path d="M 0 -8 L 1 -5 L 4 -4 L 1 -3 L 0 0 L -1 -3 L -4 -4 L -1 -5 Z" fill="#6C7580" />
        <circle cx="0" cy="4" r="2.5" fill="#E94B45" opacity="0.9" />
      </g>

      {/* Arc Lettering: LUCKY PASS */}
      <path id="coinArcTop" d="M 24 50 A 26 26 0 0 1 76 50" fill="none" />
      <text fill="#454D56" fontSize="6.5" fontFamily="sans-serif" fontWeight="900" letterSpacing="1.2">
        <textPath href="#coinArcTop" startOffset="50%" textAnchor="middle">
          ★ LUCKY TOKEN ★
        </textPath>
      </text>

      <path id="coinArcBottom" d="M 74 52 A 25 25 0 0 1 26 52" fill="none" />
      <text fill="#535B65" fontSize="6" fontFamily="sans-serif" fontWeight="bold" letterSpacing="1.2">
        <textPath href="#coinArcBottom" startOffset="50%" textAnchor="middle">
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

  // Initialize and paint metallic silver scratch foil onto canvas
  const initFoil = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Reset composite operation to default
    ctx.globalCompositeOperation = 'source-over';
    ctx.clearRect(0, 0, width, height);

    // 1. Shimmering Metallic Silver (#BFC5CC) Foil Gradient
    const grad = ctx.createLinearGradient(0, 0, width, height);
    grad.addColorStop(0, '#BFC5CC');
    grad.addColorStop(0.2, '#FFFFFF');
    grad.addColorStop(0.4, '#9AA2AC');
    grad.addColorStop(0.65, '#E6EAEF');
    grad.addColorStop(0.85, '#BFC5CC');
    grad.addColorStop(1, '#6C7580');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    // 2. Micro Foil Sparkle Texture Pattern
    ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
    for (let i = 0; i < width; i += 7) {
      for (let j = 0; j < height; j += 7) {
        if ((i + j) % 14 === 0) {
          ctx.fillRect(i, j, 1.5, 1.5);
        }
      }
    }

    // 3. Decorative Border Stamped on Foil
    ctx.strokeStyle = 'rgba(43, 33, 30, 0.3)';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(6, 6, width - 12, height - 12);

    // 4. Centered Stamp Text
    ctx.fillStyle = '#2B211E';
    ctx.font = '900 12px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('✦ SCRATCH OFF FOIL ✦', width / 2, height / 2 - 8);

    ctx.font = 'bold 10px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#2B211E';
    ctx.fillText('Drag the silver coin across to reveal perk', width / 2, height / 2 + 10);

    isCompletedRef.current = false;
    setScratchPercent(0);
    setIsScratched(false);
  }, []);

  // Resize canvas according to display width
  useEffect(() => {
    const handleResize = () => {
      const container = containerRef.current;
      const canvas = canvasRef.current;
      if (!container || !canvas) return;

      const rect = container.getBoundingClientRect();
      const w = Math.floor(rect.width);
      const h = Math.floor(rect.height || 125);

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

  // Scratch action helper
  const scratchAt = (x: number, y: number) => {
    const canvas = canvasRef.current;
    if (!canvas || isCompletedRef.current) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.globalCompositeOperation = 'destination-out';

    // Draw scratch line or circle with irregular scratch texture
    ctx.beginPath();
    if (lastPointRef.current) {
      ctx.lineWidth = 36;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.moveTo(lastPointRef.current.x, lastPointRef.current.y);
      ctx.lineTo(x, y);
      ctx.stroke();
    } else {
      ctx.arc(x, y, 18, 0, Math.PI * 2);
      ctx.fill();
    }

    lastPointRef.current = { x, y };

    // Emit tiny metallic foil particles
    for (let i = 0; i < 3; i++) {
      particlesRef.current.push({
        x: x + (Math.random() - 0.5) * 16,
        y: y + (Math.random() - 0.5) * 16,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2 - 1,
        size: Math.random() * 2 + 1,
        alpha: 1,
        color: Math.random() > 0.5 ? '#BFC5CC' : '#FFFFFF',
      });
    }

    // Check completion threshold
    if (Math.random() > 0.65) {
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

      if (percent >= 38 && !isCompletedRef.current) {
        isCompletedRef.current = true;
        setIsScratched(true);
        playSparkleSound();

        // Smoothly clear remaining foil
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        confetti({
          particleCount: 50,
          spread: 75,
          origin: { y: 0.65 },
          colors: ['#E94B45', '#A9D8EA', '#F6D66A', '#F29AAF', '#BFC5CC'],
          disableForReducedMotion: true,
        });
      }
    } catch {
      // Ignore security errors
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

  // Touch handlers for mobile
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
    <div className="relative flex flex-col md:flex-row items-center md:items-center gap-5 sm:gap-6">
      {/* ======================================================== */}
      {/* 1. THE SCRATCH CARD BODY (VINTAGE TICKET, WIDER & SHORTER)*/}
      {/* Warm ivory base, tomato red typography, powder blue trim */}
      {/* ======================================================== */}
      <div
        id="scratch-card"
        className="flex-1 w-full bg-[#FFFDF7] rounded-2xl border-2 border-[#2B211E] p-4 sm:p-5 shadow-[0_12px_28px_rgba(43,33,30,0.12)] transform -rotate-[0.8deg] hover:rotate-0 transition-transform duration-300 relative overflow-hidden"
      >
        {/* Scalloped Notches on Left & Right Sides for Physical Ticket Look */}
        <div className="absolute top-1/2 -left-3.5 -translate-y-1/2 w-7 h-7 rounded-full bg-[#FFF8EF] border-r-2 border-[#2B211E]" />
        <div className="absolute top-1/2 -right-3.5 -translate-y-1/2 w-7 h-7 rounded-full bg-[#FFF8EF] border-l-2 border-[#2B211E]" />

        {/* Vintage Top Powder Blue Washi Tape Detail */}
        <div className="absolute -top-3 left-8 px-3 py-0.5 bg-[#A9D8EA] border border-[#2B211E]/30 text-[#2B211E] text-[9px] font-mono font-bold tracking-widest uppercase rounded-xs shadow-2xs flex items-center gap-1 -rotate-1">
          <Ticket className="w-3 h-3 text-[#2B211E]" />
          <span>VINTAGE TICKET VOUCHER</span>
        </div>

        <div className="space-y-2">
          {/* Card Header */}
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-2">
              <h3 className="font-serif text-xl sm:text-2xl text-[#E94B45] font-black tracking-tight">
                SCRATCH CARD
              </h3>
              <span className="text-[10px] font-mono font-bold text-[#A9D8EA] bg-[#2B211E] px-2 py-0.5 rounded-full uppercase tracking-wider">
                NO. BF-PASS
              </span>
            </div>
            <span className="text-xs font-mono font-bold text-[#E94B45]">★ LUCKY FOIL ★</span>
          </div>

          <p className="font-sans text-xs text-[#2B211E]/75">
            Use the silver coin to scratch the foil and reveal your official boyfriend pass.
          </p>

          {/* The Scratch Foil Container (Wider & Shorter Proportions) */}
          <div
            ref={containerRef}
            className="relative min-h-[120px] rounded-xl border-2 border-dashed border-[#2B211E]/40 overflow-hidden shadow-inner bg-[#FFF8EF] flex items-center justify-center cursor-crosshair select-none"
          >
            {/* UNDERLYING REVEALED PERK */}
            <div className="w-full h-full p-3.5 flex flex-col items-center justify-center text-center">
              <span className="text-[10px] font-mono text-[#E94B45] uppercase tracking-widest font-black mb-0.5">
                ★ OFFICIAL UNLOCKED PERK ★
              </span>
              <p className="font-serif text-lg sm:text-xl text-[#2B211E] font-black my-0.5 tracking-tight">
                ONE SKIP-THE-FIGHT PASS
              </p>
              <div className="font-handwriting text-base sm:text-lg text-[#E94B45] font-bold leading-snug">
                Valid for one argument. No questions. No complaints.<br />
                Use it wisely, boyfriend. ♡
              </div>
            </div>

            {/* HTML5 CANVAS METALLIC SILVER FOIL OVERLAY */}
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

            {/* COIN TRACKING CURSOR ON CANVAS WHEN DRAGGING */}
            {!isCompletedRef.current && coinPos.onCanvas && (
              <div
                className="absolute pointer-events-none z-20 transition-transform duration-75"
                style={{
                  left: `${coinPos.x - 36}px`,
                  top: `${coinPos.y - 36}px`,
                }}
              >
                <IllustratedSilverCoin size={72} isDragging={isDraggingCoin} />
              </div>
            )}
          </div>

          {/* Progress & Controls */}
          <div className="flex items-center justify-between text-xs text-[#2B211E] font-sans pt-0.5">
            <span className="font-semibold text-[#E94B45]">
              {isScratched
                ? '✨ 100% Unlocked — Valid on Demand'
                : scratchPercent > 0
                ? `Scratched: ${scratchPercent}% revealed`
                : '🪙 Drag the coin across the foil'}
            </span>

            {isScratched && (
              <button
                type="button"
                onClick={initFoil}
                className="text-[#E94B45] hover:text-[#2B211E] hover:underline font-sans cursor-pointer text-xs font-bold flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Cover foil again</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 2. REALISTIC METALLIC SILVER COIN PLACED OUTSIDE BESIDE IT*/}
      {/* With handwritten annotations: "drag the coin →" & "scratch it!"*/}
      {/* ======================================================== */}
      <div className="shrink-0 flex flex-col items-center justify-center text-center group cursor-grab active:cursor-grabbing p-2">
        {/* Handwritten Annotations */}
        <div className="mb-1 text-center font-handwriting text-base sm:text-lg text-[#E94B45] font-bold rotate-2 leading-tight">
          drag the coin →
          <br />
          <span className="text-[#2B211E] text-sm">scratch it! 🪙</span>
        </div>

        {/* The Illustrated Silver Coin Token */}
        <div
          onMouseDown={() => {
            setIsDraggingCoin(true);
            playPopSound();
          }}
          className="cursor-grab active:cursor-grabbing transform hover:scale-110 active:scale-95 transition-all p-1"
          title="Click and drag this silver coin across the scratch card"
        >
          <IllustratedSilverCoin size={74} isDragging={isDraggingCoin} />
        </div>

        <span className="mt-1 text-[10px] font-mono font-bold text-[#2B211E]/70 uppercase tracking-wider">
          SILVER TOKEN
        </span>
      </div>
    </div>
  );
};
