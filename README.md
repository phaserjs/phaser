# Phaser - HTML5 Game Framework

![Phaser Header](https://phaser.io/images/github/300/phaser-header.png "Phaser 3 Header Banner")

Phaser is a fast, free, and fun open source HTML5 game framework. It offers WebGL and Canvas rendering across desktop and mobile web browsers. Games can be compiled to iOS, Android and native apps via 3rd party tools. You can use JavaScript or TypeScript for development.

Phaser is available in two versions: Phaser 3 and [Phaser CE - The Community Edition](https://github.com/photonstorm/phaser-ce). Phaser CE is a community-lead continuation of the Phaser 2 codebase and is hosted on its own repo. Phaser 3 is the next generation of Phaser.

Along with the fantastic open source community, Phaser is actively developed and maintained by [Photon Storm](http://www.photonstorm.com). As a result of rapid support, and a developer friendly API, Phaser is currently one of the [most starred](https://github.com/collections/javascript-game-engines) game frameworks on GitHub.

Thousands of developers worldwide use Phaser. From indies and multi-national digital agencies, to schools and Universities. Each creating their own incredible [games](https://phaser.io/games/).

**Visit:** The [Phaser website](https://phaser.io) and follow on [Twitter](https://twitter.com/phaser_) (#phaserjs)<br />
**Learn:** [API Docs](https://github.com/photonstorm/phaser3-docs), [Support Forum][forum] and [StackOverflow](https://stackoverflow.com/questions/tagged/phaser-framework)<br />
**Code:** 700+ [Examples](https://labs.phaser.io) (source available in this [repo][examples])<br />
**Read:** Weekly [Phaser World](#newsletter) Newsletter<br />
**Chat:** [Slack](https://phaser.io/community/slack) and [Discord](https://phaser.io/community/discord)<br />
**Extend:** With [Phaser Plugins](https://phaser.io/shop/plugins)<br />
**Be awesome:** [Support](#support) the future of Phaser<br />

Grab the source and join in the fun!

![What's New](https://phaser.io/images/github/div-whats-new.png "What's New")

<div align="center"><img src="https://phaser.io/images/github/news.jpg"></div>

> 23rd February 2018

**Updated:** Thank you for the continued amazing response to the 3.0.0 release! We've carried on working hard and now prepared 3.1.2 for you, which is available today. Check out the [Change Log](#changelog) for more details.

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

Every Monday we publish the [Phaser World](https://phaser.io/community/newsletter) newsletter. It's packed full of the latest Phaser games, tutorials, videos, meet-ups, talks, and more. It also contains our weekly Development Progress updates, where you can read about what new features we've been working on.

Over 100 previous editions can found on our [Back Issues](http://phaser.io/community/backissues) page.

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

[Phaser is on jsDelivr](http://www.jsdelivr.com/projects/phaser), a "super-fast CDN for developers". Include the following in your html:

```html
<script src="//cdn.jsdelivr.net/npm/phaser@3.1.2/dist/phaser.js"></script>
```

or the minified version:

```html
<script src="//cdn.jsdelivr.net/npm/phaser@3.1.2/dist/phaser.min.js"></script>
```

### License

Phaser is released under the [MIT License](https://opensource.org/licenses/MIT).

![Getting Started](https://phaser.io/images/github/div-getting-started.png "Getting Started")
<a name="getting-started"></a>

<img src="https://phaser.io/images/github/learn.jpg" align="right">

Phaser 3 is so brand new the paint is still wet, but tutorials and guides are starting to come out!

* [Getting Started with Phaser 3](https://phaser.io/tutorials/getting-started-phaser3) (useful if you are completely new to Phaser)
* [Making your first Phaser 3 Game](https://phaser.io/tutorials/making-your-first-phaser-3-game)
* [Phaser 3 Bootstrap and Platformer Example](https://phaser.io/news/2018/02/phaser-3-bootstrap-platformer)

Also, please subscribe to the [Phaser World](https://phaser.io/community/newsletter) newsletter for details about new tutorials as they are published.

### Source Code Examples

During our development of Phaser 3 we created hundreds of examples, with the full source code and assets available. Until those are fully integrated with the Phaser web site, you'll have to browse them in the [Phaser 3 Labs](http://labs.phaser.io), or clone the [examples repo][examples]. Note: Not all examples work, sorry! We're tidying them up as fast as we can.

### Create Your First Phaser 3 Example

Create an `index.html` page locally and paste the following code into it:

```html
<!DOCTYPE html>
<html>
<head>
    <script src="http://labs.phaser.io/build/phaser-arcade-physics.min.js"></script> 
</head>
<body>

    <script></script>

</body>
</html>
```

This is a standard empty web page. You'll notice it's pulling in a build of Phaser 3 in the script tag, but otherwise doesn't do anything yet. Now let's set-up the game config. Paste the following between the `<script></script>` tags:

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

This is a pretty standard Phaser 3 Game Configuration object. We'll tell it to use the WebGL renderer if it can, set the canvas to a size of 800x600 pixels, enable Arcade Physics and finally call the `preload` and `create` functions. These don't exist yet, so if you run this it will just error. So add the following after the config object:

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

This creates a Phaser Game instance, using our configuration object. It also provides the two functions it needs. The `preload` function is a way to easily load assets into your game. Here we'll set the Base URL to be the Phaser server and grab down 3 PNG files.

The create function is empty, so it's time to fill it in:

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

Here we're adding the sky image into the game. Over the top of this we have created a Particle Emitter. The `scale` value means the particles will start large and then scale away to nothing over the duration of their lifespan.

Then we add the logo image. Notice how this is a Physics Image, which means it is given a physics body by default. We set some properties on it: velocity, bounce (or restitution) and collision with the world bounds. This will make our logo bounce around the screen. Finally, we tell the particle emitter to follow the logo - so as it moves, the particles will flow from it.

Run it in your browser and you'll see the following:

![Phaser 3 Demo](https://phaser.io/images/github/300/sample1.png "Phaser 3 Demo")

(Got an error? Here's the [full code](https://gist.github.com/photonstorm/46cb8fb4b19fc7717dcad514cdcec064))

It's just a tiny example, and we've hundreds more for you to explore, but hopefully it shows how expressive and quick Phaser is to use. With just a few easily readable lines of code we've got something pretty impressive up on screen!

Subscribe to our weekly newsletter for further tutorials and examples.

![Building Phaser](https://phaser.io/images/github/div-building-phaser.png "Building Phaser")

Phaser is provided ready compiled in the `dist` folder of the repository. There are both plain and minified versions. The plain version is for use during development, and the minified version for production. You can also create your own builds.

### Custom Builds

Phaser 3 has to be built using Webpack. We take advantage of a number of Webpack features and plugins to allow us to properly tailor the build process. You can also elect exactly which features are bundled into your version of Phaser. We will release a tutorial covering the process shortly, but for now please look at our webpack config files to get an idea of the settings required.

### Building from source

Should you wish to build Phaser 3 from source ensure you have the required packages by cloning the repository and then running `npm install`.

You can then run `webpack` to perform a dev build to the `build` folder, including source maps for local testing, or run `npm run dist` to create a minified packaged build into the `dist` folder.

![Change Log](https://phaser.io/images/github/div-change-log.png "Change Log")
<a name="changelog"></a>

## Version 3.1.2 - 23rd February 2018

### Updates

* Hundreds of JSDoc fixes across the whole API.
* Tween.updateTweenData will now check to see if the Tween target still exists before trying to update its properties.
* If you try to use a local data URI in the Loader it now console warns instead of logs (thanks @samme)

### Bug Fixes

* The KeyCode `FORWAD_SLASH` had a typo and has been changed to `FORWAD_SLASH`. Fix #3271 (thanks @josedarioxyz)
* Fixed issue with vertex buffer creation on Static Tilemap Layer, causing tilemap layers to appear black. Fix #3266 (thanks @akleemans)
* Implemented Static Tilemap Layer scaling and Tile alpha support.
* Fixed issue with null texture on Particle Emitter batch generation. This would manifest if you had particles with blend modes on-top of other images not appearing.
* Added missing data parameter to ScenePlugin. Fixes #3810 (thanks @AleBles)

Please see the complete [Change Log]((https://github.com/photonstorm/phaser/blob/master/CHANGELOG.md)) for previous releases.

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

[get-js]: https://github.com/photonstorm/phaser/releases/download/v3.1.2/phaser.js
[get-minjs]: https://github.com/photonstorm/phaser/releases/download/v3.1.2/phaser.min.js
[clone-http]: https://github.com/photonstorm/phaser.git
[clone-ssh]: git@github.com:photonstorm/phaser.git
[clone-ghwin]: github-windows://openRepo/https://github.com/photonstorm/phaser
[clone-ghmac]: github-mac://openRepo/https://github.com/photonstorm/phaser
[phaser]: https://github.com/photonstorm/phaser
[issues]: https://github.com/photonstorm/phaser/issues
[examples]: https://github.com/photonstorm/phaser3-examples
[contribute]: https://github.com/photonstorm/phaser/blob/master/.github/CONTRIBUTING.md
[forum]: http://www.html5gamedevs.com/forum/14-phaser/
