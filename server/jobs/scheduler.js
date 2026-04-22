import cron from 'node-cron';
import User from '../models/User.js';
import { syncUserContent } from '../services/sync.service.js';

// Check every minute if any user needs a sync
cron.schedule('* * * * *', async () => {
  const now = new Date();
  const currentHHMM = now.toLocaleTimeString('en-US', { 
    hour12: false, 
    hour: '2-digit', 
    minute: '2-digit' 
  });

  try {
    // Find users whose scheduled time matches the current server time
    const usersToSync = await User.find({
      'settings.notificationsEnabled': true,
      'settings.notificationTime': currentHHMM
    });

    if (usersToSync.length > 0) {
      console.log(`[Scheduler] Found ${usersToSync.length} users to sync at ${currentHHMM}`);
      
      for (const user of usersToSync) {
        if (!user.youtubeAccessToken) {
          console.log(`[Scheduler] Skipping user ${user.email} - no youtubeAccessToken found.`);
          continue;
        }

        syncUserContent(user._id, user.youtubeAccessToken)
          .then(result => console.log(`[Scheduler] Auto-sync success for ${user.email}:`, result))
          .catch(err => console.error(`[Scheduler] Auto-sync failed for ${user.email}:`, err.message));
      }
    }
  } catch (err) {
    console.error('[Scheduler] Error scanning for users:', err);
  }
});

console.log('Dynamic User Scheduler initialized.');
