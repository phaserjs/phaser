/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var CONST = require('../../const');

/**
 * Renders this Game Object with the WebGL Renderer to the given Camera.
 * The object will not render if any of its renderFlags are set or it is being actively filtered out by the Camera.
 * This method should not be called directly. It is a utility function of the Render module.
 *
 * @method Phaser.GameObjects.Layer#renderWebGL
 * @since 3.50.0
 * @private
 *
 * @param {Phaser.Renderer.WebGL.WebGLRenderer} renderer - A reference to the current active WebGL renderer.
 * @param {Phaser.GameObjects.Layer} layer - The Game Object being rendered in this call.
 * @param {Phaser.Renderer.WebGL.DrawingContext} drawingContext - The current drawing context.
 * @param {Phaser.GameObjects.Components.TransformMatrix} parentMatrix - This transform matrix is defined if the game object is nested
 * @param {number} renderStep - The index of this function in the Game Object's list of render processes. Used to support multiple rendering functions.
 * * @param {Phaser.GameObjects.GameObject[]} displayList - The display list which is currently being rendered.
 * @param {number} displayListIndex - The index of the Game Object within the display list.
 */
var LayerWebGLRenderer = function (renderer, layer, drawingContext, parentMatrix, renderStep, displayList, displayListIndex)
{
    var children = layer.list;
    var childCount = children.length;

    if (childCount === 0)
    {
        return;
    }

    var currentContext = drawingContext;
    var camera = currentContext.camera;

    layer.depthSort();

    var layerHasBlendMode = (layer.blendMode !== CONST.BlendModes.SKIP_CHECK);

    if (!layerHasBlendMode && currentContext.blendMode !== 0)
    {
        //  If Layer is SKIP_TEST then set blend mode to be Normal
        currentContext = currentContext.getClone();
        currentContext.setBlendMode(0);
        currentContext.use();
    }

    var alpha = layer.alpha;

    for (var i = 0; i < childCount; i++)
    {
        var child = children[i];

        if (!child.willRender(camera))
        {
            continue;
        }

        var childAlphaTopLeft;
        var childAlphaTopRight;
        var childAlphaBottomLeft;
        var childAlphaBottomRight;

        if (child.alphaTopLeft !== undefined)
        {
            childAlphaTopLeft = child.alphaTopLeft;
            childAlphaTopRight = child.alphaTopRight;
            childAlphaBottomLeft = child.alphaBottomLeft;
            childAlphaBottomRight = child.alphaBottomRight;
        }
        else
        {
            var childAlpha = child.alpha;

            childAlphaTopLeft = childAlpha;
            childAlphaTopRight = childAlpha;
            childAlphaBottomLeft = childAlpha;
            childAlphaBottomRight = childAlpha;
        }

        if (
            !layerHasBlendMode &&
            child.blendMode !== currentContext.blendMode &&
            child.blendMode !== CONST.BlendModes.SKIP_CHECK
        )
        {
            //  If Layer doesn't have its own blend mode, then a child can have one
            currentContext = currentContext.getClone();
            currentContext.setBlendMode(child.blendMode);
            currentContext.use();
        }

        child.setAlpha(childAlphaTopLeft * alpha, childAlphaTopRight * alpha, childAlphaBottomLeft * alpha, childAlphaBottomRight * alpha);

        //  Render
        child.renderWebGLStep(renderer, child, currentContext, undefined, undefined, children, i);

        //  Restore original values
        child.setAlpha(childAlphaTopLeft, childAlphaTopRight, childAlphaBottomLeft, childAlphaBottomRight);
    }

    // Release any remaining context.
    if (currentContext !== drawingContext)
    {
        currentContext.release();
    }
};

module.exports = LayerWebGLRenderer;
