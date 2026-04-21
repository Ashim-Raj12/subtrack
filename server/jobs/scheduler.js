import cron from 'node-cron';

// Run daily at 2 PM (server time)
cron.schedule('0 14 * * *', () => {
  console.log('Running daily youtube fetch job at 2 PM...');
  // TODO: Fetch subscriptions and check for new videos
});
