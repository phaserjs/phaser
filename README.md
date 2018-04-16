# Phaser - HTML5 Game Framework

![Phaser Header](https://phaser.io/images/github/300/phaser-header.png "Phaser 3 Header Banner")

Phaser is a fast, free, and fun open source HTML5 game framework that offers WebGL and Canvas rendering across desktop and mobile web browsers. Games can be compiled to iOS, Android and native apps by using 3rd party tools. You can use JavaScript or TypeScript for development.

Phaser is available in two versions: Phaser 3 and [Phaser CE - The Community Edition](https://github.com/photonstorm/phaser-ce). Phaser CE is a community-lead continuation of the Phaser 2 codebase and is hosted on a separate repo. Phaser 3 is the next generation of Phaser.

Along with the fantastic open source community, Phaser is actively developed and maintained by [Photon Storm](http://www.photonstorm.com). As a result of rapid support, and a developer friendly API, Phaser is currently one of the [most starred](https://github.com/collections/javascript-game-engines) game frameworks on GitHub.

Thousands of developers from indie and multi-national digital agencies, and universities worldwide use Phaser. You can take a look at their incredible [games](https://phaser.io/games/).

**Visit:** The [Phaser website](https://phaser.io) and follow on [Twitter](https://twitter.com/phaser_) (#phaserjs)<br />
**Learn:** [API Docs](https://github.com/photonstorm/phaser3-docs), [Support Forum][forum] and [StackOverflow](https://stackoverflow.com/questions/tagged/phaser-framework)<br />
**Code:** 700+ [Examples](https://labs.phaser.io) (source available in this [repo][examples])<br />
**Read:** Weekly [Phaser World](#newsletter) Newsletter<br />
**Chat:** [Slack](https://phaser.io/community/slack) and [Discord](https://phaser.io/community/discord)<br />
**Extend:** With [Phaser Plugins](https://phaser.io/shop/plugins)<br />
**Be awesome:** [Support](#support) the future of Phaser<br />

Grab the source and join the fun!

![What's New](https://phaser.io/images/github/div-whats-new.png "What's New")

<div align="center"><img src="https://phaser.io/images/github/news.jpg"></div>

> 16th April 2018

**Updated:** We've just released Phaser 3.5. This fixes a few issues and adds in new features like more unified and flexible Camera Effects and powerful new Scene Transitions. It builds upon the work released last week in Phaser 3.4, which was a huge update, bringing lots of fixes and enhancements from the core team and wider community. As always, please check out the [Change Log](#changelog) for comprehensive details about what recent versions contain.

After 1.5 years in the making, tens of thousands of lines of code, hundreds of examples and countless hours of relentless work: Phaser 3 is finally out. It has been a real labor of love and then some!

Please understand this is a bleeding-edge and brand new release. There are features we've had to leave out, areas of the documentation that need completing and so many cool new things we wanted to add. But we had to draw a line in the sand somewhere and 3.0.0 represents that.

For us this is just the start of a new chapter in Phaser's life. We will be jumping on bug reports as quickly as we can and releasing new versions rapidly. We've structured v3 in such a way that we can push out point releases as fast as needed.

We publish our [Developer Logs](https://phaser.io/phaser3/devlog) in the weekly [Phaser World](https://phaser.io/community/newsletter) newsletter. Subscribe to stay in touch and get all the latest news from us and the wider Phaser community.

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

![Weekly Newsletter](https://phaser.io/images/github/div-newsletter.png "Weekly Newsletter")

<div align="center"><img src="https://phaser.io/images/github/phaser-world.png"></div>

Every week we publish the [Phaser World](https://phaser.io/community/newsletter) newsletter. It's packed full of the latest Phaser games, tutorials, videos, meet-ups, talks, and more. The newsletter also contains our weekly Development Progress updates which let you know about the new features we're working on.

Over 100 previous editions can be found on our [Back Issues](https://phaser.io/community/backissues) page.

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
<script src="//cdn.jsdelivr.net/npm/phaser@3.5.0/dist/phaser.js"></script>
```

or the minified version:

```html
<script src="//cdn.jsdelivr.net/npm/phaser@3.5.0/dist/phaser.min.js"></script>
```

### API Documentation

1. Go to https://photonstorm.github.io/phaser3-docs/index.html to read the docs online.
2. Checkout the [phaser3-docs](https://github.com/photonstorm/phaser3-docs) repository and then read the documentation by pointing your browser to the local `docs/` folder.

The documentation for Phaser 3 is an on-going project. Please help us by searching the Phaser code for any instance of the string `[description]` and then replacing it with some documentation.

### TypeScript Definitions

[TypeScript Definitions](https://github.com/photonstorm/phaser3-docs/tree/master/typescript) are now available.

They are automatically generated from the jsdoc comments in the Phaser source code. If you wish to help refine them then you must edit the Phaser jsdoc blocks directly. You can find more details, including the source to the conversion tool we wrote in the Docs repo.

### Webpack

We use Webpack to build Phaser and we take advantage of several features specific to Webpack to do this, including `raw-loader` to handle our shader files and build-time flags for renderer swapping.

If you wish to use Webpack with Phaser then please use our [Phaser 3 Project Template](https://github.com/photonstorm/phaser3-project-template) as it's already set-up to handle the build conditions Phaser needs.

### License

Phaser is released under the [MIT License](https://opensource.org/licenses/MIT).

![Getting Started](https://phaser.io/images/github/div-getting-started.png "Getting Started")
<a name="getting-started"></a>

<img src="https://phaser.io/images/github/learn.jpg" align="right">

Phaser 3 is so brand new the "paint is still wet", but tutorials and guides are starting to come out!

* [Getting Started with Phaser 3](https://phaser.io/tutorials/getting-started-phaser3) (useful if you are completely new to Phaser)
* [Making your first Phaser 3 Game](https://phaser.io/tutorials/making-your-first-phaser-3-game)
* [Phaser 3 Bootstrap and Platformer Example](https://phaser.io/news/2018/02/phaser-3-bootstrap-platformer)

Also, please subscribe to the [Phaser World](https://phaser.io/community/newsletter) newsletter for details about new tutorials as they are published.

### Source Code Examples

During our development of Phaser 3, we created hundreds of examples with the full source code and assets. Until these examples are fully integrated into the Phaser website, you can browse them on [Phaser 3 Labs](https://labs.phaser.io), or clone the [examples repo][examples]. Note: Not all examples work, sorry! We're tidying them up as fast as we can.

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

Subscribe to our weekly newsletter for further tutorials and examples.

![Building Phaser](https://phaser.io/images/github/div-building-phaser.png "Building Phaser")

There are both plain and minified compiled versions of Phaser in the `dist` folder of the repository. The plain version is for use during development, and the minified version is for production use. You can also create your own builds.

### Custom Builds

Phaser 3 must be built using Webpack. We take advantage of a number of Webpack features and plugins which allow us to properly tailor the build process. You can elect exactly which features are bundled into your version of Phaser. We will release a tutorial covering the process shortly, but for now please look at our webpack config files to get an idea of the required settings.

### Building from Source

If you wish to build Phaser 3 from source, ensure you have the required packages by cloning the repository and then running `npm install`.

You can then run `webpack` to create a development build in the `build` folder which includes source maps for local testing. You can also run `npm run dist` to create a minified packaged build in the `dist` folder.

![Change Log](https://phaser.io/images/github/div-change-log.png "Change Log")
<a name="changelog"></a>

## Version 3.5.0 - Kirito - 16th April 2018

### Changes to Cameras

* The Camera class and all Camera effects are now fully covered by 100% complete JS Docs.
* All Camera effects have been recoded from scratch. They now follow a unified effects structure and each effect is encapsulated in its own class found in the 'effects' folder. Currently there are Fade, Flash and Shake effects.
* The new effects classes are accessed via the Camera properties `fadeEffect`, `flashEffect` and `shakeEffect`. You can still use the friendly Camera level methods: `shake`, `fade` and `flash`.
* The new structure means you can replace the default effects with your own by simply overwriting the properties with your own class.
* The effects now work properly under any combination. For example, you can fade out then in, or in then out, and still flash or shake while a fade is happening. The renderers now properly stack the effects in order to allow this.
* All of the effect related Camera properties (like `_fadeAlpha`) have been removed. If you need access to these values you can get it much more cleanly via the camera effects classes themselves. They were always private anyway, but we know some of you needed to modify them, so have been doing so from your code. This code will now need updating.
* Removed Camera.clearBeforeRender property as it was never used internally. This setting can be enabled on a Game-wide basis.
* Camera now extends the Event Emitter, allowing it to emit events.
* Camera.cullHitTest has been removed. It was never used internally and duplicates the code in `Camera.cull`.
* The `callback` property of the Camera effects methods has changed purpose. It is no longer an `onComplete` callback, but is now an `onUpdate` callback. It is invoked every frame for the duration of the effect. See the docs for argument details.
* Camera effects now dispatch events. They dispatch 'start' and 'complete' events, which can be used to handle any actions you may previously have been doing in the callback. See the effects docs and examples for the event names and arguments.
* The Camera Shake effect now lets you specify a different intensities for the x and y dimensions.
* You can track the progress of all events via the `progress` property on the effect instance, allowing you to sync effect duration with other in-game events.

### New Feature: Scene Transitions

There is a new method available in the ScenePlugin, available via: `this.scene.transition` which allows you to transition from one Scene to another over the duration specified. The method takes a configuration object which lets you control various aspects of the transition, from moving the Scenes around the display list, to specifying an onUpdate callback.

The calling Scene can be sent to sleep, stopped or removed entirely from the Scene Manager at the end of the transition, and you can even lock down input events in both Scenes while the transition is happening, if required. There are various events dispatched from both the calling and target Scene, which combined with the onUpdate callback give you the flexibility to create some truly impressive transition effects both into and out of Scenes.

Please see the complete JSDocs for the ScenePlugin for more details, as well as the new examples in the Phaser 3 Labs.

### More New Features

* GameObject.ignoreDestroy allows you to control if a Game Object is destroyed or not. Setting the flag will tell it to ignore destroy requests from Groups, Containers and even the Scene itself. See the docs for more details.
* The Scene Input Plugin has a new property `enabled` which allows you to enable or disable input processing on per Scene basis.

### Bug Fixes

* MatterEvents.off() would cause a TypeError if you destroyed the Matter world. Fix #3562 (thanks @pixelscripter)
* DynamicBitmapText was missing the `letterSpacing` property, causing it to only render the first character in WebGL (thanks @Antriel)
* The Animation component didn't properly check for the animation state in its update, causing pause / resume to fail. Fix #3556 (thanks @Antriel @siolfyr)
* The Scene Manager would never reach an `isBooted` state if you didn't add any Scenes into the Game Config. Fix #3553 (thanks @rgk)
* Fixed issue in HTMLAudioSound where `mute` would get into a recursive loop.
* Every RenderTexture would draw the same content due to a mis-use of the CanvasPool (this also impacted TileSprites). Fix #3555 (thanks @kuoruan)
* Group.add and Group.addMultiple now respect the Group.maxSize property, stopping you from over-populating a Group (thanks @samme)
* When using HTML5 Audio, sound manager now tries to unlock audio after every scene loads, instead of only after first one. Fix #3309 (thanks @pavle-goloskokovic)
* Group.createMultiple would insert null entries if the Group became full during the operation, causing errors later. Now it stops creating objects if the Group becomes full (thanks @samme)
* Group.remove didn't check if the passed Game Object was already a member of the group and would call `removeCallback` and (if specified) `destroy` in any case. Now it does nothing if the Game Object isn't a member of the group (thanks @samme)
* If a Group size exceeded `maxSize` (which can happen if you reduce maxSize beneath the current size), `isFull` would return false and the group could continue to grow. Now `isFull` returns true in that case (thanks @samme)
* Camera.fadeIn following a fadeOut wouldn't work, but is now fixed as a result of the Camera effects rewrite. Fix #3527 (thanks @Jerenaux)
* Particle Emitters with large volumes of particles would throw the error `GL_INVALID_OPERATION: Vertex buffer is not big enough for the draw call` in WebGL.
* Fixed issue with Game.destroy not working correctly under WebGL since 3.4. Fix #3569 (thanks @Huararanga)

### Updates

* Removed the following properties from BaseSound as they are no longer required. Each class that extends BaseSound implements them directly as getters: `mute`, `loop`, `seek` and `volume`.
* The Device.OS test to see if Phaser is running under node.js has been strengthened to support node-like environments like Vue (thanks @Chumper)
* Every Plugin has been updated to correctly follow the same flow through the Scene lifecycle. Instead of listening for the Scene 'boot' event, which is only dispatched once (when the Scene is first created), they will now listen for the Scene 'start' event, which occurs every time the Scene is started. All plugins now consistently follow the same Shutdown and Destroy patterns too, meaning they tidy-up after themselves on a shutdown, not just a destroy. Overall, this change means that there should be less issues when returning to previously closed Scenes, as the plugins will restart themselves properly.
* When shutting down a Scene all Game Objects that belong to the scene will now automatically destroy themselves. They would previously be removed from the display and update lists, but the objects themselves didn't self-destruct. You can control this on a per-object basis with the `ignoreDestroy` property.
* A Matter Mouse Spring will disable debug draw of its constraint by default (you can override it by passing in your own config)
* The RandomDataGenerator class is now exposed under Phaser.Math should you wish to instantiate it yourself. Fix #3576 (thanks @wtravO)
* Refined the Game.destroy sequence, so it will now only destroy the game at the start of the next frame, not during processing.

### Examples, Documentation and TypeScript

My thanks to the following for helping with the Phaser 3 Examples, Docs and TypeScript definitions, either by reporting errors, fixing them or helping author the docs:

@samme @Antriel

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

[get-js]: https://github.com/photonstorm/phaser/releases/download/v3.5.0/phaser.js
[get-minjs]: https://github.com/photonstorm/phaser/releases/download/v3.5.0/phaser.min.js
[clone-http]: https://github.com/photonstorm/phaser.git
[clone-ssh]: git@github.com:photonstorm/phaser.git
[clone-ghwin]: github-windows://openRepo/https://github.com/photonstorm/phaser
[clone-ghmac]: github-mac://openRepo/https://github.com/photonstorm/phaser
[phaser]: https://github.com/photonstorm/phaser
[issues]: https://github.com/photonstorm/phaser/issues
[examples]: https://github.com/photonstorm/phaser3-examples
[contribute]: https://github.com/photonstorm/phaser/blob/master/.github/CONTRIBUTING.md
[forum]: http://www.html5gamedevs.com/forum/33-phaser-3/
