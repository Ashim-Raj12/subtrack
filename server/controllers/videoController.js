import Video from '../models/Video.js';
import Subscription from '../models/Subscription.js';

export const getDashboardVideos = async (req, res) => {
  try {
    // 1. Get all channel IDs user is subscribed to
    const subs = await Subscription.find({ userId: req.user._id }).select('channelId channelName avatarUrl');
    const channelIds = subs.map(sub => sub.channelId);

    // 2. Fetch latest videos for these channels (last 24 hours ideally, but let's say limit 20 for now)
    const videos = await Video.find({ channelId: { $in: channelIds } })
      .sort({ publishedAt: -1 })
      .limit(50);

    // Combine video with avatarUrl and channelTitle
    const videosWithAvatar = videos.map(video => {
      const sub = subs.find(s => s.channelId === video.channelId);
      return {
        ...video.toObject(),
        avatarUrl: sub?.avatarUrl,
        channelTitle: sub?.channelName
      };
    });

    res.status(200).json(videosWithAvatar);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching videos', error: error.message });
  }
};
