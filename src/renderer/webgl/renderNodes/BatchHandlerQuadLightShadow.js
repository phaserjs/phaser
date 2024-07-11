/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2024 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../../utils/Class');
var LightShaderSourceFS = require('../shaders/LightShadow-frag');
var ShaderSourceVS = require('../shaders/Multi-vert');
var BatchHandlerQuadLight = require('./BatchHandlerQuadLight');

/**
 * @classdesc
 * The BatchHandlerQuadLightShadow is a special type of BatchHandlerQuadLight
 * that supports self-shadowing based on the diffuse map.
 *
 * The shader uses the diffuse map to determine the concavity of the surface.
 * Darker areas are assumed to be more concave, thus they can only receive light
 * from a smaller range of angles. Light outside that range is cut off,
 * creating a shadow.
 *
 * Because most game art wasn't created with these characteristics in mind,
 * you may need to adjust the `diffuseFlatThreshold` and `penumbra` values
 * to get the desired effect.
 *
 * To use this RenderNode in your game, you must set the option
 * `render.selfShadow` to `true` in your game configuration.
 * It will affect all textured objects with lighting enabled
 * (technically, all objects that use the `BatchHandlerQuadLight` RenderNode).
 *
 * Alternatively, you can create a custom RenderNode that uses this handler.
 *
 * @class BatchHandlerQuadLightShadow
 * @extends Phaser.Renderer.WebGL.RenderNodes.BatchHandlerQuadLight
 * @memberof Phaser.Renderer.WebGL.RenderNodes
 * @constructor
 * @since 3.90.0
 * @param {Phaser.Renderer.WebGL.RenderNodes.RenderNodeManager} manager - The manager that owns this RenderNode.
 * @param {Phaser.Types.Renderer.WebGL.RenderNodes.BatchHandlerConfig} [config] - The configuration object for this handler.
 */
var BatchHandlerQuadLightShadow = new Class({
    Extends: BatchHandlerQuadLight,

    initialize: function BatchHandlerQuadLightShadow (manager, config)
    {
        BatchHandlerQuadLight.call(this, manager, config);

        /**
         * The threshold at which the diffuse lighting will be considered flat.
         * This is used to derive self-shadowing from the diffuse map.
         *
         * This is a brightness value in the range 0-1.
         * Because art is usually not pure white, the default is 1/3,
         * a darker value, which is more likely to be considered flat.
         * You should adjust this value based on the art in your game.
         *
         * @name Phaser.Renderer.WebGL.RenderNodes.BatchHandlerQuadLightShadow#diffuseFlatThreshold
         * @type {number}
         * @default 1
         * @since 3.90.0
         */
        this.diffuseFlatThreshold = 1 / 3;

        /**
         * The penumbra value for the shadow.
         * This smooths the edge of self-shadowing.
         * A lower value will create a sharper but more jagged shadow.
         *
         * @name Phaser.Renderer.WebGL.RenderNodes.BatchHandlerQuadLightShadow#penumbra
         * @type {number}
         * @default 0.5
         * @since 3.90.0
         */
        this.penumbra = 0.5;
    },

    /**
     * The default configuration settings for BatchHandlerQuadLightShadow.
     *
     * @name Phaser.Renderer.WebGL.RenderNodes.BatchHandlerQuadLightShadow#defaultConfig
     * @type {Phaser.Types.Renderer.WebGL.RenderNodes.BatchHandlerConfig}
     * @since 3.90.0
     * @readonly
     */
    defaultConfig: {
        name: 'BatchHandlerQuadLight',
        verticesPerInstance: 4,
        indicesPerInstance: 6,
        vertexSource: ShaderSourceVS,
        fragmentSource: LightShaderSourceFS,
        vertexBufferLayout: {
            usage: 'DYNAMIC_DRAW',
            layout: [
                {
                    name: 'inPosition',
                    size: 2
                },
                {
                    name: 'inTexCoord',
                    size: 2
                },
                {
                    name: 'inTintEffect'
                },
                {
                    name: 'inTint',
                    size: 4,
                    type: 'UNSIGNED_BYTE',
                    normalized: true
                }
            ]
        }
    },

    /**
     * Called at the start of the run loop.
     *
     * @method Phaser.Renderer.WebGL.RenderNodes.BatchHandlerQuadLightShadow#onRunBegin
     * @since 3.90.0
     * @param {Phaser.Renderer.WebGL.WebGLPipeline} drawingContext - The drawing context.
     */
    onRunBegin: function (drawingContext)
    {
        BatchHandlerQuadLight.prototype.onRunBegin.call(this, drawingContext);

        var program = this.program;

        program.setUniform(
            'uDiffuseFlatThreshold',
            this.diffuseFlatThreshold * 3
        );

        program.setUniform(
            'uPenumbra',
            this.penumbra
        );
    }
});

module.exports = BatchHandlerQuadLightShadow;
