# Phaser - HTML5 Game Framework

![Phaser Header](https://phaser.io/images/github/300/phaser-header.png "Phaser 3 Header Banner")

Phaser is a fast, free, and fun open source HTML5 game framework that offers WebGL and Canvas rendering across desktop and mobile web browsers. Games can be compiled to iOS, Android and native apps by using 3rd party tools. You can use JavaScript or TypeScript for development.

Phaser is available in two versions: Phaser 3 and [Phaser CE - The Community Edition](https://github.com/photonstorm/phaser-ce). Phaser CE is a community-lead continuation of the Phaser 2 codebase and is hosted on a separate repo. Phaser 3 is the next generation of Phaser.

Along with the fantastic open source community, Phaser is actively developed and maintained by [Photon Storm](http://www.photonstorm.com). As a result of rapid support, and a developer friendly API, Phaser is currently one of the [most starred](https://github.com/collections/javascript-game-engines) game frameworks on GitHub.

Thousands of developers from indie and multi-national digital agencies, and universities worldwide use Phaser. You can take a look at their incredible [games](https://phaser.io/games/).

**Visit:** The [Phaser website](https://phaser.io) and follow on [Twitter](https://twitter.com/phaser_) (#phaserjs)<br />
**Learn:** [API Docs](https://github.com/photonstorm/phaser3-docs), [Support Forum][forum] and [StackOverflow](https://stackoverflow.com/questions/tagged/phaser-framework)<br />
**Code:** 700+ [Examples](https://labs.phaser.io) (source available in this [repo][examples])<br />
**Read:** The [Phaser World](#newsletter) Newsletter<br />
**Chat:** [Slack](https://phaser.io/community/slack) and [Discord](https://phaser.io/community/discord)<br />
**Extend:** With [Phaser Plugins](https://phaser.io/shop/plugins)<br />
**Be awesome:** [Support](#support) the future of Phaser<br />

Grab the source and join the fun!

![What's New](https://phaser.io/images/github/div-whats-new.png "What's New")

<div align="center"><img src="https://phaser.io/images/github/news.jpg"></div>

> 16th October 2018

Phaser 3.15 is now available. This is slightly ahead of schedule because we needed to get some important performance and iOS input related fixes released, without waiting for new features to be completed first.

This means that the new Scale Manager and Spine support have been moved to release 3.16 due towards the end of October. Please read the weekly Dev Logs for details about development.

> 1st October 2018

I'm pleased to announce that Phaser 3.14 is now out. Hot on the heels of the massive 3.13 release, 3.14 brings some sought-after new features to the party, including support for the new Tiled Map Editor 1.2 file formats, as well as the long-requested feature allowing use of multiple tilesets per single tilemap layer.

There are also new features to make Matter JS debugging easier and body creation when using lists of vertices is now much cleaner too. It's never just features though. There are lots of important fixes and updates in 3.14, including a fix causing gl canvas resizing to fail, better handling of the game shutdown process and fixes for an issue with Graphics.generateTexture.

If you're building an active project on 3.13 then please upgrade to 3.14 and, as usual, report any issues you find on GitHub so we can look at them immediately. Also, in the 3.14 release we have completed over 1000 new areas of documentation. At the time of writing there are now just 1900 items in the API left to document, which may sound like a lot, but is a fraction of the tens of thousands already done! With our current progress we should have 100% documentation coverage within the next couple of months.

In case you missed the notice, Phaser 3.13 introduced the Facebook Instant Games Plugin. The plugin provides a seamless bridge between Phaser and version 6.2 of the Facebook Instant Games SDK. Every single SDK function is available via the plugin and we will keep track of the official SDK to make sure they stay in sync. My thanks to Facebook for helping make this possible.

Also new in 3.13 were the Shape Game Objects, which allows for quick addition of geometry onto the display list. Easily add rectangles, triangles, curves, stars and more into your game and treat them just like any other Game Object. Perfect for place-holder art, abstract style games or just really fast iterations game-jam style.

3.14 continues to represent the tireless effort on my part to get it fully production ready. I'm seeing lots more games being released with Phaser 3 and stacks of tutorials and plugins are starting to surface. My aim has always been to continue the mission of enhancing Phaser 3 as quickly as I can. It means releasing significant updates in relatively short periods of time. But it also means I'm jumping on bug reports as quickly as I can, keeping the issues list total nice and low (the vast majority of the items in there are feature requests now!) - a massive thank-you to all of you who support Phaser on Patreon and PayPal. It's your support that allows me to work on this full-time, to the benefit of everyone.

As always, please check out the [Change Log](#changelog) for comprehensive details about what recent versions contain.

If you'd like to stay abreast of developments then I publish my [Developer Logs](https://phaser.io/phaser3/devlog) in the [Phaser World](https://phaser.io/community/newsletter) newsletter. Subscribe to stay in touch and get all the latest news from the core team and the wider community.

You can also follow Phaser on [Twitter](https://twitter.com/phaser_) and chat with fellow Phaser devs in our [Slack](https://phaser.io/community/slack) and [Discord](https://phaser.io/community/discord) channels.

Phaser 3 wouldn't have been possible without the fantastic support of the community and Patreon. Thank you to everyone who supports our work, who shares our belief in the future of HTML5 gaming, and Phaser's role in that.

Happy coding everyone!

Cheers,

Rich - [@photonstorm](https://twitter.com/photonstorm)

![boogie](https://www.phaser.io/images/spacedancer.gif)

![Support Phaser](https://phaser.io/images/github/div-support-phaser.png "Support Phaser")

Developing Phaser takes a lot of time, effort and money. There are monthly running costs as well as countless hours of development time, community support, and assistance resolving issues.

If you have found Phaser useful in your development life or have made income as a result of it please support our work via:

* A monthly contribution on [Patreon](https://www.patreon.com/photonstorm).
* A [one-off donation](https://phaser.io/community/donate) with PayPal.
* Purchase any of our [plugins or books](https://phaser.io/shop).

It all helps and genuinely contributes towards future development.

Extra special thanks to our top-tier sponsors: [Orange Games](http://orangegames.com) and [CrossInstall](https://crossinstall.com).

![Sponsors](https://phaser.io/images/github/patreon-sponsors-2018-1.png "Top Patreon Sponsors")

![Phaser Newsletter](https://phaser.io/images/github/div-newsletter.png "Phaser Newsletter")

<div align="center"><img src="https://phaser.io/images/github/phaser-world.png"></div>

We publish the [Phaser World](https://phaser.io/community/newsletter) newsletter. It's packed full of the latest Phaser games, tutorials, videos, meet-ups, talks, and more. The newsletter also contains our weekly Development Progress updates which let you know about the new features we're working on.

Over 120 previous editions can be found on our [Back Issues](https://phaser.io/community/backissues) page.

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
<script src="//cdn.jsdelivr.net/npm/phaser@3.15/dist/phaser.js"></script>
```

or the minified version:

```html
<script src="//cdn.jsdelivr.net/npm/phaser@3.15/dist/phaser.min.js"></script>
```

### API Documentation

Go to https://photonstorm.github.io/phaser3-docs/index.html to read the docs online. Use the drop-down menus at the top to navigate the name spaces, classes and Game Objects lists.

Or, if you wish to run the docs locally you can checkout the [phaser3-docs](https://github.com/photonstorm/phaser3-docs) repository and then read the documentation by pointing your browser to the `docs/` folder.

The documentation for Phaser 3 is an on-going project. Please help us by searching the Phaser code for any instance of the string `[description]` and then replacing it with some documentation.

### TypeScript Definitions

[TypeScript Definitions](https://github.com/photonstorm/phaser3-docs/tree/master/typescript) are now available.

They are automatically generated from the jsdoc comments in the Phaser source code. If you wish to help refine them then you must edit the Phaser jsdoc blocks directly. You can find more details, including the source to the conversion tool we wrote in the Docs repo.

As soon as we're happy with the accuracy of the TS defs we'll merge them into the main repo, for now, please download them from the docs repo, linked above, and add them to your project. When we release new versions of Phaser we publish new TS defs too.

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

Phaser 3.13 introduced the new [Facebook Instant Games](https://developers.facebook.com/docs/games/instant-games) Plugin. The plugin provides a seamless bridge between Phaser and version 6.2 of the Facebook Instant Games SDK. Every single SDK function is available via the plugin and we will keep track of the official SDK to make sure they stay in sync.

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

A special build of Phaser with the Facebook Instant Games Plugin ready-enabled is [available on jsDelivr](https://www.jsdelivr.com/projects/phaser). Include the following in your html:

```html
<script src="//cdn.jsdelivr.net/npm/phaser@3.15/dist/phaser-facebook-instant-games.js"></script>
```

or the minified version:

```html
<script src="//cdn.jsdelivr.net/npm/phaser@3.15/dist/phaser-facebook-instant-games.min.js"></script>
```

The build files are in the git repository in the `dist` folder, and you can also include the plugin in custom builds.

### Source Code Examples

During our development of Phaser 3, we created hundreds of examples with the full source code and assets ready available. Until these examples are fully integrated into the Phaser website, you can browse them on [Phaser 3 Labs](https://labs.phaser.io), or clone the [examples repo][examples]. We are constantly adding to and refining these examples.

### Create Your First Phaser 3 Example

Create an `index.html` page locally and paste the following code into it:

```html
<!DOCTYPE html>
<html>
<head>
    <script src="https://labs.phaser.io/build/phaser-arcade-physics.min.js"></script> 
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

If you wish to build Phaser 3 from source, ensure you have the required packages by cloning the repository and then running `npm install`.

You can then run `webpack` to create a development build in the `build` folder which includes source maps for local testing. You can also `npm run dist` to create a minified packaged build in the `dist` folder. For a list of all commands available use `npm run help`.

![Change Log](https://phaser.io/images/github/div-change-log.png "Change Log")
<a name="changelog"></a>

# Change Log

## Version 3.15.1 - Batou - 16th October 2018

Note: We are releasing this version ahead of schedule in order to make some very important iOS performance and input related fixes available. It does not contain the new Scale Manager or Spine support, both of which have been moved to 3.16 as they require a few more weeks of development.

### New Features

* You can now set the `maxLights` value in the Game Config, which controls the total number of lights the Light2D shader can render in a single pass. The default is 10. Be careful about pushing this too far. More lights = less performance. Close #4081 (thanks @FrancescoNegri)
* `Rectangle.SameDimensions` determines if the two objects (either Rectangles or Rectangle-like) have the same width and height values under strict equality.
* An ArcadePhysics Group can now pass `{ enable: false }`` in its config to disable all the member bodies (thanks @samme)
* `Body.setEnable` is a new chainable method that allows you to toggle the enable state of an Arcade Physics Body (thanks @samme)
* `KeyboardPlugin.resetKeys` is a new method that will reset the state of any Key object created by a Scene's Keyboard Plugin.
* `Pointer.wasCanceled` is a new boolean property that allows you to tell if a Pointer was cleared due to a `touchcancel` event. This flag is reset during the next `touchstart` event for the Pointer.
* `Pointer.touchcancel` is a new internal method specifically for handling touch cancel events. It has the same result as `touchend` without setting any of the up properties, to avoid triggering up event handlers. It will also set the `wasCanceled` property to `true`.

### Updates

* `WebGLRenderer.deleteTexture` will check to see if the texture it is being asked to delete is the currently bound texture or not. If it is, it'll set the blank texture to be bound after deletion. This should stop `RENDER WARNING: there is no texture bound to the unit 0` errors if you destroy a Game Object, such as Text or TileSprite, from an async or timed process (thanks jamespierce)
* The `RequestAnimationFrame.step` and `stepTimeout` functions have been updated so that the new Frame is requested from raf before the main game step is called. This allows you to now stop the raf callback from within the game update or render loop. Fix #3952 (thanks @tolimeh)
* If you pass zero as the width or height when creating a TileSprite it will now use the dimensions of the texture frame as the size of the TileSprite. Fix #4073 (thanks @jcyuan)
* `TileSprite.setFrame` has had both the `updateSize` and `updateOrigin` arguments removed as they didn't do anything for TileSprites and were misleading.
* `CameraManager.remove` has a new argument `runDestroy` which, if set, will automatically call `Camera.destroy` on the Cameras removed from the Camera Manager. You should nearly always allow this to happen (thanks jamespierce)
* Device.OS has been restructured to allow fake UAs from Chrome dev tools to register iOS devices.
* Texture batching during the batch flush has been implemented in the TextureTintPipeline which resolves the issues of very low frame rates, especially on iOS devices, when using non-batched textures such as those used by Text or TileSprites. Fix #4110 #4086 (thanks @ivanpopelyshev @sachinhosmani   @maximtsai @alexeymolchan)
* The WebGLRenderer method `canvasToTexture` has a new optional argument `noRepeat` which will stop it from using `gl.REPEAT` entirely. This is now used by the Text object to avoid it potentially switching between a REPEAT and CLAMP texture, causing texture black-outs (thanks @ivanpopelyshev)
* `KeyboardPlugin.resetKeys` is now called automatically as part of the Keyboard Plugin `shutdown` method. This means, when the plugin shuts down, such as when stopping a Scene, it will reset the state of any key held in the plugin. It will also clear the queue of any pending events.
* The `Touch Manager` has been rewritten to use declared functions for all touch event handlers, rather than bound functions. This means they will now clear properly when the TouchManager is shut down.
* There is a new Input constant `TOUCH_CANCEL` which represents canceled touch events.

### Bug Fixes

* Fixed a bug in the canvas rendering of both the Static and Dynamic Tilemap Layers where the camera matrix was being multiplied twice with the layer, causing the scale and placement to be off (thanks galerijanamar)
* If you set `pixelArt` to true in your game config (or `antialias` to false) then TileSprites will now respect this when using the Canvas Renderer and disable smoothing on the internal fill canvas.
* TileSprites that were set to be interactive before they had rendered once wouldn't receive a valid input hit area, causing input to fail. They now define their size immediately, allowing them to be made interactive without having rendered. Fix #4085 (thanks @DotTheGreat)
* The Particle Emitter Manager has been given a NOOP method called `setBlendMode` to stop warnings from being thrown if you added an emitter to a Container in the Canvas renderer. Fix #4083 (thanks @maximtsai)
* The `game.context` property would be incorrectly set to `null` after the WebGLRenderer instance was created (thanks @samme)
* The Touch Manager, Input Manager and Pointer classes all now handle the `touchcancel` event, such as triggered on iOS when activating an out of browser UI gesture, or in Facebook Instant Games when displaying an overlay ad. This should prevent issues with touch input becoming locked on iOS specifically. Fix #3756 (thanks @sftsk @sachinhosmani @kooappsdevs)

Please see the complete [Change Log](https://github.com/photonstorm/phaser/blob/master/CHANGELOG.md) for previous releases.

Looking for a v2 change? Check out the [Phaser CE Change Log](https://github.com/photonstorm/phaser-ce/blob/master/CHANGELOG.md)

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

The Phaser logo and characters are &copy; 2018 Photon Storm Limited.

All rights reserved.

"Above all, video games are meant to be just one thing: fun. Fun for everyone." - Satoru Iwata

[get-js]: https://github.com/photonstorm/phaser/releases/download/v3.11/phaser.js
[get-minjs]: https://github.com/photonstorm/phaser/releases/download/v3.11/phaser.min.js
[clone-http]: https://github.com/photonstorm/phaser.git
[clone-ssh]: git@github.com:photonstorm/phaser.git
[clone-ghwin]: github-windows://openRepo/https://github.com/photonstorm/phaser
[clone-ghmac]: github-mac://openRepo/https://github.com/photonstorm/phaser
[phaser]: https://github.com/photonstorm/phaser
[issues]: https://github.com/photonstorm/phaser/issues
[examples]: https://github.com/photonstorm/phaser3-examples
[contribute]: https://github.com/photonstorm/phaser/blob/master/.github/CONTRIBUTING.md
[forum]: http://www.html5gamedevs.com/forum/33-phaser-3/
