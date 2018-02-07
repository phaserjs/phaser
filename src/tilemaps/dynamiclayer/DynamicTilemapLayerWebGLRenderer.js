var GameObject = require('../../gameobjects/GameObject');

var DynamicTilemapLayerWebGLRenderer = function (renderer, tilemapLayer, interpolationPercentage, camera)
{
    if (GameObject.RENDER_MASK !== tilemapLayer.renderFlags || (tilemapLayer.cameraFilter > 0 && (tilemapLayer.cameraFilter & camera._id)))
    {
        return;
    }

    tilemapLayer.cull(camera);
    this.pipeline.batchDynamicTilemapLayer(tilemapLayer, camera); 
};

module.exports = DynamicTilemapLayerWebGLRenderer;
