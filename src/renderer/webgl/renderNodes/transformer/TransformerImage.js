/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var TransformMatrix = require('../../../../gameobjects/components/TransformMatrix.js');
var Class = require('../../../../utils/Class');
var Merge = require('../../../../utils/object/Merge');
var RenderNode = require('../RenderNode');

/**
 * @classdesc
 * A RenderNode that computes and stores the screen-space quad vertex positions
 * for a single Image-like GameObject each time it is rendered.
 *
 * During its `run` call, this node combines the camera view matrix (adjusted
 * for the game object's scroll factors), any parent container matrix, and the
 * game object's own position, rotation, and scale into a single final transform
 * matrix. It then projects the four corners of the game object's frame through
 * that matrix and writes the resulting eight coordinate values (four x/y pairs)
 * into the `quad` Float32Array, ready for consumption by the subsequent
 * submitter node.
 *
 * Horizontal and vertical flipping are handled here, with the local origin
 * offset adjusted automatically when the frame does not use a custom pivot.
 * Vertex rounding is also applied when required by the game object or camera
 * settings, snapping all quad corners to integer pixel coordinates to avoid
 * sub-pixel rendering artefacts.
 *
 * @class TransformerImage
 * @memberof Phaser.Renderer.WebGL.RenderNodes
 * @constructor
 * @since 4.0.0
 * @extends Phaser.Renderer.WebGL.RenderNodes.RenderNode
 * @param {Phaser.Renderer.WebGL.RenderNodes.RenderNodeManager} manager - The manager that owns this RenderNode.
 * @param {object} [config] - The configuration object for this RenderNode.
 */
var TransformerImage = new Class({
    Extends: RenderNode,

    initialize: function TransformerImage (manager, config)
    {
        config = Merge(config || {}, this.defaultConfig);

        RenderNode.call(this, config.name, manager);

        /**
         * A flat array of 8 floats storing the screen-space positions of the four
         * corners of the rendered quad, written during each `run` call. Values are
         * ordered as [x0, y0, x1, y1, x2, y2, x3, y3], representing the top-left,
         * top-right, bottom-left, and bottom-right corners respectively.
         *
         * @name Phaser.Renderer.WebGL.RenderNodes.TransformerImage#quad
         * @type {Float32Array}
         * @since 4.0.0
         */
        this.quad = new Float32Array(8);

        /**
         * The matrix used internally to compute sprite transforms.
         *
         * @name Phaser.Renderer.WebGL.RenderNodes.TransformerImage#_spriteMatrix
         * @type {Phaser.GameObjects.Components.TransformMatrix}
         * @since 4.0.0
         * @private
         */
        this._spriteMatrix = new TransformMatrix();

        /**
         * The matrix used internally to compute the final transform.
         *
         * @name Phaser.Renderer.WebGL.RenderNodes.TransformerImage#_calcMatrix
         * @type {Phaser.GameObjects.Components.TransformMatrix}
         * @since 4.0.0
         * @private
         */
        this._calcMatrix = new TransformMatrix();
    },

    defaultConfig: {
        name: 'TransformerImage',
        role: 'Transformer'
    },

    /**
     * Computes the final screen-space quad vertex positions for the given
     * Image-like GameObject and stores them in `this.quad`.
     *
     * The method builds the complete transform by combining the camera view
     * matrix (modified by the game object's scroll factors), an optional parent
     * container matrix, and the game object's own position, rotation, and scale.
     * Horizontal and vertical flips are factored in by negating the relevant
     * scale axis and, when the frame does not use a custom pivot, by adjusting
     * the local origin offset so the image flips around its display origin.
     * The resulting four corner positions are then projected through the matrix
     * via `setQuad` and written into `this.quad`. If vertex rounding is required,
     * all eight values are snapped to the nearest integer before the node exits.
     *
     * @method Phaser.Renderer.WebGL.RenderNodes.TransformerImage#run
     * @since 4.0.0
     * @param {Phaser.Renderer.WebGL.DrawingContext} drawingContext - The current drawing context.
     * @param {Phaser.GameObjects.GameObject} gameObject - The GameObject being rendered.
     * @param {Phaser.Renderer.WebGL.RenderNodes.RenderNode} texturerNode - The texturer node used to texture the GameObject. This contains relevant data on the dimensions of the object.
     * @param {Phaser.GameObjects.Components.TransformMatrix} [parentMatrix] - This transform matrix is defined if the game object is nested.
     * @param {object} [element] - The specific element within the game object. This is used for objects that consist of multiple quads. It is unused here.
     */
    run: function (drawingContext, gameObject, texturerNode, parentMatrix, element)
    {
        this.onRunBegin(drawingContext);

        var frame = texturerNode.frame;
        var uvSource = texturerNode.uvSource;

        var frameX = uvSource.x;
        var frameY = uvSource.y;

        var displayOriginX = gameObject.displayOriginX;
        var displayOriginY = gameObject.displayOriginY;

        var x = -displayOriginX + frameX;
        var y = -displayOriginY + frameY;

        var customPivot = frame.customPivot;

        var flipX = 1;
        var flipY = 1;

        if (gameObject.flipX)
        {
            if (!customPivot)
            {
                x += (-frame.realWidth + (displayOriginX * 2));
            }

            flipX = -1;
        }

        if (gameObject.flipY)
        {
            if (!customPivot)
            {
                y += (-frame.realHeight + (displayOriginY * 2));
            }

            flipY = -1;
        }

        var camera = drawingContext.camera;
        var spriteMatrix = this._spriteMatrix;
        var calcMatrix = this._calcMatrix.copyWithScrollFactorFrom(
            camera.getViewMatrix(!drawingContext.useCanvas),
            camera.scrollX, camera.scrollY,
            gameObject.scrollFactorX, gameObject.scrollFactorY
        );

        if (parentMatrix)
        {
            calcMatrix.multiply(parentMatrix);
        }

        spriteMatrix.applyITRS(
            gameObject.x, gameObject.y,
            gameObject.rotation,
            gameObject.scaleX * flipX, gameObject.scaleY * flipY
        );

        calcMatrix.multiply(spriteMatrix);

        // Store the output quad.
        calcMatrix.setQuad(
            x,
            y,
            x + texturerNode.frameWidth,
            y + texturerNode.frameHeight,
            this.quad
        );

        // Determine whether the matrix does not rotate, scale, or skew.
        // Keyword: #OnlyTranslate
        var cmm = calcMatrix.matrix;
        var onlyTranslate = cmm[0] === 1 && cmm[1] === 0 && cmm[2] === 0 && cmm[3] === 1;

        // Handle vertex rounding.
        if (gameObject.willRoundVertices(camera, onlyTranslate))
        {
            var quad = this.quad;
            quad[0] = Math.round(quad[0]);
            quad[1] = Math.round(quad[1]);
            quad[2] = Math.round(quad[2]);
            quad[3] = Math.round(quad[3]);
            quad[4] = Math.round(quad[4]);
            quad[5] = Math.round(quad[5]);
            quad[6] = Math.round(quad[6]);
            quad[7] = Math.round(quad[7]);
        }

        this.onRunEnd(drawingContext);
    }
});

module.exports = TransformerImage;
