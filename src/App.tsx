import React, { useState, useEffect } from 'react';
import { ScrapbookSettings, PolaroidMemory, SongTrack } from './types/scrapbook';
import { lofiPlayer, playPopSound } from './utils/audio';
import { IntroScreen } from './components/IntroScreen';
import { Navbar, NavSection } from './components/Navbar';
import { HomeScreen } from './components/HomeScreen';
import { MemoryPolaroids } from './components/MemoryPolaroids';
import { MusicPlayer } from './components/MusicPlayer';
import { GamesSection } from './components/GamesSection';
import { FinalMessage } from './components/FinalMessage';
import { PersonalizeModal } from './components/PersonalizeModal';
import { Heart, ChevronRight } from 'lucide-react';

const DEFAULT_SETTINGS: ScrapbookSettings = {
  boyfriendName: 'Abhinab P Kashyap',
  senderName: 'Parina',
  anniversaryDate: '2024-10-20',
  specialNickname: 'Abhi',
  themeColor: '#BFE8FF',
};

import { FINAL_MIXTAPE_TRACKS } from './utils/audioRegistry';
import { audioEngine } from './utils/audio';

const DEFAULT_MEMORIES: PolaroidMemory[] = [
  {
    id: 'mem-1',
    title: 'Your Arms, My Favourite Place',
    date: 'Warm Hugs',
    caption: 'Whenever I have a bad day, all I want is your hug and to be in your arms.',
    noteOnBack:
      'Whenever I have a bad day, all I want is your hug and to be in your arms.',
    imageUrl: '/photos/him%20kissing%20me%20on%20cheek.JPG',
    doodleType: 'cozy',
    rotation: -2,
  },
  {
    id: 'mem-2',
    title: 'Your Clothes = Mine',
    date: 'Wardrobe Raid',
    caption: 'I want your jacket, your hoodie, basically all your clothes. You’re mine, so technically they’re mine too.',
    noteOnBack:
      'I want your jacket, your hoodie, basically all your clothes. You’re mine, so technically they’re mine too.',
    imageUrl: '/photos/tshirt%20gift.JPG',
    doodleType: 'cinema',
    rotation: 2.2,
  },
  {
    id: 'mem-3',
    title: 'The Hand I’ll Always Remember',
    date: 'First Date',
    caption: 'You were the first person who offered me your hand to hold on a date. I’ll never forget how special that felt.',
    noteOnBack:
      'You were the first person who offered me your hand to hold on a date. I’ll never forget how special that felt.',
    imageUrl: '/photos/hand%20holding.jpg',
    doodleType: 'hands',
    rotation: -1.6,
  },
  {
    id: 'mem-4',
    title: 'My Favourite Pillow',
    date: 'Sleepy Rides',
    caption: 'Sleeping on each other’s shoulders will always be one of my favourite things. Your shoulder is my favourite place to sleep.',
    noteOnBack:
      'Sleeping on each other’s shoulders will always be one of my favourite things. Your shoulder is my favourite place to sleep.',
    imageUrl: '/photos/him%20sleeping.JPG',
    doodleType: 'cozy',
    rotation: 1.5,
  },
  {
    id: 'mem-5',
    title: 'Puri Beach & Ocean Waves',
    date: 'Puri Trip',
    caption: 'Golden sand & crashing waves',
    noteOnBack:
      'Taking dozens of sweet pictures by the tide and having the time of our lives watching the waves crash at sunset.',
    imageUrl: '/photos/beach%202.JPG',
    doodleType: 'hands',
    rotation: 2.5,
  },
  {
    id: 'mem-6',
    title: 'Your Love Language',
    date: 'Snaps & Selfies',
    caption: 'You being obsessed with my pictures and snaps is honestly one of my favourite things.',
    noteOnBack:
      'You being obsessed with my pictures and snaps is honestly one of my favourite things.',
    imageUrl: '/photos/mirror.jpg',
    doodleType: 'stargazing',
    rotation: -1.8,
  },
  {
    id: 'mem-7',
    title: 'Here’s To More…',
    date: 'Darjeeling Walk',
    caption: 'Here’s to more risky quickies and makeouts.',
    noteOnBack:
      'Here’s to more risky quickies and makeouts.',
    imageUrl: '/photos/hug.jpg',
    doodleType: 'coffee',
    rotation: -2.4,
  },
  {
    id: 'mem-8',
    title: 'Interest Accrued',
    date: 'Holi in Darjeeling',
    caption: 'Him seeing my butt as a bank loan… because he definitely got his interest.',
    noteOnBack:
      'Him seeing my butt as a bank loan… because he definitely got his interest.',
    imageUrl: '/photos/noses.jpg',
    doodleType: 'coffee',
    rotation: 2.1,
  },
  {
    id: 'mem-9',
    title: 'Twinning',
    date: 'Bus to Kolkata',
    caption: 'To twinning at every festival.',
    noteOnBack:
      'To twinning at every festival.',
    imageUrl: '/photos/saree.jpg',
    doodleType: 'cozy',
    rotation: 1.6,
  },
  {
    id: 'mem-10',
    title: 'Butter',
    date: 'Birthday Surprise',
    caption: 'You make my heart melt like butter.',
    noteOnBack:
      'You make my heart melt like butter.',
    doodleType: 'stargazing',
    rotation: 1.8,
  },
  {
    id: 'mem-11',
    title: 'Emergency Lip Gloss',
    date: 'Pink Aesthetic',
    caption: 'Running out of lip gloss to apply before kissing you.',
    noteOnBack:
      'Running out of lip gloss to apply before kissing you.',
    doodleType: 'stargazing',
    rotation: -1.5,
  },
  {
    id: 'mem-12',
    title: 'Always',
    date: 'McDonald’s Date',
    caption: 'To always trying to make you feel special, cuz you are.',
    noteOnBack:
      'To always trying to make you feel special, cuz you are.',
    doodleType: 'sunset',
    rotation: -1.2,
  },
];

const DEFAULT_TRACKS: SongTrack[] = FINAL_MIXTAPE_TRACKS.map((t) => ({
  id: t.id,
  title: t.title,
  artist: t.artist,
  duration: t.duration,
  note: t.note,
  filename: t.filename,
}));

export default function App() {
  const [inScrapbook, setInScrapbook] = useState(false);
  const [currentSection, setCurrentSection] = useState<NavSection>('home');
  const [isHerPlaying, setIsHerPlaying] = useState(() => audioEngine.isHerPlaying());
  const [isCustomizeOpen, setIsCustomizeOpen] = useState(false);

  // Settings & Content persistence
  const [settings, setSettings] = useState<ScrapbookSettings>(() => {
    try {
      const saved = localStorage.getItem('bf_gift_settings_v4');
      return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  });

  const [memories, setMemories] = useState<PolaroidMemory[]>(() => {
    try {
      const saved = localStorage.getItem('bf_gift_memories_v6') || localStorage.getItem('bf_gift_memories_v5');
      if (saved) {
        const parsed: PolaroidMemory[] = JSON.parse(saved);
        // Ensure default memories have their authentic imageUrl mapped even if previously cached
        return parsed.map((m) => {
          const defaultMatch = DEFAULT_MEMORIES.find((d) => d.id === m.id);
          if (defaultMatch) {
            return {
              ...defaultMatch,
              ...m,
              title: defaultMatch.title,
              imageUrl: defaultMatch.imageUrl || m.imageUrl,
            };
          }
          return m;
        });
      }
      return DEFAULT_MEMORIES;
    } catch {
      return DEFAULT_MEMORIES;
    }
  });

  const [tracks, setTracks] = useState<SongTrack[]>(() => {
    try {
      const saved = localStorage.getItem('bf_gift_tracks_final');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return DEFAULT_TRACKS;
  });

  useEffect(() => {
    try {
      localStorage.setItem('bf_gift_settings_v4', JSON.stringify(settings));
    } catch (e) {
      console.debug('Failed to save settings', e);
    }
  }, [settings]);

  useEffect(() => {
    try {
      localStorage.setItem('bf_gift_memories_v6', JSON.stringify(memories));
    } catch (e) {
      console.debug('Failed to save memories', e);
    }
  }, [memories]);

  useEffect(() => {
    try {
      localStorage.setItem('bf_gift_tracks_final', JSON.stringify(tracks));
    } catch (e) {
      console.debug('Failed to save tracks', e);
    }
  }, [tracks]);

  // Keep isHerPlaying strictly synced with AudioEngine's "her" state
  useEffect(() => {
    const unsubscribe = audioEngine.subscribe(() => {
      setIsHerPlaying(audioEngine.isHerPlaying());
    });
    return unsubscribe;
  }, []);

  // Autoplay "her" track on website open with graceful user gesture fallback
  useEffect(() => {
    let triggered = false;

    const playHerSafely = async () => {
      if (triggered || audioEngine.getIsPlaying()) return;
      triggered = true;
      try {
        await audioEngine.toggleHer();
      } catch (err) {
        console.debug('Autoplay waiting for user gesture', err);
      }
    };

    playHerSafely();

    const handleFirstGesture = () => {
      if (!audioEngine.getIsPlaying()) {
        audioEngine.toggleHer();
      }
      removeListeners();
    };

    const removeListeners = () => {
      window.removeEventListener('pointerdown', handleFirstGesture);
      window.removeEventListener('click', handleFirstGesture);
      window.removeEventListener('touchstart', handleFirstGesture);
      window.removeEventListener('keydown', handleFirstGesture);
    };

    window.addEventListener('pointerdown', handleFirstGesture, { passive: true, once: true });
    window.addEventListener('click', handleFirstGesture, { passive: true, once: true });
    window.addEventListener('touchstart', handleFirstGesture, { passive: true, once: true });
    window.addEventListener('keydown', handleFirstGesture, { passive: true, once: true });

    return () => {
      removeListeners();
    };
  }, []);

  // Dedicated independent Toggle for Navbar "her" — JVKE
  const handleToggleHer = () => {
    audioEngine.toggleHer();
  };

  const handleAddMemory = (newMemory: PolaroidMemory) => {
    setMemories((prev) => [newMemory, ...prev]);
  };

  const handleDeleteMemory = (id: string) => {
    setMemories((prev) => prev.filter((m) => m.id !== id));
  };

  const handleAddTrack = (newTrack: SongTrack) => {
    setTracks((prev) => [...prev, newTrack]);
  };

  const handleResetDefaults = () => {
    setSettings(DEFAULT_SETTINGS);
    setMemories(DEFAULT_MEMORIES);
    setTracks(DEFAULT_TRACKS);
    try {
      localStorage.removeItem('bf_gift_settings_v4');
      localStorage.removeItem('bf_gift_memories_v5');
      localStorage.removeItem('bf_gift_tracks_v6');
    } catch (e) {
      console.debug('Error clearing storage', e);
    }
  };

  const navigateTo = (section: NavSection) => {
    playPopSound();
    setCurrentSection(section);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // If not entered scrapbook yet, show the Intro envelope landing
  if (!inScrapbook) {
    return (
      <IntroScreen
        onEnter={() => setInScrapbook(true)}
        boyfriendName={settings.boyfriendName}
        senderName={settings.senderName}
        isPlayingMusic={isHerPlaying}
        toggleMusic={handleToggleHer}
      />
    );
  }

  // Next section map for smooth one-click progression
  const nextSectionMap: Record<NavSection, { next: NavSection; label: string; icon: string }> = {
    'home': { next: 'memories', label: 'View Our Photo Polaroids', icon: '📸' },
    'memories': { next: 'music', label: 'Listen to Our Mixtape', icon: '📼' },
    'music': { next: 'quiz', label: 'Play Little Games & Quiz', icon: '🎮' },
    'quiz': { next: 'letter', label: 'Read Your Love Letter', icon: '💌' },
    'letter': { next: 'home', label: 'Back to Home Keepsakes', icon: '🏠' },
  };

  const currentNext = nextSectionMap[currentSection];

  // Distinct visual identity per page
  const sectionThemes: Record<NavSection, {
    container: string;
    footer: string;
    transitionBtn: string;
    nextIconColor: string;
  }> = {
    home: {
      container: 'bg-[#FF5A1F] bg-orange-fun-canvas text-[#1A1A1A] selection:bg-[#FFE600] selection:text-black',
      footer: 'border-t-4 border-black bg-[#FFE600] text-black',
      transitionBtn: 'bg-[#FF2D87] hover:bg-[#E02674] border-4 border-black text-white shadow-[4px_4px_0px_#000]',
      nextIconColor: 'text-white',
    },
    memories: {
      container: 'bg-[#CCE8FA] bg-scrapbook-canvas text-[#20304A]',
      footer: 'border-t border-[#93D5FD] bg-white/90 text-[#20304A]',
      transitionBtn: 'bg-white/95 hover:bg-white border-[#93D5FD] hover:border-blue-400 text-[#20304A]',
      nextIconColor: 'text-blue-600',
    },
    music: {
      container: 'bg-[#FAF5FF] bg-pastel-rainbow-canvas text-[#24324A] selection:bg-[#C084FC] selection:text-white',
      footer: 'border-t border-purple-200 bg-white/85 text-[#24324A]',
      transitionBtn: 'bg-white/95 hover:bg-white border-purple-200 hover:border-purple-400 text-[#24324A]',
      nextIconColor: 'text-purple-600',
    },
    quiz: {
      container: 'bg-[#0E121E] bg-arcade-canvas text-stone-100 selection:bg-cyan-500 selection:text-black',
      footer: 'border-t border-[#252E4B] bg-[#121626]/95 text-stone-300',
      transitionBtn: 'bg-[#181E33] hover:bg-[#202842] border-[#2E3C66] hover:border-cyan-400 text-white shadow-[0_4px_20px_rgba(0,0,0,0.5)]',
      nextIconColor: 'text-cyan-400',
    },
    letter: {
      container: 'bg-[#FDF1F4] bg-rose-canvas text-[#24324A] selection:bg-[#FB7185] selection:text-white',
      footer: 'border-t border-rose-200 bg-rose-50/90 text-rose-950',
      transitionBtn: 'bg-white/95 hover:bg-white border-rose-200 hover:border-rose-400 text-[#24324A]',
      nextIconColor: 'text-rose-600',
    },
  };

  const currentTheme = sectionThemes[currentSection];

  return (
    <div className={`min-h-screen ${currentTheme.container} font-sans flex flex-col justify-between transition-colors duration-200`}>
      {/* Draft-1 Navigation Header */}
      <Navbar
        currentSection={currentSection}
        onSelectSection={(sec) => navigateTo(sec)}
        isPlayingMusic={isHerPlaying}
        toggleMusic={handleToggleHer}
        onOpenCustomize={() => setIsCustomizeOpen(true)}
        onReturnToIntro={() => setInScrapbook(false)}
        boyfriendName={settings.boyfriendName}
      />

      {/* Main Content Area - Preserving Draft-1 Section Pages */}
      <main className="flex-1 pb-12 animate-in fade-in duration-200">
        {currentSection === 'home' && (
          <HomeScreen
            boyfriendName={settings.boyfriendName}
            senderName={settings.senderName}
            anniversaryDate={settings.anniversaryDate}
            specialNickname={settings.specialNickname}
            onNavigate={(section) => navigateTo(section)}
          />
        )}

        {currentSection === 'memories' && (
          <MemoryPolaroids
            memories={memories}
            onAddMemory={handleAddMemory}
            onDeleteMemory={handleDeleteMemory}
            boyfriendName={settings.boyfriendName}
          />
        )}

        {currentSection === 'music' && (
          <MusicPlayer
            tracks={tracks}
            onAddCustomTrack={handleAddTrack}
            boyfriendName={settings.boyfriendName}
          />
        )}

        {currentSection === 'quiz' && (
          <GamesSection
            boyfriendName={settings.boyfriendName}
            senderName={settings.senderName}
          />
        )}

        {currentSection === 'letter' && (
          <FinalMessage
            boyfriendName={settings.boyfriendName}
            senderName={settings.senderName}
            anniversaryDate={settings.anniversaryDate}
          />
        )}

        {/* Playful Scrapbook Section Transition Button */}
        <div className="max-w-md mx-auto px-4 mt-8 flex justify-center">
          <button
            type="button"
            onClick={() => navigateTo(currentNext.next)}
            className={`w-full py-3 px-5 border rounded-2xl shadow-sm text-xs sm:text-sm font-sans font-bold flex items-center justify-between group transition-all cursor-pointer ${currentTheme.transitionBtn}`}
          >
            <div className="flex items-center gap-2">
              <span className="text-base">{currentNext.icon}</span>
              <span>Next: {currentNext.label}</span>
            </div>
            <ChevronRight className={`w-4 h-4 ${currentTheme.nextIconColor} group-hover:translate-x-1 transition-transform`} />
          </button>
        </div>
      </main>

      {/* Scrapbook Footer */}
      <footer className={`border-t backdrop-blur-xs py-8 px-4 text-center transition-colors duration-200 ${currentTheme.footer}`}>
        <div className="max-w-md mx-auto space-y-2.5">
          <div className="flex items-center justify-center gap-2">
            <Heart className={`w-4 h-4 ${currentSection === 'home' ? 'fill-[#E94B45] text-[#E94B45]' : 'fill-rose-500 text-rose-500'}`} />
            <span className={`font-handwriting text-2xl sm:text-3xl font-bold ${currentSection === 'home' ? 'text-[#2B211E]' : 'text-[#20304A]'}`}>
              Happy Boyfriend's Day, Abhi ♡
            </span>
          </div>

          <div className={`flex items-center justify-center gap-3 text-xs font-sans font-bold pt-1 ${currentSection === 'home' ? 'text-[#2B211E]/80' : 'text-[#20304A]/70'}`}>
            <button
              type="button"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className={`underline cursor-pointer ${currentSection === 'home' ? 'hover:text-[#E94B45]' : 'hover:text-blue-700'}`}
            >
              Back to Top ↑
            </button>
            <span>·</span>
            <button
              type="button"
              onClick={() => setInScrapbook(false)}
              className={`underline cursor-pointer ${currentSection === 'home' ? 'hover:text-[#E94B45]' : 'hover:text-rose-600'}`}
            >
              Envelope View 💌
            </button>
            <span>·</span>
            <button
              type="button"
              onClick={() => setIsCustomizeOpen(true)}
              className={`underline cursor-pointer ${currentSection === 'home' ? 'hover:text-[#A9D8EA]' : 'hover:text-[#20304A]'}`}
            >
              Settings ⚙️
            </button>
          </div>
        </div>
      </footer>

      {/* Personalization Modal */}
      <PersonalizeModal
        isOpen={isCustomizeOpen}
        onClose={() => setIsCustomizeOpen(false)}
        settings={settings}
        onSave={(newSettings) => setSettings(newSettings)}
        onResetDefaults={handleResetDefaults}
      />
    </div>
  );
}
