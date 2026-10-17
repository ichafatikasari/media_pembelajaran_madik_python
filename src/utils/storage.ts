import { LeaderboardEntry } from '../types';

const LEADERBOARD_STORAGE_KEY = 'python_subway_leaderboard_v1';
const SESSION_STUDENT_COUNT_KEY = 'python_subway_session_count_v1';

// 1. LEADERBOARD FUNCTIONS (Persistent in LocalStorage)
export function getLeaderboard(): LeaderboardEntry[] {
  try {
    const raw = localStorage.getItem(LEADERBOARD_STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveLeaderboard(entries: LeaderboardEntry[]): void {
  try {
    localStorage.setItem(LEADERBOARD_STORAGE_KEY, JSON.stringify(entries));
  } catch (err) {
    console.error('Failed to save leaderboard:', err);
  }
}

export function addLeaderboardEntry(entry: Omit<LeaderboardEntry, 'id' | 'timestamp'>): LeaderboardEntry[] {
  const current = getLeaderboard();
  const newEntry: LeaderboardEntry = {
    ...entry,
    id: `subway_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    timestamp: new Date().toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
  };
  const updated = [newEntry, ...current];
  saveLeaderboard(updated);
  return updated;
}

// Separate clear leaderboard with safety
export function clearLeaderboard(): void {
  try {
    localStorage.removeItem(LEADERBOARD_STORAGE_KEY);
  } catch (err) {
    console.error('Failed to clear leaderboard:', err);
  }
}

// 2. SESSION COUNTER (Safe reset that NEVER touches Leaderboard)
export function getSessionTurnCount(): number {
  try {
    const raw = localStorage.getItem(SESSION_STUDENT_COUNT_KEY);
    return raw ? parseInt(raw, 10) : 0;
  } catch {
    return 0;
  }
}

export function incrementSessionTurnCount(): number {
  const count = getSessionTurnCount() + 1;
  try {
    localStorage.setItem(SESSION_STUDENT_COUNT_KEY, String(count));
  } catch {
    // ignore
  }
  return count;
}

// Reset ONLY current active session counter, PRESERVES LEADERBOARD COMPLETELY
export function resetActiveSessionTurn(): void {
  try {
    localStorage.removeItem(SESSION_STUDENT_COUNT_KEY);
  } catch {
    // ignore
  }
}

// Export leaderboard to CSV
export function exportLeaderboardCSV(entries: LeaderboardEntry[]): void {
  if (entries.length === 0) return;
  const headers = ['No', 'Nama Siswa', 'Koin Terkumpul', 'Skor Akhir', 'Status Soal', 'Kategori Soal', 'Pertanyaan', 'Waktu'];
  const rows = entries.map((e, idx) => [
    idx + 1,
    `"${e.studentName.replace(/"/g, '""')}"`,
    e.coinsCollected || 0,
    e.score,
    e.isCorrect ? 'BENAR (+100)' : 'SALAH (0)',
    `"${e.categoryTitle.replace(/"/g, '""')}"`,
    `"${e.questionText.replace(/"/g, '""')}"`,
    `"${e.timestamp}"`
  ]);

  const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `Rekap_Nilai_Python_Subway_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
