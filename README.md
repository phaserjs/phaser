![div](http://www.phaser.io/images/github/welcome-div2.png)

# Phaser

<img src="http://phaser.io/images/github/jump.jpg" align="right">

Phaser is a fast, free and fun open source HTML5 game framework. It uses [Pixi.js](https://github.com/GoodBoyDigital/pixi.js/) for WebGL and Canvas rendering across desktop and mobile web browsers. Games can be compiled to iOS and Android apps via 3rd party tools.

Along with the fantastic open source community Phaser is actively developed and maintained by [Photon Storm Limited](http://www.photonstorm.com). As a result of rapid support and a developer friendly API Phaser is currently one of the [most starred](https://github.com/showcases/javascript-game-engines) game frameworks on Github.

Thousands of developers worldwide use it. From indies and multi-national digital agencies to schools and Universities. Each creating their own incredible games. Grab the source and join in the fun!

* **Visit:** The [Phaser website](http://phaser.io) and follow on [Twitter](https://twitter.com/photonstorm) (#phaserjs)
* **Learn:** [API Documentation](http://phaser.io/docs), [Support Forum][forum] and [StackOverflow](http://stackoverflow.com/questions/tagged/phaser-framework)
* **Code:** 500+ [Source Examples](http://phaser.io/examples) (also available in this [git repo][examples])
* **Read:** Subscribe to the [Newsletter](https://confirmsubscription.com/h/r/369DE48E3E86AF1E) and grab our [Phaser Books](http://phaser.io/shop)
* **Chat:** [#phaserio IRC channel](http://www.html5gamedevs.com/topic/4470-official-phaserio-irc-channel-phaserio-on-freenode/) on freenode
* **Extend:** With [Phaser Plugins](https://github.com/photonstorm/phaser-plugins)
* **Be awesome:** Support our work via [Gratipay](https://gratipay.com/photonstorm/)

![div](http://www.phaser.io/images/github/div.png)

## Index

- [What's New?](#whats-new)
- [Download Phaser](#download)
- [Getting Started](#getting-started)
- [Using Phaser](#using-phaser)
- [Games made with Phaser](#games)
- [Requirements](#requirements)
- [Road Map](#road-map)
- [Change Log](#change-log)
- [Contributing](#contributing)

![div](http://www.phaser.io/images/github/div.png)

<a name="whats-new"></a>
## What's new in Phaser 2.4.0

<div align="center"><img src="http://phaser.io/images/github/news.jpg"></div>

> 26th March 2015

Phaser 2.3.0 marks the second release in 2015 and easily one of our most significant for a while. In terms of API changes they're actually quite minimal, but under the hood we've taken Phaser for a serious workout.

We've traditionally had something of a 'kitchen sink' issue with Phaser. As we thought of great new features to give you we just added them in. And like too much of a good thing they contributed to an ever growing file size.

So two of the biggest changes 2.3.0 has is an internal shift to using Game Object components, and allowing you to exclude features in your own custom builds. The new build system lets you selectively exclude features from being bundled in: for example if your game doesn't need Gamepad or Keyboard support you can now tell Phaser to skip those parts entirely.

[This tutorial](http://phaser.io/tutorials/creating-custom-phaser-builds) explains the process in detail. But the end result is that thanks to these changes we've both managed to remove thousands of lines of code and let you decide what Phaser contains. The minimum build size is now just 83KB minified and gzipped and that's still including both the WebGL and Canvas renderers.

Even though we've been cutting down on size we still managed to pack a whole load of great new features in. For example the new spacial sorting added to Arcade Physics allows for incredible speed increases when dealing with densely populated game worlds. The Loader has received a complete overhaul - now offering full parallel asset loading, sync points and more! The Tilemap system was upgraded to support new Tiled 0.11 editor features. Audio has been also been enhanced, with better marker and loop handling. See the Change Log for all the details.

Your games will run faster, have a smaller footprint, and load faster than ever.

But it's not just Phaser that has been updated - we also finally released the [new Phaser web site](http://phaser.io)! For the past few years it was a huge "wall of text", with hundreds of links filling up the single page site. Now it's all changed! with a much more attractive layout and structure. We've got a healthy and constantly updating [news section](http://phaser.io/news), the [examples](http://phaser.io/examples) have a great new visual showcase and there's even a [Sandbox](http://phaser.io/sandbox) to play in.

It was a lot of hard work but we're super-happy with the result - and judging by our page hits, which are going off the charts, you are too :) We'll be sure to keep enhancing it over the coming months, especially as Phaser 3 development ramps up.

That's all for now. I hope you enjoy Phaser 2.3.0, the new site, the new features and the New Year. Happy coding everyone! See you on the forums.

Cheers,

Rich - [@photonstorm](https://twitter.com/photonstorm)

![boogie](http://www.phaser.io/images/spacedancer.gif)

![div](http://www.phaser.io/images/github/div.png)

<a name="download"></a>
## Download Phaser

Phaser is [hosted on Github][phaser]. There are a number of ways to download it:

* Clone the git repository via [https][clone-http], [ssh][clone-ssh] or with the Github [Windows][clone-ghwin] or [Mac][clone-ghmac] clients.
* Download as [zip][get-zip] or [tar.gz][get-tgz]
* Download just the build files: [phaser.js][get-js] and [phaser.min.js][get-minjs]
* Checkout with [svn][clone-svn]

### Bower / npm

Install via [bower](http://bower.io)

`bower install phaser`

Install via [npm](https://www.npmjs.com)

`npm install phaser`

### CDN

[jsDelivr](http://www.jsdelivr.com/#!phaser) is a "super-fast CDN for developers". Include the following in your html:

`<script src="//cdn.jsdelivr.net/phaser/2.3.0/phaser.js"></script>`

or the minified version:

`<script src="//cdn.jsdelivr.net/phaser/2.3.0/phaser.min.js"></script>`

[cdnjs.com](https://cdnjs.com/libraries/phaser) also offers a free CDN service. They have all versions of Phaser and even the custom builds:

`<script src="https://cdnjs.cloudflare.com/ajax/libs/phaser/2.3.0/phaser.js"></script>`

### Phaser Sandbox

If you'd like to try coding in Phaser right now, with nothing more than your web browser then you can head over to the [Phaser Sandbox](http://phaser.io/sandbox). You'll find Quick Start templates and a user-friendly editor filled with handy code-completion features.

### Koding

Want to try Phaser without downloading anything? [Clone Phaser in Koding](https://koding.com/Teamwork?import=https://github.com/photonstorm/phaser/archive/master.zip&c=git1) and start working right away in their web based development system.

### License

Phaser is released under the [MIT License](http://opensource.org/licenses/MIT).

![div](http://www.phaser.io/images/github/div.png)

<a name="getting-started"></a>
## Getting Started

<img src="http://phaser.io/images/github/learn.jpg" align="right">

We have a [Getting Started Guide](http://phaser.io/tutorials/getting-started) which covers all you need to begin developing games with Phaser. From setting up a web server, to picking an IDE and coding your first game.

Prefer **videos** to reading? Lynda.com have published a free course: [HTML5 Game Development with Phaser](http://www.lynda.com/Phaser-tutorials/HTML5-Game-Development-Phaser/163641-2.html)

The single biggest Phaser resource is the new [Phaser web site](http://phaser.io/news). It has hundreds of tutorials listed and fresh ones are added every week, so keep coming back to see what's new!

Using Phaser with **TypeScript**? Check out this great series of [Game From Scratch](http://www.gamefromscratch.com/page/Adventures-in-Phaser-with-TypeScript-tutorial-series.aspx) tutorials.

### Source Code Examples

Ever since we started Phaser we've been growing and expanding our extensive set of source code examples. Currently there are over 500 of them!

Browse the [Phaser Examples](http://phaser.io/examples) or clone the [examples repo][examples] and eat your heart out!

### Phaser Books

<div align="center"><img src="http://phaser.io/images/github/books.jpg"></div>

We've been busy writing books about Phaser. Available now:

* [A Guide to the Phaser Tween Manager](https://leanpub.com/phasertweenmanager) Book + Code Bundle
* [A Guide to the Phaser Scale Manager](https://leanpub.com/phaserscalemanager)

With more on the way. [Vote on the next title](http://www.html5gamedevs.com/topic/10962-which-phaser-book-would-you-like-to-see-next/) to be written.

### Game Mechanic Explorer

The [Game Mechanic Explorer](http://gamemechanicexplorer.com) is a great interactive way to learn how to develop specific game mechanics in Phaser. Well worth exploring once you've got your dev environment set-up.

### Mighty Editor - Visual Game Editor

[MightyEditor](http://mightyfingers.com/) is a browser-based visual Phaser game editor. Create your maps with ease, position objects and share them in seconds. It also exports to native Phaser code. Excellent for quickly setting-up levels and scenes.

![div](http://www.phaser.io/images/github/div.png)

<a name="using-phaser"></a>
## Using Phaser

Phaser is provided ready compiled in the `build` folder of the repository. There are both plain and minified versions. The plain version is for use during development and the minified version for production.

### Custom Builds

As of Phaser 2.3.0 we now include a brand new build system which allows you to strip out lots of additional features you may not require, saving hundreds of KB in the process. Don't use any Sound in your game? Then you can now exclude the entire sound system. Don't need Keyboard support? That can be stripped out too.

As a result of this work the minimum build size of Phaser is now just 83KB minified and gzipped.

See the [Creating a Custom Phaser Build](http://phaser.io/tutorials/creating-custom-phaser-builds) tutorial for details.

### Building from source

Should you wish to build Phaser from source you can take advantage of the provided [Grunt](http://gruntjs.com/) scripts. Ensure you have the required packages by running `npm install` first.

Run `grunt` to perform a default build to the `dist` folder.

If you change either Pixi.js or P2 then use the Grunt tasks `replace:pixi` and `replace:p2` respectively. These tasks patch their UMD strings so they work properly with Phaser under requireJS.

![div](http://www.phaser.io/images/github/div.png)

<a name="games"></a>
## Games made with Phaser

Thousands of games have been made in Phaser. From game jam entries to titles for some of the largest entertainment brands in the world. This is just a tiny sample.

[![Game](http://phaser.io/images/github/shot1a.jpg)][game1]
[![Game](http://phaser.io/images/github/shot2a.jpg)][game2]
[![Game](http://phaser.io/images/github/shot3a.jpg)][game3]
[![Game](http://phaser.io/images/github/shot4a.jpg)][game4]
[![Game](http://phaser.io/images/github/shot5b.jpg)][game5]
[![Game](http://phaser.io/images/github/shot6b.jpg)][game6]
[![Game](http://phaser.io/images/github/shot7b.jpg)][game7]
[![Game](http://phaser.io/images/github/shot8.jpg)][game8]
[![Game](http://phaser.io/images/github/shot9.jpg)][game9]
[![Game](http://phaser.io/images/github/shot10.jpg)][game10]
[![Game](http://phaser.io/images/github/shot11.jpg)][game11]
[![Game](http://phaser.io/images/github/shot12.jpg)][game12]
[![Game](http://phaser.io/images/github/shot13.jpg)][game13]
[![Game](http://phaser.io/images/github/shot14.jpg)][game14]

Artwork copyright their respective owners.

We add [new games](http://phaser.io/news/category/game) to the Phaser site regularly, be sure to send us yours when it's finished!

![div](http://www.phaser.io/images/github/div.png)

<a name="requirements"></a>
## Requirements

Phaser requires a web browser that supports the [canvas tag](http://caniuse.com/#feat=canvas). This includes Internet Explorer 9+, Firefox, Chrome, Safari and Opera on desktop. iOS Safari, Android Browser and Chrome for Android are supported on mobile.

While Phaser does its best to ensure a consistent cross-platform experience always be aware of browser and device limitations. This is especially important with regard to memory and GPU limitations on mobile, and legacy browser HTML5 compatibility.

### IE9

If you need to support IE9 / Android 2.x **and** use P2 physics then you must use the polyfill in the `resources/IE9 Polyfill` folder. If you don't use P2 (or don't care about IE9!) you can skip this.

### JavaScript and TypeScript

Phaser is developed in JavaScript. We've made no assumptions about how you like to code and were careful not to impose a strict structure upon you. You won't find Phaser split into modules, requiring a build step, or making you use a class / inheritance OOP approach. That doesn't mean you can't do so, it just means we don't *force* you to. It's your choice.

If you code with [TypeScript](http://www.typescriptlang.org/) there are comprehensive definition files in the `typescript` folder. They are for TypeScript 1.4+.

![div](http://www.phaser.io/images/github/div.png)

<a name="road-map"></a>
## Road Map

All Phaser development is now taking place on the Phaser 3 project. The Phaser 2 branch will still be supported and issues fixed, but roadmap features have been migrated over to Phaser 3.

<a name="phaser3"></a>
## Phaser 3

We're now several months in to development of Phaser 3. We've been working hard on creating a brand new and extremely powerful renderer. Progress reports are posted to the web site and [Phaser 3 repo](https://github.com/photonstorm/phaser3).

There is still plenty of time to add your suggestions and feedback in [this forum thread](http://www.html5gamedevs.com/topic/7949-the-phaser-3-wishlist-thread/).

If you are an exceptional JavaScript developer and would like to join the Phaser 3 development team then let us know. We have a limited budget available to pay towards your time.

![div](http://www.phaser.io/images/github/div.png)

<a name="change-log"></a>
## Change Log

Version 2.4 - "Katar" - in dev

### API Changes

* RenderTexture.render now takes a Matrix as its second parameter, not a Point object. This brings it in line with Pixi and allows you to perform much more complex transformations on the object being rendered. If you need to replicate the old behavior please use RenderTexture.renderXY(sprite, point.x, point.y) instead.
* PIXI.DisplayObject.updateTransform has a new optional parameter `parent`. If the DisplayObject doesn't have a parent (i.e. it isn't on the display list yet) then in the past `updateTransform` would fail. This meant you couldn't do things like scale or rotate a Sprite and then draw it to a RenderTexture or BitmapData, as calls to updateTransform would be ignored. The new checks now look to see if the `parent` parameter is set. If so this takes priority over the actual parent and is used to modify the transform (note that it **doesn't** reparent the DisplayObject, it merely uses it for the transform.) If there is no parent (explicitly or via the parameter) then it falls back to use Phaser.World as the parent. If it can't reach that then no transform takes place.
* If Phaser.Sound.noAudio has been set then Phaser.Loader will not load any audio files. No errors are thrown, but all calls to Loader.audio and Loader.audiosprite are silently ignored. `noAudio` can be set either via the `PhaserGlobal` global var or is set if the device your game is running on has no audio playback support.
* Files can now be added to the Loader with an absolute URL even if you have a Loader.baseURL set. In previous versions the baseURL would still be prepended to the file URL, but the Loader now checks if the a file URL begins with `http` or `//` and skips prepending the baseURL to it.
* Phaser.StateManager would incorrectly call `loadUpdate` and `loadRender` while the game was paused or if the State didn't have an `update` or `render` method defined, even after the loader was completed. Although this is a bug fix it's still an API change should you have been using the `loadUpdate/Render` calls in the old way. Also the StateManager no longer calls `preRender` unless the State `create` method has *finished*. If the State doesn't have a `create` method then `preRender` runs immediately.
* Frame.uuid has been removed (was flagged as deprecated for several releases). This has a two-fold effect: First it means that the property no longer exists and secondly it means that the AnimationParser (the class responsible for loading sprite sheets and texture atlases) no longer has to call either RandomDataGenerator.uuid OR populates the PIXI.TextureCache. The first saves some CPU time and the second saves memory by not creating references to textures it doesn't ever use. The PIXI.TextureCache is now ignored by Phaser other than for the `__missing` and `__default` textures.
* Phaser.AnimationParser methods `JSONData`, `JSONDataHash` and `XMLData` have all had their `cacheKey` parameter removed as it's no longer used.
* Input.deleteMoveCallback no longer takes an integer as its parameter. Now you have to give it the original callback and context in order to remove it. This is to protect against index invalidation (see the fixed Bugs list)
* Group.add and Group.addAt will only create a Physics Body on the child if it doesn't already have one. This is a change from 2.3 where it would replace the physics body property with the new body, but this could lead to garbage build-up over time, so you should now properly destroy the body before changing it.

### New Features

* All calls to Loader methods that add files to the queue, such as `Loader.image` or `Loader.atlas`, now have the URL as an optional parameter. If not set Loader will assume the URL to be based on the key given. For example the following: `game.load.image("boom", "boom.png")` can now be expressed as just `game.load.image("boom")`, or `game.load.atlas("player", "player.png", "player.json")` can now be shortened to `game.load.atlas("player")`. Please see the freshly updated jsdocs for full details.
* Loader.atlas and `Cache.addTextureAtlas` will now automatically determine the format of the JSON data (array or hash) when added to the Cache. You no longer need to specify it explicitly if JSON, only if XML.
* Added support for the [Creature Automated Animation Tool](http://www.kestrelmoon.com/creature/). You can now create a Phaser.Creature object which uses json data and a texture atlas for the animations. Creature is a powerful animation tool, similar to Spriter or Spine. It is currently limited to WebGL games only, but the new libs should prove a solid starting point for anyone wanting to incorporate Creature animations into their games.
* Tilemap.getTileWorldXY has a new optional parameter: `nonNull` which if set makes it behave in the same way as `getTile` does (thanks @GGAlanSmithee #1722)
* Group.hash is an array (previously available as `Group._hash`, but protected) into which you can add any of its children via `Group.addToHash` and `Group.removeFromHash`. Only children of the Group can be added to and removed from the hash. The hash is used automatically by Arcade Physics in order to perform non z-index based destructive sorting. However if you don't use Arcade Physics, or it isn't a physics enabled Group, then you can use the hash to perform your own sorting and filtering of Group children without touching their z-index (and therefore display draw order).
* Group.physicsSortDirection is a new property allowing you to set a custom sort direction for Arcade Physics Sprites within the Group hash. Previously Arcade Physics used one single sort direction (defined on `Phaser.Physics.Arcade.sortDirection`) but this change allows you to specifically control how each and every Group is sorted, so you can now combine tall and wide Groups with narrow and thin in a single system.
* Cache.getPixiTexture will return a PIXI.Texture from the cache based on the given key. A PIXI Texture is created automatically for all images loaded and added to the cache.
* Cache.getPixiBaseTexture will return a PIXI.BaseTexture from the cache based on the given key. A PIXI BaseTexture is created automatically for all images loaded and added to the cache.
* Phaser.Matrix.clone allows you to clone the Matrix to a new object, or copy its values into the given Matrix.
* Phaser.Matrix.copyFrom and copyTo allow you to copy Matrix values from and to other Matrix  objects.
* Phaser.Matrix.setTo allows you to set all properties of a Matrix in a single call.
* The Phaser.Matrix constructor now allows you to optionally set all Matrix properties on instantiation.
* Text.setShadow has two new optional parameters: `shadowStroke` and `shadowFill`. These allow you to set if the drop shadow is applied to the Text stroke, the Text fill or both of them (thanks @qdrj #1766)
* Text.shadowStroke and Text.shadowFill allow you to toggle if the drop shadow is applied to the Text stroke or fill independently.
* ArcadePhysics.Body.syncBounds is a new property that if true forces the Body to check itself against the Sprite.getBounds() dimensions and adjust its width and height accordingly. If false it will compare its dimensions against the Sprite scale instead, and adjust its width height if the scale has changed. Typically you would need to enable `syncBounds` if your sprite is the child of a responsive display object such as a FlexLayer, or in any situation where the sprite scale doesn't change, but its parents scale is effecting the dimensions regardless.
* Rectangle.ceil runs Math.ceil() on both the x and y values of the Rectangle.
* Rectangle.ceilAll runs Math.ceil() on the x, y, width and height values of the Rectangle.
* The Net and Debug classes have been stubbed out, so they can be properly excluded during a custom build (thanks @soldoutactivist #1772)
* Device.oggVideo indicates if the browser can play back ogg video files.
* Device.h264Video indicates if the browser can play back H264 (mp4) video files.
* Device.mp4Video indicates if the browser can play back H264 (mp4) video files.
* Device.webmVideo indicates if the browser can play back webm video files with the vp8 codec.
* Device.vp9Video indicates if the browser can play back webm video files with the vp9 codec.
* Device.hlsVideo indicates if the browser can play back mpeg video files.
* PIXI.DisplayObject.worldPosition contains the position of the DisplayObject (and therefore any object that inherits from it, such as Phaser.Sprite) taking into account all transforms in the display list. It is updated at the end of `DisplayObject.updateTransform`. DisplayObject.position reflects only the position applied to the object directly, whereas worldPosition includes the positions that may have been applied to its ancestors.
* PIXI.DisplayObject.worldScale contains the scale of the DisplayObject (and therefore any object that inherits from it, such as Phaser.Sprite) taking into account all transforms in the display list. It is updated at the end of `DisplayObject.updateTransform`. DisplayObject.scale reflects only the scale applied to the object directly, whereas worldScale includes any scales that may have been applied to its ancestors.
* PIXI.DisplayObject.worldRotation contains the rotation of the DisplayObject (and therefore any object that inherits from it, such as Phaser.Sprite) taking into account all transforms in the display list. It is updated at the end of `DisplayObject.updateTransform`. DisplayObject.rotation reflects only the rotation applied to the object directly, whereas worldRotation includes any rotations that may have been applied to its ancestors.
* Loader.video allows you to load a video file into Phaser. It works in the same way as Loader.audio, allowing you to pass an array of video files - and it will load the first one the device is capable of playing back. You can optionally load the video via xhr where the video data is converted to a Blob upon successful load.
* Cache.addVideo allows you to add a loaded video into the Phaser Cache. This is called automatically by the Phaser Loader, but may be invoked directly as well.
* Cache.checkVideoKey allows you to check if a video is stored in the cache based on the given key.
* Cache.getVideo allows you to extract a video from the Cache based on its key. The video element itself (or the Blob is loaded with asBlob true) will be found in the `data` property of the returned object.
* Cache.removeVideo will remove a video from the Cache based on the given key.
* SoundManager.onVolumeChange is a new signal that is dispatched whenever the global volume changes. The new volume is passed as the only parameter to your callback.
* SoundManager.onMute is a new signal that is dispatched when the SoundManager is globally muted, either directly via game code or as a result of the game pausing.
* SoundManager.onUnMute is a new signal that is dispatched when the SoundManager is globally un-muted, either directly via game code or as a result of the game resuming from a pause.
* Input.Touch.addTouchLockCallback allows you to add a callback that will be invoked automatically upon a touchstart event. This is used internally by the SoundManager and Video objects to handle mobile device unlocking, but is exposed publicly as well.
* Frame.resize allows you to change the dimensions of a Frame object and recalculate all of its internal properties (such as `bottom` and `distance`).
* LoadTexture.resizeFrame lets you resize the Frame dimensions that the Game Object uses for rendering. You shouldn't normally need to ever call this, but in the case of special texture types such as Video or BitmapData it can be useful to adjust the dimensions directly in this way.
* Rectangle.bottomLeft has been added (thanks @mattmogford #1788)
* Device.firefoxVersion is a new property that contains the major Firefox version number if running within Firefox, otherwise zero.
* Math.distanceSq will return the euclidean distance squared between the two given set of coordinates (thanks @jeremyosborne #1761 #1770)
* StateManager.onStateChange is a new signal which is dispatched whenever the State changes from one to another. The callback you specify is sent two parameters: the string based key of the new state, and the second parameter is the string based key of the old / previous state. 
* onDragUpdate is a new signal that is dispatched whenever a Game object enabled for input and drag is moved by a pointer (i.e. during a drag event). See the `Phaser.InputHandler.enableDrag` docs for parameter details and the new Phaser Example.
* Rectangle.resize allows you to resize a Rectangle to the new given dimensions without altering its position.
* Cache.getJSON has a new parameter: `clone`. If set it will return a clone of the object stored in the Cache rather than a reference to it.
* Circle.random will return a random point from anywhere within the circle.
* Line.random will return a random point from anywhere on the Line segment.

### Updates

* TypeScript definitions fixes and updates (thanks @clark-stevenson @isuda @ggarek @jamesgroat)
* JSDoc typo fixes (thanks @robertpenner @luckylooke @asyncanup @muzuiget @danxexe)
* Added missing `resumed` method to Phaser.State class template.
* Color.webToColor and Color.updateColor now updates the `out.color` and `out.color32` properties (thanks @cuixiping #1728)
* Tilemap.createFromObjects has been updated for Tiled 0.11 and can now look-up object layers based on id, uid or name. It will also now copy over Sprite scaling properties if set (thanks @mandarinx #1738)
* Graphics.drawPolygon can now accept a Phaser.Polygon or PIXI.Polygon object, as well as a points array (#1712)
* Phaser.Physics hooks added in for MatterJS support (coming soon)
* Body.destroy now automatically calls `Group.removeFromHash`.
* Physics.Arcade.sort has a new property 'sortDirection'. If not specified it will use World.sortDirection. If the Group given as the first parameter has its `physicsSortDirection` property set that will override any other setting.
* Physics.Arcade.sort now calls one of four functions: sortLeftRight, sortRightLeft, sortTopBottom and sortBottomTop. Each of which takes 2 Sprites as arguments.
* Physics.Arcade.sort now doesn't bail out if the Group contains a mixture of physics and non-physics enabled objects, as the Group hash is now only ever populated with physics enabled objects. Also the sort comparison functions no longer return -1 if the bodies are invalid, but zero instead (#1721)
* Phaser.Group would automatically add a child into the _hash array as soon as the child was created (or moved into the Group). This no longer happens. Instead the child is only added to `Group.hash` if it is enabled for Arcade Physics. However `Group.addToHash` and the hash array have been exposed as public in case you were taking advantage of the _hash even though it was a previously marked as private.
* Cache.getTexture has now been removed (it was deprecated several versions ago). Use Cache.getRenderTexture instead.
* Removed duplicate methods from PIXI.Text such as wordWrap and updateText as Phaser overrides them, so it was wasting bytes.
* Phaser.StateManager no longer calls `preRender` unless the State `create` method has finished. If the State doesn't have a `create` method then `preRender` runs immediately.
* Phaser.StateManager.created is a new read-only boolean that tells you if the State has finished running its `create` method. If it doesn't have one it's always true.
* RenderTexture.render and `renderXY` would ignore the Sprites rotation or scale. The full Sprite transform is now used correctly when the Sprite is drawn to the texture. If you wish to replicate the old behavior please use `RenderTexture.renderRawXY` instead.
* Pixi.Sprite.renderCanvas and renderWebGL now has a new optional matrix parameter. You can use this to render the Sprite with an alternative transform matrix without actually adjusting the Sprite matrix at all.
* RenderTexture.matrix has been removed as it's no longer used.
* SoundManager.pauseAll, resumeAll and stopAll now checks if the SoundManager.noAudio is set and ignores the calls.
* SoundManager.usingWebAudio is set to `false` by default (used to be `true`) and is only explicitly set if Web Audio is available and hasn't been disabled in the PhaserGlobal object.
* SoundManager.touchLocked is now set to `false` should the device be using legacy Audio, avoiding the unlock call running without need.
* Added `type` parameter to `VideoTexture.fromUrl` allowing you to define the mime-type of the video file, which is required for Firefox and Safari in most cases.
* PIXI.BaseTexture.forceLoaded allows you to set a BaseTexture as loaded, with the given width and height. It then calls `BaseTexture.dirty`. This is important for when you don't want to modify the shape of the source object by forcing in `complete` or dimension properties it may not naturally have, but still wish to use it as a base texture.
* SoundManager.volume now has its input value clamped to ensure it's between 0 and 1 (inclusive)
* Removed `Input.moveCallback` and `Input.moveCallbackContext` as neither are used any longer. Use `Input.addMoveCallback`.
* SoundManager now uses the new `Touch.addTouchLockCallback` methods to handle mobile device audio unlocking.
* If a BitmapData is created with a width or height set to zero then the width and/or height are set to a default value (256) instead to avoid getContext errors.
* RetroFont has been updated to use RenderTexture.renderXY, removing the need for creating a Point object each update.
* RetroFont no longer puts any entries into the TextureCache or generates any UUIDs on instantiation, speeding up creation and lowering memory use.
* BitmapData.update now validates the `width` and `height` values to ensure they aren't lower than 1, which would previously cause a context error.
* Texture.requiresReTint is a new property that controls if a texture requires the display object to be re-tinted having been updated internally. The LoadTexture component now sets this.
* PIXI.Sprite.tintedTexture contains a canvas object that holds the tinted version of the Sprite. This is only populated in Canvas, not in WebGL.
* ScaleManager.scaleSprite will no longer try and scale a display object that doesn't have a scale property.
* The LoadTexture component has a new property `customRender` which is checked for in the Core postUpdate to know when to render custom elements like Videos.
* BitmapText line spacing and word wrapping has been vastly improved and bought in-line with how Pixi 3 handles it, but with additional anchor support.

### Bug Fixes

* The LoadTexture component has had a redundant `dirty` call removed from it that was causing textures to be re-uploaded to the GPU even though they may already have been on it.
* TileSprites were missing a `physicsType` property, causing them to not collide with anything (thanks @numbofathma #1702)
* Sprite was missing the Health and InCamera components.
* A Tween could be incorrectly set to never end if it was given a duration of zero (thanks @hardalias #1710)
* Added guards around `context.getImageData` calls in BitmapData, Text and Canvas Tinting classes to avoid crashing restricted browsers like Epic Browser. Please understand that several Phaser features won't work correctly with this browser (thanks @Erik3000 #1714)
* P2 Body.destroy now checks for the existence of a `sprite` property on the body before nulling it (thanks @englercj #1736)
* The version of p2.js being used in 2.3.0 wasn't correctly declaring itself as a global for browserify / requireJS. This update resolves that (thanks @dgoemans #1723)
* AnimationManager.frameName setter wasn't checking if `_frameData` existed before accessing it (thanks @nesukun #1727)
* P2.getConstraints would return an array of null objects. It now returns the raw p2 constraint objects (thanks @valueerrorx #1726)
* TilemapLayer docs incorrectly reported it as extending Phaser.Image, but it doesn't share the same components so has been updated.
* TilemapLayer was missing the Input component (thanks @uhe1231 #1700)
* PIXI.Graphics in Canvas mode wouldn't respect the objects visible or alpha zero properties, rendering it regardless (thanks @TimvdEijnden #1720)
* Enabling Arcade Physics would add the deltaCap property onto Phaser.Time, even though the property doesn't exist any more, changing the class shape in the process.
* Phaser.StateManager would incorrectly call `loadUpdate` while the game was paused or if the State didn't have an `update` method defined even after the loader was completed.
* Phaser.StateManager would incorrectly call `loadRender` while the game was paused or if the State didn't have an `render` method defined even after the loader was completed.
* Added the missing `preRender` function to the Phaser.State class template.
* Fixed bug in Pixi where RenderTexture.render would ignore the given matrix.
* Fixed a bug in Pixi where drawing a Sprite to a RenderTexture would reset the Sprites transform to an identity Matrix.
* The SoundManager didn't accurately detect devices or browser environments with no sound card present and would try to carry on using a null Web Audio context (thanks @englercj #1746)
* The Tween.onStart signal wasn't dispatched if the Tween had a delay set. It's now dispatched immediately if no delay, or after the delay if set. It also respects the `autoStart` parameter and will still dispatch even if `autoStart` is true.
* Input.addMoveCallback used to return the index of the callback entry in the internal `moveCallbacks` array. However as callbacks were removed the indexes became invalid, potentially causing a future `Input.deleteMoveCallback` to remove the wrong callback entirely or error. Input.deleteMoveCallback now takes the original callback and context as its parameters to ensure deletion safety.
* Graphics constructor now sets x/y parameters to zero if undefined. Before it would set them to undefined as the type check wasn't strict.
* Math.isOdd now returns an actual boolean value instead of 1 (thanks @formigone #1792)
* Rope constructor was fixed enabling it again (thanks @gionatan7 #1799)
* FrameData.getFrameIndexes when called with a partial array (such as creating an animation out of a set of frames) would return the indexes array padded out with 'undefined' entries, causing short animations to never fully play through.
* AnimationManager.add no longer sets the `currentFrame` property when just adding an Animation to a Sprite. The `currentFrame` property is now only set when the animation begins playing. This avoids the Sprite.frame and Sprite.frameName properties from returning incorrect results after adding (but not playing) an Animation. It also allows very short animations (2 frames) to play correctly without needing to loop.
* PIXI.Graphics was calling Polygon.flatten in its drawShape call, causing the original Polygon object to internally change. It now takes a clone of the polygon and only flattens that (#1779)
* Tween.generateData didn't set a default value for the `frameRate` parameter if undefined, causing an infinite loop (thanks @rblopes #1782 #1785)
* Fixed the Pixelate filter, changing the `dimensions` uniform to a 2f and removing un-needed vecs from the fragment src. Also fixed the size getter and added sizeX and sizeY getters/setters (#1780)
* Tween.to and Tween.from can now accept `null` as the ease parameter value. If `null` it will use the default tween, as per the documentation (thanks @nkovacs #1817)
* TilemapParser.parseTiledJSON would ignore 'falsey' properties set on Objects in Tiled JSON tilemaps, such as `x: 0` or `visible: false`. These properties are now accurately copied over to the destination map data (thanks @MaksJS #1818)
* Removed un-necessary PIXI.TextureCache pollution in Phaser.LoaderParser.bitmapFont.

For changes in previous releases please see the extensive [Version History](https://github.com/photonstorm/phaser/blob/master/CHANGELOG.md).

![div](http://www.phaser.io/images/github/div.png)

<a name="contributing"></a>
## Contributing

Please read the [Contributors Guide][contribute] for full details on helping with Phaser, but the main points are:

- Found a bug? Report it on [GitHub Issues][issues] and include a code sample.

- Pull Requests should only be made against the `dev` branch. *Never* against `master`.

- Before submitting a Pull Request run your code through [JSHint](http://www.jshint.com/) using our [config](https://github.com/photonstorm/phaser/blob/master/.jshintrc).

- Before contributing please read the [code of conduct](https://github.com/photonstorm/phaser/blob/master/CODE_OF_CONDUCT.md).

Written something cool that shows Phaser in use? Please tell us about it in our [forum][forum] or email: support@phaser.io

[![Build Status](https://travis-ci.org/photonstorm/phaser.png?branch=dev)](https://travis-ci.org/photonstorm/phaser)

![div](http://www.phaser.io/images/github/div.png)

![storm](http://www.phaser.io/images/github/photonstorm-x2.png)

Phaser is a [Photon Storm](http://www.photonstorm.com) production.

Created by [Richard Davey](mailto:rich@photonstorm.com). Powered by coffee, anime, pixels and love.

The Phaser logo and characters are &copy; 2015 Photon Storm Limited.

All rights reserved.

"The art challenges the technology, and the technology inspires the art." - John Lasseter

[![Analytics](https://ga-beacon.appspot.com/UA-44006568-2/phaser/index)](https://github.com/igrigorik/ga-beacon)

[get-js]: https://github.com/photonstorm/phaser/releases/download/v2.3.0/phaser.js
[get-minjs]: https://github.com/photonstorm/phaser/releases/download/v2.3.0/phaser.min.js
[get-zip]: https://github.com/photonstorm/phaser/archive/v2.3.0.zip
[get-tgz]: https://github.com/photonstorm/phaser/archive/v2.3.0.tar.gz
[clone-http]: https://github.com/photonstorm/phaser.git
[clone-ssh]: git@github.com:photonstorm/phaser.git
[clone-svn]: https://github.com/photonstorm/phaser
[clone-ghwin]: github-windows://openRepo/https://github.com/photonstorm/phaser
[clone-ghmac]: github-mac://openRepo/https://github.com/photonstorm/phaser
[phaser]: https://github.com/photonstorm/phaser
[issues]: https://github.com/photonstorm/phaser/issues
[examples]: https://github.com/photonstorm/phaser-examples
[contribute]: https://github.com/photonstorm/phaser/blob/master/CONTRIBUTING.md
[forum]: http://www.html5gamedevs.com/forum/14-phaser/

[game1]: https://www.prodigygame.com/Fun-Math-Games/
[game2]: http://www.bbc.co.uk/cbbc/games/deadly-defenders-game
[game3]: http://www.defiantfew.com/
[game4]: http://www.pawpatrol.com/fun.php
[game5]: http://www.fyretale.com/
[game6]: http://www.pocoyo.com/juegos-ninos/caramelos
[game7]: http://www.html5gamedevs.com/topic/11179-phaser-cocoonjs-tap-tap-submarine/
[game8]: http://www.gamepix.com/project/footchinko/
[game9]: http://orcattack.thehobbit.com
[game10]: http://runsheldon.com/
[game11]: http://www.tempalabs.com/works/moon-rocket/
[game12]: http://www.tempalabs.com/works/master-of-arms-sword-staff-spear/
[game13]: http://m.silvergames.com/en/pocahontas-slots
[game14]: http://www.tempalabs.com/works/gattai/
