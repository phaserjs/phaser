/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Class = require('../../../src/utils/Class');
var BaseSpinePlugin = require('./BaseSpinePlugin');
var SpineWebGL = require('SpineWebGL');

var runtime;

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

        BaseSpinePlugin.call(this, scene, pluginManager);

        runtime = SpineWebGL;
    },

    boot: function ()
    {
        var gl = this.game.renderer.gl;

        this.gl = gl;

        this.mvp = new SpineWebGL.webgl.Matrix4();

        //  Create a simple shader, mesh, model-view-projection matrix and SkeletonRenderer.
        this.shader = SpineWebGL.webgl.Shader.newTwoColoredTextured(gl);
        this.batcher = new SpineWebGL.webgl.PolygonBatcher(gl);
        this.mvp.ortho2d(0, 0, this.game.renderer.width - 1, this.game.renderer.height - 1);

        this.skeletonRenderer = new SpineWebGL.webgl.SkeletonRenderer(gl);

        this.shapes = new SpineWebGL.webgl.ShapeRenderer(gl);

        // debugRenderer = new spine.webgl.SkeletonDebugRenderer(gl);
        // debugRenderer.drawRegionAttachments = true;
        // debugRenderer.drawBoundingBoxes = true;
        // debugRenderer.drawMeshHull = true;
        // debugRenderer.drawMeshTriangles = true;
        // debugRenderer.drawPaths = true;
        // debugShader = spine.webgl.Shader.newColored(gl);
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

        var gl = this.game.renderer.gl;

        var atlas = new SpineWebGL.TextureAtlas(atlasData, function (path)
        {
            return new SpineWebGL.webgl.GLTexture(gl, textures.get(path).getSourceImage());
        });

        var atlasLoader = new SpineWebGL.AtlasAttachmentLoader(atlas);
        
        var skeletonJson = new SpineWebGL.SkeletonJson(atlasLoader);

        var skeletonData = skeletonJson.readSkeletonData(this.json.get(key));

        var skeleton = new SpineWebGL.Skeleton(skeletonData);
    
        return { skeletonData: skeletonData, skeleton: skeleton };
    },

    getBounds: function (skeleton)
    {
        var offset = new SpineWebGL.Vector2();
        var size = new SpineWebGL.Vector2();

        skeleton.getBounds(offset, size, []);

        return { offset: offset, size: size };
    },

    createAnimationState: function (skeleton)
    {
        var stateData = new SpineWebGL.AnimationStateData(skeleton.data);

        var state = new SpineWebGL.AnimationState(stateData);

        return { stateData: stateData, state: state };
    }

});

module.exports = SpineWebGLPlugin;
