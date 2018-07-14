/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var GameObject = require('../GameObject');
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
    if (GameObject.RENDER_MASK !== src.renderFlags || (src.cameraFilter > 0 && (src.cameraFilter & camera._id)))
    {
        return;
    }

    var pipeline = this.pipeline;

    renderer.setPipeline(pipeline, src);

    var cameraScrollX = camera.scrollX * src.scrollFactorX;
    var cameraScrollY = camera.scrollY * src.scrollFactorY;

    var matrix = pipeline._tempMatrix1;

    matrix.copyFrom(camera.matrix);

    if (parentMatrix)
    {
        matrix.multiplyWithOffset(parentMatrix, -cameraScrollX, -cameraScrollY);

        cameraScrollX = 0;
        cameraScrollY = 0;
    }

    var list = src.getRenderList();
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

        var tx0 = x * matrix.a + y * matrix.c + matrix.e;
        var ty0 = x * matrix.b + y * matrix.d + matrix.f;
        var tx1 = xw * matrix.a + yh * matrix.c + matrix.e;
        var ty1 = xw * matrix.b + yh * matrix.d + matrix.f;

        var tint = Utils.getTintAppendFloatAlpha(0xffffff, bobAlpha);

        //  Bind texture only if the Texture Source is different from before
        if (frame.sourceIndex !== prevTextureSourceIndex)
        {
            pipeline.setTexture2D(frame.glTexture, 0);

            prevTextureSourceIndex = frame.sourceIndex;
        }

        if (roundPixels)
        {
            tx0 |= 0;
            ty0 |= 0;

            tx1 |= 0;
            ty1 |= 0;
        }

        //  TL x/y, BL x/y, BR x/y, TR x/y
        if (pipeline.batchVertices(tx0, ty0, tx0, ty1, tx1, ty1, tx1, ty0, frame.u0, frame.v0, frame.u1, frame.v1, tint, tint, tint, tint, tintEffect))
        {
            prevTextureSourceIndex = -1;
        }
    }
};

module.exports = BlitterWebGLRenderer;
