// Google Custom Search Service for QWER Member Photos
const https = require('https');

// Configuration - Set these in environment variables or directly here
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY || 'AIzaSyDXJRiJL3fBY4jwopY40G0FU2virdWqie8';
const GOOGLE_CX = process.env.GOOGLE_CX || '943675e636d7e4f6f';

// Cache for storing fetched images (in-memory cache)
const imageCache = {
    chodan: { images: [], lastUpdated: null },
    magenta: { images: [], lastUpdated: null },
    hina: { images: [], lastUpdated: null },
    siyeon: { images: [], lastUpdated: null }
};

// Search queries for each member
const memberSearchQueries = {
    chodan: ['QWER Chodan 초단', 'QWER 홍지혜 Chodan', 'QWER band Chodan'],
    magenta: ['QWER Magenta 마젠타', 'QWER 이아희 Magenta', 'QWER band Magenta'],
    hina: ['QWER Hina 히나', 'QWER 장나영 Hina', 'QWER band Hina'],
    siyeon: ['QWER Siyeon 시연', 'QWER 이시연 Siyeon drummer', 'QWER band Siyeon']
};

/**
 * Fetch images from Google Custom Search API
 * @param {string} query - Search query
 * @param {number} num - Number of results (max 10)
 * @returns {Promise<Array>} - Array of image objects
 */
function fetchGoogleImages(query, num = 10) {
    return new Promise((resolve, reject) => {
        const encodedQuery = encodeURIComponent(query);
        const url = `https://www.googleapis.com/customsearch/v1?key=${GOOGLE_API_KEY}&cx=${GOOGLE_CX}&q=${encodedQuery}&searchType=image&num=${num}&safe=active`;

        https.get(url, (res) => {
            let data = '';

            res.on('data', (chunk) => {
                data += chunk;
            });

            res.on('end', () => {
                try {
                    const parsed = JSON.parse(data);

                    if (parsed.error) {
                        console.error('Google API Error:', parsed.error.message);
                        resolve([]);
                        return;
                    }

                    const images = (parsed.items || []).map(item => ({
                        url: item.link,
                        thumbnail: item.image?.thumbnailLink || item.link,
                        title: item.title,
                        source: item.displayLink,
                        width: item.image?.width,
                        height: item.image?.height
                    }));

                    resolve(images);
                } catch (e) {
                    console.error('Parse error:', e.message);
                    resolve([]);
                }
            });
        }).on('error', (e) => {
            console.error('Request error:', e.message);
            resolve([]);
        });
    });
}

/**
 * Get member photos (from cache or fetch new)
 * @param {string} memberName - Member stage name (lowercase)
 * @param {boolean} forceRefresh - Force refresh from API
 * @returns {Promise<Object>} - Member photos data
 */
async function getMemberPhotos(memberName, forceRefresh = false) {
    const member = memberName.toLowerCase();

    if (!imageCache[member]) {
        return { success: false, message: 'Member not found', data: null };
    }

    const cache = imageCache[member];
    const cacheAge = cache.lastUpdated ? (Date.now() - cache.lastUpdated) / 1000 / 60 / 60 : Infinity; // hours

    // Return cached if less than 6 hours old and not forcing refresh
    if (!forceRefresh && cache.images.length > 0 && cacheAge < 6) {
        return {
            success: true,
            message: 'Photos retrieved from cache',
            data: {
                member: member,
                images: cache.images,
                total: cache.images.length,
                cached: true,
                cache_age_hours: Math.round(cacheAge * 10) / 10,
                last_updated: new Date(cache.lastUpdated).toISOString()
            }
        };
    }

    // Fetch new images
    try {
        const queries = memberSearchQueries[member];
        const randomQuery = queries[Math.floor(Math.random() * queries.length)];

        console.log(`Fetching photos for ${member} with query: "${randomQuery}"`);

        const images = await fetchGoogleImages(randomQuery, 10);

        if (images.length > 0) {
            // Update cache
            imageCache[member] = {
                images: images,
                lastUpdated: Date.now()
            };

            return {
                success: true,
                message: 'Photos fetched successfully from Google',
                data: {
                    member: member,
                    images: images,
                    total: images.length,
                    cached: false,
                    query_used: randomQuery,
                    last_updated: new Date().toISOString()
                }
            };
        } else {
            // Return old cache if available
            if (cache.images.length > 0) {
                return {
                    success: true,
                    message: 'Using cached photos (API returned no results)',
                    data: {
                        member: member,
                        images: cache.images,
                        total: cache.images.length,
                        cached: true,
                        last_updated: cache.lastUpdated ? new Date(cache.lastUpdated).toISOString() : null
                    }
                };
            }

            return {
                success: false,
                message: 'No photos found',
                data: null
            };
        }
    } catch (error) {
        console.error('Error fetching photos:', error);
        return {
            success: false,
            message: 'Error fetching photos: ' + error.message,
            data: null
        };
    }
}

/**
 * Get random photo of a member
 * @param {string} memberName - Member stage name
 * @returns {Promise<Object>} - Random photo
 */
async function getRandomMemberPhoto(memberName) {
    const result = await getMemberPhotos(memberName);

    if (!result.success || !result.data || result.data.images.length === 0) {
        return result;
    }

    const randomIndex = Math.floor(Math.random() * result.data.images.length);
    const randomPhoto = result.data.images[randomIndex];

    return {
        success: true,
        message: 'Random photo retrieved successfully',
        data: {
            member: memberName.toLowerCase(),
            photo: randomPhoto,
            cached: result.data.cached
        }
    };
}

/**
 * Refresh all member photos
 * @returns {Promise<Object>} - Refresh status
 */
async function refreshAllMemberPhotos() {
    const results = {};
    const members = Object.keys(imageCache);

    for (const member of members) {
        const result = await getMemberPhotos(member, true);
        results[member] = {
            success: result.success,
            count: result.data?.total || 0
        };

        // Small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 500));
    }

    return {
        success: true,
        message: 'All member photos refreshed',
        data: results,
        refreshed_at: new Date().toISOString()
    };
}

/**
 * Get cache status
 * @returns {Object} - Cache status for all members
 */
function getCacheStatus() {
    const status = {};

    for (const [member, cache] of Object.entries(imageCache)) {
        const cacheAge = cache.lastUpdated ? (Date.now() - cache.lastUpdated) / 1000 / 60 / 60 : null;

        status[member] = {
            cached_count: cache.images.length,
            last_updated: cache.lastUpdated ? new Date(cache.lastUpdated).toISOString() : null,
            age_hours: cacheAge ? Math.round(cacheAge * 10) / 10 : null,
            is_stale: cacheAge === null || cacheAge > 6
        };
    }

    return status;
}

module.exports = {
    getMemberPhotos,
    getRandomMemberPhoto,
    refreshAllMemberPhotos,
    getCacheStatus,
    fetchGoogleImages
};
