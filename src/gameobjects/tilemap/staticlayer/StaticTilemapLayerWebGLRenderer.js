var GameObject = require('../../GameObject');

var StaticTilemapLayerWebGLRenderer = function (renderer, tilemap, interpolationPercentage, camera)
{
    if (GameObject.RENDER_MASK !== tilemap.renderFlags || (tilemap.cameraFilter > 0 && (tilemap.cameraFilter & camera._id)))
    {
        return;
    }

    tilemap.upload(camera);
    renderer.pipelines.TextureTintPipeline.drawStaticTilemapLayer(tilemap, camera);
};

module.exports = StaticTilemapLayerWebGLRenderer;
