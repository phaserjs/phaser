/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../../../utils/Class');
var RenderNode = require('../RenderNode');

/**
 * @classdesc
 * A RenderNode which handles texturing for a single Image-like GameObject.
 *
 * This node stores values relevant to texturing, such as UVs and frame data.
 * These values should be read off before the node is reused.
 *
 * @class TexturerImage
 * @memberof Phaser.Renderer.WebGL.RenderNodes
 * @constructor
 * @since 4.0.0
 * @extends Phaser.Renderer.WebGL.RenderNodes.RenderNode
 * @param {Phaser.Renderer.WebGL.RenderNodes.RenderNodeManager} manager - The manager that owns this RenderNode.
 */
var TexturerImage = new Class({
    Extends: RenderNode,

    initialize: function TexturerImage (manager)
    {
        RenderNode.call(this, 'TexturerImage', manager);

        /**
         * The frame data of the GameObject being rendered.
         *
         * @name Phaser.Renderer.WebGL.RenderNodes.TexturerImage#frame
         * @type {Phaser.Textures.Frame}
         * @since 4.0.0
         */
        this.frame = null;

        /**
         * The width of the frame.
         *
         * @name Phaser.Renderer.WebGL.RenderNodes.TexturerImage#frameWidth
         * @type {number}
         * @since 4.0.0
         */
        this.frameWidth = 0;

        /**
         * The height of the frame.
         *
         * @name Phaser.Renderer.WebGL.RenderNodes.TexturerImage#frameHeight
         * @type {number}
         * @since 4.0.0
         */
        this.frameHeight = 0;

        /**
         * The object where UV coordinates and frame coordinates are stored.
         * This is either a Frame or a Crop object.
         *
         * It should have the properties u0, v0, u1, v1, x, y.
         *
         * @name Phaser.Renderer.WebGL.RenderNodes.TexturerImage#uvSource
         * @type {Phaser.Textures.Frame|Phaser.GameObjects.Components.Crop}
         * @since 4.0.0
         */
        this.uvSource = null;
    },

    /**
     * Set this RenderNode to temporarily store the texture data for the given
     * GameObject. Ensure that it is used before the node is reused.
     *
     * @method Phaser.Renderer.WebGL.RenderNodes.TexturerImage#run
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

        this.frameWidth = frame.cutWidth;
        this.frameHeight = frame.cutHeight;

        this.uvSource = frame;
        if (gameObject.isCropped)
        {
            var crop = gameObject._crop;
            this.uvSource = crop;

            if (crop.flipX !== gameObject.flipX || crop.flipY !== gameObject.flipY)
            {
                gameObject.frame.updateCropUVs(crop, gameObject.flipX, gameObject.flipY);
            }

            // Modify the frame dimensions based on the crop.
            this.frameWidth = crop.width;
            this.frameHeight = crop.height;
        }

        var resolution = frame.source.resolution;
        this.frameWidth /= resolution;
        this.frameHeight /= resolution;

        this.onRunEnd(drawingContext);
    }
});

module.exports = TexturerImage;
