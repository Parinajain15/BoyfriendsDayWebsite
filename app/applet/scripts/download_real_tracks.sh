#!/bin/bash
set -e

declare -A TRACKS=(
  ["Aye Udi Udi Udi _ Full Song _ Saathiya _ Vivek Oberoi, Rani Mukerji.mp3"]="scsearch:Saathiya Aye Udi Udi Udi Adnan Sami"
  ["JVKE - her (official lyric video).mp3"]="scsearch:JVKE her official"
  ["Lyrical Senorita Zindagi Na Milegi Dobara Farhan Akhtar, Hrithik Roshan, Abhay Deol.mp3"]="scsearch:Senorita Zindagi Na Milegi Dobara"
  ["Lyrical Video Dildara Song Ra.One ShahRukh Khan, Kareena Kapoor.mp3"]="scsearch:Dildara Ra One Shafqat"
  ["Sushant KC - Bardali ft. Indrakala Rai (Official Music Video).mp3"]="scsearch:Sushant KC Bardali"
  ["Sushant KC - Risaune Bhaye [cNBmzxE6Jf0].mp3"]="scsearch:Sushant KC Risaune Bhaye"
  ["The Weeknd - Call Out My Name (Official Video).mp3"]="scsearch:The Weeknd Call Out My Name"
  ["Yabesh Thapa - Laakhau Hajarau.mp3"]="scsearch:Yabesh Thapa Laakhau Hajarau"
)

for filename in "${!TRACKS[@]}"; do
  query="${TRACKS[$filename]}"
  target="public/audio/$filename"
  echo "Downloading $filename using $query..."
  yt-dlp -x --audio-format mp3 -o "$target" "$query" --force-overwrites
done

echo "All tracks downloaded successfully!"
