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

> 20th June 2019

After another month of hard work, we're very happy to announce the release of Phaser 3.18. In this release we took the time to rewrite large chunks of the Input API. This allowed us to fix a number of issues that had arisen, as well as optimizing the internal event flow. Native support for complete Multi-Touch support, Mouse Wheels and more advanced Pointer Button handling are now available. The whole API is smaller and tidier after the clean-up, which is always a good thing.

We've also added lots of other features and updates, including better Matter physics constraint handling, Arcade Physics improvements, Audio decoding events, Text justification, new Bounds methods and a lot, lot more. As usual, it doesn't end there, though. You'll find hundreds of great new features, updates and fixes. So, as usual, please do spend some time digging through the [Change Log](#changelog). I assure you, it's worth while :)

If you're coming from an earlier release then you may not be aware of what the previous release, 3.17, included. It was a huge release, introducing some big new features. The first was that we moved the DOM Element Game Objects from the 'experimental' flag they were previously hidden under, finished them off, fully documented them and moved them to main. DOM Elements are a great way to layer HTML content over the top of your game and control it, just as if it was a standard Game Object. Have a look at the demos, read the docs and get stuck-in using them!

Also brand new in 3.17 were Shader Game Objects. Previously, if you wished to use a custom shader in your game, you'd have to create your own WebGL pipeline to handle it. Now, with 3.17, adding a shader is a single line of code - and what's more, you can manipulate them just like regular Game Objects, so they can be rotated, scaled, have hit areas and so on. As with DOM Elements please see the new examples and read the fully complete API Docs to learn how to use them.

The final significant 3.17 feature came in the way of masks. Phaser 3 has always supported Bitmap and Geometry Masks, but using them was limited (you couldn't mask children inside Containers, for example), and they were pretty slow. After a lot of development they're now fully batched, meaning the same mask applied to thousands of game objects no longer impacts performance. They can also be nested and will restore the mask stack as they're used and what's more, you can now add masks to Cameras. This is a great feature in itself and opens up the possibility for lots of visual effects in your games.

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

![Sponsors](https://phaser.io/images/github/sponsors-2019-05.png "Awesome  Sponsors")

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
<script src="//cdn.jsdelivr.net/npm/phaser@3.18.1/dist/phaser.js"></script>
```

or the minified version:

```html
<script src="//cdn.jsdelivr.net/npm/phaser@3.18.1/dist/phaser.min.js"></script>
```

### API Documentation

Go to https://photonstorm.github.io/phaser3-docs/index.html to read the docs online. Use the drop-down menus at the top to navigate the namespaces, classes and Game Objects lists.

Or, if you wish to run the docs locally you can checkout the [phaser3-docs](https://github.com/photonstorm/phaser3-docs) repository and then read the documentation by pointing your browser to the `docs/` folder.

The documentation for Phaser 3 is an on-going project. Please help us by searching the Phaser code for any instance of the string `[description]` and then replacing it with some documentation.

### TypeScript Definitions

You can find the [TypeScript definitions](https://github.com/photonstorm/phaser/tree/master/types) inside the `types` folder. They are also referenced in the types entry in `package.json`.

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
<script src="//cdn.jsdelivr.net/npm/phaser@3.18.1/dist/phaser-facebook-instant-games.js"></script>
```

or the minified version:

```html
<script src="//cdn.jsdelivr.net/npm/phaser@3.18.1/dist/phaser-facebook-instant-games.min.js"></script>
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
    <script src="https://cdn.jsdelivr.net/npm/phaser@3.18.1/dist/phaser-arcade-physics.min.js"></script> 
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

## Version 3.18.1 - Raphtalia - 20th June 2019

### Bug Fixes

* `InputManager.preRender` didn't get the `time` property correctly, causing input plugin methods that relied on it to fail.
* `KeyboardPlugin.time` wasn't being set to the correct value, causing `checkDown` to fail constantly.

## Version 3.18.0 - Raphtalia - 19th June 2019

### Input System Changes

#### Mouse Wheel Support

3.18 now includes native support for reading mouse wheel events.

* `POINTER_WHEEL` is a new event dispatched by the Input Plugin allowing you to listen for global wheel events.
* `GAMEOBJECT_WHEEL` is a new event dispatched by the Input Plugin allowing you to listen for global wheel events over all interactive Game Objects in a Scene.
* `GAMEOBJECT_POINTER_WHEEL` is a new event dispatched by a Game Object allowing you to listen for wheel events specifically on that Game Object.
* `Pointer.deltaX` is a new property that holds the horizontal scroll amount that occurred due to the user moving a mouse wheel or similar input device.
* `Pointer.deltaY` is a new property that holds the vertical scroll amount that occurred due to the user moving a mouse wheel or similar input device.
* `Pointer.deltaZ` is a new property that holds the z-axis scroll amount that occurred due to the user moving a mouse wheel or similar input device.
* `Pointer.wheel` is a new internal method that handles the wheel event.
* `InputManager.onMouseWheel` is a new internal method that handles processing the wheel event.
* `InputManager.processWheelEvent` is a new internal method that handles processing the wheel event sent by the Input Manager.

#### Button Released Support

* `Pointer.button` is a new property that indicates which button was pressed, or released, on the pointer during the most recent event. It is only set during `up` and `down` events and is always 0 for Touch inputs.
* `Pointer.leftButtonReleased` is a new method that returns `true` if it was the left mouse button that was just released. This can be checked in a `pointerup` event handler to find out which button was released.
* `Pointer.rightButtonReleased` is a new method that returns `true` if it was the right mouse button that was just released. This can be checked in a `pointerup` event handler to find out which button was released (thanks @BobtheUltimateProgrammer)
* `Pointer.middleButtonReleased` is a new method that returns `true` if it was the middle mouse button that was just released. This can be checked in a `pointerup` event handler to find out which button was released.
* `Pointer.backButtonReleased` is a new method that returns `true` if it was the back mouse button that was just released. This can be checked in a `pointerup` event handler to find out which button was released.
* `Pointer.forwardButtonReleased` is a new method that returns `true` if it was the forward mouse button that was just released. This can be checked in a `pointerup` event handler to find out which button was released.

#### Input System Bug Fixes

* Calling `setPollAlways()` would cause the `'pointerdown'` event to fire multiple times. Fix #4541 (thanks @Neyromantik)
* The pointer events were intermittently not registered, causing `pointerup` to often fail. Fix #4538 (thanks @paulsymphony)
* Due to a regression in 3.16 the drag events were not performing as fast as before, causing drags to feel lagged. Fix #4500 (thanks @aliblong)
* The Touch Manager will now listen for Touch Cancel events on the Window object (if `inputWindowEvents` is enabled in the game config, which it is by default). This allows it to prevent touch cancel actions, like opening the dock on iOS, from causing genuinely active pointers to enter an active locked state.
* Over and Out events now work for any number of pointers in multi-touch environments, not just the first touch pointer registered. They also now fire correctly on touch start and touch end / cancel events.
* If you enable a Game Object for drag and place it inside a rotated Container (of any depth), the `dragX` and `dragY` values sent to the `drag` callback didn't factor the rotation in, so you had to do it manually. This is now done automatically, so the values account for parent rotation before being sent to the event handler. Fix #4437 (thanks @aliblong)

#### Input System API Changes

The old 'input queue' legacy system, which was deprecated in 3.16, has been removed entirely in order to tidy-up the API and keep input events consistent. This means the following changes:

* Removed the `inputQueue` Game config property.
* Removed the `useQueue`, `queue` and `_updatedThisFrame` properties from the Input Manager.
* Removed the `legacyUpdate` and `update` methods from the Input Manager.
* Removed the `ignoreEvents` property as this should now be handled on a per-event basis.
* The Input Manager no longer listens for the `GameEvents.POST_STEP` event.
* The following Input Manager methods are no longer required so have been removed: `startPointer`, `updatePointer`, `stopPointer` and `cancelPointer`.

As a result, all of the following Input Manager methods have been renamed:

* `queueTouchStart` is now called `onTouchStart` and invoked by the Touch Manager.
* `queueTouchMove` is now called `onTouchMove` and invoked by the Touch Manager.
* `queueTouchEnd` is now called `onTouchEnd` and invoked by the Touch Manager.
* `queueTouchCancel` is now called `onTouchCancel` and invoked by the Touch Manager.
* `queueMouseDown` is now called `onMouseDown` and invoked by the Mouse Manager.
* `queueMouseMove` is now called `onMouseMove` and invoked by the Mouse Manager.
* `queueMouseUp` is now called `onMouseUp` and invoked by the Mouse Manager.

Each of these handlers used to check the `enabled` state of the Input Manager, but this now handled directly in the Touch and Mouse Managers instead, leading to less branching and cleaner tests. They also all used to run an IIFE that updated motion on the changed pointers array, but this is now handled directly in the event handler, allowing it to be removed from here.

Because the legacy queue mode is gone, there is no longer any need for the DOM Callbacks:

* Removed the `_hasUpCallback`, `_hasDownCallback` and `_hasMoveCallback` properties from the Input Manager
* Removed the `processDomCallbacks`, `addDownCallback`, `addUpCallback`, `addMoveCallback`, `domCallbacks`, `addDownCallback`, `addUpCallback` and `addMoveCallback` methods.

Also, CSS cursors can now be set directly:

* Cursors are now set and reset immediately on the canvas, leading to the removal of `_setCursor` and `_customCursor` properties.

The following changes took place in the Input Plugin class:

* The method `processDragEvents` has been removed as it's now split across smaller, more explicit methods.
* `processDragDownEvent` is a new method that handles a down event for drag enabled Game Objects.
* `processDragMoveEvent` is a new method that handles a move event for drag enabled Game Objects.
* `processDragUpEvent` is a new method that handles an up event for drag enabled Game Objects.
* `processDragStartList` is a new internal method that builds a drag list for a pointer.
* `processDragThresholdEvent` is a new internal method that tests when a pointer with drag thresholds can drag.
* `processOverEvents` is a new internal method that handles when a touch pointer starts and checks for over events.
* `processOutEvents` is a new internal method that handles when a touch pointer stops and checks for out events.

The following changes took place in the Pointer class:

* `Pointer.dirty` has been removed as it's no longer required.
* `Pointer.justDown` has been removed as it's not used internally and makes no sense under the DOM event system.
* `Pointer.justUp` has been removed as it's not used internally and makes no sense under the DOM event system.
* `Pointer.justMoved` has been removed as it's not used internally and makes no sense under the DOM event system.
* The `Pointer.reset` method has been removed as it's no longer required internally.
* `Pointer.touchstart` now has two arguments, the Touch List entry and the Touch Event. The full Touch Event is now stored in `Pointer.event` (instead of the Touch List entry).
* `Pointer.touchmove` now has two arguments, the Touch List entry and the Touch Event. The full Touch Event is now stored in `Pointer.event` (instead of the Touch List entry).
* `Pointer.touchend` now has two arguments, the Touch List entry and the Touch Event. The full Touch Event is now stored in `Pointer.event` (instead of the Touch List entry).
* `Pointer.touchcancel` now has two arguments, the Touch List entry and the Touch Event. The full Touch Event is now stored in `Pointer.event` (instead of the Touch List entry).

### New Features

* `Matter.Factory.velocity` is a new method that allows you to set the velocity on a Matter Body directly.
* `Matter.Factory.angularVelocity` is a new method that allows you to set the angular velocity on a Matter Body directly.
* `Matter.Factory.force` is a new method that allows you to apply a force from a world position on a Matter Body directly.
* `GetBounds.getTopCenter` is a new method that will return the top-center point from the bounds of a Game Object.
* `GetBounds.getBottomCenter` is a new method that will return the bottom-center point from the bounds of a Game Object.
* `GetBounds.getLeftCenter` is a new method that will return the left-center point from the bounds of a Game Object.
* `GetBounds.getRightCenter` is a new method that will return the right-center point from the bounds of a Game Object.
* You can now create a desynchronized 2D or WebGL canvas by setting the Game Config property `desynchronized` to `true` (the default is `false`). For more details about what this means see https://developers.google.com/web/updates/2019/05/desynchronized.
* The CanvasRenderer can now use the `transparent` Game Config property in order to tell the browser an opaque background is in use, leading to faster rendering in a 2D context.
* `GameObject.scale` is a new property, that exists as part of the Transform component, that allows you to set the horizontal and vertical scale of a Game Object via a setter, rather than using the `setScale` method. This is handy for uniformly scaling objects via tweens, for example.
* `Base64ToArrayBuffer` is a new utility function that will convert a base64 string into an ArrayBuffer. It works with plain base64 strings, or those with data uri headers attached to them. The resulting ArrayBuffer can be fed to any suitable function that may need it, such as audio decoding.
* `ArrayBufferToBase64` is a new utility function that converts an ArrayBuffer into a base64 string. You can also optionally included a media type, such as `image/jpeg` which will result in a data uri being returned instead of a plain base64 string.
*`WebAudioSoundManager.decodeAudio` is a new method that allows you to decode audio data into a format ready for playback and stored in the audio cache. The audio data can be provided as an ArrayBuffer, a base64 string or a data uri. Listen for the events to know when the data is ready for use.
* `Phaser.Sound.Events#DECODED` is a new event emitted by the Web Audio Sound Manager when it has finished decoding audio data.
* `Phaser.Sound.Events#DECODED_ALL` is a new event emitted by the Web Audio Sound Manager when it has finished decoding all of the audio data files passed to the `decodeAudio` method.
* `Phaser.Utils.Objects.Pick` is a new function that will take an object and an array of keys and return a new object containing just the keys provided in the array.
* `Text.align` and `Text.setAlign` can now accept `justify` as a type. It will apply basic justification to multi-line text, adding in extra spaces in order to justify the content. Fix #4291 (thanks @andrewbaranov @Donerkebap13 @dude78GH)
* `Arcade.Events.WORLD_STEP` is a new event you can listen to. It is emitted by the Arcade Physics World every time the world steps once. It is emitted _after_ the bodies and colliders have been updated. Fix #4289 (thanks @fant0m)

### Updates

* `Zones` will now use the new `customHitArea` property introduced in 3.17 to avoid their hit areas from being resized if you specified your own custom hit area (thanks @rexrainbow)
* The default `BaseShader` vertex shader has a new uniform `uResolution` which is set during the Shader init and load to be the size of the Game Object to which the shader is bound.
* The default `BaseShader` vertex shader will now set the `fragCoord` varying to be the Game Object height minus the y inPosition. This will give the correct y axis in the fragment shader, causing 'inverted' shaders to display normally when using the default vertex code.
* There was some test code left in the `DOMElementCSSRenderer` file that caused `getBoundingClientRect` to be called every render. This has been removed, which increases performance significantly for DOM heavy games.
* The `TimeStep` will no longer set its `frame` property to zero in the `resetDelta` method. Instead, this property is incremented every step, no matter what, giving an accurate indication of exactly which frame something happened on internally.
* The `TimeStep.step` method no longer uses the time value passed to the raf callback, as it's not actually the current point in time, but rather the time that the main thread began at. Which doesn't help if we're comparing it to event timestamps.
* `TimeStep.now` is a new property that holds the exact `performance.now` value, as set at the start of the current game step.
* `Matter.Factory.fromVertices` can now take a vertices path string as its `vertexSets` argument, as well as an array of vertices.
* `GetBounds.prepareBoundsOutput` is a new private method that handles processing the output point. All of the bounds methods now use this, allowing us to remove a lot of duplicated code.
* The PluginManager will now display a console warning if it skips installing a plugin (during boot) because the plugin value is missing or empty (thanks @samme)
* When creating a Matter Constraint via the Factory you can now optionally provide a `length`. If not given, it will determine the length automatically from the position of the two bodies.
* When creating a Matter Game Object you can now pass in a pre-created Matter body instead of a config object.
* When Debug Draw is enabled for Arcade Physics it will now use `Graphics.defaultStrokeWidth` to drawn the body with, this makes static bodies consistent with dynamic ones (thanks @samme)
* `Group.name` is a new property that allows you to set a name for a Group, just like you can with all other Game Objects. Phaser itself doesn't use this, it's there for you to take advantage of (thanks @samme)
* Calling `ScaleManager.setGameSize` will now adjust the size of the canvas element as well. Fix #4482 (thanks @sudhirquestai)
* `Scale.Events.RESIZE` now sends two new arguments to the handler: `previousWidth` and `previousHeight`. If, and only if, the Game Size has changed, these arguments contain the previous size, before the change took place.
* The Camera Manager has a new method `onSize` which is invoked by handling the Scale Manager `RESIZE` event. When it receives it, it will iterate the cameras it manages. If the camera _doesn't_ have a custom offset and _is_ the size of the game, then it will be automatically resized for you. This means you no longer need to call `this.cameras.resize(width, height)` from within your own resize handler, although you can still do so if you wish, as that will resize _every_ Camera being managed to the new size, instead of just 'full size' cameras.
* `Graphics.translate` has been renamed to `Graphics.translateCanvas` to make it clearer what it's actually translating (i.e. the drawing buffer, not the Graphics object itself)
* `Graphics.scale` has been renamed to `Graphics.scaleCanvas` to make it clearer what it's actually scaling (i.e. the drawing buffer, not the Graphics object itself)
* `Graphics.rotate` has been renamed to `Graphics.rotateCanvas` to make it clearer what it's actually rotating (i.e. the drawing buffer, not the Graphics object itself)
* The `width` and `height` of an Arc / Circle Shape Game Object is now set to be the diameter of the arc, not the radius (thanks @rexrainbow)
* `LineStyleCanvas` now takes an `altColor` argument which is used to override the context color.
* `LineStyleCanvas` now takes an `altAlpha` argument which is used to override the context alpha.
* `FillStyleCanvas` now takes an `altAlpha` argument which is used to override the context alpha.
* `StaticPhysicsGroup` can now take a `classType` property in its Group Config and will use the value of it, rather than override it. If none is provided it'll default to `ArcadeSprite`. Fix #4401 (thanks @Legomite)
* `Phaser.Tilemaps.Parsers.Tiled` used to run the static function `ParseJSONTiled`. `Parsers.Tiled` is now just a namespace, so access the function within it: `Phaser.Tilemaps.Parsers.Tiled.ParseJSONTiled`.
* `Phaser.Tilemaps.Parsers.Impact` used to run the static function `ParseWeltmeister`. `Parsers.Impact` is now just a namespace, so access the function within it: `Phaser.Tilemaps.Parsers.Impact.ParseWeltmeister`.
* `Phaser.Tilemaps.Parsers.Tiled.AssignTileProperties` is now a public static function, available to be called directly.
* `Phaser.Tilemaps.Parsers.Tiled.Base64Decode` is now a public static function, available to be called directly.
* `Phaser.Tilemaps.Parsers.Tiled.BuildTilesetIndex` is now a public static function, available to be called directly.
* `Phaser.Tilemaps.Parsers.Tiled.ParseGID` is now a public static function, available to be called directly.
* `Phaser.Tilemaps.Parsers.Tiled.ParseImageLayers` is now a public static function, available to be called directly.
* `Phaser.Tilemaps.Parsers.Tiled.ParseJSONTiled` is now a public static function, available to be called directly.
* `Phaser.Tilemaps.Parsers.Tiled.ParseObject` is now a public static function, available to be called directly.
* `Phaser.Tilemaps.Parsers.Tiled.ParseObjectLayers` is now a public static function, available to be called directly.
* `Phaser.Tilemaps.Parsers.Tiled.ParseTileLayers` is now a public static function, available to be called directly.
* `Phaser.Tilemaps.Parsers.Tiled.ParseTilesets` is now a public static function, available to be called directly.
* `Phaser.Tilemaps.Parsers.Tiled.ParseTilesets` is now a public static function, available to be called directly.
* `Phaser.Tilemaps.Parsers.Impact.ParseTileLayers` is now a public static function, available to be called directly.
* `Phaser.Tilemaps.Parsers.Impact.ParseTilesets` is now a public static function, available to be called directly.
* `Phaser.Tilemaps.Parsers.Impact.ParseWeltmeister` is now a public static function, available to be called directly.
* `Phaser.Tilemaps.Parsers.Tiled.Pick` has been removed. It is now available under `Phaser.Utils.Objects.Pick`, which is a more logical place for it.
* You can now call `this.scene.remove` at the end of a Scene's `create` method without it throwing an error. Why you'd ever want to do this is beyond me, but you now can (thanks @samme)
* The `Arcade.StaticBody.setSize` arguments have changed from `(width, height, offsetX, offsetY)` to `(width, height, center)`. They now match Dynamic Body setSize and the Size Component method (thanks @samme)
* When enabling Arcade Physics Body debug it will now draw only the faces marked for collision, allowing you to easily see if a face is disabled or not (thanks @BdR76)
* `Transform.getParentRotation` is a new method available to all GameObjects that will return the sum total rotation of all of the Game Objects parent Containers, if it has any.
* `Tween.restart` now sets the Tween properties `elapsed`, `progress`, `totalElapsed` and `totalProgress` to zero when called, rather than adding to existing values should the tween already be running.
* `ArcadePhysics.Body.resetFlags` is a new method that prepares the Body for a physics step by resetting the `wasTouching`, `touching` and `blocked` states.
* `ArcadePhysics.Body.preUpdate` has two new arguments `willStep` and `delta`. If `willStep` is true then the body will call resetFlags, sync with the parent Game Object and then run one iteration of `Body.update`, using the provided delta. If false, only the Game Object sync takes place.
* `ArcadePhysics.World.update` will now determine if a physics step is going to happen this frame or not. If not, it no longer calls `World.step` (fix #4529, thanks @ampled). If a step _is_ going to happen, then it now handles this with one iteration of the bodies array, instead of two. It has also inlined a single world step, avoiding branching out. If extra world steps are required this frame (such as in high Hz environments) then `World.step` is called accordingly.
* `ArcadePhysics.World.postUpdate` will no longer call `Body.postUpdate` on all of the bodies if no World step has taken place this frame.
* `ArcadePhysics.World.step` will now increment the `stepsLastFrame` counter, allowing `postUpdate` to determine if bodies should be processed should World.step have been invoked manually.

### Bug Fixes

* Tweens created in a paused state couldn't be started by a call to `play`. Fix #4525 (thanks @TonioParis)
* If both Arcade Physics circle body positions and the delta equaled zero, the `separateCircle` function would cause the position to be set `NaN` (thanks @hizzd)
* The `CameraManager` would incorrectly destroy the `default` Camera in its shutdown method, meaning that if you used a fixed mask camera and stopped then resumed a Scene, the masks would stop working. The default camera is now destroyed only in the `destroy` method. Fix #4520 (thanks @telinc1)
* Passing a Frame object to `Bob.setFrame` would fail, as it expected a string or integer. It now checks the type of object, and if a Frame it checks to make sure it's a Frame belonging to the parent Blitter's texture, and if so sets it. Fix #4516 (thanks @NokFrt)
* The ScaleManager full screen call had an arrow function in it. Despite being within a conditional block of code it still broke really old browsers like IE11, so has been removed. Fix #4530 (thanks @jorbascrumps @CNDW)
* `Game.getTime` would return `NaN` because it incorrectly accessed the time value from the TimeStep.
* Text with a `fixedWidth` or `fixedHeight` could cause the canvas to be cropped if less than the size of the Text itself (thanks @rexrainbow)
* Changing the `radius` of an Arc Game Object wouldn't update the size, causing origin issues. It now updates the size and origin correctly in WebGL. Fix #4542 (thanks @@PhaserEditor2D)
* Setting `padding` in a Text style configuration object would cause an error about calling split on undefined. Padding can now be applied both in the config and via `setPadding`.
* `Tilemap.createBlankDynamicLayer` would fail if you provided a string for the tileset as the base tile width and height were incorrectly read from the tileset argument. Fix #4495 (thanks @jppresents)
* `Tilemap.createDynamicLayer` would fail if you called it without setting the `x` and `y` arguments, even though they were flagged as being optional. Fix #4508 (thanks @jackfreak)
* `RenderTexture.draw` didn't work if no `x` and `y` arguments were provided, even though they are optional, due to a problem with the way the frame cut values were added. The class has been refactored to prevent this, fixing issues like `RenderTexture.erase` not working with Groups. Fix #4528 (thanks @jbgomez21 @telinc1)
* The `Grid` Game Object wouldn't render in Canvas mode at all. Fix #4585 (thanks @fyyyyy)
* If you had a `Graphics` object in the display list immediately after an object with a Bitmap Mask it would throw an error `Uncaught TypeError: Cannot set property 'TL' of undefined`. Fix #4581 (thanks @Petah @Loonride)
* Calling Arcade Physics `Body.reset` on a Game Object that doesn't have any bounds, like a Container, would throw an error about being unable to access `getTopLeft`. If this is the case, it will now set the position to the given x/y values (thanks Jazz)
* All of the `Tilemaps.Parsers.Tiled` static functions are now available to be called directly. Fix #4318 (thanks @jestarray)
* `Arcade.StaticBody.setSize` now centers the body correctly, as with the other similar methods. Fix #4213 (thanks @samme)
* Setting `random: false` in a Particle Emitter config option no longer causes it to think random is true (thanks @samme)
* `Zone.setSize` didn't update the displayOrigin, causing touch events to be inaccurate as the origin was out. Fix #4131 (thanks @rexrainbow)
* `Tween.restart` wouldn't restart the tween properly. Fix #4594 (thanks @NokFrt)
* Looped Tween Timelines would mess-up the tween values on every loop repeat, causing the loop to fail. They now loop correctly due to a fix in the Tween.play method. Fix #4558 (thanks @peteroravec)
* `Timeline.setTimeScale` would only impact the Timeline loop and completion delays, not the actively running Tweens. It now scales the time for all child tweens as well. Fix #4164 (thanks @garethwhittaker)

### Examples, Documentation and TypeScript

My thanks to the following for helping with the Phaser 3 Examples, Docs and TypeScript definitions, either by reporting errors, fixing them or helping author the docs:

@PhaserEditor2D @samme @Nallebeorn @Punkiebe @rootasjey @Sun0fABeach

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

[get-js]: https://github.com/photonstorm/phaser/releases/download/v3.18.1/phaser.js
[get-minjs]: https://github.com/photonstorm/phaser/releases/download/v3.18.1/phaser.min.js
[clone-http]: https://github.com/photonstorm/phaser.git
[clone-ssh]: git@github.com:photonstorm/phaser.git
[clone-ghwin]: github-windows://openRepo/https://github.com/photonstorm/phaser
[clone-ghmac]: github-mac://openRepo/https://github.com/photonstorm/phaser
[phaser]: https://github.com/photonstorm/phaser
[issues]: https://github.com/photonstorm/phaser/issues
[examples]: https://github.com/photonstorm/phaser3-examples
[contribute]: https://github.com/photonstorm/phaser/blob/master/.github/CONTRIBUTING.md
[forum]: https://phaser.discourse.group/
