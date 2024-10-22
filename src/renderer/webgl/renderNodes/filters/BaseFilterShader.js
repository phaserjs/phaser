/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2024 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../../../utils/Class');
var SimpleTextureVert = require('../../shaders/SimpleTexture-vert.js');
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
 * @class BaseFilterShader
 * @extends Phaser.Renderer.WebGL.RenderNodes.Filters.BaseFilter
 * @memberof Phaser.Renderer.WebGL.RenderNodes.Filters
 * @constructor
 * @since 3.90.0
 * @param {Phaser.Renderer.WebGL.RenderNodes.RenderNodeManager} manager - The manager that owns this filter.
 * @param {string} name - The name of the filter.
 * @param {string} fragmentShaderSource - The fragment shader source.
 */
var BaseFilterShader = new Class({
    Extends: BaseFilter,

    initialize: function BaseFilterShader (name, manager, fragmentShaderSource)
    {
        BaseFilter.call(this, name, manager);

        var renderer = manager.renderer;
        var gl = renderer.gl;

        var config = {
            name: name,
            shaderName: name,
            vertexSource: SimpleTextureVert,
            fragmentSource: fragmentShaderSource,
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

        // Ensure that there is no VAO bound, because the following index buffer
        // will modify any currently bound VAO.
        renderer.glWrapper.updateVAO({ vao: null });

        /**
         * The index buffer defining vertex order.
         *
         * @name Phaser.Renderer.WebGL.RenderNodes.Filters.BaseFilterShader#indexBuffer
         * @type {Phaser.Renderer.WebGL.Wrappers.WebGLBufferWrapper}
         * @since 3.90.0
         */
        this.indexBuffer = renderer.createIndexBuffer(
            new Uint16Array([ 0, 1, 2, 3 ]),
            gl.STATIC_DRAW
        );

        /**
         * The vertex buffer layout for this RenderNode.
         *
         * This consists of 4 bytes, 0-3, forming corners of a quad instance.
         *
         * @name Phaser.Renderer.WebGL.RenderNodes.Filters.BaseFilterShader#vertexBufferLayout
         * @type {Phaser.Renderer.WebGL.WebGLVertexBufferLayoutWrapper}
         * @since 3.90.0
         * @readonly
         */
        this.vertexBufferLayout = new WebGLVertexBufferLayoutWrapper(
            renderer,
            config.vertexBufferLayout,
            renderer.genericVertexBuffer
        );

        /**
         * The program manager used to create and manage shader programs.
         * This contains shader variants.
         *
         * @name Phaser.Renderer.WebGL.RenderNodes.Filters.BaseFilterShader#programManager
         * @type {Phaser.Renderer.WebGL.ProgramManager}
         * @since 3.90.0
         */
        this.programManager = new ProgramManager(
            renderer,
            this.indexBuffer,
            [ this.vertexBufferLayout ]
        );

        // Fill in program configuration from config.
        this.programManager.setBaseShader(
            config.shaderName,
            config.vertexSource,
            config.fragmentSource
        );

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

        inputDrawingContext.release();
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

        if (outputDrawingContext.useCanvas)
        {
            // Flip top and bottom.
            var temp = yTL;
            yTL = yBL;
            yBL = temp;
            temp = yTR;
            yTR = yBR;
            yBR = temp;
        }

        // Populate vertex buffer.
        var stride = this.vertexBufferLayout.layout.stride;
        var vertexBuffer = this.vertexBufferLayout.buffer;
        var vertexF32 = vertexBuffer.viewF32;
        var offset32 = 0;

        // Bottom Left.
        vertexF32[offset32++] = xBL;
        vertexF32[offset32++] = yBL;
        vertexF32[offset32++] = 0;
        vertexF32[offset32++] = 0;

        // Top Left.
        vertexF32[offset32++] = xTL;
        vertexF32[offset32++] = yTL;
        vertexF32[offset32++] = 0;
        vertexF32[offset32++] = 1;

        // Bottom Right.
        vertexF32[offset32++] = xBR;
        vertexF32[offset32++] = yBR;
        vertexF32[offset32++] = 1;
        vertexF32[offset32++] = 0;

        // Top Right.
        vertexF32[offset32++] = xTR;
        vertexF32[offset32++] = yTR;
        vertexF32[offset32++] = 1;
        vertexF32[offset32++] = 1;

        // Update vertex buffer.
        // Because we are probably using a generic vertex buffer
        // which is larger than the current batch, we need to update
        // the buffer with the correct size.
        vertexBuffer.update(stride * 4);


        // Render.

        var programManager = this.programManager;
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
        this.onRunEnd(outputDrawingContext);

        return outputDrawingContext;
    },

    /**
     * Run any necessary modifications on the textures array.
     * Override this method to handle texture inputs.
     *
     * @method Phaser.Renderer.WebGL.RenderNodes.Filters.BaseFilterShader#setupTextures
     * @since 3.90.0
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
     * @method Phaser.Renderer.WebGL.RenderNodes.Filters.BaseFilterShader#setupUniforms
     * @since 3.90.0
     * @param {Phaser.Filters.Controller} controller - The filter controller.
     * @param {Phaser.Renderer.WebGL.DrawingContext} drawingContext - The drawing context in use.
     */
    setupUniforms: function (controller, drawingContext)
    {
        // This is the base setupUniforms method that all filters should override
    }
});

module.exports = BaseFilterShader;
