# 🎸 QWER API - JavaScript Version

## 👋 MULAI DI SINI!

Selamat! QWER API versi JavaScript sudah siap untuk di-deploy ke cPanel.

---

## 📦 Apa yang Sudah Dibuat?

✅ **Full REST API** dengan Express.js  
✅ **27 files** lengkap (1.7 MB total)  
✅ **1100+ lines** of code  
✅ **Frontend website** yang cantik (dark theme)  
✅ **10 gambar** album covers + logo  
✅ **Data lengkap** QWER (4 members, 31 songs, 10 albums, 7 awards)  
✅ **Dokumentasi lengkap** untuk deployment  

---

## 🗂️ Struktur Project

```
jsqwer/
├── 📄 server.js              ← Main server (entry point)
├── 📄 package.json           ← Dependencies
├── 📄 data.js               ← Data QWER lengkap
├── 📄 openapi.yaml          ← API spec
├── 📁 routes/
│   └── api.js               ← API handlers
├── 📁 public/               ← Website (HTML, CSS, JS)
│   ├── index.html
│   ├── app.js
│   ├── styles.css
│   └── qwer/               ← 10 images
└── 📚 Dokumentasi (5 files)
```

---

## 📚 Dokumentasi yang Tersedia

Baca file-file ini sesuai kebutuhan:

### 1. **QUICK_START.md** ⚡
→ Cara cepat test di komputer lokal  
→ Untuk cek apakah semuanya berfungsi sebelum deploy

### 2. **DEPLOY_CPANEL.md** 🚀
→ **BACA INI UNTUK DEPLOY!**  
→ Panduan step-by-step lengkap deploy ke cPanel  
→ Include troubleshooting dan tips

### 3. **DEPLOYMENT_CHECKLIST.md** ✅
→ Checklist saat deploy  
→ Pastikan tidak ada yang terlewat  
→ Include verification steps

### 4. **README.md** 📖
→ Dokumentasi lengkap API  
→ List semua endpoints dan parameters  
→ Troubleshooting guide

### 5. **SUMMARY_DEPLOYMENT.txt** 📝
→ Ringkasan semua fitur  
→ Quick reference

---

## 🚀 Quick Start (Test Lokal)

**Prasyarat:** Install Node.js dulu (https://nodejs.org/)

```bash
# 1. Masuk ke folder project
cd /home/nayilla/Downloads/Nayilla/test/jsqwer

# 2. Install dependencies
npm install

# 3. Jalankan server
npm start

# 4. Buka browser
# http://localhost:8080
```

**Test Endpoints:**
- Homepage: http://localhost:8080
- API: http://localhost:8080/api
- Band Info: http://localhost:8080/api/band
- Members: http://localhost:8080/api/members
- Songs: http://localhost:8080/api/songs
- Albums: http://localhost:8080/api/albums
- Awards: http://localhost:8080/api/awards
- Docs: http://localhost:8080/docs

---

## 🌐 Deploy ke cPanel

### Ringkasan Singkat:

1. **Login ke cPanel** → Buka "Setup Node.js App"

2. **Create Application:**
   - Node.js version: 18.x
   - Application root: `public_html/qwer-api`
   - Startup file: `server.js`
   - Environment: `PORT=8080`

3. **Upload semua file** dari folder `jsqwer/`
   - Via File Manager (recommended untuk pemula)
   - Via FTP (FileZilla, WinSCP)
   - Via Terminal/SSH

4. **Install dependencies:**
   - Di cPanel, klik "Run NPM Install"

5. **Start aplikasi:**
   - Klik "Start App"
   - Tunggu status jadi "Running"

6. **Test:**
   - Buka https://yourdomain.com/
   - Test API: https://yourdomain.com/api

### Detail Lengkap:

📖 **Baca file:** `DEPLOY_CPANEL.md`

✅ **Gunakan checklist:** `DEPLOYMENT_CHECKLIST.md`

---

## 🎯 API Endpoints

Setelah deploy, API Anda akan punya endpoints ini:

```
GET /api                    → API info
GET /api/band              → Band information (full data)
GET /api/members           → All members
GET /api/members?id=1      → Specific member
GET /api/members?name=chodan → Member by name
GET /api/songs             → All songs
GET /api/songs?album=manito → Songs by album
GET /api/albums            → All albums
GET /api/albums?sort=date  → Albums sorted by date
GET /api/awards            → All awards
GET /api/awards?year=2024  → Awards by year
GET /docs                  → API documentation (ReDoc)
```

**Query Parameters Support:**
- `id`, `name`, `title` - exact match
- `search` - search in multiple fields
- `sort` - sort results
- `page`, `limit` - pagination

---

## 🔧 File-file Penting

### Backend:
- `server.js` - Main server file (Express.js)
- `routes/api.js` - API route handlers
- `data.js` - QWER band data (members, songs, albums, awards)

### Frontend:
- `public/index.html` - Homepage
- `public/app.js` - Frontend logic
- `public/styles.css` - Dark theme styles
- `public/qwer/*.jpeg` - Album covers & logo

### Configuration:
- `package.json` - Dependencies (Express, CORS, Rate Limit)
- `.htaccess` - Apache config untuk cPanel
- `.env.example` - Environment variables template
- `openapi.yaml` - API documentation spec

### Documentation:
- `README.md` - Full documentation
- `DEPLOY_CPANEL.md` - Deployment guide
- `QUICK_START.md` - Quick reference
- `DEPLOYMENT_CHECKLIST.md` - Deploy checklist

---

## 💡 Tips

### Sebelum Deploy:
1. ✅ Test dulu di lokal (npm install && npm start)
2. ✅ Pastikan semua file lengkap
3. ✅ Siapkan domain/subdomain
4. ✅ Pastikan cPanel support Node.js

### Saat Deploy:
1. ✅ Ikuti DEPLOYMENT_CHECKLIST.md
2. ✅ Catat port number yang diberikan cPanel
3. ✅ Edit .htaccess dengan port yang benar
4. ✅ Check logs jika ada error

### Setelah Deploy:
1. ✅ Test semua endpoints
2. ✅ Enable SSL (HTTPS)
3. ✅ Monitor logs first week
4. ✅ Share API URL ke fans QWER! 🎉

---

## 🆘 Butuh Bantuan?

### Jika ada masalah saat deploy:

1. **Baca Troubleshooting:**
   - `DEPLOY_CPANEL.md` → Section Troubleshooting
   - `README.md` → Section Troubleshooting

2. **Check Common Issues:**
   - App tidak start? → Check logs di cPanel
   - 502 Error? → Restart app, check port di .htaccess
   - Module not found? → Run "NPM Install" lagi
   - CORS error? → Already enabled, clear cache

3. **Verify Installation:**
   - Gunakan `DEPLOYMENT_CHECKLIST.md`
   - Centang semua items satu per satu

4. **Test Locally First:**
   - Install Node.js
   - Run: `npm install && npm start`
   - Access: http://localhost:8080

---

## 📊 Project Stats

```
📦 Total Size: 1.7 MB
📄 Total Files: 27 files
💻 Lines of Code: 1100+ lines
🎨 Images: 10 album covers
📚 Documentation: 5 comprehensive guides
🌐 API Endpoints: 7 main endpoints
🎵 Songs: 31 songs
💿 Albums: 10 albums/singles
👥 Members: 4 members
🏆 Awards: 7 awards
```

---

## 🔐 Security Features

✅ **Rate Limiting** - 120 requests per 15 minutes  
✅ **CORS Enabled** - Cross-origin requests allowed  
✅ **Protected Files** - .htaccess protects sensitive files  
✅ **Error Handling** - Proper error messages  
✅ **Input Validation** - Safe query parameters  
✅ **Logging** - Request logging for monitoring  

---

## 🎉 Ready to Deploy!

Semua sudah siap! Tinggal deploy ke cPanel.

**Next Steps:**

1. 📖 **Baca:** `DEPLOY_CPANEL.md`
2. ✅ **Gunakan:** `DEPLOYMENT_CHECKLIST.md`
3. 🚀 **Deploy!**
4. 🎸 **Share ke QWER fans!**

---

## 🔗 Links

- **Original Go Version:** https://github.com/kiy0w0/qwer
- **QWER Official YouTube:** https://www.youtube.com/@qwer_band_official
- **QWER Official Instagram:** https://www.instagram.com/qwer_official/

---

## 📞 Support

**Issues during deployment?**
- Check troubleshooting sections in docs
- Contact your hosting provider support
- Verify cPanel Node.js version (need 14.x+)

---

## ✨ Features

✅ RESTful API architecture  
✅ JSON responses  
✅ Pagination support  
✅ Search & filter  
✅ Sort capabilities  
✅ CORS enabled  
✅ Rate limiting  
✅ API documentation (ReDoc)  
✅ Beautiful frontend  
✅ Responsive design  
✅ Dark theme  
✅ cPanel ready  
✅ Production ready  

---

## 🙏 Credits

**Made with ❤️ for QWER fans**

Original API by: Kiy0w0  
JavaScript Port: Custom build  
Band: QWER (쿼터)  
Company: Tamago Production  

---

## 📝 License

MIT License - See LICENSE file for details

---

# 🎸 Selamat Menggunakan QWER API!

**Happy coding and enjoy QWER's music! 🎵**

---

**Last Updated:** November 2025  
**Version:** 1.0.0  
**Status:** Production Ready ✅

