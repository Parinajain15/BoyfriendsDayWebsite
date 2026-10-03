import React, { useState } from 'react';
import { PolaroidMemory } from '../types/scrapbook';

interface MemoryPolaroidsProps {
  memories?: PolaroidMemory[];
  onAddMemory?: (memory: PolaroidMemory) => void;
  onDeleteMemory?: (id: string) => void;
  boyfriendName?: string;
}

interface PolaroidItem {
  id: string;
  image: string;
  caption: string;
  rotation: number;
}

const POLAROID_LIST: PolaroidItem[] = [
  {
    id: 'polaroid-kiss-2',
    image: '/photos/kiss%202.jpg',
    caption: '“Are you flirting with me, or should I come closer to make sure?”',
    rotation: -1.8,
  },
  {
    id: 'polaroid-hug-1',
    image: '/photos/hug%201.jpg',
    caption: '“Are you a charger? ’Cause one hug and I’m back at 100%.”',
    rotation: 1.5,
  },
  {
    id: 'polaroid-kiss-4',
    image: '/photos/kiss%204.JPG',
    caption: '“Do you always kiss this well, or am I just your favourite person to practice on?”',
    rotation: -1.2,
  },
  {
    id: 'polaroid-kiss-1',
    image: '/photos/kiss%201.jpg',
    caption: '“Are you trying to make me fall for you again, or is kissing me just your favourite hobby?”',
    rotation: 2.0,
  },
  {
    id: 'polaroid-hand-holding',
    image: '/photos/hand%20holding.jpg',
    caption: '“Can I hold your hand? I promise I’m not giving it back.”',
    rotation: -0.8,
  },
  {
    id: 'polaroid-hug-2',
    image: '/photos/hug%202.JPG',
    caption: '“Are you the tide? ’Cause you keep pulling me closer.”',
    rotation: 1.7,
  },
  {
    id: 'polaroid-close-1',
    image: '/photos/close%201.JPG',
    caption: '“Are your arms a restricted area? Because I never want to leave.”',
    rotation: -2.2,
  },
  {
    id: 'polaroid-kiss-3',
    image: '/photos/kiss%203.JPG',
    caption: '“Are you made of marshmallows? Because your face is begging to be squished with kisses.”',
    rotation: 1.2,
  },
  {
    id: 'polaroid-close-2',
    image: '/photos/close%202.jpg',
    caption: '“Caught myself staring again. Honestly, can you blame me?”',
    rotation: -1.5,
  },
];

export const MemoryPolaroids: React.FC<MemoryPolaroidsProps> = () => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <section id="memories" className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-14">
      {/* 3x3 Responsive Polaroid Scrapbook Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
        {POLAROID_LIST.map((item) => {
          const isHovered = hoveredId === item.id;

          return (
            <div
              key={item.id}
              className="relative flex justify-center select-none"
              onMouseEnter={() => setHoveredId(item.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              {/* White Polaroid-style Frame */}
              <div
                className="w-full max-w-[340px] bg-white p-3.5 pb-6 sm:p-4 sm:pb-7 rounded-xs border border-stone-200/40 transition-all duration-300 ease-out cursor-default"
                style={{
                  transform: isHovered
                    ? 'rotate(0deg) scale(1.02)'
                    : `rotate(${item.rotation}deg)`,
                  boxShadow: isHovered
                    ? '0 20px 30px -10px rgba(32, 48, 74, 0.22), 0 10px 15px -5px rgba(32, 48, 74, 0.12)'
                    : '0 10px 25px -5px rgba(32, 48, 74, 0.12), 0 8px 10px -6px rgba(32, 48, 74, 0.08)',
                  zIndex: isHovered ? 20 : 1,
                }}
              >
                {/* Photo on Top */}
                <div className="w-full aspect-square overflow-hidden bg-stone-100 rounded-[2px] border border-stone-150">
                  <img
                    src={item.image}
                    alt={item.caption}
                    className="w-full h-full object-cover block pointer-events-none"
                    loading="lazy"
                  />
                </div>

                {/* Caption in White Space Underneath */}
                <div className="pt-3.5 sm:pt-4 px-1.5 sm:px-2 min-h-[4.5rem] flex items-center justify-center text-center">
                  <p className="font-handwriting text-xl sm:text-2xl text-[#24324A] leading-snug tracking-wide">
                    {item.caption}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
