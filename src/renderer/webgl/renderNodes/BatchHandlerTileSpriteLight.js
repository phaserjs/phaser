/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2024 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Vector2 = require('../../../math/Vector2');
var Class = require('../../../utils/Class');
var LightShaderSourceFS = require('../shaders/TileSpriteLight-frag');
var ShaderSourceVS = require('../shaders/MultiTileSprite-vert');
var BatchHandlerQuadLight = require('./BatchHandlerQuadLight');

/**
 * @classdesc
 * This RenderNode draws Standard Batch Render Quads with a Light Shader
 * in batches.
 *
 * The fragment shader used by this RenderNode will be compiled
 * with a maximum light count defined by the renderer configuration.
 * The string `%LIGHT_COUNT%` in the fragment shader source will be
 * replaced with this value.
 *
 * @class BatchHandlerTileSpriteLight
 * @memberof Phaser.Renderer.WebGL.RenderNodes
 * @constructor
 * @since 3.90.0
 * @extends Phaser.Renderer.WebGL.RenderNodes.BatchHandlerQuadLight
 * @param {Phaser.Renderer.WebGL.RenderNodes.RenderNodeManager} manager - The manager that owns this RenderNode.
 * @param {Phaser.Types.Renderer.WebGL.RenderNodes.BatchHandlerConfig} config - The configuration object for this RenderNode.
 */
var BatchHandlerTileSpriteLight = new Class({
    Extends: BatchHandlerQuadLight,

    initialize: function BatchHandlerTileSpriteLight (manager, config)
    {
        BatchHandlerQuadLight.call(this, manager, config);

        this.program.setUniform('uMainSampler', 0);
        this.program.setUniform('uNormSampler', 1);
        
        /**
        * Inverse rotation matrix for normal map rotations.
        *
        * @name Phaser.Renderer.WebGL.RenderNodes.BatchHandlerTileSpriteLight#inverseRotationMatrix
        * @type {Float32Array}
        * @private
        * @since 3.90.0
        */
        this.inverseRotationMatrix = new Float32Array([
            1, 0, 0,
            0, 1, 0,
            0, 0, 1
        ]);

        /**
         * A persistent calculation vector used when processing the lights.
         *
         * @name Phaser.Renderer.WebGL.RenderNodes.BatchHandlerTileSpriteLight#_lightVector
         * @type {Phaser.Math.Vector2}
         * @private
         * @since 3.90.0
         */
        this._lightVector = new Vector2();

        /**
         * The rotation of the normal map texture.
         *
         * @name Phaser.Renderer.WebGL.RenderNodes.BatchHandlerTileSpriteLight#_normalMapRotation
         * @type {number}
         * @private
         * @since 3.90.0
         */
        this._normalMapRotation = 0;
    },

    /**
     * The default configuration settings for BatchHandlerTileSpriteLight.
     *
     * These are very similar to standard settings,
     * but because the textures are always set in units 0 and 1,
     * there's no need to have an attribute for the texture unit.
     * While the vertex shader still reads `inTexId`, it is not used,
     * and the default value of 0 is fine.
     *
     * @name Phaser.Renderer.WebGL.RenderNodes.BatchHandlerTileSpriteLight#defaultConfig
     * @type {Phaser.Types.Renderer.WebGL.RenderNodes.BatchHandlerConfig}
     * @since 3.90.0
     * @readonly
     */
    defaultConfig: {
        name: 'BatchHandlerTileSpriteLight',
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
     * Add a new quad to the batch.
     *
     * For compatibility with TRIANGLE_STRIP rendering,
     * the vertices are added in the order:
     *
     * - Top-left
     * - Bottom-left
     * - Top-right
     * - Bottom-right
     *
     * @method Phaser.Renderer.WebGL.RenderNodes.BatchHandlerTileSpriteLight#batch
     * @since 3.90.0
     * @param {Phaser.Types.Renderer.WebGL.DrawingContext} currentContext - The current drawing context.
     * @param {Phaser.Renderer.WebGL.WebGLTextureWrapper} glTexture - The texture to render.
     * @param {Phaser.Renderer.WebGL.WebGLTextureWrapper} normalGLTexture - The normal map texture to render.
     * @param {number} normalMapRotation - The rotation of the normal map texture.
     * @param {number} x0 - The x coordinate of the top-left corner.
     * @param {number} y0 - The y coordinate of the top-left corner.
     * @param {number} x1 - The x coordinate of the bottom-left corner.
     * @param {number} y1 - The y coordinate of the bottom-left corner.
     * @param {number} x2 - The x coordinate of the top-right corner.
     * @param {number} y2 - The y coordinate of the top-right corner.
     * @param {number} x3 - The x coordinate of the bottom-right corner.
     * @param {number} y3 - The y coordinate of the bottom-right corner.
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
     * @param {number} tintTL - The top-left tint color.
     * @param {number} tintBL - The bottom-left tint color.
     * @param {number} tintTR - The top-right tint color.
     * @param {number} tintBR - The bottom-right tint color.
     */
    batch: function (
        currentContext,
        glTexture,
        normalGLTexture,
        normalMapRotation,
        x0, y0,
        x1, y1,
        x2, y2,
        x3, y3,
        texX, texY,
        texWidth, texHeight,
        u0, v0,
        u1, v1,
        u2, v2,
        u3, v3,
        tintFill,
        tintTL, tintBL, tintTR, tintBR
    )
    {
        if (this.instanceCount === 0)
        {
            this.manager.setCurrentBatchNode(this, currentContext);
        }

        // Texture

        var currentBatchEntry = this.currentBatchEntry;
        if (
            currentBatchEntry.texture[0] !== glTexture ||
            currentBatchEntry.texture[1] !== normalGLTexture
        )
        {
            // Complete the entire batch if the texture changes.
            this.run(currentContext);
        }

        // Current batch entry has been redefined.
        currentBatchEntry = this.currentBatchEntry;
        glTexture.batchUnit = 0;
        normalGLTexture.batchUnit = 1;
        currentBatchEntry.texture[0] = glTexture;
        currentBatchEntry.texture[1] = normalGLTexture;
        currentBatchEntry.unit = 2;

        // Normal map rotation
        if (this._normalMapRotation !== normalMapRotation)
        {
            // Complete the entire batch if the normal map rotation changes.
            this.run(currentContext);

            this._normalMapRotation = normalMapRotation;
            var inverseRotationMatrix = this.inverseRotationMatrix;

            if (normalMapRotation)
            {
                var rot = -normalMapRotation;
                var c = Math.cos(rot);
                var s = Math.sin(rot);

                inverseRotationMatrix[1] = s;
                inverseRotationMatrix[3] = -s;
                inverseRotationMatrix[0] = inverseRotationMatrix[4] = c;
            }
            else
            {
                inverseRotationMatrix[0] = inverseRotationMatrix[4] = 1;
                inverseRotationMatrix[1] = inverseRotationMatrix[3] = 0;
            }

            // This matrix will definitely be used by the next render.
            this.program.setUniform('uInverseRotationMatrix', inverseRotationMatrix);
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
        vertexViewF32[vertexOffset32++] = tintFill;
        vertexViewU32[vertexOffset32++] = tintTR;

        // Increment the instance count.
        this.instanceCount++;
        this.currentBatchEntry.count++;

        // Check whether the batch should be rendered immediately.
        // This guarantees that none of the arrays are full above.
        if (this.instanceCount === this.instancesPerBatch)
        {
            this.run(currentContext);

            // Now the batch is empty.
        }
    },

    /**
     * Called by the render node manager when the advised texture unit count changes.
     * In `BatchHandlerTileSpriteLight`, this does nothing, because it only ever uses two texture units.
     *
     * As this extends `BatchHandlerQuad`, it would otherwise rebuild the shader
     * program.
     *
     * @method Phaser.Renderer.WebGL.RenderNodes.BatchHandlerTileSpriteLight#updateTextureCount
     * @since 3.90.0
     * @param {number} count - The new advised texture unit count.
     */
    updateTextureCount: function (count) {}
});

module.exports = BatchHandlerTileSpriteLight;
