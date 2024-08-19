/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2024 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Vector2 = require('../../../math/Vector2');
var Class = require('../../../utils/Class');
var MakeApplyLighting = require('../shaders/configs/MakeApplyLighting');
var ShaderSourceFS = require('../shaders/Flat-frag');
var ShaderSourceVS = require('../shaders/Flat-vert');
var Utils = require('../Utils');
var BatchHandler = require('./BatchHandler');

/**
 * @classdesc
 * This render node draws triangles with vertex color in batches.
 *
 * @class BatchHandlerTriFlat
 * @extends Phaser.Renderer.WebGL.Batch.BatchHandler
 * @memberof Phaser.Renderer.WebGL.Batch
 * @constructor
 * @since 3.90.0
 * @param {Phaser.Renderer.WebGL.WebGLPipeline} manager - The pipeline manager this BatchRenderer belongs to.
 * @param {Phaser.Types.Renderer.WebGL.WebGLPipelineBatchConfig} config - The configuration object for this BatchRenderer.
 */
var BatchHandlerTriFlat = new Class({
    Extends: BatchHandler,

    initialize: function BatchHandlerTriFlat (manager, config)
    {
        BatchHandler.call(this, manager, config, this.defaultConfig);

        /**
         * An empty array. This is an internal space filler.
         *
         * @name Phaser.Renderer.WebGL.RenderNodes.BatchHandlerTriFlat#_emptyTextures
         * @type {Array}
         * @private
         * @since 3.90.0
         * @default []
         * @readonly
         */
        this._emptyTextures = [];

        /**
         * The number of vertices currently in the batch.
         *
         * @name Phaser.Renderer.WebGL.RenderNodes.BatchHandlerTriFlat#vertexCount
         * @type {number}
         * @since 3.90.0
         */
        this.vertexCount = 0;

        /**
         * A persistent calculation vector used when processing the lights.
         *
         * @name Phaser.Renderer.WebGL.RenderNodes.BatchHandlerTriFlatLight#_lightVector
         * @type {Phaser.Math.Vector2}
         * @private
         * @since 3.90.0
         */
        this._lightVector = new Vector2();

        /**
         * The current render options to which the batch is built.
         * These help define the shader.
         *
         * @name Phaser.Renderer.WebGL.RenderNodes.BatchHandlerTriFlat#renderOptions
         * @type {object}
         * @since 3.90.0
         */
        this.renderOptions = {
            lighting: false
        };
    },

    defaultConfig: {
        name: 'BatchHandlerTriFlat',
        verticesPerInstance: 3,
        indicesPerInstance: 3,
        shaderName: 'FLAT',
        vertexSource: ShaderSourceVS,
        fragmentSource: ShaderSourceFS,
        shaderAdditions: [
            MakeApplyLighting(true)
        ],
        shaderFeatures: [ 'FLAT_LIGHTING' ],
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
     * @since 3.90.0
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
     * @since 3.90.0
     * @param {Phaser.Types.Renderer.WebGL.DrawingContext} drawingContext - The current drawing context.
     */
    setupUniforms: function (drawingContext)
    {
        var programManager = this.programManager;

        drawingContext.renderer.setProjectionMatrix(
            drawingContext.width,
            drawingContext.height
        );
        programManager.setUniform(
            'uProjectionMatrix',
            drawingContext.renderer.projectionMatrix.val
        );

        // Lighting uniforms.
        Utils.updateLightingUniforms(
            this.renderOptions.lighting,
            this.manager.renderer,
            drawingContext,
            programManager,
            this._lightVector
        );

        if (this.renderOptions.lighting)
        {
            programManager.setUniform(
                'uResolution',
                [ drawingContext.width, drawingContext.height ]
            );
        }
    },

    /**
     * Update the render options for the current shader program.
     * If the options have changed, the batch is run to apply the changes.
     *
     * @method Phaser.Renderer.WebGL.RenderNodes.BatchHandlerTriFlat#updateRenderOptions
     * @since 3.90.0
     * @param {Phaser.Types.Renderer.WebGL.DrawingContext} drawingContext - The current drawing context.
     * @param {boolean} lighting - Should this batch use lighting?
     */
    updateRenderOptions: function (drawingContext, lighting)
    {
        var programManager = this.programManager;
        var renderOptions = this.renderOptions;
        var updateLighting = this.renderOptions.lighting !== lighting;

        if (updateLighting)
        {
            this.run(drawingContext);
        }

        renderOptions.lighting = lighting;

        if (updateLighting)
        {
            var lightingAddition = programManager.getAddition('LIGHTING');
            if (lightingAddition)
            {
                lightingAddition.disable = !lighting;
                if (lighting)
                {
                    lightingAddition.additions.fragmentDefine = '#define LIGHT_COUNT ' + this.manager.renderer.config.maxLights;
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
     * @since 3.90.0
     * @param {Phaser.Types.Renderer.WebGL.DrawingContext} drawingContext - The current drawing context.
     */
    run: function (drawingContext)
    {
        if (this.instanceCount === 0) { return; }

        this.onRunBegin(drawingContext);

        var programManager = this.programManager;
        var programSuite = programManager.getCurrentProgramSuite();
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
        // Because we are probably using a generic vertex buffer
        // which is larger than the current batch, we need to update
        // the buffer with the correct size.
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
     * @since 3.90.0
     * @param {Phaser.Types.Renderer.WebGL.DrawingContext} currentContext - The current drawing context.
     * @param {number[]} indexes - The index data. Each triangle is defined by three indices into the vertices array, so the length of this should be a multiple of 3.
     * @param {number[]} vertices - The vertices data. Each vertex is defined by an x-coordinate and a y-coordinate.
     * @param {number[]} colors - The color data. Each vertex has a color as a Uint32 value.
     * @param {boolean} [lighting=false] - Should this batch use lighting?
     */
    batch: function (currentContext, indexes, vertices, colors, lighting)
    {
        if (this.instanceCount === 0)
        {
            this.manager.setCurrentBatchNode(this, currentContext);
        }

        // Check render options and run the batch if they differ.
        this.updateRenderOptions(currentContext, lighting);

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
