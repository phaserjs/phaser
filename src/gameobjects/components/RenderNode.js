/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2024 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var DeepCopy = require('../../utils/object/DeepCopy');

/**
 * Provides methods for setting the WebGL render node of a Game Object.
 *
 * @namespace Phaser.GameObjects.Components.RenderNode
 * @webglOnly
 * @since 3.90.0
 */
var RenderNode = {

    /**
     * The initial WebGL render node of this Game Object.
     *
     * If you call `resetRenderNode` on this Game Object,
     * the render node is reset to this default.
     *
     * @name Phaser.GameObjects.Components.RenderNode#defaultRenderNode
     * @type {Phaser.Renderer.WebGL.RenderNodes.RenderNode}
     * @default null
     * @webglOnly
     * @since 3.90.0
     */
    defaultRenderNode: null,

    /**
     * The current WebGL render node of this Game Object.
     *
     * @name Phaser.GameObjects.Components.RenderNode#renderNode
     * @type {Phaser.Renderer.WebGL.RenderNodes.RenderNode}
     * @default null
     * @webglOnly
     * @since 3.90.0
     */
    renderNode: null,

    /**
     * An object to store render node specific data in, to be read by the render nodes this Game Object uses.
     *
     * @name Phaser.GameObjects.Components.RenderNode#renderNodeData
     * @type {object}
     * @webglOnly
     * @since 3.90.0
     */
    renderNodeData: null,

    /**
     * Sets the initial WebGL render node of this Game Object.
     *
     * This should only be called during the instantiation of the Game Object. After that, use `setRenderNode`.
     *
     * @method Phaser.GameObjects.Components.RenderNode#initRenderNode
     * @webglOnly
     * @since 3.90.0
     * @param {string|Phaser.Renderer.WebGL.RenderNodes.RenderNode} renderNode - The render node to set on this Game Object. Either a string, or a RenderNode instance.
     * @return {boolean} `true` if the render node was set successfully, otherwise `false`.
     */
    initRenderNode: function (renderNode)
    {
        this.pipelineData = {};

        var renderer = this.scene.sys.renderer;

        if (!renderer)
        {
            return false;
        }

        var manager = renderer.renderNodes;

        if (!manager)
        {
            return false;
        }

        if (typeof renderNode === 'string')
        {
            renderNode = manager.getNode(renderNode);
        }
        if (!renderNode)
        {
            renderNode = manager.getNode(manager.default);
        }
        if (!renderNode)
        {
            return false;
        }

        this.renderNode = renderNode;
        this.defaultRenderNode = renderNode;
        return true;
    },

    /**
     * Sets the WebGL render node of this Game Object.
     *
     * Also sets the render node data object, if specified.
     *
     * @method Phaser.GameObjects.Components.RenderNode#setRenderNode
     * @webglOnly
     * @since 3.90.0
     * @param {string|Phaser.Renderer.WebGL.RenderNodes.RenderNode} renderNode - The render node to set on this Game Object. Either a string, or a RenderNode instance.
     * @param {object} [renderNodeData] - An object to store render node specific data in, to be read by the render nodes this Game Object uses.
     * @param {boolean} [copyData=false] - Should the data be copied from the `renderNodeData` object?
     *
     * @return {this} This Game Object instance.
     */
    setRenderNode: function (renderNode, renderNodeData, copyData)
    {
        var renderer = this.scene.sys.renderer;

        if (!renderer)
        {
            return false;
        }

        var manager = renderer.renderNodes;

        if (!manager)
        {
            return false;
        }

        if (typeof renderNode === 'string')
        {
            renderNode = manager.getNode(renderNode);
        }
        if (!renderNode)
        {
            return false;
        }

        this.renderNode = renderNode;

        if (renderNodeData)
        {
            this.renderNodeData = copyData ? DeepCopy(renderNodeData) : renderNodeData;
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
     * @method Phaser.GameObjects.Components.RenderNode#setRenderNodeData
     * @webglOnly
     * @since 3.90.0
     * @param {string} key - The key of the property to set.
     * @param {*} value - The value to set the property to.
     * @return {this} This Game Object instance.
     */
    setRenderNodeData: function (key, value)
    {
        var data = this.renderNodeData;

        if (value === undefined)
        {
            delete data[key];
        }
        else
        {
            data[key] = value;
        }

        return this;
    },

    /**
     * Resets the WebGL render node of this Game Object to the default.
     *
     * @method Phaser.GameObjects.Components.RenderNode#resetRenderNode
     * @webglOnly
     * @since 3.90.0
     * @param {boolean} [resetData=false] - Should the render node data be reset to an empty object?
     * @return {boolean} Whether the render node was reset successfully.
     */
    resetRenderNode: function (resetData)
    {
        if (!resetData)
        {
            resetData = false;
        }

        this.renderNode = this.defaultRenderNode;

        if (resetData)
        {
            this.renderNodeData = {};
        }

        return this.renderNode !== null;
    }
};

module.exports = RenderNode;
