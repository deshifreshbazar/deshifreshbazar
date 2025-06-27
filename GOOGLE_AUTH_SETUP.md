# Google Authentication Setup Guide

## Missing Environment Variables

The following environment variable is required but not provided:

### GOOGLE_CLIENT_SECRET

To get your Google Client Secret:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project (or create one)
3. Navigate to "APIs & Services" → "Credentials"
4. Find your OAuth 2.0 Client ID (should match the provided `GOOGLE_CLIENT_ID`)
5. Click on it to view details
6. Copy the "Client Secret" value

### Add to your .env file:

```env
GOOGLE_CLIENT_SECRET="your_google_client_secret_here"
```

## Current Configuration

The app is configured with the following settings:

- **Google Client ID**: `340751214525-j916lov7t8k2mqrhoip7ffkvebqbbvpo.apps.googleusercontent.com`
- **NextAuth URL**: `https://deshifreshbazar.com`
- **Supabase Callback URL**: `https://jftgaryiaxgadhuwiiys.supabase.co/auth/v1/callback`

## Required Google Console Settings

Ensure your Google OAuth app has these redirect URIs configured:

1. `https://deshifreshbazar.com/api/auth/callback/google`
2. `http://localhost:3000/api/auth/callback/google` (for development)
3. `https://your-vercel-domain.vercel.app/api/auth/callback/google` (if using Vercel)

## Mobile-Friendly Configuration

The current setup includes:

- Mobile-optimized Google Auth flow
- Proper touch targets for mobile devices
- Responsive design for auth forms
- Better error handling and user feedback

## Testing

1. Test on desktop browsers
2. Test on mobile devices (both iOS and Android)
3. Test in incognito/private mode
4. Test with different Google accounts

## Troubleshooting

If you encounter issues:

1. Check browser console for errors
2. Verify all environment variables are set
3. Ensure Google Console redirect URIs are correct
4. Test with different browsers and devices
5. Check NextAuth debug logs (enabled in development)
