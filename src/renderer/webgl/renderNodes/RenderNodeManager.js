/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2024 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../../utils/Class');
var BatchTexturedTintedRawQuads = require('./BatchTexturedTintedRawQuads');
var Camera = require('./Camera');
var GetQuadTransform = require('./GetQuadTransform');
var GetSBRQuadMatrices = require('./GetSBRQuadMatrices');
var ImageQuadrangulateBatch = require('./ImageQuadrangulateBatch');
var ListCompositor = require('./ListCompositor');

/**
 * @typedef {object} DebugGraphNode
 * @property {string} name - The name of the node.
 * @property {DebugGraphNode[]} children - The children of the node.
 * @property {DebugGraphNode} parent - The parent of the node.
 */

/**
 * Provides and manages the nodes in the rendering graph.
 *
 * @class RenderNodeManager
 * @memberof Phaser.Renderer.WebGL.RenderNodes
 * @constructor
 * @since 3.90.0
 * @param {Phaser.Renderer.WebGL.WebGLRenderer} renderer - The renderer that owns this manager.
 */
var RenderNodeManager = new Class({
    initialize: function RenderNodeManager (renderer)
    {
        /**
         * The renderer that owns this manager.
         *
         * @name Phaser.Renderer.WebGL.RenderNodes.RenderNodeManager#renderer
         * @type {Phaser.Renderer.WebGL.WebGLRenderer}
         * @since 3.90.0
         */
        this.renderer = renderer;
        
        /**
         * Nodes available for use.
         *
         * @name Phaser.Renderer.WebGL.RenderNodes.RenderNodeManager#steps
         * @type {object}
         * @since 3.90.0
         */
        this.nodes = {
            BatchTexturedTintedRawQuads: new BatchTexturedTintedRawQuads(this, renderer),
            Camera: new Camera(this, renderer),
            GetQuadTransform: new GetQuadTransform(this, renderer),
            GetSBRQuadMatrices: new GetSBRQuadMatrices(this, renderer),
            ImageQuadrangulateBatch: new ImageQuadrangulateBatch(this, renderer),
            ListCompositor: new ListCompositor(this, renderer),
        };

        /**
         * The RenderNode which is currently being filled.
         * This is stored so that it can be completed when another type of
         * render is run.
         *
         * @name Phaser.Renderer.WebGL.RenderNodes.RenderNodeManager#currentBatchNode
         * @type {?Phaser.Renderer.WebGL.RenderNodes.RenderNode}
         * @default null
         * @since 3.90.0
         */
        this.currentBatchNode = null;

        /**
         * The drawing context of the current batch.
         * This is stored here because the batch node is stateless.
         *
         * @name Phaser.Renderer.WebGL.RenderNodes.RenderNodeManager#currentBatchDrawingContext
         * @type {?Phaser.Renderer.WebGL.DrawingContext}
         * @default null
         * @since 3.90.0
         */
        this.currentBatchDrawingContext = null;

        /**
         * The camera of the current batch.
         * This is stored here because the batch node is stateless.
         *
         * @name Phaser.Renderer.WebGL.RenderNodes.RenderNodeManager#currentBatchCamera
         * @type {?Phaser.Cameras.Scene2D.Camera}
         * @default null
         * @since 3.90.0
         */
        this.currentBatchCamera = null;

        /**
         * Whether nodes should record their run method for debugging.
         * This should be set via `setDebug`.
         *
         * @name Phaser.Renderer.WebGL.RenderNodes.RenderNodeManager#debug
         * @type {boolean}
         * @since 3.90.0
         * @default false
         */
        this.debug = false;

        /**
         * The debug graph of nodes that have been run.
         * This is used when `debug` is enabled.
         *
         * @name Phaser.Renderer.WebGL.RenderNodes.RenderNodeManager#debugGraph
         * @type {?DebugGraphNode}
         */
        this.debugGraph = null;

        /**
         * The current node in the debug graph.
         * This is used when `debug` is enabled.
         *
         * @name Phaser.Renderer.WebGL.RenderNodes.RenderNodeManager#currentDebugNode
         * @type {?DebugGraphNode}
         * @default null
         */
        this.currentDebugNode = null;
    },

    /**
     * Add a node to the manager.
     *
     * @method Phaser.Renderer.WebGL.RenderNodes.RenderNodeManager#addStep
     * @since 3.90.0
     * @param {string} name - The name of the step.
     * @param {Phaser.Renderer.WebGL.RenderNodes.RenderNode} node - The node to add.
     * @throws {Error} Will throw an error if the node already exists.
     */
    addNode: function (name, node)
    {
        if (this.nodes[name])
        {
            throw new Error('node ' + name + ' already exists.');
        }
        this.nodes[name] = node;

        // If a node is somehow added during a debug render pass,
        // ensure that it is also set to debug.
        if (this.debug)
        {
            node.setDebug(true);
        }
    },

    /**
     * Set the current batch node. If a batch node is already in progress,
     * it will be completed before the new node is set.
     *
     * @method Phaser.Renderer.WebGL.RenderNodes.RenderNodeManager#setCurrentBatchNode
     * @since 3.90.0
     * @param {?Phaser.Renderer.WebGL.RenderNodes.Batch} node - The node to set, or null to clear the current node.
     * @param {Phaser.Renderer.WebGL.DrawingContext} [drawingContext] - The drawing context. Only used if `node` is defined.
     * @param {Phaser.Cameras.Scene2D.Camera} [camera] - The camera. Only used if `node` is defined.
     */
    setCurrentBatchNode: function (node, drawingContext, camera)
    {
        if (this.currentBatchNode !== node)
        {
            if (this.currentBatchNode !== null)
            {
                this.currentBatchNode.run(
                    this.currentBatchDrawingContext,
                    this.currentBatchCamera
                );
            }

            this.currentBatchNode = node;

            this.currentBatchDrawingContext = node ? drawingContext : null;
            this.currentBatchCamera = node ? camera : null;
        }
    },

    /**
     * Start a standalone render (SAR), which is not part of a batch.
     * This will trigger batch completion if a batch is in progress.
     *
     * @method Phaser.Renderer.WebGL.RenderNodes.RenderNodeManager#startStandAloneRender
     * @since 3.90.0
     */
    startStandAloneRender: function ()
    {
        this.setCurrentBatchNode(null);
    },

    /**
     * Set whether nodes should record their run method for debugging.
     * This will set the debug property on all nodes, reset the debug graph,
     * and record a single frame of the graph before disabling debug.
     *
     * @method Phaser.Renderer.WebGL.RenderNodes.RenderNodeManager#setDebug
     * @since 3.90.0
     * @param {boolean} value - Whether nodes should record their run method for debugging.
     */
    setDebug: function (value)
    {
        this.debug = value;

        for (var key in this.nodes)
        {
            this.nodes[key].setDebug(value);
        }

        if (value)
        {
            this.debugGraph = null;
            this.currentDebugNode = null;
        }
    },

    /**
     * Record a newly run RenderNode in the debug graph.
     *
     * @method Phaser.Renderer.WebGL.RenderNodes.RenderNodeManager#pushDebug
     * @since 3.90.0
     * @param {string} name - The name of the node.
     */
    pushDebug: function (name)
    {
        if (!this.debug)
        {
            return;
        }

        var node = {
            name: name,
            children: [],
            parent: this.currentDebugNode
        };

        if (this.debugGraph)
        {
            this.currentDebugNode.children.push(node);
        }
        else
        {
            this.debugGraph = node;
        }

        this.currentDebugNode = node;
    },

    /**
     * Pop the last recorded RenderNode from the debug graph.
     *
     * @method Phaser.Renderer.WebGL.RenderNodes.RenderNodeManager#popDebug
     * @since 3.90.0
     */
    popDebug: function ()
    {
        if (!this.debug)
        {
            return;
        }

        if (this.currentDebugNode.parent)
        {
            this.currentDebugNode = this.currentDebugNode.parent;
        }
        else
        {
            this.currentDebugNode = null;

            // Stop recording the graph.
            this.setDebug(false);
        }
    },

    /**
     * Format the current debug graph as an indented string.
     *
     * @method Phaser.Renderer.WebGL.RenderNodes.RenderNodeManager#debugToString
     * @since 3.90.0
     * @return {string} The formatted debug graph.
     */
    debugToString: function ()
    {
        var output = '';
        var indent = 0;
        var node = this.debugGraph;

        function indentString (indent)
        {
            return '  '.repeat(indent);
        }

        function formatNode (node, indent)
        {
            var str = indentString(indent) + node.name + '\n';

            for (var i = 0; i < node.children.length; i++)
            {
                str += formatNode(node.children[i], indent + 1);
            }

            return str;
        }

        output = formatNode(node, indent);

        return output;
    }
});

module.exports = RenderNodeManager;
