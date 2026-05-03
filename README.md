# GlowCheck

Mobile-first installable skincare ingredient app built from the provided Home, Library, and Profile screen designs.

## Run locally

1. Open a terminal in this folder.
2. Start the local server:

```powershell
node server.js
```

3. Open [http://localhost:4173](http://localhost:4173) in a browser.

## What is included

- Home screen with ingredient search, fuzzy matching, recent scans, and stack analysis
- Library screen with saved ingredients, safety filters, and collections
- Profile screen with customizable skin profile, settings, and help actions
- Local storage persistence for saved items, collections, profile, appearance, notifications, and stack
- Offline-friendly PWA shell with manifest and service worker

## Google sign-in and APK notes

Google sign-in can be added before publishing to Google Play or the App Store. For a web/PWA demo, create a Google OAuth Web client ID and add `http://localhost:4173` as an authorized JavaScript origin while testing.

For an Android APK, create an Android OAuth client using the app package name and the APK signing certificate SHA-1. An APK can be shared directly with a client for testing, but it still needs to be signed.

Useful official references:

- Google Identity Services setup: https://developers.google.com/identity/oauth2/web/guides/load-3p-authorization-library
- Google OAuth testing and production status: https://support.google.com/cloud/answer/15549945
- Android Google client authentication: https://developers.google.com/android/guides/client-auth
- Android app signing: https://developer.android.com/guide/publishing/app-signing.html
