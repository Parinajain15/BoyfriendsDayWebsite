import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { playSparkleSound, playHeartChime } from '../utils/audio';
import { Heart, Sparkles } from 'lucide-react';

interface FinalMessageProps {
  boyfriendName?: string;
  senderName?: string;
  anniversaryDate?: string;
}

export const FinalMessage: React.FC<FinalMessageProps> = () => {
  const [loveReplied, setLoveReplied] = useState(false);

  const handleSendLoveBack = () => {
    setLoveReplied(true);
    playHeartChime();
    playSparkleSound();
    confetti({
      particleCount: 45,
      spread: 70,
      origin: { y: 0.65 },
      colors: ['#F43F5E', '#FB7185', '#FDA4AF', '#FFE4E6', '#FFF4B8'],
      disableForReducedMotion: true,
    });
  };

  return (
    <section id="final-letter" className="max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-14 space-y-6">
      {/* Delicate Romantic Storybook Banner (Heading 'Okay, One Serious Thing' removed completely) */}
      <div className="text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-rose-100/90 border border-rose-300 rounded-full font-sans text-xs font-bold uppercase text-rose-800 tracking-wider shadow-2xs">
          <span className="text-rose-600">💌</span>
          <span>A Love Letter For Abhi · From Parina</span>
          <span className="text-rose-600">🌹</span>
        </div>
      </div>

      {/* Storybook Love Letter Scene with Romantic Pink & Red Palette */}
      <div className="relative pt-6 sm:pt-8 pb-4">
        {/* ======================================================== */}
        {/* STORYBOOK BIRDS & RED/PINK BOTANICAL FLOURISHES          */}
        {/* ======================================================== */}

        {/* Bird 1 (Top Left): Graceful bird carrying a deep rose/coral silk ribbon */}
        <div className="absolute -top-6 sm:-top-9 -left-3 sm:-left-8 z-20 pointer-events-none select-none transition-transform hover:scale-105">
          <svg
            className="w-20 h-20 sm:w-28 sm:h-28 drop-shadow-[0_8px_16px_rgba(159,18,57,0.18)]"
            viewBox="0 0 120 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Flowing Deep Rose Silk Ribbon in beak */}
            <path
              d="M72 45 C85 38, 98 46, 108 40 C114 36, 118 42, 112 48 C102 56, 92 50, 80 52"
              stroke="#E11D48"
              strokeWidth="2.5"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M72 45 C82 52, 94 62, 104 68 C108 71, 104 75, 99 72 C90 66, 80 58, 70 50"
              stroke="#FB7185"
              strokeWidth="1.8"
              strokeLinecap="round"
              fill="none"
            />

            {/* Bird Tail Feathers with soft rose & charcoal blush */}
            <path
              d="M18 68 C12 72, 8 78, 4 86 C12 82, 22 76, 28 72 Z"
              fill="#9F1239"
            />
            <path
              d="M22 66 C16 72, 10 80, 8 90 C18 84, 26 76, 32 70 Z"
              fill="#BE123C"
            />

            {/* Bird Body */}
            <path
              d="M26 66 C32 58, 42 50, 56 46 C66 43, 72 44, 76 47 C74 54, 70 64, 62 70 C52 78, 38 76, 26 66 Z"
              fill="#E11D48"
            />
            {/* Soft Cream Breast */}
            <path
              d="M48 50 C58 48, 68 50, 72 56 C70 64, 64 68, 54 70 C48 70, 44 64, 48 50 Z"
              fill="#FFF1F2"
              opacity="0.95"
            />

            {/* Left/Upper Wing gracefully lifted in flight */}
            <path
              d="M44 52 C42 36, 48 20, 60 12 C62 18, 60 30, 54 44 Z"
              fill="#F43F5E"
            />
            <path
              d="M48 48 C48 34, 55 22, 66 16 C66 22, 63 32, 57 44 Z"
              fill="#FDA4AF"
            />

            {/* Bird Head */}
            <circle cx="72" cy="46" r="8" fill="#E11D48" />
            <circle cx="71" cy="48" r="4.5" fill="#FFF1F2" opacity="0.85" />
            {/* Gentle Eye */}
            <circle cx="74" cy="45" r="1.5" fill="#24324A" />
            <circle cx="74.5" cy="44.5" r="0.5" fill="#FFFFFF" />

            {/* Little Golden Beak */}
            <polygon points="78,44 86,46 78,48" fill="#F59E0B" />
          </svg>
        </div>

        {/* Bird 2 (Top Right): Graceful bird arriving with red rosebuds and botanical sprig */}
        <div className="absolute -top-7 sm:-top-10 -right-2 sm:-right-7 z-20 pointer-events-none select-none transition-transform hover:scale-105">
          <svg
            className="w-20 h-20 sm:w-28 sm:h-28 drop-shadow-[0_8px_16px_rgba(159,18,57,0.18)]"
            viewBox="0 0 120 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Botanical sprig with red rosebud in beak */}
            <path
              d="M48 48 C38 46, 28 42, 18 36"
              stroke="#059669"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path
              d="M32 44 C28 40, 26 34, 30 32 C34 34, 34 40, 32 44 Z"
              fill="#34D399"
            />
            <path
              d="M24 40 C18 38, 16 32, 20 30 C24 32, 25 37, 24 40 Z"
              fill="#6EE7B7"
            />
            {/* Red rosebud */}
            <circle cx="14" cy="30" r="3.5" fill="#E11D48" />
            <circle cx="13" cy="29" r="1.5" fill="#FDA4AF" />

            {/* Bird Tail Feathers */}
            <path
              d="M102 68 C108 72, 112 78, 116 86 C108 82, 98 76, 92 72 Z"
              fill="#9F1239"
            />
            <path
              d="M98 66 C104 72, 110 80, 112 90 C102 84, 94 76, 88 70 Z"
              fill="#BE123C"
            />

            {/* Bird Body (facing left towards letter) */}
            <path
              d="M94 66 C88 58, 78 50, 64 46 C54 43, 48 44, 44 47 C46 54, 50 64, 58 70 C68 78, 82 76, 94 66 Z"
              fill="#E11D48"
            />
            <path
              d="M72 50 C62 48, 52 50, 48 56 C50 64, 56 68, 66 70 C72 70, 76 64, 72 50 Z"
              fill="#FFF1F2"
              opacity="0.95"
            />

            {/* Wing */}
            <path
              d="M76 52 C78 36, 72 20, 60 12 C58 18, 60 30, 66 44 Z"
              fill="#F43F5E"
            />
            <path
              d="M72 48 C72 34, 65 22, 54 16 C54 22, 57 32, 63 44 Z"
              fill="#FDA4AF"
            />

            {/* Head */}
            <circle cx="48" cy="46" r="8" fill="#E11D48" />
            <circle cx="49" cy="48" r="4.5" fill="#FFF1F2" opacity="0.85" />
            <circle cx="46" cy="45" r="1.5" fill="#24324A" />
            <circle cx="45.5" cy="44.5" r="0.5" fill="#FFFFFF" />

            {/* Golden Beak */}
            <polygon points="42,44 34,46 42,48" fill="#F59E0B" />
          </svg>
        </div>

        {/* Bird 3 (Bottom Right): Gentle companion bird near signature */}
        <div className="absolute -bottom-4 sm:-bottom-6 -right-2 sm:-right-5 z-20 pointer-events-none select-none hidden sm:block transition-transform hover:scale-105">
          <svg
            className="w-16 h-16 sm:w-20 sm:h-20 drop-shadow-[0_6px_12px_rgba(159,18,57,0.15)]"
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M10 75 Q35 65 75 70"
              stroke="#059669"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path
              d="M25 68 C22 62, 28 58, 32 62 C30 66, 26 68, 25 68 Z"
              fill="#34D399"
            />
            <path
              d="M45 66 C42 60, 48 56, 52 60 C50 64, 46 66, 45 66 Z"
              fill="#6EE7B7"
            />
            {/* Scarlet blossom */}
            <circle cx="62" cy="62" r="3.5" fill="#E11D48" />
            <circle cx="62" cy="62" r="1.5" fill="#FDE047" />

            {/* Perched bird */}
            <path
              d="M62 62 C60 52, 52 46, 42 45 C36 45, 30 48, 26 53 C26 62, 32 68, 44 68 C52 68, 58 66, 62 62 Z"
              fill="#BE123C"
            />
            <path
              d="M48 50 C42 48, 36 50, 32 54 C33 60, 38 64, 46 64 C48 64, 50 60, 48 50 Z"
              fill="#FFF1F2"
              opacity="0.9"
            />
            <path
              d="M56 56 C52 50, 46 48, 40 48 C42 54, 48 60, 56 61 Z"
              fill="#9F1239"
            />
            <path d="M60 62 L74 72 L66 64 Z" fill="#9F1239" />
            <circle cx="28" cy="50" r="6.5" fill="#BE123C" />
            <circle cx="27" cy="49" r="1.3" fill="#24324A" />
            <polygon points="23,49 16,51 23,53" fill="#F59E0B" />
          </svg>
        </div>

        {/* Hand-drawn Red & Pink Botanical Flourishes */}
        <div className="absolute top-2 left-3 sm:left-6 z-10 pointer-events-none opacity-85">
          <svg className="w-12 h-12 sm:w-16 sm:h-16" viewBox="0 0 80 80" fill="none">
            <path
              d="M10 70 Q15 35 45 15 Q65 10 75 12"
              stroke="#059669"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <path
              d="M20 50 C14 46, 16 38, 22 40 C24 44, 22 48, 20 50 Z"
              fill="#34D399"
            />
            <circle cx="50" cy="18" r="3" fill="#E11D48" />
            <circle cx="70" cy="14" r="2.5" fill="#FDA4AF" />
          </svg>
        </div>

        <div className="absolute top-2 right-3 sm:right-6 z-10 pointer-events-none opacity-85">
          <svg className="w-12 h-12 sm:w-16 sm:h-16" viewBox="0 0 80 80" fill="none">
            <path
              d="M70 70 Q65 35 35 15 Q15 10 5 12"
              stroke="#059669"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <path
              d="M60 50 C66 46, 64 38, 58 40 C56 44, 58 48, 60 50 Z"
              fill="#34D399"
            />
            <circle cx="30" cy="18" r="3" fill="#E11D48" />
            <circle cx="10" cy="14" r="2.5" fill="#FDA4AF" />
          </svg>
        </div>

        {/* Delicate Floating Fairy-Tale Sparkles */}
        <div className="absolute -top-1 left-1/4 text-rose-500/80 text-sm select-none pointer-events-none animate-pulse">
          ✦
        </div>
        <div className="absolute top-1/3 -left-3 text-red-400/80 text-xs select-none pointer-events-none">
          ✧
        </div>
        <div className="absolute bottom-1/4 -right-2 text-rose-400/80 text-xs select-none pointer-events-none animate-pulse">
          ✦
        </div>

        {/* ======================================================== */}
        {/* PHYSICAL PARCHMENT SHEET                                 */}
        {/* Warm Ivory/Cream, subtle organic tilt, soft paper shadow */}
        {/* ======================================================== */}
        <div
          className="relative bg-[#FAF7F0] border-2 border-[#F43F5E]/30 rounded-[2rem] sm:rounded-[2.5rem] p-7 sm:p-12 md:p-14 space-y-7 transform -rotate-[0.6deg] transition-transform duration-300 hover:rotate-0"
          style={{
            boxShadow:
              '0 24px 55px -12px rgba(159, 18, 57, 0.18), 0 8px 24px -4px rgba(159, 18, 57, 0.1), 0 0 0 1px rgba(253, 164, 175, 0.5) inset',
            backgroundImage:
              'radial-gradient(#FBCFE8 0.75px, transparent 0.75px), linear-gradient(180deg, #FFFDF8 0%, #FAF5EC 100%)',
            backgroundSize: '24px 24px, 100% 100%',
          }}
        >
          {/* Subtle Fine Inner Deckled Border with delicate Rose Tint */}
          <div className="absolute inset-3 sm:inset-4 rounded-[1.5rem] sm:rounded-[2rem] border border-[#FDA4AF]/50 pointer-events-none" />

          {/* Letter Salutation - EXACT REQUIRED WORDING */}
          <div className="relative font-serif text-2xl sm:text-3xl text-[#24324A] font-bold tracking-tight pt-2">
            My Baby,
          </div>

          {/* Letter Body - EXACT TEXT REQUIRED */}
          <div className="relative font-serif text-[#24324A] text-sm sm:text-base md:text-[17px] leading-relaxed sm:leading-loose space-y-5">
            <p>
              You became such a huge part of my world without me even realizing it. Somewhere along the way, you went from being someone I met to being the person I want to tell everything to, annoy for no reason, and fall asleep next to.
            </p>

            <p>
              I love that you let me cry in your arms without making me feel stupid for it. I love that you can annoy me in five seconds and make me laugh five seconds later. And I don't think I'll ever get tired of sleeping on your shoulder and feeling completely at home there.
            </p>

            <p>
              I know I nag you about your past. I know I get jealous over little things. I'm sorry for those moments. Thank you for being patient with me, even when I'm being difficult.
            </p>

            <p>
              I don't know where life will take us or what things will look like a few months from now. There will probably be good days, bad days, and confusing days. But I hope we'll always have each other through all of it.
            </p>

            <p>
              Saying “I love you” has never been the easiest thing for me. I don't say it just because I'm supposed to. But with you, I can say it and mean every single part of it.
            </p>
          </div>

          {/* Closing Highlight & Sign-off - EXACT TEXT REQUIRED */}
          <div className="relative pt-6 border-t border-[#FECDD3] space-y-2">
            <p className="font-serif text-xl sm:text-2xl font-bold text-[#24324A]">
              Moi tumak bhal pao.
            </p>
            <p className="font-sans text-xs sm:text-sm text-[#24324A]/80 font-semibold tracking-wide">
              Happy Boyfriend's Day, baby.
            </p>
            <div className="font-handwriting text-2xl sm:text-3xl text-rose-700 font-bold pt-1">
              Forever yours,<br />
              Parina ♡
            </div>
          </div>

          {/* Interactive Response Button - EXACT FUNCTIONALITY & COPY PRESERVED */}
          <div className="relative pt-5 border-t border-[#FECDD3] flex items-center justify-between">
            <span className="text-xs font-sans text-[#24324A]/60">
              For Abhinab P Kashyap
            </span>

            {!loveReplied ? (
              <button
                type="button"
                onClick={handleSendLoveBack}
                className="px-5 py-2.5 bg-gradient-to-r from-rose-600 via-pink-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 active:scale-95 text-white font-sans text-xs sm:text-sm font-semibold rounded-xl shadow-[0_4px_16px_rgba(225,29,72,0.3)] flex items-center gap-2 cursor-pointer transition-all"
              >
                <Heart className="w-4 h-4 fill-white text-white" />
                <span>Send a Hug & Squeeze Back 🫂</span>
              </button>
            ) : (
              <div className="flex items-center gap-2 px-4 py-2 bg-[#FFF1F2] border border-[#FDA4AF] text-rose-900 rounded-xl text-xs font-sans font-semibold animate-in zoom-in-95 shadow-2xs">
                <Sparkles className="w-4 h-4 text-rose-600" />
                <span>Hug received! You are my favorite boy. 🤍</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
