/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Class = require('../../../src/utils/Class');
var BaseSpinePlugin = require('./BaseSpinePlugin');
var SpineCanvas = require('SpineCanvas');

var runtime;

/**
 * @classdesc
 * Just the Canvas Runtime.
 *
 * @class SpinePlugin
 * @extends Phaser.Plugins.ScenePlugin
 * @constructor
 * @since 3.16.0
 *
 * @param {Phaser.Scene} scene - A reference to the Scene that has installed this plugin.
 * @param {Phaser.Plugins.PluginManager} pluginManager - A reference to the Phaser Plugin Manager.
 */
var SpineCanvasPlugin = new Class({

    Extends: BaseSpinePlugin,

    initialize:

    function SpineCanvasPlugin (scene, pluginManager)
    {
        console.log('SpineCanvasPlugin created');

        BaseSpinePlugin.call(this, scene, pluginManager);

        runtime = SpineCanvas;
    },

    boot: function ()
    {
        this.skeletonRenderer = new SpineCanvas.canvas.SkeletonRenderer(this.game.context);
    },

    getRuntime: function ()
    {
        return runtime;
    },

    createSkeleton: function (key, child)
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

        var data = this.json.get(key);

        if (child)
        {
            data = data[child];
        }

        var skeletonData = skeletonJson.readSkeletonData(data);

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
    }

});

module.exports = SpineCanvasPlugin;
