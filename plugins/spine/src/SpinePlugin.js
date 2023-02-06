/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2022 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var BuildGameObject = require('../../../src/gameobjects/BuildGameObject');
var Class = require('../../../src/utils/Class');
var GetValue = require('../../../src/utils/object/GetValue');
var ResizeEvent = require('../../../src/scale/events/RESIZE_EVENT');
var ScenePlugin = require('../../../src/plugins/ScenePlugin');
var Spine = require('Spine');
var SpineFile = require('./SpineFile');
var SpineGameObject = require('./gameobject/SpineGameObject');
var SpineContainer = require('./container/SpineContainer');
var NOOP = require('../../../src/utils/NOOP');

/**
 * @classdesc
 * The Spine Plugin is a Scene based plugin that handles the creation and rendering of Spine Game Objects.
 *
 * Find more details about Spine itself at http://esotericsoftware.com/.
 *
 * All rendering and object creation is handled via the official Spine Runtimes. This version of the plugin
 * uses the Spine 3.8.95 runtimes. Please note that due to the way the Spine runtimes use semver, you will
 * get breaking changes in point-releases. Therefore, files created in a different version of Spine may not
 * work as a result, without you first updating the runtimes and rebuilding the plugin.
 *
 * Esoteric themselves recommend that you freeze your Spine editor version against the runtime versions.
 * You can find more information about this here: http://esotericsoftware.com/spine-settings#Version
 *
 * Please note that you require a Spine license in order to use Spine Runtimes in your games.
 *
 * You can install this plugin into your Phaser game by either importing it, if you're using ES6:
 *
 * ```javascript
 * import * as SpinePlugin from './SpinePlugin.js';
 * ```
 *
 * and then adding it to your Phaser Game configuration:
 *
 * ```javascript
 * plugins: {
 *     scene: [
 *         { key: 'SpinePlugin', plugin: window.SpinePlugin, mapping: 'spine' }
 *     ]
 * }
 * ```
 *
 * If you're using ES5 then you can load the Spine Plugin in a Scene files payload, _within_ your
 * Game Configuration object, like this:
 *
 * ```javascript
 * scene: {
 *     preload: preload,
 *     create: create,
 *     pack: {
 *         files: [
 *             { type: 'scenePlugin', key: 'SpinePlugin', url: 'plugins/SpinePlugin.js', sceneKey: 'spine' }
 *         ]
 *     }
 * }
 * ```
 *
 * Loading it like this allows you to then use commands such as `this.load.spine` from within the
 * same Scene. Alternatively, you can use the method `this.load.plugin` to load the plugin via the normal
 * Phaser Loader. However, doing so will not add it to the current Scene. It will be available from any
 * subsequent Scenes.
 *
 * ## A note about inlined data:
 *
 * If you need to load Spine assets from inline / base64 encoded data, then you should not use the Loader
 * at all. Instead, call the functions directly as required:
 *
 * scene.cache.json.add
 * scene.cache.custom.spine.add
 * scene.textures.addBase64
 *
 * ## Using the plugin
 *
 * Assuming a default environment you access it from within a Scene by using the `this.spine` reference.
 *
 * When this plugin is installed into a Scene it will add a Loader File Type, allowing you to load
 * Spine files directly, i.e.:
 *
 * ```javascript
 * this.load.spine('stretchyman', 'stretchyman-pro.json', [ 'stretchyman-pma.atlas' ], true);
 * ```
 *
 * It also installs two Game Object Factory methods, allowing you to create Spine Game Objects
 * and Spine Containers:
 *
 * ```javascript
 * const man = this.add.spine(512, 650, 'stretchyman');
 *
 * const container = this.add.spineContainer();
 *
 * container.add(man);
 * ```
 *
 * The first argument is the key which you used when importing the Spine data. There are lots of
 * things you can specify, such as the animation name, skeleton, slot attachments and more. Please
 * see the respective documentation and examples for further details.
 *
 * Phaser expects the Spine data to be exported from the Spine application in a JSON format, not binary.
 * The associated atlas files are scanned for any texture files present in them, which are then loaded.
 * If you have exported your Spine data with preMultipliedAlpha set, then you should enable this in the
 * load arguments, or you may see black outlines around skeleton textures.
 *
 * The Spine plugin is local to the Scene in which it is installed. This means a change to something,
 * such as the Skeleton Debug Renderer, in this Scene, will not impact the renderer in any other Scene.
 * The only exception to this is with the caches this plugin creates. Spine atlas and texture data are
 * stored in their own caches, which are global, meaning they're accessible from any Scene in your
 * game, regardless if the Scene loaded the Spine data or not.
 *
 * When destroying a Phaser Game instance, if you need to re-create it again on the same page without
 * reloading, you must remember to remove the Spine Plugin as part of your tear-down process:
 *
 * ```javascript
 * this.plugins.removeScenePlugin('SpinePlugin');
 * ```
 *
 * For details about the Spine Runtime API see http://esotericsoftware.com/spine-api-reference
 *
 * @class SpinePlugin
 * @extends Phaser.Plugins.ScenePlugin
 * @constructor
 * @since 3.19.0
 *
 * @param {Phaser.Scene} scene - A reference to the Scene that has installed this plugin.
 * @param {Phaser.Plugins.PluginManager} pluginManager - A reference to the Phaser Plugin Manager.
 * @param {string} pluginKey - The key under which this plugin has been installed into the Scene Systems.
 */
var SpinePlugin = new Class({

    Extends: ScenePlugin,

    initialize:

    function SpinePlugin (scene, pluginManager, pluginKey)
    {
        ScenePlugin.call(this, scene, pluginManager, pluginKey);

        var game = pluginManager.game;

        /**
         * A read-only flag that indicates if the game is running under WebGL or Canvas.
         *
         * @name SpinePlugin#isWebGL
         * @type {boolean}
         * @readonly
         * @since 3.19.0
         */
        this.isWebGL = (game.config.renderType === 2);

        /**
         * A custom cache that stores the Spine atlas data.
         *
         * This cache is global across your game, allowing you to access Spine data loaded from other Scenes,
         * no matter which Scene you are in.
         *
         * @name SpinePlugin#cache
         * @type {Phaser.Cache.BaseCache}
         * @since 3.19.0
         */
        this.cache = game.cache.addCustom('spine');

        /**
         * A custom cache that stores the Spine Textures.
         *
         * This cache is global across your game, allowing you to access Spine data loaded from other Scenes,
         * no matter which Scene you are in.
         *
         * @name SpinePlugin#spineTextures
         * @type {Phaser.Cache.BaseCache}
         * @since 3.19.0
         */
        this.spineTextures = game.cache.addCustom('spineTextures');

        /**
         * A reference to the global JSON Cache.
         *
         * @name SpinePlugin#json
         * @type {Phaser.Cache.BaseCache}
         * @since 3.19.0
         */
        this.json = game.cache.json;

        /**
         * A reference to the global Texture Manager.
         *
         * @name SpinePlugin#textures
         * @type {Phaser.Textures.TextureManager}
         * @since 3.19.0
         */
        this.textures = game.textures;

        /**
         * A flag that sets if the Skeleton Renderers will render debug information over the top
         * of the skeleton or not.
         *
         * @name SpinePlugin#drawDebug
         * @type {boolean}
         * @since 3.19.0
         */
        this.drawDebug = false;

        /**
         * The underlying WebGL context of the Phaser renderer.
         *
         * Only set if running in WebGL mode.
         *
         * @name SpinePlugin#gl
         * @type {WebGLRenderingContext}
         * @since 3.19.0
         */
        this.gl;

        /**
         * A reference to either the Canvas or WebGL Renderer that this Game is using.
         *
         * @name SpinePlugin#renderer
         * @type {(Phaser.Renderer.Canvas.CanvasRenderer|Phaser.Renderer.WebGL.WebGLRenderer)}
         * @since 3.19.0
         */
        this.renderer;

        /**
         * An instance of the Spine WebGL Scene Renderer.
         *
         * There is only one instance of the Scene Renderer shared across the whole plugin.
         *
         * Only set if running in WebGL mode.
         *
         * @name SpinePlugin#sceneRenderer
         * @type {spine.webgl.SceneRenderer}
         * @since 3.19.0
         */
        this.sceneRenderer;

        /**
         * An instance of the Spine Skeleton Renderer.
         *
         * @name SpinePlugin#skeletonRenderer
         * @type {(spine.canvas.SkeletonRenderer|spine.webgl.SkeletonRenderer)}
         * @since 3.19.0
         */
        this.skeletonRenderer;

        /**
         * An instance of the Spine Skeleton Debug Renderer.
         *
         * Only set if running in WebGL mode.
         *
         * @name SpinePlugin#skeletonDebugRenderer
         * @type {spine.webgl.skeletonDebugRenderer}
         * @since 3.19.0
         */
        this.skeletonDebugRenderer;

        /**
         * A reference to the Spine runtime.
         * This is the runtime created by Esoteric Software.
         *
         * @name SpinePlugin#plugin
         * @type {spine}
         * @since 3.19.0
         */
        this.plugin = Spine;

        /**
         * An internal vector3 used by the screen to world method.
         *
         * @name SpinePlugin#temp1
         * @private
         * @type {spine.webgl.Vector3}
         * @since 3.19.0
         */
        this.temp1;

        /**
         * An internal vector3 used by the screen to world method.
         *
         * @name SpinePlugin#temp2
         * @private
         * @type {spine.webgl.Vector3}
         * @since 3.19.0
         */
        this.temp2;

        if (this.isWebGL)
        {
            this.runtime = Spine.webgl;

            this.renderer = game.renderer;
            this.gl = game.renderer.gl;

            this.getAtlas = this.getAtlasWebGL;
        }
        else
        {
            this.runtime = Spine.canvas;

            this.renderer = game.renderer;

            this.getAtlas = this.getAtlasCanvas;
        }

        //  Headless mode?
        if (!this.renderer)
        {
            this.renderer = {
                width: game.scale.width,
                height: game.scale.height,
                preRender: NOOP,
                postRender: NOOP,
                render: NOOP,
                destroy: NOOP
            };
        }

        var isWebGL = this.isWebGL;

        var add = function (x, y, key, animationName, loop)
        {
            if (isWebGL)
            {
                this.scene.sys.renderer.pipelines.clear();
            }

            var spinePlugin = this.scene.sys[pluginKey];
            var spineGO = new SpineGameObject(this.scene, spinePlugin, x, y, key, animationName, loop);

            this.displayList.add(spineGO);
            this.updateList.add(spineGO);

            if (isWebGL)
            {
                this.scene.sys.renderer.pipelines.rebind();
            }

            return spineGO;
        };

        var make = function (config, addToScene)
        {
            if (config === undefined) { config = {}; }

            if (isWebGL)
            {
                this.scene.sys.renderer.pipelines.clear();
            }

            var key = GetValue(config, 'key', null);
            var animationName = GetValue(config, 'animationName', null);
            var loop = GetValue(config, 'loop', false);

            var spinePlugin = this.scene.sys[pluginKey];
            var spineGO = new SpineGameObject(this.scene, spinePlugin, 0, 0, key, animationName, loop);

            if (addToScene !== undefined)
            {
                config.add = addToScene;
            }

            BuildGameObject(this.scene, spineGO, config);

            //  Spine specific
            var skinName = GetValue(config, 'skinName', false);

            if (skinName)
            {
                spineGO.setSkinByName(skinName);
            }

            var slotName = GetValue(config, 'slotName', false);
            var attachmentName = GetValue(config, 'attachmentName', null);

            if (slotName)
            {
                spineGO.setAttachment(slotName, attachmentName);
            }

            if (isWebGL)
            {
                this.scene.sys.renderer.pipelines.rebind();
            }

            return spineGO.refresh();
        };

        var addContainer = function (x, y, children)
        {
            var spinePlugin = this.scene.sys[pluginKey];
            var spineGO = new SpineContainer(this.scene, spinePlugin, x, y, children);

            this.displayList.add(spineGO);

            return spineGO;
        };

        var makeContainer = function (config, addToScene)
        {
            if (config === undefined) { config = {}; }

            var x = GetValue(config, 'x', 0);
            var y = GetValue(config, 'y', 0);
            var children = GetValue(config, 'children', null);

            var spinePlugin = this.scene.sys[pluginKey];
            var container = new SpineContainer(this.scene, spinePlugin, x, y, children);

            if (addToScene !== undefined)
            {
                config.add = addToScene;
            }

            BuildGameObject(this.scene, container, config);

            return container;
        };

        pluginManager.registerFileType('spine', this.spineFileCallback, scene);
        pluginManager.registerGameObject('spine', add, make);
        pluginManager.registerGameObject('spineContainer', addContainer, makeContainer);
    },

    /**
     * Internal boot handler.
     *
     * @method SpinePlugin#boot
     * @private
     * @since 3.19.0
     */
    boot: function ()
    {
        if (this.isWebGL)
        {
            this.bootWebGL();
            this.onResize();
            this.game.scale.on(ResizeEvent, this.onResize, this);
        }
        else
        {
            this.bootCanvas();
        }

        var eventEmitter = this.systems.events;

        eventEmitter.once('shutdown', this.shutdown, this);
        eventEmitter.once('destroy', this.destroy, this);

        this.game.events.once('destroy', this.gameDestroy, this);
    },

    /**
     * Internal boot handler for the Canvas Renderer.
     *
     * @method SpinePlugin#bootCanvas
     * @private
     * @since 3.19.0
     */
    bootCanvas: function ()
    {
        this.skeletonRenderer = new Spine.canvas.SkeletonRenderer(this.scene.sys.context);
    },

    /**
     * Internal boot handler for the WebGL Renderer.
     *
     * @method SpinePlugin#bootWebGL
     * @private
     * @since 3.19.0
     */
    bootWebGL: function ()
    {
        //  Monkeypatch the Spine setBlendMode functions, or batching is destroyed!

        var setBlendMode = function (srcBlend, dstBlend)
        {
            if (srcBlend !== this.srcBlend || dstBlend !== this.dstBlend)
            {
                var gl = this.context.gl;

                this.srcBlend = srcBlend;
                this.dstBlend = dstBlend;

                if (this.isDrawing)
                {
                    this.flush();
                    gl.blendFunc(this.srcBlend, this.dstBlend);
                }
            }
        };

        var sceneRenderer = this.renderer.spineSceneRenderer;

        if (!sceneRenderer)
        {
            sceneRenderer = new Spine.webgl.SceneRenderer(this.renderer.canvas, this.gl, true);
            sceneRenderer.batcher.setBlendMode = setBlendMode;
            sceneRenderer.shapes.setBlendMode = setBlendMode;

            this.renderer.spineSceneRenderer = sceneRenderer;
        }

        //  All scene share the same instance
        this.sceneRenderer = sceneRenderer;
        this.skeletonRenderer = sceneRenderer.skeletonRenderer;
        this.skeletonDebugRenderer = sceneRenderer.skeletonDebugRenderer;

        this.temp1 = new Spine.webgl.Vector3(0, 0, 0);
        this.temp2 = new Spine.webgl.Vector3(0, 0, 0);
    },

    /**
     * Gets a loaded Spine Atlas from the cache and creates a new Spine Texture Atlas,
     * then returns it. You do not normally need to invoke this method directly.
     *
     * @method SpinePlugin#getAtlasCanvas
     * @since 3.19.0
     *
     * @param {string} key - The key of the Spine Atlas to create.
     *
     * @return {spine.TextureAtlas} The Spine Texture Atlas, or undefined if the given key wasn't found.
     */
    getAtlasCanvas: function (key)
    {
        var atlasEntry = this.cache.get(key);

        if (!atlasEntry)
        {
            console.warn('No atlas data for: ' + key);
            return;
        }

        var atlas;
        var spineTextures = this.spineTextures;

        if (spineTextures.has(key))
        {
            atlas = spineTextures.get(key);
        }
        else
        {
            var textures = this.textures;

            atlas = new Spine.TextureAtlas(atlasEntry.data, function (path)
            {
                return new Spine.canvas.CanvasTexture(textures.get(atlasEntry.prefix + key + ':' + path).getSourceImage());
            });
        }

        return atlas;
    },

    /**
     * Gets a loaded Spine Atlas from the cache and creates a new Spine Texture Atlas,
     * then returns it. You do not normally need to invoke this method directly.
     *
     * @method SpinePlugin#getAtlasWebGL
     * @since 3.19.0
     *
     * @param {string} key - The key of the Spine Atlas to create.
     *
     * @return {spine.TextureAtlas} The Spine Texture Atlas, or undefined if the given key wasn't found.
     */
    getAtlasWebGL: function (key)
    {
        var atlasEntry = this.cache.get(key);

        if (!atlasEntry)
        {
            console.warn('No atlas data for: ' + key);
            return;
        }

        var atlas;
        var spineTextures = this.spineTextures;

        if (spineTextures.has(key))
        {
            atlas = spineTextures.get(key);
        }
        else
        {
            var textures = this.textures;

            var gl = this.sceneRenderer.context.gl;

            gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);

            atlas = new Spine.TextureAtlas(atlasEntry.data, function (path)
            {
                return new Spine.webgl.GLTexture(gl, textures.get(atlasEntry.prefix + key + ':' + path).getSourceImage(), false);
            });
        }

        return atlas;
    },

    /**
     * Adds a Spine Skeleton and Atlas file, or array of files, to the current load queue.
     *
     * You can call this method from within your Scene's `preload`, along with any other files you wish to load:
     *
     * ```javascript
     * function preload ()
     * {
     *     this.load.spine('spineBoy', 'boy.json', 'boy.atlas', true);
     * }
     * ```
     *
     * The file is **not** loaded right away. It is added to a queue ready to be loaded either when the loader starts,
     * or if it's already running, when the next free load slot becomes available. This happens automatically if you
     * are calling this from within the Scene's `preload` method, or a related callback. Because the file is queued
     * it means you cannot use the file immediately after calling this method, but must wait for the file to complete.
     * The typical flow for a Phaser Scene is that you load assets in the Scene's `preload` method and then when the
     * Scene's `create` method is called you are guaranteed that all of those assets are ready for use and have been
     * loaded.
     *
     * If you call this from outside of `preload` then you are responsible for starting the Loader afterwards and monitoring
     * its events to know when it's safe to use the asset. Please see the Phaser.Loader.LoaderPlugin class for more details.
     *
     * Phaser expects the Spine data to be exported from the Spine application in a JSON format, not binary. The associated
     * atlas files are scanned for any texture files present in them, which are then loaded. If you have exported
     * your Spine data with preMultipliedAlpha set, then you should enable this in the arguments, or you may see black
     * outlines around skeleton textures.
     *
     * The key must be a unique String. It is used to add the file to the global Spine cache upon a successful load.
     * The key should be unique both in terms of files being loaded and files already present in the Spine cache.
     * Loading a file using a key that is already taken will result in a warning.
     *
     * Instead of passing arguments you can pass a configuration object, such as:
     *
     * ```javascript
     * this.load.spine({
     *     key: 'mainmenu',
     *     jsonURL: 'boy.json',
     *     atlasURL: 'boy.atlas',
     *     preMultipliedAlpha: true
     * });
     * ```
     *
     * If you need to load multiple Spine atlas files, provide them as an array:
     *
     * ```javascript
     * function preload ()
     * {
     *     this.load.spine('demos', 'demos.json', [ 'atlas1.atlas', 'atlas2.atlas' ], true);
     * }
     * ```
     *
     * See the documentation for `Phaser.Types.Loader.FileTypes.SpineFileConfig` for more details.
     *
     * If you have specified a prefix in the loader, via `Loader.setPrefix` then this value will be prepended to this files
     * key. For example, if the prefix was `MENU.` and the key was `Background` the final key will be `MENU.Background` and
     * this is what you would use to retrieve the data from the Spine plugin.
     *
     * The URL can be relative or absolute. If the URL is relative the `Loader.baseURL` and `Loader.path` values will be prepended to it.
     *
     * If the URL isn't specified the Loader will take the key and create a filename from that. For example if the key is "alien"
     * and no URL is given then the Loader will set the URL to be "alien.json". It will always add `.json` as the extension, although
     * this can be overridden if using an object instead of method arguments. If you do not desire this action then provide a URL.
     *
     * Note: The ability to load this type of file will only be available if the Spine Plugin has been built or loaded into Phaser.
     *
     * @method Phaser.Loader.LoaderPlugin#spine
     * @fires Phaser.Loader.LoaderPlugin#ADD
     * @since 3.19.0
     *
     * @param {(string|Phaser.Types.Loader.FileTypes.JSONFileConfig|Phaser.Types.Loader.FileTypes.JSONFileConfig[])} key - The key to use for this file, or a file configuration object, or array of them.
     * @param {string} jsonURL - The absolute or relative URL to load the Spine json file from. If undefined or `null` it will be set to `<key>.json`, i.e. if `key` was "alien" then the URL will be "alien.json".
     * @param {string|string[]} atlasURL - The absolute or relative URL to load the Spine atlas file from. If undefined or `null` it will be set to `<key>.atlas`, i.e. if `key` was "alien" then the URL will be "alien.atlas".
     * @param {boolean} [preMultipliedAlpha=false] - Do the texture files include pre-multiplied alpha or not?
     * @param {Phaser.Types.Loader.XHRSettingsObject} [textureXhrSettings] - An XHR Settings configuration object for the Spine json file. Used in replacement of the Loaders default XHR Settings.
     * @param {Phaser.Types.Loader.XHRSettingsObject} [atlasXhrSettings] - An XHR Settings configuration object for the Spine atlas file. Used in replacement of the Loaders default XHR Settings.
     * @param {object} [settings] - An external Settings configuration object { prefix: '' }
     *
     * @return {Phaser.Loader.LoaderPlugin} The Loader instance.
     */
    spineFileCallback: function (key, jsonURL, atlasURL, preMultipliedAlpha, jsonXhrSettings, atlasXhrSettings, settings)
    {
        var multifile;
        settings = settings || {};

        if (Array.isArray(key))
        {
            for (var i = 0; i < key.length; i++)
            {
                multifile = new SpineFile(this, key[i]);

                // Support prefix key
                multifile.prefix = multifile.prefix || settings.prefix || '';

                this.addFile(multifile.files);
            }
        }
        else
        {
            multifile = new SpineFile(this, key, jsonURL, atlasURL, preMultipliedAlpha, jsonXhrSettings, atlasXhrSettings);

            // Support prefix key
            multifile.prefix = multifile.prefix || settings.prefix || '';

            this.addFile(multifile.files);
        }

        return this;
    },

    /**
     * Converts the given x and y screen coordinates into the world space of the given Skeleton.
     *
     * Only works in WebGL.
     *
     * @method SpinePlugin#worldToLocal
     * @since 3.19.0
     *
     * @param {number} x - The screen space x coordinate to convert.
     * @param {number} y - The screen space y coordinate to convert.
     * @param {spine.Skeleton} skeleton - The Spine Skeleton to convert into.
     * @param {spine.Bone} [bone] - Optional bone of the Skeleton to convert into.
     *
     * @return {spine.Vector2} A Vector2 containing the translated point.
     */
    worldToLocal: function (x, y, skeleton, bone)
    {
        var temp1 = this.temp1;
        var temp2 = this.temp2;
        var camera = this.sceneRenderer.camera;

        temp1.set(x + skeleton.x, y - skeleton.y, 0);

        var width = camera.viewportWidth;
        var height = camera.viewportHeight;

        camera.screenToWorld(temp1, width, height);

        if (bone && bone.parent !== null)
        {
            bone.parent.worldToLocal(temp2.set(temp1.x - skeleton.x, temp1.y - skeleton.y, 0));

            return new Spine.Vector2(temp2.x, temp2.y);
        }
        else if (bone)
        {
            return new Spine.Vector2(temp1.x - skeleton.x, temp1.y - skeleton.y);
        }
        else
        {
            return new Spine.Vector2(temp1.x, temp1.y);
        }
    },

    /**
     * Returns a Spine Vector2 based on the given x and y values.
     *
     * @method SpinePlugin#getVector2
     * @since 3.19.0
     *
     * @param {number} x - The Vector x value.
     * @param {number} y - The Vector y value.
     *
     * @return {spine.Vector2} A Spine Vector2 based on the given values.
     */
    getVector2: function (x, y)
    {
        return new Spine.Vector2(x, y);
    },

    /**
     * Returns a Spine Vector2 based on the given x, y and z values.
     *
     * Only works in WebGL.
     *
     * @method SpinePlugin#getVector3
     * @since 3.19.0
     *
     * @param {number} x - The Vector x value.
     * @param {number} y - The Vector y value.
     * @param {number} z - The Vector z value.
     *
     * @return {spine.Vector2} A Spine Vector2 based on the given values.
     */
    getVector3: function (x, y, z)
    {
        return new Spine.webgl.Vector3(x, y, z);
    },

    /**
     * Sets `drawBones` in the Spine Skeleton Debug Renderer.
     *
     * Only works in WebGL.
     *
     * @method SpinePlugin#setDebugBones
     * @since 3.19.0
     *
     * @param {boolean} [value=true] - The value to set in the debug property.
     *
     * @return {this} This Spine Plugin.
     */
    setDebugBones: function (value)
    {
        if (value === undefined) { value = true; }

        this.skeletonDebugRenderer.drawBones = value;

        return this;
    },

    /**
     * Sets `drawRegionAttachments` in the Spine Skeleton Debug Renderer.
     *
     * Only works in WebGL.
     *
     * @method SpinePlugin#setDebugRegionAttachments
     * @since 3.19.0
     *
     * @param {boolean} [value=true] - The value to set in the debug property.
     *
     * @return {this} This Spine Plugin.
     */
    setDebugRegionAttachments: function (value)
    {
        if (value === undefined) { value = true; }

        this.skeletonDebugRenderer.drawRegionAttachments = value;

        return this;
    },

    /**
     * Sets `drawBoundingBoxes` in the Spine Skeleton Debug Renderer.
     *
     * Only works in WebGL.
     *
     * @method SpinePlugin#setDebugBoundingBoxes
     * @since 3.19.0
     *
     * @param {boolean} [value=true] - The value to set in the debug property.
     *
     * @return {this} This Spine Plugin.
     */
    setDebugBoundingBoxes: function (value)
    {
        if (value === undefined) { value = true; }

        this.skeletonDebugRenderer.drawBoundingBoxes = value;

        return this;
    },

    /**
     * Sets `drawMeshHull` in the Spine Skeleton Debug Renderer.
     *
     * Only works in WebGL.
     *
     * @method SpinePlugin#setDebugMeshHull
     * @since 3.19.0
     *
     * @param {boolean} [value=true] - The value to set in the debug property.
     *
     * @return {this} This Spine Plugin.
     */
    setDebugMeshHull: function (value)
    {
        if (value === undefined) { value = true; }

        this.skeletonDebugRenderer.drawMeshHull = value;

        return this;
    },

    /**
     * Sets `drawMeshTriangles` in the Spine Skeleton Debug Renderer.
     *
     * Only works in WebGL.
     *
     * @method SpinePlugin#setDebugMeshTriangles
     * @since 3.19.0
     *
     * @param {boolean} [value=true] - The value to set in the debug property.
     *
     * @return {this} This Spine Plugin.
     */
    setDebugMeshTriangles: function (value)
    {
        if (value === undefined) { value = true; }

        this.skeletonDebugRenderer.drawMeshTriangles = value;

        return this;
    },

    /**
     * Sets `drawPaths` in the Spine Skeleton Debug Renderer.
     *
     * Only works in WebGL.
     *
     * @method SpinePlugin#setDebugPaths
     * @since 3.19.0
     *
     * @param {boolean} [value=true] - The value to set in the debug property.
     *
     * @return {this} This Spine Plugin.
     */
    setDebugPaths: function (value)
    {
        if (value === undefined) { value = true; }

        this.skeletonDebugRenderer.drawPaths = value;

        return this;
    },

    /**
     * Sets `drawSkeletonXY` in the Spine Skeleton Debug Renderer.
     *
     * Only works in WebGL.
     *
     * @method SpinePlugin#setDebugSkeletonXY
     * @since 3.19.0
     *
     * @param {boolean} [value=true] - The value to set in the debug property.
     *
     * @return {this} This Spine Plugin.
     */
    setDebugSkeletonXY: function (value)
    {
        if (value === undefined) { value = true; }

        this.skeletonDebugRenderer.drawSkeletonXY = value;

        return this;
    },

    /**
     * Sets `drawClipping` in the Spine Skeleton Debug Renderer.
     *
     * Only works in WebGL.
     *
     * @method SpinePlugin#setDebugClipping
     * @since 3.19.0
     *
     * @param {boolean} [value=true] - The value to set in the debug property.
     *
     * @return {this} This Spine Plugin.
     */
    setDebugClipping: function (value)
    {
        if (value === undefined) { value = true; }

        this.skeletonDebugRenderer.drawClipping = value;

        return this;
    },

    /**
     * Sets the given vertex effect on the Spine Skeleton Renderer.
     *
     * Only works in WebGL.
     *
     * @method SpinePlugin#setEffect
     * @since 3.19.0
     *
     * @param {spine.VertexEffect} [effect] - The vertex effect to set on the Skeleton Renderer.
     *
     * @return {this} This Spine Plugin.
     */
    setEffect: function (effect)
    {
        this.sceneRenderer.skeletonRenderer.vertexEffect = effect;

        return this;
    },

    /**
     * Creates a Spine Skeleton based on the given key and optional Skeleton JSON data.
     *
     * The Skeleton data should have already been loaded before calling this method.
     *
     * @method SpinePlugin#createSkeleton
     * @since 3.19.0
     *
     * @param {string} key - The key of the Spine skeleton data, as loaded by the plugin. If the Spine JSON contains multiple skeletons, reference them with a period, i.e. `set.spineBoy`.
     * @param {object} [skeletonJSON] - Optional Skeleton JSON data to use, instead of getting it from the cache.
     *
     * @return {(any|null)} This Spine Skeleton data object, or `null` if the key was invalid.
     */
    createSkeleton: function (key, skeletonJSON)
    {
        var atlasKey = key;
        var jsonKey = key;
        var split = (key.indexOf('.') !== -1);

        if (split)
        {
            var parts = key.split('.');

            atlasKey = parts.shift();
            jsonKey = parts.join('.');
        }

        var atlasData = this.cache.get(atlasKey);
        var atlas = this.getAtlas(atlasKey);

        if (!atlas)
        {
            return null;
        }

        if (!this.spineTextures.has(atlasKey))
        {
            this.spineTextures.add(atlasKey, atlas);
        }

        var preMultipliedAlpha = atlasData.preMultipliedAlpha;

        var atlasLoader = new Spine.AtlasAttachmentLoader(atlas);

        var skeletonJson = new Spine.SkeletonJson(atlasLoader);

        var data;

        if (skeletonJSON)
        {
            data = skeletonJSON;
        }
        else
        {
            var json = this.json.get(atlasKey);

            data = (split) ? GetValue(json, jsonKey) : json;
        }

        if (data)
        {
            var skeletonData = skeletonJson.readSkeletonData(data);

            var skeleton = new Spine.Skeleton(skeletonData);

            return { skeletonData: skeletonData, skeleton: skeleton, preMultipliedAlpha: preMultipliedAlpha };
        }
        else
        {
            return null;
        }
    },

    /**
     * Creates a new Animation State and Animation State Data for the given skeleton.
     *
     * The returned object contains two properties: `state` and `stateData` respectively.
     *
     * @method SpinePlugin#createAnimationState
     * @since 3.19.0
     *
     * @param {spine.Skeleton} skeleton - The Skeleton to create the Animation State for.
     *
     * @return {any} An object containing the Animation State and Animation State Data instances.
     */
    createAnimationState: function (skeleton)
    {
        var stateData = new Spine.AnimationStateData(skeleton.data);

        var state = new Spine.AnimationState(stateData);

        return { stateData: stateData, state: state };
    },

    /**
     * Returns the axis aligned bounding box (AABB) of the region and mesh attachments for the current pose.
     *
     * The returned object contains two properties: `offset` and `size`:
     *
     * `offset` - The distance from the skeleton origin to the bottom left corner of the AABB.
     * `size` - The width and height of the AABB.
     *
     * @method SpinePlugin#getBounds
     * @since 3.19.0
     *
     * @param {spine.Skeleton} skeleton - The Skeleton to get the bounds from.
     *
     * @return {any} The bounds object.
     */
    getBounds: function (skeleton)
    {
        var offset = new Spine.Vector2();
        var size = new Spine.Vector2();

        skeleton.getBounds(offset, size, []);

        return { offset: offset, size: size };
    },

    /**
     * Internal handler for when the renderer resizes.
     *
     * Only called if running in WebGL.
     *
     * @method SpinePlugin#onResize
     * @since 3.19.0
     */
    onResize: function ()
    {
        var renderer = this.renderer;
        var sceneRenderer = this.sceneRenderer;

        var viewportWidth = renderer.width;
        var viewportHeight = renderer.height;

        sceneRenderer.camera.position.x = viewportWidth / 2;
        sceneRenderer.camera.position.y = viewportHeight / 2;

        sceneRenderer.camera.setViewport(viewportWidth, viewportHeight);
    },

    /**
     * The Scene that owns this plugin is shutting down.
     *
     * We need to kill and reset all internal properties as well as stop listening to Scene events.
     *
     * @method SpinePlugin#shutdown
     * @private
     * @since 3.19.0
     */
    shutdown: function ()
    {
        var eventEmitter = this.systems.events;

        eventEmitter.off('shutdown', this.shutdown, this);

        if (this.isWebGL)
        {
            this.game.scale.off(ResizeEvent, this.onResize, this);
        }
    },

    /**
     * The Scene that owns this plugin is being destroyed.
     *
     * We need to shutdown and then kill off all external references.
     *
     * @method SpinePlugin#destroy
     * @private
     * @since 3.19.0
     */
    destroy: function ()
    {
        this.shutdown();

        this.game = null;
        this.scene = null;
        this.systems = null;

        this.cache = null;
        this.spineTextures = null;
        this.json = null;
        this.textures = null;
        this.skeletonRenderer = null;
        this.gl = null;
    },

    /**
     * The Game that owns this plugin is being destroyed.
     *
     * Dispose of the Scene Renderer and remove the Game Objects.
     *
     * @method SpinePlugin#gameDestroy
     * @private
     * @since 3.50.0
     */
    gameDestroy: function ()
    {
        this.pluginManager.removeGameObject('spine', true, true);
        this.pluginManager.removeGameObject('spineContainer', true, true);

        this.pluginManager = null;

        var sceneRenderer = this.renderer.spineSceneRenderer;

        if (sceneRenderer)
        {
            sceneRenderer.dispose();
        }

        this.renderer.spineSceneRenderer = null;
        this.sceneRenderer = null;
    }

});

SpinePlugin.SpineGameObject = SpineGameObject;
SpinePlugin.SpineContainer = SpineContainer;

/**
 * Creates a new Spine Game Object and adds it to the Scene.
 *
 * The x and y coordinate given is used to set the placement of the root Spine bone, which can vary from
 * skeleton to skeleton. All rotation and scaling happens from the root bone placement. Spine Game Objects
 * do not have a Phaser origin.
 *
 * If the Spine JSON file exported multiple Skeletons within it, then you can specify them by using a period
 * character in the key. For example, if you loaded a Spine JSON using the key `monsters` and it contains
 * multiple Skeletons, including one called `goblin` then you would use the key `monsters.goblin` to reference
 * that.
 *
 * ```javascript
 * let jelly = this.add.spine(512, 550, 'jelly', 'jelly-think', true);
 * ```
 *
 * The key is optional. If not passed here, you need to call `SpineGameObject.setSkeleton()` to use it.
 *
 * The animation name is also optional and can be set later via `SpineGameObject.setAnimation`.
 *
 * Should you wish for more control over the object creation, such as setting a slot attachment or skin
 * name, then use `SpinePlugin.make` instead.
 *
 * @method SpinePlugin#add
 * @since 3.19.0
 *
 * @param {number} x - The horizontal position of this Game Object in the world.
 * @param {number} y - The vertical position of this Game Object in the world.
 * @param {string} [key] - The key of the Spine Skeleton this Game Object will use, as stored in the Spine Plugin.
 * @param {string} [animationName] - The name of the animation to set on this Skeleton.
 * @param {boolean} [loop=false] - Should the animation playback be looped or not?
 *
 * @return {SpineGameObject} The Game Object that was created.
 */

/**
 * Creates a new Spine Game Object from the given configuration file and optionally adds it to the Scene.
 *
 * The x and y coordinate given is used to set the placement of the root Spine bone, which can vary from
 * skeleton to skeleton. All rotation and scaling happens from the root bone placement. Spine Game Objects
 * do not have a Phaser origin.
 *
 * If the Spine JSON file exported multiple Skeletons within it, then you can specify them by using a period
 * character in the key. For example, if you loaded a Spine JSON using the key `monsters` and it contains
 * multiple Skeletons, including one called `goblin` then you would use the key `monsters.goblin` to reference
 * that.
 *
 * ```javascript
 * let jelly = this.make.spine({
 *     x: 500, y: 500, key: 'jelly',
 *     scale: 1.5,
 *     skinName: 'square_Green',
 *     animationName: 'jelly-idle', loop: true,
 *     slotName: 'hat', attachmentName: 'images/La_14'
 * });
 * ```
 *
 * @method SpinePlugin#make
 * @since 3.19.0
 *
 * @param {any} config - The configuration object this Game Object will use to create itself.
 * @param {boolean} [addToScene] - Add this Game Object to the Scene after creating it? If set this argument overrides the `add` property in the config object.
 *
 * @return {SpineGameObject} The Game Object that was created.
 */

module.exports = SpinePlugin;
