/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var DeepCopy = require('../../utils/object/DeepCopy');

/**
 * Provides methods for setting the WebGL render nodes of a Game Object.
 *
 * @namespace Phaser.GameObjects.Components.RenderNodes
 * @webglOnly
 * @since 4.0.0
 */
var RenderNodes = {
    /**
     * Customized WebGL render nodes of this Game Object.
     * RenderNodes are responsible for managing the rendering process of this Game Object.
     * A default set of RenderNodes are coded into the engine,
     * but they will check here first to see if a custom one exists.
     *
     * @name Phaser.GameObjects.Components.RenderNodes#customRenderNodes
     * @type {object}
     * @webglOnly
     * @since 4.0.0
     */
    customRenderNodes: null,

    /**
     * The default RenderNodes for this Game Object.
     * RenderNodes are responsible for managing the rendering process of this Game Object.
     * These are the nodes that are used if no custom ones are set.
     *
     * RenderNodes are identified by a unique key for their role.
     *
     * Common role keys include:
     *
     * - 'Submitter': responsible for running other node roles for each element.
     * - 'Transformer': responsible for providing vertex coordinates for an element.
     * - 'Texturer': responsible for handling textures for an element.
     *
     * @name Phaser.GameObjects.Components.RenderNodes#defaultRenderNodes
     * @type {object}
     * @webglOnly
     * @since 4.0.0
     */
    defaultRenderNodes: null,

    /**
     * An object to store render node specific data in, to be read by the render nodes this Game Object uses.
     *
     * Render nodes store their data under their own name, not their role.
     *
     * @name Phaser.GameObjects.Components.RenderNodes#renderNodeData
     * @type {object}
     * @webglOnly
     * @since 4.0.0
     */
    renderNodeData: null,

    /**
     * Initializes the render nodes for this Game Object.
     *
     * This method is called when the Game Object is added to the Scene.
     * It is responsible for setting up the default render nodes
     * this Game Object will use.
     *
     * @method Phaser.GameObjects.Components.RenderNodes#initRenderNodes
     * @webglOnly
     * @since 4.0.0
     * @param {Map<string, string>} defaultNodes - The default render nodes to set for this Game Object.
     */
    initRenderNodes: function (defaultNodes)
    {
        this.customRenderNodes = {};
        this.defaultRenderNodes = {};
        this.renderNodeData = {};

        var renderer = this.scene.sys.renderer;

        if (!renderer)
        {
            return;
        }

        var manager = renderer.renderNodes;

        if (!(manager && defaultNodes))
        {
            return;
        }

        var defaultRenderNodes = this.defaultRenderNodes;
        defaultNodes.each(function (role, node)
        {
            defaultRenderNodes[role] = manager.getNode(node);
        });
    },

    /**
     * Sets the RenderNode for a given role.
     *
     * Also sets the relevant render node data object, if specified.
     *
     * If the node cannot be set, no changes are made.
     *
     * @method Phaser.GameObjects.Components.RenderNodes#setRenderNodeRole
     * @webglOnly
     * @since 4.0.0
     * @param {string} key - The key of the role to set the render node for.
     * @param {string|Phaser.Renderer.WebGL.RenderNodes.RenderNode|null} renderNode - The render node to set on this Game Object. Either a string, or a RenderNode instance. If `null`, the render node is removed, along with its data.
     * @param {object} [renderNodeData] - An object to store render node specific data in, to be read by the render nodes this Game Object uses.
     * @param {boolean} [copyData=false] - Should the data be copied from the `renderNodeData` object?
     * @return {this} This Game Object instance.
     */
    setRenderNodeRole: function (key, renderNode, renderNodeData, copyData)
    {
        var renderer = this.scene.sys.renderer;

        if (!renderer)
        {
            return this;
        }

        var manager = renderer.renderNodes;

        if (!manager)
        {
            return this;
        }

        if (renderNode !== null)
        {
            if (typeof renderNode === 'string')
            {
                renderNode = manager.getNode(renderNode);
            }
            if (!renderNode)
            {
                return this;
            }
            this.customRenderNodes[key] = renderNode;

            if (renderNodeData)
            {
                this.renderNodeData[renderNode.name] = copyData ? DeepCopy(renderNodeData) : renderNodeData;
            }
            else
            {
                this.renderNodeData[renderNode.name] = {};
            }
        }
        else
        {
            var node = this.customRenderNodes[key];
            if (node)
            {
                delete this.renderNodeData[node.name];
                delete this.customRenderNodes[key];
            }
        }

        return this;
    },

    /**
     * Adds an entry to the `renderNodeData` object of this game object.
     *
     * If `key` is not set, it is created. If it is set, it is updated.
     *
     * If `value` is undefined and `key` exists, the key is removed.
     *
     * @method Phaser.GameObjects.Components.RenderNodes#setRenderNodeData
     * @webglOnly
     * @since 4.0.0
     * @param {string|Phaser.Renderer.WebGL.RenderNodes.RenderNode} renderNode - The render node to set the data for. If a string, it should be the name of the render node.
     * @param {string} key - The key of the property to set.
     * @param {*} value - The value to set the property to.
     * @return {this} This Game Object instance.
     */
    setRenderNodeData: function (renderNode, key, value)
    {
        var name = renderNode;
        if (typeof renderNode !== 'string')
        {
            name = renderNode.name;
        }
        var data = this.renderNodeData[name];

        if (value === undefined)
        {
            delete data[key];
        }
        else
        {
            data[key] = value;
        }

        return this;
    }
};

module.exports = RenderNodes;
