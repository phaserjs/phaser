/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @author       Felipe Alfonso <@bitnenfer>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * Renders this Game Object with the Canvas Renderer to the given Camera.
 * The object will not render if any of its renderFlags are set or it is being actively filtered out by the Camera.
 * This method should not be called directly. It is a utility function of the Render module.
 *
 * @method Phaser.GameObjects.Container#renderCanvas
 * @since 3.4.0
 * @private
 *
 * @param {Phaser.Renderer.Canvas.CanvasRenderer} renderer - A reference to the current active Canvas renderer.
 * @param {Phaser.GameObjects.Container} container - The Game Object being rendered in this call.
 * @param {number} interpolationPercentage - Reserved for future use and custom pipelines.
 * @param {Phaser.Cameras.Scene2D.Camera} camera - The Camera that is rendering the Game Object.
 * @param {Phaser.GameObjects.Components.TransformMatrix} parentMatrix - This transform matrix is defined if the game object is nested
 */
var ContainerCanvasRenderer = function (renderer, container, interpolationPercentage, camera, parentMatrix)
{
    var children = container.list;

    if (children.length === 0)
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

    var containerHasBlendMode = (container.blendMode !== -1);

    if (!containerHasBlendMode)
    {
        //  If Container is SKIP_TEST then set blend mode to be Normal
        renderer.setBlendMode(0);
    }

    var alpha = container._alpha;
    var scrollFactorX = container.scrollFactorX;
    var scrollFactorY = container.scrollFactorY;

    for (var i = 0; i < children.length; i++)
    {
        var child = children[i];

        if (!child.willRender(camera))
        {
            continue;
        }

        var childAlpha = child._alpha;
        var childBlendMode = child._blendMode;
        var childScrollFactorX = child.scrollFactorX;
        var childScrollFactorY = child.scrollFactorY;

        //  Set parent values
        child.setScrollFactor(childScrollFactorX * scrollFactorX, childScrollFactorY * scrollFactorY);
        child.setAlpha(childAlpha * alpha);

        if (containerHasBlendMode)
        {
            child.setBlendMode(container._blendMode);
        }

        //  Render
        child.renderCanvas(renderer, child, interpolationPercentage, camera, transformMatrix);

        //  Restore original values
        child.setAlpha(childAlpha);
        child.setScrollFactor(childScrollFactorX, childScrollFactorY);
        child.setBlendMode(childBlendMode);
    }
};

module.exports = ContainerCanvasRenderer;
