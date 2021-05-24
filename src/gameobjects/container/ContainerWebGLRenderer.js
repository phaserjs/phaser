/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @author       Felipe Alfonso <@bitnenfer>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

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
 * @param {Phaser.Cameras.Scene2D.Camera} camera - The Camera that is rendering the Game Object.
 * @param {Phaser.GameObjects.Components.TransformMatrix} parentMatrix - This transform matrix is defined if the game object is nested
 */
var ContainerWebGLRenderer = function (renderer, container, camera, parentMatrix)
{
    camera.addToRenderList(container);

    var children = container.list;
    var childCount = children.length;

    if (childCount === 0)
    {
        return;
    }

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

    renderer.pipelines.preBatch(container);

    var containerHasBlendMode = (container.blendMode !== -1);

    if (!containerHasBlendMode)
    {
        //  If Container is SKIP_TEST then set blend mode to be Normal
        renderer.setBlendMode(0);
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

        if (!containerHasBlendMode && child.blendMode !== renderer.currentBlendMode)
        {
            //  If Container doesn't have its own blend mode, then a child can have one
            renderer.setBlendMode(child.blendMode);
        }

        var mask = child.mask;

        if (mask)
        {
            mask.preRenderWebGL(renderer, child, camera);
        }

        var type = child.type;

        if (type !== renderer.currentType)
        {
            renderer.newType = true;
            renderer.currentType = type;
        }

        renderer.nextTypeMatch = (i < childCount - 1) ? (children[i + 1].type === renderer.currentType) : false;

        //  Set parent values
        child.setScrollFactor(childScrollFactorX * scrollFactorX, childScrollFactorY * scrollFactorY);

        child.setAlpha(childAlphaTopLeft * alpha, childAlphaTopRight * alpha, childAlphaBottomLeft * alpha, childAlphaBottomRight * alpha);

        //  Render
        child.renderWebGL(renderer, child, camera, transformMatrix);

        //  Restore original values

        child.setAlpha(childAlphaTopLeft, childAlphaTopRight, childAlphaBottomLeft, childAlphaBottomRight);

        child.setScrollFactor(childScrollFactorX, childScrollFactorY);

        if (mask)
        {
            mask.postRenderWebGL(renderer, camera);
        }

        renderer.newType = false;
    }

    renderer.pipelines.postBatch(container);
};

module.exports = ContainerWebGLRenderer;
