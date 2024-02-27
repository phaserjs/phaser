# Version 3.80.1 - Nino - 27 February 2024

# Bug Fixes

* Fix `RenderTexture` crashing in the presence of a light.
* Fix failure to restore compressed textures after WebGL context loss.
* Fix a single WebGL error, with no visual side-effects, from occurring while calling `Shader.setRenderToTexture()` after the game has started running. Actually, the root cause was leaving new WebGL textures bound after creation.
* Ensure that `TextureSource.setFlipY` always updates the texture.
