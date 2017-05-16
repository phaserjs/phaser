var Mesh = require('./Mesh');
var GetAdvancedValue = require('../../utils/object/GetAdvancedValue');
var GetValue = require('../../utils/object/GetValue');
var BuildGameObject = require('../BuildGameObject');

var BuildFromConfig = function (state, config)
{
    var key = GetAdvancedValue(config, 'key', null);
    var frame = GetAdvancedValue(config, 'frame', null);
    var vertices = GetValue(config, 'vertices', []);
    var uv = GetValue(config, 'uv', []);

    var mesh = new Mesh(state, 0, 0, vertices, uv, key, frame);

    BuildGameObject(state, mesh, config);

    return mesh;
};

module.exports = BuildFromConfig;
