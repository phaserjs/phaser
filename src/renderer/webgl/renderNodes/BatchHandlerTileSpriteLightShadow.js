/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2024 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../../utils/Class');
var LightShaderSourceFS = require('../shaders/TileSpriteLightShadow-frag');
var ShaderSourceVS = require('../shaders/MultiTileSprite-vert');
var BatchHandlerTileSpriteLight = require('./BatchHandlerTileSpriteLight');

/**
 * @classdesc
 * The BatchHandlerTileSpriteLightShadow works like
 * @see Phaser.Renderer.WebGL.RenderNodes.BatchHandlerTileSpriteLight
 * to render TileSprite GameObjects with self-shadowing lighting.
 *
 * @class BatchHandlerTileSpriteLightShadow
 * @extends Phaser.Renderer.WebGL.RenderNodes.BatchHandlerQuadLight
 * @memberof Phaser.Renderer.WebGL.RenderNodes
 * @constructor
 * @since 3.90.0
 * @param {Phaser.Renderer.WebGL.RenderNodes.RenderNodeManager} manager - The manager that owns this RenderNode.
 * @param {Phaser.Types.Renderer.WebGL.RenderNodes.BatchHandlerConfig} [config] - The configuration object for this handler.
 */
var BatchHandlerTileSpriteLightShadow = new Class({
    Extends: BatchHandlerTileSpriteLight,

    initialize: function BatchHandlerTileSpriteLightShadow (manager, config)
    {
        BatchHandlerTileSpriteLight.call(this, manager, config);

        /**
         * The threshold at which the diffuse lighting will be considered flat.
         * This is used to derive self-shadowing from the diffuse map.
         *
         * This is a brightness value in the range 0-1.
         * Because art is usually not pure white, the default is 1/3,
         * a darker value, which is more likely to be considered flat.
         * You should adjust this value based on the art in your game.
         *
         * @name Phaser.Renderer.WebGL.RenderNodes.BatchHandlerTileSpriteLightShadow#diffuseFlatThreshold
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
         * @name Phaser.Renderer.WebGL.RenderNodes.BatchHandlerTileSpriteLightShadow#penumbra
         * @type {number}
         * @default 0.5
         * @since 3.90.0
         */
        this.penumbra = 0.5;
    },

    /**
     * The default configuration settings for BatchHandlerTileSpriteLightShadow.
     *
     * @name Phaser.Renderer.WebGL.RenderNodes.BatchHandlerTileSpriteLightShadow#defaultConfig
     * @type {Phaser.Types.Renderer.WebGL.RenderNodes.BatchHandlerConfig}
     * @since 3.90.0
     * @readonly
     */
    defaultConfig: {
        name: 'BatchHandlerTileSpriteLightShadow',
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
                    name: 'inFrame',
                    size: 4
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
     * @method Phaser.Renderer.WebGL.RenderNodes.BatchHandlerTileSpriteLightShadow#onRunBegin
     * @since 3.90.0
     * @param {Phaser.Renderer.WebGL.WebGLPipeline} drawingContext - The drawing context.
     */
    onRunBegin: function (drawingContext)
    {
        BatchHandlerTileSpriteLight.prototype.onRunBegin.call(this, drawingContext);

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

module.exports = BatchHandlerTileSpriteLightShadow;
