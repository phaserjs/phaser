# Version 3.90.0 - Itsuki - in development

# New Features

# WebGL Rendering Updates

* `WebGLTextureWrapper.update` expanded:
  * `source` parameter is now type `?object`, so it can be used for anything that is valid in the constructor.
  * New `format` parameter can update the texture format.
* `Shader.setRenderToTexture` parameter `flipY` removed, as it was unnecessary.

# Updates

# Bug Fixes

* Fix `LightPipeline` failing to render the same normal map twice in a row in a single batch, by removing `setTexture2D`. Fix #6708 (thanks @sroboubi)
* Log a warning instead of throwing an exception when calling `TextureManager.getPixel()` or `getPixelAlpha()` on textures that cannot be drawn to a canvas for sampling. Fix #6761 (thanks @yaustar)

## Examples, Documentation, Beta Testing and TypeScript

Thanks to the following for helping with the Phaser Examples, Beta Testing, Docs, and TypeScript definitions, either by reporting errors, fixing them, or helping author the docs:

