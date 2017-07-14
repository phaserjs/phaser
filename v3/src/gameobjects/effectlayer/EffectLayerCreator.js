var EffectLayer = require('./EffectLayer');
var GetAdvancedValue = require('../../utils/object/GetAdvancedValue');
var BuildGameObject = require('../BuildGameObject');

var EffectLayerCreator = function (scene, config)
{
    var x = GetAdvancedValue(config, 'x', 0);
    var y = GetAdvancedValue(config, 'y', 0);
    var width = GetAdvancedValue(config, 'width', 512);
    var height = GetAdvancedValue(config, 'height', 512);
    var key = GetAdvancedValue(config, 'key', null);
    var fragmentShader = GetAdvancedValue(config, 'fragmentShader', '');

    var layer = new EffectLayer(scene, x, y, width, height, effectName, fragmentShader);

    BuildGameObject(scene, layer, config);

    return layer;
};

module.exports = EffectLayerCreator;
