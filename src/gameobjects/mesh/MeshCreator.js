var BuildGameObject = require('../BuildGameObject');
var GameObjectCreator = require('../GameObjectCreator');
var GetAdvancedValue = require('../../utils/object/GetAdvancedValue');
var GetValue = require('../../utils/object/GetValue');
var Mesh = require('./Mesh');

//  When registering a factory function 'this' refers to the GameObjectCreator context.

GameObjectCreator.register('mesh', function (config)
{
    var key = GetAdvancedValue(config, 'key', null);
    var frame = GetAdvancedValue(config, 'frame', null);
    var vertices = GetValue(config, 'vertices', []);
    var indices = GetValue(config, 'indices', []);
    var colors = GetValue(config, 'colors', []);
    var alphas = GetValue(config, 'alphas', []);
    var uv = GetValue(config, 'uv', []);

    var mesh = new Mesh(this.scene, 0, 0, vertices, uv, indices, colors, alphas, key, frame);

    BuildGameObject(this.scene, mesh, config);

    return mesh;
});
