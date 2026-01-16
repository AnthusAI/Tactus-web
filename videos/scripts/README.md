# Rendering Scripts

This directory contains automation scripts for rendering Remotion videos.

## render-all.js

Renders all video compositions defined in the script to the `out/` directory.

### Usage

```bash
npm run render
```

### Adding New Videos

Edit the `compositions` array in `render-all.js`:

```javascript
const compositions = [
  {
    id: "Intro",              // Must match the composition ID in src/Root.tsx
    outputFile: "intro.mp4",  // Output filename in out/ directory
  },
  {
    id: "YourNewVideo",
    outputFile: "your-new-video.mp4",
  },
];
```

### How It Works

1. Creates the `out/` directory if it doesn't exist
2. Iterates through all compositions in the array
3. Runs `remotion render` for each composition
4. Reports success/failure for each video
5. Exits with error code if any renders failed

### Output

Videos are saved to: `out/<outputFile>`

Example: `out/intro.mp4`
