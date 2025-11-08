# QWER Band API - JavaScript/Node.js Version

[![Go](https://img.shields.io/badge/Go-1.21-00ADD8?logo=go&logoColor=white)](https://go.dev/)
[![Status](https://img.shields.io/badge/Status-Active-success)](#)
[![License](https://img.shields.io/badge/License-Copyright%20Kiy0w0%202025-blue)](#license)


![Qwer Band](public/qwer/group.webp)
Simple REST API for QWER band data (albums, songs, members, awards). Built with Go

## 🚀 Features

- ✅ RESTful API with Express.js
- ✅ CORS enabled
- ✅ Rate limiting (120 requests per 15 minutes)
- ✅ Pagination support
- ✅ Search & filter capabilities
- ✅ OpenAPI documentation
- ✅ Static website frontend

## 📋 Prerequisites

- Node.js version 14 or higher
- npm or yarn

## 🛠️ Local Installation

1. **Clone or download this project**

2. **Install dependencies:**
```bash
npm install
```

3. **Start the server:**
```bash
npm start
```

4. **For development with auto-reload:**
```bash
npm run dev
```

Server will run at `http://localhost:8080`


## 📚 API Endpoints

### Base URL
```
http://localhost:8080/api
```

### Available Endpoints

#### 1. API Index
```
GET /api
```
Returns API information and available endpoints.

#### 2. Band Information
```
GET /api/band
```
Get complete QWER band information.

#### 3. Members
```
GET /api/members
GET /api/members?id=1
GET /api/members?name=chodan
GET /api/members?search=guitar&sort=name&page=1&limit=10
```
Get member information.

**Query Parameters:**
- `id`: Member ID (integer)
- `name`: Member name or stage name (string)
- `search`: Search in name/stage/position (string)
- `sort`: Sort by name or stage_name (string)
- `page`: Page number (integer, default: 1)
- `limit`: Items per page (integer, default: 50, max: 200)

#### 4. Songs
```
GET /api/songs
GET /api/songs?id=1
GET /api/songs?title=Discord
GET /api/songs?album=manito
GET /api/songs?search=rock&sort=title&page=1&limit=10
```
Get song information.

**Query Parameters:**
- `id`: Song ID (integer)
- `title`: Song title (string)
- `album`: Album name (string)
- `search`: Search in title/album/genre (string)
- `sort`: Sort by title, album, or date (string)
- `page`: Page number (integer)
- `limit`: Items per page (integer)

#### 5. Albums
```
GET /api/albums
GET /api/albums?id=1
GET /api/albums?title=MANITO
GET /api/albums?search=blossom&sort=date
```
Get album information.

**Query Parameters:**
- `id`: Album ID (integer)
- `title`: Album title (string)
- `search`: Search in title/type (string)
- `sort`: Sort by title or date (string)
- `page`: Page number (integer)
- `limit`: Items per page (integer)

#### 6. Awards
```
GET /api/awards
GET /api/awards?year=2024
GET /api/awards?event=MAMA
```
Get awards information.

**Query Parameters:**
- `year`: Award year (integer)
- `event`: Event name (string)

## 🔧 Troubleshooting

### Port already in use
If port 8080 is already in use, change it in `.env` file:
```
PORT=3000
```

### Dependencies not installed
Run manually:
```bash
cd ~/path/to/your/app
npm install
```

### App not running
1. Check logs in cPanel Node.js App menu
2. Ensure `server.js` is in root folder
3. Restart the application

### CORS errors
CORS is already enabled. If you still get errors, check Apache/Nginx configuration.

### 502 Bad Gateway
Ensure Node.js application is running and port number is correct.

## 📝 Environment Variables

Create `.env` file (optional):
```env
PORT=8080
NODE_ENV=production
```

## 🔐 Security Notes

- Rate limiting: 120 requests per 15 minutes per IP
- CORS enabled for all origins (modify in `server.js` as needed)
- Sensitive files protected via `.htaccess`

## 📦 Structure

```
jsqwer/
├── server.js           # Main server file
├── package.json        # Dependencies
├── data.js            # QWER band data
├── openapi.yaml       # API documentation
├── .htaccess          # Apache configuration
├── .env.example       # Environment variables example
├── routes/
│   └── api.js         # API routes handler
└── public/            # Static files
    ├── index.html     # Homepage
    ├── app.js         # Frontend JavaScript
    ├── styles.css     # Styles
    └── qwer/          # Images
```

## 📄 License

MIT License - See LICENSE file for details.

## 👨‍💻 Author

Made by Kiy0w0

## 🔗 Links

- GitHub: [kiy0w0/qwer](https://github.com/kiy0w0/qwer)
- YouTube: [@qwer_band_official](https://www.youtube.com/@qwer_band_official)

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

---

**Made with ❤️ for QWER fans**

