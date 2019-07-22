/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Class = require('../../../src/utils/Class');
var GetValue = require('../../../src/utils/object/GetValue');
var ScenePlugin = require('../../../src/plugins/ScenePlugin');
var SpineFile = require('./SpineFile');
var Spine = require('Spine');
var SpineGameObject = require('./gameobject/SpineGameObject');
var Matrix4 = require('../../../src/math/Matrix4');

/**
 * @classdesc
 * TODO
 *
 * @class SpinePlugin
 * @extends Phaser.Plugins.ScenePlugin
 * @constructor
 * @since 3.19.0
 *
 * @param {Phaser.Scene} scene - A reference to the Scene that has installed this plugin.
 * @param {Phaser.Plugins.PluginManager} pluginManager - A reference to the Phaser Plugin Manager.
 */
var SpinePlugin = new Class({

    Extends: ScenePlugin,

    initialize:

    function SpinePlugin (scene, pluginManager)
    {
        ScenePlugin.call(this, scene, pluginManager);

        var game = pluginManager.game;

        this.isWebGL = (game.config.renderType === 2);

        //  Create a custom cache to store the spine data (.atlas files)
        this.cache = game.cache.addCustom('spine');

        this.spineTextures = game.cache.addCustom('spineTextures');

        this.json = game.cache.json;

        this.textures = game.textures;

        this.skeletonRenderer;

        this.drawDebug = false;

        this.gl;
        this.mvp;
        this.shader;
        this.batcher;
        this.debugRenderer;
        this.debugShader;

        console.log('SpinePlugin created', '- WebGL:', this.isWebGL);

        if (this.isWebGL)
        {
            this.runtime = Spine.webgl;

            this.gl = game.renderer.gl;

            this.getAtlas = this.getAtlasWebGL;
        }
        else
        {
            this.runtime = Spine.canvas;

            this.getAtlas = this.getAtlasCanvas;
        }

        //  Register our file type
        pluginManager.registerFileType('spine', this.spineFileCallback, scene);

        //  Register our game object
        pluginManager.registerGameObject('spine', this.createSpineFactory(this));
    },

    boot: function ()
    {
        if (this.isWebGL)
        {
            this.bootWebGL();
        }
        else
        {
            this.bootCanvas();
        }

        var eventEmitter = this.systems.events;

        eventEmitter.once('shutdown', this.shutdown, this);
        eventEmitter.once('destroy', this.destroy, this);
    },

    bootCanvas: function ()
    {
        this.skeletonRenderer = new this.runtime.SkeletonRenderer(this.scene.sys.context);
    },

    getAtlasCanvas: function (key)
    {
        var atlasData = this.cache.get(key);

        if (!atlasData)
        {
            console.warn('No atlas data for: ' + key);
            return;
        }

        var atlas;
        var spineTextures = this.spineTextures;

        if (spineTextures.has(key))
        {
            atlas = new Spine.TextureAtlas(atlasData, function ()
            {
                return spineTextures.get(key);
            });
        }
        else
        {
            var textures = this.textures;

            atlas = new Spine.TextureAtlas(atlasData, function (path)
            {
                var canvasTexture = new Spine.canvas.CanvasTexture(textures.get(path).getSourceImage());

                spineTextures.add(key, canvasTexture);

                return canvasTexture;
            });
        }

        return atlas;
    },

    bootWebGL: function ()
    {
        var gl = this.gl;
        var runtime = this.runtime;

        this.mvp = new Matrix4();

        //  Create a simple shader, mesh, model-view-projection matrix and SkeletonRenderer.

        this.shader = runtime.Shader.newTwoColoredTextured(gl);

        this.batcher = new runtime.PolygonBatcher(gl, true);

        this.skeletonRenderer = new runtime.SkeletonRenderer(gl, true);

        this.skeletonRenderer.premultipliedAlpha = true;

        // this.shapes = new runtime.ShapeRenderer(gl);
        // this.debugRenderer = new runtime.SkeletonDebugRenderer(gl);
        // this.debugShader = runtime.Shader.newColored(gl);
    },

    getAtlasWebGL: function (key)
    {
        var atlasData = this.cache.get(key);

        if (!atlasData)
        {
            console.warn('No atlas data for: ' + key);
            return;
        }

        var atlas;
        var spineTextures = this.spineTextures;

        if (spineTextures.has(key))
        {
            atlas = new Spine.TextureAtlas(atlasData, function ()
            {
                return spineTextures.get(key);
            });
        }
        else
        {
            var textures = this.textures;

            var gl = this.gl;

            atlas = new Spine.TextureAtlas(atlasData, function (path)
            {
                var glTexture = new Spine.webgl.GLTexture(gl, textures.get(path).getSourceImage(), false);

                spineTextures.add(key, glTexture);

                return glTexture;
            });
        }

        return atlas;
    },

    spineFileCallback: function (key, jsonURL, atlasURL, jsonXhrSettings, atlasXhrSettings)
    {
        var multifile;
   
        if (Array.isArray(key))
        {
            for (var i = 0; i < key.length; i++)
            {
                multifile = new SpineFile(this, key[i]);
    
                this.addFile(multifile.files);
            }
        }
        else
        {
            multifile = new SpineFile(this, key, jsonURL, atlasURL, jsonXhrSettings, atlasXhrSettings);

            this.addFile(multifile.files);
        }
        
        return this;
    },

    /**
     * Creates a new Spine Game Object and adds it to the Scene.
     *
     * @method Phaser.GameObjects.GameObjectFactory#spineFactory
     * @since 3.16.0
     * 
     * @param {number} x - The horizontal position of this Game Object.
     * @param {number} y - The vertical position of this Game Object.
     * @param {string} texture - The key of the Texture this Game Object will use to render with, as stored in the Texture Manager.
     * @param {(string|integer)} [frame] - An optional frame from the Texture this Game Object is rendering with.
     *
     * @return {Phaser.GameObjects.Spine} The Game Object that was created.
     */
    createSpineFactory: function (plugin)
    {
        var callback = function (x, y, key, animationName, loop)
        {
            var spineGO = new SpineGameObject(this.scene, plugin, x, y, key, animationName, loop);

            this.displayList.add(spineGO);
            this.updateList.add(spineGO);
        
            return spineGO;
        };

        return callback;
    },

    getRuntime: function ()
    {
        return this.runtime;
    },

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

        var atlas = this.getAtlas(atlasKey);

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
        
            return { skeletonData: skeletonData, skeleton: skeleton };
        }
        else
        {
            return null;
        }
    },

    getBounds: function (skeleton)
    {
        var offset = new Spine.Vector2();
        var size = new Spine.Vector2();

        skeleton.getBounds(offset, size, []);

        return { offset: offset, size: size };
    },

    createAnimationState: function (skeleton)
    {
        var stateData = new Spine.AnimationStateData(skeleton.data);

        var state = new Spine.AnimationState(stateData);

        return { stateData: stateData, state: state };
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

        eventEmitter.off('shutdown', this.shutdown, this);
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

        this.pluginManager.removeGameObject('spine', true, true);

        this.pluginManager = null;
        this.game = null;
        this.scene = null;
        this.systems = null;

        //  Create a custom cache to store the spine data (.atlas files)
        this.cache = null;
        this.spineTextures = null;
        this.json = null;
        this.textures = null;
        this.skeletonRenderer = null;
        this.gl = null;
        this.mvp = null;
        this.shader = null;
        this.batcher = null;
        this.debugRenderer = null;
        this.debugShader = null;
    }

});

module.exports = SpinePlugin;
