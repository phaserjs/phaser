var StaticTilemap = require('./StaticTilemap');

var StaticTilemapFactory = function (scene, mapData, x, y, tileWidth, tileHeight, mapWidth, mapHeight, tileBorder, texture, frame)
{
    return new StaticTilemap(scene, mapData, x, y, tileWidth, tileHeight, mapWidth, mapHeight, tileBorder, texture, frame);
};

module.exports = StaticTilemapFactory;
