/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Class = require('../../../utils/Class');
var ShaderSourceFS = require('../shaders/ForwardDiffuse.frag');
var TextureTintPipeline = require('./TextureTintPipeline');

var LIGHT_COUNT = 10;

/**
 * @classdesc
 * [description]
 *
 * @class ForwardDiffuseLightPipeline
 * @extends Phaser.Renderer.WebGL.TextureTintPipeline
 * @memberOf Phaser.Renderer.WebGL
 * @constructor
 * @since 3.0.0
 *
 * @param {object} config - [description]
 */
var ForwardDiffuseLightPipeline = new Class({

    Extends: TextureTintPipeline,

    initialize:

    function ForwardDiffuseLightPipeline (config)
    {
        config.fragShader = ShaderSourceFS.replace('%LIGHT_COUNT%', LIGHT_COUNT.toString());

        TextureTintPipeline.call(this, config);
    },

    /**
     * [description]
     *
     * @method Phaser.Renderer.WebGL.ForwardDiffuseLightPipeline#onBind
     * @since 3.0.0
     *
     * @return {Phaser.Renderer.WebGL.ForwardDiffuseLightPipeline} [description]
     */
    onBind: function ()
    {
        TextureTintPipeline.prototype.onBind.call(this);

        var renderer = this.renderer;
        var program = this.program;

        this.mvpUpdate();

        renderer.setInt1(program, 'uNormSampler', 1);
        renderer.setFloat2(program, 'uResolution', this.width, this.height);

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.Renderer.WebGL.ForwardDiffuseLightPipeline#onRender
     * @since 3.0.0
     *
     * @param {Phaser.Scene} scene - [description]
     * @param {Phaser.Cameras.Scene2D.Camera} camera - [description]
     *
     * @return {Phaser.Renderer.WebGL.ForwardDiffuseLightPipeline} [description]
     */
    onRender: function (scene, camera)
    {
        var lightManager = scene.sys.lights;

        if (!lightManager)
        {
            return this;
        }

        lightManager.culledLights.length = 0;

        if (lightManager.lights.length <= 0 || !lightManager.active)
        {
            return this; // If not visible lights just passthrough
        }

        var renderer = this.renderer;
        var program = this.program;
        var lights = lightManager.cull(camera);
        var lightCount = Math.min(lights.length, LIGHT_COUNT);
        var cameraMatrix = camera.matrix;
        var point = {x: 0, y: 0};
        var height = renderer.height;
        var index;

        for (index = 0; index < LIGHT_COUNT; ++index)
        {
            renderer.setFloat1(program, 'uLights[' + index + '].radius', 0); // reset lights
        }

        if (lightCount <= 0) { return this; }

        renderer.setFloat4(program, 'uCamera', camera.x, camera.y, camera.rotation, camera.zoom);
        renderer.setFloat3(program, 'uAmbientLightColor', lightManager.ambientColor.r, lightManager.ambientColor.g, lightManager.ambientColor.b);

        for (index = 0; index < lightCount; ++index)
        {
            var light = lights[index];
            var lightName = 'uLights[' + index + '].';
            cameraMatrix.transformPoint(light.x, light.y, point);
            renderer.setFloat2(program, lightName + 'position', point.x - (camera.scrollX * light.scrollFactorX * camera.zoom), height - (point.y - (camera.scrollY * light.scrollFactorY) * camera.zoom));
            renderer.setFloat3(program, lightName + 'color', light.r, light.g, light.b);
            renderer.setFloat1(program, lightName + 'intensity', light.intensity);
            renderer.setFloat1(program, lightName + 'radius', light.radius);
        }
        
        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.Renderer.WebGL.ForwardDiffuseLightPipeline#drawStaticTilemapLayer
     * @since 3.0.0
     *
     * @param {Phaser.Tilemaps.StaticTilemapLayer} tilemap - [description]
     * @param {Phaser.Cameras.Scene2D.Camera} camera - [description]
     *
     */
    drawStaticTilemapLayer: function (tilemap, camera)
    {
        var normalTexture = tilemap.texture.dataSource[0];

        if (normalTexture)
        {
            this.renderer.setPipeline(this);
            this.setTexture2D(normalTexture.glTexture, 1);
            TextureTintPipeline.prototype.drawStaticTilemapLayer.call(this, tilemap, camera);
        }
        else
        {
            console.warn('Normal map texture missing for using Light2D pipeline. StaticTilemapLayer rendered with default pipeline.');
            this.renderer.pipelines.TextureTintPipeline.drawStaticTilemapLayer(tilemap, camera);
        }
    },

    /**
     * [description]
     *
     * @method Phaser.Renderer.WebGL.ForwardDiffuseLightPipeline#drawEmitterManager
     * @since 3.0.0
     *
     * @param {Phaser.GameObjects.Particles.ParticleEmitterManager} emitterManager - [description]
     * @param {Phaser.Cameras.Scene2D.Camera} camera - [description]
     *
     */
    drawEmitterManager: function (emitterManager, camera)
    {
        var normalTexture = emitterManager.texture.dataSource[0];

        if (normalTexture)
        {
            this.renderer.setPipeline(this);
            this.setTexture2D(normalTexture.glTexture, 1);
            TextureTintPipeline.prototype.drawEmitterManager.call(this, emitterManager, camera);
        }
        else
        {
            console.warn('Normal map texture missing for using Light2D pipeline. EmitterManager rendered with default pipeline.');
            this.renderer.pipelines.TextureTintPipeline.drawEmitterManager(emitterManager, camera);
        }
    },

    /**
     * [description]
     *
     * @method Phaser.Renderer.WebGL.ForwardDiffuseLightPipeline#drawBlitter
     * @since 3.0.0
     *
     * @param {Phaser.GameObjects.Blitter} blitter - [description]
     * @param {Phaser.Cameras.Scene2D.Camera} camera - [description]
     *
     */
    drawBlitter: function (blitter, camera)
    {
        var normalTexture = blitter.texture.dataSource[0];

        if (normalTexture)
        {
            this.renderer.setPipeline(this);
            this.setTexture2D(normalTexture.glTexture, 1);
            TextureTintPipeline.prototype.drawBlitter.call(this, blitter, camera);
        }
        else
        {
            console.warn('Normal map texture missing for using Light2D pipeline. Blitter rendered with default pipeline.');
            this.renderer.pipelines.TextureTintPipeline.drawBlitter(blitter, camera);
        }
    },

    /**
     * [description]
     *
     * @method Phaser.Renderer.WebGL.ForwardDiffuseLightPipeline#batchSprite
     * @since 3.0.0
     *
     * @param {Phaser.GameObjects.Sprite} sprite - [description]
     * @param {Phaser.Cameras.Scene2D.Camera} camera - [description]
     *
     */
    batchSprite: function (sprite, camera)
    {
        var normalTexture = sprite.texture.dataSource[0];

        if (normalTexture)
        {
            this.renderer.setPipeline(this);
            this.setTexture2D(normalTexture.glTexture, 1);
            TextureTintPipeline.prototype.batchSprite.call(this, sprite, camera);
        }
        else
        {
            console.warn('Normal map texture missing for using Light2D pipeline. Sprite rendered with default pipeline.');
            this.renderer.pipelines.TextureTintPipeline.batchSprite(sprite, camera);
        }
    },

    /**
     * [description]
     *
     * @method Phaser.Renderer.WebGL.ForwardDiffuseLightPipeline#batchMesh
     * @since 3.0.0
     *
     * @param {Phaser.GameObjects.Mesh} mesh - [description]
     * @param {Phaser.Cameras.Scene2D.Camera} camera - [description]
     *
     */
    batchMesh: function (mesh, camera)
    {
        var normalTexture = mesh.texture.dataSource[0];

        if (normalTexture)
        {
            this.renderer.setPipeline(this);
            this.setTexture2D(normalTexture.glTexture, 1);
            TextureTintPipeline.prototype.batchMesh.call(this, mesh, camera);
        }
        else
        {
            console.warn('Normal map texture missing for using Light2D pipeline. Mesh rendered with default pipeline.');
            this.renderer.pipelines.TextureTintPipeline.batchMesh(mesh, camera);

        }
    },

    /**
     * [description]
     *
     * @method Phaser.Renderer.WebGL.ForwardDiffuseLightPipeline#batchBitmapText
     * @since 3.0.0
     *
     * @param {Phaser.GameObjects.BitmapText} bitmapText - [description]
     * @param {Phaser.Cameras.Scene2D.Camera} camera - [description]
     *
     */
    batchBitmapText: function (bitmapText, camera)
    {
        var normalTexture = bitmapText.texture.dataSource[0];

        if (normalTexture)
        {
            this.renderer.setPipeline(this);
            this.setTexture2D(normalTexture.glTexture, 1);
            TextureTintPipeline.prototype.batchBitmapText.call(this, bitmapText, camera);
        }
        else
        {
            console.warn('Normal map texture missing for using Light2D pipeline. BitmapText rendered with default pipeline.');
            this.renderer.pipelines.TextureTintPipeline.batchBitmapText(bitmapText, camera);
        }
    },

    /**
     * [description]
     *
     * @method Phaser.Renderer.WebGL.ForwardDiffuseLightPipeline#batchDynamicBitmapText
     * @since 3.0.0
     *
     * @param {Phaser.GameObjects.DynamicBitmapText} bitmapText - [description]
     * @param {Phaser.Cameras.Scene2D.Camera} camera - [description]
     *
     */
    batchDynamicBitmapText: function (bitmapText, camera)
    {
        var normalTexture = bitmapText.texture.dataSource[0];

        if (normalTexture)
        {
            this.renderer.setPipeline(this);
            this.setTexture2D(normalTexture.glTexture, 1);
            TextureTintPipeline.prototype.batchDynamicBitmapText.call(this, bitmapText, camera);
        }
        else
        {
            console.warn('Normal map texture missing for using Light2D pipeline. DynamicBitmapText rendered with default pipeline.');
            this.renderer.pipelines.TextureTintPipeline.batchDynamicBitmapText(bitmapText, camera);
        }
    },

    /**
     * [description]
     *
     * @method Phaser.Renderer.WebGL.ForwardDiffuseLightPipeline#batchText
     * @since 3.0.0
     *
     * @param {Phaser.GameObjects.Text} text - [description]
     * @param {Phaser.Cameras.Scene2D.Camera} camera - [description]
     *
     */
    batchText: function (text, camera)
    {
        var normalTexture = text.texture.dataSource[0];

        if (normalTexture)
        {
            this.renderer.setPipeline(this);
            this.setTexture2D(normalTexture.glTexture, 1);
            TextureTintPipeline.prototype.batchText.call(this, text, camera);
        }
        else
        {
            console.warn('Normal map texture missing for using Light2D pipeline. Text rendered with default pipeline.');
            this.renderer.pipelines.TextureTintPipeline.batchText(text, camera);
        }
    },

    /**
     * [description]
     *
     * @method Phaser.Renderer.WebGL.ForwardDiffuseLightPipeline#batchDynamicTilemapLayer
     * @since 3.0.0
     *
     * @param {Phaser.Tilemaps.DynamicTilemapLayer} tilemapLayer - [description]
     * @param {Phaser.Cameras.Scene2D.Camera} camera - [description]
     *
     */
    batchDynamicTilemapLayer: function (tilemapLayer, camera)
    {
        var normalTexture = tilemapLayer.texture.dataSource[0];

        if (normalTexture)
        {
            this.renderer.setPipeline(this);
            this.setTexture2D(normalTexture.glTexture, 1);
            TextureTintPipeline.prototype.batchDynamicTilemapLayer.call(this, tilemapLayer, camera);
        }
        else
        {
            console.warn('Normal map texture missing for using Light2D pipeline. DynamicTilemapLayer rendered with default pipeline.');
            this.renderer.pipelines.TextureTintPipeline.batchDynamicTilemapLayer(tilemapLayer, camera);
        }
    },

    /**
     * [description]
     *
     * @method Phaser.Renderer.WebGL.ForwardDiffuseLightPipeline#batchTileSprite
     * @since 3.0.0
     *
     * @param {Phaser.GameObjects.TileSprite} tileSprite - [description]
     * @param {Phaser.Cameras.Scene2D.Camera} camera - [description]
     *
     */
    batchTileSprite: function (tileSprite, camera)
    {
        var normalTexture = tileSprite.texture.dataSource[0];

        if (normalTexture)
        {
            this.renderer.setPipeline(this);
            this.setTexture2D(normalTexture.glTexture, 1);
            TextureTintPipeline.prototype.batchTileSprite.call(this, tileSprite, camera);
        }
        else
        {
            console.warn('Normal map texture missing for using Light2D pipeline. TileSprite rendered with default pipeline.');
            this.renderer.pipelines.TextureTintPipeline.batchTileSprite(tileSprite, camera);
        }
    }

});

ForwardDiffuseLightPipeline.LIGHT_COUNT = LIGHT_COUNT;

module.exports = ForwardDiffuseLightPipeline;
