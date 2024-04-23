/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2024 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../../utils/Class');
var RenderNode = require('./RenderNode');

/**
 * @classdesc
 * A Batch Render Node.
 *
 * This is a base class used for other Batch Render Nodes.
 *
 * A batch is a collection of objects that can be drawn in a single call.
 * They must use the same vertex buffer format and the same shader.
 * This is very efficient for rendering many objects at once.
 *
 * Instead of being rendered immediately, batch primitives are accumulated
 * until the batch is drawn, known as a 'flush'. A flush is triggered
 * automatically in the following cases:
 *
 * - The batch is full. What this means is defined by the batch itself.
 *   It is usually the size of the vertex buffer,
 *   or the number of texture units.
 * - A DrawingContext is used or released. This might change the
 *   drawing area, the blend mode, or the target framebuffer.
 *   It also occurs at the end of the frame.
 * - A different thing must be drawn. This is either a Stand-Alone Render,
 *   or a different Batch RenderNode.
 *
 * Thus, the RenderNodeManager must track which Batch is currently being
 * used, so that it can be flushed when necessary.
 *
 * @class Batch
 * @memberof Phaser.Renderer.WebGL.RenderNodes
 * @extends Phaser.Renderer.WebGL.RenderNodes.RenderNode
 * @constructor
 * @since 3.90.0
 *
 * @param {Phaser.Renderer.WebGL.RenderNodes.RenderNodeManager} manager - The manager that owns this RenderNode.
 * @param {Phaser.Renderer.WebGL.WebGLRenderer} renderer - The renderer that owns this RenderNode.
 */
var Batch = new Class({
    Extends: RenderNode,

    initialize: function Batch (name, manager, renderer)
    {
        RenderNode.call(this, name, manager, renderer);
    },

    /**
     * Receive data to add to the current batch.
     *
     * This checks whether this Batch is the current batch handler
     * in the RenderNodeManager, and will trigger a flush and switch
     * if not.
     *
     * This method should be extended to handle the data specific to a subclass,
     * but those should always call `Batch.batch` to handle switching.
     *
     * @method Phaser.Renderer.WebGL.RenderNodes.Batch#batch
     * @since 3.90.0
     */
    batch: function ()
    {
        // TODO: Check if this is the current batch handler in the RenderNodeManager. Flush and switch if not.
    }
});

module.exports = Batch;
