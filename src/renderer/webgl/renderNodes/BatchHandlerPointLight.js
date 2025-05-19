/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../../utils/Class');
var ShaderSourceFS = require('../shaders/PointLight-frag');
var ShaderSourceVS = require('../shaders/PointLight-vert');
var BatchHandler = require('./BatchHandler');

/**
 * @classdesc
 * This RenderNode draws PointLight Game Objects in WebGL.
 *
 * @class BatchHandlerPointLight
 * @extends Phaser.Renderer.WebGL.RenderNodes.BatchHandler
 * @memberof Phaser.Renderer.WebGL.RenderNodes
 * @constructor
 * @since 4.0.0
 * @param {Phaser.Renderer.WebGL.RenderNodes.RenderNodeManager} manager - The manager that owns this RenderNode.
 * @param {Phaser.Types.Renderer.WebGL.RenderNodes.BatchHandlerConfig} [config] - The configuration object for this handler.
 */
var BatchHandlerPointLight = new Class({

    Extends: BatchHandler,

    initialize: function (manager, config)
    {
        BatchHandler.call(this, manager, this.defaultConfig, config);

        /**
         * An empty texture array used internally.
         *
         * @name Phaser.Renderer.WebGL.RenderNodes.BatchHandlerPointLight#_emptyTextures
         * @type {Phaser.Renderer.WebGL.Wrappers.WebGLTextureWrapper[]}
         * @private
         * @since 4.0.0
         * @default []
         * @readonly
         */
        this._emptyTextures = [];
    },

    /**
     * The default configuration for this handler.
     *
     * @name Phaser.Renderer.WebGL.RenderNodes.BatchHandlerPointLight#defaultConfig
     * @type {Phaser.Types.Renderer.WebGL.RenderNodes.BatchHandlerConfig}
     * @since 4.0.0
     * @readonly
     */
    defaultConfig: {
        name: 'BatchHandlerPointLight',
        verticesPerInstance: 4,
        indicesPerInstance: 6,
        shaderName: 'POINTLIGHT',
        vertexSource: ShaderSourceVS,
        fragmentSource: ShaderSourceFS,
        vertexBufferLayout: {
            usage: 'DYNAMIC_DRAW',
            layout: [
                {
                    name: 'inPosition',
                    size: 2
                },
                {
                    name: 'inLightPosition',
                    size: 2
                },
                {
                    name: 'inLightRadius',
                    size: 1
                },
                {
                    name: 'inLightAttenuation',
                    size: 1
                },
                {
                    name: 'inLightColor',
                    size: 4
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
     * @method Phaser.Renderer.WebGL.RenderNodes.BatchHandlerPointLight#_generateElementIndices
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
     * Update the uniforms for the current shader program.
     *
     * This method is called automatically when the batch is run.
     *
     * @method Phaser.Renderer.WebGL.RenderNodes.BatchHandlerPointLight#setupUniforms
     * @since 4.0.0
     * @param {Phaser.Renderer.WebGL.DrawingContext} drawingContext - The current drawing context.
     */
    setupUniforms: function (drawingContext)
    {
        var programManager = this.programManager;
        var width = drawingContext.width;
        var height = drawingContext.height;

        programManager.setUniform(
            'uCameraZoom',
            drawingContext.camera.zoom
        );

        programManager.setUniform(
            'uResolution',
            [ width, height ]
        );

        drawingContext.renderer.setProjectionMatrixFromDrawingContext(drawingContext);
        programManager.setUniform(
            'uProjectionMatrix',
            drawingContext.renderer.projectionMatrix.val
        );
    },

    /**
     * Draw then empty the current batch.
     *
     * This method is called automatically, by either this node or the manager,
     * when the batch is full, or when something else needs to be rendered.
     *
     * @method Phaser.Renderer.WebGL.RenderNodes.BatchHandlerPointLight#run
     * @since 4.0.0
     * @param {Phaser.Renderer.WebGL.DrawingContext} drawingContext - The current drawing context.
     */
    run: function (drawingContext)
    {
        var instanceCount = this.instanceCount;

        if (instanceCount === 0) { return; }

        this.onRunBegin(drawingContext);

        var programManager = this.programManager;
        var programSuite = programManager.getCurrentProgramSuite();

        if (programSuite)
        {
            var program = programSuite.program;
            var vao = programSuite.vao;

            this.setupUniforms(drawingContext);
            programManager.applyUniforms(program);

            // Update vertex buffers.
            // Because we frequently aren't filling the entire buffer,
            // we need to update the buffer with the correct size.
            this.vertexBufferLayout.buffer.update(this.instanceCount * this.bytesPerInstance);

            this.manager.renderer.drawElements(
                drawingContext,
                this._emptyTextures,
                program,
                vao,
                instanceCount * this.indicesPerInstance,
                0
            );
        }

        // Reset batch accumulation.
        this.instanceCount = 0;

        this.onRunEnd(drawingContext);
    },

    /**
     * Add a light to the batch.
     *
     * @method Phaser.Renderer.WebGL.RenderNodes.BatchHandlerPointLight#batch
     * @since 4.0.0
     * @param {Phaser.Renderer.WebGL.DrawingContext} drawingContext - The current drawing context.
     * @param {Phaser.GameObjects.PointLight} light - The light to add to the batch.
     * @param {number} xTL - The top-left x-coordinate of the light.
     * @param {number} yTL - The top-left y-coordinate of the light.
     * @param {number} xBL - The bottom-left x-coordinate of the light.
     * @param {number} yBL - The bottom-left y-coordinate of the light.
     * @param {number} xTR - The top-right x-coordinate of the light.
     * @param {number} yTR - The top-right y-coordinate of the light.
     * @param {number} xBR - The bottom-right x-coordinate of the light.
     * @param {number} yBR - The bottom-right y-coordinate of the light.
     */
    batch: function (drawingContext, light, xTL, yTL, xBL, yBL, xTR, yTR, xBR, yBR, lightX, lightY)
    {
        if (this.instanceCount === 0)
        {
            this.manager.setCurrentBatchNode(this, drawingContext);
        }

        var color = light.color;
        var intensity = light.intensity;
        var radius = light.radius;
        var attenuation = light.attenuation;

        var r = color.r * intensity;
        var g = color.g * intensity;
        var b = color.b * intensity;
        var a = light.alpha;

        // Update the vertex buffer.
        var vertexOffset32 = this.instanceCount * this.floatsPerInstance;
        var vertexBuffer = this.vertexBufferLayout.buffer;
        var vertexViewF32 = vertexBuffer.viewF32;

        // Bottom left
        vertexViewF32[vertexOffset32++] = xBL;
        vertexViewF32[vertexOffset32++] = yBL;
        vertexViewF32[vertexOffset32++] = lightX;
        vertexViewF32[vertexOffset32++] = lightY;
        vertexViewF32[vertexOffset32++] = radius;
        vertexViewF32[vertexOffset32++] = attenuation;
        vertexViewF32[vertexOffset32++] = r;
        vertexViewF32[vertexOffset32++] = g;
        vertexViewF32[vertexOffset32++] = b;
        vertexViewF32[vertexOffset32++] = a;

        // Top left
        vertexViewF32[vertexOffset32++] = xTL;
        vertexViewF32[vertexOffset32++] = yTL;
        vertexViewF32[vertexOffset32++] = lightX;
        vertexViewF32[vertexOffset32++] = lightY;
        vertexViewF32[vertexOffset32++] = radius;
        vertexViewF32[vertexOffset32++] = attenuation;
        vertexViewF32[vertexOffset32++] = r;
        vertexViewF32[vertexOffset32++] = g;
        vertexViewF32[vertexOffset32++] = b;
        vertexViewF32[vertexOffset32++] = a;

        // Bottom right
        vertexViewF32[vertexOffset32++] = xBR;
        vertexViewF32[vertexOffset32++] = yBR;
        vertexViewF32[vertexOffset32++] = lightX;
        vertexViewF32[vertexOffset32++] = lightY;
        vertexViewF32[vertexOffset32++] = radius;
        vertexViewF32[vertexOffset32++] = attenuation;
        vertexViewF32[vertexOffset32++] = r;
        vertexViewF32[vertexOffset32++] = g;
        vertexViewF32[vertexOffset32++] = b;
        vertexViewF32[vertexOffset32++] = a;

        // Top right
        vertexViewF32[vertexOffset32++] = xTR;
        vertexViewF32[vertexOffset32++] = yTR;
        vertexViewF32[vertexOffset32++] = lightX;
        vertexViewF32[vertexOffset32++] = lightY;
        vertexViewF32[vertexOffset32++] = radius;
        vertexViewF32[vertexOffset32++] = attenuation;
        vertexViewF32[vertexOffset32++] = r;
        vertexViewF32[vertexOffset32++] = g;
        vertexViewF32[vertexOffset32++] = b;
        vertexViewF32[vertexOffset32++] = a;

        // Increment the instance count.
        this.instanceCount++;

        // Check whether the batch should be rendered immediately.
        // This guarantees that none of the arrays are full above.
        if (this.instanceCount === this.instancesPerBatch)
        {
            this.run(drawingContext);

            // Now the batch is empty.
        }
    }
});

module.exports = BatchHandlerPointLight;
