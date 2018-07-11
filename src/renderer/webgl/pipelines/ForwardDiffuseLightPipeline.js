/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @author       Felipe Alfonso <@bitnenfer>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Class = require('../../../utils/Class');
var ShaderSourceFS = require('../shaders/ForwardDiffuse-frag.js');
var TextureTintPipeline = require('./TextureTintPipeline');

var LIGHT_COUNT = 10;

/**
 * @classdesc
 * ForwardDiffuseLightPipeline implements a forward rendering approach for 2D lights.
 * This pipeline extends TextureTintPipeline so it implements all it's rendering functions
 * and batching system.
 *
 * @class ForwardDiffuseLightPipeline
 * @extends Phaser.Renderer.WebGL.Pipelines.TextureTintPipeline
 * @memberOf Phaser.Renderer.WebGL.Pipelines
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
     * This function binds its base class resources and this lights 2D resources.
     *
     * @method Phaser.Renderer.WebGL.Pipelines.ForwardDiffuseLightPipeline#onBind
     * @override
     * @since 3.0.0
     * 
     * @param {Phaser.GameObjects.GameObject} [gameObject] - The Game Object that invoked this pipeline, if any.
     *
     * @return {Phaser.Renderer.WebGL.Pipelines.ForwardDiffuseLightPipeline} [description]
     */
    onBind: function (gameObject)
    {
        TextureTintPipeline.prototype.onBind.call(this);

        var renderer = this.renderer;
        var program = this.program;

        this.mvpUpdate();

        renderer.setInt1(program, 'uNormSampler', 1);
        renderer.setFloat2(program, 'uResolution', this.width, this.height);

        if (gameObject)
        {
            this.setNormalMap(gameObject);
        }

        return this;
    },

    /**
     * This function sets all the needed resources for each camera pass.
     *
     * @method Phaser.Renderer.WebGL.Pipelines.ForwardDiffuseLightPipeline#onRender
     * @since 3.0.0
     *
     * @param {Phaser.Scene} scene - [description]
     * @param {Phaser.Cameras.Scene2D.Camera} camera - [description]
     *
     * @return {Phaser.Renderer.WebGL.Pipelines.ForwardDiffuseLightPipeline} [description]
     */
    onRender: function (scene, camera)
    {
        this.active = false;

        var lightManager = scene.sys.lights;

        if (!lightManager || lightManager.lights.length <= 0 || !lightManager.active)
        {
            //  Passthru
            return this;
        }

        var lights = lightManager.cull(camera);
        var lightCount = Math.min(lights.length, LIGHT_COUNT);

        if (lightCount === 0)
        {
            return this;
        }

        this.active = true;

        var renderer = this.renderer;
        var program = this.program;
        var cameraMatrix = camera.matrix;
        var point = {x: 0, y: 0};
        var height = renderer.height;
        var index;

        for (index = 0; index < LIGHT_COUNT; ++index)
        {
            //  Reset lights
            renderer.setFloat1(program, 'uLights[' + index + '].radius', 0);
        }

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
     * Sets the Game Objects normal map as the active texture.
     *
     * @method Phaser.Renderer.WebGL.Pipelines.ForwardDiffuseLightPipeline#setNormalMap
     * @since 3.11.0
     *
     * @param {Phaser.GameObjects.GameObject} gameObject - [description]
     */
    setNormalMap: function (gameObject)
    {
        if (!this.active || !gameObject || !gameObject.texture)
        {
            return;
        }

        // var normalTexture = tilemapLayer.tileset.image.dataSource[0];
        var normalTexture = gameObject.texture.dataSource[gameObject.frame.sourceIndex];

        if (normalTexture)
        {
            this.setTexture2D(normalTexture.glTexture, 1);
        }

        this.renderer.setPipeline(gameObject.defaultPipeline);
    },

    /**
     * [description]
     *
     * @method Phaser.Renderer.WebGL.Pipelines.ForwardDiffuseLightPipeline#batchSprite
     * @since 3.0.0
     *
     * @param {Phaser.GameObjects.Sprite} sprite - [description]
     * @param {Phaser.Cameras.Scene2D.Camera} camera - [description]
     * @param {Phaser.GameObjects.Components.TransformMatrix} parentTransformMatrix - [description]
     *
     */
    batchSprite: function (sprite, camera, parentTransformMatrix)
    {
        if (!this.active)
        {
            return;
        }

        var normalTexture = sprite.texture.dataSource[sprite.frame.sourceIndex];

        if (normalTexture)
        {
            this.renderer.setPipeline(this);

            this.setTexture2D(normalTexture.glTexture, 1);

            TextureTintPipeline.prototype.batchSprite.call(this, sprite, camera, parentTransformMatrix);
        }
    }

});

ForwardDiffuseLightPipeline.LIGHT_COUNT = LIGHT_COUNT;

module.exports = ForwardDiffuseLightPipeline;
