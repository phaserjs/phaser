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

> 8th August 2019

I'm pleased to announce that Phaser 3.19 is now available. This release includes our brand new Spine plugin. Spine allows you to bring animation to life in your games, offering a dedicated 2D skeletal animation system and workflow. Our plugin makes integration with Phaser seamless and is fully updated for the Spine 3.7 Runtimes with support for WebGL and Canvas renderers. This version will properly batch Spine skeletons where possible, potentially saving hundreds of draw calls. The plugin is fully documented and exports both debug and minified files, suitable for ES6 'importing' or ES5 plugin inclusion. The whole plugin is just 68KB in size (min+gz), or a paltry 57KB if you only need the Canvas renderer! That's a really tiny payload for such a massive feature-set. You can find out more about Spine from the [Esoteric Software website](http://esotericsoftware.com/).

3.19 also introduces a huge overhaul to the Tween system. Tweens now have 100% documentation and we've extended their capabilities significantly. There are lots of new Tween Events to listen for, such as 'COMPLETE' or 'REPEAT' to allow you to trigger actions without needing to create callbacks. Tweens can now tween both 'from' and 'to' a value, with the ability to set a starting value for any tweened property. There are lots of new handy methods and properties, such as `Tween.hasStarted` and a rewrite of the Tween seeking function, so it now allows you to seek to any point in time across a tween. Finally, we've added in the great new 'StaggerBuilder'. This allows you to easily add staggered offsets to a bunch of tween targets, including all kinds of options such as staggering across a grid layout, stagger directions, starting values and a lot more. Please see the docs and examples for more details.

As usual, it doesn't end there, though :) Another very useful feature is `Shader.setRenderToTexture`. This allows you to redirect a shader to its own framebuffer / WebGL Texture instead of to the display list. This allows you to use the output of the shader as an input for another shader, by mapping a sampler2D uniform to it. It also allows you to save the Shader to the Texture Manager, allowing you to use it as a texture for any other texture based Game Object such as a Sprite. Combined with the new `setSampler2DBuffer` method you can now easily chain shaders together, using them as buffers for other shaders.

One thing I've been seeing asked for a lot on the Phaser Discord is the ability to 'save' a Render Texture to an image. So, I added the new methods `RenderTexture.snapshot` and `snapshotArea`. This allows you to grab whatever is on the Render Texture at that point in time and turn it into an Image. You could then save this image to the Texture Manager, if needed, or just save it out to the filesystem, or transmit it to as web service. Great for things like avatar creators or art packages.

You'll find loads more great new features, updates and fixes. So, as usual, please do spend some time digging through the [Change Log](#changelog). I assure you, it's worth while :)

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
<script src="//cdn.jsdelivr.net/npm/phaser@3.19.0/dist/phaser.js"></script>
```

or the minified version:

```html
<script src="//cdn.jsdelivr.net/npm/phaser@3.19.0/dist/phaser.min.js"></script>
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
<script src="//cdn.jsdelivr.net/npm/phaser@3.19.0/dist/phaser-facebook-instant-games.js"></script>
```

or the minified version:

```html
<script src="//cdn.jsdelivr.net/npm/phaser@3.19.0/dist/phaser-facebook-instant-games.min.js"></script>
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
    <script src="https://cdn.jsdelivr.net/npm/phaser@3.19.0/dist/phaser-arcade-physics.min.js"></script> 
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

## Version 3.19.0 - Naofumi - 8th August 2019

### Tween Updates

* All Tween classes and functions have 100% complete JSDocs :)
* `StaggerBuilder` is a new function that allows you to define a staggered tween property. For example, as part of a tween config: `delay: this.tweens.stagger(500)` would stagger the delay by 500ms for every target of the tween. You can also provide a range: `delay: this.tweens.stagger([ 500, 1000 ])` which is spread across all targets. Finally, you can provide a Stagger Config object as the second argument. This allows you to define a stagger grid, direction, starting value and more. Please see the API Docs and new Examples for further details.
* `Tween` now extends the Event Emitter class, allowing it to emit its own events and be listened to.
* `Tween.ACTIVE_EVENT` is a new event that is dispatched when a tween becomes active. Listen to it with `tween.on('active')`.
* `Tween.COMPLETE_EVENT` is a new event that is dispatched when a tween completes or is stopped. Listen to it with `tween.on('complete')`.
* `Tween.LOOP_EVENT` is a new event that is dispatched when a tween loops, after any loop delay expires. Listen to it with `tween.on('loop')`.
* `Tween.REPEAT_EVENT` is a new event that is dispatched when a tween property repeats, after any repeat delay expires. Listen to it with `tween.on('repeat')`.
* `Tween.START_EVENT` is a new event that is dispatched when a tween starts. Listen to it with `tween.on('start')`.
* `Tween.UPDATE_EVENT` is a new event that is dispatched when a tween property updates. Listen to it with `tween.on('update')`.
* `Tween.YOYO_EVENT` is a new event that is dispatched when a tween property yoyos, after any hold delay expires. Listen to it with `tween.on('yoyo')`.
* `Tween.onActive` is a new callback that is invoked the moment the Tween Manager brings the tween to life, even though it may not have yet started actively tweening anything due to delay settings.
* `Tween.onStart` is now only invoked when the Tween actually starts tweening a value. Previously, it was invoked as soon as the Tween Manager activated the Tween. This has been recoded and this action is now handled by the `onActive` callback. Fix #3330 (thanks @wtravO)
* `Tween.seek` has been rewritten so you can now seek to any point in the Tween, regardless of repeats, loops, delays and hold settings. Seeking will not invoke any callbacks or events during the seek. Fix #4409 (thanks @cristib84)
* You can now set `from` and `to` values for a property, i.e. `alpha: { from: 0, to: 1 }` which would set the alpha of the target to 0 and then tween it to 1 _after_ any delays have expired. Fix #4493 (thanks @BigZaphod)
* You can now set `start` and `to` values for a property, i.e. `alpha: { start: 0, to: 1 }` which would set the alpha of the target to 0 immediately, as soon as the Tween becomes active, and then tween it to 1 over the duration of the tween.
* You can now set `start`, `from` and `to` values for a property, i.e. `alpha: { start: 0, from: 0.5, to: 1 }` which would set the alpha of the target to 0 immediately, as soon as the Tween becomes active, then after any delays it would set the alpha to 0.5 and then tween it to 1 over the duration of the Tween.
* `Tween.hasStarted` is a new property that holds a flag signifying if the Tween has started or not. A Tween that has started is one that is actively tweening a property and not just in a delayed state.
* `Tween.startDelay` is a new property that is set during the Tween init to hold the shortest possible time before the Tween will start tweening a value. It is decreased each update until it hits zero, after which the `onStart` callback is invoked.
* `Tween.init` and `Tween.play` have been rewritten so they are not run multiple times when a Tween is paused before playback, or is part of a Timeline. This didn't cause any problems previously, but it was a redundant duplication of calls.
* `Tween.onLoop` will now be invoked _after_ the `loopDelay` has expired, if any was set.
* `Tween.onRepeat` will now be invoked _after_ the `repeatDelay` has expired, if any was set.
* `easeParams` would be ignored for tweens that _didn't_ use a string for the ease function name. Fix #3826 (thanks @SBCGames)
* You can now specify `easeParams` for any custom easing function you wish to use. Fix #3826 (thanks @SBCGames)
* All changes to `Tween.state` are now set _before_ any events or callbacks, allowing you to modify the state of the Tween in those handlers (thanks @Cudabear)
* `Tween.dispatchTweenEvent` is a new internal method that handles dispatching the new Tween Events and callbacks. This consolidates a lot of duplicate code into a single method.
* `Tween.dispatchTweenDataEvent` is a new internal method that handles dispatching the new TweenData Events and callbacks. This consolidates a lot of duplicate code into a single method.
* `Tween.isSeeking` is a new internal boolean flag that is used to keep track of the seek progress of a Tween.
* `Timeline.onLoop` will now be invoked _after_ the `loopDelay` has expired, if any was set.
* `Timeline.onComplete` will now be invoked _after_ the `completeDelay` has expired, if any was set.
* All changes to `Timeline.state` are now set _before_ any events or callbacks, allowing you to modify the state of the Timeline in those handlers.
* The `TIMELINE_LOOP_EVENT` has had the `loopCounter` argument removed from it. It didn't actually send the number of times the Timeline had looped (it actually sent the total remaining).
* When a TweenData completes it will now set the `current` property to be exactly either `start` or `end` depending on playback direction.
* When a TweenData completes it will set the exact `start` or `end` value into the target property.
* `TweenData` has a new function signature, with the new `index` and `getActive`arguments added to it. `TweenBuilder` has been updated to set these, but if you create any TweenData objects directly, use the new signature.
* `TweenData.getActiveValue` is a new property that, if not null, returns a value to immediately sets the property value to on activation.
* `GetEaseFunction`, and by extension anything that uses it, such as setting the ease for a Tween, will now accept a variety of input strings as valid. You can now use lower-case, such as `back`, and omit the 'ease' part of the direction, such as `back.in` or `back.inout`.
* The signature of `getStart` and `getEnd` custom property functions has changed to `(target, key, value, targetIndex, totalTargets, tween)`, previously it was just `(target, key, value)`. Custom functions don't need to change as the new arguments are in addition to those sent previously.
* The signature of the LoadValue generator functions (such as `delay` and `repeat`) has changed to `(target, key, value, targetIndex, totalTargets, tween)` to match those of the custom property functions. If you used a custom generator function for your Tween configs you'll need to modify the signature to the new one.
* Tweens created via `TweenManager.create` wouldn't start when `Tween.play` was called without first making them active manually. They now start automatically. Fix #4632 (thanks @mikewesthad)

### Spine Updates

The Spine Plugin is now 100% complete. It has been updated to use the Spine 3.7 Runtimes. Improvements have been made across the entire plugin, including proper batched rendering support in WebGL, cleaner skin and slot functions and lots and lots of updates. It's fully documented and there are lots of examples to be found. The following legacy bugs have also been fixed:

* Adding Spine to physics causes position to become NaN. Fix #4501 (thanks @hizzd)
* Destroying a Phaser Game instance and then re-creating it would cause an error trying to re-create Spine Game Objects ("Cannot read property get of null"). Fix #4532 (thanks @Alex-Badea)
* Rendering a Spine object when a Camera has `renderToTexture` enabled on it would cause the object to be vertically flipped. It now renders correctly in both cases. Fix #4647 (thanks @probt)

### New Features

* `Shader.setRenderToTexture` is a new method that will redirect the Shader to render to its own framebuffer / WebGLTexture instead of to the display list. This allows you to use the output of the shader as an input for another shader, by mapping a sampler2D uniform to it. It also allows you to save the Shader to the Texture Manager, allowing you to use it as a texture for any other texture based Game Object such as a Sprite.
* `Shader.setSampler2DBuffer` is a new method that allows you to pass a WebGLTexture directly into a Shader as a sampler2D uniform, such as when linking shaders together as buffers for each other.
* `Shader.renderToTexture` is a new property flag that is set if you set the Shader to render to a texture.
* `Shader.framebuffer` is a new property that contains a WebGLFramebuffer reference which is set if you set the Shader to render to a texture.
* `Shader.glTexture` is a new property that contains a WebGLTexture reference which is set if you set the Shader to render to a texture.
* `Shader.texture` is a new property that contains a Phaser Texture reference which is set if you set the Shader to save to the Texture Manager.
* `TextureManager.addGLTexture` is a new method that allows you to add a WebGLTexture directly into the Texture Manager, saved under the given key.
* `TextureSource.isGLTexture` is a new boolean property that reflects if the data backing the underlying Texture Source is a WebGLTexture or not.
* `TextureTintPipeline.batchSprite` will now flip the UV if the TextureSource comes from a GLTexture.
* `Math.ToXY` is a new mini function that will take a given index and return a Vector2 containing the x and y coordinates of that index within a grid.
* `RenderTexture.glTexture` is a new property that holds a reference to the WebGL Texture being used by the Render Texture. Useful for passing to a shader as a sampler2D.
* `GroupCreateConfig.quantity` - when creating a Group using a config object you can now use the optional property `quantity` to set the number of objects to be created. Use this for quickly creating groups of single frame objects that don't need the advanced capabilities of `frameQuantity` and `repeat`.
* `Pointer.locked` is a new read-only property that indicates if the pointer has been Pointer Locked, or not, via the Pointer Lock API.
* `WebGLRenderer.snapshotFramebuffer`, and the corresponding utility function `WebGLSnapshot`, allows you to take a snapshot of a given WebGL framebuffer, such as the one used by a Render Texture or Shader, and either get a single pixel from it as a Color value, or get an area of it as an Image object, which can then optionally be saved to the Texture Manager for use by Game Object textures.
* `CanvasRenderer.snapshotCanvas` allows you to take a snapshot of a given Canvas object, such as the one used by a Render Texture, and either get a single pixel from it as a Color value, or get an area of it as an Image object, which can then optionally be saved to the Texture Manager for use by Game Object textures.
* `RenderTexture.snapshot` is a new method that will take a snapshot of the whole current state of the Render Texture and return it as an Image object, which could then be saved to the Texture Manager if needed.
* `RenderTexture.snapshotArea` is a new method that will take a snapshot of an area of a Render Texture and return it as an Image object, which could then be saved to the Texture Manager if needed.
* `RenderTexture.snapshotPixel` is a new method that will take extract a single pixel color value from a Render Texture and return it as a Color object.
* The `SnapshotState` object has three new properties: `isFramebuffer` boolean and `bufferWidth` and `bufferHeight` integers.
* `Game.CONTEXT_LOST_EVENT` is a new event that is dispatched by the Game instance when the WebGL Renderer webgl context is lost. Use this instead of the old 'lostContextCallbacks' for cleaner context handling.
* `Game.CONTEXT_RESTORED_EVENT` is a new event that is dispatched by the Game instance when the WebGL Renderer webgl context is restored. Use this instead of the old 'restoredContextCallbacks' for cleaner context handling.
* `WebGLRenderer.currentType` contains the type of the Game Object currently being rendered.
* `WebGLRenderer.newType` is a boolean that indicates if the current Game Object has a new type, i.e. different to the previous one in the display list.
* `WebGLRenderer.nextTypeMatch` is a boolean that indicates if the _next_ Game Object in the display list has the same type as the one being currently rendered. This allows you to build batching into separated Game Objects.
* `PluginManager.removeGameObject` is a new method that allows you to de-register custom Game Object types from the global Game Object Factory and/or Creator. Useful for when custom plugins are destroyed and need to clean-up after themselves.
* `GEOM_CONST` is a new constants object that contains the different types of Geometry Objects, such as `RECTANGLE` and `CIRCLE`.
* `Circle.type` is a new property containing the shapes geometry type, which can be used for quick type comparisons.
* `Ellipse.type` is a new property containing the shapes geometry type, which can be used for quick type comparisons.
* `Line.type` is a new property containing the shapes geometry type, which can be used for quick type comparisons.
* `Point.type` is a new property containing the shapes geometry type, which can be used for quick type comparisons.
* `Polygon.type` is a new property containing the shapes geometry type, which can be used for quick type comparisons.
* `Rectangle.type` is a new property containing the shapes geometry type, which can be used for quick type comparisons.
* `Triangle.type` is a new property containing the shapes geometry type, which can be used for quick type comparisons.
* `InputPlugin.enableDebug` is a new method that will create a debug shape for the given Game Objects hit area. This allows you to quickly check the size and placement of an input hit area. You can customzie the shape outline color. The debug shape will automatically track the Game Object to which it is bound.
* `InputPlugion.removeDebug` will remove a Debug Input Shape from the given Game Object and destroy it.
* `Pointer.updateWorldPoint` is a new method that takes a Camera and then updates the Pointers `worldX` and `worldY` values based on the cameras transform (thanks @Nick-lab)
* `ScaleManager._resetZoom` is a new internal flag that is set when the game zoom factor changes.
* `Texture.remove` is a new method that allows you to remove a Frame from a Texture based on its name. Fix #4460 (thanks @BigZaphod)

### Updates

* When calling `setHitArea` and not providing a shape (i.e. a texture based hit area), it will now set `customHitArea` to `false` by default (thanks @rexrainbow)
* The Shader will no longer set uniforms if the values are `null`, saving on GL ops.
* The Animation Manager will now emit a console warning if you try and play an animation on a Sprite that doesn't exist.
* The Animation component will no longer start an animation on a Sprite if the animation doesn't exist. Previously it would throw an error saying "Unable to read the property getFirstTick of null".
* `InputManager.onPointerLockChange` is a new method that handles pointer lock change events and dispatches the lock event.
* `CanvasTexture` has been added to the `Textures` namespace so it can be created without needing to import it. The correct way to create a `CanvasTexture` is via the Texture Manager, but you can now do it directly if required. Fix #4651 (thanks @Jugacu)
* The `SmoothedKeyControl` minimum zoom a Camera can go to is now 0.001. Previously it was 0.1. This is to make it match the minimum zoom a Base Camera can go to. Fix #4649 (thanks @giviz)
* `WebGLRenderer.lostContextCallbacks` and the `onContextLost` method have been removed. Please use the new `CONTEXT_LOST` event instead.
* `WebGLRenderer.restoredContextCallbacks` and the `onContextRestored` method have been removed. Please use the new `CONTEXT_RESTORED` event instead.
* `TextureManager.getBase64` will now emit a console warning if you try to get a base64 from a non-image based texture, such as a WebGL Texture.
* The `WebAudioSoundManager` will now remove the document touch handlers even if the Promise fails, preventing it from throwing a rejection handler error.
* `GameObjectFactory.remove` is a new static function that will remove a custom Game Object factory type.
* `GameObjectCreator.remove` is a new static function that will remove a custom Game Object creator type.
* `CanvasTexture.getPixels` now defaults to 0x0 by width x height as the default area, allowing you to call the method with no arguments to get all the pixels for the canvas.
* `CreateDOMContainer` will now use `div.style.cssText` to set the inline styles of the container, so it now works on IE11. Fix #4674 (thanks @DanLiamco)
* `TransformMatrix.rotation` now returns the properly normalized rotation value.
* `PhysicsEditorParser` has now been exposed under the `Phaser.Physics.Matter` namespace, so you can call methods on it directly.
* Calling `CanvasTexture.update` will now automatically call `refresh` if running under WebGL. This happens for both `draw` and `drawFrame`, meaning you no longer need to remember to call `refresh` after drawing to a Canvas Texture in WebGL, keeping it consistent with the Canvas renderer.
* `Frame.destroy` will now null the Frames reference to its parent texture, glTexture and clear the data and customData objects.
* The Container renderer functions will now read the childs `alpha` property, instead of `_alpha`, allowing it to work with more variety of custom children.

### Bug Fixes

* The Scale Manager would throw the error 'TypeError: this.removeFullscreenTarget is not a function' when entering full-screen mode. It would still enter fullscreen, but the error would appear in the console. Fix #4605 (thanks @darklightcode)
* `Tilemap.renderDebug` was calling out-dated Graphics API methods, which would cause the debug to fail (thanks @Fabadiculous)
* The `Matter.Factory.constraint`, `joint` and `worldConstraint` methods wouldn't allow a zero length constraint to be created due to a falsey check of the length argument. You can now set length to be any value, including zero, or leave it undefined to have it automatically calculated (thanks @olilanz)
* `Pointer.getDuration` would return a negative / static value on desktop, or NaN on mobile, because the base time wasn't being pulled in from the Input Manager properly. Fix #4612 (thanks @BobtheUltimateProgrammer)
* `Pointer.downTime`, `Pointer.upTime` and `Pointer.moveTime` would be set to NaN on mobile browsers where Touch.timeStamp didn't exist. Fix #4612 (thanks @BobtheUltimateProgrammer)
* `WebGLRenderer.setScissor` will default the `drawingBufferHeight` if no argument is provided, stopping NaN scissor heights.
* If you called `Scene.destroy` within a Game Object `pointerdown` or `pointerup` handler, it would cause the error "Cannot read property 'game' of null" if the event wasn't cancelled in your handler. It now checks if the manager is still there before accessing its property. Fix #4436 (thanks @jcyuan)
* The `Arc / Circle` Game Object wasn't rendering centered correctly in WebGL due to an issue in a previous size related commit, it would be half a radius off. Fix #4620 (thanks @CipSoft-Components @rexrainbow)
* Destroying a Scene in HEADLESS mode would throw an error as it tried to access the gl renderer in the Camera class. Fix #4467 (thanks @AndreaBoeAbrahamsen @samme)
* `Tilemap.createFromObjects` would ignore the `scene` argument passed in to the method. It's now used (thanks @samme)
* Fixed a bug in the WebGL and Canvas Renderers where a Sprite with a `flipX` or `flipY` value set would render the offset frames slightly out of place, causing the animation to appear jittery. Also, the sprite would be out of place by its origin. Fix #4636 #3813  (thanks @jronn @B3L7)
* Animations with custom pivots, like those created in Texture Packer with the pivot option enabled, would be mis-aligned if flipped. They now render in the correct position, regardless of scale or flip on either axis. Fix #4155 (thanks @Zax37)
* Removing a frame from a 2 frame animation would cause an error when a Sprite using that animation next tried to render. Fix #4621 (thanks @orlicgms)
* Calling `Animation.setRepeat()` wouldn't reset the `repeatCounter` properly, causing Sprite bound animation instances to fail to change their repeat rate. Fix #4553 (thanks @SavedByZero)
* The `UpdateList.remove` method wouldn't flag the Game Object for removal properly if it was active. It now checks that the Game Object is in the current update list and hasn't already been inserted into the 'pending removal' list before flagging it. Fix #4544 (thanks @jcyuan)
* `DynamicTilemapLayer.destroy` will now no longer run its destroy sequence again if it has already been run once. Fix #4634 (thanks @CipSoft-Components)
* `StaticTilemapLayer.destroy` will now no longer run its destroy sequence again if it has already been run once.
* `Shader.uniforms` now uses Extend instead of Clone to perform a deep object copy, instead of a shallow one, avoiding multiple instances of the same shader sharing uniforms. Fix #4641 (thanks @davidmball)
* Calling `input.mouse.requestPointerLock()` will no longer throw an error about being unable to push to the Input Manager events queue.
* The `POINTERLOCK_CHANGE` event is now dispatched by the Input Manager again.
* The `Pointer.movementX` and `Pointer.movementY` properties are now taken directly from the DOM pointer event values, if the pointer is locked, and no longer incremental. Fix #4611 (thanks @davidmball)
* The `Pointer.velocity` and `Pointer.midPoint` values are now updated every frame. Based on the `motionFactor` setting they are smoothed towards zero, for velocity, and the pointer position for the mid point. This now happens regardless if the Pointer moves or not, which is how it was originally intended to behave.
* The `DESTROY` event hook wasn't removed from Group children when destroying the Group and `destroyChildren` was set to false. Now, the hook is removed regardless (thanks @rexrainbow)
* The WebGL Lost and Restored Context callbacks were never removed, which could cause them to hold onto stale references. Fix #3610 (thanks @Twilrom)
* `Origin.updateDisplayOrigin` no longer applies a Math.floor to the display origins, allowing you to have a 0.x origin for a Game Object that only has a width or height of 1. This fixes issues with things like 1x1 rectangles displaying incorrectly during rendering. Fix #4126 (thanks @rexrainbow)
* `InputManager.resetCursor` will now check if the canvas element still exists before resetting the cursor on it. Fix #4662 (thanks @fromnowhereuser)
* It was not possible to set the zoom value of the Scale Manager back to 1 again, having changed it to a different value. Fix #4633 (thanks @lgibson02 @BinaryMoon)

### Examples, Documentation and TypeScript

My thanks to the following for helping with the Phaser 3 Examples, Docs and TypeScript definitions, either by reporting errors, fixing them or helping author the docs:

@vacarsu @KennethGomez @samme @ldd @Jazcash @jcyuan @LearningCode2023 @PhaserEditor2D

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

[get-js]: https://github.com/photonstorm/phaser/releases/download/v3.19.0/phaser.js
[get-minjs]: https://github.com/photonstorm/phaser/releases/download/v3.19.0/phaser.min.js
[clone-http]: https://github.com/photonstorm/phaser.git
[clone-ssh]: git@github.com:photonstorm/phaser.git
[clone-ghwin]: github-windows://openRepo/https://github.com/photonstorm/phaser
[clone-ghmac]: github-mac://openRepo/https://github.com/photonstorm/phaser
[phaser]: https://github.com/photonstorm/phaser
[issues]: https://github.com/photonstorm/phaser/issues
[examples]: https://github.com/photonstorm/phaser3-examples
[contribute]: https://github.com/photonstorm/phaser/blob/master/.github/CONTRIBUTING.md
[forum]: https://phaser.discourse.group/
