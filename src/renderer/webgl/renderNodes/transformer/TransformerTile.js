/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../../../utils/Class');
var TransformerImage = require('./TransformerImage');

/**
 * @classdesc
 * A RenderNode which handles transformation data for a single Tile within a TilemapLayer.
 *
 * @class TransformerTile
 * @memberof Phaser.Renderer.WebGL.RenderNodes
 * @constructor
 * @since 4.0.0
 * @extends Phaser.Renderer.WebGL.RenderNodes.TransformerImage
 * @param {Phaser.Renderer.WebGL.RenderNodes.RenderNodeManager} manager - The manager that owns this RenderNode.
 * @param {object} [config] - The configuration object for this RenderNode.
 */
var TransformerTile = new Class({
    Extends: TransformerImage,

    initialize: function TransformerTile (manager, config)
    {
        TransformerImage.call(this, manager, config);
    },

    defaultConfig: {
        name: 'TransformerTile',
        role: 'Transformer'
    },

    /**
     * Stores the transform data for rendering.
     *
     * @method Phaser.Renderer.WebGL.RenderNodes.TransformerTile#run
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

        var camera = drawingContext.camera;
        var calcMatrix = this._calcMatrix;
        var spriteMatrix = this._spriteMatrix;

        // Get view matrix.
        calcMatrix.copyWithScrollFactorFrom(
            camera.getViewMatrix(!drawingContext.useCanvas),
            camera.scrollX, camera.scrollY,
            gameObject.scrollFactorX, gameObject.scrollFactorY
        );

        if (parentMatrix)
        {
            calcMatrix.multiply(parentMatrix);
        }

        var frameWidth = texturerNode.frameWidth;
        var frameHeight = texturerNode.frameHeight;

        var width = frameWidth;
        var height = frameHeight;

        var halfWidth = frameWidth / 2;
        var halfHeight = frameHeight / 2;

        var sx = gameObject.scaleX;
        var sy = gameObject.scaleY;

        var tileset = gameObject.gidMap[element.index];

        // TODO: Is the tileset missing?

        var tOffsetX = tileset.tileOffset.x;
        var tOffsetY = tileset.tileOffset.y;

        var srcX = gameObject.x + element.pixelX * sx + (halfWidth * sx - tOffsetX);
        var srcY = gameObject.y + element.pixelY * sy + (halfHeight * sy - tOffsetY);

        var x = - halfWidth;
        var y = - halfHeight;

        if (element.flipX)
        {
            width *= -1;
            x += frameWidth;
        }

        if (element.flipY)
        {
            height *= -1;
            x += frameHeight;
        }

        spriteMatrix.applyITRS(
            srcX,
            srcY,
            element.rotation,
            sx,
            sy
        );

        // Multiply by the Sprite matrix
        calcMatrix.multiply(spriteMatrix);

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

module.exports = TransformerTile;
