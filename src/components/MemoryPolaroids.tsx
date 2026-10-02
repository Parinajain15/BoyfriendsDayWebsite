import React, { useState } from 'react';
import { PolaroidMemory } from '../types/scrapbook';
import { playPopSound, playSparkleSound } from '../utils/audio';
import { Plus, RotateCw, Sparkles, Image as ImageIcon, Trash2, Video, Play, Maximize2, Camera } from 'lucide-react';
import { SketchDoodleArt } from './Doodles';

const isHeicFile = (url?: string): boolean => {
  if (!url) return false;
  const path = url.split('?')[0].toLowerCase();
  return path.endsWith('.heic') || path.endsWith('.heif');
};

const getFileName = (url?: string): string => {
  if (!url) return '';
  const clean = url.split('?')[0];
  const lastSegment = clean.substring(clean.lastIndexOf('/') + 1);
  return decodeURIComponent(lastSegment);
};

interface MemoryPolaroidsProps {
  memories: PolaroidMemory[];
  onAddMemory: (memory: PolaroidMemory) => void;
  onDeleteMemory: (id: string) => void;
  boyfriendName: string;
}

export const MemoryPolaroids: React.FC<MemoryPolaroidsProps> = ({
  memories,
  onAddMemory,
  onDeleteMemory,
}) => {
  const [flippedIds, setFlippedIds] = useState<Record<string, boolean>>({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeMediaPreview, setActiveMediaPreview] = useState<PolaroidMemory | null>(null);
  const [brokenImageIds, setBrokenImageIds] = useState<Record<string, boolean>>({});

  // Form State
  const [newTitle, setNewTitle] = useState('');
  const [newDate, setNewDate] = useState('');
  const [newCaption, setNewCaption] = useState('');
  const [newNoteOnBack, setNewNoteOnBack] = useState('');
  const [uploadedMedia, setUploadedMedia] = useState<string | null>(null);

  const toggleFlip = (id: string) => {
    playPopSound();
    setFlippedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleMediaUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (!result) return;

      // Optimize image via canvas to keep memory efficient and prevent localStorage quota issues
      const img = new Image();
      img.onload = () => {
        const maxDim = 1200;
        let { width, height } = img;
        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.88);
          setUploadedMedia(compressedDataUrl);
        } else {
          setUploadedMedia(result);
        }
      };
      img.onerror = () => {
        setUploadedMedia(result);
      };
      img.src = result;
    };
    reader.readAsDataURL(file);
  };

  const handleCreateMemory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    playSparkleSound();
    const newMemory: PolaroidMemory = {
      id: `mem-${Date.now()}`,
      title: newTitle.trim(),
      date: newDate.trim() || 'Our Memory',
      caption: newCaption.trim() || 'Another moment in our scrapbook',
      noteOnBack:
        newNoteOnBack.trim() ||
        'Captured forever in our personal keepsake box.',
      imageUrl: uploadedMedia || undefined,
      doodleType: 'sunset',
      rotation: Number(((Math.random() - 0.5) * 4).toFixed(1)),
    };

    onAddMemory(newMemory);
    setNewTitle('');
    setNewDate('');
    setNewCaption('');
    setNewNoteOnBack('');
    setUploadedMedia(null);
    setIsModalOpen(false);
  };

  return (
    <section id="memories" className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-14 space-y-8">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="inline-block px-3 py-1 bg-[#FFDDE8] border border-[#F5B4C9] rounded-full font-sans text-xs font-semibold uppercase text-[#24324A] tracking-wider shadow-2xs">
            Physical Scrapbook Gallery
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#24324A] font-bold mt-1">
            OUR POLAROID MEMORY WALL 📸
          </h2>
          <p className="font-handwriting text-xl text-[#24324A]/80 mt-1">
            Polaroids, film strips & tilted snapshots. Tap any photo to flip or enlarge.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="self-start sm:self-auto px-5 py-2.5 bg-[#24324A] hover:bg-[#1A2538] active:scale-95 text-white rounded-xl text-xs sm:text-sm font-sans font-semibold shadow-xs flex items-center gap-2 cursor-pointer transition-all"
          title="Add Polaroid Photo"
        >
          <Plus className="w-4 h-4 shrink-0" />
          <span>+ Add Polaroid Photo</span>
        </button>
      </div>

      {/* Notice / Media slot guidance */}
      <div className="bg-[#DDF7E8]/70 border border-[#A7E9C1] rounded-2xl p-4 flex items-center gap-3 text-xs sm:text-sm text-[#24324A] shadow-2xs">
        <Sparkles className="w-5 h-5 text-emerald-600 shrink-0" />
        <span>
          <strong>Scrapbook Polaroids:</strong> Tap any photo to flip it over and read handwritten secret notes written on the back. Click the <strong>+</strong> button to add a new favorite snapshot anytime!
        </span>
      </div>

      {/* Dynamic Varied Scrapbook Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 pt-4">
        {memories.map((item, index) => {
          const isFlipped = !!flippedIds[item.id];
          const isVideo = item.isVideo || !!item.videoUrl;

          const washiStyles = [
            'washi-tape-pink',
            'washi-tape-yellow',
            'washi-tape-mint',
            'washi-tape-lavender',
          ];
          const washiClass = washiStyles[index % washiStyles.length];

          const isFilmStrip = !item.imageUrl && index % 4 === 1;

          return (
            <div
              key={item.id}
              className="relative flex flex-col items-center select-none"
              style={{
                transform: `rotate(${item.rotation || 0}deg)`,
              }}
            >
              {/* Washi tape on top */}
              <div
                className={`absolute -top-3.5 z-20 w-28 h-6 ${washiClass} transform -rotate-1 rounded-xs flex items-center justify-center opacity-95`}
              >
                <span className="text-[8px] font-mono font-bold text-[#24324A] tracking-widest uppercase">
                  {`PHOTO_0${(index % 21) + 1}`}
                </span>
              </div>

              {/* Action Buttons (Enlarge & Delete) */}
              <div className="absolute top-2 right-2 z-30 flex items-center gap-1">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveMediaPreview(item);
                  }}
                  className="p-1.5 rounded-full bg-white/90 hover:bg-[#EAF6FF] text-[#24324A] text-xs shadow-2xs transition-colors cursor-pointer border border-[#CCE5F8]"
                  title="Enlarge preview"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteMemory(item.id);
                  }}
                  className="p-1.5 rounded-full bg-white/90 hover:bg-rose-50 text-stone-400 hover:text-rose-600 text-xs shadow-2xs transition-colors cursor-pointer border border-[#CCE5F8]"
                  title="Remove"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* The Physical Card Frame (Polaroid or Film Strip) */}
              <div
                onClick={() => toggleFlip(item.id)}
                className={`w-full max-w-[320px] rounded-2xl p-4 cursor-pointer border transition-all duration-300 shadow-[0_6px_20px_rgba(36,50,74,0.06)] ${
                  isFilmStrip
                    ? 'bg-[#1E293B] text-stone-100 border-slate-700'
                    : 'bg-white text-[#24324A] border-[#CCE5F8]'
                }`}
              >
                {!isFlipped ? (
                  /* FRONT OF SNAPSHOT */
                  <div className="space-y-3">
                    <div className="w-full aspect-square bg-[#EAF6FF]/60 rounded-xl overflow-hidden border border-[#CCE5F8]/70 relative flex items-center justify-center">
                      {item.videoUrl ? (
                        <video
                          src={item.videoUrl}
                          className="w-full h-full object-cover"
                          controls
                        />
                      ) : isHeicFile(item.imageUrl) ? (
                        <div className="w-full h-full flex flex-col items-center justify-center p-3 text-center bg-[#F8FAFC] text-[#24324A] select-none rounded-xl border border-stone-200/80">
                          <div className="w-10 h-10 rounded-2xl bg-white shadow-2xs border border-stone-200 flex items-center justify-center mb-1.5">
                            <Camera className="w-5 h-5 text-[#24324A]/70" />
                          </div>
                          <span className="inline-block px-2.5 py-0.5 bg-amber-100 text-amber-900 border border-amber-300 rounded-full font-mono text-[9px] font-bold uppercase tracking-wider mb-1">
                            Apple .HEIC Photo
                          </span>
                          <span className="font-mono text-[11px] font-semibold text-[#24324A] max-w-[200px] truncate" title={getFileName(item.imageUrl)}>
                            {getFileName(item.imageUrl)}
                          </span>
                          <p className="font-sans text-[10px] text-[#24324A]/70 mt-1 leading-snug max-w-[210px]">
                            Unsupported by browser image rendering. Please upload a .JPG or .PNG version.
                          </p>
                        </div>
                      ) : item.imageUrl && !brokenImageIds[item.id] ? (
                        <img
                          src={item.imageUrl}
                          alt={item.title}
                          className="w-full h-full object-cover"
                          onError={() => {
                            setBrokenImageIds((prev) => ({ ...prev, [item.id]: true }));
                          }}
                        />
                      ) : item.imageUrl && brokenImageIds[item.id] ? (
                        <div className="w-full h-full flex flex-col items-center justify-center p-3 text-center bg-stone-50 text-[#24324A] rounded-xl border border-stone-200">
                          <Camera className="w-6 h-6 text-stone-400 mb-1" />
                          <span className="font-mono text-xs font-semibold text-stone-600">
                            {getFileName(item.imageUrl)}
                          </span>
                          <span className="text-[10px] text-stone-400 mt-1">
                            File missing from /public/photos/
                          </span>
                        </div>
                      ) : (
                        <div className="relative w-full h-full flex flex-col items-center justify-center p-4 text-center">
                          <SketchDoodleArt type={item.doodleType} />
                          <div className="absolute top-3 left-3 bg-black/50 text-white font-mono text-[9px] px-2 py-0.5 rounded">
                            SLOT: PHOTO_0{(index % 21) + 1}
                          </div>
                        </div>
                      )}

                      {/* Video indicator badge if video */}
                      {isVideo && (
                        <div className="absolute inset-0 bg-black/20 flex items-center justify-center pointer-events-none">
                          <span className="w-12 h-12 rounded-full bg-white/90 text-[#24324A] flex items-center justify-center shadow-lg">
                            <Play className="w-5 h-5 translate-x-0.5" />
                          </span>
                        </div>
                      )}

                      <div className="absolute bottom-2 right-2 px-2.5 py-0.5 bg-black/60 backdrop-blur-xs rounded-full text-[10px] text-white font-mono font-medium">
                        {item.date}
                      </div>
                    </div>

                    <div className="text-center pt-2">
                      <h4 className={`font-handwriting text-2xl font-bold ${isFilmStrip ? 'text-white' : 'text-[#24324A]'}`}>
                        {item.title}
                      </h4>
                      <p className={`font-serif italic text-xs mt-0.5 ${isFilmStrip ? 'text-stone-300' : 'text-[#24324A]/70'}`}>
                        {item.caption}
                      </p>
                    </div>

                    <div className="flex items-center justify-center gap-1.5 text-xs font-sans font-medium text-rose-500 pt-1">
                      <RotateCw className="w-3.5 h-3.5" />
                      <span>Tap to flip & read handwritten note</span>
                    </div>
                  </div>
                ) : (
                  /* BACK OF SNAPSHOT */
                  <div className="w-full aspect-square bg-lined-paper-pink rounded-xl p-5 border border-[#F5B4C9] text-[#24324A] flex flex-col justify-between shadow-inner">
                    <div>
                      <div className="flex items-center justify-between text-[11px] font-mono text-[#24324A]/60 pb-2 border-b border-black/10">
                        <span>HANDWRITTEN NOTE</span>
                        <span>{item.date}</span>
                      </div>
                      <p className="font-handwriting text-2xl text-[#24324A] font-bold mt-4 leading-relaxed">
                        "{item.noteOnBack}"
                      </p>
                    </div>

                    <div className="pt-4 flex items-center justify-between border-t border-black/10">
                      <span className="font-handwriting text-rose-600 text-xl font-bold">
                        Forever yours, Parina ♡
                      </span>
                      <span className="text-[11px] font-sans text-[#24324A]/50">
                        Tap to flip back
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Enlarged Media Modal */}
      {activeMediaPreview && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-[#CCE5F8] max-w-2xl w-full p-6 shadow-2xl relative animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-[#CCE5F8]/60 mb-4">
              <div>
                <h4 className="font-serif text-lg font-bold text-[#24324A]">
                  {activeMediaPreview.title}
                </h4>
                <p className="font-sans text-xs text-[#24324A]/70">
                  {activeMediaPreview.date} · {activeMediaPreview.caption}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setActiveMediaPreview(null)}
                className="w-8 h-8 rounded-full bg-[#EAF6FF] text-[#24324A] flex items-center justify-center font-bold cursor-pointer hover:bg-blue-100"
              >
                ✕
              </button>
            </div>

            <div className="max-h-[60vh] overflow-hidden rounded-2xl bg-black/5 flex items-center justify-center">
              {activeMediaPreview.videoUrl ? (
                <video
                  src={activeMediaPreview.videoUrl}
                  controls
                  autoPlay
                  className="max-h-[55vh] w-full rounded-xl"
                />
              ) : isHeicFile(activeMediaPreview.imageUrl) ? (
                <div className="w-full py-12 px-6 flex flex-col items-center justify-center bg-[#F8FAFC] rounded-2xl text-center border border-stone-200">
                  <div className="w-14 h-14 rounded-2xl bg-white shadow-xs border border-stone-200 flex items-center justify-center mb-3">
                    <Camera className="w-7 h-7 text-[#24324A]/80" />
                  </div>
                  <span className="inline-block px-3 py-1 bg-amber-100 text-amber-900 border border-amber-300 rounded-full font-mono text-xs font-bold uppercase tracking-wider mb-2">
                    Apple .HEIC File Detected
                  </span>
                  <span className="font-mono text-sm font-bold text-[#24324A]">
                    {getFileName(activeMediaPreview.imageUrl)}
                  </span>
                  <p className="font-sans text-xs text-[#24324A]/70 mt-2 max-w-md">
                    Standard web browsers cannot decode Apple .HEIC files natively inside &lt;img&gt; elements. To display this photo natively in Chrome and Safari, please upload the .JPG or .PNG version of this file.
                  </p>
                </div>
              ) : activeMediaPreview.imageUrl ? (
                <img
                  src={activeMediaPreview.imageUrl}
                  alt={activeMediaPreview.title}
                  className="max-h-[55vh] w-auto object-contain mx-auto rounded-xl shadow-md border border-[#CCE5F8]"
                />
              ) : (
                <div className="w-full py-16 flex flex-col items-center justify-center bg-[#EAF6FF]/50 rounded-xl">
                  <SketchDoodleArt type={activeMediaPreview.doodleType} />
                  <p className="font-serif italic text-xs text-[#24324A]/60 mt-3">
                    Photo memory reserved for this chapter moment
                  </p>
                </div>
              )}
            </div>

            <div className="mt-4 p-3.5 bg-[#FFFDF0] border border-[#F2DE79] rounded-2xl text-xs sm:text-sm font-handwriting text-[#24324A] font-bold">
              "{activeMediaPreview.noteOnBack}"
            </div>
          </div>
        </div>
      )}

      {/* Add Media Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setIsModalOpen(false);
            }
          }}
        >
          <div
            className="bg-white rounded-3xl border border-[#CCE5F8] max-w-lg w-full p-6 sm:p-8 shadow-2xl relative animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#CCE5F8]/50 mb-4">
              <h3 className="font-serif text-xl font-bold text-[#24324A]">
                Add Memory Polaroid
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-[#EAF6FF] hover:bg-blue-100 text-[#24324A] flex items-center justify-center cursor-pointer transition-colors"
                title="Close"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateMemory} className="space-y-4">
              {/* Media File Picker */}
              <div>
                <label className="block text-xs font-sans font-semibold text-[#24324A] mb-1">
                  Upload Photo (JPG, PNG, WebP)
                </label>
                <div className="border-2 border-dashed border-[#CCE5F8] rounded-2xl p-4 text-center hover:border-blue-400 transition-colors bg-[#EAF6FF]/40">
                  {uploadedMedia ? (
                    <div className="relative w-36 h-36 mx-auto rounded-xl overflow-hidden border border-[#CCE5F8] shadow-2xs">
                      <img
                        src={uploadedMedia}
                        alt="Uploaded preview"
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setUploadedMedia(null);
                        }}
                        className="absolute top-1.5 right-1.5 p-1.5 bg-black/70 hover:bg-black text-white rounded-full text-xs cursor-pointer shadow-xs"
                        title="Remove photo"
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <label
                      htmlFor="polaroid-image-input"
                      className="cursor-pointer flex flex-col items-center justify-center py-3 w-full"
                    >
                      <ImageIcon className="w-8 h-8 text-blue-400 mb-1.5" />
                      <span className="text-xs font-sans text-[#24324A] font-semibold">
                        Click to select photo
                      </span>
                      <span className="text-[10px] text-[#24324A]/50 mt-0.5">
                        Supports JPG, PNG, WebP photos & snapshots
                      </span>
                      <input
                        id="polaroid-image-input"
                        type="file"
                        accept="image/jpeg,image/png,image/webp,image/*"
                        onChange={handleMediaUpload}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              </div>

              {/* Title & Date */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-sans font-semibold text-[#24324A] mb-1">
                    Moment Title *
                  </label>
                  <input
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="e.g. Darjeeling Mall Road Walk"
                    className="w-full px-3.5 py-2.5 bg-[#EAF6FF]/40 rounded-xl border border-[#CCE5F8] text-xs font-sans text-[#24324A] focus:outline-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-sans font-semibold text-[#24324A] mb-1">
                    Date / Trip
                  </label>
                  <input
                    type="text"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    placeholder="e.g. October 2024"
                    className="w-full px-3.5 py-2.5 bg-[#EAF6FF]/40 rounded-xl border border-[#CCE5F8] text-xs font-sans text-[#24324A] focus:outline-blue-500"
                  />
                </div>
              </div>

              {/* Caption */}
              <div>
                <label className="block text-xs font-sans font-semibold text-[#24324A] mb-1">
                  Front Caption
                </label>
                <input
                  type="text"
                  value={newCaption}
                  onChange={(e) => setNewCaption(e.target.value)}
                  placeholder="e.g. Freezing cold but your bicep kept me warm"
                  className="w-full px-3.5 py-2.5 bg-[#EAF6FF]/40 rounded-xl border border-[#CCE5F8] text-xs font-sans text-[#24324A] focus:outline-blue-500"
                />
              </div>

              {/* Handwritten Note on back */}
              <div>
                <label className="block text-xs font-sans font-semibold text-[#24324A] mb-1">
                  Handwritten Note for the Back
                </label>
                <textarea
                  value={newNoteOnBack}
                  onChange={(e) => setNewNoteOnBack(e.target.value)}
                  placeholder="Private memory or joke written on the back of this snapshot..."
                  rows={3}
                  className="w-full px-3.5 py-2.5 bg-[#EAF6FF]/40 rounded-xl border border-[#CCE5F8] text-xs font-sans text-[#24324A] focus:outline-blue-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setNewTitle('');
                    setNewDate('');
                    setNewCaption('');
                    setNewNoteOnBack('');
                    setUploadedMedia(null);
                    setIsModalOpen(false);
                  }}
                  className="px-4 py-2 text-xs font-sans font-medium text-[#24324A]/70 hover:text-[#24324A] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#24324A] hover:bg-[#1A2538] text-white font-sans text-xs font-semibold rounded-xl shadow-xs cursor-pointer transition-colors"
                >
                  Pin to Scrapbook
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};

