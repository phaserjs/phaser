/**
 * @author       Richard Davey <rich@phaser.io>
 * @author       Felipe Alfonso <@bitnenfer>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var CONST = require('../../const');

/**
 * Renders this Game Object with the WebGL Renderer to the given Camera.
 * The object will not render if any of its renderFlags are set or it is being actively filtered out by the Camera.
 * This method should not be called directly. It is a utility function of the Render module.
 *
 * @method Phaser.GameObjects.Container#renderWebGL
 * @since 3.4.0
 * @private
 *
 * @param {Phaser.Renderer.WebGL.WebGLRenderer} renderer - A reference to the current active WebGL renderer.
 * @param {Phaser.GameObjects.Container} container - The Game Object being rendered in this call.
 * @param {Phaser.Renderer.WebGL.DrawingContext} drawingContext - The current drawing context.
 * @param {Phaser.GameObjects.Components.TransformMatrix} parentMatrix - This transform matrix is defined if the game object is nested
 * @param {number} renderStep - The index of this function in the Game Object's list of render processes. Used to support multiple rendering functions.
 * @param {Phaser.GameObjects.GameObject[]} displayList - The display list which is currently being rendered.
 * @param {number} displayListIndex - The index of the Game Object within the display list.
 */
var ContainerWebGLRenderer = function (renderer, container, drawingContext, parentMatrix, renderStep, displayList, displayListIndex)
{
    var camera = drawingContext.camera;
    camera.addToRenderList(container);

    var children = container.list;
    var childCount = children.length;

    if (childCount === 0)
    {
        return;
    }

    var currentContext = drawingContext;

    var transformMatrix = container.localTransform;

    if (parentMatrix)
    {
        transformMatrix.loadIdentity();
        transformMatrix.multiply(parentMatrix);
        transformMatrix.translate(container.x, container.y);
        transformMatrix.rotate(container.rotation);
        transformMatrix.scale(container.scaleX, container.scaleY);
    }
    else
    {
        transformMatrix.applyITRS(container.x, container.y, container.rotation, container.scaleX, container.scaleY);
    }

    var containerHasBlendMode = (container.blendMode !== -1);

    if (!containerHasBlendMode && currentContext.blendMode !== 0)
    {
        //  If Container is SKIP_TEST then set blend mode to be Normal
        currentContext = currentContext.getClone();
        currentContext.setBlendMode(0);
        currentContext.use();
    }

    var alpha = container.alpha;

    var scrollFactorX = container.scrollFactorX;
    var scrollFactorY = container.scrollFactorY;

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

        var childScrollFactorX = child.scrollFactorX;
        var childScrollFactorY = child.scrollFactorY;

        if (
            !containerHasBlendMode &&
            child.blendMode !== currentContext.blendMode &&
            child.blendMode !== CONST.BlendModes.SKIP_CHECK
        )
        {
            //  If Container doesn't have its own blend mode, then a child can have one
            currentContext = currentContext.getClone();
            currentContext.setBlendMode(child.blendMode);
            currentContext.use();
        }

        //  Set parent values
        child.setScrollFactor(childScrollFactorX * scrollFactorX, childScrollFactorY * scrollFactorY);

        child.setAlpha(childAlphaTopLeft * alpha, childAlphaTopRight * alpha, childAlphaBottomLeft * alpha, childAlphaBottomRight * alpha);

        //  Render
        child.renderWebGLStep(renderer, child, currentContext, transformMatrix, undefined, children, i);

        //  Restore original values

        child.setAlpha(childAlphaTopLeft, childAlphaTopRight, childAlphaBottomLeft, childAlphaBottomRight);

        child.setScrollFactor(childScrollFactorX, childScrollFactorY);
    }

    // Release any remaining context.
    if (currentContext !== drawingContext)
    {
        currentContext.release();
    }
};

module.exports = ContainerWebGLRenderer;
