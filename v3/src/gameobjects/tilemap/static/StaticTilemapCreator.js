var BuildGameObject = require('../../BuildGameObject');
var GameObjectCreator = require('../../../scene/plugins/GameObjectCreator');
var GetValue = require('../../../utils/object/GetValue');
var StaticTilemap = require('./StaticTilemap');

//  When registering a factory function 'this' refers to the GameObjectCreator context.

GameObjectCreator.register('staticTilemap', function (config)
{
    var mapData = GetValue(config, 'map.data', null);
    var mapWidth = GetValue(config, 'map.width', 1);
    var mapHeight = GetValue(config, 'map.height', 1);

    var x = GetValue(config, 'x', 0);
    var y = GetValue(config, 'y', 0);

    var tileWidth = GetValue(config, 'tile.width', 16);
    var tileHeight = GetValue(config, 'tile.height', 16);
    var tileTexture = GetValue(config, 'tile.texture', null);
    var tileFrame = GetValue(config, 'tile.frame', null);
    var tileBorder = GetValue(config, 'tile.border', 0);

    var map = new StaticTilemap(this.scene, mapData, x, y, tileWidth, tileHeight, mapWidth, mapHeight, tileBorder, tileTexture, tileFrame);

    BuildGameObject(this.scene, map, config);

    return map;
});
