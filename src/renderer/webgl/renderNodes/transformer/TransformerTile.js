/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2024 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var TransformMatrix = require('../../../../gameobjects/components/TransformMatrix.js');
var Class = require('../../../../utils/Class');
var Merge = require('../../../../utils/object/Merge');
var RenderNode = require('../RenderNode');

/**
 * @classdesc
 * A RenderNode which handles transformation data for a single Tile within a TilemapLayer.
 *
 * @class TransformerTile
 * @memberof Phaser.Renderer.WebGL.RenderNodes
 * @constructor
 * @since 3.90.0
 * @extends Phaser.Renderer.WebGL.RenderNodes.RenderNode
 * @param {Phaser.Renderer.WebGL.RenderNodes.RenderNodeManager} manager - The manager that owns this RenderNode.
 * @param {object} [config] - The configuration object for this RenderNode.
 */
var TransformerTile = new Class({
    Extends: RenderNode,

    initialize: function TransformerTile (manager, config)
    {
        config = Merge(config || {}, this.defaultConfig);

        RenderNode.call(this, config.name, manager);

        /**
         * The matrix used to store the final quad data for rendering.
         *
         * @name Phaser.Renderer.WebGL.RenderNodes.TransformerTile#quad
         * @type {Float32Array}
         * @since 3.90.0
         */
        this.quad = new Float32Array(8);

        /**
         * The matrix used internally to compute camera transforms.
         *
         * @name Phaser.Renderer.WebGL.RenderNodes.TransformerTile#_camMatrix
         * @type {Phaser.GameObjects.Components.TransformMatrix}
         * @since 3.90.0
         * @private
         */
        this._camMatrix = new TransformMatrix();

        /**
         * The matrix used internally to compute sprite transforms.
         *
         * @name Phaser.Renderer.WebGL.RenderNodes.TransformerTile#_spriteMatrix
         * @type {Phaser.GameObjects.Components.TransformMatrix}
         * @since 3.90.0
         * @private
         */
        this._spriteMatrix = new TransformMatrix();

        /**
         * The matrix used internally to compute the final transform.
         *
         * @name Phaser.Renderer.WebGL.RenderNodes.TransformerTile#_calcMatrix
         * @type {Phaser.GameObjects.Components.TransformMatrix}
         * @since 3.90.0
         * @private
         */
        this._calcMatrix = new TransformMatrix();
    },

    defaultConfig: {
        name: 'TransformerTile',
        role: 'Transformer'
    },

    /**
     * Stores the transform data for rendering.
     *
     * @method Phaser.Renderer.WebGL.RenderNodes.TransformerTile#run
     * @since 3.90.0
     * @param {Phaser.Renderer.WebGL.DrawingContext} drawingContext - The current drawing context.
     * @param {Phaser.GameObjects.GameObject} gameObject - The GameObject being rendered.
     * @param {Phaser.GameObjects.Components.TransformMatrix} [parentMatrix] - This transform matrix is defined if the game object is nested.
     * @param {object} [element] - The specific element within the game object. This is used for objects that consist of multiple quads. It is unused here.
     * @param {Phaser.Renderer.WebGL.RenderNodes.RenderNode} texturerNode - The texturer node used to texture the GameObject. This contains relevant data on the dimensions of the object.
     */
    run: function (drawingContext, gameObject, parentMatrix, element, texturerNode)
    {
        this.onRunBegin(drawingContext);








        var camera = drawingContext.camera;
        var calcMatrix = this._calcMatrix;
        var spriteMatrix = this._spriteMatrix;

        // camMatrix will not be mutated when working with tiles,
        // so we just take a reference.
        var camMatrix = camera.matrix;

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
        spriteMatrix.e -= camera.scrollX * gameObject.scrollFactorX;
        spriteMatrix.f -= camera.scrollY * gameObject.scrollFactorY;

        // Multiply by the Sprite matrix, store result in calcMatrix
        camMatrix.multiply(spriteMatrix, calcMatrix);

        calcMatrix.setQuad(
            x,
            y,
            x + width,
            y + height,
            false,
            this.quad
        );






/*
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

        var gx = gameObject.x;
        var gy = gameObject.y;

        var camera = drawingContext.camera;
        var calcMatrix = this._calcMatrix;
        var camMatrix = this._camMatrix;
        var spriteMatrix = this._spriteMatrix;

        spriteMatrix.applyITRS(gx, gy, gameObject.rotation, gameObject.scaleX * flipX, gameObject.scaleY * flipY);

        if (parentMatrix)
        {
            //  Multiply the camera by the parent matrix
            camMatrix.copyFrom(camera.matrix);
            camMatrix.multiplyWithOffset(parentMatrix, -camera.scrollX * gameObject.scrollFactorX, -camera.scrollY * gameObject.scrollFactorY);

            //  Undo the camera scroll
            spriteMatrix.e = gx;
            spriteMatrix.f = gy;
        }
        else
        {
            // camMatrix will not be mutated after this point, so we just take a reference.
            camMatrix = camera.matrix;
            spriteMatrix.e -= camera.scrollX * gameObject.scrollFactorX;
            spriteMatrix.f -= camera.scrollY * gameObject.scrollFactorY;
        }

        // Multiply by the Sprite matrix, store result in calcMatrix
        camMatrix.multiply(spriteMatrix, calcMatrix);

        // Store the output quad.
        calcMatrix.setQuad(
            x,
            y,
            x + texturerNode.frameWidth,
            y + texturerNode.frameHeight,
            false,
            this.quad
        );
*/
        this.onRunEnd(drawingContext);
    }
});

module.exports = TransformerTile;
