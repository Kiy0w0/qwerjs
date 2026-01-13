const express = require('express');
const router = express.Router();
const { QWERBandData } = require('../data');
const googleImages = require('../services/googleImages');

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
    version: "1.2.0",
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
      },
      "GET /api/images": {
        description: "Get all available images",
        parameters: {
          type: "Filter by type: album, group, logo (optional)"
        }
      },
      "GET /api/images/random": {
        description: "Get a random image",
        parameters: {
          type: "Filter by type (optional)"
        }
      },
      "GET /api/images/albums": {
        description: "Get album cover images only"
      },
      "GET /api/random": {
        description: "Get a random song with album info"
      },
      "GET /api/random/member": {
        description: "Get a random member"
      },
      "GET /api/random/album": {
        description: "Get a random album"
      },
      "GET /api/random/fact": {
        description: "Get a random fun fact about a member"
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
      "Get awards": "/api/awards?year=2024",
      "Random song": "/api/random",
      "Random member": "/api/random/member",
      "Random fact": "/api/random/fact",
      "All images": "/api/images",
      "Random image": "/api/images/random",
      "Album covers only": "/api/images/albums"
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

// ============================================
// 🖼️ IMAGE ENDPOINTS
// ============================================

// Available images data
const availableImages = {
  albums: [
    { id: 1, name: "MANITO", path: "/qwer/manito.jpeg", type: "album" },
    { id: 2, name: "Harmony from Discord", path: "/qwer/harmonyfromdiscord.jpeg", type: "album" },
    { id: 3, name: "Discord (TAK Remix)", path: "/qwer/discordtakremix.jpeg", type: "album" },
    { id: 4, name: "FAKE IDOL", path: "/qwer/fake idol.jpeg", type: "album" },
    { id: 5, name: "Algorithm's Blossom", path: "/qwer/algorithmblossom.jpeg", type: "album" },
    { id: 6, name: "In a Million Noises", path: "/qwer/inamillionnoises.jpeg", type: "album" },
    { id: 7, name: "Youth Promise", path: "/qwer/youthpromise.jpeg", type: "album" },
    { id: 8, name: "Discord (Japanese Ver.)", path: "/qwer/discordjapanesever.jpeg", type: "album" }
  ],
  group: [
    { id: 100, name: "QWER Group Photo", path: "/qwer/group.webp", type: "group" },
    { id: 101, name: "QWER Logo", path: "/qwer/qwerlogo.png", type: "logo" }
  ]
};

// GET /api/images - Get all available images
router.get('/images', (req, res) => {
  const { type } = req.query;

  let allImages = [...availableImages.albums, ...availableImages.group];

  if (type) {
    allImages = allImages.filter(img => img.type === type.toLowerCase());
  }

  const meta = {
    total: allImages.length,
    types: ["album", "group", "logo"]
  };

  res.json(apiResponse(true, "Images retrieved successfully", allImages, meta));
});

// GET /api/images/random - Get a random image
router.get('/images/random', (req, res) => {
  const { type } = req.query;

  let allImages = [...availableImages.albums, ...availableImages.group];

  if (type) {
    allImages = allImages.filter(img => img.type === type.toLowerCase());
  }

  if (allImages.length === 0) {
    return res.status(404).json(apiResponse(false, "No images found for this type", null));
  }

  const randomIndex = Math.floor(Math.random() * allImages.length);
  const randomImage = allImages[randomIndex];

  res.json(apiResponse(true, "Random image retrieved successfully", randomImage));
});

// GET /api/images/albums - Get album cover images only
router.get('/images/albums', (req, res) => {
  res.json(apiResponse(true, "Album images retrieved successfully", availableImages.albums, {
    total: availableImages.albums.length
  }));
});

// ============================================
// 🎲 RANDOM ENDPOINTS
// ============================================

// GET /api/random - Get random song
router.get('/random', (req, res) => {
  const allSongs = QWERBandData.discography.reduce((acc, album) => {
    return acc.concat(album.songs);
  }, []);

  const randomIndex = Math.floor(Math.random() * allSongs.length);
  const randomSong = allSongs[randomIndex];

  // Find album info for the song
  const album = QWERBandData.discography.find(a => a.title === randomSong.album);

  const enrichedSong = {
    ...randomSong,
    album_cover: album?.cover_image || null,
    album_type: album?.type || null
  };

  res.json(apiResponse(true, "Random song retrieved successfully! 🎵", enrichedSong));
});

// GET /api/random/member - Get random member
router.get('/random/member', (req, res) => {
  const randomIndex = Math.floor(Math.random() * QWERBandData.members.length);
  const randomMember = QWERBandData.members[randomIndex];

  res.json(apiResponse(true, "Random member retrieved successfully! 🎸", randomMember));
});

// GET /api/random/album - Get random album
router.get('/random/album', (req, res) => {
  const randomIndex = Math.floor(Math.random() * QWERBandData.discography.length);
  const randomAlbum = QWERBandData.discography[randomIndex];

  res.json(apiResponse(true, "Random album retrieved successfully! 💿", randomAlbum));
});

// GET /api/random/fact - Get random fun fact about a member
router.get('/random/fact', (req, res) => {
  const randomMemberIndex = Math.floor(Math.random() * QWERBandData.members.length);
  const member = QWERBandData.members[randomMemberIndex];
  const randomFactIndex = Math.floor(Math.random() * member.facts.length);

  const fact = {
    member: member.stage_name,
    member_name: member.name,
    fact: member.facts[randomFactIndex]
  };

  res.json(apiResponse(true, "Random fact retrieved successfully! ✨", fact));
});

// ============================================
// 📸 GOOGLE IMAGE SEARCH ENDPOINTS
// ============================================

// GET /api/members/:name/photos - Get photos of a specific member from Google
router.get('/members/:name/photos', async (req, res) => {
  const memberName = req.params.name.toLowerCase();
  const forceRefresh = req.query.refresh === 'true';

  // Validate member name
  const validMembers = ['chodan', 'magenta', 'hina', 'siyeon'];
  if (!validMembers.includes(memberName)) {
    return res.status(404).json(apiResponse(false, `Member '${memberName}' not found. Valid members: ${validMembers.join(', ')}`, null));
  }

  try {
    const result = await googleImages.getMemberPhotos(memberName, forceRefresh);

    if (result.success) {
      res.json(apiResponse(true, result.message, result.data));
    } else {
      res.status(404).json(apiResponse(false, result.message, null));
    }
  } catch (error) {
    res.status(500).json(apiResponse(false, 'Error fetching photos: ' + error.message, null));
  }
});

// GET /api/members/:name/photos/random - Get a random photo of a member
router.get('/members/:name/photos/random', async (req, res) => {
  const memberName = req.params.name.toLowerCase();

  const validMembers = ['chodan', 'magenta', 'hina', 'siyeon'];
  if (!validMembers.includes(memberName)) {
    return res.status(404).json(apiResponse(false, `Member '${memberName}' not found`, null));
  }

  try {
    const result = await googleImages.getRandomMemberPhoto(memberName);

    if (result.success) {
      res.json(apiResponse(true, result.message, result.data));
    } else {
      res.status(404).json(apiResponse(false, result.message, null));
    }
  } catch (error) {
    res.status(500).json(apiResponse(false, 'Error fetching photo: ' + error.message, null));
  }
});

// GET /api/photos/refresh - Refresh all member photos from Google
router.get('/photos/refresh', async (req, res) => {
  try {
    const result = await googleImages.refreshAllMemberPhotos();
    res.json(apiResponse(true, result.message, result.data));
  } catch (error) {
    res.status(500).json(apiResponse(false, 'Error refreshing photos: ' + error.message, null));
  }
});

// GET /api/photos/status - Get cache status for all members
router.get('/photos/status', (req, res) => {
  const status = googleImages.getCacheStatus();
  res.json(apiResponse(true, 'Cache status retrieved', status));
});

module.exports = router;

