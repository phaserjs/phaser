/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2024 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../../utils/Class');

/**
 * A RenderNode is a node in the rendering graph.
 * It is invoked by calling `run`, which takes inputs and returns outputs
 * depending on the subclass implementation.
 *
 * @class RenderNode
 * @memberof Phaser.Renderer.WebGL.RenderNodes
 * @constructor
 * @since 3.90.0
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
         * @since 3.90.0
         */
        this.name = name;

        /**
         * The manager that owns this RenderNode.
         *
         * @name Phaser.Renderer.WebGL.RenderNodes.RenderNode#manager
         * @type {Phaser.Renderer.WebGL.RenderNodes.RenderNodeManager}
         * @since 3.90.0
         */
        this.manager = manager;

        /**
         * Reference to the original `run` method of this node.
         * Used when `setDebug` is enabled.
         *
         * @name Phaser.Renderer.WebGL.RenderNodes.RenderNode#_run
         * @type {?function}
         * @private
         * @since 3.90.0
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
     * @since 3.90.0
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
     * @since 3.90.0
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
     * @since 3.90.0
     * @param {Phaser.Renderer.WebGL.DrawingContext} drawingContext - The context currently in use.
     */
    onRunEnd: function (drawingContext)
    {},

    /**
     * Set whether the node should report debug information.
     * It wraps the `run` method with additional debug information.
     *
     * @method Phaser.Renderer.WebGL.RenderNodes.RenderNode#setDebug
     * @since 3.90.0
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
