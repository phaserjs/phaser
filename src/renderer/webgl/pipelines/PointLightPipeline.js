/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2022 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../../utils/Class');
var GetFastValue = require('../../../utils/object/GetFastValue');
var PointLightShaderSourceFS = require('../shaders/PointLight-frag.js');
var PointLightShaderSourceVS = require('../shaders/PointLight-vert.js');
var WebGLPipeline = require('../WebGLPipeline');

/**
 * @classdesc
 * The Point Light Pipeline handles rendering the Point Light Game Objects in WebGL.
 *
 * The fragment shader it uses can be found in `shaders/src/PointLight.frag`.
 * The vertex shader it uses can be found in `shaders/src/PointLight.vert`.
 *
 * The default shader attributes for this pipeline are:
 *
 * `inPosition` (vec2)
 * `inLightPosition` (vec2)
 * `inLightRadius` (float)
 * `inLightAttenuation` (float)
 * `inLightColor` (vec4)
 *
 * The default shader uniforms for this pipeline are:
 *
 * `uProjectionMatrix` (mat4)
 * `uResolution` (vec2)
 * `uCameraZoom` (sampler2D)
 *
 * @class PointLightPipeline
 * @extends Phaser.Renderer.WebGL.WebGLPipeline
 * @memberof Phaser.Renderer.WebGL.Pipelines
 * @constructor
 * @since 3.50.0
 *
 * @param {Phaser.Types.Renderer.WebGL.WebGLPipelineConfig} config - The configuration options for this pipeline.
 */
var PointLightPipeline = new Class({

    Extends: WebGLPipeline,

    initialize:

    function PointLightPipeline (config)
    {
        config.vertShader = GetFastValue(config, 'vertShader', PointLightShaderSourceVS);
        config.fragShader = GetFastValue(config, 'fragShader', PointLightShaderSourceFS);
        config.attributes = GetFastValue(config, 'attributes', [
            {
                name: 'inPosition',
                size: 2
            },
            {
                name: 'inLightPosition',
                size: 2
            },
            {
                name: 'inLightRadius'
            },
            {
                name: 'inLightAttenuation'
            },
            {
                name: 'inLightColor',
                size: 4
            }
        ]);

        WebGLPipeline.call(this, config);
    },

    onRender: function (scene, camera)
    {
        this.set2f('uResolution', this.width, this.height);
        this.set1f('uCameraZoom', camera.zoom);
    },

    /**
     * Adds a Point Light Game Object to the batch, flushing if required.
     *
     * @method Phaser.Renderer.WebGL.Pipelines.PointLightPipeline#batchPointLight
     * @since 3.50.0
     *
     * @param {Phaser.GameObjects.PointLight} light - The Point Light Game Object.
     * @param {Phaser.Cameras.Scene2D.Camera} camera - The camera rendering the Point Light.
     * @param {number} x0 - The top-left x position.
     * @param {number} y0 - The top-left y position.
     * @param {number} x1 - The bottom-left x position.
     * @param {number} y1 - The bottom-left y position.
     * @param {number} x2 - The bottom-right x position.
     * @param {number} y2 - The bottom-right y position.
     * @param {number} x3 - The top-right x position.
     * @param {number} y3 - The top-right y position.
     * @param {number} lightX - The horizontal center of the light.
     * @param {number} lightY - The vertical center of the light.
     */
    batchPointLight: function (light, camera, x0, y0, x1, y1, x2, y2, x3, y3, lightX, lightY)
    {
        var color = light.color;
        var intensity = light.intensity;
        var radius = light.radius;
        var attenuation = light.attenuation;

        var r = color.r * intensity;
        var g = color.g * intensity;
        var b = color.b * intensity;
        var a = camera.alpha * light.alpha;

        if (this.shouldFlush(6))
        {
            this.flush();
        }

        if (!this.currentBatch)
        {
            this.setTexture2D();
        }

        this.batchLightVert(x0, y0, lightX, lightY, radius, attenuation, r, g, b, a);
        this.batchLightVert(x1, y1, lightX, lightY, radius, attenuation, r, g, b, a);
        this.batchLightVert(x2, y2, lightX, lightY, radius, attenuation, r, g, b, a);
        this.batchLightVert(x0, y0, lightX, lightY, radius, attenuation, r, g, b, a);
        this.batchLightVert(x2, y2, lightX, lightY, radius, attenuation, r, g, b, a);
        this.batchLightVert(x3, y3, lightX, lightY, radius, attenuation, r, g, b, a);

        this.currentBatch.count = (this.vertexCount - this.currentBatch.start);
    },

    /**
     * Adds a single Point Light vertex to the current vertex buffer and increments the
     * `vertexCount` property by 1.
     *
     * This method is called directly by `batchPointLight`.
     *
     * @method Phaser.Renderer.WebGL.Pipelines.PointLightPipeline#batchLightVert
     * @since 3.50.0
     *
     * @param {number} x - The vertex x position.
     * @param {number} y - The vertex y position.
     * @param {number} lightX - The horizontal center of the light.
     * @param {number} lightY - The vertical center of the light.
     * @param {number} radius - The radius of the light.
     * @param {number} attenuation - The attenuation of the light.
     * @param {number} r - The red color channel of the light.
     * @param {number} g - The green color channel of the light.
     * @param {number} b - The blue color channel of the light.
     * @param {number} a - The alpha color channel of the light.
     */
    batchLightVert: function (x, y, lightX, lightY, radius, attenuation, r, g, b, a)
    {
        var vertexViewF32 = this.vertexViewF32;

        var vertexOffset = (this.vertexCount * this.currentShader.vertexComponentCount) - 1;

        vertexViewF32[++vertexOffset] = x;
        vertexViewF32[++vertexOffset] = y;
        vertexViewF32[++vertexOffset] = lightX;
        vertexViewF32[++vertexOffset] = lightY;
        vertexViewF32[++vertexOffset] = radius;
        vertexViewF32[++vertexOffset] = attenuation;
        vertexViewF32[++vertexOffset] = r;
        vertexViewF32[++vertexOffset] = g;
        vertexViewF32[++vertexOffset] = b;
        vertexViewF32[++vertexOffset] = a;

        this.vertexCount++;
    }

});

module.exports = PointLightPipeline;
