/**
 * =====================================================
 *  CAROVAL — Google Apps Script (Database Backend)
 * =====================================================
 *  Cara setup:
 *  1. Buka https://sheets.google.com → buat Spreadsheet baru
 *     beri nama "CAROVAL Database"
 *  2. Buat 4 sheet dengan nama PERSIS:
 *       - Orders
 *       - Feedback
 *       - QuizScores
 *       - Stats
 *  3. Isi header baris 1 masing-masing sheet (lihat bawah)
 *  4. Extensions → Apps Script → paste seluruh kode ini
 *  5. Deploy → New deployment → Type: Web app
 *       - Execute as: Me
 *       - Who has access: Anyone
 *  6. Copy URL Web App → paste ke script.js (APPS_SCRIPT_URL)
 * =====================================================
 *
 *  HEADER SHEET:
 *  Orders:     Timestamp | Name | Contact | Product | Qty | Note
 *  Feedback:   Timestamp | Name | Rating | Comment
 *  QuizScores: Timestamp | Name | Score | Total
 *  Stats:      Key | Value          (isi baris 2: visitors | 0)
 */

const SHEET_ORDERS  = "Orders";
const SHEET_FEEDBACK = "Feedback";
const SHEET_QUIZ    = "QuizScores";
const SHEET_STATS   = "Stats";

function doGet(e) {
  const action = (e.parameter.action || "").toLowerCase();
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  try {
    if (action === "leaderboard") {
      return jsonResponse(getLeaderboard(ss));
    }
    if (action === "feedbacks") {
      return jsonResponse(getFeedbacks(ss));
    }
    if (action === "visit") {
      return jsonResponse({ count: incrementVisitor(ss) });
    }
    return jsonResponse({ status: "ok", message: "CAROVAL API ready" });
  } catch (err) {
    return jsonResponse({ error: err.message }, 500);
  }
}

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const action = (data.action || "").toLowerCase();
    const ss = SpreadsheetApp.getActiveSpreadsheet();

    if (action === "order") {
      appendOrder(ss, data);
      return jsonResponse({ status: "ok", message: "Order saved" });
    }
    if (action === "feedback") {
      appendFeedback(ss, data);
      return jsonResponse({ status: "ok", message: "Feedback saved" });
    }
    if (action === "savescore") {
      appendScore(ss, data);
      return jsonResponse({ status: "ok", message: "Score saved" });
    }
    return jsonResponse({ error: "Unknown action" }, 400);
  } catch (err) {
    return jsonResponse({ error: err.message }, 500);
  }
}

/* ---------- WRITE ---------- */
function appendOrder(ss, d) {
  const sh = ss.getSheetByName(SHEET_ORDERS);
  sh.appendRow([
    new Date(),
    clean(d.name),
    clean(d.contact),
    clean(d.product),
    Number(d.qty) || 1,
    clean(d.note)
  ]);
}

function appendFeedback(ss, d) {
  const sh = ss.getSheetByName(SHEET_FEEDBACK);
  sh.appendRow([
    new Date(),
    clean(d.name),
    Number(d.rating) || 0,
    clean(d.comment)
  ]);
}

function appendScore(ss, d) {
  const sh = ss.getSheetByName(SHEET_QUIZ);
  sh.appendRow([
    new Date(),
    clean(d.name),
    Number(d.score) || 0,
    Number(d.total) || 3
  ]);
}

function incrementVisitor(ss) {
  const sh = ss.getSheetByName(SHEET_STATS);
  // Cari baris "visitors"
  const data = sh.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    if (String(data[i][0]).toLowerCase() === "visitors") {
      const newVal = Number(data[i][1]) + 1;
      sh.getRange(i + 1, 2).setValue(newVal);
      return newVal;
    }
  }
  // Jika belum ada, buat
  sh.appendRow(["visitors", 1]);
  return 1;
}

/* ---------- READ ---------- */
function getLeaderboard(ss) {
  const sh = ss.getSheetByName(SHEET_QUIZ);
  const rows = sh.getDataRange().getValues();
  if (rows.length < 2) return [];

  // [Timestamp, Name, Score, Total]
  const items = rows.slice(1).map(r => ({
    name: String(r[1]),
    score: Number(r[2]),
    total: Number(r[3])
  }));

  // Sort skor tertinggi, ambil top 10
  items.sort((a, b) => b.score - a.score || b.total - a.total);
  return items.slice(0, 10);
}

function getFeedbacks(ss) {
  const sh = ss.getSheetByName(SHEET_FEEDBACK);
  const rows = sh.getDataRange().getValues();
  if (rows.length < 2) return [];

  // Ambil 10 terbaru (dari bawah)
  const items = rows.slice(1).map(r => ({
    name: String(r[1]),
    rating: Number(r[2]),
    comment: String(r[3])
  })).reverse().slice(0, 10);

  return items;
}

/* ---------- UTILS ---------- */
function clean(v) {
  return String(v || "").substring(0, 500).trim();
}

function jsonResponse(obj, code) {
  const out = ContentService.createTextOutput(JSON.stringify(obj));
  out.setMimeType(ContentService.MimeType.JSON);
  return out;
}
