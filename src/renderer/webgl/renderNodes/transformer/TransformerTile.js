/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../../../utils/Class');
var TransformMatrix = require('../../../../gameobjects/components/TransformMatrix.js');
var TransformerImage = require('./TransformerImage');

/**
 * @classdesc
 * A RenderNode which handles transformation data for a single Tile within a TilemapLayer.
 *
 * This node extends `TransformerImage` with tile-specific logic, including support
 * for tileset offsets, per-tile flip flags, and per-tile rotation. It is used by
 * the TilemapLayer rendering pipeline to position and orient each individual tile
 * in world space before it is submitted to the batch renderer.
 *
 * Unlike `TransformerImage`, which operates on a standalone Game Object, this node
 * reads positional and flip data from a tile element descriptor (`element`) rather
 * than directly from the Game Object, allowing it to handle the many tiles that
 * make up a single TilemapLayer in a single render pass.
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

        /**
         * The camera view matrix, with scroll factor and parent matrix applied,
         * for the layer set up by `setupLayer`. It is copied for each tile
         * of that layer instead of being recomputed.
         *
         * @name Phaser.Renderer.WebGL.RenderNodes.TransformerTile#_layerMatrix
         * @type {Phaser.GameObjects.Components.TransformMatrix}
         * @private
         * @since 4.3.0
         */
        this._layerMatrix = new TransformMatrix();

        /**
         * The layer whose matrix is cached in `_layerMatrix`,
         * or `null` if no layer is set up.
         *
         * @name Phaser.Renderer.WebGL.RenderNodes.TransformerTile#_layer
         * @type {?Phaser.GameObjects.GameObject}
         * @private
         * @since 4.3.0
         */
        this._layer = null;
    },

    /**
     * Prepares this node to render the tiles of a layer.
     *
     * Computes the camera view matrix, scroll factor and parent matrix
     * once for the layer, so that `run` can reuse it for every tile
     * of that layer instead of recomputing it.
     *
     * Call `endLayer` when the layer has been rendered.
     *
     * @method Phaser.Renderer.WebGL.RenderNodes.TransformerTile#setupLayer
     * @since 4.3.0
     * @param {Phaser.Renderer.WebGL.DrawingContext} drawingContext - The current drawing context.
     * @param {Phaser.GameObjects.GameObject} gameObject - The tilemap layer about to be rendered.
     * @param {Phaser.GameObjects.Components.TransformMatrix} [parentMatrix] - This transform matrix is defined if the game object is nested.
     */
    setupLayer: function (drawingContext, gameObject, parentMatrix)
    {
        var camera = drawingContext.camera;
        var layerMatrix = this._layerMatrix;

        layerMatrix.copyWithScrollFactorFrom(
            camera.getViewMatrix(!drawingContext.useCanvas),
            camera.scrollX, camera.scrollY,
            gameObject.scrollFactorX, gameObject.scrollFactorY
        );

        if (parentMatrix)
        {
            layerMatrix.multiply(parentMatrix);
        }

        this._layer = gameObject;
    },

    /**
     * Clears the layer prepared by `setupLayer`,
     * so that `run` computes the full matrix again.
     *
     * @method Phaser.Renderer.WebGL.RenderNodes.TransformerTile#endLayer
     * @since 4.3.0
     */
    endLayer: function ()
    {
        this._layer = null;
    },

    defaultConfig: {
        name: 'TransformerTile',
        role: 'Transformer'
    },

    /**
     * Computes and stores the world-space transform quad for a single tile element, ready for submission to the batch renderer.
     *
     * This method builds the final transformation by combining the camera view matrix (with scroll
     * factor applied), an optional parent matrix for nested Game Objects, and a per-tile sprite
     * matrix derived from the tile's pixel position, rotation, and the TilemapLayer's scale. Tileset
     * tile offsets are factored into the world position, and horizontal or vertical flips are applied
     * by negating the quad dimensions. If vertex rounding is enabled on the camera, the resulting
     * quad coordinates are rounded to the nearest integer to avoid sub-pixel rendering artefacts.
     *
     * @method Phaser.Renderer.WebGL.RenderNodes.TransformerTile#run
     * @since 4.0.0
     * @param {Phaser.Renderer.WebGL.DrawingContext} drawingContext - The current drawing context.
     * @param {Phaser.GameObjects.GameObject} gameObject - The GameObject being rendered.
     * @param {Phaser.Renderer.WebGL.RenderNodes.RenderNode} texturerNode - The texturer node used to texture the GameObject. This contains relevant data on the dimensions of the object.
     * @param {Phaser.GameObjects.Components.TransformMatrix} [parentMatrix] - This transform matrix is defined if the game object is nested.
     * @param {object} [element] - The tile element descriptor for the tile being rendered. Contains the tile's pixel position, rotation, flip flags, and GID index used to look up the tileset.
     */
    run: function (drawingContext, gameObject, texturerNode, parentMatrix, element)
    {
        this.onRunBegin(drawingContext);

        var camera = drawingContext.camera;
        var calcMatrix = this._calcMatrix;
        var spriteMatrix = this._spriteMatrix;

        if (this._layer === gameObject)
        {
            calcMatrix.copyFrom(this._layerMatrix);
        }
        else
        {
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

        if (element.rotation === 0)
        {
            calcMatrix.translate(srcX, srcY);
            calcMatrix.scale(sx, sy);
        }
        else
        {
            spriteMatrix.applyITRS(
                srcX,
                srcY,
                element.rotation,
                sx,
                sy
            );

            // Multiply by the Sprite matrix
            calcMatrix.multiply(spriteMatrix);
        }

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
