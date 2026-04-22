import Subscription from '../models/Subscription.js';
import Video from '../models/Video.js';
import User from '../models/User.js';
import { fetchUserSubscriptions, fetchChannelLatestVideos } from './youtube.service.js';
import { sendNotificationEmail } from '../utils/emailService.js';

/**
 * Main sync logic for a single user
 * @param {string} userId - Mongo User ID
 * @param {string} accessToken - YouTube Access Token
 */
export const syncUserContent = async (userId, accessToken) => {
  try {
    const user = await User.findById(userId);
    if (!user) throw new Error('User not found');

    console.log(`Starting sync for user: ${user.email}`);

    // 1. Sync Subscriptions
    const items = await fetchUserSubscriptions(accessToken);
    let syncedSubs = 0;

    for (const item of items) {
      const channelId = item.snippet.resourceId.channelId;
      const channelName = item.snippet.title;
      const avatarUrl = item.snippet.thumbnails?.default?.url;

      await Subscription.findOneAndUpdate(
        { userId, channelId },
        { channelName, avatarUrl },
        { upsert: true }
      );
      syncedSubs++;
    }

    // 2. Sync Latest Videos (1 per channel, non-shorts, last 7 days)
    let newVideosFound = 0;
    const videoList = [];

    for (const item of items) {
      const channelId = item.snippet.resourceId.channelId;
      try {
        const videos = await fetchChannelLatestVideos(channelId);
        
        // fetchChannelLatestVideos already returns the single best video for the channel
        for (const v of videos) {
          const videoId = v.snippet.resourceId?.videoId;
          if (!videoId) continue;
          
          // Enforce 1 video per channel rule
          await Video.deleteMany({ userId, channelId: channelId });

          const savedVideo = await Video.findOneAndUpdate(
            { youtubeVideoId: videoId, userId },
            {
              youtubeVideoId: videoId,
              userId,
              channelId: channelId,
              channelTitle: v.snippet.channelTitle || item.snippet.title,
              avatarUrl: item.snippet.thumbnails?.default?.url,
              title: v.snippet.title,
              thumbnailUrl: v.snippet.thumbnails?.high?.url || v.snippet.thumbnails?.default?.url,
              publishedAt: new Date(v.snippet.publishedAt),
              duration: v.contentDetails?.duration
            },
            { upsert: true, new: true }
          );
          
          if (savedVideo) {
            newVideosFound++;
            videoList.push(savedVideo);
          }
        }
      } catch (e) {
        console.error(`Failed to sync channel ${channelId}:`, e.message);
      }
    }

    // 3. Auto-Cleanup: Delete videos older than 7 days for this user
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const deleteResult = await Video.deleteMany({ 
      userId, 
      publishedAt: { $lt: sevenDaysAgo } 
    });
    console.log(`Cleaned up ${deleteResult.deletedCount} old videos.`);

    // 4. Send Email Notification
    if (user.settings?.notificationsEnabled) {
      const subject = `Your SubTrack Feed is Ready! (${newVideosFound} New Videos)`;
      let videoRows = videoList.map(v => `<li><b>${v.channelTitle}</b>: ${v.title}</li>`).join('');
      
      const html = `
        <div style="font-family: sans-serif; color: #333;">
          <h2>Your curated updates are here!</h2>
          <p>We found ${newVideosFound} new long-form videos from your subscriptions in the last 24 hours.</p>
          <ul>${videoRows || '<li>No new videos found today.</li>'}</ul>
          <p>Check your <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/dashboard">Dashboard</a> to watch now.</p>
        </div>
      `;
      
      const text = `Your SubTrack feed is ready! We found ${newVideosFound} new videos. Check your dashboard: ${process.env.FRONTEND_URL || 'http://localhost:5173'}/dashboard`;
      
      await sendNotificationEmail(user.email, subject, text, html);
    }

    return { success: true, syncedSubs, newVideosFound };
  } catch (err) {
    console.error(`Sync error for user ${userId}:`, err.message);
    throw err;
  }
};
