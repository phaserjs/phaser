/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../../utils/Class');
var WebGLVertexBufferLayoutWrapper = require('../wrappers/WebGLVertexBufferLayoutWrapper');
var ProgramManager = require('../ProgramManager');
var RenderNode = require('./RenderNode');

var ShaderSourceVS = require('../shaders/ShaderQuad-vert');
var ShaderSourceFS = require('../shaders/ShaderQuad-frag');

/**
 * @classdesc
 * A RenderNode that renders a quad using a shader program.
 * This is used for custom rendering effects and post-processing.
 *
 * @class ShaderQuad
 * @memberof Phaser.Renderer.WebGL.RenderNodes
 * @constructor
 * @since 4.0.0
 * @extends Phaser.Renderer.WebGL.RenderNodes.RenderNode
 * @param {Phaser.Renderer.WebGL.RenderNodes.RenderNodeManager} manager - The manager that owns this RenderNode.
 * @param {Phaser.Types.GameObjects.Shader.ShaderQuadConfig} config - The configuration object for this RenderNode.
 */
var ShaderQuad = new Class({
    Extends: RenderNode,

    initialize: function ShaderQuad (manager, config)
    {
        RenderNode.call(this, 'ShaderQuad', manager);

        var renderer = manager.renderer;

        /**
         * The WebGLRenderer in use.
         *
         * @name Phaser.Renderer.WebGL.RenderNodes.ShaderQuad#renderer
         * @type {Phaser.Renderer.WebGL.WebGLRenderer}
         * @since 4.0.0
         */
        this.renderer = renderer;

        config = this._completeConfig(config);

        if (config.updateShaderConfig)
        {
            this.updateShaderConfig = config.updateShaderConfig;
        }

        /**
         * The index buffer defining vertex order.
         *
         * @name Phaser.Renderer.WebGL.RenderNodes.ShaderQuad#indexBuffer
         * @type {Phaser.Renderer.WebGL.Wrappers.WebGLBufferWrapper}
         * @since 4.0.0
         */
        this.indexBuffer = renderer.genericQuadIndexBuffer;

        /**
         * The vertex buffer layout for this RenderNode.
         *
         * This consists of 4 bytes, 0-3, forming corners of a quad instance.
         *
         * @name Phaser.Renderer.WebGL.RenderNodes.ShaderQuad#vertexBufferLayout
         * @type {Phaser.Renderer.WebGL.Wrappers.WebGLVertexBufferLayoutWrapper}
         * @since 4.0.0
         * @readonly
         */
        this.vertexBufferLayout = new WebGLVertexBufferLayoutWrapper(
            renderer,
            config.vertexBufferLayout,
            null
        );

        /**
         * The program manager used to create and manage shader programs.
         * This contains shader variants.
         *
         * @name Phaser.Renderer.WebGL.RenderNodes.ShaderQuad#programManager
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
        for (var i = 0; i < config.shaderAdditions.length; i++)
        {
            var addition = config.shaderAdditions[i];
            this.programManager.addAddition(addition);
        }

        /**
         * The uniform callback used to set uniforms on the shader program.
         *
         * @name Phaser.Renderer.WebGL.RenderNodes.ShaderQuad#setUniform
         * @type {function}
         * @since 4.0.0
         */
        this.setUniform = this.programManager.setUniform.bind(this.programManager);

        /**
         * The transformer node used to transform the quad for rendering.
         *
         * @name Phaser.Renderer.WebGL.RenderNodes.ShaderQuad#transformerNode
         * @type {Phaser.Renderer.WebGL.RenderNodes.TransformerImage}
         * @since 4.0.0
         */
        this.transformerNode = manager.getNode('TransformerImage');

        /**
         * An object which acts as a proxy for textures in the transformer.
         *
         * @name Phaser.Renderer.WebGL.RenderNodes.ShaderQuad#_texturerProxy
         * @type {object}
         * @since 4.0.0
         */
        this._texturerProxy = {
            frameWidth: 1,
            frameHeight: 1,
            frame: { realWidth: 1, realHeight: 1 },
            uvSource: { x: 0, y: 0 }
        };
    },

    /**
     * Completes the configuration for this RenderNode.
     * This method is called during initialization.
     *
     * @method Phaser.Renderer.WebGL.RenderNodes.ShaderQuad#_completeConfig
     * @private
     * @since 4.0.0
     * @param {object} config - The configuration object for this RenderNode.
     * @return {object} The completed configuration object.
     */
    _completeConfig: function (config)
    {
        var gl = this.renderer.gl;

        var vertexSource = config.vertexSource;
        if (!vertexSource)
        {
            var vertexKey = config.vertexKey;
            if (vertexKey)
            {
                var baseShader = this.manager.renderer.game.cache.shader.get(vertexKey);
                if (baseShader && baseShader.glsl)
                {
                    vertexSource = baseShader.glsl;
                }
            }
        }
        if (!vertexSource)
        {
            vertexSource = ShaderSourceVS;
        }

        var fragmentSource = config.fragmentSource;
        if (!fragmentSource)
        {
            var fragmentKey = config.fragmentKey;
            if (fragmentKey)
            {
                baseShader = this.manager.renderer.game.cache.shader.get(fragmentKey);
                if (baseShader && baseShader.glsl)
                {
                    fragmentSource = baseShader.glsl;
                }
            }
        }
        if (!fragmentSource)
        {
            fragmentSource = ShaderSourceFS;
        }

        return {
            name: config.name || 'ShaderQuad',
            shaderName: config.shaderName || config.name || 'ShaderQuad',
            vertexSource: vertexSource,
            fragmentSource: fragmentSource,
            shaderAdditions: config.shaderAdditions || [],
            vertexBufferLayout: {
                usage: 'DYNAMIC_DRAW',
                count: 4,
                layout: [
                    {
                        name: 'inPosition',
                        size: 2,
                        type: gl.FLOAT,
                        normalized: false
                    },
                    {
                        name: 'inTexCoord',
                        size: 2,
                        type: gl.FLOAT,
                        normalized: false
                    }
                ]
            }
        };
    },

    run: function (drawingContext, gameObject, parentMatrix)
    {
        var manager = this.manager;
        var renderer = this.renderer;

        manager.startStandAloneRender();

        this.onRunBegin(drawingContext);

        // Get transformed quad vertices.
        var width = gameObject.width;
        var height = gameObject.height;
        this._texturerProxy.frame.realWidth = width;
        this._texturerProxy.frame.realHeight = height;
        this._texturerProxy.frameWidth = width;
        this._texturerProxy.frameHeight = height;

        var xTL, yTL, xBL, yBL, xBR, yBR, xTR, yTR;

        if (gameObject.renderToTexture)
        {
            xTL = 0;
            yTL = 0;
            xBL = 0;
            yBL = height;
            xBR = width;
            yBR = height;
            xTR = width;
            yTR = 0;
        }
        else
        {
            var transformerNode = this.transformerNode;
            transformerNode.run(drawingContext, gameObject, this._texturerProxy, parentMatrix);
            var quad = transformerNode.quad;

            xTL = quad[0];
            yTL = quad[1];
            xBL = quad[2];
            yBL = quad[3];
            xBR = quad[4];
            yBR = quad[5];
            xTR = quad[6];
            yTR = quad[7];
        }

        // Populate vertex buffer.
        var stride = this.vertexBufferLayout.layout.stride;
        var vertexBuffer = this.vertexBufferLayout.buffer;
        var vertexF32 = vertexBuffer.viewF32;
        var offset32 = 0;

        // Bottom Left.
        vertexF32[offset32++] = xBL;
        vertexF32[offset32++] = yBL;
        vertexF32[offset32++] = gameObject.textureCoordinateBottomLeft.x;
        vertexF32[offset32++] = gameObject.textureCoordinateBottomLeft.y;

        // Top Left.
        vertexF32[offset32++] = xTL;
        vertexF32[offset32++] = yTL;
        vertexF32[offset32++] = gameObject.textureCoordinateTopLeft.x;
        vertexF32[offset32++] = gameObject.textureCoordinateTopLeft.y;

        // Bottom Right.
        vertexF32[offset32++] = xBR;
        vertexF32[offset32++] = yBR;
        vertexF32[offset32++] = gameObject.textureCoordinateBottomRight.x;
        vertexF32[offset32++] = gameObject.textureCoordinateBottomRight.y;

        // Top Right.
        vertexF32[offset32++] = xTR;
        vertexF32[offset32++] = yTR;
        vertexF32[offset32++] = gameObject.textureCoordinateTopRight.x;
        vertexF32[offset32++] = gameObject.textureCoordinateTopRight.y;

        vertexBuffer.update(stride * 4);

        // Render.

        var programManager = this.programManager;
        this.updateShaderConfig(drawingContext, gameObject, this);
        var programSuite = programManager.getCurrentProgramSuite();

        if (programSuite)
        {
            var program = programSuite.program;
            var vao = programSuite.vao;
            var setUniform = this.setUniform;

            renderer.setProjectionMatrixFromDrawingContext(drawingContext);
            setUniform(
                'uProjectionMatrix',
                drawingContext.renderer.projectionMatrix.val
            );

            // Set user uniforms after built-ins to permit overrides.
            gameObject.setupUniforms(setUniform, drawingContext);

            programManager.applyUniforms(program);

            // Draw.
            renderer.drawElements(
                drawingContext,
                this.setupTextures(gameObject),
                program,
                vao,
                4,
                0
            );
        }

        this.onRunEnd(drawingContext);
    },

    setupTextures: function (gameObject)
    {
        var textures = gameObject.textures;
        var glTextures = [];

        for (var i = 0; i < textures.length; i++)
        {
            var texture = textures[i];
            var glTexture = texture.get().source.glTexture;
            glTextures.push(glTexture);
        }

        return glTextures;
    },

    /**
     * Updates the shader configuration for the current render pass.
     * This is called before the shader is rendered.
     * This method is a hook for custom shader configurations.
     * You should override it if you need to adjust shader additions
     * after initialization.
     *
     * @method Phaser.Renderer.WebGL.RenderNodes.ShaderQuad#updateShaderConfig
     * @since 4.0.0
     * @param {Phaser.Renderer.WebGL.DrawingContext} drawingContext - The current drawing context.
     * @param {Phaser.GameObjects.GameObject} gameObject - The GameObject being rendered.
     * @param {Phaser.Renderer.WebGL.RenderNodes.ShaderQuad} renderNode - The RenderNode being rendered.
     */
    updateShaderConfig: function (drawingContext, gameObject, renderNode)
    {
        // NOOP.
    }
});

module.exports = ShaderQuad;
