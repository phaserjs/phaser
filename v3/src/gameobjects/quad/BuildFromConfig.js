var Quad = require('./Quad');
var GetAdvancedValue = require('../../utils/object/GetAdvancedValue');
var GetValue = require('../../utils/object/GetValue');
var BuildGameObject = require('../BuildGameObject');

var BuildFromConfig = function (state, config)
{
    var key = GetAdvancedValue(config, 'key', null);
    var frame = GetAdvancedValue(config, 'frame', null);
    var vertices = GetValue(config, 'vertices', []);
    var indices = GetValue(config, 'indices', []);
    var uv = GetValue(config, 'uv', []);

    var quad = new Quad(state, 0, 0, vertices, uv, indices, key, frame);

    BuildGameObject(state, quad, config);

    return quad;
};

module.exports = BuildFromConfig;
