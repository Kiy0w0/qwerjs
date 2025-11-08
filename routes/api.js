const express = require('express');
const router = express.Router();
const { QWERBandData } = require('../data');

// Helper function to create API response
const apiResponse = (success, message, data, meta = null) => {
  const response = { success, message, data };
  if (meta) response.meta = meta;
  return response;
};

// GET /api - API index and documentation
router.get('/', (req, res) => {
  const apiInfo = {
    name: "QWER Band API",
    version: "1.0.0",
    description: "REST API for QWER band information, members, songs, albums, and awards",
    band: "QWER (쿼터)",
    company: "Tamago Production",
    endpoints: {
      "GET /api": {
        description: "Get API information and available endpoints"
      },
      "GET /docs": {
        description: "OpenAPI (Swagger) spec rendered via ReDoc"
      },
      "GET /api/band": {
        description: "Get complete band information"
      },
      "GET /api/members": {
        description: "Get all members or specific member",
        parameters: {
          id: "Member ID (optional)",
          name: "Member name or stage name (optional)",
          search: "Search in name/stage/position (optional)",
          sort: "Sort by name|stage_name (optional)",
          page: "Page number (optional)",
          limit: "Page size (optional)"
        }
      },
      "GET /api/songs": {
        description: "Get all songs or specific song",
        parameters: {
          id: "Song ID (optional)",
          title: "Song title (optional)",
          album: "Album name (optional)",
          search: "Search in title/album/genre (optional)",
          sort: "Sort by title|album|date (optional)",
          page: "Page number (optional)",
          limit: "Page size (optional)"
        }
      },
      "GET /api/albums": {
        description: "Get all albums or specific album",
        parameters: {
          id: "Album ID (optional)",
          title: "Album title (optional)",
          search: "Search in title/type (optional)",
          sort: "Sort by title|date (optional)",
          page: "Page number (optional)",
          limit: "Page size (optional)"
        }
      },
      "GET /api/awards": {
        description: "Get awards with optional filters",
        parameters: {
          year: "Year (optional)",
          event: "Event name (optional)"
        }
      }
    },
    examples: {
      "Get band info": "/api/band",
      "Get all members": "/api/members",
      "Get member by name": "/api/members?name=chodan",
      "Get member by ID": "/api/members?id=1",
      "Get all songs": "/api/songs",
      "Search songs": "/api/songs?search=discord&sort=title&page=1&limit=10",
      "Get songs by album": "/api/songs?album=manito",
      "Get all albums": "/api/albums",
      "Search albums": "/api/albums?search=blossom&sort=date",
      "Get awards": "/api/awards?year=2024"
    }
  };

  res.json(apiResponse(true, "QWER Band API is running successfully", apiInfo));
});

// GET /api/band - Get complete band information
router.get('/band', (req, res) => {
  res.json(apiResponse(true, "Band information retrieved successfully", QWERBandData));
});

// GET /api/members - Get members with filters
router.get('/members', (req, res) => {
  const { id, name, search, sort, page = 1, limit = 50 } = req.query;

  // Get specific member by ID
  if (id) {
    const memberId = parseInt(id);
    const member = QWERBandData.members.find(m => m.id === memberId);
    if (member) {
      return res.json(apiResponse(true, "Member information retrieved successfully", member));
    }
    return res.status(404).json(apiResponse(false, "Member not found", null));
  }

  // Get specific member by name
  if (name) {
    const nameLower = name.toLowerCase();
    const member = QWERBandData.members.find(m => 
      m.stage_name.toLowerCase() === nameLower || m.name.toLowerCase() === nameLower
    );
    if (member) {
      return res.json(apiResponse(true, "Member information retrieved successfully", member));
    }
    return res.status(404).json(apiResponse(false, "Member not found", null));
  }

  // List all members with optional search and sort
  let list = [...QWERBandData.members];

  // Search filter
  if (search) {
    const searchLower = search.toLowerCase();
    list = list.filter(m =>
      m.name.toLowerCase().includes(searchLower) ||
      m.stage_name.toLowerCase().includes(searchLower) ||
      m.position.toLowerCase().includes(searchLower)
    );
  }

  // Sort
  if (sort === 'name' || sort === 'stage_name') {
    list.sort((a, b) => {
      const aVal = sort === 'name' ? a.name : a.stage_name;
      const bVal = sort === 'name' ? b.name : b.stage_name;
      return aVal.toLowerCase().localeCompare(bVal.toLowerCase());
    });
  }

  // Pagination
  const pageNum = Math.max(1, parseInt(page) || 1);
  const limitNum = Math.min(200, Math.max(1, parseInt(limit) || 50));
  const start = (pageNum - 1) * limitNum;
  const end = start + limitNum;
  const paged = list.slice(start, end);

  const meta = {
    total: QWERBandData.members.length,
    page: pageNum,
    limit: limitNum,
    total_pages: Math.ceil(QWERBandData.members.length / limitNum)
  };

  res.json(apiResponse(true, "Members retrieved successfully", paged, meta));
});

// GET /api/songs - Get songs with filters
router.get('/songs', (req, res) => {
  const { id, title, album, search, sort, page = 1, limit = 50 } = req.query;

  // Flatten all songs from all albums
  const allSongs = QWERBandData.discography.reduce((acc, album) => {
    return acc.concat(album.songs);
  }, []);

  // Get specific song by ID
  if (id) {
    const songId = parseInt(id);
    const song = allSongs.find(s => s.id === songId);
    if (song) {
      return res.json(apiResponse(true, "Song information retrieved successfully", song));
    }
    return res.status(404).json(apiResponse(false, "Song not found", null));
  }

  // Get specific song by title
  if (title && !search && !album) {
    const titleLower = title.toLowerCase();
    const song = allSongs.find(s => s.title.toLowerCase() === titleLower);
    if (song) {
      return res.json(apiResponse(true, "Song information retrieved successfully", song));
    }
    return res.status(404).json(apiResponse(false, "Song not found", null));
  }

  // List songs with filters
  let list = [...allSongs];

  // Album filter
  if (album) {
    const albumLower = album.toLowerCase();
    list = list.filter(s => s.album.toLowerCase().includes(albumLower));
  }

  // Search filter
  if (search) {
    const searchLower = search.toLowerCase();
    list = list.filter(s =>
      s.title.toLowerCase().includes(searchLower) ||
      s.album.toLowerCase().includes(searchLower) ||
      s.genre.toLowerCase().includes(searchLower)
    );
  }

  // Sort
  if (sort === 'title') {
    list.sort((a, b) => a.title.toLowerCase().localeCompare(b.title.toLowerCase()));
  } else if (sort === 'album') {
    list.sort((a, b) => a.album.toLowerCase().localeCompare(b.album.toLowerCase()));
  } else if (sort === 'date') {
    list.sort((a, b) => new Date(a.release_date) - new Date(b.release_date));
  }

  // Pagination
  const pageNum = Math.max(1, parseInt(page) || 1);
  const limitNum = Math.min(200, Math.max(1, parseInt(limit) || 50));
  const start = (pageNum - 1) * limitNum;
  const end = start + limitNum;
  const paged = list.slice(start, end);

  const meta = {
    total: allSongs.length,
    filtered: list.length,
    page: pageNum,
    limit: limitNum,
    total_pages: Math.ceil(list.length / limitNum)
  };

  res.json(apiResponse(true, "Songs retrieved successfully", paged, meta));
});

// GET /api/albums - Get albums with filters
router.get('/albums', (req, res) => {
  const { id, title, search, sort, page = 1, limit = 50 } = req.query;

  // Get specific album by ID
  if (id) {
    const albumId = parseInt(id);
    const album = QWERBandData.discography.find(a => a.id === albumId);
    if (album) {
      return res.json(apiResponse(true, "Album information retrieved successfully", album));
    }
    return res.status(404).json(apiResponse(false, "Album not found", null));
  }

  // Get specific album by title
  if (title && !search) {
    const titleLower = title.toLowerCase();
    const album = QWERBandData.discography.find(a => a.title.toLowerCase() === titleLower);
    if (album) {
      return res.json(apiResponse(true, "Album information retrieved successfully", album));
    }
    return res.status(404).json(apiResponse(false, "Album not found", null));
  }

  // List albums with filters
  let list = [...QWERBandData.discography];

  // Search filter
  if (search) {
    const searchLower = search.toLowerCase();
    list = list.filter(a =>
      a.title.toLowerCase().includes(searchLower) ||
      a.type.toLowerCase().includes(searchLower)
    );
  }

  // Sort
  if (sort === 'title') {
    list.sort((a, b) => a.title.toLowerCase().localeCompare(b.title.toLowerCase()));
  } else if (sort === 'date') {
    list.sort((a, b) => new Date(a.release_date) - new Date(b.release_date));
  }

  // Pagination
  const pageNum = Math.max(1, parseInt(page) || 1);
  const limitNum = Math.min(200, Math.max(1, parseInt(limit) || 50));
  const start = (pageNum - 1) * limitNum;
  const end = start + limitNum;
  const paged = list.slice(start, end);

  const meta = {
    total: QWERBandData.discography.length,
    filtered: list.length,
    page: pageNum,
    limit: limitNum,
    total_pages: Math.ceil(list.length / limitNum)
  };

  res.json(apiResponse(true, "Albums retrieved successfully", paged, meta));
});

// GET /api/awards - Get awards with filters
router.get('/awards', (req, res) => {
  const { year, event } = req.query;

  let list = [...QWERBandData.awards];

  // Year filter
  if (year) {
    const yearNum = parseInt(year);
    list = list.filter(a => a.year === yearNum);
  }

  // Event filter
  if (event) {
    const eventLower = event.toLowerCase();
    list = list.filter(a => a.event.toLowerCase().includes(eventLower));
  }

  const meta = {
    total: QWERBandData.awards.length,
    filtered: list.length
  };

  res.json(apiResponse(true, "Awards retrieved successfully", list, meta));
});

module.exports = router;

