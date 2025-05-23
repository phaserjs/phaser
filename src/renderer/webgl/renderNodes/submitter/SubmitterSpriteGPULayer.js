/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var TransformMatrix = require('../../../../gameobjects/components/TransformMatrix');
var Vector2 = require('../../../../math/Vector2');
var Class = require('../../../../utils/Class');
var Merge = require('../../../../utils/object/Merge');
var ProgramManager = require('../../ProgramManager');
var MakeApplyLighting = require('../../shaders/additionMakers/MakeApplyLighting');
var MakeApplyTint = require('../../shaders/additionMakers/MakeApplyTint');
var MakeDefineLights = require('../../shaders/additionMakers/MakeDefineLights');
var MakeDefineTexCount = require('../../shaders/additionMakers/MakeDefineTexCount');
var MakeGetNormalFromMap = require('../../shaders/additionMakers/MakeGetNormalFromMap');
var MakeGetTexCoordOut = require('../../shaders/additionMakers/MakeGetTexCoordOut');
var MakeGetTexRes = require('../../shaders/additionMakers/MakeGetTexRes');
var MakeGetTexture = require('../../shaders/additionMakers/MakeGetTexture');
var MakeOutInverseRotation = require('../../shaders/additionMakers/MakeOutInverseRotation');
var MakeSmoothPixelArt = require('../../shaders/additionMakers/MakeSmoothPixelArt');
var Utils = require('../../Utils');
var WebGLVertexBufferLayoutWrapper = require('../../wrappers/WebGLVertexBufferLayoutWrapper');
var RenderNode = require('../RenderNode');

var ShaderSourceFS = require('../../shaders/SpriteGPULayer-frag');
var ShaderSourceVS = require('../../shaders/SpriteGPULayer-vert');

/**
 * @classdesc
 * This RenderNode handles rendering of a single SpriteGPULayer object.
 * A new instance of the RenderNode should be created for each SpriteGPULayer object,
 * as it stores the shader program and vertex buffer data for the object.
 *
 * It is a Stand Alone Render, meaning that it does not batch.
 * It is best suited to rendering highly complex objects.
 *
 * @class SubmitterSpriteGPULayer
 * @extends Phaser.Renderer.WebGL.RenderNodes.RenderNode
 * @memberof Phaser.Renderer.WebGL.RenderNodes
 * @constructor
 * @since 4.0.0
 * @param {Phaser.Renderer.WebGL.RenderNodes.RenderNodeManager} manager - The manager that owns this RenderNode.
 * @param {Phaser.Types.Renderer.WebGL.RenderNodes.SubmitterSpriteGPULayerConfig} config - The configuration object for this handler.
 * @param {Phaser.GameObjects.SpriteGPULayer} gameObject - The SpriteGPULayer object to render.
 */
var SubmitterSpriteGPULayer = new Class({
    Extends: RenderNode,

    initialize: function SubmitterSpriteGPULayer (manager, config, gameObject)
    {
        var renderer = manager.renderer;

        var finalConfig = Merge(config || {}, this.defaultConfig);
        var name = finalConfig.name;
        this._completeLayout(finalConfig);

        RenderNode.call(this, name, manager);

        /**
         * The completed configuration object for this RenderNode.
         * This is defined by the default configuration and the user-defined configuration object.
         *
         * @name Phaser.Renderer.WebGL.RenderNodes.SubmitterSpriteGPULayer#config
         * @type {object}
         * @since 4.0.0
         */
        this.config = finalConfig;

        /**
         * The SpriteGPULayer GameObject this RenderNode is rendering.
         *
         * @name Phaser.Renderer.WebGL.RenderNodes.SubmitterSpriteGPULayer#gameObject
         * @type {Phaser.GameObjects.SpriteGPULayer}
         * @since 4.0.0
         * @readonly
         */
        this.gameObject = gameObject;

        /**
         * The instance buffer layout for this RenderNode.
         *
         * @name Phaser.Renderer.WebGL.RenderNodes.SubmitterSpriteGPULayer#instanceBufferLayout
         * @type {Phaser.Renderer.WebGL.Wrappers.WebGLVertexBufferLayoutWrapper}
         * @since 4.0.0
         * @readonly
         */
        this.instanceBufferLayout = new WebGLVertexBufferLayoutWrapper(
            renderer,
            finalConfig.instanceBufferLayout,
            null
        );

        /**
         * The vertex buffer layout for this RenderNode.
         *
         * This consists of 4 bytes, 0-3, forming corners of a quad instance.
         *
         * @name Phaser.Renderer.WebGL.RenderNodes.SubmitterSpriteGPULayer#vertexBufferLayout
         * @type {Phaser.Renderer.WebGL.Wrappers.WebGLVertexBufferLayoutWrapper}
         * @since 4.0.0
         * @readonly
         */
        this.vertexBufferLayout = new WebGLVertexBufferLayoutWrapper(
            renderer,
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
         * The program manager used to create and manage shader programs.
         * This contains shader variants.
         *
         * @name Phaser.Renderer.WebGL.RenderNodes.SubmitterSpriteGPULayer#programManager
         * @type {Phaser.Renderer.WebGL.ProgramManager}
         * @since 4.0.0
         */
        this.programManager = new ProgramManager(
            renderer,
            [ this.vertexBufferLayout, this.instanceBufferLayout ],
            this.indexBuffer
        );

        // Fill in program configuration from config.
        this.programManager.setBaseShader(
            finalConfig.shaderName,
            finalConfig.vertexSource,
            finalConfig.fragmentSource
        );
        if (finalConfig.shaderAdditions)
        {
            for (var i = 0; i < finalConfig.shaderAdditions.length; i++)
            {
                var addition = finalConfig.shaderAdditions[i];
                this.programManager.addAddition(addition);
            }
        }
        if (finalConfig.shaderFeatures)
        {
            for (i = 0; i < finalConfig.shaderFeatures.length; i++)
            {
                this.programManager.addFeature(finalConfig.shaderFeatures[i]);
            }
        }

        /**
         * A matrix used for temporary calculations.
         *
         * @name Phaser.Renderer.WebGL.RenderNodes.SubmitterSpriteGPULayer#_calcMatrix
         * @type {Phaser.GameObjects.Components.TransformMatrix}
         * @since 4.0.0
         */
        this._calcMatrix = new TransformMatrix();

        /**
         * A vector used for temporary calculations.
         *
         * @name Phaser.Renderer.WebGL.RenderNodes.SubmitterSpriteGPULayer#_lightVector
         * @type {Phaser.Math.Vector2}
         * @since 4.0.0
         * @private
         */
        this._lightVector = new Vector2();
    },

    /**
     * Default configuration of this RenderNode.
     *
     * @name Phaser.Renderer.WebGL.RenderNodes.SubmitterSpriteGPULayer#defaultConfig
     * @type {object}
     * @since 4.0.0
     * @readonly
     * @property {string} name - The name of this RenderNode.
     * @property {string} vertexSource - The vertex shader source.
     * @property {string} fragmentSource - The fragment shader source.
     */
    defaultConfig: {
        name: 'SubmitterSpriteGPULayer',
        count: 0,
        shaderName: 'SpriteGPULayer',
        vertexSource: ShaderSourceVS,
        fragmentSource: ShaderSourceFS,
        shaderAdditions: [
            MakeGetTexCoordOut(),
            MakeGetTexRes(),
            MakeSmoothPixelArt(true),
            MakeDefineTexCount(1),
            MakeGetTexture(),
            MakeApplyTint(),
            MakeDefineLights(true),
            MakeOutInverseRotation(true),
            MakeGetNormalFromMap(true),
            MakeApplyLighting(true)
        ],
        instanceBufferLayout: {
            usage: 'STATIC_DRAW',
            instanceDivisor: 1,
            layout: [
                {
                    name: 'inPositionX',
                    size: 4
                },
                {
                    name: 'inPositionY',
                    size: 4
                },
                {
                    name: 'inRotation',
                    size: 4
                },
                {
                    name: 'inScaleX',
                    size: 4
                },
                {
                    name: 'inScaleY',
                    size: 4
                },
                {
                    name: 'inAlpha',
                    size: 4
                },
                {
                    name: 'inFrame',
                    size: 4
                },
                {
                    name: 'inTintBlend',
                    size: 4
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
                    name: 'inOriginAndTintFillAndCreationTime',
                    size: 4
                },
                {
                    name: 'inScrollFactor',
                    size: 2
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
     * @method Phaser.Renderer.WebGL.RenderNodes.SubmitterSpriteGPULayer#_completeConfig
     * @since 4.0.0
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

    setupUniforms: function (drawingContext)
    {
        var camera = drawingContext.camera;
        var programManager = this.programManager;
        var layer = this.gameObject;

        programManager.setUniform(
            'uRoundPixels',
            camera.roundPixels
        );

        programManager.setUniform(
            'uResolution',
            [ drawingContext.width, drawingContext.height ]
        );

        drawingContext.renderer.setProjectionMatrixFromDrawingContext(drawingContext);
        programManager.setUniform(
            'uProjectionMatrix',
            drawingContext.renderer.projectionMatrix.val
        );

        var cm = camera.matrixCombined;
        programManager.setUniform(
            'uViewMatrix',
            [
                cm.a, cm.b, 0,
                cm.c, cm.d, 0,
                cm.tx, cm.ty, 1
            ]
        );

        programManager.setUniform(
            'uCameraScrollAndAlpha',
            [
                camera.scrollX,
                camera.scrollY,
                layer.alpha
            ]
        );

        programManager.setUniform(
            'uTime',
            layer.timeElapsed
        );

        programManager.setUniform(
            'uDiffuseResolution',
            [
                layer.frame.source.width,
                layer.frame.source.height
            ]
        );

        programManager.setUniform(
            'uFrameDataResolution',
            [
                layer.frameDataTexture.width,
                layer.frameDataTexture.height
            ]
        );

        programManager.setUniform(
            'uGravity',
            layer.gravity
        );

        // Set texture sampler uniforms.
        programManager.setUniform('uMainSampler[0]', 0);
        programManager.setUniform('uFrameDataTexture', 1);

        var glTexture = layer.texture.source[0].glTexture;
        programManager.setUniform('uMainResolution[0]', [ glTexture.width, glTexture.height ]);

        // Lighting uniforms.
        Utils.updateLightingUniforms(
            layer.lighting,
            drawingContext,
            programManager,
            2,
            this._lightVector,
            layer.selfShadow.enabled,
            layer.selfShadow.diffuseFlatThreshold,
            layer.selfShadow.penumbra
        );
    },

    updateRenderOptions: function ()
    {
        var programManager = this.programManager;

        // Set lighting options.
        var lighting = this.gameObject.lighting;
        var lightingAdditions = programManager.getAdditionsByTag('LIGHTING');
        for (var i = 0; i < lightingAdditions.length; i++)
        {
            lightingAdditions[i].disable = !lighting;
        }

        if (lighting)
        {
            var defineLightsAddition = programManager.getAddition('DefineLights');
            if (defineLightsAddition)
            {
                defineLightsAddition.additions.fragmentDefine = '#define LIGHT_COUNT ' + this.manager.renderer.config.maxLights;
            }
        }

        // Set smooth pixel art options.
        var smoothAddition = programManager.getAddition('SmoothPixelArt');
        if (smoothAddition)
        {
            var smoothPixelArt = this.gameObject.texture.smoothPixelArt;
            if (smoothPixelArt === null)
            {
                smoothPixelArt = this.gameObject.scene.game.config.smoothPixelArt;
            }
            smoothAddition.disable = !smoothPixelArt;
        }

        // Set features.
        programManager.clearFeatures();
        var shaderFeatures = this.gameObject.getShaderFeatures();
        for (i = 0; i < shaderFeatures.length; i++)
        {
            programManager.addFeature(shaderFeatures[i]);
        }

        if (this.gameObject.selfShadow.enabled)
        {
            programManager.addFeature('SELFSHADOW');
        }
    },

    /**
     * Render a SpriteGPULayer object.
     *
     * @method Phaser.Renderer.WebGL.RenderNodes.SubmitterSpriteGPULayer#run
     * @since 4.0.0
     * @param {Phaser.Renderer.WebGL.DrawingContext} drawingContext - The current drawing context.
     */
    run: function (drawingContext)
    {
        var i;
        var layer = this.gameObject;

        if (layer.memberCount === 0)
        {
            return;
        }

        this.manager.startStandAloneRender();

        this.onRunBegin(drawingContext);

        // Update instance buffer if needed.
        var segments = layer.bufferUpdateSegments;
        if (segments > 0)
        {
            var buffer = this.instanceBufferLayout.buffer;
            var memberCount = layer.memberCount;

            var lastSegment = Math.floor(memberCount / layer.bufferUpdateSegmentSize);
            var occupiedSegmentsAllUpdated = true;
            for (i = 0; i <= lastSegment; i++)
            {
                if (1 << i & segments)
                {
                    continue;
                }
                occupiedSegmentsAllUpdated = false;
                break;
            }

            if (
                segments === layer.MAX_BUFFER_UPDATE_SEGMENTS_FULL ||
                memberCount <= layer.bufferUpdateSegmentSize ||
                occupiedSegmentsAllUpdated
            )
            {
                // Everything needs updating.
                buffer.update();
            }
            else
            {
                // Only some segments need updating.
                var segmentSize = layer.bufferUpdateSegmentSize;
                var segmentByteSize = segmentSize * this.instanceBufferLayout.layout.stride;
                for (
                    i = 0;
                    i < 32 && i * segmentSize < memberCount;
                    i++
                )
                {
                    if (segments & (1 << i))
                    {
                        buffer.update(segmentByteSize, i * segmentByteSize);
                    }
                }
            }
            layer.clearAllSegmentsNeedUpdate();
        }

        // Assemble textures.
        var textures = [
            layer.frame.source.glTexture,
            layer.frameDataTexture
        ];

        if (layer.lighting)
        {
            var normalMap = layer.texture.dataSource[layer.frame.sourceIndex];
            if (!normalMap)
            {
                normalMap = this.manager.renderer.normalTexture;
            }
            else
            {
                normalMap = normalMap.glTexture;
            }
            textures[2] = normalMap;
        }

        this.updateRenderOptions();

        var programManager = this.programManager;
        var programSuite = programManager.getCurrentProgramSuite();

        if (programSuite)
        {
            var program = programSuite.program;
            var vao = programSuite.vao;

            this.setupUniforms(drawingContext);
            programManager.applyUniforms(program);

            // Render instances.
            this.manager.renderer.drawInstancedArrays(
                drawingContext,
                textures,
                program,
                vao,
                0,
                4,
                layer.memberCount
            );
        }

        this.onRunEnd(drawingContext);
    }
});

module.exports = SubmitterSpriteGPULayer;
