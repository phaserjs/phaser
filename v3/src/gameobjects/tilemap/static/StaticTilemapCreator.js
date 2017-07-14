var StaticTilemap = require('./StaticTilemap');
var GetValue = require('../../../utils/object/GetValue');
var BuildGameObject = require('../../BuildGameObject');

var StaticTilemapCreator = function (scene, config)
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

    var map = new StaticTilemap(scene, mapData, x, y, tileWidth, tileHeight, mapWidth, mapHeight, tileBorder, tileTexture, tileFrame);

    BuildGameObject(scene, map, config);

    return map;
};

module.exports = StaticTilemapCreator;
