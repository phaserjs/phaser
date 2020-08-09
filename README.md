# Phaser - HTML5 Game Framework

![Phaser Header](https://phaser.io/images/github/300/phaser-header.png "Phaser 3 Header Banner")

[![Discord chat](https://img.shields.io/discord/244245946873937922?style=for-the-badge)](https://discord.gg/phaser)
[![Twitter Follow](https://img.shields.io/twitter/follow/phaser_?style=for-the-badge)](https://twitter.com/phaser_)
![GitHub All Releases](https://img.shields.io/github/downloads/photonstorm/phaser/total?style=for-the-badge)
![npm](https://img.shields.io/npm/dy/phaser?label=npm&style=for-the-badge)

Phaser is a fast, free, and fun open source HTML5 game framework that offers WebGL and Canvas rendering across desktop and mobile web browsers. Games can be compiled to iOS, Android and native apps by using 3rd party tools. You can use JavaScript or TypeScript for development.

Along with the fantastic open source community, Phaser is actively developed and maintained by [Photon Storm](http://www.photonstorm.com). As a result of rapid support, and a developer friendly API, Phaser is currently one of the [most starred](https://github.com/collections/javascript-game-engines) game frameworks on GitHub.

Thousands of developers from indie and multi-national digital agencies, and universities worldwide use Phaser. You can take a look at their incredible [games](https://phaser.io/games/).

**Visit:** The [Phaser website](https://phaser.io) and follow on [Twitter](https://twitter.com/phaser_) (#phaserjs)<br />
**Learn:** [API Docs](https://photonstorm.github.io/phaser3-docs/index.html), [Support Forum][forum] and [StackOverflow](https://stackoverflow.com/questions/tagged/phaser-framework)<br />
**Code:** 1700+ [Examples](https://phaser.io/examples) (source available in this [repo][examples])<br />
**Read:** The [Phaser World](#newsletter) Newsletter<br />
**Discord:** Join us on [Discord](https://phaser.io/community/discord)<br />
**Extend:** With [Phaser Plugins](https://phaser.io/shop/plugins)<br />
**Be awesome:** [Support](#support) the future of Phaser<br />

Grab the source and join the fun!

![What's New](https://phaser.io/images/github/div-whats-new.png "What's New")

<div align="center"><img src="https://phaser.io/images/github/news.jpg"></div>

> 13th July 2020

I'm pleased to announce the immediate availability of Phaser 3.24. This release is primarily a maintenance release, with the focus mostly on bug fixes and updates. Even so, there are over 70 updates in this version alone. From improvements to the Arcade Physics system, to new Tween events and the ability to chain multiple animations, to some important fixes. If you're currently using 3.23 then we recommend this upgrade. As usual, I'd like to send my thanks to the Phaser community for their help in both reporting issues and submitting pull requests to fix them.

So, please do spend some time digging through the [Change Log](#changelog). I assure you, it's worth while :)

I'd like to send a massive thank-you to everyone who supports [Phaser on Patreon](https://www.patreon.com/photonstorm) (and now even GitHub Sponsors, too!) Your continued backing keeps allowing me to work on Phaser full-time and this great new releases is the very real result of that. If you've ever considered becoming a backer, now is the perfect time!

As well as all of these updates, development has been progressing rapidly on Phaser 4. If you'd like to stay abreast of developments then I'm now publishing them to the [Phaser Patreon](https://www.patreon.com/photonstorm). Here you can find details about the latest developments and concepts behind Phaser 4.

You can also follow Phaser on [Twitter](https://twitter.com/phaser_) and chat with fellow Phaser devs in our [Discord](https://phaser.io/community/discord).

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
* [Poki](https://developers.poki.com/)
* [CrazyGames](https://www.crazygames.com)
* [Lagged](https://www.lagged.com)

![Sponsors](https://phaser.io/images/github/sponsors-2020-06.png "Our Awesome Sponsors")

![Download Phaser](https://phaser.io/images/github/div-download.png "Download Phaser")
<a name="download"></a>

Phaser 3 is available via GitHub, npm and CDNs:

* Clone the git repository via [https][clone-http], [ssh][clone-ssh] or with the GitHub [Windows][clone-ghwin] or [Mac][clone-ghmac] clients.
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
<script src="//cdn.jsdelivr.net/npm/phaser@3.24.0/dist/phaser.js"></script>
```

or the minified version:

```html
<script src="//cdn.jsdelivr.net/npm/phaser@3.24.0/dist/phaser.min.js"></script>
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

We recently published a new [Phaser 3 TypeScript Project Template](https://github.com/photonstorm/phaser3-typescript-project-template), which you can use to get started with if you like.

The TS defs are automatically generated from the JSDoc comments found in the Phaser source code. If you wish to help refine them then you must edit the Phaser JSDoc blocks directly, not the defs file. You can find more details about the parser we built in the `scripts/tsgen` folder.

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

We've 3 tutorials related specifically to creating **Facebook Instant Games** with Phaser:

* [Getting Started with Facebook Instant Games](http://phaser.io/news/2018/10/facebook-instant-games-phaser-tutorial)
* [Facebook Instant Games Leaderboards Tutorial](http://phaser.io/news/2018/11/facebook-instant-games-leaderboards-tutorial)
* [Displaying Ads in your Instant Games](http://phaser.io/news/2018/12/facebook-instant-games-ads-tutorial)

### Source Code Examples

During our development of Phaser 3, we created hundreds of examples with the full source code and assets ready available. These examples are now fully integrated into the [Phaser website](https://phaser.io/examples). You can also browse them on [Phaser 3 Labs](https://labs.phaser.io) via a more advanced interface, or clone the [examples repo][examples]. We are constantly adding to and refining these examples.

### Huge list of Phaser 3 Plugins

Super community member RexRainbow has been publishing Phaser 3 content for years, building up an impressive catalogue in that time. You'll find [loads of plugins](https://rexrainbow.github.io/phaser3-rex-notes/docs/site/index.html#list-of-my-plugins), from UI controls such as text input boxes, to Firebase support, Finite State Machines and lots more. As well as the plugins there is also a comprehensive set of 'Notes' about Phaser 3, going into great detail about how the various systems work. It's an invaluable resource and well worth checking out at [https://rexrainbow.github.io](https://rexrainbow.github.io/phaser3-rex-notes/docs/site/index.html)

### Create Your First Phaser 3 Example

Create an `index.html` page locally and paste the following code into it:

```html
<!DOCTYPE html>
<html>
<head>
    <script src="https://cdn.jsdelivr.net/npm/phaser@3.24.0/dist/phaser-arcade-physics.min.js"></script> 
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

![Ourcade](https://phaser.io/images/github/ourcade.jpg "Ourcade")

Ourcade have published [two great Phaser 3 books](https://blog.ourcade.co/). They'll take you from getting set-up, through to finishing your first game using modern JavaScript or TypeScript and they're both completely free! They also publish a huge range of quality tutorials and videos, so be sure to check out their site every week.

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

## Version 3.24 - Rem - 13th July 2020

### Arcade Physics New Features, Updates and Fixes

* When colliding physics groups with the search tree enabled, there was an unnecessary intersection test for each body returned by the search (thanks @samme)
* When doing an overlap collision, there was an unnecessary intersection test for each pair of overlapping bodies (thanks @samme)
* Sprite vs. Static Group collision tests now always use the static tree (thanks @samme)
* Fixed a bug where if you added a static body to a sprite with scale ≠ 1, the body position was incorrect (thanks @samme)
* If you passed in an array of `children` when creating a Physics Group, they didn't receive bodies. Fix #5152 (thanks @samme)
* New types allow for better docs / TypeScript defs especially in the Factory functions: `ArcadePhysicsCallback`, `GameObjectWithBody`, `GameObjectWithDynamicBody`, `GameObjectWithStaticBody`, `ImageWithDynamicBody`, `ImageWithStaticBody`, `SpriteWithDynamicBody` and `SpriteWithStaticBody`. Fix #4994 (thanks @samme @gnesher)
* `Body.updateFromGameObject` is a new method that extracts the relevant code from `preUpdate`, allowing you to read the body's new position and center immediately, before the next physics step. It also lets `refreshBody` work for dynamic bodies, where previously it would error (thanks @samme)
* Momentum exchange wasn't working correctly vs. immovable bodies. The movable body tended to stop. Fix #4770 (thanks @samme)
* The Body mass was decreasing the inertia instead of increasing it. Fix #4770 (thanks @samme)
* The separation vector seemed to be incorrect, causing the slip / slide collisions. The separation is now correct for circle–circle collisions (although not fully for circle–rectangle collisions), part fix #4770 (thanks @samme)
* The Arcade Body delta was incorrectly calculated on bodies created during the `update` step, causing the position to be off. Fix #5204 (thanks @zackexplosion @samme)
* `Arcade.Components.Size.setBodySize` is a new method available on Arcade Physics Game Objects that allows you to set the body size. This replaces `setSize` which is now deprecated. Fix #4786 (thanks @wingyplus)

### New Features

* The Animation component has a new property `nextAnimsQueue` which allows you to sequence Sprite animations to play in order, i.e: `this.mole.anims.play('digging').anims.chain('lifting').anims.chain('looking').anims.chain('lowering');` (thanks @tgroborsch)
* `Group.setActive` is a new method that will set the active state of a Group, just like it does on other Game Objects (thanks @samme)
* `Group.setName` is a new method that will set the name property of a Group, just like it does on other Game Objects (thanks @samme)
* `TWEEN_STOP` is a new event dispatched by a Tween when it stops playback (thanks @samme @RollinSafary)
* You can now specify an `onStop` callback when creating a Tween as part of the tween config, which is invoked when a Tween stops playback (thanks @samme @RollinSafary)
* Previously, if you created a timeline and passed no tweens in the config, the timeline would be created but all config properties were ignored. Now the timeline's own properties (completeDelay, loop, loopDelay, useFrames, onStart, onUpdate, onLoop, onYoyo, onComplete, etc.) are set from the config properly (thanks @samme)
* `TextStyle.wordWrapWidth` lets you set the maximum width of a line of text (thanks @mikewesthad)
* `TextStyle.wordWrapCallback` is a custom function that will is responsible for wrapping the text (thanks @mikewesthad)
* `TextStyle.wordWrapCallbackScope` is the scope that will be applied when the `wordWrapCallback` is invoked (thanks @mikewesthad)
* `TextStyle.wordWrapUseAdvanced` controls whether or not to use the advanced wrapping algorithm (thanks @mikewesthad)
* `KeyboardPlugin.removeAllKeys` is a new method that allows you to automatically remove all Key instances that the plugin has created, making house-keeping a little easier (thanks @samme)
* `Math.RotateTo` is a new function that will position a point at the given angle and distance (thanks @samme)
* `Display.Bounds.GetBounds` is a new function that will return the un-transformed bounds of the given Game Object as a Rectangle (thanks @samme)

### Updates

* The `Pointer.dragStartX/YGlobal` and `Pointer.dragX/Y` values are now populated from the `worldX/Y`, which means using those values directly in Input Drag callbacks will now work when the Camera is zoomed. Fix #4755 (thanks @braindx)
* The `browser` field has been added to the Phaser `package.json` pointing to the `dist/phaser.js` umd build (thanks @FredKSchott)
* Calling `TimeStep.wake()` while the loop is running will now cause nothing to happen, rather than sleeping and then waking again (thanks @samme)
* `Container.getBounds` will no longer set the temp rect bounds to the first child of the Container by default (which would error if the child had no bounds, like a Graphics object) and instead sets it as it iterates the children (thanks @blopa)
* `File.state` will now be set to the `FILE_LOADING` state while loading and `FILE_LOADED` after loading (thanks @samme)
* `BaseCamera.cull` now moves some of its calculations outside of the cull loop to speed it up (thanks @samme)
* `SceneManager.createSceneFromInstance` had a small refactor to avoid a pointless condition (thanks @samme)

### Bug Fixes

* Fixed a TypeError warning when importing JSON objects directly to the `url` argument of any of the Loader filetypes. Fix #5189 (thanks @awweather @samme)
* The `NOOP` function was incorrectly imported by the Mouse and Keyboard Manager. Fix #5170 (thanks @samme @gregolai)
* When Audio files failed to decode on loading, they would always show 'undefined' as the key in the error log, now they show the actual key (thanks @samme)
* When the Sprite Sheet parser results in zero frames, the warning will now tell you the texture name that caused it (thanks @samme)
* `KeyboardPlugin.checkDown` didn't set the `duration` to zero if the parameter was omitted, causing it to always return false. Fix #5146 (thanks @lozzajp)
* If you passed in an array of `children` when creating a Group, they were not added and removed correctly. Fix #5151 (thanks @samme)
* When using HTML5 Audio with `pauseOnBlur` (the default), if you play a sound, schedule stopping the sound (e.g., timer, tween complete callback), leave the page, and return to the page, the sound `stop()` will error (thanks @samme)
* Using a Render Texture when you're also using the headless renderer would cause an error (thanks @samme)
* `Ellipse.setWidth` would incorrectly set the `xRadius` to the diameter (thanks @rexrainbow)
* `Ellipse.setHeight` would incorrectly set the `yRadius` to the diameter (thanks @rexrainbow)
* When specifically setting the `parent` property in the Game Config to `null` the canvas was appended to the document body, when it should have been ignored (allowing you to add it to the dom directly). Fix #5191 (thanks @MerganThePirate)
* Containers will now apply nested masks correctly when using the Canvas Renderer specifically (thanks @scott20145)
* Calling `Scale.startFullScreen` would fail in Safari on Mac OS, throwing a `fullscreenfailed` error. It now triggers fullscreen mode correctly, as on other browsers. Fix #5143 (thanks @samme @novaknole)
* Calling `setCrop` on a Matter Physics Sprite would throw a TypeError, but will now crop correctly. Not that it only crops the texture, the body is unaffected. Fix #5211 (thanks @MatthewRorke @samme)
* The Static Tilemap Layer would ignore the layer rotation and parent transform when using WebGL (but worked in Canvas). Both modes now work in the same manner (thanks @cruzdanilo)
* Calling `getTextBounds` on a BitmapText object would return the incorrect values if the origin had been changed, but the text itself had not, as it was using out of date dimensions. Changing the origin now automatically triggers BitmapText to be dirty, forcing the bounds to be refreshed. Fix #5121 (thanks @thenonamezz)
* The ISO Triangle shape would skip rendering the left side of the first triangle in the batch. It now renders all ISO Triangles correctly. Fix #5164 (thanks @mattjennings)

### Examples, Documentation and TypeScript

My thanks to the following for helping with the Phaser 3 Examples, Docs and TypeScript definitions, either by reporting errors, fixing them or helping author the docs:

@samme @SanderVanhove @SirJosh3917 @mooreInteractive @A-312 @lozzajp @mikewesthad @j-waters @futuremarc 

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

The Phaser logo and characters are &copy; 2020 Photon Storm Limited.

All rights reserved.

"Above all, video games are meant to be just one thing: fun. Fun for everyone." - Satoru Iwata

[get-js]: https://github.com/photonstorm/phaser/releases/download/v3.24.0/phaser.js
[get-minjs]: https://github.com/photonstorm/phaser/releases/download/v3.24.0/phaser.min.js
[clone-http]: https://github.com/photonstorm/phaser.git
[clone-ssh]: git@github.com:photonstorm/phaser.git
[clone-ghwin]: github-windows://openRepo/https://github.com/photonstorm/phaser
[clone-ghmac]: github-mac://openRepo/https://github.com/photonstorm/phaser
[phaser]: https://github.com/photonstorm/phaser
[issues]: https://github.com/photonstorm/phaser/issues
[examples]: https://github.com/photonstorm/phaser3-examples
[contribute]: https://github.com/photonstorm/phaser/blob/master/.github/CONTRIBUTING.md
[forum]: https://phaser.discourse.group/
