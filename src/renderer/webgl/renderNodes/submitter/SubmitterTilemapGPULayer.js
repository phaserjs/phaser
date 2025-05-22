/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      None
 */

var TransformMatrix = require('../../../../gameobjects/components/TransformMatrix');
var Vector2 = require('../../../../math/Vector2');
var Class = require('../../../../utils/Class');
var Merge = require('../../../../utils/object/Merge');
var ProgramManager = require('../../ProgramManager');
var MakeAnimLength = require('../../shaders/additionMakers/MakeAnimLength');
var MakeApplyLighting = require('../../shaders/additionMakers/MakeApplyLighting');
var MakeDefineLights = require('../../shaders/additionMakers/MakeDefineLights');
var MakeSampleNormal = require('../../shaders/additionMakers/MakeSampleNormal');
var MakeSmoothPixelArt = require('../../shaders/additionMakers/MakeSmoothPixelArt');
var ShaderSourceFS = require('../../shaders/TilemapGPULayer-frag');
var ShaderSourceVS = require('../../shaders/TilemapGPULayer-vert');
var WebGLVertexBufferLayoutWrapper = require('../../wrappers/WebGLVertexBufferLayoutWrapper');
var RenderNode = require('../RenderNode');
var Utils = require('../../Utils');

/**
 * @classdesc
 * The SubmitterTilemapGPULayer RenderNode handles rendering of
 * TilemapGPULayer objects.
 *
 * It is a Stand Alone Render, meaning that it does not batch.
 *
 * @class SubmitterTilemapGPULayer
 * @extends Phaser.Renderer.WebGL.RenderNodes.RenderNode
 * @memberof Phaser.Renderer.WebGL.RenderNodes
 * @constructor
 * @since 4.0.0
 * @param {Phaser.Renderer.WebGL.RenderNodes.RenderNodeManager} manager - The manager that owns this RenderNode.
 * @param {Phaser.Types.Renderer.WebGL.RenderNodes.BatchHandlerConfig} [config] - The configuration object for this handler.
 */
var SubmitterTilemapGPULayer = new Class({
    Extends: RenderNode,

    initialize: function SubmitterTilemapGPULayer (manager, config)
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
         * @name Phaser.Renderer.WebGL.RenderNodes.SubmitterTilemapGPULayer#config
         * @type {object}
         * @since 4.0.0
         */
        this.config = finalConfig;

        /**
         * The index buffer defining vertex order.
         *
         * @name Phaser.Renderer.WebGL.RenderNodes.SubmitterTilemapGPULayer#indexBuffer
         * @type {Phaser.Renderer.WebGL.Wrappers.WebGLBufferWrapper}
         * @since 4.0.0
         */
        this.indexBuffer = renderer.genericQuadIndexBuffer;

        /**
         * The vertex buffer layout for this RenderNode.
         *
         * This consists of 4 bytes, 0-3, forming corners of a quad instance.
         *
         * @name Phaser.Renderer.WebGL.RenderNodes.SubmitterTilemapGPULayer#vertexBufferLayout
         * @type {Phaser.Renderer.WebGL.Wrappers.WebGLVertexBufferLayoutWrapper}
         * @since 4.0.0
         * @readonly
         */
        this.vertexBufferLayout = new WebGLVertexBufferLayoutWrapper(
            renderer,
            finalConfig.vertexBufferLayout,
            null
        );

        /**
         * The program manager used to create and manage shader programs.
         * This contains shader variants.
         *
         * @name Phaser.Renderer.WebGL.RenderNodes.SubmitterTilemapGPULayer#programManager
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
         * The matrix used internally to compute sprite transforms.
         *
         * @name Phaser.Renderer.WebGL.RenderNodes.SubmitterTilemapGPULayer#_spriteMatrix
         * @type {Phaser.GameObjects.Components.TransformMatrix}
         * @since 4.0.0
         * @private
         */
        this._spriteMatrix = new TransformMatrix();

        /**
         * The matrix used internally to compute the final transform.
         *
         * @name Phaser.Renderer.WebGL.RenderNodes.SubmitterTilemapGPULayer#_calcMatrix
         * @type {Phaser.GameObjects.Components.TransformMatrix}
         * @since 4.0.0
         * @private
         */
        this._calcMatrix = new TransformMatrix();

        /**
         * A vector used for temporary calculations.
         *
         * @name Phaser.Renderer.WebGL.RenderNodes.SubmitterTilemapGPULayer#_lightVector
         * @type {Phaser.Math.Vector2}
         * @since 4.0.0
         * @private
         */
        this._lightVector = new Vector2();

        /**
         * The matrix used to store the final quad data for rendering.
         *
         * @name Phaser.Renderer.WebGL.RenderNodes.SubmitterTilemapGPULayer#_quad
         * @type {Float32Array}
         * @since 4.0.0
         * @private
         */
        this._quad = new Float32Array(8);
    },

    /**
     * Default configuration of this RenderNode.
     *
     * @name Phaser.Renderer.WebGL.RenderNodes.SubmitterTilemapGPULayer#defaultConfig
     * @type {Phaser.Types.Renderer.WebGL.RenderNodes.BatchHandlerConfig}
     * @since 4.0.0
     * @readonly
     * @property {string} name - The name of this RenderNode.
     * @property {string} vertexSource - The vertex shader source.
     * @property {string} fragmentSource - The fragment shader source.
     */
    defaultConfig: {
        name: 'SubmitterTilemapGPULayer',
        shaderName: 'TilemapGPULayer',
        vertexSource: ShaderSourceVS,
        fragmentSource: ShaderSourceFS,
        shaderAdditions: [
            MakeSmoothPixelArt(true),
            MakeSampleNormal(true),
            MakeDefineLights(true),
            MakeApplyLighting(true)
        ],
        vertexBufferLayout: {
            usage: 'DYNAMIC_DRAW',
            count: 4,
            layout: [
                {
                    name: 'inPosition',
                    size: 2
                },
                {
                    name: 'inTexCoord',
                    size: 2
                }
            ]
        }
    },

    /**
     * Fill out the configuration object with default values where needed.
     *
     * @method Phaser.Renderer.WebGL.RenderNodes.SubmitterTilemapGPULayer#_completeConfig
     * @since 4.0.0
     * @param {object} config - The configuration object to complete.
     */
    _completeLayout: function (config)
    {
        // Set up vertex buffer layout.
        var layoutSource = config.vertexBufferLayout;
        config.vertexBufferLayout = {};
        config.vertexBufferLayout.usage = layoutSource.usage;
        config.vertexBufferLayout.count = layoutSource.count || 4;
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
    },

    /**
     * Set up uniforms for rendering.
     *
     * @method Phaser.Renderer.WebGL.RenderNodes.SubmitterTilemapGPULayer#setupUniforms
     * @since 4.0.0
     * @param {Phaser.Renderer.WebGL.DrawingContext} drawingContext - The current drawing context.
     * @param {Phaser.Tilemaps.TilemapGPULayer} tilemapLayer - The TilemapGPULayer being rendered.
     */
    setupUniforms: function (drawingContext, tilemapLayer)
    {
        var programManager = this.programManager;

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

        // TilemapGPULayer uniforms.

        var tileset = tilemapLayer.tileset;
        var mainTexture = tileset.glTexture;
        var layerTexture = tilemapLayer.layerDataTexture;
        var animTexture = tileset.getAnimationDataTexture(drawingContext.renderer);

        programManager.setUniform('uMainSampler', 0);
        programManager.setUniform('uLayerSampler', 1);
        programManager.setUniform('uAnimSampler', 2);

        programManager.setUniform(
            'uMainResolution',
            [ mainTexture.width, mainTexture.height ]
        );

        programManager.setUniform(
            'uLayerResolution',
            [ layerTexture.width, layerTexture.height ]
        );

        programManager.setUniform(
            'uAnimResolution',
            [ animTexture.width, animTexture.height ]
        );

        programManager.setUniform(
            'uTileColumns',
            tileset.columns
        );

        programManager.setUniform(
            'uTileWidthHeightMarginSpacing',
            [
                tileset.tileWidth,
                tileset.tileHeight,
                tileset.tileMargin,
                tileset.tileSpacing
            ]
        );

        programManager.setUniform(
            'uAlpha',
            tilemapLayer.alpha
        );

        programManager.setUniform(
            'uTime',
            tilemapLayer.timeElapsed
        );

        // Lighting uniforms.
        Utils.updateLightingUniforms(
            tilemapLayer.lighting,
            drawingContext,
            programManager,
            3,
            this._lightVector,
            tilemapLayer.selfShadow.enabled,
            tilemapLayer.selfShadow.diffuseFlatThreshold,
            tilemapLayer.selfShadow.penumbra
        );
    },

    /**
     * Update render options for a TilemapGPULayer object.
     * This may use a different shader program.
     * This is called before rendering the object.
     *
     * @method Phaser.Renderer.WebGL.RenderNodes.SubmitterTilemapGPULayer#updateRenderOptions
     * @since 4.0.0
     * @param {Phaser.Tilemaps.TilemapGPULayer} gameObject - The TilemapGPULayer being rendered.
     */
    updateRenderOptions: function (gameObject)
    {
        var programManager = this.programManager;
        var texture = gameObject.tileset.image;

        // We do not track whether the shader program has changed.
        // This is because this is not a batch renderer,
        // and the program is set every time this is called.

        // Set animation options.
        var animAddition = programManager.getAdditionsByTag('MAXANIMS')[0];
        if (animAddition)
        {
            programManager.removeAddition(animAddition.name);
        }
        if (gameObject.tileset.maxAnimationLength > 0)
        {
            programManager.addAddition(
                MakeAnimLength(gameObject.tileset.maxAnimationLength)
            );
        }

        // Set lighting options.
        var lighting = gameObject.lighting;
        var lightingAdditions = programManager.getAdditionsByTag('LIGHTING');
        for (var i = 0; i < lightingAdditions.length; i++)
        {
            var addition = lightingAdditions[i];
            addition.disable = !lighting;
        }

        if (lighting)
        {
            var defineLightsAddition = programManager.getAddition('DefineLights');
            if (defineLightsAddition)
            {
                defineLightsAddition.additions.fragmentDefine =
                    '#define LIGHT_COUNT ' + this.manager.renderer.config.maxLights;
            }
        }

        // Set self-shadow options.
        var selfShadow = gameObject.selfShadow.enabled;
        if (selfShadow === null)
        {
            selfShadow = gameObject.scene.sys.game.config.selfShadow;
        }
        if (selfShadow)
        {
            programManager.addFeature('SELFSHADOW');
        }
        else
        {
            programManager.removeFeature('SELFSHADOW');
        }

        // Set smooth pixel art options.
        var smoothPixelArt = texture.smoothPixelArt;
        if (smoothPixelArt === null)
        {
            smoothPixelArt = gameObject.scene.sys.game.config.smoothPixelArt;
        }
        var smoothPixelArtAddition = programManager.getAddition('SmoothPixelArt');
        if (smoothPixelArtAddition)
        {
            smoothPixelArtAddition.disable = !smoothPixelArt;
        }

        // Set up border filtering options.
        var borderFilter = texture.source[0].glTexture.magFilter === this.manager.renderer.gl.LINEAR;
        if (borderFilter)
        {
            programManager.addFeature('BORDERFILTER');
        }
        else
        {
            programManager.removeFeature('BORDERFILTER');
        }
    },

    /**
     * Render a TilemapGPULayer object.
     *
     * @method Phaser.Renderer.WebGL.RenderNodes.SubmitterTilemapGPULayer#run
     * @since 4.0.0
     * @param {Phaser.Renderer.WebGL.DrawingContext} drawingContext - The current drawing context.
     * @param {Phaser.Tilemaps.TilemapGPULayer} tilemapLayer - The TilemapGPULayer being rendered.
     * @param {Phaser.GameObjects.Components.TransformMatrix} [parentMatrix] - The parent matrix describing the game object's context.
     */
    run: function (
        drawingContext,
        tilemapLayer,
        parentMatrix
    )
    {
        var manager = this.manager;
        var renderer = manager.renderer;

        manager.startStandAloneRender();

        this.onRunBegin(drawingContext);

        // Transform layer quad.
        var camera = drawingContext.camera;
        var spriteMatrix = this._spriteMatrix;
        var calcMatrix = this._calcMatrix;
        var quad = this._quad;

        var x = tilemapLayer.x;
        var y = tilemapLayer.y;
        var width = tilemapLayer.width;
        var height = tilemapLayer.height;

        calcMatrix.copyWithScrollFactorFrom(
            camera.matrix,
            camera.scrollX, camera.scrollY,
            tilemapLayer.scrollFactorX, tilemapLayer.scrollFactorY
        );

        if (parentMatrix)
        {
            calcMatrix.multiply(parentMatrix);
        }

        spriteMatrix.applyITRS(x, y, 0, tilemapLayer.scaleX, tilemapLayer.scaleY);

        // Multiply by the Sprite matrix
        calcMatrix.multiply(spriteMatrix);

        // Compute output quad.
        calcMatrix.setQuad(
            x,
            y,
            x + width,
            y + height,
            quad
        );

        // Populate vertex buffer.
        var stride = this.vertexBufferLayout.layout.stride;
        var vertexBuffer = this.vertexBufferLayout.buffer;
        var vertexF32 = vertexBuffer.viewF32;
        var offset32 = 0;

        // Bottom Left.
        vertexF32[offset32++] = quad[2];
        vertexF32[offset32++] = quad[3];
        vertexF32[offset32++] = 0;
        vertexF32[offset32++] = 0;

        // Top Left.
        vertexF32[offset32++] = quad[0];
        vertexF32[offset32++] = quad[1];
        vertexF32[offset32++] = 0;
        vertexF32[offset32++] = 1;

        // Bottom Right.
        vertexF32[offset32++] = quad[4];
        vertexF32[offset32++] = quad[5];
        vertexF32[offset32++] = 1;
        vertexF32[offset32++] = 0;

        // Top Right.
        vertexF32[offset32++] = quad[6];
        vertexF32[offset32++] = quad[7];
        vertexF32[offset32++] = 1;
        vertexF32[offset32++] = 1;

        // Update vertex buffer.
        // Because we frequently aren't filling the entire buffer,
        // we need to update the buffer with the correct size.
        vertexBuffer.update(stride * 4);

        // Assemble textures.
        var tileset = tilemapLayer.tileset;
        var mainGlTexture = tileset.glTexture;
        var animated = tileset.getAnimationDataIndexMap(renderer).size > 0;

        var textures = [
            mainGlTexture,
            tilemapLayer.layerDataTexture
        ];

        if (animated)
        {
            textures[2] = tileset.getAnimationDataTexture(renderer);
        }

        if (tilemapLayer.lighting)
        {
            var texture = tileset.image;
            var normalMap = texture.dataSource[0];
            if (!normalMap)
            {
                normalMap = this.manager.renderer.normalTexture;
            }
            else
            {
                normalMap = normalMap.glTexture;
            }
            textures[3] = normalMap;
        }

        this.updateRenderOptions(tilemapLayer);

        var programManager = this.programManager;
        var programSuite = programManager.getCurrentProgramSuite();

        if (programSuite)
        {
            var program = programSuite.program;
            var vao = programSuite.vao;

            this.setupUniforms(drawingContext, tilemapLayer);
            programManager.applyUniforms(program);

            // Render layer.
            renderer.drawElements(
                drawingContext,
                textures,
                program,
                vao,
                4,
                0
            );
        }

        this.onRunEnd(drawingContext);
    }
});

module.exports = SubmitterTilemapGPULayer;
