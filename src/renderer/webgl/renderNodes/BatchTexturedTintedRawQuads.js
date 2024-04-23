/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2024 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../../utils/Class');
var ShaderSourceFS = require('../shaders/BatchQuad-frag.js');
var ShaderSourceVS = require('../shaders/BatchQuad-vert.js');
var Utils = require('../Utils.js');
var WebGLProgramWrapper = require('../wrappers/WebGLProgramWrapper');
var Batch = require('./Batch');

/**
 * @classdesc
 * This RenderNode draws Standard Batch Render (SBR) quads in batches.
 *
 * @class BatchTexturedTintedRawQuads
 * @extends Phaser.Renderer.WebGL.RenderNodes.Batch
 * @memberof Phaser.Renderer.WebGL.RenderNodes
 * @constructor
 * @since 3.90.0
 * @param {Phaser.Renderer.WebGL.RenderNodes.RenderNodeManager} manager - The manager that owns this RenderNode.
 * @param {Phaser.Renderer.WebGL.WebGLRenderer} renderer - The renderer that owns this RenderNode.
 */
var BatchTexturedTintedRawQuads = new Class({
    Extends: Batch,

    initialize: function BatchTexturedTintedRawQuads (manager, renderer)
    {
        Batch.call(this, 'BatchTexturedTintedRawQuads', manager, renderer);

        var gl = renderer.gl;

        /**
         * The number of quads per batch, used to determine the size of the
         * vertex and quad buffers, and the number of instances to render.
         *
         * @name Phaser.Renderer.WebGL.RenderNodes.BatchTexturedTintedRawQuads#quadsPerBatch
         * @type {number}
         * @since 3.90.0
         */
        this.quadsPerBatch = renderer.config.batchSize;

        /**
         * The number of quads currently in the batch.
         *
         * @name Phaser.Renderer.WebGL.RenderNodes.BatchTexturedTintedRawQuads#instanceCount
         * @type {number}
         * @since 3.90.0
         */
        this.instanceCount = 0;

        // TODO: Shift matrix transforms to the shader.

        var ParsedShaderSourceFS = Utils.parseFragmentShaderMaxTextures(ShaderSourceFS, renderer.maxTextures);

        /**
         * The WebGL program used to render the Game Object.
         *
         * @name Phaser.Renderer.WebGL.RenderNodes.Single#program
         * @type {Phaser.Renderer.WebGL.Wrappers.WebGLProgramWrapper}
         * @since 3.90.0
         */
        this.program = renderer.createProgram(ShaderSourceVS, ParsedShaderSourceFS);

        var quadLayout = {
            buffer: null,
            instanceDivisor: 1,
            layout: [
                {
                    name: 'inTexIdAndTintEffect',
                    location: -1,
                    size: 2,
                    type: gl.FLOAT,
                    normalized: false
                },
                {
                    name: 'inTextureBox',
                    location: -1,
                    size: 4,
                    type: gl.FLOAT,
                    normalized: false
                },
                {
                    name: 'inTintTL',
                    location: -1,
                    size: 4,
                    type: gl.UNSIGNED_BYTE,
                    normalized: true
                },
                {
                    name: 'inTintBL',
                    location: -1,
                    size: 4,
                    type: gl.UNSIGNED_BYTE,
                    normalized: true
                },
                {
                    name: 'inTintTR',
                    location: -1,
                    size: 4,
                    type: gl.UNSIGNED_BYTE,
                    normalized: true
                },
                {
                    name: 'inTintBR',
                    location: -1,
                    size: 4,
                    type: gl.UNSIGNED_BYTE,
                    normalized: true
                },

                {
                    name: 'inObjectMatrixABCD',
                    location: -1,
                    size: 4,
                    type: gl.FLOAT,
                    normalized: false
                },
                {
                    name: 'inObjectMatrixXY',
                    location: -1,
                    size: 2,
                    type: gl.FLOAT,
                    normalized: false
                },
                {
                    name: 'inWorldMatrixABCD',
                    location: -1,
                    size: 4,
                    type: gl.FLOAT,
                    normalized: false
                },
                {
                    name: 'inWorldMatrixXY',
                    location: -1,
                    size: 2,
                    type: gl.FLOAT,
                    normalized: false
                },
                {
                    name: 'inViewMatrixABCD',
                    location: -1,
                    size: 4,
                    type: gl.FLOAT,
                    normalized: false
                },
                {
                    name: 'inViewMatrixXY',
                    location: -1,
                    size: 2,
                    type: gl.FLOAT,
                    normalized: false
                }
            ]
        };

        var instanceLayout = {
            buffer: null,
            instanceDivisor: 0,
            layout: [
                {
                    name: 'inPositionAndIndex',
                    location: -1,
                    size: 3,
                    type: gl.FLOAT,
                    normalized: false
                }
            ]
        };

        /**
         * The attribute buffer layouts for the vertex and quad buffers.
         *
         * @name Phaser.Renderer.WebGL.RenderNodes.BatchTexturedTintedRawQuads#attributeBufferLayouts
         * @type {Phaser.Types.Renderer.WebGL.WebGLAttributeBufferLayout[]}
         * @since 3.90.0
         */
        this.attributeBufferLayouts = [
            quadLayout,
            instanceLayout
        ];

        // Auto-complete the attribute buffer layouts.
        this.program.completeLayouts(this.attributeBufferLayouts);

        /**
         * The buffer used to construct the instance data.
         *
         * @name Phaser.Renderer.WebGL.RenderNodes.Single#_instanceConstructionBuffer
         * @type {ArrayBuffer}
         * @since 3.90.0
         */
        this._instanceConstructionBuffer = new ArrayBuffer(instanceLayout.stride * 4);

        /**
         * View of the instance construction buffer as a Float32Array.
         *
         * @name Phaser.Renderer.WebGL.RenderNodes.Single#_instanceViewF32
         * @type {Float32Array}
         * @since 3.90.0
         */
        this._instanceViewF32 = new Float32Array(this._instanceConstructionBuffer);

        /**
         * The instance buffer, a vertex buffer describing a single quad.
         *
         * @name Phaser.Renderer.WebGL.RenderNodes.BatchTexturedTintedRawQuads#instanceBuffer
         * @type {Phaser.Renderer.WebGL.Wrappers.WebGLBufferWrapper}
         * @since 3.90.0
         */
        this.instanceBuffer = renderer.createVertexBuffer(this._instanceConstructionBuffer.byteLength, gl.STATIC_DRAW);

        /**
         * The buffer used to construct the quad data.
         *
         * @name Phaser.Renderer.WebGL.RenderNodes.Single#_quadConstructionBuffer
         * @type {ArrayBuffer}
         * @since 3.90.0
         * @private
         */
        this._quadConstructionBuffer = new ArrayBuffer(this.quadsPerBatch * quadLayout.stride);

        /**
         * View of the quad construction buffer as a Float32Array.
         *
         * @name Phaser.Renderer.WebGL.RenderNodes.Single#_quadViewF32
         * @type {Float32Array}
         * @since 3.90.0
         * @private
         */
        this._quadViewF32 = new Float32Array(this._quadConstructionBuffer);

        /**
         * View of the quad construction buffer as a Uint32Array.
         *
         * @name Phaser.Renderer.WebGL.RenderNodes.Single#_quadViewU32
         * @type {Uint32Array}
         * @since 3.90.0
         * @private
         */
        this._quadViewU32 = new Uint32Array(this._quadConstructionBuffer);

        /**
         * The quad buffer, a vertex buffer used for quad data via instanced rendering.
         *
         * @name Phaser.Renderer.WebGL.RenderNodes.BatchTexturedTintedRawQuads#quadBuffer
         * @type {Phaser.Renderer.WebGL.Wrappers.WebGLBufferWrapper}
         * @since 3.90.0
         */
        this.quadBuffer = renderer.createVertexBuffer(this._quadConstructionBuffer.byteLength, gl.DYNAMIC_DRAW);

        // Assign buffers to layout.
        this.attributeBufferLayouts[0].buffer = this.quadBuffer;
        this.attributeBufferLayouts[1].buffer = this.instanceBuffer;

        /**
         * The Vertex Array Object used to render the batch.
         *
         * @name Phaser.Renderer.WebGL.RenderNodes.Single#vao
         * @type {Phaser.Renderer.WebGL.Wrappers.WebGLVAOWrapper}
         * @since 3.90.0
         */
        this.vao = renderer.createVAO(null, this.attributeBufferLayouts);

        /**
         * The textures used by the batch.
         *
         * @name Phaser.Renderer.WebGL.RenderNodes.BatchTexturedTintedRawQuads#batchTextures
         * @type {Phaser.Renderer.WebGL.Wrappers.WebGLTextureWrapper[]}
         * @since 3.90.0
         */
        this.batchTextures = [];

        /**
         * The number of vertices per instance.
         *
         * @name Phaser.Renderer.WebGL.RenderNodes.BatchTexturedTintedRawQuads#verticesPerInstance
         * @type {number}
         * @since 3.90.0
         * @default 4
         */
        this.verticesPerInstance = 4;

        /**
         * The number of floats per quad, used to determine how much of the quad buffer to update.
         *
         * @name Phaser.Renderer.WebGL.RenderNodes.BatchTexturedTintedRawQuads#floatsPerQuad
         * @type {number}
         * @since 3.90.0
         */
        this.floatsPerQuad = quadLayout.stride / Float32Array.BYTES_PER_ELEMENT;

        // TODO: Allow uniforms to update, with resize or context loss or drawing context settings.

        // Main sampler will never change after initialization,
        // because it addresses texture units, not textures.
        this.program.setUniform('uMainSampler[0]', this.getTextureUnitIndices());
        this.program.setUniform('uProjectionMatrix', renderer.projectionMatrix.val);
        this.program.setUniform('uResolution', [ renderer.width, renderer.height ]);

        // Populate the instance buffer with the base quad.
        this._instanceViewF32.set([
            0, 0, 0,
            0, 1, 1,
            1, 0, 2,
            1, 1, 3
        ], 0);
        this.instanceBuffer.update(this._instanceConstructionBuffer);
    },

    /**
     * Draw then empty the current batch.
     *
     * @method Phaser.Renderer.WebGL.RenderNodes.BatchTexturedTintedRawQuads#run
     * @since 3.90.0
     * @param {Phaser.Types.Renderer.WebGL.DrawingContext} drawingContext - The current drawing context.
     * @param {Phaser.Cameras.Scene2D.Camera} camera - The camera to render to.
     */
    run: function (drawingContext, camera)
    {
        if (this.instanceCount === 0) { return; }

        var renderer = this.renderer;

        // Update vertex buffers.
        if (this.instanceCount < this.quadsPerBatch)
        {
            // We use a subarray to avoid copying the buffer, but still
            // control the length.
            this.quadBuffer.update(this._quadViewF32.subarray(0, this.instanceCount * this.floatsPerQuad));
        }
        else
        {
            this.quadBuffer.update(this._quadConstructionBuffer);
        }

        // Bind textures.
        renderer.glTextureUnits.bindUnits(this.batchTextures);

        this.program.setUniform('uRoundPixels', camera.roundPixels);

        renderer.draw(drawingContext, this.program, this.vao, 0, this.verticesPerInstance, this.instanceCount);

        // Reset batch accumulation.
        this.instanceCount = 0;
        this.batchTextures.length = 0;
    },

    /**
     * Add a quad to the batch.
     *
     * For compatibility with TRIANGLE_STRIP rendering,
     * the vertices are added in the order:
     *
     * - Top-left
     * - Bottom-left
     * - Top-right
     * - Bottom-right
     *
     * @method Phaser.Renderer.WebGL.RenderNodes.BatchTexturedTintedRawQuads#batch
     * @since 3.90.0
     * @param {Phaser.Types.Renderer.WebGL.DrawingContext} currentContext - The current drawing context.
     * @param {Phaser.Cameras.Scene2D.Camera} camera - The camera to render to.
     * @param {Phaser.Textures.Frame} frame - The texture frame to render.
     * @param {boolean} tintFill - Whether to tint the fill color.
     * @param {Phaser.GameObjects.Components.TransformMatrix} objectMatrix - The matrix to transform the base quad into the object space.
     * @param {Phaser.GameObjects.Components.TransformMatrix} worldMatrix - The matrix to transform the object space quad into the world space.
     * @param {Phaser.GameObjects.Components.TransformMatrix} viewMatrix - The matrix to transform the world space quad into the view space.
     * @param {number} texX - The left u coordinate (0-1).
     * @param {number} texY - The top v coordinate (0-1).
     * @param {number} texWidth - The width of the texture (0-1).
     * @param {number} texHeight - The height of the texture (0-1).
     * @param {number} tintTL - The top-left tint color.
     * @param {number} tintBL - The bottom-left tint color.
     * @param {number} tintTR - The top-right tint color.
     * @param {number} tintBR - The bottom-right tint color.
     */
    batch: function (currentContext, camera, frame, tintFill, objectMatrix, worldMatrix, viewMatrix, texX, texY, texWidth, texHeight, tintTL, tintBL, tintTR, tintBR)
    {
        this.manager.setCurrentBatchNode(this, currentContext, camera);

        var quadOffset32 = this.instanceCount * this.attributeBufferLayouts[0].stride / 4;
        var quadViewF32 = this._quadViewF32;
        var quadViewU32 = this._quadViewU32;

        // TODO: Simplify matrix handling.

        // Texture
        var glTexture = frame.glTexture;
        var textureIndex = this.batchTextures.indexOf(glTexture);
        if (textureIndex === -1)
        {
            textureIndex = this.batchTextures.length;
            this.batchTextures.push(glTexture);
        }

        // Quad
        quadViewF32[quadOffset32 + 0] = textureIndex;
        quadViewF32[quadOffset32 + 1] = tintFill;
        quadViewF32[quadOffset32 + 2] = texX;
        quadViewF32[quadOffset32 + 3] = texY;
        quadViewF32[quadOffset32 + 4] = texWidth;
        quadViewF32[quadOffset32 + 5] = texHeight;
        quadViewU32[quadOffset32 + 6] = tintTL;
        quadViewU32[quadOffset32 + 7] = tintBL;
        quadViewU32[quadOffset32 + 8] = tintTR;
        quadViewU32[quadOffset32 + 9] = tintBR;
        quadViewF32.set(objectMatrix.matrix.subarray(0, 6), quadOffset32 + 10);
        quadViewF32.set(worldMatrix.matrix.subarray(0, 6), quadOffset32 + 16);
        quadViewF32.set(viewMatrix.matrix.subarray(0, 6), quadOffset32 + 22);

        // Increment the instance count.
        this.instanceCount++;

        // Check whether the batch should be rendered immediately.
        // This guarantees that none of the arrays are full above.
        if (
            (this.batchTextures.length === this.renderer.maxTextures) ||
            (this.instanceCount === this.quadsPerBatch)
        )
        {
            this.run(currentContext, camera);

            // Now the batch is empty.
        }
    },

    /**
     * Return a list containing the indices of all available texture units.
     * TODO: this should be universal.
     *
     * @method Phaser.Renderer.WebGL.RenderNodes.BatchTexturedTintedRawQuads#getTextureUnitIndices
     * @since 3.90.0
     * @return {number[]} The list of available texture unit indices.
     */
    getTextureUnitIndices: function ()
    {
        var indices = [];
        for (var i = 0; i < this.renderer.maxTextures; i++)
        {
            indices.push(i);
        }
        return indices;
    }
});

module.exports = BatchTexturedTintedRawQuads;
