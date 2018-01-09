var BuildGameObject = require('../BuildGameObject');
var GameObjectCreator = require('../../scene/plugins/GameObjectCreator');
var GetAdvancedValue = require('../../utils/object/GetAdvancedValue');
var Quad = require('./Quad');

//  When registering a factory function 'this' refers to the GameObjectCreator context.

GameObjectCreator.register('quad', function (config)
{
    var x = GetAdvancedValue(config, 'x', 0);
    var y = GetAdvancedValue(config, 'y', 0);
    var key = GetAdvancedValue(config, 'key', null);
    var frame = GetAdvancedValue(config, 'frame', null);

    var quad = new Quad(this.scene, x, y, key, frame);

    BuildGameObject(this.scene, quad, config);

    return quad;
});
