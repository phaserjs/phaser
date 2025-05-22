/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../../utils/Class');
var ProgramManager = require('../ProgramManager');
var WebGLVertexBufferLayoutWrapper = require('../wrappers/WebGLVertexBufferLayoutWrapper');
var RenderNode = require('./RenderNode');
var Renderer = require('../../../renderer');

/**
 * @classdesc
 * A Batch Handler Render Node. This is a base class used for other
 * Batch Handler Render Nodes.
 *
 * A batch handler buffers data for a batch of objects to be rendered
 * together. It is responsible for the vertex buffer layout and shaders
 * used to render the batched items.
 *
 * This class is not meant to be used directly, but to be extended by
 * other classes.
 *
 * @class BatchHandler
 * @memberof Phaser.Renderer.WebGL.RenderNodes
 * @constructor
 * @since 4.0.0
 * @extends Phaser.Renderer.WebGL.RenderNodes.RenderNode
 * @param {Phaser.Renderer.WebGL.RenderNodes.RenderNodeManager} manager - The manager that owns this RenderNode.
 * @param {Phaser.Types.Renderer.WebGL.RenderNodes.BatchHandlerConfig} defaultConfig - The default configuration object for this RenderNode. This is used to ensure all required properties are present, so it must be complete.
 * @param {Phaser.Types.Renderer.WebGL.RenderNodes.BatchHandlerConfig} [config] - The configuration object for this RenderNode.
 */
var BatchHandler = new Class({
    Extends: RenderNode,

    initialize: function BatchHandler (manager, defaultConfig, config)
    {
        var renderer = manager.renderer;
        var gl = renderer.gl;

        config = this._copyAndCompleteConfig(manager, config || {}, defaultConfig);

        var name = config.name;
        if (!name)
        {
            throw new Error('BatchHandler must have a name');
        }

        RenderNode.call(this, name, manager);

        /**
         * The number of instances per batch, used to determine the size of the
         * vertex buffer, and the number of instances to render.
         *
         * This is usually limited by the maximum number of vertices that can be
         * distinguished with a 16-bit UNSIGNED_INT index buffer,
         * which is 65536. This is set in the game render config as `batchSize`.
         *
         * @name Phaser.Renderer.WebGL.RenderNodes.BatchHandler#instancesPerBatch
         * @type {number}
         * @since 4.0.0
         */
        this.instancesPerBatch = -1;

        /**
         * The number of vertices per instance.
         *
         * This is usually 4 for a quad.
         *
         * Each vertex corresponds to an index in the element buffer.
         *
         * @name Phaser.Renderer.WebGL.RenderNodes.BatchHandler#verticesPerInstance
         * @type {number}
         * @since 4.0.0
         * @default 4
         */
        this.verticesPerInstance = config.verticesPerInstance;

        // Calculate the final number of instances per batch.
        var indexLimit = 65536; // 2^16
        var maxInstances = Math.floor(indexLimit / this.verticesPerInstance);
        var targetInstances = config.instancesPerBatch || renderer.config.batchSize || maxInstances;
        this.instancesPerBatch = Math.min(targetInstances, maxInstances);

        /**
         * The number of indices per instance.
         * This is usually 6 for a quad.
         * Each index corresponds to a vertex in the vertex buffer.
         *
         * @name Phaser.Renderer.WebGL.RenderNodes.BatchHandler#indicesPerInstance
         * @type {number}
         * @since 4.0.0
         * @default 6
         */
        this.indicesPerInstance = config.indicesPerInstance;

        /**
         * The number of bytes per index per instance.
         * This is used to advance the index buffer, and accounts for the
         * size of a Uint16Array element.
         *
         * @name Phaser.Renderer.WebGL.RenderNodes.BatchHandler#bytesPerIndexPerInstance
         * @type {number}
         * @since 4.0.0
         * @default 12
         */
        this.bytesPerIndexPerInstance = this.indicesPerInstance * Uint16Array.BYTES_PER_ELEMENT;

        /**
         * The maximum number of textures per batch entry.
         * This is usually set to the maximum number of texture units available,
         * but it might be smaller for some uses.
         *
         * @name Phaser.Renderer.WebGL.RenderNodes.BatchHandler#maxTexturesPerBatch
         * @type {number}
         * @since 4.0.0
         */
        this.maxTexturesPerBatch = 1;

        // Listen for changes to the number of draw calls per batch.
        this.manager.on(
            Renderer.Events.SET_PARALLEL_TEXTURE_UNITS,
            this.updateTextureCount,
            this
        );

        // Ensure that there is no VAO bound, because the following index buffer
        // will modify any currently bound VAO.
        renderer.glWrapper.updateVAO({ vao: null });

        /**
         * The index buffer defining vertex order.
         *
         * @name Phaser.Renderer.WebGL.RenderNodes.BatchHandler#indexBuffer
         * @type {Phaser.Renderer.WebGL.Wrappers.WebGLBufferWrapper}
         * @since 4.0.0
         */
        this.indexBuffer = renderer.createIndexBuffer(
            this._generateElementIndices(this.instancesPerBatch),
            config.indexBufferDynamic ? gl.DYNAMIC_DRAW : gl.STATIC_DRAW
        );

        // Prepare the vertex buffer layout.
        var partialLayout = config.vertexBufferLayout;
        partialLayout.count = this.instancesPerBatch * this.verticesPerInstance;

        /**
         * The layout, data, and vertex buffer used to store the vertex data.
         *
         * The default layout is for a quad with position, texture coordinate,
         * texture ID, tint effect, and tint color on each vertex.
         *
         * @name Phaser.Renderer.WebGL.RenderNodes.BatchHandler#vertexBufferLayout
         * @type {Phaser.Renderer.WebGL.Wrappers.WebGLVertexBufferLayoutWrapper}
         * @since 4.0.0
         */
        this.vertexBufferLayout = new WebGLVertexBufferLayoutWrapper(
            renderer,
            partialLayout,
            null
        );

        /**
         * The program manager used to create and manage shader programs.
         * This contains shader variants.
         *
         * @name Phaser.Renderer.WebGL.RenderNodes.BatchHandler#programManager
         * @type {Phaser.Renderer.WebGL.ProgramManager}
         * @since 4.0.0
         */
        this.programManager = new ProgramManager(
            renderer,
            [ this.vertexBufferLayout ],
            this.indexBuffer
        );

        // Fill in program configuration from config.
        this.programManager.setBaseShader(
            config.shaderName,
            config.vertexSource,
            config.fragmentSource
        );
        if (config.shaderAdditions)
        {
            for (var i = 0; i < config.shaderAdditions.length; i++)
            {
                var addition = config.shaderAdditions[i];
                this.programManager.addAddition(addition);
            }
        }
        if (config.shaderFeatures)
        {
            for (i = 0; i < config.shaderFeatures.length; i++)
            {
                this.programManager.addFeature(config.shaderFeatures[i]);
            }
        }

        /**
         * The number of bytes per instance, used to determine how much of the vertex buffer to upload.
         *
         * @name Phaser.Renderer.WebGL.RenderNodes.BatchHandler#bytesPerInstance
         * @type {number}
         * @since 4.0.0
         */
        this.bytesPerInstance = this.vertexBufferLayout.layout.stride * this.verticesPerInstance;

        /**
         * The number of floats per instance, used to determine how much of the vertex buffer to update.
         *
         * @name Phaser.Renderer.WebGL.RenderNodes.BatchHandler#floatsPerInstance
         * @type {number}
         * @since 4.0.0
         */
        this.floatsPerInstance = this.bytesPerInstance / Float32Array.BYTES_PER_ELEMENT;

        /**
         * The current batch entry being filled with textures.
         *
         * @name Phaser.Renderer.WebGL.RenderNodes.BatchHandler#currentBatchEntry
         * @type {Phaser.Types.Renderer.WebGL.WebGLBatchEntry}
         * @since 4.0.0
         */
        this.currentBatchEntry = {
            start: 0,
            count: 0,
            unit: 0,
            texture: []
        };

        /**
         * The entries in the batch.
         * Each entry represents a "sub-batch" of quads which use the same
         * pool of textures. This allows the renderer to continue to buffer
         * quads into the same batch without needing to upload the vertex
         * buffer. When the batch flushes, there will be one vertex buffer
         * upload, and one draw call per batch entry.
         *
         * @name Phaser.Renderer.WebGL.RenderNodes.BatchHandler#batchEntries
         * @type {Phaser.Types.Renderer.WebGL.WebGLBatchEntry[]}
         * @since 4.0.0
         * @default []
         */
        this.batchEntries = [];

        /**
         * The number of instances currently in the batch.
         *
         * @name Phaser.Renderer.WebGL.RenderNodes.BatchHandler#instanceCount
         * @type {number}
         * @since 4.0.0
         */
        this.instanceCount = 0;

        // Ensure that shader program has the correct number of textures.
        this.updateTextureCount(manager.maxParallelTextureUnits);

        // Set the dimension-related uniforms and listen for resize events.
        this.resize(renderer.width, renderer.height);
        renderer.on(Renderer.Events.RESIZE, this.resize, this);
    },

    /**
     * Copy and complete the configuration object.
     * This prevents the original config object from being modified.
     *
     * Default values are used for any missing properties.
     * These defaults are based on the default quad shader and layout.
     *
     * @method Phaser.Renderer.WebGL.RenderNodes.BatchHandler#_copyAndCompleteConfig
     * @since 4.0.0
     * @private
     * @param {Phaser.Renderer.WebGL.RenderNodes.RenderNodeManager} manager - The manager that owns this RenderNode.
     * @param {Phaser.Types.Renderer.WebGL.RenderNodes.BatchHandlerConfig} config - The configuration object.
     * @param {Phaser.Types.Renderer.WebGL.RenderNodes.BatchHandlerConfig} defaultConfig - The default configuration object.
     */
    _copyAndCompleteConfig: function (manager, config, defaultConfig)
    {
        var newConfig = {};

        newConfig.name = config.name || defaultConfig.name;
        newConfig.verticesPerInstance = config.verticesPerInstance || defaultConfig.verticesPerInstance;
        newConfig.indicesPerInstance = config.indicesPerInstance || defaultConfig.indicesPerInstance;

        newConfig.shaderName = config.shaderName || defaultConfig.shaderName;
        newConfig.vertexSource = config.vertexSource || defaultConfig.vertexSource;
        newConfig.fragmentSource = config.fragmentSource || defaultConfig.fragmentSource;

        // Deep copy shaderAdditions to avoid modifying the original object.
        newConfig.shaderAdditions = config.shaderAdditions || defaultConfig.shaderAdditions;
        if (Array.isArray(newConfig.shaderAdditions))
        {
            newConfig.shaderAdditions = newConfig.shaderAdditions.map(function (addition)
            {
                return Object.assign({}, addition);
            });
        }

        newConfig.shaderFeatures = config.shaderFeatures || defaultConfig.shaderFeatures;

        newConfig.indexBufferDynamic = config.indexBufferDynamic || defaultConfig.indexBufferDynamic;

        // These may be left undefined to auto-calculate instance count.
        newConfig.instancesPerBatch = config.instancesPerBatch;
        newConfig.maxTexturesPerBatch = config.maxTexturesPerBatch;

        // Set up vertex buffer layout.
        var layoutSource = config.vertexBufferLayout || defaultConfig.vertexBufferLayout;
        newConfig.vertexBufferLayout = {};
        newConfig.vertexBufferLayout.usage = layoutSource.usage;
        newConfig.vertexBufferLayout.layout = [];
        var remove = config.vertexBufferLayoutRemove || [];

        for (var i = 0; i < layoutSource.layout.length; i++)
        {
            var sourceAttr = layoutSource.layout[i];
            if (remove.indexOf(sourceAttr.name) !== -1)
            {
                continue;
            }
            newConfig.vertexBufferLayout.layout[i] = {
                name: sourceAttr.name,
                size: sourceAttr.size || 1,
                type: sourceAttr.type || 'FLOAT',
                normalized: sourceAttr.normalized || false
            };
        }

        if (config.vertexBufferLayoutAdd)
        {
            var add = config.vertexBufferLayoutAdd || [];
            for (i = 0; i < add.length; i++)
            {
                var addAttr = add[i];
                newConfig.vertexBufferLayout.layout.push({
                    name: addAttr.name,
                    size: addAttr.size || 1,
                    type: addAttr.type || 'FLOAT',
                    normalized: addAttr.normalized || false
                });
            }
        }

        return newConfig;
    },

    /**
     * Generate element indices for the instance vertices.
     * This should be overridden by subclasses.
     * This is called automatically when the node is initialized.
     *
     * @method Phaser.Renderer.WebGL.RenderNodes.BatchHandler#_generateElementIndices
     * @since 4.0.0
     * @private
     * @param {number} instances - The number of instances to define.
     * @return {ArrayBuffer} The index buffer data.
     */
    _generateElementIndices: function (instances)
    {
        // This is empty and should be overridden by subclasses.
        return new ArrayBuffer(instances * this.bytesPerInstance);
    },

    /**
     * Set new dimensions for the renderer.
     * This should be overridden by subclasses.
     *
     * This is called automatically when the renderer is resized.
     *
     * @method Phaser.Renderer.WebGL.RenderNodes.BatchHandler#resize
     * @since 4.0.0
     * @param {number} width - The new width of the renderer.
     * @param {number} height - The new height of the renderer.
     */
    resize: function (width, height) {},

    /**
     * Update the number of draw calls per batch.
     * This should be overridden by subclasses.
     *
     * This is called automatically by a listener
     * for the `Phaser.Renderer.Events.SET_PARALLEL_TEXTURE_UNITS` event,
     * triggered by the RenderNodeManager.
     *
     * @method Phaser.Renderer.WebGL.RenderNodes.BatchHandler#updateTextureCount
     * @since 4.0.0
     * @param {number} [count] - The new number of draw calls per batch. If undefined, the maximum number of texture units is used.
     */
    updateTextureCount: function (count) {},

    /**
     * Draw then empty the current batch.
     *
     * This method is called automatically, by either this node or the manager,
     * when the batch is full, or when something else needs to be rendered.
     *
     * This method should be overridden by subclasses.
     *
     * @method Phaser.Renderer.WebGL.RenderNodes.BatchHandler#run
     * @since 4.0.0
     * @param {Phaser.Renderer.WebGL.DrawingContext} drawingContext - The current drawing context.
     * @param {...*} [args] - Additional arguments to pass to the batch handler.
     */
    run: function (drawingContext) {},

    /**
     * Add an instance to the batch. Game objects call this method to add
     * themselves to the batch. This method should be overridden by subclasses.
     *
     * @method Phaser.Renderer.WebGL.RenderNodes.BatchHandler#batch
     * @param {...*} [args] - Arguments to pass to the batch handler. These will vary depending on the handler.
     * @since 4.0.0
     */
    batch: function () {}
});

module.exports = BatchHandler;
