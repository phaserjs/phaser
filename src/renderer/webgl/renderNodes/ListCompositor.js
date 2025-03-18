/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../../utils/Class');
var CONST = require('../../../const');
var RenderNode = require('./RenderNode');

/**
 * Render a list of Game Objects.
 *
 * @class ListCompositor
 * @memberof Phaser.Renderer.WebGL.RenderNodes
 * @constructor
 * @since 4.0.0
 * @extends Phaser.Renderer.WebGL.RenderNodes.RenderNode
 * @param {Phaser.Renderer.WebGL.RenderNodes.RenderNodeManager} manager - The manager that owns this RenderNode.
 */
var ListCompositor = new Class({
    Extends: RenderNode,

    initialize: function ListCompositor (manager)
    {
        RenderNode.call(this, 'ListCompositor', manager);
    },

    /**
     * Render each child in the display list.
     *
     * This allocates a new DisplayContext if a child's blend mode is different
     * from the previous child. This will start a new batch if one is in progress.
     *
     * @method Phaser.Renderer.WebGL.RenderNodes.ListCompositor#render
     * @since 4.0.0
     * @param {Phaser.Renderer.WebGL.DrawingContext} displayContext - The context currently in use.
     * @param {Phaser.GameObjects.GameObject[]} children - The list of children to render.
     * @param {Phaser.GameObjects.Components.TransformMatrix} [parentTransformMatrix] - This transform matrix is defined if the game object is nested
     * @param {number} [renderStep=0] - Which step of the rendering process is this? This is the index of the currently running function in a list of functions.
     */
    run: function (
        displayContext,
        children,
        parentTransformMatrix,
        renderStep
    )
    {
        this.onRunBegin(displayContext);

        var currentContext = displayContext;
        var baseBlendMode = displayContext.blendMode;
        var currentBlendMode = baseBlendMode;
        var renderer = this.manager.renderer;

        // Render each child in the display list
        for (var i = 0; i < children.length; i++)
        {
            var child = children[i];

            if (
                child.blendMode !== currentBlendMode &&
                child.blendMode !== CONST.BlendModes.SKIP_CHECK
            )
            {
                if (currentContext !== displayContext)
                {
                    // Only release non-base contexts.
                    currentContext.release();
                }

                currentBlendMode = child.blendMode;

                if (currentBlendMode === baseBlendMode)
                {
                    // Reset to the base context.
                    currentContext = displayContext;
                }
                else
                {
                    // Change blend mode.
                    currentContext = displayContext.getClone();
                    currentContext.setBlendMode(currentBlendMode);
                    currentContext.use();
                }
            }

            child.renderWebGLStep(renderer, child, currentContext, parentTransformMatrix, renderStep, children, i);
        }

        // Release any remaining context.
        if (currentContext !== displayContext)
        {
            currentContext.release();
        }

        this.onRunEnd(displayContext);
    }
});

module.exports = ListCompositor;
