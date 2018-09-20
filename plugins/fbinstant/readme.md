Phaser 3 Facebook Instant Games Plugin
======================================

Starting with version 3.13 Phaser now has a dedicated plugin that provides complete support for Facebook Instant Games.

If you are using the pre-built versions of Phaser then use the file `phaser-facebook-instant-games.js` which you'll find in the `dist` folder.

If you are creating your own builds using Webpack then make sure you enable the plugin using the Webpack DefinePlugin control:

```
"typeof PLUGIN_FBINSTANT": JSON.stringify(true)
```

Building Phaser via Webpack with this set to `true` will include the plugin in the build.

## Using the Plugin

You need to include the Facebook SDK in your html and wait for the `initializeAsync` Promise to resolve before you should create your game instance:

```
<!DOCTYPE html>
<html>
    <head>
        <title>Phaser 3 Facebook Instant Games</title>
        <meta charset="utf-8">
        <script src="https://connect.facebook.net/en_US/fbinstant.6.2.js"></script>
        <script src="lib/phaser-facebook-instant-games.js"></script>
    </head>
    <body>

    FBInstant.initializeAsync().then(function() {

        var config = {
            type: Phaser.AUTO,
            width: window.innerWidth,
            height: window.innerHeight,
            scene: ...
        };

        new Phaser.Game(config);

    });

    </body>
</html>
```

Now, when your game starts, you'll know that the FBInstant API is enabled and ready for use. To access the plugin use `this.facebook` from within any Scene, i.e.:

```
this.add.text(0, 0).setText(this.facebook.playerName);
```

### Preloader

To hook your games preloader into the Facebook Instant Games loader you should use a Preloader Scene like below:

```
class Preloader extends Phaser.Scene {

    constructor ()
    {
        super('Preloader');
    }

    preload ()
    {
        this.facebook.showLoadProgress(this);
        this.facebook.once('startgame', this.startGame, this);

        //  Now load all of your assets
    }

    startGame ()
    {
        this.scene.start('MainMenu');
    }

}
```

In the above Scene it has hooked the Facebook preloader with the Phaser Loader, so every file that loads (once you add some) will make the Facebook loader update. When the load is over it will call the `startGame` function that just changes the Scene to another one.

Please look at the plugin documentation and the Facebook SDK documentation for more details about what features are available.
