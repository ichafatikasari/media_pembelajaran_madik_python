import React, { useState, useMemo } from 'react';
import { Question } from '../types';
import { QUESTIONS_BANK } from '../data/questions';
import { HelpCircle, X, Search, CheckCircle2, BookOpen, Filter, Terminal, Code, Database, Sparkles, Copy, Check } from 'lucide-react';

interface QuestionBankModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenTheoryModal?: () => void;
}

export const QuestionBankModal: React.FC<QuestionBankModalProps> = ({
  isOpen,
  onClose,
  onOpenTheoryModal,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'konsep' | 'print' | 'tipe_data'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const filteredQuestions = useMemo(() => {
    return QUESTIONS_BANK.filter((q) => {
      const matchCategory = selectedCategory === 'all' || q.category === selectedCategory;
      const qText = q.question.toLowerCase();
      const catText = q.categoryTitle.toLowerCase();
      const codeText = (q.codeSnippet || '').toLowerCase();
      const optText = q.options.join(' ').toLowerCase();
      const expText = q.explanation.toLowerCase();
      const query = searchQuery.toLowerCase().trim();

      const matchSearch =
        !query ||
        qText.includes(query) ||
        catText.includes(query) ||
        codeText.includes(query) ||
        optText.includes(query) ||
        expText.includes(query);

      return matchCategory && matchSearch;
    });
  }, [selectedCategory, searchQuery]);

  const handleCopyQuestion = (q: Question) => {
    const text = `[Soal #${q.id} - ${q.categoryTitle}]\n${q.question}\n${q.codeSnippet ? `Kode:\n${q.codeSnippet}\n` : ''}\nPilihan:\nA. ${q.options[0]}\nB. ${q.options[1]}\nC. ${q.options[2]}\nD. ${q.options[3]}\n\nKunci Jawaban: ${['A', 'B', 'C', 'D'][q.correctIndex]} (${q.options[q.correctIndex]})\nPembahasan: ${q.explanation}`;
    navigator.clipboard?.writeText(text);
    setCopiedId(q.id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-5xl bg-white rounded-3xl shadow-2xl border-4 border-amber-500 overflow-hidden text-slate-800 flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-600 via-amber-500 to-orange-600 px-6 py-4 text-white flex items-center justify-between shrink-0 border-b-4 border-amber-600">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-xl shadow">
              📚
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm sm:text-base md:text-lg font-bold font-['Press_Start_2P'] tracking-wide">
                  BANK SOAL TEORI PYTHON
                </h2>
                <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full bg-amber-950/60 text-amber-200 text-[10px] font-bold uppercase border border-amber-300/40">
                  {QUESTIONS_BANK.length} Soal Kelas 10
                </span>
              </div>
              <p className="text-xs text-amber-100">
                Kumpulan Soal Lengkap dengan Kunci Jawaban & Pembahasan Materi
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onOpenTheoryModal && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenTheoryModal();
                }}
                className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/20 hover:bg-white/30 text-white font-bold text-xs transition-colors cursor-pointer border border-white/30"
              >
                <BookOpen className="w-3.5 h-3.5 text-amber-200" />
                <span>Buka Materi Teori</span>
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-black/20 text-white/80 hover:text-white transition-colors cursor-pointer"
              title="Tutup Bank Soal"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Filter Bar & Search */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-col md:flex-row items-center justify-between gap-3 shrink-0">
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
            <button
              type="button"
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === 'all'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'bg-white hover:bg-slate-200 text-slate-700 border border-slate-200'
              }`}
            >
              Semua ({QUESTIONS_BANK.length})
            </button>

            <button
              type="button"
              onClick={() => setSelectedCategory('konsep')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap flex items-center gap-1 transition-all cursor-pointer ${
                selectedCategory === 'konsep'
                  ? 'bg-orange-600 text-white shadow-sm'
                  : 'bg-white hover:bg-slate-200 text-slate-700 border border-slate-200'
              }`}
            >
              <Code className="w-3.5 h-3.5" />
              <span>Dasar Coding (7)</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedCategory('print')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap flex items-center gap-1 transition-all cursor-pointer ${
                selectedCategory === 'print'
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'bg-white hover:bg-slate-200 text-slate-700 border border-slate-200'
              }`}
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>Fungsi print() (9)</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedCategory('tipe_data')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap flex items-center gap-1 transition-all cursor-pointer ${
                selectedCategory === 'tipe_data'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-white hover:bg-slate-200 text-slate-700 border border-slate-200'
              }`}
            >
              <Database className="w-3.5 h-3.5" />
              <span>Tipe Data (21)</span>
            </button>
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-64 shrink-0">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari soal / kata kunci..."
              className="w-full pl-9 pr-4 py-1.5 text-xs bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 text-slate-800 placeholder-slate-400"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Question Cards List */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4">
          {filteredQuestions.length === 0 ? (
            <div className="p-12 text-center text-slate-400 space-y-2">
              <div className="text-4xl">🔍</div>
              <p className="font-bold text-sm text-slate-600">Tidak ada soal yang cocok dengan pencarian.</p>
              <p className="text-xs">Coba kata kunci lain atau pilih tab kategori 'Semua'.</p>
            </div>
          ) : (
            filteredQuestions.map((q, idx) => {
              const optionLetters = ['A', 'B', 'C', 'D'];
              const isCopied = copiedId === q.id;

              return (
                <div
                  key={q.id}
                  className="bg-white border-2 border-slate-200 hover:border-amber-400 rounded-2xl p-4 sm:p-5 shadow-sm transition-all hover:shadow-md space-y-3"
                >
                  {/* Card Header: Number & Category Badge */}
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
                    <div className="flex items-center gap-2">
                      <span className="w-7 h-7 rounded-lg bg-amber-500 text-slate-950 font-black font-['Press_Start_2P'] text-[10px] flex items-center justify-center shadow-sm">
                        #{q.id}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-200">
                        {q.categoryTitle}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleCopyQuestion(q)}
                      className="flex items-center gap-1 text-[11px] font-bold text-slate-500 hover:text-amber-700 bg-slate-100 hover:bg-amber-50 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                      title="Salin soal ini ke clipboard"
                    >
                      {isCopied ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="text-emerald-700">Tersalin!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Salin Soal</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Question Text */}
                  <h3 className="font-bold text-slate-900 text-sm sm:text-base leading-snug">
                    {q.question}
                  </h3>

                  {/* Code Snippet Box (if available) */}
                  {q.codeSnippet && (
                    <div className="bg-slate-950 text-amber-300 font-mono text-xs p-3 rounded-xl border border-slate-800 shadow-inner overflow-x-auto">
                      <span className="text-emerald-400 mr-2">&gt;&gt;&gt;</span>
                      {q.codeSnippet}
                    </div>
                  )}

                  {/* Options List */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                    {q.options.map((opt, oIdx) => {
                      const isCorrect = oIdx === q.correctIndex;
                      return (
                        <div
                          key={oIdx}
                          className={`p-2.5 rounded-xl text-xs font-medium border flex items-start gap-2.5 transition-colors ${
                            isCorrect
                              ? 'bg-emerald-50 border-emerald-400 text-emerald-950 font-bold shadow-xs'
                              : 'bg-slate-50/70 border-slate-200 text-slate-700'
                          }`}
                        >
                          <span
                            className={`w-5 h-5 rounded-md flex items-center justify-center font-black text-[10px] shrink-0 ${
                              isCorrect
                                ? 'bg-emerald-600 text-white'
                                : 'bg-slate-200 text-slate-700'
                            }`}
                          >
                            {optionLetters[oIdx]}
                          </span>
                          <span className="leading-tight flex-1">{opt}</span>
                          {isCorrect && (
                            <span className="text-[10px] bg-emerald-600 text-white font-bold px-1.5 py-0.5 rounded shrink-0 flex items-center gap-0.5">
                              <Check className="w-3 h-3" /> Benar
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Explanation Box */}
                  <div className="bg-amber-50/80 border-l-4 border-amber-400 p-3 rounded-r-xl text-xs text-slate-700 leading-relaxed">
                    <strong className="text-amber-950 font-bold">💡 Pembahasan: </strong>
                    {q.explanation}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-100 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2 shrink-0">
          <div className="text-xs text-slate-600 font-semibold flex items-center gap-1.5">
            <span>✅ Menampilkan <strong>{filteredQuestions.length}</strong> dari <strong>{QUESTIONS_BANK.length}</strong> soal teori Python SMA Kelas 10</span>
          </div>

          <div className="flex items-center gap-2">
            {onOpenTheoryModal && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenTheoryModal();
                }}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs sm:text-sm rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <BookOpen className="w-4 h-4" />
                <span>Pelajari Ringkasan Materi</span>
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs sm:text-sm rounded-xl transition-colors cursor-pointer"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
