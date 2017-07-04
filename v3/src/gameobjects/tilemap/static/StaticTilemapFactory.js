var StaticTilemap = require('./StaticTilemap');

var StaticTilemapFactory = function (state, mapData, x, y, tileWidth, tileHeight, mapWidth, mapHeight, tileBorder, texture, frame)
{
    return new StaticTilemap(state, mapData, x, y, tileWidth, tileHeight, mapWidth, mapHeight, tileBorder, texture, frame);
};

module.exports = StaticTilemapFactory;
