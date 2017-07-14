
var Tilemap = require('./Tilemap');

var TilemapFactory = function (scene, mapData, x, y, tileWidth, tileHeight, mapWidth, mapHeight, tileBorder, texture, frame)
{
    return new Tilemap(scene, mapData, x, y, tileWidth, tileHeight, mapWidth, mapHeight, tileBorder, texture, frame);
};

module.exports = TilemapFactory;
