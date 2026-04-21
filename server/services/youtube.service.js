import axios from 'axios';

// Helper to parse YouTube ISO 8601 duration (e.g., PT1M5S) to seconds
const parseDuration = (duration) => {
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return 0;
  const hours = parseInt(match[1] || '0', 10);
  const minutes = parseInt(match[2] || '0', 10);
  const seconds = parseInt(match[3] || '0', 10);
  return (hours * 3600) + (minutes * 60) + seconds;
};

export const fetchUserSubscriptions = async (accessToken) => {
  const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
  
  try {
    const response = await axios.get('https://www.googleapis.com/youtube/v3/subscriptions', {
      params: {
        part: 'snippet',
        mine: true,
        maxResults: 50,
        key: YOUTUBE_API_KEY
      },
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });
    return response.data.items;
  } catch (err) {
    console.error('Error fetching youtube subscriptions:', err.response?.data || err.message);
    throw err;
  }
};

export const fetchChannelLatestVideos = async (channelId) => {
  const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
  const ONE_WEEK_AGO = new Date();
  ONE_WEEK_AGO.setDate(ONE_WEEK_AGO.getDate() - 7);

  try {
    // 1. Get channel playlist ID for uploads
    const channelRes = await axios.get('https://www.googleapis.com/youtube/v3/channels', {
      params: { part: 'contentDetails', id: channelId, key: YOUTUBE_API_KEY }
    });

    const uploadsPlaylistId = channelRes.data.items[0]?.contentDetails?.relatedPlaylists?.uploads;
    if (!uploadsPlaylistId) return [];

    // 2. Get 10 most recent videos from that playlist
    const playlistRes = await axios.get('https://www.googleapis.com/youtube/v3/playlistItems', {
      params: {
        part: 'snippet',
        playlistId: uploadsPlaylistId,
        maxResults: 10,
        key: YOUTUBE_API_KEY
      }
    });

    const recentVideos = playlistRes.data.items;
    if (!recentVideos || recentVideos.length === 0) return [];

    // 3. Filter by date (last 1 week)
    const candidates = recentVideos.filter(v => new Date(v.snippet.publishedAt) > ONE_WEEK_AGO);
    if (candidates.length === 0) return [];

    // 4. Fetch details to get durations (to filter Shorts)
    const videoIds = candidates.map(v => v.snippet.resourceId.videoId).join(',');
    const detailsRes = await axios.get('https://www.googleapis.com/youtube/v3/videos', {
      params: {
        part: 'contentDetails,snippet',
        id: videoIds,
        key: YOUTUBE_API_KEY
      }
    });

    const detailedVideos = detailsRes.data.items;
    
    // 5. Find the first video that is NOT a short (> 60s)
    // We sort by publishedAt descending to ensure we get the latest one
    const validVideo = detailedVideos
      .sort((a, b) => new Date(b.snippet.publishedAt).getTime() - new Date(a.snippet.publishedAt).getTime())
      .find(v => parseDuration(v.contentDetails.duration) > 60);

    if (validVideo) {
      // Map it to our expected format for the controller
      return [{
        snippet: {
          title: validVideo.snippet.title,
          publishedAt: validVideo.snippet.publishedAt,
          thumbnails: validVideo.snippet.thumbnails,
          resourceId: { videoId: validVideo.id }
        },
        contentDetails: validVideo.contentDetails
      }];
    }

    return [];
  } catch (err) {
    console.error('Error fetching channel videos:', err.response?.data || err.message);
    throw err;
  }
};

