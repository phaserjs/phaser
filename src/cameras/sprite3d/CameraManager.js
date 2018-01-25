var Class = require('../../utils/Class');
var GetFastValue = require('../../utils/object/GetFastValue');
var OrthographicCamera = require('./OrthographicCamera');
var PerspectiveCamera = require('./PerspectiveCamera');
var PluginManager = require('../../plugins/PluginManager');

//  Phaser.Cameras.Sprite3D.CameraManager

var CameraManager = new Class({

    initialize:

    /**
     * [description]
     *
     * @class CameraManager
     * @memberOf Phaser.Cameras.Sprite3D
     * @constructor
     * @since 3.0.0
     *
     * @param {Phaser.Scene} scene - [description]
     */
    function CameraManager (scene)
    {
        /**
         * [description]
         *
         * @property {Phaser.Scene} scene
         * @since 3.0.0
         */
        this.scene = scene;

        /**
         * [description]
         *
         * @property {[type]} systems
         * @since 3.0.0
         */
        this.systems = scene.sys;

        if (!scene.sys.settings.isBooted)
        {
            scene.sys.events.once('boot', this.boot, this);
        }
    },

    /**
     * [description]
     *
     * @method Phaser.Cameras.Sprite3D.CameraManager#boot
     * @since 3.0.0
     */
    boot: function ()
    {
        var eventEmitter = this.systems.events;

        eventEmitter.on('update', this.update, this);
        eventEmitter.on('shutdown', this.shutdown, this);
        eventEmitter.on('destroy', this.destroy, this);
    },

    /**
     * [description]
     *
     * @method Phaser.Cameras.Sprite3D.CameraManager#add
     * @since 3.0.0
     *
     * @param {[type]} fieldOfView - [description]
     * @param {[type]} width - [description]
     * @param {[type]} height - [description]
     *
     * @return {[type]} [description]
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
     * @param {[type]} width - [description]
     * @param {[type]} height - [description]
     *
     * @return {[type]} [description]
     */
    addOrthographicCamera: function (width, height)
    {
        var config = this.scene.sys.game.config;

        if (width === undefined) { width = config.width; }
        if (height === undefined) { height = config.height; }

        var camera = new OrthographicCamera(this.scene, width, height);

        return camera;
    },

    /**
     * [description]
     *
     * @method Phaser.Cameras.Sprite3D.CameraManager#addPerspectiveCamera
     * @since 3.0.0
     *
     * @param {[type]} fieldOfView - [description]
     * @param {[type]} width - [description]
     * @param {[type]} height - [description]
     *
     * @return {[type]} [description]
     */
    addPerspectiveCamera: function (fieldOfView, width, height)
    {
        var config = this.scene.sys.game.config;

        if (fieldOfView === undefined) { fieldOfView = 80; }
        if (width === undefined) { width = config.width; }
        if (height === undefined) { height = config.height; }

        var camera = new PerspectiveCamera(this.scene, fieldOfView, width, height);

        return camera;
    },

    /**
     * [description]
     *
     * @method Phaser.Cameras.Sprite3D.CameraManager#destroy
     * @since 3.0.0
     */
    destroy: function ()
    {
        this.scene = undefined;
    },

    /**
     * [description]
     *
     * @method Phaser.Cameras.Sprite3D.CameraManager#getCamera
     * @since 3.0.0
     *
     * @param {[type]} name - [description]
     *
     * @return {[type]} [description]
     */
    getCamera: function (name)
    {
        this.cameras.forEach(function (camera)
        {
            if (camera.name === name)
            {
                return camera;
            }
        });

        return null;
    },

    /**
     * [description]
     *
     * @method Phaser.Cameras.Sprite3D.CameraManager#removeCamera
     * @since 3.0.0
     *
     * @param {[type]} camera - [description]
     */
    removeCamera: function (camera)
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
     * @method Phaser.Cameras.Sprite3D.CameraManager#render
     * @since 3.0.0
     *
     * @param {[type]} renderer - [description]
     * @param {[type]} children - [description]
     * @param {[type]} interpolation - [description]
     */
    render: function (renderer, children, interpolation)
    {
        var cameras = this.cameras;

        for (var i = 0, l = cameras.length; i < l; ++i)
        {
            var camera = cameras[i];

            camera.preRender();

            renderer.render(this.scene, children, interpolation, camera);
        }
    },

    /**
     * [description]
     *
     * @method Phaser.Cameras.Sprite3D.CameraManager#resetAll
     * @since 3.0.0
     *
     * @return {[type]} [description]
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
     * @method Phaser.Cameras.Sprite3D.CameraManager#update
     * @since 3.0.0
     *
     * @param {[type]} timestep - [description]
     * @param {[type]} delta - [description]
     */
    update: function (timestep, delta)
    {
        for (var i = 0, l = this.cameras.length; i < l; ++i)
        {
            this.cameras[i].update(timestep, delta);
        }
    },

    /**
     * [description]
     *
     * @method Phaser.Cameras.Sprite3D.CameraManager#shutdown
     * @since 3.0.0
     */
    shutdown: function ()
    {
    }

});

PluginManager.register('CameraManager3D', CameraManager, 'cameras3d');

module.exports = CameraManager;
