# Version 3.90.0 - Itsuki - in development

# New Features

# WebGL Rendering Updates

* `WebGLTextureWrapper.update` expanded:
  * `source` parameter is now type `?object`, so it can be used for anything that is valid in the constructor.
  * New `format` parameter can update the texture format.

# Updates

# Bug Fixes

* Fix `RenderTexture` crashing in the presence of a light.
* Fix failure to restore compressed textures after WebGL context loss.
* Fix a single WebGL error, with no visual side-effects, from occurring while calling `Shader.setRenderToTexture()` after the game has started running. Actually, the root cause was leaving new WebGL textures bound after creation.

## Examples, Documentation, Beta Testing and TypeScript

Thanks to the following for helping with the Phaser Examples, Beta Testing, Docs, and TypeScript definitions, either by reporting errors, fixing them, or helping author the docs:

