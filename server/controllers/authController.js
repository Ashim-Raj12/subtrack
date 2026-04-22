import { OAuth2Client } from 'google-auth-library';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import axios from 'axios';

export const googleAuth = async (req, res) => {
  try {
    const { youtubeAccessToken } = req.body;
    if (!youtubeAccessToken) return res.status(400).json({ message: 'Access token is required' });

    // Verify google token by fetching profile
    const userInfoRes = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: `Bearer ${youtubeAccessToken}` }
    });
    
    const payload = userInfoRes.data;
    if (!payload || !payload.sub) return res.status(400).json({ message: 'Invalid token' });

    const { sub: googleId, name, email, picture: avatar } = payload;

    // Call database to find or create the user
    let user = await User.findOne({ googleId });
    if (user) {
      user.name = name;
      user.avatar = avatar;
      user.youtubeAccessToken = youtubeAccessToken;
      await user.save();
    } else {
      user = new User({
        googleId,
        name,
        email,
        avatar,
        youtubeAccessToken
      });
      await user.save();
    }

    // Generate JWT for app session
    const appToken = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: '7d' }
    );

    res.status(200).json({ user, token: appToken });
  } catch (err) {
    console.error('Google Auth Error:', err);
    res.status(500).json({ message: 'Authentication failed' });
  }
};

export const updateSettings = async (req, res) => {
  try {
    const { notificationTime, notificationsEnabled } = req.body;
    const user = await User.findById(req.user._id);
    
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (notificationTime !== undefined) user.settings.notificationTime = notificationTime;
    if (notificationsEnabled !== undefined) user.settings.notificationsEnabled = notificationsEnabled;

    await user.save();
    res.status(200).json(user);
  } catch (err) {
    console.error('Update Settings Error:', err);
    res.status(500).json({ message: 'Failed to update settings' });
  }
};
