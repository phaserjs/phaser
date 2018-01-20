var GameObject = require('../GameObject');

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
