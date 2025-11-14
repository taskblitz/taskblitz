# Public Folder

This folder contains static assets that are served directly by Next.js.

## Files in this folder:
- `favicon.ico` - Website icon that appears in browser tabs

## How it works:
Files in `/public` are accessible at the root URL:
- `/public/favicon.ico` → `https://yoursite.com/favicon.ico`
- `/public/logo.png` → `https://yoursite.com/logo.png`

## Adding more static files:
Place any static files (images, fonts, etc.) here:
```
/public
  /images
    logo.png
  /fonts
    custom-font.woff2
  favicon.ico
```

## Important:
- ✅ DO put static assets here
- ❌ DON'T put files in the root folder
- ❌ DON'T put files in `/app` or `/components`
