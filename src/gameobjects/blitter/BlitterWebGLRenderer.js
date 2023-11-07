/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2013-2023 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var TransformMatrix = require('../components/TransformMatrix');
var Utils = require('../../renderer/webgl/Utils');

var tempMatrix = new TransformMatrix();

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
 * @param {Phaser.Cameras.Scene2D.Camera} camera - The Camera that is rendering the Game Object.
 * @param {Phaser.GameObjects.Components.TransformMatrix} parentMatrix - This transform matrix is defined if the game object is nested
 */
var BlitterWebGLRenderer = function (renderer, src, camera, parentMatrix)
{
    var list = src.getRenderList();
    var alpha = camera.alpha * src.alpha;

    if (list.length === 0 || alpha === 0)
    {
        //  Nothing to see, so abort early
        return;
    }

    camera.addToRenderList(src);

    var pipeline = renderer.pipelines.set(this.pipeline, src);

    var cameraScrollX = camera.scrollX * src.scrollFactorX;
    var cameraScrollY = camera.scrollY * src.scrollFactorY;

    var calcMatrix = tempMatrix.copyFrom(camera.matrix);

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

    renderer.pipelines.preBatch(src);

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

        var quad = calcMatrix.setQuad(x, y, x + width, y + height);

        var tint = Utils.getTintAppendFloatAlpha(bob.tint, bobAlpha);

        //  Bind texture only if the Texture Source is different from before
        if (frame.sourceIndex !== prevTextureSourceIndex)
        {
            var textureUnit = pipeline.setGameObject(src, frame);

            prevTextureSourceIndex = frame.sourceIndex;
        }

        if (pipeline.batchQuad(src, quad[0], quad[1], quad[2], quad[3], quad[4], quad[5], quad[6], quad[7], frame.u0, frame.v0, frame.u1, frame.v1, tint, tint, tint, tint, tintEffect, frame.glTexture, textureUnit))
        {
            prevTextureSourceIndex = -1;
        }
    }

    renderer.pipelines.postBatch(src);
};

module.exports = BlitterWebGLRenderer;
