/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../../utils/Class');
var ShaderSourceFS = require('../shaders/Multi-frag');
var ShaderSourceVS = require('../shaders/Multi-vert');
var MakeApplyAlphaDiscard = require('../shaders/additionMakers/MakeApplyAlphaDiscard');
var MakeApplyLighting = require('../shaders/additionMakers/MakeApplyLighting');
var MakeApplyTint = require('../shaders/additionMakers/MakeApplyTint');
var MakeDefineLights = require('../shaders/additionMakers/MakeDefineLights');
var MakeDefineTexCount = require('../shaders/additionMakers/MakeDefineTexCount');
var MakeGetNormalFromMap = require('../shaders/additionMakers/MakeGetNormalFromMap');
var MakeGetTexCoordOut = require('../shaders/additionMakers/MakeGetTexCoordOut');
var MakeGetTexRes = require('../shaders/additionMakers/MakeGetTexRes');
var MakeGetTexture = require('../shaders/additionMakers/MakeGetTexture');
var MakeOutFrame = require('../shaders/additionMakers/MakeOutFrame');
var MakeOutInverseRotation = require('../shaders/additionMakers/MakeOutInverseRotation');
var MakeRotationDatum = require('../shaders/additionMakers/MakeRotationDatum');
var MakeSmoothPixelArt = require('../shaders/additionMakers/MakeSmoothPixelArt');
var MakeTexCoordFrameClamp = require('../shaders/additionMakers/MakeTexCoordFrameClamp');
var MakeTexCoordFrameWrap = require('../shaders/additionMakers/MakeTexCoordFrameWrap');
var Utils = require('../Utils.js');
var BatchHandlerQuad = require('./BatchHandlerQuad');

var getTint = Utils.getTintAppendFloatAlpha;

/**
 * @classdesc
 * A RenderNode that handles batch rendering of TileSprite and Tile game objects
 * in WebGL. It extends `BatchHandlerQuad` by passing per-vertex frame data
 * (the texture coordinate origin and dimensions of the source frame) to the
 * shader, enabling the shader to correctly clamp or wrap texture coordinates
 * within the bounds of the frame. This is essential for tiled sprites, where
 * a texture is repeated or scrolled across a surface and must not bleed into
 * neighbouring frames on a texture atlas.
 *
 * Two additional render options are supported: `clampFrame`, which prevents
 * texture coordinates from sampling outside the frame region, and `wrapFrame`,
 * which tiles the frame region. These options are managed dynamically so that
 * shader variants are compiled and swapped only when the options change.
 *
 * @class BatchHandlerTileSprite
 * @memberof Phaser.Renderer.WebGL.RenderNodes
 * @constructor
 * @since 4.0.0
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
            MakeApplyLighting(true),
            MakeApplyAlphaDiscard(true)
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
                    name: 'inTintEffect',
                    size: 4,
                    type: 'UNSIGNED_BYTE',
                    normalized: true
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
     * Reads the incoming render options and compares them against the
     * currently active options. If any TileSprite-specific option has changed
     * (`clampFrame`, `wrapFrame`, or the derived `texRes` flag), the internal
     * change flag is set so that `updateShaderConfig` will update the active
     * shader additions before the next draw call. Also calls the parent
     * `BatchHandlerQuad` implementation to handle shared render options.
     *
     * @method Phaser.Renderer.WebGL.RenderNodes.BatchHandlerTileSprite#updateRenderOptions
     * @since 4.0.0
     * @param {Phaser.Types.Renderer.WebGL.RenderNodes.BatchHandlerQuadRenderOptions} renderOptions - The render options to apply.
     */
    updateRenderOptions: function (renderOptions)
    {
        BatchHandlerQuad.prototype.updateRenderOptions.call(this, renderOptions);

        var oldRenderOptions = this.renderOptions;
        var newRenderOptions = this.nextRenderOptions;
        var changed = this._renderOptionsChanged;

        newRenderOptions.clampFrame = !!renderOptions.clampFrame;
        if (newRenderOptions.clampFrame !== oldRenderOptions.clampFrame)
        {
            changed = true;
        }

        newRenderOptions.wrapFrame = !!renderOptions.wrapFrame;
        if (newRenderOptions.wrapFrame !== oldRenderOptions.wrapFrame)
        {
            changed = true;
        }

        // Enable texture resolution data if not already available.
        newRenderOptions.texRes = newRenderOptions.clampFrame || newRenderOptions.texRes;
        if (newRenderOptions.texRes !== oldRenderOptions.texRes)
        {
            changed = true;
        }

        if (changed)
        {
            this._renderOptionsChanged = true;
        }
    },

    /**
     * Applies any pending render option changes to the active shader program
     * by enabling or disabling the `TexCoordFrameClamp` and `TexCoordFrameWrap`
     * shader additions as required. This is called after the current batch has
     * been flushed whenever `updateRenderOptions` detects a change. Also calls
     * the parent `BatchHandlerQuad` implementation to handle shared shader
     * configuration.
     *
     * @method Phaser.Renderer.WebGL.RenderNodes.BatchHandlerTileSprite#updateShaderConfig
     * @since 4.0.0
     */
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
     * Adds a textured quad to the batch for rendering as a TileSprite or Tile.
     * Each vertex receives the full frame region (texX, texY, texWidth, texHeight)
     * so that the shader can clamp or wrap UV coordinates within the frame bounds.
     * If the batch is full after this call, it is flushed immediately. If the
     * render options differ from those used by the current batch, the batch is
     * also flushed and the shader configuration is updated before the new quad
     * is written.
     *
     * @method Phaser.Renderer.WebGL.RenderNodes.BatchHandlerTileSprite#batch
     * @since 4.0.0
     * @param {Phaser.Renderer.WebGL.DrawingContext} drawingContext - The current drawing context.
     * @param {Phaser.Renderer.WebGL.Wrappers.WebGLTextureWrapper} glTexture - The texture to render.
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
     * @param {Phaser.TintModes} tintMode - The tint mode to use.
     * @param {number} tintTL - The tint color for the top-left corner.
     * @param {number} tintBL - The tint color for the bottom-left corner.
     * @param {number} tintTR - The tint color for the top-right corner.
     * @param {number} tintBR - The tint color for the bottom-right corner.
     * @param {Phaser.Types.Renderer.WebGL.RenderNodes.BatchHandlerQuadRenderOptions} renderOptions - Optional render features.
     * @param {number} u0 - The u coordinate of the distorted top-left corner.
     * @param {number} v0 - The v coordinate of the distorted top-left corner.
     * @param {number} u1 - The u coordinate of the distorted bottom-left corner.
     * @param {number} v1 - The v coordinate of the distorted bottom-left corner.
     * @param {number} u2 - The u coordinate of the distorted top-right corner.
     * @param {number} v2 - The v coordinate of the distorted top-right corner.
     * @param {number} u3 - The u coordinate of the distorted bottom-right corner.
     * @param {number} v3 - The v coordinate of the distorted bottom-right corner.
     * @param {number} [tint2TL] - The secondary tint color for the top-left corner.
     * @param {number} [tint2BL] - The secondary tint color for the bottom-left corner.
     * @param {number} [tint2TR] - The secondary tint color for the top-right corner.
     * @param {number} [tint2BR] - The secondary tint color for the bottom-right corner.
     */
    batch: function (
        drawingContext,
        glTexture,
        x0, y0,
        x1, y1,
        x2, y2,
        x3, y3,
        texX, texY,
        texWidth, texHeight,
        tintMode,
        tintTL, tintBL, tintTR, tintBR,
        renderOptions,
        u0, v0, u1, v1, u2, v2, u3, v3,
        tint2TL, tint2BL, tint2TR, tint2BR
    )
    {
        if (this.instanceCount === 0)
        {
            this.manager.setCurrentBatchNode(this, drawingContext);
        }

        // Check render options and run the batch if they differ.
        renderOptions.alphaStrategy = drawingContext.alphaStrategy;
        this.updateRenderOptions(renderOptions);
        if (this._renderOptionsChanged)
        {
            this.run(drawingContext);
            this.updateShaderConfig();
        }

        // Process textures and get relevant data.
        var textureDatum = this.batchTextures(glTexture, renderOptions);

        // Pack tint mode with secondary tint colors.
        // Assign default secondary tint colors if not provided.
        if (tint2TL === undefined)
        {
            tint2TL = tintMode << 24;
            tint2BL = tint2TL;
            tint2TR = tint2TL;
            tint2BR = tint2TL;
        }
        else
        {
            tint2TL = getTint(tint2TL, tintMode / 255);
            tint2BL = getTint(tint2BL, tintMode / 255);
            tint2TR = getTint(tint2TR, tintMode / 255);
            tint2BR = getTint(tint2BR, tintMode / 255);
        }

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
        vertexViewU32[vertexOffset32++] = tint2BL;
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
        vertexViewU32[vertexOffset32++] = tint2TL;
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
        vertexViewU32[vertexOffset32++] = tint2BR;
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
        vertexViewU32[vertexOffset32++] = tint2TR;
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
