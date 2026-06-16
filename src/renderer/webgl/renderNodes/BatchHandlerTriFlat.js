/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Vector2 = require('../../../math/Vector2');
var Class = require('../../../utils/Class');
var MakeApplyAlphaDiscard = require('../shaders/additionMakers/MakeApplyAlphaDiscard');
var MakeApplyLighting = require('../shaders/additionMakers/MakeApplyLighting');
var MakeDefineLights = require('../shaders/additionMakers/MakeDefineLights');
var MakeFlatNormal = require('../shaders/additionMakers/MakeFlatNormal');
var ShaderSourceFS = require('../shaders/Flat-frag');
var ShaderSourceVS = require('../shaders/Flat-vert');
var Utils = require('../Utils');
var BatchHandler = require('./BatchHandler');

/**
 * @classdesc
 * A render node that draws flat-shaded triangles with per-vertex color in
 * batches, using the WebGL renderer. Unlike texture-based batch handlers,
 * this node requires no texture data — each vertex carries only a position
 * and a packed RGBA tint color. It is used to render untextured geometry such
 * as Graphics objects and other filled or stroked shapes.
 *
 * Triangles are submitted via the `batch` method as a set of vertex positions,
 * per-vertex colors, and an index array that groups vertices into triangles.
 * The node accumulates these into a dynamic vertex buffer and index buffer,
 * flushing automatically when the batch is full or when render state changes.
 *
 * Optionally supports dynamic lighting: when a lighting configuration is
 * provided, the node switches to a lighting-enabled shader variant and uploads
 * the necessary light uniforms each frame.
 *
 * @class BatchHandlerTriFlat
 * @extends Phaser.Renderer.WebGL.RenderNodes.BatchHandler
 * @memberof Phaser.Renderer.WebGL.RenderNodes
 * @constructor
 * @since 4.0.0
 * @param {Phaser.Renderer.WebGL.RenderNodes.RenderNodeManager} manager - The manager that owns this RenderNode.
 * @param {Phaser.Types.Renderer.WebGL.RenderNodes.BatchHandlerConfig} [config] - The configuration object for this handler.
 */
var BatchHandlerTriFlat = new Class({
    Extends: BatchHandler,

    initialize: function BatchHandlerTriFlat (manager, config)
    {
        BatchHandler.call(this, manager, this.defaultConfig, config);

        /**
         * An empty array. This is an internal space filler.
         *
         * @name Phaser.Renderer.WebGL.RenderNodes.BatchHandlerTriFlat#_emptyTextures
         * @type {Array}
         * @private
         * @since 4.0.0
         * @default []
         * @readonly
         */
        this._emptyTextures = [];

        /**
         * The number of vertices currently in the batch.
         *
         * @name Phaser.Renderer.WebGL.RenderNodes.BatchHandlerTriFlat#vertexCount
         * @type {number}
         * @since 4.0.0
         */
        this.vertexCount = 0;

        /**
         * A persistent calculation vector used when processing the lights.
         *
         * @name Phaser.Renderer.WebGL.RenderNodes.BatchHandlerTriFlat#_lightVector
         * @type {Phaser.Math.Vector2}
         * @private
         * @since 4.0.0
         */
        this._lightVector = new Vector2();

        /**
         * The current render options to which the batch is built.
         * These help define the shader.
         *
         * @name Phaser.Renderer.WebGL.RenderNodes.BatchHandlerTriFlat#renderOptions
         * @type {object}
         * @since 4.0.0
         */
        this.renderOptions = {
            alphaStrategy: 'keep',
            lighting: false
        };

        /**
         * The render options currently being built.
         *
         * @name Phaser.Renderer.WebGL.RenderNodes.BatchHandlerTriFlat#nextRenderOptions
         * @type {object}
         * @since 4.0.0
         */
        this.nextRenderOptions = {
            alphaStrategy: 'keep',
            lighting: false
        };

        /**
         * A flag indicating that the render options have changed.
         *
         * @name Phaser.Renderer.WebGL.RenderNodes.BatchHandlerTriFlat#_renderOptionsChanged
         * @type {boolean}
         * @private
         * @since 4.0.0
         */
        this._renderOptionsChanged = false;
    },

    defaultConfig: {
        name: 'BatchHandlerTriFlat',
        verticesPerInstance: 3,
        indicesPerInstance: 3,
        shaderName: 'FLAT',
        vertexSource: ShaderSourceVS,
        fragmentSource: ShaderSourceFS,
        shaderAdditions: [
            MakeDefineLights(true),
            MakeFlatNormal(true),
            MakeApplyLighting(true),
            MakeApplyAlphaDiscard(true)
        ],
        indexBufferDynamic: true,
        vertexBufferLayout: {
            usage: 'DYNAMIC_DRAW',
            layout: [
                {
                    name: 'inPosition',
                    size: 2
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
     * Generate element indices for the instance vertices.
     * This is called automatically when the node is initialized.
     *
     * @method Phaser.Renderer.WebGL.RenderNodes.BatchHandlerTriFlat#_generateElementIndices
     * @since 4.0.0
     * @private
     * @param {number} instances - The number of instances to define.
     * @return {ArrayBuffer} The index buffer data.
     */
    _generateElementIndices: function (instances)
    {
        return new ArrayBuffer(instances * 3 * 2);
    },

    /**
     * Update the uniforms for the current shader program.
     *
     * This method is called automatically when the batch is run.
     *
     * @method Phaser.Renderer.WebGL.RenderNodes.BatchHandlerTriFlat#setupUniforms
     * @since 4.0.0
     * @param {Phaser.Renderer.WebGL.DrawingContext} drawingContext - The current drawing context.
     */
    setupUniforms: function (drawingContext)
    {
        var programManager = this.programManager;

        drawingContext.renderer.setProjectionMatrixFromDrawingContext(drawingContext);
        programManager.setUniform(
            'uProjectionMatrix',
            drawingContext.renderer.projectionMatrix.val
        );

        if (this.renderOptions.lighting)
        {
            // Lighting uniforms.
            Utils.updateLightingUniforms(
                this.renderOptions.lighting,
                drawingContext,
                programManager,
                1,
                this._lightVector
            );

            programManager.setUniform(
                'uResolution',
                [ drawingContext.width, drawingContext.height ]
            );
        }
    },

    /**
     * Compare the incoming render options against the current batch's render
     * options and record whether they have changed. If the alpha strategy or lighting value
     * differs from the one used to build the current batch, the change is
     * staged in `nextRenderOptions` and `_renderOptionsChanged` is set to
     * `true`, signalling that the batch must be flushed and the shader
     * reconfigured before new geometry is added.
     *
     * @method Phaser.Renderer.WebGL.RenderNodes.BatchHandlerTriFlat#updateRenderOptions
     * @since 4.0.0
     * @param {object|false} lighting - The lighting configuration for the next draw call, or `false` if lighting is disabled.
     * @param {string} alphaStrategy - The alpha strategy for the next draw call.
     */
    updateRenderOptions: function (lighting, alphaStrategy)
    {
        var newRenderOptions = this.nextRenderOptions;
        var oldRenderOptions = this.renderOptions;
        var changed = false;

        if (alphaStrategy !== oldRenderOptions.alphaStrategy)
        {
            newRenderOptions.alphaStrategy = alphaStrategy;
            changed = true;
        }

        if (lighting !== oldRenderOptions.lighting)
        {
            newRenderOptions.lighting = lighting;
            changed = true;
        }

        this._renderOptionsChanged = changed;
    },

    /**
     * Apply any pending render option changes to the shader program. This
     * method is called after the current batch has been flushed, when
     * `_renderOptionsChanged` is `true`. It synchronises `renderOptions` with
     * `nextRenderOptions` and enables or disables the shader additions accordingly.
     * When lighting is enabled it also updates the
     * `LIGHT_COUNT` preprocessor define to match the renderer's configured
     * maximum number of lights.
     *
     * @method Phaser.Renderer.WebGL.RenderNodes.BatchHandlerTriFlat#updateShaderConfig
     * @since 4.0.0
     */
    updateShaderConfig: function ()
    {
        var programManager = this.programManager;
        var renderOptions = this.renderOptions;
        var nextRenderOptions = this.nextRenderOptions;

        if (renderOptions.alphaStrategy !== nextRenderOptions.alphaStrategy)
        {
            var alphaStrategy = nextRenderOptions.alphaStrategy;
            renderOptions.alphaStrategy = alphaStrategy;

            var alphaDiscardAddition = programManager.getAdditionsByTag('ALPHA_DISCARD')[0];
            if (alphaDiscardAddition)
            {
                var keep = alphaStrategy === 'keep';
                var dither = alphaStrategy === 'dither';
                var threshold = (typeof alphaStrategy === 'number') ? alphaStrategy : undefined;
                programManager.replaceAddition(
                    alphaDiscardAddition.name,
                    MakeApplyAlphaDiscard(keep, dither, threshold)
                );
            }
        }

        if (renderOptions.lighting !== nextRenderOptions.lighting)
        {
            var lighting = nextRenderOptions.lighting;
            renderOptions.lighting = lighting;

            var lightingAdditions = programManager.getAdditionsByTag('LIGHTING');
            for (var i = 0; i < lightingAdditions.length; i++)
            {
                var addition = lightingAdditions[i];
                addition.disable = !lighting;
            }

            if (lighting)
            {
                var defineLightsAddition = programManager.getAddition('DefineLights');
                if (defineLightsAddition)
                {
                    defineLightsAddition.additions.fragmentDefine = '#define LIGHT_COUNT ' + this.manager.renderer.config.maxLights;
                }
            }
        }
    },

    /**
     * Draw then empty the current batch.
     *
     * This method is called automatically, by either this node or the manager,
     * when the batch is full, or when something else needs to be rendered.
     *
     * @method Phaser.Renderer.WebGL.RenderNodes.BatchHandlerTriFlat#run
     * @since 4.0.0
     * @param {Phaser.Renderer.WebGL.DrawingContext} drawingContext - The current drawing context.
     */
    run: function (drawingContext)
    {
        if (this.instanceCount === 0) { return; }

        this.onRunBegin(drawingContext);

        var programManager = this.programManager;
        var programSuite = programManager.getCurrentProgramSuite();

        if (programSuite)
        {
            var program = programSuite.program;
            var vao = programSuite.vao;

            this.setupUniforms(drawingContext);
            programManager.applyUniforms(program);

            var indicesPerInstance = this.indicesPerInstance;
            var instanceCount = this.instanceCount;
            var renderer = this.manager.renderer;
            var vertexBuffer = this.vertexBufferLayout.buffer;
            var stride = this.vertexBufferLayout.layout.stride;

            // Update vertex buffers.
            // Because we frequently aren't filling the entire buffer,
            // we need to update the buffer with the correct size.
            vertexBuffer.update(this.vertexCount * stride);

            // Update index buffer.
            // We must bind the VAO before updating the index buffer.
            // Each index is a 16-bit unsigned integer, so 2 bytes.
            vao.bind();
            vao.indexBuffer.update(instanceCount * indicesPerInstance * 2);

            renderer.drawElements(
                drawingContext,
                this._emptyTextures,
                program,
                vao,
                instanceCount * indicesPerInstance,
                0,
                renderer.gl.TRIANGLES
            );
        }

        // Reset batch accumulation.
        this.instanceCount = 0;
        this.vertexCount = 0;

        this.onRunEnd(drawingContext);
    },

    /**
     * Add data to the batch.
     *
     * The data is composed of vertices and indexed triangles.
     * Each triangle is defined by three indices into the vertices array.
     *
     * @method Phaser.Renderer.WebGL.RenderNodes.BatchHandlerTriFlat#batch
     * @since 4.0.0
     * @param {Phaser.Renderer.WebGL.DrawingContext} currentContext - The current drawing context.
     * @param {number[]} indexes - The index data. Each triangle is defined by three indices into the vertices array, so the length of this should be a multiple of 3.
     * @param {number[]} vertices - The vertices data. Each vertex is defined by an x-coordinate and a y-coordinate.
     * @param {number[]} colors - The color data. Each vertex has a color as a Uint32 value.
     * @param {object|false} lighting - The lighting configuration for the next draw call, or `false` if lighting is disabled.
     */
    batch: function (currentContext, indexes, vertices, colors, lighting)
    {
        if (this.instanceCount === 0)
        {
            this.manager.setCurrentBatchNode(this, currentContext);
        }

        // Check render options and run the batch if they differ.
        this.updateRenderOptions(lighting, currentContext.alphaStrategy);
        if (this._renderOptionsChanged)
        {
            this.run(currentContext);
            this.updateShaderConfig();
        }

        var passID = 0;
        var instanceCompletion = 0;
        var instancesPerBatch = this.instancesPerBatch;

        // Buffer data
        var stride = this.vertexBufferLayout.layout.stride;
        var verticesPerInstance = this.verticesPerInstance;

        var indexBuffer = this.indexBuffer;
        var indexView16 = indexBuffer.viewU16;
        var indexOffset16 = this.instanceCount * this.indicesPerInstance;

        var vertexBuffer = this.vertexBufferLayout.buffer;
        var vertexViewF32 = vertexBuffer.viewF32;
        var vertexViewU32 = vertexBuffer.viewU32;
        var vertexOffset32 = this.vertexCount * stride / vertexViewF32.BYTES_PER_ELEMENT;

        // Track vertex usage.
        var passes = [];
        var passOffset = 0;
        var vertexIndices = [];
        var vertexIndicesOffset = 0;

        for (var i = 0; i < indexes.length; i++)
        {
            var index = indexes[i];
            var vertexIndex = index * 2;

            if (passes[i] !== passID)
            {
                // Update the vertex buffer.
                vertexViewF32[vertexOffset32++] = vertices[vertexIndex];
                vertexViewF32[vertexOffset32++] = vertices[vertexIndex + 1];
                vertexViewU32[vertexOffset32++] = colors[index];

                // Assign the vertex to the current pass.
                passes[passOffset++] = passID;

                // Record the index where the vertex was stored.
                vertexIndices[vertexIndicesOffset++] = this.vertexCount;

                this.vertexCount++;
            }
            var id = vertexIndices[vertexIndicesOffset - 1];

            // Update the index buffer.
            // There is always at least one index per vertex,
            // so we can assume that the vertex buffer is large enough.
            indexView16[indexOffset16++] = id;

            // Check whether the instance is complete.
            instanceCompletion++;
            if (instanceCompletion === verticesPerInstance)
            {
                this.instanceCount++;
                instanceCompletion = 0;
            }

            // Check whether the batch should be rendered immediately.
            // This guarantees that none of the arrays are full above.
            if (
                // The instance count has been reached.
                this.instanceCount === instancesPerBatch ||

                // This triangle is complete, and another would exceed the index buffer size.
                (instanceCompletion === 0 && indexOffset16 + verticesPerInstance >= indexView16.length)
            )
            {
                passID++;
                this.run(currentContext);

                indexOffset16 = this.instanceCount * this.indicesPerInstance;
                vertexOffset32 = this.vertexCount * stride / vertexViewF32.BYTES_PER_ELEMENT;
                passOffset = 0;
                vertexIndicesOffset = 0;

                // Now the batch is empty.
            }
        }
    }
});

module.exports = BatchHandlerTriFlat;
