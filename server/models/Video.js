import mongoose from 'mongoose';

const videoSchema = new mongoose.Schema({
  youtubeVideoId: { type: String, required: true, unique: true },
  channelId: { type: String, required: true },
  title: { type: String, required: true },
  publishedAt: { type: Date, required: true },
  thumbnailUrl: { type: String },
  duration: { type: String }
}, { timestamps: true });

// We often query by channelId or publishedAt
videoSchema.index({ channelId: 1, publishedAt: -1 });

export default mongoose.model('Video', videoSchema);
