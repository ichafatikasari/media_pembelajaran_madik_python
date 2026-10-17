import { Question } from '../types';

/**
 * Mengacak posisi opsi jawaban (A, B, C, D) dengan Fisher-Yates shuffle
 * sehingga jawaban benar terdistribusi secara acak dan adil (tidak selalu A).
 */
export function getRandomizedQuestion(question: Question): Question {
  const originalCorrectText = question.options[question.correctIndex];
  const shuffledOptions = [...question.options];
  
  for (let i = shuffledOptions.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = shuffledOptions[i];
    shuffledOptions[i] = shuffledOptions[j];
    shuffledOptions[j] = temp;
  }

  const newCorrectIndex = shuffledOptions.indexOf(originalCorrectText);

  return {
    ...question,
    options: shuffledOptions,
    correctIndex: newCorrectIndex >= 0 ? newCorrectIndex : 0,
  };
}

export const QUESTIONS_BANK: Question[] = [
  // ==========================================
  // 1. PENGERTIAN CODING & DASAR PYTHON (Sangat Mudah & Ramah Pemula)
  // ==========================================
  {
    id: 1,
    category: 'konsep',
    categoryTitle: 'Pengertian Coding',
    question: 'Apa arti atau pengertian paling sederhana dari kata "Coding"?',
    options: [
      'Menulis instruksi atau perintah agar komputer menjalankan tugas',
      'Memperbaiki kabel monitor komputer yang putus',
      'Menggambar pemandangan dengan pensil warna',
      'Membeli pulsa dan kuota internet di toko'
    ],
    correctIndex: 0,
    explanation: 'Coding adalah kegiatan menulis perintah atau instruksi terstruktur agar komputer dapat menjalankan tugas yang kita inginkan.'
  },
  {
    id: 2,
    category: 'konsep',
    categoryTitle: 'Tujuan Belajar Coding',
    question: 'Apa manfaat utama siswa SMA belajar coding dan pemrograman?',
    options: [
      'Melatih logika berpikir teratur dan memecahkan masalah',
      'Agar keyboard dan layar laptop cepat rusak',
      'Hanya untuk menonton video di internet',
      'Supaya baterai handphone cepat habis'
    ],
    correctIndex: 0,
    explanation: 'Belajar coding sangat bermanfaat untuk melatih kemampuan berpikir logis, terstruktur, dan kreatif memecahkan masalah.'
  },
  {
    id: 3,
    category: 'konsep',
    categoryTitle: 'Variabel di Python',
    question: 'Tanda baca apa yang digunakan untuk memberi atau menyimpan nilai ke dalam variabel di Python?',
    codeSnippet: 'skor = 100',
    options: [
      'Tanda sama dengan ( = )',
      'Tanda titik dua ( : )',
      'Tanda panah ( -> )',
      'Tanda tanya ( ? )'
    ],
    correctIndex: 0,
    explanation: 'Tanda sama dengan (=) adalah operator penugasan (assignment) untuk menyimpan data atau nilai ke dalam sebuah variabel di Python.'
  },
  {
    id: 4,
    category: 'konsep',
    categoryTitle: 'Ekstensi File Python',
    question: 'Ekstensi atau akhiran nama file standar untuk kode program Python adalah...',
    options: [
      '.py',
      '.mp3',
      '.docx',
      '.xlsx'
    ],
    correctIndex: 0,
    explanation: 'File script program Python selalu disimpan dengan akhiran .py, misalnya latihan.py atau tugas1.py.'
  },
  {
    id: 5,
    category: 'konsep',
    categoryTitle: 'Komentar di Python',
    question: 'Simbol apa yang digunakan untuk membuat catatan/komentar di Python (tidak dijalankan komputer)?',
    codeSnippet: '# Ini adalah catatan program',
    options: [
      'Tanda pagar ( # )',
      'Tanda tanya ( ? )',
      'Tanda dolar ( $ )',
      'Tanda seru ( ! )'
    ],
    correctIndex: 0,
    explanation: 'Tanda pagar (#) digunakan untuk menulis catatan/komentar yang tidak akan diproses atau dijalankan oleh Python.'
  },
  {
    id: 6,
    category: 'konsep',
    categoryTitle: 'Pengertian Algoritma',
    question: 'Urutan langkah-langkah logis dan terstruktur untuk menyelesaikan suatu masalah disebut...',
    options: [
      'Algoritma',
      'Monitor',
      'Keyboard',
      'Mouse'
    ],
    correctIndex: 0,
    explanation: 'Algoritma adalah deretan langkah logis dan berurutan yang dibuat untuk memecahkan suatu masalah atau tugas.'
  },
  {
    id: 7,
    category: 'konsep',
    categoryTitle: 'Karakteristik Python',
    question: 'Mengapa bahasa pemrograman Python sangat disukai dan cocok dipelajari oleh pemula?',
    options: [
      'Bahasanya mudah dibaca dan mirip bahasa Inggris sederhana',
      'Harganya sangat mahal untuk dibeli',
      'Hanya boleh dipakai oleh profesor luar negeri',
      'Tidak bisa dijalankan di komputer biasa'
    ],
    correctIndex: 0,
    explanation: 'Python dirancang dengan tata bahasa (sintaks) yang bersih, sederhana, dan mudah dipahami seperti bahasa Inggris sehari-hari.'
  },

  // ==========================================
  // 2. FUNGSI PRINT() & OUTPUT (Sangat Mudah & Praktis)
  // ==========================================
  {
    id: 8,
    category: 'print',
    categoryTitle: 'Fungsi print()',
    question: 'Apa fungsi utama dari perintah print() dalam bahasa Python?',
    options: [
      'Menampilkan teks atau output hasil ke layar monitor',
      'Mencetak kertas pada mesin fotokopi',
      'Menghapus seluruh file di laptop',
      'Mematikan daya listrik komputer'
    ],
    correctIndex: 0,
    explanation: 'Fungsi print() bertugas mencetak atau menampilkan teks dan informasi ke layar konsol komputer.'
  },
  {
    id: 9,
    category: 'print',
    categoryTitle: 'Fungsi print()',
    question: 'Tanda baca apakah yang WAJIB mengapit teks kata/kalimat di dalam perintah print()?',
    codeSnippet: 'print("Halo Teman")',
    options: [
      'Tanda petik ("..." atau \'...\')',
      'Tanda pagar (#...#)',
      'Tanda persen (%...%)',
      'Tanda tanya (?...?)'
    ],
    correctIndex: 0,
    explanation: 'Setiap teks atau kalimat wajib dibungkus oleh tanda petik, baik tanda petik dua ("...") maupun petik satu (\'...\').'
  },
  {
    id: 10,
    category: 'print',
    categoryTitle: 'Fungsi print()',
    question: 'Tanda kurung jenis apakah yang digunakan pada perintah print() di Python?',
    codeSnippet: 'print(...)',
    options: [
      'Tanda kurung biasa: ( )',
      'Tanda kurung siku: [ ]',
      'Tanda kurung kurawal: { }',
      'Tanda sudut: < >'
    ],
    correctIndex: 0,
    explanation: 'Perintah pemanggilan fungsi di Python selalu menggunakan sepasang tanda kurung biasa ( ).'
  },
  {
    id: 11,
    category: 'print',
    categoryTitle: 'Fungsi print()',
    question: 'Perhatikan kode berikut: print("Selamat Pagi!"). Apa yang akan muncul di layar?',
    codeSnippet: 'print("Selamat Pagi!")',
    options: [
      'Selamat Pagi!',
      'Error tidak mau jalan',
      'Layar monitor menjadi gelap',
      'Suara sirine berbunyi'
    ],
    correctIndex: 0,
    explanation: 'Python akan menampilkan teks di dalam tanda petik dengan bersih ke layar: Selamat Pagi!.'
  },
  {
    id: 12,
    category: 'print',
    categoryTitle: 'Fungsi print()',
    question: 'Perhatikan kode penjumlahan ini: print(5 + 5). Berapakah hasil yang tampil di layar?',
    codeSnippet: 'print(5 + 5)',
    options: [
      '10',
      '55',
      '5 + 5',
      '0'
    ],
    correctIndex: 0,
    explanation: 'Karena angka 5 + 5 ditulis tanpa tanda petik, Python langsung menghitung hasil matematikanya yaitu 10.'
  },
  {
    id: 13,
    category: 'print',
    categoryTitle: 'Fungsi print()',
    question: 'Perhatikan kode pengurangan ini: print(10 - 3). Berapakah hasil yang tampil di layar?',
    codeSnippet: 'print(10 - 3)',
    options: [
      '7',
      '103',
      '13',
      'Error'
    ],
    correctIndex: 0,
    explanation: 'Python langsung menghitung operasi 10 dikurangi 3 sehingga menghasilkan output: 7.'
  },
  {
    id: 14,
    category: 'print',
    categoryTitle: 'Fungsi print()',
    question: 'Perhatikan kode perkalian ini: print(4 * 2). Berapakah hasil yang tampil di layar?',
    codeSnippet: 'print(4 * 2)',
    options: [
      '8',
      '42',
      '6',
      '2'
    ],
    correctIndex: 0,
    explanation: 'Tanda bintang (*) adalah lambang perkalian di Python. 4 dikali 2 adalah 8.'
  },
  {
    id: 15,
    category: 'print',
    categoryTitle: 'Fungsi print()',
    question: 'Jika angka dibungkus tanda petik seperti print("10 + 5"), apa yang tercetak di layar?',
    codeSnippet: 'print("10 + 5")',
    options: [
      '10 + 5 (tercetak sebagai teks persis apa adanya)',
      '15',
      '50',
      'Error'
    ],
    correctIndex: 0,
    explanation: 'Karena diapit tanda petik, Python menganggapnya sebagai teks biasa sehingga dicetak persis apa adanya: 10 + 5.'
  },
  {
    id: 16,
    category: 'print',
    categoryTitle: 'Fungsi print()',
    question: 'Apakah kita boleh mencetak angka langsung tanpa tanda petik, misalnya print(100)?',
    codeSnippet: 'print(100)',
    options: [
      'Boleh, angka 100 langsung tercetak ke layar',
      'Tidak boleh, harus pakai tanda pagar',
      'Komputer akan langsung restart',
      'Layar laptop akan rusak'
    ],
    correctIndex: 0,
    explanation: 'Angka bulat maupun desimal boleh langsung dicetak tanpa tanda kutip oleh fungsi print().'
  },

  // ==========================================
  // 3. TIPE DATA TEKS: STRING (str)
  // ==========================================
  {
    id: 17,
    category: 'tipe_data',
    categoryTitle: 'Tipe Data String',
    question: 'Apa nama tipe data di Python yang khusus digunakan untuk menyimpan teks kata atau kalimat?',
    options: [
      'String (str)',
      'Integer (int)',
      'Float (float)',
      'Boolean (bool)'
    ],
    correctIndex: 0,
    explanation: 'String (str) adalah jenis tipe data untuk teks/huruf/kalimat yang diapit oleh tanda petik.'
  },
  {
    id: 18,
    category: 'tipe_data',
    categoryTitle: 'Tipe Data String',
    question: 'Manakah di bawah ini yang merupakan contoh nilai bertipe data String (str)?',
    options: [
      '"Indonesia"',
      '2026',
      '3.14',
      'True'
    ],
    correctIndex: 0,
    explanation: '"Indonesia" memiliki tanda petik, sehingga merupakan tipe data String.'
  },
  {
    id: 19,
    category: 'tipe_data',
    categoryTitle: 'Tipe Data String',
    question: 'Ciri khas utama dari nilai bertipe data String di Python adalah selalu diapit oleh...',
    options: [
      'Tanda petik ("..." atau \'...\')',
      'Tanda tambah (+...+)',
      'Tanda kurang (-...-)',
      'Tanda seru (!...!)'
    ],
    correctIndex: 0,
    explanation: 'Nilai String selalu dibungkus tanda petik satu atau petik dua.'
  },
  {
    id: 20,
    category: 'tipe_data',
    categoryTitle: 'Tipe Data String',
    question: 'Perhatikan kode berikut: kota = "Jakarta". Apa tipe data dari variabel kota?',
    codeSnippet: 'kota = "Jakarta"',
    options: [
      'String (str)',
      'Integer (int)',
      'Float (float)',
      'Boolean (bool)'
    ],
    correctIndex: 0,
    explanation: 'Karena nilai "Jakarta" diapit tanda kutip, maka tipenya adalah String (str).'
  },
  {
    id: 21,
    category: 'tipe_data',
    categoryTitle: 'Tipe Data String',
    question: 'Jika angka dibungkus tanda petik seperti nomor = "99", apa tipe datanya?',
    codeSnippet: 'nomor = "99"',
    options: [
      'String (str), karena ada tanda petiknya',
      'Integer (int)',
      'Float (float)',
      'Boolean (bool)'
    ],
    correctIndex: 0,
    explanation: 'Semua karakter apapun yang diapit tanda petik otomatis menjadi tipe data String (str).'
  },

  // ==========================================
  // 4. TIPE DATA ANGKA BULAT: INTEGER (int)
  // ==========================================
  {
    id: 22,
    category: 'tipe_data',
    categoryTitle: 'Tipe Data Integer',
    question: 'Tipe data untuk menyimpan angka BILANGAN BULAT (tanpa koma desimal) disebut...',
    options: [
      'Integer (int)',
      'String (str)',
      'Float (float)',
      'Boolean (bool)'
    ],
    correctIndex: 0,
    explanation: 'Integer (disingkat int) adalah tipe data untuk angka bilangan bulat, seperti 1, 5, 20, 100.'
  },
  {
    id: 23,
    category: 'tipe_data',
    categoryTitle: 'Tipe Data Integer',
    question: 'Manakah di bawah ini yang merupakan contoh bilangan Integer (bilangan bulat)?',
    options: [
      '25',
      '"25"',
      '25.5',
      'False'
    ],
    correctIndex: 0,
    explanation: 'Angka 25 tanpa tanda petik dan tanpa koma desimal adalah bilangan bulat bertipe Integer.'
  },
  {
    id: 24,
    category: 'tipe_data',
    categoryTitle: 'Tipe Data Integer',
    question: 'Perhatikan kode berikut: umur = 16. Apa tipe data dari variabel umur?',
    codeSnippet: 'umur = 16',
    options: [
      'Integer (int)',
      'String (str)',
      'Float (float)',
      'Boolean (bool)'
    ],
    correctIndex: 0,
    explanation: 'Angka 16 adalah bilangan bulat tanpa pecahan sehingga bertipe data Integer (int).'
  },
  {
    id: 25,
    category: 'tipe_data',
    categoryTitle: 'Tipe Data Integer',
    question: 'Apakah bilangan negatif seperti -10 termasuk ke dalam tipe data Integer (int)?',
    options: [
      'Ya, bilangan bulat negatif termasuk Integer',
      'Tidak, Integer hanya boleh angka 0',
      'Bukan, itu teks',
      'Hanya boleh pecahan'
    ],
    correctIndex: 0,
    explanation: 'Integer mencakup semua bilangan bulat: baik positif (10), nol (0), maupun negatif (-10).'
  },
  {
    id: 26,
    category: 'tipe_data',
    categoryTitle: 'Tipe Data Integer',
    question: 'Pada kode: pensil = 5, angka 5 tidak memakai tanda petik sehingga bertipe data...',
    codeSnippet: 'pensil = 5',
    options: [
      'Integer (int)',
      'String (str)',
      'Float (float)',
      'Boolean (bool)'
    ],
    correctIndex: 0,
    explanation: 'Angka 5 adalah bilangan bulat murni sehingga bertipe data Integer (int).'
  },

  // ==========================================
  // 5. TIPE DATA DESIMAL: FLOAT (float)
  // ==========================================
  {
    id: 27,
    category: 'tipe_data',
    categoryTitle: 'Tipe Data Float',
    question: 'Tipe data untuk menyimpan angka DESIMAL atau pecahan (berkoma titik) disebut...',
    options: [
      'Float (float)',
      'Integer (int)',
      'String (str)',
      'Boolean (bool)'
    ],
    correctIndex: 0,
    explanation: 'Float adalah tipe data untuk angka desimal atau pecahan yang memiliki tanda titik pemisah.'
  },
  {
    id: 28,
    category: 'tipe_data',
    categoryTitle: 'Tipe Data Float',
    question: 'Manakah di bawah ini yang merupakan contoh nilai bertipe data Float (desimal)?',
    options: [
      '3.14',
      '100',
      '"3.14"',
      'True'
    ],
    correctIndex: 0,
    explanation: 'Angka 3.14 memiliki tanda titik desimal sehingga bertipe data Float.'
  },
  {
    id: 29,
    category: 'tipe_data',
    categoryTitle: 'Tipe Data Float',
    question: 'Perhatikan kode berikut: tinggi = 168.5. Apa tipe data dari variabel tinggi?',
    codeSnippet: 'tinggi = 168.5',
    options: [
      'Float (float)',
      'Integer (int)',
      'String (str)',
      'Boolean (bool)'
    ],
    correctIndex: 0,
    explanation: 'Nilai 168.5 mengandung pecahan desimal dengan titik sehingga bertipe data Float.'
  },
  {
    id: 30,
    category: 'tipe_data',
    categoryTitle: 'Tipe Data Float',
    question: 'Tanda baca apa yang digunakan di Python sebagai pemisah angka desimal (pecahan)?',
    options: [
      'Tanda titik ( . ), contoh: 7.5',
      'Tanda koma ( , ), contoh: 7,5',
      'Tanda titik dua ( : ), contoh: 7:5',
      'Tanda garis miring ( / ), contoh: 7/5'
    ],
    correctIndex: 0,
    explanation: 'Dalam bahasa pemrograman internasional seperti Python, pemisah desimal menggunakan tanda titik (.), bukan koma.'
  },
  {
    id: 31,
    category: 'tipe_data',
    categoryTitle: 'Tipe Data Float',
    question: 'Manakah nilai di bawah ini yang termasuk angka desimal (Float)?',
    options: [
      '0.5',
      '50',
      '"0.5"',
      'False'
    ],
    correctIndex: 0,
    explanation: 'Angka 0.5 memiliki pecahan desimal tanpa tanda petik, sehingga bertipe data Float.'
  },

  // ==========================================
  // 6. TIPE DATA BOOLEAN: LOGIKA (bool)
  // ==========================================
  {
    id: 32,
    category: 'tipe_data',
    categoryTitle: 'Tipe Data Boolean',
    question: 'Tipe data Boolean (bool) dalam Python hanya memiliki DUA kemungkinan nilai, yaitu...',
    options: [
      'True dan False',
      'Yes dan No',
      '1 dan 2',
      'Hitam dan Putih'
    ],
    correctIndex: 0,
    explanation: 'Boolean hanya bernilai True (Benar) atau False (Salah).'
  },
  {
    id: 33,
    category: 'tipe_data',
    categoryTitle: 'Tipe Data Boolean',
    question: 'Apa arti dari nilai Boolean "True" dalam bahasa Indonesia?',
    options: [
      'Benar / Ya',
      'Salah / Tidak',
      'Kosong',
      'Batal'
    ],
    correctIndex: 0,
    explanation: 'True memiliki arti Benar / Ya dalam logika pemrograman.'
  },
  {
    id: 34,
    category: 'tipe_data',
    categoryTitle: 'Tipe Data Boolean',
    question: 'Apa arti dari nilai Boolean "False" dalam bahasa Indonesia?',
    options: [
      'Salah / Tidak',
      'Benar / Ya',
      'Juara',
      'Lanjut'
    ],
    correctIndex: 0,
    explanation: 'False memiliki arti Salah / Tidak dalam logika pemrograman.'
  },
  {
    id: 35,
    category: 'tipe_data',
    categoryTitle: 'Tipe Data Boolean',
    question: 'Perhatikan kode berikut: lulus = True. Apa tipe data dari variabel lulus?',
    codeSnippet: 'lulus = True',
    options: [
      'Boolean (bool)',
      'String (str)',
      'Integer (int)',
      'Float (float)'
    ],
    correctIndex: 0,
    explanation: 'True adalah salah satu nilai dari tipe data logika Boolean (bool).'
  },
  {
    id: 36,
    category: 'tipe_data',
    categoryTitle: 'Tipe Data Boolean',
    question: 'Perhatikan kode berikut: menyala = False. Apa tipe data dari variabel menyala?',
    codeSnippet: 'menyala = False',
    options: [
      'Boolean (bool)',
      'String (str)',
      'Integer (int)',
      'Float (float)'
    ],
    correctIndex: 0,
    explanation: 'False adalah nilai dari tipe data logika Boolean (bool).'
  },
  {
    id: 37,
    category: 'tipe_data',
    categoryTitle: 'Mengecek Tipe Data',
    question: 'Perintah bawaan Python apa yang dapat digunakan untuk mengetahui tipe data suatu nilai?',
    codeSnippet: 'print(type(10))',
    options: [
      'type()',
      'cek()',
      'tahu()',
      'lihat()'
    ],
    correctIndex: 0,
    explanation: 'Fungsi type() digunakan untuk memeriksa dan mengetahui jenis tipe data dari suatu nilai atau variabel.'
  }
];
