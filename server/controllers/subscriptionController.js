import Subscription from '../models/Subscription.js';
import Video from '../models/Video.js';
import { syncUserContent } from '../services/sync.service.js';

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

    // Run in background and respond immediately
    syncUserContent(req.user._id, accessToken)
      .then(result => console.log('Manual sync completed:', result))
      .catch(err => console.error('Manual sync failed:', err));

    res.status(200).json({ message: `Sync started! Check your dashboard and email in a few moments.` });
  } catch (error) {
    res.status(500).json({ message: 'Error initiating sync', error: error.message });
  }
};
