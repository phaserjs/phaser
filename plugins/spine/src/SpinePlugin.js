/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Class = require('../../../src/utils/Class');
var ScenePlugin = require('../../../src/plugins/ScenePlugin');
var SpineFile = require('./SpineFile');
var SpineCanvas = require('SpineCanvas');
var SpineWebGL = require('SpineGL');
var SpineGameObject = require('./gameobject/SpineGameObject');

var runtime;

/**
 * @classdesc
 * TODO
 *
 * @class SpinePlugin
 * @extends Phaser.Plugins.ScenePlugin
 * @constructor
 * @since 3.16.0
 *
 * @param {Phaser.Scene} scene - A reference to the Scene that has installed this plugin.
 * @param {Phaser.Plugins.PluginManager} pluginManager - A reference to the Phaser Plugin Manager.
 */
var SpinePlugin = new Class({

    Extends: ScenePlugin,

    initialize:

    function SpinePlugin (scene, pluginManager)
    {
        console.log('SpinePlugin created');

        ScenePlugin.call(this, scene, pluginManager);

        var game = pluginManager.game;

        this.canvas = game.canvas;
        this.context = game.context;

        //  Create a custom cache to store the spine data (.atlas files)
        this.cache = game.cache.addCustom('spine');

        this.json = game.cache.json;

        this.textures = game.textures;

        //  Register our file type
        pluginManager.registerFileType('spine', this.spineFileCallback, scene);

        //  Register our game object

        runtime = (game.config.renderType) ? SpineCanvas : SpineWebGL;

        pluginManager.registerGameObject('spine', this.createSpineFactory(this));
    },

    boot: function ()
    {
        this.skeletonRenderer = new SpineCanvas.canvas.SkeletonRenderer(this.game.context);
    },

    getRuntime: function ()
    {
        return runtime;
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

    createSkeleton: function (key)
    {
        var atlasData = this.cache.get(key);

        if (!atlasData)
        {
            console.warn('No skeleton data for: ' + key);
            return;
        }

        var textures = this.textures;

        var atlas = new SpineCanvas.TextureAtlas(atlasData, function (path)
        {
            return new SpineCanvas.canvas.CanvasTexture(textures.get(path).getSourceImage());
        });

        var atlasLoader = new SpineCanvas.AtlasAttachmentLoader(atlas);
        
        var skeletonJson = new SpineCanvas.SkeletonJson(atlasLoader);

        var skeletonData = skeletonJson.readSkeletonData(this.json.get(key));

        var skeleton = new SpineCanvas.Skeleton(skeletonData);
    
        return { skeletonData: skeletonData, skeleton: skeleton };
    },

    getBounds: function (skeleton)
    {
        var offset = new SpineCanvas.Vector2();
        var size = new SpineCanvas.Vector2();

        skeleton.getBounds(offset, size, []);

        return { offset: offset, size: size };
    },

    createAnimationState: function (skeleton)
    {
        var stateData = new SpineCanvas.AnimationStateData(skeleton.data);

        var state = new SpineCanvas.AnimationState(stateData);

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

module.exports = SpinePlugin;
