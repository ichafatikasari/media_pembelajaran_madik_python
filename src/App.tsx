/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Question, LeaderboardEntry, RunnerAnimState } from './types';
import { QUESTIONS_BANK, getRandomizedQuestion } from './data/questions';
import { 
  getLeaderboard, 
  addLeaderboardEntry, 
  clearLeaderboard,
  getSessionTurnCount,
  incrementSessionTurnCount,
  resetActiveSessionTurn
} from './utils/storage';
import { 
  playClickSound, 
  playSubwayHorn, 
  playCountdownBeep,
  playCoinSound,
  toggleSound, 
  isSoundEnabled 
} from './utils/sound';

import { SubwayCanvas } from './components/SubwayCanvas';
import { QuestionModal } from './components/QuestionModal';
import { LeaderboardModal } from './components/LeaderboardModal';
import { PythonCheatSheetModal } from './components/PythonCheatSheetModal';
import { QuestionBankModal } from './components/QuestionBankModal';

import { 
  Trophy, 
  BookOpen, 
  Volume2, 
  VolumeX, 
  Play, 
  RotateCcw, 
  Sparkles, 
  User, 
  Zap, 
  CheckCircle2,
  HelpCircle
} from 'lucide-react';

export default function App() {
  // Game View & Current Player
  const [currentView, setCurrentView] = useState<'name_input' | 'playing'>('name_input');
  const [inputStudentName, setInputStudentName] = useState('');
  const [activeStudentName, setActiveStudentName] = useState('');
  const [sessionTurnCount, setSessionTurnCount] = useState(0);
  const [previousSessionCount, setPreviousSessionCount] = useState(0);

  // Gameplay & Quiz State
  const [activeQuestion, setActiveQuestion] = useState<Question | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [animState, setAnimState] = useState<RunnerAnimState>('ready');
  const [lastCoinsCollected, setLastCoinsCollected] = useState(0);
  const [lastDistanceRun, setLastDistanceRun] = useState(0);
  const [countdown, setCountdown] = useState<3 | 2 | 1 | 'GO!' | null>(null);
  const countdownTimersRef = useRef<NodeJS.Timeout[]>([]);

  // Modals & Sound
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [showLeaderboardModal, setShowLeaderboardModal] = useState(false);
  const [showCheatSheetModal, setShowCheatSheetModal] = useState(false);
  const [showQuestionBankModal, setShowQuestionBankModal] = useState(false);
  const [showResetConfirmModal, setShowResetConfirmModal] = useState(false);
  const [resetToastMessage, setResetToastMessage] = useState<string | null>(null);
  const [soundActive, setSoundActive] = useState(true);

  // Load initial data
  useEffect(() => {
    setLeaderboard(getLeaderboard());
    setSessionTurnCount(getSessionTurnCount());
    setSoundActive(isSoundEnabled());

    return () => {
      countdownTimersRef.current.forEach(t => clearTimeout(t));
    };
  }, []);

  // Handle Form Submission: Student types name, trigger 3-2-1-GO countdown, then starts Subway run
  const handleStartTurn = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = inputStudentName.trim();
    if (!trimmed) return;

    // Clear any pending countdown timers
    countdownTimersRef.current.forEach(t => clearTimeout(t));
    countdownTimersRef.current = [];

    setActiveStudentName(trimmed);
    setCurrentView('playing');
    setIsPaused(true); // PAUSED during 3-2-1 countdown so student gets ready!
    setShowQuestionModal(false);
    setAnimState('ready'); // Ready Standby - NOT running yet!
    setLastCoinsCollected(0);

    // Pick a question distributed nicely from question bank & randomize choices (A, B, C, D)
    const qIndex = Math.floor(Math.random() * QUESTIONS_BANK.length);
    setActiveQuestion(getRandomizedQuestion(QUESTIONS_BANK[qIndex]));

    // Stage 1: "3" (0ms)
    setCountdown(3);
    playCountdownBeep(3);

    // Stage 2: "2" (+900ms)
    const t1 = setTimeout(() => {
      setCountdown(2);
      playCountdownBeep(2);
    }, 900);

    // Stage 3: "1" (+1800ms)
    const t2 = setTimeout(() => {
      setCountdown(1);
      playCountdownBeep(1);
    }, 1800);

    // Stage 4: "GO!" (+2700ms) -> Karakter BARU lari & rintangan mulai bergerak!
    const t3 = setTimeout(() => {
      setCountdown('GO!');
      setAnimState('running'); // SEKARANG BARU LARI!
      playCountdownBeep('GO');
      playSubwayHorn();
      setIsPaused(false); // Unpause gameplay!
    }, 2700);

    // Stage 5: Hide countdown overlay (+3500ms)
    const t4 = setTimeout(() => {
      setCountdown(null);
    }, 3500);

    countdownTimersRef.current = [t1, t2, t3, t4];
  };

  // Triggered when Runner collides with an obstacle OR hits the Question Gate
  const handleTriggerQuiz = (coins: number, dist: number = 0) => {
    setIsPaused(true);
    setAnimState('crashed');
    setLastCoinsCollected(coins);
    setLastDistanceRun(dist);
    setShowQuestionModal(true);
  };

  // Handle Question Answer Submission (1 Question = 1 Student)
  const handleAnswerSubmit = (isCorrect: boolean, totalScore: number) => {
    if (!activeStudentName || !activeQuestion) return;

    if (isCorrect) {
      setAnimState('celebrating');
    } else {
      setAnimState('crashed');
    }

    // Add entry to Leaderboard (Safe in LocalStorage)
    const updatedLb = addLeaderboardEntry({
      studentName: activeStudentName,
      score: totalScore,
      coinsCollected: lastCoinsCollected,
      isCorrect,
      questionText: activeQuestion.question,
      categoryTitle: activeQuestion.categoryTitle,
    });
    setLeaderboard(updatedLb);

    // Increment session turn count
    const count = incrementSessionTurnCount();
    setSessionTurnCount(count);
  };

  // When round finishes: return to Name Input screen for the next student
  const handleNextStudent = () => {
    countdownTimersRef.current.forEach(t => clearTimeout(t));
    countdownTimersRef.current = [];
    setCountdown(null);
    setShowQuestionModal(false);
    setIsPaused(false);
    setAnimState('ready');
    setInputStudentName('');
    setActiveStudentName('');
    setCurrentView('name_input');
  };

  // Reset Session Turns: only resets active count, NEVER deletes leaderboard
  const handleResetSession = () => {
    countdownTimersRef.current.forEach(t => clearTimeout(t));
    countdownTimersRef.current = [];
    setCountdown(null);
    setPreviousSessionCount(sessionTurnCount);
    resetActiveSessionTurn();
    setSessionTurnCount(0);
    setInputStudentName('');
    setActiveStudentName('');
    setCurrentView('name_input');
    playCoinSound();
  };

  const handleUndoResetSession = () => {
    try {
      localStorage.setItem('python_subway_session_count_v1', String(previousSessionCount));
    } catch {}
    setSessionTurnCount(previousSessionCount);
    setResetToastMessage(null);
    playCoinSound();
  };

  // Clear Leaderboard: separate explicit action
  const handleClearLeaderboard = () => {
    clearLeaderboard();
    setLeaderboard([]);
  };

  const handleToggleSound = () => {
    const now = toggleSound();
    setSoundActive(now);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-100 via-orange-50 to-amber-100 text-slate-900 font-sans flex flex-col">
      {/* TOP CLASSROOM ARCADE NAVBAR */}
      <header className="bg-gradient-to-r from-orange-600 via-amber-500 to-orange-600 border-b-4 border-amber-600 text-white shadow-xl sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3">
          {/* Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white text-orange-600 flex items-center justify-center font-black text-xl shadow-md border-2 border-amber-300 select-none">
              🚇
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm sm:text-base md:text-lg font-black font-['Press_Start_2P'] tracking-wide text-white drop-shadow">
                  PYTHON SUBWAY QUIZ
                </h1>
                <span className="hidden sm:inline-block px-2 py-0.5 rounded-full bg-amber-950/60 text-amber-200 text-[10px] font-bold uppercase tracking-wider border border-amber-300/30">
                  SMA Kelas 10
                </span>
              </div>
              <p className="text-xs text-amber-100 hidden md:block">
                Subway Surfers Teori Python • Dual Kontrol Laptop & Smartboard • 1 Siswa 1 Soal
              </p>
            </div>
          </div>

          {/* Action Navigation Buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Leaderboard Modal */}
            <button
              type="button"
              onClick={() => {
                playClickSound();
                setShowLeaderboardModal(true);
              }}
              className="px-3.5 py-2 bg-yellow-400 hover:bg-yellow-300 text-amber-950 font-bold text-xs sm:text-sm rounded-xl shadow-md border-2 border-yellow-200 flex items-center gap-1.5 transition-transform active:scale-95 cursor-pointer"
            >
              <Trophy className="w-4 h-4 text-amber-900 fill-amber-900" />
              <span>Papan Peringkat ({leaderboard.length})</span>
            </button>

            {/* Python Cheat Sheet Modal */}
            <button
              type="button"
              onClick={() => {
                playClickSound();
                setShowCheatSheetModal(true);
              }}
              className="px-3 py-2 bg-black/25 hover:bg-black/35 text-white font-bold text-xs sm:text-sm rounded-xl border border-white/30 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <BookOpen className="w-4 h-4 text-emerald-200" />
              <span className="hidden sm:inline">Materi Teori</span>
            </button>

            {/* Bank Soal Modal */}
            <button
              type="button"
              onClick={() => {
                playClickSound();
                setShowQuestionBankModal(true);
              }}
              className="px-3 py-2 bg-black/25 hover:bg-black/35 text-white font-bold text-xs sm:text-sm rounded-xl border border-white/30 flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Lihat seluruh bank soal kuis, kunci jawaban, dan pembahasan"
            >
              <HelpCircle className="w-4 h-4 text-cyan-200" />
              <span className="hidden sm:inline">Bank Soal ({QUESTIONS_BANK.length})</span>
            </button>

            {/* Sound Toggle */}
            <button
              type="button"
              onClick={handleToggleSound}
              title={soundActive ? 'Matikan Suara Arcade' : 'Nyalakan Suara Arcade'}
              className="p-2 rounded-xl bg-black/25 hover:bg-black/35 text-white border border-white/30 transition-colors cursor-pointer"
            >
              {soundActive ? <Volume2 className="w-4 h-4 text-yellow-300" /> : <VolumeX className="w-4 h-4 text-red-300" />}
            </button>
          </div>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main className="max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-6 flex-1 flex flex-col gap-5 w-full">

        {/* ============================================================== */}
        {/* VIEW 1: CLEAN STUDENT NAME INPUT SCREEN (SEBELUM BERMAIN) */}
        {/* ============================================================== */}
        {currentView === 'name_input' && (
          <div className="w-full max-w-3xl mx-auto space-y-6 my-auto py-6 animate-fadeIn">
            {/* Projector & Smartboard Hero Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-10 border-4 border-amber-400 shadow-2xl space-y-6 text-center">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-100 text-orange-800 font-bold text-xs uppercase tracking-wider border border-orange-200 shadow-sm">
                  <Sparkles className="w-4 h-4" />
                  <span>Giliran Siswa Baru Maju ke Depan Kelas</span>
                </div>
                <h2 className="text-2xl sm:text-4xl font-black text-slate-950 tracking-tight">
                  Ketik Nama Kamu untuk Mulai Lari!
                </h2>
                <p className="text-slate-600 text-sm sm:text-base max-w-xl mx-auto">
                  Berlari di atas rel jalur Subway, hindari rintangan atau tabrak gerbang soal untuk membuka 1 pertanyaan teori dasar Python!
                </p>
              </div>

              {/* Form Input Nama Siswa Manual */}
              <form onSubmit={handleStartTurn} className="space-y-4 max-w-lg mx-auto">
                <div className="space-y-1.5 text-left">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                    <User className="w-4 h-4 text-orange-600" />
                    <span>Nama Siswa yang Maju:</span>
                  </label>
                  <input
                    type="text"
                    required
                    autoFocus
                    value={inputStudentName}
                    onChange={(e) => setInputStudentName(e.target.value)}
                    placeholder="Ketik nama panggilanmu (contoh: Citra, Budi)..."
                    className="w-full px-5 py-4 text-lg sm:text-xl font-bold bg-amber-50/60 rounded-2xl border-3 border-amber-300 focus:border-orange-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-orange-200 transition-all text-slate-900 placeholder:text-slate-400 shadow-inner"
                  />
                </div>

                <button
                  type="submit"
                  disabled={!inputStudentName.trim()}
                  className="w-full py-4 sm:py-5 bg-gradient-to-r from-orange-600 via-amber-500 to-orange-600 hover:from-orange-700 hover:to-amber-600 disabled:opacity-50 text-white font-extrabold text-lg sm:text-xl rounded-2xl shadow-xl hover:shadow-2xl flex items-center justify-center gap-3 transform active:scale-95 transition-all cursor-pointer"
                >
                  <Play className="w-6 h-6 fill-current" />
                  <span>Mulai Lari Subway! 🏃💨</span>
                </button>
              </form>

              {/* Quick Teacher / Student Reference Buttons */}
              <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    playClickSound();
                    setShowCheatSheetModal(true);
                  }}
                  className="px-4 py-2 bg-amber-100 hover:bg-amber-200 text-amber-950 rounded-xl border border-amber-300 font-bold text-xs flex items-center gap-1.5 transition-transform active:scale-95 cursor-pointer shadow-xs"
                >
                  <BookOpen className="w-4 h-4 text-orange-600" />
                  <span>📖 Ringkasan Materi Teori</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    playClickSound();
                    setShowQuestionBankModal(true);
                  }}
                  className="px-4 py-2 bg-cyan-100 hover:bg-cyan-200 text-cyan-950 rounded-xl border border-cyan-300 font-bold text-xs flex items-center gap-1.5 transition-transform active:scale-95 cursor-pointer shadow-xs"
                >
                  <HelpCircle className="w-4 h-4 text-cyan-700" />
                  <span>📚 Bank Soal ({QUESTIONS_BANK.length} Soal & Kunci)</span>
                </button>
              </div>

              {/* Classroom Stats & Safe Reset */}
              <div className="pt-4 border-t-2 border-slate-100 flex flex-col gap-3 text-xs text-slate-500 font-semibold">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span>Siswa yang sudah bermain di sesi ini: <strong className="font-bold text-orange-600 text-sm">{sessionTurnCount} Siswa</strong></span>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      playClickSound();
                      setShowResetConfirmModal(prev => !prev);
                    }}
                    className="px-3.5 py-2 bg-amber-50 hover:bg-amber-100 text-amber-900 rounded-xl border border-amber-300 font-bold flex items-center gap-1.5 cursor-pointer transition-all active:scale-95 shadow-xs"
                    title="Reset penghitung giliran siswa tanpa menghapus data papan peringkat"
                  >
                    <RotateCcw className="w-4 h-4 text-amber-700" />
                    <span>Reset Sesi Giliran</span>
                  </button>
                </div>

                {/* Inline Confirmation Box (Responsive & Easy to Tap on Smartboard / Laptop) */}
                {showResetConfirmModal && (
                  <div className="p-4 bg-amber-50 border-2 border-amber-400 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 text-xs shadow-md animate-fadeIn">
                    <div className="flex items-start gap-2.5 text-amber-950 font-bold">
                      <div className="w-8 h-8 rounded-xl bg-amber-200 text-amber-800 flex items-center justify-center shrink-0">
                        <RotateCcw className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-sm font-extrabold text-slate-900">Reset giliran sesi siswa ke 0?</div>
                        <p className="text-[11px] font-medium text-emerald-800 mt-0.5">
                          ✓ CATATAN AMAN: Nilai di Papan Peringkat (Leaderboard) <strong>TETAP TERSIMPAN AMAN</strong>.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
                      <button
                        type="button"
                        onClick={() => setShowResetConfirmModal(false)}
                        className="flex-1 sm:flex-none py-2 px-3.5 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold rounded-xl transition-colors cursor-pointer"
                      >
                        Batal
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          handleResetSession();
                          setShowResetConfirmModal(false);
                          setResetToastMessage('✓ Sesi giliran berhasil direset ke 0 Siswa! (Data Papan Peringkat tetap tersimpan aman)');
                          setTimeout(() => setResetToastMessage(null), 5000);
                        }}
                        className="flex-1 sm:flex-none py-2 px-4 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white font-extrabold rounded-xl shadow-md border border-orange-500 active:scale-95 cursor-pointer"
                      >
                        Ya, Reset ke 0
                      </button>
                    </div>
                  </div>
                )}

                {/* Toast Notification if reset was executed */}
                {resetToastMessage && (
                  <div className="p-3 bg-emerald-100 border-2 border-emerald-400 text-emerald-950 font-bold text-xs rounded-2xl flex items-center justify-between gap-2 shadow-xs animate-fadeIn">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                      <span>{resetToastMessage}</span>
                    </div>
                    {previousSessionCount > 0 && (
                      <button
                        type="button"
                        onClick={handleUndoResetSession}
                        className="px-2.5 py-1 bg-white hover:bg-emerald-50 text-emerald-800 border border-emerald-300 rounded-lg text-xs font-bold cursor-pointer transition-colors shrink-0 shadow-2xs"
                      >
                        Urungkan
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* 3 Steps Guide for Classroom */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white/85 p-4 rounded-2xl border border-amber-200 shadow-sm flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-orange-100 text-orange-800 font-black flex items-center justify-center shrink-0">1</div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">Input Nama Siswa</h4>
                  <p className="text-xs text-slate-600 mt-0.5">Siswa yang maju mengetikkan nama di Smartboard atau laptop guru.</p>
                </div>
              </div>

              <div className="bg-white/85 p-4 rounded-2xl border border-amber-200 shadow-sm flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 font-black flex items-center justify-center shrink-0">2</div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">Lari Jalur Subway</h4>
                  <p className="text-xs text-slate-600 mt-0.5">Gunakan tombol layar Smartboard atau tombol panah keyboard laptop untuk pindah jalur dan lompat.</p>
                </div>
              </div>

              <div className="bg-white/85 p-4 rounded-2xl border border-emerald-200 shadow-sm flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 font-black flex items-center justify-center shrink-0">3</div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">1 Siswa = 1 Soal</h4>
                  <p className="text-xs text-slate-600 mt-0.5">Jawab 1 soal teori Python, nilai tersimpan di papan peringkat, lalu ganti giliran siswa!</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* VIEW 2: SUBWAY RUNNER GAMEPLAY ARENA */}
        {/* ============================================================== */}
        {currentView === 'playing' && (
          <div className="space-y-4 animate-fadeIn">
            {/* Header Status Bar for Active Student */}
            <div className="bg-white rounded-2xl p-4 border-2 border-amber-300 shadow-sm flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-orange-600 text-white font-bold flex items-center justify-center text-lg shadow">
                  🏃
                </div>
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-wider text-orange-600">
                    Siswa Sedang Bermain:
                  </div>
                  <div className="text-xl sm:text-2xl font-black text-slate-950 uppercase">
                    {activeStudentName}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleNextStudent}
                  className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl border border-slate-300 transition-colors cursor-pointer"
                  title="Kembali ke formulir nama siswa"
                >
                  Ganti Nama Siswa
                </button>
              </div>
            </div>

            {/* 3D Subway Canvas with Dual Controls (Laptop & Smartboard) */}
            <SubwayCanvas
              studentName={activeStudentName}
              isPaused={isPaused}
              onTriggerQuiz={handleTriggerQuiz}
              animState={animState}
              countdown={countdown}
            />
          </div>
        )}
      </main>

      {/* FOOTER */}
      <footer className="bg-amber-950 text-amber-200 text-xs py-4 px-4 text-center border-t-2 border-amber-900/60 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <span>Python Subway Quiz • Game Pembelajaran Teori Python SMA Kelas 10</span>
          <span>Dual Kontrol Laptop & Smartboard • Papan Peringkat Aman (LocalStorage)</span>
        </div>
      </footer>

      {/* POPUP MODALS */}
      {/* 1. Question Modal: Pops up when runner hits obstacle or quiz gate */}
      {showQuestionModal && activeQuestion && (
        <QuestionModal
          question={activeQuestion}
          studentName={activeStudentName}
          coinsCollected={lastCoinsCollected}
          distanceRun={lastDistanceRun}
          onAnswerSubmit={handleAnswerSubmit}
          onNextStudent={handleNextStudent}
        />
      )}

      {/* 2. Leaderboard Modal with Podium & Safe Reset */}
      <LeaderboardModal
        isOpen={showLeaderboardModal}
        onClose={() => setShowLeaderboardModal(false)}
        entries={leaderboard}
        onClearLeaderboard={handleClearLeaderboard}
        onResetSession={handleResetSession}
      />

      {/* 3. Python Theory Cheat Sheet Modal */}
      <PythonCheatSheetModal
        isOpen={showCheatSheetModal}
        onClose={() => setShowCheatSheetModal(false)}
        onOpenQuestionBank={() => setShowQuestionBankModal(true)}
      />

      {/* 4. Question Bank Modal (Bank Soal 37 Soal) */}
      <QuestionBankModal
        isOpen={showQuestionBankModal}
        onClose={() => setShowQuestionBankModal(false)}
        onOpenTheoryModal={() => setShowCheatSheetModal(true)}
      />

    </div>
  );
}
