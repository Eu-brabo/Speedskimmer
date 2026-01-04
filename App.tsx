
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { extractTextFromPdf } from './services/pdfService';
import WordDisplay from './components/WordDisplay';
import Controls from './components/Controls';

const App: React.FC = () => {
  const [words, setWords] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [wpm, setWpm] = useState<number>(300);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    console.log('App: File received', file.name);
    setIsProcessing(true);
    setIsPlaying(false);
    
    try {
      let extracted = '';
      const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
      
      if (isPdf) {
        extracted = await extractTextFromPdf(file);
      } else {
        extracted = await file.text();
      }

      if (!extracted || extracted.trim().length === 0) {
        throw new Error('No text found in file.');
      }

      const processedWords = extracted
        .split(/\s+/)
        .filter(w => w.trim().length > 0);
      
      if (processedWords.length > 0) {
        setWords(processedWords);
        setCurrentIndex(0);
        console.log(`App: Successfully loaded ${processedWords.length} words.`);
      } else {
        throw new Error('No words detected after processing.');
      }
    } catch (err: any) {
      console.error('App: Processing failed', err);
      alert(`Error: ${err.message || 'Failed to process file'}`);
      setWords([]); // Clear existing words on error
    } finally {
      setIsProcessing(false);
      if (event.target) event.target.value = '';
    }
  };

  const nextWord = useCallback(() => {
    setCurrentIndex(prev => {
      if (prev >= words.length - 1) {
        setIsPlaying(false);
        return prev;
      }
      return prev + 1;
    });
  }, [words.length]);

  useEffect(() => {
    if (isPlaying && currentIndex < words.length) {
      const currentWord = words[currentIndex];
      const baseDelay = (60 / wpm) * 1000;
      
      const hasPauseChar = currentWord && /[.!?]/.test(currentWord);
      const delay = hasPauseChar ? baseDelay + 500 : baseDelay;

      timerRef.current = setTimeout(() => {
        nextWord();
      }, delay);
    } else {
      if (timerRef.current) clearTimeout(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isPlaying, currentIndex, words, wpm, nextWord]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  return (
    <div className="min-h-screen flex flex-col items-center justify-between p-4 md:p-8 bg-slate-900 overflow-hidden text-slate-100">
      <header className={`w-full max-w-5xl flex justify-between items-center transition-all duration-500 ${isPlaying ? 'opacity-0 -translate-y-4 pointer-events-none' : 'opacity-100 translate-y-0'}`}>
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-900/40">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">RapidReader</h1>
        </div>
        
        <div className="flex items-center space-x-4">
          <label className={`cursor-pointer px-4 py-2 rounded-lg text-sm font-semibold transition-all border border-slate-700 ${isProcessing ? 'bg-slate-700 text-slate-400 cursor-wait' : 'bg-slate-800 hover:bg-slate-700 text-slate-300'}`}>
            {isProcessing ? (
              <span className="flex items-center space-x-2">
                <svg className="animate-spin h-4 w-4 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Processing PDF...</span>
              </span>
            ) : 'Upload File'}
            <input 
              type="file" 
              className="hidden" 
              accept=".pdf,.txt" 
              onChange={handleFileUpload} 
              disabled={isProcessing} 
            />
          </label>
        </div>
      </header>

      <main className="flex-1 w-full flex flex-col items-center justify-center relative">
        {words.length > 0 ? (
          <div className="w-full">
            <WordDisplay word={words[currentIndex]} />
          </div>
        ) : (
          <div className="text-center space-y-6 max-w-md">
            <div className="w-24 h-24 bg-slate-800/50 rounded-3xl mx-auto flex items-center justify-center border-2 border-dashed border-slate-700">
              {isProcessing ? (
                <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
              ) : (
                <svg className="w-10 h-10 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              )}
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-semibold text-slate-300">
                {isProcessing ? 'Reading document structure...' : 'Ready to speed read?'}
              </h2>
              <p className="text-slate-500 text-sm leading-relaxed">
                {isProcessing 
                  ? 'Hang tight! We are pulling the text out of your PDF.' 
                  : 'Upload any PDF or text file to start reading at superhuman speeds.'}
              </p>
            </div>
          </div>
        )}
      </main>

      <footer className={`w-full max-w-4xl transition-all duration-700 transform ${words.length > 0 ? 'translate-y-0 opacity-100 pb-8' : 'translate-y-20 opacity-0 pointer-events-none'}`}>
        <Controls
          wpm={wpm}
          onWpmChange={setWpm}
          currentIndex={currentIndex}
          totalWords={words.length}
          onIndexChange={setCurrentIndex}
          isPlaying={isPlaying}
          onTogglePlay={togglePlay}
        />
      </footer>

      {isPlaying && (
        <div className="fixed top-8 left-1/2 -translate-x-1/2 px-4 py-1 bg-slate-800/80 backdrop-blur rounded-full border border-slate-700 text-[10px] uppercase tracking-widest text-slate-400 font-bold z-50">
          Reading Mode • {wpm} WPM
        </div>
      )}
    </div>
  );
};

export default App;
