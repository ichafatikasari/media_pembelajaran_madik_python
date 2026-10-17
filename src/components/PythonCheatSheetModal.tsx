import React, { useState } from 'react';
import { BookOpen, X, Terminal, Database, Code, Sparkles, Check, HelpCircle, Hash, Calculator, ShieldCheck } from 'lucide-react';

interface PythonCheatSheetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenQuestionBank?: () => void;
}

export const PythonCheatSheetModal: React.FC<PythonCheatSheetModalProps> = ({
  isOpen,
  onClose,
  onOpenQuestionBank,
}) => {
  const [activeTab, setActiveTab] = useState<'konsep' | 'print' | 'tipe_data' | 'kisi_kisi'>('konsep');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border-4 border-amber-500 overflow-hidden text-slate-800 flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-600 via-amber-500 to-orange-600 px-6 py-4 text-white flex items-center justify-between shrink-0 border-b-4 border-amber-600">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-xl shadow">
              📖
            </div>
            <div>
              <h2 className="text-sm sm:text-base md:text-lg font-bold font-['Press_Start_2P'] tracking-wide">
                RINGKASAN TEORI PYTHON
              </h2>
              <p className="text-xs text-amber-100">
                Materi Teori Dasar SMA Kelas 10 (Sesuai 100% dengan 37 Soal Bank Kuis)
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-black/20 text-white/80 hover:text-white transition-colors cursor-pointer"
            title="Tutup Ringkasan Materi"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Tab Buttons */}
        <div className="px-4 sm:px-6 py-3 bg-slate-100 border-b border-slate-200 flex flex-wrap gap-2 shrink-0 items-center justify-between">
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('konsep')}
              className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'konsep'
                  ? 'bg-orange-600 text-white shadow-md'
                  : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
              }`}
            >
              <Code className="w-4 h-4" />
              <span>1. Dasar Coding (#1–#7)</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('print')}
              className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'print'
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
              }`}
            >
              <Terminal className="w-4 h-4" />
              <span>2. Fungsi print() (#8–#16)</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('tipe_data')}
              className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'tipe_data'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
              }`}
            >
              <Database className="w-4 h-4" />
              <span>3. Tipe Data (#17–#37)</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('kisi_kisi')}
              className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'kisi_kisi'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>4. Peta Kisi-Kisi 37 Soal</span>
            </button>
          </div>

          {onOpenQuestionBank && (
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenQuestionBank();
              }}
              className="px-3 py-1.5 rounded-lg bg-yellow-400 hover:bg-yellow-300 text-amber-950 font-bold text-xs flex items-center gap-1.5 shadow-sm border border-yellow-300 transition-transform active:scale-95 cursor-pointer ml-auto"
            >
              <HelpCircle className="w-3.5 h-3.5 text-amber-900" />
              <span>Buka Bank Soal (37)</span>
            </button>
          )}
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4 text-sm leading-relaxed">
          {/* TAB 1: DASAR CODING & PYTHON */}
          {activeTab === 'konsep' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded-r-2xl">
                <div className="flex items-center justify-between flex-wrap gap-2 mb-1">
                  <h3 className="font-bold text-orange-900 text-base flex items-center gap-2">
                    <span>💻</span>
                    <span>Pengertian Coding & Pemrograman</span>
                  </h3>
                  <span className="text-[10px] bg-orange-200 text-orange-950 font-bold px-2.5 py-0.5 rounded-full border border-orange-300">
                    Kunci Soal #1 & #2
                  </span>
                </div>
                <p className="text-slate-700 text-xs sm:text-sm">
                  <strong>Coding</strong> adalah kegiatan menulis deretan perintah atau instruksi terstruktur agar komputer dapat menjalankan tugas yang kita kehendaki.
                  Manfaat utamanya bagi siswa adalah melatih <strong>kemampuan logika berpikir teratur</strong> dan kreatif menyelesaikan masalah.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {/* Variabel & Assignment */}
                <div className="p-4 bg-white border-2 border-orange-200 rounded-2xl shadow-sm space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-orange-950 text-sm flex items-center gap-1.5">
                      <span>🏷️</span> Variabel & Tanda Sama Dengan ( = )
                    </h4>
                    <span className="text-[10px] bg-orange-100 text-orange-800 font-bold px-2 py-0.5 rounded-full">Kunci Soal #3</span>
                  </div>
                  <p className="text-xs text-slate-600">
                    Variabel adalah tempat di memori komputer untuk menyimpan data. Pengisian nilai ke dalam variabel menggunakan operator <strong>tanda sama dengan ( = )</strong>.
                  </p>
                  <div className="p-2.5 rounded-xl bg-slate-900 text-amber-300 font-mono text-xs">
                    skor = 100 <span className="text-slate-400"># variabel skor diisi angka 100</span><br />
                    nama = "Budi" <span className="text-slate-400"># variabel nama diisi teks</span>
                  </div>
                </div>

                {/* Ekstensi File .py */}
                <div className="p-4 bg-white border-2 border-amber-200 rounded-2xl shadow-sm space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-amber-950 text-sm flex items-center gap-1.5">
                      <span>📁</span> Ekstensi File Program (.py)
                    </h4>
                    <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-full">Kunci Soal #4</span>
                  </div>
                  <p className="text-xs text-slate-600">
                    File kode program Python selalu disimpan dengan akhiran (ekstensi) <strong>.py</strong> (bukan .docx, .mp3, atau .xlsx).
                  </p>
                  <div className="p-2.5 rounded-xl bg-slate-900 text-emerald-400 font-mono text-xs">
                    latihan1.py<br />
                    tugas_subway.py
                  </div>
                </div>

                {/* Komentar Tanda Pagar (#) */}
                <div className="p-4 bg-white border-2 border-slate-200 rounded-2xl shadow-sm space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                      <span>#️⃣</span> Komentar di Python (Tanda Pagar #)
                    </h4>
                    <span className="text-[10px] bg-slate-100 text-slate-700 font-bold px-2 py-0.5 rounded-full">Kunci Soal #5</span>
                  </div>
                  <p className="text-xs text-slate-600">
                    Tanda pagar (<strong>#</strong>) digunakan untuk membuat catatan atau komentar. Apapun yang ditulis setelah tanda pagar <strong>tidak akan dijalankan</strong> oleh komputer.
                  </p>
                  <div className="p-2.5 rounded-xl bg-slate-900 text-slate-400 font-mono text-xs">
                    # Ini adalah catatan program siswa<br />
                    print("Hai!") <span className="text-amber-300"># cetak Hai</span>
                  </div>
                </div>

                {/* Algoritma */}
                <div className="p-4 bg-white border-2 border-blue-200 rounded-2xl shadow-sm space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-blue-950 text-sm flex items-center gap-1.5">
                      <span>🧩</span> Pengertian Algoritma
                    </h4>
                    <span className="text-[10px] bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded-full">Kunci Soal #6</span>
                  </div>
                  <p className="text-xs text-slate-600">
                    <strong>Algoritma</strong> adalah deretan langkah-langkah logis, berurutan, dan terstruktur yang dibuat untuk memecahkan suatu permasalahan.
                  </p>
                  <div className="p-2.5 rounded-xl bg-blue-50 text-blue-900 text-xs font-semibold">
                    Langkah 1: Mulai ➔ Langkah 2: Masukkan Nama ➔ Langkah 3: Main Game ➔ Langkah 4: Selesai
                  </div>
                </div>

                {/* Sifat Python: High-Level & Case-Sensitive */}
                <div className="sm:col-span-2 p-4 bg-amber-50/70 border-2 border-amber-300 rounded-2xl space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                      <span>💡</span> Karakteristik Utama Bahasa Python
                    </h4>
                    <span className="text-[10px] bg-amber-200 text-amber-900 font-bold px-2 py-0.5 rounded-full">Kunci Soal #7</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700">
                    <div className="bg-white p-2.5 rounded-xl border border-amber-200">
                      <strong>1. High-Level Language:</strong> Tata bahasanya sangat bersih, sederhana, dan mudah dipahami manusia karena mirip bahasa Inggris sehari-hari.
                    </div>
                    <div className="bg-white p-2.5 rounded-xl border border-amber-200">
                      <strong>2. Case-Sensitive:</strong> Membedakan huruf besar dan kecil. Huruf kecil <code className="text-rose-600 font-mono font-bold">print()</code> adalah benar, sedangkan <code className="text-slate-500 font-mono line-through">Print()</code> akan menyebabkan Error.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: FUNGSI PRINT() */}
          {activeTab === 'print' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-2xl">
                <div className="flex items-center justify-between flex-wrap gap-2 mb-1">
                  <h3 className="font-bold text-amber-900 text-base flex items-center gap-2">
                    <span>📢</span>
                    <span>Fungsi Perintah print() & Output Layar</span>
                  </h3>
                  <span className="text-[10px] bg-amber-200 text-amber-950 font-bold px-2.5 py-0.5 rounded-full border border-amber-300">
                    Kunci Soal #8
                  </span>
                </div>
                <p className="text-slate-700 text-xs sm:text-sm">
                  Fungsi <code className="bg-amber-200/80 px-1.5 py-0.5 rounded font-mono text-amber-950 font-bold">print()</code> bertugas menampilkan atau mencetak teks, angka, dan hasil perhitungan ke layar konsol monitor komputer.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {/* Tanda Kurung Biasa () */}
                <div className="p-4 bg-white border-2 border-slate-200 rounded-2xl shadow-sm space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                      <span>( )</span> Tanda Kurung Biasa
                    </h4>
                    <span className="text-[10px] bg-slate-100 text-slate-700 font-bold px-2 py-0.5 rounded-full">Kunci Soal #10</span>
                  </div>
                  <p className="text-xs text-slate-600">
                    Pemanggilan fungsi di Python selalu menggunakan sepasang <strong>tanda kurung biasa: ( )</strong>, bukan kurung siku [ ] atau kurawal &#123; &#125;.
                  </p>
                  <div className="p-2.5 rounded-xl bg-slate-900 text-white font-mono text-xs">
                    print("Halo") <span className="text-emerald-400">✓ Benar</span><br />
                    <span className="text-rose-400">print["Halo"] ✕ Salah</span>
                  </div>
                </div>

                {/* Tanda Petik Teks String */}
                <div className="p-4 bg-white border-2 border-amber-200 rounded-2xl shadow-sm space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-amber-950 text-sm flex items-center gap-1.5">
                      <span>"..."</span> Tanda Petik untuk Teks
                    </h4>
                    <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-full">Kunci Soal #9 & #11</span>
                  </div>
                  <p className="text-xs text-slate-600">
                    Kata atau kalimat teks <strong>WAJIB diapit tanda petik</strong> dua ("...") atau petik satu ('...').
                  </p>
                  <div className="p-2.5 rounded-xl bg-slate-900 text-amber-300 font-mono text-xs">
                    print("Selamat Pagi!") ➔ Output: Selamat Pagi!<br />
                    print('Aku Siswa SMA') ➔ Output: Aku Siswa SMA
                  </div>
                </div>

                {/* Operasi Matematika di print */}
                <div className="sm:col-span-2 p-4 bg-white border-2 border-orange-200 rounded-2xl shadow-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-orange-950 text-sm flex items-center gap-1.5">
                      <span>🧮</span> Operasi Matematika dalam print() (Tanpa Petik)
                    </h4>
                    <span className="text-[10px] bg-orange-100 text-orange-800 font-bold px-2 py-0.5 rounded-full">Kunci Soal #12, #13, #14</span>
                  </div>
                  <p className="text-xs text-slate-600">
                    Jika angka ditulis <strong>tanpa tanda petik</strong>, Python akan langsung menghitung operasi matematikanya:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 font-mono text-xs">
                    <div className="bg-slate-900 text-white p-3 rounded-xl">
                      <div className="text-emerald-400 font-bold flex justify-between">
                        <span># Penjumlahan</span>
                        <span className="text-[10px] text-amber-300">Soal #12</span>
                      </div>
                      print(5 + 5)<br />
                      <span className="text-yellow-300"># Output: 10</span>
                    </div>
                    <div className="bg-slate-900 text-white p-3 rounded-xl">
                      <div className="text-emerald-400 font-bold flex justify-between">
                        <span># Pengurangan</span>
                        <span className="text-[10px] text-amber-300">Soal #13</span>
                      </div>
                      print(10 - 3)<br />
                      <span className="text-yellow-300"># Output: 7</span>
                    </div>
                    <div className="bg-slate-900 text-white p-3 rounded-xl">
                      <div className="text-emerald-400 font-bold flex justify-between">
                        <span># Perkalian (*)</span>
                        <span className="text-[10px] text-amber-300">Soal #14</span>
                      </div>
                      print(4 * 2)<br />
                      <span className="text-yellow-300"># Output: 8</span>
                    </div>
                  </div>
                </div>

                {/* Perbedaan Teks vs Angka */}
                <div className="sm:col-span-2 p-4 bg-rose-50 border-2 border-rose-300 rounded-2xl space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-rose-950 text-sm flex items-center gap-1.5">
                      <span>⚠️</span> Perbedaan Sangat Penting: Angka Berkutip vs Tanpa Kutip!
                    </h4>
                    <span className="text-[10px] bg-rose-200 text-rose-950 font-bold px-2 py-0.5 rounded-full">Kunci Soal #15</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="bg-white p-3 rounded-xl border border-rose-200 font-mono">
                      <span className="text-rose-700 font-bold">print("10 + 5")</span><br />
                      <span className="text-slate-600 font-sans mt-1 block">
                        ➔ Karena ada tanda petik, dicetak persis sebagai teks tulisan apa adanya: <strong className="text-rose-900 font-mono">10 + 5</strong>.
                      </span>
                    </div>
                    <div className="bg-white p-3 rounded-xl border border-emerald-200 font-mono">
                      <span className="text-emerald-700 font-bold">print(10 + 5)</span><br />
                      <span className="text-slate-600 font-sans mt-1 block">
                        ➔ Karena tidak ada tanda petik, komputer menghitung hasilnya: <strong className="text-emerald-900 font-mono">15</strong>.
                      </span>
                    </div>
                  </div>
                </div>

                {/* Cetak Angka Langsung print(100) */}
                <div className="sm:col-span-2 p-3.5 bg-amber-50/70 border-2 border-amber-300 rounded-2xl flex items-center justify-between gap-3 text-xs">
                  <div className="text-slate-800">
                    <strong>Bolehkah mencetak angka langsung tanpa tanda petik?</strong> Ya! Contoh <code className="bg-white px-2 py-0.5 rounded border border-amber-300 font-mono text-amber-900 font-bold">print(100)</code> akan langsung mencetak angka <strong className="font-mono">100</strong> ke layar tanpa error.
                  </div>
                  <span className="text-[10px] bg-amber-200 text-amber-950 font-bold px-2 py-0.5 rounded-full shrink-0">Kunci Soal #16</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: TIPE DATA DASAR */}
          {activeTab === 'tipe_data' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="bg-emerald-50 border-l-4 border-emerald-500 p-4 rounded-r-2xl">
                <div className="flex items-center justify-between flex-wrap gap-2 mb-1">
                  <h3 className="font-bold text-emerald-900 text-base flex items-center gap-2">
                    <span>🔤</span>
                    <span>4 Tipe Data Dasar Python & Fungsi type()</span>
                  </h3>
                  <span className="text-[10px] bg-emerald-200 text-emerald-950 font-bold px-2.5 py-0.5 rounded-full border border-emerald-300">
                    Kunci Soal #17 s.d. #37
                  </span>
                </div>
                <p className="text-slate-700 text-xs sm:text-sm">
                  Tipe data menentukan jenis nilai yang disimpan di dalam program. Ada 4 tipe data utama yang wajib dikuasai siswa kelas 10:
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {/* 1. String */}
                <div className="p-4 bg-emerald-50/60 border-2 border-emerald-300 rounded-2xl shadow-sm space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="font-bold text-emerald-950 text-sm flex items-center gap-1.5">
                      <span>🔤</span> 1. String (str) - Teks
                    </div>
                    <span className="text-[10px] bg-emerald-200 text-emerald-900 font-bold px-2 py-0.5 rounded-full font-mono">Soal #17–#21</span>
                  </div>
                  <p className="text-xs text-slate-700">
                    Tipe data untuk menyimpan teks kata atau kalimat. <strong>Ciri khasnya wajib dibungkus tanda petik</strong> ("..." atau '...'). Termasuk angka yang diapit kutip!
                  </p>
                  <div className="bg-white p-2.5 rounded-xl border border-emerald-200 font-mono text-xs text-emerald-900">
                    kata = "Indonesia" <span className="text-slate-500"># Soal #18</span><br />
                    kota = "Jakarta" <span className="text-slate-500"># Soal #20</span><br />
                    nomor = "99" <span className="text-slate-500"># tetap String karena ada petik! (Soal #21)</span>
                  </div>
                </div>

                {/* 2. Integer */}
                <div className="p-4 bg-blue-50/60 border-2 border-blue-300 rounded-2xl shadow-sm space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="font-bold text-blue-950 text-sm flex items-center gap-1.5">
                      <span>🔢</span> 2. Integer (int) - Bilangan Bulat
                    </div>
                    <span className="text-[10px] bg-blue-200 text-blue-900 font-bold px-2 py-0.5 rounded-full font-mono">Soal #22–#26</span>
                  </div>
                  <p className="text-xs text-slate-700">
                    Tipe data untuk angka <strong>bilangan bulat tanpa koma atau desimal</strong>. Mencakup bilangan positif, nol, dan negatif.
                  </p>
                  <div className="bg-white p-2.5 rounded-xl border border-blue-200 font-mono text-xs text-blue-900">
                    nilai = 25 <span className="text-slate-500"># Soal #23</span><br />
                    umur = 16 <span className="text-slate-500"># Soal #24</span><br />
                    pensil = 5 <span className="text-slate-500"># Soal #26</span><br />
                    suhu = -10 <span className="text-slate-500"># bulat negatif tetap int (Soal #25)</span>
                  </div>
                </div>

                {/* 3. Float */}
                <div className="p-4 bg-purple-50/60 border-2 border-purple-300 rounded-2xl shadow-sm space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="font-bold text-purple-950 text-sm flex items-center gap-1.5">
                      <span>📐</span> 3. Float (float) - Angka Desimal
                    </div>
                    <span className="text-[10px] bg-purple-200 text-purple-900 font-bold px-2 py-0.5 rounded-full font-mono">Soal #27–#31</span>
                  </div>
                  <p className="text-xs text-slate-700">
                    Tipe data untuk angka <strong>desimal atau pecahan</strong>. Di Python pemisah desimal <strong>menggunakan tanda titik (.)</strong>, bukan koma.
                  </p>
                  <div className="bg-white p-2.5 rounded-xl border border-purple-200 font-mono text-xs text-purple-900">
                    pi = 3.14 <span className="text-slate-500"># Soal #28</span><br />
                    tinggi = 168.5 <span className="text-slate-500"># Soal #29</span><br />
                    skor = 0.5 <span className="text-slate-500"># Soal #31 (pemisah titik, Soal #30)</span>
                  </div>
                </div>

                {/* 4. Boolean */}
                <div className="p-4 bg-amber-50/60 border-2 border-amber-300 rounded-2xl shadow-sm space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="font-bold text-amber-950 text-sm flex items-center gap-1.5">
                      <span>⚖️</span> 4. Boolean (bool) - Nilai Logika
                    </div>
                    <span className="text-[10px] bg-amber-200 text-amber-900 font-bold px-2 py-0.5 rounded-full font-mono">Soal #32–#36</span>
                  </div>
                  <p className="text-xs text-slate-700">
                    Tipe data logika yang <strong>HANYA memiliki 2 nilai</strong>: <strong>True</strong> (Benar / Ya) dan <strong>False</strong> (Salah / Tidak). Huruf awal wajib kapital.
                  </p>
                  <div className="bg-white p-2.5 rounded-xl border border-amber-200 font-mono text-xs text-amber-900">
                    True ➔ Benar / Ya <span className="text-slate-500"># Soal #33</span><br />
                    False ➔ Salah / Tidak <span className="text-slate-500"># Soal #34</span><br />
                    lulus = True <span className="text-slate-500"># Soal #35</span><br />
                    menyala = False <span className="text-slate-500"># Soal #36</span>
                  </div>
                </div>

                {/* 5. Fungsi type() */}
                <div className="sm:col-span-2 p-4 bg-slate-900 text-white rounded-2xl shadow-md space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-cyan-300 text-sm flex items-center gap-1.5">
                      <span>🔍</span> Perintah type() untuk Mengecek Tipe Data
                    </h4>
                    <span className="text-[10px] bg-cyan-900/60 text-cyan-300 border border-cyan-400/40 font-bold px-2 py-0.5 rounded-full font-mono">Kunci Soal #37</span>
                  </div>
                  <p className="text-xs text-slate-300">
                    Gunakan fungsi bawaan <strong>type()</strong> untuk mengetahui jenis tipe data dari sebuah nilai atau variabel di Python.
                  </p>
                  <div className="p-3 bg-black/60 rounded-xl font-mono text-xs space-y-1">
                    <div>print(type("Halo")) ➔ <span className="text-emerald-400">&lt;class 'str'&gt;</span> (String)</div>
                    <div>print(type(10)) ➔ <span className="text-blue-400">&lt;class 'int'&gt;</span> (Integer)</div>
                    <div>print(type(3.14)) ➔ <span className="text-purple-400">&lt;class 'float'&gt;</span> (Float)</div>
                    <div>print(type(True)) ➔ <span className="text-amber-400">&lt;class 'bool'&gt;</span> (Boolean)</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: PETA KISI-KISI 37 SOAL & PEMETAAN MATERI */}
          {activeTab === 'kisi_kisi' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="bg-purple-50 border-l-4 border-purple-500 p-4 rounded-r-2xl">
                <div className="flex items-center justify-between flex-wrap gap-2 mb-1">
                  <h3 className="font-bold text-purple-950 text-base flex items-center gap-2">
                    <span>🗺️</span>
                    <span>Peta Kisi-Kisi 37 Soal Teori Python Kelas 10</span>
                  </h3>
                  <span className="text-[10px] bg-purple-200 text-purple-950 font-bold px-2.5 py-0.5 rounded-full border border-purple-300">
                    100% Selaras dengan Soal Kuis
                  </span>
                </div>
                <p className="text-slate-700 text-xs sm:text-sm">
                  Daftar pemetaan topik materi pembelajaran terhadap nomor soal di Bank Soal Subway Surfers.
                </p>
              </div>

              {/* Table of Matrix */}
              <div className="overflow-x-auto rounded-2xl border-2 border-slate-200 shadow-sm">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200 uppercase text-[10px] tracking-wider">
                    <tr>
                      <th className="p-2.5 text-center w-16">No Soal</th>
                      <th className="p-2.5">Kategori / Topik</th>
                      <th className="p-2.5">Konsep Inti Yang Diuji</th>
                      <th className="p-2.5">Kunci Jawaban Singkat</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    <tr className="hover:bg-slate-50"><td className="p-2 text-center font-bold text-orange-600">#1</td><td className="p-2 font-semibold">Pengertian Coding</td><td className="p-2">Definisi paling sederhana kegiatan coding</td><td className="p-2 text-emerald-700 font-medium">Menulis instruksi agar komputer menjalankan tugas</td></tr>
                    <tr className="hover:bg-slate-50"><td className="p-2 text-center font-bold text-orange-600">#2</td><td className="p-2 font-semibold">Tujuan Coding</td><td className="p-2">Manfaat belajar pemrograman bagi siswa</td><td className="p-2 text-emerald-700 font-medium">Melatih logika berpikir teratur & problem solving</td></tr>
                    <tr className="hover:bg-slate-50"><td className="p-2 text-center font-bold text-orange-600">#3</td><td className="p-2 font-semibold">Variabel & Penugasan</td><td className="p-2">Simbol mengisi nilai ke variabel</td><td className="p-2 text-emerald-700 font-medium">Tanda sama dengan ( = )</td></tr>
                    <tr className="hover:bg-slate-50"><td className="p-2 text-center font-bold text-orange-600">#4</td><td className="p-2 font-semibold">Ekstensi File</td><td className="p-2">Akhiran file script Python standar</td><td className="p-2 text-emerald-700 font-medium">.py</td></tr>
                    <tr className="hover:bg-slate-50"><td className="p-2 text-center font-bold text-orange-600">#5</td><td className="p-2 font-semibold">Komentar Program</td><td className="p-2">Simbol membuat catatan yang diabaikan</td><td className="p-2 text-emerald-700 font-medium">Tanda pagar ( # )</td></tr>
                    <tr className="hover:bg-slate-50"><td className="p-2 text-center font-bold text-orange-600">#6</td><td className="p-2 font-semibold">Pengertian Algoritma</td><td className="p-2">Langkah logis dan terstruktur memecahkan masalah</td><td className="p-2 text-emerald-700 font-medium">Algoritma</td></tr>
                    <tr className="hover:bg-slate-50"><td className="p-2 text-center font-bold text-orange-600">#7</td><td className="p-2 font-semibold">Karakteristik Python</td><td className="p-2">Alasan Python sangat mudah bagi pemula</td><td className="p-2 text-emerald-700 font-medium">Sintaks bersih mirip bahasa Inggris sederhana</td></tr>
                    
                    <tr className="bg-amber-50/50"><td colSpan={4} className="p-1.5 px-3 text-[10px] font-bold text-amber-900 uppercase tracking-wider">Topik 2: Fungsi print() & Operasi Output Layar (#8–#16)</td></tr>
                    <tr className="hover:bg-slate-50"><td className="p-2 text-center font-bold text-amber-600">#8</td><td className="p-2 font-semibold">Fungsi print()</td><td className="p-2">Tugas utama perintah print()</td><td className="p-2 text-emerald-700 font-medium">Menampilkan teks atau output ke layar monitor</td></tr>
                    <tr className="hover:bg-slate-50"><td className="p-2 text-center font-bold text-amber-600">#9</td><td className="p-2 font-semibold">Tanda Petik</td><td className="p-2">Tanda baca wajib mengapit teks pada print()</td><td className="p-2 text-emerald-700 font-medium">Tanda petik ("..." atau '...')</td></tr>
                    <tr className="hover:bg-slate-50"><td className="p-2 text-center font-bold text-amber-600">#10</td><td className="p-2 font-semibold">Tanda Kurung</td><td className="p-2">Bentuk kurung pemanggilan fungsi di Python</td><td className="p-2 text-emerald-700 font-medium">Kurung biasa: ( )</td></tr>
                    <tr className="hover:bg-slate-50"><td className="p-2 text-center font-bold text-amber-600">#11</td><td className="p-2 font-semibold">Output Kalimat</td><td className="p-2">Hasil print("Selamat Pagi!")</td><td className="p-2 text-emerald-700 font-medium">Selamat Pagi!</td></tr>
                    <tr className="hover:bg-slate-50"><td className="p-2 text-center font-bold text-amber-600">#12</td><td className="p-2 font-semibold">Penjumlahan</td><td className="p-2">Hasil operasi matematika print(5 + 5)</td><td className="p-2 text-emerald-700 font-medium">10</td></tr>
                    <tr className="hover:bg-slate-50"><td className="p-2 text-center font-bold text-amber-600">#13</td><td className="p-2 font-semibold">Pengurangan</td><td className="p-2">Hasil operasi matematika print(10 - 3)</td><td className="p-2 text-emerald-700 font-medium">7</td></tr>
                    <tr className="hover:bg-slate-50"><td className="p-2 text-center font-bold text-amber-600">#14</td><td className="p-2 font-semibold">Perkalian (*)</td><td className="p-2">Hasil operasi matematika print(4 * 2)</td><td className="p-2 text-emerald-700 font-medium">8</td></tr>
                    <tr className="hover:bg-slate-50"><td className="p-2 text-center font-bold text-amber-600">#15</td><td className="p-2 font-semibold">Teks Berkutip</td><td className="p-2">Hasil print("10 + 5") di dalam tanda petik</td><td className="p-2 text-emerald-700 font-medium">10 + 5 (tercetak teks apa adanya)</td></tr>
                    <tr className="hover:bg-slate-50"><td className="p-2 text-center font-bold text-amber-600">#16</td><td className="p-2 font-semibold">Cetak Angka Langsung</td><td className="p-2">Kebolehan mencetak print(100) tanpa kutip</td><td className="p-2 text-emerald-700 font-medium">Boleh, langsung tercetak angka 100</td></tr>

                    <tr className="bg-emerald-50/50"><td colSpan={4} className="p-1.5 px-3 text-[10px] font-bold text-emerald-900 uppercase tracking-wider">Topik 3: Tipe Data Dasar (str, int, float, bool) & type() (#17–#37)</td></tr>
                    <tr className="hover:bg-slate-50"><td className="p-2 text-center font-bold text-emerald-600">#17–#21</td><td className="p-2 font-semibold">String (str)</td><td className="p-2">Teks berkutip: "Indonesia", kota="Jakarta", "99"</td><td className="p-2 text-emerald-700 font-medium">Tipe data String (str)</td></tr>
                    <tr className="hover:bg-slate-50"><td className="p-2 text-center font-bold text-blue-600">#22–#26</td><td className="p-2 font-semibold">Integer (int)</td><td className="p-2">Bilangan bulat tanpa koma: 25, umur=16, -10, pensil=5</td><td className="p-2 text-emerald-700 font-medium">Tipe data Integer (int)</td></tr>
                    <tr className="hover:bg-slate-50"><td className="p-2 text-center font-bold text-purple-600">#27–#31</td><td className="p-2 font-semibold">Float (float)</td><td className="p-2">Angka desimal bertitik (.): 3.14, tinggi=168.5, 0.5</td><td className="p-2 text-emerald-700 font-medium">Tipe data Float (float)</td></tr>
                    <tr className="hover:bg-slate-50"><td className="p-2 text-center font-bold text-amber-600">#32–#36</td><td className="p-2 font-semibold">Boolean (bool)</td><td className="p-2">Hanya bernilai True (Benar/Ya) & False (Salah/Tidak)</td><td className="p-2 text-emerald-700 font-medium">Tipe data Boolean (bool)</td></tr>
                    <tr className="hover:bg-slate-50"><td className="p-2 text-center font-bold text-cyan-600">#37</td><td className="p-2 font-semibold">Cek Tipe Data</td><td className="p-2">Fungsi bawaan Python memeriksa jenis tipe data</td><td className="p-2 text-emerald-700 font-medium">type()</td></tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-100 border-t border-slate-200 flex items-center justify-between shrink-0">
          <div className="text-[11px] text-slate-600 font-medium hidden sm:block">
            💡 <em>Semua materi di atas dirangkum langsung dari kurikulum Teori Dasar Python SMA Kelas 10.</em>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs sm:text-sm rounded-xl transition-colors cursor-pointer ml-auto"
          >
            Tutup Materi
          </button>
        </div>
      </div>
    </div>
  );
};
