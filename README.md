# Phaser - HTML5 Game Framework

![Phaser Header](https://phaser.io/images/github/300/phaser-header.png "Phaser 3 Header Banner")

Phaser is a fast, free, and fun open source HTML5 game framework that offers WebGL and Canvas rendering across desktop and mobile web browsers. Games can be compiled to iOS, Android and native apps by using 3rd party tools. You can use JavaScript or TypeScript for development.

Along with the fantastic open source community, Phaser is actively developed and maintained by [Photon Storm](http://www.photonstorm.com). As a result of rapid support, and a developer friendly API, Phaser is currently one of the [most starred](https://github.com/collections/javascript-game-engines) game frameworks on GitHub.

Thousands of developers from indie and multi-national digital agencies, and universities worldwide use Phaser. You can take a look at their incredible [games](https://phaser.io/games/).

**Visit:** The [Phaser website](https://phaser.io) and follow on [Twitter](https://twitter.com/phaser_) (#phaserjs)<br />
**Learn:** [API Docs](https://photonstorm.github.io/phaser3-docs/index.html), [Support Forum][forum] and [StackOverflow](https://stackoverflow.com/questions/tagged/phaser-framework)<br />
**Code:** 1700+ [Examples](https://phaser.io/examples) (source available in this [repo][examples])<br />
**Read:** The [Phaser World](#newsletter) Newsletter<br />
**Chat:** [Slack](https://phaser.io/community/slack) and [Discord](https://phaser.io/community/discord)<br />
**Extend:** With [Phaser Plugins](https://phaser.io/shop/plugins)<br />
**Be awesome:** [Support](#support) the future of Phaser<br />

Grab the source and join the fun!

![What's New](https://phaser.io/images/github/div-whats-new.png "What's New")

<div align="center"><img src="https://phaser.io/images/github/news.jpg"></div>

> 11th October 2019

It's with great pleasure that I'm announcing the release of Phaser 3.20. You may remember that 3.19 introduced native support for Spine animations via the new Spine Plugin. 3.20 updates this plugin, bringing it in-line with the latest Spine runtimes and features. I've also fixed a few issues that crept in, so the plugin is now more solid than ever. As before, it's fully documented and exports both debug and minified files, suitable for ES6 'importing' or ES5 plugin inclusion. The whole plugin is just 68KB in size (min+gz), or a paltry 57KB if you only need the Canvas renderer! That's a really tiny payload for such a massive feature-set. You can find out more about Spine from the [Esoteric Software website](http://esotericsoftware.com/).

3.20 also introduces the brand new Video Game Object. This is a new Game Object is capable of handling playback of a previously loaded video from the Phaser Video Cache, or playing a video based on a given URL. Videos can be either local, or streamed. To all intents and purposes, a video is a standard Game Object, just like a Sprite. And as such, you can do all the usual things to it, such as scaling, rotating, cropping, tinting, making interactive, giving a physics body, etc.

Transparent videos are also possible via the WebM file format. Providing the video file has was encoded with an alpha channel, and providing the browser supports WebM playback (not all of them do), then it willl render in-game with full transparency. You can also save a video to the Texture Manager, allowing other Game Objects to use it as their texture, including using it as a sampler2D input for a shader. See the Video Game Object class for more details. Other Video related changes are as follows:

There are also updates to Arcade Physics, from the team at GameFroot, helping to fix issues on low, or super-high FPS systems. The Facebook Instant Games Plugin has also been updated, fixing a few issues with showing ads and in the docs. I've also spent a good while addressing `pixelArt` mode in WebGL, so now _all_ native Game Objects should respect the setting, meaning your games can be crispier than ever before!

As usual, it doesn't end here. There are plenty more fixes, features and updates across the API. You'll find loads more great new features, updates and fixes. So, as usual, please do spend some time digging through the [Change Log](#changelog). I assure you, it's worth while :)

A massive thank-you to everyone who supports Phaser on Patreon and PayPal. Your continued backing has allowed me to work on Phaser all year, and this great new releases is the very real result of that. If you've ever considered becoming a backer, now is the perfect time!

If you'd like to stay abreast of developments then I publish my [Developer Logs](https://phaser.io/phaser3/devlog) in the [Phaser World](https://phaser.io/community/newsletter) newsletter. Subscribe to stay in touch and get all the latest news from the core team and the wider community.

You can also follow Phaser on [Twitter](https://twitter.com/phaser_) and chat with fellow Phaser devs in our [Slack](https://phaser.io/community/slack) and [Discord](https://phaser.io/community/discord) channels.

Phaser 3 wouldn't have been possible without the fantastic support of the community and Patreon. Thank you to everyone who supports our work, who shares our belief in the future of HTML5 gaming, and Phaser's role in that.

Happy coding everyone!

Cheers,

Rich - [@photonstorm](https://twitter.com/photonstorm)

![boogie](https://www.phaser.io/images/spacedancer.gif)

![Support Phaser](https://phaser.io/images/github/div-support-phaser.png "Support Phaser")

Because Phaser is an open source project, we cannot charge for it in the same way as traditional retail software. What's more, we don't ever want to. After all, it's built on, and was born from, open web standards. It's part of our manifesto that the core framework will always be free, even if you use it commercially, as many of you do.

**You may not realize it, but because of this, we rely 100% on community backing to fund development.**

Those funds allow Phaser to improve, and when it improves, everyone involved benefits. Your support helps secure a constant cycle of updates, fixes, new features and planning for the future.

There are other benefits to [backing Phaser](https://www.patreon.com/join/photonstorm), too:

![Backers Perks](https://phaser.io/images/github/patreon-perk-chart.png)

We use [Patreon](https://www.patreon.com/photonstorm) to manage the backing and you can [support Phaser](https://www.patreon.com/join/photonstorm?) from $1 per month. The amount you pledge is entirely up to you and can be changed as often as you like. Patreon renews monthly, just like Netflix. You can, of course, cancel at any point. Tears will be shed on this end, but that's not your concern.

Extra special thanks to the following companies who's support makes Phaser possible:

* [Cerebral Fix](https://cerebralfix.com)
* [CrossInstall](https://crossinstall.com)
* [Facebook](https://www.facebook.com)
* [Game Distribution](https://gamedistribution.com)
* [GameCommerce](https://www.gamecommerce.com)
* [Mozilla](https://www.mozilla.org)
* [Texture Packer](https://www.codeandweb.com/texturepacker/tutorials/how-to-create-sprite-sheets-for-phaser3?utm_source=ad&utm_medium=banner&utm_campaign=phaser-2018-10-16)
* [Twilio](https://www.twilio.com)
* [Y8 Games](https://www.y8.com)
* [Poki](https://developers.poki.com/)

![Sponsors](https://phaser.io/images/github/sponsors-2019-08.png "Awesome  Sponsors")

![Phaser Newsletter](https://phaser.io/images/github/div-newsletter.png "Phaser Newsletter")

<div align="center"><img src="https://phaser.io/images/github/phaser-world.png"></div>

We publish the [Phaser World](https://phaser.io/community/newsletter) newsletter. It's packed full of the latest Phaser games, tutorials, videos, meet-ups, talks, and more. The newsletter also contains our weekly Development Progress updates which let you know about the new features we're working on.

Over 140 previous editions can be found on our [Back Issues](https://phaser.io/community/backissues) page.

![Download Phaser](https://phaser.io/images/github/div-download.png "Download Phaser")
<a name="download"></a>

Phaser 3 is available via GitHub, npm and CDNs:

* Clone the git repository via [https][clone-http], [ssh][clone-ssh] or with the Github [Windows][clone-ghwin] or [Mac][clone-ghmac] clients.
* Download as [zip](https://github.com/photonstorm/phaser/archive/master.zip)
* Download the build files: [phaser.js][get-js] and [phaser.min.js][get-minjs]

### NPM

Install via [npm](https://www.npmjs.com):

```bash
npm install phaser
```

### CDN

[![](https://data.jsdelivr.com/v1/package/gh/photonstorm/phaser/badge)](https://www.jsdelivr.com/package/gh/photonstorm/phaser)

[Phaser is on jsDelivr](https://www.jsdelivr.com/projects/phaser) which is a "super-fast CDN for developers". Include the following in your html:

```html
<script src="//cdn.jsdelivr.net/npm/phaser@3.20.1/dist/phaser.js"></script>
```

or the minified version:

```html
<script src="//cdn.jsdelivr.net/npm/phaser@3.20.1/dist/phaser.min.js"></script>
```

### API Documentation

Go to https://photonstorm.github.io/phaser3-docs/index.html to read the docs online. Use the drop-down menus at the top to navigate the namespaces, classes and Game Objects lists.

Or, if you wish to run the docs locally you can checkout the [phaser3-docs](https://github.com/photonstorm/phaser3-docs) repository and then read the documentation by pointing your browser to the `docs/` folder.

The documentation for Phaser 3 is an on-going project. Please help us by searching the Phaser code for any instance of the string `[description]` and then replacing it with some documentation.

### TypeScript Definitions

The [TypeScript definitions](https://github.com/photonstorm/phaser/tree/master/types) can be found inside the `types` folder. They are also referenced in the types entry in `package.json`.

Depending on your project, you may need to add the following to your `tsconfig.json` file:

```json
"typeRoots": [
    "./node_modules/phaser/types"
],
"types": [
    "Phaser"
]
```

The defs are automatically generated from the JSDoc comments found in the Phaser source code. If you wish to help refine them then you must edit the Phaser JSDoc blocks directly, not the defs file. You can find more details about the parser we built in the `scripts/tsgen` folder.

### Webpack

We use Webpack to build Phaser and we take advantage of its conditional build flag feature to handle renderer swapping. If you wish to use Webpack with Phaser then please use our [Phaser 3 Project Template](https://github.com/photonstorm/phaser3-project-template) as it's already set-up to handle the build conditions Phaser needs. Recent changes to our build steps mean you should now be able to use any other packager, like Parcel, without any config changes.

### License

Phaser is released under the [MIT License](https://opensource.org/licenses/MIT).

![Getting Started](https://phaser.io/images/github/div-getting-started.png "Getting Started")
<a name="getting-started"></a>

<img src="https://phaser.io/images/github/learn.jpg" align="right">

Tutorials and guides on Phaser 3 development are being published every week.

* [Getting Started with Phaser 3](https://phaser.io/tutorials/getting-started-phaser3) (useful if you are completely new to Phaser)
* [Making your first Phaser 3 Game](https://phaser.io/tutorials/making-your-first-phaser-3-game)
* The [Complete Phaser 3 Game Development course](https://academy.zenva.com/product/html5-game-phaser-mini-degree/?a=13) contains over 15 hours of videos covering all kinds of important topics.
* Plus, there are [over 700 Phaser tutorials](http://phaser.io/learn) listed on the official website.

Also, please subscribe to the [Phaser World](https://phaser.io/community/newsletter) newsletter for details about new tutorials as they are published.

### Facebook Instant Games

Phaser 3.13 introduced the new [Facebook Instant Games](http://phaser.io/news/2018/10/facebook-instant-games-phaser-tutorial) Plugin. The plugin provides a seamless bridge between Phaser and version 6.2 of the Facebook Instant Games SDK. Every single SDK function is available via the plugin and we will keep track of the official SDK to make sure they stay in sync.

The plugin offers the following features:

* Easy integration with the Phaser Loader so load events update the Facebook progress circle.
* Events for every plugin method, allowing the async calls of the SDK to be correctly inserted into the Phaser game flow. When SDK calls resolve they will surface naturally as a Phaser event and you'll know you can safely act upon them without potentially doing something mid-way through the game step.
* All Plugin methods check if the call is part of the supported APIs available in the SDK, without needing to launch an async request first.
* Instant access to platform, player and locale data.
* Easily load player photos directly into the Texture Manager, ready for use with a Game Object.
* Subscribe to game bots.
* The plugin has a built-in Data Manager which makes dealing with data stored on Facebook seamless. Just create whatever data properties you need and they are automatically synced.
* Support for FB stats, to retrieve, store and increment stats into cloud storage.
* Save Session data with built-in session length validation.
* Easy context switching, to swap between game instances and session data retrieval.
* Easily open a Facebook share, invite, request or game challenge window and populate the text and image content using any image stored in the Texture cache.
* Full Leaderboard support. Retrieve, scan and update leaderboard entries, as well as player matching.
* Support for in-app purchases, with product catalogs, the ability to handle purchases, get past purchases and consume previously unlocked purchases.
* Easily preload a set of interstitial ads, in both banner and video form, then display the ad at any point in your game, with in-built tracking of ads displayed and inventory available.
* Plus other features, such as logging to FB Analytics, creating short cuts, switching games, etc.

We've 3 tutorials related to Facebook Instant Games and Phaser:

* [Getting Started with Facebook Instant Games](http://phaser.io/news/2018/10/facebook-instant-games-phaser-tutorial)
* [Facebook Instant Games Leaderboards Tutorial](http://phaser.io/news/2018/11/facebook-instant-games-leaderboards-tutorial)
* [Displaying Ads in your Instant Games](http://phaser.io/news/2018/12/facebook-instant-games-ads-tutorial)

A special build of Phaser with the Facebook Instant Games Plugin ready-enabled is [available on jsDelivr](https://www.jsdelivr.com/projects/phaser). Include the following in your html:

```html
<script src="//cdn.jsdelivr.net/npm/phaser@3.20.1/dist/phaser-facebook-instant-games.js"></script>
```

or the minified version:

```html
<script src="//cdn.jsdelivr.net/npm/phaser@3.20.1/dist/phaser-facebook-instant-games.min.js"></script>
```

The build files are in the git repository in the `dist` folder, and you can also include the plugin in custom builds.

### Source Code Examples

During our development of Phaser 3, we created hundreds of examples with the full source code and assets ready available. These examples are now fully integrated into the [Phaser website](https://phaser.io/examples). You can also browse them on [Phaser 3 Labs](https://labs.phaser.io) via a more advanced interface, or clone the [examples repo][examples]. We are constantly adding to and refining these examples.

### Create Your First Phaser 3 Example

Create an `index.html` page locally and paste the following code into it:

```html
<!DOCTYPE html>
<html>
<head>
    <script src="https://cdn.jsdelivr.net/npm/phaser@3.20.1/dist/phaser-arcade-physics.min.js"></script> 
</head>
<body>

    <script></script>

</body>
</html>
```

This is a standard empty webpage. You'll notice there's a script tag that is pulling in a build of Phaser 3, but otherwise this webpage doesn't do anything yet. Now let's set-up the game config. Paste the following between the `<script></script>` tags:

```javascript
var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 200 }
        }
    },
    scene: {
        preload: preload,
        create: create
    }
};
```

`config` is a pretty standard Phaser 3 Game Configuration object. We tell `config` to use the WebGL renderer if it can, set the canvas to a size of 800x600 pixels, enable Arcade Physics, and finally call the `preload` and `create` functions. `preload` and `create` have not been implemented yet, so if you run this JavaScript code, you will have an error. Add the following after `config`:

```javascript
var game = new Phaser.Game(config);

function preload ()
{
    this.load.setBaseURL('http://labs.phaser.io');

    this.load.image('sky', 'assets/skies/space3.png');
    this.load.image('logo', 'assets/sprites/phaser3-logo.png');
    this.load.image('red', 'assets/particles/red.png');
}

function create ()
{
}
```

`game` is a Phaser Game instance that uses our configuration object `config`. We also add function definitions for `preload` and `create`. The `preload` function helps you easily load assets into your game. In `preload`, we set the Base URL to be the Phaser server and load 3 PNG files.

The `create` function is empty, so it's time to fill it in:

```javascript
function create ()
{
    this.add.image(400, 300, 'sky');

    var particles = this.add.particles('red');

    var emitter = particles.createEmitter({
        speed: 100,
        scale: { start: 1, end: 0 },
        blendMode: 'ADD'
    });

    var logo = this.physics.add.image(400, 100, 'logo');

    logo.setVelocity(100, 200);
    logo.setBounce(1, 1);
    logo.setCollideWorldBounds(true);

    emitter.startFollow(logo);
}
```

Here we add a sky image into the game and create a Particle Emitter. The `scale` value means that the particles will initially be large and will shrink to nothing as their lifespan progresses.

After creating the `emitter`, we add a logo image called `logo`. Since `logo` is a Physics Image, `logo` is given a physics body by default. We set some properties for `logo`: velocity, bounce (or restitution), and collision with the world bounds. These properties will make our logo bounce around the screen. Finally, we tell the particle emitter to follow the logo - so as the logo moves, the particles will flow from it.

Run it in your browser and you'll see the following:

![Phaser 3 Demo](https://phaser.io/images/github/300/sample1.png "Phaser 3 Demo")

(Got an error? Here's the [full code](https://gist.github.com/photonstorm/46cb8fb4b19fc7717dcad514cdcec064))

This is a tiny example, and there are hundreds more for you to explore, but hopefully it shows how expressive and quick Phaser is to use. With just a few easily readable lines of code, we've got something pretty impressive up on screen!

Subscribe to our newsletter for further tutorials and examples.

![Building Phaser](https://phaser.io/images/github/div-building-phaser.png "Building Phaser")

There are both plain and minified compiled versions of Phaser in the `dist` folder of the repository. The plain version is for use during development, and the minified version is for production use. You can also create your own builds.

### Custom Builds

Phaser 3 is built using Webpack and we take advantage of the Webpack definePlugin feature to allow for conditional building of the Canvas and WebGL renderers and extra plugins. You can custom the build process to only include the features you require. Doing so can cut the main build file size down to just 70KB.

Read our [comprehensive guide](https://phaser.io/phaser3/devlog/127) on creating Custom Builds of Phaser 3 for full details.

### Building from Source

If you wish to build Phaser 3 from source, ensure you have the required packages by cloning the repository and then running `npm install` on your source directory.

You can then run `webpack` to create a development build in the `build` folder which includes source maps for local testing. You can also `npm run dist` to create a minified packaged build in the `dist` folder. For a list of all commands available use `npm run help`.

![Change Log](https://phaser.io/images/github/div-change-log.png "Change Log")
<a name="changelog"></a>

# Change Log

## Version 3.20.1 - Fitoria - 15th October 2019

### Updates

* The `remove-files-webpack-plugin` plugin has been moved to a devDependency (thanks @noseglid)

### Bug Fixes

* `UpdateList.shutdown` wasn't removing the Scene Update event listener, causing actions to be multiplied on Scene restart (such as animation playback). Fix #4799 (thanks @jronn)
* `Container.mask` wouldn't render in WebGL due to a change in the way child masks were handled. Container masking now works again as in 3.19. Fix #4803 (thanks @paulsymphony)
* `DynamicTilemapLayer.setCollision` would cause an `indexOf` error when trying to access the layer data. Fix #4800 (thanks @PavelMishin)
* `SceneManager.run` (and consequently `ScenePlugin.run`) was using an out-dated way of checking if a Scene was paused before trying to resume it, causing a Scene to be started again instead of resumed. It now uses the `Systems.isPaused` function instead. Fix #3931 (thanks @alexeymolchan)

## Version 3.20.0 - Fitoria - 11th October 2019

### Video Game Object

This is a new Game Object is capable of handling playback of a previously loaded video from the Phaser Video Cache,
or playing a video based on a given URL. Videos can be either local, or streamed:

```javascript
preload () {
  this.load.video('pixar', 'nemo.mp4');
}

create () {
  this.add.video(400, 300, 'pixar');
}
```

To all intents and purposes, a video is a standard Game Object, just like a Sprite. And as such, you can do
all the usual things to it, such as scaling, rotating, cropping, tinting, making interactive, giving a
physics body, etc.

Transparent videos are also possible via the WebM file format. Providing the video file has was encoded with
an alpha channel, and providing the browser supports WebM playback (not all of them do), then it willl render
in-game with full transparency.

You can also save a video to the Texture Manager, allowing other Game Objects to use it as their texture,
including using it as a sampler2D input for a shader.

See the Video Game Object class for more details. Other Video related changes are as follows:

* `Loader.FileTypes.VideoFile` is a new Video File Loader File Type, used for preloading videos as streams or blobs.
* `WebGLRenderer.createVideoTexture` is a new method that will create a WebGL Texture from the given Video Element.
* `WebGLRenderer.updateVideoTexture` is a new method that will update a WebGL Texture from the given Video Element.
* `TextureSource.isVideo` is a new boolean property that is set when the Texture Source is backed by an HTML Video Element.
* `Cache.video` is a new global cache that store loaded Video content.
* `Device.Video.h264Video` has been renamed to `Device.Video.h264` to keep it in-line with the Audio Device names.
* `Device.Video.hlsVideo` has been renamed to `Device.Video.hls` to keep it in-line with the Audio Device names.
* `Device.Video.mp4Video` has been renamed to `Device.Video.mp4` to keep it in-line with the Audio Device names.
* `Device.Video.oggVideo` has been renamed to `Device.Video.ogg` to keep it in-line with the Audio Device names.
* `Device.Video.vp9Video` has been renamed to `Device.Video.vp9` to keep it in-line with the Audio Device names.
* `Device.Video.webmVideo` has been renamed to `Device.Video.webm` to keep it in-line with the Audio Device names.

### Spine Plugin

* The Spine runtimes have been updated to 3.8. Please note that Spine runtimes are _not_ backwards compatible. Animations exported with Spine 3.7 (or earlier) will need re-exporting with 3.8 in order to work with the new runtimes.
* Fixed a bug with the binding of the Spine Plugin causing the GameObjectFactory to remain bound to the first instance of the plugin, causing Scene changes to result in blank Spine Game Objects. Fix #4716 (thanks @olilanz)
* Fixed a bug with the caching of the Spine Texture Atlases, causing shader errors when returning from one Scene to another with a cached Texture Atlas.
* The WebGL Scene Renderer is now only disposed if the Scene is destroyed, not just shut-down.
* The Spine Game Object will no longer set the default skin name to be 'default', it will leave the name empty. Fix #4764 (thanks @Jonchun @badlogic)
* Thanks to a fix inside the Container WebGLRenderer, a bug was crushed which involved multiple Containers in a Scene, with Spine objects, from causing run-time errors. Fix #4710 (thanks @nalgorry)
* Using `Loader.setPath` to define the Spine assets locations could error if trying to load multiple files from different folders. It will now retain the path state at the time of invocation, rather than during the load.
* When loading Spine files that used the same internal image file names, only the first file would successfully load. Now, all files load correctly.

### Facebook Instant Games Plugin

* Calling `showAd` or `showVideoAd` will now check to see if the ad has already been displayed, and skip it when iterating the ads array, allowing you to display an ad with the same Placement ID without preloading it again. Fix #4728 (thanks @NokFrt)
* Calling `gameStarted` in a game that doesn't load any assets would cause the error `{code: "INVALID_OPERATION", message: "Can not perform this operation before game start."}`. The plugin will now has a new internal method `gameStartedHandler` and will redirect the flow accordingly based on asset loading. Fix #4550 (thanks @bchee)
* The documentation for the `chooseContext` method has been fixed. Fix #4425 (thanks @krzysztof-grzybek)
* `Leaderboard.getConnectedScores` incorrectly specified two parameters, neither of which were used. Fix #4702 (thanks @NokFrt)
* `Leaderboard` extends Event Emitter, which was missing in the TypeScript defs. Fix #4703 (thanks @NokFrt)

### Arcade Physics Updates

@BenjaminDRichards and the GameFroot team contributed the following updates to Arcade Physics, which fixes 3 issues encountered when the framerate drops below 60 (technically, any time when multiple physics steps run per frame, so if physics FPS is above 60 this will also occur.)

Issue 1: Friction starts to flip out. Objects on moving platforms get pushed ahead of the platform and "catch" on the leading edge.
Issue 2: Physics objects start to dip into the floor. In the "Before" demo, the camera is locked to the player, so this appears as the entire world starting to shake up and down.
Issue 3: When objects dip into the floor, their "rest velocity" is non-zero. This can affect debug and other logic.

* `Body.prevFrame` is a new vector allowing a Body to distinguish between frame-length changes and step-length changes. Several steps may run for every frame, particularly when fps is low.
* `Body._reset` flag was removed and replaced it with a check of `Body.moves`. The flag only turned on when `moves` was true, and never turned off.
* Added a reset of `prev` in Arcade.Body#step. This fixes the friction issue.
* Stopped the `Body.postUpdate` method from setting `_dx`, `_dy`, and `prev`. They remain in the state they were at the end of the last physics step. This will affect the delta methods, which are documented to provide step-based data (not frame-based data); they now do so. However, because several steps may run per frame, you can't interrogate every step unless you're running functions based on physics events like collisions. You'll just see the latest step. This should partially balance out the extra load of resetting prev.
* Added a zero-out of stepsLastFrame in Arcade.World#postUpdate, which would otherwise never zero out and keep running at least one pass per frame. This should improve performance when frames can be skipped.
* Removed `blocked` checks from `TileCheckX` and `TileCheckY`. Originally, this prevented multiple checks when an object had come to rest on a floor. However, when multiple steps run per frame, the object will accelerate again, the floor won't stop it on steps 2+, and it will end the frame a short distance into the floor. Removing the blocked checks will fix the floor dip issue and the rest velocity issue. Although this opens up multiple checks, this is probably very rare: how many times does an object hit two different floors in a single frame?

In combination these updates fix issues #4732 and #4672. My thanks to @BenjaminDRichards and @falifm.

### New Features

* `GameConfig.antialiasGL` is a new boolean that allows you to set the `antialias` property of the WebGL context during creation, without impacting any subsequent textures or the canvas CSS.
* `InteractiveObject.alwaysEnabled` is a new boolean that allows an interactive Game Object to always receive input events, even if it's invisible or won't render.
* `Bob.setTint` is  a new method that allows you to set the tint of a Bob object within a Blitter. This is then used by the Blitter WebGL Renderer (thanks @rexrainbow)
* The `UpdateList` now emits two new events: 'add' and 'remove' when children are added and removed from it. Fix #3487 (thanks @hexus)
* The `Tilemap.setCollision` method has a new optional boolean parameter `updateLayer`. If set to `true`, it will update all of the collision settings of all tiles on the layer. If `false` it will skip doing this, which can be a huge performance boost in situations where the layer tiles haven't been modified and you're just changing collision flags. This is especially suitable for maps using procedural generated tilemaps, infinite tilemaps, multiplayer tilemaps, particularly large tilemaps (especially those dyanmic in nature) or who otherwise intend to index collisions before the tiles are loaded. This update also added the new parameter to the `SetCollision`, `SetCollisionBetween` and `DynamicTilemapLayer.setCollision` methods (thanks @tarsupin)
* `ArcadePhysics.Body.setBoundsRectangle` is a new method that allows you to set a custom bounds rectangle for any Body to use, rather than the World bounds, which is the default (thanks @francois-n-dream)
* `ArcadePhysics.Body.customBoundsRectangle` is a new property used for custom bounds collision (thanks @francois-n-dream)
* The Arcade Physics Group has a new config object property `customBoundsRectangle` which, if set, will set the custom world bounds for all Bodies that Group creates (thanks @francois-n-dream)
* `WebGLRenderer.createTexture2D` has a new optional parameter `flipY` which sets the `UNPACK_FLIP_Y_WEBGL` flag of the uploaded texture.
* `WebGLRenderer.canvasToTexture` has a new optional parameter `flipY` which sets the `UNPACK_FLIP_Y_WEBGL` flag of the uploaded texture.
* `WebGLRenderer.createCanvasTexture` is a new method that will create a WebGL Texture based on the given Canvas Element.
* `WebGLRenderer.updateCanvasTexture` is a new method that will update an existing WebGL Texture based on the given Canvas Element.
* `WebGLRenderer.createVideoTexture` is a new method that will create a WebGL Texture based on the given Video Element.
* `WebGLRenderer.updateVideoTexture` is a new method that will update an existing WebGL Texture based on the given Video Element.
* `TextureSource.flipY` is a new boolean that controls if the `UNPACK_FLIP_Y_WEBGL` flag is set when a WebGL Texture is uploaded.
* `TextureSource.setFlipY` is a new method that toggles the `TextureSource.flipY` property.

### Updates

* When calling `Shader.setRenderToTexture()` it will now draw the shader just once, immediately to the texture, to avoid the texture being blank for a single frame (thanks Kyle)
* The private `Shader._savedKey` property has been removed as it wasn't used anywhere internally.
* A `hasOwnProperty` check has been applied to the `SceneManager.createSceneFromObject` method when parsing additional properties in the `extend` object (thanks @halilcakar)
* The `Blitter.dirty` flag is no longer set if the render state of a Bob is changed to make it invisible (thanks @rexrainbow)
* `WebGLPipeline.addAttribute` will now automatically update the vertextComponentCount for you, without you having to do it manually any more (thanks @yhwh)
* `MultiFile` has three new internal properties: `baseURL`, `path` and `prefix` which allow them to retain the state of the loader at the time of creation, to be passed on to all child-files. Fix #4679.
* `LoaderPlugin` and `MultiFile` have a new private property `multiKeyIndex` which multi-files use and increment when batching sub-file loads.
* TileSprites will now throw a console warning if you try to use a RenderTexture or GLTexture as their frame source. Fix #4719 (thanks @pavel-shirobok)
* `TextureSource.isGLTexture` now checks if the browser supports `WebGLTexture` before checking to see if source is an instance of one. This should fix issues with Phaser in HEADLESS mode running under node / jsdom, or where WebGLTexture isn't present. Fix #4711 (thanks @tsphillips)
* `GameObject.ToJSON` will no longer output the `scaleMode` in the json because it's not a valid Game Object property.
* `TextureSource.setFilter` will now set the `scaleMode` to the given filter.
* `CanvasInterpolation` has updated the order of the CSS properties so that `crisp-edges` comes after the browser prefix versions.
* The `CanvasRenderer.scaleMode` property has been removed as it was never set or used internally.
* The `CanvasRenderer.currentScaleMode` property has been removed as it was never set or used internally.
* The `BuildGameObject` function will no longer set `scaleMode` because it's not a valid Game Object property.
* `CanvasRenderer.antialias` is a new property, populated by the game config property of the same name (or via the `pixelArt` property) that will tell the canvas renderer what to set image interpolation to during rendering of Sprites.
* `SetTransform` will now set the imageSmoothingEnabled context value based on the renderer and texture source scale mode.
* The Blitter Canvas Renderer will now respect the game config anti-alias / pixel art settings and render accordingly.
* The Particle Emitter Canvas Renderer will now respect the game config anti-alias / pixel art settings and render accordingly.
* The Static Tilemap Canvas Renderer will now respect the game config anti-alias / pixel art settings and render accordingly.
* The Dynamic Tilemap Canvas Renderer will now respect the game config anti-alias / pixel art settings and render accordingly.
* All Game Objects that use the Canvas Set Transform function (which is most of them) will aos now respect the game config anti-alias / pixel art settings and render accordingly. This means you can now have properly scaled Bitmap Text, Text, Sprites, Render Textures, etc when pixel art is enabled in your game. Fix #4701 (thanks @agar3s)
* Containers are now able to set the alpha quadrant values (topLeft, topRight, bottomLeft and bottomRight) and have these passed onto children which are capable of supporting them, such as Sprites. Fix #4714 (thanks @MrcSnm)
* The `ProcessQueue` struct now extends Event Emitter and will emit `PROCESS_QUEUE_ADD_EVENT` when a new item is added to it.
* The `ProcessQueue` struct now extends Event Emitter and will emit `PROCESS_QUEUE_REMOVE_EVENT` when an item is removed from it.
* `ProcessQueue.removeAll` is a new method that will remove all active entries from the queue.
* `ProcessQueue.length` is a new property that returns the size of the active list.
* `UpdateList` now extends the `ProcessQueue` struct and uses all of its methods for list management, instead of doing it directly. This means private properties such as `UpdateList._list` no longer exist. It also fixes an issue re: memory management where list items would remain until the end of a Scene. Fix #4721 (thanks @darkgod6)
* `BaseSoundManager.forEachActiveSound` will now only invoke the callback if the sound actually exists and isn't pending removal. Fix #3383 (thanks @DouglasLapsley)
* `MouseManager.target` can now be defined as either a string or by passing an HTMLElement directly. Fix #4353 (thanks @BigZaphod)
* The `BasePlugin.boot` method has been removed and moved to `ScenePlugin.boot` as it's a Scene-level method only (thanks @samme)
* The `BasePlugin.scene` and `BasePlugin.systems` properties have been removed and are defined in `ScenePlugin`, as they are Scene-level properties only (thanks @samme)
* The `Tween.getValue` method has been updated so you can specify the index of the Tween Data to get the value of. Previously, it only returned the first TweenData from the data array, ignoring any subsequent properties or targets. Fix #4717 (thanks @chepe263)
* `WebGLRenderer.createTexture2D` has a new optional parameter `forceSize`, which will force the gl texture creation to use the dimensions passed to the method, instead of extracting them from the pixels object, if provided.
* The `GameObject.setTexture` method can now accept either a string, in which case it looks for the texture in the Texture Manager, or a Texture instance, in which case that instance is set as the Game Object's texture.
* `TextureManager.get` can now accept either a string-based key, or a Texture instance, as its parameter.
* `SceneManager.stop` and the matching `ScenePlugin.stop` now have an optional `data` parameter, which is passed to the Scene shutdown method. Fix #4510 (thanks @Olliebrown @GetsukenStudios)
* `Cameras.BaseCamera` is now exposed in the namespace, allowing you to access them directly (thanks @rexrainbow)
* Shaders have a new optional constructor parameter `textureData` which allows you to specify additional texture data, especially for NPOT textures (thanks @cristlee)
* `TouchManager.disableContextMenu` is a new method that will try to disable the context menu on touch devices, if the Game Config `disableContextMenu` is set. Previously, it only tried to do it for the Mouse Manager, but now does it for touch as well. Fix #4778 (thanks @simplewei)

### Bug Fixes

* `SpineCanvasPlugin.shutdown` would try to dispose of the `sceneRenderer`, but the property isn't set for Canvas.
* `ArcadePhysics.Body.checkWorldBounds` would incorrectly report as being on the World bounds if the `blocked.none` flag had been toggled elsewhere in the Body. It now only sets if it toggles a new internal flag (thanks Pablo)
* `RenderTexture.resize` wouldn't update the CanvasTexture width and height, causing the cal to draw or drawFrame to potentially distort the texture (thanks @yhwh)
* `InputPlugin.processDragMove` has been updated so that the resulting `dragX` and `dragY` values, sent to the event handler, now compensate for the scale of the Game Objects parent container, if inside of one. This means dragging a child of a scale Container will now still drag at 'full' speed.
* The RenderTextures `displayOrigin` values are now automatically updated if you call `setSize` on the Render Texture. Fix #4757 (thanks @rexrainbow)
* `onTouchStart`, `onTouchEnd` and `onTouchMove` will now check for `event.cancelable` before calling preventDefault on the touch event, fixing issues with "Ignored attempt to cancel a touchstart event with cancelable=false, for example because scrolling is in progress and cannot be interrupted." errors in some situations. Fix #4706 (thanks @MatthewAlner)
* `MatterPhysics.shutdown` could try to access properties that may have been previously removed during the Game.destroy process, causing a console error. It now checks properties before removing events from them (thanks @nagyv)
* `ArcadePhysics.Body.hitTest` would use CircleContains to do a hit test, which assumex x/y was the Circle center, but for a Body it's the top-left, causing the hit test to be off. Fix #4748 (thanks @funnisimo)
* `ArcadePhysics.World.separateCircle` has had the velocity scaling moved to after the angle is calculated, fixing a weird collision issue when `Body.bounce=0`. Also, if both bodies are movable, they now only offset by half the offset and use the center of the body for angle calculation, allowing for any offsets to be included. Fix #4751 (thanks @funnisimo @hizzd)
* `Tween.updateTo` would break out of the TweenData iteration as soon as it adjusted the first matching key, causing tweens acting on multiple targets to only update the first target. It now updates them all. Fix #4763 (thanks @RBrNx)
* The Container WebGLRenderer will now handle child mask batching properly, based on the renderers current mask.
* The Container WebGLRenderer will now handle child new type switching, allowing you to carry on with a batch of same-type Game Objects even if they're nested within Containers. Fix #4710 (thanks @nalgorry)
* `MultiAtlasFiles` that loaded their own external images would obtain incorrect path and URL values if the path had been changed by another file in the queue. They now retain the loader state and apply it to all child files during load.
* If more than one `MultiAtlasFile` used the same internal file name for its images, subsequent multi-atlases would fail to load. Fix #4330 (thanks @giviz)
* `MultiAtlasFiles` would incorrectly add the atlas JSON into the JSON cache, causing you to not be able to destroy and reload the texture using the same atlas key as before. Fix #4720 (thanks @giviz)
* `RenderTexture.fill` wasn't setting the camera up before drawing the fill rect, causing it to appear in the wrong place and the wrong size. Fix #4390 (thanks @Jerenaux)
* `DynamicBitmapText.setOrigin` wouldn't change the origin when using the Canvas Renderer, only in WebGL. It now sets the origin regardless of renderer. Fix #4108 (thanks @garethwhittaker)
* `DynamicBitmapText` wouldn't respect the multi-line alignment values when using the Canvas Renderer. It now uses them in the line calculations.
* `DynamicBitmapText` and `BitmapText` wouldn't render at the correct position when using scaled BitmapText and an origin. Fix #4054 (thanks @Aveyder)
* Incorrect lighting on batched Sprites. The lighting was not correct when batching several sprites with different rotations. Each sprite now uses its own `uInverseRotationMatrix` to compute the lighting correctly (thanks @gogoprog)
* Matter.js Body wasn't setting the part angles correctly in `Body.update` (thanks @Frozzy6)
* `ScaleManager.startFullscreen` now checks to see if the call returns a Promise, rather than checking if the browser supports them, before waiting for promise resolution. This fixes a runtime console warning in Microsoft Edge. Fix #4795 (thanks @maksdk)

### Examples, Documentation and TypeScript

My thanks to the following for helping with the Phaser 3 Examples, Docs and TypeScript definitions, either by reporting errors, fixing them or helping author the docs:

@krzysztof-grzybek @NokFrt @r-onodera @colorcube @neon-dev @SavedByZero @arnekeller 

### Thanks

Thank you to the following people for contributing ideas for new features to be added to Phaser 3. Because we've now started Phaser 4 development, I am closing off old feature requests that I personally will not work on for Phaser 3 itself. They may be considered for v4 and, of course, if someone from the community wishes to submit a PR to add them, I will be only too happy to look at that. So, if you want to get involved, filter the GitHub issues by the [Feature Request tag](https://github.com/photonstorm/phaser/issues?q=is%3Aissue+is%3Aopen+label%3A%22%F0%9F%92%96+Feature+Request%22) and dig in. In the meantime, thank you to the following people for suggesting features, even if they didn't make it this time around:

@njt1982 @TheTrope @allanbreyes @alexandernst @Secretmapper @murteira @oktayacikalin @TadejZupancic @SBCGames @hadikcz @jcyuan @pinkkis @Aedalus @jestarray @BigZaphod @Secretmapper @francois-n-dream @G-Rath 

Please see the complete [Change Log](https://github.com/photonstorm/phaser/blob/master/CHANGELOG.md) for previous releases.

![Contributing](https://phaser.io/images/github/div-contributing.png "Contributing")
<a name="contributing"></a>

The [Contributors Guide][contribute] contains full details on how to help with Phaser development. The main points are:

- Found a bug? Report it on [GitHub Issues][issues] and include a code sample. Please state which version of Phaser you are using! This is vitally important.

- Before submitting a Pull Request run your code through [ES Lint](https://eslint.org/) using our [config](https://github.com/photonstorm/phaser/blob/master/.eslintrc.json) and respect our [Editor Config](https://github.com/photonstorm/phaser/blob/master/.editorconfig).

- Before contributing read the [code of conduct](https://github.com/photonstorm/phaser/blob/master/.github/CODE_OF_CONDUCT.md).

Written something cool in Phaser? Please tell us about it in the [forum][forum], or email support@phaser.io

![Created by](https://phaser.io/images/github/div-created-by.png "Created by")

Phaser is a [Photon Storm](http://www.photonstorm.com) production.

![storm](https://www.phaser.io/images/github/photonstorm-x2.png)

Created by [Richard Davey](mailto:rich@photonstorm.com). Powered by coffee, anime, pixels and love.

The Phaser logo and characters are &copy; 2019 Photon Storm Limited.

All rights reserved.

"Above all, video games are meant to be just one thing: fun. Fun for everyone." - Satoru Iwata

[get-js]: https://github.com/photonstorm/phaser/releases/download/v3.20.1/phaser.js
[get-minjs]: https://github.com/photonstorm/phaser/releases/download/v3.20.1/phaser.min.js
[clone-http]: https://github.com/photonstorm/phaser.git
[clone-ssh]: git@github.com:photonstorm/phaser.git
[clone-ghwin]: github-windows://openRepo/https://github.com/photonstorm/phaser
[clone-ghmac]: github-mac://openRepo/https://github.com/photonstorm/phaser
[phaser]: https://github.com/photonstorm/phaser
[issues]: https://github.com/photonstorm/phaser/issues
[examples]: https://github.com/photonstorm/phaser3-examples
[contribute]: https://github.com/photonstorm/phaser/blob/master/.github/CONTRIBUTING.md
[forum]: https://phaser.discourse.group/
