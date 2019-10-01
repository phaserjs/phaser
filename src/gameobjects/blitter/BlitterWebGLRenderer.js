/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Utils = require('../../renderer/webgl/Utils');

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
 * @param {number} interpolationPercentage - Reserved for future use and custom pipelines.
 * @param {Phaser.Cameras.Scene2D.Camera} camera - The Camera that is rendering the Game Object.
 * @param {Phaser.GameObjects.Components.TransformMatrix} parentMatrix - This transform matrix is defined if the game object is nested
 */
var BlitterWebGLRenderer = function (renderer, src, interpolationPercentage, camera, parentMatrix)
{
    var list = src.getRenderList();

    if (list.length === 0)
    {
        return;
    }

    var pipeline = this.pipeline;

    renderer.setPipeline(pipeline, src);

    var cameraScrollX = camera.scrollX * src.scrollFactorX;
    var cameraScrollY = camera.scrollY * src.scrollFactorY;

    var calcMatrix = pipeline._tempMatrix1;

    calcMatrix.copyFrom(camera.matrix);

    if (parentMatrix)
    {
        calcMatrix.multiplyWithOffset(parentMatrix, -cameraScrollX, -cameraScrollY);

        cameraScrollX = 0;
        cameraScrollY = 0;
    }

    var blitterX = src.x - cameraScrollX;
    var blitterY = src.y - cameraScrollY;
    var prevTextureSourceIndex = -1;
    var tintEffect = false;
    var alpha = camera.alpha * src.alpha;
    var roundPixels = camera.roundPixels;

    for (var index = 0; index < list.length; index++)
    {
        var bob = list[index];
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

        var xw = x + width;
        var yh = y + height;

        var tx0 = calcMatrix.getX(x, y);
        var ty0 = calcMatrix.getY(x, y);

        var tx1 = calcMatrix.getX(xw, yh);
        var ty1 = calcMatrix.getY(xw, yh);

        var tint = Utils.getTintAppendFloatAlpha(bob.tint, bobAlpha);

        //  Bind texture only if the Texture Source is different from before
        if (frame.sourceIndex !== prevTextureSourceIndex)
        {
            pipeline.setTexture2D(frame.glTexture, 0);

            prevTextureSourceIndex = frame.sourceIndex;
        }

        if (roundPixels)
        {
            tx0 = Math.round(tx0);
            ty0 = Math.round(ty0);

            tx1 = Math.round(tx1);
            ty1 = Math.round(ty1);
        }

        //  TL x/y, BL x/y, BR x/y, TR x/y
        if (pipeline.batchQuad(tx0, ty0, tx0, ty1, tx1, ty1, tx1, ty0, frame.u0, frame.v0, frame.u1, frame.v1, tint, tint, tint, tint, tintEffect, frame.glTexture, 0))
        {
            prevTextureSourceIndex = -1;
        }
    }
};

module.exports = BlitterWebGLRenderer;
