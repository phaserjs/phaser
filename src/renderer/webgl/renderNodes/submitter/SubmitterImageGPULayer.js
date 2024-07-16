/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2024 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var TransformMatrix = require('../../../../gameobjects/components/TransformMatrix');
var Class = require('../../../../utils/Class');
var Merge = require('../../../../utils/object/Merge');
var ShaderSourceFS = require('../../shaders/ImageBakedLayer-frag');
var ShaderSourceVS = require('../../shaders/ImageBakedLayer-vert');
var WebGLVertexBufferLayoutWrapper = require('../../wrappers/WebGLVertexBufferLayoutWrapper');
var RenderNode = require('../RenderNode');

/**
 * @classdesc
 * This RenderNode handles rendering of a single ImageGPULayer object.
 * A new instance of the RenderNode should be created for each ImageGPULayer object,
 * as it stores the shader program and vertex buffer data for the object.
 *
 * It is a Stand Alone Render, meaning that it does not batch.
 * It is best suited to rendering highly complex objects.
 *
 * @class SubmitterImageGPULayer
 * @extends Phaser.Renderer.WebGL.RenderNodes.RenderNode
 * @memberof Phaser.Renderer.WebGL.RenderNodes
 * @constructor
 * @since 3.90.0
 * @param {Phaser.Renderer.WebGL.RenderNodes.RenderNodeManager} manager - The manager that owns this RenderNode.
 * @param {object} [config] - The configuration object for this handler.
 * @param {string} [config.name='SubmitterImageGPULayer'] - The name of this RenderNode.
 * @param {string} [config.vertexSource] - The vertex shader source.
 * @param {string} [config.fragmentSource] - The fragment shader source.
 */
var SubmitterImageGPULayer = new Class({
    Extends: RenderNode,

    initialize: function SubmitterImageGPULayer (manager, config, gameObject)
    {
        var renderer = manager.renderer;

        var finalConfig = Merge(config || {}, this.defaultConfig);
        var name = finalConfig.name;
        this._completeLayout(finalConfig);

        RenderNode.call(this, name, manager);

        /**
         * The ImageGPULayer GameObject this RenderNode is rendering.
         *
         * @name Phaser.Renderer.WebGL.RenderNodes.SubmitterImageGPULayer#gameObject
         * @type {Phaser.GameObjects.ImageGPULayer}
         * @since 3.90.0
         * @readonly
         */
        this.gameObject = gameObject;

        /**
         * The WebGL program used to render GameObjects.
         *
         * @name Phaser.Renderer.WebGL.RenderNodes.SubmitterImageGPULayer#program
         * @type {Phaser.Renderer.WebGL.Wrappers.WebGLProgramWrapper}
         * @since 3.90.0
         * @readonly
         */
        this.program = renderer.createProgram(
            finalConfig.vertexSource,
            finalConfig.fragmentSource
        );

        // Set texture sampler uniform.
        this.program.setUniform(
            'uMainSampler',
            0
        );

        /**
         * The instance buffer layout for this RenderNode.
         *
         * @name Phaser.Renderer.WebGL.RenderNodes.SubmitterImageGPULayer#instanceBufferLayout
         * @type {Phaser.Renderer.WebGL.WebGLVertexBufferLayoutWrapper}
         * @since 3.90.0
         * @readonly
         */
        this.instanceBufferLayout = new WebGLVertexBufferLayoutWrapper(
            renderer,
            this.program,
            finalConfig.instanceBufferLayout,
            null
        );

        /**
         * The vertex buffer layout for this RenderNode.
         *
         * This consists of 4 bytes, 0-3, forming corners of a quad instance.
         *
         * @name Phaser.Renderer.WebGL.RenderNodes.SubmitterImageGPULayer#vertexBufferLayout
         * @type {Phaser.Renderer.WebGL.WebGLVertexBufferLayoutWrapper}
         * @since 3.90.0
         * @readonly
         */
        this.vertexBufferLayout = new WebGLVertexBufferLayoutWrapper(
            renderer,
            this.program,
            finalConfig.vertexBufferLayout,
            null
        );

        // Set up vertex buffer.
        var vertexBuffer = this.vertexBufferLayout.buffer;
        var vertexBufferViewU8 = vertexBuffer.viewU8;
        vertexBufferViewU8[0] = 0;
        vertexBufferViewU8[1] = 1;
        vertexBufferViewU8[2] = 2;
        vertexBufferViewU8[3] = 3;
        vertexBuffer.update();

        /**
         * The Vertex Array Object (VAO) for this RenderNode.
         *
         * @name Phaser.Renderer.WebGL.RenderNodes.SubmitterImageGPULayer#vao
         * @type {Phaser.Renderer.WebGL.Wrappers.WebGLVAOWrapper}
         * @since 3.90.0
         * @readonly
         */
        this.vao = renderer.createVAO(null, [
            this.instanceBufferLayout,
            this.vertexBufferLayout
        ]);

        /**
         * A matrix used for temporary calculations.
         *
         * @name Phaser.Renderer.WebGL.RenderNodes.SubmitterImageGPULayer#_calcMatrix
         * @type {Phaser.GameObjects.Components.TransformMatrix}
         * @since 3.90.0
         */
        this._calcMatrix = new TransformMatrix();
    },

    /**
     * Default configuration of this RenderNode.
     *
     * @name Phaser.Renderer.WebGL.RenderNodes.SubmitterImageGPULayer#defaultConfig
     * @type {object}
     * @since 3.90.0
     * @readonly
     * @property {string} name - The name of this RenderNode.
     * @property {string} vertexSource - The vertex shader source.
     * @property {string} fragmentSource - The fragment shader source.
     */
    defaultConfig: {
        name: 'SubmitterImageGPULayer',
        count: 0,
        vertexSource: ShaderSourceVS,
        fragmentSource: ShaderSourceFS,
        instanceBufferLayout: {
            usage: 'STATIC_DRAW',
            instanceDivisor: 1,
            layout: [
                {
                    name: 'inPositionX'
                },
                {
                    name: 'inPositionY'
                },
                {
                    name: 'inRotation'
                },
                {
                    name: 'inScaleX'
                },
                {
                    name: 'inScaleY'
                },
                {
                    name: 'inOrigin',
                    size: 2
                },
                {
                    name: 'inScrollFactorX'
                },
                {
                    name: 'inScrollFactorY'
                },
                {
                    name: 'inFrameUVs',
                    size: 4
                },
                {
                    name: 'inTintFillAndBlend',
                    size: 2
                },
                {
                    name: 'inTintBL',
                    size: 4,
                    type: 'UNSIGNED_BYTE',
                    normalized: true
                },
                {
                    name: 'inTintTL',
                    size: 4,
                    type: 'UNSIGNED_BYTE',
                    normalized: true
                },
                {
                    name: 'inTintBR',
                    size: 4,
                    type: 'UNSIGNED_BYTE',
                    normalized: true
                },
                {
                    name: 'inTintTR',
                    size: 4,
                    type: 'UNSIGNED_BYTE',
                    normalized: true
                },
                {
                    name: 'inAlpha'
                }
            ]
        },
        vertexBufferLayout: {
            usage: 'STATIC_DRAW',
            count: 4,
            layout: [
                {
                    // The vertex index, 0-3.
                    name: 'inVertex',
                    type: 'UNSIGNED_BYTE'
                }
            ]
        }
    },

    /**
     * Fill out the configuration object with default values where needed.
     *
     * @method Phaser.Renderer.WebGL.RenderNodes.SubmitterImageGPULayer#_completeConfig
     * @since 3.90.0
     * @param {object} config - The configuration object to complete.
     */
    _completeLayout: function (config)
    {
        // Set up vertex buffer layout.
        var layoutSource = config.vertexBufferLayout;
        config.vertexBufferLayout = {};
        config.vertexBufferLayout.usage = layoutSource.usage;
        config.vertexBufferLayout.count = layoutSource.count;
        config.vertexBufferLayout.layout = [];
        var remove = config.vertexBufferLayoutRemove || [];

        for (var i = 0; i < layoutSource.layout.length; i++)
        {
            var sourceAttr = layoutSource.layout[i];
            if (remove.indexOf(sourceAttr.name) !== -1)
            {
                continue;
            }
            config.vertexBufferLayout.layout[i] = {
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
                config.vertexBufferLayout.layout.push({
                    name: addAttr.name,
                    size: addAttr.size || 1,
                    type: addAttr.type || 'FLOAT',
                    normalized: addAttr.normalized || false
                });
            }
        }

        // Set up instance buffer layout.
        layoutSource = config.instanceBufferLayout;
        config.instanceBufferLayout = {};
        config.instanceBufferLayout.usage = layoutSource.usage;
        config.instanceBufferLayout.instanceDivisor = layoutSource.instanceDivisor;
        config.instanceBufferLayout.layout = [];
        remove = config.instanceBufferLayoutRemove || [];

        for (i = 0; i < layoutSource.layout.length; i++)
        {
            sourceAttr = layoutSource.layout[i];
            if (remove.indexOf(sourceAttr.name) !== -1)
            {
                continue;
            }
            config.instanceBufferLayout.layout[i] = {
                name: sourceAttr.name,
                size: sourceAttr.size || 1,
                type: sourceAttr.type || 'FLOAT',
                normalized: sourceAttr.normalized || false
            };
        }

        if (config.instanceBufferLayoutAdd)
        {
            add = config.instanceBufferLayoutAdd || [];
            for (i = 0; i < add.length; i++)
            {
                addAttr = add[i];
                config.instanceBufferLayout.layout.push({
                    name: addAttr.name,
                    size: addAttr.size || 1,
                    type: addAttr.type || 'FLOAT',
                    normalized: addAttr.normalized || false
                });
            }
        }
    },

    /**
     * Called at the start of the `run` method.
     *
     * @method Phaser.Renderer.WebGL.RenderNodes.SubmitterImageGPULayer#onRunBegin
     * @since 3.90.0
     * @param {Phaser.Renderer.WebGL.DrawingContext} drawingContext - The current drawing context.
     */
    onRunBegin: function (drawingContext)
    {
        var camera = drawingContext.camera;

        this.program.setUniform(
            'uRoundPixels',
            camera.roundPixels
        );

        this.program.setUniform(
            'uResolution',
            [ drawingContext.width, drawingContext.height ]
        );

        drawingContext.renderer.setProjectionMatrix(
            drawingContext.width,
            drawingContext.height
        );
        this.program.setUniform(
            'uProjectionMatrix',
            drawingContext.renderer.projectionMatrix.val
        );

        var cm = camera.matrix;
        this.program.setUniform(
            'uViewMatrix',
            [
                cm.a, cm.b, 0,
                cm.c, cm.d, 0,
                cm.tx, cm.ty, 1
            ]
        );
    },

    /**
     * Render an ImageGPULayer object.
     *
     * @method Phaser.Renderer.WebGL.RenderNodes.SubmitterImageGPULayer#run
     * @since 3.90.0
     * @param {Phaser.Renderer.WebGL.DrawingContext} drawingContext - The current drawing context.
     */
    run: function (drawingContext)
    {
        this.manager.startStandAloneRender();

        this.onRunBegin(drawingContext);

        if (this.gameObject.needsUpdate)
        {
            this.manager.getNode('BakeImageGPULayer').run(this.gameObject);
        }

        // Set game object derived uniforms.
        var camera = drawingContext.camera;
        this.program.setUniform(
            'uCameraScrollAndAlpha',
            [
                camera.scrollX,
                camera.scrollY,
                camera.alpha * this.gameObject.alpha
            ]
        );

        // Assemble textures.
        var textures = [
            this.gameObject.frame.source.glTexture
        ];

        // Render instances.
        this.manager.renderer.drawInstancedArrays(
            drawingContext,
            textures,
            this.program,
            this.vao,
            0,
            4,
            this.gameObject.images.length
        );

        this.onRunEnd(drawingContext);
    }
});

module.exports = SubmitterImageGPULayer;
