import React, { useState } from 'react';
import { LeaderboardEntry } from '../types';
import { exportLeaderboardCSV } from '../utils/storage';
import { 
  Trophy, 
  X, 
  Download, 
  Trash2, 
  Medal, 
  CheckCircle2, 
  XCircle, 
  RotateCcw,
  Sparkles,
  AlertTriangle 
} from 'lucide-react';
import { playClickSound } from '../utils/sound';

interface LeaderboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  entries: LeaderboardEntry[];
  onClearLeaderboard: () => void;
  onResetSession: () => void;
}

export const LeaderboardModal: React.FC<LeaderboardModalProps> = ({
  isOpen,
  onClose,
  entries,
  onClearLeaderboard,
  onResetSession,
}) => {
  const [filterType, setFilterType] = useState<'all' | 'correct' | 'wrong'>('all');
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  if (!isOpen) return null;

  const filteredEntries = entries.filter((e) => {
    if (filterType === 'correct') return e.isCorrect;
    if (filterType === 'wrong') return !e.isCorrect;
    return true;
  });

  // Calculate stats
  const totalPlayed = entries.length;
  const totalCorrect = entries.filter(e => e.isCorrect).length;
  const accuracy = totalPlayed > 0 ? Math.round((totalCorrect / totalPlayed) * 100) : 0;

  // Top 3 students with highest points
  const sortedByScore = [...entries].sort((a, b) => b.score - a.score);
  const top1 = sortedByScore[0];
  const top2 = sortedByScore[1];
  const top3 = sortedByScore[2];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border-4 border-amber-500 overflow-hidden text-slate-800 flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 px-6 py-4 text-white flex items-center justify-between shrink-0 border-b-4 border-amber-600">
          <div className="flex items-center gap-3">
            <Trophy className="w-8 h-8 text-yellow-300 fill-yellow-300" />
            <div>
              <h2 className="text-xl font-bold font-['Press_Start_2P'] text-xs sm:text-base text-white">
                PAPAN PERINGKAT SUBWAY
              </h2>
              <p className="text-xs font-semibold text-amber-100">
                Data tersimpan permanen di LocalStorage browser kelas
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-black/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Stats Strip */}
        <div className="bg-amber-50/80 px-6 py-3 border-b border-amber-200 grid grid-cols-3 gap-2 text-center shrink-0">
          <div>
            <div className="text-[11px] font-bold uppercase text-amber-800">Total Siswa Main</div>
            <div className="text-xl font-black text-slate-900">{totalPlayed} Siswa</div>
          </div>
          <div>
            <div className="text-[11px] font-bold uppercase text-emerald-800">Jawaban Benar</div>
            <div className="text-xl font-black text-emerald-600">{totalCorrect} Siswa</div>
          </div>
          <div>
            <div className="text-[11px] font-bold uppercase text-blue-800">Akurasi Kelas</div>
            <div className="text-xl font-black text-blue-600">{accuracy}%</div>
          </div>
        </div>

        {/* Podium for Top 3 (if at least 1 player has played) */}
        {sortedByScore.length > 0 && (
          <div className="bg-gradient-to-b from-amber-100/60 to-white px-6 py-4 border-b border-amber-200 shrink-0">
            <div className="text-center text-xs font-bold uppercase tracking-wider text-amber-900 mb-3 flex items-center justify-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>Podium Peringkat Tertinggi Kelas</span>
            </div>
            <div className="flex items-end justify-center gap-3 sm:gap-6 pt-2">
              {/* Rank 2 */}
              {top2 && (
                <div className="flex flex-col items-center">
                  <div className="w-9 h-9 rounded-full bg-slate-300 border-2 border-slate-400 text-slate-800 font-black text-sm flex items-center justify-center shadow">
                    2
                  </div>
                  <div className="text-xs sm:text-sm font-bold text-slate-800 mt-1 max-w-[100px] truncate text-center">
                    {top2.studentName}
                  </div>
                  <div className="text-[11px] font-extrabold text-blue-600">
                    {top2.score} Pts
                  </div>
                  <div className="w-20 sm:w-24 h-14 bg-slate-200 rounded-t-xl border-t-2 border-slate-300 mt-1 flex items-center justify-center text-slate-500 font-black text-xs">
                    PERAK
                  </div>
                </div>
              )}

              {/* Rank 1 (Tallest) */}
              {top1 && (
                <div className="flex flex-col items-center">
                  <div className="w-11 h-11 rounded-full bg-yellow-400 border-3 border-yellow-200 text-amber-950 font-black text-base flex items-center justify-center shadow-lg ring-4 ring-yellow-200/60">
                    👑 1
                  </div>
                  <div className="text-sm sm:text-base font-black text-slate-900 mt-1 max-w-[120px] truncate text-center">
                    {top1.studentName}
                  </div>
                  <div className="text-xs sm:text-sm font-black text-amber-600">
                    {top1.score} Pts
                  </div>
                  <div className="w-24 sm:w-28 h-20 bg-gradient-to-t from-yellow-300 to-yellow-200 rounded-t-xl border-t-3 border-yellow-400 mt-1 flex items-center justify-center text-amber-900 font-black text-xs shadow-inner">
                    EMAS 🥇
                  </div>
                </div>
              )}

              {/* Rank 3 */}
              {top3 && (
                <div className="flex flex-col items-center">
                  <div className="w-9 h-9 rounded-full bg-amber-600 border-2 border-amber-400 text-white font-black text-sm flex items-center justify-center shadow">
                    3
                  </div>
                  <div className="text-xs sm:text-sm font-bold text-slate-800 mt-1 max-w-[100px] truncate text-center">
                    {top3.studentName}
                  </div>
                  <div className="text-[11px] font-extrabold text-amber-700">
                    {top3.score} Pts
                  </div>
                  <div className="w-20 sm:w-24 h-10 bg-amber-100 rounded-t-xl border-t-2 border-amber-300 mt-1 flex items-center justify-center text-amber-800 font-black text-xs">
                    PERUNGGU
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Actions & Filters */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-1.5 bg-slate-200/80 p-1 rounded-xl">
            <button
              onClick={() => setFilterType('all')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                filterType === 'all' ? 'bg-white shadow text-slate-900' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Semua ({entries.length})
            </button>
            <button
              onClick={() => setFilterType('correct')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                filterType === 'correct' ? 'bg-emerald-600 shadow text-white' : 'text-emerald-700 hover:text-emerald-900'
              }`}
            >
              Benar ({totalCorrect})
            </button>
            <button
              onClick={() => setFilterType('wrong')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                filterType === 'wrong' ? 'bg-rose-600 shadow text-white' : 'text-rose-700 hover:text-rose-900'
              }`}
            >
              Salah ({totalPlayed - totalCorrect})
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => exportLeaderboardCSV(entries)}
              disabled={entries.length === 0}
              className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Ekspor Excel/CSV</span>
            </button>

            <button
              onClick={() => setShowClearConfirm(true)}
              disabled={entries.length === 0}
              className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 disabled:opacity-50 text-rose-700 rounded-xl text-xs font-bold border border-rose-200 flex items-center gap-1 transition-all cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Hapus Data</span>
            </button>
          </div>
        </div>

        {/* Clear Confirmation Prompt */}
        {showClearConfirm && (
          <div className="p-4 bg-rose-50 border-b border-rose-300 flex flex-wrap items-center justify-between gap-3 shrink-0 animate-fadeIn">
            <div className="flex items-center gap-2 text-xs font-bold text-rose-900">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>Yakin hapus seluruh rekaman leaderboard? Tindakan ini tidak bisa dibatalkan.</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  onClearLeaderboard();
                  setShowClearConfirm(false);
                }}
                className="px-3 py-1 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-lg cursor-pointer"
              >
                Ya, Hapus Semua
              </button>
              <button
                onClick={() => setShowClearConfirm(false)}
                className="px-3 py-1 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold rounded-lg cursor-pointer"
              >
                Batal
              </button>
            </div>
          </div>
        )}

        {/* Entries Table */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {filteredEntries.length === 0 ? (
            <div className="text-center py-12 text-slate-400 space-y-2">
              <Trophy className="w-12 h-12 mx-auto stroke-1 text-slate-300" />
              <p className="text-sm font-semibold">Belum ada catatan skor siswa di papan peringkat.</p>
              <p className="text-xs">Mulai lari Subway dan jawab soal teori Python untuk mencatat nilai!</p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {filteredEntries.map((entry, idx) => (
                <div
                  key={entry.id}
                  className={`p-3.5 sm:p-4 rounded-2xl border-2 transition-all flex flex-wrap items-center justify-between gap-3 ${
                    entry.isCorrect
                      ? 'bg-emerald-50/50 border-emerald-200 hover:bg-emerald-50'
                      : 'bg-rose-50/40 border-rose-200 hover:bg-rose-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-lg bg-white border border-slate-200 font-bold text-xs text-slate-600 flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <div>
                      <div className="text-sm sm:text-base font-black text-slate-900 uppercase">
                        {entry.studentName}
                      </div>
                      <div className="text-xs text-slate-500 line-clamp-1 max-w-md">
                        {entry.categoryTitle} • {entry.questionText}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-base sm:text-lg font-black text-slate-950">
                        {entry.score} Poin
                      </div>
                      <div className="text-[11px] font-semibold text-slate-400">
                        🪙 {entry.coinsCollected || 0} koin • {entry.timestamp}
                      </div>
                    </div>

                    <div className="shrink-0">
                      {entry.isCorrect ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-300">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Benar</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-100 text-rose-800 text-xs font-bold border border-rose-300">
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Salah</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Reset Session Confirmation Banner */}
        {showResetConfirm && (
          <div className="p-4 bg-amber-50 border-t border-b border-amber-300 flex flex-wrap items-center justify-between gap-3 shrink-0 animate-fadeIn">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-950">
              <RotateCcw className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Reset giliran sesi siswa ke 0? (Data papan peringkat ini TETAP TERSIMPAN AMAN).</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  onResetSession();
                  setShowResetConfirm(false);
                  onClose();
                }}
                className="px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-lg cursor-pointer"
              >
                Ya, Reset Sesi
              </button>
              <button
                type="button"
                onClick={() => setShowResetConfirm(false)}
                className="px-3 py-1 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold rounded-lg cursor-pointer"
              >
                Batal
              </button>
            </div>
          </div>
        )}

        {/* Safe Session Reset Footer info */}
        <div className="bg-slate-100 px-6 py-3 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500 font-semibold shrink-0">
          <span>Papan peringkat disimpan aman di peramban ini.</span>
          <button
            type="button"
            onClick={() => setShowResetConfirm(true)}
            className="text-amber-800 hover:text-amber-950 font-bold flex items-center gap-1 cursor-pointer transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Giliran Sesi Saja (Aman)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
