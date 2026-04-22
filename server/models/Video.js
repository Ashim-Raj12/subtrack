import mongoose from 'mongoose';

const videoSchema = new mongoose.Schema({
  youtubeVideoId: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  channelId: { type: String, required: true },
  channelTitle: { type: String },
  avatarUrl: { type: String },
  title: { type: String, required: true },
  publishedAt: { type: Date, required: true },
  thumbnailUrl: { type: String },
  duration: { type: String }
}, { timestamps: true });

// Each user should have their own unique record of a video
videoSchema.index({ youtubeVideoId: 1, userId: 1 }, { unique: true });

// We often query by channelId or publishedAt
videoSchema.index({ channelId: 1, publishedAt: -1 });

export default mongoose.model('Video', videoSchema);
