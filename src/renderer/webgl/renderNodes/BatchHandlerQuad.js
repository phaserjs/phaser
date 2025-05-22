/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Vector2 = require('../../../math/Vector2');
var Class = require('../../../utils/Class');
var DeepCopy = require('../../../utils/object/DeepCopy');
var Utils = require('../Utils');
var ShaderSourceFS = require('../shaders/Multi-frag');
var ShaderSourceVS = require('../shaders/Multi-vert');
var MakeApplyLighting = require('../shaders/additionMakers/MakeApplyLighting');
var MakeApplyTint = require('../shaders/additionMakers/MakeApplyTint');
var MakeDefineLights = require('../shaders/additionMakers/MakeDefineLights');
var MakeDefineTexCount = require('../shaders/additionMakers/MakeDefineTexCount');
var MakeGetNormalFromMap = require('../shaders/additionMakers/MakeGetNormalFromMap');
var MakeGetTexCoordOut = require('../shaders/additionMakers/MakeGetTexCoordOut');
var MakeGetTexRes = require('../shaders/additionMakers/MakeGetTexRes');
var MakeGetTexture = require('../shaders/additionMakers/MakeGetTexture');
var MakeOutInverseRotation = require('../shaders/additionMakers/MakeOutInverseRotation');
var MakeRotationDatum = require('../shaders/additionMakers/MakeRotationDatum');
var MakeSmoothPixelArt = require('../shaders/additionMakers/MakeSmoothPixelArt');
var BatchHandler = require('./BatchHandler');

/**
 * @classdesc
 * This RenderNode draws Standard Batch Render (SBR) quads in batches.
 *
 * @class BatchHandlerQuad
 * @extends Phaser.Renderer.WebGL.RenderNodes.BatchHandler
 * @memberof Phaser.Renderer.WebGL.RenderNodes
 * @constructor
 * @since 4.0.0
 * @param {Phaser.Renderer.WebGL.RenderNodes.RenderNodeManager} manager - The manager that owns this RenderNode.
 * @param {Phaser.Types.Renderer.WebGL.RenderNodes.BatchHandlerConfig} [config] - The configuration object for this handler.
 */
var BatchHandlerQuad = new Class({
    Extends: BatchHandler,

    initialize: function BatchHandlerQuad (manager, config)
    {
        // Placed before super call because the constructor needs it.
        /**
         * The current render options to which the batch is built.
         * These help define the shader.
         *
         * @name Phaser.Renderer.WebGL.RenderNodes.BatchHandlerQuad#renderOptions
         * @type {object}
         * @since 4.0.0
         */
        this.renderOptions = {
            multiTexturing: false,
            texRes: false,
            lighting: false,
            selfShadow: false,
            selfShadowPenumbra: 0,
            selfShadowThreshold: 0,
            smoothPixelArt: false
        };

        BatchHandler.call(this, manager, this.defaultConfig, config);

        // Main sampler will never change after initialization,
        // because it addresses texture units, not textures.
        this.programManager.setUniform(
            'uMainSampler[0]',
            this.manager.renderer.textureUnitIndices
        );

        /**
         * The render options currently being built.
         *
         * @name Phaser.Renderer.WebGL.RenderNodes.BatchHandlerQuad#nextRenderOptions
         * @type {object}
         * @since 4.0.0
         */
        this.nextRenderOptions = DeepCopy(this.renderOptions);

        /**
         * Whether the render options have changed.
         *
         * @name Phaser.Renderer.WebGL.RenderNodes.BatchHandlerQuad#_renderOptionsChanged
         * @type {boolean}
         * @private
         * @since 4.0.0
         */
        this._renderOptionsChanged = false;

        /**
         * A persistent calculation vector used when processing the lights.
         *
         * @name Phaser.Renderer.WebGL.RenderNodes.BatchHandlerQuad#_lightVector
         * @type {Phaser.Math.Vector2}
         * @private
         * @since 4.0.0
         */
        this._lightVector = new Vector2();
    },

    /**
     * The default configuration object for this handler.
     * This is merged with the `config` object passed in the constructor.
     *
     * @name Phaser.Renderer.WebGL.RenderNodes.BatchHandlerQuad#defaultConfig
     * @type {Phaser.Types.Renderer.WebGL.RenderNodes.BatchHandlerConfig}
     * @since 4.0.0
     */
    defaultConfig: {
        name: 'BatchHandlerQuad',
        verticesPerInstance: 4,
        indicesPerInstance: 6,
        shaderName: 'STANDARD',
        vertexSource: ShaderSourceVS,
        fragmentSource: ShaderSourceFS,
        shaderAdditions: [
            MakeGetTexCoordOut(),
            MakeGetTexRes(true),
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
     * @since 4.0.0
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
     * @method Phaser.Renderer.WebGL.RenderNodes.BatchHandlerQuad#updateTextureCount
     * @since 4.0.0
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
            this.manager.finishBatch();
        }

        this.maxTexturesPerBatch = newCount;

        // Update program manager to use the new texture count.
        if (this.renderOptions.multiTexturing)
        {
            var programManager = this.programManager;
            var textureAddition = programManager.getAdditionsByTag('TEXTURE')[0];
            if (textureAddition)
            {
                programManager.replaceAddition(
                    textureAddition.name,
                    MakeGetTexture(this.maxTexturesPerBatch)
                );
            }
        }

        this.resize(renderer.width, renderer.height);
    },

    /**
     * Update the uniforms for the current shader program.
     *
     * This method is called automatically when the batch is run.
     *
     * @method Phaser.Renderer.WebGL.RenderNodes.BatchHandlerQuad#setupUniforms
     * @since 4.0.0
     * @param {Phaser.Renderer.WebGL.DrawingContext} drawingContext - The current drawing context.
     */
    setupUniforms: function (drawingContext)
    {
        var programManager = this.programManager;
        var renderOptions = this.renderOptions;

        // Standard uniforms.
        programManager.setUniform(
            'uResolution',
            [ drawingContext.width, drawingContext.height ]
        );

        drawingContext.renderer.setProjectionMatrixFromDrawingContext(drawingContext);
        programManager.setUniform(
            'uProjectionMatrix',
            drawingContext.renderer.projectionMatrix.val
        );

        if (this.renderOptions.lighting)
        {
            // Lighting uniforms.
            Utils.updateLightingUniforms(
                renderOptions.lighting,
                drawingContext,
                programManager,
                1,
                this._lightVector,
                renderOptions.selfShadow,
                renderOptions.selfShadowThreshold,
                renderOptions.selfShadowPenumbra
            );
        }
    },

    /**
     * Update the texture uniforms for the current shader program.
     *
     * This method is called automatically when the batch is run.
     *
     * @method Phaser.Renderer.WebGL.RenderNodes.BatchHandlerQuad#setupTextureUniforms
     * @since 4.0.0
     * @param {Phaser.Renderer.WebGL.Wrappers.WebGLTextureWrapper[]} textures - The textures to render.
     */
    setupTextureUniforms: function (textures)
    {
        var programManager = this.programManager;

        if (this.renderOptions.multiTexturing)
        {
            // In the shader, this is an array of vec2s.
            // But we must compose it as a flat array,
            // not an array of arrays.
            var dims = [];
            for (var i = 0; i < textures.length; i++)
            {
                dims.push(textures[i].width, textures[i].height);
            }
            programManager.setUniform(
                'uMainResolution[0]',
                dims
            );
        }
        else
        {
            programManager.setUniform(
                'uMainResolution[0]',
                [ textures[0].width, textures[0].height ]
            );
        }

    },

    /**
     * Finalize the texture count for the current sub-batch.
     * This is called automatically when the render is run.
     * It requests a shader program with the necessary number of textures,
     * if that is less than the maximum allowed.
     * This reduces the number of textures the GPU must handle,
     * which can improve performance.
     *
     * @method Phaser.Renderer.WebGL.RenderNodes.BatchHandlerQuad#finalizeTextureCount
     * @param {number} count - The total number of textures in the batch.
     */
    finalizeTextureCount: function (count)
    {
        var programManager = this.programManager;

        if (this.renderOptions.lighting)
        {
            // The normal map is included in the textures array,
            // but it's attached to another texture unit,
            // so we shouldn't count it.
            count = 1;
        }

        var textureAddition = programManager.getAdditionsByTag('TEXTURE')[0];
        if (textureAddition)
        {
            programManager.replaceAddition(
                textureAddition.name,
                MakeGetTexture(count)
            );
        }

        var texCountAddition = programManager.getAdditionsByTag('TexCount')[0];
        if (texCountAddition)
        {
            programManager.replaceAddition(
                texCountAddition.name,
                MakeDefineTexCount(count)
            );
        }
    },

    /**
     * Update the render options for the current shader program.
     *
     * @method Phaser.Renderer.WebGL.RenderNodes.BatchHandlerQuad#updateRenderOptions
     * @since 4.0.0
     * @param {object} renderOptions - The new render options.
     */
    updateRenderOptions: function (renderOptions)
    {
        var newRenderOptions = this.nextRenderOptions;
        var oldRenderOptions = this.renderOptions;
        var changed = false;

        var multiTexturing = !!renderOptions.multiTexturing && !renderOptions.lighting;
        if (multiTexturing !== oldRenderOptions.multiTexturing)
        {
            newRenderOptions.multiTexturing = multiTexturing;
            changed = true;
        }

        var lighting = !!renderOptions.lighting;
        if (lighting !== oldRenderOptions.lighting)
        {
            newRenderOptions.lighting = lighting;
            changed = true;
        }

        var selfShadow = lighting && renderOptions.lighting.selfShadow && renderOptions.lighting.selfShadow.enabled;
        if (selfShadow !== oldRenderOptions.selfShadow)
        {
            newRenderOptions.selfShadow = selfShadow;
            changed = true;
        }

        var selfShadowPenumbra = selfShadow ? renderOptions.lighting.selfShadow.penumbra : 0;
        if (selfShadowPenumbra !== oldRenderOptions.selfShadowPenumbra)
        {
            newRenderOptions.selfShadowPenumbra = selfShadowPenumbra;
            changed = true;
        }

        var selfShadowThreshold = selfShadow ? renderOptions.lighting.selfShadow.diffuseFlatThreshold : 0;
        if (selfShadowThreshold !== oldRenderOptions.selfShadowThreshold)
        {
            newRenderOptions.selfShadowThreshold = selfShadowThreshold;
            changed = true;
        }

        var smoothPixelArt = !!renderOptions.smoothPixelArt;
        if (smoothPixelArt !== oldRenderOptions.smoothPixelArt)
        {
            newRenderOptions.smoothPixelArt = smoothPixelArt;
            newRenderOptions.texRes = smoothPixelArt;
            changed = true;
        }

        this._renderOptionsChanged = changed;
    },

    /**
     * Update the shader configuration based on render options.
     * This is called automatically when the render options change.
     *
     * @method Phaser.Renderer.WebGL.RenderNodes.BatchHandlerQuad#updateShaderConfig
     * @since 4.0.0
     */
    updateShaderConfig: function ()
    {
        var programManager = this.programManager;
        var oldRenderOptions = this.renderOptions;
        var newRenderOptions = this.nextRenderOptions;
        var i;

        if (oldRenderOptions.multiTexturing !== newRenderOptions.multiTexturing)
        {
            var multiTexturing = newRenderOptions.multiTexturing;
            oldRenderOptions.multiTexturing = multiTexturing;

            var texCountAddition = programManager.getAdditionsByTag('TexCount')[0];
            if (texCountAddition)
            {
                programManager.replaceAddition(
                    texCountAddition.name,
                    MakeDefineTexCount(multiTexturing ? this.maxTexturesPerBatch : 1)
                );
            }

            var textureAddition = programManager.getAdditionsByTag('TEXTURE')[0];
            if (textureAddition)
            {
                programManager.replaceAddition(
                    textureAddition.name,
                    MakeGetTexture(multiTexturing ? this.maxTexturesPerBatch : 1)
                );
            }
        }

        if (oldRenderOptions.lighting !== newRenderOptions.lighting)
        {
            var lighting = newRenderOptions.lighting;
            oldRenderOptions.lighting = lighting;

            var lightingAdditions = programManager.getAdditionsByTag('LIGHTING');
            for (i = 0; i < lightingAdditions.length; i++)
            {
                var lightingAddition = lightingAdditions[i];
                lightingAddition.disable = !lighting;
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

        if (oldRenderOptions.selfShadow !== newRenderOptions.selfShadow)
        {
            var selfShadow = newRenderOptions.selfShadow;
            oldRenderOptions.selfShadow = selfShadow;

            if (selfShadow)
            {
                programManager.addFeature('SELFSHADOW');
            }
            else
            {
                programManager.removeFeature('SELFSHADOW');
            }
        }

        oldRenderOptions.selfShadowPenumbra = newRenderOptions.selfShadowPenumbra;
        oldRenderOptions.selfShadowThreshold = newRenderOptions.selfShadowThreshold;

        if (oldRenderOptions.smoothPixelArt !== newRenderOptions.smoothPixelArt)
        {
            var smoothPixelArt = newRenderOptions.smoothPixelArt;
            oldRenderOptions.smoothPixelArt = smoothPixelArt;

            var smoothPixelArtAddition = programManager.getAddition('SmoothPixelArt');
            if (smoothPixelArtAddition)
            {
                smoothPixelArtAddition.disable = !smoothPixelArt;
            }
        }

        if (oldRenderOptions.texRes !== newRenderOptions.texRes)
        {
            var texRes = newRenderOptions.texRes;
            oldRenderOptions.texRes = texRes;

            var texResAddition = programManager.getAddition('GetTexRes');
            if (texResAddition)
            {
                texResAddition.disable = !texRes;
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
     * @since 4.0.0
     * @param {Phaser.Renderer.WebGL.DrawingContext} drawingContext - The current drawing context.
     */
    run: function (drawingContext)
    {
        if (this.instanceCount === 0) { return; }

        this.onRunBegin(drawingContext);

        // Finalize the current batch entry.
        this.pushCurrentBatchEntry();

        var programManager = this.programManager;

        var bytesPerIndexPerInstance = this.bytesPerIndexPerInstance;
        var indicesPerInstance = this.indicesPerInstance;
        var renderer = this.manager.renderer;
        var vertexBuffer = this.vertexBufferLayout.buffer;

        // Update vertex buffers.
        // Because we frequently aren't filling the entire buffer,
        // we need to update the buffer with the correct size.
        vertexBuffer.update(this.instanceCount * this.bytesPerInstance);

        var subBatches = this.batchEntries.length;
        for (var i = 0; i < subBatches; i++)
        {
            var entry = this.batchEntries[i];

            this.finalizeTextureCount(entry.unit);

            var programSuite = programManager.getCurrentProgramSuite();

            if (programSuite)
            {
                var program = programSuite.program;
                var vao = programSuite.vao;

                this.setupUniforms(drawingContext);
                programManager.applyUniforms(program);

                if (this.renderOptions.texRes)
                {
                    this.setupTextureUniforms(entry.texture);
                    programManager.applyUniforms(program);
                }

                renderer.drawElements(
                    drawingContext,
                    entry.texture,
                    program,
                    vao,
                    entry.count * indicesPerInstance,
                    entry.start * bytesPerIndexPerInstance
                );
            }
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
     * @since 4.0.0
     * @param {Phaser.Renderer.WebGL.DrawingContext} currentContext - The current drawing context.
     * @param {Phaser.Renderer.WebGL.Wrappers.WebGLTextureWrapper} glTexture - The texture to render.
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
     * @param {boolean} tintFill - Whether to tint the fill color.
     * @param {number} tintTL - The top-left tint color.
     * @param {number} tintBL - The bottom-left tint color.
     * @param {number} tintTR - The top-right tint color.
     * @param {number} tintBR - The bottom-right tint color.
     * @param {Phaser.Types.Renderer.WebGL.RenderNodes.BatchHandlerQuadRenderOptions} renderOptions - Optional render features.
     * @param {...*} [args] - Additional arguments for subclasses.
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
        this.updateRenderOptions(renderOptions);
        if (this._renderOptionsChanged)
        {
            this.run(currentContext);
            this.updateShaderConfig();
        }

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
     * @since 4.0.0
     * @param {Phaser.Renderer.WebGL.Wrappers.WebGLTextureWrapper} glTexture - The texture to render.
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
     * @since 4.0.0
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
