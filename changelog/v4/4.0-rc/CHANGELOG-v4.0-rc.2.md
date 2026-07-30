# Version 4.0 - Release Candidate 2

Updates since RC1:

## New Features

- `RenderConfig#renderNodes` allows you to add render nodes at game boot.
- `ShaderQuadConfig#initialUniforms` lets you initialize a Shader with uniforms on creation.
- `Shader#setUniform(name, value)` lets you set shader program uniforms just once, instead of putting them all into the `setupUniforms()` method, where some uniforms might be set redundantly after init. This wraps `Shader#renderNode.programManager.setUniform`.

## Changes

- `TextureManager#addDynamicTexture` now has `forceEven` parameter.

## Fixes

- Fix parent transform on filtered objects (e.g. masks inside containers).
- Fix camera shake.
- Add typedefs for the `{ internal, external }` structure of `Camera#filters` (and `GameObject#filters`).
- Fix `FilterList#addMask` docs.
- In Layer and Container objects, use that object's children for the `displayList` passed to `RenderWebGLSteps`.
- Fix positioning of Group members and offset objects in `DynamicTexture#draw`.
- Fix Shadow filter direction.
