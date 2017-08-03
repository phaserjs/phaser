var LightLayer = require('./LightLayer');

var LightLayerFactory = function (scene, x, y, width, height)
{
    return new LightLayer(scene, x, y, width, height);
};

module.exports = LightLayerFactory;
