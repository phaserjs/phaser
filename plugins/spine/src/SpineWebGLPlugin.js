/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Class = require('../../../src/utils/Class');
var BaseSpinePlugin = require('./BaseSpinePlugin');
var SpineWebGL = require('SpineWebGL');
var Matrix4 = require('../../../src/math/Matrix4');

/**
 * @classdesc
 * Just the WebGL Runtime.
 *
 * @class SpinePlugin
 * @extends Phaser.Plugins.ScenePlugin
 * @constructor
 * @since 3.16.0
 *
 * @param {Phaser.Scene} scene - A reference to the Scene that has installed this plugin.
 * @param {Phaser.Plugins.PluginManager} pluginManager - A reference to the Phaser Plugin Manager.
 */
var SpineWebGLPlugin = new Class({

    Extends: BaseSpinePlugin,

    initialize:

    function SpineWebGLPlugin (scene, pluginManager)
    {
        console.log('SpineWebGLPlugin created');

        BaseSpinePlugin.call(this, scene, pluginManager, SpineWebGL);

        this.gl;
        this.mvp;
        this.shader;
        this.batcher;
        this.debugRenderer;
        this.debugShader;
    },

    boot: function ()
    {
        var gl = this.game.renderer.gl;

        this.gl = gl;

        this.mvp = new Matrix4();

        //  Create a simple shader, mesh, model-view-projection matrix and SkeletonRenderer.
        this.shader = SpineWebGL.webgl.Shader.newTwoColoredTextured(gl);
        this.batcher = new SpineWebGL.webgl.PolygonBatcher(gl);

        this.skeletonRenderer = new SpineWebGL.webgl.SkeletonRenderer(gl);
        this.skeletonRenderer.premultipliedAlpha = true;

        this.shapes = new SpineWebGL.webgl.ShapeRenderer(gl);

        this.debugRenderer = new SpineWebGL.webgl.SkeletonDebugRenderer(gl);

        this.debugShader = SpineWebGL.webgl.Shader.newColored(gl);
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

        var gl = this.game.renderer.gl;

        var atlas = new SpineWebGL.TextureAtlas(atlasData, function (path)
        {
            return new SpineWebGL.webgl.GLTexture(gl, textures.get(path).getSourceImage());
        });

        return atlas;
    }

});

module.exports = SpineWebGLPlugin;
