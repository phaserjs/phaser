var GameObjectCreator = require('../../scene/plugins/GameObjectCreator');
var GetAdvancedValue = require('../../utils/object/GetAdvancedValue');
var Zone = require('./Zone');

//  When registering a factory function 'this' refers to the GameObjectCreator context.

GameObjectCreator.register('zone', function (config)
{
    var x = GetAdvancedValue(config, 'x', 0);
    var y = GetAdvancedValue(config, 'y', 0);
    var width = GetAdvancedValue(config, 'width', 1);
    var height = GetAdvancedValue(config, 'height', width);

    return new Zone(this.scene, x, y, width, height);
});
