/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../../../utils/Class');
var TransformerImage = require('./TransformerImage.js');

/**
 * @classdesc
 * A RenderNode which handles transformation data for a single TileSprite GameObject.
 *
 * @class TransformerTileSprite
 * @memberof Phaser.Renderer.WebGL.RenderNodes
 * @constructor
 * @since 4.0.0
 * @extends Phaser.Renderer.WebGL.RenderNodes.TransformerImage
 * @param {Phaser.Renderer.WebGL.RenderNodes.RenderNodeManager} manager - The manager that owns this RenderNode.
 * @param {object} [config] - The configuration object for this RenderNode.
 */
var TransformerTileSprite = new Class({
    Extends: TransformerImage,

    initialize: function TransformerTileSprite (manager, config)
    {
        TransformerImage.call(this, manager, config);
    },

    defaultConfig: {
        name: 'TransformerTileSprite',
        role: 'Transformer'
    },

    /**
     * Stores the transform data for rendering.
     *
     * @method Phaser.Renderer.WebGL.RenderNodes.TransformerTileSprite#run
     * @since 4.0.0
     * @param {Phaser.Renderer.WebGL.DrawingContext} drawingContext - The current drawing context.
     * @param {Phaser.GameObjects.GameObject} gameObject - The GameObject being rendered.
     * @param {Phaser.Renderer.WebGL.RenderNodes.RenderNode} [texturerNode] - The texturer node used to texture the GameObject. This contains relevant data on the dimensions of the object. It is unused here.
     * @param {Phaser.GameObjects.Components.TransformMatrix} [parentMatrix] - This transform matrix is defined if the game object is nested.
     * @param {object} [element] - The specific element within the game object. This is used for objects that consist of multiple quads. It is unused here.
     */
    run: function (drawingContext, gameObject, texturerNode, parentMatrix, element)
    {
        this.onRunBegin(drawingContext);

        // Unlike TransformerImage, the dimensions of a TileSprite are not
        // derived from the frame, but from the GameObject itself.

        var width = gameObject.width;
        var height = gameObject.height;

        var displayOriginX = gameObject.displayOriginX;
        var displayOriginY = gameObject.displayOriginY;

        var x = -displayOriginX;
        var y = -displayOriginY;

        var flipX = 1;
        var flipY = 1;

        if (gameObject.flipX)
        {
            x += (-width + (displayOriginX * 2));

            flipX = -1;
        }

        if (gameObject.flipY)
        {
            y += (-height + (displayOriginY * 2));

            flipY = -1;
        }

        var gx = gameObject.x;
        var gy = gameObject.y;

        var camera = drawingContext.camera;
        var calcMatrix = this._calcMatrix;
        var spriteMatrix = this._spriteMatrix;

        calcMatrix.copyWithScrollFactorFrom(
            camera.getViewMatrix(!drawingContext.useCanvas),
            camera.scrollX, camera.scrollY,
            gameObject.scrollFactorX, gameObject.scrollFactorY
        );

        if (parentMatrix)
        {
            calcMatrix.multiply(parentMatrix);
        }

        spriteMatrix.applyITRS(
            gx, gy,
            gameObject.rotation,
            gameObject.scaleX * flipX, gameObject.scaleY * flipY
        );

        calcMatrix.multiply(spriteMatrix);

        // Store the output quad.
        calcMatrix.setQuad(
            x,
            y,
            x + width,
            y + height,
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

module.exports = TransformerTileSprite;
