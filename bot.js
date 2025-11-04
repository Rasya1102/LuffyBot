const pertanyaan = document.getElementById("pertanyaan");
const jawaban = document.getElementById("jawaban");
const chatBody = document.getElementById("chat-body");

// ============== GAME MODE SYSTEM  ============== //

let gameState = "none"; // none | menu | angka | kata | harta | math | gk | code
let randomNumber;
let randomWord;
let chances;

// state tambahan
let numberMode = "medium"; // easy|medium|hard
let wordList; // diisi ulang saat start
let currentClue;

let treasure = { row: 0, col: 0 };
let cave = { size: 0, mode: "mudah" }; // mudah|normal|susah
let caveChances = 0;

let quiz = {
    type: "", // math|gk|code
    mode: "", // easy/medium/hard untuk math & gk; pemula|sesepuh untuk code
    lang: "", // cpp|python|js (untuk code)
    list: [], // daftar pertanyaan {q, a, meta?}
    index: 0,
    total: 0,
    score: 0,
};

// ======= Tampilin pesan bubble ======= //
function addMessage(text, sender) {
    const messageDiv = document.createElement("div");
    messageDiv.classList.add("message", sender);
    messageDiv.innerHTML = `<p>${text.replace(/\n/g, "<br>")}</p>`;
    chatBody.appendChild(messageDiv);
    chatBody.scrollTop = chatBody.scrollHeight;
}

// ======= Mulai Program ======= //
function startApp() {
    addMessage(" Halo! Aku adalah Monkey D Luffy karakter yang Arraz sukai di anime kamu bisa panggil aku LuffyBot. Salam kenal yah", "bot");
    addMessage(" Aku chatbot mini-game yang dibuat untuk , interaksi, dan hiburan sederhana.", "bot");
    addMessage(" Di sini kamu bisa bermain game seperti tebak angka dan tebak kata.", "bot");
    addMessage(" Ketik | main game | untuk mulai bermain!", "bot");
}
startApp();

// simpan versi asli (sekarang kosong tapi untuk jaga2)
const botStartOriginal = function(){};

// ======= MAIN ENTER ========= //
function botStart() {
  const userInput = jawaban.value.trim().toLowerCase();
  if (!userInput) return;

  addMessage(userInput, "user");
  jawaban.value = "";

  // buka menu game
  if (userInput === "main game" && gameState === "none") {
    showGameMenu();
    return;
  }

  if (gameState === "menu") {
    if (userInput === "1") { startNumberGameMenu(); return; }
    if (userInput === "2") { startWordGame(); return; }
    if (userInput === "3") { startTreasureMenu(); return; }
    if (userInput === "4") { startMathQuizMenu(); return; }
    if (userInput === "5") { startGKQuizMenu(); return; }
    if (userInput === "6") { startCodeQuizMenu(); return; }
    addMessage("❗ Pilih 1 / 2 / 3 / 4 / 5 / 6 ya", "bot");
    return;
  }

  // sub-menu pemilihan mode/rincian
  if (gameState === "angka-mode") {
    handleNumberModeInput(userInput);
    return;
  }

  if (gameState === "harta-mode") {
    handleTreasureModeInput(userInput);
    return;
  }

  if (gameState === "math-mode") {
    handleMathModeInput(userInput);
    return;
  }

  if (gameState === "gk-mode") {
    handleGKModeInput(userInput);
    return;
  }

  if (gameState === "code-mode-lang") {
    handleCodeLangInput(userInput);
    return;
  }

  if (gameState === "code-mode-level") {
    handleCodeLevelInput(userInput);
    return;
  }

  // handler gameplay
  if (gameState === "angka") {
    checkNumberGuess(parseInt(userInput));
    return;
  }

  if (gameState === "kata") {
    checkWordGuess(userInput);
    return;
  }

  if (gameState === "harta") {
    handleTreasureGuess(userInput);
    return;
  }

  if (gameState === "math" || gameState === "gk" || gameState === "code") {
    handleQuizAnswer(userInput);
    return;
  }

      if (gameState === "math" || gameState === "gk" || gameState === "code") {
    handleQuizAnswer(userInput);
    return;
  }

  // ===== COMMAND FAQ ===== //
  if (userInput === "faq" && gameState === "none") {
    addMessage(
`📌 FAQ BOT

    Siapa kamu?
Aku LuffyBot, chatbot mini-game yang dibuat buat nemenin kamu 😎☠️

👨  Siapa pembuatmu?
Dibuat oleh  Rasya Aditya Arraz, calon programmer pro 💪🔥

🎮 Cara main?
Ketik | main game | → pilih mode → main 🎯

🕹️ Game yang tersedia:
- Tebak angka
- Tebak kata
- Cari harta karun
- Quiz matematika
- Quiz pengetahuan umum
- Quiz coding (C++/Python/JS)

        Apa motivasimu? membuat web seperti ini?
        karna saya ingin membuat chatbot yang dapat menghibur dan menemani pengguna dengan berbagai mini-game seru yang bisa dimainkan kapan saja, dan dimana saja.
        alasan lainnya juga karna saya ingin merealisasikan ide saya tentang chatbot interaktif yang menyenangkan yang sudah saya janjikan kepada seseorang yang begitu spesial buat sya 😉
        💜  Nur Madaniyah 

✨ Tips:
Kalo bingung ketik | main game | 👌`,
    "bot"
    );
    return;
  }

    if (userInput === "contact" && gameState === "none") {
        addMessage(
        `📞 Contact Pembuat Bot`
        +`\n\nKalau kamu mau kasih saran, kritik, atau sekedar ngobrol, kamu bisa hubungi aku di:
        No WA/Telegram: +62 821-1494-3075
        Email:Rassyamana@gmail.com
        LinkedIn: https://www.linkedin.com/in/rassya-mana-08875a394/
        GitHub: https://github.com/Rasya1102
        ig: https://www.instagram.com/2n_rssya/`
        , "bot"
        );
        return;
    }
  // perintah lain
  addMessage("Ketik: main game 🎮 untuk mulai bermain!", "bot");
}


// ======= MENU GAME ======== //
function showGameMenu() {
  gameState = "menu";
  addMessage(
`🎮 Pilih game:
1️⃣ Tebak Angka (punya mode)
2️⃣ Tebak Kata (list kata diperbanyak)
3️⃣ Tebak Harta Karun di Goa
4️⃣ Quiz Matematika
5️⃣ Quiz Pengetahuan Umum
6️⃣ Quiz Coding (C++ / Python / JS)

Ketik angka untuk memilih.`,
    "bot"
  );
}

// ============================================================
// =============== TEBAK ANGKA (dengan mode) ==================
// ============================================================

function startNumberGameMenu() {
  gameState = "angka-mode";
  addMessage(
`Pilih mode Tebak Angka:
- mudah
- medium 
- susah

Ketik: mudah / medium / susah`,
    "bot"
  );
}
function handleNumberModeInput(input) {
  if (!["mudah","medium","susah"].includes(input)) {
    addMessage("Ketik: mudah / medium / susah", "bot");
    return;
  }
  numberMode = input;
  startNumberGame();
}

function startNumberGame() {
  gameState = "angka";
  chances = 4;

  let max = 30;
  if (numberMode === "mudah") max = 20;
  if (numberMode === "susah") max = 50;

  randomNumber = Math.floor(Math.random() * max) + 1;

  addMessage(`🔢 Game Tebak Angka (${numberMode.toUpperCase()}) dimulai!\nTebak angka 1 - ${max}\n(❤️ Kesempatan: ${chances})`, "bot");
}

function checkNumberGuess(num) {
  if (isNaN(num)) {
    addMessage("💡 Masukkan angka ya", "bot");
    return;
  }

  if (num === randomNumber) {
    addMessage(`✅ Betul! Angkanya ${randomNumber}`, "bot");
    endGame();
    return;
  }

  chances--;
  addMessage(num > randomNumber ? "⬇️ Terlalu tinggi" : "⬆️ Terlalu rendah", "bot");

  if (chances <= 0) {
    addMessage(`❌ Habis! Angka: ${randomNumber}`, "bot");
    endGame();
  } else {
    addMessage(`❤️ Sisa kesempatan: ${chances}`, "bot");
  }
}

// ============================================================
// =================== TEBAK KATA (diperbanyak) ===============
// ============================================================

function startWordGame() {
  gameState = "kata";
  chances = 5;

  // Perbanyak kata (campuran teknologi, hewan, tempat, benda umum)
  wordList = [
    {word: "robot", clue: "Teknologi"},
    {word: "kucing", clue: "Hewan peliharaan"},
    {word: "jakarta", clue: "Ibukota Indonesia"},
    {word: "kopi", clue: "Minuman populer"},
    {word: "sekolah", clue: "Tempat pendidikan"},
    {word: "programmer", clue: "Pekerjaan di dunia IT"},
    {word: "internet", clue: "Digunakan untuk browsing"},
    {word: "pisang", clue: "Buah berwarna kuning"},
    {word: "wisuda", clue: "Acara kelulusan"},
    {word: "gitar", clue: "Alat musik senar"},
    {word: "layang", clue: "Mainan yang terbang"},
    {word: "ninja", clue: "Tokoh Jepang yang misterius"},
    {word: "youtube", clue: "Platform video"},
    {word: "panda", clue: "Hewan asal China"},
    {word: "sepeda", clue: "Kendaraan tanpa mesin"},
    {word: "sate", clue: "Makanan Indonesia"},
    {word: "android", clue: "Sistem operasi HP"},
    {word: "kompas", clue: "Penunjuk arah"},
    {word: "kamera", clue: "Untuk memotret"},
    {word: "anggrek", clue: "Bunga hias populer"},
    {word: "serigala", clue: "Hewan liar berkelompok"},
    {word: "awan", clue: "Mengambang di langit"},
    {word: "pelangi", clue: "Muncul setelah hujan"},
    {word: "pantai", clue: "Bertemu laut dan pasir"},
    {word: "gunung", clue: "Tinggi menjulang"},
    {word: "kereta", clue: "Moda transportasi rel"},
    {word: "bandara", clue: "Tempat pesawat"},
    {word: "paspor", clue: "Dokumen perjalanan"},
    {word: "perpustakaan", clue: "Tempat buku"},
    {word: "monitor", clue: "Layar komputer"},
    {word: "keyboard", clue: "Alat mengetik"},
    {word: "mouse", clue: "Penunjuk di layar"},
    {word: "javascript", clue: "Bahasa pemrograman web"},
    {word: "python", clue: "Bahasa pemrograman populer"},
    {word: "compiler", clue: "Mengubah kode ke biner"},
    {word: "debug", clue: "Mencari bug"},
    {word: "memori", clue: "Tempat data disimpan sementara"},
    {word: "ssd", clue: "Media penyimpanan cepat"},
    {word: "router", clue: "Pengarah paket jaringan"},
    {word: "modem", clue: "Perangkat internet"},
    {word: "biologi", clue: "Ilmu kehidupan"},
    {word: "geografi", clue: "Ilmu bumi"},
    {word: "sejarah", clue: "Peristiwa masa lalu"},
    {word: "sosiologi", clue: "Ilmu masyarakat"},
    {word: "ekonomi", clue: "Ilmu sumber daya"},
    {word: "akuntansi", clue: "Pencatatan keuangan"},
    {word: "matematika", clue: "Ilmu bilangan"},
    {word: "fisika", clue: "Ilmu alam"},
    {word: "kimia", clue: "Ilmu zat"},
    {word: "tornado", clue: "Angin berputar kencang"},
    {word: "tsunami", clue: "Gelombang besar"},
    {word: "gempa", clue: "Getaran bumi"},
    {word: "vulkanik", clue: "Terkait gunung api"},
    {word: "saturnus", clue: "Planet bercincin"},
    {word: "merkurius", clue: "Planet terdekat matahari"},
    {word: "neptunus", clue: "Planet biru"},
    {word: "uranus", clue: "Planet bercincin miring"},
    {word: "venus", clue: "Bintang fajar"},
    {word: "mars", clue: "Planet merah"},
    {word: "jupiter", clue: "Planet terbesar"},
    {word: "plutonium", clue: "Unsur radioaktif"},
    {word: "oksigen", clue: "Gas untuk bernafas"},
    {word: "hidrogen", clue: "Unsur paling ringan"},
    {word: "nitrogen", clue: "Gas terbanyak di udara"},
  ];

  const r = wordList[Math.floor(Math.random() * wordList.length)];
  randomWord = r.word;
  currentClue = r.clue;

  addMessage(`🧠 Game Tebak Kata!
Clue: ${currentClue}
Huruf: ${randomWord.length}
(❤️ Kesempatan: ${chances})`, "bot");
}

function checkWordGuess(word) {
  if (word === randomWord) {
    addMessage(`✅ Benar! Kata: ${randomWord}`, "bot");
    endGame();
    return;
  }

  chances--;
  addMessage("❌ Salah terus nih 😆", "bot");

  if (chances <= 0) {
    addMessage(`☠️ Kesempatan habis! Kata: ${randomWord}`, "bot");
    endGame();
  } else {
    addMessage(`❤️ Sisa: ${chances}`, "bot");
    addMessage(`Clue: ${currentClue}`, "bot");
  }
}

// ============================================================
// ================== TEBAK HARTA KARUN DI GOA =================
// ============================================================

function startTreasureMenu() {
  gameState = "harta-mode";
  addMessage(
`🏴‍☠️ Tebak Harta Karun di Alam Goa
Pilih mode:
- mudah 
- normal 
- susah  

Ketik: mudah / normal / susah`,
    "bot"
  );
}

function handleTreasureModeInput(input) {
  if (!["mudah","normal","susah"].includes(input)) {
    addMessage("Ketik: mudah / normal / susah", "bot");
    return;
  }
  cave.mode = input;
  cave.size = (input === "mudah") ? 3 : (input === "normal" ? 4 : 5);
  caveChances = (input === "mudah") ? 5 : 3;

  treasure.row = Math.floor(Math.random() * cave.size);
  treasure.col = Math.floor(Math.random() * cave.size);

  gameState = "harta";
  addMessage(renderCaveHelp(), "bot");
  addMessage(`🎯 Masukkan tebakan posisi, contoh: A1, B3, C2 (baris huruf, kolom angka)`, "bot");
}

function renderCaveHelp() {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".slice(0, cave.size);
  let header = "   ";
  for (let c = 1; c <= cave.size; c++) header += c + " ";
  let rows = [header];
  for (let r = 0; r < cave.size; r++) {
    rows.push(letters[r] + "  " + Array(cave.size).fill("⬜").join(" "));
  }
  return `🕳️ GOA ${cave.size}x${cave.size} (Mode: ${cave.mode.toUpperCase()}, ❤️=${caveChances})\n${rows.join("\n")}`;
}

function handleTreasureGuess(raw) {
  const input = raw.toUpperCase().replace(/\s+/g, "");
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".slice(0, cave.size);

  const match = input.match(/^([A-Z])(\d+)$/);
  if (!match) {
    addMessage("Format salah. Contoh benar: A1, B3, C2", "bot");
    return;
  }
  const r = letters.indexOf(match[1]);
  const c = parseInt(match[2], 10) - 1;

  if (r < 0 || r >= cave.size || c < 0 || c >= cave.size) {
    addMessage("Keluar dari peta goa. Coba lagi ya!", "bot");
    return;
  }

  if (r === treasure.row && c === treasure.col) {
    addMessage(`💎 DAPET! Harta karun ditemukan di ${match[1]}${c+1}!`, "bot");
    endGame();
    return;
  }

  caveChances--;
  const dist = Math.abs(r - treasure.row) + Math.abs(c - treasure.col);
  let hint = "dingin ❄️";
  if (dist <= 1) hint = "panas 🔥";
  else if (dist === 2) hint = "hangat ♨️";
  addMessage(`❌ Belum ketemu. Petunjuk: ${hint}. (Manhattan distance: ${dist})`, "bot");

  if (caveChances <= 0) {
    const rowLetter = letters[treasure.row];
    addMessage(`☠️ Kesempatan habis! Letaknya di ${rowLetter}${treasure.col+1}`, "bot");
    endGame();
} else {
    addMessage(`❤️ Sisa: ${caveChances}`, "bot"); 
  }
}

// ============================================================
// ===================== QUIZ MATEMATIKA ======================
// ============================================================

// Generator 200+ soal matematika beragam
function generateMathPool() {
  const ops = [
    { sym: "+", f:(a,b)=>a+b, name:"tambah" },
    { sym: "-", f:(a,b)=>a-b, name:"kurang" },
    { sym: "×", f:(a,b)=>a*b, name:"kali" },
    { sym: "÷", f:(a,b)=>Math.floor(a/b), name:"bagi bulat", safe:true },
  ];
  const pool = [];
  // variasi bilangan kecil-menengah
  for (let i=0;i<120;i++){
    const a = randInt(5,99);
    const b = randInt(2,49);
    const op = ops[randInt(0,ops.length-1)];
    if (op.sym==="÷") {
      // bikin divisible
      const res = randInt(2,12);
      const x = b*res;
      pool.push({q:`${x} ÷ ${b} = ?`, a:String(res)});
    } else {
      pool.push({q:`${a} ${op.sym} ${b} = ?`, a:String(op.f(a,b))});
    }
  }
  // pangkat & akar sederhana
  for (let i=0;i<40;i++){
    const base = randInt(2,12);
    const p = randInt(2,3);
    pool.push({q:`${base}^${p} = ?`, a:String(base**p)});
  }
  for (let i=0;i<20;i++){
    const s = [4,9,16,25,36,49,64,81,100,121,144][randInt(0,10)];
    pool.push({q:`√${s} = ? (akar bulat)`, a:String(Math.floor(Math.sqrt(s)))});
  }
  // persentase sederhana
  for (let i=0;i<40;i++){
    const total = randInt(50,500);
    const pct = [5,10,12,15,20,25,30,40,50][randInt(0,8)];
    const ans = Math.round(total*pct/100);
    pool.push({q:`${pct}% dari ${total} = ?`, a:String(ans)});
  }
  // total minimal 220
  return shuffle(pool).slice(0, 220);
}

function startMathQuizMenu() {
  gameState = "math-mode";
  addMessage(
`🧮 Quiz Matematika
Pilih mode & jumlah soal:
- mudah 
- medium 
- susah 

Ketik: mudah / medium / susah`,
    "bot"
  );
}

function handleMathModeInput(input) {
  if (!["mudah","medium","susah"].includes(input)) {
    addMessage("Ketik: mudah / medium / susah", "bot");
    return;
  }
  const count = (input==="mudah")?10:(input==="medium")?20:40;
  quiz.type = "math";
  quiz.mode = input;
  quiz.list = generateMathPool();
  quiz.total = count;
  quiz.index = 0;
  quiz.score = 0;
  gameState = "math";
  addMessage(`Mulai Quiz Matematika (${input.toUpperCase()}) — total ${count} soal.\nKetik jawaban angka.`, "bot");
  askNextQuiz();
}

// ============================================================
// ================== QUIZ PENGETAHUAN UMUM ===================
// ============================================================

// Dataset dasar + generator variasi agar ≥200
function baseGKFacts() {
  const pairs = [
    ["Ibukota Indonesia?","jakarta"],
    ["Mata uang Jepang?","yen"],
    ["Benua terbesar di dunia?","asia"],
    ["Planet terbesar di tata surya?","jupiter"],
    ["Gunung tertinggi di dunia?","everest"],
    ["Bendera merah putih milik negara?","indonesia"],
    ["Penemu bola lampu?","thomas edison"],
    ["Lambang kimia air?","h2o"],
    ["Satwa khas Australia berkantong?","kanguru"],
    ["Samudra terbesar?","pasifik"],
    ["Bahasa resmi Brazil?","portugis"],
    ["Negara piramida giza?","mesir"],
    ["Vitamin untuk penglihatan?","vitamin a"],
    ["Ibukota Inggris?","london"],
    ["Alat ukur suhu?","termometer"],
    ["Negara dengan Taj Mahal?","india"],
    ["Benua terkecil?","australia"],
    ["Tahun proklamasi RI?","1945"],
    ["Presiden pertama RI?","soekarno"],
    ["Rumus luas lingkaran (pakai π, r)?","πr^2"],
    ["Gas terbanyak di atmosfer Bumi?","nitrogen"],
    ["Bahasa resmi Spanyol?","spanyol"],
    ["Ibukota Prancis?","paris"],
    ["Laut mati terletak di kawasan?","timur tengah"],
    ["Negara dengan menara eiffel?","prancis"],
    ["Ikan terbesar di dunia?","hiu paus"],
    ["Logam cair pada suhu ruang?","raksa"],
    ["Benua dengan gurun sahara?","afrika"],
    ["Organ pemompa darah?","jantung"],
    ["Candi Borobudur ada di provinsi?","jawa tengah"],
    ["Pulau dewata?","bali"],
    ["Seni bela diri dari Jepang dengan pedang bambu?","kendo"],
    ["Bahasa resmi Cina?","mandarin"],
    ["Ibukota Korea Selatan?","seoul"],
    ["Planet terdekat Matahari?","merkurius"],
    ["Ibukota Turki (modern)?","ankara"],
    ["Negara kiwifruit terkenal?","selandia baru"],
    ["Bendera daun maple?","kanada"],
    ["Tahun Sumpah Pemuda?","1928"],
    ["Alat untuk melihat benda sangat kecil?","mikroskop"],
    ["Proses tumbuhan membuat makanan?","fotosintesis"],
    ["Alat musik khas Minang dari logam?","talempong"],
    ["Mata uang Korea Selatan?","won"],
    ["Ibukota Rusia?","moskow"],
    ["Gunung aktif terkenal di Jawa Timur?","bromo"],
    ["Danau terbesar di Indonesia?","toba"],
    ["Lambang kimia natrium?","na"],
    ["Bapak koperasi Indonesia?","buharto? salah"], // akan diganti valid di bawah
  ];
  // Perbaiki item yang salah
  pairs[pairs.length-1] = ["Bapak Koperasi Indonesia?","moh hatta"];

  return pairs.map(([q,a])=>({q,a}));
}

// tambah variasi: negara-ibukota, hewan, sains singkat, olahraga
function generateGKPool() {
  const base = baseGKFacts();

  const capitals = [
    ["jepang","tokyo"],["cina","beijing"],["italia","roma"],["jerman","berlin"],
    ["belanda","amsterdam"],["spanyol","madrid"],["portugal","lisbon"],
    ["thailand","bangkok"],["malaysia","kuala lumpur"],["singapura","singapura"],
    ["filipina","manila"],["vietnam","hanoi"],["laos","vientiane"],["kamboja","phnom penh"],
    ["brunei","bandar seri begawan"],["australia","canberra"],["amerika serikat","washington dc"],
    ["kanada","ottawa"],["mexico","mexico city"],["argentina","buenos aires"],
    ["chile","santiago"],["peru","lima"],["kolombia","bogota"],["ukraina","kyiv"],
    ["polandia","warsawa"],["swedia","stockholm"],["norwegia","oslo"],["finlandia","helsinki"],
    ["denmark","copenhagen"],["swiss","bern"],["austria","wina"],["yunani","athena"],
    ["turki","ankara"],["arab saudi","riyadh"],["uea","abu dhabi"],["qatar","doha"],
    ["iran","teheran"],["irak","baghdad"],["pakistan","islamabad"],["bangladesh","dhaka"]
  ].map(([c,cap])=>({q:`Ibukota ${c}?`, a:cap}));

  const animals = [
    ["hewan tercepat di darat","cheetah"],["mamalia terbesar","paus biru"],
    ["hewan hitam putih bambu","panda"],["burung tak bisa terbang australia","emu"],
    ["hewan berparuh bebek mamalia","platipus"],["hewan bergaris di afrika","zebra"],
    ["king of jungle?","singa"],["serangga menghasilkan madu","lebah"],
    ["binatang bertanduk besar di padang rumput","kerbau"],["hewan bertaji jago berkokok","ayam jantan"]
  ].map(([q,a])=>({q,a}));

  const science = [
    ["Planet merah?","mars"],["Alat ukur arus listrik?","amperemeter"],
    ["Satuan gaya?","newton"],["Kecepatan cahaya (≈ km/det)?","300000"],
    ["Bilangan prima terkecil?","2"],["Titik didih air (°C)?","100"],
    ["Titik beku air (°C)?","0"],["Gas untuk nafkah ikan di air?","oksigen"],
    ["Indra penciuman manusia?","hidung"],["Jumlah warna pelangi?","7"]
  ].map(([q,a])=>({q,a}));

  const sports = [
    ["Jumlah pemain sepak bola per tim di lapangan?","11"],
    ["Olahraga dengan raket dan shuttlecock?","bulu tangkis"],
    ["Skor sempurna bowling?","300"],
    ["Lapangan dengan ring?","bola basket"],
    ["Tennis grand slam di Inggris?","wimbledon"],
  ].map(([q,a])=>({q,a}));

  // Variasi phrasing untuk capital agar memperbanyak pool
  const capitalVariants = [];
  capitals.forEach(it=>{
    capitalVariants.push(it);
    capitalVariants.push({q:`Apa ibukota dari negara ${it.q.split(" ")[1] ? it.q.replace("Ibukota ","") : it.q.replace("Ibukota ","")}?`, a: it.a});
  });

  // gabung semua lalu tambah dummy-variasi (susun ulang pertanyaan)
  let pool = [...base, ...capitals, ...animals, ...science, ...sports, ...capitalVariants];

  // tambah 100 soal fakta pendek (template tahun & angka umum)
  for (let i=0;i<60;i++){
    const year = randInt(1900,2020);
    pool.push({q:`Berapa tahun dalam 1 abad?`, a:"100"});
    pool.push({q:`Apakah ${year} tahun kabisat? (ya/tidak)`, a: (isLeap(year)?"ya":"tidak")});
  }

  // pastikan ≥200
  pool = shuffle(pool).slice(0, 260);
  return pool;
}

function startGKQuizMenu() {
  gameState = "gk-mode";
  addMessage(
`🌍 Quiz Pengetahuan Umum
Mode & jumlah:
- mudah  
- medium 
- susah  

Ketik: mudah / medium / susah`,
    "bot"
  );
}

function handleGKModeInput(input) {
  if (!["mudah","medium","susah"].includes(input)) {
    addMessage("Ketik: mudah / medium / susah", "bot");
    return;
  }
  const count = (input==="mudah")?20:(input==="medium")?30:40;
  quiz.type = "gk";
  quiz.mode = input;
  quiz.list = generateGKPool();
  quiz.total = count;
  quiz.index = 0;
  quiz.score = 0;
  gameState = "gk";
  addMessage(`Mulai Quiz Pengetahuan Umum (${input.toUpperCase()}) — total ${count} soal.`, "bot");
  askNextQuiz();
}

// ============================================================
// ======================= QUIZ CODING ========================
// ============================================================

function startCodeQuizMenu() {
  gameState = "code-mode-lang";
  addMessage(
`👨‍💻 Quiz Coding
Pilih bahasa:
- cpp
- python
- js

Ketik: cpp / python / js`,
    "bot"
  );
}

function handleCodeLangInput(input) {
  if (!["cpp","python","js"].includes(input)) {
    addMessage("Ketik: cpp / python / js", "bot");
    return;
  }
  quiz.lang = input;
  gameState = "code-mode-level";
  addMessage(
`Pilih level:
- pemula 
- sesepuh 

Ketik: pemula / sesepuh`,
    "bot"
  );
}

function handleCodeLevelInput(input) {
  if (!["pemula","sesepuh"].includes(input)) {
    addMessage("Ketik: pemula / sesepuh", "bot");
    return;
  }
  quiz.type = "code";
  quiz.mode = input;

  const count = (input==="pemula") ? 50 : 60;
  quiz.list = generateCodePool(quiz.lang, input);
  quiz.total = count;
  quiz.index = 0;
  quiz.score = 0;
  gameState = "code";
  addMessage(`Mulai Quiz Coding (${quiz.lang.toUpperCase()} • ${input.toUpperCase()}) — total ${count} soal.\nJawab singkat (keyword/angka/kata kunci).`, "bot");
  askNextQuiz();
}

// generator soal coding (template untuk capai ≥60 per mode per bahasa)
function generateCodePool(lang, level) {
  const L = lang;
  const lower = s => s.toLowerCase();

  const base = {
    cpp: {
      pemula: [
        ["Fungsi output di C++?", "cout"],
        ["Header standar untuk IO C++?", "#include <iostream>"],
        ["Tipe bilangan bulat C++ kecil?", "int"],
        ["Simbol namespace std (2 kata)?", "using namespace std"],
        ["Akhiran pernyataan di C++ (satu karakter)?", ";"],
        ["Operator tambah 1 (dua karakter)?", "++"],
        ["Struktur percabangan dasar (5 huruf)?", "if"],
        ["Perulangan dengan kondisi awal? (3 huruf)", "for"],
        ["Fungsi input C++?", "cin"],
        ["Kata kunci konstanta?", "const"],
        ["Tipe pecahan?", "double"],
        ["Fungsi utama program?", "main"],
        ["Kata kunci untuk mengembalikan nilai?", "return"],
        ["Operator logika 'dan' (dua karakter)?", "&&"],
        ["Struktur alternatif if?", "else"],
      ],
      sesepuh: [
        ["Kata kunci untuk referensi?", "&"],
        ["Struktur data dinamis generik STL?", "vector"],
        ["Kata kunci template umum?", "template"],
        ["Fungsi konstruktor dipanggil saat?", "instansiasi"],
        ["Mekanisme polymorphism run-time via? (2 kata)", "virtual function"],
        ["Pengelola memori manual?", "new"],
        ["Pasangan new untuk membebaskan?", "delete"],
        ["Eksepsi di-throw dengan kata kunci?", "throw"],
        ["Destructor diawali simbol apa? (1 karakter)", "~"],
        ["Penentu akses default class?", "private"],
        ["Metode tanpa ubah data diberi kata kunci?", "const"],
        ["Header kontainer dinamis?", "<vector>"],
        ["Fungsi untuk ukuran vector?", "size"],
        ["Iterator penunjuk awal?", "begin"],
        ["Konsep RAII: rilis resource saat?", "destruction"],
      ]
    },
    python: {
      pemula: [
        ["Fungsi output di Python?", "print"],
        ["Tipe list ditandai tanda apa? (1 karakter)", "["],
        ["Komentar 1 baris pakai?", "#"],
        ["Konstanta boolean benar?", "true? salah"], // akan diperbaiki
        ["Operator pangkat di Python? (2 karakter)", "**"],
        ["Mengubah string ke int pakai fungsi?", "int"],
        ["Kata kunci fungsi?", "def"],
        ["Kata kunci pengulangan sampai habis iterable?", "for"],
        ["Kata kunci kondisi?", "if"],
        ["Struktur data pasangan kunci-nilai?", "dict"],
        ["Pemotongan string disebut?", "slicing"],
        ["Perintah menghentikan loop?", "break"],
        ["Melanjutkan ke iterasi berikutnya?", "continue"],
        ["Nilai kosong di Python?", "none"],
        ["Package manager Python?", "pip"],
      ],
      sesepuh: [
        ["Generator dibuat dengan kata kunci?", "yield"],
        ["Decorator diawali simbol apa? (1 karakter)", "@"],
        ["Context manager dideklarasi pakai?", "with"],
        ["List comprehension menghasilkan?", "list"],
        ["Set tidak menyimpan elemen yang?", "duplikat"],
        ["Fungsi anonim disebut?", "lambda"],
        ["Dunder method untuk string representasi?", "__str__"],
        ["Virtual env umum? (2 kata)", "venv"],
        ["Typing untuk petunjuk tipe disebut?", "type hints"],
        ["Method class tapi tanpa instance?", "staticmethod"],
        ["Method yang terikat class?", "classmethod"],
        ["Pengelola paket proyek modern? (4 huruf)", "poetry"],
        ["PIP file daftar dependensi?", "requirements.txt"],
        ["Coroutines di Python modern?", "asyncio"],
        ["Engine pattern matching 3.10 keyword?", "match"],
      ]
    },
    js: {
      pemula: [
        ["Menulis ke console?", "console.log"],
        ["Tipe untuk bilangan?", "number"],
        ["Deklarasi variabel modern (3 huruf)?", "let"],
        ["Konstanta variabel?", "const"],
        ["Perbandingan ketat (3 karakter)?", "==="],
        ["Array literal ditandai tanda? (1 karakter)", "["],
        ["Objek literal ditandai tanda? (1 karakter)", "{"],
        ["Fungsi panah disebut?", "arrow function"],
        ["Ambil elemen by id API DOM?", "getelementbyid"],
        ["Event klik disebut?", "click"],
        ["Falsey paling umum 'tidak ada'? (4 huruf)", "null"],
        ["Undefined artinya belum?", "didefinisikan"],
        ["JSON: singkatan dari?", "javascript object notation"],
        ["Loop yang mengiterasi properti?", "for...in"],
        ["Loop yang mengiterasi nilai iterable?", "for...of"],
      ],
      sesepuh: [
        ["Hoisting mengangkat deklarasi ke?", "atas scope"],
        ["Promise status selesai disebut?", "fulfilled"],
        ["Fungsi async mengembalikan selalu?", "promise"],
        ["Event loop menangani antrian?", "task queue"],
        ["Keyword untuk menangkap error async/await?", "try...catch"],
        ["Strict mode diaktifkan dengan string?", "'use strict'"],
        ["Immutability dengan Object.?", "freeze"],
        ["Prototype diakses via properti?", "__proto__"],
        ["Binding 'this' permanen pakai Function.?", "bind"],
        ["Web storage kunci-nilai persist?", "localstorage"],
        ["Alat bundler modern populer? (5 huruf)", "vite"],
        ["Module ESM ekspor default keyword?", "export default"],
        ["Import sebagian sintaks?", "import { }"],
        ["Single-threaded namun non-blocking via?", "async io"],
        ["Fetch API kembalikan?", "promise"],
      ]
    }
  };

  // perbaiki fakta salah
  base.python.pemula[3] = ["Konstanta boolean benar?", "true? salah"];
  base.python.pemula[3] = ["Konstanta boolean benar di Python? (awal kapital)", "True"];

  // duplikasi + variasi phrasing sampai >=60
  let seed = (level==="pemula") ? base[L].pemula : base[L].sesepuh;

  // tambahkan variasi otomatis
  const variants = [];
  seed.forEach(([q,a])=>{
    variants.push({q, a: normalizeAns(a)});
    variants.push({q: q.replace("?", " itu apa?"), a: normalizeAns(a)});
    variants.push({q: `Singkat: ${q}`, a: normalizeAns(a)});
  });

  // tambah 20 soal generator umum lintas bahasa
  for (let i=0;i<20;i++){
    if (L==="python") {
      const n = randInt(2,9);
      variants.push({q:`Output: print(${n}**2) ?`, a:String(n**2)});
    } else if (L==="cpp") {
      variants.push({q:`Akhiran baris di C++? (satu karakter)`, a:";"});
    } else {
      variants.push({q:`Tipe data untuk teks di JS?`, a:"string"});
    }
  }

  const out = shuffle(variants);
  const need = (level==="pemula")? 50 : 60;
  return out.slice(0, need);
}

function normalizeAns(a){
  return (a||"").toString().trim().toLowerCase();
}

// ============================================================
// =================== KERANGKA QUIZ GENERIK ==================
// ============================================================

function askNextQuiz() {
  if (quiz.index >= quiz.total) {
    addMessage(`🏁 Selesai! Skor kamu: ${quiz.score} / ${quiz.total}`, "bot");
    endGame();
    return;
  }
  const item = quiz.list[quiz.index];
  addMessage(`Soal ${quiz.index+1}/${quiz.total}: ${item.q}`, "bot");
}

function handleQuizAnswer(inputRaw) {
  const input = inputRaw.trim().toLowerCase();
  const item = quiz.list[quiz.index];

  // penilaian fleksibel angka/teks
  const ans = (item.a||"").toString().trim().toLowerCase();

  let correct = false;
  if (isNumeric(ans) && isNumeric(input)) {
    // bandingkan numerik
    correct = (Number(ans) === Number(input));
  } else {
    // longgar: hapus spasi ganda
    correct = normalizeSpace(ans) === normalizeSpace(input);
  }

  if (correct) {
    quiz.score++;
    addMessage(`✅ Betul!`, "bot");
  } else {
    addMessage(`❌ Salah. Jawaban benar: ${item.a}`, "bot");
  }

  quiz.index++;
  askNextQuiz();
}

// ============================================================
// ======================== UTILITIES =========================
// ============================================================

function endGame() {
  gameState = "none";
  addMessage("🔁 Main lagi? ketik: main game", "bot");
}

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffle(arr) {
  const a = arr.slice();
  for (let i=a.length-1;i>0;i--){
    const j = Math.floor(Math.random()*(i+1));
    [a[i],a[j]]=[a[j],a[i]];
  }
  return a;
}

function isLeap(y){
  return (y%4===0 && y%100!==0) || (y%400===0);
}

function isNumeric(v){
  return /^-?\d+(\.\d+)?$/.test(String(v));
}

function normalizeSpace(s){
  return s.replace(/\s+/g,' ').trim();
}
