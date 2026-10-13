# CAROVAL — Pasta dari Ampas Wortel

Website presentasi + database gratis menggunakan **Google Sheets + Apps Script**.

---

## Fitur Website

| Fitur | Keterangan |
|-------|------------|
| Hero + Branding | Logo, tagline, CTA |
| Tentang | 4 kartu keunggulan |
| Produk | 3 varian (Spaghetti, Penne, Fusilli) interaktif |
| Proses | Timeline 4 langkah |
| **Pre-Order Form** | Nama, kontak, varian, qty → masuk Google Sheet |
| **Mini Quiz** | 3 pertanyaan + simpan skor ke leaderboard |
| **Leaderboard** | Top 10 skor dari database |
| **Feedback Form** | Rating bintang + komentar → database |
| **Ulasan Terbaru** | Menampilkan 10 feedback terakhir |
| **Visitor Counter** | Hitung pengunjung otomatis |
| QRIS | Gambar pembayaran |
| Responsive | Mobile-friendly |

---

## Cara Setup (langkah demi langkah)

### 1. Buat Google Spreadsheet

1. Buka [sheets.google.com](https://sheets.google.com)
2. Buat spreadsheet baru, beri nama **CAROVAL Database**
3. Rename sheet default menjadi `Orders`
4. Buat 3 sheet tambahan:
   - `Feedback`
   - `QuizScores`
   - `Stats`

5. Isi **header baris 1** masing-masing sheet:

**Orders**
```
Timestamp | Name | Contact | Product | Qty | Note
```

**Feedback**
```
Timestamp | Name | Rating | Comment
```

**QuizScores**
```
Timestamp | Name | Score | Total
```

**Stats**
```
Key | Value
```
Lalu di baris 2 isi: `visitors` | `0`

---

### 2. Pasang Apps Script

1. Di spreadsheet yang sama: **Extensions → Apps Script**
2. Hapus kode default, lalu **paste seluruh isi** file `apps-script/Code.gs`
3. Klik **Save** (Ctrl+S), beri nama project misalnya `CAROVAL API`
4. Klik **Deploy → New deployment**
5. Klik gear ⚙️ di samping "Select type" → pilih **Web app**
6. Isi:
   - Description: `CAROVAL API v1`
   - Execute as: **Me**
   - Who has access: **Anyone**
7. Klik **Deploy**
8. Authorize (pilih akun Google → Advanced → Go to ... → Allow)
9. **Copy URL** yang muncul (bentuknya `https://script.google.com/macros/s/XXXX/exec`)

---

### 3. Hubungkan Website ke Apps Script

1. Buka file `script.js`
2. Ganti baris ini:

```js
const APPS_SCRIPT_URL = "https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec";
```

dengan URL yang kamu copy tadi.

---

### 4. Deploy ke GitHub Pages

1. Buat repository baru di GitHub (misal `carovalpasta`)
2. Upload **semua isi folder ini** (kecuali folder `apps-script` boleh ikut sebagai dokumentasi)
3. Pastikan `index.html` ada di root repository
4. Settings → Pages → Source: **Deploy from a branch** → branch `main` → folder `/ (root)`
5. Tunggu 1–2 menit, website live!

Kalau punya domain custom, edit file `CNAME`.

---

## Struktur File

```
caroval-deploy/
├── index.html          ← halaman utama
├── style.css           ← desain
├── script.js           ← interaksi + koneksi database
├── favicon.svg / .png  ← ikon
├── CNAME               ← domain custom (opsional)
├── hotlink/
│   ├── fotoprofile.png ← foto / maskot
│   └── Qris.png        ← QRIS pembayaran
├── apps-script/
│   └── Code.gs         ← kode backend (paste ke Apps Script)
└── README.md           ← panduan ini
```

---

## Testing

Setelah setup:

1. Buka website
2. Isi form **Pesan Sekarang** → cek sheet `Orders`
3. Main quiz → simpan skor → cek sheet `QuizScores` + leaderboard
4. Kirim feedback → cek sheet `Feedback` + daftar ulasan
5. Refresh halaman → angka pengunjung di footer bertambah

---

## Catatan Penting

- **Apps Script free** cukup untuk ribuan request/hari (lebih dari cukup untuk proyek sekolah/NASPO)
- Data bisa di-export ke Excel kapan saja dari Google Sheets
- Kalau ingin ubah kode Apps Script, setelah edit → Deploy → **Manage deployments** → Edit → New version
- CORS sudah di-handle dengan `mode: "no-cors"` untuk POST; GET tetap bisa baca JSON

---

## Kontak / Kredit

CAROVAL — Pasta dari Ampas Wortel  
Inovasi kecil, dampak besar. 🌱
