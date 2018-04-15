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

> 12th April 2018

**Updated:** I'm pleased to announce the immediate release of Phaser 3.4. This is a huge update, bringing lots of fixes and enhancements from the core team and wider community. We've also updated the TypeScript defs to 3.4. As always, please check out the [Change Log](#changelog) for comprehensive details about what this version contains.

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
<script src="//cdn.jsdelivr.net/npm/phaser@3.4.0/dist/phaser.js"></script>
```

or the minified version:

```html
<script src="//cdn.jsdelivr.net/npm/phaser@3.4.0/dist/phaser.min.js"></script>
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

## Version 3.4.0 - Miyako - 12th April 2018

### New Features

A beta release of the new Container Game Object arrives in this version. We've flagged it as beta because there are known issues in using Containers in Scenes that have multiple cameras or irregular camera viewports. However, in all other instances we've tested they are operating normally, so we felt it would be best to release them into this build to give developers a chance to get used to them. Using a Container will issue a single console warning as a reminder. We will remove this once they leave beta in a future release. In the meantime they are fully documented and you can find numerous examples in the Phaser 3 Examples repo too.

* A new property was added to Matter.World, `correction` which is used in the Engine.update call and allows you to adjust the time being passed to the simulation. The default value is 1 to remain consistent with previous releases.
* Matter Physics now has a new config property `getDelta` which allows you to specify your own function to calculate the delta value given to the Matter Engine when it updates.
* Matter Physics has two new methods: `set60Hz` and `set30Hz` which will set an Engine update rate of 60Hz and 30Hz respectively. 60Hz being the default.
* Matter Physics has a new config and run-time property `autoUpdate`, which defaults to `true`. When enabled the Matter Engine will update in sync with the game step (set by Request Animation Frame). The delta value given to Matter is now controlled by the `getDelta` function.
* Matter Physics has a new method `step` which manually advances the physics simulation by one iteration, using whatever delta and correction values you pass in to it. When used in combination with `autoUpdate=false` you can now explicitly control the update frequency of the physics simulation and unbind it from the game step.
* Matter Physics has two new debug properties: `debugShowJoint` and `debugJointColor`. If defined they will display joints in Matter bodies during the postUpdate debug phase (only if debug is enabled) (thanks @OmarShehata)
* Group.destroy has a new optional argument `destroyChildren` which will automatically call `destroy` on all children of a Group if set to true (the default is false, hence it doesn't change the public API). Fix #3246 (thanks @DouglasLapsley)
* WebAudioSound.setMute is a chainable way to mute a single Sound instance.
* WebAudioSound.setVolume is a chainable way to set the volume of a single Sound instance.
* WebAudioSound.setSeek is a chainable way to set seek to a point of a single Sound instance.
* WebAudioSound.setLoop is a chainable way to set the loop state of a single Sound instance.
* HTML5AudioSound.setMute is a chainable way to mute a single Sound instance.
* HTML5AudioSound.setVolume is a chainable way to set the volume of a single Sound instance.
* HTML5AudioSound.setSeek is a chainable way to set seek to a point of a single Sound instance.
* HTML5AudioSound.setLoop is a chainable way to set the loop state of a single Sound instance.
* BitmapText has a new property `letterSpacing` which accepts a positive or negative number to add / reduce spacing between characters (thanks @wtravO)
* You can now pass a Sprite Sheet or Canvas as the Texture key to `Tilemap.addTileset` and it will work in WebGL, where-as before it would display a corrupted tilemap. Fix #3407 (thanks @Zykino)
* Graphics.slice allows you to easily draw a Pacman, or slice of pie shape to a Graphics object.
* List.addCallback is a new optional callback that is invoked every time a new child is added to the List. You can use this to have a callback fire when children are added to the Display List.
* List.removeCallback is a new optional callback that is invoked every time a new child is removed from the List. You can use this to have a callback fire when children are removed from the Display List.
* ScenePlugin.restart allows you to restart the current Scene. It's the same result as calling `ScenePlugin.start` without any arguments, but is more clear.
* Utils.Array.Add allows you to add one or more items safely to an array, with optional limits and callbacks.
* Utils.Array.AddAt allows you to add one or more items safely to an array at a specified position, with optional limits and callbacks.
* Utils.Array.BringToTop allows you to bring an array element to the top of the array.
* Utils.Array.CountAllMatching will scan an array and count all elements with properties matching the given value.
* Utils.Array.Each will pass each element of an array to a given callback, with optional arguments.
* Utils.Array.EachInRange will pass each element of an array in a given range to a callback, with optional arguments.
* Utils.Array.GetAll will return all elements from an array, with optional property and value comparisons.
* Utils.Array.GetFirst will return the first element in an array, with optional property and value comparisons.
* Utils.Array.GetRandomElement has been renamed to GetRandom and will return a random element from an array.
* Utils.Array.MoveDown will move the given array element down one position in the array.
* Utils.Array.MoveTo will move the given array element to the given position in the array.
* Utils.Array.MoveUp will move the given array element up one position in the array.
* Utils.Array.Remove will remove the given element or array of elements from the array, with an optional callback.
* Utils.Array.RemoveAt will remove the element from the given position in the array, with an optional callback.
* Utils.Array.RemoveBetween will remove the elements between the given range in the array, with an optional callback.
* Utils.Array.Replace will replace an existing element in an array with a new one.
* Utils.Array.SendToBack allows you to send an array element to the bottom of the array.
* Utils.Array.SetAll will set a property on all elements of an array to the given value, with optional range limits.
* Utils.Array.Swap will swap the position of two elements in an array.
* TransformMatrix.destroy is a new method that will clear out the array and object used by a Matrix internally.
* BaseSound, and by extension WebAudioSound and HTMLAudioSound, will now emit a `destroy` event when they are destroyed (thanks @rexrainbow)
* A new property was added to the Scene config: `mapAdd` which is used to extend the default injection map of a scene instead of overwriting it (thanks @sebashwa)
* GetBounds `getTopLeft`, `getTopRight`, `getBottomLeft` and `getBottomRight` all have a new optional argument `includeParent` which will factor in all ancestor transforms to the returned point.

### Bug Fixes

* In the WebGL Render Texture the tint of the texture was always set to 0xffffff and therefore the alpha values were ignored. The tint is now calculated using the alpha value. Fix #3385 (thanks @ger1995)
* The RenderTexture now uses the ComputedSize component instead of Size (which requires a frame), allowing calls to getBounds to work. Fix #3451 (thanks @kuoruan)
* PathFollower.start has been renamed to `startFollow`, but PathFollower.setPath was still using `PathFollower.start` (thanks @samid737)
* BaseSoundManager.rate and BaseSoundManager.detune would incorrectly called `setRate` on its sounds, instead of `calculateRate`.
* The Gamepad Axis `getValue` method now correctly applies the threshold and zeroes out the returned value.
* The HueToComponent module was not correctly exporting itself. Fix #3482 (thanks @jdotrjs)
* Matter.World was using `setZ` instead of `setDepth` for the Debug Graphics Layer, causing it to appear behind objects in some display lists.
* Game.destroy now checks to see if the `renderer` exists before calling destroy on it. Fix #3498 (thanks @Huararanga)
* Keyboard.JustDown and Keyboard.JustUp were being reset too early, causing them to fail when called in `update` loops. Fix #3490 (thanks @belen-albeza)
* RenderTexture.destroy no longer throws an error when called. Fix #3475 (thanks @kuoruan)
* The WebGL TileSprite batch now modulates the tilePosition to avoid large values being passed into the UV data, fixing corruption when scrolling TileSprites over a long period of time. Fix #3402 (thanks @vinerz @FrancescoNegri)
* LineCurve.getResolution was missing the `divisions` argument and always returning 1, which made it fail when used as part of a Path. It now defaults to return 1 unless specified otherwise (thanks _ok)
* A Game Object enabled for drag would no longer fire over and out events after being dragged, now it does (thanks @jmcriat)
* Line.getPointA and Line.getPointB incorrectly set the values into the Vector2 (thanks @Tomas2h)
* DynamicTilemapLayer now uses the ComputedSize component, which stops it breaking if you call `setDisplaySize` (thanks Babsobar)
* StaticTilemapLayer now uses the ComputedSize component, which stops it breaking if you call `setDisplaySize` (thanks Babsobar)
* CanvasPool.first always returned `null`, and now returns the first available Canvas. Fix #3520 (thanks @mchiasson)
* When starting a new Scene with an optional `data` argument it wouldn't get passed through if the Scene was not yet available (i.e. the game had not fully booted). The data is now passed to the Scene `init` and `create` methods and stored in the Scene Settings `data` property. Fix #3363 (thanks @pixelhijack)
* Tween.restart handles removed tweens properly and reads them back into the active queue for the TweenManager (thanks @wtravO)
* Tween.resume will now call `Tween.play` on a tween that was paused due to its config object, not as a result of having its paused method called. Fix #3452 (thanks @jazen)
* LoaderPlugin.isReady referenced a constant that no longer exists. Fix #3503 (thanks @Twilrom)
* Tween Timeline.destroy was trying to call `destroy` on Tweens instead of `stop` (thanks @Antriel)
* Calling `setOffset` on a Static Arcade Physics Body would break because the method was missing. It has been added and now functions as expected. Fix #3465 (thanks @josephjaniga and @DouglasLapsley)
* Calling Impact.World.remove(body) during a Body.updateCallback would cause the internal loop to crash when trying to access a now missing body. Two extra checks are in place to avoid this (thanks @iamDecode)
* If `setInteractive` is called on a Game Object that fails to set a hit area, it will no longer try to assign `dropZone` to an undefined `input` property.
* The Matter SetBody Component will no longer try to call `setOrigin` unless the Game Object has the origin component (which not all do, like Graphics and Container)
* Matter Image and Matter Sprite didn't define a `destroy` method, causing an error when trying to destroy the parent Game Object. Fix #3516 (thanks @RollinSafary)

### Updates

* The RTree library (rbush) used by Phaser 3 suffered from violating CSP policies by dynamically creating Functions at run-time in an eval-like manner. These are now defined via generators. Fix #3441 (thanks @jamierocks @Colbydude @jdotrjs)
* BaseSound has had its `rate` and `detune` properties removed as they are always set in the overriding class.
* BaseSound `setRate` and `setDetune` from the 3.4.0 release have moved to the WebAudioSound and HTML5AudioSound classes respectively, as they each handle the values differently.
* The file `InteractiveObject.js` has been renamed to `CreateInteractiveObject.js` to more accurately reflect what it does and to avoid type errors in the docs.
* Renamed the Camera Controls module exports for `Fixed` to `FixedKeyControl` and `Smoothed` to `SmoothedKeyControl` to match the class names. Fix #3463 (thanks @seivan)
* The ComputedSize Component now has `setSize` and `setDisplaySize` methods. This component is used for Game Objects that have a non-texture based size.
* The GamepadManager now extends EventEmitter directly, just like the KeyboardManager does.
* The Gamepad Axis threshold has been increased from 0.05 to 0.1.
* Utils.Array.FindClosestInSorted has a new optional argument `key` which will allow you to scan a top-level property of any object in the given sorted array and get the closest match to it.
* Vector2.setTo is a method alias for Vector2.set allowing it to be used inter-changeably with Geom.Point.
* List.add can now take an array or a single child. If an array is given it's passed over to List.addMultiple.
* List.add has a new optional argument `skipCallback`.
* List.addAt has a new optional argument `skipCallback`.
* List.addMultiple has a new optional argument `skipCallback`.
* List.remove has a new optional argument `skipCallback`.
* List.removeAt has a new optional argument `skipCallback`.
* List.removeBetween has a new optional argument `skipCallback`.
* List.removeAll has a new optional argument `skipCallback`.
* When using the `extend` property of a Scene config object it will now block overwriting the Scene `sys` property.
* When using the `extend` property of a Scene config object, if you define a property called `data` that has an object set, it will populate the Scenes Data Manager with those values.
* SceneManager._processing has been renamed to `isProcessing` which is now a boolean, not an integer. It's also now public and read-only.
* SceneManager.isBooted is a new boolean read-only property that lets you know if the Scene Manager has performed its initial boot sequence.
* TransformMatrix has the following new getter and setters: `a`, `b`, `c`, `d`, `tx` and `ty`. It also has the following new getters: `scaleX`, `scaleY` and `rotation`.
* List.getByKey has been removed. Use `List.getFirst` instead which offers the exact same functionality.
* List.sortIndexHandler has been removed because it's no longer required.
* List.sort no longer takes an array as its argument, instead it only sorts the List contents by the defined property.
* List.addMultiple has been removed. Used `List.add` instead which offers the exact same functionality.
* List is now internally using all of the new Utils.Array functions.
* Rectangle.Union will now cache all vars internally so you can use one of the input rectangles as the output rectangle without corrupting it.
* When shutting down a Matter World it will now call MatterEvents.off, clearing all events, and also `removeAllListeners` for any local events.
* Removed InputPlugin.sortInteractiveObjects because the method isn't used anywhere internally.

### Animation System Updates

We have refactored the Animation API to make it more consistent with the rest of Phaser 3 and to fix some issues. All of the following changes apply to the Animation Component:

* Animation durations, delays and repeatDelays are all now specified in milliseconds, not seconds like before. This makes them consistent with Tweens, Sounds and other parts of v3. You can still use the `frameRate` property to set the speed of an animation in frames per second.
* All of the Animation callbacks have been removed, including `onStart`, `onRepeat`, `onUpdate` and `onComplete` and the corresponding params arrays like `onStartParams` and the property `callbackScope`. The reason for this is that they were all set on a global level, meaning that if you had 100 Sprites sharing the same animation, it was impossible to set the callbacks to fire for just one of those Sprites, but instead they would fire for all 100 and it was up to you to figure out which Sprite you wanted to update. Instead of callbacks animations now dispatch events on the Game Objects in which they are running. This means you can now do `sprite.on('animationstart')` and it will be invoked at the same point the old `onStart` callback would have been. The new events are: `animationstart`, `animtionrepeat`, `animationupdate` and `animationcomplete`. They're all dispatched from the Game Object that has the animation playing, not from the animation itself. This allows you far more control over what happens in the callbacks and we believe generally makes them more useful.
* The AnimationFrame.onUpdate callback has been removed. You can now use the `animationupdate` event dispatched from the Game Object itself and check the 2nd argument, which is the animation frame.
* Animation.stopAfterDelay is a new method that will stop a Sprites animation after the given time in ms.
* Animation.stopOnRepeat is a new method that will stop a Sprites animation when it goes to repeat.
* Animation.stopOnFrame is a new method that will stop a Sprites animation when it sets the given frame.
* Animation.stop no longer has the `dispatchCallbacks` argument, because it dispatches an event which you can choose to ignore.
* `delay` method has been removed.
* `setDelay` allows you to define the delay before playback begins.
* `getDelay` returns the animation playback delay value.
* `delayedPlay` now returns the parent Game Object instead of the component.
* `load` now returns the parent Game Object instead of the component.
* `pause` now returns the parent Game Object instead of the component.
* `resume` now returns the parent Game Object instead of the component.
* `isPaused` returns a boolean indicating the paused state of the animation.
* `paused` method has been removed.
* `play` now returns the parent Game Object instead of the component.
* `progress` method has been removed.
* `getProgress` returns the animation progress value.
* `setProgress` lets you jump the animation to a specific progress point.
* `repeat` method has been removed.
* `getRepeat` returns the animation repeat value.
* `setRepeat` sets the number of times the current animation will repeat.
* `repeatDelay` method has been removed.
* `getRepeatDelay` returns the animation repeat delay value.
* `setRepeatDelay` sets the delay time between each repeat.
* `restart` now returns the parent Game Object instead of the component.
* `stop` now returns the parent Game Object instead of the component.
* `timeScale` method has been removed.
* `getTimeScale` returns the animation time scale value.
* `setTimeScale` sets the time scale value.
* `totalFrames` method has been removed.
* `getTotalFrames` returns the total number of frames in the animation.
* `totalProgres` method has been removed as it did nothing and was mis-spelt.
* `yoyo` method has been removed.
* `getYoyo` returns if the animation will yoyo or not.
* `setYoyo` sets if the animation will yoyo or not.
* `updateFrame` will now call `setSizeToFrame` on the Game Object, which will adjust the Game Objects `width` and `height` properties to match the frame size. Fix #3473 (thanks @wtravO @jp-gc)
* `updateFrame` now supports animation frames with custom pivot points and injects these into the Game Object origin.
* `destroy` now removes events, references to the Animation Manager and parent Game Object, clears the current animation and frame and empties internal arrays.
* Changing the `yoyo` property on an Animation Component would have no effect as it only ever checked the global property, it now checks the local one properly allowing you to specify a `yoyo` on a per Game Object basis.
* Animation.destroy now properly clears the global animation object.
* Animation.getFrameByProgress will return the Animation Frame that is closest to the given progress value. For example, in a 5 frame animation calling this method with a value of 0.5 would return the middle frame.

### Examples, Documentation and TypeScript

My thanks to the following for helping with the Phaser 3 Examples, Docs and TypeScript definitions, either by reporting errors, fixing them or helping author the docs:

@gabegordon @melissaelopez @samid737 @nbs @tgrajewski @pagesrichie @hexus @mbrickn @erd0s @icbat @Matthew-Herman @ampled @mkimmet @PaNaVTEC

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

[get-js]: https://github.com/photonstorm/phaser/releases/download/v3.4.0/phaser.js
[get-minjs]: https://github.com/photonstorm/phaser/releases/download/v3.4.0/phaser.min.js
[clone-http]: https://github.com/photonstorm/phaser.git
[clone-ssh]: git@github.com:photonstorm/phaser.git
[clone-ghwin]: github-windows://openRepo/https://github.com/photonstorm/phaser
[clone-ghmac]: github-mac://openRepo/https://github.com/photonstorm/phaser
[phaser]: https://github.com/photonstorm/phaser
[issues]: https://github.com/photonstorm/phaser/issues
[examples]: https://github.com/photonstorm/phaser3-examples
[contribute]: https://github.com/photonstorm/phaser/blob/master/.github/CONTRIBUTING.md
[forum]: http://www.html5gamedevs.com/forum/14-phaser/
