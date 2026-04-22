import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  googleId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  avatar: { type: String },
  youtubeAccessToken: { type: String },
  settings: {
    notificationsEnabled: { type: Boolean, default: true },
    notificationTime: { type: String, default: '14:00' }, // 2 PM default
    theme: { type: String, enum: ['light', 'dark'], default: 'dark' }
  }
}, { timestamps: true });

export default mongoose.model('User', userSchema);
