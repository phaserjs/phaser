/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2024 Phaser Studio Inc.
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
 * @since 3.90.0
 * @extends Phaser.Renderer.WebGL.RenderNodes.RenderNode
 * @param {Phaser.Renderer.WebGL.RenderNodes.RenderNodeManager} manager - The manager that owns this RenderNode.
 * @param {object} [config] - The configuration object for this RenderNode.
 * @param {string} [config.name='SubmitterQuad'] - The name of this RenderNode.
 * @param {string} [config.role='Submitter'] - The expected role of this RenderNode.
 * @param {string} [config.batchHandler='BatchHandlerQuad'] - The key of the default batch handler node to use for this RenderNode. This should correspond to a node which extends `BatchHandlerQuad`.
 */
var SubmitterQuad = new Class({
    Extends: RenderNode,

    initialize: function SubmitterQuad (manager, config)
    {
        config = Merge(config || {}, this.defaultConfig);

        RenderNode.call(this, config.name, manager);

        /**
         * The RenderNode used to render data.
         *
         * @name Phaser.Renderer.WebGL.RenderNodes.SubmitterQuad#batchHandler
         * @type {Phaser.Renderer.WebGL.RenderNodes.BatchHandler}
         * @since 3.90.0
         */
        this.batchHandler = manager.getNode(config.batchHandler);
    },

    /**
     * The default configuration for this RenderNode.
     *
     * @name Phaser.Renderer.WebGL.RenderNodes.SubmitterQuad#defaultConfig
     * @type {object}
     */
    defaultConfig: {
        name: 'SubmitterQuad',
        role: 'Submitter',
        batchHandler: 'BatchHandlerQuad'
    },

    /**
     * Submit data for rendering.
     *
     * @method Phaser.Renderer.WebGL.RenderNodes.SubmitterQuad#run
     * @since 3.90.0
     * @param {Phaser.Renderer.WebGL.DrawingContext} drawingContext - The current drawing context.
     * @param {Phaser.GameObjects.GameObject} gameObject - The GameObject being rendered.
     * @param {Phaser.GameObjects.Components.TransformMatrix} parentMatrix - The parent matrix of the GameObject.
     * @param {number} [elementIndex] - The index of the element within the game object. This is used for objects that consist of multiple quads.
     * @param {Phaser.Renderer.WebGL.RenderNodes.RenderNode|Omit<Phaser.Renderer.WebGL.RenderNodes.TexturerImage, 'run'>} texturerNode - The texturer node used to texture the GameObject. You may pass a texturer node or an object containing equivalent data without a `run` method.
     * @param {Phaser.Renderer.WebGL.RenderNodes.RenderNode|{ quad: Float32Array }} transformerNode - The transformer node used to transform the GameObject. You may pass a transformer node or an object with a `quad` property.
     * @param {Phaser.Renderer.WebGL.RenderNodes.RenderNode|Omit<Phaser.Renderer.WebGL.RenderNodes.RenderNode, 'run'>} [tinterNode] - The tinter node used to tint the GameObject. You may pass a tinter node or an object containing equivalent data without a `run` method. If omitted, Image-style tinting will be used.
     */
    run: function (
        drawingContext,
        gameObject,
        parentMatrix,
        elementIndex,
        texturerNode,
        transformerNode,
        tinterNode
    )
    {
        this.onRunBegin(drawingContext);

        var cameraAlpha = drawingContext.camera.alpha;
        var tintTopLeft, tintBottomLeft, tintTopRight, tintBottomRight;

        if (texturerNode.run)
        {
            texturerNode.run(drawingContext, gameObject, elementIndex);
        }
        if (transformerNode.run)
        {
            transformerNode.run(drawingContext, gameObject, parentMatrix, elementIndex, texturerNode);
        }
        if (tinterNode)
        {
            if (tinterNode.run)
            {
                tinterNode.run(drawingContext, gameObject, elementIndex);
            }
            tintTopLeft = tinterNode.tintTopLeft;
            tintBottomLeft = tinterNode.tintBottomLeft;
            tintTopRight = tinterNode.tintTopRight;
            tintBottomRight = tinterNode.tintBottomRight;
        }
        else
        {
            tintTopLeft = getTint(gameObject.tintTopLeft, cameraAlpha * gameObject._alphaTL);
            tintBottomLeft = getTint(gameObject.tintBottomLeft, cameraAlpha * gameObject._alphaBL);
            tintTopRight = getTint(gameObject.tintTopRight, cameraAlpha * gameObject._alphaTR);
            tintBottomRight = getTint(gameObject.tintBottomRight, cameraAlpha * gameObject._alphaBR);
        }

        var quad = transformerNode.quad;
        var uvSource = texturerNode.uvSource;
        var u0 = uvSource.u0;
        var v0 = uvSource.v0;
        var u1 = uvSource.u1;
        var v1 = uvSource.v1;

        this.batchHandler.batch(
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

            gameObject.tintFill,

            // Tint colors in order TL, BL, TR, BR:
            tintTopLeft, tintBottomLeft, tintTopRight, tintBottomRight
        );

        this.onRunEnd(drawingContext);
    }
});

module.exports = SubmitterQuad;
