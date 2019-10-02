/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Class = require('../../../src/utils/Class');
var OrthographicCamera = require('./OrthographicCamera');
var PerspectiveCamera = require('./PerspectiveCamera');
var PluginCache = require('../../../src/plugins/PluginCache');

/**
 * @classdesc
 * [description]
 *
 * @class CameraManager
 * @memberOf Phaser.Cameras.Sprite3D
 * @constructor
 * @since 3.0.0
 *
 * @param {Phaser.Scene} scene - [description]
 */
var CameraManager = new Class({

    initialize:

    function CameraManager (scene)
    {
        /**
         * [description]
         *
         * @name Phaser.Cameras.Sprite3D.CameraManager#scene
         * @type {Phaser.Scene}
         * @since 3.0.0
         */
        this.scene = scene;

        /**
         * [description]
         *
         * @name Phaser.Cameras.Sprite3D.CameraManager#systems
         * @type {Phaser.Scenes.Systems}
         * @since 3.0.0
         */
        this.systems = scene.sys;

        /**
         * An Array of the Camera objects being managed by this Camera Manager.
         *
         * @name Phaser.Cameras.Sprite3D.CameraManager#cameras
         * @type {Phaser.Cameras.Sprite3D.Camera[]}
         * @since 3.0.0
         */
        this.cameras = [];

        scene.sys.events.once('boot', this.boot, this);
        scene.sys.events.on('start', this.start, this);
    },

    /**
     * This method is called automatically, only once, when the Scene is first created.
     * Do not invoke it directly.
     *
     * @method Phaser.Cameras.Scene3D.CameraManager#boot
     * @private
     * @since 3.5.1
     */
    boot: function ()
    {
        this.systems.events.once('destroy', this.destroy, this);
    },

    /**
     * This method is called automatically by the Scene when it is starting up.
     * It is responsible for creating local systems, properties and listening for Scene events.
     * Do not invoke it directly.
     *
     * @method Phaser.Cameras.Sprite3D.CameraManager#start
     * @private
     * @since 3.5.0
     */
    start: function ()
    {
        var eventEmitter = this.systems.events;

        eventEmitter.on('update', this.update, this);
        eventEmitter.once('shutdown', this.shutdown, this);
    },

    /**
     * [description]
     *
     * @method Phaser.Cameras.Sprite3D.CameraManager#add
     * @since 3.0.0
     *
     * @param {number} [fieldOfView=80] - [description]
     * @param {number} [width] - [description]
     * @param {number} [height] - [description]
     *
     * @return {Phaser.Cameras.Sprite3D.PerspectiveCamera} [description]
     */
    add: function (fieldOfView, width, height)
    {
        return this.addPerspectiveCamera(fieldOfView, width, height);
    },

    /**
     * [description]
     *
     * @method Phaser.Cameras.Sprite3D.CameraManager#addOrthographicCamera
     * @since 3.0.0
     *
     * @param {number} width - [description]
     * @param {number} height - [description]
     *
     * @return {Phaser.Cameras.Sprite3D.OrthographicCamera} [description]
     */
    addOrthographicCamera: function (width, height)
    {
        var config = this.scene.sys.game.config;

        if (width === undefined) { width = config.width; }
        if (height === undefined) { height = config.height; }

        var camera = new OrthographicCamera(this.scene, width, height);

        this.cameras.push(camera);

        return camera;
    },

    /**
     * [description]
     *
     * @method Phaser.Cameras.Sprite3D.CameraManager#addPerspectiveCamera
     * @since 3.0.0
     *
     * @param {number} [fieldOfView=80] - [description]
     * @param {number} [width] - [description]
     * @param {number} [height] - [description]
     *
     * @return {Phaser.Cameras.Sprite3D.PerspectiveCamera} [description]
     */
    addPerspectiveCamera: function (fieldOfView, width, height)
    {
        var config = this.scene.sys.game.config;

        if (fieldOfView === undefined) { fieldOfView = 80; }
        if (width === undefined) { width = config.width; }
        if (height === undefined) { height = config.height; }

        var camera = new PerspectiveCamera(this.scene, fieldOfView, width, height);

        this.cameras.push(camera);

        return camera;
    },

    /**
     * [description]
     *
     * @method Phaser.Cameras.Sprite3D.CameraManager#getCamera
     * @since 3.0.0
     *
     * @param {string} name - [description]
     *
     * @return {(Phaser.Cameras.Sprite3D.OrthographicCamera|Phaser.Cameras.Sprite3D.PerspectiveCamera)} [description]
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
     * @method Phaser.Cameras.Sprite3D.CameraManager#removeCamera
     * @since 3.0.0
     *
     * @param {(Phaser.Cameras.Sprite3D.OrthographicCamera|Phaser.Cameras.Sprite3D.PerspectiveCamera)} camera - [description]
     */
    removeCamera: function (camera)
    {
        var cameraIndex = this.cameras.indexOf(camera);

        if (cameraIndex !== -1)
        {
            this.cameras.splice(cameraIndex, 1);
        }
    },

    /**
     * [description]
     *
     * @method Phaser.Cameras.Sprite3D.CameraManager#removeAll
     * @since 3.0.0
     *
     * @return {(Phaser.Cameras.Sprite3D.OrthographicCamera|Phaser.Cameras.Sprite3D.PerspectiveCamera)} [description]
     */
    removeAll: function ()
    {
        while (this.cameras.length > 0)
        {
            var camera = this.cameras.pop();

            camera.destroy();
        }

        return this.main;
    },

    /**
     * [description]
     *
     * @method Phaser.Cameras.Sprite3D.CameraManager#update
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
     * The Scene that owns this plugin is shutting down.
     * We need to kill and reset all internal properties as well as stop listening to Scene events.
     *
     * @method Phaser.Cameras.Sprite3D.CameraManager#shutdown
     * @private
     * @since 3.0.0
     */
    shutdown: function ()
    {
        var eventEmitter = this.systems.events;

        eventEmitter.off('update', this.update, this);
        eventEmitter.off('shutdown', this.shutdown, this);

        this.removeAll();
    },

    /**
     * The Scene that owns this plugin is being destroyed.
     * We need to shutdown and then kill off all external references.
     *
     * @method Phaser.Cameras.Sprite3D.CameraManager#destroy
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

PluginCache.register('CameraManager3D', CameraManager, 'cameras3d');

module.exports = CameraManager;
