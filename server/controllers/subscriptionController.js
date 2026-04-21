import Subscription from '../models/Subscription.js';
import Video from '../models/Video.js';
// Mock import for real youtube data service
import { fetchUserSubscriptions, fetchChannelLatestVideos } from '../services/youtube.service.js';
export const getSubscriptions = async (req, res) => {
  try {
    const subs = await Subscription.find({ userId: req.user._id }).sort({ channelName: 1 });
    res.status(200).json(subs);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching subscriptions', error: error.message });
  }
};

export const syncSubscriptions = async (req, res) => {
  try {
    const { accessToken } = req.body;
    if (!accessToken) {
      return res.status(400).json({ message: 'Access token required for YouTube API' });
    }

    const items = await fetchUserSubscriptions(accessToken);
    let syncedCount = 0;

    for (const item of items) {
      const channelId = item.snippet.resourceId.channelId;
      const channelName = item.snippet.title;
      const avatarUrl = item.snippet.thumbnails?.default?.url;

      try {
        await Subscription.findOneAndUpdate(
          { userId: req.user._id, channelId },
          { channelName, avatarUrl },
          { upsert: true, returnDocument: 'after' }
        );
        syncedCount++;
      } catch (err) {
        // likely duplicate key error, safe to ignore per item
      }
    }

    // Kick off background sync for latest videos for these channels
    setTimeout(async () => {
      console.log('Background video sync started for user:', req.user._id);
      
      // Optional: Clear all existing videos for this user to ensure complete fresh slate
      // await Video.deleteMany({ channelId: { $in: items.map(i => i.snippet.resourceId.channelId) } });

      for (const item of items) {
        const channelId = item.snippet.resourceId.channelId;
        try {
          // Fetch only 1 valid video (service now handles Shorts and 1-week filter)
          const videos = await fetchChannelLatestVideos(channelId);
          
          // Enforce 1 video per channel by deleting any existing ones first
          await Video.deleteMany({ channelId: channelId });

          for (const v of videos) {
            const videoId = v.snippet.resourceId?.videoId;
            if (!videoId) continue;
            
            await Video.findOneAndUpdate(
              { youtubeVideoId: videoId },
              {
                youtubeVideoId: videoId,
                channelId: channelId,
                title: v.snippet.title,
                thumbnailUrl: v.snippet.thumbnails?.high?.url || v.snippet.thumbnails?.default?.url,
                publishedAt: new Date(v.snippet.publishedAt),
                duration: v.contentDetails?.duration // Now available
              },
              { upsert: true, returnDocument: 'after' }
            );
          }
        } catch (e) {
          console.error('Failed to sync videos for channel:', channelId, e.message);
        }
      }
      console.log('Background video sync completed for user:', req.user._id);
    }, 0);

    res.status(200).json({ message: `Synced ${syncedCount} subscriptions successfully. Videos are syncing in the background.` });
  } catch (error) {
    res.status(500).json({ message: 'Error syncing subscriptions', error: error.message });
  }
};
