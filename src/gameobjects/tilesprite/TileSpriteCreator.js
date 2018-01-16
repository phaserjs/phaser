var BuildGameObject = require('../BuildGameObject');
var GameObjectCreator = require('../GameObjectCreator');
var GetAdvancedValue = require('../../utils/object/GetAdvancedValue');
var TileSprite = require('./TileSprite');

//  When registering a factory function 'this' refers to the GameObjectCreator context.

GameObjectCreator.register('tileSprite', function (config)
{
    var x = GetAdvancedValue(config, 'x', 0);
    var y = GetAdvancedValue(config, 'y', 0);
    var width = GetAdvancedValue(config, 'width', 512);
    var height = GetAdvancedValue(config, 'height', 512);
    var key = GetAdvancedValue(config, 'key', '');
    var frame = GetAdvancedValue(config, 'frame', '');

    var tile = new TileSprite(this.scene, x, y, width, height, key, frame);

    BuildGameObject(this.scene, tile, config);

    return tile;
});
