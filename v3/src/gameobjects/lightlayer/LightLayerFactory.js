var LightLayer = require('./LightLayer');

var LightLayerFactory = function (scene)
{
    return new LightLayer(scene);
};

module.exports = LightLayerFactory;
