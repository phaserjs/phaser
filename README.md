![Phaser 2.0](http://www.phaser.io/images/phaser2-github.png)

# Index

- [About](#about)
- [What's new?](#whats-new)
- [Getting Started](#getting-started)
- [Change Log](#change-log)
- [Pixi 1.6.0](#pixi-160)
- [Koding](#koding)
- [Bower](#bower)
- [CDNJS](#cdnjs)
- [Requirements](#requirements)
- [Learn By Example](#example)
- [Features](#features)
- [Road Map](#road-map)
- [Nadion](#nadion)
- [Contributing](#contributing)
- [Bugs?](#bugs)
- [License](#license)

# Phaser 2.0.6 <a name="about"></a>

Phaser is a fast, free and fun open source game framework for making desktop and mobile browser HTML5 games. It uses [Pixi.js](https://github.com/GoodBoyDigital/pixi.js/) internally for fast 2D Canvas and WebGL rendering.

Version: 2.0.6 "Jornhill" - Released: 10th July 2014

By Richard Davey, [Photon Storm](http://www.photonstorm.com)

* View the [Official Website](http://phaser.io)
* Follow on [Twitter](https://twitter.com/photonstorm)
* Join the [Forum](http://www.html5gamedevs.com/forum/14-phaser/)
* StackOverflow tag: [phaser-framework](http://stackoverflow.com/questions/tagged/phaser-framework)
* Source code for 320+ [Phaser Examples](https://github.com/photonstorm/phaser-examples) or [browse them online](http://examples.phaser.io)
* View the growing list of [Phaser Plugins](https://github.com/photonstorm/phaser-plugins)
* Read the [documentation online](http://docs.phaser.io)
* Join our [#phaserio IRC channel](http://www.html5gamedevs.com/topic/4470-official-phaserio-irc-channel-phaserio-on-freenode/) on freenode
* Subscribe to the [Phaser Newsletter](https://confirmsubscription.com/h/r/369DE48E3E86AF1E) and we'll email you when new versions are released.
* Please help support our work via [Gittip](https://www.gittip.com/photonstorm/)

![div](http://phaser.io/images/div4.png)

## Welcome to Phaser and What's new in 2.0.6? <a name="whats-new"></a>

We're very pleased to bring you the latest version of Phaser. We were hanging back waiting for the 1.6 release of Pixi, and sure enough it landed today, so we're pleased to incorporate that into this release. Pixi 1.6 itself brings in a number of powerful new features, not least of which are the awesome updates to the Graphics class - now allowing for significantly more complex shapes and masks and a host of new methods such as drawPath, arcTo and quadratic curves.

There are also masses of updates across Phaser as well. The Change Log below will give you the full details, but there are substantial new updates, features and bug fixes across most of the library. Also a big shout out to the guys at Ludei for helping get to the bottom of some strange CocoonJS issues and submit their code into Phaser.

Just as we were preparing for release the 0.6 version of p2.js landed as well. As much as we'd have loved to include it this time we just didn't want to hold back any longer. So we've updated our roadmap and will push out 2.1 very soon, which will focus specifically on integration of the new version of p2.js. We're moving to 2.1 as it has a number of API breaking changes inside.

You may have noticed that we also now have a [Gittip](https://www.gittip.com/photonstorm/) account set-up. Everything we raise from this will go towards helping Phaser development, one way or another. To those of who you have already contributed, thank you!

We're also working extremely hard on the new web site. We're really happy with the new features we've been adding recently and are pushing to get it done as soon as possible. There's also a brand new documentation generator nearly done - see our Roadmap for more details.

Until then happy coding everyone! And we hope to see you on the forums.

![boogie](http://www.phaser.io/images/spacedancer.gif)

![div](http://phaser.io/images/div1.png)

## Getting Started Guides <a name="getting-started"></a>

We have a [Getting Started Guide](http://phaser.io/getting-started-js.php) which covers all you need to begin developing games with Phaser. From setting up a web server to picking an IDE. If you're new to HTML5 game development, or are coming from another language like AS3, then we recommend starting there.

We wrote a comprehensive [How to Learn Phaser](http://gamedevelopment.tutsplus.com/articles/how-to-learn-the-phaser-html5-game-engine--gamedev-13643) guide for GameDevTuts+  which covers finding tutorials, examples and support.

The [Game Mechanic Explorer](http://gamemechanicexplorer.com) is a great interactive way to learn how to develop specific game mechanics in Phaser. Well worth exploring once you've got your dev environment set-up.

Finally the list of [community authored Phaser Tutorials](http://www.lessmilk.com/phaser-tutorial/) is growing fast!

![Phaser Logo](http://www.photonstorm.com/wp-content/uploads/2013/09/phaser_10_release.jpg)

![div](http://phaser.io/images/div2.png)

## Change Log <a name="change-log"></a>

Version 2.0.6 - "Jornhill" - 10th July 2014

### Significant Internal Changes

* The PIXI.TextureCache global array is no longer used internally for storing Pixi Texture files. It's not actually a requirement of Pixi to use this and we were running into various issues with texture conflicts in DragonBones tests and issues with shared texture frames between Sprites. It meant we couldn't crop a sprite without cropping all instances unless we created a new texture frame at run-time, which as you can imagine is a huge overhead if you then want to crop an animated Sprite.
 
After talking with Mat at GoodBoyDigital about the issue it was his idea to just not use the TextureCache at all, and let each Sprite have its own frame. So this is the direction we've taken. We didn't save this for the 2.1 release as it doesn't actually alter the Phaser API at all, but it does change how things are working internally. So if you've got game code hooked directly into the `TextureCache` you need to be aware of this change before updating to 2.0.6.

* The way in which Sprite.crop works has been changed. It will now adjust the dimensions of the sprite itself, remaining at the sprites previous x/y coordinates. Please be aware of this if you use cropped sprites in your game. The change was worth it though as it's significantly more powerful as a result.

### Updates

* Merged Pixi 1.6.0 with Phaser - all of the lovely new Pixi features are in, like complex Graphics objects and masking.
* TypeScript definitions fixes and updates (thanks @clark-stevenson and @Phaiax)
* Documentation fixes (thanks @kay-is #941)
* BitmapData.draw can now also take a Phaser.Sprite, Phaser.Image or BitmapData object as a source type. As a result BitmapData.drawSprite is now depcreated.
* BitmapData.alphaMask can now also take a Phaser.Sprite, Phaser.Image or BitmapData object as a source type.
* BitmapData.alphaMask has 2 new optional parameters: sourceRect and maskRect to give more fine-grained control over where the source and mask are drawn and their size
* BitmapData.alphaMask 'mask' parameter is now optional, if not given it will use itself as the mask.
* BitmapData.alphaMask now calls BitmapData.update after running.
* BitmapData.draw now has two optional parameters: width and height, to let you stretch the image being drawn if needed.
* Group.destroy now removes any set filters (thanks @Jmaharman fix #844)
* RetroFont charsPerRow paramters is now optional. If not given it will take the image width and divide it by the characterWidth value.
* RetroFont now uses Phaser.scaleModes.NEAREST by default for its RenderTexture to preserve scaling.
* Loader.tilemap has renamed the `mapURL` parameter to `url` and `mapData` to `data` to keep it consistent with the other Loader methods.
* Loader.physics has renamed the `dataURL` parameter to `url` and `jsonData` to `data` to keep it consistent with the other Loader methods.
* Stage no longer creates the Phaser.Canvas object, but Game itself does in the setupRenderer method.
* Canvas.create has deprecated the noCocoon parameter as it's no longer required. The parameter is still in the signature, but no longer used in the method.
* Time.add allows you to add an existing Phaser.Timer to the timer pool (request #864)
* Emitter.start has a new parameter: forceQuantity which will force the quantity of a flow of particles to be the given value (request #853)
* Sound.pause will no longer fire a Sound.onStop signal, and the pause values are set before the onPause signal is dispatched (thanks @AnderbergE, fix #868)
* Swapped to using escaped Unicode characters for the console output.
* Frame.setTrim no longer modifies the Frame width and height values.
* AnimationParser doesn't populate the Pixi.TextureCache for every frame any longer. Each display object has its own texture property instead.
* Removed the cacheKey parameters from the AnimationParser methods as they're no longer used.
* Loader.isLoading is set to false if the filelist size is zero.
* Sound.externalNode has had the `input` property dropped from it, bringing it back in line with the AudioNode spec (thanks @villetou, #840)
* The StateManager has a preRenderCallback option, which checks for a preRender function existing on the State, but it was never called. Have decided to add this in, so the core Game loop now calls state.preRender right before the renderer runs (thanks @AnderbergE #869)
* Game.onBlur and Game.onFocus events are now dispatched regardless if Stage.disableVisibilityChange is true or false, so you can respond to these events without your game automatically pausing or resuming (#911)
* Image has been heavily refactored to make use of common code in Phaser.Sprite, cutting the file size down significantly.
* When using the non-minified version of Phaser it will throw a console.warn if you give an invalid texture key to a Sprite, Image or TileSprite (thanks @lucbloom, #990)

### CocoonJS Specific Updates

* Wrapped all touch, keyboard, mouse and fullscreen events that CocoonJS doesn't support in conditional checks to avoid Warnings.
* The SoundManager no longer requires a touch to unlock it, defaults to unlocked.
* Resolved issue where Cocoon won't render a scene in Canvas mode if there is only one Sprite/Image on it.

### New Features

* BitmapData.extract has a new parameter that lets you control if the destination BitmapData is resized before the pixels are copied.
* BitmapData.extract has 4 new parameters: r2, g2, b2, a2 which let you re-color the extract pixels as they are drawn to the new BitmapData.
* BitmapData.load will take a game object or string and resize the BitmapData to match it and then draw the pixels in.
* Keyboard.addCallbacks now has a new parameter for keypress event capture.
* Keyboard.pressEvent stores the most recent DOM keypress event.
* Keyboard.processKeyDown now runs the callback after all the objects have been created and/or updated.
* Keyboard.processKeyUp now runs the callback after all the objects have been created and/or updated.
* Phaser.Keyboard.lastChar will return the string value of the last key pressed.
* Phaser.Keyboard.lastKey will return the most recently pressed Key object.
* RetroFont.updateOffset allows you to modify the offsetX/Y values used by the font during rendering.
* ArcadePhysics.Body has a new boolean property `enable`. If `false` the body won't be checked for any collision or overlaps, or have its pre or post update methods called. Use this for easy toggling of physics bodies without having to destroy or re-create the Body object itself.
* BitmapData.addToWorld will create a new Phaser.Image object, assign the BitmapData to be its texture, add it to the world then return it.
* BitmapData.copyPixels now accepts a Sprite, Image, BitmapData, HTMLImage or string as its source.
* Loader.pack will allow you to load in a new Phaser Asset Pack JSON file. An Asset Pack is a specially structured file that allows you to define all assets for your game in an external file. The file can be split into sections, allowing you to control loading a specific set of files from it. An example JSON file can be found in the `resources\Asset Pack JSON Format` folder and examples of use in the Phaser Examples repository.
* Loader.totalQueuedPacks returns the number of Asset Packs in the queue.
* Loader.totalLoadedPacks returns the number of Asset Packs already loaded.
* Emitter.explode is a new short-cut for exploding a fixed quantity of particles at once.
* Emitter.flow is a new short-cut for creating a flow of particles based on the given frequency.
* Sprite.crop (and Image.crop) has been completely overhauled. You can now crop animated sprites (sprite sheet and texture atlas), you can define the x/y crop offset and the crop rectangle is exposed in the Sprite.cropRect property.
* Sprite.updateCrop is available if you wish to update an externally referenced crop rectangle.
* Sprites and Images now have their own textures objects, they are no longer references to those stored in the global Pixi.TextureCache. This allows you to redefine the texture frame dynamically without messing up any other Sprites in your game, such as via cropping. They still share global Base Textures, so image references are kept to a minimum.
* Sprite.resetFrame will revert the Sprites texture frame back to its defaults dimensions. This is called when you call Sprite.crop with no rectangle, to reset the crop effect, but can be userful in other situations so we've left it as a public method.
* TilemapLayers can now be used with an unbounded camera (a camera that can move beyond the world boundaries). Currently, when an unbounded camera moves outside of the world, tilemaps start acting weird because they only render themselves strictly within the world limits. With this change, the tilemap will continue scrolling and show empty space beyond its edge (thanks @jotson #851)
* TilemapLayer.wrap property - if true the map is rendered as if it is on the surface of a toroid (donut) instead of a plane. This allows for games that seamlessly scroll from one edge to the opposite edge of the world without noticing the transition. Note that the World size must match the Map size (thanks @jotson #851)
* Added PlayStation 3 controller button mappings to Phaser.Gamepad (thanks @wayfu)
* GamepadButton.destroy method added. Called automatically by SinglePad when a controller is disconnected.
* Added Math.factorial (thanks @alvinsight, #940)
* Full Mouse Wheel support added, with new constants and callbacks for mouse wheel movement (thanks @woutercommandeur, #959)
* A Phaser version of the Pixi PixelateFilter was added by @paperkettle #939)
* TileMap.setPreventRecalculate allows you to turn on / off the recalculation of tile faces for tile collision, which is handy when modifying large portions of a map to avoid slow-down (thanks @sivael, #951)
* Group.add has a new optional boolean parameter: `silent`. If set to `true` the child will not dispatch its `onAddedToGroup` event.
* Group.addAt has a new optional boolean parameter: `silent`. If set to `true` the child will not dispatch its `onAddedToGroup` event.
* Group.remove has a new optional boolean parameter: `silent`. If set to `true` the child will not dispatch its `onRemovedFromGroup` event.
* Group.removeBetween has a new optional boolean parameter: `silent`. If set to `true` the children will not dispatch their `onRemovedFromGroup` events.
* Group.removeAll has a new optional boolean parameter: `silent`. If set to `true` the children will not dispatch their `onRemovedFromGroup` events.
* Internal child movements in Group (such as bringToTop) now uses the new `silent` parameter to avoid the child emitting incorrect Group addition and deletion events.
* Camera.updateTarget has had a make-over and now is a lot smoother under certain conditions (thanks @tjkopena, fix #966)
* Signal.removeAll now has a new `context` parameter. If specified only listeners matching the given context are removed (thanks @lucbloom for the idea, #880)
* Animation.next will advance to the next frame in the animation, even if it's not currently playing. You can optionally define the number of frames to advance, but the default is 1. This is also aliased from the AnimationManager, so you can do `Sprite.animations.next()`.
* Animation.previous will rewind to the previous frame in the animation, even if it's not currently playing. You can optionally define the number of frames to rewind, but the default is 1. This is also aliased from the AnimationManager, so you can do `Sprite.animations.previous()`.
* You can now debug render Ninja Physics AABB and Circle objects (thanks @psalaets, #972)
* Phaser.Utils.mixin will mix the source object into the destination object, returning the newly modified destination object.
* You can now use `game.add.plugin` from the GameObjectFactory (thanks @alvinsight, #978)
* Color.getWebRGB will now accept either an Object or numeric color value.
* Rectangle.randomX will return a random value located within the horizontal bounds of the Rectangle.
* Rectangle.randomY will return a random value located within the vertical bounds of the Rectangle.
* Using a Game configuration object you can now specify the value of the  `preserveDrawingBuffer` flag for the WebGL renderer. By default this is disabled for performance reasons. But if you need to be able to take screen shots of your WebGL games using toDataUrl on the game canvas then you'll need to set this to `true` (#987)
* Added options to disable horizontal and vertical world wrapping individually (thanks @jackrugile, #988)
* You can now prevent the Debug class from being created or booted by using the Game configuration setting: `enableDebug`. By default it is `true`, set to `false` to prevent the class from being created. Please note you are responsible for checking if this class exists before calling it, but you can do that via `if (game.debug) { ... }` (request #984)

### Bug Fixes

* Sprite.alive property now explicitly defined on the Sprite prototype (thanks @lewster32, #841)
* BitmapData.resize now properly updates the baseTexture and texture dimensions.
* Fixed Gamepad issue that incorrectly checked non-webkit prefix gamepads.
* Phaser.RenderTexture incorrectly passed the scaleMode to Pixi.RenderTexture, causing the renderer to error.
* Sprite animation data wasn't reset when going from a sprite sheet to a single frame in Sprite.loadTexture (thanks @lucbloom, fix #850)
* Timer.ms would report the game time ms value if the Timer hadn't yet been started, instead of 0.
* Timer.seconds would report the game time value if the Timer hadn't yet been started, instead of 0.
* A Canvas style set from a game config object used an incorrect property (thanks @TatumCreative, fix #861)
* Phaser.Line.intersectsPoints fixed for floating point inaccuracy (thanks @woutercommandeur, fix #865 and #937)
* Sound.destroy(true) would call remove on the SoundManager, which in turn would throw a TypeError as it tried to remove the sound events twice (thanks @AnderbergE, fix #874)
* When creating a Sprite or Image using a texture atlas it would set the frame twice, once in loadTexture and once when the initial frame is set. This has been reduced down to just a single setting now.
* BitmapData.getPixel fix for pixels with zero red value (thanks @lstor fix #894)
* If you call ArcadePhysics.collide on a Sprite vs. a Tilemap and provide a custom processCallback, the result was being ignored and the sprite was being separated regardless (thanks @aivins fix #891 #890)
* ArcadePhysics.Body.setSize if you set offset x/y values previously and then passed zero values they would be ignored (thanks @casensiom fix #889)
* InputHandler.checkPointerDown checks and docs updated (thanks @lewster32, fix method #936)
* Body.enable only exists in Arcade physics, so moved conditions concerning checking that into the Body (thanks @Phaiax, fix #961)
* Forces packPixel result into a uint32 (thanks @Phaiax, fix #960)
* The Bottom Wall in non 0,0 aligned P2 world was incorrectly set (thanks @Phaiax, fix #952)
* AnimationManager could sometimes return null (thanks @TatumCreative, #910)
* P2.Body.removeShape didn't call shapeChanged (thanks @TatumCreative, #910)
* Sound.onDecoded signal was never dispatched (thanks @j0hnskot, #906)
* stopFullScreen has been changed to run against document instead of the canvas since the cancelFullScreen method is created on the document (thanks @j0hnskot, #863)
* Calling reset on Sprite with a P2 body can result in body.data.world == null.
Calling addToWorld() would previously not check the _toRemove array, which could, if the timing were right, result in a Sprite being revived but then removed from the P2 World -- the result of this being the Sprites data would be in a mixed state causing it to appear visually but not function in the world (thanks @jonkelling, fix #917 #925)
* Input.SinglePad was fixed so that the rawpad button array supports Windows and Linux (thank @renatodarrigo, fix #958)
* Key.duration wasn't set to zero after a Key.reset (thanks @DrHackenstein, #932)
* Device.mobileSafari was no longer detecting Mobile Safari, now fixed (thanks @Zammy, #927)
* Rectangle.right when set would set the new width to be Rectangle.x + the value given. However the value given should be a new Right coordinate, so the width calculation has been adjusted to compensate (thanks @cryptonomicon, #849)
* Calling Tween.stop from inside a Tween update callback would still cause the tween onComplete event to fire (thanks @eguneys, #924)
* Group.bringToTop (and consequently Sprite.bringToTop) no longer removes the child from the InputManager if enabled (thanks @BinaryMoon, fix #928)
* Group.sendToBack (and consequently Sprite.sendToBack) no longer removes the child from the InputManager if enabled.
* When adding a new Animation to a Sprite it would incorrectly reset the current Sprite frame to the first frame of the animation sequence, it is now left un-touched until you call `play` on the animation.
* Tween.from now returns a reference to the tweened object in the same way that Tween.to does (thanks @b-ely, fix #976)
* Re-ordered the parameters of Phaser.Physics.Arcade.Body.render which is used by Debug.body so it matches correctly (thanks @psalaets, #971 #970)
* Removed hasOwnProperty check from Tween.from because it breaks on extended or inherited Game Objects.

## Pixi 1.6.0 <a name="pixi-160"></a>

The following changes were part of the Pixi 1.6.0 release:

### New features

* Big graphics update!
* Complex polys now supported in Pixi in webGL.
* Nested masking and complex poly masking supported in webGL.
* quadraticCurveTo added to PIXI.Graphics.
* bezierCurveTo added to PIXI.Graphics.
* arcTo added to PIXI.Graphics.
* arc added to PIXI.Graphics.
* drawPath added to PIXI.Graphics.
* roundedRectangle added to PIXI.Graphics.
* PIXI.Strip and PIXI.Rope added to library along with a new example.
* addChild / addChildAt functions now return the child.
* Add scaleMode params to PIXI.FilterTexture and PIXI.RenderTexture.
* fromFrames and fromImages static helper methods added to PIXI.MovieClip.
* updateSourceImage added to PIXI.BaseTexture.
* Added multitouch support.
* new valid property added to PIXI.Texture.
* Option to control premultiplied alpha on textures.
* Pixi logs current version in the console.
* webp image support.
* clear function added to PIXI.RenderTexture

### Bug Fixes

* Fix to roundPixels property in PIXI.CanvasRenderer.
* Fixed interactive bug when mousemove being called on removed objects.
* Fix bug touch move event handling.
* Various CocoonJS Fixs.
* Masks now work when used in PIXI.RenderTextures / cacheAsBitmap and PIXI.Filters.
* Fixed bug where stroked PIXI.Text sometimes got clipped.
* Removed the trailing whitespace when wordwrapping a PIXI.Text.
* Fixed texture loading on IE11.
* Fixed Data URI loading.
* Fixed issue so now loader only uses XDomainRequest in IE, if a crossorigin request is needed.
* Fixed issue where alpha not being respected if cacheAsBitmap is true
* Fixed PIXI.RendeTexture resize bug.
* Fixed PIXI.TilingSprite not render children on canvas.
* Fixes issue where if both mask and filter are applied to one object the object did not render.
* If the texture is destroyed, it should be removed from PIXI.TextureCache too.
* PIXI.Graphics blendMode property now works in webGL.
* Trimmed sprites now behave the same as non trimmed sprites.

### Misc

* Doc tweaks / typo corrections.
* Added Spine license to src.
* Removed this.local in InteractionData.
* Shader manager Simplified.
* Sprite._renderCanvas streamlined and optimized.
* WebGL drawCalls optimized.

### Migration Guide

There is an extensive [Migration Guide](https://github.com/photonstorm/phaser/blob/master/resources/Migration%20Guide.md) available for those converting from Phaser 1.x to 2.x. In the guide we detail the API breaking changes and approach to our new physics system.

The full Change Log is at https://github.com/photonstorm/phaser/blob/master/CHANGELOG.md

![div](http://phaser.io/images/div3.png)

## How to Build <a name="how-to-build"></a>

We provide a fully compiled version of Phaser in the `build` folder, in both plain and minified formats.

You will also find custom builds in the `build\custom` folder, that split phaser up into components.

We also provide a Grunt script that will build Phaser from source.

Run `grunt` to perform a default build to the `dist` folder.

If you replace Pixi or p2 then run `grunt replace` to patch their UMD strings so they work properly with Phaser and requireJS.

Note: Some of you may not be aware, but the `phaser.min.js` file in the build folder contains all 3 physics systems bundled in. If you only need Arcade Physics then you can use `build\custom\phaser-arcade-physics.min.js` instead. This will save you 180KB from the minified file size.

![div](http://phaser.io/images/div4.png)

## Koding

You can [clone the Phaser repo in Koding](https://koding.com/Teamwork?import=https://github.com/photonstorm/phaser/archive/master.zip&c=git1) and then start editing and previewing code right away using their web based VM development system.

![div](http://phaser.io/images/div5.png)

## Bower

If you use bowser you can install phaser with:

`bower install phaser`

Nice and easy :)

![Tanks](http://www.photonstorm.com/wp-content/uploads/2013/10/phaser_tanks-640x480.png)

![div](http://phaser.io/images/div6.png)

## CDNJS

Phaser is now available on [CDNJS](http://cdnjs.com). You can include the following in your html:

`http://cdnjs.cloudflare.com/ajax/libs/phaser/2.0.6/phaser.min.js`

Or if you prefer you can leave the protocol off, so it works via http and https:

`//cdnjs.cloudflare.com/ajax/libs/phaser/2.0.6/phaser.min.js`

![div](http://phaser.io/images/div1.png)

## Requirements

Games created with Phaser require a modern web browser that supports the canvas tag. This includes Internet Explorer 9+, Firefox, Chrome, Safari and Opera. It also works on mobile web browsers including stock Android 2.x browser and above and iOS5 Mobile Safari and above. But as always be aware of browser limitations. Not all features of Phaser work on all browsers.

### IE9

If you need to support IE9 or Android 2.x and want to use P2 physics then you must use the polyfill found in the `resources/IE9 Polyfill` folder. If you don't require P2 Physics (or don't care about IE9!) then you don't need this polyfill.

### JavaScript and TypeScript

Phaser is developed in JavaScript. We've made no assumptions about how you like to code your games, and were careful not to impose any form of class / inheritance / structure upon you. So you won't find it split into require modules or pull in 3rd party npm packages for example. That doesn't mean you can't, it just means we don't force you to do so. If you're a requireJS user you'll find a new template in the `resources\Project Templates` folder just for you.

If you code with [TypeScript](https://typescript.codeplex.com/) you'll find a comprehensive definitions file inside the `build` folder and tutorials on getting started.

Phaser is 128 KB gzipped (576 KB minified) when including all 3 physics engines. Without the physics engines its 67 KB gzipped (311 KB minified)

Note: The `phaser.min.js` file in the build folder contains all 3 physics systems bundled in. If you only need Arcade Physics then you can use `build\custom\phaser-arcade-physics.min.js` instead. This will save you 180 KB from the minified file size.

![div](http://phaser.io/images/div3.png)

## Learn By Example <a name="example"></a>

Ever since we started Phaser we've been growing and expanding our extensive set of Examples. Currently over 320 of them!

They used to be bundled in the main Phaser repo, but because they got so large and in order to help with versioning we've moved them to their own repo.

So please checkout https://github.com/photonstorm/phaser-examples

Here you'll find an ever growing suite of Examples. Personally I feel that developers tend to learn better by looking at small refined code examples, so we created hundreds of them, and create new ones to test new features and updates. Inside the `examples` repo you'll find the current set. If you write a particularly good example then please send it to us.

The examples need to be run through a local web server (in order to avoid file access permission errors from your browser). You can use your own web server, or start the included web server using grunt.

Using a locally installed web server browse to the examples folder:

    examples/index.html

Alternatively in order to start the included web server, after you've cloned the repo, run `npm install` to install all dependencies, then `grunt connect` to start a local server. After running this command you should be able to access your local webserver at `http://127.0.0.1:8000`. Then browse to the examples folder: `http://127.0.0.1:8000/examples/index.html`

There is a 'Side View' example viewer as well. This loads all the examples into a left-hand frame for faster navigation. And if you've got php installed into your web server you may want to try `debug.php`, which provides a minimal examples list and debug interface.

You can also browse all [Phaser Examples](http://examples.phaser.io) online.

![div](http://phaser.io/images/div4.png)

## Features

**WebGL &amp; Canvas**

Phaser uses both a Canvas and WebGL renderer internally and can automatically swap between them based on browser support. This allows for lightning fast rendering across Desktop and Mobile. When running under WebGL Phaser now supports shaders, allowing for some incredible in-game effects. Phaser uses and contributes towards the excellent Pixi.js library for rendering.

**Preloader**

We've made the loading of assets as simple as one line of code. Images, Sounds, Sprite Sheets, Tilemaps, JSON data, XML and JavaScript files - all parsed and handled automatically, ready for use in game and stored in a global Cache for Sprites to share.

**Physics**

Phaser ships with our Arcade Physics system, Ninja Physics and P2.JS - a full body physics system. Arcade Physics is for high-speed AABB collision only. Ninja Physics allows for complex tiles and slopes, perfect for level scenery, and P2.JS is a full-body physics system, with constraints, springs, polygon support and more.

**Sprites**

Sprites are the life-blood of your game. Position them, tween them, rotate them, scale them, animate them, collide them, paint them onto custom textures and so much more!
Sprites also have full Input support: click them, touch them, drag them around, snap them - even pixel perfect click detection if needed.

**Groups**

Group bundles of Sprites together for easy pooling and recycling, avoiding constant object creation. Groups can also be collided: for example a "Bullets" group checking for collision against the "Aliens" group, with a custom collision callback to handle the outcome.

**Animation**

Phaser supports classic Sprite Sheets with a fixed frame size, Texture Packer and Flash CS6/CC JSON files (both Hash and Array formats) and Starling XML files. All of these can be used to easily create animation for Sprites.

**Particles**

An Arcade Particle system is built-in, which allows you to create fun particle effects easily. Create explosions or constant streams for effects like rain or fire. Or attach the Emitter to a Sprite for a jet trail.

**Camera**

Phaser has a built-in Game World. Objects can be placed anywhere within the world and you've got access to a powerful Camera to look into that world. Pan around and follow Sprites with ease.

**Input**

Talk to a Phaser.Pointer and it doesn't matter if the input came from a touch-screen or mouse, it can even change mid-game without dropping a beat. Multi-touch, Mouse, Keyboard and lots of useful functions allow you to code custom gesture recognition.

**Sound**

Phaser supports both Web Audio and legacy HTML Audio. It automatically handles mobile device locking, easy Audio Sprite creation, looping, streaming and volume. We know how much of a pain dealing with audio on mobile is, so we did our best to resolve that!

**Tilemaps**

Phaser can load, render and collide with a tilemap with just a couple of lines of code. We support CSV and Tiled map data formats with multiple tile layers. There are lots of powerful tile manipulation functions: swap tiles, replace them, delete them, add them and update the map in realtime.

**Device Scaling**

Phaser has a built-in Scale Manager which allows you to scale your game to fit any size screen. Control aspect ratios, minimum and maximum scales and full-screen support.

**Plugin system**

We are trying hard to keep the core of Phaser limited to only essential classes, so we built a smart Plugin system to handle everything else. Create your own plugins easily and share them with the community.

**Mobile Browser**

Phaser was built specifically for Mobile web browsers. Of course it works blazingly fast on Desktop too, but unlike lots of frameworks mobile was our main focus. If it doesn't perform well on mobile then we don't add it into the Core.

**Developer Support**

We use Phaser every day on our many client projects. As a result it's constantly evolving and improving and we jump on bugs and pull requests quickly. This is a living, breathing framework maintained by a commercial company with custom feature development and support packages available. We live and breathe HTML5 games.

**Battle Tested**

Phaser has been used to create hundreds of games, which receive millions of plays per month. We're not saying it is 100% bug free, but we use it for our client work every day, so issues get resolved <em>fast</em> and we stay on-top of the changing browser landscape.

![FruitParty](http://www.photonstorm.com/wp-content/uploads/2013/10/phaser_fruit_particles-640x480.png)

![div](http://phaser.io/images/div6.png)

## Road Map

Here are some of the features planned for future releases:

### Version 2.1 ("Shienar")

* Upgrade to p2.js 0.6.0 and all of Phasers P2 functions to match.
* Continued exploration of preloader and scene generation via JSON scripts.
* New documentation formats using our custom doc generator.

### Version 2.2 ("Tarabon")

* Scene Manager - json scene parser.
* Comprehensive testing across Firefox OS devices, CocoonJS and Ejecta.
* Ability to control DOM elements from the core game and layer them into the game.
* Touch Gestures.
* Optimised global Animation manager to cut down on object creation.
* Swapping to using a RenderTexture for the Tilemaps and implementing Tilemap slicing.
* Enhance the State Management, so you can perform non-destructive State swaps and persistence.
* Support for parallel asset loading.

### Version 2.3

* Look carefully at the internal structure of Phaser to avoid method repetition (such as Sprite.crop and Image.crop), investigate using mixins to help reduce overall codebase size.
* Flash CC HTML5 export integration.
* Massively enhance the audio side of Phaser. Take more advantage of Web Audio: echo effects, positional sound, etc.

### Beyond version 2.3

* A more advanced Particle system, one that can render to a single canvas (rather than spawn hundreds of Sprites), more advanced effects, etc.
* Integration with third party services like Google Play Game Services and Amazon JS SDK.
* Test out packaging with Node-webkit.
* Game parameters stored in Google Docs.
* Look at HiDPI Canvas settings.
* Multiple Camera support.
* DragonBones support.
* Cache to localStorage using If-Modified-Since. [See github request](https://github.com/photonstorm/phaser/issues/495)
* Allow for complex assets like Bitmap Fonts to be stored within a texture atlas.

![div](http://phaser.io/images/div1.png)

## MightyEditor - A Visual Phaser Game Editor <a name="mighty-editor"></a>

[MightyEditor](http://mightyfingers.com/) is a browser-based visual Phaser game editor. Create your maps with ease, position objects and share them in seconds. It also exports to native Phaser code. Excellent for quickly setting-up levels and scenes.

## Nadion

[Nadion](https://github.com/jcd-as/nadion) is a set of powerful enhancements for Phaser that makes level building even easier. It includes features such as Trigger, Area, Alarms and Emitters, debug panels, state machines, parallax layer scrolling, 'developer mode' short-cuts and more.

![div](http://phaser.io/images/div2.png)

## Contributing

We now have a full [Contributors Guide][contribute] which goes into the process in more detail, but here are the headlines:

- If you find a bug then please report it on [GitHub Issues][issues] or our [Support Forum][forum].

- If you have a feature request, or have written a game or demo that shows Phaser in use, then please get in touch. We'd love to hear from you! Either post to our [forum][forum] or email: rich@photonstorm.com

- If you issue a Pull Request for Phaser, please only do so againt the `dev` branch and *not* against the `master` branch.

- Before submitting a Pull Request please run your code through [JSHint](http://www.jshint.com/) to check for stylistic or formatting errors. To use JSHint, run `grunt jshint`. This isn't a strict requirement and we are happy to receive Pull Requests that haven't been JSHinted, so don't let it put you off contributing, but do know that we'll reformat your source before going live with it.

[![Build Status](https://travis-ci.org/photonstorm/phaser.png?branch=dev)](https://travis-ci.org/photonstorm/phaser)

![div](http://phaser.io/images/div3.png)

## Bugs?

Please add them to the [Issue Tracker][issues] with as much info as possible, especially source code demonstrating the issue.

![Phaser Tilemap](http://www.photonstorm.com/wp-content/uploads/2013/04/phaser_tilemap_collision.png)

"Being negative is not how we make progress" - Larry Page, Google

![div](http://phaser.io/images/div4.png)

## License

Phaser is released under the [MIT License](http://opensource.org/licenses/MIT).

[issues]: https://github.com/photonstorm/phaser/issues
[contribute]: https://github.com/photonstorm/phaser/blob/master/CONTRIBUTING.md
[phaser]: https://github.com/photonstorm/phaser
[forum]: http://www.html5gamedevs.com/forum/14-phaser/

[![Analytics](https://ga-beacon.appspot.com/UA-44006568-2/phaser/index)](https://github.com/igrigorik/ga-beacon)
