export type QuestionCategory = 'konsep' | 'print' | 'tipe_data';

export interface Question {
  id: number;
  category: QuestionCategory;
  categoryTitle: string;
  question: string;
  codeSnippet?: string;
  options: string[];
  correctIndex: number; // 0, 1, 2, 3
  explanation: string;
}

export interface LeaderboardEntry {
  id: string;
  studentName: string;
  score: number;
  coinsCollected: number;
  isCorrect: boolean;
  questionText: string;
  categoryTitle: string;
  timestamp: string;
}

export type LaneIndex = 0 | 1 | 2; // 0: Kiri, 1: Tengah, 2: Kanan

export type RunnerAnimState = 'ready' | 'running' | 'jumping' | 'switching' | 'crashed' | 'celebrating';
