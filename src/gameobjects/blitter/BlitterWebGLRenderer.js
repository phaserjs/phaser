/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var TransformMatrix = require('../components/TransformMatrix');
var Utils = require('../../renderer/webgl/Utils');

var tempMatrix = new TransformMatrix();
var tempTransformer = {
    quad: new Float32Array(8)
};
var tempTexturer = {};
var tempTinter = {};

/**
 * Renders this Game Object with the WebGL Renderer to the given Camera.
 * The object will not render if any of its renderFlags are set or it is being actively filtered out by the Camera.
 * This method should not be called directly. It is a utility function of the Render module.
 *
 * @method Phaser.GameObjects.Blitter#renderWebGL
 * @since 3.0.0
 * @private
 *
 * @param {Phaser.Renderer.WebGL.WebGLRenderer} renderer - A reference to the current active WebGL renderer.
 * @param {Phaser.GameObjects.Blitter} src - The Game Object being rendered in this call.
 * @param {Phaser.Renderer.WebGL.DrawingContext} drawingContext - The current drawing context.
 * @param {Phaser.GameObjects.Components.TransformMatrix} parentMatrix - This transform matrix is defined if the game object is nested
 */
var BlitterWebGLRenderer = function (renderer, src, drawingContext, parentMatrix)
{
    var list = src.getRenderList();
    var camera = drawingContext.camera;
    var alpha = src.alpha;

    if (list.length === 0 || alpha === 0)
    {
        //  Nothing to see, so abort early
        return;
    }

    camera.addToRenderList(src);

    var calcMatrix = tempMatrix.copyWithScrollFactorFrom(
        camera.getViewMatrix(!drawingContext.useCanvas),
        camera.scrollX, camera.scrollY,
        src.scrollFactorX, src.scrollFactorY
    );

    if (parentMatrix)
    {
        calcMatrix.multiply(parentMatrix);
    }

    var blitterX = src.x;
    var blitterY = src.y;

    var customRenderNodes = src.customRenderNodes;
    var defaultRenderNodes = src.defaultRenderNodes;

    for (var i = 0; i < list.length; i++)
    {
        var bob = list[i];
        var frame = bob.frame;
        var bobAlpha = bob.alpha * alpha;

        if (bobAlpha === 0)
        {
            continue;
        }

        var width = frame.width;
        var height = frame.height;

        var x = blitterX + bob.x + frame.x;
        var y = blitterY + bob.y + frame.y;

        if (bob.flipX)
        {
            width *= -1;
            x += frame.width;
        }

        if (bob.flipY)
        {
            height *= -1;
            y += frame.height;
        }

        calcMatrix.setQuad(x, y, x + width, y + height, tempTransformer.quad);

        tempTexturer.frame = frame;
        tempTexturer.uvSource = frame;

        var tint = Utils.getTintAppendFloatAlpha(bob.tint, bobAlpha);

        tempTinter.tintTopLeft = tint;
        tempTinter.tintBottomLeft = tint;
        tempTinter.tintTopRight = tint;
        tempTinter.tintBottomRight = tint;

        (customRenderNodes.Submitter || defaultRenderNodes.Submitter).run(
            drawingContext,
            src,
            parentMatrix,
            0,
            tempTexturer,
            tempTransformer,
            tempTinter,

            // Optional normal map parameters.
            undefined,
            0
        );
    }
};

module.exports = BlitterWebGLRenderer;
