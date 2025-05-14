/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../../../utils/Class');
var Merge = require('../../../../utils/object/Merge');
var Utils = require('../../Utils.js');
var RenderNode = require('../RenderNode');

var getTint = Utils.getTintAppendFloatAlpha;

/**
 * @classdesc
 * The SubmitterQuad RenderNode submits data for rendering a single Image-like GameObject.
 * It uses a BatchHandler to render the image as part of a batch.
 *
 * This node receives the drawing context, game object, and parent matrix.
 * It also receives the texturer, tinter, and transformer nodes
 * from the node that invoked it.
 * This allows the behavior to be configured by setting the appropriate nodes
 * on the GameObject for individual tweaks, or on the invoking Renderer node
 * for global changes.
 *
 * @class SubmitterQuad
 * @memberof Phaser.Renderer.WebGL.RenderNodes
 * @constructor
 * @since 4.0.0
 * @extends Phaser.Renderer.WebGL.RenderNodes.RenderNode
 * @param {Phaser.Renderer.WebGL.RenderNodes.RenderNodeManager} manager - The manager that owns this RenderNode.
 * @param {Phaser.Types.Renderer.WebGL.RenderNodes.SubmitterQuadConfig} [config] - The configuration object for this RenderNode.
 */
var SubmitterQuad = new Class({
    Extends: RenderNode,

    initialize: function SubmitterQuad (manager, config)
    {
        config = Merge(config || {}, this.defaultConfig);

        RenderNode.call(this, config.name, manager);

        /**
         * The key of the RenderNode used to render data.
         *
         * @name Phaser.Renderer.WebGL.RenderNodes.SubmitterQuad#batchHandler
         * @type {string}
         * @since 4.0.0
         */
        this.batchHandler = config.batchHandler;

        /**
         * Persistent object reused to pass render options to the batch handler.
         *
         * @name Phaser.Renderer.WebGL.RenderNodes.SubmitterQuad#_renderOptions
         * @type {Phaser.Types.Renderer.WebGL.RenderNodes.BatchHandlerQuadRenderOptions}
         * @since 4.0.0
         * @private
         */
        this._renderOptions = {
            multiTexturing: true,
            lighting: null,
            smoothPixelArt: null
        };

        /**
         * Persistent object reused to pass lighting options to the batch handler.
         *
         * @name Phaser.Renderer.WebGL.RenderNodes.SubmitterQuad#_lightingOptions
         * @type {Phaser.Types.Renderer.WebGL.RenderNodes.BatchHandlerQuadRenderOptionsLighting}
         * @since 4.0.0
         * @private
         */
        this._lightingOptions = {
            normalGLTexture: null,
            normalMapRotation: 0,
            selfShadow: {
                enabled: false,
                penumbra: 0,
                diffuseFlatThreshold: 0
            }
        };
    },

    /**
     * The default configuration for this RenderNode.
     *
     * @name Phaser.Renderer.WebGL.RenderNodes.SubmitterQuad#defaultConfig
     * @type {Phaser.Types.Renderer.WebGL.RenderNodes.SubmitterQuadConfig}
     */
    defaultConfig: {
        name: 'SubmitterQuad',
        role: 'Submitter',
        batchHandler: 'BatchHandler'
    },

    /**
     * Submit data for rendering.
     *
     * @method Phaser.Renderer.WebGL.RenderNodes.SubmitterQuad#run
     * @since 4.0.0
     * @param {Phaser.Renderer.WebGL.DrawingContext} drawingContext - The current drawing context.
     * @param {Phaser.GameObjects.GameObject} gameObject - The GameObject being rendered.
     * @param {Phaser.GameObjects.Components.TransformMatrix} parentMatrix - The parent matrix of the GameObject.
     * @param {?object} element - The specific element within the game object. This is used for objects that consist of multiple quads.
     * @param {Phaser.Renderer.WebGL.RenderNodes.RenderNode} texturerNode - The texturer node used to texture the GameObject. You may pass a TexturerImage node or an object containing equivalent data without a `run` method.
     * @param {Phaser.Renderer.WebGL.RenderNodes.RenderNode|{ quad: Float32Array }} transformerNode - The transformer node used to transform the GameObject. You may pass a transformer node or an object with a `quad` property.
     * @param {Phaser.Renderer.WebGL.RenderNodes.RenderNode|Omit<Phaser.Renderer.WebGL.RenderNodes.RenderNode, 'run'>} [tinterNode] - The tinter node used to tint the GameObject. You may pass a tinter node or an object containing equivalent data without a `run` method. If omitted, Image-style tinting will be used.
     * @param {Phaser.Renderer.WebGL.Wrappers.WebGLTextureWrapper} [normalMap] - The normal map texture to use for lighting. If omitted, the normal map texture of the GameObject will be used, or the default normal map texture of the renderer.
     * @param {number} [normalMapRotation] - The rotation of the normal map texture. If omitted, the rotation of the GameObject will be used.
     */
    run: function (
        drawingContext,
        gameObject,
        parentMatrix,
        element,
        texturerNode,
        transformerNode,
        tinterNode,
        normalMap,
        normalMapRotation
    )
    {
        this.onRunBegin(drawingContext);

        var tintFill, tintTopLeft, tintBottomLeft, tintTopRight, tintBottomRight;

        if (texturerNode.run)
        {
            texturerNode.run(drawingContext, gameObject, element);
        }
        if (transformerNode.run)
        {
            transformerNode.run(drawingContext, gameObject, texturerNode, parentMatrix, element);
        }
        if (tinterNode)
        {
            if (tinterNode.run)
            {
                tinterNode.run(drawingContext, gameObject, element);
            }
            tintFill = tinterNode.tintFill;
            tintTopLeft = tinterNode.tintTopLeft;
            tintBottomLeft = tinterNode.tintBottomLeft;
            tintTopRight = tinterNode.tintTopRight;
            tintBottomRight = tinterNode.tintBottomRight;
        }
        else
        {
            tintFill = gameObject.tintFill;
            tintTopLeft = getTint(gameObject.tintTopLeft, gameObject._alphaTL);
            tintBottomLeft = getTint(gameObject.tintBottomLeft, gameObject._alphaBL);
            tintTopRight = getTint(gameObject.tintTopRight, gameObject._alphaTR);
            tintBottomRight = getTint(gameObject.tintBottomRight, gameObject._alphaBR);
        }

        var quad = transformerNode.quad;
        var uvSource = texturerNode.uvSource;
        var u0 = uvSource.u0;
        var v0 = uvSource.v0;
        var u1 = uvSource.u1;
        var v1 = uvSource.v1;

        this.setRenderOptions(gameObject, normalMap, normalMapRotation);

        (
            gameObject.customRenderNodes[this.batchHandler] ||
            gameObject.defaultRenderNodes[this.batchHandler]
        ).batch(
            drawingContext,

            // Use `frame.source.glTexture` instead of `frame.glTexture`
            // to avoid unnecessary getter function calls.
            texturerNode.frame.source.glTexture,

            // Transformed quad in order TL, BL, TR, BR:
            quad[0], quad[1],
            quad[2], quad[3],
            quad[6], quad[7],
            quad[4], quad[5],

            // Texture coordinates in X, Y, Width, Height:
            u0, v0, u1 - u0, v1 - v0,

            tintFill,

            // Tint colors in order TL, BL, TR, BR:
            tintTopLeft, tintBottomLeft, tintTopRight, tintBottomRight,

            // Extra render options:
            this._renderOptions
        );

        this.onRunEnd(drawingContext);
    },

    setRenderOptions: function (gameObject, normalMap, normalMapRotation)
    {
        var renderOptions = this._renderOptions;
        var baseTexture, sourceIndex;
        if (gameObject.displayTexture)
        {
            baseTexture = gameObject.displayTexture;
            sourceIndex = gameObject.displayFrame.sourceIndex;
        }
        else if (gameObject.texture)
        {
            baseTexture = gameObject.texture;
            sourceIndex = gameObject.frame.sourceIndex;
        }
        else if (gameObject.tileset)
        {
            if (Array.isArray(gameObject.tileset))
            {
                baseTexture = gameObject.tileset[0].image;
            }
            else
            {
                baseTexture = gameObject.tileset.image;
            }
            sourceIndex = 0;
        }


        if (gameObject.lighting)
        {
            // Get normal map.
            if (!normalMap)
            {
                if (baseTexture)
                {
                    normalMap = baseTexture.dataSource[sourceIndex];
                }
            }
            if (!normalMap)
            {
                normalMap = this.manager.renderer.normalTexture;
            }
            else
            {
                normalMap = normalMap.glTexture;
            }

            // Get normal map rotation.
            if (isNaN(normalMapRotation))
            {
                normalMapRotation = gameObject.rotation;
                if (gameObject.parentContainer)
                {
                    var matrix = gameObject.getWorldTransformMatrix(this._tempMatrix, this._tempMatrix2);
                    normalMapRotation = matrix.rotationNormalized;
                }
            }

            // Get self-shadow.
            var selfShadow = gameObject.selfShadow;
            var selfShadowEnabled = selfShadow.enabled;
            if (selfShadowEnabled === null)
            {
                selfShadowEnabled = gameObject.scene.sys.game.config.selfShadow;
            }

            this._lightingOptions.normalGLTexture = normalMap;
            this._lightingOptions.normalMapRotation = normalMapRotation;
            this._lightingOptions.selfShadow.enabled = selfShadowEnabled;
            this._lightingOptions.selfShadow.penumbra = selfShadow.penumbra;
            this._lightingOptions.selfShadow.diffuseFlatThreshold = selfShadow.diffuseFlatThreshold;

            renderOptions.lighting = this._lightingOptions;
        }
        else
        {
            renderOptions.lighting = null;
        }

        // Get smooth pixel art option.
        var smoothPixelArt;
        if (baseTexture && baseTexture.smoothPixelArt !== null)
        {
            smoothPixelArt = baseTexture.smoothPixelArt;
        }
        else
        {
            smoothPixelArt = gameObject.scene.sys.game.config.smoothPixelArt;
        }
        renderOptions.smoothPixelArt = smoothPixelArt;
    }
});

module.exports = SubmitterQuad;
