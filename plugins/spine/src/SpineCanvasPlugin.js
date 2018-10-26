/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Class = require('../../../src/utils/Class');
var BaseSpinePlugin = require('./BaseSpinePlugin');
var SpineCanvas = require('SpineCanvas');

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

        BaseSpinePlugin.call(this, scene, pluginManager, SpineCanvas);
    },

    boot: function ()
    {
        this.skeletonRenderer = new SpineCanvas.canvas.SkeletonRenderer(this.game.context);
    },

    getAtlas: function (key)
    {
        var atlasData = this.cache.get(key);

        if (!atlasData)
        {
            console.warn('No atlas data for: ' + key);
            return;
        }

        var textures = this.textures;

        var atlas = new SpineCanvas.TextureAtlas(atlasData, function (path)
        {
            return new SpineCanvas.canvas.CanvasTexture(textures.get(path).getSourceImage());
        });

        return atlas;
    }

});

module.exports = SpineCanvasPlugin;
