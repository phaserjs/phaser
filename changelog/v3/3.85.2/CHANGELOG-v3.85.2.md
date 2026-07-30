# Version 3.85.2 - Itsuki - 17th September 2024

## Updates

* `WebGLRenderer.setExtensions` is a new method that queries the GL context to get the list of supported extensions. Which it then sets into the class properties. This method is called internally as part of the `init` and restore process.

## Bug Fixes

* When the WebGL context was restored it would incorrectly try to call `init.setupExtensions()` which didn't exist. It now calls the correct method, `WebGLRenderer.setExtensions`. Fix #6905 (thanks @RedRoosterMobile)
* `TransformMatrix.setQuad` has been fixed so it no longer rounds the quad dimensions, only the x/y coordinates. This fixes a bug where it could give slightly different (+- 1px) sized textures based on how the dimensions were rounded when using `roundPixels` on the camera. Fix #6874 (thanks @saintflow47)

## Examples, Documentation, Beta Testing and TypeScript

Thanks to the following for helping with the Phaser Examples, Beta Testing, Docs, and TypeScript definitions, either by reporting errors, fixing them, or helping author the docs:

@AlvaroNeuronup
