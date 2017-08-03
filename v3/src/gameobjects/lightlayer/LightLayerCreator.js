var LightLayer = require('./LightLayer');
var GetAdvancedValue = require('../../utils/object/GetAdvancedValue');
var BuildGameObject = require('../BuildGameObject');

var LightLayerCreator = function (scene, config)
{
    var x = GetAdvancedValue(config, 'x', 0);
    var y = GetAdvancedValue(config, 'y', 0);
    var width = GetAdvancedValue(config, 'width', 512);
    var height = GetAdvancedValue(config, 'height', 512);

    var pass = new LightLayer(scene, x, y, width, height);

    BuildGameObject(scene, pass, config);

    return pass;
};

module.exports = LightLayerCreator;
