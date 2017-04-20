var EffectLayer = require('./EffectLayer');
var GetAdvancedValue = require('../../utils/object/GetAdvancedValue');

var BuildFromConfig = function (state, config)
{
    var x = GetAdvancedValue(config, 'x', 0);
    var y = GetAdvancedValue(config, 'y', 0);
    var width = GetAdvancedValue(config, 'width', 512);
    var height = GetAdvancedValue(config, 'height', 512);
    var key = GetAdvancedValue(config, 'key', null);
    var fragmentShader = GetAdvancedValue(config, 'fragmentShader', '');

    var layer = new EffectLayer(state, x, y, width, height, key, fragmentShader);

    return layer;
};

module.exports = BuildFromConfig;
