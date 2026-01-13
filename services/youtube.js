// YouTube Data API Service for QWER Videos
const https = require('https');

// Configuration - Uses same Google API key
const YOUTUBE_API_KEY = process.env.GOOGLE_API_KEY || 'AIzaSyDXJRiJL3fBY4jwopY40G0FU2virdWqie8';

// QWER Official YouTube Channel ID
const QWER_CHANNEL_ID = 'UC7V9v01SXZWqmxPIoHgyBcg'; // @QWER_official

// Video categories/playlists
const videoCategories = {
    mv: 'Music Video',
    performance: 'Performance',
    behind: 'Behind the Scenes',
    variety: 'Variety',
    cover: 'Cover',
    all: 'All Videos'
};

// Cache for storing fetched videos
const videoCache = {
    videos: [],
    lastUpdated: null,
    cacheHours: 6
};

/**
 * Make YouTube API request
 * @param {string} endpoint - API endpoint path
 * @returns {Promise<Object>} - API response
 */
function youtubeApiRequest(endpoint) {
    return new Promise((resolve, reject) => {
        const url = `https://www.googleapis.com/youtube/v3${endpoint}&key=${YOUTUBE_API_KEY}`;

        https.get(url, (res) => {
            let data = '';

            res.on('data', (chunk) => {
                data += chunk;
            });

            res.on('end', () => {
                try {
                    const parsed = JSON.parse(data);

                    if (parsed.error) {
                        console.error('YouTube API Error:', parsed.error.message);
                        resolve({ error: parsed.error });
                        return;
                    }

                    resolve(parsed);
                } catch (e) {
                    console.error('Parse error:', e.message);
                    resolve({ error: { message: e.message } });
                }
            });
        }).on('error', (e) => {
            console.error('Request error:', e.message);
            resolve({ error: { message: e.message } });
        });
    });
}

/**
 * Search QWER videos on YouTube
 * @param {string} query - Search query
 * @param {number} maxResults - Maximum results (default 10)
 * @returns {Promise<Array>} - Array of video objects
 */
async function searchVideos(query = 'QWER 쿼터', maxResults = 10) {
    const searchQuery = encodeURIComponent(query);
    const endpoint = `/search?part=snippet&q=${searchQuery}&type=video&maxResults=${maxResults}&order=date`;

    const response = await youtubeApiRequest(endpoint);

    if (response.error) {
        return [];
    }

    return (response.items || []).map(item => ({
        id: item.id.videoId,
        title: item.snippet.title,
        description: item.snippet.description,
        thumbnail: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.default?.url,
        channelTitle: item.snippet.channelTitle,
        publishedAt: item.snippet.publishedAt,
        url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
        embedUrl: `https://www.youtube.com/embed/${item.id.videoId}`
    }));
}

/**
 * Get videos from QWER official channel
 * Uses search as primary method for reliability
 * @param {number} maxResults - Maximum results
 * @returns {Promise<Array>} - Array of video objects
 */
async function getChannelVideos(maxResults = 20) {
    // Try to get from channel first
    const channelEndpoint = `/channels?part=contentDetails&id=${QWER_CHANNEL_ID}`;
    const channelResponse = await youtubeApiRequest(channelEndpoint);

    if (channelResponse.error || !channelResponse.items?.length) {
        // YouTube API might not be enabled or channel ID is wrong
        // Use search instead - more reliable
        console.log('Channel lookup failed, using search fallback...');
        return searchVideos('QWER 쿼터 official', maxResults);
    }

    const uploadsPlaylistId = channelResponse.items[0].contentDetails.relatedPlaylists.uploads;

    // Get videos from uploads playlist
    const playlistEndpoint = `/playlistItems?part=snippet,contentDetails&playlistId=${uploadsPlaylistId}&maxResults=${maxResults}`;
    const playlistResponse = await youtubeApiRequest(playlistEndpoint);

    if (playlistResponse.error || !playlistResponse.items?.length) {
        // Fallback to search
        console.log('Playlist lookup failed, using search fallback...');
        return searchVideos('QWER 쿼터 official', maxResults);
    }

    return (playlistResponse.items || []).map(item => ({
        id: item.contentDetails.videoId,
        title: item.snippet.title,
        description: item.snippet.description,
        thumbnail: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.default?.url,
        channelTitle: item.snippet.channelTitle,
        publishedAt: item.snippet.publishedAt,
        position: item.snippet.position,
        url: `https://www.youtube.com/watch?v=${item.contentDetails.videoId}`,
        embedUrl: `https://www.youtube.com/embed/${item.contentDetails.videoId}`
    }));
}

/**
 * Get video details by ID
 * @param {string} videoId - YouTube video ID
 * @returns {Promise<Object>} - Video details
 */
async function getVideoDetails(videoId) {
    const endpoint = `/videos?part=snippet,statistics,contentDetails&id=${videoId}`;
    const response = await youtubeApiRequest(endpoint);

    if (response.error || !response.items?.length) {
        return null;
    }

    const video = response.items[0];

    return {
        id: video.id,
        title: video.snippet.title,
        description: video.snippet.description,
        thumbnail: video.snippet.thumbnails.maxres?.url || video.snippet.thumbnails.high?.url,
        channelTitle: video.snippet.channelTitle,
        publishedAt: video.snippet.publishedAt,
        duration: video.contentDetails.duration,
        viewCount: parseInt(video.statistics.viewCount) || 0,
        likeCount: parseInt(video.statistics.likeCount) || 0,
        commentCount: parseInt(video.statistics.commentCount) || 0,
        tags: video.snippet.tags || [],
        url: `https://www.youtube.com/watch?v=${video.id}`,
        embedUrl: `https://www.youtube.com/embed/${video.id}`
    };
}

/**
 * Get all QWER videos (with caching)
 * @param {string} type - Video type filter (mv, performance, behind, etc.)
 * @param {boolean} forceRefresh - Force refresh from API
 * @returns {Promise<Object>} - Videos data
 */
async function getQWERVideos(type = 'all', forceRefresh = false) {
    const cache = videoCache;
    const cacheAge = cache.lastUpdated ? (Date.now() - cache.lastUpdated) / 1000 / 60 / 60 : Infinity;

    // Return cached if valid
    if (!forceRefresh && cache.videos.length > 0 && cacheAge < cache.cacheHours) {
        let filteredVideos = cache.videos;

        // Filter by type if specified
        if (type !== 'all') {
            const typeKeywords = {
                mv: ['MV', 'Music Video', 'Official Video', 'M/V'],
                performance: ['Performance', 'Live', 'Stage', 'Showcase', 'Concert'],
                behind: ['Behind', 'Making', 'Vlog', 'BTS'],
                variety: ['Variety', 'Interview', 'Talk'],
                cover: ['Cover', 'Remix']
            };

            const keywords = typeKeywords[type] || [];
            filteredVideos = cache.videos.filter(v =>
                keywords.some(kw => v.title.toLowerCase().includes(kw.toLowerCase()))
            );
        }

        return {
            success: true,
            message: 'Videos retrieved from cache',
            data: {
                videos: filteredVideos,
                total: filteredVideos.length,
                type: type,
                cached: true,
                cache_age_hours: Math.round(cacheAge * 10) / 10,
                last_updated: new Date(cache.lastUpdated).toISOString()
            }
        };
    }

    // Fetch new videos using search (more reliable than channel lookup)
    try {
        console.log('Fetching QWER videos from YouTube via search...');
        const videos = await searchVideos('QWER band', 25);

        if (videos.length > 0) {
            // Update cache
            videoCache.videos = videos;
            videoCache.lastUpdated = Date.now();

            let filteredVideos = videos;

            // Filter by type if specified
            if (type !== 'all') {
                const typeKeywords = {
                    mv: ['MV', 'Music Video', 'Official Video', 'M/V'],
                    performance: ['Performance', 'Live', 'Stage', 'Showcase', 'Concert'],
                    behind: ['Behind', 'Making', 'Vlog', 'BTS'],
                    variety: ['Variety', 'Interview', 'Talk'],
                    cover: ['Cover', 'Remix']
                };

                const keywords = typeKeywords[type] || [];
                filteredVideos = videos.filter(v =>
                    keywords.some(kw => v.title.toLowerCase().includes(kw.toLowerCase()))
                );
            }

            return {
                success: true,
                message: 'Videos fetched from YouTube',
                data: {
                    videos: filteredVideos,
                    total: filteredVideos.length,
                    type: type,
                    cached: false,
                    last_updated: new Date().toISOString()
                }
            };
        }

        return {
            success: false,
            message: 'No videos found',
            data: null
        };
    } catch (error) {
        console.error('Error fetching videos:', error);
        return {
            success: false,
            message: 'Error fetching videos: ' + error.message,
            data: null
        };
    }
}

/**
 * Get a random QWER video
 * @param {string} type - Video type filter
 * @returns {Promise<Object>} - Random video
 */
async function getRandomVideo(type = 'all') {
    const result = await getQWERVideos(type);

    if (!result.success || !result.data || result.data.videos.length === 0) {
        return result;
    }

    const randomIndex = Math.floor(Math.random() * result.data.videos.length);
    const randomVideo = result.data.videos[randomIndex];

    return {
        success: true,
        message: 'Random video retrieved successfully 🎬',
        data: {
            video: randomVideo,
            type: type
        }
    };
}

/**
 * Get video cache status
 * @returns {Object} - Cache status
 */
function getVideoCacheStatus() {
    const cacheAge = videoCache.lastUpdated ? (Date.now() - videoCache.lastUpdated) / 1000 / 60 / 60 : null;

    return {
        cached_count: videoCache.videos.length,
        last_updated: videoCache.lastUpdated ? new Date(videoCache.lastUpdated).toISOString() : null,
        age_hours: cacheAge ? Math.round(cacheAge * 10) / 10 : null,
        is_stale: cacheAge === null || cacheAge > videoCache.cacheHours
    };
}

module.exports = {
    searchVideos,
    getChannelVideos,
    getVideoDetails,
    getQWERVideos,
    getRandomVideo,
    getVideoCacheStatus,
    videoCategories
};
