/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var TransformMatrix = require('../../../../gameobjects/components/TransformMatrix');
var Class = require('../../../../utils/Class');
var RenderNode = require('../RenderNode');

/**
 * @classdesc
 * A RenderNode which handles texturing for a single TileSprite GameObject.
 *
 * Unlike a standard sprite texturer, this node computes a UV transformation
 * matrix that accounts for the TileSprite's tile position, tile scale, and
 * tile rotation, allowing the texture to scroll, scale, and rotate
 * independently of the GameObject's own transform. It stores the resulting
 * frame data and UV matrix so they can be consumed by a subsequent render
 * node before this node is reused.
 *
 * @class TexturerTileSprite
 * @memberof Phaser.Renderer.WebGL.RenderNodes
 * @constructor
 * @since 4.0.0
 * @extends Phaser.Renderer.WebGL.RenderNodes.RenderNode
 * @param {Phaser.Renderer.WebGL.RenderNodes.RenderNodeManager} manager - The manager that owns this RenderNode.
 */
var TexturerTileSprite = new Class({
    Extends: RenderNode,

    initialize: function TexturerTileSprite (manager)
    {
        RenderNode.call(this, 'TexturerTileSprite', manager);

        /**
         * The frame data of the GameObject being rendered.
         *
         * @name Phaser.Renderer.WebGL.RenderNodes.TexturerTileSprite#frame
         * @type {Phaser.Textures.Frame}
         * @since 4.0.0
         */
        this.frame = null;

        /**
         * The matrix used internally to compute UV coordinates.
         *
         * @name Phaser.Renderer.WebGL.RenderNodes.TexturerTileSprite#uvMatrix
         * @type {Phaser.GameObjects.Components.TransformMatrix}
         * @since 4.0.0
         */
        this.uvMatrix = new TransformMatrix();
    },

    /**
     * Populates this RenderNode with texture data for the given TileSprite
     * GameObject. Stores the frame and computes the UV transformation matrix
     * by applying the tile position, tile scale, and tile rotation in TSR order,
     * then mapping the result to the GameObject's display area. If the
     * GameObject is cropped, the crop UVs are updated first to account for any
     * flip state change. The stored values must be consumed before this node
     * is reused.
     *
     * @method Phaser.Renderer.WebGL.RenderNodes.TexturerTileSprite#run
     * @since 4.0.0
     * @param {Phaser.Renderer.WebGL.DrawingContext} drawingContext - The current drawing context.
     * @param {Phaser.GameObjects.Image} gameObject - The GameObject being rendered.
     * @param {object} [element] - The specific element within the game object. This is used for objects that consist of multiple quads. It is unused here.
     */
    run: function (drawingContext, gameObject, element)
    {
        this.onRunBegin(drawingContext);

        var frame = gameObject.frame;
        this.frame = frame;

        if (gameObject.isCropped)
        {
            var crop = gameObject._crop;

            if (crop.flipX !== gameObject.flipX || crop.flipY !== gameObject.flipY)
            {
                gameObject.frame.updateCropUVs(crop, gameObject.flipX, gameObject.flipY);
            }

            // TODO: Is there any other crop logic to consider?
        }

        // Compute UVs.

        this.uvMatrix.loadIdentity();

        // // Normalize coordinate space.
        this.uvMatrix.scale(1 / frame.width, 1 / frame.height);

        // Apply texture transformation in TSR order.
        // This is necessary to avoid skew.
        this.uvMatrix.translate(gameObject.tilePositionX, gameObject.tilePositionY);
        this.uvMatrix.scale(1 / gameObject.tileScaleX, 1 / gameObject.tileScaleY);
        this.uvMatrix.rotate(-gameObject.tileRotation);

        // Find where the GameObject area sits in normalized space.
        this.uvMatrix.setQuad(0, 0, gameObject.width, gameObject.height);

        this.onRunEnd(drawingContext);
    }
});

module.exports = TexturerTileSprite;
