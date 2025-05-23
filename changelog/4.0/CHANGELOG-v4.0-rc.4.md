# Version 4.0 - Release Candidate 4

This update improves performance related to data buffer size, primarily affecting filters, including masks. A game that was bottlenecked by filters on mobile devices may experience speedups of 16x or more. A desktop system, or a scene with no filters, may be broadly unaffected, save for memory savings.

## New Features

- `BatchHandlerQuadSingle` render node added.
  - This is just a copy of `BatchHandlerQuad` with space for 1 quad.
  - The rendering system uses this node internally for transferring images in some steps of the filter process.

## Changes

- `BatchHandler` render nodes now create their own WebGL data buffers.
  - This uses around 5MB of RAM and VRAM in a basic game.
  - Dedicated buffers are an optimum size for batch performance. 

## Removals

- `WebGLRenderer#genericVertexBuffer` and `#genericVertexData` removed.
  - This frees 16MB of RAM and VRAM.
- `BatchHandlerConfig#createOwnVertexBuffer` type property removed.
- `TileSprite` no longer supports texture cropping.

## Fixes

- Lighting fixed on rotated or filtered objects.
- Added missing 'this' value for Group.forEach and StaticGroup.forEach (thanks @TadejZupancic)
- Fix `createFromTiles` to handle multiple tilesets when using sprite sheets. Fix #7122 (thanks @vikerman)
- Fix audio files not loading from Base64 data URIs (thanks @bagyoni)

## Documentation / TypeScript Enhancements

Thanks to the following people:

@captain-something
@DayKev
@ixonstater
