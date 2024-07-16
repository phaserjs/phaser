/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2024 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../../utils/Class');
var Merge = require('../../../utils/object/Merge');
var Utils = require('../Utils.js');
var RenderNode = require('./RenderNode');

var getTint = Utils.getTintAppendFloatAlpha;

/**
 * @classdesc
 * This RenderNode 'bakes' the rendering data for an ImageGPULayer object.
 * This stores the vertex data in a GPU buffer.
 * The data can then be rendered by the SubmitterImageGPULayer RenderNode.
 *
 * @class BakeImageGPULayer
 * @extends Phaser.Renderer.WebGL.RenderNodes.RenderNode
 * @memberof Phaser.Renderer.WebGL.RenderNodes
 * @constructor
 * @since 3.90.0
 * @param {Phaser.Renderer.WebGL.RenderNodes.RenderNodeManager} manager - The manager that owns this RenderNode.
 * @param {object} [config] - The configuration object for this handler.
 * @param {string} [config.name='BakeImageGPULayer'] - The name of this RenderNode.
 */
var BakeImageGPULayer = new Class({
    Extends: RenderNode,

    initialize: function BakeImageGPULayer (manager, config)
    {
        var finalConfig = Merge(config || {}, this.defaultConfig);

        RenderNode.call(this, finalConfig.name, manager);
    },

    /**
     * The default configuration settings for this RenderNode.
     *
     * @name Phaser.Renderer.WebGL.RenderNodes.BakeImageGPULayer#defaultConfig
     * @type {object}
     * @since 3.90.0
     * @readonly
     */
    defaultConfig: {
        name: 'BakeImageGPULayer'
    },

    /**
     * Bakes the rendering data for the given ImageGPULayer object.
     * This should not be called frequently, as it is expensive
     * and triggers a GPU buffer update.
     *
     * If the buffer is not the correct size, it will be resized,
     * erasing all data currently in the buffer.
     *
     * @method Phaser.Renderer.WebGL.RenderNodes.BakeImageGPULayer#run
     * @since 3.90.0
     * @param {Phaser.GameObjects.ImageGPULayer} gameObject - The ImageGPULayer object to bake.
     */
    run: function (gameObject)
    {
        var submitterNode =
            gameObject.customRenderNodes.Submitter ||
            gameObject.defaultRenderNodes.Submitter;
        
        var layout = submitterNode.instanceBufferLayout;
        var instanceBuffer = layout.buffer;

        // Determine whether the buffer needs to be resized.
        var count = gameObject.images.length;
        var stride = layout.layout.stride;
        var byteLength = count * stride;
        if (instanceBuffer.dataBuffer.byteLength !== byteLength)
        {
            instanceBuffer.resize(byteLength);
            layout.layout.count = count;
        }

        var viewF32 = instanceBuffer.viewF32;
        var viewU32 = instanceBuffer.viewU32;
        var instanceBufferOffset = 0;

        var images = gameObject.images;

        for (var i = 0; i < images.length; i++)
        {
            var image = images[i];

            var frame = image.frame;

            viewF32[instanceBufferOffset++] = image.x;
            viewF32[instanceBufferOffset++] = image.y;
            viewF32[instanceBufferOffset++] = image.rotation;
            viewF32[instanceBufferOffset++] = image.scaleX * frame.width;
            viewF32[instanceBufferOffset++] = image.scaleY * frame.height;
            viewF32[instanceBufferOffset++] = image.originX;
            viewF32[instanceBufferOffset++] = image.originY;
            viewF32[instanceBufferOffset++] = image.scrollFactorX;
            viewF32[instanceBufferOffset++] = image.scrollFactorY;

            viewF32[instanceBufferOffset++] = frame.u0;
            viewF32[instanceBufferOffset++] = frame.v0;
            viewF32[instanceBufferOffset++] = frame.u1;
            viewF32[instanceBufferOffset++] = frame.v1;

            viewF32[instanceBufferOffset++] = image.tintFill;
            viewF32[instanceBufferOffset++] = image.tintBlend;

            viewU32[instanceBufferOffset++] =
                getTint(image.tintBottomLeft, image.alphaBottomLeft);
            viewU32[instanceBufferOffset++] =
                getTint(image.tintTopLeft, image.alphaTopLeft);
            viewU32[instanceBufferOffset++] =
                getTint(image.tintBottomRight, image.alphaBottomRight);
            viewU32[instanceBufferOffset++] =
                getTint(image.tintTopRight, image.alphaTopRight);

            viewF32[instanceBufferOffset++] = image.alpha;
        }

        instanceBuffer.update();

        gameObject.needsUpdate = false;
    }
});

module.exports = BakeImageGPULayer;
