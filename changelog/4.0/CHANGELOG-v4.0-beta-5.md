# Version 4.0 - beta 4

## Fixes and Improvements

- Limit `roundPixels` to only operate when objects are axis-aligned and unscaled. This prevents flicker on transforming objects.
- Fix `TextureSource.resolution` being ignored in WebGL.
  - This fixes an issue where increasing text resolution increased text size.
