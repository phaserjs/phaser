/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2024 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Vector2 = require('../../../math/Vector2');
var Class = require('../../../utils/Class');
var Utils = require('../Utils');
var ShaderSourceFS = require('../shaders/Multi-frag');
var ShaderSourceVS = require('../shaders/Multi-vert');
var MakeApplyLighting = require('../shaders/configs/MakeApplyLighting');
var MakeApplyTint = require('../shaders/configs/MakeApplyTint');
var MakeGetTexture = require('../shaders/configs/MakeGetTexture');
var MakeRotationDatum = require('../shaders/configs/MakeRotationDatum');
var BatchHandler = require('./BatchHandler');

/**
 * @classdesc
 * This RenderNode draws Standard Batch Render (SBR) quads in batches.
 *
 * @class BatchHandlerQuad
 * @extends Phaser.Renderer.WebGL.RenderNodes.Batch
 * @memberof Phaser.Renderer.WebGL.RenderNodes
 * @constructor
 * @since 3.90.0
 * @param {Phaser.Renderer.WebGL.RenderNodes.RenderNodeManager} manager - The manager that owns this RenderNode.
 * @param {Phaser.Types.Renderer.WebGL.RenderNodes.BatchHandlerConfig} [config] - The configuration object for this handler.
 */
var BatchHandlerQuad = new Class({
    Extends: BatchHandler,

    initialize: function BatchHandlerQuad (manager, config)
    {
        /**
         * The current render options to which the batch is built.
         * These help define the shader.
         *
         * @name Phaser.Renderer.WebGL.RenderNodes.BatchHandlerQuad#renderOptions
         * @type {object}
         * @since 3.90.0
         */
        this.renderOptions = {
            multiTexturing: false,
            lighting: false,
            selfShadow: false,
            selfShadowPenumbra: 0,
            selfShadowThreshold: 0
        };

        BatchHandler.call(this, manager, config, this.defaultConfig);

        // Main sampler will never change after initialization,
        // because it addresses texture units, not textures.
        this.programManager.setUniform(
            'uMainSampler[0]',
            this.manager.renderer.textureUnitIndices
        );

        /**
         * A persistent calculation vector used when processing the lights.
         *
         * @name Phaser.Renderer.WebGL.RenderNodes.BatchHandlerQuad#_lightVector
         * @type {Phaser.Math.Vector2}
         * @private
         * @since 3.90.0
         */
        this._lightVector = new Vector2();
    },

    /**
     * The default configuration object for this handler.
     * This is merged with the `config` object passed in the constructor.
     *
     * @name Phaser.Renderer.WebGL.RenderNodes.BatchHandlerQuad#defaultConfig
     * @type {Phaser.Types.Renderer.WebGL.RenderNodes.BatchHandlerConfig}
     * @since 3.90.0
     */
    defaultConfig: {
        name: 'BatchHandlerQuad',
        verticesPerInstance: 4,
        indicesPerInstance: 6,
        shaderName: 'STANDARD',
        vertexSource: ShaderSourceVS,
        fragmentSource: ShaderSourceFS,
        shaderAdditions: [
            MakeGetTexture(1),
            MakeApplyTint(),
            MakeRotationDatum(true),
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

    /**
     * Generate element indices for the instance vertices.
     * This is called automatically when the node is initialized.
     *
     * By default, each instance is a quad.
     * Each quad is drawn as two triangles, with the vertices in the order:
     * 0, 0, 1, 2, 3, 3. The quads are drawn as a TRIANGLE_STRIP, so the
     * repeated vertices form degenerate triangles to connect the quads
     * without being drawn.
     *
     * @method Phaser.Renderer.WebGL.RenderNodes.BatchHandlerQuad#_generateElementIndices
     * @since 3.90.0
     * @private
     * @param {number} instances - The number of instances to define.
     * @return {ArrayBuffer} The index buffer data.
     */
    _generateElementIndices: function (instances)
    {
        var buffer = new ArrayBuffer(instances * 6 * 2);
        var indices = new Uint16Array(buffer);
        var offset = 0;
        for (var i = 0; i < instances; i++)
        {
            var index = i * 4;
            indices[offset++] = index;
            indices[offset++] = index;
            indices[offset++] = index + 1;
            indices[offset++] = index + 2;
            indices[offset++] = index + 3;
            indices[offset++] = index + 3;
        }
        return buffer;
    },

    /**
     * Update the number of draw calls per batch.
     * This rebuilds the shader program with the new draw call count.
     * The minimum number of draw calls is 1, and the maximum is the number of
     * texture units defined in the renderer.
     * Rebuilding the shader may be expensive, so use this sparingly.
     *
     * If this runs during a batch, and the new count is less than the number of
     * textures in the current batch entry, the batch will be flushed before the
     * shader program is rebuilt, so none of the textures are skipped.
     *
     * This is usually called automatically by a listener
     * for the `Phaser.Renderer.Events.SET_PARALLEL_TEXTURE_UNITS` event,
     * triggered by the RenderNodeManager.
     *
     * @method Phaser.Renderer.WebGL.RenderNodes.Pressurizer#updateTextureCount
     * @since 3.90.0
     * @param {number} [count] - The new number of draw calls per batch. If undefined, the maximum number of texture units is used.
     */
    updateTextureCount: function (count)
    {
        var renderer = this.manager.renderer;

        if (count === undefined)
        {
            count = renderer.maxTextures;
        }

        var newCount = Math.max(1, Math.min(count, renderer.maxTextures));
        if (newCount === this.maxTexturesPerBatch)
        {
            return;
        }

        if (
            newCount < this.currentBatchEntry.unit &&
            this.manager.currentBatchNode === this
        )
        {
            // The batch is currently running. Flush the current batch entry,
            // before the shader program becomes unable to handle all textures.
            this.manager.setCurrentBatchNode(null);
        }

        this.maxTexturesPerBatch = newCount;

        // Update program manager to use the new texture count.
        if (this.renderOptions.multiTexturing)
        {
            var programManager = this.programManager;
            var textureAdditions = programManager.getAdditionsByTag('TEXTURE');
            while (textureAdditions.length > 0)
            {
                var textureAddition = textureAdditions.pop();
                programManager.removeAddition(textureAddition.name);
            }
            programManager.addAddition(
                MakeGetTexture(this.maxTexturesPerBatch),
                0
            );
        }

        this.resize(renderer.width, renderer.height);
    },

    /**
     * Update the uniforms for the current shader program.
     *
     * This method is called automatically when the batch is run.
     *
     * @method Phaser.Renderer.WebGL.RenderNodes.BatchHandlerQuad#setupUniforms
     * @since 3.90.0
     * @param {Phaser.Types.Renderer.WebGL.DrawingContext} drawingContext - The current drawing context.
     */
    setupUniforms: function (drawingContext)
    {
        var programManager = this.programManager;
        var renderOptions = this.renderOptions;

        // Standard uniforms.
        programManager.setUniform(
            'uRoundPixels',
            drawingContext.camera.roundPixels
        );

        programManager.setUniform(
            'uResolution',
            [ drawingContext.width, drawingContext.height ]
        );

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
            renderOptions.lighting,
            this.manager.renderer,
            drawingContext,
            programManager,
            1,
            this._lightVector,
            renderOptions.selfShadow,
            renderOptions.selfShadowThreshold,
            renderOptions.selfShadowPenumbra
        );
    },

    /**
     * Update the render options for the current shader program.
     * If the options have changed, the batch is run to apply the changes.
     *
     * @method Phaser.Renderer.WebGL.RenderNodes.BatchHandlerQuad#updateRenderOptions
     * @since 3.90.0
     * @param {Phaser.Types.Renderer.WebGL.DrawingContext} drawingContext - The current drawing context.
     * @param {object} renderOptions - The new render options.
     */
    updateRenderOptions: function (drawingContext, renderOptions)
    {
        var programManager = this.programManager;
        var oldRenderOptions = this.renderOptions;
        var newRenderOptions = {
            multiTexturing: false,
            lighting: false,
            selfShadow: false,
            selfShadowPenumbra: 0,
            selfShadowThreshold: 0
        };

        // Parse shader-relevant render options.
        if (renderOptions)
        {
            // Multitexturing is disabled if other textures are in use.
            newRenderOptions.multiTexturing = !!renderOptions.multiTexturing && !renderOptions.lighting;

            newRenderOptions.lighting = !!renderOptions.lighting;

            if (renderOptions.lighting && renderOptions.lighting.selfShadow && renderOptions.lighting.selfShadow.enabled)
            {
                newRenderOptions.selfShadow = true;
                newRenderOptions.selfShadowPenumbra = renderOptions.lighting.selfShadow.penumbra;
                newRenderOptions.selfShadowThreshold = renderOptions.lighting.selfShadow.diffuseFlatThreshold;
            }
        }

        // Check for changes.
        var updateTexturing = newRenderOptions.multiTexturing !== oldRenderOptions.multiTexturing;
        var updateLighting = newRenderOptions.lighting !== oldRenderOptions.lighting;
        var updateSelfShadow = newRenderOptions.selfShadow !== oldRenderOptions.selfShadow;
        var updateSelfShadowPenumbra = newRenderOptions.selfShadowPenumbra !== oldRenderOptions.selfShadowPenumbra;
        var updateSelfShadowThreshold = newRenderOptions.selfShadowThreshold !== oldRenderOptions.selfShadowThreshold;

        // Run the batch if the shader has changed.
        if (updateTexturing || updateLighting || updateSelfShadow || updateSelfShadowPenumbra || updateSelfShadowThreshold)
        {
            this.run(drawingContext);
        }

        // Cache new render options.
        this.renderOptions = newRenderOptions;

        // Update shader program configuration.
        if (updateTexturing)
        {
            var texturingAddition = programManager.getAdditionsByTag('TEXTURE')[0];
            if (texturingAddition)
            {
                programManager.removeAddition(texturingAddition.name);

            }
            var texCount = newRenderOptions.multiTexturing ? this.maxTexturesPerBatch : 1;
            programManager.addAddition(
                MakeGetTexture(texCount),
                0
            );
        }

        if (updateLighting)
        {
            var lightingAddition = programManager.getAddition('LIGHTING');
            if (lightingAddition)
            {
                lightingAddition.disable = !newRenderOptions.lighting;
                if (newRenderOptions.lighting)
                {
                    lightingAddition.additions.fragmentDefine = '#define LIGHT_COUNT ' + this.manager.renderer.config.maxLights;
                }
            }

            var rotationAddition = programManager.getAddition('RotDatum');
            if (rotationAddition)
            {
                rotationAddition.disable = !newRenderOptions.lighting;
            }
        }

        if (updateSelfShadow)
        {
            if (newRenderOptions.selfShadow)
            {
                programManager.addFeature('SELFSHADOW');
            }
            else
            {
                programManager.removeFeature('SELFSHADOW');
            }
        }
    },

    /**
     * Draw then empty the current batch.
     *
     * This method is called automatically, by either this node or the manager,
     * when the batch is full, or when something else needs to be rendered.
     *
     * @method Phaser.Renderer.WebGL.RenderNodes.BatchHandlerQuad#run
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

        var bytesPerIndexPerInstance = this.bytesPerIndexPerInstance;
        var indicesPerInstance = this.indicesPerInstance;
        var renderer = this.manager.renderer;
        var vertexBuffer = this.vertexBufferLayout.buffer;

        // Finalize the current batch entry.
        this.pushCurrentBatchEntry();

        // Update vertex buffers.
        // Because we are probably using a generic vertex buffer
        // which is larger than the current batch, we need to update
        // the buffer with the correct size.
        vertexBuffer.update(this.instanceCount * this.bytesPerInstance);

        var subBatches = this.batchEntries.length;
        for (var i = 0; i < subBatches; i++)
        {
            var entry = this.batchEntries[i];
            renderer.drawElements(
                drawingContext,
                entry.texture,
                program,
                vao,
                entry.count * indicesPerInstance,
                entry.start * bytesPerIndexPerInstance
            );
        }

        // Reset batch accumulation.
        this.instanceCount = 0;
        this.currentBatchEntry.start = 0;
        this.batchEntries.length = 0;

        this.onRunEnd(drawingContext);
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
     * @method Phaser.Renderer.WebGL.RenderNodes.BatchHandlerQuad#batch
     * @since 3.90.0
     * @param {Phaser.Types.Renderer.WebGL.DrawingContext} currentContext - The current drawing context.
     * @param {Phaser.Renderer.WebGL.WebGLTextureWrapper} glTexture - The texture to render.
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
     * @param {number} tintFill - Whether to tint the fill color.
     * @param {number} tintTL - The top-left tint color.
     * @param {number} tintBL - The bottom-left tint color.
     * @param {number} tintTR - The top-right tint color.
     * @param {number} tintBR - The bottom-right tint color.
     * @param {object} [renderOptions] - Optional render features.
     * @param {boolean} [renderOptions.multiTexturing] - Whether to use multi-texturing.
     * @param {object} [renderOptions.lighting] - How to treat lighting. If this object is defined, lighting will be activated, and multi-texturing disabled.
     * @param {Phaser.Renderer.WebGL.WebGLTextureWrapper} renderOptions.lighting.normalGLTexture - The normal map texture to render.
     * @param {number} renderOptions.lighting.normalMapRotation - The rotation of the normal map texture.
     * @param {object} [renderOptions.lighting.selfShadow] - Self-shadowing options.
     * @param {boolean} renderOptions.lighting.selfShadow.enabled - Whether to use self-shadowing.
     * @param {number} renderOptions.lighting.selfShadow.penumbra - Self-shadowing penumbra strength.
     * @param {number} renderOptions.lighting.selfShadow.diffuseFlatThreshold - Self-shadowing texture brightness equivalent to a flat surface.
     */
    batch: function (
        currentContext,
        glTexture,
        x0, y0,
        x1, y1,
        x2, y2,
        x3, y3,
        texX, texY,
        texWidth, texHeight,
        tintFill,
        tintTL, tintBL, tintTR, tintBR,
        renderOptions
    )
    {
        if (this.instanceCount === 0)
        {
            this.manager.setCurrentBatchNode(this, currentContext);
        }

        // Check render options and run the batch if they differ.
        this.updateRenderOptions(currentContext, renderOptions);

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
        vertexViewF32[vertexOffset32++] = texX;
        vertexViewF32[vertexOffset32++] = texY + texHeight;
        vertexViewF32[vertexOffset32++] = textureDatum;
        vertexViewF32[vertexOffset32++] = tintFill;
        vertexViewU32[vertexOffset32++] = tintBL;

        // Top-left
        vertexViewF32[vertexOffset32++] = x0;
        vertexViewF32[vertexOffset32++] = y0;
        vertexViewF32[vertexOffset32++] = texX;
        vertexViewF32[vertexOffset32++] = texY;
        vertexViewF32[vertexOffset32++] = textureDatum;
        vertexViewF32[vertexOffset32++] = tintFill;
        vertexViewU32[vertexOffset32++] = tintTL;

        // Bottom-right
        vertexViewF32[vertexOffset32++] = x3;
        vertexViewF32[vertexOffset32++] = y3;
        vertexViewF32[vertexOffset32++] = texX + texWidth;
        vertexViewF32[vertexOffset32++] = texY + texHeight;
        vertexViewF32[vertexOffset32++] = textureDatum;
        vertexViewF32[vertexOffset32++] = tintFill;
        vertexViewU32[vertexOffset32++] = tintBR;

        // Top-right
        vertexViewF32[vertexOffset32++] = x2;
        vertexViewF32[vertexOffset32++] = y2;
        vertexViewF32[vertexOffset32++] = texX + texWidth;
        vertexViewF32[vertexOffset32++] = texY;
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
            this.run(currentContext);

            // Now the batch is empty.
        }
    },

    /**
     * Process textures for batching.
     * This method is called automatically by the `batch` method.
     * It returns a piece of data used for various texture tasks,
     * depending on the render options.
     *
     * The texture datum may be used for texture ID or normal map rotation.
     *
     * @method Phaser.Renderer.WebGL.RenderNodes.BatchHandlerQuad#batchTextures
     * @since 3.90.0
     * @param {Phaser.Renderer.WebGL.WebGLTextureWrapper} glTexture - The texture to render.
     * @param {object} renderOptions - The current render options.
     * @return {number} The texture datum.
     */
    batchTextures: function (glTexture, renderOptions)
    {
        var newRenderOptions = this.renderOptions;

        // Texture data, used for either texture ID or normal map rotation.
        var textureDatum = 0;

        var currentBatchEntry = this.currentBatchEntry;
        if (newRenderOptions.multiTexturing)
        {
            // Multi Texture
    
            // Check if the texture is already in the batch.
            // This could be a very expensive operation if we're not careful.
            // If we just use `batchTextures.indexOf`, a linear search,
            // we can use up to 20% of a frame budget.
            // Instead, we cache the texture unit index on the texture itself,
            // so we can immediately tell whether it's in the batch.
            // We reset this value when we flush the batch.
    
            textureDatum = glTexture.batchUnit;
            if (textureDatum === -1)
            {
                if (currentBatchEntry.texture.length === this.maxTexturesPerBatch)
                {
                    // Commit the current batch entry and start a new one.
                    this.pushCurrentBatchEntry();
                    currentBatchEntry = this.currentBatchEntry;
                }
                textureDatum = currentBatchEntry.unit;
                glTexture.batchUnit = textureDatum;
                currentBatchEntry.texture[textureDatum] = glTexture;
                currentBatchEntry.unit++;
            }
        }
        else if (newRenderOptions.lighting)
        {
            textureDatum = renderOptions.lighting.normalMapRotation;

            var normalGLTexture = renderOptions.lighting.normalGLTexture;
            if (
                currentBatchEntry.texture[0] !== glTexture ||
                currentBatchEntry.texture[1] !== normalGLTexture
            )
            {
                this.pushCurrentBatchEntry();

                // // Complete the entire batch if the texture changes.
                // this.run(currentContext);

                // Current batch entry has been redefined.
                currentBatchEntry = this.currentBatchEntry;
                glTexture.batchUnit = 0;
                normalGLTexture.batchUnit = 1;
                currentBatchEntry.texture[0] = glTexture;
                currentBatchEntry.texture[1] = normalGLTexture;
                currentBatchEntry.unit = 2;
            }
        }
        else if (currentBatchEntry.texture[0] !== glTexture)
        {
            // Single texture.
            this.pushCurrentBatchEntry();

            // Current batch entry has been redefined.
            currentBatchEntry = this.currentBatchEntry;
            glTexture.batchUnit = 0;
            currentBatchEntry.texture[0] = glTexture;
            currentBatchEntry.unit = 1;
        }

        return textureDatum;
    },

    /**
     * Push the current batch entry to the batch entry list,
     * and create a new batch entry for future use.
     *
     * @method Phaser.Renderer.WebGL.RenderNodes.BatchHandlerQuad#pushCurrentBatchEntry
     * @since 3.90.0
     */
    pushCurrentBatchEntry: function ()
    {
        if (this.currentBatchEntry.count < 1)
        {
            return;
        }

        this.batchEntries.push(this.currentBatchEntry);

        // Clear unit assignment on textures.
        var texture = this.currentBatchEntry.texture;
        for (var i = 0; i < texture.length; i++)
        {
            texture[i].batchUnit = -1;
        }

        this.currentBatchEntry = {
            start: this.instanceCount,
            count: 0,
            unit: 0,
            texture: []
        };
    }
});

module.exports = BatchHandlerQuad;
