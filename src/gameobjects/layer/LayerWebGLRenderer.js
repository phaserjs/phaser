/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2013-2023 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

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
 * @param {Phaser.Cameras.Scene2D.Camera} camera - The Camera that is rendering the Game Object.
 */
var LayerWebGLRenderer = function (renderer, layer, camera)
{
    var children = layer.list;
    var childCount = children.length;

    if (childCount === 0)
    {
        return;
    }

    layer.depthSort();

    renderer.pipelines.preBatch(layer);

    var layerHasBlendMode = (layer.blendMode !== -1);

    if (!layerHasBlendMode)
    {
        //  If Layer is SKIP_TEST then set blend mode to be Normal
        renderer.setBlendMode(0);
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

        if (!layerHasBlendMode && child.blendMode !== renderer.currentBlendMode)
        {
            //  If Layer doesn't have its own blend mode, then a child can have one
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

        child.setAlpha(childAlphaTopLeft * alpha, childAlphaTopRight * alpha, childAlphaBottomLeft * alpha, childAlphaBottomRight * alpha);

        //  Render
        child.renderWebGL(renderer, child, camera);

        //  Restore original values
        child.setAlpha(childAlphaTopLeft, childAlphaTopRight, childAlphaBottomLeft, childAlphaBottomRight);

        if (mask)
        {
            mask.postRenderWebGL(renderer, camera);
        }

        renderer.newType = false;
    }

    renderer.pipelines.postBatch(layer);
};

module.exports = LayerWebGLRenderer;
