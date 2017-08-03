var LightLayer = require('./LightLayer');
var GetAdvancedValue = require('../../utils/object/GetAdvancedValue');
var BuildGameObject = require('../BuildGameObject');

var LightLayerCreator = function (scene, config)
{
    var pass = new LightLayer(scene);

    BuildGameObject(scene, pass, config);

    return pass;
};

module.exports = LightLayerCreator;
