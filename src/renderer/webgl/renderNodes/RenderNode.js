/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../../utils/Class');

/**
 * A RenderNode is the base class for all nodes in Phaser's WebGL rendering graph.
 * The rendering graph is a network of discrete, composable processing steps that
 * together produce the final rendered output. Each node encapsulates a specific
 * rendering task, such as batching geometry, applying a shader, or compositing
 * a texture.
 *
 * Nodes are managed by the `RenderNodeManager` and executed by calling `run`,
 * which accepts inputs and produces outputs specific to the subclass. You would
 * subclass `RenderNode` when creating a custom rendering pipeline step that needs
 * to integrate with Phaser's WebGL renderer.
 *
 * Subclasses must override the `run` method with their own implementation, and
 * should call `onRunBegin` and `onRunEnd` at the start and end of `run` to
 * support the lifecycle hook system.
 *
 * @class RenderNode
 * @memberof Phaser.Renderer.WebGL.RenderNodes
 * @constructor
 * @since 4.0.0
 * @param {string} name - The name of the RenderNode.
 * @param {Phaser.Renderer.WebGL.RenderNodes.RenderNodeManager} manager - The manager that owns this RenderNode.
 */
var RenderNode = new Class({

    initialize:

    function RenderNode (name, manager)
    {
        /**
         * The name of the RenderNode.
         *
         * @name Phaser.Renderer.WebGL.RenderNodes.RenderNode#name
         * @type {string}
         * @since 4.0.0
         */
        this.name = name;

        /**
         * The manager that owns this RenderNode.
         *
         * @name Phaser.Renderer.WebGL.RenderNodes.RenderNode#manager
         * @type {Phaser.Renderer.WebGL.RenderNodes.RenderNodeManager}
         * @since 4.0.0
         */
        this.manager = manager;

        /**
         * Reference to the original `run` method of this node.
         * Used when `setDebug` is enabled.
         *
         * @name Phaser.Renderer.WebGL.RenderNodes.RenderNode#_run
         * @type {?function}
         * @private
         * @since 4.0.0
         * @default null
         */
        this._run = null;
    },

    /**
     * Run the RenderNode.
     * This is a stub method that should be overridden by the specific
     * implementation.
     *
     * This method may be wrapped by `setDebug`.
     *
     * @method Phaser.Renderer.WebGL.RenderNodes.RenderNode#run
     * @param {...*} [args] - Arguments to pass to the node. These will vary depending on the node.
     * @since 4.0.0
     */
    run: function ()
    {
        // Insert code here.
    },

    /**
     * By default this is an empty method hook that you can override and use in your own custom render nodes.
     *
     * This method is called at the start of the `run` method.
     * Don't forget to call it in your custom method.
     *
     * @method Phaser.Renderer.WebGL.RenderNodes.RenderNode#onRunBegin
     * @since 4.0.0
     * @param {Phaser.Renderer.WebGL.DrawingContext} drawingContext - The context currently in use.
     */
    onRunBegin: function (drawingContext)
    {},

    /**
     * By default this is an empty method hook that you can override and use in your own custom render nodes.
     *
     * This method is called at the end of the `run` method.
     * Don't forget to call it in your custom method.
     *
     * @method Phaser.Renderer.WebGL.RenderNodes.RenderNode#onRunEnd
     * @since 4.0.0
     * @param {Phaser.Renderer.WebGL.DrawingContext} drawingContext - The context currently in use.
     */
    onRunEnd: function (drawingContext)
    {},

    /**
     * Enables or disables debug reporting for this node.
     *
     * When enabled, the `run` method is replaced with a wrapper that pushes
     * the node's name onto the manager's debug stack before execution and pops
     * it afterwards, allowing the renderer to track which nodes are active.
     * The original `run` implementation is preserved in `_run`.
     *
     * When disabled, the original `run` method is restored and `_run` is cleared.
     *
     * @method Phaser.Renderer.WebGL.RenderNodes.RenderNode#setDebug
     * @since 4.0.0
     * @param {boolean} debug - Whether to report debug information.
     */
    setDebug: function (debug)
    {
        if (debug)
        {
            this._run = this.run;

            this.run = function ()
            {
                var manager = this.manager;
                manager.pushDebug(this.name);

                var output = this._run.apply(this, arguments);

                manager.popDebug();

                return output;
            };
        }
        else
        {
            this.run = this._run;
            this._run = null;
        }
    }
});

module.exports = RenderNode;
