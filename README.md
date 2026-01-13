# QWER Band API - JavaScript/Node.js Version

[![Node.js](https://img.shields.io/badge/Node.js-14+-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![Status](https://img.shields.io/badge/Status-Active-success)](#)
[![License](https://img.shields.io/badge/License-MIT-blue)](LICENSE)
[![Vercel](https://img.shields.io/badge/Deploy-Vercel-black?logo=vercel)](https://vercel.com)


![Qwer Band](public/qwer/group.webp)

REST API for QWER band data (albums, songs, members, awards) with **auto-updating member photos** from Google. Built with Node.js and Express.js.

## 🚀 Features

- ✅ RESTful API with Express.js
- ✅ CORS enabled
- ✅ Rate limiting (120 requests per 15 minutes)
- ✅ Pagination support
- ✅ Search & filter capabilities
- ✅ OpenAPI documentation
- ✅ Static website frontend
- ✅ **🆕 Auto-updating member photos from Google**
- ✅ **🆕 Random song/member/fact endpoints**
- ✅ **🆕 Vercel Cron for scheduled updates**

## 📋 Prerequisites

- Node.js version 14 or higher
- npm or yarn
- Google Custom Search API key (for member photos feature)

## 🛠️ Local Installation

1. **Clone or download this project**

2. **Install dependencies:**
```bash
npm install
```

3. **Configure environment variables:**
```bash
cp .env.example .env
# Edit .env with your Google API credentials
```

4. **Start the server:**
```bash
npm start
```

5. **For development with auto-reload:**
```bash
npm run dev
```

Server will run at `http://localhost:8080`


## 📚 API Endpoints

### Base URL
```
http://localhost:8080/api
```

### 📌 Core Endpoints

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

### �️ Image Endpoints

#### 7. Local Images
```
GET /api/images              # All local images
GET /api/images?type=album   # Filter by type (album, group, logo)
GET /api/images/random       # Random local image
GET /api/images/albums       # Album covers only
```

#### 8. Member Photos (Google Search) 🆕
```
GET /api/members/:name/photos          # Get photos from Google
GET /api/members/:name/photos?refresh=true  # Force refresh
GET /api/members/:name/photos/random   # Random photo of member
```

**Available members:** `chodan`, `magenta`, `hina`, `siyeon`

**Example:**
```bash
curl http://localhost:8080/api/members/chodan/photos
curl http://localhost:8080/api/members/siyeon/photos/random
```

#### 9. Photo Management
```
GET /api/photos/status    # Check cache status for all members
GET /api/photos/refresh   # Manually refresh all member photos
```

### 🎲 Random Endpoints 🆕

```
GET /api/random           # Random song with album info
GET /api/random/member    # Random member
GET /api/random/album     # Random album
GET /api/random/fact      # Random fun fact about a member
```

## �🔧 Google Custom Search Setup

To enable auto-updating member photos:

### 1. Get Google API Key
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable "Custom Search API"
4. Create credentials → API Key

### 2. Create Custom Search Engine
1. Go to [Programmable Search Engine](https://programmablesearchengine.google.com/)
2. Create new search engine
3. Select "Search the entire web"
4. Enable "Image search"
5. Copy the Search Engine ID (CX)

### 3. Configure Environment Variables
```env
GOOGLE_API_KEY=your_api_key_here
GOOGLE_CX=your_search_engine_id_here
```

### API Quota
- **Free tier:** 100 requests/day
- **Auto-refresh:** 4 members × 4 times/day = 16 requests
- **Remaining:** 84 requests for user queries

## ☁️ Vercel Deployment

### 1. Deploy to Vercel
```bash
npm i -g vercel
vercel login
vercel --prod
```

### 2. Add Environment Variables
In Vercel Dashboard → Settings → Environment Variables:
- `GOOGLE_API_KEY`: Your Google API key
- `GOOGLE_CX`: Your Search Engine ID

### 3. Automatic Photo Updates
Vercel Cron is configured to refresh photos every 6 hours:
```json
{
  "crons": [
    {
      "path": "/api/photos/refresh",
      "schedule": "0 */6 * * *"
    }
  ]
}
```

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

### CORS errors
CORS is already enabled. If you still get errors, check Apache/Nginx configuration.

### 502 Bad Gateway
Ensure Node.js application is running and port number is correct.

### Google API quota exceeded
- Check usage at [Google Cloud Console](https://console.cloud.google.com/apis/dashboard)
- Photos will be served from cache until quota resets (midnight PT)

## 📝 Environment Variables

Create `.env` file:
```env
# Server
PORT=8080
NODE_ENV=production

# Google Custom Search (for member photos)
GOOGLE_API_KEY=your_google_api_key
GOOGLE_CX=your_search_engine_id

# Cache duration (hours)
CACHE_DURATION_HOURS=6

# Optional: Cron security
CRON_SECRET=your_random_secret
```

## 🔐 Security Notes

- Rate limiting: 120 requests per 15 minutes per IP
- CORS enabled for all origins (modify in `server.js` as needed)
- Sensitive files protected via `.htaccess`
- Google API keys should be restricted in production

## 📦 Structure

```
qwerjs/
├── server.js              # Main server file
├── package.json           # Dependencies
├── data.js                # QWER band data
├── openapi.yaml           # API documentation
├── vercel.json            # Vercel config with crons
├── .htaccess              # Apache configuration
├── .env.example           # Environment variables example
├── routes/
│   └── api.js             # API routes handler
├── services/
│   └── googleImages.js    # Google Image Search service
├── cron/
│   └── photoRefresh.js    # Scheduled photo refresh
└── public/                # Static files
    ├── index.html         # Homepage
    ├── app.js             # Frontend JavaScript
    ├── styles.css         # Styles
    └── qwer/              # Images
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

Copyright (c) 2025 Kiy0w0

## 👨‍💻 Author

Made by Kiy0w0

## 🔗 Links

- GitHub: [kiy0w0/qwerjs](https://github.com/kiy0w0/qwerjs)
- YouTube: [@qwer_band_official](https://www.youtube.com/@qwer_band_official)
- QWER Official: [qwer-official.com](https://qwer-official.com)

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

---

**Made with ❤️ for QWER fans** 🎸
