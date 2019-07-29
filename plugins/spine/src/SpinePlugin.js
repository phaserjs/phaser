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
var ResizeEvent = require('../../../src/scale/events/RESIZE_EVENT');

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

        this.drawDebug = false;

        this.gl;
        this.renderer;
        this.sceneRenderer;
        this.skeletonDebugRenderer;

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

        this.temp1;
        this.temp2;

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

        this.onResize();

        this.game.scale.on(ResizeEvent, this.onResize, this);

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
        this.sceneRenderer = new Spine.webgl.SceneRenderer(this.renderer.canvas, this.gl, true);

        //  Monkeypatch the Spine setBlendMode functions, or batching is destroyed

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

        this.sceneRenderer.batcher.setBlendMode = setBlendMode;
        this.sceneRenderer.shapes.setBlendMode = setBlendMode;

        this.skeletonDebugRenderer = this.sceneRenderer.skeletonDebugRenderer;

        this.temp1 = new Spine.webgl.Vector3(0, 0, 0);
        this.temp2 = new Spine.webgl.Vector3(0, 0, 0);
    },

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
            atlas = new Spine.TextureAtlas(atlasEntry.data, function ()
            {
                return spineTextures.get(key);
            });
        }
        else
        {
            var textures = this.textures;

            var gl = this.sceneRenderer.context.gl;

            gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);

            atlas = new Spine.TextureAtlas(atlasEntry.data, function (path)
            {
                var glTexture = new Spine.webgl.GLTexture(gl, textures.get(path).getSourceImage(), false);

                spineTextures.add(key, glTexture);

                return glTexture;
            });
        }

        return atlas;
    },

    getVector2: function (x, y)
    {
        return new Spine.Vector2(x, y);
    },

    getVector3: function (x, y, z)
    {
        return new Spine.webgl.Vector3(x, y, z);
    },

    setDebugBones: function (value)
    {
        if (value === undefined) { value = true; }

        this.skeletonDebugRenderer.drawBones = value;

        return this;
    },

    setDebugRegionAttachments: function (value)
    {
        if (value === undefined) { value = true; }

        this.skeletonDebugRenderer.drawRegionAttachments = value;

        return this;
    },

    setDebugBoundingBoxes: function (value)
    {
        if (value === undefined) { value = true; }

        this.skeletonDebugRenderer.drawBoundingBoxes = value;

        return this;
    },

    setDebugMeshHull: function (value)
    {
        if (value === undefined) { value = true; }

        this.skeletonDebugRenderer.drawMeshHull = value;

        return this;
    },

    setDebugMeshTriangles: function (value)
    {
        if (value === undefined) { value = true; }

        this.skeletonDebugRenderer.drawMeshTriangles = value;

        return this;
    },

    setDebugPaths: function (value)
    {
        if (value === undefined) { value = true; }

        this.skeletonDebugRenderer.drawPaths = value;

        return this;
    },

    setDebugSkeletonXY: function (value)
    {
        if (value === undefined) { value = true; }

        this.skeletonDebugRenderer.drawSkeletonXY = value;

        return this;
    },

    setDebugClipping: function (value)
    {
        if (value === undefined) { value = true; }

        this.skeletonDebugRenderer.drawClipping = value;

        return this;
    },

    spineFileCallback: function (key, jsonURL, atlasURL, preMultipliedAlpha, jsonXhrSettings, atlasXhrSettings)
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
            multifile = new SpineFile(this, key, jsonURL, atlasURL, preMultipliedAlpha, jsonXhrSettings, atlasXhrSettings);

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

        var atlasData = this.cache.get(atlasKey);
        var atlas = this.getAtlas(atlasKey);

        if (!atlas)
        {
            return null;
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

    onResize: function ()
    {
        var renderer = this.renderer;
        var sceneRenderer = this.sceneRenderer;

        var viewportWidth = renderer.width;
        var viewportHeight = renderer.height;

        sceneRenderer.camera.position.x = viewportWidth / 2;
        sceneRenderer.camera.position.y = viewportHeight / 2;
    
        sceneRenderer.camera.viewportWidth = viewportWidth;
        sceneRenderer.camera.viewportHeight = viewportHeight;
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

        this.sceneRenderer.dispose();
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

        this.cache = null;
        this.spineTextures = null;
        this.json = null;
        this.textures = null;
        this.sceneRenderer = null;
        this.gl = null;
    }

});

module.exports = SpinePlugin;
