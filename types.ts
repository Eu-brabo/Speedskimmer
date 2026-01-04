
export interface ReaderState {
  text: string;
  words: string[];
  currentIndex: number;
  isPlaying: boolean;
  wpm: number;
}

export interface FileData {
  name: string;
  content: string;
}
