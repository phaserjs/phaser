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

> 24th May 2018

Our aim has always been to continue our mission of enhancing Phaser 3 as best and as quickly as we can. This means we're releasing often quite significant updates in relatively short periods of time. It also means we're jumping on bug reports as quickly as we can, keeping the issues list total nice and low (the vast majority of the items in there are feature requests now!)

It's been a steady few weeks of development and we're ready with 3.9.0. There are no significant new features, but it contains a lot of important changes and fixes all the same. Highlights include better keyboard focus loss handling, new Camera lerp and follow offset features, new Plugin Manager features for registering custom file types and plenty more. We're also working hard on documentation and hundreds more functions have been completed in this release.

In 3.8.0 we released a completely overhauled Plugin system, allowing you to add game and Scene level plugins into Phaser with ease, as well as custom Game Objects and File Types too. This continues the work carried out in 3.7.0, in which we made significant improvements to the Loader, allowing for far more flexible file loading, new loader packs, new file formats, normal map support and more. We've also improved our build process, making Phaser 3 much easier to package outside of Webpack. You'll also find hundreds and hundreds of  items now have full documentation too. As always, please check out the [Change Log](#changelog) for comprehensive details about what recent versions contain.

**About Phaser 3**

After 1.5 years in the making, tens of thousands of lines of code, hundreds of examples and countless hours of relentless work: Phaser 3 is finally out. It has been a real labor of love and then some!

Please understand this is a bleeding-edge and brand new release. There are features we've had to leave out, areas of the documentation that need completing and so many cool new things we wanted to add. But we had to draw a line in the sand somewhere and 3.0.0 represents that.

For us this is just the start of a new chapter in Phaser's life. We will be jumping on bug reports as quickly as we can and releasing new versions rapidly. We've structured v3 in such a way that we can push out point releases as fast as needed.

We publish our [Developer Logs](https://phaser.io/phaser3/devlog) in the [Phaser World](https://phaser.io/community/newsletter) newsletter. Subscribe to stay in touch and get all the latest news from us and the wider Phaser community.

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
<script src="//cdn.jsdelivr.net/npm/phaser@3.9.0/dist/phaser.js"></script>
```

or the minified version:

```html
<script src="//cdn.jsdelivr.net/npm/phaser@3.9.0/dist/phaser.min.js"></script>
```

### API Documentation

1. Go to https://photonstorm.github.io/phaser3-docs/index.html to read the docs online, or ...
2. Checkout the [phaser3-docs](https://github.com/photonstorm/phaser3-docs) repository and then read the documentation by pointing your browser to the local `docs/` folder.

The documentation for Phaser 3 is an on-going project. Please help us by searching the Phaser code for any instance of the string `[description]` and then replacing it with some documentation.

### TypeScript Definitions

[TypeScript Definitions](https://github.com/photonstorm/phaser3-docs/tree/master/typescript) are now available.

They are automatically generated from the jsdoc comments in the Phaser source code. If you wish to help refine them then you must edit the Phaser jsdoc blocks directly. You can find more details, including the source to the conversion tool we wrote in the Docs repo.

As soon as we're happy with the accuracy of the TS defs we'll merge them into the main repo, for now, please download them from the docs repo, linked above, and add them to your project. When we release new versions of Phaser we publish new TS defs too.

### Webpack

We use Webpack to build Phaser and we take advantage of its conditional build flag feature to handle renderer swapping. If you wish to use Webpack with Phaser then please use our [Phaser 3 Project Template](https://github.com/photonstorm/phaser3-project-template) as it's already set-up to handle the build conditions Phaser needs. Recent changes to our build steps mean you should now be able to us any other packager, like Parcel, without any config changes.

### License

Phaser is released under the [MIT License](https://opensource.org/licenses/MIT).

![Getting Started](https://phaser.io/images/github/div-getting-started.png "Getting Started")
<a name="getting-started"></a>

<img src="https://phaser.io/images/github/learn.jpg" align="right">

Phaser 3 is so new the "paint is still wet", but tutorials and guides are starting to come out!

* [Getting Started with Phaser 3](https://phaser.io/tutorials/getting-started-phaser3) (useful if you are completely new to Phaser)
* [Making your first Phaser 3 Game](https://phaser.io/tutorials/making-your-first-phaser-3-game)
* [Phaser 3 Bootstrap and Platformer Example](https://phaser.io/news/2018/02/phaser-3-bootstrap-platformer)

Also, please subscribe to the [Phaser World](https://phaser.io/community/newsletter) newsletter for details about new tutorials as they are published.

### Source Code Examples

During our development of Phaser 3, we created hundreds of examples with the full source code and assets. Until these examples are fully integrated into the Phaser website, you can browse them on [Phaser 3 Labs](https://labs.phaser.io), or clone the [examples repo][examples]. We are constantly adding to and refining these examples.

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

Phaser 3 is built using Webpack and we take advantage of the Webpack definePlugin feature to allow for conditional building of the Canvas and WebGL renderers. As of Phaser 3.7 we have updated our webpack config to make our source far easier to consume in other package managers like Parcel and Electron. Please look our webpack config files to get an idea of the settings we use.

### Building from Source

If you wish to build Phaser 3 from source, ensure you have the required packages by cloning the repository and then running `npm install`.

You can then run `webpack` to create a development build in the `build` folder which includes source maps for local testing. You can also `npm run dist` to create a minified packaged build in the `dist` folder. For a list of all commands available use `npm run help`.

![Change Log](https://phaser.io/images/github/div-change-log.png "Change Log")
<a name="changelog"></a>

# Change Log

## Version 3.9.0 - Yui - 24th May 2018

### New Features

* The command `npm run help` will display a friendly list of all the scripts available (run `npm install` first)
* Game has a new property `hasFocus` which is a read-only boolean that lets you know if the window the game is embedded in (including in an iframe) currently has focus or not.
* Game.Config has a new property `autoFocus`, which is `true` by default, and will automatically call `window.focus()` when the game starts.
* Clicking on the canvas will automatically call `window.focus`. This means in games that use keyboard controls if you tab or click away from the game, then click back on it again, the keys will carry on working (where-as before they would remain unfocused)
* Arcade Physics Body has a new method `setAllowDrag` which toggles the `allowDrag` property (thanks @samme)
* Arcade Physics Body has a new method `setAllowGravity` which toggles the `allowGravity` property (thanks @samme)
* Arcade Physics Body has a new method `setAllowRotation` which toggles the `allowRotation` property (thanks @samme)
* Arcade Physics Group Config has 3 new properties you can use: `allowDrag`, `allowGravity` and `allowRotation` (thanks @samme)
* PluginManager.registerFileType has a new property `addToScene` which allows you to inject the new file type into the LoaderPlugin of the given Scene. You could use this to add the file type into the Scene in which it was loaded.
* PluginManager.install has a new property `mapping`. This allows you to give a Global Plugin a property key, so that it is automatically injected into any Scenes as a Scene level instance. This allows you to have a single global plugin running in the PluginManager, that is injected into every Scene automatically.
* Camera.lerp has been implemented and allows you to specify the linear interpolation value used when following a target, to provide for smoothed camera tracking.
* Camera.setLerp is a chainable method to set the Camera.lerp property.
* Camera.followOffset is a new property that allows you to specify an offset from the target position that the camera is following (thanks @hermbit)
* Camera.setFollowOffset is a chainable method to set the Camera.followOffset property.
* Camera.startFollow has 4 new arguments: `lerpX` and `lerpY` which allow you to set the interpolation value used when following the target. The default is 1 (no interpolation) and `offsetX` and `offsetY` which allow you to set the follow offset values.
* Camera.startFollow will now immediately set the camera `scrollX` and `scrollY` values to be that of the target position to avoid a large initial lerps during the first few preUpdates.
* Math.Interpolation.SmoothStep is a new method that will return the smooth step interpolated value based on the given percentage and left and right edges.
* Math.Interpolation.SmootherStep is a new method that will return the smoother step interpolated value based on the given percentage and left and right edges.

### Updates

* Container.setInteractive can now be called without any arguments as long as you have called Container.setSize first (thanks rex)
* Bob.reset will now reset the position, frame, flip, visible and alpha values of the Bob.
* VisibilityHandler now takes a game instance as its sole argument, instead of an event emitter.
* PluginManager.createEntry is a new private method to create a plugin entry and return it. This avoids code duplication in several other methods, which now use this instead.
* The Plugin File Type has a new optional argument `mapping`, which allows a global plugin to be injected into a Scene as a reference.
* TileSprite.destroy has been renamed to `preDestroy` to take advantage of the preDestroy callback system.
* RenderTexture.destroy has been renamed to `preDestroy` to take advantage of the preDestroy callback system.
* Group.destroy now respects the `ignoreDestroy` property.
* Graphics.preDestroy now clears the command buffer array.
* Container addHandler will now remove a child's Scene shutdown listener and only listens to `destroy` once.
* Container removeHandler will re-instate a child's Scene shutdown listener.
* Container preDestroy now handles the pre-destroy calls, such as clearing the container.
* Blitter preDestroy will now clear the children List and renderList.
* The AudioContextMonkeyPatch has been updated to use an iife. Fix #3437 (thanks @NebSehemvi)

### Bug Fixes

* PluginManager.destroy didn't reference the plugin correctly, throwing an Uncaught TypeError if you tried to destroy a game instance. Fix #3668 (thanks @Telokis)
* If a Container and its child were both input enabled they will now be sorted correctly in the InputPlugin (thanks rex)
* Fix TypeError when colliding a Group as the only argument in Arcade Physics. Fix #3665 (thanks @samme)
* The Particle tint value was incorrectly calculated, causing the color channels to be inversed. Fix #3643 (thanks @rgk)
* All Game Objects that were in Containers were being destroyed twice when a Scene was shutdown. Although not required it still worked in most cases, except with TileSprites. TileSprites specifically have been hardened against this now but all Game Objects inside Containers now have a different event flow, stopping them from being destroyed twice (thanks @laptou @PaNaVTEC)
* Camera.cull will now accurately return only the Game Objects in the camera view, instead of them all. Fix #3646 (thanks @KingCosmic @Yora)
* The `dragend` event would be broadcast even if the drag distance or drag time thresholds were not met. Fix #3686 (thanks @RollinSafary)
* Restarting a Tween immediately after creating it, without it having first started, would cause it to get stuck permanently in the Tween Managers add queue (thanks @Antriel @zacharysarette)
* Setting an existing Game Object as a static Arcade Physics body would sometimes incorrectly pick-up the dimensions of the object, such as with TileSprites. Fix #3690 (thanks @fariazz)
* Interactive Objects were not fully removed from the Input Plugin when cleared, causing the internal list array to grow. Fix #3645 (thanks @tjb295 for the fix and @rexrainbow for the issue)
* Camera.shake would not effect dynamic tilemap layers. Fix #3669 (thanks @kainage)

### Examples, Documentation and TypeScript

Thanks to the work of @hexus we have now documented nearly all of the Math namespace. This is hundreds of functions now covered by full docs and is work we'll continue in the coming weeks.

My thanks to the following for helping with the Phaser 3 Examples, Docs and TypeScript definitions, either by reporting errors, fixing them or helping author the docs:

@mikez @wtravO @thomastanck

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

[get-js]: https://github.com/photonstorm/phaser/releases/download/v3.9.0/phaser.js
[get-minjs]: https://github.com/photonstorm/phaser/releases/download/v3.9.0/phaser.min.js
[clone-http]: https://github.com/photonstorm/phaser.git
[clone-ssh]: git@github.com:photonstorm/phaser.git
[clone-ghwin]: github-windows://openRepo/https://github.com/photonstorm/phaser
[clone-ghmac]: github-mac://openRepo/https://github.com/photonstorm/phaser
[phaser]: https://github.com/photonstorm/phaser
[issues]: https://github.com/photonstorm/phaser/issues
[examples]: https://github.com/photonstorm/phaser3-examples
[contribute]: https://github.com/photonstorm/phaser/blob/master/.github/CONTRIBUTING.md
[forum]: http://www.html5gamedevs.com/forum/33-phaser-3/
