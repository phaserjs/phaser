var Quad = require('./Quad');
var GetAdvancedValue = require('../../utils/object/GetAdvancedValue');
var BuildGameObject = require('../BuildGameObject');

var BuildFromConfig = function (state, config)
{
    var x = GetAdvancedValue(config, 'x', 0);
    var y = GetAdvancedValue(config, 'y', 0);
    var key = GetAdvancedValue(config, 'key', null);
    var frame = GetAdvancedValue(config, 'frame', null);

    var quad = new Quad(state, x, y, key, frame);

    BuildGameObject(state, quad, config);

    return quad;
};

module.exports = BuildFromConfig;
