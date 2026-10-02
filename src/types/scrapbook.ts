export interface ScrapbookSettings {
  boyfriendName: string;
  senderName: string;
  anniversaryDate: string; // YYYY-MM-DD
  specialNickname: string;
  themeColor: string;
}

export interface StarterPackItem {
  id: string;
  label: string;
  caption: string;
  context: string;
  iconType: 'hoodie' | 'dog' | 'redbull' | 'dance' | 'ragebait' | 'rolls' | 'nepali' | 'baby';
  tag: string;
  badgeColor: string;
}

export interface OurFirstMoment {
  id: string;
  title: string;
  subtitle: string;
  story: string;
  humorOrDetail?: string;
  badge: string;
  cardColor: string;
  iconName: string;
}

export interface TimelineMoment {
  id: string;
  date: string;
  title: string;
  story: string;
  handwrittenNote?: string;
  tag: string;
  accentColor: string;
}

export interface TravelPlace {
  id: string;
  title: string;
  tagline: string;
  memory: string;
  postmark: string;
  stampColor: 'pink' | 'yellow' | 'mint' | 'lavender' | 'sky';
  bgPattern: string;
}

export interface PolaroidMemory {
  id: string;
  title: string;
  date: string;
  caption: string;
  noteOnBack: string;
  imageUrl?: string;
  videoUrl?: string;
  isVideo?: boolean;
  doodleType: 'sunset' | 'coffee' | 'hands' | 'stargazing' | 'cinema' | 'cozy';
  rotation: number;
}

export interface SongTrack {
  id: string;
  title: string;
  artist: string;
  duration: string;
  lofiMelodyKey?: number;
  note: string;
  customAudioUrl?: string;
  filename?: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface LoveReason {
  id: string;
  text: string;
  color: string;
}
