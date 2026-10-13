/* =====================================================
   CAROVAL — script.js
   Ganti APPS_SCRIPT_URL dengan URL Web App kamu setelah deploy.
   ===================================================== */
const APPS_SCRIPT_URL = "https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec";

/* ---------- PRODUCT SELECTOR ---------- */
const info = document.getElementById("product-info");
document.querySelectorAll(".detail-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    const product = btn.dataset.product;
    const messages = {
      Spaghetti: "🍝 Spaghetti CAROVAL — bentuk panjang & ramping. Coba dengan saus tomat, bolognese, atau tumisan sayur.",
      Penne: "🥕 Penne CAROVAL — bentuk pendek berongga. Cocok untuk saus yang lebih kental dan baked pasta.",
      Fusilli: "✨ Fusilli CAROVAL — bentuk spiral yang seru. Enak untuk salad pasta atau saus creamy."
    };
    info.textContent = messages[product];
    info.scrollIntoView({ behavior: "smooth", block: "center" });

    // highlight card
    document.querySelectorAll(".product-card").forEach(c => c.classList.remove("active"));
    btn.closest(".product-card").classList.add("active");

    // auto-select di form pesan
    const sel = document.getElementById("order-product");
    if (sel) sel.value = product;
  });
});

/* ---------- MOBILE MENU ---------- */
document.querySelector(".menu-btn").onclick = () =>
  document.querySelector("nav").classList.toggle("mobile-show");

/* ---------- QUIZ ---------- */
const questions = [
  { q: "Ampas wortel pada CAROVAL dimanfaatkan untuk menjadi...", a: ["Bahan pasta", "Bahan bakar kendaraan", "Minuman bersoda"], c: 0 },
  { q: "Salah satu konsep utama CAROVAL adalah...", a: ["Pemanfaatan pangan", "Membuang bahan sisa", "Menggunakan plastik sekali pakai"], c: 0 },
  { q: "Bentuk pasta yang panjang dan ramping adalah...", a: ["Spaghetti", "Penne", "Fusilli"], c: 0 }
];
let qi = 0, score = 0;
const questionEl = document.getElementById("question");
const answersEl = document.getElementById("answers");
const resultEl = document.getElementById("quiz-result");
const nextBtn = document.getElementById("next-btn");
const scoreFormWrap = document.getElementById("score-form-wrap");

function renderQuiz() {
  const item = questions[qi];
  questionEl.textContent = item.q;
  answersEl.innerHTML = "";
  resultEl.textContent = "";
  nextBtn.classList.add("hidden");
  scoreFormWrap.classList.add("hidden");
  item.a.forEach((text, i) => {
    const b = document.createElement("button");
    b.textContent = text;
    b.onclick = () => answer(i, b);
    answersEl.appendChild(b);
  });
}

function answer(i, b) {
  [...answersEl.children].forEach(x => x.disabled = true);
  const correct = questions[qi].c === i;
  b.classList.add(correct ? "correct" : "wrong");
  if (correct) { score++; resultEl.textContent = "🎉 Benar! Kamu keren!"; }
  else resultEl.textContent = "💡 Belum tepat. Yuk kenalan lagi sama CAROVAL!";
  nextBtn.textContent = qi === questions.length - 1 ? "Lihat skor →" : "Pertanyaan berikutnya →";
  nextBtn.classList.remove("hidden");
}

nextBtn.onclick = () => {
  if (qi < questions.length - 1) {
    qi++;
    renderQuiz();
  } else {
    questionEl.textContent = `Skor kamu: ${score}/${questions.length} 🌟`;
    answersEl.innerHTML = "";
    resultEl.textContent = "Makasih sudah main!";
    nextBtn.classList.add("hidden");
    scoreFormWrap.classList.remove("hidden");
  }
};

document.getElementById("save-score-btn").onclick = async () => {
  const name = document.getElementById("score-name").value.trim();
  const status = document.getElementById("score-status");
  if (!name) { status.textContent = "Isi nama dulu ya!"; status.className = "form-status err"; return; }
  status.textContent = "Menyimpan..."; status.className = "form-status";
  try {
    await postData({ action: "saveScore", name, score, total: questions.length });
    status.textContent = "✅ Skor tersimpan! Cek leaderboard.";
    status.className = "form-status ok";
    loadLeaderboard();
    // reset quiz option
    nextBtn.textContent = "Ulangi quiz";
    nextBtn.classList.remove("hidden");
    nextBtn.onclick = () => { qi = 0; score = 0; scoreFormWrap.classList.add("hidden"); renderQuiz(); };
  } catch (e) {
    status.textContent = "❌ Gagal menyimpan. Coba lagi.";
    status.className = "form-status err";
  }
};

renderQuiz();

/* ---------- RATING STARS ---------- */
const stars = document.querySelectorAll("#rating-stars button");
const ratingInput = document.getElementById("fb-rating");
stars.forEach(s => {
  s.onclick = () => {
    const rate = +s.dataset.rate;
    ratingInput.value = rate;
    stars.forEach(x => x.classList.toggle("active", +x.dataset.rate <= rate));
  };
});

/* ---------- ORDER FORM ---------- */
document.getElementById("order-form").onsubmit = async (e) => {
  e.preventDefault();
  const status = document.getElementById("order-status");
  const btn = document.getElementById("order-submit");
  btn.disabled = true;
  status.textContent = "Mengirim..."; status.className = "form-status";

  const data = {
    action: "order",
    name: document.getElementById("order-name").value.trim(),
    contact: document.getElementById("order-contact").value.trim(),
    product: document.getElementById("order-product").value,
    qty: document.getElementById("order-qty").value,
    note: document.getElementById("order-note").value.trim()
  };

  try {
    await postData(data);
    status.textContent = "✅ Pesanan berhasil dikirim! Terima kasih.";
    status.className = "form-status ok";
    e.target.reset();
  } catch (err) {
    status.textContent = "❌ Gagal mengirim. Periksa koneksi atau setup Apps Script.";
    status.className = "form-status err";
  }
  btn.disabled = false;
};

/* ---------- FEEDBACK FORM ---------- */
document.getElementById("feedback-form").onsubmit = async (e) => {
  e.preventDefault();
  const status = document.getElementById("fb-status");
  const btn = document.getElementById("fb-submit");
  const rating = +ratingInput.value;
  if (rating < 1) {
    status.textContent = "Pilih rating bintang dulu!";
    status.className = "form-status err";
    return;
  }
  btn.disabled = true;
  status.textContent = "Mengirim..."; status.className = "form-status";

  const data = {
    action: "feedback",
    name: document.getElementById("fb-name").value.trim(),
    rating,
    comment: document.getElementById("fb-comment").value.trim()
  };

  try {
    await postData(data);
    status.textContent = "✅ Feedback terkirim! Terima kasih.";
    status.className = "form-status ok";
    e.target.reset();
    stars.forEach(x => x.classList.remove("active"));
    ratingInput.value = 0;
    loadFeedback();
  } catch (err) {
    status.textContent = "❌ Gagal mengirim. Coba lagi.";
    status.className = "form-status err";
  }
  btn.disabled = false;
};

/* ---------- HELPER: POST ke Apps Script ---------- */
async function postData(payload) {
  // Apps Script Web App menerima POST sebagai form-urlencoded atau text
  // Kita kirim sebagai text/plain agar tidak kena CORS preflight
  const res = await fetch(APPS_SCRIPT_URL, {
    method: "POST",
    mode: "no-cors", // penting: Apps Script redirect, no-cors cukup untuk fire-and-forget
    headers: { "Content-Type": "text/plain" },
    body: JSON.stringify(payload)
  });
  // no-cors tidak bisa baca response, jadi kita anggap sukses jika tidak throw
  return true;
}

/* ---------- LOAD LEADERBOARD ---------- */
async function loadLeaderboard() {
  const list = document.getElementById("leaderboard-list");
  try {
    const res = await fetch(APPS_SCRIPT_URL + "?action=leaderboard");
    const data = await res.json();
    if (!data.length) {
      list.innerHTML = '<li class="lb-loading">Belum ada skor. Jadilah yang pertama!</li>';
      return;
    }
    list.innerHTML = data.map((d, i) =>
      `<li><b>#${i + 1}</b> ${escapeHtml(d.name)} — <strong>${d.score}/${d.total}</strong></li>`
    ).join("");
  } catch {
    list.innerHTML = '<li class="lb-loading">Gagal memuat. Pastikan Apps Script sudah di-deploy.</li>';
  }
}

/* ---------- LOAD FEEDBACK ---------- */
async function loadFeedback() {
  const wrap = document.getElementById("feedback-list");
  try {
    const res = await fetch(APPS_SCRIPT_URL + "?action=feedbacks");
    const data = await res.json();
    if (!data.length) {
      wrap.innerHTML = '<p class="fb-loading">Belum ada feedback. Jadilah yang pertama!</p>';
      return;
    }
    wrap.innerHTML = data.map(d => `
      <div class="fb-item">
        <div class="fb-head">
          <span class="fb-name">${escapeHtml(d.name)}</span>
          <span class="fb-stars">${"★".repeat(d.rating)}${"☆".repeat(5 - d.rating)}</span>
        </div>
        <div class="fb-comment">${escapeHtml(d.comment)}</div>
      </div>
    `).join("");
  } catch {
    wrap.innerHTML = '<p class="fb-loading">Gagal memuat feedback.</p>';
  }
}

/* ---------- VISITOR COUNTER ---------- */
async function countVisitor() {
  const el = document.getElementById("visitor-count");
  try {
    const res = await fetch(APPS_SCRIPT_URL + "?action=visit");
    const data = await res.json();
    el.textContent = data.count || "—";
  } catch {
    el.textContent = "—";
  }
}

function escapeHtml(str) {
  return String(str).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
}

/* ---------- INIT ---------- */
loadLeaderboard();
loadFeedback();
countVisitor();
