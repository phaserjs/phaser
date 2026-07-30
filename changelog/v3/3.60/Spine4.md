# Phaser 3.60.0 Change Log

Return to the [Change Log index](CHANGELOG-v3.60.md).

## New Features - Spine 4 Support

![Spine 4](images/spine4.png)

Thanks to a contribution from @justintien we now have a Spine 4 Plugin available.

You can find it in the `plugins/spine4.1` folder in the main repository. There are also a bunch of new npm scripts to help build this plugin:

`npm run plugin.spine4.1.full.dist` - To build new dist files for both canvas and WebGL.
`npm run plugin.spine4.1.dist` - To build new dist files.
`npm run plugin.spine4.1.watch` - To enter watch mode when doing dev work on the plugin.
`npm run plugin.spine4.1.runtimes` - To build new versions of the Spine 4 runtimes.

The core plugin API remains largely the same. You can find lots of updated examples in the Phaser 3 Examples repo in the `3.60/spine4.1` folder.

We will maintain both the Spine 3 and 4 plugins for the forseeable future.

---------------------------------------

Return to the [Change Log index](CHANGELOG-v3.60.md).

📖 Read the [Phaser 3 API Docs](https://newdocs.phaser.io/) 💻 Browse 2000+ [Code Examples](https://labs.phaser.io) 🤝 Join the awesome [Phaser Discord](https://discord.gg/phaser)
