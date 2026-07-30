/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../../../utils/Class');
var RenderNode = require('../RenderNode');

/**
 * @classdesc
 * A RenderNode which handles texturing for a single Image-like GameObject,
 * such as an Image or Sprite.
 *
 * During the WebGL rendering pipeline, this node is called to extract and
 * temporarily cache the texture data needed to render a GameObject: its frame
 * reference, UV source, and display dimensions. It accounts for cropped
 * GameObjects by switching to the crop's UV coordinates and adjusted
 * dimensions, and scales all dimensions by the frame source's resolution so
 * that the upstream batcher receives device-independent pixel values.
 *
 * Because this node may be reused across multiple GameObjects in a single
 * frame, callers must consume its stored values (via `frame`, `frameWidth`,
 * `frameHeight`, and `uvSource`) before the next `run` call overwrites them.
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
         * The display width of the frame in resolution-adjusted pixels.
         * This reflects the crop width when the GameObject is cropped, and is
         * divided by the frame source's resolution to produce
         * device-independent pixel values for the renderer.
         *
         * @name Phaser.Renderer.WebGL.RenderNodes.TexturerImage#frameWidth
         * @type {number}
         * @since 4.0.0
         */
        this.frameWidth = 0;

        /**
         * The display height of the frame in resolution-adjusted pixels.
         * This reflects the crop height when the GameObject is cropped, and is
         * divided by the frame source's resolution to produce
         * device-independent pixel values for the renderer.
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
     * Populates this RenderNode with the texture data required to render the
     * given Image-like GameObject.
     *
     * This method resolves the correct UV source for the GameObject: if it is
     * not cropped, the frame itself is used; if it is cropped, the crop object
     * is used and its UVs are recalculated when the flip state has changed.
     * Frame dimensions are set to the crop dimensions when cropped. In both
     * cases, the resulting dimensions are divided by the frame source's
     * resolution to produce device-independent pixel values.
     *
     * The stored values (`frame`, `frameWidth`, `frameHeight`, `uvSource`)
     * must be consumed before this node is run again, as they will be
     * overwritten on the next call.
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
