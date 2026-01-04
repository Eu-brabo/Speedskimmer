
import React from 'react';

interface ControlsProps {
  wpm: number;
  onWpmChange: (val: number) => void;
  currentIndex: number;
  totalWords: number;
  onIndexChange: (index: number) => void;
  isPlaying: boolean;
  onTogglePlay: () => void;
}

const Controls: React.FC<ControlsProps> = ({
  wpm,
  onWpmChange,
  currentIndex,
  totalWords,
  onIndexChange,
  isPlaying,
  onTogglePlay
}) => {
  return (
    <div className="w-full max-w-2xl mx-auto space-y-8 bg-slate-800/50 p-6 rounded-2xl border border-slate-700 backdrop-blur-sm">
      {/* Speed Control */}
      <div className="space-y-4">
        <div className="flex justify-between items-center text-sm font-semibold text-slate-300">
          <span>Speed</span>
          <span className="text-blue-400 bg-blue-400/10 px-3 py-1 rounded-full">{wpm} WPM</span>
        </div>
        <input
          type="range"
          min="50"
          max="1000"
          step="10"
          value={wpm}
          onChange={(e) => onWpmChange(parseInt(e.target.value))}
          className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
        />
      </div>

      {/* Progress Control */}
      <div className="space-y-4">
        <div className="flex justify-between items-center text-sm font-semibold text-slate-300">
          <span>Progress</span>
          <span className="text-slate-400">
            {totalWords > 0 ? Math.round((currentIndex / totalWords) * 100) : 0}% 
            ({currentIndex}/{totalWords})
          </span>
        </div>
        <input
          type="range"
          min="0"
          max={Math.max(0, totalWords - 1)}
          value={currentIndex}
          onChange={(e) => onIndexChange(parseInt(e.target.value))}
          className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
        />
      </div>

      {/* Play/Pause Button - Prominent */}
      <div className="flex justify-center pt-2">
        <button
          onClick={onTogglePlay}
          className={`
            group relative flex items-center justify-center w-20 h-20 rounded-full transition-all duration-300
            ${isPlaying ? 'bg-red-500 hover:bg-red-600' : 'bg-emerald-500 hover:bg-emerald-600'}
            shadow-lg shadow-black/20 hover:scale-105 active:scale-95
          `}
        >
          {isPlaying ? (
            <svg className="w-8 h-8 fill-white" viewBox="0 0 24 24">
              <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
            </svg>
          ) : (
            <svg className="w-8 h-8 fill-white ml-1" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
};

export default Controls;
