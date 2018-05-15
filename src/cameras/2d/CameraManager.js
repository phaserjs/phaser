/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Camera = require('./Camera');
var Class = require('../../utils/Class');
var GetFastValue = require('../../utils/object/GetFastValue');
var PluginCache = require('../../plugins/PluginCache');
var RectangleContains = require('../../geom/rectangle/Contains');

/**
 * @typedef {object} InputJSONCameraObject
 *
 * @property {string} [name=''] - [description]
 * @property {integer} [x=0] - [description]
 * @property {integer} [y=0] - [description]
 * @property {integer} [width] - [description]
 * @property {integer} [height] - [description]
 * @property {float} [zoom=1] - [description]
 * @property {float} [rotation=0] - [description]
 * @property {boolean} [roundPixels=false] - [description]
 * @property {float} [scrollX=0] - [description]
 * @property {float} [scrollY=0] - [description]
 * @property {(false|string)} [backgroundColor=false] - [description]
 * @property {?object} [bounds] - [description]
 * @property {number} [bounds.x=0] - [description]
 * @property {number} [bounds.y=0] - [description]
 * @property {number} [bounds.width] - [description]
 * @property {number} [bounds.height] - [description]
 */

/**
 * @classdesc
 * [description]
 *
 * @class CameraManager
 * @memberOf Phaser.Cameras.Scene2D
 * @constructor
 * @since 3.0.0
 *
 * @param {Phaser.Scene} scene - The Scene that owns the Camera Manager plugin.
 */
var CameraManager = new Class({

    initialize:

    function CameraManager (scene)
    {
        /**
         * The Scene that owns the Camera Manager plugin.
         *
         * @name Phaser.Cameras.Scene2D.CameraManager#scene
         * @type {Phaser.Scene}
         * @since 3.0.0
         */
        this.scene = scene;

        /**
         * A reference to the Scene.Systems handler for the Scene that owns the Camera Manager.
         *
         * @name Phaser.Cameras.Scene2D.CameraManager#systems
         * @type {Phaser.Scenes.Systems}
         * @since 3.0.0
         */
        this.systems = scene.sys;

        /**
         * The current Camera ID.
         *
         * @name Phaser.Cameras.Scene2D.CameraManager#currentCameraId
         * @type {number}
         * @default 1
         * @readOnly
         * @since 3.0.0
         */
        this.currentCameraId = 1;

        /**
         * An Array of the Camera objects being managed by this Camera Manager.
         *
         * @name Phaser.Cameras.Scene2D.CameraManager#cameras
         * @type {Phaser.Cameras.Scene2D.Camera[]}
         * @since 3.0.0
         */
        this.cameras = [];

        /**
         * A pool of Camera objects available to be used by the Camera Manager.
         *
         * @name Phaser.Cameras.Scene2D.CameraManager#cameraPool
         * @type {Phaser.Cameras.Scene2D.Camera[]}
         * @since 3.0.0
         */
        this.cameraPool = [];

        /**
         * The default Camera in the Camera Manager.
         *
         * @name Phaser.Cameras.Scene2D.CameraManager#main
         * @type {Phaser.Cameras.Scene2D.Camera}
         * @since 3.0.0
         */
        this.main;

        /**
         * This scale affects all cameras. It's used by Scale Manager.
         *
         * @name Phaser.Cameras.Scene2D.CameraManager#baseScale
         * @type {number}
         * @since 3.0.0
         */
        this.baseScale = 1;

        scene.sys.events.once('boot', this.boot, this);
        scene.sys.events.on('start', this.start, this);
    },

    /**
     * This method is called automatically, only once, when the Scene is first created.
     * Do not invoke it directly.
     *
     * @method Phaser.Cameras.Scene2D.CameraManager#boot
     * @private
     * @since 3.5.1
     */
    boot: function ()
    {
        var sys = this.systems;

        if (sys.settings.cameras)
        {
            //  We have cameras to create
            this.fromJSON(sys.settings.cameras);
        }
        else
        {
            //  Make one
            this.add();
        }

        this.main = this.cameras[0];

        this.systems.events.once('destroy', this.destroy, this);
    },

    /**
     * This method is called automatically by the Scene when it is starting up.
     * It is responsible for creating local systems, properties and listening for Scene events.
     * Do not invoke it directly.
     *
     * @method Phaser.Cameras.Scene2D.CameraManager#start
     * @private
     * @since 3.5.0
     */
    start: function ()
    {
        if (!this.main)
        {
            this.boot();
        }

        var eventEmitter = this.systems.events;

        eventEmitter.on('update', this.update, this);
        eventEmitter.once('shutdown', this.shutdown, this);
    },

    /**
     * [description]
     *
     * @method Phaser.Cameras.Scene2D.CameraManager#add
     * @since 3.0.0
     *
     * @param {number} [x=0] - [description]
     * @param {number} [y=0] - [description]
     * @param {number} [width] - [description]
     * @param {number} [height] - [description]
     * @param {boolean} [makeMain=false] - [description]
     * @param {string} [name=''] - [description]
     *
     * @return {Phaser.Cameras.Scene2D.Camera} [description]
     */
    add: function (x, y, width, height, makeMain, name)
    {
        if (x === undefined) { x = 0; }
        if (y === undefined) { y = 0; }
        if (width === undefined) { width = this.scene.sys.game.config.width; }
        if (height === undefined) { height = this.scene.sys.game.config.height; }
        if (makeMain === undefined) { makeMain = false; }
        if (name === undefined) { name = ''; }

        var camera = null;

        if (this.cameraPool.length > 0)
        {
            camera = this.cameraPool.pop();

            camera.setViewport(x, y, width, height);
        }
        else
        {
            camera = new Camera(x, y, width, height);
        }

        camera.setName(name);
        camera.setScene(this.scene);

        this.cameras.push(camera);

        if (makeMain)
        {
            this.main = camera;
        }

        camera._id = this.currentCameraId;

        this.currentCameraId = this.currentCameraId << 1;

        return camera;
    },

    /**
     * [description]
     *
     * @method Phaser.Cameras.Scene2D.CameraManager#addExisting
     * @since 3.0.0
     *
     * @param {Phaser.Cameras.Scene2D.Camera} camera - [description]
     *
     * @return {Phaser.Cameras.Scene2D.Camera} [description]
     */
    addExisting: function (camera)
    {
        var index = this.cameras.indexOf(camera);
        var poolIndex = this.cameraPool.indexOf(camera);

        if (index < 0 && poolIndex >= 0)
        {
            this.cameras.push(camera);
            this.cameraPool.slice(poolIndex, 1);
            return camera;
        }

        return null;
    },

    /**
     * [description]
     *
     * @method Phaser.Cameras.Scene2D.CameraManager#fromJSON
     * @since 3.0.0
     *
     * @param {(InputJSONCameraObject|InputJSONCameraObject[])} config - [description]
     *
     * @return {Phaser.Cameras.Scene2D.CameraManager} [description]
     */
    fromJSON: function (config)
    {
        if (!Array.isArray(config))
        {
            config = [ config ];
        }

        var gameWidth = this.scene.sys.game.config.width;
        var gameHeight = this.scene.sys.game.config.height;

        for (var i = 0; i < config.length; i++)
        {
            var cameraConfig = config[i];

            var x = GetFastValue(cameraConfig, 'x', 0);
            var y = GetFastValue(cameraConfig, 'y', 0);
            var width = GetFastValue(cameraConfig, 'width', gameWidth);
            var height = GetFastValue(cameraConfig, 'height', gameHeight);

            var camera = this.add(x, y, width, height);

            //  Direct properties
            camera.name = GetFastValue(cameraConfig, 'name', '');
            camera.zoom = GetFastValue(cameraConfig, 'zoom', 1);
            camera.rotation = GetFastValue(cameraConfig, 'rotation', 0);
            camera.scrollX = GetFastValue(cameraConfig, 'scrollX', 0);
            camera.scrollY = GetFastValue(cameraConfig, 'scrollY', 0);
            camera.roundPixels = GetFastValue(cameraConfig, 'roundPixels', false);

            // Background Color

            var backgroundColor = GetFastValue(cameraConfig, 'backgroundColor', false);

            if (backgroundColor)
            {
                camera.setBackgroundColor(backgroundColor);
            }

            //  Bounds

            var boundsConfig = GetFastValue(cameraConfig, 'bounds', null);

            if (boundsConfig)
            {
                var bx = GetFastValue(boundsConfig, 'x', 0);
                var by = GetFastValue(boundsConfig, 'y', 0);
                var bwidth = GetFastValue(boundsConfig, 'width', gameWidth);
                var bheight = GetFastValue(boundsConfig, 'height', gameHeight);

                camera.setBounds(bx, by, bwidth, bheight);
            }
        }

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.Cameras.Scene2D.CameraManager#getCamera
     * @since 3.0.0
     *
     * @param {string} name - [description]
     *
     * @return {Phaser.Cameras.Scene2D.Camera} [description]
     */
    getCamera: function (name)
    {
        for (var i = 0; i < this.cameras.length; i++)
        {
            if (this.cameras[i].name === name)
            {
                return this.cameras[i];
            }
        }

        return null;
    },

    /**
     * [description]
     *
     * @method Phaser.Cameras.Scene2D.CameraManager#getCameraBelowPointer
     * @since 3.0.0
     *
     * @param {Phaser.Input.Pointer} pointer - [description]
     *
     * @return {Phaser.Cameras.Scene2D.Camera} [description]
     */
    getCameraBelowPointer: function (pointer)
    {
        var cameras = this.cameras;

        //  Start from the most recently added camera (the 'top' camera)
        for (var i = cameras.length - 1; i >= 0; i--)
        {
            var camera = cameras[i];

            if (camera.inputEnabled && RectangleContains(camera, pointer.x, pointer.y))
            {
                return camera;
            }
        }
    },

    /**
     * [description]
     *
     * @method Phaser.Cameras.Scene2D.CameraManager#remove
     * @since 3.0.0
     *
     * @param {Phaser.Cameras.Scene2D.Camera} camera - [description]
     */
    remove: function (camera)
    {
        var cameraIndex = this.cameras.indexOf(camera);

        if (cameraIndex >= 0 && this.cameras.length > 1)
        {
            this.cameraPool.push(this.cameras[cameraIndex]);
            this.cameras.splice(cameraIndex, 1);

            if (this.main === camera)
            {
                this.main = this.cameras[0];
            }
        }
    },

    /**
     * [description]
     *
     * @method Phaser.Cameras.Scene2D.CameraManager#render
     * @since 3.0.0
     *
     * @param {(Phaser.Renderer.Canvas.CanvasRenderer|Phaser.Renderer.WebGL.WebGLRenderer)} renderer - The Renderer that will render the children to this camera.
     * @param {Phaser.GameObjects.GameObject[]} children - An array of renderable Game Objects.
     * @param {number} interpolation - Interpolation value. Reserved for future use.
     */
    render: function (renderer, children, interpolation)
    {
        var cameras = this.cameras;
        var baseScale = this.baseScale;

        for (var i = 0, l = cameras.length; i < l; ++i)
        {
            var camera = cameras[i];

            camera.preRender(baseScale, renderer.config.resolution);

            renderer.render(this.scene, children, interpolation, camera);
        }
    },

    /**
     * [description]
     *
     * @method Phaser.Cameras.Scene2D.CameraManager#resetAll
     * @since 3.0.0
     *
     * @return {Phaser.Cameras.Scene2D.Camera} [description]
     */
    resetAll: function ()
    {
        while (this.cameras.length > 0)
        {
            this.cameraPool.push(this.cameras.pop());
        }

        this.main = this.add();

        return this.main;
    },

    /**
     * [description]
     *
     * @method Phaser.Cameras.Scene2D.CameraManager#update
     * @since 3.0.0
     *
     * @param {number} timestep - [description]
     * @param {number} delta - [description]
     */
    update: function (timestep, delta)
    {
        for (var i = 0, l = this.cameras.length; i < l; ++i)
        {
            this.cameras[i].update(timestep, delta);
        }
    },

    /**
     * Resizes all cameras to the given dimensions.
     *
     * @method Phaser.Cameras.Scene2D.CameraManager#resize
     * @since 3.2.0
     *
     * @param {number} width - The new width of the camera.
     * @param {number} height - The new height of the camera.
     */
    resize: function (width, height)
    {
        for (var i = 0, l = this.cameras.length; i < l; ++i)
        {
            this.cameras[i].setSize(width, height);
        }
    },

    /**
     * The Scene that owns this plugin is shutting down.
     * We need to kill and reset all internal properties as well as stop listening to Scene events.
     *
     * @method Phaser.Cameras.Scene2D.CameraManager#shutdown
     * @private
     * @since 3.0.0
     */
    shutdown: function ()
    {
        this.main = undefined;

        for (var i = 0; i < this.cameras.length; i++)
        {
            this.cameras[i].destroy();
        }

        for (i = 0; i < this.cameraPool.length; i++)
        {
            this.cameraPool[i].destroy();
        }

        this.cameras = [];
        this.cameraPool = [];

        var eventEmitter = this.systems.events;

        eventEmitter.off('update', this.update, this);
        eventEmitter.off('shutdown', this.shutdown, this);
    },

    /**
     * The Scene that owns this plugin is being destroyed.
     * We need to shutdown and then kill off all external references.
     *
     * @method Phaser.Cameras.Scene2D.CameraManager#destroy
     * @private
     * @since 3.0.0
     */
    destroy: function ()
    {
        this.shutdown();

        this.scene.sys.events.off('start', this.start, this);

        this.scene = null;
        this.systems = null;
    }

});

PluginCache.register('CameraManager', CameraManager, 'cameras');

module.exports = CameraManager;
