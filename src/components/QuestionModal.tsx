import React, { useState } from 'react';
import { Question } from '../types';
import { playCoinSound, playCorrectSound, playWrongSound, playClickSound } from '../utils/sound';
import confetti from 'canvas-confetti';
import { Sparkles, CheckCircle2, XCircle, ArrowRight, BookOpen, User, Zap } from 'lucide-react';

interface QuestionModalProps {
  question: Question;
  studentName: string;
  coinsCollected?: number;
  distanceRun?: number;
  onAnswerSubmit: (isCorrect: boolean, score: number) => void;
  onNextStudent: () => void;
}

export const QuestionModal: React.FC<QuestionModalProps> = ({
  question,
  studentName,
  coinsCollected = 0,
  distanceRun = 0,
  onAnswerSubmit,
  onNextStudent,
}) => {
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const handleSelectOption = (idx: number) => {
    if (isAnswered) return;
    playClickSound();
    setSelectedIdx(idx);
    setIsAnswered(true);

    const correct = idx === question.correctIndex;
    setIsCorrect(correct);

    const distanceBonus = Math.floor(distanceRun * 0.5);
    const totalScore = correct 
      ? 100 + (coinsCollected * 10) + distanceBonus 
      : (coinsCollected * 10) + distanceBonus;

    if (correct) {
      playCoinSound();
      setTimeout(() => playCorrectSound(), 200);
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#ea580c', '#f59e0b', '#10b981', '#3b82f6']
        });
      } catch {
        // optional confetti
      }
      onAnswerSubmit(true, totalScore);
    } else {
      playWrongSound();
      onAnswerSubmit(false, totalScore);
    }
  };

  const optionLabels = ['A', 'B', 'C', 'D'];
  const optionBgColors = [
    'hover:border-orange-500 hover:bg-orange-50 active:bg-orange-100',
    'hover:border-blue-500 hover:bg-blue-50 active:bg-blue-100',
    'hover:border-amber-500 hover:bg-amber-50 active:bg-amber-100',
    'hover:border-emerald-500 hover:bg-emerald-50 active:bg-emerald-100'
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border-4 border-amber-500 overflow-hidden text-slate-800">
        {/* Subway Arcade Header */}
        <div className="bg-gradient-to-r from-orange-600 via-amber-500 to-orange-600 px-6 py-4 text-white flex items-center justify-between border-b-4 border-amber-600">
          <div className="flex items-center gap-3">
            <span className="text-2xl animate-bounce">🚇</span>
            <div>
              <div className="text-xs font-['Press_Start_2P'] tracking-wider text-amber-200">
                GERBONG SOAL SUBWAY DITEMBUS!
              </div>
              <h2 className="text-lg font-bold">Kuis Teori Python Kelas 10</h2>
            </div>
          </div>

          <span className="px-3 py-1 bg-black/40 rounded-full text-xs font-semibold text-amber-200 border border-amber-300/40">
            {question.categoryTitle}
          </span>
        </div>

        {/* Active Student Highlight Banner - High Visibility for Projector & Smartboard */}
        <div className="bg-amber-100 border-b-2 border-amber-300 px-6 py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-orange-600 text-white flex items-center justify-center font-bold text-sm shadow">
              <User className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-amber-900">
                Giliran Siswa Menjawab:
              </div>
              <div className="text-base sm:text-lg font-black text-slate-900 leading-tight uppercase">
                {studentName}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-bold text-orange-900 bg-white/70 px-3 py-1.5 rounded-xl border border-amber-200 shadow-sm">
            <span>🪙 {coinsCollected} Koin (+{coinsCollected * 10})</span>
            {distanceRun > 0 && (
              <span className="border-l border-amber-300 pl-2 text-emerald-800">
                🏃 {distanceRun}m (+{Math.floor(distanceRun * 0.5)})
              </span>
            )}
          </div>
        </div>

        {/* Modal Body: Question & Choices */}
        <div className="p-6 sm:p-8 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Question Text */}
          <div className="space-y-3">
            <div className="inline-block px-3 py-1 rounded-md bg-amber-500/10 text-orange-800 text-xs font-extrabold uppercase tracking-wide">
              Pertanyaan (Pilih 1 Jawaban Terbaik):
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 leading-snug tracking-tight">
              {question.question}
            </h3>

            {/* Optional Code Snippet */}
            {question.codeSnippet && (
              <div className="bg-slate-900 text-emerald-400 p-4 rounded-2xl font-mono text-sm sm:text-base border-2 border-slate-700 shadow-inner overflow-x-auto select-all">
                <code>{question.codeSnippet}</code>
              </div>
            )}
          </div>

          {/* Smartboard-friendly Options Grid (Extra large tap targets) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {question.options.map((option, idx) => {
              const isSelected = selectedIdx === idx;
              const isOptionCorrect = idx === question.correctIndex;

              let btnStyle = `bg-slate-50 border-3 border-slate-200 text-slate-800 ${optionBgColors[idx]}`;

              if (isAnswered) {
                if (isOptionCorrect) {
                  btnStyle = 'bg-emerald-100 border-4 border-emerald-600 text-emerald-950 font-black shadow-lg scale-[1.01]';
                } else if (isSelected) {
                  btnStyle = 'bg-rose-100 border-4 border-rose-500 text-rose-950 font-bold';
                } else {
                  btnStyle = 'bg-slate-50/50 border-2 border-slate-200 text-slate-400 opacity-60';
                }
              }

              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectOption(idx)}
                  disabled={isAnswered}
                  className={`w-full text-left p-4 sm:p-5 rounded-2xl transition-all flex items-start gap-3.5 cursor-pointer select-none active:scale-98 min-h-[70px] ${btnStyle}`}
                >
                  <span
                    className={`w-8 h-8 rounded-xl font-black text-sm flex items-center justify-center shrink-0 border-2 shadow-sm ${
                      isAnswered && isOptionCorrect
                        ? 'bg-emerald-600 text-white border-emerald-400'
                        : isAnswered && isSelected
                        ? 'bg-rose-600 text-white border-rose-400'
                        : 'bg-white text-slate-700 border-slate-300'
                    }`}
                  >
                    {optionLabels[idx]}
                  </span>
                  <span className="text-sm sm:text-base font-semibold leading-relaxed pt-0.5">
                    {option}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Feedback & Explanation Banner */}
          {isAnswered && (
            <div
              className={`p-5 rounded-2xl border-3 shadow-md space-y-2 animate-fadeIn ${
                isCorrect
                  ? 'bg-emerald-50 border-emerald-500 text-emerald-950'
                  : 'bg-rose-50 border-rose-400 text-rose-950'
              }`}
            >
              <div className="flex items-center gap-2 font-black text-base sm:text-lg">
                {isCorrect ? (
                  <>
                    <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                    <span>Luar Biasa, Jawaban Tepat! (+100 Poin)</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-6 h-6 text-rose-600" />
                    <span>Jawaban Belum Tepat! (0 Poin)</span>
                  </>
                )}
              </div>

              <p className="text-xs sm:text-sm leading-relaxed pl-8">
                <strong>Pembahasan:</strong> {question.explanation}
              </p>
            </div>
          )}
        </div>

        {/* Modal Footer: Next Student Action */}
        <div className="bg-slate-100 border-t-2 border-slate-200 px-6 py-4 flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs text-slate-500 font-semibold flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-amber-500" />
            <span>Aturan: 1 Siswa = 1 Soal • Skor Otomatis Masuk ke Leaderboard</span>
          </div>

          {isAnswered ? (
            <button
              type="button"
              onClick={onNextStudent}
              className="px-6 py-3 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white font-extrabold text-sm sm:text-base rounded-2xl shadow-xl flex items-center gap-2 cursor-pointer transition-transform active:scale-95"
            >
              <span>Lanjut ke Siswa Berikutnya</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          ) : (
            <div className="text-xs font-bold text-amber-800 bg-amber-200/70 px-3 py-1.5 rounded-xl border border-amber-300">
              Menunggu pilihan jawaban siswa di layar Smartboard/laptop...
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
