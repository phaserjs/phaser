/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2024 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Vector2 = require('../../../math/Vector2');
var Class = require('../../../utils/Class');
var LightShaderSourceFS = require('../shaders/Light-frag');
var ShaderSourceVS = require('../shaders/Multi-vert');
var BatchHandlerQuad = require('./BatchHandlerQuad');

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
 * @class BatchHandlerQuadLight
 * @memberof Phaser.Renderer.WebGL.RenderNodes
 * @constructor
 * @since 3.90.0
 * @extends Phaser.Renderer.WebGL.RenderNodes.BatchHandlerQuad
 * @param {Phaser.Renderer.WebGL.RenderNodes.RenderNodeManager} manager - The manager that owns this RenderNode.
 * @param {Phaser.Types.Renderer.WebGL.RenderNodes.BatchHandlerConfig} config - The configuration object for this RenderNode.
 */
var BatchHandlerQuadLight = new Class({
    Extends: BatchHandlerQuad,

    initialize: function BatchHandlerQuadLight (manager, config)
    {
        BatchHandlerQuad.call(this, manager, config);

        this.program.setUniform('uMainSampler', 0);
        this.program.setUniform('uNormSampler', 1);
        
        /**
        * Inverse rotation matrix for normal map rotations.
        *
        * @name Phaser.Renderer.WebGL.RenderNodes.BatchHandlerQuadLight#inverseRotationMatrix
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
         * @name Phaser.Renderer.WebGL.RenderNodes.BatchHandlerQuadLight#_lightVector
         * @type {Phaser.Math.Vector2}
         * @private
         * @since 3.90.0
         */
        this._lightVector = new Vector2();

        /**
         * The rotation of the normal map texture.
         *
         * @name Phaser.Renderer.WebGL.RenderNodes.BatchHandlerQuadLight#_normalMapRotation
         * @type {number}
         * @private
         * @since 3.90.0
         */
        this._normalMapRotation = 0;
    },

    /**
     * The default configuration settings for BatchHandlerQuadLight.
     *
     * These are very similar to standard settings,
     * but because the textures are always set in units 0 and 1,
     * there's no need to have an attribute for the texture unit.
     * While the vertex shader still reads `inTexId`, it is not used,
     * and the default value of 0 is fine.
     *
     * @name Phaser.Renderer.WebGL.RenderNodes.BatchHandlerQuadLight#defaultConfig
     * @type {Phaser.Types.Renderer.WebGL.RenderNodes.BatchHandlerConfig}
     * @since 3.90.0
     * @readonly
     */
    defaultConfig: {
        name: 'BatchHandlerQuadLight',
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

    _copyAndCompleteConfig: function (manager, config, defaultConfig)
    {
        var newConfig = BatchHandlerQuad.prototype._copyAndCompleteConfig.call(this, manager, config, defaultConfig);

        newConfig.fragmentSource = newConfig.fragmentSource.replace(
            '%LIGHT_COUNT%',
            manager.renderer.config.maxLights
        );

        return newConfig;
    },

    /**
     * Called at the start of the `run` method.
     *
     * @method Phaser.Renderer.WebGL.RenderNodes.BatchHandlerQuadLight#onRunBegin
     * @since 3.90.0
     * @param {Phaser.Types.Renderer.WebGL.DrawingContext} drawingContext - The current drawing context.
     */
    onRunBegin: function (drawingContext)
    {
        var camera = drawingContext.camera;
        var cameraMatrix = camera.matrix;
        var program = this.program;
        var scene = camera.scene;
        var lightManager = scene.sys.lights;
        var lights = lightManager.getLights(camera);
        var lightsCount = lights.length;
        var ambientColor = lightManager.ambientColor;
        var vec = this._lightVector;
        var height = this.manager.renderer.height;

        BatchHandlerQuad.prototype.onRunBegin.call(this, drawingContext);

        program.setUniform(
            'uCamera',
            [
                camera.x,
                camera.y,
                camera.rotation,
                camera.zoom
            ]
        );
        program.setUniform(
            'uAmbientLightColor',
            [
                ambientColor.r,
                ambientColor.g,
                ambientColor.b
            ]
        );
        program.setUniform(
            'uLightCount',
            lightsCount
        );
        program.setUniform(
            'uInverseRotationMatrix',
            this.inverseRotationMatrix
        );

        for (var i = 0; i < lightsCount; i++)
        {
            var light = lights[i].light;
            var color = light.color;

            var lightName = 'uLights[' + i + '].';

            cameraMatrix.transformPoint(
                light.x - (camera.scrollX * light.scrollFactorX * camera.zoom),
                light.y - (camera.scrollY * light.scrollFactorY * camera.zoom),
                vec
            );

            program.setUniform(
                lightName + 'position',
                [
                    vec.x,
                    height - (vec.y),
                    light.z * camera.zoom
                ]
            );
            program.setUniform(
                lightName + 'color',
                [
                    color.r,
                    color.g,
                    color.b
                ]
            );
            program.setUniform(
                lightName + 'intensity',
                light.intensity
            );
            program.setUniform(
                lightName + 'radius',
                light.radius
            );
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
     * @method Phaser.Renderer.WebGL.RenderNodes.BatchHandlerQuadLight#batch
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
        normalMapRotation = -normalMapRotation - currentContext.camera.rotation;
        if (this._normalMapRotation !== normalMapRotation)
        {
            // Complete the entire batch if the normal map rotation changes.
            this.run(currentContext);

            this._normalMapRotation = normalMapRotation;
            var inverseRotationMatrix = this.inverseRotationMatrix;

            if (normalMapRotation)
            {
                var c = Math.cos(normalMapRotation);
                var s = Math.sin(normalMapRotation);

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
        vertexViewF32[vertexOffset32++] = texX;
        vertexViewF32[vertexOffset32++] = texY + texHeight;
        vertexViewF32[vertexOffset32++] = tintFill;
        vertexViewU32[vertexOffset32++] = tintBL;

        // Top-left
        vertexViewF32[vertexOffset32++] = x0;
        vertexViewF32[vertexOffset32++] = y0;
        vertexViewF32[vertexOffset32++] = texX;
        vertexViewF32[vertexOffset32++] = texY;
        vertexViewF32[vertexOffset32++] = tintFill;
        vertexViewU32[vertexOffset32++] = tintTL;

        // Bottom-right
        vertexViewF32[vertexOffset32++] = x3;
        vertexViewF32[vertexOffset32++] = y3;
        vertexViewF32[vertexOffset32++] = texX + texWidth;
        vertexViewF32[vertexOffset32++] = texY + texHeight;
        vertexViewF32[vertexOffset32++] = tintFill;
        vertexViewU32[vertexOffset32++] = tintBR;

        // Top-right
        vertexViewF32[vertexOffset32++] = x2;
        vertexViewF32[vertexOffset32++] = y2;
        vertexViewF32[vertexOffset32++] = texX + texWidth;
        vertexViewF32[vertexOffset32++] = texY;
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
     * In `BatchHandlerQuadLight`, this does nothing, because it only ever uses two texture units.
     *
     * As this extends `BatchHandlerQuad`, it would otherwise rebuild the shader
     * program.
     *
     * @method Phaser.Renderer.WebGL.RenderNodes.BatchHandlerQuadLight#updateTextureCount
     * @since 3.90.0
     * @param {number} count - The new advised texture unit count.
     */
    updateTextureCount: function (count) {}
});

module.exports = BatchHandlerQuadLight;
