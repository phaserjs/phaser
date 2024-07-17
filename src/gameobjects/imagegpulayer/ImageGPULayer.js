/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2024 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../utils/Class');
var SubmitterImageGPULayer = require('../../renderer/webgl/renderNodes/submitter/SubmitterImageGPULayer');
var Components = require('../components');
var GameObject = require('../GameObject');
var ImageGPULayerMember = require('./ImageGPULayerMember');
var ImageGPULayerRender = require('./ImageGPULayerRender');

/**
 * @classdesc
 * An ImageGPULayer GameObject. This is a WebGL only GameObject.
 *
 * An ImageGPULayer is a composite object that contains a collection of
 * ImageGPULayerMember objects. It stores the rendering data for these
 * objects in a GPU buffer, and renders them in a single draw call.
 * Because it only updates the GPU buffer when necessary, it is more
 * efficient than rendering the objects individually.
 * Avoid changing the contents of the ImageGPULayer frequently, as this
 * requires the whole buffer to be updated.
 *
 * @class ImageGPULayer
 * @extends Phaser.GameObjects.GameObject
 * @memberof Phaser.GameObjects
 * @webglOnly
 *
 * @extends Phaser.GameObjects.Components.Alpha
 * @extends Phaser.GameObjects.Components.BlendMode
 * @extends Phaser.GameObjects.Components.Lighting
 * @extends Phaser.GameObjects.Components.Mask
 * @extends Phaser.GameObjects.Components.PostPipeline
 * @extends Phaser.GameObjects.Components.RenderNode
 * @extends Phaser.GameObjects.Components.TextureCrop
 * @extends Phaser.GameObjects.Components.Visible
 *
 * @constructor
 * @since 3.90.0
 * @param {Phaser.Scene} scene - The Scene to which this ImageGPULayer belongs.
 * @param {Phaser.Textures.Texture} texture - The texture that will be used to render the ImageGPULayer.
 */
var ImageGPULayer = new Class({
    Extends: GameObject,

    Mixins: [
        Components.Alpha,
        Components.BlendMode,
        Components.Lighting,
        Components.Mask,
        Components.PostPipeline,
        Components.RenderNode,
        Components.TextureCrop,
        Components.Visible,
        ImageGPULayerRender
    ],

    initialize: function ImageGPULayer (scene, texture)
    {
        GameObject.call(this, scene, 'ImageGPULayer');

        /**
         * An array of all objects that are being rendered by this layer.
         *
         * @name Phaser.GameObjects.ImageGPULayer#images
         * @type {Phaser.GameObjects.ImageGPULayerMember[]}
         * @since 3.90.0
         */
        this.images = [];

        /**
         * Whether the GPU buffer needs to be updated.
         * The update will occur on the next render.
         *
         * @name Phaser.GameObjects.ImageGPULayer#needsUpdate
         * @type {boolean}
         * @since 3.90.0
         */
        this.needsUpdate = false;

        /**
         * The time elapsed since timer initialization.
         * This drives the animation of the ImageGPULayer.
         *
         * @name Phaser.GameObjects.ImageGPULayer#timeElapsed
         * @type {number}
         * @since 3.90.0
         */
        this.timeElapsed = 0;

        /**
         * Whether the ImageGPULayer is paused.
         *
         * @name Phaser.GameObjects.ImageGPULayer#timePaused
         * @type {boolean}
         * @since 3.90.0
         * @default false
         */
        this.timePaused = false;

        this.setTexture(texture);
        this.initRenderNodes('ImageGPULayer');
        this.initPostPipeline(true);

        /**
         * The SubmitterImageGPULayer RenderNode for this ImageGPULayer.
         *
         * This handles rendering the ImageGPULayer to the GPU.
         * It is created automatically when the ImageGPULayer is initialized.
         * Most RenderNodes are singletons stored in the RenderNodeManager,
         * but because this one holds very specific data,
         * it is stored in the ImageGPULayer itself.
         *
         * @name Phaser.GameObjects.ImageGPULayer#submitterNode
         * @type {Phaser.Renderer.WebGL.RenderNodes.SubmitterImageGPULayer}
         * @since 3.90.0
         */
        this.submitterNode = new SubmitterImageGPULayer(scene.renderer.renderNodes, {}, this);

        this.defaultRenderNodes['Submitter'] = this.submitterNode;
        this.renderNodeData[this.submitterNode.name] = {};
    },

    //  Overrides Game Object method
    addedToScene: function ()
    {
        this.scene.sys.updateList.add(this);
    },

    //  Overrides Game Object method
    removedFromScene: function ()
    {
        this.scene.sys.updateList.remove(this);
    },

    preUpdate: function (time, delta)
    {
        if (!this.timePaused)
        {
            this.timeElapsed += delta;
        }
    },

    /**
     * Adds an ImageGPULayerMember to this ImageGPULayer.
     *
     * @method Phaser.GameObjects.ImageGPULayer#addImage
     * @since 3.90.0
     * @param {string|Phaser.Textures.Frame} frame - The frame to use. This must be a frame of the texture used by the ImageGPULayer.
     * @param {number} x - The horizontal position of the ImageGPULayerMember.
     * @param {number} y - The vertical position of the ImageGPULayerMember.
     * @return {Phaser.GameObjects.ImageGPULayerMember} The ImageGPULayerMember that was added.
     */
    addImage: function (frame, x, y)
    {
        if (typeof frame === 'string')
        {
            frame = this.texture.frames[frame];
        }

        if (!frame)
        {
            throw new Error('Frame not found');
        }

        this.needsUpdate = true;

        var image = new ImageGPULayerMember(this, frame, x, y);

        this.images.push(image);

        return image;
    },

    /**
     * Removes an ImageGPULayerMember from this ImageGPULayer.
     *
     * @method Phaser.GameObjects.ImageGPULayer#removeImage
     * @since 3.90.0
     * @param {Phaser.GameObjects.ImageGPULayerMember} image - The ImageGPULayerMember to remove.
     */
    removeImage: function (image)
    {
        var index = this.images.indexOf(image);

        if (index !== -1)
        {
            this.needsUpdate = true;

            this.images.splice(index, 1);
        }
    },

    /**
     * Reset the animation timer for this ImageGPULayer.
     *
     * @method Phaser.GameObjects.ImageGPULayer#resetTimer
     * @since 3.90.0
     * @param {number} [ms=0] - The time to reset the timer to.
     */
    resetTimer: function (ms)
    {
        if (ms === undefined) { ms = 0; }
        this.timeElapsed = ms;
    }
});

module.exports = ImageGPULayer;
