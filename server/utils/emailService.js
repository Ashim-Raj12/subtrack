import { Resend } from 'resend';
import dotenv from 'dotenv';

dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY || 're_placeholder');

/**
 * Send a notification email to the user using Resend
 * @param {string} to - Recipient email
 * @param {string} subject - Email subject
 * @param {string} text - Plain text body
 * @param {string} html - HTML body
 */
export const sendNotificationEmail = async (to, subject, text, html) => {
  try {
    // If API Key is placeholder, just log it
    if (!process.env.RESEND_API_KEY) {
      console.log('--- MOCK EMAIL (RESEND) ---');
      console.log('To:', to);
      console.log('Subject:', subject);
      console.log('Content:', text);
      console.log('--- End Mock ---');
      return { success: true, mock: true };
    }

    const { data, error } = await resend.emails.send({
      from: 'SubTrack <onboarding@resend.dev>', // You can change this once you verify your domain
      to: [to],
      subject,
      text,
      html,
    });

    if (error) {
      console.error('Resend error:', error);
      return { success: false, error };
    }

    console.log('Email sent via Resend:', data.id);
    return { success: true, data };
  } catch (error) {
    console.error('Error sending email via Resend:', error);
    return { success: false, error: error.message };
  }
};
