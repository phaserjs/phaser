/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2024 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var EventEmitter = require('eventemitter3');
var Class = require('../../../utils/Class');
var Events = require('../../events');

var Camera = require('./Camera');
var FillCamera = require('./FillCamera');
var FillRect = require('./FillRect');
var GameObjectBatcher = require('./GameObjectBatcher');
var ListCompositor = require('./ListCompositor');
var QuadBatchHandler = require('./QuadBatchHandler');

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
    Extends: EventEmitter,

    initialize: function RenderNodeManager (renderer)
    {
        EventEmitter.call(this);

        /**
         * The renderer that owns this manager.
         *
         * @name Phaser.Renderer.WebGL.RenderNodes.RenderNodeManager#renderer
         * @type {Phaser.Renderer.WebGL.WebGLRenderer}
         * @since 3.90.0
         */
        this.renderer = renderer;

        var game = renderer.game;

        /**
         * The maximum number of texture units to use as choices in a batch.
         * Batches can bind several textures and select one of them per instance,
         * allowing for larger batches.
         * However, some mobile devices degrade performance when using multiple
         * texture units. So if the game config option `autoMobilePipeline` is
         * enabled and the device is not a desktop, this will be set to 1.
         * Otherwise, it will be set to the renderer's `maxTextures`.
         *
         * Some shaders may require more than one texture unit,
         * so the actual limit on texture units per batch is `maxTextures`.
         *
         * This value can be changed at runtime via `setMaxParallelTextureUnits`.
         *
         * @name Phaser.Renderer.WebGL.RenderNodes.RenderNodeManager#maxParallelTextureUnits
         * @type {number}
         * @since 3.90.0
         */
        this.maxParallelTextureUnits = (game.config.autoMobilePipeline && !game.device.os.desktop) ? 1 : renderer.maxTextures;
        
        /**
         * Nodes available for use. This is an internal object,
         * where the keys are the names of the nodes.
         *
         * Nodes are constructed when requested by `getNode`.
         * Custom nodes can be added via `addNode` or `addNodeConstructor`.
         *
         * @name Phaser.Renderer.WebGL.RenderNodes.RenderNodeManager#nodes
         * @type {object}
         * @since 3.90.0
         * @private
         */
        this._nodes = {};

        /**
         * Built-in nodes which can be constructed by name.
         * Use `getNode` to either return a constructed built-in node
         * from `_nodes`, or construct a new one if it does not exist.
         *
         * Use `addNodeConstructor` to add custom nodes
         * without constructing them.
         * Use `addNode` to add custom nodes that have already been constructed.
         *
         * @name Phaser.Renderer.WebGL.RenderNodes.RenderNodeManager#_nodeConstructors
         * @type {object}
         * @since 3.90.0
         * @private
         */
        this._nodeConstructors = {
            Camera: Camera,
            FillCamera: FillCamera,
            FillRect: FillRect,
            GameObjectBatcher: GameObjectBatcher,
            ImageQuadrangulateBatch: ImageQuadrangulateBatch,
            ListCompositor: ListCompositor,
            QuadBatchHandler: QuadBatchHandler
        };

        /**
         * The default node to use for game objects.
         *
         * By default, this is the GameObjectBatcher node.
         * It is specified as a string, so that the node is only constructed
         * when it is needed.
         *
         * @name Phaser.Renderer.WebGL.RenderNodes.RenderNodeManager#default
         * @type {string}
         * @since 3.90.0
         */
        this.default = GameObjectBatcher.name;

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
        if (this._nodes[name])
        {
            throw new Error('node ' + name + ' already exists.');
        }
        this._nodes[name] = node;

        // If a node is somehow added during a debug render pass,
        // ensure that it is also set to debug.
        if (this.debug)
        {
            node.setDebug(true);
        }
    },

    /**
     * Add a constructor for a node to the manager.
     * This will allow the node to be constructed when `getNode` is called.
     *
     * @method Phaser.Renderer.WebGL.RenderNodes.RenderNodeManager#addNodeConstructor
     * @since 3.90.0
     * @param {string} name - The name of the node.
     * @param {function} constructor - The constructor for the node.
     * @throws {Error} Will throw an error if the node constructor already exists.
     */
    addNodeConstructor: function (name, constructor)
    {
        if (this._nodeConstructors[name])
        {
            throw new Error('node constructor ' + name + ' already exists.');
        }
        this._nodeConstructors[name] = constructor;
    },

    /**
     * Get a node from the manager.
     *
     * If the node does not exist, and a constructor is available,
     * it will be constructed and added to the manager,
     * then returned.
     *
     * @method Phaser.Renderer.WebGL.RenderNodes.RenderNodeManager#getNode
     * @since 3.90.0
     * @param {string} name - The name of the node.
     * @return {?Phaser.Renderer.WebGL.RenderNodes.RenderNode} The node, or null if it does not exist.
     */
    getNode: function (name)
    {
        if (this._nodes[name])
        {
            return this._nodes[name];
        }
        if (this._nodeConstructors[name])
        {
            var node = new this._nodeConstructors[name](this, this.renderer);
            this.addNode(name, node);
            return node;
        }
        return null;
    },

    /**
     * Check if a node exists in the manager.
     *
     * If a node is not constructed, but a constructor is available,
     * it will be considered to exist. Set `constructed` to true to
     * require that the node has already been constructed.
     *
     * @method Phaser.Renderer.WebGL.RenderNodes.RenderNodeManager#hasNode
     * @since 3.90.0
     * @param {string} name - The name of the node.
     * @param {boolean} [constructed=false] - Whether the node must be constructed to be considered to exist.
     * @return {boolean} Whether the node exists.
     */
    hasNode: function (name, constructed)
    {
        return !!this._nodes[name] || (!constructed && !!this._nodeConstructors[name]);
    },

    /**
     * Set the current batch node. If a batch node is already in progress,
     * it will be completed before the new node is set.
     *
     * @method Phaser.Renderer.WebGL.RenderNodes.RenderNodeManager#setCurrentBatchNode
     * @since 3.90.0
     * @param {?Phaser.Renderer.WebGL.RenderNodes.Batch} node - The node to set, or null to clear the current node.
     * @param {Phaser.Renderer.WebGL.DrawingContext} [drawingContext] - The drawing context. Only used if `node` is defined.
     */
    setCurrentBatchNode: function (node, drawingContext)
    {
        if (this.currentBatchNode !== node)
        {
            if (this.currentBatchNode !== null)
            {
                this.currentBatchNode.run(
                    this.currentBatchDrawingContext
                );
            }

            this.currentBatchNode = node;

            this.currentBatchDrawingContext = node ? drawingContext : null;
        }
    },

    /**
     * Set `maxParallelTextureUnits` to a new value.
     * This will be clamped to the range [1, renderer.maxTextures].
     *
     * This can be useful for providing the user with a way to adjust the
     * performance of the game at runtime.
     *
     * @method Phaser.Renderer.WebGL.RenderNodes.RenderNodeManager#setMaxParallelTextureUnits
     * @since 3.90.0
     * @param {number} [value] - The new value for `maxParallelTextureUnits`. If not provided, it will be set to the renderer's `maxTextures`.
     * @fires Phaser.Renderer.Events#SET_PARALLEL_TEXTURE_UNITS
     */
    setMaxParallelTextureUnits: function (value)
    {
        this.maxParallelTextureUnits = Math.max(1, Math.min(value, this.renderer.maxTextures));

        this.emit(Events.SET_PARALLEL_TEXTURE_UNITS, this.maxParallelTextureUnits);
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

        for (var key in this._nodes)
        {
            this._nodes[key].setDebug(value);
        }

        if (value)
        {
            this.debugGraph = null;
            this.currentDebugNode = null;

            // Insert a synthetic root node.
            this.pushDebug('[Render Tree Root]');

            this.renderer.once(
                Events.POST_RENDER,
                function ()
                {
                    this.setDebug(false);
                },
                this
            );
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
