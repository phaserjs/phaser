/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2024 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../../utils/Class');
var ShaderSourceFS = require('../shaders/Multi-frag');
var ShaderSourceVS = require('../shaders/Multi-vert');
var MakeApplyLighting = require('../shaders/configs/MakeApplyLighting');
var MakeApplyTint = require('../shaders/configs/MakeApplyTint');
var MakeDefineLights = require('../shaders/configs/MakeDefineLights');
var MakeDefineTexCount = require('../shaders/configs/MakeDefineTexCount');
var MakeGetNormalFromMap = require('../shaders/configs/MakeGetNormalFromMap');
var MakeGetTexCoordOut = require('../shaders/configs/MakeGetTexCoordOut');
var MakeGetTexRes = require('../shaders/configs/MakeGetTexRes');
var MakeGetTexture = require('../shaders/configs/MakeGetTexture');
var MakeOutFrame = require('../shaders/configs/MakeOutFrame');
var MakeOutInverseRotation = require('../shaders/configs/MakeOutInverseRotation');
var MakeRotationDatum = require('../shaders/configs/MakeRotationDatum');
var MakeSmoothPixelArt = require('../shaders/configs/MakeSmoothPixelArt');
var MakeTexCoordFrameClamp = require('../shaders/configs/MakeTexCoordFrameClamp');
var MakeTexCoordFrameWrap = require('../shaders/configs/MakeTexCoordFrameWrap');
var BatchHandlerQuad = require('./BatchHandlerQuad');

/**
 * @classdesc
 * This RenderNode handles batch rendering of TileSprites and Tiles.
 * It supplies shaders with knowledge of the frame and texture data,
 * which can be used to handle texture borders more intelligently.
 *
 * @class BatchHandlerTileSprite
 * @memberof Phaser.Renderer.WebGL.RenderNodes
 * @constructor
 * @since 3.90.0
 * @extends Phaser.Renderer.WebGL.RenderNodes.BatchHandlerQuad
 * @param {Phaser.Renderer.WebGL.RenderNodes.RenderNodeManager} manager - The manager that owns this RenderNode.
 * @param {Phaser.Types.Renderer.WebGL.RenderNodes.BatchHandlerConfig} [config] - The configuration object for this handler.
 */
var BatchHandlerTileSprite = new Class({
    Extends: BatchHandlerQuad,

    initialize: function BatchHandlerTileSprite (manager, config)
    {
        BatchHandlerQuad.call(this, manager, config);
    },

    defaultConfig: {
        name: 'BatchHandlerTileSprite',
        verticesPerInstance: 4,
        indicesPerInstance: 6,
        shaderName: 'TILESPRITE',
        vertexSource: ShaderSourceVS,
        fragmentSource: ShaderSourceFS,
        shaderAdditions: [
            MakeOutFrame(),
            MakeGetTexCoordOut(),
            MakeGetTexRes(true),
            MakeTexCoordFrameWrap(true),
            MakeTexCoordFrameClamp(true),
            MakeSmoothPixelArt(true),
            MakeDefineTexCount(1),
            MakeGetTexture(),
            MakeApplyTint(),
            MakeDefineLights(true),
            MakeRotationDatum(true),
            MakeOutInverseRotation(true),
            MakeGetNormalFromMap(true),
            MakeApplyLighting(true)
        ],
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
                    name: 'inTexDatum'
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

    updateRenderOptions: function (renderOptions)
    {
        BatchHandlerQuad.prototype.updateRenderOptions.call(this, renderOptions);

        var newRenderOptions = this.nextRenderOptions;

        newRenderOptions.clampFrame = !!renderOptions.clampFrame;
        newRenderOptions.wrapFrame = !!renderOptions.wrapFrame;

        // Enable texture resolution data if not already available.
        newRenderOptions.texRes = newRenderOptions.clampFrame || newRenderOptions.texRes;
    },

    updateShaderConfig: function ()
    {
        BatchHandlerQuad.prototype.updateShaderConfig.call(this);

        var programManager = this.programManager;
        var oldRenderOptions = this.renderOptions;
        var newRenderOptions = this.nextRenderOptions;

        if (newRenderOptions.clampFrame !== oldRenderOptions.clampFrame)
        {
            var clampFrame = newRenderOptions.clampFrame;
            oldRenderOptions.clampFrame = clampFrame;

            var clampAddition = programManager.getAddition('TexCoordFrameClamp');
            clampAddition.disable = !newRenderOptions.clampFrame;
        }

        if (newRenderOptions.wrapFrame !== oldRenderOptions.wrapFrame)
        {
            var wrapFrame = newRenderOptions.wrapFrame;
            oldRenderOptions.wrapFrame = wrapFrame;

            var wrapAddition = programManager.getAddition('TexCoordFrameWrap');
            wrapAddition.disable = !wrapFrame;
        }
    },

    /**
     * Add a quad to the batch.
     *
     * @method Phaser.Renderer.WebGL.RenderNodes.BatchHandlerTileSprite#batch
     * @since 3.90.0
     * @param {Phaser.Renderer.WebGL.DrawingContext} drawingContext - The current drawing context.
     * @param {Phaser.Renderer.WebGL.WebGLTextureWrapper} glTexture - The texture to render.
     * @param {number} x0 - The x-coordinate of the top-left corner.
     * @param {number} y0 - The y-coordinate of the top-left corner.
     * @param {number} x1 - The x-coordinate of the bottom-left corner.
     * @param {number} y1 - The y-coordinate of the bottom-left corner.
     * @param {number} x2 - The x-coordinate of the top-right corner.
     * @param {number} y2 - The y-coordinate of the top-right corner.
     * @param {number} x3 - The x-coordinate of the bottom-right corner.
     * @param {number} y3 - The y-coordinate of the bottom-right corner.
     * @param {number} texX - The left u coordinate (0-1).
     * @param {number} texY - The top v coordinate (0-1).
     * @param {number} texWidth - The width of the texture (0-1).
     * @param {number} texHeight - The height of the texture (0-1).
     * @param {number} u0 - The u coordinate of the distorted top-left corner.
     * @param {number} v0 - The v coordinate of the distorted top-left corner.
     * @param {number} u1 - The u coordinate of the distorted bottom-left corner.
     * @param {number} v1 - The v coordinate of the distorted bottom-left corner.
     * @param {number} u2 - The u coordinate of the distorted top-right corner.
     * @param {number} v2 - The v coordinate of the distorted top-right corner.
     * @param {number} u3 - The u coordinate of the distorted bottom-right corner.
     * @param {number} v3 - The v coordinate of the distorted bottom-right corner.
     * @param {number} tintFill - Whether to tint the fill color.
     * @param {number} tintTL - The tint color for the top-left corner.
     * @param {number} tintBL - The tint color for the bottom-left corner.
     * @param {number} tintTR - The tint color for the top-right corner.
     * @param {number} tintBR - The tint color for the bottom-right corner.
     * @param {object} renderOptions - Optional render features.
     * @param {boolean} [renderOptions.multiTexturing] - Whether to use multi-texturing.
     * @param {object} [renderOptions.lighting] - How to treat lighting. If this object is defined, lighting will be activated, and multi-texturing disabled.
     * @param {Phaser.Renderer.WebGL.WebGLTextureWrapper} renderOptions.lighting.normalGLTexture - The normal map texture to render.
     * @param {number} renderOptions.lighting.normalMapRotation - The rotation of the normal map texture.
     * @param {object} [renderOptions.lighting.selfShadow] - Self-shadowing options.
     * @param {boolean} renderOptions.lighting.selfShadow.enabled - Whether to use self-shadowing.
     * @param {number} renderOptions.lighting.selfShadow.penumbra - Self-shadowing penumbra strength.
     * @param {number} renderOptions.lighting.selfShadow.diffuseFlatThreshold - Self-shadowing texture brightness equivalent to a flat surface.
     * @param {boolean} [renderOptions.smoothPixelArt] - Whether to use the smooth pixel art algorithm.
     * @param {boolean} [renderOptions.clampFrame] - Whether to clamp the texture frame. This prevents bleeding due to linear filtering. It is mostly useful for tiles.
     * @param {boolean} [renderOptions.wrapFrame] - Whether to wrap the texture frame. This is necessary for TileSprites.
     */
    batch: function (
        drawingContext,
        glTexture,
        x0, y0, x1, y1, x2, y2, x3, y3,
        texX, texY, texWidth, texHeight,
        u0, v0, u1, v1, u2, v2, u3, v3,
        tintFill,
        tintTL, tintBL, tintTR, tintBR,
        renderOptions
    )
    {
        if (this.instanceCount === 0)
        {
            this.manager.setCurrentBatchNode(this, drawingContext);
        }

        // Check render options and run the batch if they differ.
        this.updateRenderOptions(renderOptions);
        this.applyRenderOptions(drawingContext);

        // Process textures and get relevant data.
        var textureDatum = this.batchTextures(glTexture, renderOptions);

        // Update the vertex buffer.
        var vertexOffset32 = this.instanceCount * this.floatsPerInstance;
        var vertexBuffer = this.vertexBufferLayout.buffer;
        var vertexViewF32 = vertexBuffer.viewF32;
        var vertexViewU32 = vertexBuffer.viewU32;

        // Bottom-left
        vertexViewF32[vertexOffset32++] = x1;
        vertexViewF32[vertexOffset32++] = y1;
        vertexViewF32[vertexOffset32++] = u1;
        vertexViewF32[vertexOffset32++] = v1;
        vertexViewF32[vertexOffset32++] = texX;
        vertexViewF32[vertexOffset32++] = texY;
        vertexViewF32[vertexOffset32++] = texWidth;
        vertexViewF32[vertexOffset32++] = texHeight;
        vertexViewF32[vertexOffset32++] = textureDatum;
        vertexViewF32[vertexOffset32++] = tintFill;
        vertexViewU32[vertexOffset32++] = tintBL;

        // Top-left
        vertexViewF32[vertexOffset32++] = x0;
        vertexViewF32[vertexOffset32++] = y0;
        vertexViewF32[vertexOffset32++] = u0;
        vertexViewF32[vertexOffset32++] = v0;
        vertexViewF32[vertexOffset32++] = texX;
        vertexViewF32[vertexOffset32++] = texY;
        vertexViewF32[vertexOffset32++] = texWidth;
        vertexViewF32[vertexOffset32++] = texHeight;
        vertexViewF32[vertexOffset32++] = textureDatum;
        vertexViewF32[vertexOffset32++] = tintFill;
        vertexViewU32[vertexOffset32++] = tintTL;

        // Bottom-right
        vertexViewF32[vertexOffset32++] = x3;
        vertexViewF32[vertexOffset32++] = y3;
        vertexViewF32[vertexOffset32++] = u3;
        vertexViewF32[vertexOffset32++] = v3;
        vertexViewF32[vertexOffset32++] = texX;
        vertexViewF32[vertexOffset32++] = texY;
        vertexViewF32[vertexOffset32++] = texWidth;
        vertexViewF32[vertexOffset32++] = texHeight;
        vertexViewF32[vertexOffset32++] = textureDatum;
        vertexViewF32[vertexOffset32++] = tintFill;
        vertexViewU32[vertexOffset32++] = tintBR;

        // Top-right
        vertexViewF32[vertexOffset32++] = x2;
        vertexViewF32[vertexOffset32++] = y2;
        vertexViewF32[vertexOffset32++] = u2;
        vertexViewF32[vertexOffset32++] = v2;
        vertexViewF32[vertexOffset32++] = texX;
        vertexViewF32[vertexOffset32++] = texY;
        vertexViewF32[vertexOffset32++] = texWidth;
        vertexViewF32[vertexOffset32++] = texHeight;
        vertexViewF32[vertexOffset32++] = textureDatum;
        vertexViewF32[vertexOffset32++] = tintFill;
        vertexViewU32[vertexOffset32++] = tintTR;

        // Increment the instance count.
        this.instanceCount++;
        this.currentBatchEntry.count++;

        // Check whether the batch should be rendered immediately.
        // This guarantees that none of the arrays are full above.
        if (this.instanceCount === this.instancesPerBatch)
        {
            this.run(drawingContext);

            // Now the batch is empty.
        }
    }
});

module.exports = BatchHandlerTileSprite;
