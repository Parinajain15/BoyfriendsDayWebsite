/**
 * Single source of truth for the 10 final mixtape tracks.
 * All filenames match the existing files in /public/audio/ exactly.
 */

export interface MixtapeTrack {
  id: string;
  title: string;
  artist: string;
  filename: string;
  duration: string;
  note: string;
}

export const FINAL_MIXTAPE_TRACKS: MixtapeTrack[] = [
  {
    id: 'track-1',
    title: 'INAAM',
    artist: 'Anuv Jain',
    filename: 'Anuv Jain - INAAM (Official Lyrical Video).mp3',
    duration: '3:45',
    note: 'A song that feels like home with you.',
  },
  {
    id: 'track-2',
    title: 'Aye Udi Udi Udi',
    artist: 'Adnan Sami (Saathiya)',
    filename: 'Aye Udi Udi Udi _ Full Song _ Saathiya _ Vivek Oberoi, Rani Mukerji.mp3',
    duration: '4:36',
    note: 'When my heart takes flight every time I see you.',
  },
  {
    id: 'track-3',
    title: 'her',
    artist: 'JVKE',
    filename: 'JVKE - her (official lyric video).mp3',
    duration: '2:56',
    note: 'The first song he dedicated to me.',
  },
  {
    id: 'track-4',
    title: 'Señorita',
    artist: 'Farhan, Hrithik & Abhay (ZNMD)',
    filename: 'Lyrical Senorita Zindagi Na Milegi Dobara Farhan Akhtar, Hrithik Roshan, Abhay Deol.mp3',
    duration: '3:51',
    note: 'Our favorite dance energy.',
  },
  {
    id: 'track-5',
    title: 'Dildara',
    artist: 'Shafqat Amanat Ali (Ra.One)',
    filename: 'Lyrical Video Dildara Song Ra.One ShahRukh Khan, Kareena Kapoor.mp3',
    duration: '4:11',
    note: 'Stand by me, always.',
  },
  {
    id: 'track-6',
    title: 'Bardali',
    artist: 'Sushant KC ft. Indrakala Rai',
    filename: 'Sushant KC - Bardali ft. Indrakala Rai (Official Music Video).mp3',
    duration: '3:32',
    note: 'A cozy Nepali acoustic rhythm.',
  },
  {
    id: 'track-7',
    title: 'Risaune Bhaye',
    artist: 'Sushant KC',
    filename: 'Sushant KC - Risaune Bhaye [cNBmzxE6Jf0].mp3',
    duration: '3:20',
    note: 'When you get cute and mad at me.',
  },
  {
    id: 'track-8',
    title: 'Call Out My Name',
    artist: 'The Weeknd',
    filename: 'The Weeknd - Call Out My Name (Official Video).mp3',
    duration: '3:48',
    note: 'Late night drives with you.',
  },
  {
    id: 'track-9',
    title: 'Uff Teri Adaa',
    artist: 'Karthik Calling Karthik',
    filename: 'Uff Teri Adaa Full Video Song Karthik Calling Karthik Farhan Akhtar, Deepika Padukone.mp3',
    duration: '5:02',
    note: 'Every time you smile at me.',
  },
  {
    id: 'track-10',
    title: 'Laakhau Hajarau',
    artist: 'Yabesh Thapa',
    filename: 'Yabesh Thapa - Laakhau Hajarau.mp3',
    duration: '3:45',
    note: 'He explained the Nepali lyrics to me because I didn’t understand them. Then we slow-danced to it.',
  },
];

export const HER_TRACK_ID = 'track-3';
export const HER_FILENAME = 'JVKE - her (official lyric video).mp3';

/**
 * Constructs the browser public URL from the exact filename without double-encoding.
 * e.g. /audio/Sushant%20KC%20-%20Risaune%20Bhaye%20%5BcNBmzxE6Jf0%5D.mp3
 */
export function getAudioSourceUrl(filename: string): string {
  // If already full url
  if (filename.startsWith('/audio/') || filename.startsWith('http://') || filename.startsWith('https://')) {
    return filename;
  }
  return `/audio/${encodeURIComponent(filename)}`;
}

/**
 * Finds a track in the final playlist by its ID or title.
 */
export function findTrackByIdOrTitle(idOrTitle: string): MixtapeTrack | undefined {
  const clean = idOrTitle.toLowerCase().trim();
  return (
    FINAL_MIXTAPE_TRACKS.find((t) => t.id === idOrTitle) ||
    FINAL_MIXTAPE_TRACKS.find((t) => t.title.toLowerCase() === clean) ||
    FINAL_MIXTAPE_TRACKS.find((t) => clean.includes(t.title.toLowerCase()))
  );
}
