# Phaser 3.60.0 Change Log

Return to the [Change Log index](CHANGELOG-v3.60.md).

## Camera New Features

* You can now set the alpha value of the Camera Flash effect before running it, where-as previously it was always 1 (thanks @kainage)

## Camera Updates

* The `BaseCamera` has had its `Alpha` component replaced with `AlphaSingle`. Previously you had access to properties such as `alphaTopLeft` that never worked, now it correctly has just a single alpha property (thanks @samme)
* `Camera.scrollX` and `scrollY` will now only set the `Camera.dirty` flag to `true` if the new value given to them is different from their current value. This allows you to use this property in your own culling functions. Fix #6088 (thanks @Waclaw-I)
* `Camera.isSceneCamera` is a new boolean that controls if the Camera belongs to a Scene (the default), or a Texture. You can set this via the `Camera.setScene` method. Once set the `Camera.updateSystem` method is skipped, preventing the WebGL Renderer from setting a scissor every frame.
* `Camera.preRender` will now apply `Math.floor` instead of `Math.round` to the values, keeping it consistent with the Renderer when following a sprite.
* When rendering a Sprite with a Camera set to `roundPixels` it will now run `Math.floor` on the Matrix position, preventing you from noticing 'jitters' as much when Camera following sprites in heavily zoomed Camera systems.
* The `CameraManager.getVisibleChildren` method now uses the native Array filter function, rather than a for loop. This should improve performance in some cases (thanks @JernejHabjan)
* Removed the `Tint` and `Flip` components from the `Camera` class. Neither were ever used internally, or during rendering, so it was just confusing having them in the API.


## Camera Bug Fixes

* The `CameraManager.destroy` function will now remove the Scale Manager `RESIZE` event listener created as part of `boot`, where-as before it didn't clean it up, leading to gc issues. Fix #5791 (thanks @liuhongxuan23)
* The Camera will now emit `PRE_RENDER` and `POST_RENDER` events under the Canvas Renderer. Fix #5729 (thanks @ddanushkin)

---------------------------------------

Return to the [Change Log index](CHANGELOG-v3.60.md).

📖 Read the [Phaser 3 API Docs](https://newdocs.phaser.io/) 💻 Browse 2000+ [Code Examples](https://labs.phaser.io) 🤝 Join the awesome [Phaser Discord](https://discord.gg/phaser)
