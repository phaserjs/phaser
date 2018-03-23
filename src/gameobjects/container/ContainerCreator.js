var GetAdvancedValue = require('../../utils/object/GetAdvancedValue');
var GameObjectCreator = require('../GameObjectCreator');
var Container = require('./Container');

GameObjectCreator.register('container', function (config)
{
    var x = GetAdvancedValue(config, 'x', 0.0);
    var y = GetAdvancedValue(config, 'y', 0.0);
    
    return new Container(this.scene, x, y);
});
