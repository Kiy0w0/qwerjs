# 🚀 Quick Start - QWER API

Panduan cepat untuk menjalankan QWER API.

## Instalasi Lokal

### 1. Install Dependencies
```bash
npm install
```

### 2. Jalankan Server
```bash
npm start
```

Server akan berjalan di: `http://localhost:8080`

### 3. Test API
Buka browser dan akses:
- Homepage: http://localhost:8080
- API Index: http://localhost:8080/api
- API Docs: http://localhost:8080/docs
- Band Info: http://localhost:8080/api/band

## Development Mode

Untuk development dengan auto-reload:
```bash
npm run dev
```

## Deploy ke cPanel

Lihat file `DEPLOY_CPANEL.md` untuk panduan lengkap deploy ke cPanel.

### Ringkasan Singkat:

1. **Setup Node.js App di cPanel**
   - Node.js version: 18.x+
   - Application root: `public_html/qwer-api`
   - Startup file: `server.js`

2. **Upload semua file** via File Manager atau FTP

3. **Install dependencies** di cPanel: klik "Run NPM Install"

4. **Start aplikasi** di cPanel: klik "Start App"

5. **Done!** Akses via domain Anda

## Struktur File Penting

```
jsqwer/
├── server.js           ← Main file (entry point)
├── package.json        ← Dependencies
├── data.js            ← Data QWER
├── routes/
│   └── api.js         ← API routes
└── public/            ← Static files (HTML, CSS, JS, images)
```

## Environment Variables (Optional)

Buat file `.env`:
```env
PORT=8080
NODE_ENV=production
```

## API Endpoints

- `GET /api` - API info
- `GET /api/band` - Band information
- `GET /api/members` - Members list
- `GET /api/songs` - Songs list
- `GET /api/albums` - Albums list
- `GET /api/awards` - Awards list

Query parameters: `id`, `name`, `search`, `sort`, `page`, `limit`

## Troubleshooting

### Port sudah digunakan?
Ubah port di `.env` atau jalankan dengan:
```bash
PORT=3000 npm start
```

### Dependencies error?
```bash
rm -rf node_modules package-lock.json
npm install
```

---

**Untuk dokumentasi lengkap, lihat `README.md`**

