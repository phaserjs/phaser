/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Class = require('../../../src/utils/Class');
var BaseSpinePlugin = require('./BaseSpinePlugin');
var SpineCanvas = require('SpineCanvas');
var SpineWebGL = require('SpineWebGL');

var runtime;

/**
 * @classdesc
 * Both Canvas and WebGL Runtimes together in a single plugin.
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
        console.log('SpinePlugin created');

        BaseSpinePlugin.call(this, scene, pluginManager);

        var game = pluginManager.game;

        runtime = (game.config.renderType === 1) ? SpineCanvas : SpineWebGL;
    },

    boot: function ()
    {
        this.skeletonRenderer = (this.game.config.renderType === 1) ? SpineCanvas.canvas.SkeletonRenderer(this.game.context) : SpineWebGL;
    },

    getRuntime: function ()
    {
        return runtime;
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

        var useWebGL = this.game.config.renderType;

        var atlas = new runtime.TextureAtlas(atlasData, function (path)
        {
            if (useWebGL)
            {
                // return new SpineCanvas.canvas.CanvasTexture(textures.get(path).getSourceImage());
            }
            else
            {
                return new SpineCanvas.canvas.CanvasTexture(textures.get(path).getSourceImage());
            }
        });

        var atlasLoader = new runtime.AtlasAttachmentLoader(atlas);
        
        var skeletonJson = new runtime.SkeletonJson(atlasLoader);

        var skeletonData = skeletonJson.readSkeletonData(this.json.get(key));

        var skeleton = new runtime.Skeleton(skeletonData);
    
        return { skeletonData: skeletonData, skeleton: skeleton };
    },

    getBounds: function (skeleton)
    {
        var offset = new runtime.Vector2();
        var size = new runtime.Vector2();

        skeleton.getBounds(offset, size, []);

        return { offset: offset, size: size };
    },

    createAnimationState: function (skeleton)
    {
        var stateData = new runtime.AnimationStateData(skeleton.data);

        var state = new runtime.AnimationState(stateData);

        return { stateData: stateData, state: state };
    }

});

module.exports = SpineCanvasPlugin;
