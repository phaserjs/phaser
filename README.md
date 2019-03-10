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

> 11th February 2019

With a new version as large as 3.16.0 was, there were bound to be some bugs that got overlooked. With 3.16.2 we address some of the more important ones. Please see the Change Log below for full details. If you're using 3.16, then please upgrade to 3.16.2.

5th February 2019:

I'm pleased to announce that Phaser 3.16 is now available. This version represents a significant milestone in the project as Phaser 3 is now 100% feature complete with all of the initially planned systems now in place. The most significant additions in 3.16 is the overhaul of the Input event handling, the long-awaited introduction of the Scale Manager, and the Extern Game Object, which allows for 3rd party rendering support, as required by Spine. Spine animation support is being handled exclusively through a Phaser Plugin. The current build of the Spine plugin can be found in this repo in the `plugins` folder, along with examples in the Phaser Labs. The Spine plugin will be developed independently of Phaser in the coming weeks.

This is the single largest update of Phaser 3 yet, and as such, there _are_ breaking changes. I have painstakingly listed all of them in the Change Log, so please do read it if you're upgrading from an earlier version. I know there is a lot to take in, so I'll be covering the new features in the Phaser World newsletter in the coming weeks.

3.16 also brings together all of the hard work from the community that went in to the documentation. They're in a much better state than ever before, and very nearly 100% complete. I also completely reworked the internal event system, so event names, callback arguments and more are easy to find in one central place in the docs and can be reference in your code with either strings or properly name-spaced constants.

A massive thank-you to everyone who supports Phaser on Patreon and PayPal. It's your backing that allows me to work on this full-time. If you've ever considered becoming a backer, now is the perfect time!

As always, please check out the [Change Log](#changelog) for comprehensive details about what recent versions contain.

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

I use [Patreon](https://www.patreon.com/photonstorm) to manage the backing and you can [support Phaser](https://www.patreon.com/join/photonstorm?) from $1 per month. The amount you pledge is entirely up to you and can be changed as often as you like. Patreon renews monthly, just like Netflix. You can, of course, cancel at any point. Tears will be shed on this end, but that's not your concern.

Extra special thanks to our top-tier sponsors: [Orange Games](http://orangegames.com) and [CrossInstall](https://crossinstall.com).

![Sponsors](https://phaser.io/images/github/patreon-sponsors-2018-1.png "Top Patreon Sponsors")

![Phaser Newsletter](https://phaser.io/images/github/div-newsletter.png "Phaser Newsletter")

<div align="center"><img src="https://phaser.io/images/github/phaser-world.png"></div>

We publish the [Phaser World](https://phaser.io/community/newsletter) newsletter. It's packed full of the latest Phaser games, tutorials, videos, meet-ups, talks, and more. The newsletter also contains our weekly Development Progress updates which let you know about the new features we're working on.

Over 130 previous editions can be found on our [Back Issues](https://phaser.io/community/backissues) page.

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
<script src="//cdn.jsdelivr.net/npm/phaser@3.16.2/dist/phaser.js"></script>
```

or the minified version:

```html
<script src="//cdn.jsdelivr.net/npm/phaser@3.16.2/dist/phaser.min.js"></script>
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
<script src="//cdn.jsdelivr.net/npm/phaser@3.16.2/dist/phaser-facebook-instant-games.js"></script>
```

or the minified version:

```html
<script src="//cdn.jsdelivr.net/npm/phaser@3.16.2/dist/phaser-facebook-instant-games.min.js"></script>
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
    <script src="https://cdn.jsdelivr.net/npm/phaser@3.16.2/dist/phaser-arcade-physics.min.js"></script> 
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

## Version 3.16.2 - Ishikawa - 11th February 2019

This is point release primarily fixes a few important issues that surfaced in 3.16.0. Please be sure to read the [Change Log](https://github.com/photonstorm/phaser/blob/master/CHANGELOG.md) if you are coming from a version < 3.16.0 as it contains lots of important updates.

### Matter Pointer Constraint Changes

The following changes all effect the Matter JS Pointer Constraint class:

* Pointer handling has been changed to make more sense. In the previous version, pressing down and then moving the Pointer _over_ a body would start it being dragged, even if the pointer was pressed down well outside of the body bounds. Now, a body can only be dragged by actually pressing down on it, or any of its parts, which is more in-line with how input events should work.
* Previously, releasing ANY pointer would stop an object being dragged, even if it wasn't the one actually dragging a body, as in a multi-touch game. Bodies are now bound to the pointer which started their drag and only the release of that pointer will stop them.
* There is a new Matter Physics Event `DRAG_START` which is emitted by a Pointer Constraint when it starts dragging a body. Listen for this event from the Matter World instance.
* There is a new Matter Physics Event `DRAG` which is emitted by a Pointer Constraint as it drags a body. Listen for this event from the Matter World instance.
* There is a new Matter Physics Event `DRAG_END` which is emitted by a Pointer Constraint when it stops dragging a body. Listen for this event from the Matter World instance.
* The `camera` property can no longer be set in the config object. Instead it is set every time the Pointer is pressed down on a Body, this resolves issues where you have a multi-camera Scene and want to drag a body in the non-main camera.
* `body` is a new property that holds a reference to the Body being dragged, if any.
* `part` is a new property that holds a reference to the Body part that was clicked on which started the drag.
* The internal `getBodyPart` method has been renamed to `hitTestBody` to more accurately reflect what it does.
* The class no longer listens for the pointer `up` event, instead of tracks the active pointer and waits for that to be released. This has reduced the complexity and size of the `update` method considerably.
* `stopDrag` is a new method that allows you to manually stop an object being dragged, even if the pointer isn't released.
* This class now has 100% JSDocs.

### Updates

* `TileSprite.setTileScale` has been updated so that the `y` argument is optional and set to match the `x` argument, like `setScale` elsewhere in the API.
* `InputManager.time` is a new property that holds the most recent time it was updated from the Game step, which plugins can access.
* `InputManager.preStep` is a new method that populates some internal properties every step.
* `KeyboardPlugin.time` has moved from being a property to being a getter, which returns the time from the InputManager.
* The `scale` property has been added to the `Scene` class (thanks @strangeweekend)
* `Matter.World.remove` now uses the `Composite.remove` method internally. Previously, it used `Composite.removeBody` which only allowed it to remove bodies from the simulation. Now, it can remove any type of Matter object.
* When the Matter World creates its wall bounds, the left and right walls now extend further up and down than before, so that in a 4-wall setting there are no gaps in the corners, which previously allowed for fast moving objects that hit a corner intersection point to sometimes travel through it.
* Touch inputs will now trigger a `POINTER_OUT` event if they leave the game (i.e. are released), where-as before they would only trigger the `POINTER_UP` event. Now, both happen (thanks @rgk)

### Bug Fixes

* The `Mesh.setAlpha` method has been restored, even though it's empty and does nothing, to prevent runtime errors when adding a Mesh or Quad object to a Container. Fix #4338 #4343 (thanks @pfdtravalmatic @charmingny)
* `KeyboardPlugin.checkDown` would always fail if using the new event system, because the time value it was checking wasn't updated.
* Entering `Fullscreen` mode in the Scale Manager and then pressing ESC would leave the injected fullsceen div in the DOM, causing it to throw a node insertion failure the second time you wanted to enter fullscreen mode. Fix #4352 (thanks @ngdevr)
* Due to the changes in the Input event system, the `GAME_OUT` event would never fire unless the input system was in legacy mode. The OUT and OVER handlers have been refactored and will now fire as soon as the DOM event happens. As a result the `InputManager._emitIsOverEvent` property has been removed, as the native event is sent directly to the handler and doesn't need storing locally any more. Fix #4344 (thanks @RademCZ)
* Added `Zone.setBlendMode` method as a NOOP function, fixing a bug where if you added a Zone to a Container when running under Canvas it would fail. Fix #4295 (thanks @emanuel15)

### Examples, Documentation and TypeScript

My thanks to the following for helping with the Phaser 3 Examples, Docs and TypeScript definitions, either by reporting errors, fixing them or helping author the docs:

@maretana @CipSoft-Components @brian-lui

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

The Phaser logo and characters are &copy; 2019 Photon Storm Limited.

All rights reserved.

"Above all, video games are meant to be just one thing: fun. Fun for everyone." - Satoru Iwata

[get-js]: https://github.com/photonstorm/phaser/releases/download/v3.16.2/phaser.js
[get-minjs]: https://github.com/photonstorm/phaser/releases/download/v3.16.2/phaser.min.js
[clone-http]: https://github.com/photonstorm/phaser.git
[clone-ssh]: git@github.com:photonstorm/phaser.git
[clone-ghwin]: github-windows://openRepo/https://github.com/photonstorm/phaser
[clone-ghmac]: github-mac://openRepo/https://github.com/photonstorm/phaser
[phaser]: https://github.com/photonstorm/phaser
[issues]: https://github.com/photonstorm/phaser/issues
[examples]: https://github.com/photonstorm/phaser3-examples
[contribute]: https://github.com/photonstorm/phaser/blob/master/.github/CONTRIBUTING.md
[forum]: https://phaser.discourse.group/
