var GameObject = require('../GameObject');

var SpriteWebGLRenderer = function (renderer, src, interpolationPercentage, camera)
{
    if (GameObject.RENDER_MASK !== src.renderFlags || (src.cameraFilter > 0 && (src.cameraFilter & camera._id)))
    {
        return;
    }

    renderer.spriteRenderer.drawSprite(src, camera);
};

module.exports = SpriteWebGLRenderer;
