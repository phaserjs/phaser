var GameObject = require('../GameObject');

/**
 * Renders this Game Object with the Canvas Renderer to the given Camera.
 * The object will not render if any of its renderFlags are set or it is being actively filtered out by the Camera.
 * This method should not be called directly. It is a utility function of the Render module.
 *
 * @method Phaser.GameObjects.Blitter#renderCanvas
 * @since 3.0.0
 * @private
 *
 * @param {Phaser.Renderer.CanvasRenderer} renderer - A reference to the current active Canvas renderer.
 * @param {Phaser.GameObjects.Blitter} src - The Game Object being rendered in this call.
 * @param {number} interpolationPercentage - Reserved for future use and custom pipelines.
 * @param {Phaser.Cameras.Scene2D.Camera} camera - The Camera that is rendering the Game Object.
 */
var BlitterCanvasRenderer = function (renderer, src, interpolationPercentage, camera)
{
    if (GameObject.RENDER_MASK !== src.renderFlags || (src.cameraFilter > 0 && (src.cameraFilter & camera._id)))
    {
        return;
    }

    var list = src.getRenderList();

    renderer.setBlendMode(src.blendMode);

    var ca = renderer.currentAlpha;

    //  Render bobs
    for (var i = 0; i < list.length; i++)
    {
        var bob = list[i];

        if (ca !== bob.alpha)
        {
            ca = renderer.setAlpha(bob.alpha);
        }

        // var x = src.x + bob.x + frame.x - cameraScrollX + ((frame.width) * (bob.flipX ? 1 : 0));
        // var y = src.y + bob.y + frame.y - cameraScrollY + ((frame.height) * (bob.flipY ? 1 : 0));

        renderer.blitImage(src.x + bob.x, src.y + bob.y, bob.frame, camera);
    }
};

module.exports = BlitterCanvasRenderer;
