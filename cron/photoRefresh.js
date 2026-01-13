// Cron job endpoint for scheduled photo refresh
// This file handles Vercel Cron jobs

const googleImages = require('../services/googleImages');

/**
 * Handler for Vercel Cron - Auto refresh member photos
 * Runs every 6 hours to update the photo cache
 */
async function handlePhotoRefreshCron(req, res) {
    // Verify cron secret (optional security)
    const cronSecret = process.env.CRON_SECRET;
    const authHeader = req.headers.authorization;

    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
        console.log('Cron: Unauthorized request');
        return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    console.log('🕐 Cron: Starting scheduled photo refresh...');
    const startTime = Date.now();

    try {
        const result = await googleImages.refreshAllMemberPhotos();
        const duration = ((Date.now() - startTime) / 1000).toFixed(2);

        console.log(`✅ Cron: Photo refresh completed in ${duration}s`);
        console.log('   Results:', JSON.stringify(result.data));

        res.status(200).json({
            success: true,
            message: 'Scheduled photo refresh completed',
            data: result.data,
            duration_seconds: parseFloat(duration),
            next_run: 'in 6 hours'
        });
    } catch (error) {
        console.error('❌ Cron: Photo refresh failed:', error.message);

        res.status(500).json({
            success: false,
            message: 'Photo refresh failed: ' + error.message
        });
    }
}

module.exports = { handlePhotoRefreshCron };
