
import React from 'react';

interface WordDisplayProps {
  word: string;
}

const WordDisplay: React.FC<WordDisplayProps> = ({ word }) => {
  if (!word) return <div className="h-64"></div>;

  // Optimal Recognition Point (ORP)
  // middle, or middle left in case it has an even amount of letters
  const orpIndex = Math.floor((word.length - 1) / 2);
  
  const left = word.substring(0, orpIndex);
  const mid = word.charAt(orpIndex);
  const right = word.substring(orpIndex + 1);

  return (
    <div className="flex flex-col justify-center items-center h-64 select-none w-full px-4 overflow-hidden">
      {/* Visual center guides */}
      <div className="w-px h-6 bg-slate-700/50 mb-4"></div>
      
      <div className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-bold font-mono tracking-tighter flex whitespace-nowrap">
        {/* Left part: Right aligned to push against the center */}
        <div className="flex-1 text-right text-slate-400/80">
          {left}
        </div>
        
        {/* Center character: Highlighted red, fixed anchor */}
        <div className="text-red-500 px-[0.05em] min-w-[0.6em] text-center">
          {mid}
        </div>
        
        {/* Right part: Left aligned */}
        <div className="flex-1 text-left text-slate-400/80">
          {right}
        </div>
      </div>

      <div className="w-px h-6 bg-slate-700/50 mt-4"></div>
    </div>
  );
};

export default WordDisplay;
