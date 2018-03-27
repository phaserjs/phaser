var GetAdvancedValue = require('../../utils/object/GetAdvancedValue');
var GameObjectCreator = require('../GameObjectCreator');
var Container = require('./Container');

GameObjectCreator.register('container', function (config)
{
    var x = GetAdvancedValue(config, 'x', 0.0);
    var y = GetAdvancedValue(config, 'y', 0.0);
    var add = GetAdvancedValue(config, 'add', true);
    var container = new Container(this.scene, x, y);

    if (add)
    {
        this.scene.sys.displayList.add(container);
    }
    
    return container;
});
