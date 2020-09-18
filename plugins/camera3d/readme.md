Phaser 3 Camera 3D Plugin
=========================

Note: As of 26th August 2020 this plugin is now considered deprecated and will not be supported any further. It has been fixed to work with the Phaser 3.50 release, but will not be updated beyond this. You're free to use it as you see fit, but please do not open issues about it on GitHub, thank you.

In Phaser 3.12 Camera 3D support was moved to its own external plugin.

There are two ways to use this in your games:

## 1. External Plugin

You can copy the `dist/camera3d.min.js` file to your project folder and preload it into Phaser:

```
function preload ()
{
    this.load.scenePlugin('Camera3DPlugin', 'plugins/camera3d.min.js', 'Camera3DPlugin', 'cameras3d');
}
```

Then you can use it like usual.

## 2. Bundled Plugin

If you prefer you can configure Phaser to include it when it builds its dist files.

To do this you need to edit the webpack config files and change the following:

```
"typeof PLUGIN_CAMERA3D": JSON.stringify(false)
```

to

```
"typeof PLUGIN_CAMERA3D": JSON.stringify(true)
```

Then rebuild Phaser via webpack. The plugin will now be included by default and can be called from your game code.

## Using the Plugin

Here is a basic example of using the plugin. You can find many more in the Phaser 3 Examples repo in the [cameras/3D Camera](https://github.com/photonstorm/phaser3-examples/tree/master/public/src/camera/3D%20camera) folder.

```
var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var camera;
var transform;

var game = new Phaser.Game(config);

function preload ()
{
    this.load.scenePlugin('Camera3DPlugin', 'plugins/camera3d.min.js', 'Camera3DPlugin', 'cameras3d');

    this.load.image('particle', 'assets/sprites/mushroom2.png');
}

function create ()
{
    camera = this.cameras3d.add(85).setZ(300).setPixelScale(128);

    var sprites = camera.createRect({ x: 4, y: 4, z: 16 }, { x: 48, y: 48, z: 32 }, 'particle');

    //  Our rotation matrix
    transform = new Phaser.Math.Matrix4().rotateX(-0.01).rotateY(-0.02).rotateZ(0.01);
}

function update ()
{
    camera.transformChildren(transform);
}
```

## Building the External Plugin

If you wish to edit the plugin use the following files:

`src/Camera3DPlugin.js` is the entry point for the external plugin. Edit this file if you're loading the plugin at run-time. Once you have finished making your changes, run the command `npm run plugin.cam3d` from the command-line to build a new version of the external plugin with Webpack.

## Changing the Bundled Plugin

`src/index.js` is the entry point for the bundled plugin. In here you'll find the module exports that Phaser uses when including the plugin internally. The file `CameraManager.js` is the Scene System. All other files are shared between both the external and bundled versions of the plugin.
