import mongoose from 'mongoose';

const subscriptionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  channelId: { type: String, required: true },
  channelName: { type: String, required: true },
  avatarUrl: { type: String }
}, { timestamps: true });

// A user should not subscribe to the same channel twice
subscriptionSchema.index({ userId: 1, channelId: 1 }, { unique: true });

export default mongoose.model('Subscription', subscriptionSchema);
