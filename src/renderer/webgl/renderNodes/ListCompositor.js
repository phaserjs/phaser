/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2024 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var CONST = require('../../../const');
var Class = require('../../../utils/Class');
var RenderNode = require('./RenderNode');

/**
 * Render a list of Game Objects.
 *
 * @class ListCompositor
 * @memberof Phaser.Renderer.WebGL.RenderNodes
 * @constructor
 * @since 3.90.0
 * @extends Phaser.Renderer.WebGL.RenderNodes.RenderNode
 * @param {Phaser.Renderer.WebGL.RenderNodes.RenderNodeManager} manager - The manager that owns this RenderNode.
 * @param {Phaser.Renderer.WebGL.WebGLRenderer} renderer - The renderer that owns this RenderNode.
 */
var ListCompositor = new Class({
    Extends: RenderNode,

    initialize: function ListCompositor (manager, renderer)
    {
        RenderNode.call(this, 'ListCompositor', manager, renderer);
    },

    /**
     * Render each child in the display list.
     *
     * This steps through the list, treating each child as either
     * a Stand Alone Render (SAR) or a Standard Batch Render (SBR).
     * SARs are rendered immediately, while SBRs are accumulated
     * for rendering in a single batch. Any change in the nature of the batch
     * (e.g. a new blend mode) will cause the batch to be rendered as an SAR
     * and a new batch to be started.
     *
     * @method Phaser.Renderer.WebGL.RenderNodes.ListCompositor#render
     * @since 3.90.0
     * @param {Phaser.Renderer.WebGL.DrawingContext} currentContext - The context currently in use.
     * @param {Phaser.GameObjects.GameObject[]} children - The list of children to render.
     * @param {Phaser.Cameras.Scene2D.Camera} camera - Current Camera.
     * @param {Phaser.GameObjects.Components.TransformMatrix} [parentTransformMatrix] - This transform matrix is defined if the game object is nested
     */
    run: function (currentContext, children, camera, parentTransformMatrix)
    {
        // Accumulate any batch objects to be rendered.
        var batchObjects = [];
        var batchBlendMode = CONST.BlendModes.NORMAL;
        var batchTextures = [];

        // Render each child in the display list
        for (var i = 0; i < children.length; i++)
        {
            var child = children[i];

            var result = child.renderWebGL(this.renderer, currentContext, child, camera, parentTransformMatrix);

            if (result)
            {
                // A SBR was rendered, so add it to the batch.

                // The result can have various outcomes:
                // - Add to the current batch (1 batch: in = out).
                // - Flush the current batch and start a new one (2 batches: in and out).
                // - Render this entry as a SAR (3 batches: in, SAR, and out).

                // If the result has FX, render it as a SAR.

                // Check whether the batch should be flushed.
                // - Is the blend mode different?
                // - Have the textures reached the hardware limit?
                // - Is the batch full?

                // TODO: Implement batching

                // this.manager.nodes.Single.run(currentContext, result.gameObject, result.camera, result.parentMatrix);
                this.manager.nodes.Single.run(currentContext, result, camera.roundPixels);
            }
        }

        // If there are any batch objects, flush them now.
    }
});

module.exports = ListCompositor;
