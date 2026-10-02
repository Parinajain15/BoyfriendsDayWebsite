import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { playPopSound, playSparkleSound } from '../utils/audio';
import { CheckCircle2, XCircle, RotateCcw, Sparkles } from 'lucide-react';

interface GamesSectionProps {
  boyfriendName?: string;
  senderName?: string;
}

export const GamesSection: React.FC<GamesSectionProps> = () => {
  // Exactly 2 allowed game sections:
  // 1. Trivia & Memories
  // 2. Who’s More Likely To?
  const [activeTab, setActiveTab] = useState<'trivia' | 'likely'>('trivia');

  // ========================================================
  // SECTION 1: TRIVIA & MEMORIES
  // Exactly 5 personalized questions
  // ========================================================
  const triviaQuestions = [
    {
      question: 'How many fights in Darjeeling?',
      options: ['0', '1', '10', '50'],
      correct: 3,
    },
    {
      question: 'What song did we first dance to?',
      options: ['Señorita', 'Tum Se Hi', 'Dildara', 'Laakhau Hajarau'],
      correct: 0,
    },
    {
      question: 'What’s Parina’s biggest turn-off?',
      options: ['Being late', 'Loud chewing', 'Burping', 'Sweating'],
      correct: 0,
    },
    {
      question: 'What’s Parina’s favourite ice cream flavour?',
      options: ['Choco Chips', 'Cookies & Cream', 'Mint Chocolate', 'All of the above'],
      correct: 3,
    },
    {
      question: 'When will Abhinab stop smoking?',
      options: ['Right now', 'Tonight', 'Tomorrow', 'Never'],
      correct: 0,
    },
  ];

  const [tIndex, setTIndex] = useState(0);
  const [tSelected, setTSelected] = useState<number | null>(null);
  const [tScore, setTScore] = useState(0);
  const [tFinished, setTFinished] = useState(false);

  const handleTriviaOption = (idx: number) => {
    if (tSelected !== null) return;
    setTSelected(idx);
    if (idx === triviaQuestions[tIndex].correct) {
      playSparkleSound();
      setTScore((s) => s + 1);
    } else {
      playPopSound();
    }
  };

  const handleTriviaNext = () => {
    playPopSound();
    if (tIndex + 1 < triviaQuestions.length) {
      setTIndex((i) => i + 1);
      setTSelected(null);
    } else {
      setTFinished(true);
      playSparkleSound();
      confetti({
        particleCount: 35,
        spread: 65,
        origin: { y: 0.65 },
        colors: ['#00E5FF', '#FF4D8D', '#FFE600', '#A855F7'],
        disableForReducedMotion: true,
      });
    }
  };

  const handleTriviaReset = () => {
    setTIndex(0);
    setTSelected(null);
    setTScore(0);
    setTFinished(false);
  };

  // ========================================================
  // SECTION 2: WHO’S MORE LIKELY TO?
  // Exactly 5 questions with requested updates & reversible selection
  // ========================================================
  const likelyQuestions = [
    {
      question: 'Who’s more likely to not watch the reels the other sends?',
      options: ['Abhinab', 'Parina'],
      correct: 'Abhinab',
      isCheatQuestion: false,
    },
    {
      question: 'Who’s more likely to rage-bait the other?',
      options: ['Abhinab', 'Parina'],
      correct: 'Abhinab',
      isCheatQuestion: false,
    },
    {
      question: 'Who’s more likely to say sorry first?',
      options: ['Abhinab', 'Parina'],
      correct: 'Parina',
      isCheatQuestion: false,
    },
    {
      question: 'Who’s more likely to cheat on the other?',
      options: ['Abhinab', 'Parina'],
      correct: 'NONE OF THEM',
      isCheatQuestion: true,
    },
    {
      question: 'Who’s more likely to give the best surprises?',
      options: ['Abhinab', 'Parina'],
      correct: 'Parina',
      isCheatQuestion: false,
    },
  ];

  const [wIndex, setWIndex] = useState(0);
  const [wCurrentChoice, setWCurrentChoice] = useState<string | null>(null);
  const [wAnswers, setWAnswers] = useState<Record<number, string>>({});
  const [wFinished, setWFinished] = useState(false);

  // Both buttons remain clickable at ALL times, allowing toggling!
  const handleWSelect = (choice: string) => {
    setWCurrentChoice(choice);
    setWAnswers((prev) => ({ ...prev, [wIndex]: choice }));
    if (choice === likelyQuestions[wIndex].correct) {
      playSparkleSound();
    } else {
      playPopSound();
    }
  };

  const handleWNext = () => {
    playPopSound();
    if (wIndex + 1 < likelyQuestions.length) {
      const nextIdx = wIndex + 1;
      setWIndex(nextIdx);
      setWCurrentChoice(wAnswers[nextIdx] || null);
    } else {
      setWFinished(true);
      playSparkleSound();
      confetti({
        particleCount: 40,
        spread: 70,
        origin: { y: 0.65 },
        colors: ['#FFE66D', '#FF9FC4', '#00E5FF', '#A855F7'],
        disableForReducedMotion: true,
      });
    }
  };

  const handleWReset = () => {
    setWIndex(0);
    setWCurrentChoice(null);
    setWAnswers({});
    setWFinished(false);
  };

  // Calculate final score
  const calculatedWScore = likelyQuestions.reduce((acc, q, idx) => {
    return acc + (wAnswers[idx] && wAnswers[idx] === q.correct ? 1 : 0);
  }, 0);

  return (
    <section id="games" className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-14 space-y-8 relative">
      {/* Decorative Asymmetric Retro Arcade Doodles */}
      <div className="absolute top-4 left-2 sm:left-6 opacity-35 pointer-events-none select-none hidden sm:block">
        {/* Pixel Controller */}
        <svg width="60" height="42" viewBox="0 0 60 42" fill="none">
          <rect x="2" y="6" width="56" height="32" rx="10" fill="#1E2742" stroke="#00E5FF" strokeWidth="2" />
          {/* D-Pad */}
          <rect x="10" y="18" width="14" height="6" rx="2" fill="#00E5FF" />
          <rect x="14" y="14" width="6" height="14" rx="2" fill="#00E5FF" />
          {/* Buttons */}
          <circle cx="42" cy="18" r="3.5" fill="#FF4D8D" />
          <circle cx="48" cy="24" r="3.5" fill="#FFE600" />
        </svg>
      </div>

      <div className="absolute top-2 right-4 sm:right-8 opacity-35 pointer-events-none select-none hidden sm:block">
        {/* Pixel Joystick */}
        <svg width="48" height="56" viewBox="0 0 48 56" fill="none">
          <rect x="6" y="32" width="36" height="18" rx="5" fill="#1E2742" stroke="#A855F7" strokeWidth="2" />
          <line x1="24" y1="32" x2="24" y2="16" stroke="#94A3B8" strokeWidth="4" strokeLinecap="round" />
          <circle cx="24" cy="12" r="8" fill="#FF4D8D" stroke="#FFA3C5" strokeWidth="1.5" />
          <circle cx="16" cy="40" r="2.5" fill="#FFE600" />
          <circle cx="32" cy="40" r="2.5" fill="#00E5FF" />
        </svg>
      </div>

      <div className="absolute bottom-10 left-3 opacity-30 pointer-events-none select-none hidden md:block">
        {/* Pixel Dice */}
        <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
          <rect x="4" y="4" width="36" height="36" rx="8" fill="#1E2742" stroke="#FFE600" strokeWidth="2" />
          <circle cx="14" cy="14" r="3" fill="#FFE600" />
          <circle cx="22" cy="22" r="3" fill="#FFE600" />
          <circle cx="30" cy="30" r="3" fill="#FFE600" />
          <circle cx="14" cy="30" r="3" fill="#FFE600" />
          <circle cx="30" cy="14" r="3" fill="#FFE600" />
        </svg>
      </div>

      <div className="absolute bottom-12 right-6 opacity-30 pointer-events-none select-none hidden md:block">
        {/* Pixel Hearts & Star */}
        <div className="flex flex-col items-center gap-2">
          <span className="text-[#FF4D8D] text-lg animate-pulse">♥</span>
          <span className="text-[#00E5FF] text-xs font-mono font-bold">1P READY</span>
        </div>
      </div>

      {/* Header - Arcade Game Night Aesthetic */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#1B2236] border border-[#00E5FF]/40 rounded-full font-mono text-[11px] font-bold uppercase text-[#00E5FF] tracking-wider shadow-[0_0_15px_rgba(0,229,255,0.2)]">
          <span className="w-2 h-2 rounded-full bg-[#00E5FF] animate-ping" />
          <span>GAME NIGHT ARCADE · 2-PLAYER MODE</span>
        </div>
        <h2 className="font-serif text-3xl sm:text-4xl text-white font-bold tracking-tight drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]">
          LITTLE GAMES & INTERACTIONS 🕹️
        </h2>
        <p className="font-handwriting text-xl text-stone-300">
          Two fun mini-games to test your memory and how well you know each other.
        </p>
      </div>

      {/* Game Selector Tabs - Styled as Retro Arcade Switchers */}
      <div className="flex items-center justify-center gap-2 max-w-md mx-auto bg-[#161B2E] p-1.5 rounded-2xl border-2 border-[#2E3B60] shadow-[0_10px_25px_rgba(0,0,0,0.4)]">
        {[
          { id: 'trivia' as const, label: '1. Trivia & Memories', icon: '⚡' },
          { id: 'likely' as const, label: '2. Who’s More Likely To?', icon: '🎯' },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => {
              playPopSound();
              setActiveTab(tab.id);
            }}
            className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-sans font-bold whitespace-nowrap transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === tab.id
                ? 'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white shadow-[0_0_20px_rgba(168,85,247,0.4)] scale-[1.02]'
                : 'text-stone-300 hover:text-white hover:bg-[#202742]'
            }`}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* ======================================================== */}
      {/* SECTION 1: TRIVIA & MEMORIES                             */}
      {/* Dark arcade console styling                              */}
      {/* ======================================================== */}
      {activeTab === 'trivia' && (
        <div className="bg-[#151A2C] rounded-3xl border-2 border-[#2D395B] p-6 sm:p-9 shadow-[0_20px_50px_rgba(0,0,0,0.6)] relative overflow-hidden">
          {/* Subtle neon glow lines */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 opacity-70" />

          {!tFinished ? (
            <div className="space-y-5">
              <div className="flex items-center justify-between text-xs font-mono text-cyan-300 pb-3 border-b border-[#283556]">
                <span className="tracking-wider">STAGE {tIndex + 1} / {triviaQuestions.length}</span>
                <span className="bg-[#1E2640] px-3 py-1 rounded-full border border-cyan-400/30 font-bold text-amber-300">
                  SCORE: {tScore}
                </span>
              </div>

              <h3 className="font-serif text-xl sm:text-2xl font-bold text-white tracking-tight leading-snug">
                {triviaQuestions[tIndex].question}
              </h3>

              <div className="space-y-3 pt-2">
                {triviaQuestions[tIndex].options.map((opt, idx) => {
                  const isChosen = tSelected === idx;
                  const isCorrect = idx === triviaQuestions[tIndex].correct;

                  let style = 'bg-[#1C233B] border-[#2C385C] text-stone-100 hover:bg-[#242D4B] hover:border-cyan-400/50';
                  if (tSelected !== null) {
                    if (isCorrect) {
                      style = 'bg-emerald-950/80 border-emerald-400 text-emerald-200 font-bold shadow-[0_0_15px_rgba(52,211,153,0.3)]';
                    } else if (isChosen) {
                      style = 'bg-rose-950/80 border-rose-400 text-rose-200 font-bold shadow-[0_0_15px_rgba(251,113,133,0.3)]';
                    } else {
                      style = 'opacity-30 border-[#1E2640] text-stone-400';
                    }
                  }

                  return (
                    <button
                      key={opt}
                      type="button"
                      disabled={tSelected !== null}
                      onClick={() => handleTriviaOption(idx)}
                      className={`w-full p-4 rounded-2xl border text-left text-xs sm:text-sm font-sans font-medium transition-all flex items-center justify-between cursor-pointer ${style}`}
                    >
                      <span className="font-medium text-sm">{opt}</span>
                      {tSelected !== null && isCorrect && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />}
                      {tSelected !== null && isChosen && !isCorrect && <XCircle className="w-5 h-5 text-rose-400 shrink-0" />}
                    </button>
                  );
                })}
              </div>

              {tSelected !== null && (
                <div className="pt-4 flex justify-end">
                  <button
                    type="button"
                    onClick={handleTriviaNext}
                    className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white rounded-xl text-xs sm:text-sm font-sans font-bold cursor-pointer shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all flex items-center gap-2"
                  >
                    <span>{tIndex + 1 < triviaQuestions.length ? 'Next Question →' : 'See Score ✨'}</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8 space-y-5">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-400/20 border-2 border-amber-400/60 flex items-center justify-center text-3xl shadow-[0_0_25px_rgba(251,191,36,0.3)]">
                🏆
              </div>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white">
                You scored {tScore} / {triviaQuestions.length}!
              </h3>
              <p className="font-handwriting text-2xl text-amber-200/90 max-w-sm mx-auto font-bold">
                {tScore === triviaQuestions.length
                  ? 'PERFECT RUN! High score unlocked, Abhi.'
                  : 'Great effort! 100% certified Abhi & Parina moments.'}
              </p>
              <button
                type="button"
                onClick={handleTriviaReset}
                className="px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white rounded-xl text-xs sm:text-sm font-sans font-bold inline-flex items-center gap-2 cursor-pointer shadow-[0_0_20px_rgba(168,85,247,0.4)] transition-all"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Play Again</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* SECTION 2: WHO’S MORE LIKELY TO?                         */}
      {/* Dedicated colors for Abhinab (Gold) & Parina (Pink)      */}
      {/* Always clickable & togglable before proceeding           */}
      {/* ======================================================== */}
      {activeTab === 'likely' && (
        <div className="bg-[#151A2C] rounded-3xl border-2 border-[#2D395B] p-6 sm:p-9 shadow-[0_20px_50px_rgba(0,0,0,0.6)] relative overflow-hidden">
          {/* Subtle neon glow lines */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-pink-400 to-purple-400 opacity-70" />

          {!wFinished ? (
            <div className="space-y-6">
              <div className="flex items-center justify-between text-xs font-mono text-pink-300 pb-3 border-b border-[#283556]">
                <span className="tracking-wider">ROUND {wIndex + 1} / {likelyQuestions.length}</span>
                <span className="text-stone-400 text-[11px]">Tap to change answer anytime</span>
              </div>

              <h3 className="font-serif text-xl sm:text-2xl font-bold text-white tracking-tight leading-snug">
                {likelyQuestions[wIndex].question}
              </h3>

              {/* 2 Dedicated Distinct Buttons: Abhinab (Warm Golden) vs Parina (Soft Pink) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                {/* 1. ABHINAB BUTTON */}
                {(() => {
                  const isSelected = wCurrentChoice === 'Abhinab';
                  const isCorrect = likelyQuestions[wIndex].correct === 'Abhinab';

                  let btnStyle = 'bg-[#FFE66D]/85 hover:bg-[#FFE66D] border-2 border-[#E5C338] text-[#1E293B] hover:scale-[1.01] shadow-sm';
                  let subtextStyle = 'text-[#1E293B]/70';
                  let nameStyle = 'text-[#1E293B]';
                  let indicator = <div className="w-5 h-5 rounded-full border border-[#1E293B]/30" />;

                  if (isSelected) {
                    if (isCorrect) {
                      // Correct -> GREEN
                      btnStyle = 'bg-emerald-600 border-2 border-emerald-400 text-white shadow-[0_0_25px_rgba(52,211,153,0.5)] ring-4 ring-emerald-400/40 scale-[1.02]';
                      subtextStyle = 'text-emerald-100';
                      nameStyle = 'text-white';
                      indicator = (
                        <div className="w-6 h-6 rounded-full bg-white text-emerald-700 flex items-center justify-center font-bold text-sm shadow-xs">
                          ✓
                        </div>
                      );
                    } else {
                      // Wrong -> RED
                      btnStyle = 'bg-rose-600 border-2 border-rose-400 text-white shadow-[0_0_25px_rgba(244,63,94,0.5)] ring-4 ring-rose-400/40 scale-[1.02]';
                      subtextStyle = 'text-rose-100';
                      nameStyle = 'text-white';
                      indicator = (
                        <div className="w-6 h-6 rounded-full bg-white text-rose-700 flex items-center justify-center font-bold text-sm shadow-xs">
                          ✕
                        </div>
                      );
                    }
                  }

                  return (
                    <button
                      type="button"
                      onClick={() => handleWSelect('Abhinab')}
                      className={`p-5 rounded-2xl text-left font-serif font-bold text-base sm:text-lg transition-all flex items-center justify-between cursor-pointer active:scale-95 ${btnStyle}`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">🙋‍♂️</span>
                        <div className="flex flex-col">
                          <span className={`font-bold ${nameStyle}`}>Abhinab</span>
                          <span className={`text-[11px] font-sans font-medium ${subtextStyle}`}>Boyfriend</span>
                        </div>
                      </div>
                      {indicator}
                    </button>
                  );
                })()}

                {/* 2. PARINA BUTTON */}
                {(() => {
                  const isSelected = wCurrentChoice === 'Parina';
                  const isCorrect = likelyQuestions[wIndex].correct === 'Parina';

                  let btnStyle = 'bg-[#FFA6C9]/85 hover:bg-[#FFA6C9] border-2 border-[#F48FB1] text-[#1E293B] hover:scale-[1.01] shadow-sm';
                  let subtextStyle = 'text-[#1E293B]/70';
                  let nameStyle = 'text-[#1E293B]';
                  let indicator = <div className="w-5 h-5 rounded-full border border-[#1E293B]/30" />;

                  if (isSelected) {
                    if (isCorrect) {
                      // Correct -> GREEN
                      btnStyle = 'bg-emerald-600 border-2 border-emerald-400 text-white shadow-[0_0_25px_rgba(52,211,153,0.5)] ring-4 ring-emerald-400/40 scale-[1.02]';
                      subtextStyle = 'text-emerald-100';
                      nameStyle = 'text-white';
                      indicator = (
                        <div className="w-6 h-6 rounded-full bg-white text-emerald-700 flex items-center justify-center font-bold text-sm shadow-xs">
                          ✓
                        </div>
                      );
                    } else {
                      // Wrong -> RED
                      btnStyle = 'bg-rose-600 border-2 border-rose-400 text-white shadow-[0_0_25px_rgba(244,63,94,0.5)] ring-4 ring-rose-400/40 scale-[1.02]';
                      subtextStyle = 'text-rose-100';
                      nameStyle = 'text-white';
                      indicator = (
                        <div className="w-6 h-6 rounded-full bg-white text-rose-700 flex items-center justify-center font-bold text-sm shadow-xs">
                          ✕
                        </div>
                      );
                    }
                  }

                  return (
                    <button
                      type="button"
                      onClick={() => handleWSelect('Parina')}
                      className={`p-5 rounded-2xl text-left font-serif font-bold text-base sm:text-lg transition-all flex items-center justify-between cursor-pointer active:scale-95 ${btnStyle}`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">🙋‍♀️</span>
                        <div className="flex flex-col">
                          <span className={`font-bold ${nameStyle}`}>Parina</span>
                          <span className={`text-[11px] font-sans font-medium ${subtextStyle}`}>Girlfriend</span>
                        </div>
                      </div>
                      {indicator}
                    </button>
                  );
                })()}
              </div>

              {/* Caption displaying the Correct Answer clearly upon selection */}
              {wCurrentChoice !== null && (
                <div className="p-3.5 bg-[#1C233B] border border-[#2D395B] rounded-2xl text-center animate-in fade-in zoom-in-95 shadow-inner">
                  <p className="font-sans text-sm sm:text-base font-semibold text-stone-200">
                    Correct answer:{' '}
                    <strong className="text-amber-300 font-bold">
                      {likelyQuestions[wIndex].isCheatQuestion
                        ? 'None of the above hehe.'
                        : likelyQuestions[wIndex].correct}
                    </strong>
                  </p>
                </div>
              )}

              {/* Proceed Button: Appears whenever an answer is chosen, user can still re-click options to change! */}
              {wCurrentChoice !== null && (
                <div className="pt-2 flex items-center justify-between">
                  <span className="text-xs text-stone-400 font-sans italic">
                    Choice: <strong className="text-white font-bold">{wCurrentChoice}</strong> (click other to switch)
                  </span>

                  <button
                    type="button"
                    onClick={handleWNext}
                    className="px-6 py-3 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 hover:from-pink-400 hover:to-indigo-400 text-white rounded-xl text-xs sm:text-sm font-sans font-bold cursor-pointer shadow-[0_0_20px_rgba(244,114,182,0.4)] transition-all flex items-center gap-1.5"
                  >
                    <span>{wIndex + 1 < likelyQuestions.length ? 'Next Question →' : 'See Score ✨'}</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8 space-y-5">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-pink-400/20 border-2 border-pink-400/60 flex items-center justify-center text-3xl shadow-[0_0_25px_rgba(244,114,182,0.3)]">
                💬
              </div>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white">
                You scored {calculatedWScore} / {likelyQuestions.length}!
              </h3>
              <p className="font-handwriting text-2xl text-pink-200/90 max-w-sm mx-auto font-bold">
                {calculatedWScore >= 4
                  ? 'Soulmates confirmed! You know every quirk and habit.'
                  : 'Playful debates and endless laughs, exactly how we like it.'}
              </p>
              <button
                type="button"
                onClick={handleWReset}
                className="px-5 py-2.5 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-400 hover:to-purple-500 text-white rounded-xl text-xs sm:text-sm font-sans font-bold inline-flex items-center gap-2 cursor-pointer shadow-[0_0_20px_rgba(244,114,182,0.4)] transition-all"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Play Again</span>
              </button>
            </div>
          )}
        </div>
      )}
    </section>
  );
};
