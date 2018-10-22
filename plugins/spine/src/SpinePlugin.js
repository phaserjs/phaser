/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Class = require('../../../src/utils/Class');
var BasePlugin = require('../../../src/plugins/BasePlugin');
var SpineCanvas = require('SpineCanvas');

// var SpineGL = require('SpineGL');

/**
 * @classdesc
 * TODO
 *
 * @class SpinePlugin
 * @constructor
 *
 * @param {Phaser.Scene} scene - The Scene to which this plugin is being installed.
 * @param {Phaser.Plugins.PluginManager} pluginManager - A reference to the Phaser Plugin Manager.
 */
var SpinePlugin = new Class({

    Extends: BasePlugin,

    initialize:

    function SpinePlugin (pluginManager)
    {
        console.log('SpinePlugin enabled');

        BasePlugin.call(this, pluginManager);

        // console.log(SpineCanvas.canvas);
        // console.log(SpineGL.webgl);

        this.skeletonRenderer = new SpineCanvas.canvas.SkeletonRenderer(this.game.context);

        this.textureManager = this.game.textures;
        this.textCache = this.game.cache.text;
        this.jsonCache = this.game.cache.json;

        // console.log(this.skeletonRenderer);
        // pluginManager.registerGameObject('sprite3D', this.sprite3DFactory, this.sprite3DCreator);
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
        // var sprite = new Sprite3D(this.scene, x, y, z, key, frame);

        // this.displayList.add(sprite.gameObject);
        // this.updateList.add(sprite.gameObject);

        // return sprite;
    },

    createSkeleton: function (textureKey, atlasKey, jsonKey)
    {
        var canvasTexture = new SpineCanvas.canvas.CanvasTexture(this.textureManager.get(textureKey).getSourceImage());

        var atlas = new SpineCanvas.TextureAtlas(this.textCache.get(atlasKey), function () { return canvasTexture; });

        var atlasLoader = new SpineCanvas.AtlasAttachmentLoader(atlas);
        
        var skeletonJson = new SpineCanvas.SkeletonJson(atlasLoader);

        var skeletonData = skeletonJson.readSkeletonData(this.jsonCache.get(jsonKey));

        var skeleton = new SpineCanvas.Skeleton(skeletonData);

        skeleton.flipY = true;
        skeleton.setToSetupPose();
        skeleton.updateWorldTransform();

        skeleton.setSkinByName('default');
    
        return skeleton;
    },

    getBounds: function (skeleton)
    {
        var offset = new SpineCanvas.Vector2();
        var size = new SpineCanvas.Vector2();

        skeleton.getBounds(offset, size, []);

        return { offset: offset, size: size };
    },

    createAnimationState: function (skeleton, animationName)
    {
        var state = new SpineCanvas.AnimationState(new SpineCanvas.AnimationStateData(skeleton.data));

        state.setAnimation(0, animationName, true);

        return state;
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
