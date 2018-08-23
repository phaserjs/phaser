/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var BuildGameObject = require('../../../src/gameobjects/BuildGameObject');
var BuildGameObjectAnimation = require('../../../src/gameobjects/BuildGameObjectAnimation');
var Class = require('../../../src/utils/Class');
var GetAdvancedValue = require('../../../src/utils/object/GetAdvancedValue');
var OrthographicCamera = require('./OrthographicCamera');
var PerspectiveCamera = require('./PerspectiveCamera');
var ScenePlugin = require('../../../src/plugins/ScenePlugin');
var Sprite3D = require('./sprite3d/Sprite3D');

/**
 * @classdesc
 * The Camera 3D Plugin adds a new Camera type to Phaser that allows for movement and rendering
 * in 3D space. It displays a special type of Sprite called a Sprite3D that is a billboard sprite,
 * with a z-axis allowing for perspective depth.
 *
 * This is an external plugin which you can include in your game by preloading it:
 *
 * ```javascript
 * this.load.scenePlugin({
 *   key: 'Camera3DPlugin',
 *   url: 'plugins/camera3d.min.js',
 *   sceneKey: 'cameras3d'
 * });
 * ```
 *
 * Once loaded you can create a 3D Camera using the `camera3d` property of a Scene:
 *
 * `var camera = this.cameras3d.add(85).setZ(500).setPixelScale(128);`
 *
 * See the examples for more information.
 *
 * @class Camera3DPlugin
 * @constructor
 *
 * @param {Phaser.Scene} scene - The Scene to which this plugin is being installed.
 * @param {Phaser.Plugins.PluginManager} pluginManager - A reference to the Phaser Plugin Manager.
 */
var Camera3DPlugin = new Class({

    Extends: ScenePlugin,

    initialize:

    function Camera3DPlugin (scene, pluginManager)
    {
        ScenePlugin.call(this, scene, pluginManager);

        /**
         * An Array of the Camera objects being managed by this Camera Manager.
         *
         * @name Camera3DPlugin#cameras
         * @type {Phaser.Cameras.Sprite3D.Camera[]}
         * @since 3.0.0
         */
        this.cameras = [];

        //  Register the Sprite3D Game Object
        pluginManager.registerGameObject('sprite3D', this.sprite3DFactory, this.sprite3DCreator);
    },

    /**
     * Creates a new Sprite3D Game Object and adds it to the Scene.
     *
     * @method Phaser.GameObjects.GameObjectFactory#sprite3D
     * @since 3.0.0
     * 
     * @param {number} x - The horizontal position of this Game Object.
     * @param {number} y - The vertical position of this Game Object.
     * @param {number} z - The z position of this Game Object.
     * @param {string} texture - The key of the Texture this Game Object will use to render with, as stored in the Texture Manager.
     * @param {(string|integer)} [frame] - An optional frame from the Texture this Game Object is rendering with.
     *
     * @return {Phaser.GameObjects.Sprite3D} The Game Object that was created.
     */
    sprite3DFactory: function (x, y, z, key, frame)
    {
        var sprite = new Sprite3D(this.scene, x, y, z, key, frame);

        this.displayList.add(sprite.gameObject);
        this.updateList.add(sprite.gameObject);

        return sprite;
    },

    /**
     * Creates a new Sprite3D Game Object and returns it.
     *
     * @method Phaser.GameObjects.GameObjectCreator#sprite3D
     * @since 3.0.0
     * 
     * @param {object} config - The configuration object this Game Object will use to create itself.
     * @param {boolean} [addToScene] - Add this Game Object to the Scene after creating it? If set this argument overrides the `add` property in the config object.
     *
     * @return {Phaser.GameObjects.Sprite3D} The Game Object that was created.
     */
    sprite3DCreator: function (config, addToScene)
    {
        if (config === undefined) { config = {}; }

        var key = GetAdvancedValue(config, 'key', null);
        var frame = GetAdvancedValue(config, 'frame', null);
    
        var sprite = new Sprite3D(this.scene, 0, 0, key, frame);
    
        if (addToScene !== undefined)
        {
            config.add = addToScene;
        }
    
        BuildGameObject(this.scene, sprite, config);
    
        //  Sprite specific config options:
    
        BuildGameObjectAnimation(sprite, config);
    
        return sprite;
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
     * @method Camera3DPlugin#start
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
     * @method Camera3DPlugin#add
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
     * @method Camera3DPlugin#addOrthographicCamera
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
     * @method Camera3DPlugin#addPerspectiveCamera
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
     * @method Camera3DPlugin#getCamera
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
     * @method Camera3DPlugin#removeCamera
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
     * @method Camera3DPlugin#removeAll
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
     * @method Camera3DPlugin#update
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
     * @method Camera3DPlugin#shutdown
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
     * @method Camera3DPlugin#destroy
     * @private
     * @since 3.0.0
     */
    destroy: function ()
    {
        this.shutdown();

        this.pluginManager = null;
        this.game = null;
        this.scene = null;
        this.systems = null;
    }

});

module.exports = Camera3DPlugin;
