/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2024 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var TransformMatrix = require('../../../../gameobjects/components/TransformMatrix');
var Class = require('../../../../utils/Class');
var Merge = require('../../../../utils/object/Merge');
var RenderNode = require('../RenderNode');

/**
 * @classdesc
 * A RenderNode which handles texturing for a single TileSprite GameObject.
 *
 * This node stores values relevant to texturing, such as UVs and frame data.
 * These values should be read off before the node is reused.
 *
 * @class TexturerTileSprite
 * @memberof Phaser.Renderer.WebGL.RenderNodes
 * @constructor
 * @since 3.90.0
 * @extends Phaser.Renderer.WebGL.RenderNodes.RenderNode
 * @param {Phaser.Renderer.WebGL.RenderNodes.RenderNodeManager} manager - The manager that owns this RenderNode.
 * @param {object} [config] - The configuration object for this RenderNode.
 * @param {string} [config.name='TexturerTileSprite'] - The name of this RenderNode.
 * @param {string} [config.role='Texturer'] - The expected role of this RenderNode.
 */
var TexturerTileSprite = new Class({
    Extends: RenderNode,

    initialize: function TexturerTileSprite (manager, config)
    {
        config = Merge(config || {}, this.defaultConfig);

        RenderNode.call(this, config.name, manager);

        /**
         * The frame data of the GameObject being rendered.
         *
         * @name Phaser.Renderer.WebGL.RenderNodes.TexturerTileSprite#frame
         * @type {Phaser.Textures.Frame}
         * @since 3.90.0
         */
        this.frame = null;

        /**
         * The matrix used internally to compute UV coordinates.
         *
         * @name Phaser.Renderer.WebGL.RenderNodes.TexturerTileSprite#uvMatrix
         * @type {Phaser.GameObjects.Components.TransformMatrix}
         * @since 3.90.0
         */
        this.uvMatrix = new TransformMatrix();
    },

    /**
     * The default configuration for this RenderNode.
     *
     * @name Phaser.Renderer.WebGL.RenderNodes.TexturerTileSprite#defaultConfig
     * @type {object}
     * @since 3.90.0
     */
    defaultConfig: {
        name: 'TexturerTileSprite',
        role: 'Texturer'
    },

    /**
     * Set this RenderNode to temporarily store the texture data for the given
     * GameObject. Ensure that it is used before the node is reused.
     *
     * @method Phaser.Renderer.WebGL.RenderNodes.TexturerTileSprite#run
     * @since 3.90.0
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
