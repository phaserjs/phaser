var Class = require('../../../utils/Class');
var WebGLPipeline = require('../WebGLPipeline');
var Utils = require('../Utils');
var TextureTintPipeline = require('./TextureTintPipeline');
var ShaderSourceFS = require('../shaders/ForwardDiffuse.frag');
var LIGHT_COUNT = 10;

var ForwardDiffuseLightPipeline = new Class({

    Extends: TextureTintPipeline,

    initialize:

    function ForwardDiffuseLightPipeline(game, gl, renderer)
    {
        TextureTintPipeline.call(this, game, gl, renderer, ShaderSourceFS.replace('%LIGHT_COUNT%', LIGHT_COUNT.toString()));
    },

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

    onRender: function (scene, camera)
    {
        var renderer = this.renderer;
        var program = this.program;
        var lightManager = scene.lights;
        var lights = scene.lights.cull(camera);
        var lightCount = Math.min(lights.length, LIGHT_COUNT);
        var cameraMatrix = camera.matrix;
        var point = {x: 0, y: 0};
        var height = renderer.height;

        if (lightCount <= 0) return; // If not visible lights just passthrough

        renderer.setFloat4(program, 'uCamera', camera.x, camera.y, camera.rotation, camera.zoom);
        renderer.setFloat3(program, 'uAmbientLightColor', lightManager.ambientColor.r, lightManager.ambientColor.g, lightManager.ambientColor.b);

        for (var index = 0; index < lightCount; ++index)
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

    drawStaticTilemapLayer: function (tilemap, camera)
    {
        var normalTexture = tilemap.texture.dataSource[0];

        if (normalTexture)
        {
            return TextureTintPipeline.prototype.drawStaticTilemapLayer.call(this, tilemap, camera);
        }
        else
        {
            console.warn('Normal map texture missing for using Light2D pipeline. StaticTilemapLayer rendered with default pipeline.');
            return this.renderer.pipelines.TextureTintPipeline.drawStaticTilemapLayer(tilemap, camera);
        }
    },

    drawEmitterManager: function (emitterManager, camera)
    {
        var normalTexture = emitterManager.texture.dataSource[0];

        if (normalTexture)
        {
            return TextureTintPipeline.prototype.drawEmitterManager.call(this, emitterManager, camera);
        }
        else
        {
            console.warn('Normal map texture missing for using Light2D pipeline. EmitterManager rendered with default pipeline.');
            return this.renderer.pipelines.TextureTintPipeline.drawEmitterManager(emitterManager, camera);
        }
    },

    drawBlitter: function (blitter, camera)
    {
        var normalTexture = blitter.texture.dataSource[0];

        if (normalTexture)
        {
            return TextureTintPipeline.prototype.drawBlitter.call(this, blitter, camera);
        }
        else
        {
            console.warn('Normal map texture missing for using Light2D pipeline. Blitter rendered with default pipeline.');
            return this.renderer.pipelines.TextureTintPipeline.drawBlitter(blitter, camera);
        }
    },

    batchSprite: function (sprite, camera)
    {
        var normalTexture = sprite.texture.dataSource[0];

        if (normalTexture)
        {
            this.renderer.setTexture2D(normalTexture.glTexture, 1);
            return TextureTintPipeline.prototype.batchSprite.call(this, sprite, camera);
        }
        else
        {
            console.warn('Normal map texture missing for using Light2D pipeline. Sprite rendered with default pipeline.');
            return this.renderer.pipelines.TextureTintPipeline.batchSprite(sprite, camera);
        }
    },

    batchMesh: function (mesh, camera)
    {
        var normalTexture = mesh.texture.dataSource[0];

        if (normalTexture)
        {
            this.renderer.setTexture2D(normalTexture.glTexture, 1);
            return TextureTintPipeline.prototype.batchMesh.call(this, mesh, camera);
        }
        else
        {
            console.warn('Normal map texture missing for using Light2D pipeline. Mesh rendered with default pipeline.');
            return this.renderer.pipelines.TextureTintPipeline.batchMesh(mesh, camera);

        }
    },

    batchBitmapText: function (bitmapText, camera)
    {
        var normalTexture = bitmapText.texture.dataSource[0];

        if (normalTexture)
        {
            return TextureTintPipeline.prototype.batchBitmapText.call(this, bitmapText, camera);
        }
        else
        {
            console.warn('Normal map texture missing for using Light2D pipeline. BitmapText rendered with default pipeline.');
            return this.renderer.pipelines.TextureTintPipeline.batchBitmapText(bitmapText, camera);
        }
    },

    batchDynamicBitmapText: function (bitmapText, camera)
    {
        var normalTexture = bitmapText.texture.dataSource[0];

        if (normalTexture)
        {
            return TextureTintPipeline.prototype.batchDynamicBitmapText.call(this, bitmapText, camera);
        }
        else
        {
            console.warn('Normal map texture missing for using Light2D pipeline. DynamicBitmapText rendered with default pipeline.');
            return this.renderer.pipelines.TextureTintPipeline.batchDynamicBitmapText(bitmapText, camera);
        }
    },

    batchText: function (text, camera)
    {
        var normalTexture = text.texture.dataSource[0];

        if (normalTexture)
        {
            return TextureTintPipeline.prototype.batchText.call(this, text, camera);
        }
        else
        {
            console.warn('Normal map texture missing for using Light2D pipeline. Text rendered with default pipeline.');
            return this.renderer.pipelines.TextureTintPipeline.batchText(text, camera);
        }
    },

    batchDynamicTilemapLayer: function (tilemapLayer, camera)
    {
        var normalTexture = tilemapLayer.texture.dataSource[0];

        if (normalTexture)
        {
            return TextureTintPipeline.prototype.batchDynamicTilemapLayer.call(this, tilemapLayer, camera);
        }
        else
        {
            console.warn('Normal map texture missing for using Light2D pipeline. DynamicTilemapLayer rendered with default pipeline.');
            return this.renderer.pipelines.TextureTintPipeline.batchDynamicTilemapLayer(tilemapLayer, camera);
        }
    },

    batchTileSprite: function (tileSprite, camera)
    {
        var normalTexture = tileSprite.texture.dataSource[0];

        if (normalTexture)
        {
            return TextureTintPipeline.prototype.batchTileSprite.call(this, tileSprite, camera);
        }
        else
        {
            console.warn('Normal map texture missing for using Light2D pipeline. TileSprite rendered with default pipeline.');
            return this.renderer.pipelines.TextureTintPipeline.batchTileSprite(tileSprite, camera);
        }
    }

});

module.exports = ForwardDiffuseLightPipeline;
