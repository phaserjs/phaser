/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2024 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../../../utils/Class');
var Utils = require('../../Utils.js');
var SubmitterQuad = require('./SubmitterQuad.js');

var getTint = Utils.getTintAppendFloatAlpha;

var SubmitterTileSprite = new Class({
    Extends: SubmitterQuad,

    initialize: function SubmitterTileSprite (manager, config)
    {
        SubmitterQuad.call(this, manager, config);
    },

    /**
     * The default configuration for this RenderNode.
     *
     * @name Phaser.Renderer.WebGL.RenderNodes.SubmitterTileSprite#defaultConfig
     * @type {object}
     */
    defaultConfig: {
        name: 'SubmitterTileSprite',
        role: 'Submitter',
        batchHandler: 'BatchHandler'
    },

    /**
     * Submit data for rendering.
     *
     * @method Phaser.Renderer.WebGL.RenderNodes.SubmitterTileSprite#run
     * @since 3.90.0
     * @param {Phaser.Renderer.WebGL.DrawingContext} drawingContext - The current drawing context.
     * @param {Phaser.GameObjects.GameObject} gameObject - The GameObject being rendered.
     * @param {Phaser.GameObjects.Components.TransformMatrix} parentMatrix - The parent matrix of the GameObject.
     * @param {object} [element] - The specific element within the game object. This is used for objects that consist of multiple quads.
     * @param {Phaser.Renderer.WebGL.RenderNodes.TexturerTileSprite|Omit<Phaser.Renderer.WebGL.RenderNodes.TexturerTileSprite, 'run'>} texturerNode - The texturer node used to texture the GameObject. You may pass a texturer node or an object containing equivalent data without a `run` method.
     * @param {Phaser.Renderer.WebGL.RenderNodes.TransformerTileSprite|{ quad: Float32Array }} transformerNode - The transformer node used to transform the GameObject. You may pass a transformer node or an object with a `quad` property.
     * @param {Phaser.Renderer.WebGL.RenderNodes.RenderNode|Omit<Phaser.Renderer.WebGL.RenderNodes.RenderNode, 'run'>} [tinterNode] - The tinter node used to tint the GameObject. You may pass a tinter node or an object containing equivalent data without a `run` method. If omitted, Image-style tinting will be used.
     */
    run: function (
        drawingContext,
        gameObject,
        parentMatrix,
        element,
        texturerNode,
        transformerNode,
        tinterNode
    )
    {
        this.onRunBegin(drawingContext);

        var cameraAlpha = drawingContext.camera.alpha;
        var tintFill, tintTopLeft, tintBottomLeft, tintTopRight, tintBottomRight;

        if (texturerNode.run)
        {
            texturerNode.run(drawingContext, gameObject, element);
        }
        if (transformerNode.run)
        {
            transformerNode.run(drawingContext, gameObject, parentMatrix, element, texturerNode);
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
            tintTopLeft = getTint(gameObject.tintTopLeft, cameraAlpha * gameObject._alphaTL);
            tintBottomLeft = getTint(gameObject.tintBottomLeft, cameraAlpha * gameObject._alphaBL);
            tintTopRight = getTint(gameObject.tintTopRight, cameraAlpha * gameObject._alphaTR);
            tintBottomRight = getTint(gameObject.tintBottomRight, cameraAlpha * gameObject._alphaBR);
        }

        var frame = texturerNode.frame;
        var quad = transformerNode.quad;
        var uvSource = frame;
        var u0 = uvSource.u0;
        var v0 = uvSource.v0;
        var u1 = uvSource.u1;
        var v1 = uvSource.v1;
        var uvQuad = texturerNode.uvMatrix.quad;

        (
            gameObject.customRenderNodes[this.batchHandler] ||
            gameObject.defaultRenderNodes[this.batchHandler]
        ).batch(
            drawingContext,

            // Use `frame.source.glTexture` instead of `frame.glTexture`
            // to avoid unnecessary getter function calls.
            frame.source.glTexture,

            // Transformed quad in order TL, BL, TR, BR:
            quad[0], quad[1],
            quad[2], quad[3],
            quad[6], quad[7],
            quad[4], quad[5],

            // Texture coordinates in X, Y, Width, Height:
            u0, v0, u1 - u0, v1 - v0,

            // Dynamic UV coordinates in order TL, BL, TR, BR:
            uvQuad[0], uvQuad[1],
            uvQuad[2], uvQuad[3],
            uvQuad[6], uvQuad[7],
            uvQuad[4], uvQuad[5],

            tintFill,

            // Tint colors in order TL, BL, TR, BR:
            tintTopLeft, tintBottomLeft, tintTopRight, tintBottomRight
        );

        this.onRunEnd(drawingContext);
    }
});

module.exports = SubmitterTileSprite;
