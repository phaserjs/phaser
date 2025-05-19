/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../../../utils/Class');
var SimpleTextureVert = require('../../shaders/SimpleTexture-vert.js');
var MakeBoundedSampler = require('../../shaders/additionMakers/MakeBoundedSampler.js');
var ProgramManager = require('../../ProgramManager');
var WebGLVertexBufferLayoutWrapper = require('../../wrappers/WebGLVertexBufferLayoutWrapper');
var BaseFilter = require('./BaseFilter');

/**
 * @classdesc
 * This is a base class for all filters that use a shader.
 * Most filters will extend this class.
 *
 * It takes care of setting up the shader program and vertex buffer layout.
 * It also provides the `run` method which handles the rendering of the filter.
 * When rendering, it generates a new DrawingContext to render to,
 * and releases the input DrawingContext.
 *
 * Note: be careful when using `gl_FragCoord` in shader code.
 * This built-in variable gives you the "window relative" coordinate
 * of the pixel being processed.
 * But this is actually relative to the framebuffer size,
 * and Phaser treats all framebuffers except the main canvas
 * as being vertically flipped.
 * This means that `gl_FragCoord.y = 0` in a shader will be the bottom of a framebuffer,
 * but the top of the canvas.
 * This means `gl_FragCoord` gives different results when it's inside a
 * framebuffer (like a Render Texture or Filter) compared to the main canvas.
 * Be aware of this restriction when writing shaders.
 *
 * @class BaseFilterShader
 * @extends Phaser.Renderer.WebGL.RenderNodes.BaseFilter
 * @memberof Phaser.Renderer.WebGL.RenderNodes
 * @constructor
 * @since 4.0.0
 * @param {string} name - The name of the filter.
 * @param {Phaser.Renderer.WebGL.RenderNodes.RenderNodeManager} manager - The manager that owns this filter.
 * @param {string} [fragmentShaderKey] - The key of the fragment shader source in the shader cache. This will only be used if `fragmentShaderSource` is not set.
 * @param {string} [fragmentShaderSource] - The fragment shader source.
 * @param {?Phaser.Types.Renderer.WebGL.ShaderAdditionConfig[]} [shaderAdditions] - An array of shader additions to apply to the shader program.
 */
var BaseFilterShader = new Class({
    Extends: BaseFilter,

    initialize: function BaseFilterShader (name, manager, fragmentShaderKey, fragmentShaderSource, shaderAdditions)
    {
        if (!fragmentShaderSource)
        {
            var baseShader = manager.renderer.game.cache.shader.get(fragmentShaderKey);
            if (!(baseShader && baseShader.glsl))
            {
                throw new Error('BaseFilterShader: No fragment shader source provided and no shader found with key ' + fragmentShaderKey);
            }
            fragmentShaderSource = baseShader.glsl;
        }

        BaseFilter.call(this, name, manager);

        var renderer = manager.renderer;
        var gl = renderer.gl;

        var config = {
            name: name,
            shaderName: name,
            vertexSource: SimpleTextureVert,
            fragmentSource: fragmentShaderSource,
            shaderAdditions: shaderAdditions || [],
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

        // Include the BoundedSampler addition.
        config.shaderAdditions.push(MakeBoundedSampler());

        /**
         * The index buffer defining vertex order.
         *
         * @name Phaser.Renderer.WebGL.RenderNodes.BaseFilterShader#indexBuffer
         * @type {Phaser.Renderer.WebGL.Wrappers.WebGLBufferWrapper}
         * @since 4.0.0
         */
        this.indexBuffer = renderer.genericQuadIndexBuffer;

        /**
         * The vertex buffer layout for this RenderNode.
         *
         * This consists of 4 bytes, 0-3, forming corners of a quad instance.
         *
         * @name Phaser.Renderer.WebGL.RenderNodes.BaseFilterShader#vertexBufferLayout
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
         * @name Phaser.Renderer.WebGL.RenderNodes.BaseFilterShader#programManager
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

        // Set the shader program to use texture unit 0.
        this.programManager.setUniform('uMainSampler', 0);
    },

    run: function (controller, inputDrawingContext, outputDrawingContext, padding)
    {
        var manager = this.manager;
        var renderer = manager.renderer;

        manager.startStandAloneRender();


        // Get a new DrawingContext to render to.
        if (!padding)
        {
            padding = controller.getPadding();
        }
        if (!outputDrawingContext)
        {
            outputDrawingContext = renderer.drawingContextPool.get(
                inputDrawingContext.width + padding.width,
                inputDrawingContext.height + padding.height
            );
        }

        outputDrawingContext.use();

        this.onRunBegin(outputDrawingContext);

        // Assemble textures.
        var textures = [ inputDrawingContext.texture ];
        this.setupTextures(controller, textures, outputDrawingContext);

        // Compute quad vertices.
        var xBL = -1;
        var yBL = -1;
        var xTL = -1;
        var yTL = 1;
        var xTR = 1;
        var yTR = 1;
        var xBR = 1;
        var yBR = -1;

        // Account for padding.
        if (padding.left)
        {
            var paddingLeft = 2 * padding.left / outputDrawingContext.width;
            xBL -= paddingLeft;
            xTL -= paddingLeft;
        }
        if (padding.right)
        {
            var paddingRight = 2 * padding.right / outputDrawingContext.width;
            xBR -= paddingRight;
            xTR -= paddingRight;
        }
        if (padding.top)
        {
            var paddingTop = 2 * padding.top / outputDrawingContext.height;
            yTL += paddingTop;
            yTR += paddingTop;
        }
        if (padding.bottom)
        {
            var paddingBottom = 2 * padding.bottom / outputDrawingContext.height;
            yBL += paddingBottom;
            yBR += paddingBottom;
        }

        // Populate vertex buffer.
        var stride = this.vertexBufferLayout.layout.stride;
        var vertexBuffer = this.vertexBufferLayout.buffer;
        var vertexF32 = vertexBuffer.viewF32;
        var offset32 = 0;

        // Bottom Left.
        vertexF32[offset32++] = -1;
        vertexF32[offset32++] = -1;
        vertexF32[offset32++] = remapCoord(0, xBL, xBR);
        vertexF32[offset32++] = remapCoord(0, yBL, yBR);

        // Top Left.
        vertexF32[offset32++] = -1;
        vertexF32[offset32++] = 1;
        vertexF32[offset32++] = remapCoord(0, xTL, xTR);
        vertexF32[offset32++] = remapCoord(1, yTL, yTR);

        // Bottom Right.
        vertexF32[offset32++] = 1;
        vertexF32[offset32++] = -1;
        vertexF32[offset32++] = remapCoord(1, xBL, xBR);
        vertexF32[offset32++] = remapCoord(0, yBL, yBR);

        // Top Right.
        vertexF32[offset32++] = 1;
        vertexF32[offset32++] = 1;
        vertexF32[offset32++] = remapCoord(1, xTL, xTR);
        vertexF32[offset32++] = remapCoord(1, yTL, yTR);

        // Update vertex buffer.
        // Because we frequently aren't filling the entire buffer,
        // we need to update the buffer with the correct size.
        vertexBuffer.update(stride * 4);


        // Render.

        var programManager = this.programManager;
        this.updateShaderConfig(controller, outputDrawingContext);
        var programSuite = programManager.getCurrentProgramSuite();

        if (programSuite)
        {
            var program = programSuite.program;
            var vao = programSuite.vao;

            this.setupUniforms(controller, outputDrawingContext);
            programManager.applyUniforms(program);

            // Render layer.
            renderer.drawElements(
                outputDrawingContext,
                textures,
                program,
                vao,
                4,
                0
            );
        }


        // Complete render.
        inputDrawingContext.release();
        this.onRunEnd(outputDrawingContext);

        return outputDrawingContext;
    },

    /**
     * Set up the shader configuration for this shader.
     * Override this method to handle shader configuration.
     *
     * @method Phaser.Renderer.WebGL.RenderNodes.BaseFilterShader#updateShaderConfig
     * @since 4.0.0
     * @param {Phaser.Filters.Controller} controller - The filter controller.
     * @param {Phaser.Renderer.WebGL.DrawingContext} drawingContext - The drawing context in use.
     */
    updateShaderConfig: function (controller, drawingContext)
    {
        // NOOP
    },

    /**
     * Run any necessary modifications on the textures array.
     * Override this method to handle texture inputs.
     *
     * @method Phaser.Renderer.WebGL.RenderNodes.BaseFilterShader#setupTextures
     * @since 4.0.0
     * @param {Phaser.Filters.Controller} controller - The filter controller.
     * @param {Phaser.Renderer.WebGL.Wrappers.WebGLTextureWrapper[]} textures - The array of textures to modify in-place.
     * @param {Phaser.Renderer.WebGL.DrawingContext} drawingContext - The drawing context in use.
     */
    setupTextures: function (controller, textures, drawingContext)
    {
        // NOOP
    },

    /**
     * Set up the uniforms for this shader, based on the controller.
     *
     * @method Phaser.Renderer.WebGL.RenderNodes.BaseFilterShader#setupUniforms
     * @since 4.0.0
     * @param {Phaser.Filters.Controller} controller - The filter controller.
     * @param {Phaser.Renderer.WebGL.DrawingContext} drawingContext - The drawing context in use.
     */
    setupUniforms: function (controller, drawingContext)
    {
        // This is the base setupUniforms method that all filters should override
    }
});

function remapCoord (coord, low, high)
{
    // Low,high are in the range -1,1.
    // Convert low,high to 0,1.
    low = ((1 / low) + 1) * 0.5;
    high = ((1 / high) + 1) * 0.5;

    return low + coord * (high - low);
}

module.exports = BaseFilterShader;
