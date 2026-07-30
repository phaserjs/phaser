# Phaser 3.60.0 Change Log

Return to the [Change Log index](CHANGELOG-v3.60.md).

## New Feature - ESM Support

Phaser 3.60 uses the new release of Webpack 5 in order to handle the builds. The configurations have been updated to follow the new format this upgrade introduced. As a bonus, Webpack 5 also bought a new experimental feature called 'output modules', which will take a CommonJS code-base, like Phaser uses and wrap the output in modern ES Module declarations.

We are now using this as part of our build. You will find in the `dist` folder a new `phaser.esm.js` file, which is also linked in from our `package.json` module property. Using this build you can access any of the Phaser modules directly via named imports, meaning you can code like this:

```js
import { AUTO, Scene, Game } from './phaser.esm.js';

class Test extends Scene
{
    constructor ()
    {
        super();
    }

    create ()
    {
        this.add.text(10, 10, 'Welcome to Phaser ESM');
    }
}

const config = {
    type: AUTO,
    width: 800,
    height: 600,
    parent: 'phaser-example',
    scene: [ Test ]
};

const game = new Game(config);
```

Note that we're importing from the local esm bundle. By using this approach you don't need to even use a bundler for quick local prototyping or testing, you can simply import and code directly.

The dist folder still also contains `phaser.js` which, as before, uses a UMD export.

Because the Webpack feature is experimental we won't make the ESM version the default just yet, but if you're curious and want to explore, please go ahead!

---------------------------------------

Return to the [Change Log index](CHANGELOG-v3.60.md).

📖 Read the [Phaser 3 API Docs](https://newdocs.phaser.io/) 💻 Browse 2000+ [Code Examples](https://labs.phaser.io) 🤝 Join the awesome [Phaser Discord](https://discord.gg/phaser)
