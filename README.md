![div](http://www.phaser.io/images/github/welcome-div2.png)

# Phaser

<img src="http://phaser.io/images/github/jump.jpg" align="right">

Phaser is a fast, free and fun open source HTML5 game framework. It uses a custom build of [Pixi.js](https://github.com/GoodBoyDigital/pixi.js/) for WebGL and Canvas rendering across desktop and mobile web browsers. Games can be compiled to iOS, Android and desktop apps via 3rd party tools like Cocoon, Cordova and Electron.

Along with the fantastic open source community Phaser is actively developed and maintained by [Photon Storm Limited](http://www.photonstorm.com). As a result of rapid support and a developer friendly API Phaser is currently one of the [most starred](https://github.com/showcases/javascript-game-engines) game frameworks on Github.

Thousands of developers worldwide use it. From indies and multi-national digital agencies to schools and Universities. Each creating their own incredible games. Grab the source and join in the fun!

* **Visit:** The [Phaser website](http://phaser.io) and follow on [Twitter](https://twitter.com/photonstorm) (#phaserjs)
* **Learn:** [API Documentation](http://phaser.io/docs), [Support Forum][forum] and [StackOverflow](http://stackoverflow.com/questions/tagged/phaser-framework)
* **Code:** 700+ [Source Examples](http://phaser.io/examples) (also available in this [git repo][examples])
* **Read:** Subscribe to the weekly [Phaser World Newsletter](http://phaser.io/community/newsletter)
* **Chat:** [#phaserio IRC channel](http://www.html5gamedevs.com/topic/4470-official-phaserio-irc-channel-phaserio-on-freenode/) or our [Slack Channel](http://phaser.io/news/2015/08/phaser-slack-channel)
* **Extend:** With [Phaser Plugins](http://phaser.io/shop/plugins)
* **Be awesome:** Support the future of Phaser on [Patreon](https://www.patreon.com/photonstorm) or by buying our [books](http://phaser.io/shop/books)

![div](http://www.phaser.io/images/github/div.png)

## Index

- [What's New?](#whats-new)
- [Support Phaser](#patreon)
- [Phaser World](#phaserworld)
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
## What's new in Phaser 2.4.6

<div align="center"><img src="http://phaser.io/images/github/news.jpg"></div>

> 18th February 2016

Phaser 2.4.6 is our second release in 2016 and represents several months of fixes and optimizations. As a point release it's a safe update from a previous 2.4 build, but as always please test first before upgrading, and be sure to skim through the extensive change log. There are some great new features including Dolby Digital sound support, loads of updates to Pixi and a new Webpack bundle.

Due to on-going development of Lazer (previously known as Phaser 3) Phaser is soon to enter the LTS (long-term support) stage of its life. This is when we impose a feature freeze, locking the API down and responding only to bugs. This is a necessary step to allow us to focus on Lazer while still ensuring Phaser is given the support it deserves. Thousands of developers use Phaser and we've no intention of ignoring that. However with the release of 2.4.5 we will now be moderating issues opened on GitHub to this effect.

As always, keep you eyes on the Phaser web site or [Twitter](https://twitter.com/photonstorm) for the latest news.

Finally we'd be extremely grateful if you could get involved with our [Phaser Patreon campaign](https://www.patreon.com/photonstorm). The uptake so far has been fantastic. Thank you to everyone who now supports Phaser development and shares our belief in the future of HTML5 gaming and Phasers role in that.

Happy coding everyone! See you on the forums.

Cheers,

Rich - [@photonstorm](https://twitter.com/photonstorm)

![boogie](http://www.phaser.io/images/spacedancer.gif)

![div](http://www.phaser.io/images/github/div.png)

<a name="patreon"></a>
## Support Phaser on Patreon

![patreon](http://www.phaser.io/images/patreon.png)

Please help support the future development of Phaser / Lazer through our [Patreon campaign](https://www.patreon.com/photonstorm). We've some exciting plans and there's so much we'd like to do.

### Phaser Sponsors

Phaser is [sponsored](https://www.patreon.com/photonstorm) by the following great companies:

![qici](http://www.phaser.io/images/sponsors/qici-100.png)

QICI Engine: [A powerful one-stop integrated Phaser game editor](http://www.qiciengine.com/)

![zenva](http://www.phaser.io/images/sponsors/zenva-100.png)

Zenva Academy: [Online courses on Phaser, HTML5 and native app development](https://academy.zenva.com/?zva_src=phaserpatreon)

![abra](http://www.phaser.io/images/sponsors/abra-100.png)

Abra: [Complete browser based game development](https://aurifexlabs.com/)

![div](http://www.phaser.io/images/github/div.png)

<a name="phaserworld"></a>
## Phaser World

<div align="center"><img src="http://phaser.io/images/github/phaser-world.png"></div>

[Phaser World](http://phaser.io/community/newsletter) is our free weekly newsletter published every Friday. It contains a concise round-up of all the news posted to the Phaser site that week. Including new games, tutorials, videos, occasional special offers and more.

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

`<script src="//cdn.jsdelivr.net/phaser/2.4.6/phaser.js"></script>`

or the minified version:

`<script src="//cdn.jsdelivr.net/phaser/2.4.6/phaser.min.js"></script>`

[cdnjs.com](https://cdnjs.com/libraries/phaser) also offers a free CDN service. They have all versions of Phaser and even the custom builds:

`<script src="https://cdnjs.cloudflare.com/ajax/libs/phaser/2.4.6/phaser.js"></script>`

### Phaser Sandbox

If you'd like to try coding in Phaser right now, with nothing more than your web browser then you can head over to the [Phaser Sandbox](http://phaser.io/sandbox). You'll find Quick Start templates and a user-friendly editor filled with handy code-completion features.

### Koding

Want to try Phaser without downloading anything? The site [Koding](https://koding.com) offer a complete browser-based virtual machine to work in, allowing you to clone the Phaser repo and start work immediately.

### License

Phaser is released under the [MIT License](http://opensource.org/licenses/MIT).

![div](http://www.phaser.io/images/github/div.png)

<a name="getting-started"></a>
## Getting Started

<img src="http://phaser.io/images/github/learn.jpg" align="right">

We have a [Getting Started Guide](http://phaser.io/tutorials/getting-started) which covers all you need to begin developing games with Phaser. From setting up a web server, to picking an IDE and coding your first game.

Prefer **videos** to reading? Lynda.com have published a video based course: [HTML5 Game Development with Phaser](http://www.lynda.com/Phaser-tutorials/HTML5-Game-Development-Phaser/163641-2.html) (requires subscription)

The single biggest Phaser resource is the new [Phaser web site](http://phaser.io/news). It has hundreds of tutorials listed and fresh ones are added every week, so keep coming back to see what's new!

Using Phaser with **TypeScript**? Check out this great series of [Game From Scratch](http://www.gamefromscratch.com/page/Adventures-in-Phaser-with-TypeScript-tutorial-series.aspx) tutorials.

### Source Code Examples

Ever since we started Phaser we've been growing and expanding our extensive set of source code examples. Currently there are over 700 of them!

Browse the [Phaser Examples](http://phaser.io/examples) or clone the [examples repo][examples] and eat your heart out!

### Interphase

<div align="center"><img src="http://phaser.io/content/interphase/1/images/editorial/pages.jpg"></div>

[Interphase](http://phaser.io/interphase) is a new book for Phaser developers of all skill levels.

With 400 pages of content you'll find detailed articles, game development "Making Of" guides and tutorials. All were written using the latest version of Phaser, so you won't be learning any out-dated tricks here.

As well as the book you get all the source code, graphics and assets to go with it, as well as lots of extras too.

[Read More](http://phaser.io/interphase)

### Game Mechanic Explorer

The [Game Mechanic Explorer](http://gamemechanicexplorer.com) is a great interactive way to learn how to develop specific game mechanics in Phaser. Well worth exploring once you've got your dev environment set-up.

### Mighty Editor - Visual Game Editor

[MightyEditor](http://mightyfingers.com/) is a browser-based visual Phaser game editor. Create your maps with ease, position objects and share them in seconds. It also exports to native Phaser code. Excellent for quickly setting-up levels and scenes.

![div](http://www.phaser.io/images/github/div.png)

<a name="using-phaser"></a>
## Using Phaser

Phaser is provided ready compiled in the `build` folder of the repository. There are both plain and minified versions. The plain version is for use during development and the minified version for production.

### Custom Builds

Starting from Phaser 2.3.0 we now include a brand new build system which allows you to strip out lots of additional features you may not require, saving hundreds of KB in the process. Don't use any Sound in your game? Then you can now exclude the entire sound system. Don't need Keyboard support? That can be stripped out too.

As a result of this work the minimum build size of Phaser is now just 80KB minified and gzipped.

See the [Creating a Custom Phaser Build](http://phaser.io/tutorials/creating-custom-phaser-builds) tutorial for details.

### Webpack

Starting from Phaser 2.4.5 we now include a custom build for Webpack.

You need to add `p2` as a dependency.

##### Webpack Config

```
var path = require('path');
var webpack = require('webpack');

var phaserModule = path.join(__dirname, '/node_modules/phaser/');
var phaser = path.join(phaserModule, 'build/custom/phaser-split.js'),
  pixi = path.join(phaserModule, 'build/custom/pixi.js'),
  p2 = path.join(phaserModule, 'build/custom/p2.js');

module.exports = {
    ...
    module: {
        loaders: [
            { test: /pixi.js/, loader: "script" },
        ]
    },
    resolve: {
        alias: {
            'phaser': phaser,
            'pixi.js': pixi,
            'p2': p2,
        }
    }
    ...
}
```

##### Main js file

```
require('pixi.js');
require('p2');
require('phaser');
```

### Building from source

Should you wish to build Phaser from source you can take advantage of the provided [Grunt](http://gruntjs.com/) scripts. Ensure you have the required packages by running `npm install` first.

Run `grunt` to perform a default build to the `dist` folder.

![div](http://www.phaser.io/images/github/div.png)

<a name="games"></a>
## Games made with Phaser

Thousands of games have been made in Phaser. From game jam entries to titles by some of the largest entertainment brands in the world. Here is a tiny sample:

[![Game](http://phaser.io/images/github/241/bubble-academy.png)][game10]
[![Game](http://phaser.io/images/github/241/woodventure.png)][game11]
[![Game](http://phaser.io/images/github/241/hopsop.png)][game12]
[![Game](http://phaser.io/images/github/241/banana-mania.png)][game13]
[![Game](http://phaser.io/images/github/241/salazar.png)][game14]
[![Game](http://phaser.io/images/github/241/phaser-shmup.png)][game15]
[![Game](http://phaser.io/images/github/241/trappy-trap.png)][game16]
[![Game](http://phaser.io/images/github/241/runaway-ruins.png)][game17]
[![Game](http://phaser.io/images/github/241/ananias.png)][game18]
[![Game](http://phaser.io/images/github/shot1a.jpg)][game1]
[![Game](http://phaser.io/images/github/shot2a.jpg)][game2]
[![Game](http://phaser.io/images/github/shot3a.jpg)][game3]
[![Game](http://phaser.io/images/github/shot4a.jpg)][game4]
[![Game](http://phaser.io/images/github/shot5b.jpg)][game5]
[![Game](http://phaser.io/images/github/shot6b.jpg)][game6]
[![Game](http://phaser.io/images/github/shot7b.jpg)][game7]
[![Game](http://phaser.io/images/github/shot8.jpg)][game8]
[![Game](http://phaser.io/images/github/shot9.jpg)][game9]

Artwork copyright their respective owners.

We add [new games](http://phaser.io/news/category/game) to the Phaser site weekly, so be sure to send us yours when it's finished!

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

The majority of Phaser development is now taking place on the Lazer (Phaser 3) project. The Phaser 2 branch will still be supported and issues fixed, but roadmap features have been migrated over.

<a name="phaser3"></a>
## Lazer (Phaser 3)

Lazer is the new name for Phaser 3.

Lazer is the next generation of the Phaser game framework. Using a completely ES6 base it is renderer agnostic, allowing for DOM, SVG, Canvas and WebGL rendering, across desktop and mobile web browsers.

You can read all about the philosophy behind Lazer [here](http://phaser.io/news/2016/01/phaser-in-2015-and-beyond) or join the Google Groups [mailing list](https://groups.google.com/d/forum/phaser3-dev) where progress on a regular basis.

![div](http://www.phaser.io/images/github/div.png)

<a name="change-log"></a>
## Change Log

## Version 2.4.6 - "Baerlon" - 18th February 2016

2.4.6 is a point release that addresses 2 severe bugs, and should be used in place of 2.4.5 in all instances. The 2.4.5 change log appears after this one.

### New Features

* Added RandomDataGenerator.sign, which returns a -1 or 1 (thanks @taylankasap #2328)

### Updates

* StateManager.destroy now sets `clearCache` and `clearWorld` internally before clearing the current state, as otherwise they would have been left untouched, such as from Game.destroy (thanks @i-dimitrov #2138)

### Bug Fixes

* Groups now check for `child.parent` before calling `removeFromHash` (thanks @spayton #2323 #2338)
* BaseTexture.destroy wasn't correctly removing the texture from the BaseTextureCache if it was a cached CanvasPool entry (such as Text objects use), causing drawImage errors in Canvas mode, and just blank textures in WebGL (thanks @civet #2339)
* Loader.getAudioURL and Loader.getVideoURL were hardened to support query string file URLs and still work with uri pairs and data/blobs.

## Version 2.4.5 - "Sienda" - 17th February 2016

### New Features

* You can use the new const `Phaser.PENDING_ATLAS` as the texture key for any sprite. Doing this then sets the key to be the `frame` argument (the frame is set to zero). This allows you to create sprites using `load.image` during development, and then change them to use a Texture Atlas later in development by simply searching your code for 'PENDING_ATLAS' and swapping it to be the key of the atlas data.
* BitmapText.cleanText is a new method that will scan the given text and either remove or replace all characters that are not present in the font data.
* ArcadePhysics.Body.onCeiling is a new complementary method to go with onFloor (thanks @yigitozdemir #1610)
* Text.precalculateWordWrap allows you to run your text through the Text word wrap function, which is handy if you need to handle pagination on longer pieces of text (thanks @slashman #2277)
* Sprite (and all Game Objects) have a new argument in their destroy method: `destroyTexture`. This boolean (which is false by default) controls if the BaseTexture of the Game Object should be destroyed or not. This is extremely useful in situations where you've got a lot of dynamic assets you no longer need, such as textures created from BitmapDatas. You must set the `destroyTexture` argument yourself. This can be done in a custom Game Object destroy method or as part of your state shutdown (#2261)
* The Health Game Object component has a new method: `setHealth` which allows you to set the exact health amount. This is now used by the `revive` function.
* Text.useAdvancedWrap allows you to swap between the Basic and the Advanced word wrapping functions. In Advanced it will wrap long-words and condense and trim excess white space (thanks @soldoutactivist #1811)
* The Grunt script has been updated to enhance the intro / outro and Pixi defaults. Pixi has been split into intro / outro and main blocks, so you can exclude its intro cleanly. The excludes are now bound, so if you exclude the Phaser UMD it will do the same for Pixi as well (thanks @spayton #2192)
* ArcadePhysics.worldAngleToPointer will get the angle (in radians) between a display object and the pointer, taking all parent rotations into account (thanks @mattrick16 #2171)
* There is new documentation on building Phaser for Webpack and a new custom build grunt option (thanks @deiga #2331)
* Device.safariVersion now holds the major version of the Safari browser.
* Device.edge is a boolean that is set if running under the Microsoft Edge browser.
* Device.dolby is a boolean that is set if the browser can play EC-3 Dolby Digital Plus files
* The Loader and SoundManager can now play Dolby Digital Plus files on supported devices.

### Updates

* TypeScript definitions fixes and updates (thanks @clark-stevenson @zimpy @iamfreee @milkey-mouse @juanmirod @danzel @staff0rd @sanchopancho13)
* Docs typo fixes (thanks @zeterain @staff0rd @milkey-mouse @dick-clark @nlotz @s4wny @jonjanisch @Alaxe @cdelstad @tsphillips @rblopes @vrecluse)
* Emitter methods `at`, `explode`, `flow`, `kill`, `revive`, `setAlpha`, `setRotation`, `setScale`, `setSize`, `setXSpeed`, `setYSpeed` and `start` now return the Emitter instance for better method chaining (thanks @samme #2308)
* Tilemap.hasTile will now return `false` if the Tile doesn't exist in the coordinates given (which can happen if the coordinates are out of bounds) (thanks @cy-ryo-fujiwara #2304)
* Update FrameData to check if both the numeric index was set and exists. Should fix Phaser Tiled integration as a result (thanks @Weedshaker #2298)
* Loader.loadUpdate now gets one final call when the loading is complete (before it would end and then call loadComplete, but if you had a callback bound to loadUpdate you'd never get that final 100% load event). (thanks @nexiuhm @McFarts #2297 #2296)
* The TypeScript definitions now have Phaser exported as a module in the header. This allows you to import / require the Phaser TypeScript defs (thanks @PixelWaffles #2255)
* BitmapData.setHSL now accepts 0 as a valid parameter (thanks @FracturedShader #2209)
* Force the usage of typescript 1.4.1 in the package.json so that the TypeScript defs with comments is rebuilt properly again (thanks @vulvulune #2198)
* A tiny logic update in the StateManager (thanks @jaminscript #2151)
* The Style object passed in to Phaser.Text is now cloned instead of referenced. This means you can adjust single Text instances without invaliding other Text objects using the same style object (thanks @asyncanup #2267)
* Added a typescript section to the bower and npm configs to support `tsd link` (thanks @mjohnsonengr #2189 #2180)
* SoundManager.destroy now calls AudioContext.close (thanks @stoneman1 #2237)
* Sound.onEndedHandler now sets Sound.currentTime to be Sound.durationMS (thanks @stoneman1 #2237)
* BitmapData would always create a private `_swapCanvas` which was a clone of its main canvas used for advanced movement operations. This no longer happens. The swap canvas is created only as needed, by those functions that use it (specifically `moveH` and `moveV`), meaning a BitmapData will now use half the amount of memory it used to, and you'll have half the amount of canvas DOM elements created (unless you make heavy use of the move functions).
* Tweens with 'yoyo' set on them couldn't be re-used again because the start and end properties were left in a reversed state. When a yoyo tween ends it now restores the reversed values (thanks @SBCGames  #2307)
* The width and height values passed to the Game constructor are now passed through Math.floor first. This ensures you can never create a game width non-integer dimensions, which has all kinds of implications - from browser performance to breaking things like TileSprite rendering (#2262)
* Tilemap.getObjectIndex has been removed as it didn't work correctly in most cases, and it's easier to just scan the Tilemap.objects object directly anyway (#2242)
* GameObject.revive will now set the health amount to 100 instead of 1, bringing it in-line with the `maxHealth` default value.
* Moved the Sound.disconnect after the Sound.stop call in Web Audio (#2280)
* BitmapData.drawGroup can now handle drawing Emitters and BitmapText objects that are part of the Group.
* SoundManager.setTouchLock is no longer set if `SoundManager.noAudio` is true, or if the PhaserGlobal setting `disableAudio` is true (thanks @bcjordan #2206)
* Loader.audiosprite is renamed to Loader.audioSprite (the old one still works for legacy reasons) (thanks @epaezrubio #2145)
* EarCut now replaces PolyK, which fixes advanced Graphics mask triangulation issues such as #1941
* Camera.checkBounds now takes the scale of the Camera into account (thanks @ForGorNorPor #2263)
* InputHandler.consumePointerEvent has been removed, as it was never used internally anyway, so was misleading (thanks @GregoryAveryWeir #2227)
* Events.onDragUpdate has a new 6th property `fromStart` which is a boolean. You can determine if the event was the result of the start of a drag movement or not by polling it (#2155)
* SinglePad.onDownCallback has been moved to the end of the method, so that DeviceButton.start is now called before the callback fires, meaning if you check the status of the button in the onDownCallback it will now be fully activated (thanks @suicidepills #2159)
* The `z` property assigned to children of a Group now starts from zero instead of 1, this is an internal change mostly but if you relied on the `z` property for some reason then please be aware of this (thanks pantoninho)

### Bug Fixes

* Buttons (or any Sprites) that don't have a texture, but have children, would incorrectly render the children under WebGL due to the baseTexture.skipRender property (thanks @puzzud #2141)
* TilemapParser accidentally redeclared `i` when parsing the ImageCollections which would cause an infinite loop (thanks DanHett)
* BitmapData.update causes a snowballing memory leak under WebGL due to a Context.getImageData call. BitmapData.clear used to call update automatically but no longer does. This resolves the issue of the Debug class causing excessive memory build-up in Chrome. Firefox and IE were unaffected (thanks @kingjerod #2208)
* Pausing a Sound that used a Marker for playback would fire the `onMarkerComplete` signal by mistake as well as stop the fadeTween. This Signal is now only dispatched if Sound.stop is called and the Sound isn't paused (thanks Corin)
* BitmapText.text would throw an undefined Texture error if you used a character in your text string that didn't exist in the font data.
* Animation.stop will now stop the named animation only if the `name` argument is passed and matches the currently running animation (thanks @samme #2299 #2301)
* TilemapParser accidentally redeclared `i` when parsing Tilemap Layers (thanks @ttencate and @aweber1  #2244 #2233 #2281)
* Added `removeAll` to TweenManagers stub, so the call from the StageManager doesn't throw an error in a custom build (thanks @RetrocadeNet #2284)
* Loader.binary would return a success even if the xhr'd file returned a 404 or similar (thanks @milkey-mouse @mhstar89 #2251 #2250)
* When loading audio or video from blob or data URIs, the local variable was replaced too soon, throwing errors in `getAudioURL` and `getVideoURL` (thanks @milkey-mouse @jackfreak #2236 #2234)
* Tween.hasStarted parameter was set to `false` when the tween was created, but not set again when the tween was stopped or ends. If `Tween.start` is used more than once the `onStart` callback is called only the first time (thanks @javivi91 #2199)
* During a WebGL context loss the Phaser Cache was referencing the wrong local object (thanks @allenevans #2285)
* The Video game object used an anonymous bound function for both the 'ended' and 'playing' event listeners, meaning that they were never removed properly (thanks @ramalhovfc #2303)
* BitmapData.shiftHSL incorrectly used Math.limitValue, now updated to use Math.clamp (thanks @FracturedShader #2222)
* The Loader was deleting the next waiting file from the queue if an asset pack was added after the load had started (thanks @tfelix #2203 #2204)
* Specifying Phaser.ScaleManager.EXACT_FIT as the scaleMode in a game config object would fail to use the scale mode (thanks @06wj #2248)
* BitmapText would crash if it tried to render a character that didn't exist in the font set. Any character that doesn't exist in the font set now renders a space character instead.
* BitmapText would load and parse the kerning data from the font, but would never use it when rendering. The kerning values are now applied on rendering as well (thanks @veu #2165)
* SinglePad.callbackContext is now set through addCallbacks method (thanks @puzzud #2161)
* Both `transparent` and `antialias` were ignored if set to `false` in a Game configuration object, as the `parseConfig` method didn't check for falsey values (thanks @amadeus #2302)
* GameObject.revive used to add the health amount given to the Game Object (via `heal`) instead of setting it as the new health amount. It now calls `setHealth` instead, giving it the exact amount (thanks @netgfx #2231)
* Group.add and Group.addAt would forget to remove the child from the hash of its previous Group if it had a physics body enabled, causing unbounded hash increase (thanks @strawlion @McIntozh #2232)
* Fixed a really nasty bug in Chrome OS X where a ctrl + click (i.e. simulated right-click) on a trackpad would lock up the Pointer leftButton, causing future clicks to fail. This is now handled by way of a mouseout listener on the window object, sadly the only way to force a mouseup in Chrome (thanks @KyleU #2286)
* ctrl + click is now only considered a right-click if event.buttons = 1, this should allow you to use ctrl as a key modifier on Windows (and any device with a multi-button mouse attached) and still use ctrl + click on OS X / trackpads for a right-click (thanks @yuvalsv #2167)
* If the Mouse was over a Sprite and you then clicked it, it would dispatch another Over event. This is now surpressed if the Over event has already been dispatched previously (thanks @McFarts #2133)
* InputHandler.pointerOver could fail to return anything in some instances, now always returns a boolean.
* Tween.onLoop would be fired when a Tween repeated and Tween.onRepeat would be fired when a Tween looped. These are now reversed to fire correctly (thanks @vladkens #2024)
* Text with lineSpacing set wouldn't apply the lineSpacing to the final line of text in the Text string, or to text with just single lines. This could lead to incorrect height calculations for further layout and unwanted padding at the bottom of Text objects (thanks @Lopdo #2137)
* SpriteBatch incorrectly applied the PIXI SpriteBatch prototype over the top of Phaser.Group meaning that Sprites with animations wouldn't render correctly (thanks @qdrj #1951)
* Color.updateColor would pass `color.a` to the `getColor32` method without first putting the value into the range 0 - 255 (thanks @mainpsyhos #2327)

### Pixi Updates

Please note that Phaser uses a custom build of Pixi and always has done. The following changes have been made to our custom build, not to Pixi in general.

* BaseTexture.destroy no longer checks for the `_pixiId` property on the canvas before removing it from the CanvasPool, meaning it's now destroying a lot more canvas elements than it was in the past!
* TilingSprite would ignore the `renderable` property, and render it regardless. Now it skips render if `renderable` is false (thanks @Green92 #2214)
* We have replaced the PolyK Triangulation calls within Pixi with EarCut 2.0.8. This allows for faster polygon triangulation, and also deals with more complex polygons that PolyK would crash on.
* Graphics.arc has a new argument `segments` that allows you to control how many segments are created when the arc is drawn. The default is 40. Use a higher number for more fidelity, i.e. if you find that reversed arcs are not joining up fully (#2064)
* PIXI.WebGLMaskManager.pushMask and popMask are now more robust in checking that they have been given valid mask data (#2152)
* PIXI.WebGLGraphics.stencilBufferLimit is a new integer that allows you to define how many points exist in a Graphics object before Pixi swaps to using the Stencil Buffer to render it. The default is 6 but can be increased. This fixes issues with things like Quadratic curves not rendering as masks in WebGL.
* If a Display Object with a mask contained a child with a Filter, then the child would not render. The WebGLFilterManager now retains state and creates a new stencil buffer as required (thanks @hightopo #1842)
* The Filter Texture and GL Viewport are now properly resized, fixing issues with custom resolutions and filters (thanks @englercj @amadeus #2326 #2320)
* Graphics.generateTexture has a new argument `padding` which allows you to add extra spacing onto the generated texture. This is useful for small Graphics objects where you find a few pixels getting sliced off the edges due to rounding issues (#1933)
* DisplayObject._generateCachedSprite (which is called from `updateCache` or when `cacheAsBitmap` is enabled) would bitwise | 1 the bounds width and height. This would often lead to incorrect rounding (heights of 4 would become 5, while heights of 5 would remain 5). This has now been removed and the width and height are passed through Math.ceil and then checked to make sure they aren't less than 1 pixel in either direction (thanks @alesdotio #2078)

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

The Phaser logo and characters are &copy; 2016 Photon Storm Limited.

All rights reserved.

"Above all, video games are meant to be just one thing: fun. Fun for everyone." - Satoru Iwata

[![Analytics](https://ga-beacon.appspot.com/UA-44006568-2/phaser/index)](https://github.com/igrigorik/ga-beacon)

[get-js]: https://github.com/photonstorm/phaser/releases/download/v2.4.6/phaser.js
[get-minjs]: https://github.com/photonstorm/phaser/releases/download/v2.4.6/phaser.min.js
[get-zip]: https://github.com/photonstorm/phaser/archive/v2.4.6.zip
[get-tgz]: https://github.com/photonstorm/phaser/archive/v2.4.6.tar.gz
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
[game10]: http://phaser.io/news/2015/06/bubble-academy
[game11]: http://phaser.io/news/2015/07/woodventure
[game12]: http://phaser.io/news/2015/04/hopsop-journey-to-the-top
[game13]: http://phaser.io/news/2015/05/banana-mania
[game14]: http://phaser.io/news/2015/06/salazar-the-alchemist
[game15]: http://phaser.io/news/2015/05/phaser-shmup
[game16]: http://phaser.io/news/2015/05/trappy-trap
[game17]: http://phaser.io/news/2015/04/runaway-ruins
[game18]: http://phaser.io/news/2015/04/ananias
