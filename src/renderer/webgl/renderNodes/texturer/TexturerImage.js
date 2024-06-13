/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2024 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../../../utils/Class');
var Merge = require('../../../../utils/object/Merge');
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
 * @since 3.90.0
 * @extends Phaser.Renderer.WebGL.RenderNodes.RenderNode
 * @param {Phaser.Renderer.WebGL.RenderNodes.RenderNodeManager} manager - The manager that owns this RenderNode.
 * @param {object} [config] - The configuration object for this RenderNode.
 * @param {string} [config.name='TexturerImage'] - The name of this RenderNode.
 * @param {string} [config.role='Texturer'] - The expected role of this RenderNode.
 */
var TexturerImage = new Class({
    Extends: RenderNode,

    initialize: function TexturerImage (manager, config)
    {
        config = Merge(config || {}, this.defaultConfig);

        RenderNode.call(this, config.name, manager);

        /**
         * The frame data of the GameObject being rendered.
         *
         * @name Phaser.Renderer.WebGL.RenderNodes.TexturerImage#frame
         * @type {Phaser.Textures.Frame}
         * @since 3.90.0
         */
        this.frame = null;

        /**
         * The width of the frame.
         *
         * @name Phaser.Renderer.WebGL.RenderNodes.TexturerImage#frameWidth
         * @type {number}
         * @since 3.90.0
         */
        this.frameWidth = 0;

        /**
         * The height of the frame.
         *
         * @name Phaser.Renderer.WebGL.RenderNodes.TexturerImage#frameHeight
         * @type {number}
         * @since 3.90.0
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
         * @since 3.90.0
         */
        this.uvSource = null;
    },

    /**
     * The default configuration for this RenderNode.
     *
     * @name Phaser.Renderer.WebGL.RenderNodes.TexturerImage#defaultConfig
     * @type {object}
     * @since 3.90.0
     */
    defaultConfig: {
        name: 'TexturerImage',
        role: 'Texturer'
    },

    /**
     * Set this RenderNode to temporarily store the texture data for the given
     * GameObject. Ensure that it is used before the node is reused.
     *
     * @method Phaser.Renderer.WebGL.RenderNodes.TexturerImage#run
     * @since 3.90.0
     * @param {Phaser.Renderer.WebGL.DrawingContext} drawingContext - The current drawing context.
     * @param {Phaser.GameObjects.Image} gameObject - The GameObject being rendered.
     */
    run: function (drawingContext, gameObject)
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

        this.onRunEnd(drawingContext);
    }
});

module.exports = TexturerImage;
