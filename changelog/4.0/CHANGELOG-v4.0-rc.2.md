# Version 4.0 - Release Candidate 2

Updates since RC1:

## Changes

- `TextureManager#addDynamicTexture` now has `forceEven` parameter.

## Fixes

- Fix parent transform on filtered objects (e.g. masks inside containers).
- Fix camera shake.
- Add typedefs for the `{ internal, external }` structure of `Camera#filters` (and `GameObject#filters`).
- Fix `FilterList#addMask` docs.
- In Layer and Container objects, use that object's children for the `displayList` passed to `RenderWebGLSteps`.
